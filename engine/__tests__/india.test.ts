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

// ─── Capital Gains ────────────────────────────────────────────────────────────

describe('Capital Gains', () => {
  it('equity STCG taxed at 20% flat (old regime)', () => {
    // grossIncome = 600000 (salary); equitySTCG = 100000
    // Salary taxable: 600000 - 50000 std = 550000
    // Slab tax (below60): 250K@0 + 250K@5% + 50K@20% = 12500 + 10000 = 22500
    // No 87A (total income > 500K), cess = 22500 * 0.04 = 900 → slabTax = 23400
    // Equity STCG tax: 100000 * 0.20 = 20000; cess on STCG: 20000*0.04 = 800
    // Total = 23400 + 20800 = 44200
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 600000,
      capitalGains: [{ assetType: 'equity_mf', gainType: 'short', amount: 100000, sttPaid: true }],
    });
    const stcgItem = result.breakdown.find((b) => b.label === 'Equity STCG Tax (20%)');
    expect(stcgItem).toBeDefined();
    expect(stcgItem!.amount).toBe(20000);
  });

  it('equity LTCG exempt below ₹1,25,000 threshold', () => {
    // LTCG of ₹100,000 — fully exempt
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 800000,
      capitalGains: [{ assetType: 'equity_mf', gainType: 'long', amount: 100000, sttPaid: true }],
    });
    const ltcgItem = result.breakdown.find((b) => b.label === 'Equity LTCG Tax (12.5%)');
    expect(ltcgItem).toBeUndefined();
  });

  it('equity LTCG taxable portion above ₹1,25,000', () => {
    // LTCG = 200000; taxable = 200000 - 125000 = 75000; tax = 75000 * 0.125 = 9375
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 300000, // below std ded → zero salary tax
      capitalGains: [{ assetType: 'equity_mf', gainType: 'long', amount: 200000, sttPaid: true }],
    });
    const ltcgItem = result.breakdown.find((b) => b.label === 'Equity LTCG Tax (12.5%)');
    expect(ltcgItem).toBeDefined();
    // 75000 * 0.125 = 9375
    expect(ltcgItem!.amount).toBe(9375);
  });

  it('debt MF gains added to slab income', () => {
    // Debt STCG 200000 added to taxable income at slab rate
    const withDebt = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 600000,
      capitalGains: [{ assetType: 'debt_mf', gainType: 'short', amount: 200000 }],
    });
    const withoutDebt = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 600000,
    });
    // withDebt should pay more tax (debt CG at slab)
    expect(withDebt.totalTax).toBeGreaterThan(withoutDebt.totalTax);
  });

  it('property LTCG with indexation: 20% on indexed gain', () => {
    // Sale: 5000000, cost: 2000000, purchased FY 2015 (CII=254), current CII=376
    // Indexed cost = 2000000 * (376/254) = 2960629.9
    // Gain = 5000000 - 2960629.9 = 2039370.1
    // Tax = 2039370.1 * 0.20 = 407874.02 → round to 407874
    // Add cess: 407874 * 0.04 = 16315 → 424189 (rough)
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 0,
      capitalGains: [{
        assetType: 'property',
        gainType: 'long',
        amount: 0,
        saleValue: 5000000,
        costOfAcquisition: 2000000,
        yearOfAcquisition: 2015,
      }],
    });
    const propLTCGItem = result.breakdown.find((b) => b.label === 'Property LTCG Tax (20%)');
    expect(propLTCGItem).toBeDefined();
    expect(propLTCGItem!.amount).toBeGreaterThan(0);
  });

  it('lottery winnings taxed at 30%', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      lotteryWinnings: 500000,
    });
    const lotteryItem = result.breakdown.find((b) => b.label === 'Lottery/Winnings Tax (30%)');
    expect(lotteryItem).toBeDefined();
    // 500000 * 0.30 = 150000; cess = 150000 * 0.04 = 6000
    expect(lotteryItem!.amount).toBe(150000);
    expect(result.totalTax).toBe(Math.round(150000 * 1.04)); // 156000
  });
});

