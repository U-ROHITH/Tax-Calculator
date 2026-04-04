'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

// New regime slabs (FY 2025-26)
function computeNewRegimeTax(income: number, basicExemption = 300000): number {
  const taxableIncome = Math.max(0, income - basicExemption);
  if (taxableIncome <= 0) return 0;

  // After exemption, apply slabs (0–4L 0%, 4–8L 5%, 8–12L 10%, etc.)
  // Adjust for shifted base by basic exemption already subtracted
  const slabs = [
    { limit: 100000, rate: 0 },       // first 1L (shifted by 3L exemption: covers up to 4L total)
    { limit: 500000, rate: 0.05 },    // next 4L (covers 4–8L total)
    { limit: 900000, rate: 0.10 },    // next 4L (covers 8–12L total)
    { limit: 1300000, rate: 0.15 },   // 12–16L
    { limit: 1700000, rate: 0.20 },   // 16–20L
    { limit: 2100000, rate: 0.25 },   // 20–24L
    { limit: Infinity, rate: 0.30 },
  ];

  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const slice = Math.min(taxableIncome, slab.limit) - prev;
    tax += slice * slab.rate;
    prev = slab.limit;
  }
  return tax * 1.04; // 4% cess
}

// Simpler version: apply slab directly on full income with exemption at 3L
function taxNewRegime(income: number): number {
  if (income <= 300000) return 0;
  const slabs = [
    { from: 0, to: 400000, rate: 0 },
    { from: 400000, to: 800000, rate: 0.05 },
    { from: 800000, to: 1200000, rate: 0.10 },
    { from: 1200000, to: 1600000, rate: 0.15 },
    { from: 1600000, to: 2000000, rate: 0.20 },
    { from: 2000000, to: 2400000, rate: 0.25 },
    { from: 2400000, to: Infinity, rate: 0.30 },
  ];
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.from) break;
    const slice = Math.min(income, slab.to) - slab.from;
    tax += slice * slab.rate;
  }
  return tax * 1.04;
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export default function HUFSplitting() {
  const [totalFamilyIncome, setTotalFamilyIncome] = useState('');
  const [incomeToRoute, setIncomeToRoute] = useState('');

  const totalVal = parseFloat(totalFamilyIncome) || 0;
  const routeVal = Math.min(parseFloat(incomeToRoute) || 0, totalVal);
  const individualPortionVal = Math.max(0, totalVal - routeVal);

  // Without HUF: individual pays tax on full income
  const taxWithoutHUF = taxNewRegime(totalVal);

  // With HUF: individual pays tax on reduced income, HUF pays tax on routed income
  const taxIndividual = taxNewRegime(individualPortionVal);
  const taxHUF = taxNewRegime(routeVal); // HUF also gets 3L basic exemption under new regime

  const combinedTax = taxIndividual + taxHUF;
  const saving = Math.max(0, taxWithoutHUF - combinedTax);

  const hasData = totalVal > 0 && routeVal > 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inputs</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Total Family Income (₹)
            </label>
            <input
              type="number"
              value={totalFamilyIncome}
              onChange={(e) => setTotalFamilyIncome(e.target.value)}
              placeholder="e.g. 3000000"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Income to Route via HUF (₹)
            </label>
            <input
              type="number"
              value={incomeToRoute}
              onChange={(e) => setIncomeToRoute(e.target.value)}
              placeholder="e.g. 800000"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {hasData && (
        <>
          {saving > 0 && (
            <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
                Estimated Annual Tax Saving
              </p>
              <p className="num text-3xl font-bold text-[var(--success)]">{fmt(saving)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Combined (individual + HUF) vs individual alone
              </p>
            </div>
          )}

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">Item</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--danger)]">Without HUF</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">Individual Portion</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--primary)]">HUF Portion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Income</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(totalVal)}</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(individualPortionVal)}</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(routeVal)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Basic Exemption</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">₹3,00,000</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">₹3,00,000</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">₹3,00,000</td>
                </tr>
                <tr className="bg-[var(--surface-raised)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Tax (incl. 4% cess)</td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--danger)]">{fmt(taxWithoutHUF)}</td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--text-primary)]">{fmt(taxIndividual)}</td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--primary)]">{fmt(taxHUF)}</td>
                </tr>
                <tr className="bg-[var(--surface-raised)]">
                  <td className="px-4 py-3 font-bold text-[var(--text-primary)]">Combined Tax</td>
                  <td className="px-4 py-3 text-right num font-bold text-[var(--danger)]">{fmt(taxWithoutHUF)}</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]" colSpan={1}>—</td>
                  <td className="px-4 py-3 text-right num font-bold text-[var(--success)]">{fmt(combinedTax)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-[var(--success)]">Tax Saving</td>
                  <td className="px-4 py-3" colSpan={2} />
                  <td className="px-4 py-3 text-right num font-bold text-[var(--success)]">{fmt(saving)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-4">
            <AlertTriangle className="h-4 w-4 text-[var(--warning)] shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--text-secondary)]">
              Setting up an HUF requires a CA and has eligibility conditions (Hindu family, ancestral property or capital). HUF income must genuinely belong to the HUF. Club of income rules (Section 64) may apply. This is an estimate only.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
