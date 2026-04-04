import indiaSlabs from '../config/slabs/india-fy2025-26.json';
import { IndiaInput, TaxResult, TaxBreakdownItem, BracketDetail, TaxBracket, SavingTip } from './types';
import { calculateBracketTax } from './utils';

// ─── Internal helpers ────────────────────────────────────────────────────────

function clampDeduction(value: number | undefined, max: number): number {
  if (value === undefined || value <= 0) return 0;
  return Math.min(value, max);
}

function positiveOrZero(n: number): number {
  return Math.max(0, n);
}

// ─── HRA Exemption (Old Regime only) ────────────────────────────────────────

function calcHRAExemption(input: IndiaInput): number {
  const { hra = 0, rentPaid = 0, basicSalary = 0, metroCity = false } = input;

  if (hra <= 0 || rentPaid <= 0 || basicSalary <= 0) return 0;

  const actualHRA = positiveOrZero(hra);
  const rentMinusTenPercent = positiveOrZero(rentPaid - 0.1 * basicSalary);
  const metroFraction = metroCity ? 0.5 : 0.4;
  const metroComponent = metroFraction * basicSalary;

  return Math.min(actualHRA, rentMinusTenPercent, metroComponent);
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

/**
 * Marginal relief: ensures (tax + surcharge) does not exceed
 * (income - threshold) + tax_at_threshold.
 *
 * We check each surcharge threshold from lowest to highest.
 */
function applyMarginalRelief(
  grossIncome: number,
  incomeTax: number,
  surcharge: number,
  surchargeSlabs: SurchargeSlot[],
  brackets: TaxBracket[]
): number {
  // Build threshold list: [0, 50L, 1Cr, 2Cr, 5Cr] (each slab min)
  const thresholds = surchargeSlabs.map((s) => s.min);

  let cappedSurcharge = surcharge;

  for (const threshold of thresholds) {
    if (grossIncome <= threshold) continue;

    // Tax that would be payable at exactly the threshold
    const { totalTax: taxAtThreshold } = calculateBracketTax(threshold, brackets);
    const surchargeRateAtThreshold = getSurchargeRate(threshold, surchargeSlabs);
    const surchargeAtThreshold = taxAtThreshold * surchargeRateAtThreshold;

    // Maximum (tax + surcharge) allowed = (income - threshold) + (tax + surcharge) at threshold
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

// ─── Tips Generator ──────────────────────────────────────────────────────────

function buildTips(input: IndiaInput, regime: 'old' | 'new', taxableIncome: number): SavingTip[] {
  const tips: SavingTip[] = [];

  if (regime === 'old') {
    const used80C = input.section80C ?? 0;
    const remaining80C = 150000 - used80C;
    if (remaining80C > 0) {
      tips.push({
        id: 'in-80c',
        title: 'Maximise Section 80C',
        description: `You can invest ₹${remaining80C.toLocaleString('en-IN')} more in ELSS, PPF, NPS or LIC premiums to fully utilise the ₹1,50,000 80C limit.`,
        potentialSaving: Math.round(remaining80C * 0.3), // rough 30% bracket saving
        country: 'IN',
      });
    }

    const used80D = input.section80D ?? 0;
    const max80D = (input.age === '60to80' || input.age === 'above80') ? 50000 : 25000;
    const remaining80D = max80D - used80D;
    if (remaining80D > 0) {
      tips.push({
        id: 'in-80d',
        title: 'Health Insurance Premium (Section 80D)',
        description: `Paying health insurance premiums can save additional tax. You can claim up to ₹${remaining80D.toLocaleString('en-IN')} more under 80D.`,
        potentialSaving: Math.round(remaining80D * 0.2),
        country: 'IN',
      });
    }

    const usedNPS = input.nps80CCD ?? 0;
    if (usedNPS < 50000) {
      const remainingNPS = 50000 - usedNPS;
      tips.push({
        id: 'in-nps',
        title: 'NPS Contribution (Section 80CCD(1B))',
        description: `Contribute ₹${remainingNPS.toLocaleString('en-IN')} more to NPS to claim the additional ₹50,000 deduction over and above 80C.`,
        potentialSaving: Math.round(remainingNPS * 0.2),
        country: 'IN',
      });
    }

    if (!input.homeLoanInterest || input.homeLoanInterest < 200000) {
      tips.push({
        id: 'in-sec24',
        title: 'Home Loan Interest (Section 24)',
        description: 'Interest on a home loan qualifies for up to ₹2,00,000 deduction under Section 24 in the old regime.',
        potentialSaving: 0,
        country: 'IN',
      });
    }
  }

  if (regime === 'new' && taxableIncome > 1275000) {
    tips.push({
      id: 'in-switch-old',
      title: 'Compare Old vs New Regime',
      description: 'Your income is above the new-regime rebate threshold. Consider switching to the old regime if your eligible deductions exceed the standard deduction benefit.',
      potentialSaving: 0,
      country: 'IN',
    });
  }

  if (regime === 'new') {
    tips.push({
      id: 'in-nps-employer',
      title: "Employer NPS contribution (Section 80CCD(2))",
      description: "Under the new regime, employer NPS contributions up to 14% of basic are still deductible. Restructure your CTC to include employer NPS.",
      potentialSaving: 0,
      country: 'IN',
    });
  }

  return tips;
}

// ─── Core single-regime calculator ──────────────────────────────────────────

function calcForRegime(input: IndiaInput, regime: 'old' | 'new'): TaxResult {
  const gross = positiveOrZero(input.grossIncome);

  // Step 1: Standard deduction
  const stdDeduction =
    regime === 'new'
      ? indiaSlabs.newRegime.standardDeduction
      : indiaSlabs.oldRegime.standardDeduction;

  let taxableIncome = positiveOrZero(gross - stdDeduction);

  // Step 2: Old regime deductions
  if (regime === 'old') {
    // HRA
    const hraExemption = calcHRAExemption(input);
    taxableIncome = positiveOrZero(taxableIncome - hraExemption);

    // Chapter VI-A
    const deduction80C = clampDeduction(input.section80C, 150000);
    const max80D = (input.age === '60to80' || input.age === 'above80') ? 50000 : 25000;
    const deduction80D = clampDeduction(input.section80D, max80D);
    const deduction80TTA = clampDeduction(input.section80TTA, 10000);
    const deductionHomeLoan = clampDeduction(input.homeLoanInterest, 200000);
    const deductionNPS = clampDeduction(input.nps80CCD, 50000);
    const otherDed = positiveOrZero(input.otherDeductions ?? 0);

    const totalChapterVIA =
      deduction80C +
      deduction80D +
      deduction80TTA +
      deductionHomeLoan +
      deductionNPS +
      otherDed;

    taxableIncome = positiveOrZero(taxableIncome - totalChapterVIA);
  }

  // Step 3: Bracket tax
  let brackets: TaxBracket[];
  if (regime === 'new') {
    brackets = indiaSlabs.newRegime.brackets as TaxBracket[];
  } else {
    const age = input.age ?? 'below60';
    brackets = (indiaSlabs.oldRegime.brackets as Record<string, TaxBracket[]>)[age];
  }

  const { totalTax: incomeTax, details: bracketDetails, marginalRate } =
    calculateBracketTax(taxableIncome, brackets);

  // Step 4: Section 87A rebate
  const rebateConfig =
    regime === 'new' ? indiaSlabs.newRegime.rebate87A : indiaSlabs.oldRegime.rebate87A;
  const rebate =
    taxableIncome <= rebateConfig.limit
      ? Math.min(incomeTax, rebateConfig.maxRebate)
      : 0;

  const taxAfterRebate = positiveOrZero(incomeTax - rebate);

  // Step 5: Surcharge (on GROSS income)
  const surchargeSlabs =
    regime === 'new'
      ? (indiaSlabs.newRegime.surcharge as SurchargeSlot[])
      : (indiaSlabs.oldRegime.surcharge as SurchargeSlot[]);

  const surchargeRate = getSurchargeRate(gross, surchargeSlabs);
  let surcharge = taxAfterRebate * surchargeRate;

  // Step 6: Marginal relief on surcharge
  if (surcharge > 0) {
    surcharge = applyMarginalRelief(gross, taxAfterRebate, surcharge, surchargeSlabs, brackets);
  }

  // Step 7: Cess = 4% on (tax after rebate + surcharge)
  const cessRate =
    regime === 'new' ? indiaSlabs.newRegime.cess : indiaSlabs.oldRegime.cess;
  const cess = (taxAfterRebate + surcharge) * cessRate;

  const totalTax = Math.round(taxAfterRebate + surcharge + cess);

  // Breakdown
  const breakdown: TaxBreakdownItem[] = [
    { label: 'Income Tax', amount: Math.round(taxAfterRebate), rate: marginalRate, color: '#4f46e5' },
  ];
  if (rebate > 0) {
    breakdown.push({ label: 'Section 87A Rebate', amount: -Math.round(rebate), color: '#22c55e' });
  }
  if (surcharge > 0) {
    breakdown.push({ label: 'Surcharge', amount: Math.round(surcharge), rate: surchargeRate, color: '#f59e0b' });
  }
  breakdown.push({ label: 'Health & Education Cess', amount: Math.round(cess), rate: cessRate, color: '#ec4899' });

  const tips = buildTips(input, regime, taxableIncome);

  return {
    country: 'IN',
    grossIncome: gross,
    totalTax,
    effectiveRate: gross > 0 ? totalTax / gross : 0,
    marginalRate,
    netIncome: gross - totalTax,
    monthlyTakeHome: (gross - totalTax) / 12,
    breakdown,
    bracketDetails,
    tips,
    currency: 'INR',
    regime,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function calculateIndiaTax(input: IndiaInput): TaxResult {
  if (input.regime === 'auto') {
    const newResult = calcForRegime(input, 'new');
    const oldResult = calcForRegime(input, 'old');

    // Return lower-tax regime as primary, other as alternateResult
    if (newResult.totalTax <= oldResult.totalTax) {
      return { ...newResult, alternateResult: oldResult };
    } else {
      return { ...oldResult, alternateResult: newResult };
    }
  }

  return calcForRegime(input, input.regime);
}
