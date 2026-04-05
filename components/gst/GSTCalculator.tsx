'use client';

import { useState } from 'react';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

type GSTRate = 0 | 5 | 12 | 18 | 28;

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

const GST_RATES: GSTRate[] = [0, 5, 12, 18, 28];

const RATE_GUIDE = [
  { category: 'Exempt (food grains, fresh vegetables, milk)', rate: '0%' },
  { category: 'Essential goods (sugar, tea, coffee, edible oil)', rate: '5%' },
  { category: 'Standard goods (butter, cheese, frozen meat)', rate: '12%' },
  { category: 'Standard services (restaurants, telecom, banking)', rate: '18%' },
  { category: 'Luxury goods (cars >₹10L, tobacco, aerated drinks)', rate: '28%' },
  { category: 'Professional services (CA, doctor, lawyer)', rate: '18%' },
  { category: 'Rent on residential property (if registered)', rate: '18%' },
  { category: 'Construction services', rate: '12% / 18%' },
  { category: 'Export of goods/services', rate: '0% (zero-rated)' },
];

function fmt(n: number) {
  return (
    '\u20B9' +
    n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function KPICard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`num text-xl font-bold ${accent ?? 'text-[var(--text-primary)]'}`}>
        {value}
      </p>
    </div>
  );
}

