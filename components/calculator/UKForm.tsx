'use client';

import { useState, useEffect, useCallback } from 'react';
import { UKInput, TaxResult } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  onResult: (result: TaxResult | null) => void;
}

export default function UKForm({ onResult }: Props) {
  const [form, setForm] = useState<Partial<UKInput>>({
    country: 'UK',
    region: 'england_wales_ni',
    studentLoan: 'none',
    pensionContribution: 0,
    dividendIncome: 0,
    blindPersonAllowance: false,
  });

  const calculate = useCallback(async () => {
    if (!form.grossIncome || form.grossIncome <= 0) {
      onResult(null);
      return;
    }
    try {
      const { calculateUKTax } = await import('@/engine/uk');
      const result = calculateUKTax(form as UKInput);
      onResult(result);
    } catch (e) {
      console.error(e);
    }
  }, [form, onResult]);

  useEffect(() => {
    const timer = setTimeout(calculate, 300);
    return () => clearTimeout(timer);
  }, [calculate]);

  const set = (field: keyof UKInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Annual Gross Income (£)
        </label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 50000"
          value={form.grossIncome ?? ''}
          onChange={(e) => set('grossIncome', parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />
        {form.grossIncome ? (
          <p className="mt-1 text-xs text-muted-foreground">{formatByCurrency(form.grossIncome, 'GBP')}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Region</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: 'england_wales_ni', label: 'England / Wales / NI' },
            { val: 'scotland', label: 'Scotland' },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => set('region', val)}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                form.region === val
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background hover:bg-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Pension Contribution (£/year)
        </label>
        <input
          type="number"
          min="0"
          value={form.pensionContribution ?? ''}
          onChange={(e) => set('pensionContribution', parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="mt-1 text-xs text-muted-foreground">Reduces taxable income. Annual allowance: £60,000</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Student Loan Plan</label>
        <select
          value={form.studentLoan ?? 'none'}
          onChange={(e) => set('studentLoan', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="none">None</option>
          <option value="plan1">Plan 1 (9% over £24,990)</option>
          <option value="plan2">Plan 2 (9% over £27,295)</option>
          <option value="plan4">Plan 4 Scotland (9% over £31,395)</option>
          <option value="plan5">Plan 5 (9% over £25,000)</option>
          <option value="postgrad">Postgraduate (6% over £21,000)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Dividend Income (£/year)
        </label>
        <input
          type="number"
          min="0"
          value={form.dividendIncome ?? ''}
          onChange={(e) => set('dividendIncome', parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />
        <p className="mt-1 text-xs text-muted-foreground">First £500 is tax-free (dividend allowance)</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="bpa"
          checked={form.blindPersonAllowance ?? false}
          onChange={(e) => set('blindPersonAllowance', e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="bpa" className="text-sm text-foreground">
          Blind Person&apos;s Allowance (+£3,070)
        </label>
      </div>

      {form.grossIncome && form.grossIncome >= 100000 && form.grossIncome <= 125140 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-800">⚠ You are in the 60% effective tax trap</p>
          <p className="mt-1 text-amber-700">
            Income between £100K–£125,140 has a 60% effective marginal rate due to Personal Allowance taper.
            Consider increasing pension contributions to bring income below £100,000.
          </p>
        </div>
      )}
    </div>
  );
}
