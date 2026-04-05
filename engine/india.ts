import indiaSlabs from '../config/slabs/india-fy2025-26.json';
import {
  IndiaInput,
  HouseProperty,
  CapitalGainEntry,
  TaxResult,
  TaxBreakdownItem,
  BracketDetail,
  TaxBracket,
  SavingTip,
  AdvanceTaxInstalment,
} from './types';
import { calculateBracketTax } from './utils';

// ─── Internal helpers ────────────────────────────────────────────────────────

function clampDeduction(value: number | undefined, max: number): number {
  if (value === undefined || value <= 0) return 0;
  return Math.min(value, max);
}

function positiveOrZero(n: number): number {
  return Math.max(0, n);
}

function nvl(n: number | undefined): number {
  return n ?? 0;
}

// ─── CII Table lookup ────────────────────────────────────────────────────────

const CII_TABLE: Record<number, number> = {
  2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117, 2006: 122,
  2007: 129, 2008: 137, 2009: 148, 2010: 167, 2011: 184, 2012: 200,
  2013: 220, 2014: 240, 2015: 254, 2016: 264, 2017: 272, 2018: 280,
  2019: 289, 2020: 301, 2021: 317, 2022: 331, 2023: 348, 2024: 363,
  2025: 376,
};

function getCII(fiscalYear: number): number {
  // fiscalYear = year in which FY starts, e.g. 2024 for FY 2024-25
  return CII_TABLE[fiscalYear] ?? 100;
}

// ─── HRA Exemption ───────────────────────────────────────────────────────────

function calcHRAExemption(input: IndiaInput): number {
  const { hra = 0, rentPaid = 0, basicSalary = 0, da = 0, metroCity = false } = input;

  if (hra <= 0 || rentPaid <= 0 || basicSalary <= 0) return 0;

  // Basic + DA is the base for HRA calculation
  const basicPlusDa = basicSalary + da;
  const actualHRA = positiveOrZero(hra);
  const rentMinusTenPercent = positiveOrZero(rentPaid - 0.1 * basicPlusDa);
  const metroFraction = metroCity ? 0.5 : 0.4;
  const metroComponent = metroFraction * basicPlusDa;

  return Math.min(actualHRA, rentMinusTenPercent, metroComponent);
}

// ─── Salary Income Computation ───────────────────────────────────────────────

interface SalaryResult {
  grossSalary: number;
  hraExemption: number;
  standardDeduction: number;
  professionalTax: number;
  netSalaryIncome: number;
}

function computeSalaryIncome(input: IndiaInput, regime: 'old' | 'new', stdDeduction: number): SalaryResult {
  // Determine gross salary
  let grossSalary: number;
  if (nvl(input.grossSalary) > 0) {
    grossSalary = nvl(input.grossSalary);
  } else if (nvl(input.grossIncome) > 0 && !hasSalaryBreakup(input)) {
    // Legacy: grossIncome used directly as salary
    grossSalary = nvl(input.grossIncome);
  } else {
    grossSalary =
      nvl(input.basicSalary) +
      nvl(input.da) +
      nvl(input.hra) +
      nvl(input.specialAllowance) +
      nvl(input.lta) +
      nvl(input.otherAllowances) +
      nvl(input.bonus);
  }

  // HRA exemption only in old regime
  const hraExemption = regime === 'old' ? calcHRAExemption(input) : 0;

  // Professional tax is deductible in both regimes (Section 16(iii))
  const professionalTax = Math.min(nvl(input.professionalTax), 2500);

  // Standard deduction
  const netSalaryIncome = positiveOrZero(
    grossSalary - stdDeduction - hraExemption - professionalTax
  );

  return { grossSalary, hraExemption, standardDeduction: stdDeduction, professionalTax, netSalaryIncome };
}

function hasSalaryBreakup(input: IndiaInput): boolean {
  // HRA alone is not sufficient — we need at least basicSalary or specialAllowance or bonus
  // to determine that a proper salary breakup is being provided
  return (
    nvl(input.basicSalary) > 0 ||
    nvl(input.da) > 0 ||
    nvl(input.specialAllowance) > 0 ||
    nvl(input.bonus) > 0
  );
}

// ─── House Property Income ───────────────────────────────────────────────────

interface HousePropertyResult {
  totalHousePropertyIncome: number; // can be negative (loss)
  cappedLoss: number;               // loss capped at ₹2L for set-off
}

