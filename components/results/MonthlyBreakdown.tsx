'use client';

import { TaxResult } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  result: TaxResult;
}

export default function MonthlyBreakdown({ result }: Props) {
  const { grossIncome, totalTax, netIncome, currency, monthlyTakeHome } = result;
  const weekly = Math.round(netIncome / 52);
  const daily = Math.round(netIncome / 260);

  const rows = [
    { period: 'Annual', gross: grossIncome, tax: totalTax, net: netIncome },
    { period: 'Monthly', gross: grossIncome / 12, tax: totalTax / 12, net: monthlyTakeHome },
    { period: 'Weekly', gross: grossIncome / 52, tax: totalTax / 52, net: weekly },
    { period: 'Daily', gross: grossIncome / 260, tax: totalTax / 260, net: daily },
  ];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Take-Home Summary</h3>
      </div>
      <div className="divide-y divide-border">
        <div className="grid grid-cols-4 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Period</span>
          <span className="text-right">Gross</span>
          <span className="text-right">Tax</span>
          <span className="text-right text-green-600">Net</span>
        </div>
        {rows.map((row) => (
          <div key={row.period} className="grid grid-cols-4 px-4 py-2.5 text-xs">
            <span className="font-medium">{row.period}</span>
            <span className="text-right text-muted-foreground">{formatByCurrency(row.gross, currency)}</span>
            <span className="text-right text-red-500">{formatByCurrency(row.tax, currency)}</span>
            <span className="text-right font-semibold text-green-600">{formatByCurrency(row.net, currency)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
