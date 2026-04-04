'use client';

import { TaxResult } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';

interface Props {
  primary: TaxResult;
  alternate: TaxResult;
}

export default function RegimeComparison({ primary, alternate }: Props) {
  const saving = Math.abs(alternate.totalTax - primary.totalTax);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Old vs New Regime Comparison</h3>
        <p className="text-xs text-green-600 mt-0.5">
          {primary.regime === 'new' ? 'New' : 'Old'} regime saves you{' '}
          <strong>{formatByCurrency(saving, 'INR')}</strong> in tax
        </p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border">
        {[primary, alternate].map((r) => (
          <div
            key={r.regime}
            className={`p-4 ${r === primary ? 'bg-green-50/50' : ''}`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r === primary ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                {r.regime === 'new' ? 'New Regime' : 'Old Regime'}
              </span>
              {r === primary && <span className="text-xs text-green-600">✓ Better</span>}
            </div>
            <p className="text-xl font-bold text-red-600">{formatByCurrency(r.totalTax, 'INR')}</p>
            <p className="text-xs text-muted-foreground">Total Tax</p>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Net Income</span>
                <span className="font-medium text-green-600">{formatByCurrency(r.netIncome, 'INR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Rate</span>
                <span className="font-medium">{formatPercent(r.effectiveRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Take-Home</span>
                <span className="font-medium">{formatByCurrency(r.monthlyTakeHome, 'INR')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
