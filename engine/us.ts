import usSlabs from '../config/slabs/us-ty2025.json';
import { USInput, TaxResult, TaxBreakdownItem, BracketDetail, SavingTip, TaxCredit } from './types';
import { calculateBracketTax } from './utils';

// ── helpers ──────────────────────────────────────────────────────────────────

type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

const ZERO_TAX_STATES = new Set(['TX', 'FL', 'WA']);

function getStandardDeduction(filingStatus: FilingStatus): number {
  return usSlabs.standardDeduction[filingStatus];
}

function getFederalBrackets(filingStatus: FilingStatus) {
  return usSlabs.brackets[filingStatus];
}

function getAdditionalMedicareThreshold(filingStatus: FilingStatus): number {
  return usSlabs.fica.additionalMedicare.threshold[filingStatus];
}

function getLTCGBrackets(filingStatus: FilingStatus) {
  const rates = usSlabs.capitalGainsRates as Record<string, { min: number; max: number | null; rate: number }[]>;
  return rates[filingStatus] ?? rates['single'];
}

/**
 * Calculate tax on long-term capital gains using the "stacking" method:
 * ordinary income fills lower brackets first, then LTCG is taxed on top.
 */
function calcLTCGTax(ltcgAmount: number, ordinaryIncome: number, filingStatus: FilingStatus): number {
  if (ltcgAmount <= 0) return 0;
  const brackets = getLTCGBrackets(filingStatus);
  let tax = 0;
  // Tax on (ordinaryIncome + ltcgAmount) at LTCG rates minus tax on ordinaryIncome alone at LTCG rates
  // = effectively: LTCG stacked on top of ordinary income
  const taxOnTotal = calcBracketStack(ordinaryIncome + ltcgAmount, brackets);
  const taxOnOrdinary = calcBracketStack(ordinaryIncome, brackets);
  tax = taxOnTotal - taxOnOrdinary;
  return Math.max(0, tax);
}

function calcBracketStack(income: number, brackets: { min: number; max: number | null; rate: number }[]): number {
  let total = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const upper = bracket.max === null ? income : Math.min(income, bracket.max);
    total += (upper - bracket.min) * bracket.rate;
  }
  return total;
}

/**
 * Compute the EITC based on number of children and income (AGI).
 * This is a simplified phase-in/phase-out approximation using the table.
 */
function calcEITC(agi: number, earnedIncome: number, children: number): number {
  const income = Math.min(agi, earnedIncome);
  const tableKey = children === 0 ? '0children' : children === 1 ? '1child' : children === 2 ? '2children' : '3plus';
  const row = (usSlabs.eitcTable as Record<string, { maxIncome: number; maxCredit: number }>)[tableKey];
  if (!row || income > row.maxIncome) return 0;
  // Simple approximation: credit phases in up to phase-in threshold, then flat, then phases out
  // Phase-in rate (approx): for 0 children 7.65%, 1 child 34%, 2+ 40%
  const phaseInRates: Record<string, number> = { '0children': 0.0765, '1child': 0.34, '2children': 0.4, '3plus': 0.45 };
  const phaseInRate = phaseInRates[tableKey] ?? 0.4;
  const maxPhaseIn = row.maxCredit / phaseInRate;
  const phaseInCredit = Math.min(income * phaseInRate, row.maxCredit);
  // Phase-out: starts at safe harbor income levels
  const phaseOutStarts: Record<string, number> = { '0children': 9750, '1child': 21550, '2children': 21550, '3plus': 21550 };
  const phaseOutStart = phaseOutStarts[tableKey] ?? 21550;
  const phaseOutRates: Record<string, number> = { '0children': 0.0765, '1child': 0.1598, '2children': 0.2106, '3plus': 0.2106 };
  const phaseOutRate = phaseOutRates[tableKey] ?? 0.21;
  if (income > phaseOutStart) {
    const reduction = (income - phaseOutStart) * phaseOutRate;
    return Math.max(0, row.maxCredit - reduction);
  }
  return phaseInCredit;
}

// ── main export ───────────────────────────────────────────────────────────────

