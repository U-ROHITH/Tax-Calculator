'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { UKInput, TaxResult } from '@/engine/types';

interface Props {
  onResult: (result: TaxResult | null) => void;
}

function Section({ title, subtitle, defaultOpen = false, children }: {
  title: string; subtitle?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-raised)] hover:bg-[var(--border)] transition-colors text-left">
        <div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
          {subtitle && <span className="ml-2 text-xs text-[var(--text-muted)]">{subtitle}</span>}
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />}
      </button>
      {open && <div className="p-4 space-y-3 bg-[var(--surface)]">{children}</div>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
        {hint && <span title={hint}><Info className="h-3 w-3 text-[var(--text-muted)] cursor-help" /></span>}
      </div>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, placeholder, prefix }: {
  value: number | undefined; onChange: (v: number) => void; placeholder?: string; prefix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-xs text-[var(--text-muted)] font-medium select-none">{prefix}</span>}
      <input type="number" min="0" value={value || ''} placeholder={placeholder}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors num ${prefix ? 'pl-7 pr-3' : 'px-3'}`} />
    </div>
  );
}

export default function UKForm({ onResult }: Props) {
  const [form, setForm] = useState<Partial<UKInput>>({
    country: 'UK', region: 'england_wales_ni', studentLoan: 'none',
    pensionContribution: 0, dividendIncome: 0, blindPersonAllowance: false,
  });

  const set = useCallback(<K extends keyof UKInput>(f: K, v: UKInput[K]) => {
    setForm((p) => ({ ...p, [f]: v }));
  }, []);

  const calculate = useCallback(async () => {
    if (!form.grossIncome || form.grossIncome <= 0) { onResult(null); return; }
    try {
      const { calculateUKTax } = await import('@/engine/uk');
      onResult(calculateUKTax(form as UKInput));
    } catch (e) { console.error(e); }
  }, [form, onResult]);

  useEffect(() => { const t = setTimeout(calculate, 350); return () => clearTimeout(t); }, [calculate]);

  const inTaperZone = (form.grossIncome || 0) >= 100000 && (form.grossIncome || 0) <= 125140;
  const effectivePensionSaving = (form.grossIncome || 0) > 100000 && (form.pensionContribution || 0) > 0;

  return (
    <div className="space-y-3">

      {/* Employment Income */}
      <Section title="Employment Income" defaultOpen>
        <Field label="Annual Gross Salary / Employment Income">
          <NumInput value={form.grossIncome} onChange={(v) => set('grossIncome', v)} placeholder="e.g. 60000" prefix="£" />
        </Field>
        <Field label="Region">
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden h-9 text-xs font-medium">
            {[
              { v: 'england_wales_ni', l: 'England / Wales / NI' },
              { v: 'scotland', l: 'Scotland' },
            ].map(({ v, l }) => (
              <button key={v} type="button" onClick={() => set('region', v as UKInput['region'])}
                className={`flex-1 transition-colors ${form.region === v ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]'}`}>{l}</button>
            ))}
          </div>
        </Field>
      </Section>

      {/* 60% Trap Warning */}
      {inTaperZone && (
        <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">60% Effective Marginal Rate Zone</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              Income between £100,000–£125,140 faces an effective 60% marginal tax rate due to Personal Allowance taper.
              Consider pension contributions to bring income below £100,000.
            </p>
          </div>
        </div>
      )}

      {/* Pension */}
      <Section title="Pension Contributions">
        <Field label="Annual Pension Contribution" hint="Reduces taxable income. Annual allowance: £60,000. Highly effective if you are in the £100K–£125K taper zone.">
          <NumInput value={form.pensionContribution} onChange={(v) => set('pensionContribution', v)} prefix="£" placeholder="e.g. 10000" />
        </Field>
        {effectivePensionSaving && (
          <p className="text-xs text-[var(--success)]">
            Pension contribution in the taper zone can save up to 60p per £1 contributed.
          </p>
        )}
      </Section>

      {/* Additional Income */}
      <Section title="Additional Income Sources">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dividend Income" hint="First £500 tax-free. Then 8.75% / 33.75% / 39.35%.">
            <NumInput value={form.dividendIncome} onChange={(v) => set('dividendIncome', v)} prefix="£" />
          </Field>
          <Field label="Self-Employment Profits" hint="Estimate if known — Class 2 & 4 NI will apply">
            <NumInput value={form.selfEmploymentIncome} onChange={(v) => set('selfEmploymentIncome', v)} prefix="£" />
          </Field>
          <Field label="Rental / Property Income" hint="Net rental income after allowable expenses">
            <NumInput value={form.rentalIncome} onChange={(v) => set('rentalIncome', v)} prefix="£" />
          </Field>
          <Field label="Savings Interest" hint="PSA: £1,000 basic rate / £500 higher rate taxpayer">
            <NumInput value={form.savingsInterest} onChange={(v) => set('savingsInterest', v)} prefix="£" />
          </Field>
        </div>
      </Section>

      {/* Capital Gains */}
      <Section title="Capital Gains Tax">
        <p className="text-xs text-[var(--text-muted)]">Annual exempt amount: £3,000 (2025-26)</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gain on Property (residential)" hint="18% basic / 28% higher rate taxpayer">
            <NumInput value={form.capitalGainProperty} onChange={(v) => set('capitalGainProperty', v)} prefix="£" />
          </Field>
          <Field label="Gain on Other Assets (shares, etc.)" hint="10% basic / 20% higher rate taxpayer">
            <NumInput value={form.capitalGainOther} onChange={(v) => set('capitalGainOther', v)} prefix="£" />
          </Field>
        </div>
      </Section>

      {/* Reliefs & Allowances */}
      <Section title="Reliefs & Allowances">
        <Field label="Student Loan Plan">
          <select value={form.studentLoan ?? 'none'} onChange={(e) => set('studentLoan', e.target.value as UKInput['studentLoan'])}
            className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors">
            <option value="none">None</option>
            <option value="plan1">Plan 1 — 9% above £24,990</option>
            <option value="plan2">Plan 2 — 9% above £27,295</option>
            <option value="plan4">Plan 4 (Scotland) — 9% above £31,395</option>
            <option value="plan5">Plan 5 — 9% above £25,000</option>
            <option value="postgrad">Postgraduate — 6% above £21,000</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Marriage Allowance Transfer" hint="Transfer £1,260 of PA from lower-earning spouse">
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden h-9 text-xs font-medium">
              {[{ v: 'none', l: 'None' }, { v: 'transferring', l: 'Transferring' }, { v: 'receiving', l: 'Receiving' }].map(({ v, l }) => (
                <button key={v} type="button" onClick={() => set('marriageAllowance', v as 'none' | 'transferring' | 'receiving')}
                  className={`flex-1 transition-colors ${(form.marriageAllowance ?? 'none') === v ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]'}`}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="Trading Allowance" hint="First £1,000 of self-employment / miscellaneous income exempt">
            <div className="flex items-center gap-2 h-9">
              <input type="checkbox" id="trading" checked={!!form.tradingAllowance} onChange={(e) => set('tradingAllowance', e.target.checked)} className="rounded" />
              <label htmlFor="trading" className="text-xs text-[var(--text-secondary)]">Claim £1,000 trading allowance</label>
            </div>
          </Field>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="bpa" checked={!!form.blindPersonAllowance} onChange={(e) => set('blindPersonAllowance', e.target.checked)} className="rounded" />
          <label htmlFor="bpa" className="text-xs text-[var(--text-secondary)]">Blind Person&apos;s Allowance (+£3,070 added to Personal Allowance)</label>
        </div>
        <Field label="Child Benefit Received" hint="High Income Charge claws back at £60K–£80K">
          <NumInput value={form.childBenefit} onChange={(v) => set('childBenefit', v)} prefix="£" />
        </Field>
      </Section>

    </div>
  );
}
