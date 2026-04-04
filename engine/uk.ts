import ukSlabs from '../config/slabs/uk-ty2025-26.json';
import { UKInput, TaxResult, TaxBreakdownItem, BracketDetail, TaxBracket, SavingTip } from './types';
import { calculateBracketTax } from './utils';

// --------------------------------------------------------------------------
// Personal Allowance helpers
// --------------------------------------------------------------------------

function computePersonalAllowance(grossIncome: number, blindPerson: boolean): number {
  const base = ukSlabs.personalAllowance; // 12570
  const taperThreshold = ukSlabs.personalAllowanceTaperThreshold; // 100000

  // Reduce by £1 for every £2 above £100,000
  const reduction = Math.max(0, Math.floor((grossIncome - taperThreshold) / 2));
  let pa = Math.max(0, base - reduction);

  // Blind Person's Allowance adds £3,070
  if (blindPerson) {
    pa += 3070;
  }

  return pa;
}

// --------------------------------------------------------------------------
// Dynamic bracket builder
// --------------------------------------------------------------------------

function buildEnglandBrackets(effectivePA: number): TaxBracket[] {
  if (effectivePA > 0) {
    return [
      { min: 0,        max: effectivePA, rate: 0,    label: 'Personal Allowance' },
      { min: effectivePA, max: 50270,   rate: 0.20,  label: 'Basic rate' },
      { min: 50270,    max: 125140,      rate: 0.40,  label: 'Higher rate' },
      { min: 125140,   max: null,        rate: 0.45,  label: 'Additional rate' },
    ];
  } else {
    return [
      { min: 0,      max: 50270,  rate: 0.20, label: 'Basic rate' },
      { min: 50270,  max: 125140, rate: 0.40, label: 'Higher rate' },
      { min: 125140, max: null,   rate: 0.45, label: 'Additional rate' },
    ];
  }
}

function buildScotlandBrackets(effectivePA: number): TaxBracket[] {
  if (effectivePA > 0) {
    return [
      { min: 0,            max: effectivePA, rate: 0,    label: 'Personal Allowance' },
      { min: effectivePA,  max: 14876,       rate: 0.19, label: 'Starter rate' },
      { min: 14876,        max: 26561,       rate: 0.20, label: 'Basic rate' },
      { min: 26561,        max: 43662,       rate: 0.21, label: 'Intermediate rate' },
      { min: 43662,        max: 75000,       rate: 0.42, label: 'Higher rate' },
      { min: 75000,        max: 125140,      rate: 0.45, label: 'Advanced rate' },
      { min: 125140,       max: null,        rate: 0.48, label: 'Top rate' },
    ];
  } else {
    return [
      { min: 0,      max: 14876,  rate: 0.19, label: 'Starter rate' },
      { min: 14876,  max: 26561,  rate: 0.20, label: 'Basic rate' },
      { min: 26561,  max: 43662,  rate: 0.21, label: 'Intermediate rate' },
      { min: 43662,  max: 75000,  rate: 0.42, label: 'Higher rate' },
      { min: 75000,  max: 125140, rate: 0.45, label: 'Advanced rate' },
      { min: 125140, max: null,   rate: 0.48, label: 'Top rate' },
    ];
  }
}

// --------------------------------------------------------------------------
// National Insurance
// --------------------------------------------------------------------------

function computeNI(grossIncome: number): number {
  const ni = ukSlabs.nationalInsurance;
  let niTax = 0;

  if (grossIncome > ni.primaryThreshold) {
    const mainBand = Math.min(grossIncome, ni.upperEarningsLimit) - ni.primaryThreshold;
    niTax += mainBand * ni.mainRate; // 8%
  }

  if (grossIncome > ni.upperEarningsLimit) {
    niTax += (grossIncome - ni.upperEarningsLimit) * ni.upperRate; // 2%
  }

  return niTax;
}

// --------------------------------------------------------------------------
// Student Loan
// --------------------------------------------------------------------------

function computeStudentLoan(
  grossIncome: number,
  plan: NonNullable<UKInput['studentLoan']>,
): number {
  if (plan === 'none') return 0;

  const config = ukSlabs.studentLoan[plan];
  if (grossIncome <= config.threshold) return 0;
  return (grossIncome - config.threshold) * config.rate;
}

// --------------------------------------------------------------------------
// Dividend Tax
// --------------------------------------------------------------------------

/**
 * Returns dividend tax given:
 *   - dividendIncome: total dividend income
 *   - employmentIncome: adjusted gross (after pension deduction)
 *   - effectivePA: personal allowance after tapering
 */