function computeHousePropertyIncome(input: IndiaInput, regime: 'old' | 'new'): HousePropertyResult {
  let totalHPIncome = 0;

  const properties: HouseProperty[] = input.properties ?? [];

  // Handle legacy single homeLoanInterest field as a self-occupied property
  if (properties.length === 0 && nvl(input.homeLoanInterest) > 0) {
    properties.push({
      type: 'self_occupied',
      homeLoanInterest: input.homeLoanInterest,
    });
  }

  for (const prop of properties) {
    if (prop.type === 'self_occupied') {
      // Self-occupied: Annual Value = Nil; loss = interest up to ₹2L
      // Pre-construction interest: 1/5 per year for 5 years
      const preConstAnnual = nvl(prop.preConstructionInterest) / 5;
      const totalInterest = nvl(prop.homeLoanInterest) + preConstAnnual;

      // For self-occupied, loss capped at ₹2L (will be applied globally below)
      const loss = -Math.min(totalInterest, 200000);
      totalHPIncome += loss;
    } else {
      // Let-out property
      const annualRent = nvl(prop.annualRentReceived);
      const municipalTax = nvl(prop.municipalTaxPaid);

      // Gross Annual Value = annual rent (assume fair rent ≤ rent received for simplicity)
      const gav = annualRent;
      // Net Annual Value = GAV - municipal taxes paid
      const nav = positiveOrZero(gav - municipalTax);
      // Standard deduction: 30% of NAV
      const stdDedHP = nav * 0.30;
      // Pre-construction interest
      const preConstAnnual = nvl(prop.preConstructionInterest) / 5;
      const totalInterest = nvl(prop.homeLoanInterest) + preConstAnnual;
      // No cap on interest for let-out property
      const hpIncome = nav - stdDedHP - totalInterest;
      totalHPIncome += hpIncome;
    }
  }

  // Under Section 71, maximum house property loss that can be set off against
  // other heads of income is ₹2,00,000. Any excess is carried forward.
  let cappedLoss = 0;
  if (totalHPIncome < 0) {
    cappedLoss = Math.min(Math.abs(totalHPIncome), 200000);
    // In new regime, no loss set-off from house property
    if (regime === 'new') cappedLoss = 0;
    return { totalHousePropertyIncome: -cappedLoss, cappedLoss };
  }

  return { totalHousePropertyIncome: totalHPIncome, cappedLoss: 0 };
}

// ─── Business Income ─────────────────────────────────────────────────────────

function computeBusinessIncome(input: IndiaInput): number {
  const bType = input.businessType ?? 'none';

  if (bType === '44AD') {
    const turnover = Math.min(nvl(input.turnover44AD), 20000000); // cap ₹2Cr
    const rate = input.digitalReceipts44AD ? 0.06 : 0.08;
    return turnover * rate;
  }

  if (bType === '44ADA') {
    const receipts = Math.min(nvl(input.grossReceipts44ADA), 7500000); // cap ₹75L
    return receipts * 0.50;
  }

  if (bType === 'regular') {
    return nvl(input.businessProfit);
  }

  return 0;
}

// ─── Capital Gains ───────────────────────────────────────────────────────────

interface CGResult {
  slabIncome: number;         // CG added to normal taxable income (debt, at-slab CG)
  equitySTCGAmount: number;   // taxed at 20% flat
  equityLTCGAmount: number;   // taxed at 12.5% above ₹1.25L
  propertyLTCGAmount: number; // taxed at 20% with indexation
  propertyLTCGNoIdx: number;  // taxed at 12.5% without indexation
  lotteryAmount: number;      // taxed at 30%
}

function computeCapitalGains(input: IndiaInput): CGResult {
  const result: CGResult = {
    slabIncome: 0,
    equitySTCGAmount: 0,
    equityLTCGAmount: 0,
    propertyLTCGAmount: 0,
    propertyLTCGNoIdx: 0,
    lotteryAmount: 0,
  };

  // Lottery winnings
  result.lotteryAmount = positiveOrZero(nvl(input.lotteryWinnings));

  if (!input.capitalGains || input.capitalGains.length === 0) return result;

  const currentCII = CII_TABLE[2025] ?? 376; // FY 2025-26

  for (const entry of input.capitalGains) {
    let gainAmount = entry.amount;

    // Compute gain from raw values if provided
    if (
      entry.saleValue !== undefined &&
      entry.costOfAcquisition !== undefined &&
      entry.assetType === 'property' &&
      entry.gainType === 'long' &&
      entry.yearOfAcquisition !== undefined
    ) {
      // Section 50C: if saleValue < stampDutyValue, use stampDutyValue as effective consideration
      let effectiveSaleValue = entry.saleValue;
      if (entry.stampDutyValue !== undefined && entry.saleValue < entry.stampDutyValue) {
        effectiveSaleValue = entry.stampDutyValue;
        // note: Section 50C deemed consideration applied
      }
      const purchaseCII = getCII(entry.yearOfAcquisition);
      const indexedCost = entry.costOfAcquisition * (currentCII / purchaseCII);
      gainAmount = positiveOrZero(effectiveSaleValue - indexedCost);
    } else if (
      entry.saleValue !== undefined &&
      entry.assetType === 'property' &&
      entry.stampDutyValue !== undefined &&
      entry.saleValue < entry.stampDutyValue
    ) {
      // Section 50C for short-term or no-indexation cases
      const effectiveSaleValue = entry.stampDutyValue;
      if (entry.costOfAcquisition !== undefined) {
        gainAmount = positiveOrZero(effectiveSaleValue - entry.costOfAcquisition);
      } else {
        gainAmount = positiveOrZero(effectiveSaleValue - (entry.amount ?? 0));
      }
    }

    gainAmount = positiveOrZero(gainAmount);

    switch (entry.assetType) {
      case 'equity_mf': {
        if (entry.gainType === 'short') {
          result.equitySTCGAmount += gainAmount;
        } else {
          result.equityLTCGAmount += gainAmount;
        }
        break;
      }
      case 'debt_mf': {
        // Post-April 2023: debt MF gains taxed at slab rate regardless of holding
        result.slabIncome += gainAmount;
        break;
      }
      case 'property': {
        if (entry.gainType === 'short') {
          result.slabIncome += gainAmount;
        } else {
          // Taxpayer can choose indexation (20%) or no indexation (12.5%)
          // Default: use indexed cost if yearOfAcquisition provided, else no-indexation
          if (entry.yearOfAcquisition !== undefined && entry.costOfAcquisition !== undefined) {
            result.propertyLTCGAmount += gainAmount;
          } else {
            result.propertyLTCGNoIdx += gainAmount;
          }
        }
        break;
      }
      case 'gold':
      case 'other': {
        if (entry.gainType === 'short') {
          result.slabIncome += gainAmount;
        } else {
          // LTCG on gold/other: 12.5% without indexation (post-Budget 2024)
          result.propertyLTCGNoIdx += gainAmount;
        }
        break;
      }
    }
  }

  return result;
}

