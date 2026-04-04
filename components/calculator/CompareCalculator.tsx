'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TaxResult } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';
import { Globe, TrendingDown, TrendingUp, Minus, ArrowUpDown } from 'lucide-react';

const COUNTRY_META = {
  IN: { name: 'India', currency: 'INR', color: 'var(--india)', hex: '#D97706', symbol: '₹' },
  US: { name: 'United States', currency: 'USD', color: 'var(--us)', hex: '#2563EB', symbol: '$' },
  UK: { name: 'United Kingdom', currency: 'GBP', color: 'var(--uk)', hex: '#C0392B', symbol: '£' },
};

const COUNTRY_DEFAULTS = {
  IN: 'Auto regime · Below 60 · No deductions',
  US: 'Single · Standard deduction · W-2 employee',
  UK: 'England/Wales/NI · No pension · No student loan',
};

type CountryKey = 'IN' | 'US' | 'UK';

function CountryBadge({ code }: { code: CountryKey }) {
  const meta = COUNTRY_META[code];
  return (
    <span
      className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide"
      style={{ background: meta.hex + '18', color: meta.hex, border: `1px solid ${meta.hex}30` }}
    >
      {meta.name}
    </span>
  );
}

function StatRow({ label, value, variant = 'default' }: { label: string; value: string; variant?: 'default' | 'danger' | 'success' | 'accent' }) {
  const colorClass =
    variant === 'danger' ? 'text-[var(--danger)]' :
    variant === 'success' ? 'text-[var(--success)]' :
    variant === 'accent' ? 'text-[var(--primary)]' :
    'text-[var(--text-primary)]';
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <span className={`text-xs font-semibold num ${colorClass}`}>{value}</span>
    </div>
  );
}

