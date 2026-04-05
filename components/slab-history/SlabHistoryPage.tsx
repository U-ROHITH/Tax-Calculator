'use client';

import { useState, useRef } from 'react';
import { History, TrendingDown, ArrowRight } from 'lucide-react';
import { indiaSlabHistory, type YearlySlabs, type SlabEntry } from '@/content/slabs/india-history';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatInr(n: number): string {
  if (n === 0) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatInrFull(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

function computeTax(income: number, slabs: SlabEntry[]): number {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.from) break;
    const upper = slab.to ?? Infinity;
    const taxable = Math.min(income, upper) - slab.from;
    if (taxable <= 0) continue;
    tax += (taxable * slab.rate) / 100;
  }
  return Math.round(tax);
}

function computeTaxWithRebate(income: number, year: YearlySlabs): number {
  const rawTax = computeTax(income, year.slabs);
  if (income <= year.rebate87ALimit && rawTax <= year.rebate87A) return 0;
  return rawTax;
}

function rateColor(rate: number): string {
  if (rate === 0) return 'text-[var(--success)]';
  if (rate <= 10) return 'text-[var(--warning)]';
  if (rate >= 20) return 'text-[var(--danger,#DC2626)]';
  return 'text-[var(--text-secondary)]';
}

function rateBg(rate: number): string {
  if (rate === 0) return 'bg-[var(--success)]/10 border-[var(--success)]/20';
  if (rate <= 10) return 'bg-[var(--warning)]/10 border-[var(--warning)]/20';
  if (rate >= 20) return 'bg-[#DC2626]/10 border-[#DC2626]/20';
  return 'bg-[var(--surface-raised)] border-[var(--border)]';
}

