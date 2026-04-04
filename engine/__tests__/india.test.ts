import { describe, it, expect } from 'vitest';
import { calculateIndiaTax } from '../india';
import { IndiaInput } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newInput(overrides: Partial<IndiaInput> & { grossIncome: number }): IndiaInput {
  return {
    country: 'IN',
    regime: 'new',
    ...overrides,
  };
}

function oldInput(overrides: Partial<IndiaInput> & { grossIncome: number }): IndiaInput {
  return {
    country: 'IN',
    regime: 'old',
    age: 'below60',
    ...overrides,
  };
}

// ─── New Regime ───────────────────────────────────────────────────────────────

describe('New Regime', () => {
  it('₹3,00,000 → ₹0 tax (below exemption after std deduction)', () => {
    // Taxable = 3,00,000 - 75,000 = 2,25,000 → all in 0% slab
    const result = calculateIndiaTax(newInput({ grossIncome: 300000 }));

    expect(result.country).toBe('IN');
    expect(result.currency).toBe('INR');
    expect(result.regime).toBe('new');
    expect(result.grossIncome).toBe(300000);
    expect(result.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.netIncome).toBe(300000);
    expect(result.monthlyTakeHome).toBeCloseTo(25000, 0);
  });

  it('₹8,00,000 → ₹0 tax (87A rebate wipes full liability)', () => {
    // Taxable = 7,25,000
    // Tax on 7,25,000 = 4L@0% + 3.25L@5% = 16,250
    // 7,25,000 ≤ 12,75,000 → rebate = min(16,250, 60,000) = 16,250
    // Tax after rebate = 0 → cess = 0 → total = 0
    const result = calculateIndiaTax(newInput({ grossIncome: 800000 }));

    expect(result.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it('₹12,00,000 → ₹0 tax (52,500 < rebate limit of 60,000)', () => {
    // Taxable = 11,25,000
    // Tax = 4L@0% + 4L@5% + 3.25L@10% = 0 + 20,000 + 32,500 = 52,500
    // 11,25,000 ≤ 12,75,000 → rebate = 52,500 → tax = 0
    const result = calculateIndiaTax(newInput({ grossIncome: 1200000 }));

    expect(result.totalTax).toBe(0);
    expect(result.marginalRate).toBeCloseTo(0.1, 5);
  });

  it('₹15,00,000 → ₹97,500 tax (no rebate, 4% cess)', () => {
    // Taxable = 15,00,000 - 75,000 = 14,25,000
    // New regime brackets: 0-4L@0%, 4L-8L@5%, 8L-12L@10%, 12L-16L@15%, 16L-20L@20%
    // Tax = 4L@0% + 4L@5% + 4L@10% + 2.25L@15%
    //     = 0 + 20,000 + 40,000 + 33,750 = 93,750
    // 14,25,000 > 12,75,000 → no rebate; no surcharge (< 50L gross)
    // Cess = 4% × 93,750 = 3,750
    // Total = 97,500
    const result = calculateIndiaTax(newInput({ grossIncome: 1500000 }));

    expect(result.totalTax).toBe(97500);
    expect(result.marginalRate).toBeCloseTo(0.15, 5);
    expect(result.effectiveRate).toBeCloseTo(97500 / 1500000, 6);
    expect(result.netIncome).toBe(1500000 - 97500);
    expect(result.monthlyTakeHome).toBeCloseTo((1500000 - 97500) / 12, 0);
  });

  it('₹0 income → ₹0 tax', () => {
    const result = calculateIndiaTax(newInput({ grossIncome: 0 }));
    expect(result.totalTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.netIncome).toBe(0);
  });

  it('₹12,75,000 exactly (at rebate threshold boundary) → ₹0 tax', () => {
    // Taxable = 12,75,000 - 75,000 = 12,00,000
    // Tax on 12,00,000 = 4L@0% + 4L@5% + 4L@10% + 0 = 0+20K+40K = 60,000
    // 12,00,000 ≤ 12,75,000 → rebate = min(60,000, 60,000) = 60,000 → tax = 0
    const result = calculateIndiaTax(newInput({ grossIncome: 1275000 }));
    expect(result.totalTax).toBe(0);
  });

  it('breakdown contains Health & Education Cess entry when tax > 0', () => {
    // Taxable = 14,25,000; income tax = 93,750; cess = 4% × 93,750 = 3,750
    const result = calculateIndiaTax(newInput({ grossIncome: 1500000 }));
    const cessItem = result.breakdown.find((b) => b.label === 'Health & Education Cess');
    expect(cessItem).toBeDefined();
    expect(cessItem!.amount).toBe(3750);
  });

  it('bracketDetails array is non-empty for non-zero taxable income', () => {
    const result = calculateIndiaTax(newInput({ grossIncome: 1500000 }));
    expect(result.bracketDetails.length).toBeGreaterThan(0);
  });
});

// ─── Old Regime ───────────────────────────────────────────────────────────────

describe('Old Regime', () => {
  it('Senior citizen 60-80 ₹6,00,000 → ₹20,800 tax', () => {
    // Taxable = 6,00,000 - 50,000 = 5,50,000
    // 60to80 brackets: 0-3L=0, 3L-5L@5%=10,000, 5L-5.5L@20%=10,000 → 20,000
    // 5,50,000 > 5,00,000 → no rebate
    // Cess = 4% × 20,000 = 800
    // Total = 20,800
    const result = calculateIndiaTax(
      oldInput({ grossIncome: 600000, age: '60to80' })
    );

    expect(result.totalTax).toBe(20800);
    expect(result.regime).toBe('old');
  });

  it('Super senior above 80 ₹6,00,000 → higher exemption = lower tax', () => {
    // above80: 0-5L=0, 5L-6L@20% → just 50K-50K(stdDed)=500K taxable
    // Wait: taxable = 6,00,000 - 50,000 = 5,50,000
    // above80: 0-5L@0%, 5L-5.5L@20% = 10,000
    // Cess = 400 → Total = 10,400
    const result = calculateIndiaTax(
      oldInput({ grossIncome: 600000, age: 'above80' })
    );

    expect(result.totalTax).toBe(10400);
  });

  it('below60 ₹5,00,000 → ₹0 tax (87A rebate)', () => {
    // Taxable = 5,00,000 - 50,000 = 4,50,000
    // Tax = 2.5L@0% + 2L@5% = 10,000
    // 4,50,000 ≤ 5,00,000 → rebate = min(10,000, 12,500) = 10,000 → tax = 0
    const result = calculateIndiaTax(oldInput({ grossIncome: 500000 }));
    expect(result.totalTax).toBe(0);
  });

  it('80C deduction capped at 1,50,000', () => {
    // With 80C = 2,00,000, only 1,50,000 should be deducted
    const withCap = calculateIndiaTax(
      oldInput({ grossIncome: 1500000, section80C: 200000 })
    );
    const withExact = calculateIndiaTax(
      oldInput({ grossIncome: 1500000, section80C: 150000 })
    );
    expect(withCap.totalTax).toBe(withExact.totalTax);
  });

  it('HRA exemption reduces taxable income correctly', () => {
    // metro city: exemption = min(hra, rentPaid - 10%*basic, 50%*basic)
    const withHRA = calculateIndiaTax(
      oldInput({
        grossIncome: 1200000,
        hra: 200000,
        rentPaid: 240000,
        basicSalary: 600000,
        metroCity: true,
      })
    );
    const withoutHRA = calculateIndiaTax(oldInput({ grossIncome: 1200000 }));

    // HRA exemption = min(200000, 240000-60000=180000, 300000) = 180000
    // withHRA should pay less tax
    expect(withHRA.totalTax).toBeLessThan(withoutHRA.totalTax);
  });

  it('HRA exemption = 0 when no rent paid or basic salary', () => {
    const result = calculateIndiaTax(
      oldInput({ grossIncome: 1200000, hra: 200000 }) // no rentPaid / basicSalary
    );
    const noHRA = calculateIndiaTax(oldInput({ grossIncome: 1200000 }));
    expect(result.totalTax).toBe(noHRA.totalTax);
  });

  it('80D senior limit is ₹50,000', () => {
    const seniorWith80D = calculateIndiaTax(
      oldInput({ grossIncome: 1500000, age: '60to80', section80D: 60000 })
    );
    const seniorCapped = calculateIndiaTax(
      oldInput({ grossIncome: 1500000, age: '60to80', section80D: 50000 })
    );
    expect(seniorWith80D.totalTax).toBe(seniorCapped.totalTax);
  });

  it('negative deductions are clamped to 0', () => {
    const withNeg = calculateIndiaTax(
      oldInput({ grossIncome: 1200000, section80C: -50000, section80D: -1000 })
    );
    const withZero = calculateIndiaTax(oldInput({ grossIncome: 1200000 }));
    expect(withNeg.totalTax).toBe(withZero.totalTax);
  });

  it('tips array contains 80C tip when section80C is not maxed', () => {
    const result = calculateIndiaTax(
      oldInput({ grossIncome: 1500000, section80C: 50000 })
    );
    const tip = result.tips.find((t) => t.id === 'in-80c');
    expect(tip).toBeDefined();
    expect(tip!.country).toBe('IN');
  });

  it('no 80C tip when section80C is already at limit', () => {
    const result = calculateIndiaTax(
      oldInput({ grossIncome: 1500000, section80C: 150000 })
    );
    const tip = result.tips.find((t) => t.id === 'in-80c');
    expect(tip).toBeUndefined();
  });
});

// ─── Auto Mode ────────────────────────────────────────────────────────────────

describe('Auto mode', () => {
  it('picks the lower-tax regime as primary result', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'auto',
      grossIncome: 1500000,
    });

    expect(result.alternateResult).toBeDefined();
    expect(result.totalTax).toBeLessThanOrEqual(result.alternateResult!.totalTax);
  });

  it('primary + alternate cover both regimes', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'auto',
      grossIncome: 1500000,
    });

    const regimes = new Set([result.regime, result.alternateResult!.regime]);
    expect(regimes.has('new')).toBe(true);
    expect(regimes.has('old')).toBe(true);
  });

  it('with large deductions old regime may win', () => {
    // 80C=150000, NPS=50000, 80D=25000, homeLoan=200000 → significant deductions
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'auto',
      grossIncome: 1800000,
      section80C: 150000,
      nps80CCD: 50000,
      section80D: 25000,
      homeLoanInterest: 200000,
    });

    // Just verify auto mode resolves without error and has both regimes covered
    expect(result.alternateResult).toBeDefined();
    const regimes = new Set([result.regime, result.alternateResult!.regime]);
    expect(regimes.size).toBe(2);
  });
});

