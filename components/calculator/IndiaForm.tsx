'use client';

import { useState, useEffect, useCallback } from 'react';
import { IndiaInput, TaxResult } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  onResult: (result: TaxResult | null) => void;
}

export default function IndiaForm({ onResult }: Props) {
  const [form, setForm] = useState<Partial<IndiaInput>>({
    country: 'IN',
    regime: 'auto',
    age: 'below60',
    metroCity: true,
    section80C: 0,
    section80D: 0,
    section80TTA: 0,
    homeLoanInterest: 0,
    nps80CCD: 0,
    otherDeductions: 0,
  });

  const [showDeductions, setShowDeductions] = useState(false);
  const [showHRA, setShowHRA] = useState(false);

  const calculate = useCallback(async () => {
    if (!form.grossIncome || form.grossIncome <= 0) {
      onResult(null);
      return;
    }
    try {
      const { calculateIndiaTax } = await import('@/engine/india');
      const result = calculateIndiaTax(form as IndiaInput);
      onResult(result);
    } catch (e) {
      console.error(e);
    }
  }, [form, onResult]);

  useEffect(() => {
    const timer = setTimeout(calculate, 300);
    return () => clearTimeout(timer);
  }, [calculate]);

  const set = (field: keyof IndiaInput, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Annual Gross Income (₹)
        </label>
        <input
          type="number"
          min="0"
          placeholder="e.g. 1200000"
          value={form.grossIncome ?? ''}
          onChange={(e) => set('grossIncome', parseFloat(e.target.value) || 0)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />
        {form.grossIncome ? (
          <p className="mt-1 text-xs text-muted-foreground">
            = {formatByCurrency(form.grossIncome, 'INR')}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Tax Regime</label>
        <div className="grid grid-cols-3 gap-2">
          {(['auto', 'new', 'old'] as const).map((r) => (
            <button
              key={r}
              onClick={() => set('regime', r)}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                form.regime === r
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background hover:bg-accent'
              }`}
            >
              {r === 'auto' ? 'Auto (Best)' : r === 'new' ? 'New Regime' : 'Old Regime'}
            </button>
          ))}
        </div>
        {form.regime === 'auto' && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Auto mode calculates both regimes and picks the one with lower tax
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Age Group</label>
        <select
          value={form.age ?? 'below60'}
          onChange={(e) => set('age', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="below60">Below 60 years</option>
          <option value="60to80">Senior Citizen (60-80 years)</option>
          <option value="above80">Super Senior (Above 80 years)</option>
        </select>
      </div>

      {/* HRA Section */}
      {(form.regime === 'old' || form.regime === 'auto') && (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <button
            onClick={() => setShowHRA(!showHRA)}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>HRA Exemption (Old Regime)</span>
            <span className="text-muted-foreground">{showHRA ? '−' : '+'}</span>
          </button>
          {showHRA && (
            <div className="mt-4 space-y-3">
              {[
                { label: 'Basic Salary (₹)', field: 'basicSalary' as keyof IndiaInput },
                { label: 'HRA Received (₹)', field: 'hra' as keyof IndiaInput },
                { label: 'Annual Rent Paid (₹)', field: 'rentPaid' as keyof IndiaInput },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={(form[field] as number) ?? ''}
                    onChange={(e) => set(field, parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="metro"
                  checked={form.metroCity ?? true}
                  onChange={(e) => set('metroCity', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="metro" className="text-xs text-muted-foreground">
                  Metro city (Mumbai, Delhi, Kolkata, Chennai)
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deductions */}
      {(form.regime === 'old' || form.regime === 'auto') && (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <button
            onClick={() => setShowDeductions(!showDeductions)}
            className="flex w-full items-center justify-between text-sm font-medium"
          >
            <span>Chapter VI-A Deductions (Old Regime)</span>
            <span className="text-muted-foreground">{showDeductions ? '−' : '+'}</span>
          </button>
          {showDeductions && (
            <div className="mt-4 space-y-3">
              {[
                { label: 'Section 80C — PPF/ELSS/LIC (max ₹1.5L)', field: 'section80C' as keyof IndiaInput },
                { label: 'Section 80D — Health Insurance (max ₹25K)', field: 'section80D' as keyof IndiaInput },
                { label: 'Section 80TTA — Savings Interest (max ₹10K)', field: 'section80TTA' as keyof IndiaInput },
                { label: 'Section 24 — Home Loan Interest (max ₹2L)', field: 'homeLoanInterest' as keyof IndiaInput },
                { label: 'Section 80CCD(1B) — NPS (max ₹50K)', field: 'nps80CCD' as keyof IndiaInput },
                { label: 'Other Deductions (₹)', field: 'otherDeductions' as keyof IndiaInput },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input
                    type="number"
                    min="0"
                    value={(form[field] as number) ?? ''}
                    onChange={(e) => set(field, parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
