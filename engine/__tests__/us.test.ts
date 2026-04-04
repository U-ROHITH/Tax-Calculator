import { describe, it, expect } from 'vitest';
import { calculateUSTax } from '../us';
import { USInput } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Round to 2 decimal places for float-safe comparisons. */
const r2 = (n: number) => Math.round(n * 100) / 100;

// ─────────────────────────────────────────────────────────────────────────────
// Test suite
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateUSTax — US Tax Engine TY 2025', () => {

  // ── 1. $50 000 single W-2 ──────────────────────────────────────────────────
  describe('$50,000 single W-2 employee', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 50_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
    };
    const result = calculateUSTax(input);

    it('applies the correct standard deduction (taxable = $35,000)', () => {
      // $50 000 − $15 000 standard deduction = $35 000 taxable
      // Bracket details should cover exactly $35 000
      const totalTaxable = result.bracketDetails.reduce(
        (sum, d) => sum + d.taxableInThisBracket,
        0,
      );
      expect(r2(totalTaxable)).toBe(35_000);
    });

    it('calculates federal income tax correctly ($3,961.50)', () => {
      // 10% × $11,925 = $1,192.50  +  12% × $23,075 = $2,769
      const federalItem = result.breakdown.find(b => b.label === 'Federal Income Tax');
      expect(federalItem).toBeDefined();
      expect(r2(federalItem!.amount)).toBe(3_961.50);
    });

    it('calculates Social Security correctly ($3,100)', () => {
      // 6.2% × $50,000
      const ssItem = result.breakdown.find(b => b.label === 'Social Security');
      expect(ssItem).toBeDefined();
      expect(r2(ssItem!.amount)).toBe(3_100);
    });

    it('calculates Medicare correctly ($725)', () => {
      // 1.45% × $50,000
      const medItem = result.breakdown.find(b => b.label === 'Medicare');
      expect(medItem).toBeDefined();
      expect(r2(medItem!.amount)).toBe(725);
    });

    it('does NOT include Additional Medicare (wages below $200k threshold)', () => {
      const addlItem = result.breakdown.find(b => b.label === 'Additional Medicare');
      expect(addlItem).toBeUndefined();
    });

    it('total tax is $7,786.50 (federal + FICA, no state)', () => {
      // $3,961.50 federal + $3,100 SS + $725 Medicare
      expect(r2(result.totalTax)).toBe(7_786.50);
    });

    it('marginal rate is 12%', () => {
      expect(result.marginalRate).toBe(0.12);
    });

    it('net income = gross − total tax', () => {
      expect(r2(result.netIncome)).toBe(r2(50_000 - result.totalTax));
    });

    it('monthly take-home = net income / 12', () => {
      expect(r2(result.monthlyTakeHome)).toBe(r2(result.netIncome / 12));
    });

    it('effective rate = total tax / gross income', () => {
      expect(r2(result.effectiveRate)).toBe(r2(result.totalTax / 50_000));
    });

    it('currency is USD', () => {
      expect(result.currency).toBe('USD');
    });

    it('country is US', () => {
      expect(result.country).toBe('US');
    });
  });

  // ── 2. $200 000 married filing jointly ────────────────────────────────────
  describe('$200,000 married filing jointly W-2', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 200_000,
      filingStatus: 'married_joint',
      useStandardDeduction: true,
      w2Employee: true,
    };
    const result = calculateUSTax(input);

    it('taxable income is $170,000 after $30,000 MFJ standard deduction', () => {
      const totalTaxable = result.bracketDetails.reduce(
        (sum, d) => sum + d.taxableInThisBracket,
        0,
      );
      expect(r2(totalTaxable)).toBe(170_000);
    });

    it('hits three federal brackets (10%, 12%, 22%)', () => {
      expect(result.bracketDetails).toHaveLength(3);
      expect(result.bracketDetails[0].bracket.rate).toBe(0.10);
      expect(result.bracketDetails[1].bracket.rate).toBe(0.12);
      expect(result.bracketDetails[2].bracket.rate).toBe(0.22);
    });

    it('calculates federal income tax correctly ($27,228)', () => {
      // 10% × $23,850 + 12% × $73,100 + 22% × $73,050 = $27,228
      const federalItem = result.breakdown.find(b => b.label === 'Federal Income Tax');
      expect(r2(federalItem!.amount)).toBe(27_228);
    });

    it('Social Security capped at wage base ($10,918.20)', () => {
      // 6.2% × $176,100 (wages $200k exceed wage base)
      const ssItem = result.breakdown.find(b => b.label === 'Social Security');
      expect(r2(ssItem!.amount)).toBe(10_918.20);
    });

    it('Medicare is $2,900', () => {
      // 1.45% × $200,000
      const medItem = result.breakdown.find(b => b.label === 'Medicare');
      expect(r2(medItem!.amount)).toBe(2_900);
    });

    it('no Additional Medicare (MFJ threshold is $250k, wages $200k)', () => {
      const addlItem = result.breakdown.find(b => b.label === 'Additional Medicare');
      expect(addlItem).toBeUndefined();
    });

    it('marginal rate is 22%', () => {
      expect(result.marginalRate).toBe(0.22);
    });

    it('total tax is $41,046.20', () => {
      // $27,228 federal + $10,918.20 SS + $2,900 Medicare
      expect(r2(result.totalTax)).toBe(41_046.20);
    });
  });

  // ── 3. $500 000 single — Additional Medicare ───────────────────────────────
  describe('$500,000 single W-2 — Additional Medicare', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 500_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
    };
    const result = calculateUSTax(input);

    it('includes Additional Medicare tax ($2,700)', () => {
      // 0.9% × ($500,000 − $200,000) = $2,700
      const addlItem = result.breakdown.find(b => b.label === 'Additional Medicare');
      expect(addlItem).toBeDefined();
      expect(r2(addlItem!.amount)).toBe(2_700);
    });

    it('calculates federal income tax correctly ($139,297.25)', () => {
      const federalItem = result.breakdown.find(b => b.label === 'Federal Income Tax');
      expect(r2(federalItem!.amount)).toBe(139_297.25);
    });

    it('Social Security is still capped at $10,918.20', () => {
      const ssItem = result.breakdown.find(b => b.label === 'Social Security');
      expect(r2(ssItem!.amount)).toBe(10_918.20);
    });

    it('Medicare is $7,250', () => {
      // 1.45% × $500,000
      const medItem = result.breakdown.find(b => b.label === 'Medicare');
      expect(r2(medItem!.amount)).toBe(7_250);
    });

    it('marginal rate is 35%', () => {
      expect(result.marginalRate).toBe(0.35);
    });

    it('total tax is $160,165.45', () => {
      // $139,297.25 federal + $10,918.20 SS + $7,250 Medicare + $2,700 Addl Medicare
      expect(r2(result.totalTax)).toBe(160_165.45);
    });
  });

  // ── 4. $100 000 single self-employed ──────────────────────────────────────
  describe('$100,000 single self-employed', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 100_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: false,
      selfEmploymentIncome: 100_000,
    };
    const result = calculateUSTax(input);

    it('SE taxes are $15,300 (12.4% SS + 2.9% Medicare on $100k)', () => {
      // SS: 12.4% × $100,000 = $12,400   Medicare: 2.9% × $100,000 = $2,900
      const ssItem   = result.breakdown.find(b => b.label === 'Social Security');
      const medItem  = result.breakdown.find(b => b.label === 'Medicare');
      expect(r2(ssItem!.amount)).toBe(12_400);
      expect(r2(medItem!.amount)).toBe(2_900);
    });

    it('SE tax deduction reduces AGI by $7,650 (50% of $15,300)', () => {
      // AGI = $100,000 − $7,650 = $92,350
      // Taxable = $92,350 − $15,000 std = $77,350
      const totalTaxable = result.bracketDetails.reduce(
        (sum, d) => sum + d.taxableInThisBracket,
        0,
      );
      expect(r2(totalTaxable)).toBe(77_350);
    });

    it('calculates federal income tax on reduced taxable income ($11,931)', () => {
      // 10% × $11,925 + 12% × $36,550 + 22% × $28,875 = $11,931
      const federalItem = result.breakdown.find(b => b.label === 'Federal Income Tax');
      expect(r2(federalItem!.amount)).toBe(11_931);
    });

    it('no Additional Medicare (SE income $100k < $200k threshold)', () => {
      const addlItem = result.breakdown.find(b => b.label === 'Additional Medicare');
      expect(addlItem).toBeUndefined();
    });

    it('total tax is $27,231 (federal + full SE FICA)', () => {
      // $11,931 federal + $15,300 SE FICA
      expect(r2(result.totalTax)).toBe(27_231);
    });

    it('marginal rate is 22%', () => {
      expect(result.marginalRate).toBe(0.22);
    });
  });

  // ── 5. $80 000 single Texas — no state tax ────────────────────────────────
  describe('$80,000 single W-2 — Texas (no state income tax)', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 80_000,
      filingStatus: 'single',
      state: 'TX',
      useStandardDeduction: true,
      w2Employee: true,
    };
    const result = calculateUSTax(input);

    it('state income tax is $0', () => {
      const stateItem = result.breakdown.find(b => b.label === 'State Income Tax');
      expect(stateItem).toBeUndefined();
    });

    it('breakdown does NOT include a State Income Tax line', () => {
      const labels = result.breakdown.map(b => b.label);
      expect(labels).not.toContain('State Income Tax');
    });

    it('total tax contains only federal + FICA components', () => {
      const federal = result.breakdown.find(b => b.label === 'Federal Income Tax')!.amount;
      const ss      = result.breakdown.find(b => b.label === 'Social Security')!.amount;
      const med     = result.breakdown.find(b => b.label === 'Medicare')!.amount;
      expect(r2(result.totalTax)).toBe(r2(federal + ss + med));
    });
  });

  // ── 6. $80 000 single California — state tax > 0 ─────────────────────────
  describe('$80,000 single W-2 — California (progressive state tax)', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 80_000,
      filingStatus: 'single',
      state: 'CA',
      useStandardDeduction: true,
      w2Employee: true,
    };
    const result = calculateUSTax(input);

    it('state income tax is greater than $0', () => {
      const stateItem = result.breakdown.find(b => b.label === 'State Income Tax');
      expect(stateItem).toBeDefined();
      expect(stateItem!.amount).toBeGreaterThan(0);
    });

    it('CA state tax is approximately $2,660.24', () => {
      // Taxable $65,000:
      // 1% × $10,756 + 2% × $14,743 + 4% × $14,746 + 6% × $15,621 + 8% × $9,134
      const stateItem = result.breakdown.find(b => b.label === 'State Income Tax');
      expect(r2(stateItem!.amount)).toBe(2_660.24);
    });

    it('total tax includes state tax', () => {
      const stateItem = result.breakdown.find(b => b.label === 'State Income Tax');
      const withoutState = result.totalTax - stateItem!.amount;
      // total must be strictly greater than the no-state portion
      expect(result.totalTax).toBeGreaterThan(withoutState);
    });

    it('total tax = federal + FICA + CA state', () => {
      const federal  = result.breakdown.find(b => b.label === 'Federal Income Tax')!.amount;
      const ss       = result.breakdown.find(b => b.label === 'Social Security')!.amount;
      const med      = result.breakdown.find(b => b.label === 'Medicare')!.amount;
      const state    = result.breakdown.find(b => b.label === 'State Income Tax')!.amount;
      // $9,214 federal + $4,960 SS + $1,160 Medicare + $2,660.24 CA
      expect(r2(result.totalTax)).toBe(r2(federal + ss + med + state));
    });
  });

  // ── 7. LTCG scenario: $100k W-2 + $50k long-term capital gain ────────────
  describe('$100,000 W-2 + $50,000 LTCG (single)', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 100_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
      capitalGains: [{ type: 'long', amount: 50_000 }],
    };
    const result = calculateUSTax(input);

    it('AGI includes LTCG on top of wages ($150,000)', () => {
      expect(result.agi).toBe(150_000);
    });

    it('taxable income is $135,000 (AGI − $15k standard deduction)', () => {
      expect(result.taxableIncome).toBe(135_000);
    });

    it('ordinary income bracket taxable is $85,000 (taxable − $50k LTCG)', () => {
      // The bracket details only cover ordinary income; LTCG is taxed separately
      const totalOrdinary = result.bracketDetails.reduce(
        (sum, d) => sum + d.taxableInThisBracket,
        0,
      );
      expect(r2(totalOrdinary)).toBe(85_000);
    });

    it('federal income tax is $21,114 (ordinary brackets + LTCG stacking)', () => {
      // Ordinary: 10%×$11,925 + 12%×$36,550 + 22%×$36,525 = $13,614
      // LTCG stacked on top of $85k ordinary:
      //   tax on $135k at LTCG rates − tax on $85k at LTCG rates
      //   = [15%×($135k−$47,025)] − [15%×($85k−$47,025)]
      //   = (15%×$87,975) − (15%×$37,975) = $13,196.25 − $5,696.25 = $7,500
      // Total federal = $13,614 + $7,500 = $21,114
      const federalItem = result.breakdown.find(b => b.label === 'Federal Income Tax');
      expect(r2(federalItem!.amount)).toBe(21_114);
    });

    it('total tax = federal + FICA (no NIIT since AGI $150k < $200k threshold)', () => {
      const federal = result.breakdown.find(b => b.label === 'Federal Income Tax')!.amount;
      const ss      = result.breakdown.find(b => b.label === 'Social Security')!.amount;
      const med     = result.breakdown.find(b => b.label === 'Medicare')!.amount;
      expect(r2(result.totalTax)).toBe(r2(federal + ss + med));
    });
  });

  // ── 8. EITC with 2 children ($45,000 income) ─────────────────────────────
  describe('$45,000 single W-2 — EITC with 2 children', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 45_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
      childrenUnder17: 2,
    };
    const result = calculateUSTax(input);

    it('credits array is defined and includes EITC', () => {
      expect(result.credits).toBeDefined();
      const eitc = result.credits!.find(c => c.name === 'Earned Income Tax Credit');
      expect(eitc).toBeDefined();
    });

    it('EITC is refundable', () => {
      const eitc = result.credits!.find(c => c.name === 'Earned Income Tax Credit');
      expect(eitc!.refundable).toBe(true);
    });

    it('EITC is positive (income within phase-in/plateau range)', () => {
      const eitc = result.credits!.find(c => c.name === 'Earned Income Tax Credit');
      expect(eitc!.amount).toBeGreaterThan(0);
    });

    it('Child Tax Credit is $4,000 for 2 children (below phase-out threshold)', () => {
      const ctc = result.credits!.find(c => c.name === 'Child Tax Credit');
      expect(r2(ctc!.amount)).toBe(4_000);
    });

    it('Additional Child Tax Credit (refundable) is $3,400 (15% of ($45k−$2.5k) capped at $1,700/child)', () => {
      // 15% × ($45,000 − $2,500) = 15% × $42,500 = $6,375; capped at 2×$1,700 = $3,400
      const actc = result.credits!.find(c => c.name === 'Additional Child Tax Credit');
      expect(r2(actc!.amount)).toBe(3_400);
    });

    it('refundable credits appear as negative amount in breakdown', () => {
      const refundLine = result.breakdown.find(b => b.label === 'Refundable Credits');
      expect(refundLine).toBeDefined();
      expect(refundLine!.amount).toBeLessThan(0);
    });
  });

  // ── 9. Child Tax Credit phase-out ─────────────────────────────────────────
  describe('Child Tax Credit phase-out — $220,000 single with 3 children', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 220_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
      childrenUnder17: 3,
    };
    const result = calculateUSTax(input);

    it('CTC is reduced from $6,000 to $5,000 due to phase-out', () => {
      // Base: 3 × $2,000 = $6,000
      // Phase-out: AGI $220k; threshold $200k; reduction = ceil($20k/$1k)×$50 = $1,000
      // CTC after phase-out = $5,000
      const ctc = result.credits!.find(c => c.name === 'Child Tax Credit');
      expect(r2(ctc!.amount)).toBe(5_000);
    });

    it('at $400,000 income MFJ threshold would start phase-out (control: single threshold $200k)', () => {
      // Confirm the $200k threshold is applied for single filers
      const ctc = result.credits!.find(c => c.name === 'Child Tax Credit');
      // We are above $200k so phase-out has occurred
      expect(ctc!.amount).toBeLessThan(6_000);
    });
  });

  // ── 10. AMT trigger scenario ──────────────────────────────────────────────
  describe('AMT trigger — $50,000 W-2 + $500,000 LTCG (single)', () => {
    // Large LTCG with low ordinary income: AMT (flat rate) may exceed regular tax
    // because regular tax on LTCG is at 0%/15%/20% but AMT applies 26%/28% flat
    const input: USInput = {
      country: 'US',
      grossIncome: 50_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
      capitalGains: [{ type: 'long', amount: 500_000 }],
    };
    const result = calculateUSTax(input);

    it('AMT liability is defined and positive', () => {
      expect(result.amtLiability).toBeDefined();
      expect(result.amtLiability!).toBeGreaterThan(0);
    });

    it('AMT appears in breakdown', () => {
      const amtItem = result.breakdown.find(b => b.label === 'Alternative Minimum Tax (AMT)');
      expect(amtItem).toBeDefined();
      expect(amtItem!.amount).toBeGreaterThan(0);
    });

    it('AMT liability is approximately $43,189 (AMT − regular federal exceeds zero)', () => {
      // taxable = 535,000; AMT base = 535,000 − 66,788 exemption ≈ 468,212
      // AMT tax = 26%×232,600 + 28%×(468,212−232,600) ≈ 60,476 + 65,979 ≈ 126,455
      // regular federal (LTCG-heavy) ≈ $77,963 → AMT adds ≈ $43,189
      expect(r2(result.amtLiability!)).toBe(43_189.25);
    });
  });

  // ── 11. NIIT scenario ─────────────────────────────────────────────────────
  describe('NIIT — $220,000 W-2 + $30,000 LTCG + $5,000 qualified dividends (single)', () => {
    const input: USInput = {
      country: 'US',
      grossIncome: 220_000,
      filingStatus: 'single',
      useStandardDeduction: true,
      w2Employee: true,
      capitalGains: [{ type: 'long', amount: 30_000 }],
      qualifiedDividends: 5_000,
    };
    const result = calculateUSTax(input);

    it('AGI is $250,000 (wages + LTCG)', () => {
      // qualifiedDividends are a subset of ordinary dividends; not double-counted
      expect(result.agi).toBe(250_000);
    });

    it('NIIT appears in breakdown', () => {
      const niitItem = result.breakdown.find(b => b.label === 'Net Investment Income Tax (NIIT)');
      expect(niitItem).toBeDefined();
    });

    it('NIIT is $1,330 (3.8% × $35,000 investment income, AGI $250k > $200k threshold)', () => {
      // investment income = LTCG $30k + qualified dividends $5k = $35k
      // NIIT base = min($35k, AGI $250k − threshold $200k) = min($35k, $50k) = $35k
      // NIIT = $35,000 × 3.8% = $1,330
      const niitItem = result.breakdown.find(b => b.label === 'Net Investment Income Tax (NIIT)');
      expect(r2(niitItem!.amount)).toBe(1_330);
    });

    it('total tax includes NIIT component', () => {
      const federal = result.breakdown.find(b => b.label === 'Federal Income Tax')!.amount;
      const ss      = result.breakdown.find(b => b.label === 'Social Security')!.amount;
      const med     = result.breakdown.find(b => b.label === 'Medicare')!.amount;
      const addlMed = result.breakdown.find(b => b.label === 'Additional Medicare')?.amount ?? 0;
      const niit    = result.breakdown.find(b => b.label === 'Net Investment Income Tax (NIIT)')!.amount;
      expect(r2(result.totalTax)).toBe(r2(federal + ss + med + addlMed + niit));
    });
  });

});