export default function GSTCalculator() {
  const [transactionValue, setTransactionValue] = useState<string>('');
  const [gstRate, setGstRate] = useState<GSTRate>(18);
  const [supplyType, setSupplyType] = useState<'intra' | 'inter'>('intra');
  const [isInclusive, setIsInclusive] = useState(false);
  const [isReverseCharge, setIsReverseCharge] = useState(false);

  const rawValue = parseFloat(transactionValue) || 0;

  const base = isInclusive ? rawValue / (1 + gstRate / 100) : rawValue;
  const totalGST = base * (gstRate / 100);
  const cgst = supplyType === 'intra' ? totalGST / 2 : 0;
  const sgst = supplyType === 'intra' ? totalGST / 2 : 0;
  const igst = supplyType === 'inter' ? totalGST : 0;
  const totalAmount = isInclusive ? rawValue : base + totalGST;

  const hasValue = rawValue > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          GST Calculator — India
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          CGST + SGST for intra-state transactions · IGST for inter-state transactions · FY 2025-26
        </p>
      </div>

      {/* Main 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Left — Input Form */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5 h-fit">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Transaction Details</h2>

          {/* Transaction Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Transaction Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none">
                &#8377;
              </span>
              <input
                type="number"
                value={transactionValue}
                onChange={(e) => setTransactionValue(e.target.value)}
                placeholder="0"
                className={`${INPUT_CLASS} pl-6`}
                min="0"
              />
            </div>
          </div>

          {/* GST Inclusive toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative inline-block w-9 h-5">
              <input
                type="checkbox"
                checked={isInclusive}
                onChange={(e) => setIsInclusive(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-lg transition-colors ${
                  isInclusive ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-md bg-white shadow-sm transition-transform ${
                    isInclusive ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Amount is GST inclusive</span>
          </label>

          {/* GST Rate segment control */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">GST Rate</label>
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden w-fit">
              {GST_RATES.map((r) => (
                <button
                  key={r}
                  onClick={() => setGstRate(r)}
                  className={[
                    'px-3 py-1.5 text-sm font-medium transition-colors',
                    gstRate === r
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                  ].join(' ')}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Supply Type segment control */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Supply Type</label>
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => setSupplyType('intra')}
                className={[
                  'flex-1 px-3 py-1.5 text-sm font-medium transition-colors',
                  supplyType === 'intra'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                ].join(' ')}
              >
                Intra-state (CGST+SGST)
              </button>
              <button
                onClick={() => setSupplyType('inter')}
                className={[
                  'flex-1 px-3 py-1.5 text-sm font-medium transition-colors',
                  supplyType === 'inter'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
                ].join(' ')}
              >
                Inter-state (IGST)
              </button>
            </div>
          </div>

          {/* Reverse Charge */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isReverseCharge}
              onChange={(e) => setIsReverseCharge(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border border-[var(--border)] accent-[var(--primary)]"
            />
            <span className="text-sm text-[var(--text-secondary)]">
              Reverse Charge Mechanism applies
            </span>
          </label>
        </div>

        {/* Right — Results */}
        <div className="space-y-5">
          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-4">
            <KPICard label="Base Value" value={hasValue ? fmt(base) : '\u2014'} />
            <KPICard
              label="Total GST"
              value={hasValue ? fmt(totalGST) : '\u2014'}
              accent="text-[var(--india)]"
            />
            <KPICard
              label="Total Invoice Value"
              value={hasValue ? fmt(totalAmount) : '\u2014'}
              accent="text-[var(--primary)]"
            />
            <KPICard
              label={supplyType === 'intra' ? 'CGST + SGST' : 'IGST'}
              value={
                hasValue
                  ? supplyType === 'intra'
                    ? `${fmt(cgst)} + ${fmt(sgst)}`
                    : fmt(igst)
                  : '\u2014'
              }
              accent="text-[var(--india)]"
            />
          </div>

          {/* Breakdown table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Invoice Breakdown
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-[var(--text-secondary)]">
                    Component
                  </th>
                  <th className="px-5 py-2.5 text-center text-xs font-semibold text-[var(--text-secondary)]">
                    Rate
                  </th>
                  <th className="px-5 py-2.5 text-right text-xs font-semibold text-[var(--text-secondary)]">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="px-5 py-3 text-[var(--text-secondary)]">Base Value</td>
                  <td className="px-5 py-3 text-center text-[var(--text-muted)]">&mdash;</td>
                  <td className="px-5 py-3 text-right num text-[var(--text-primary)]">
                    {hasValue ? fmt(base) : '\u2014'}
                  </td>
                </tr>

                {supplyType === 'intra' && (
                  <>
                    <tr>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">CGST</td>
                      <td className="px-5 py-3 text-center text-[var(--text-muted)]">
                        {gstRate / 2}%
                      </td>
                      <td className="px-5 py-3 text-right num text-[var(--india)]">
                        {hasValue ? fmt(cgst) : '\u2014'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 text-[var(--text-secondary)]">SGST</td>
                      <td className="px-5 py-3 text-center text-[var(--text-muted)]">
                        {gstRate / 2}%
                      </td>
                      <td className="px-5 py-3 text-right num text-[var(--india)]">
                        {hasValue ? fmt(sgst) : '\u2014'}
                      </td>
                    </tr>
                  </>
                )}

                {supplyType === 'inter' && (
                  <tr>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">IGST</td>
                    <td className="px-5 py-3 text-center text-[var(--text-muted)]">{gstRate}%</td>
                    <td className="px-5 py-3 text-right num text-[var(--india)]">
                      {hasValue ? fmt(igst) : '\u2014'}
                    </td>
                  </tr>
                )}

                <tr className="bg-[var(--surface-raised)] border-t-2 border-[var(--border-strong)]">
                  <td className="px-5 py-3 font-semibold text-[var(--text-primary)]">
                    Total Invoice Value
                  </td>
                  <td className="px-5 py-3" />
                  <td className="px-5 py-3 text-right num font-bold text-[var(--primary)]">
                    {hasValue ? fmt(totalAmount) : '\u2014'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reverse Charge warning */}
          {isReverseCharge && (
            <div className="flex gap-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-4">
              <AlertTriangle className="h-4 w-4 text-[var(--warning)] mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">
                  Reverse Charge Mechanism (RCM):
                </span>{' '}
                Under RCM, the recipient is liable to pay GST directly to the government. The
                supplier does not charge GST on the invoice.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* GST Rate Guide */}
      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-raised)]">
          <Info className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">GST Rate Guide</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-5 py-2.5 text-left text-xs font-semibold text-[var(--text-secondary)]">
                Category
              </th>
              <th className="px-5 py-2.5 text-right text-xs font-semibold text-[var(--text-secondary)]">
                Rate
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {RATE_GUIDE.map((row) => (
              <tr
                key={row.category}
                className="hover:bg-[var(--surface-raised)] transition-colors"
              >
                <td className="px-5 py-3 text-[var(--text-secondary)]">{row.category}</td>
                <td className="px-5 py-3 text-right num font-medium text-[var(--india)]">
                  {row.rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Composition Scheme info card */}
      <div className="mt-4 rounded-xl border border-[var(--india)]/30 bg-[var(--india)]/10 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-4 w-4 text-[var(--india)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Composition Scheme (u/s 10)
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Traders with turnover &le; &#8377;1.5Cr, manufacturers &le; &#8377;1.5Cr, restaurants
              &le; &#8377;1.5Cr can opt. Pay 1&ndash;5% flat on turnover instead of regular GST.
              Cannot claim Input Tax Credit (ITC). Cannot supply interstate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
