import usSlabs from '../config/slabs/us-ty2025.json';
import { USInput, TaxResult, TaxBreakdownItem, BracketDetail, SavingTip } from './types';
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
  } = input;

  // ── Step 1: FICA / SE tax ─────────────────────────────────────────────────
  // Computed before AGI so we can use the SE deduction to adjust AGI.

  const ssWageBase   = usSlabs.fica.socialSecurity.wageBase;      // 176 100
  const ssRate       = usSlabs.fica.socialSecurity.rate;          // 0.062
  const medRate      = usSlabs.fica.medicare.rate;                // 0.0145
  const addlMedRate  = usSlabs.fica.additionalMedicare.rate;      // 0.009
  const addlMedThreshold = getAdditionalMedicareThreshold(filingStatus as FilingStatus);

  let socialSecurity = 0;
  let medicare       = 0;
  let additionalMedicare = 0;
  let seDeduction    = 0; // 50 % of SE taxes — reduces AGI

  if (w2Employee) {
    // W-2 employee — employer pays the other half
    const wages = grossIncome;
    socialSecurity     = ssRate * Math.min(wages, ssWageBase);
    medicare           = medRate * wages;
    additionalMedicare = wages > addlMedThreshold
      ? addlMedRate * (wages - addlMedThreshold)
      : 0;
    seDeduction = 0;
  } else {
    // Self-employed — pays both halves
    const netSE = selfEmploymentIncome > 0 ? selfEmploymentIncome : grossIncome;
    socialSecurity     = 2 * ssRate * Math.min(netSE, ssWageBase);   // 12.4 %
    medicare           = 2 * medRate * netSE;                         // 2.9 %
    const seTaxTotal   = socialSecurity + medicare;
    seDeduction        = seTaxTotal / 2;  // 50 % deductible above-the-line

    // Additional Medicare uses the same wage threshold (gross SE)
    additionalMedicare = netSE > addlMedThreshold
      ? addlMedRate * (netSE - addlMedThreshold)
      : 0;
  }

  const ficaTotal = socialSecurity + medicare + additionalMedicare;

  // ── Step 2: AGI ───────────────────────────────────────────────────────────
  // Subtract 50 % of SE tax from gross income to arrive at AGI.
  const agi = grossIncome - seDeduction;

  // ── Step 3: Taxable income ────────────────────────────────────────────────
  const deduction = useStandardDeduction
    ? getStandardDeduction(filingStatus as FilingStatus)
    : itemizedDeductions;

  const taxableIncome = Math.max(0, agi - deduction);

  // ── Step 4: Federal income tax ────────────────────────────────────────────
  const federalBrackets = getFederalBrackets(filingStatus as FilingStatus);
  const {
    totalTax: federalTax,
    details: bracketDetails,
    marginalRate,
  } = calculateBracketTax(taxableIncome, federalBrackets);

  // ── Step 5: State income tax ───────────────────────────────────────────────
  let stateTax = 0;
  const stateKey = (state ?? '').toUpperCase();

  if (stateKey && !ZERO_TAX_STATES.has(stateKey)) {
    const stateConfig = (usSlabs.states as Record<string, { type: string; brackets: { min: number; max: number | null; rate: number }[] }>)[stateKey];
    if (stateConfig && stateConfig.type === 'progressive' && stateConfig.brackets.length > 0) {
      // Apply state brackets to taxable income (reuse AGI minus same deduction)
      const { totalTax: sStateTax } = calculateBracketTax(taxableIncome, stateConfig.brackets);
      stateTax = sStateTax;
    }
  }

  // ── Step 6: Totals ────────────────────────────────────────────────────────
  const totalTax     = federalTax + ficaTotal + stateTax;
  const netIncome    = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? totalTax / grossIncome : 0;

  // ── Step 7: Breakdown ─────────────────────────────────────────────────────
  const breakdown: TaxBreakdownItem[] = [
    {
      label: 'Federal Income Tax',
      amount: federalTax,
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

  if (stateTax > 0) {
    breakdown.push({
      label: 'State Income Tax',
      amount: stateTax,
      color: '#6366f1',
    });
  }

  // ── Step 8: Tips ──────────────────────────────────────────────────────────
  const tips: SavingTip[] = buildTips(input, taxableIncome, marginalRate);

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
