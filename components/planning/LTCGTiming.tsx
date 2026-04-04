'use client';

import { useState } from 'react';
import { TrendingDown, TrendingUp, Clock } from 'lucide-react';

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';
const SELECT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

const CII: Record<number, number> = {
  2015: 254,
  2016: 264,
  2017: 272,
  2018: 280,
  2019: 289,
  2020: 301,
  2021: 317,
  2022: 331,
  2023: 348,
  2024: 363,
  2025: 376,
};

const TODAY = new Date(2026, 3, 4); // April 4, 2026
const WAIT_UNTIL = new Date(2027, 3, 1); // April 1, 2027

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

function computeTax(
  gain: number,
  isLTCG: boolean,
  isProperty: boolean
): { tax: number; rate: string; gainType: string } {
  if (gain <= 0) return { tax: 0, rate: '0%', gainType: isLTCG ? 'LTCG' : 'STCG' };

  if (isProperty) {
    if (isLTCG) {
      return { tax: gain * 0.20, rate: '20% (with indexation)', gainType: 'LTCG' };
    } else {
      return { tax: gain * 0.30, rate: '30% (slab rate)', gainType: 'STCG' };
    }
  } else {
    // Equity / MF
    if (isLTCG) {
      const taxableGain = Math.max(0, gain - 125000);
      return { tax: taxableGain * 0.125, rate: '12.5% above ₹1.25L', gainType: 'LTCG' };
    } else {
      return { tax: gain * 0.20, rate: '20%', gainType: 'STCG' };
    }
  }
}

function fmt(n: number) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function LTCGTiming() {
  const currentYear = 2026;
  const [purchaseYear, setPurchaseYear] = useState('2022');
  const [purchaseMonth, setPurchaseMonth] = useState('0');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentMarketPrice, setCurrentMarketPrice] = useState('');
  const [isProperty, setIsProperty] = useState(false);

  const ppVal = parseFloat(purchasePrice) || 0;
  const cmpVal = parseFloat(currentMarketPrice) || 0;
  const pyVal = parseInt(purchaseYear);
  const pmVal = parseInt(purchaseMonth);

  const purchaseDate = new Date(pyVal, pmVal, 1);
  const holdingMonthsNow = monthsBetween(purchaseDate, TODAY);
  const holdingMonthsWait = monthsBetween(purchaseDate, WAIT_UNTIL);

  const ltcgThreshold = isProperty ? 24 : 12;
  const isLTCGNow = holdingMonthsNow >= ltcgThreshold;
  const isLTCGWait = holdingMonthsWait >= ltcgThreshold;

  // Indexed cost for property
  const ciiPurchase = CII[pyVal] ?? CII[2015];
  const ciiCurrent = 376;
  const indexedCost = isProperty ? ppVal * (ciiCurrent / ciiPurchase) : ppVal;

  // Gain now
  const costBasisNow = isProperty && isLTCGNow ? indexedCost : ppVal;
  const gainNow = Math.max(0, cmpVal - costBasisNow);

  // Gain at April 2027 (assume same market price for simplicity)
  const costBasisWait = isProperty && isLTCGWait ? indexedCost : ppVal;
  const gainWait = Math.max(0, cmpVal - costBasisWait);

  const { tax: taxNow, rate: rateNow, gainType: gtNow } = computeTax(gainNow, isLTCGNow, isProperty);
  const { tax: taxWait, rate: rateWait, gainType: gtWait } = computeTax(gainWait, isLTCGWait, isProperty);

  const netProceedsNow = cmpVal - taxNow;
  const netProceedsWait = cmpVal - taxWait;
  const waitSaving = taxNow - taxWait;

  const hasData = ppVal > 0 && cmpVal > 0;

  const years = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => 2015 + i);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Inputs</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Purchase Year</label>
            <select
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(e.target.value)}
              className={SELECT_CLASS}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Purchase Month</label>
            <select
              value={purchaseMonth}
              onChange={(e) => setPurchaseMonth(e.target.value)}
              className={SELECT_CLASS}
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Purchase Price (₹)</label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 5000000"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">Current Market Price (₹)</label>
            <input
              type="number"
              value={currentMarketPrice}
              onChange={(e) => setCurrentMarketPrice(e.target.value)}
              placeholder="e.g. 8000000"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
          <input
            type="checkbox"
            checked={isProperty}
            onChange={(e) => setIsProperty(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          Property / Real estate (24-month LTCG threshold + CII indexation)
        </label>

        {hasData && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--surface-raised)] rounded-lg px-3 py-2">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Holding period today: {holdingMonthsNow} months
            {isProperty && ` · Indexed cost: ${fmt(indexedCost)}`}
          </div>
        )}
      </div>

      {/* Results */}
      {hasData && (
        <>
          {waitSaving > 0 && (
            <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-5">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-1">
                Tax Saving by Waiting until April 1, 2027
              </p>
              <p className="num text-3xl font-bold text-[var(--success)]">{fmt(waitSaving)}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sell now */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[var(--danger)]" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">If you sell today</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Holding period</span>
                  <span className="num text-[var(--text-primary)]">{holdingMonthsNow} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Gain</span>
                  <span className="num text-[var(--text-primary)]">{fmt(gainNow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Gain Type</span>
                  <span className={`font-medium ${isLTCGNow ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                    {gtNow}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Tax Rate</span>
                  <span className="text-[var(--text-primary)]">{rateNow}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-2">
                  <span className="font-medium text-[var(--text-primary)]">Tax</span>
                  <span className="num font-semibold text-[var(--danger)]">{fmt(taxNow)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[var(--text-primary)]">Net Proceeds</span>
                  <span className="num font-semibold text-[var(--text-primary)]">{fmt(netProceedsNow)}</span>
                </div>
              </div>
            </div>

            {/* Wait */}
            <div className="rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-[var(--success)]" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">If you wait until April 1, 2027</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Holding period</span>
                  <span className="num text-[var(--text-primary)]">{holdingMonthsWait} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Gain</span>
                  <span className="num text-[var(--text-primary)]">{fmt(gainWait)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Gain Type</span>
                  <span className={`font-medium ${isLTCGWait ? 'text-[var(--success)]' : 'text-[var(--warning)]'}`}>
                    {gtWait}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Tax Rate</span>
                  <span className="text-[var(--text-primary)]">{rateWait}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-2">
                  <span className="font-medium text-[var(--text-primary)]">Tax</span>
                  <span className="num font-semibold text-[var(--success)]">{fmt(taxWait)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[var(--text-primary)]">Net Proceeds</span>
                  <span className="num font-semibold text-[var(--text-primary)]">{fmt(netProceedsWait)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
