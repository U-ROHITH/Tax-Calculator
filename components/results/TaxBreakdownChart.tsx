'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TaxBreakdownItem } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  breakdown: TaxBreakdownItem[];
  currency: string;
}

const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#06B6D4'];

export default function TaxBreakdownChart({ breakdown, currency }: Props) {
  const data = breakdown.filter((b) => b.amount > 0).map((b, i) => ({
    name: b.label,
    value: Math.round(b.amount),
    color: b.color || COLORS[i % COLORS.length],
  }));

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Tax Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatByCurrency(value, currency), '']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--card)',
              fontSize: '12px',
            }}
          />
          <Legend
            iconSize={8}
            iconType="circle"
            formatter={(value) => <span style={{ fontSize: '11px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
