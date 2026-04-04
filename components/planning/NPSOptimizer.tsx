'use client';

import { useState } from 'react';

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

const RATES = [
  { label: '10%', value: 0.10 },
  { label: '20%', value: 0.20 },
  { label: '30%', value: 0.30 },
];

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export default function NPSOptimizer() {
  const [annualIncome, setAnnualIncome] = useState('');
  const [existing80C, setExisting80C] = useState('');
  const [marginalRate, setMarginalRate] = useState(0.30);

  const incomeVal = parseFloat(annualIncome) || 0;
  const existing80CVal = parseFloat(existing80C) || 0;

  const basic = incomeVal * 0.40;
  const employerNPS80CD2 = basic * 0.10;

  const c80CMax = 150000;
  const c80CD1BMax = 50000;

  const c80CUsed = Math.min(existing80CVal, c80CMax);
  const c80CRemaining = Math.max(0, c80CMax - c80CUsed);

  const c80CD1BUsed = 0;
  const c80CD1BRemaining = c80CD1BMax;

  const c80CD2Used = 0;
  const c80CD2Remaining = employerNPS80CD2;

  const rows = [
    {
      section: '80C (ELSS, PPF, LIC, PF, etc.)',
      max: c80CMax,
      used: c80CUsed,
      remaining: c80CRemaining,
      saving: c80CRemaining * marginalRate,
    },
    {
      section: '80CCD(1B) — Additional NPS',
      max: c80CD1BMax,
      used: c80CD1BUsed,
      remaining: c80CD1BRemaining,
      saving: c80CD1BRemaining * marginalRate,
    },
    {
      section: '80CCD(2) — Employer NPS (10% of basic)',
      max: Math.round(employerNPS80CD2),
      used: c80CD2Used,
      remaining: Math.round(c80CD2Remaining),
      saving: c80CD2Remaining * marginalRate,
    },
  ];

  const totalRemaining = rows.reduce((s, r) => s + r.remaining, 0);
  const totalSaving = rows.reduce((s, r) => s + r.saving, 0);

  const hasData = incomeVal > 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inputs</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Annual Income (₹)</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              placeholder="e.g. 1500000"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Existing 80C Investments (₹)
            </label>
            <input
              type="number"
              value={existing80C}
              onChange={(e) => setExisting80C(e.target.value)}
              placeholder="e.g. 50000"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* Marginal rate segment control */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-secondary)]">Your Marginal Tax Rate</label>
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden w-fit">
            {RATES.map((r) => (
              <button
                key={r.value}
                onClick={() => setMarginalRate(r.value)}
                className={[
                  'px-5 py-1.5 text-sm font-medium transition-colors',
                  marginalRate === r.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                ].join(' ')}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {hasData && (
        <>
          <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Total Additional Tax Saving Possible
            </p>
            <p className="num text-3xl font-bold text-[var(--success)]">{fmt(totalSaving)}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              On {fmt(totalRemaining)} of unused deduction headroom at {Math.round(marginalRate * 100)}% marginal rate
            </p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">Section</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">Max Limit</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">Already Used</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">Remaining</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-primary)]">Tax Saving</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rows.map((row) => (
                  <tr key={row.section}>
                    <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{row.section}</td>
                    <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(row.max)}</td>
                    <td className="px-4 py-3 text-right num text-[var(--warning)]">{fmt(row.used)}</td>
                    <td className="px-4 py-3 text-right num text-[var(--text-primary)]">{fmt(row.remaining)}</td>
                    <td className="px-4 py-3 text-right num font-medium text-[var(--success)]">{fmt(row.saving)}</td>
                  </tr>
                ))}
                <tr className="bg-[var(--surface-raised)] border-t-2 border-[var(--border-strong)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Total</td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3 text-right num font-semibold text-[var(--text-primary)]">{fmt(totalRemaining)}</td>
                  <td className="px-4 py-3 text-right num font-bold text-[var(--success)]">{fmt(totalSaving)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
