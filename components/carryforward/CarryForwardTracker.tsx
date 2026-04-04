'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Trash2,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  Wallet,
  RotateCcw,
  Info,
} from 'lucide-react';
import { CarryForwardLoss, CarryForwardSummary } from '@/engine/types';
import {
  computeCarryForwardSetOff,
  computeExpiryFY,
} from '@/engine/carryforward';

// ─── Constants ────────────────────────────────────────────────────────────────

const LOSS_TYPES: { value: CarryForwardLoss['type']; label: string }[] = [
  { value: 'business', label: 'Business Loss' },
  { value: 'ltcg', label: 'Long-Term Capital Loss (LTCG)' },
  { value: 'stcg', label: 'Short-Term Capital Loss (STCG)' },
  { value: 'house_property', label: 'House Property Loss' },
  { value: 'depreciation', label: 'Unabsorbed Depreciation' },
];

const LOSS_TYPE_SHORT: Record<CarryForwardLoss['type'], string> = {
  business: 'Business',
  ltcg: 'LTCG',
  stcg: 'STCG',
  house_property: 'House Property',
  depreciation: 'Depreciation',
};

const FY_OPTIONS = [
  'FY 2017-18',
  'FY 2018-19',
  'FY 2019-20',
  'FY 2020-21',
  'FY 2021-22',
  'FY 2022-23',
  'FY 2023-24',
  'FY 2024-25',
];

const CURRENT_FY = 'FY 2025-26';

