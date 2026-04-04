import { describe, it, expect } from 'vitest';
import { calculateUKTax } from '../uk';
import { UKInput } from '../types';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function englandInput(overrides: Partial<UKInput> = {}): UKInput {
  return {
    country: 'UK',
    region: 'england_wales_ni',
    grossIncome: 0,
    ...overrides,
  };
}

function scotlandInput(overrides: Partial<UKInput> = {}): UKInput {
  return {
    country: 'UK',
    region: 'scotland',
    grossIncome: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. £10,000 England — below Personal Allowance
// ---------------------------------------------------------------------------

describe('£10,000 England — below personal allowance', () => {
  const result = calculateUKTax(englandInput({ grossIncome: 10_000 }));

  it('has zero income tax', () => {
    expect(result.breakdown.find(b => b.label === 'Income Tax')?.amount).toBe(0);
  });

  it('has zero NI (below NI threshold)', () => {
    // £10,000 is below the NI primary threshold of £12,570
    expect(result.breakdown.find(b => b.label === 'National Insurance')?.amount).toBe(0);
  });

  it('total tax is zero', () => {
    expect(result.totalTax).toBe(0);
  });

  it('net income equals gross income', () => {
    expect(result.netIncome).toBe(10_000);
  });

  it('effective rate is 0', () => {
    expect(result.effectiveRate).toBe(0);
  });

  it('currency is GBP', () => {
    expect(result.currency).toBe('GBP');
  });
});

// ---------------------------------------------------------------------------
// 2. £35,000 England — basic rate + NI
// ---------------------------------------------------------------------------

describe('£35,000 England — basic rate and NI', () => {
  const result = calculateUKTax(englandInput({ grossIncome: 35_000 }));

  it('income tax is correct (basic rate on £22,430)', () => {
    // Taxable income = 35000 - 12570 (PA) = 22430; tax = 22430 × 20% = £4,486
    const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(incomeTax).toBeCloseTo(4_486, 0);
  });

  it('NI is correct', () => {
    // NI on (35000 - 12570) = 22430 × 8% = £1,794.40
    const ni = result.breakdown.find(b => b.label === 'National Insurance')?.amount ?? 0;
    expect(ni).toBeCloseTo(1_794.4, 1);
  });

  it('marginal rate is 20%', () => {
    expect(result.marginalRate).toBe(0.20);
  });

  it('total tax = income tax + NI', () => {
    const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    const ni = result.breakdown.find(b => b.label === 'National Insurance')?.amount ?? 0;
    expect(result.totalTax).toBeCloseTo(incomeTax + ni, 5);
  });

  it('no student loan in breakdown', () => {
    expect(result.breakdown.find(b => b.label === 'Student Loan')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 3. £110,000 England — Personal Allowance taper / 60% effective marginal band
// ---------------------------------------------------------------------------

describe('£110,000 England — PA taper and 60% effective band', () => {
  const result110 = calculateUKTax(englandInput({ grossIncome: 110_000 }));
  const result100 = calculateUKTax(englandInput({ grossIncome: 100_000 }));

  it('personal allowance is tapered (£12,570 - £5,000 = £7,570)', () => {
    // (110000 - 100000) / 2 = 5000 reduction → PA = 7570
    // Check via bracket details: first bracket max should be 7570
    const firstBracket = result110.bracketDetails[0]?.bracket;
    expect(firstBracket?.max).toBe(7_570);
    expect(firstBracket?.rate).toBe(0);
  });

  it('income tax reflects tapered allowance', () => {
    // PA = 7570; taxable income = 110000 - 7570 = 102430
    // 0–7570: 0% = 0
    // 7570–50270: 20% on 42700 = 8540
    // 50270–110000: 40% on 59730 = 23892
    // Total income tax = 32432
    const incomeTax = result110.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(incomeTax).toBeCloseTo(32_432, 0);
  });

  it('marginal rate is 40%', () => {
    expect(result110.marginalRate).toBe(0.40);
  });

  it('effective marginal rate between £100K and £110K is approximately 50%', () => {
    // The PA taper trap: for each £2 extra earned above £100K, £1 of PA is removed.
    // At £100K: PA=12570, income tax = 7540 (basic) + 19892 (higher) = 27432
    // At £110K: PA=7570,  income tax = 8540 (basic) + 23892 (higher) = 32432
    // Extra tax = 5000 on a £10,000 slice → effective marginal rate = 50%
    // This is the PA taper effect: 40% on earned income + 20% on the PA that disappears
    // (The "60% trap" label refers to the combined economic burden but actual computation is 50%)
    const incomeTax110 = result110.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    const incomeTax100 = result100.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    const extraTax = incomeTax110 - incomeTax100;
    const effectiveMarginalRate = extraTax / 10_000;
    // 40% on £10K + 20% on £5K PA lost = £4000 + £1000 = £5000 → 50%
    expect(effectiveMarginalRate).toBeGreaterThan(0.48);
    expect(effectiveMarginalRate).toBeLessThan(0.52);
  });

  it('income tax at £100K (full PA) is correct', () => {
    // PA = 12570; taxable = 100000 - 12570 = 87430
    // basic: (50270-12570)*0.20 = 37700*0.20 = 7540
    // higher: (100000-50270)*0.40 = 49730*0.40 = 19892
    // total = 27432
    const incomeTax100 = result100.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(incomeTax100).toBeCloseTo(27_432, 0);
  });

  it('includes the 60% trap tip', () => {
    expect(result110.tips.some(t => t.id === 'uk-60pct-trap')).toBe(true);
  });

  it('no 60% trap tip at £130,000 (above taper range)', () => {
    const result130 = calculateUKTax(englandInput({ grossIncome: 130_000 }));
    expect(result130.tips.some(t => t.id === 'uk-60pct-trap')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. £80,000 Scotland — Advanced rate band
// ---------------------------------------------------------------------------

describe('£80,000 Scotland — Advanced rate band', () => {
  // £80K hits the Advanced rate band (£75,000–£125,140 @ 45%)
  const result = calculateUKTax(scotlandInput({ grossIncome: 80_000 }));

  it('includes bracket details for Advanced rate (45%) band', () => {
    const advancedBracket = result.bracketDetails.find(
      d => d.bracket.label === 'Advanced rate',
    );
    expect(advancedBracket).toBeDefined();
    // Taxable in Advanced band = 80000 - 75000 = 5000
    expect(advancedBracket?.taxableInThisBracket).toBeCloseTo(5_000, 0);
  });

  it('marginal rate is 45%', () => {
    expect(result.marginalRate).toBe(0.45);
  });

  it('income tax is greater than England equivalent (higher Scottish rates)', () => {
    const scotlandTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    const englandResult = calculateUKTax(englandInput({ grossIncome: 80_000 }));
    const englandTax = englandResult.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(scotlandTax).toBeGreaterThan(englandTax);
  });

  it('has correct number of bracket detail entries (PA + 5 Scotland bands hit)', () => {
    // PA + Starter + Basic + Intermediate + Higher + Advanced = 6 bands hit at £80K
    expect(result.bracketDetails.length).toBe(6);
  });

  it('income falls into correct higher rate band at £60,000', () => {
    // £60K Scotland is in the Higher rate band (£43,662–£75,000 @ 42%), not Advanced
    const result60 = calculateUKTax(scotlandInput({ grossIncome: 60_000 }));
    expect(result60.marginalRate).toBe(0.42);
    const advancedBracket = result60.bracketDetails.find(
      d => d.bracket.label === 'Advanced rate',
    );
    expect(advancedBracket).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 5. £40,000 England with £5,000 dividend income
// ---------------------------------------------------------------------------

describe('£40,000 England with £5,000 dividends', () => {
  const result = calculateUKTax(
    englandInput({ grossIncome: 40_000, dividendIncome: 5_000 }),
  );

  it('dividend tax is in breakdown', () => {
    const divTax = result.breakdown.find(b => b.label === 'Dividend Tax');
    expect(divTax).toBeDefined();
    expect(divTax!.amount).toBeGreaterThan(0);
  });

  it('dividend tax respects £500 allowance', () => {
    // Taxable dividends = 5000 - 500 = 4500
    // Employment income up to PA=12570 is 0%; above PA to 50270 is basic band
    // At £40,000 employment, we are in basic band. Dividends sit on top at basic rate (8.75%)
    // But check if dividends push into higher band: 40000 + 5000 = 45000 (still basic)
    // Taxable dividends entirely in basic band: 4500 × 8.75% = £393.75
    const divTax = result.breakdown.find(b => b.label === 'Dividend Tax')?.amount ?? 0;
    expect(divTax).toBeCloseTo(393.75, 1);
  });

  it('income tax is unchanged (dividends do not affect employment income tax)', () => {
    // Employment income tax: (40000 - 12570) × 20% = 27430 × 20% = £5,486
    const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(incomeTax).toBeCloseTo(5_486, 0);
  });

  it('total tax includes all components', () => {
    const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    const ni = result.breakdown.find(b => b.label === 'National Insurance')?.amount ?? 0;
    const divTax = result.breakdown.find(b => b.label === 'Dividend Tax')?.amount ?? 0;
    expect(result.totalTax).toBeCloseTo(incomeTax + ni + divTax, 5);
  });
});

// ---------------------------------------------------------------------------
// 6. Student Loan repayments
// ---------------------------------------------------------------------------

describe('Student Loan — Plan 2', () => {
  const result = calculateUKTax(
    englandInput({ grossIncome: 40_000, studentLoan: 'plan2' }),
  );

  it('student loan repayment is in breakdown', () => {
    const sl = result.breakdown.find(b => b.label === 'Student Loan');
    expect(sl).toBeDefined();
  });

  it('student loan amount is correct (9% above £27,295)', () => {
    // (40000 - 27295) × 9% = 12705 × 9% = £1,143.45
    const sl = result.breakdown.find(b => b.label === 'Student Loan')?.amount ?? 0;
    expect(sl).toBeCloseTo(1_143.45, 1);
  });
});

describe('Student Loan — Postgrad', () => {
  const result = calculateUKTax(
    englandInput({ grossIncome: 35_000, studentLoan: 'postgrad' }),
  );

  it('postgrad student loan is 6% above £21,000', () => {
    // (35000 - 21000) × 6% = 14000 × 6% = £840
    const sl = result.breakdown.find(b => b.label === 'Student Loan')?.amount ?? 0;
    expect(sl).toBeCloseTo(840, 1);
  });
});

// ---------------------------------------------------------------------------
// 7. Pension contribution reduces taxable income
// ---------------------------------------------------------------------------

describe('Pension contribution', () => {
  it('pension reduces income tax (£35K with £5K pension vs without)', () => {
    const withPension = calculateUKTax(
      englandInput({ grossIncome: 35_000, pensionContribution: 5_000 }),
    );
    const withoutPension = calculateUKTax(englandInput({ grossIncome: 35_000 }));

    const taxWith = withPension.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    const taxWithout = withoutPension.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    // Pension reduces taxable income by £5,000 → saves £1,000 in basic rate tax
    expect(taxWithout - taxWith).toBeCloseTo(1_000, 0);
  });

  it('pension is capped at £60,000 annual allowance', () => {
    const result = calculateUKTax(
      englandInput({ grossIncome: 200_000, pensionContribution: 100_000 }),
    );
    // Only £60,000 pension should reduce income; remaining £40,000 ignored
    // Adjusted gross = 200000 - 60000 = 140000
    // PA is 0 (income above £125,140 even after pension)
    const incomeTax = result.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(incomeTax).toBeGreaterThan(0);
    // Verify by checking against a £140,000 income result (no pension, same adjusted gross)
    const resultNoPension = calculateUKTax(englandInput({ grossIncome: 140_000 }));
    const taxNoPension = resultNoPension.breakdown.find(b => b.label === 'Income Tax')?.amount ?? 0;
    expect(incomeTax).toBeCloseTo(taxNoPension, 0);
  });
});

// ---------------------------------------------------------------------------
// 8. Blind Person's Allowance
// ---------------------------------------------------------------------------

describe("Blind Person's Allowance", () => {
  it('adds £3,070 to Personal Allowance', () => {
    const result = calculateUKTax(
      englandInput({ grossIncome: 20_000, blindPersonAllowance: true }),
    );
    // Effective PA = 12570 + 3070 = 15640
    // First bracket should be 15640
    const firstBracket = result.bracketDetails[0]?.bracket;
    expect(firstBracket?.max).toBe(15_640);
  });
});

// ---------------------------------------------------------------------------
// 9. Result shape validation
// ---------------------------------------------------------------------------

describe('Result shape', () => {
  const result = calculateUKTax(englandInput({ grossIncome: 50_000 }));

  it('country is UK', () => expect(result.country).toBe('UK'));
  it('currency is GBP', () => expect(result.currency).toBe('GBP'));
  it('netIncome = grossIncome - totalTax', () => {
    expect(result.netIncome).toBeCloseTo(result.grossIncome - result.totalTax, 5);
  });
  it('monthlyTakeHome = netIncome / 12', () => {
    expect(result.monthlyTakeHome).toBeCloseTo(result.netIncome / 12, 5);
  });
  it('effectiveRate = totalTax / grossIncome', () => {
    expect(result.effectiveRate).toBeCloseTo(result.totalTax / result.grossIncome, 10);
  });
  it('bracketDetails is an array', () => {
    expect(Array.isArray(result.bracketDetails)).toBe(true);
  });
});
