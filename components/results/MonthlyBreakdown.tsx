'use client';

import { TaxResult } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props { result: TaxResult }

export default function MonthlyBreakdown({ result }: Props) {
  const { grossIncome, totalTax, netIncome, currency, monthlyTakeHome } = result;
  const rows = [
    { period: 'Annual',  gross: grossIncome,     tax: totalTax,     net: netIncome },
    { period: 'Monthly', gross: grossIncome / 12, tax: totalTax / 12, net: monthlyTakeHome },
    { period: 'Weekly',  gross: grossIncome / 52, tax: totalTax / 52, net: netIncome / 52 },
    { period: 'Daily',   gross: grossIncome / 260, tax: totalTax / 260, net: netIncome / 260 },
  ];

  return (
    <div className="divide-y divide-[var(--border)]">
      <div className="grid grid-cols-4 px-4 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide bg-[var(--surface-raised)]">
        <span>Period</span>
        <span className="text-right">Gross</span>
        <span className="text-right">Tax</span>
        <span className="text-right text-[var(--success)]">Net</span>
      </div>
      {rows.map((row) => (
        <div key={row.period} className="grid grid-cols-4 px-4 py-2.5 text-xs hover:bg-[var(--surface-raised)] transition-colors">
          <span className="font-medium text-[var(--text-primary)]">{row.period}</span>
          <span className="text-right num text-[var(--text-secondary)]">{formatByCurrency(row.gross, currency)}</span>
          <span className="text-right num text-[var(--danger)]">{formatByCurrency(row.tax, currency)}</span>
          <span className="text-right num font-semibold text-[var(--success)]">{formatByCurrency(row.net, currency)}</span>
        </div>
      ))}
    </div>
  );
}