const MARGINAL_RATES = [
  { label: '5%', value: 0.05 },
  { label: '10%', value: 0.10 },
  { label: '20%', value: 0.20 },
  { label: '30%', value: 0.30 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(n));
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  colorClass,
  icon: Icon,
}: {
  label: string;
  value: string;
  colorClass: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${colorClass}`} />
        <span className="text-xs text-[var(--text-muted)] font-medium">{label}</span>
      </div>
      <p className={`num text-xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CurrentIncome {
  business: number;
  ltcg: number;
  stcg: number;
  marginalRate: number;
}

export default function CarryForwardTracker() {
  const [losses, setLosses] = useState<CarryForwardLoss[]>([]);
  const [currentIncome, setCurrentIncome] = useState<CurrentIncome>({
    business: 0,
    ltcg: 0,
    stcg: 0,
    marginalRate: 0.30,
  });
  const [summary, setSummary] = useState<CarryForwardSummary | null>(null);

  // Form state for adding a new loss
  const [formType, setFormType] = useState<CarryForwardLoss['type']>('business');
  const [formFY, setFormFY] = useState<string>('FY 2022-23');
  const [formAmount, setFormAmount] = useState<string>('');

  // Debounce ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recompute whenever losses or income changes
  const recompute = useCallback(() => {
    if (losses.length === 0) {
      setSummary(null);
      return;
    }
    const result = computeCarryForwardSetOff(
      losses,
      CURRENT_FY,
      currentIncome.business,
      currentIncome.ltcg,
      currentIncome.stcg,
      currentIncome.marginalRate,
    );
    setSummary(result);
  }, [losses, currentIncome]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(recompute, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [recompute]);

  function addLoss() {
    const amt = parseFloat(formAmount);
    if (!formAmount || isNaN(amt) || amt <= 0) return;
    const expiryFY = computeExpiryFY(formType, formFY);
    const newLoss: CarryForwardLoss = {
      id: uid(),
      type: formType,
      yearOfLoss: formFY,
      originalAmount: amt,
      remainingBalance: amt,
      expiryFY,
    };
    setLosses((prev) => [...prev, newLoss]);
    setFormAmount('');
  }

  function removeLoss(id: string) {
    setLosses((prev) => prev.filter((l) => l.id !== id));
  }

  function updateIncome(field: keyof CurrentIncome, value: number | string) {
    setCurrentIncome((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  }

  // Build breakdown map from summary
  const breakdownMap: Record<
    CarryForwardLoss['type'],
    { available: number; used: number; remaining: number }
  > = {
    business: { available: 0, used: 0, remaining: 0 },
    ltcg: { available: 0, used: 0, remaining: 0 },
    stcg: { available: 0, used: 0, remaining: 0 },
    house_property: { available: 0, used: 0, remaining: 0 },
    depreciation: { available: 0, used: 0, remaining: 0 },
  };
  if (summary) {
    summary.updatedLosses.forEach((l) => {
      const orig = losses.find((o) => o.id === l.id);
      if (!orig) return;
      breakdownMap[l.type].available += orig.remainingBalance;
      breakdownMap[l.type].used += l.setOffThisYear ?? 0;
      breakdownMap[l.type].remaining += l.remainingBalance;
    });
  }

  const breakdownRows = LOSS_TYPES.filter(
    (t) => breakdownMap[t.value].available > 0,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
          Loss Carry-Forward Tracker
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          India · {CURRENT_FY} · Business, Capital Gains &amp; Depreciation Losses
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[480px] shrink-0 space-y-6">

          {/* Section 1: Current Year Income */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
              Current Year Income ({CURRENT_FY})
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Business / Profession Income (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentIncome.business || ''}
                  onChange={(e) => updateIncome('business', e.target.value)}
                  placeholder="0"
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Long-Term Capital Gains (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentIncome.ltcg || ''}
                  onChange={(e) => updateIncome('ltcg', e.target.value)}
                  placeholder="0"
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Short-Term Capital Gains (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={currentIncome.stcg || ''}
                  onChange={(e) => updateIncome('stcg', e.target.value)}
                  placeholder="0"
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[var(--text-secondary)]">
                  Applicable Marginal Rate
                </label>
                <div className="flex gap-2">
                  {MARGINAL_RATES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => updateIncome('marginalRate', r.value)}
                      className={[
                        'flex-1 h-9 rounded-lg border text-xs font-medium transition-colors',
                        currentIncome.marginalRate === r.value
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                          : 'border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
                      ].join(' ')}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Brought-Forward Losses */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
              Brought-Forward Losses
            </h2>

            {/* Add Loss Form */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Loss Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as CarryForwardLoss['type'])}
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                >
                  {LOSS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    FY of Loss
                  </label>
                  <select
                    value={formFY}
                    onChange={(e) => setFormFY(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  >
                    {FY_OPTIONS.map((fy) => (
                      <option key={fy} value={fy}>
                        {fy}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Remaining Balance (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    onKeyDown={(e) => e.key === 'Enter' && addLoss()}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                  />
                </div>
              </div>
              <button
                onClick={addLoss}
                disabled={!formAmount || parseFloat(formAmount) <= 0}
                className="flex w-full items-center justify-center gap-2 h-10 rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Loss
              </button>
            </div>

            {/* Loss list */}
            {losses.length > 0 && (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-2 px-1 text-[var(--text-muted)] font-medium">Type</th>
                      <th className="text-left py-2 px-1 text-[var(--text-muted)] font-medium">FY</th>
                      <th className="text-right py-2 px-1 text-[var(--text-muted)] font-medium">Amount</th>
                      <th className="text-left py-2 px-1 text-[var(--text-muted)] font-medium">Expires</th>
                      <th className="py-2 px-1 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {losses.map((loss) => (
                      <tr key={loss.id} className="border-b border-[var(--border)] last:border-0">
                        <td className="py-2 px-1 text-[var(--text-primary)] font-medium">
                          {LOSS_TYPE_SHORT[loss.type]}
                        </td>
                        <td className="py-2 px-1 text-[var(--text-secondary)]">{loss.yearOfLoss}</td>
                        <td className="py-2 px-1 text-right num text-[var(--text-primary)]">
                          {fmt(loss.remainingBalance)}
                        </td>
                        <td className="py-2 px-1 text-[var(--text-secondary)]">
                          {loss.expiryFY}
                        </td>
                        <td className="py-2 px-1">
                          <button
                            onClick={() => removeLoss(loss.id)}
                            className="flex items-center justify-center h-6 w-6 rounded text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                            aria-label="Remove loss"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {losses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingDown className="h-8 w-8 text-[var(--text-muted)] mb-2" />
                <p className="text-xs text-[var(--text-muted)]">No losses added yet.</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Add brought-forward losses from prior years above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Results ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {summary ? (
            <div className="space-y-5">
              {/* KPI cards */}
              <div className="grid grid-cols-2 gap-3">
                <KpiCard
                  label="Total BF Loss Available"
                  value={fmt(summary.totalBFLoss)}
                  colorClass="text-[var(--text-primary)]"
                  icon={Wallet}
                />
                <KpiCard
                  label="Set-Off This Year"
                  value={fmt(summary.totalSetOffThisYear)}
                  colorClass="text-[var(--success)]"
                  icon={RotateCcw}
                />
                <KpiCard
                  label="Tax Saved"
                  value={fmt(summary.taxSavedThisYear)}
                  colorClass="text-[var(--success)]"
                  icon={ShieldCheck}
                />
                <KpiCard
                  label="Remaining Carry-Forward"
                  value={fmt(
                    summary.updatedLosses.reduce((s, l) => s + l.remainingBalance, 0),
                  )}
                  colorClass="text-[var(--text-muted)]"
                  icon={TrendingDown}
                />
              </div>

              {/* Set-off breakdown table */}
              {breakdownRows.length > 0 && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <div className="px-5 py-3 border-b border-[var(--border)]">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      Set-Off Breakdown
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[var(--surface-raised)]">
                          <th className="text-left py-2 px-4 text-[var(--text-muted)] font-medium">Loss Type</th>
                          <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Available</th>
                          <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Used This Year</th>
                          <th className="text-right py-2 px-4 text-[var(--text-muted)] font-medium">Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdownRows.map((t) => {
                          const row = breakdownMap[t.value];
                          return (
                            <tr key={t.value} className="border-t border-[var(--border)]">
                              <td className="py-2.5 px-4 font-medium text-[var(--text-primary)]">
                                {t.label}
                              </td>
                              <td className="py-2.5 px-4 text-right num text-[var(--text-secondary)]">
                                {fmt(row.available)}
                              </td>
                              <td className="py-2.5 px-4 text-right num text-[var(--success)]">
                                {row.used > 0 ? fmt(row.used) : '—'}
                              </td>
                              <td className="py-2.5 px-4 text-right num text-[var(--text-primary)]">
                                {fmt(row.remaining)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Expiry warnings */}
              {summary.lossesExpiringSoon.length > 0 && (
                <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-[var(--warning)] shrink-0" />
                    <h3 className="text-sm font-semibold text-[var(--warning)]">
                      Losses Expiring Soon
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {summary.lossesExpiringSoon.map((loss) => (
                      <li
                        key={loss.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-[var(--text-primary)]">
                          {LOSS_TYPE_SHORT[loss.type]} — {loss.yearOfLoss}
                        </span>
                        <span className="num text-[var(--text-secondary)]">
                          {fmt(loss.remainingBalance)} expires {loss.expiryFY}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 flex gap-3">
                <Info className="h-4 w-4 text-[var(--text-muted)] mt-0.5 shrink-0" />
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Carry-forward losses are only valid if the original return was filed on time (u/s 139(1)).
                  House property loss set-off is capped at ₹2,00,000 per year against other income.
                  Consult a CA for verification before filing.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
              <div>
                <TrendingDown className="h-10 w-10 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Add brought-forward losses to see the impact
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Results will update automatically as you enter data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