export function calculateUSTax(input: USInput): TaxResult {
  const {
    grossIncome,
    filingStatus,
    state,
    useStandardDeduction,
    itemizedDeductions = 0,
    w2Employee,
    selfEmploymentIncome = 0,
    capitalGains = [],
    qualifiedDividends = 0,
    ordinaryDividends = 0,
    rentalIncome = 0,
    rentalExpenses = 0,
    socialSecurityBenefits = 0,
    iraDistributions = 0,
    pensionIncome = 0,
    otherIncome = 0,
    studentLoanInterest = 0,
    educatorExpenses = 0,
    hsaContribution = 0,
    iraContribution = 0,
    sepContribution = 0,
    selfEmployedHealthInsurance = 0,
    childrenUnder17 = 0,
    dependentCareExpenses = 0,
    educationExpenses = 0,
    retirementContributions = 0,
    isStudent = false,
    hasQBI = false,
    qbiAmount = 0,
    age,
    spouseAge,
    blindTaxpayer = false,
    blindSpouse = false,
  } = input;

  const fs = filingStatus as FilingStatus;
  const isMFJ = fs === 'married_joint';

  // ── Step 1: FICA / SE tax ─────────────────────────────────────────────────

  const ssWageBase       = usSlabs.fica.socialSecurity.wageBase;   // 176,100
  const ssRate           = usSlabs.fica.socialSecurity.rate;        // 0.062
  const medRate          = usSlabs.fica.medicare.rate;              // 0.0145
  const addlMedRate      = usSlabs.fica.additionalMedicare.rate;    // 0.009
  const addlMedThreshold = getAdditionalMedicareThreshold(fs);

  let socialSecurity    = 0;
  let medicare          = 0;
  let additionalMedicare = 0;
  let seDeduction       = 0;  // 50% of SE taxes

  if (w2Employee) {
    const wages        = grossIncome;
    socialSecurity     = ssRate * Math.min(wages, ssWageBase);
    medicare           = medRate * wages;
    additionalMedicare = wages > addlMedThreshold
      ? addlMedRate * (wages - addlMedThreshold)
      : 0;
    seDeduction = 0;
  } else {
    const netSE        = selfEmploymentIncome > 0 ? selfEmploymentIncome : grossIncome;
    socialSecurity     = 2 * ssRate * Math.min(netSE, ssWageBase);
    medicare           = 2 * medRate * netSE;
    const seTaxTotal   = socialSecurity + medicare;
    seDeduction        = seTaxTotal / 2;

    additionalMedicare = netSE > addlMedThreshold
      ? addlMedRate * (netSE - addlMedThreshold)
      : 0;
  }

  const ficaTotal = socialSecurity + medicare + additionalMedicare;

  // ── Step 2: Total income ──────────────────────────────────────────────────

  // Capital gains split
  let shortTermCG = 0;
  let longTermCG  = 0;
  for (const cg of capitalGains) {
    if (cg.type === 'short') shortTermCG += cg.amount;
    else longTermCG += cg.amount;
  }
  // Net CG losses are capped at -$3,000 per year
  const netCG = shortTermCG + longTermCG;
  const cgLossCap = Math.max(netCG, -3000);

  // Rental income: limited to $25k loss if active participation, phases out above $100k MAGI
  const rentalNet = rentalIncome - rentalExpenses;
  let rentalIncomeToInclude = rentalNet;
  if (rentalNet < 0) {
    // Rental loss limited to $25K for active participants; phase-out $100K–$150K MAGI
    const passivelossMax = 25000;
    // We use grossIncome as proxy for MAGI here (simplified)
    const magi = grossIncome;
    if (magi > 150000) {
      rentalIncomeToInclude = 0; // full phase-out
    } else if (magi > 100000) {
      const phaseoutFraction = (magi - 100000) / 50000;
      rentalIncomeToInclude = Math.max(rentalNet, -passivelossMax * (1 - phaseoutFraction));
    } else {
      rentalIncomeToInclude = Math.max(rentalNet, -passivelossMax);
    }
  }

  // Social Security taxability (based on combined/provisional income)
  // Provisional income = AGI + nontaxable interest + 50% SS benefits
  // For simplicity: use grossIncome as proxy before full AGI is known
  const provisionalIncome = grossIncome + 0.5 * socialSecurityBenefits;
  const ssThresholdSingle = fs === 'single' || fs === 'head_of_household' ? 25000 : 32000;
  const ssThresholdHigh   = fs === 'single' || fs === 'head_of_household' ? 34000 : 44000;
  let taxableSS = 0;
  if (provisionalIncome > ssThresholdHigh) {
    taxableSS = 0.85 * socialSecurityBenefits;
  } else if (provisionalIncome > ssThresholdSingle) {
    taxableSS = 0.50 * socialSecurityBenefits;
  }

  // Total gross income (before adjustments)
  const totalGrossIncome = grossIncome
    + shortTermCG            // short-term = ordinary
    + longTermCG             // long-term tracked separately for rate; add for base
    + ordinaryDividends
    + rentalIncomeToInclude
    + taxableSS
    + iraDistributions
    + pensionIncome
    + otherIncome;

  // ── Step 3: Above-the-line deductions → AGI ───────────────────────────────

  // SE health insurance: limited to SE net income
  const seIncome = selfEmploymentIncome > 0 ? selfEmploymentIncome : (w2Employee ? 0 : grossIncome);
  const seHealthDeduction = Math.min(selfEmployedHealthInsurance, seIncome);

  // Student loan interest: max $2,500; phases out $85K–$100K single / $170K–$200K MFJ
  const sliMax = 2500;
  const sliPhaseStart = isMFJ ? 170000 : 85000;
  const sliPhaseEnd   = isMFJ ? 200000 : 100000;
  let sliDeduction = Math.min(studentLoanInterest, sliMax);
  if (grossIncome > sliPhaseEnd) {
    sliDeduction = 0;
  } else if (grossIncome > sliPhaseStart) {
    const fraction = (grossIncome - sliPhaseStart) / (sliPhaseEnd - sliPhaseStart);
    sliDeduction = sliDeduction * (1 - fraction);
  }

  // Educator expenses: max $300
  const educatorDeduction = Math.min(educatorExpenses, 300);

  // HSA: max $4,300 single / $8,550 family (MFJ)
  const hsaMax = isMFJ ? 8550 : 4300;
  const hsaDeduction = Math.min(hsaContribution, hsaMax);

  // IRA deduction: max $7,000 (or $8,000 if age >= 50); phase-out if covered by plan and MAGI > thresholds
  const iraMax = (age !== undefined && age >= 50) ? 8000 : 7000;
  let iraDeduction = Math.min(iraContribution, iraMax);
  // Simplified: assume covered by employer plan if w2Employee
  if (w2Employee) {
    const iraPhaseStart = isMFJ ? 126500 : 79000;
    const iraPhaseEnd   = isMFJ ? 146500 : 89000;
    if (grossIncome >= iraPhaseEnd) {
      iraDeduction = 0;
    } else if (grossIncome > iraPhaseStart) {
      const fraction = (grossIncome - iraPhaseStart) / (iraPhaseEnd - iraPhaseStart);
      iraDeduction = Math.round(iraDeduction * (1 - fraction) / 10) * 10; // round to nearest $10
    }
  }

  // SEP contribution: max 25% of SE income or $69,000
  const sepMax = Math.min(seIncome * 0.25, 69000);
  const sepDeduction = Math.min(sepContribution, sepMax);

  const aboveLineDeductions =
    seDeduction +
    seHealthDeduction +
    sliDeduction +
    educatorDeduction +
    hsaDeduction +
    iraDeduction +
    sepDeduction;

  const agi = Math.max(0, totalGrossIncome - aboveLineDeductions);

  // ── Step 4: Standard or itemized deduction + age/blind add-ons ───────────

  let standardDed = getStandardDeduction(fs);
  // Age/blind add-ons
  const addOnPerPerson = isMFJ ? usSlabs.standardDeductionAddOn.age65orBlindMFJ : usSlabs.standardDeductionAddOn.age65orBlind;
  let addOns = 0;
  if (age !== undefined && age >= 65) addOns += addOnPerPerson;
  if (blindTaxpayer) addOns += addOnPerPerson;
  if (isMFJ) {
    if (spouseAge !== undefined && spouseAge >= 65) addOns += addOnPerPerson;
    if (blindSpouse) addOns += addOnPerPerson;
  }
  standardDed += addOns;

  const deduction = useStandardDeduction
    ? standardDed
    : Math.max(itemizedDeductions, standardDed); // always pick whichever is greater or user selected

  // ── Step 5: Taxable income ────────────────────────────────────────────────

  // For federal brackets, long-term CG and qualified dividends are taxed separately.
  // Ordinary taxable income = (AGI - deduction) - LTCG - qualified dividends
  // (but floored at 0 each step)
  const agiAfterDeduction = Math.max(0, agi - deduction);

  // LTCG and qualified dividends for preferential rate
  const preferentialIncome = Math.max(0, longTermCG) + qualifiedDividends;
  const ordinaryTaxableIncome = Math.max(0, agiAfterDeduction - preferentialIncome);
  const totalTaxableIncome = agiAfterDeduction; // used for AMT etc.

  // QBI deduction: 20% of lesser of (QBI or taxable income minus capital gains)
  // Phase-in above $197,300 single / $394,600 MFJ; simplified here
  let qbiDeduction = 0;
  if (hasQBI || (qbiAmount > 0)) {
    const qbi = qbiAmount > 0 ? qbiAmount : seIncome;
    const qbiThreshold = isMFJ ? 394600 : 197300;
    if (agi <= qbiThreshold) {
      qbiDeduction = 0.20 * Math.min(qbi, agiAfterDeduction - preferentialIncome);
    } else {
      // Simplified: phase-out over $50K single / $100K MFJ range
      const qbiPhaseEnd = qbiThreshold + (isMFJ ? 100000 : 50000);
      if (agi < qbiPhaseEnd) {
        const fraction = (agi - qbiThreshold) / (qbiPhaseEnd - qbiThreshold);
        qbiDeduction = 0.20 * Math.min(qbi, agiAfterDeduction - preferentialIncome) * (1 - fraction);
      }
    }
    qbiDeduction = Math.max(0, qbiDeduction);
  }

  const taxableIncomeOrdinary = Math.max(0, ordinaryTaxableIncome - qbiDeduction);
  const taxableIncomeTotal    = Math.max(0, agiAfterDeduction - qbiDeduction);

  // ── Step 6: Federal income tax ────────────────────────────────────────────

  // (a) Ordinary income tax (brackets)
  const federalBrackets = getFederalBrackets(fs);
  const {
    totalTax: ordinaryFederalTax,
    details: bracketDetails,
    marginalRate,
  } = calculateBracketTax(taxableIncomeOrdinary, federalBrackets);

  // (b) Long-term CG + qualified dividends tax (stacking: ordinary fills lower brackets first)
  const ltcgTax = calcLTCGTax(preferentialIncome, taxableIncomeOrdinary, fs);

  // (c) Total regular federal income tax
  const federalTax = ordinaryFederalTax + ltcgTax;

  // ── Step 7: NIIT ─────────────────────────────────────────────────────────

  const niitRate      = usSlabs.niit.rate;  // 0.038
  const niitThreshold = (usSlabs.niit.threshold as Record<string, number>)[fs] ?? 200000;
  const investmentIncome = Math.max(0, longTermCG) + qualifiedDividends + Math.max(0, rentalIncomeToInclude) + ordinaryDividends;
  const niitBase = Math.min(investmentIncome, Math.max(0, agi - niitThreshold));
  const niit = niitBase > 0 ? niitBase * niitRate : 0;

  // ── Step 8: AMT ──────────────────────────────────────────────────────────

  const amtConfig = usSlabs.amt;
  const amtExemptionFull  = (amtConfig.exemption as Record<string, number>)[fs] ?? amtConfig.exemption.single;
  const amtPhaseoutStart  = (amtConfig.phaseoutStart as Record<string, number>)[fs] ?? amtConfig.phaseoutStart.single;
  // AMT income: conservative estimate = taxable income (no major addbacks in simplified model)
  const amtIncome = taxableIncomeTotal;
  // Exemption phase-out: $0.25 per dollar above phase-out start
  const amtExemptionReduction = Math.max(0, (amtIncome - amtPhaseoutStart) * 0.25);
  const amtExemption = Math.max(0, amtExemptionFull - amtExemptionReduction);
  const amtBase = Math.max(0, amtIncome - amtExemption);
  // AMT tax: 26% up to $232,600, 28% above
  const amtTaxLow  = Math.min(amtBase, amtConfig.rate1Threshold) * amtConfig.rate1;
  const amtTaxHigh = Math.max(0, amtBase - amtConfig.rate1Threshold) * amtConfig.rate2;
  const amtTax     = amtTaxLow + amtTaxHigh;
  const amtLiability = Math.max(0, amtTax - federalTax);

  // ── Step 9: Credits ──────────────────────────────────────────────────────

  const appliedCredits: TaxCredit[] = [];
  let totalCredits = 0;

  // --- Child Tax Credit ---
  if (childrenUnder17 > 0) {
    const ctcPhaseStart = isMFJ ? 400000 : 200000;
    let ctcAmount = childrenUnder17 * 2000;
    if (agi > ctcPhaseStart) {
      const reduction = Math.ceil((agi - ctcPhaseStart) / 1000) * 50;
      ctcAmount = Math.max(0, ctcAmount - reduction);
    }
    if (ctcAmount > 0) {
      appliedCredits.push({ name: 'Child Tax Credit', amount: ctcAmount, refundable: false });
      totalCredits += ctcAmount;
    }
    // Additional CTC (refundable portion): 15% of earned income above $2,500, up to $1,700/child
    const earnedForACTC = w2Employee ? grossIncome : seIncome;
    const actcRefundable = Math.min(
      childrenUnder17 * 1700,
      Math.max(0, (earnedForACTC - 2500) * 0.15),
    );
    if (actcRefundable > 0) {
      appliedCredits.push({ name: 'Additional Child Tax Credit', amount: actcRefundable, refundable: true });
      totalCredits += actcRefundable;
    }
  }

  // --- Dependent Care Credit ---
  if (dependentCareExpenses > 0) {
    const dependentsForCare = Math.max(1, (input.dependents ?? 1));
    const maxExpenses = dependentsForCare >= 2 ? 6000 : 3000;
    const eligibleExpenses = Math.min(dependentCareExpenses, maxExpenses);
    // Rate: 35% at AGI $15k, 20% at AGI $43k+; drops by 1% per $2k of AGI
    let dcRate = 0.35;
    if (agi > 43000) {
      dcRate = 0.20;
    } else if (agi > 15000) {
      dcRate = 0.35 - Math.floor((agi - 15000) / 2000) * 0.01;
    }
    const dcCredit = eligibleExpenses * Math.max(0.20, dcRate);
    if (dcCredit > 0) {
      appliedCredits.push({ name: 'Dependent Care Credit', amount: dcCredit, refundable: false });
      totalCredits += dcCredit;
    }
  }

  // --- EITC ---
  const earnedIncomeForEITC = w2Employee ? grossIncome : seIncome;
  const childrenForEITC = childrenUnder17 + (input.dependents ?? 0);
  const eitcAmount = calcEITC(agi, earnedIncomeForEITC, childrenForEITC);
  if (eitcAmount > 0) {
    appliedCredits.push({ name: 'Earned Income Tax Credit', amount: eitcAmount, refundable: true });
    totalCredits += eitcAmount;
  }

  // --- Saver's Credit ---
  if (retirementContributions > 0) {
    const saverBase = Math.min(retirementContributions, 2000);
    let saverRate = 0;
    if (fs === 'single' || fs === 'married_separate') {
      if (agi < 23000) saverRate = 0.50;
      else if (agi < 25000) saverRate = 0.20;
      else if (agi < 38250) saverRate = 0.10;
    } else if (isMFJ) {
      if (agi < 46000) saverRate = 0.50;
      else if (agi < 50000) saverRate = 0.20;
      else if (agi < 76500) saverRate = 0.10;
    } else {
      // head_of_household
      if (agi < 34500) saverRate = 0.50;
      else if (agi < 37500) saverRate = 0.20;
      else if (agi < 57375) saverRate = 0.10;
    }
    const saverCredit = saverBase * saverRate;
    if (saverCredit > 0) {
      appliedCredits.push({ name: "Saver's Credit", amount: saverCredit, refundable: false });
      totalCredits += saverCredit;
    }
  }

  // --- Education Credits ---
  if (educationExpenses > 0) {
    if (isStudent) {
      // AOTC: 100% of first $2K + 25% of next $2K = max $2,500
      const aotcAmount = Math.min(educationExpenses, 2000) + Math.min(Math.max(0, educationExpenses - 2000), 2000) * 0.25;
      const aotcCapped = Math.min(aotcAmount, 2500);
      if (aotcCapped > 0) {
        appliedCredits.push({ name: 'American Opportunity Tax Credit', amount: aotcCapped, refundable: true });
        totalCredits += aotcCapped;
      }
    } else {
      // Lifetime Learning Credit: 20% of up to $10K
      const llcAmount = Math.min(educationExpenses, 10000) * 0.20;
      if (llcAmount > 0) {
        appliedCredits.push({ name: 'Lifetime Learning Credit', amount: llcAmount, refundable: false });
        totalCredits += llcAmount;
      }
    }
  }

  // ── Step 10: State income tax ─────────────────────────────────────────────

  let stateTax = 0;
  let stateNameStr: string | undefined;
  let stateEffectiveRate: number | undefined;
  const stateKey = (state ?? '').toUpperCase();

  if (stateKey && !ZERO_TAX_STATES.has(stateKey)) {
    const stateConfig = (usSlabs.states as Record<string, { name?: string; type: string; rate?: number; brackets: { min: number; max: number | null; rate: number }[] }>)[stateKey];
    if (stateConfig) {
      stateNameStr = stateConfig.name ?? stateKey;
      if (stateConfig.type === 'flat' && stateConfig.rate !== undefined) {
        stateTax = taxableIncomeTotal * stateConfig.rate;
        stateEffectiveRate = stateConfig.rate;
      } else if (stateConfig.type === 'progressive' && stateConfig.brackets.length > 0) {
        const { totalTax: sStateTax } = calculateBracketTax(taxableIncomeTotal, stateConfig.brackets);
        stateTax = sStateTax;
        stateEffectiveRate = taxableIncomeTotal > 0 ? sStateTax / taxableIncomeTotal : 0;
      }
    }
  }

  // ── Step 11: Totals ───────────────────────────────────────────────────────

  // Credits reduce federal income tax (non-refundable capped at federal tax, refundable can exceed)
  const refundableCredits    = appliedCredits.filter(c => c.refundable).reduce((s, c) => s + c.amount, 0);
  const nonRefundableCredits = appliedCredits.filter(c => !c.refundable).reduce((s, c) => s + c.amount, 0);
  const cappedNonRefundable  = Math.min(nonRefundableCredits, federalTax + amtLiability);
  const creditsApplied       = cappedNonRefundable + refundableCredits;

  const federalAfterCredits = Math.max(0, federalTax + amtLiability - cappedNonRefundable) - refundableCredits;
  const totalTax = federalAfterCredits + ficaTotal + niit + stateTax;
  const netIncome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  // ── Step 12: Breakdown ────────────────────────────────────────────────────

  const breakdown: TaxBreakdownItem[] = [
    {
      label: 'Federal Income Tax',
      amount: Math.max(0, federalTax - cappedNonRefundable),
      rate: marginalRate,
      color: '#ef4444',
    },
    {
      label: 'Social Security',
      amount: socialSecurity,
      rate: w2Employee ? ssRate : ssRate * 2,
      color: '#f97316',
    },
    {
      label: 'Medicare',
      amount: medicare,
      rate: w2Employee ? medRate : medRate * 2,
      color: '#eab308',
    },
  ];

  if (additionalMedicare > 0) {
    breakdown.push({
      label: 'Additional Medicare',
      amount: additionalMedicare,
      rate: addlMedRate,
      color: '#84cc16',
    });
  }

  if (niit > 0) {
    breakdown.push({ label: 'Net Investment Income Tax (NIIT)', amount: niit, rate: niitRate, color: '#22c55e' });
  }

  if (amtLiability > 0) {
    breakdown.push({ label: 'Alternative Minimum Tax (AMT)', amount: amtLiability, color: '#a855f7' });
  }

  if (stateTax > 0) {
    breakdown.push({
      label: 'State Income Tax',
      amount: stateTax,
      color: '#6366f1',
    });
  }

  if (refundableCredits > 0) {
    breakdown.push({ label: 'Refundable Credits', amount: -refundableCredits, color: '#14b8a6' });
  }

  // ── Step 13: Tips ─────────────────────────────────────────────────────────

  const tips: SavingTip[] = buildTips(input, taxableIncomeTotal, marginalRate);

  // Compute retirement above-line deductions for AGI waterfall
  const retirementDeductionTotal = iraDeduction + sepDeduction;

  return {
    country: 'US',
    grossIncome,
    totalTax,
    effectiveRate,
    marginalRate,
    netIncome,
    monthlyTakeHome: netIncome / 12,
    breakdown,
    bracketDetails: bracketDetails as BracketDetail[],
    tips,
    currency: 'USD',
    // US-specific fields
    agi,
    taxableIncome: taxableIncomeTotal,
    amtLiability: amtLiability > 0 ? amtLiability : undefined,
    credits: appliedCredits.length > 0 ? appliedCredits : undefined,
    // AGI waterfall
    seDeduction: seDeduction > 0 ? seDeduction : undefined,
    retirementDeduction: retirementDeductionTotal > 0 ? retirementDeductionTotal : undefined,
    studentLoanDeduction: sliDeduction > 0 ? sliDeduction : undefined,
    deductionUsed: deduction,
    qbiDeduction: qbiDeduction > 0 ? qbiDeduction : undefined,
    // State
    stateTax: stateTax > 0 ? stateTax : undefined,
    stateName: stateNameStr,
    stateRate: stateEffectiveRate,
    stateTaxableIncome: taxableIncomeTotal,
  };
}