// ─── Surcharge ────────────────────────────────────────────────────────────────

describe('Surcharge', () => {
  it('no surcharge below ₹50L gross', () => {
    const result = calculateIndiaTax(newInput({ grossIncome: 4000000 }));
    const surchargeItem = result.breakdown.find((b) => b.label === 'Surcharge');
    expect(surchargeItem).toBeUndefined();
  });

  it('10% surcharge applied above ₹50L gross (new regime)', () => {
    const result = calculateIndiaTax(newInput({ grossIncome: 6000000 }));
    const surchargeItem = result.breakdown.find((b) => b.label === 'Surcharge');
    expect(surchargeItem).toBeDefined();
    expect(surchargeItem!.rate).toBeCloseTo(0.1, 5);
  });
});

// ─── Structural invariants ───────────────────────────────────────────────────

describe('Structural invariants', () => {
  it('netIncome + totalTax === grossIncome', () => {
    const cases: IndiaInput[] = [
      newInput({ grossIncome: 0 }),
      newInput({ grossIncome: 500000 }),
      newInput({ grossIncome: 1500000 }),
      newInput({ grossIncome: 6000000 }),
      oldInput({ grossIncome: 600000, age: '60to80' }),
    ];

    for (const input of cases) {
      const result = calculateIndiaTax(input);
      expect(result.netIncome + result.totalTax).toBe(result.grossIncome);
    }
  });

  it('effectiveRate is always in [0, 1]', () => {
    const result = calculateIndiaTax(newInput({ grossIncome: 1500000 }));
    expect(result.effectiveRate).toBeGreaterThanOrEqual(0);
    expect(result.effectiveRate).toBeLessThanOrEqual(1);
  });

  it('monthlyTakeHome === netIncome / 12', () => {
    const result = calculateIndiaTax(newInput({ grossIncome: 1500000 }));
    expect(result.monthlyTakeHome).toBeCloseTo(result.netIncome / 12, 6);
  });
});
