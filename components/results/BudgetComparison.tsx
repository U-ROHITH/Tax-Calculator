'use client';

import { TrendingDown } from 'lucide-react';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  grossIncome: number;
}

// ── FY 2024-25 new regime slabs ───────────────────────────────────────────────
// 0-3L: 0%, 3-7L: 5%, 7-10L: 10%, 10-12L: 15%, 12-15L: 20%, 15L+: 30%
// Standard deduction: ₹50,000; Rebate 87A: ₹12,500 up to ₹5L income

function calcTax2425(income: number): number {
  const stdDed = 50_000;
  const taxable = Math.max(0, income - stdDed);

  const slabs: [number, number, number][] = [
    [0,          300_000,  0.00],
    [300_000,    700_000,  0.05],
    [700_000,    1_000_000, 0.10],
    [1_000_000,  1_200_000, 0.15],
    [1_200_000,  1_500_000, 0.20],
    [1_500_000,  Infinity,  0.30],
  ];

  let tax = 0;
  for (const [min, max, rate] of slabs) {
    if (taxable <= min) break;
    tax += (Math.min(taxable, max) - min) * rate;
  }

  // 87A rebate: full rebate if income ≤ ₹5L
  if (income <= 500_000) tax = 0;

  // Surcharge + cess (4%)
  const cess = tax * 0.04;
  return tax + cess;
}

// ── FY 2025-26 new regime slabs ───────────────────────────────────────────────
// 0-4L: 0%, 4-8L: 5%, 8-12L: 10%, 12-16L: 15%, 16-20L: 20%, 20-24L: 25%, 24L+: 30%
// Standard deduction: ₹75,000; Rebate 87A: ₹25,000 up to ₹7L income

function calcTax2526(income: number): number {
  const stdDed = 75_000;
  const taxable = Math.max(0, income - stdDed);

  const slabs: [number, number, number][] = [
    [0,          400_000,  0.00],
    [400_000,    800_000,  0.05],
    [800_000,    1_200_000, 0.10],
    [1_200_000,  1_600_000, 0.15],
    [1_600_000,  2_000_000, 0.20],
    [2_000_000,  2_400_000, 0.25],
    [2_400_000,  Infinity,  0.30],
  ];

  let tax = 0;
  for (const [min, max, rate] of slabs) {
    if (taxable <= min) break;
    tax += (Math.min(taxable, max) - min) * rate;
  }

  // 87A rebate: full rebate if income ≤ ₹7L
  if (income <= 700_000) tax = 0;

  // Cess (4%)
  const cess = tax * 0.04;
  return tax + cess;
}

export default function BudgetComparison({ grossIncome }: Props) {
  const tax2425 = calcTax2425(grossIncome);
  const tax2526 = calcTax2526(grossIncome);
  const saving = tax2425 - tax2526;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--surface-raised)] border-b border-[var(--border)]">
        <TrendingDown className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
        <span className="text-sm font-semibold text-[var(--text-primary)]">Budget 2024 Impact</span>
        <span className="ml-auto text-xs font-medium text-[var(--text-muted)]">New Regime Only</span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
        {/* FY 2024-25 */}
        <div className="p-4 bg-[var(--surface-raised)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">FY 2024-25 Slabs</p>
          <p className="text-xl font-bold num text-[var(--danger)]">{formatByCurrency(tax2425, 'INR')}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Total Tax (incl. cess)</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
            <p>Std. deduction: ₹50,000</p>
            <p>87A rebate up to ₹5L</p>
          </div>
        </div>

        {/* FY 2025-26 */}
        <div className="p-4 bg-[var(--surface)]">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] mb-2">FY 2025-26 Slabs</p>
          <p className="text-xl font-bold num text-[var(--danger)]">{formatByCurrency(tax2526, 'INR')}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Total Tax (incl. cess)</p>
          <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
            <p>Std. deduction: ₹75,000</p>
            <p>87A rebate up to ₹7L</p>
          </div>
        </div>
      </div>

      {/* Saving row */}
      <div className={`flex items-center justify-center gap-2 px-4 py-2.5 border-t border-[var(--border)] ${saving > 0 ? 'bg-[var(--success)]/10' : saving < 0 ? 'bg-[var(--danger)]/10' : 'bg-[var(--surface-raised)]'}`}>
        {saving > 0 ? (
          <p className="text-sm font-semibold text-[var(--success)] num">
            You save {formatByCurrency(saving, 'INR')} with the new FY 2025-26 slabs
          </p>
        ) : saving < 0 ? (
          <p className="text-sm font-semibold text-[var(--danger)] num">
            New slabs cost {formatByCurrency(Math.abs(saving), 'INR')} more
          </p>
        ) : (
          <p className="text-sm font-medium text-[var(--text-muted)]">No change in tax liability</p>
        )}
      </div>

      {/* Key changes note */}
      <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface-raised)]">
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Key Budget 2024 changes: higher standard deduction (₹50K → ₹75K), revised slabs (nil rate band 0–4L vs 0–3L), 87A rebate raised to ₹7L, LTCG exemption ₹1L → ₹1.25L.
        </p>
      </div>
    </div>
  );
}