// ── tips ──────────────────────────────────────────────────────────────────────

function buildTips(input: USInput, taxableIncome: number, marginalRate: number): SavingTip[] {
  const tips: SavingTip[] = [];

  if (marginalRate >= 0.22) {
    tips.push({
      id: 'us-401k',
      title: 'Maximise your 401(k)',
      description:
        `Contributing the full $23,500 (2025) to a traditional 401(k) defers income taxed at your ` +
        `${(marginalRate * 100).toFixed(0)}% marginal rate, reducing your federal bill immediately.`,
      potentialSaving: Math.round(23500 * marginalRate),
      country: 'US',
    });
  }

  if (input.filingStatus === 'single' && taxableIncome > 0) {
    tips.push({
      id: 'us-ira',
      title: 'Open a Roth or Traditional IRA',
      description:
        'A Roth IRA grows tax-free; a Traditional IRA gives you an up-front deduction of up to $7,000 if you qualify.',
      potentialSaving: Math.round(7000 * marginalRate),
      country: 'US',
    });
  }

  if (!input.w2Employee) {
    tips.push({
      id: 'us-sep-ira',
      title: 'Self-employed? Consider a SEP-IRA',
      description:
        'A SEP-IRA lets self-employed individuals contribute up to 25% of net self-employment income, capped at $70,000 for 2025.',
      potentialSaving: Math.round(Math.min((input.selfEmploymentIncome ?? input.grossIncome) * 0.25, 70000) * marginalRate),
      country: 'US',
    });
  }

  if (input.grossIncome > 150000) {
    tips.push({
      id: 'us-hsa',
      title: 'Contribute to an HSA',
      description:
        'If you have a High-Deductible Health Plan, an HSA gives you a triple tax advantage: deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.',
      potentialSaving: Math.round(4300 * marginalRate),
      country: 'US',
    });
  }

  return tips;
}
