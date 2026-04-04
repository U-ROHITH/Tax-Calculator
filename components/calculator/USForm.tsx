'use client';

import { useState, useEffect, useCallback } from 'react';
import { USInput, TaxResult } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  onResult: (result: TaxResult | null) => void;
}

const STATES = [
  { code: '', label: 'No state income tax / Not listed' },
  { code: 'CA', label: 'California' },
  { code: 'NY', label: 'New York' },
  { code: 'TX', label: 'Texas (no income tax)' },
  { code: 'FL', label: 'Florida (no income tax)' },
  { code: 'WA', label: 'Washington (no income tax)' },
];

export default function USForm({ onResult }: Props) {
  const [form, setForm] = useState<Partial<USInput>>({
    country: 'US',
    filingStatus: 'single',
    useStandardDeduction: true,
    w2Employee: true,
    state: '',
    dependents: 0,
    selfEmploymentIncome: 0,
    itemizedDeductions: 0,
  });

  const calculate = useCallback(async () => {
    if (!form.grossIncome || form.grossIncome <= 0) {
      onResult(null);
      return;
    }
    try {
      const { calculateUSTax } = await import('@/engine/us');
      const result = calculateUSTax(form as USInput);
      onResult(result);
    } catch (e) {
      console.error(e);
    }
  }, [form, onResult]);

  useEffect(() => {
    const timer = setTimeout(calculate, 300);
    return () => clearTimeout(timer);
  }, [calculate]);

  const set = (field: keyof USInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Annual Gross Income ($)
        </label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 80000"
          value={form.grossIncome ?? ''}
          onChange={(e) => set('grossIncome', parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />
        {form.grossIncome ? (
          <p className="mt-1 text-xs text-muted-foreground">{formatByCurrency(form.grossIncome, 'USD')}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Filing Status</label>
        <select
          value={form.filingStatus}
          onChange={(e) => set('filingStatus', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="single">Single</option>
          <option value="married_joint">Married Filing Jointly</option>
          <option value="married_separate">Married Filing Separately</option>
          <option value="head_of_household">Head of Household</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">State</label>
        <select
          value={form.state ?? ''}
          onChange={(e) => set('state', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Employment Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'W-2 Employee' },
            { val: false, label: 'Self-Employed' },
          ].map(({ val, label }) => (
            <button
              key={String(val)}
              onClick={() => set('w2Employee', val)}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                form.w2Employee === val
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background hover:bg-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!form.w2Employee && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Self-Employment Income ($)
          </label>
          <input
            type="number"
            min="0"
            value={form.selfEmploymentIncome ?? ''}
            onChange={(e) => set('selfEmploymentIncome', parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Deduction Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Standard Deduction' },
            { val: false, label: 'Itemized Deductions' },
          ].map(({ val, label }) => (
            <button
              key={String(val)}
              onClick={() => set('useStandardDeduction', val)}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                form.useStandardDeduction === val
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background hover:bg-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!form.useStandardDeduction && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Total Itemized Deductions ($)
          </label>
          <input
            type="number"
            min="0"
            value={form.itemizedDeductions ?? ''}
            onChange={(e) => set('itemizedDeductions', parseFloat(e.target.value) || 0)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}
    </div>
  );
}