// ─── Other Sources Income ────────────────────────────────────────────────────

function computeOtherSourcesIncome(input: IndiaInput): number {
  let income =
    positiveOrZero(nvl(input.savingsInterest)) +
    positiveOrZero(nvl(input.fdInterest)) +
    positiveOrZero(nvl(input.dividendIncome)) +
    positiveOrZero(nvl(input.otherIncome));

  // Section 56(2)(x) — gift from non-relative taxable if > ₹50,000
  let giftTaxable = 0;
  if (input.giftReceived && !input.giftFromRelative) {
    giftTaxable = input.giftReceived > 50000 ? input.giftReceived : 0;
  }
  income += giftTaxable;

  // Clubbing of minor child income — ₹1,500 per child exempt
  // (using fixed ₹1,500 exemption per the rule; we treat minorChildIncome as total across all children,
  //  and deduct ₹1,500 for 1 child as a conservative default)
  const clubbingExemptPerChild = 1500;
  const clubbedIncome = Math.max(0, (input.minorChildIncome ?? 0) - clubbingExemptPerChild);
  income += clubbedIncome;

  return income;
}

// ─── Chapter VI-A Deductions ─────────────────────────────────────────────────

interface DeductionResult {
  total: number;
  breakdown: Record<string, number>;
}

function computeDeductions(input: IndiaInput, gti: number): DeductionResult {
  const breakdown: Record<string, number> = {};
  let total = 0;

  const age = input.age ?? 'below60';
  const isSenior = age === '60to80' || age === 'above80';

  // 80C + 80CCC + 80CCD(1) — combined cap ₹1,50,000
  const raw80C = nvl(input.section80C) + nvl(input.section80CCC) + nvl(input.section80CCD1);
  const ded80C = clampDeduction(raw80C, 150000);
  breakdown['80C'] = ded80C;
  total += ded80C;

  // 80CCD(1B) — additional NPS, max ₹50,000
  // Handle legacy nps80CCD field
  const npsExtra = nvl(input.section80CCD1B) || nvl(input.nps80CCD);
  const ded80CCD1B = clampDeduction(npsExtra, 50000);
  breakdown['80CCD1B'] = ded80CCD1B;
  total += ded80CCD1B;

  // 80D — health insurance
  const max80DSelf = isSenior ? 50000 : 25000;
  // Check both new split fields and legacy section80D
  const raw80DSelf = nvl(input.section80D_self) || nvl(input.section80D);
  const ded80DSelf = clampDeduction(raw80DSelf, max80DSelf);
  breakdown['80D_self'] = ded80DSelf;
  total += ded80DSelf;

  // 80D parents — check if parents are senior (heuristic: assume not unless using split fields)
  const max80DParents = 50000; // conservative — use 50K in case parents are senior
  const ded80DParents = clampDeduction(nvl(input.section80D_parents), max80DParents);
  breakdown['80D_parents'] = ded80DParents;
  total += ded80DParents;

  // 80DD — dependent disability
  const ded80DD = nvl(input.section80DD) > 0
    ? (input.section80DD_severe ? 125000 : 75000)
    : 0;
  breakdown['80DD'] = ded80DD;
  total += ded80DD;

  // 80DDB — medical treatment of specified disease
  const max80DDB = isSenior ? 100000 : 40000;
  const ded80DDB = clampDeduction(nvl(input.section80DDB), max80DDB);
  breakdown['80DDB'] = ded80DDB;
  total += ded80DDB;

  // 80E — education loan interest (no cap, 8 years)
  const ded80E = positiveOrZero(nvl(input.section80E));
  breakdown['80E'] = ded80E;
  total += ded80E;

  // 80EEA — affordable housing (max ₹1,50,000)
  const ded80EEA = clampDeduction(nvl(input.section80EEA), 150000);
  breakdown['80EEA'] = ded80EEA;
  total += ded80EEA;

  // 80G — donations 50% with limit
  const ded80G = positiveOrZero(nvl(input.section80G) * 0.5);
  breakdown['80G'] = ded80G;
  total += ded80G;

  // 80G unlimited — 100% donations
  const ded80GUnlimited = positiveOrZero(nvl(input.section80G_unlimited));
  breakdown['80G_unlimited'] = ded80GUnlimited;
  total += ded80GUnlimited;

  // 80GG — rent without HRA (max ₹60,000/year = ₹5,000/month)
  // Eligible = min(rent_paid - 10%GTI, 5000/month, 25%GTI)
  if (nvl(input.section80GG) > 0) {
    const ggCap1 = 60000;
    const ggCap2 = gti * 0.25;
    const ded80GG = Math.min(nvl(input.section80GG), ggCap1, ggCap2);
    breakdown['80GG'] = ded80GG;
    total += ded80GG;
  }

  // 80TTA — savings bank interest (max ₹10,000; only for below60 and 60to80)
  // 80TTB supersedes 80TTA for senior citizens
  if (!isSenior) {
    const ded80TTA = clampDeduction(nvl(input.section80TTA) || nvl(input.savingsInterest), 10000);
    breakdown['80TTA'] = ded80TTA;
    total += ded80TTA;
  } else {
    // 80TTB — senior citizen interest on deposits (FD + savings), max ₹50,000
    const raw80TTB = nvl(input.section80TTB) || (nvl(input.savingsInterest) + nvl(input.fdInterest));
    const ded80TTB = clampDeduction(raw80TTB, 50000);
    breakdown['80TTB'] = ded80TTB;
    total += ded80TTB;
  }

  // 80U — self disability (fixed deduction)
  if (input.section80U) {
    const ded80U = input.section80U_severe ? 125000 : 75000;
    breakdown['80U'] = ded80U;
    total += ded80U;
  }

  // Legacy otherDeductions
  const otherDed = positiveOrZero(nvl(input.otherDeductions));
  breakdown['other'] = otherDed;
  total += otherDed;

  // Deductions cannot exceed GTI
  total = Math.min(total, gti);

  return { total, breakdown };
}