// ─── House Property ───────────────────────────────────────────────────────────

describe('House Property', () => {
  it('self-occupied property: interest capped at ₹2L loss', () => {
    // Salary 1200000, old regime; home loan interest 300000 → capped at 200000
    const withLoan = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1200000,
      properties: [{
        type: 'self_occupied',
        homeLoanInterest: 300000,
      }],
    });
    const withMaxLoan = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1200000,
      properties: [{
        type: 'self_occupied',
        homeLoanInterest: 200000,
      }],
    });
    // Both should have same tax (300K capped at 200K)
    expect(withLoan.totalTax).toBe(withMaxLoan.totalTax);
  });

  it('let-out property: full interest deductible, net income positive', () => {
    // Rent 300000/yr, municipal tax 30000, std ded 30% = 81000, no loan interest
    // NAV = 300000 - 30000 = 270000; stdDed = 81000; HP income = 189000
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 0,
      properties: [{
        type: 'let_out',
        annualRentReceived: 300000,
        municipalTaxPaid: 30000,
        homeLoanInterest: 0,
      }],
    });
    expect(result.housePropertyIncome).toBeCloseTo(189000, 0);
  });

  it('let-out property with large loan interest: can produce HP loss', () => {
    // Rent 300000, no municipal, std ded 90000, loan interest 500000
    // HP income = 270000 - 90000 - 500000 = -320000 → capped loss -200000
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1200000,
      properties: [{
        type: 'let_out',
        annualRentReceived: 300000,
        municipalTaxPaid: 0,
        homeLoanInterest: 500000,
      }],
    });
    // The HP loss (capped at -200000) reduces salary income
    const noLoan = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1200000,
    });
    expect(result.totalTax).toBeLessThan(noLoan.totalTax);
  });

  it('new regime: house property loss not allowed as set-off', () => {
    const withLoss = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1200000,
      properties: [{ type: 'self_occupied', homeLoanInterest: 200000 }],
    });
    const noLoss = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1200000,
    });
    // In new regime, HP loss not set-off → same tax
    expect(withLoss.totalTax).toBe(noLoss.totalTax);
  });
});

// ─── Presumptive Income (44AD / 44ADA) ───────────────────────────────────────

describe('Presumptive Income', () => {
  it('44AD: 8% of turnover (cash receipts)', () => {
    // Turnover 2000000, cash → 8% = 160000 presumptive income
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: '44AD',
      turnover44AD: 2000000,
      digitalReceipts44AD: false,
    });
    // Business income = 160000, new regime std ded applies only to salary
    // No salary → grossSalary = 0, stdDeduction from salary = 75000 but salary is 0
    // GTI = 160000, taxable = 160000 (no salary std deduction applies here)
    // 0-4L@0% → tax = 0; rebate → total = 0
    expect(result.businessIncome).toBe(160000);
    expect(result.totalTax).toBe(0);
  });

  it('44AD: 6% of turnover (digital receipts)', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: '44AD',
      turnover44AD: 1000000,
      digitalReceipts44AD: true,
    });
    // 6% of 1000000 = 60000
    expect(result.businessIncome).toBe(60000);
  });

  it('44ADA: 50% of professional gross receipts', () => {
    // Gross receipts 3000000 → 50% = 1500000 taxable profit
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: '44ADA',
      grossReceipts44ADA: 3000000,
    });
    expect(result.businessIncome).toBe(1500000);
  });

  it('44AD recommends ITR-4', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: '44AD',
      turnover44AD: 1000000,
    });
    expect(result.itrFormRecommended).toBe('ITR-4');
  });

  it('regular business recommends ITR-3', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: 'regular',
      businessProfit: 800000,
    });
    expect(result.itrFormRecommended).toBe('ITR-3');
  });
});

// ─── Deductions — Extended (Old Regime) ──────────────────────────────────────

