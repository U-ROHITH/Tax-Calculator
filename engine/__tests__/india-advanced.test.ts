import { describe, it, expect } from 'vitest';
import { calculateIndiaTax } from '../india';
import { IndiaInput } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newInput(overrides: Partial<IndiaInput>): IndiaInput {
  return {
    country: 'IN',
    regime: 'new',
    ...overrides,
  };
}

function oldInput(overrides: Partial<IndiaInput>): IndiaInput {
  return {
    country: 'IN',
    regime: 'old',
    age: 'below60',
    ...overrides,
  };
}

// ─── Section 50C ─────────────────────────────────────────────────────────────

describe('Section 50C — Stamp Duty Deemed Consideration', () => {
  it('property sale ₹80L, stamp duty value ₹95L → CG computed on ₹95L, not ₹80L', () => {
    // Cost ₹40L acquired in 2015, sale value ₹80L, stamp duty value ₹95L
    // CII 2015 = 254, CII 2025 = 376
    // Indexed cost = 40,00,000 * (376/254) = 59,21,260 (approx)
    // Without 50C: gain = 80,00,000 - 59,21,260 = 20,78,740
    // With 50C: gain = 95,00,000 - 59,21,260 = 35,78,740

    const withStampDuty = calculateIndiaTax(newInput({
      capitalGains: [{
        assetType: 'property',
        gainType: 'long',
        amount: 0,
        saleValue: 8000000,
        stampDutyValue: 9500000,
        costOfAcquisition: 4000000,
        yearOfAcquisition: 2015,
      }],
    }));

    const withoutStampDuty = calculateIndiaTax(newInput({
      capitalGains: [{
        assetType: 'property',
        gainType: 'long',
        amount: 0,
        saleValue: 8000000,
        costOfAcquisition: 4000000,
        yearOfAcquisition: 2015,
      }],
    }));

    // With Section 50C, the gain (and thus tax) should be higher
    expect(withStampDuty.capitalGainsTax).toBeGreaterThan(withoutStampDuty.capitalGainsTax!);

    // The difference in gain is ₹15L (9500000 - 8000000), taxed at 20% = ₹3L
    // capitalGainsTax is specialRateTax (before cess), so difference = 1500000 * 20% = 3,00,000
    const taxDifference = withStampDuty.capitalGainsTax! - withoutStampDuty.capitalGainsTax!;
    expect(taxDifference).toBeCloseTo(1500000 * 0.20, -3);
  });
});

// ─── Section 56(2)(x) — Gift Tax ─────────────────────────────────────────────

describe('Section 56(2)(x) — Gift Tax', () => {
  it('gift ₹1L from non-relative → ₹1L added to other sources income', () => {
    const withGift = calculateIndiaTax(newInput({
      grossSalary: 1000000,
      giftReceived: 100000,
      giftFromRelative: false,
    }));

    const withoutGift = calculateIndiaTax(newInput({
      grossSalary: 1000000,
    }));

    // Gift should increase gross total income by ₹1L
    expect(withGift.grossTotalIncome!).toBeGreaterThan(withoutGift.grossTotalIncome!);
    expect(withGift.grossTotalIncome! - withoutGift.grossTotalIncome!).toBe(100000);
  });

  it('gift ₹1L from relative (giftFromRelative: true) → 0 added to income', () => {
    const withRelativeGift = calculateIndiaTax(newInput({
      grossSalary: 1000000,
      giftReceived: 100000,
      giftFromRelative: true,
    }));

    const withoutGift = calculateIndiaTax(newInput({
      grossSalary: 1000000,
    }));

    // Relative gift is fully exempt — income should be the same
    expect(withRelativeGift.grossTotalIncome!).toBe(withoutGift.grossTotalIncome!);
  });

  it('gift ₹40,000 from non-relative → 0 added (below ₹50,000 threshold)', () => {
    const withSmallGift = calculateIndiaTax(newInput({
      grossSalary: 1000000,
      giftReceived: 40000,
      giftFromRelative: false,
    }));

    const withoutGift = calculateIndiaTax(newInput({
      grossSalary: 1000000,
    }));

    // Below ₹50,000 threshold — exempt
    expect(withSmallGift.grossTotalIncome!).toBe(withoutGift.grossTotalIncome!);
  });
});

// ─── ESOP Perquisite ──────────────────────────────────────────────────────────