// ─── Surcharge ───────────────────────────────────────────────────────────────

interface SurchargeSlot {
  min: number;
  max: number | null;
  rate: number;
}

function getSurchargeRate(grossIncome: number, surchargeSlabs: SurchargeSlot[]): number {
  for (const slab of surchargeSlabs) {
    const upper = slab.max === null ? Infinity : slab.max;
    if (grossIncome > slab.min && grossIncome <= upper) return slab.rate;
    if (slab.max === null && grossIncome > slab.min) return slab.rate;
  }
  return 0;
}

function applyMarginalRelief(
  grossIncome: number,
  incomeTax: number,
  surcharge: number,
  surchargeSlabs: SurchargeSlot[],
  brackets: TaxBracket[]
): number {
  const thresholds = surchargeSlabs.map((s) => s.min);
  let cappedSurcharge = surcharge;

  for (const threshold of thresholds) {
    if (grossIncome <= threshold) continue;

    const { totalTax: taxAtThreshold } = calculateBracketTax(threshold, brackets);
    const surchargeRateAtThreshold = getSurchargeRate(threshold, surchargeSlabs);
    const surchargeAtThreshold = taxAtThreshold * surchargeRateAtThreshold;
    const maxTotalAtThreshold =
      grossIncome - threshold + taxAtThreshold + surchargeAtThreshold;

    const currentTotal = incomeTax + cappedSurcharge;
    if (currentTotal > maxTotalAtThreshold) {
      const relievedSurcharge = positiveOrZero(maxTotalAtThreshold - incomeTax);
      cappedSurcharge = Math.min(cappedSurcharge, relievedSurcharge);
    }
  }

  return cappedSurcharge;
}

// ─── Advance Tax Schedule ────────────────────────────────────────────────────

function buildAdvanceTaxSchedule(totalTaxAfterTDS: number): AdvanceTaxInstalment[] {
  if (totalTaxAfterTDS <= 10000) {
    // Advance tax not required if liability ≤ ₹10,000
    return [];
  }

  const instalments = [
    { dueDate: 'Jun 15', cumulativePercent: 0.15, dueBy: '15-Jun-2025' },
    { dueDate: 'Sep 15', cumulativePercent: 0.45, dueBy: '15-Sep-2025' },
    { dueDate: 'Dec 15', cumulativePercent: 0.75, dueBy: '15-Dec-2025' },
    { dueDate: 'Mar 15', cumulativePercent: 1.00, dueBy: '15-Mar-2026' },
  ];

  return instalments.map((inst) => ({
    dueDate: inst.dueDate,
    cumulativePercent: inst.cumulativePercent,
    amount: Math.round(totalTaxAfterTDS * inst.cumulativePercent),
    dueBy: inst.dueBy,
  }));
}

// ─── ITR Form Recommendation ─────────────────────────────────────────────────

function recommendITRForm(input: IndiaInput, hasCapitalGains: boolean, hasMultipleProperties: boolean): 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' {
  const bType = input.businessType ?? 'none';

  // ITR-3: Non-presumptive business/profession
  if (bType === 'regular') return 'ITR-3';

  // ITR-4: Presumptive income (44AD / 44ADA)
  if (bType === '44AD' || bType === '44ADA') return 'ITR-4';

  // ITR-2: Capital gains or multiple house properties or foreign income
  if (hasCapitalGains || hasMultipleProperties) return 'ITR-2';

  // ITR-1 (Sahaj): Only salary + one house property (self-occupied) + other sources ≤ ₹5K
  const otherSources = nvl(input.savingsInterest) + nvl(input.fdInterest) +
    nvl(input.dividendIncome) + nvl(input.otherIncome);

  const grossSalary = nvl(input.grossSalary) || nvl(input.grossIncome);
  if (grossSalary <= 5000000 && otherSources <= 5000) return 'ITR-1';

  // Otherwise ITR-2
  return 'ITR-2';
}

// ─── Tips Generator ──────────────────────────────────────────────────────────