describe('Extended Deductions (Old Regime)', () => {
  it('80CCD(1B) NPS: additional ₹50,000 over 80C', () => {
    // With and without 80CCD(1B) = 50000
    const with80CCD1B = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80C: 150000,
      section80CCD1B: 50000,
    });
    const without = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80C: 150000,
    });
    // 50000 at 30% bracket = 15000 tax saving + 4% cess = 15600
    expect(without.totalTax - with80CCD1B.totalTax).toBeCloseTo(15600, 0);
  });

  it('80CCD(1B) capped at ₹50,000', () => {
    const withExcess = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80CCD1B: 70000,
    });
    const withExact = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80CCD1B: 50000,
    });
    expect(withExcess.totalTax).toBe(withExact.totalTax);
  });

  it('80C + 80CCC + 80CCD1 combined cap at ₹1,50,000', () => {
    const withSplit = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80C: 80000,
      section80CCC: 40000,
      section80CCD1: 60000, // total = 180000 → capped at 150000
    });
    const withCapped = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80C: 150000,
    });
    expect(withSplit.totalTax).toBe(withCapped.totalTax);
  });

  it('80DD severe disability: ₹1,25,000 fixed deduction', () => {
    const withSevere = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80DD: 1, // flag to enable
      section80DD_severe: true,
    });
    const withNormal = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80DD: 1,
      section80DD_severe: false,
    });
    // Severe = 125000 vs Normal = 75000 → 50000 difference at 30% = 15000 + cess = 15600
    expect(withNormal.totalTax - withSevere.totalTax).toBeCloseTo(15600, 0);
  });

  it('80E education loan: no cap applied', () => {
    // Large education loan interest: 200000
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80E: 200000,
    });
    const noLoan = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
    });
    // 200000 deduction at 30% = 60000 + 4% cess = 62400
    expect(noLoan.totalTax - result.totalTax).toBeCloseTo(62400, 0);
  });

  it('80U self disability: ₹75,000 fixed deduction', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
      section80U: true,
    });
    const noDisability = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 1500000,
    });
    // 75000 at 30% = 22500 + cess = 23400
    expect(noDisability.totalTax - result.totalTax).toBeCloseTo(23400, 0);
  });
});

// ─── Senior Citizen Special Cases ────────────────────────────────────────────

describe('Senior Citizen (80TTB)', () => {
  it('senior 60to80: 80TTB covers FD interest up to ₹50,000', () => {
    // Senior with FD interest 60000 → 80TTB capped at 50000
    const with80TTB = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: '60to80',
      grossIncome: 800000,
      fdInterest: 60000,
      section80TTB: 60000,
    });
    const capped = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: '60to80',
      grossIncome: 800000,
      fdInterest: 60000,
      section80TTB: 50000,
    });
    expect(with80TTB.totalTax).toBe(capped.totalTax);
  });

  it('senior 60to80: 80TTB excludes 80TTA (superseded)', () => {
    // When age is senior, 80TTB applies, not 80TTA
    const seniorWith80TTA = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: '60to80',
      grossIncome: 800000,
      section80TTA: 10000, // should be ignored for senior; 80TTB applies
      fdInterest: 40000,
    });
    const seniorWith80TTB = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: '60to80',
      grossIncome: 800000,
      section80TTB: 40000,
      fdInterest: 40000,
    });
    // Both should give same result since 80TTB covers the same FD interest
    expect(seniorWith80TTA.totalTax).toBe(seniorWith80TTB.totalTax);
  });

  it('below60: 80TTA applies on savings interest (max ₹10,000)', () => {
    const withSavings = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 800000,
      savingsInterest: 15000, // only 10000 deductible under 80TTA
      section80TTA: 15000,
    });
    const capped = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      grossIncome: 800000,
      savingsInterest: 15000,
      section80TTA: 10000,
    });
    expect(withSavings.totalTax).toBe(capped.totalTax);
  });
});

// ─── Combined All-Sources Scenario ───────────────────────────────────────────

