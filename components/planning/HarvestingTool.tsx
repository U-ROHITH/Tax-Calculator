'use client';

import { useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Clock, Info, CheckCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortfolioItem {
  id: string;
  name: string;
  purchaseDate: string; // "YYYY-MM"
  purchaseValue: number;
  currentValue: number;
}

interface PortfolioItemComputed extends PortfolioItem {
  isLTCG: boolean;
  holdingMonths: number;
  unrealizedGain: number;
  ltcgGain: number;
}

interface HarvestPlanItem extends PortfolioItemComputed {
  harvestAmount: number;
  taxSaved: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LTCG_EXEMPT = 125000;
const LTCG_RATE = 0.125;
const CESS_RATE = 0.04;

// ─── Style tokens ─────────────────────────────────────────────────────────────

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';
const SELECT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';
const LABEL_CLASS = 'block text-xs font-medium text-[var(--muted-foreground)] mb-1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return '₹' + Math.abs(Math.round(n)).toLocaleString('en-IN');
}

function fmtMonths(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (y === 0) return `${mo}m`;
  if (mo === 0) return `${y}y`;
  return `${y}y ${mo}m`;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function computeHoldingMonths(purchaseDate: string): number {
  const [y, m] = purchaseDate.split('-').map(Number);
  const purchase = new Date(y, m - 1);
  const today = new Date();
  return (
    (today.getFullYear() - purchase.getFullYear()) * 12 +
    (today.getMonth() - purchase.getMonth())
  );
}

function enrichItems(items: PortfolioItem[]): PortfolioItemComputed[] {
  return items.map((item) => {
    const holdingMonths = computeHoldingMonths(item.purchaseDate);
    const isLTCG = holdingMonths >= 12;
    const unrealizedGain = item.currentValue - item.purchaseValue;
    const ltcgGain = isLTCG ? Math.max(0, unrealizedGain) : 0;
    return { ...item, holdingMonths, isLTCG, unrealizedGain, ltcgGain };
  });
}

function buildHarvestPlan(
  items: PortfolioItemComputed[],
  remainingExemption: number
): HarvestPlanItem[] {
  const eligible = items
    .filter((i) => i.ltcgGain > 0)
    .sort((a, b) => a.ltcgGain - b.ltcgGain); // smallest gains first for optimal allocation

  let remaining = remainingExemption;
  const plan: HarvestPlanItem[] = [];

  for (const item of eligible) {
    if (remaining <= 0) break;
    const harvestAmount = Math.min(item.ltcgGain, remaining);
    const taxSaved = harvestAmount * LTCG_RATE * (1 + CESS_RATE);
    plan.push({ ...item, harvestAmount, taxSaved });
    remaining -= harvestAmount;
  }

  return plan;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HarvestingTool() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [alreadyBookedLTCG, setAlreadyBookedLTCG] = useState(0);

  // Add form state
  const currentYear = new Date().getFullYear();
  const [name, setName] = useState('');
  const [purchaseMonth, setPurchaseMonth] = useState('1');
  const [purchaseYear, setPurchaseYear] = useState(String(currentYear - 2));
  const [purchaseValue, setPurchaseValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  // ── Computed values ────────────────────────────────────────────────────────

  const enriched = enrichItems(portfolioItems);
  const remainingExemption = Math.max(0, LTCG_EXEMPT - alreadyBookedLTCG);
  const totalUnrealizedLTCG = enriched.reduce((s, i) => s + i.ltcgGain, 0);
  const harvestPlan = buildHarvestPlan(enriched, remainingExemption);

  const totalHarvested = harvestPlan.reduce((s, i) => s + i.harvestAmount, 0);
  const totalTaxSaved = harvestPlan.reduce((s, i) => s + i.taxSaved, 0);
  const remainingAfterHarvest = Math.max(0, totalUnrealizedLTCG - totalHarvested);
  const taxOnRemaining = remainingAfterHarvest * LTCG_RATE * (1 + CESS_RATE);

  const progressPercent = Math.min(100, (alreadyBookedLTCG / LTCG_EXEMPT) * 100);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function addHolding() {
    const pv = parseFloat(purchaseValue);
    const cv = parseFloat(currentValue);
    if (!name.trim() || isNaN(pv) || isNaN(cv) || pv <= 0 || cv <= 0) return;

    const dateStr = `${purchaseYear}-${purchaseMonth.padStart(2, '0')}`;
    const newItem: PortfolioItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      purchaseDate: dateStr,
      purchaseValue: pv,
      currentValue: cv,
    };
    setPortfolioItems((prev) => [...prev, newItem]);
    setName('');
    setPurchaseValue('');
    setCurrentValue('');
  }

  function removeHolding(id: string) {
    setPortfolioItems((prev) => prev.filter((i) => i.id !== id));
  }

  // ── Year options for purchase year select ─────────────────────────────────

  const yearOptions: number[] = [];
  for (let y = currentYear - 1; y >= currentYear - 20; y--) {
    yearOptions.push(y);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">LTCG Tax Harvesting Tool</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            India FY 2025-26 — Maximize your &#x20B9;1,25,000 annual LTCG exemption on equity
          </p>
        </div>

        {/* Education card */}
        <div className="rounded-xl border border-[var(--india,#f97316)]/30 bg-[var(--india,#f97316)]/10 p-5 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Info size={16} className="text-[var(--india,#f97316)]" />
            How LTCG Harvesting Works
          </div>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Every year you get &#x20B9;1,25,000 LTCG tax-free on equity. If unused, this exemption
            lapses — it does not carry forward. Sell and immediately rebuy to book gains up to this
            limit, resetting your cost basis. Do this every March before year-end.
          </p>
        </div>

        {/* Already booked LTCG input */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="font-semibold text-sm mb-4">LTCG Already Booked This Year</h2>
          <div className="max-w-xs">
            <label className={LABEL_CLASS}>LTCG booked so far (&#x20B9;)</label>
            <input
              type="number"
              min={0}
              value={alreadyBookedLTCG || ''}
              onChange={(e) => setAlreadyBookedLTCG(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className={INPUT_CLASS}
            />
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
              <span>Exemption used: {fmt(alreadyBookedLTCG)}</span>
              <span>Limit: {fmt(LTCG_EXEMPT)}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--india,#f97316)] transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {fmt(remainingExemption)} remaining exemption available
            </p>
          </div>
        </div>

        {/* Add holding form */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="font-semibold text-sm mb-4">Add a Holding</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className={LABEL_CLASS}>Holding name</label>
              <input
                type="text"
                placeholder="e.g. Nifty 50 Index Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Purchase month / year</label>
              <div className="flex gap-2">
                <select
                  value={purchaseMonth}
                  onChange={(e) => setPurchaseMonth(e.target.value)}
                  className={SELECT_CLASS}
                >
                  {MONTHS.map((mo, idx) => (
                    <option key={mo} value={String(idx + 1)}>
                      {mo}
                    </option>
                  ))}
                </select>
                <select
                  value={purchaseYear}
                  onChange={(e) => setPurchaseYear(e.target.value)}
                  className={SELECT_CLASS}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={LABEL_CLASS}>Purchase value (&#x20B9;)</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 100000"
                value={purchaseValue}
                onChange={(e) => setPurchaseValue(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Current value (&#x20B9;)</label>
              <input
                type="number"
                min={0}
                placeholder="e.g. 145000"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addHolding}
                className="h-10 w-full rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Add Holding
              </button>
            </div>
          </div>
        </div>

        {/* Main two-column layout */}
        {portfolioItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left — Holdings table */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h2 className="font-semibold text-sm mb-4">Your Holdings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="pb-2 text-left font-medium text-[var(--muted-foreground)] text-xs">Name</th>
                      <th className="pb-2 text-right font-medium text-[var(--muted-foreground)] text-xs">Held</th>
                      <th className="pb-2 text-right font-medium text-[var(--muted-foreground)] text-xs">Unrealized Gain</th>
                      <th className="pb-2 text-right font-medium text-[var(--muted-foreground)] text-xs">Type</th>
                      <th className="pb-2 text-right font-medium text-[var(--muted-foreground)] text-xs">Harvest?</th>
                      <th className="pb-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {enriched.map((item) => {
                      const inPlan = harvestPlan.some((h) => h.id === item.id);
                      return (
                        <tr
                          key={item.id}
                          className={item.isLTCG ? '' : 'opacity-50'}
                        >
                          <td className="py-2 pr-2 font-medium">{item.name}</td>
                          <td className="py-2 text-right text-[var(--muted-foreground)]">
                            {fmtMonths(item.holdingMonths)}
                          </td>
                          <td className={`py-2 text-right ${item.unrealizedGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {item.unrealizedGain >= 0 ? '+' : '-'}{fmt(item.unrealizedGain)}
                          </td>
                          <td className="py-2 text-right">
                            {item.isLTCG ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                <TrendingUp size={12} />
                                LTCG
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[var(--muted-foreground)] text-xs">
                                <Clock size={12} />
                                STCG
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-right">
                            {item.isLTCG && item.ltcgGain > 0 ? (
                              inPlan ? (
                                <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                                  <CheckCircle size={12} />
                                  Yes
                                </span>
                              ) : (
                                <span className="text-xs text-[var(--muted-foreground)]">
                                  Exempt used
                                </span>
                              )
                            ) : item.isLTCG ? (
                              <span className="text-xs text-[var(--muted-foreground)]">Loss — skip</span>
                            ) : (
                              <span className="text-xs text-[var(--muted-foreground)]">Hold for LTCG</span>
                            )}
                          </td>
                          <td className="py-2 pl-2">
                            <button
                              onClick={() => removeHolding(item.id)}
                              className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                              aria-label="Remove holding"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {enriched.some((i) => !i.isLTCG) && (
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                  Muted rows (STCG) — hold until 12-month threshold for LTCG treatment.
                </p>
              )}
            </div>

            {/* Right — Harvest Plan */}
            <div className="space-y-4">

              {/* Exemption summary */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
                <h2 className="font-semibold text-sm">Exemption Summary</h2>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Annual exemption limit</span>
                  <span className="font-medium">{fmt(LTCG_EXEMPT)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Already booked</span>
                  <span className="font-medium text-amber-600">−{fmt(alreadyBookedLTCG)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[var(--border)] pt-3">
                  <span className="font-semibold">Remaining exemption</span>
                  <span className="font-bold text-green-600">{fmt(remainingExemption)}</span>
                </div>
              </div>

              {/* Optimal Harvest Plan */}
              {harvestPlan.length > 0 ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                  <h2 className="font-semibold text-sm mb-4">Optimal Harvest Plan</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="pb-2 text-left font-medium text-[var(--muted-foreground)] text-xs">Name</th>
                        <th className="pb-2 text-right font-medium text-[var(--muted-foreground)] text-xs">Gain to Book</th>
                        <th className="pb-2 text-right font-medium text-[var(--muted-foreground)] text-xs">Tax Saved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {harvestPlan.map((h) => (
                        <tr key={h.id}>
                          <td className="py-2 pr-2 font-medium">{h.name}</td>
                          <td className="py-2 text-right text-green-600">+{fmt(h.harvestAmount)}</td>
                          <td className="py-2 text-right text-green-600">{fmt(h.taxSaved)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Total tax saved callout */}
                  <div className="mt-4 rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-center">
                    <p className="text-xs text-[var(--muted-foreground)] mb-1">Total tax saved by harvesting</p>
                    <p className="text-2xl font-bold text-green-600">{fmt(totalTaxSaved)}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      incl. 12.5% LTCG + 4% cess
                    </p>
                  </div>
                </div>
              ) : totalUnrealizedLTCG === 0 ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-center text-sm text-[var(--muted-foreground)]">
                  No LTCG-eligible gains found. Add holdings held for 12+ months with positive gains.
                </div>
              ) : (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-center text-sm text-[var(--muted-foreground)]">
                  Exemption fully used — no further harvesting available this year.
                </div>
              )}

              {/* Remaining unrealized LTCG */}
              {remainingAfterHarvest > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
                    <TrendingDown size={14} />
                    Remaining Unrealized LTCG After Harvest
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Unrealized LTCG remaining</span>
                    <span className="font-medium">{fmt(remainingAfterHarvest)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Tax if sold (12.5% + cess)</span>
                    <span className="font-medium text-amber-600">{fmt(taxOnRemaining)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {portfolioItems.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--muted-foreground)]">
            <TrendingUp size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Add your equity holdings above to see the optimal harvest plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