describe('ESOP Perquisite', () => {
  it('esopPerquisite ₹5L → added to salary income, taxed at slab', () => {
    const withESOPPerq = calculateIndiaTax(newInput({
      grossSalary: 1000000,
      esopPerquisite: 500000,
    }));

    const withoutESOPPerq = calculateIndiaTax(newInput({
      grossSalary: 1000000,
    }));

    // ESOP perquisite should increase salary income
    expect(withESOPPerq.salaryIncome!).toBeGreaterThan(withoutESOPPerq.salaryIncome!);
    expect(withESOPPerq.salaryIncome! - withoutESOPPerq.salaryIncome!).toBe(500000);

    // Total tax should also be higher
    expect(withESOPPerq.totalTax).toBeGreaterThan(withoutESOPPerq.totalTax);
  });

  it('ESOP subsequent gain (short) → added to slab income', () => {
    // Use a high salary so both cases are clearly taxable (above 87A rebate limit)
    const withESOPGain = calculateIndiaTax(newInput({
      grossSalary: 2000000,
      esopSubsequentGain: [{ gainType: 'short', amount: 200000 }],
    }));

    const withoutESOPGain = calculateIndiaTax(newInput({
      grossSalary: 2000000,
    }));

    // Short ESOP gain taxed at slab — gross income increases by ₹2L
    expect(withESOPGain.grossTotalIncome!).toBeGreaterThan(withoutESOPGain.grossTotalIncome!);
    expect(withESOPGain.grossTotalIncome! - withoutESOPGain.grossTotalIncome!).toBe(200000);
    expect(withESOPGain.totalTax).toBeGreaterThan(withoutESOPGain.totalTax);
  });

  it('ESOP subsequent gain (long) → added to equity LTCG pool, taxed at 12.5%', () => {
    // With long ESOP gain of ₹5L, only ₹5L - ₹1.25L = ₹3.75L taxed at 12.5%
    const withESOPLongGain = calculateIndiaTax(newInput({
      grossSalary: 500000,
      esopSubsequentGain: [{ gainType: 'long', amount: 500000 }],
    }));

    expect(withESOPLongGain.capitalGainsTax).toBeGreaterThan(0);
    // capitalGainsTax = specialRateTax (before cess)
    // 3.75L × 12.5% = 46,875
    expect(withESOPLongGain.capitalGainsTax!).toBeCloseTo(375000 * 0.125, -2);
  });
});

// ─── Clubbing of Minor Child Income ──────────────────────────────────────────

describe('Clubbing of Minor Child Income', () => {
  it('minorChildIncome ₹20,000 → ₹18,500 (₹20K - ₹1,500 exempt) added to income', () => {
    const withClubbedIncome = calculateIndiaTax(newInput({
      grossSalary: 1000000,
      minorChildIncome: 20000,
    }));

    const withoutClubbedIncome = calculateIndiaTax(newInput({
      grossSalary: 1000000,
    }));

    // ₹20,000 - ₹1,500 = ₹18,500 should be added to income
    const incomeIncrease = withClubbedIncome.grossTotalIncome! - withoutClubbedIncome.grossTotalIncome!;
    expect(incomeIncrease).toBe(18500);
  });

  it('minorChildIncome ₹1,000 → ₹0 added (below ₹1,500 exemption)', () => {
    const withSmallClubbedIncome = calculateIndiaTax(newInput({
      grossSalary: 1000000,
      minorChildIncome: 1000,
    }));

    const withoutClubbedIncome = calculateIndiaTax(newInput({
      grossSalary: 1000000,
    }));

    // Below ₹1,500 exemption — no addition
    expect(withSmallClubbedIncome.grossTotalIncome!).toBe(withoutClubbedIncome.grossTotalIncome!);
  });
});

// ─── Section 80-IAC Startup Tax Holiday ──────────────────────────────────────

describe('Section 80-IAC — Startup Deduction', () => {
  it('businessProfit ₹10L, section80IAC ₹10L → zero taxable business income', () => {
    const with80IAC = calculateIndiaTax(oldInput({
      businessType: 'regular',
      businessProfit: 1000000,
      section80IAC: 1000000,
    }));

    // After 80-IAC deduction, taxable income should be 0
    expect(with80IAC.taxableIncome).toBe(0);
    expect(with80IAC.totalTax).toBe(0);
  });

  it('businessProfit ₹10L, section80IAC ₹5L → ₹5L taxable', () => {
    const withPartial80IAC = calculateIndiaTax(oldInput({
      businessType: 'regular',
      businessProfit: 1000000,
      section80IAC: 500000,
    }));

    const withoutIAC = calculateIndiaTax(oldInput({
      businessType: 'regular',
      businessProfit: 1000000,
    }));

    // Partial deduction should reduce taxable income by ₹5L
    expect(withPartial80IAC.taxableIncome!).toBeLessThan(withoutIAC.taxableIncome!);
    expect(withoutIAC.taxableIncome! - withPartial80IAC.taxableIncome!).toBe(500000);
  });

  it('80-IAC not applicable for 44AD business', () => {
    const with44AD = calculateIndiaTax(oldInput({
      businessType: '44AD',
      turnover44AD: 5000000,
      section80IAC: 1000000,
    }));

    const without80IAC = calculateIndiaTax(oldInput({
      businessType: '44AD',
      turnover44AD: 5000000,
    }));

    // 80-IAC should have no effect on presumptive income
    expect(with44AD.taxableIncome).toBe(without80IAC.taxableIncome);
  });
});
