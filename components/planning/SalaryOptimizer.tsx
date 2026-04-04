'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

function computeNewRegimeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const slabs = [
    { limit: 400000, rate: 0 },
    { limit: 800000, rate: 0.05 },
    { limit: 1200000, rate: 0.10 },
    { limit: 1600000, rate: 0.15 },
    { limit: 2000000, rate: 0.20 },
    { limit: 2400000, rate: 0.25 },
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
  // 4% health & education cess
  return tax * 1.04;
}

function computeOldRegimeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const slabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
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
  return tax * 1.04;
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export default function SalaryOptimizer() {
  const [ctc, setCtc] = useState('');
  const [rentPaid, setRentPaid] = useState('');
  const [isMetro, setIsMetro] = useState(true);
  const [hasNPS, setHasNPS] = useState(true);

  const ctcVal = parseFloat(ctc) || 0;
  const rentVal = parseFloat(rentPaid) || 0;

  // Unstructured: entire CTC as salary
  const unstructuredTaxableNew = Math.max(0, ctcVal - 75000);
  const unstructuredTaxNew = computeNewRegimeTax(unstructuredTaxableNew);

  // Optimized structure
  const basic = ctcVal * 0.40;
  const hra = isMetro ? basic * 0.50 : basic * 0.40;
  const lta = 25000;
  const food = 26400;
  const profTax = 2500;
  const employerNPS = hasNPS ? basic * 0.10 : 0;
  const specialAllowance = Math.max(0, ctcVal - basic - hra - lta - food - profTax - employerNPS);

  // HRA exemption (old regime)
  const hraExemptionOld = rentVal > 0
    ? Math.min(hra, rentVal - 0.1 * basic, isMetro ? 0.5 * basic : 0.4 * basic)
    : 0;

  // New regime (optimized): only employer NPS and standard deduction matter
  const newRegimeOptimizedTaxable = Math.max(0, ctcVal - employerNPS - 75000);
  const newRegimeOptimizedTax = computeNewRegimeTax(newRegimeOptimizedTaxable);

  // Old regime (optimized)
  const oldRegimeDeductions = Math.max(0, hraExemptionOld) + lta + food + profTax + employerNPS + 50000 + 150000;
  const oldRegimeTaxable = Math.max(0, ctcVal - oldRegimeDeductions);
  const oldRegimeTax = computeOldRegimeTax(oldRegimeTaxable);

  // Best optimized tax
  const optimizedTax = Math.min(newRegimeOptimizedTax, oldRegimeTax);
  const bestRegime = newRegimeOptimizedTax <= oldRegimeTax ? 'New Regime' : 'Old Regime';
  const optimizedTaxable =
    newRegimeOptimizedTax <= oldRegimeTax ? newRegimeOptimizedTaxable : oldRegimeTaxable;

  const saving = Math.max(0, unstructuredTaxNew - optimizedTax);
  const unstructuredNetTakeHome = ctcVal - unstructuredTaxNew;
  const optimizedNetTakeHome = ctcVal - optimizedTax;

  const hasData = ctcVal > 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inputs</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Annual CTC (₹)
            </label>
            <input
              type="number"
              value={ctc}
              onChange={(e) => setCtc(e.target.value)}
              placeholder="e.g. 1500000"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Annual Rent Paid (₹)
            </label>
            <input
              type="number"
              value={rentPaid}
              onChange={(e) => setRentPaid(e.target.value)}
              placeholder="e.g. 180000"
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={isMetro}
              onChange={(e) => setIsMetro(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            Metro city (HRA 50% of basic)
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={hasNPS}
              onChange={(e) => setHasNPS(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            Include employer NPS (80CCD(2))
          </label>
        </div>
      </div>

      {/* Results */}
      {hasData && (
        <>
          {/* Saving callout */}
          <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Potential Annual Saving
            </p>
            <p className="num text-3xl font-bold text-[var(--success)]">{fmt(saving)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Best regime after restructuring: {bestRegime}</p>
          </div>

          {/* Comparison table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">
                    Component
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">
                    Unstructured CTC
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-primary)]">
                    Optimized Structure
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Gross Income</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(ctcVal)}</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(ctcVal)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">HRA Exempt</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">—</td>
                  <td className="px-4 py-3 text-right num text-[var(--success)]">{fmt(bestRegime === 'Old Regime' ? hraExemptionOld : 0)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Other Exemptions</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">—</td>
                  <td className="px-4 py-3 text-right num text-[var(--success)]">
                    {fmt(bestRegime === 'Old Regime' ? lta + food + profTax + employerNPS + 150000 : employerNPS)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">Standard Deduction</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">{fmt(75000)}</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-muted)]">
                    {fmt(bestRegime === 'Old Regime' ? 50000 : 75000)}
                  </td>
                </tr>
                <tr className="bg-[var(--surface-raised)]">
                  <td className="px-4 py-3 font-medium text-[var(--text-primary)]">Taxable Income</td>
                  <td className="px-4 py-3 text-right num font-medium text-[var(--text-primary)]">
                    {fmt(unstructuredTaxableNew)}
                  </td>
                  <td className="px-4 py-3 text-right num font-medium text-[var(--text-primary)]">
                    {fmt(optimizedTaxable)}
                  </td>
                </tr>
                <tr className="bg-[var(--surface-raised)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Tax (incl. 4% cess)</td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--danger)]">
                    {fmt(unstructuredTaxNew)}
                  </td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--success)]">
                    {fmt(optimizedTax)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Net Take-Home</td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--text-primary)]">
                    {fmt(unstructuredNetTakeHome)}
                  </td>
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--primary)]">
                    {fmt(optimizedNetTakeHome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div className="flex items-start gap-2 rounded-lg bg-[var(--surface-raised)] px-4 py-3">
            <Info className="h-4 w-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--text-muted)]">
              Assumes maximum 80C investment (₹1.5L) under old regime. Actual savings depend on actual rent receipts and documented investments.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