function buildTips(input: IndiaInput, regime: 'old' | 'new', taxableIncome: number, cgResult: CGResult, marginalRate: number): SavingTip[] {
  const tips: SavingTip[] = [];

  if (regime === 'old') {
    // 80C headroom
    const used80C = nvl(input.section80C) + nvl(input.section80CCC) + nvl(input.section80CCD1);
    const remaining80C = 150000 - Math.min(used80C, 150000);
    if (remaining80C > 0) {
      tips.push({
        id: 'in-80c',
        title: 'Maximise Section 80C',
        description: `You can invest ₹${remaining80C.toLocaleString('en-IN')} more in ELSS, PPF, NPS or LIC premiums to fully utilise the ₹1,50,000 80C limit.`,
        potentialSaving: Math.round(remaining80C * marginalRate),
        country: 'IN',
      });
    }

    // NPS 80CCD(1B) headroom
    const usedNPS = nvl(input.section80CCD1B) || nvl(input.nps80CCD);
    if (usedNPS < 50000) {
      const remainingNPS = 50000 - usedNPS;
      tips.push({
        id: 'in-nps',
        title: 'NPS Contribution (Section 80CCD(1B))',
        description: `Contribute ₹${remainingNPS.toLocaleString('en-IN')} more to NPS to claim the additional ₹50,000 deduction over and above 80C.`,
        potentialSaving: Math.round(remainingNPS * marginalRate),
        country: 'IN',
      });
    }

    // 80D headroom
    const age = input.age ?? 'below60';
    const isSenior = age === '60to80' || age === 'above80';
    const max80D = isSenior ? 50000 : 25000;
    const used80D = nvl(input.section80D_self) || nvl(input.section80D);
    const remaining80D = max80D - Math.min(used80D, max80D);
    if (remaining80D > 0) {
      tips.push({
        id: 'in-80d',
        title: 'Health Insurance Premium (Section 80D)',
        description: `Buy health insurance to save tax. You can claim up to ₹${remaining80D.toLocaleString('en-IN')} more under 80D.`,
        potentialSaving: Math.round(remaining80D * marginalRate),
        country: 'IN',
      });
    }

    // Section 24 home loan tip
    if (!input.homeLoanInterest && (!input.properties || input.properties.length === 0)) {
      tips.push({
        id: 'in-sec24',
        title: 'Home Loan Interest (Section 24)',
        description: 'Interest on a home loan qualifies for up to ₹2,00,000 deduction under Section 24 in the old regime.',
        potentialSaving: 0,
        country: 'IN',
      });
    }

    // Equity LTCG harvesting
    if (cgResult.equityLTCGAmount > 125000) {
      const taxableExcess = cgResult.equityLTCGAmount - 125000;
      tips.push({
        id: 'in-ltcg-harvest',
        title: 'Harvest Equity Gains Below ₹1.25L',
        description: `₹${taxableExcess.toLocaleString('en-IN')} of your equity LTCG is taxable at 12.5%. Redeem and reinvest to reset cost basis and stay within the ₹1.25L annual exemption.`,
        potentialSaving: Math.round(taxableExcess * 0.125 * 1.04), // 12.5% + 4% cess
        country: 'IN',
      });
    }
  }

  if (regime === 'new' && taxableIncome > 1275000) {
    tips.push({
      id: 'in-switch-old',
      title: 'Compare Old vs New Regime',
      description: 'Your income exceeds the new-regime rebate threshold. Consider switching to the old regime if your eligible deductions exceed ₹75,000 (standard deduction already factored).',
      potentialSaving: 0,
      country: 'IN',
    });
  }

  // Employer NPS tip (both regimes)
  if (nvl(input.employerNPS) === 0) {
    tips.push({
      id: 'in-nps-employer',
      title: 'Employer NPS Contribution (Section 80CCD(2))',
      description: 'Under both regimes, employer NPS contributions up to 14% of basic salary are deductible. Restructure your CTC to include employer NPS for tax-free savings.',
      potentialSaving: 0,
      country: 'IN',
    });
  }

  // LTCG harvesting tip for new regime too
  if (regime === 'new' && cgResult.equityLTCGAmount > 125000) {
    const taxableExcess = cgResult.equityLTCGAmount - 125000;
    tips.push({
      id: 'in-ltcg-harvest',
      title: 'Harvest Equity Gains Below ₹1.25L',
      description: `₹${taxableExcess.toLocaleString('en-IN')} of your equity LTCG is taxable at 12.5%. Consider booking profits below the ₹1.25L threshold annually.`,
      potentialSaving: Math.round(taxableExcess * 0.125 * 1.04),
      country: 'IN',
    });
  }

  return tips;
}

// ─── Section 89(1) Relief — Arrear Salary ────────────────────────────────────

/**
 * Simplified Form 10E calculation for Section 89(1) arrear salary relief.
 *
 * Steps:
 *   T1 = tax on (current year income WITH arrear)           [already computed as totalTax]
 *   T2 = tax on (current year income WITHOUT arrear)
 *   T3 = tax on (prior year income WITH arrear added)       [prior year income = currentIncome × 0.85]
 *   T4 = tax on (prior year income WITHOUT arrear)
 *   Relief = (T1 − T2) − (T3 − T4), floored at 0
 */
