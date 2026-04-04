'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TaxResult } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';

const COUNTRY_META = {
  IN: { flag: '🇮🇳', name: 'India', currency: 'INR', color: '#F59E0B' },
  US: { flag: '🇺🇸', name: 'USA', currency: 'USD', color: '#3B82F6' },
  UK: { flag: '🇬🇧', name: 'UK', currency: 'GBP', color: '#EF4444' },
};

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

  const countries = ['IN', 'US', 'UK'] as const;
  const hasResults = Object.keys(results).length === 3;

  const rateChartData = hasResults
    ? countries.map((c) => ({
        country: COUNTRY_META[c].flag + ' ' + COUNTRY_META[c].name,
        rate: parseFloat((results[c]!.effectiveRate * 100).toFixed(1)),
        color: COUNTRY_META[c].color,
      }))
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Compare Taxes — 🇮🇳 India vs 🇺🇸 USA vs 🇬🇧 UK</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter one income amount to see tax liability across all three countries side by side.
          Uses sensible defaults: India (Auto regime), US (Single, standard deduction), UK (England).
        </p>
      </div>

      {/* Income input */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <label className="block text-sm font-semibold mb-3">
          Annual Gross Income
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (enter in any currency — results shown in local currencies)
          </span>
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            placeholder="e.g. 1000000"
            value={income || ''}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-lg font-semibold outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Comparison uses the same number as the gross income for each country in its local currency.
        </p>
      </div>

      {loading && (
        <div className="py-12 text-center text-muted-foreground text-sm">Calculating...</div>
      )}

      {hasResults && !loading && (
        <>
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {countries.map((c) => {
              const r = results[c]!;
              const meta = COUNTRY_META[c];
              return (
                <div key={c} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{meta.flag}</span>
                    <div>
                      <p className="font-bold">{meta.name}</p>
                      <p className="text-xs text-muted-foreground">{meta.currency}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gross Income</span>
                      <span className="font-medium">{formatByCurrency(r.grossIncome, meta.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Tax</span>
                      <span className="font-semibold text-red-600">{formatByCurrency(r.totalTax, meta.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Net Income</span>
                      <span className="font-semibold text-green-600">{formatByCurrency(r.netIncome, meta.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Take-Home</span>
                      <span className="font-medium">{formatByCurrency(r.monthlyTakeHome, meta.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-border">
                      <span className="text-muted-foreground">Effective Rate</span>
                      <span
                        className="font-bold text-base"
                        style={{ color: meta.color }}
                      >
                        {formatPercent(r.effectiveRate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Effective rate comparison chart */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
            <h2 className="text-sm font-semibold mb-4">Effective Tax Rate Comparison</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rateChartData} layout="vertical" margin={{ left: 20, right: 40 }}>
                <XAxis type="number" unit="%" tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                <YAxis type="category" dataKey="country" tick={{ fontSize: 13 }} width={90} />
                <Tooltip
                  formatter={(v) => [`${v}%`, 'Effective Rate']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', fontSize: '12px' }}
                />
                <Bar dataKey="rate" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 12, formatter: (v: unknown) => `${v}%` }}>
                  {rateChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insight callouts */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Key Insights</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {(() => {
                const sorted = countries.slice().sort((a, b) => results[a]!.effectiveRate - results[b]!.effectiveRate);
                const lowest = sorted[0];
                const highest = sorted[2];
                const lowestMeta = COUNTRY_META[lowest];
                const highestMeta = COUNTRY_META[highest];
                const taxDiff = results[highest]!.totalTax - results[lowest]!.totalTax;
                return [
                  <li key="lowest">
                    <span className="font-medium text-green-600">{lowestMeta.flag} {lowestMeta.name}</span> has the lowest effective rate at{' '}
                    <strong>{formatPercent(results[lowest]!.effectiveRate)}</strong>
                  </li>,
                  <li key="highest">
                    <span className="font-medium text-red-600">{highestMeta.flag} {highestMeta.name}</span> has the highest effective rate at{' '}
                    <strong>{formatPercent(results[highest]!.effectiveRate)}</strong>
                  </li>,
                  <li key="diff">
                    The tax difference between {lowestMeta.name} and {highestMeta.name} is approximately{' '}
                    <strong>{formatByCurrency(Math.abs(taxDiff), results[lowest]!.currency)}</strong> equivalent
                  </li>,
                ];
              })()}
            </ul>
          </div>
        </>
      )}

      {!hasResults && !loading && income === 0 && (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <div>
            <p className="text-2xl mb-2">🇮🇳 🇺🇸 🇬🇧</p>
            <p className="text-sm text-muted-foreground">Enter an income amount above to compare all three countries</p>
          </div>
        </div>
      )}
    </div>
  );
}
