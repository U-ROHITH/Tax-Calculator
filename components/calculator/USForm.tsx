'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { USInput, TaxResult } from '@/engine/types';

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

const STATES = [
  { code: '', label: 'No state income tax / other' },
  { code: 'CA', label: 'California' }, { code: 'NY', label: 'New York' },
  { code: 'TX', label: 'Texas (no income tax)' }, { code: 'FL', label: 'Florida (no income tax)' },
  { code: 'WA', label: 'Washington (no income tax)' }, { code: 'IL', label: 'Illinois (4.95% flat)' },
  { code: 'PA', label: 'Pennsylvania (3.07% flat)' }, { code: 'MA', label: 'Massachusetts (5% flat)' },
  { code: 'AZ', label: 'Arizona (2.5% flat)' }, { code: 'GA', label: 'Georgia (5.5% flat)' },
  { code: 'NC', label: 'North Carolina (4.75% flat)' }, { code: 'VA', label: 'Virginia (5.75% flat)' },
  { code: 'OH', label: 'Ohio (3.99% flat)' }, { code: 'MI', label: 'Michigan (4.25% flat)' },
  { code: 'NJ', label: 'New Jersey (progressive)' },
];

export default function USForm({ onResult }: Props) {
  const [form, setForm] = useState<Partial<USInput>>({
    country: 'US', filingStatus: 'single', useStandardDeduction: true,
    w2Employee: true, state: '',
  });

  const set = useCallback(<K extends keyof USInput>(f: K, v: USInput[K]) => {
    setForm((p) => ({ ...p, [f]: v }));
  }, []);

  const calculate = useCallback(async () => {
    if (!form.grossIncome || form.grossIncome <= 0) { onResult(null); return; }
    try {
      const { calculateUSTax } = await import('@/engine/us');
      onResult(calculateUSTax(form as USInput));
    } catch (e) { console.error(e); }
  }, [form, onResult]);

  useEffect(() => { const t = setTimeout(calculate, 350); return () => clearTimeout(t); }, [calculate]);

  return (
    <div className="space-y-3">

      {/* Filing basics */}
      <Section title="Filing Information" defaultOpen>
        <Field label="Gross W-2 / Employment Income">
          <NumInput value={form.grossIncome} onChange={(v) => set('grossIncome', v)} placeholder="e.g. 85000" prefix="$" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Filing Status">
            <select value={form.filingStatus} onChange={(e) => set('filingStatus', e.target.value as USInput['filingStatus'])}
              className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors">
              <option value="single">Single</option>
              <option value="married_joint">Married Filing Jointly</option>
              <option value="married_separate">Married Filing Separately</option>
              <option value="head_of_household">Head of Household</option>
            </select>
          </Field>
          <Field label="State">
            <select value={form.state ?? ''} onChange={(e) => set('state', e.target.value)}
              className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors">
              {STATES.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Employment Type">
            <div className="flex rounded-lg border border-[var(--border)] overflow-hidden h-9 text-xs font-medium">
              {[{ v: true, l: 'W-2 Employee' }, { v: false, l: 'Self-Employed' }].map(({ v, l }) => (
                <button key={String(v)} type="button" onClick={() => set('w2Employee', v)}
                  className={`flex-1 transition-colors ${form.w2Employee === v ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]'}`}>{l}</button>
              ))}
            </div>
          </Field>
          <Field label="Children Under 17" hint="For Child Tax Credit ($2,000/child)">
            <NumInput value={form.childrenUnder17} onChange={(v) => set('childrenUnder17', v)} placeholder="0" />
          </Field>
        </div>
      </Section>

      {/* Additional Income */}
      <Section title="Additional Income Sources">
        {!form.w2Employee && (
          <Field label="Self-Employment / 1099 Income" hint="SE tax applies; 50% of SE tax deductible">
            <NumInput value={form.selfEmploymentIncome} onChange={(v) => set('selfEmploymentIncome', v)} prefix="$" />
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Long-Term Capital Gains" hint="0% / 15% / 20% preferential rates">
            <NumInput value={(form.capitalGains as Array<{type:string;amount:number}>)?.find((g) => g.type === 'long')?.amount} onChange={(v) => {
              const others = (form.capitalGains || []).filter((g: {type:string}) => g.type !== 'long');
              set('capitalGains', v > 0 ? [...others, { type: 'long', amount: v }] : others);
            }} prefix="$" />
          </Field>
          <Field label="Short-Term Capital Gains" hint="Taxed as ordinary income">
            <NumInput value={(form.capitalGains as Array<{type:string;amount:number}>)?.find((g) => g.type === 'short')?.amount} onChange={(v) => {
              const others = (form.capitalGains || []).filter((g: {type:string}) => g.type !== 'short');
              set('capitalGains', v > 0 ? [...others, { type: 'short', amount: v }] : others);
            }} prefix="$" />
          </Field>
          <Field label="Qualified Dividends" hint="Taxed at LTCG rates">
            <NumInput value={form.qualifiedDividends} onChange={(v) => set('qualifiedDividends', v)} prefix="$" />
          </Field>
          <Field label="Ordinary Dividends">
            <NumInput value={form.ordinaryDividends} onChange={(v) => set('ordinaryDividends', v)} prefix="$" />
          </Field>
          <Field label="Net Rental Income" hint="After expenses. Losses limited to $25K with active participation">
            <NumInput value={form.rentalIncome} onChange={(v) => set('rentalIncome', v)} prefix="$" />
          </Field>
          <Field label="Social Security Benefits" hint="Up to 85% may be taxable">
            <NumInput value={form.socialSecurityBenefits} onChange={(v) => set('socialSecurityBenefits', v)} prefix="$" />
          </Field>
        </div>
      </Section>

      {/* Deductions */}
      <Section title="Deductions">
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden h-9 text-xs font-medium mb-3">
          {[{ v: true, l: 'Standard Deduction' }, { v: false, l: 'Itemized Deductions' }].map(({ v, l }) => (
            <button key={String(v)} type="button" onClick={() => set('useStandardDeduction', v)}
              className={`flex-1 transition-colors ${form.useStandardDeduction === v ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]'}`}>{l}</button>
          ))}
        </div>
        {!form.useStandardDeduction && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mortgage Interest">
              <NumInput value={form.itemizedDeductions} onChange={(v) => set('itemizedDeductions', v)} prefix="$" />
            </Field>
          </div>
        )}
      </Section>

      {/* Above-the-line adjustments */}
      <Section title="Adjustments to Income (Above-the-Line)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Student Loan Interest" hint="Max $2,500; phases out above $85K AGI">
            <NumInput value={form.studentLoanInterest} onChange={(v) => set('studentLoanInterest', v)} prefix="$" placeholder="Max 2500" />
          </Field>
          <Field label="HSA Contribution" hint="2025: $4,300 single / $8,550 family">
            <NumInput value={form.hsaContribution} onChange={(v) => set('hsaContribution', v)} prefix="$" />
          </Field>
          <Field label="Traditional IRA Contribution" hint="Max $7,000 ($8,000 if 50+); income limits apply">
            <NumInput value={form.iraContribution} onChange={(v) => set('iraContribution', v)} prefix="$" placeholder="Max 7000" />
          </Field>
          <Field label="Self-Employed Health Insurance">
            <NumInput value={form.selfEmployedHealthInsurance} onChange={(v) => set('selfEmployedHealthInsurance', v)} prefix="$" />
          </Field>
          <Field label="Educator Expenses" hint="Max $300">
            <NumInput value={form.educatorExpenses} onChange={(v) => set('educatorExpenses', v)} prefix="$" placeholder="Max 300" />
          </Field>
          <Field label="SEP-IRA / SIMPLE Contribution" hint="Max 25% of SE income or $69,000">
            <NumInput value={form.sepContribution} onChange={(v) => set('sepContribution', v)} prefix="$" />
          </Field>
        </div>
      </Section>

      {/* Tax Credits */}
      <Section title="Tax Credits">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dependent Care Expenses" hint="Credit: 20–35% of up to $3K (1 dep) / $6K (2+ dep)">
            <NumInput value={form.dependentCareExpenses} onChange={(v) => set('dependentCareExpenses', v)} prefix="$" />
          </Field>
          <Field label="Education Expenses" hint="AOTC: $2,500/yr (4 yrs); Lifetime Learning: 20% of $10K">
            <NumInput value={form.educationExpenses} onChange={(v) => set('educationExpenses', v)} prefix="$" />
          </Field>
          <Field label="Retirement Contributions (Saver's Credit)" hint="10–50% of first $2,000; income-limited">
            <NumInput value={form.retirementContributions} onChange={(v) => set('retirementContributions', v)} prefix="$" />
          </Field>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" id="isStudent" checked={!!form.isStudent}
            onChange={(e) => set('isStudent', e.target.checked)} className="rounded" />
          <label htmlFor="isStudent" className="text-xs text-[var(--text-secondary)]">Student (eligible for American Opportunity Credit)</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="hasQBI" checked={!!form.hasQBI}
            onChange={(e) => set('hasQBI', e.target.checked)} className="rounded" />
          <label htmlFor="hasQBI" className="text-xs text-[var(--text-secondary)]">Has Qualified Business Income (Section 199A — 20% deduction)</label>
        </div>
        {form.hasQBI && (
          <Field label="Qualified Business Income Amount">
            <NumInput value={form.qbiAmount} onChange={(v) => set('qbiAmount', v)} prefix="$" />
          </Field>
        )}
      </Section>

    </div>
  );
}