function computeRelief89(
  input: IndiaInput,
  regime: 'old' | 'new',
  currentTaxableIncome: number,
  brackets: TaxBracket[],
  surchargeSlabs: SurchargeSlot[],
  cessRate: number
): number {
  const arrear = positiveOrZero(nvl(input.arrearSalary));
  if (arrear <= 0) return 0;

  function taxOnIncome(income: number): number {
    const ti = positiveOrZero(income);
    const { totalTax: slab } = calculateBracketTax(ti, brackets);
    const surchargeRate = getSurchargeRate(ti, surchargeSlabs);
    const surcharge = slab * surchargeRate;
    const cess = (slab + surcharge) * cessRate;
    return slab + surcharge + cess;
  }

  const T1 = taxOnIncome(currentTaxableIncome);                          // with arrear (current)
  const T2 = taxOnIncome(positiveOrZero(currentTaxableIncome - arrear)); // without arrear (current)

  const priorIncome = currentTaxableIncome * 0.85; // simplified prior-year base
  const T3 = taxOnIncome(priorIncome + arrear);    // prior year WITH arrear
  const T4 = taxOnIncome(priorIncome);             // prior year WITHOUT arrear

  return positiveOrZero((T1 - T2) - (T3 - T4));
}

// ─── AMT u/s 115JC ───────────────────────────────────────────────────────────

/**
 * Alternative Minimum Tax under Section 115JC for individuals.
 * Applicable when the taxpayer claims deductions under 10AA, 80H–80RRB, 35AD, etc.
 * Simplified applicability: flag amtApplicable = true, or if total deductions > 20% of gross income
 * AND taxable income < adjusted total income.
 *
 * AMT rate: 18.5% + surcharge + 4% cess on adjusted total income.
 * If AMT > regular tax → pay AMT instead.
 */
function computeAMT115JC(
  input: IndiaInput,
  regime: 'old' | 'new',
  regularTax: number,
  normalGTI: number,
  totalDeductions: number,
  surchargeSlabs: SurchargeSlot[],
  cessRate: number
): number {
  const AMT_RATE = 0.185;

  // Determine adjusted total income
  const adjustedIncome = positiveOrZero(
    nvl(input.amtAdjustedIncome) > 0 ? nvl(input.amtAdjustedIncome) : normalGTI
  );

  // Check applicability
  const deductionRatio = normalGTI > 0 ? totalDeductions / normalGTI : 0;
  const isApplicable =
    input.amtApplicable === true ||
    (regime === 'old' && deductionRatio > 0.20 && adjustedIncome > normalGTI - totalDeductions);

  if (!isApplicable) return 0;

  const amtBase = AMT_RATE * adjustedIncome;
  const surchargeRate = getSurchargeRate(adjustedIncome, surchargeSlabs);
  const amtSurcharge = amtBase * surchargeRate;
  const amtCess = (amtBase + amtSurcharge) * cessRate;
  const amtTotal = Math.round(amtBase + amtSurcharge + amtCess);

  // AMT liability = excess over regular tax (if AMT is higher)
  return positiveOrZero(amtTotal - regularTax);
}

// ─── Core single-regime calculator ───────────────────────────────────────────