function computeDividendTax(
  dividendIncome: number,
  employmentIncome: number,
  effectivePA: number,
): number {
  const allowance = ukSlabs.dividendAllowance; // £500
  const taxableDividends = Math.max(0, dividendIncome - allowance);
  if (taxableDividends === 0) return 0;

  const rates = ukSlabs.dividendRates;

  // The employment income occupies the bands first; dividends sit on top.
  // We need to determine what band each £ of dividend falls into.
  // Band thresholds (absolute from zero):
  const basicLimit = 50270;
  const higherLimit = 125140;

  // How much of the income bands are already used by employment income
  // (employment income above PA is taxable employment income)
  const taxableEmployment = Math.max(0, employmentIncome - effectivePA);

  let dividendTax = 0;
  let remaining = taxableDividends;
  // Position in the bands where dividends start (above the PA)
  let position = taxableEmployment + effectivePA; // absolute income position

  // Walk through each £ of taxable dividends, slotting into the right band
  // Basic rate band: effectivePA → 50270
  // Higher rate band: 50270 → 125140
  // Additional rate band: 125140+

  const basicEnd = basicLimit;
  const higherEnd = higherLimit;

  // Basic band portion
  if (position < basicEnd && remaining > 0) {
    const roomInBasic = basicEnd - position;
    const inBasic = Math.min(remaining, roomInBasic);
    dividendTax += inBasic * rates.basic;
    remaining -= inBasic;
    position += inBasic;
  }

  // Higher band portion
  if (position < higherEnd && remaining > 0) {
    const roomInHigher = higherEnd - position;
    const inHigher = Math.min(remaining, roomInHigher);
    dividendTax += inHigher * rates.higher;
    remaining -= inHigher;
    position += inHigher;
  }

  // Additional band portion
  if (remaining > 0) {
    dividendTax += remaining * rates.additional;
  }

  return dividendTax;
}

// --------------------------------------------------------------------------
// Main export
// --------------------------------------------------------------------------

export function calculateUKTax(input: UKInput): TaxResult {
  const { grossIncome, region } = input;
  const pensionContributionRaw = input.pensionContribution ?? 0;
  const dividendIncome = input.dividendIncome ?? 0;
  const studentLoanPlan = input.studentLoan ?? 'none';
  const blindPerson = input.blindPersonAllowance ?? false;

  // Step 1: Personal Allowance with taper
  const effectivePA = computePersonalAllowance(grossIncome, blindPerson);

  // Step 2: Pension contribution (capped at lesser of gross income or £60,000)
  const annualAllowance = 60000;
  const pensionContribution = Math.min(pensionContributionRaw, grossIncome, annualAllowance);

  // Adjusted gross = gross - pension (used for income tax calculation)
  const adjustedGross = Math.max(0, grossIncome - pensionContribution);

  // Step 3: Taxable income = max(0, adjustedGross - effectivePA)
  // We feed adjustedGross into bracket calculator; brackets start at 0 so PA bracket
  // handles the zero-tax portion automatically.
  const incomeForTax = adjustedGross;

  // Step 4: Build dynamic brackets and compute income tax
  const brackets: TaxBracket[] =
    region === 'scotland'
      ? buildScotlandBrackets(effectivePA)
      : buildEnglandBrackets(effectivePA);

  const { totalTax: incomeTax, details: bracketDetails, marginalRate } =
    calculateBracketTax(incomeForTax, brackets);

  // Step 5: National Insurance (on gross, before pension)
  const niTax = computeNI(grossIncome);

  // Step 6: Student Loan (on gross income)
  const studentLoanTax = computeStudentLoan(grossIncome, studentLoanPlan);

  // Step 7: Dividend Tax
  const dividendTax =
    dividendIncome > 0
      ? computeDividendTax(dividendIncome, adjustedGross, effectivePA)
      : 0;

  // Totals
  const totalTax = incomeTax + niTax + studentLoanTax + dividendTax;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;
  const netIncome = grossIncome - totalTax;
  const monthlyTakeHome = netIncome / 12;

  // Breakdown
  const breakdown: TaxBreakdownItem[] = [
    { label: 'Income Tax', amount: incomeTax, rate: marginalRate },
    { label: 'National Insurance', amount: niTax },
  ];

  if (studentLoanTax > 0) {
    breakdown.push({ label: 'Student Loan', amount: studentLoanTax });
  }

  if (dividendTax > 0) {
    breakdown.push({ label: 'Dividend Tax', amount: dividendTax });
  }

  // Tips
  const tips: SavingTip[] = [];

  if (grossIncome > 100000 && grossIncome < 125140) {
    tips.push({
      id: 'uk-60pct-trap',
      title: '60% Tax Trap — Personal Allowance Taper',
      description:
        'Your income falls in the £100,000–£125,140 band where you face an effective 60% marginal rate. ' +
        'For every £2 earned above £100,000 you lose £1 of your Personal Allowance, meaning the 40% ' +
        'income tax rate effectively becomes 60% on this slice. Consider increasing pension contributions ' +
        'to bring adjusted income below £100,000 and reclaim your full Personal Allowance.',
      potentialSaving: Math.min(grossIncome - 100000, 25140) * 0.2,
      country: 'UK',
    });
  }

  return {
    country: 'UK',
    grossIncome,
    totalTax,
    effectiveRate,
    marginalRate,
    netIncome,
    monthlyTakeHome,
    breakdown,
    bracketDetails,
    tips,
    currency: 'GBP',
  };
}