function formatRange(slab: SlabEntry, idx: number, all: SlabEntry[]): string {
  if (idx === 0 && slab.from === 0) return `Up to ${formatInr(slab.to ?? 0)}`;
  if (slab.to === null) return `Above ${formatInr(slab.from)}`;
  return `${formatInr(slab.from)} – ${formatInr(slab.to)}`;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function SlabHistoryPage() {
  const latest = indiaSlabHistory[indiaSlabHistory.length - 1];
  const [selectedFy, setSelectedFy] = useState<string>(latest.fy);
  const [quickIncome, setQuickIncome] = useState<string>('');
  const tabsRef = useRef<HTMLDivElement>(null);

  const selected = indiaSlabHistory.find((y) => y.fy === selectedFy) ?? latest;

  const quickTax =
    quickIncome !== '' && !isNaN(Number(quickIncome))
      ? computeTaxWithRebate(Number(quickIncome) * 100000, selected)
      : null;

  // precompute tax at ₹10L for comparison table
  const TAX_BENCHMARK = 1000000;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-8 flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--india)]/30 bg-[var(--india)]/10"
               style={{ borderRadius: 'var(--radius-md)' }}>
            <History className="h-5 w-5 text-[var(--india)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
              India Income Tax Slab History
            </h1>
            <p className="mt-1 text-[var(--text-secondary)] text-sm sm:text-base">
              How income tax slabs changed from FY 2013-14 to FY 2025-26 — 13 years of data.
            </p>
          </div>
        </div>

        {/* ── Year selector tabs ── */}
        <div
          ref={tabsRef}
          className="mb-8 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {indiaSlabHistory.map((year) => {
            const isActive = year.fy === selectedFy;
            return (
              <button
                key={year.fy}
                onClick={() => setSelectedFy(year.fy)}
                className={[
                  'shrink-0 px-3 py-1.5 text-xs font-medium transition-colors border',
                  isActive
                    ? 'border-[var(--india)] bg-[var(--india)]/10 text-[var(--india)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--india)]/40 hover:text-[var(--text-primary)]',
                ].join(' ')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {year.fy}
              </button>
            );
          })}
        </div>

        {/* ── Key stats row ── */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Basic Exemption */}
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4"
               style={{ borderRadius: 'var(--radius-md)' }}>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Basic Exemption
            </p>
            <p className="num text-2xl font-bold text-[var(--text-primary)]">
              {formatInr(selected.basicExemption)}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              Income below this is not taxed
            </p>
          </div>

          {/* Standard Deduction */}
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4"
               style={{ borderRadius: 'var(--radius-md)' }}>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Standard Deduction
            </p>
            <p className="num text-2xl font-bold text-[var(--text-primary)]">
              {selected.standardDeduction > 0 ? formatInr(selected.standardDeduction) : 'Not applicable'}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {selected.standardDeduction > 0 ? 'Flat deduction for salaried' : 'No standard deduction this year'}
            </p>
          </div>

          {/* 87A Rebate */}
          <div className="border border-[var(--border)] bg-[var(--surface)] p-4"
               style={{ borderRadius: 'var(--radius-md)' }}>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              87A Rebate
            </p>
            <p className="num text-2xl font-bold text-[var(--text-primary)]">
              {selected.rebate87A > 0 ? formatInr(selected.rebate87A) : '—'}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {selected.rebate87A > 0
                ? `Up to ${formatInr(selected.rebate87ALimit)} income`
                : 'No 87A rebate this year'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ── Slab table ── */}
          <div className="border border-[var(--border)] bg-[var(--surface)]"
               style={{ borderRadius: 'var(--radius-md)' }}>
            <div className="border-b border-[var(--border)] px-5 py-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Tax Slabs — {selected.fy}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {selected.regime === 'new' ? 'New regime slabs shown' : 'Old / pre-new regime slabs'}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Income Range
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Tax Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selected.slabs.map((slab, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)]"
                    >
                      <td className="num px-5 py-3 text-[var(--text-primary)]">
                        {formatRange(slab, i, selected.slabs)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={[
                            'inline-block px-2 py-0.5 text-xs font-semibold border num',
                            rateBg(slab.rate),
                            rateColor(slab.rate),
                          ].join(' ')}
                          style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                          {slab.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Key Changes + Quick calc ── */}
          <div className="flex flex-col gap-6">
            {/* Key Changes */}
            <div className="border border-[var(--border)] bg-[var(--surface)]"
                 style={{ borderRadius: 'var(--radius-md)' }}>
              <div className="border-b border-[var(--border)] px-5 py-3">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Key Changes — {selected.fy}
                </h2>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {selected.keyChanges.map((change, i) => (
                  <li key={i} className="flex items-start gap-2.5 px-5 py-3">
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--india)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Calculator */}
            <div className="border border-[var(--border)] bg-[var(--surface)]"
                 style={{ borderRadius: 'var(--radius-md)' }}>
              <div className="border-b border-[var(--border)] px-5 py-3">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Your tax in {selected.fy}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Enter annual income to see estimated tax under {selected.fy} slabs
                </p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Income in lakhs (e.g. 12)"
                    value={quickIncome}
                    onChange={(e) => setQuickIncome(e.target.value)}
                    className="num flex-1 border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--india)]"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                  <span className="text-sm text-[var(--text-muted)]">L</span>
                </div>

                {quickTax !== null && (
                  <div className="mt-4 border border-[var(--india)]/30 bg-[var(--india)]/5 p-4"
                       style={{ borderRadius: 'var(--radius-sm)' }}>
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      Estimated tax at ₹{Number(quickIncome).toFixed(quickIncome.includes('.') ? 1 : 0)} lakh income
                    </p>
                    <p className="num text-2xl font-bold text-[var(--india)]">
                      {formatInrFull(quickTax)}
                    </p>
                    {quickTax === 0 && (
                      <p className="mt-1 text-xs text-[var(--success)]">
                        Zero tax — 87A rebate fully absorbs liability
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      Effective rate:{' '}
                      <span className="num font-medium text-[var(--text-secondary)]">
                        {Number(quickIncome) > 0
                          ? ((quickTax / (Number(quickIncome) * 100000)) * 100).toFixed(1)
                          : '0.0'}
                        %
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Add 4% health & education cess to arrive at final tax payable. Does not include surcharge.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Year-over-Year comparison table ── */}
        <div className="mt-8 border border-[var(--border)] bg-[var(--surface)]"
             style={{ borderRadius: 'var(--radius-md)' }}>
          <div className="flex items-start gap-3 border-b border-[var(--border)] px-5 py-4">
            <TrendingDown className="mt-0.5 h-4 w-4 shrink-0 text-[var(--india)]" />
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                Year-over-Year Comparison
              </h2>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                All 13 financial years side by side. "Tax at ₹10L" uses the applicable regime slabs with 87A rebate.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">
                    FY
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">
                    Basic Exempt
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">
                    Std Dedn
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">
                    87A Rebate
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">
                    Tax at ₹10L
                  </th>
                </tr>
              </thead>
              <tbody>
                {indiaSlabHistory.map((year) => {
                  const taxAt10L = computeTaxWithRebate(TAX_BENCHMARK, year);
                  const isSelected = year.fy === selectedFy;
                  return (
                    <tr
                      key={year.fy}
                      onClick={() => setSelectedFy(year.fy)}
                      className={[
                        'border-b border-[var(--border)] last:border-0 cursor-pointer transition-colors',
                        isSelected
                          ? 'bg-[var(--india)]/8 hover:bg-[var(--india)]/12'
                          : 'hover:bg-[var(--surface-raised)]',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        <span
                          className={isSelected ? 'text-[var(--india)] font-semibold' : 'text-[var(--text-primary)]'}
                        >
                          {year.fy}
                        </span>
                        {isSelected && (
                          <span
                            className="ml-2 text-xs border border-[var(--india)]/30 bg-[var(--india)]/10 text-[var(--india)] px-1.5 py-0.5"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                          >
                            selected
                          </span>
                        )}
                      </td>
                      <td className="num px-4 py-3 text-right text-[var(--text-secondary)]">
                        {formatInr(year.basicExemption)}
                      </td>
                      <td className="num px-4 py-3 text-right text-[var(--text-secondary)]">
                        {year.standardDeduction > 0 ? formatInr(year.standardDeduction) : '—'}
                      </td>
                      <td className="num px-4 py-3 text-right text-[var(--text-secondary)]">
                        {year.rebate87A > 0 ? formatInr(year.rebate87A) : '—'}
                      </td>
                      <td className="num px-4 py-3 text-right font-semibold text-[var(--text-primary)]">
                        {taxAt10L === 0 ? (
                          <span className="text-[var(--success)]">₹0</span>
                        ) : (
                          formatInrFull(taxAt10L)
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[var(--border)] px-5 py-3">
            <p className="text-xs text-[var(--text-muted)]">
              Click any row to view that year's detailed slabs and key changes. Tax at ₹10L is computed
              on gross income using the slabs shown, after applying the 87A rebate where eligible.
              Does not include cess, surcharge, or deductions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
