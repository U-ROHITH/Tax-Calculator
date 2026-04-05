'use client';

import { useState } from 'react';
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  AlertTriangle,
  Info,
  Trash2,
  Plus,
  ChevronDown,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Country = 'IN' | 'US' | 'UK';
type FilingStatus = 'single' | 'married_joint';

interface CryptoTrade {
  id: string;
  asset: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  buyDate: string;   // "YYYY-MM"
  sellDate: string;  // "YYYY-MM"
  isSell: boolean;
}

interface TradeResult {
  trade: CryptoTrade;
  holdingMonths: number;
  isLongTerm: boolean;
  gain: number;
  taxRate: number;
  taxAmount: number;
  warning?: string;
}

// ─── Tax Engine ───────────────────────────────────────────────────────────────

function calcCryptoTax(
  trade: CryptoTrade,
  country: Country,
  _filingStatus: FilingStatus,
  ordinaryIncomeRate: number,
): TradeResult {
  const gain = (trade.sellPrice - trade.buyPrice) * trade.quantity;

  const [buyY, buyM] = trade.buyDate.split('-').map(Number);
  const [sellY, sellM] = trade.sellDate.split('-').map(Number);
  const holdingMonths = (sellY - buyY) * 12 + (sellM - buyM);

  if (country === 'IN') {
    return {
      trade,
      holdingMonths,
      isLongTerm: false,
      gain,
      taxRate: 0.3,
      taxAmount: Math.max(0, gain) * 0.3,
      warning:
        gain < 0
          ? 'In India, crypto losses cannot be set off against any income or carried forward.'
          : undefined,
    };
  }

  if (country === 'US') {
    const isLongTerm = holdingMonths >= 12;
    let taxRate: number;
    if (!isLongTerm) {
      taxRate = ordinaryIncomeRate;
    } else {
      taxRate =
        ordinaryIncomeRate > 0.35 ? 0.2 : ordinaryIncomeRate > 0.12 ? 0.15 : 0.0;
    }
    const washSaleWarning =
      gain < 0 && holdingMonths < 1
        ? 'US wash sale rule: if you repurchase this asset within 30 days, the loss is disallowed. Unlike stocks, crypto wash sale rules may be applied by IRS.'
        : undefined;
    return {
      trade,
      holdingMonths,
      isLongTerm,
      gain,
      taxRate,
      taxAmount: Math.max(0, gain) * taxRate,
      warning: washSaleWarning,
    };
  }

  if (country === 'UK') {
    const isHigherRate = ordinaryIncomeRate >= 0.4;
    const isLongTerm = holdingMonths >= 12;
    const taxRate = isHigherRate ? 0.2 : 0.1;
    const annualExempt = 3000;
    const taxableGain = Math.max(0, gain - annualExempt);
    return {
      trade,
      holdingMonths,
      isLongTerm,
      gain,
      taxRate,
      taxAmount: taxableGain * taxRate,
    };
  }

  return { trade, holdingMonths, isLongTerm: false, gain, taxRate: 0, taxAmount: 0 };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const YEARS = Array.from({ length: 11 }, (_, i) => 2015 + i); // 2015–2025

const US_RATES = [
  { label: '10%', value: 0.10 },
  { label: '22%', value: 0.22 },
  { label: '32%', value: 0.32 },
  { label: '37%', value: 0.37 },
];

const UK_RATES = [
  { label: '20%', value: 0.20 },
  { label: '40%', value: 0.40 },
  { label: '45%', value: 0.45 },
];

const COUNTRY_CONFIG: Record<Country, { label: string; currency: string; currencySymbol: string; color: string }> = {
  IN: { label: 'India', currency: 'INR', currencySymbol: '₹', color: 'var(--india)' },
  US: { label: 'United States', currency: 'USD', currencySymbol: '$', color: 'var(--us)' },
  UK: { label: 'United Kingdom', currency: 'GBP', currencySymbol: '£', color: 'var(--uk)' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtCurrency(n: number, symbol: string) {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (n < 0 ? '-' : '') + symbol + formatted;
}

function fmtPercent(rate: number) {
  return (rate * 100).toFixed(0) + '%';
}

function fmtHolding(months: number) {
  if (months < 1) return '< 1 month';
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`;
  return `${y}y ${m}m`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 text-[var(--text-primary)]';

const SELECT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 text-[var(--text-primary)] appearance-none';

function KPICard({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
          {label}
        </p>
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
      </div>
      <p className={`num text-xl font-bold ${accent ?? 'text-[var(--text-primary)]'}`}>
        {value}
      </p>
    </div>
  );
}

function MonthYearPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string; // "YYYY-MM"
  onChange: (v: string) => void;
}) {
  const [year, month] = value ? value.split('-') : ['2024', '01'];

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            className={SELECT_CLASS}
            value={month}
            onChange={(e) => onChange(`${year}-${e.target.value}`)}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={String(i + 1).padStart(2, '0')}>
                {m.slice(0, 3)}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <div className="relative flex-1">
          <select
            className={SELECT_CLASS}
            value={year}
            onChange={(e) => onChange(`${e.target.value}-${month}`)}
          >
            {YEARS.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
        </div>
      </div>
    </div>
  );
}

function RateSegment({
  rates,
  value,
  onChange,
}: {
  rates: { label: string; value: number }[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--background)]">
      {rates.map((r) => (
        <button
          key={r.label}
          type="button"
          onClick={() => onChange(r.value)}
          className={[
            'flex-1 py-2 text-xs font-medium transition-colors duration-100',
            value === r.value
              ? 'bg-[var(--primary)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]',
          ].join(' ')}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

// ─── Empty State Info Cards ───────────────────────────────────────────────────

function TaxRuleCards() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
        Crypto Tax Rules by Country
      </h3>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 h-2 w-2 rounded-sm shrink-0"
            style={{ background: 'var(--india)' }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--india)' }}>
              India — Section 115BBH
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
              30% flat tax on all crypto gains, regardless of holding period. No deductions
              except cost of acquisition. Losses cannot be set off against any income or
              carried forward.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 h-2 w-2 rounded-sm shrink-0"
            style={{ background: 'var(--us)' }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--us)' }}>
              United States — Capital Gains Tax
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
              Short-term gains (held &lt;1 year) taxed at your ordinary income rate.
              Long-term gains (held &ge;1 year) qualify for preferential rates of 0%, 15%,
              or 20%. Wash sale rules may apply.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 h-2 w-2 rounded-sm shrink-0"
            style={{ background: 'var(--uk)' }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--uk)' }}>
              United Kingdom — Capital Gains Tax
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
              CGT at 10% (basic rate) or 20% (higher/additional rate) on crypto as &quot;other
              assets&quot;. £3,000 annual CGT exemption for 2025-26.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MAX_TRADES = 10;

export default function CryptoTaxCalculator() {
  const [country, setCountry] = useState<Country>('IN');
  const [incomeRate, setIncomeRate] = useState<number>(0.22);
  const [trades, setTrades] = useState<CryptoTrade[]>([]);

  // Form state
  const [asset, setAsset] = useState('');
  const [buyDate, setBuyDate] = useState('2024-01');
  const [sellDate, setSellDate] = useState('2025-01');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [formError, setFormError] = useState('');

  const cfg = COUNTRY_CONFIG[country];

  // Compute results
  const results: TradeResult[] = trades.map((t) =>
    calcCryptoTax(t, country, 'single', incomeRate),
  );

  const totalGains = results.reduce((s, r) => (r.gain > 0 ? s + r.gain : s), 0);
  const totalLosses = results.reduce((s, r) => (r.gain < 0 ? s + r.gain : s), 0);
  const netGain = results.reduce((s, r) => s + r.gain, 0);

  // For US/UK, losses can offset gains
  let totalTax: number;
  if (country === 'IN') {
    totalTax = results.reduce((s, r) => s + r.taxAmount, 0);
  } else {
    // Net gain for offsetting
    totalTax = results.reduce((s, r) => s + r.taxAmount, 0);
  }

  function handleAddTrade() {
    setFormError('');
    if (!asset.trim()) { setFormError('Asset name is required.'); return; }
    if (!buyPrice || isNaN(Number(buyPrice)) || Number(buyPrice) <= 0) {
      setFormError('Enter a valid buy price.'); return;
    }
    if (!sellPrice || isNaN(Number(sellPrice)) || Number(sellPrice) <= 0) {
      setFormError('Enter a valid sell price.'); return;
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setFormError('Enter a valid quantity.'); return;
    }
    if (buyDate >= sellDate) {
      setFormError('Sell date must be after buy date.'); return;
    }
    if (trades.length >= MAX_TRADES) {
      setFormError(`Maximum ${MAX_TRADES} trades allowed.`); return;
    }

    const newTrade: CryptoTrade = {
      id: uid(),
      asset: asset.trim(),
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
      quantity: Number(quantity),
      buyDate,
      sellDate,
      isSell: true,
    };

    setTrades((prev) => [...prev, newTrade]);
    setAsset('');
    setBuyPrice('');
    setSellPrice('');
    setQuantity('');
  }

  function handleRemoveTrade(id: string) {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  }

  const warnings = results.filter((r) => r.warning);
  const currentRates = country === 'US' ? US_RATES : country === 'UK' ? UK_RATES : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bitcoin className="h-6 w-6" style={{ color: 'var(--warning)' }} />
          <h1 className="text-2xl font-bold sm:text-3xl text-[var(--text-primary)]">
            Crypto Tax Calculator
          </h1>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          India · United States · United Kingdom — 2025 Tax Rules
        </p>
      </div>

      {/* Country tabs */}
      <div className="flex gap-1 mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 w-fit">
        {(['IN', 'US', 'UK'] as Country[]).map((c) => {
          const active = country === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              className={[
                'px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-100',
                active
                  ? 'text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
              style={active ? { background: COUNTRY_CONFIG[c].color } : undefined}
            >
              {COUNTRY_CONFIG[c].label}
            </button>
          );
        })}
      </div>

      {/* Main layout: left (inputs) + right (results) */}
      <div className="flex gap-6 flex-col xl:flex-row">
        {/* ── LEFT PANEL ── */}
        <div className="w-full xl:w-[420px] shrink-0 flex flex-col gap-4">

          {/* Country info card */}
          {country === 'IN' && (
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--india)',
                background: 'color-mix(in srgb, var(--india) 8%, var(--surface))',
              }}
            >
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--india)' }} />
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--india)' }}>
                    India — Section 115BBH
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    30% flat tax on all crypto gains. No deductions except cost of acquisition.
                    Losses cannot be set off against any other income or carried forward.
                  </p>
                </div>
              </div>
            </div>
          )}

          {country === 'US' && (
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--us)',
                background: 'color-mix(in srgb, var(--us) 8%, var(--surface))',
              }}
            >
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--us)' }} />
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--us)' }}>
                    United States — Capital Gains Tax
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    STCG at ordinary income rate if held &lt;1 year. LTCG at 0/15/20% if held
                    &ge;1 year. Wash sale rules may apply to losses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {country === 'UK' && (
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--uk)',
                background: 'color-mix(in srgb, var(--uk) 8%, var(--surface))',
              }}
            >
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--uk)' }} />
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--uk)' }}>
                    United Kingdom — CGT
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    CGT at 10% (basic rate) or 20% (higher rate). £3,000 annual exempt amount
                    for 2025-26. Crypto treated as &quot;other assets&quot;.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Income tax rate selector (US/UK only) */}
          {country !== 'IN' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Your income tax rate
              </p>
              <RateSegment
                rates={currentRates}
                value={incomeRate}
                onChange={setIncomeRate}
              />
            </div>
          )}

          {/* Add trade form */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Add Trade</h2>
              <span className="text-xs text-[var(--text-muted)]">
                {trades.length}/{MAX_TRADES} trades
              </span>
            </div>

            {/* Asset */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Asset
              </label>
              <input
                type="text"
                className={INPUT_CLASS}
                placeholder="Bitcoin, Ethereum, USDT..."
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                maxLength={60}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <MonthYearPicker label="Buy Date" value={buyDate} onChange={setBuyDate} />
              <MonthYearPicker label="Sell Date" value={sellDate} onChange={setSellDate} />
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Buy Price (per unit)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-[var(--text-muted)] select-none">
                    {cfg.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className={INPUT_CLASS + ' pl-7'}
                    placeholder="0.00"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Sell Price (per unit)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-[var(--text-muted)] select-none">
                    {cfg.currencySymbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className={INPUT_CLASS + ' pl-7'}
                    placeholder="0.00"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                step="any"
                className={INPUT_CLASS}
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {formError && (
              <p className="text-xs text-[var(--danger)] flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                {formError}
              </p>
            )}

            <button
              type="button"
              onClick={handleAddTrade}
              disabled={trades.length >= MAX_TRADES}
              className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Add Trade
            </button>
          </div>

          {/* Trade list */}
          {trades.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Added Trades
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left px-3 py-2 font-medium text-[var(--text-muted)]">Asset</th>
                      <th className="text-right px-3 py-2 font-medium text-[var(--text-muted)]">Buy</th>
                      <th className="text-right px-3 py-2 font-medium text-[var(--text-muted)]">Sell</th>
                      <th className="text-right px-3 py-2 font-medium text-[var(--text-muted)]">Qty</th>
                      <th className="text-center px-3 py-2 font-medium text-[var(--text-muted)]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t) => (
                      <tr key={t.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="px-3 py-2 text-[var(--text-primary)] font-medium max-w-[80px] truncate">
                          {t.asset}
                        </td>
                        <td className="px-3 py-2 text-right text-[var(--text-secondary)] num">
                          {t.buyDate}
                        </td>
                        <td className="px-3 py-2 text-right text-[var(--text-secondary)] num">
                          {t.sellDate}
                        </td>
                        <td className="px-3 py-2 text-right text-[var(--text-secondary)] num">
                          {t.quantity}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveTrade(t.id)}
                            className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors duration-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL — Results ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {trades.length === 0 ? (
            <TaxRuleCards />
          ) : (
            <>
              {/* KPI summary */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KPICard
                  label="Total Gains"
                  value={fmtCurrency(totalGains, cfg.currencySymbol)}
                  accent="text-[var(--success)]"
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                />
                <KPICard
                  label="Total Losses"
                  value={fmtCurrency(totalLosses, cfg.currencySymbol)}
                  accent={totalLosses < 0 ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}
                  icon={<TrendingDown className="h-3.5 w-3.5" />}
                />
                <KPICard
                  label="Net Gain / Loss"
                  value={fmtCurrency(netGain, cfg.currencySymbol)}
                  accent={
                    netGain > 0
                      ? 'text-[var(--success)]'
                      : netGain < 0
                      ? 'text-[var(--danger)]'
                      : 'text-[var(--text-primary)]'
                  }
                  icon={<ArrowUpDown className="h-3.5 w-3.5" />}
                />
                <KPICard
                  label="Total Tax Due"
                  value={fmtCurrency(totalTax, cfg.currencySymbol)}
                  accent="text-[var(--warning)]"
                  icon={<Bitcoin className="h-3.5 w-3.5" />}
                />
              </div>

              {/* India TDS note */}
              {country === 'IN' && (
                <div className="rounded-xl border border-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_8%,var(--surface))] p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[var(--warning)]" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--warning)] mb-1">
                        Section 194S — TDS on Crypto Transactions
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        If selling crypto on an exchange, 1% TDS is deducted at source on sale
                        value &gt;&#8239;₹50,000 (₹10,000 for non-exchange transfers). This TDS
                        is creditable against your final tax liability.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Per-trade results table */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    Trade-by-Trade Breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                        <th className="text-left px-4 py-2 font-medium text-[var(--text-muted)]">Asset</th>
                        <th className="text-right px-4 py-2 font-medium text-[var(--text-muted)]">Holding</th>
                        <th className="text-right px-4 py-2 font-medium text-[var(--text-muted)]">Type</th>
                        <th className="text-right px-4 py-2 font-medium text-[var(--text-muted)]">Gain / Loss</th>
                        <th className="text-right px-4 py-2 font-medium text-[var(--text-muted)]">Rate</th>
                        <th className="text-right px-4 py-2 font-medium text-[var(--text-muted)]">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r) => (
                        <tr
                          key={r.trade.id}
                          className={[
                            'border-b border-[var(--border)] last:border-0',
                            r.warning ? 'bg-[color-mix(in_srgb,var(--warning)_5%,transparent)]' : '',
                          ].join(' ')}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-[var(--text-primary)]">
                                {r.trade.asset}
                              </span>
                              {r.warning && (
                                <AlertTriangle className="h-3 w-3 shrink-0 text-[var(--warning)]" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right num text-[var(--text-secondary)]">
                            {fmtHolding(r.holdingMonths)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {country === 'IN' ? (
                              <span className="text-[var(--text-secondary)]">Flat 30%</span>
                            ) : (
                              <span
                                className={
                                  r.isLongTerm
                                    ? 'text-[var(--success)] font-medium'
                                    : 'text-[var(--warning)] font-medium'
                                }
                              >
                                {r.isLongTerm ? 'LTCG' : 'STCG'}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right num font-medium">
                            <span
                              style={{
                                color: r.gain >= 0 ? 'var(--success)' : 'var(--danger)',
                              }}
                            >
                              {fmtCurrency(r.gain, cfg.currencySymbol)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right num text-[var(--text-secondary)]">
                            {fmtPercent(r.taxRate)}
                          </td>
                          <td className="px-4 py-3 text-right num font-semibold text-[var(--text-primary)]">
                            {fmtCurrency(r.taxAmount, cfg.currencySymbol)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="flex flex-col gap-2">
                  {warnings.map((r) => (
                    <div
                      key={r.trade.id}
                      className="rounded-xl border border-[var(--warning)] bg-[color-mix(in_srgb,var(--warning)_8%,var(--surface))] p-3"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[var(--warning)]" />
                        <div>
                          <p className="text-xs font-semibold text-[var(--warning)] mb-0.5">
                            {r.trade.asset}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {r.warning}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* US carry-forward note */}
              {country === 'US' && totalLosses < 0 && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-[var(--us)]" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Net capital loss carry-forward:
                      </span>{' '}
                      Net capital losses can be deducted up to $3,000/year against ordinary
                      income. Remaining losses carry forward indefinitely to offset future
                      capital gains.
                    </p>
                  </div>
                </div>
              )}

              {/* UK exemption note */}
              {country === 'UK' && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-[var(--uk)]" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">
                        UK Annual CGT Exemption:
                      </span>{' '}
                      £3,000 annual CGT exemption (2025-26) has been applied once across the
                      first qualifying gain. Consult a tax adviser for multiple asset CGT
                      pooling rules.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
