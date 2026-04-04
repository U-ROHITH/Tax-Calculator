'use client';

import { TaxResult } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';
import { CheckCircle2 } from 'lucide-react';

interface Props { primary: TaxResult; alternate: TaxResult }

export default function RegimeComparison({ primary, alternate }: Props) {
  const saving = Math.abs(alternate.totalTax - primary.totalTax);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-raised)] border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Regime Comparison</h3>
        <span className="text-xs font-medium text-[var(--success)] num">
          {primary.regime === 'new' ? 'New' : 'Old'} regime saves {formatByCurrency(saving, 'INR')}
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
        {[primary, alternate].map((r) => (
          <div key={r.regime} className={`p-4 ${r === primary ? 'bg-[var(--surface)]' : 'bg-[var(--surface-raised)]'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">
                {r.regime === 'new' ? 'New Regime' : 'Old Regime'}
              </span>
              {r === primary && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" />}
            </div>
            <p className="text-2xl font-bold num text-[var(--danger)]">{formatByCurrency(r.totalTax, 'INR')}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Total Tax</p>
            <div className="mt-3 space-y-1.5 text-xs">
              {[
                { l: 'Net Income', v: formatByCurrency(r.netIncome, 'INR'), c: 'text-[var(--success)]' },
                { l: 'Effective Rate', v: formatPercent(r.effectiveRate), c: 'text-[var(--text-primary)]' },
                { l: 'Monthly Take-Home', v: formatByCurrency(r.monthlyTakeHome, 'INR'), c: 'text-[var(--primary)]' },
              ].map(({ l, v, c }) => (
                <div key={l} className="flex justify-between">
                  <span className="text-[var(--text-muted)]">{l}</span>
                  <span className={`font-medium num ${c}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