export default function CompareCalculator() {
  const [income, setIncome] = useState<number>(0);
  const [results, setResults] = useState<{ IN?: TaxResult; US?: TaxResult; UK?: TaxResult }>({});
  const [loading, setLoading] = useState(false);

  const calculate = useCallback(async (val: number) => {
    if (!val || val <= 0) { setResults({}); return; }
    setLoading(true);
    try {
      const [{ calculateIndiaTax }, { calculateUSTax }, { calculateUKTax }] = await Promise.all([
        import('@/engine/india'),
        import('@/engine/us'),
        import('@/engine/uk'),
      ]);

      const inResult = calculateIndiaTax({ country: 'IN', grossIncome: val, regime: 'auto', age: 'below60' });
      const usResult = calculateUSTax({ country: 'US', grossIncome: val, filingStatus: 'single', useStandardDeduction: true, w2Employee: true });
      const ukResult = calculateUKTax({ country: 'UK', grossIncome: val, region: 'england_wales_ni', studentLoan: 'none' });

      setResults({ IN: inResult, US: usResult, UK: ukResult });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => calculate(income), 400);
    return () => clearTimeout(t);
  }, [income, calculate]);

  const countries = ['IN', 'US', 'UK'] as CountryKey[];
  const hasResults = Object.keys(results).length === 3;

  const rateChartData = hasResults
    ? countries.map((c) => ({
        name: COUNTRY_META[c].name,
        rate: parseFloat((results[c]!.effectiveRate * 100).toFixed(1)),
        hex: COUNTRY_META[c].hex,
      }))
    : [];

  const sorted = hasResults
    ? countries.slice().sort((a, b) => results[a]!.effectiveRate - results[b]!.effectiveRate)
    : [];
  const lowest = sorted[0];
  const highest = sorted[2];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Page header */}
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <Globe className="h-4 w-4 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Tax Comparison</h1>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            India · United States · United Kingdom — side-by-side at the same gross income
          </p>
        </div>
      </div>

      {/* Income input */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
          Annual Gross Income
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
              <ArrowUpDown className="h-4 w-4" />
            </span>
            <input
              type="number"
              min="0"
              placeholder="Enter gross income (e.g. 1000000)"
              value={income || ''}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pl-9 pr-4 text-sm text-[var(--text-primary)] num font-semibold outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          The same number is used as the gross income in each country&apos;s local currency.
          Defaults: {Object.entries(COUNTRY_DEFAULTS).map(([k, v]) => `${COUNTRY_META[k as CountryKey].name} (${v})`).join(' · ')}
        </p>
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-[var(--text-muted)]">
          Calculating across three tax systems...
        </div>
      )}

      {hasResults && !loading && (
        <>
          {/* Country cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            {countries.map((c) => {
              const r = results[c]!;
              const meta = COUNTRY_META[c];
              const isLowest = c === lowest;
              const isHighest = c === highest;
              return (
                <div
                  key={c}
                  className="rounded-xl border bg-[var(--surface)] overflow-hidden"
                  style={{ borderColor: isLowest ? '#16A34A40' : isHighest ? '#DC262640' : 'var(--border)' }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: 'var(--border)', borderLeft: `3px solid ${meta.hex}` }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{meta.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{meta.currency}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xl font-bold num"
                        style={{ color: meta.hex }}
                      >
                        {formatPercent(r.effectiveRate)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">effective</p>
                    </div>
                  </div>

                  {/* Card stats */}
                  <div className="px-4 divide-y divide-[var(--border)]">
                    <StatRow label="Gross Income" value={formatByCurrency(r.grossIncome, meta.currency)} />
                    <StatRow label="Total Tax" value={formatByCurrency(r.totalTax, meta.currency)} variant="danger" />
                    <StatRow label="Net Income" value={formatByCurrency(r.netIncome, meta.currency)} variant="success" />
                    <StatRow label="Monthly Take-Home" value={formatByCurrency(r.monthlyTakeHome, meta.currency)} />
                    <StatRow label="Marginal Rate" value={formatPercent(r.marginalRate)} variant="accent" />
                  </div>

                  {/* Rank badge */}
                  {(isLowest || isHighest) && (
                    <div
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold"
                      style={{
                        background: isLowest ? '#16A34A10' : '#DC262610',
                        color: isLowest ? '#16A34A' : '#DC2626',
                      }}
                    >
                      {isLowest
                        ? <><TrendingDown className="h-3.5 w-3.5" /> Lowest tax burden</>
                        : <><TrendingUp className="h-3.5 w-3.5" /> Highest tax burden</>
                      }
                    </div>
                  )}
                  {!isLowest && !isHighest && (
                    <div className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[var(--text-muted)]">
                      <Minus className="h-3.5 w-3.5" /> Mid-range
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full comparison table */}
          <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-3 bg-[var(--surface-raised)] border-b border-[var(--border)]">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Full Comparison Table
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-muted)] bg-[var(--surface-raised)]">Metric</th>
                    {countries.map((c) => (
                      <th key={c} className="px-4 py-2.5 text-right font-semibold bg-[var(--surface-raised)]">
                        <CountryBadge code={c} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    { label: 'Gross Income', key: (r: TaxResult) => formatByCurrency(r.grossIncome, r.currency) },
                    { label: 'Total Tax', key: (r: TaxResult) => formatByCurrency(r.totalTax, r.currency), danger: true },
                    { label: 'Net Income', key: (r: TaxResult) => formatByCurrency(r.netIncome, r.currency), success: true },
                    { label: 'Monthly Take-Home', key: (r: TaxResult) => formatByCurrency(r.monthlyTakeHome, r.currency) },
                    { label: 'Weekly Take-Home', key: (r: TaxResult) => formatByCurrency(r.netIncome / 52, r.currency) },
                    { label: 'Effective Rate', key: (r: TaxResult) => formatPercent(r.effectiveRate), accent: true },
                    { label: 'Marginal Rate', key: (r: TaxResult) => formatPercent(r.marginalRate) },
                  ].map(({ label, key, danger, success, accent }) => (
                    <tr key={label} className="hover:bg-[var(--surface-raised)] transition-colors">
                      <td className="px-4 py-2.5 font-medium text-[var(--text-secondary)]">{label}</td>
                      {countries.map((c) => (
                        <td
                          key={c}
                          className={`px-4 py-2.5 text-right num ${
                            danger ? 'text-[var(--danger)]' :
                            success ? 'text-[var(--success)]' :
                            accent ? 'text-[var(--primary)]' :
                            'text-[var(--text-primary)]'
                          }`}
                        >
                          {key(results[c]!)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Effective rate bar chart */}
          <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-4">
              Effective Tax Rate Comparison
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={rateChartData} layout="vertical" margin={{ left: 8, right: 48, top: 4, bottom: 4 }}>
                <XAxis
                  type="number"
                  unit="%"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 'auto']}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  formatter={(v: unknown) => [`${v}%`, 'Effective Rate']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                  cursor={{ fill: 'var(--surface-raised)' }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 11, formatter: (v: unknown) => `${v}%`, fill: 'var(--text-muted)' }}>
                  {rateChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.hex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-4 py-3 bg-[var(--surface-raised)] border-b border-[var(--border)]">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Key Insights</h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              <div className="flex items-start gap-3 px-4 py-3.5">
                <TrendingDown className="h-4 w-4 mt-0.5 text-[var(--success)] shrink-0" />
                <div className="text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{COUNTRY_META[lowest].name}</span> has the lowest effective rate at{' '}
                  <span className="num font-semibold text-[var(--success)]">{formatPercent(results[lowest]!.effectiveRate)}</span>
                  {' '}— you take home{' '}
                  <span className="num font-semibold text-[var(--success)]">{formatByCurrency(results[lowest]!.netIncome, results[lowest]!.currency)}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3.5">
                <TrendingUp className="h-4 w-4 mt-0.5 text-[var(--danger)] shrink-0" />
                <div className="text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{COUNTRY_META[highest].name}</span> has the highest effective rate at{' '}
                  <span className="num font-semibold text-[var(--danger)]">{formatPercent(results[highest]!.effectiveRate)}</span>
                  {' '}— total tax of{' '}
                  <span className="num font-semibold text-[var(--danger)]">{formatByCurrency(results[highest]!.totalTax, results[highest]!.currency)}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3.5">
                <Globe className="h-4 w-4 mt-0.5 text-[var(--text-muted)] shrink-0" />
                <div className="text-sm text-[var(--text-secondary)]">
                  The tax difference between {COUNTRY_META[lowest].name} and {COUNTRY_META[highest].name} represents{' '}
                  <span className="num font-semibold text-[var(--text-primary)]">
                    {formatPercent(Math.abs(results[highest]!.effectiveRate - results[lowest]!.effectiveRate))}
                  </span>{' '}
                  of gross income. Defaults used are approximate baselines — use the individual calculators for precise estimates.
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!hasResults && !loading && income === 0 && (
        <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {countries.map((c) => (
                <span
                  key={c}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                  style={{ background: COUNTRY_META[c].hex + '18', color: COUNTRY_META[c].hex }}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Enter an income to compare all three countries</p>
            <p className="text-xs text-[var(--text-muted)]">Results update automatically as you type</p>
          </div>
        </div>
      )}
    </div>
  );
}
