'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BracketDetail } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';

interface Props {
  bracketDetails: BracketDetail[];
  currency: string;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function BracketWaterfall({ bracketDetails, currency }: Props) {
  const data = bracketDetails
    .filter((d) => d.taxableInThisBracket > 0)
    .map((d, i) => ({
      name: d.bracket.label || formatPercent(d.bracket.rate),
      taxable: Math.round(d.taxableInThisBracket),
      tax: Math.round(d.taxInThisBracket),
      rate: d.bracket.rate,
      color: COLORS[i % COLORS.length],
    }));

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Tax by Bracket</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatByCurrency(v, currency).replace(/[₹$£]/g, '')} />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatByCurrency(value, currency),
              name === 'tax' ? 'Tax' : 'Taxable Income',
            ]}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="tax" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