describe('All-Sources Combined', () => {
  it('salary + let-out property + 44ADA + equity LTCG + FD interest', () => {
    // This exercises all income heads simultaneously
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'old',
      age: 'below60',
      // Salary
      basicSalary: 600000,
      da: 60000,
      hra: 120000,
      rentPaid: 180000,
      metroCity: false,
      specialAllowance: 60000,
      bonus: 50000,
      // House property (let-out)
      properties: [{
        type: 'let_out',
        annualRentReceived: 240000,
        municipalTaxPaid: 10000,
        homeLoanInterest: 100000,
      }],
      // Business (44ADA)
      businessType: '44ADA',
      grossReceipts44ADA: 1000000, // 50% = 500000
      // Capital Gains
      capitalGains: [
        { assetType: 'equity_mf', gainType: 'long', amount: 200000, sttPaid: true }, // 75000 taxable at 12.5%
        { assetType: 'debt_mf', gainType: 'short', amount: 50000 }, // slab
      ],
      // Other sources
      fdInterest: 30000,
      dividendIncome: 20000,
      // Deductions
      section80C: 150000,
      section80CCD1B: 50000,
      section80D_self: 25000,
    });

    // Just verify it computes without errors and produces sensible results
    expect(result.country).toBe('IN');
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.grossTotalIncome).toBeGreaterThan(0);
    expect(result.itrFormRecommended).toBe('ITR-4'); // 44ADA → ITR-4
    expect(result.taxableIncome).toBeGreaterThanOrEqual(0);
    // Net income should be less than gross by totalTax
    expect(result.netIncome).toBe(result.grossIncome - result.totalTax);
  });

  it('auto mode works with all sources and picks lower tax regime', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'auto',
      age: 'below60',
      grossIncome: 1200000,
      section80C: 150000,
      section80CCD1B: 50000,
      section80D_self: 25000,
      fdInterest: 50000,
    });
    expect(result.alternateResult).toBeDefined();
    expect(result.totalTax).toBeLessThanOrEqual(result.alternateResult!.totalTax);
  });
});

// ─── Advance Tax Schedule ─────────────────────────────────────────────────────

describe('Advance Tax Schedule', () => {
  it('advance tax schedule generated when tax liability > ₹10,000', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1500000,
    });
    expect(result.advanceTaxSchedule).toBeDefined();
    expect(result.advanceTaxSchedule!.length).toBe(4);
  });

  it('last instalment equals 100% of tax', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1500000,
    });
    const lastInstalment = result.advanceTaxSchedule![3];
    expect(lastInstalment.cumulativePercent).toBe(1.0);
    expect(lastInstalment.amount).toBe(result.totalTaxPayable!);
  });

  it('no advance tax schedule when TDS covers full liability', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1500000,
      tdsDeducted: 200000, // more than totalTax = 97500
    });
    // totalTaxPayable = 0 → no advance tax needed
    expect(result.advanceTaxSchedule).toBeDefined();
    expect(result.advanceTaxSchedule!.length).toBe(0);
  });
});

// ─── ITR Form Recommendation ──────────────────────────────────────────────────

describe('ITR Form Recommendation', () => {
  it('salary-only below ₹50L with minimal other sources → ITR-1', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1200000,
    });
    expect(result.itrFormRecommended).toBe('ITR-1');
  });

  it('capital gains → ITR-2', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 1200000,
      capitalGains: [{ assetType: 'equity_mf', gainType: 'long', amount: 50000 }],
    });
    expect(result.itrFormRecommended).toBe('ITR-2');
  });

  it('44AD presumptive income → ITR-4', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: '44AD',
      turnover44AD: 5000000,
    });
    expect(result.itrFormRecommended).toBe('ITR-4');
  });

  it('regular business → ITR-3', () => {
    const result = calculateIndiaTax({
      country: 'IN',
      regime: 'new',
      grossIncome: 0,
      businessType: 'regular',
      businessProfit: 1000000,
    });
    expect(result.itrFormRecommended).toBe('ITR-3');
  });
});