function calcForRegime(input: IndiaInput, regime: 'old' | 'new'): TaxResult {
  const age = input.age ?? 'below60';

  // Standard deduction (available in both regimes for salaried)
  const stdDeduction =
    regime === 'new'
      ? indiaSlabs.newRegime.standardDeduction
      : indiaSlabs.oldRegime.standardDeduction;

  // ── 1. Salary Income ──────────────────────────────────────────────────────
  const salaryResult = computeSalaryIncome(input, regime, stdDeduction);
  let salaryIncome = salaryResult.netSalaryIncome;

  // ESOP Perquisite: (FMV on exercise - exercise price) × shares — taxed as salary
  if (nvl(input.esopPerquisite) > 0) {
    salaryIncome += nvl(input.esopPerquisite);
  }

  // ── 2. Employer NPS deduction (80CCD(2)) — both regimes ──────────────────
  // 14% of basic salary for government employees; 10% for others (FY 25-26: 14%)
  const maxEmployerNPS = nvl(input.basicSalary) * 0.14;
  const employerNPSDed = Math.min(nvl(input.employerNPS), maxEmployerNPS);
  salaryIncome = positiveOrZero(salaryIncome - employerNPSDed);

  // ── 3. House Property Income ──────────────────────────────────────────────
  const hpResult = computeHousePropertyIncome(input, regime);

  // ── 4. Business/Profession Income ─────────────────────────────────────────
  const businessIncome = computeBusinessIncome(input);

  // ── 5. Capital Gains ──────────────────────────────────────────────────────
  const cgResult = computeCapitalGains(input);

  // ESOP subsequent gains: short → slab income; long → equity LTCG pool
  if (input.esopSubsequentGain && input.esopSubsequentGain.length > 0) {
    for (const esopGain of input.esopSubsequentGain) {
      const amt = positiveOrZero(esopGain.amount);
      if (esopGain.gainType === 'short') {
        cgResult.slabIncome += amt;
      } else {
        cgResult.equityLTCGAmount += amt;
      }
    }
  }

  // ── 6. Other Sources ──────────────────────────────────────────────────────
  const otherSourcesIncome = computeOtherSourcesIncome(input);

  // ── 7. Gross Total Income (GTI) ───────────────────────────────────────────
  // Special rate incomes (equity CG, lottery) are NOT part of the normal GTI for slab purposes
  // but are included in GTI conceptually for surcharge determination
  const normalGTI = positiveOrZero(
    salaryIncome +
    hpResult.totalHousePropertyIncome +
    businessIncome +
    cgResult.slabIncome +
    otherSourcesIncome
  );

  // ── 8. Chapter VI-A Deductions (old regime only) ──────────────────────────
  let totalDeductions = 0;
  if (regime === 'old') {
    const dedResult = computeDeductions(input, normalGTI);
    totalDeductions = dedResult.total;

    // Section 80-IAC: startup tax holiday — 100% of eligible profit for 3 of first 10 years
    // Only applicable for regular businesses
    if (input.businessType === 'regular' && nvl(input.section80IAC) > 0) {
      const deduction80IAC = Math.min(nvl(input.section80IAC), businessIncome);
      totalDeductions = Math.min(totalDeductions + deduction80IAC, normalGTI);
    }
  }

  // ── 9. Taxable Income (for slab computation) ──────────────────────────────
  let taxableIncome = positiveOrZero(normalGTI - totalDeductions);

  // ── 10. Slab Tax ──────────────────────────────────────────────────────────
  let brackets: TaxBracket[];
  if (regime === 'new') {
    brackets = indiaSlabs.newRegime.brackets as TaxBracket[];
  } else {
    brackets = (indiaSlabs.oldRegime.brackets as Record<string, TaxBracket[]>)[age];
  }

  const { totalTax: slabTax, details: bracketDetails, marginalRate } =
    calculateBracketTax(taxableIncome, brackets);

  // ── 11. Special Rate Taxes ────────────────────────────────────────────────
  // Equity STCG: 20% flat (post Jul 23, 2024 budget)
  const equitySTCGTax = cgResult.equitySTCGAmount * indiaSlabs.capitalGains.equitySTCG;

  // Equity LTCG: 12.5% above ₹1.25L exemption
  const equityLTCGTaxable = positiveOrZero(cgResult.equityLTCGAmount - indiaSlabs.capitalGains.equityLTCGExemption);
  const equityLTCGTax = equityLTCGTaxable * indiaSlabs.capitalGains.equityLTCG;

  // Property LTCG with indexation: 20%
  const propertyLTCGTax = cgResult.propertyLTCGAmount * indiaSlabs.capitalGains.propertyLTCGWithIndexation;

  // Property LTCG without indexation: 12.5%
  const propertyLTCGNoIdxTax = cgResult.propertyLTCGNoIdx * indiaSlabs.capitalGains.propertyLTCGWithoutIndexation;

  // Lottery: 30% flat
  const lotteryTax = cgResult.lotteryAmount * indiaSlabs.capitalGains.lotteryRate;

  const specialRateTax = equitySTCGTax + equityLTCGTax + propertyLTCGTax + propertyLTCGNoIdxTax + lotteryTax;

  // ── 12. Section 87A Rebate ────────────────────────────────────────────────
  // Rebate applies on slab tax only; special rate taxes (CG, lottery) are excluded
  const rebateConfig =
    regime === 'new' ? indiaSlabs.newRegime.rebate87A : indiaSlabs.oldRegime.rebate87A;

  // Rebate eligibility: total income (including special rate) ≤ limit
  const totalIncomeForRebate = taxableIncome +
    cgResult.equitySTCGAmount +
    cgResult.equityLTCGAmount +
    cgResult.propertyLTCGAmount +
    cgResult.propertyLTCGNoIdx +
    cgResult.lotteryAmount;

  const rebate =
    totalIncomeForRebate <= rebateConfig.limit
      ? Math.min(slabTax, rebateConfig.maxRebate)
      : 0;

  const slabTaxAfterRebate = positiveOrZero(slabTax - rebate);
  const taxAfterRebate = slabTaxAfterRebate + specialRateTax;

  // ── 13. Surcharge ─────────────────────────────────────────────────────────
  // Surcharge is computed on total income including all heads
  const grossIncomeForSurcharge = totalIncomeForRebate;
  const surchargeSlabs =
    regime === 'new'
      ? (indiaSlabs.newRegime.surcharge as SurchargeSlot[])
      : (indiaSlabs.oldRegime.surcharge as SurchargeSlot[]);

  const surchargeRate = getSurchargeRate(grossIncomeForSurcharge, surchargeSlabs);
  let surcharge = taxAfterRebate * surchargeRate;

  if (surcharge > 0) {
    surcharge = applyMarginalRelief(grossIncomeForSurcharge, taxAfterRebate, surcharge, surchargeSlabs, brackets);
  }

  // ── 14. Cess ──────────────────────────────────────────────────────────────
  const cessRate =
    regime === 'new' ? indiaSlabs.newRegime.cess : indiaSlabs.oldRegime.cess;
  const cess = (taxAfterRebate + surcharge) * cessRate;

  const totalTax = Math.round(taxAfterRebate + surcharge + cess);

  // ── 15. Section 89(1) Relief — Arrear Salary ─────────────────────────────
  const relief89 = computeRelief89(
    input,
    regime,
    taxableIncome,
    brackets,
    surchargeSlabs,
    cessRate
  );
  const totalTaxAfterRelief89 = positiveOrZero(Math.round(totalTax - relief89));

  // ── 15b. AMT u/s 115JC ───────────────────────────────────────────────────
  const amtLiability = computeAMT115JC(
    input,
    regime,
    totalTaxAfterRelief89,
    normalGTI,
    totalDeductions,
    surchargeSlabs,
    cessRate
  );
  // If AMT applies, the effective total tax is regularTax + amtLiability
  const effectiveTotalTax = totalTaxAfterRelief89 + amtLiability;

  // ── 16. After TDS / Advance Tax ──────────────────────────────────────────
  const tdsDeducted = positiveOrZero(nvl(input.tdsDeducted));
  const advanceTaxPaid = positiveOrZero(nvl(input.advanceTaxPaid));
  const totalTaxPayable = positiveOrZero(effectiveTotalTax - tdsDeducted - advanceTaxPaid);

  // ── 16. Advance Tax Schedule ──────────────────────────────────────────────
  const advanceTaxSchedule = buildAdvanceTaxSchedule(totalTaxPayable);

  // ── 17. Gross Income (for reporting) ─────────────────────────────────────
  // Use the total of all income sources for grossIncome field
  const grossSalaryRaw = salaryResult.grossSalary;
  const reportedGrossIncome = positiveOrZero(
    grossSalaryRaw +
    (hpResult.totalHousePropertyIncome > 0 ? hpResult.totalHousePropertyIncome : 0) +
    businessIncome +
    cgResult.slabIncome +
    cgResult.equitySTCGAmount +
    cgResult.equityLTCGAmount +
    cgResult.propertyLTCGAmount +
    cgResult.propertyLTCGNoIdx +
    cgResult.lotteryAmount +
    otherSourcesIncome
  ) || positiveOrZero(nvl(input.grossSalary) || nvl(input.grossIncome));

  // Fallback: use grossIncome/grossSalary if no breakdown provided
  const finalGrossIncome = reportedGrossIncome;

  // ── 18. ITR Form Recommendation ───────────────────────────────────────────
  const hasCapitalGains = (input.capitalGains?.length ?? 0) > 0;
  const hasMultipleProperties = (input.properties?.length ?? 0) > 1;
  const itrFormRecommended = recommendITRForm(input, hasCapitalGains, hasMultipleProperties);

  // ── 19. Breakdown ─────────────────────────────────────────────────────────
  const breakdown: TaxBreakdownItem[] = [];

  if (slabTaxAfterRebate > 0) {
    breakdown.push({ label: 'Income Tax (Slab)', amount: Math.round(slabTaxAfterRebate), rate: marginalRate, color: '#4f46e5' });
  }
  if (rebate > 0) {
    breakdown.push({ label: 'Section 87A Rebate', amount: -Math.round(rebate), color: '#22c55e' });
  }
  if (equitySTCGTax > 0) {
    breakdown.push({ label: 'Equity STCG Tax (20%)', amount: Math.round(equitySTCGTax), rate: 0.20, color: '#7c3aed' });
  }
  if (equityLTCGTax > 0) {
    breakdown.push({ label: 'Equity LTCG Tax (12.5%)', amount: Math.round(equityLTCGTax), rate: 0.125, color: '#6d28d9' });
  }
  if (propertyLTCGTax > 0) {
    breakdown.push({ label: 'Property LTCG Tax (20%)', amount: Math.round(propertyLTCGTax), rate: 0.20, color: '#9333ea' });
  }
  if (propertyLTCGNoIdxTax > 0) {
    breakdown.push({ label: 'LTCG Tax (12.5%)', amount: Math.round(propertyLTCGNoIdxTax), rate: 0.125, color: '#a855f7' });
  }
  if (lotteryTax > 0) {
    breakdown.push({ label: 'Lottery/Winnings Tax (30%)', amount: Math.round(lotteryTax), rate: 0.30, color: '#dc2626' });
  }
  if (surcharge > 0) {
    breakdown.push({ label: 'Surcharge', amount: Math.round(surcharge), rate: surchargeRate, color: '#f59e0b' });
  }
  if (cess > 0) {
    breakdown.push({ label: 'Health & Education Cess', amount: Math.round(cess), rate: cessRate, color: '#ec4899' });
  }
  if (relief89 > 0) {
    breakdown.push({ label: 'Section 89(1) Relief', amount: -Math.round(relief89), color: '#22c55e' });
  }
  if (amtLiability > 0) {
    breakdown.push({ label: 'AMT u/s 115JC', amount: Math.round(amtLiability), rate: 0.185, color: '#dc2626' });
  }

  // ── 20. Tips ──────────────────────────────────────────────────────────────
  const tips = buildTips(input, regime, taxableIncome, cgResult, marginalRate);

  return {
    country: 'IN',
    grossIncome: finalGrossIncome,
    totalTax: effectiveTotalTax,
    effectiveRate: finalGrossIncome > 0 ? effectiveTotalTax / finalGrossIncome : 0,
    marginalRate,
    netIncome: finalGrossIncome - effectiveTotalTax,
    monthlyTakeHome: (finalGrossIncome - effectiveTotalTax) / 12,
    breakdown,
    bracketDetails,
    tips,
    currency: 'INR',
    regime,
    // Extended fields
    salaryIncome: salaryIncome,
    housePropertyIncome: hpResult.totalHousePropertyIncome,
    businessIncome,
    capitalGainsTax: Math.round(specialRateTax),
    totalDeductions,
    grossTotalIncome: normalGTI,
    taxableIncome,
    advanceTaxSchedule,
    itrFormRecommended,
    totalTaxPayable,
    relief89: relief89 > 0 ? Math.round(relief89) : undefined,
    amtLiability: amtLiability > 0 ? Math.round(amtLiability) : undefined,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function calculateIndiaTax(input: IndiaInput): TaxResult {
  if (input.regime === 'auto') {
    const newResult = calcForRegime(input, 'new');
    const oldResult = calcForRegime(input, 'old');

    if (newResult.totalTax <= oldResult.totalTax) {
      return { ...newResult, alternateResult: oldResult };
    } else {
      return { ...oldResult, alternateResult: newResult };
    }
  }

  return calcForRegime(input, input.regime);
}
