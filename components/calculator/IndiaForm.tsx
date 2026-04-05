'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { IndiaInput, TaxResult } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  onResult: (result: TaxResult | null) => void;
  onInputChange?: (input: Partial<IndiaInput>) => void;
  initialValues?: Partial<IndiaInput>;
}

function Section({
  title, subtitle, defaultOpen = false, children,
}: {
  title: string; subtitle?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--surface-raised)] hover:bg-[var(--border)] transition-colors text-left"
      >
        <div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
          {subtitle && <span className="ml-2 text-xs text-[var(--text-muted)]">{subtitle}</span>}
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)] shrink-0" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)] shrink-0" />}
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
        {hint && (
          <span title={hint} className="cursor-help">
            <Info className="h-3 w-3 text-[var(--text-muted)]" />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function NumberInput({
  value, onChange, placeholder, prefix,
}: {
  value: number | undefined; onChange: (v: number) => void; placeholder?: string; prefix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-xs text-[var(--text-muted)] font-medium select-none">{prefix}</span>
      )}
      <input
        type="number"
        min="0"
        value={value || ''}
        placeholder={placeholder}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-colors num ${prefix ? 'pl-7 pr-3' : 'px-3'}`}
      />
    </div>
  );
}

function SegmentControl<T extends string>({
  value, options, onChange,
}: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-lg border border-[var(--border)] overflow-hidden h-9 text-xs font-medium">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 transition-colors ${value === o.value ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function IndiaForm({ onResult, onInputChange, initialValues }: Props) {
  const [assessmentYear, setAssessmentYear] = useState<'AY 2025-26' | 'AY 2026-27'>('AY 2026-27');
  const [form, setForm] = useState<Partial<IndiaInput>>({
    country: 'IN',
    regime: 'auto',
    age: 'below60',
    metroCity: true,
    businessType: 'none',
    digitalReceipts44AD: false,
    ...initialValues,
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const set = useCallback(<K extends keyof IndiaInput>(field: K, value: IndiaInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const calculate = useCallback(async () => {
    const hasIncome =
      (form.grossSalary || form.grossIncome || 0) > 0 ||
      (form.basicSalary || 0) > 0 ||
      (form.businessProfit || 0) > 0 ||
      (form.turnover44AD || 0) > 0 ||
      (form.grossReceipts44ADA || 0) > 0 ||
      (form.capitalGains?.some((g) => g.amount > 0)) ||
      (form.fdInterest || 0) > 0 ||
      (form.otherIncome || 0) > 0;

    if (!hasIncome) { onResult(null); return; }
    try {
      const { calculateIndiaTax } = await import('@/engine/india');
      const result = calculateIndiaTax(form as IndiaInput);
      onResult(result);
    } catch (e) { console.error(e); }
  }, [form, onResult]);

  useEffect(() => {
    const t = setTimeout(calculate, 350);
    return () => clearTimeout(t);
  }, [calculate]);

  useEffect(() => {
    if (onInputChange) onInputChange(form);
  }, [form, onInputChange]);

  const isOldOrAuto = form.regime === 'old' || form.regime === 'auto';

  return (
    <div className="space-y-3">

      {/* Assessment Year Selector */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Assessment Year</span>
        <div className="flex gap-2">
          {(['AY 2025-26', 'AY 2026-27'] as const).map(ay => (
            <button
              key={ay}
              type="button"
              onClick={() => setAssessmentYear(ay)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                assessmentYear === ay
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]'
              }`}
            >{ay}</button>
          ))}
        </div>
        <span className="text-xs text-[var(--text-muted)] ml-auto">
          {assessmentYear === 'AY 2026-27' ? 'FY 2025-26 (current)' : 'FY 2024-25 (prior year)'}
        </span>
      </div>
      {assessmentYear === 'AY 2025-26' && (
        <div className="rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/10 px-3 py-2.5">
          <p className="text-xs text-[var(--warning)] font-medium">
            Using FY 2024-25 slabs. New regime: ₹1L LTCG exempt (not ₹1.25L). 87A: ₹12,500 rebate up to ₹5L.
          </p>
        </div>
      )}

      {/* Regime + Age */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tax Regime">
          <SegmentControl
            value={form.regime as 'old' | 'new' | 'auto'}
            options={[{ value: 'auto', label: 'Auto' }, { value: 'new', label: 'New' }, { value: 'old', label: 'Old' }]}
            onChange={(v) => set('regime', v)}
          />
        </Field>
        <Field label="Age Group">
          <select
            value={form.age}
            onChange={(e) => set('age', e.target.value as IndiaInput['age'])}
            className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors"
          >
            <option value="below60">Below 60</option>
            <option value="60to80">60 – 80 (Senior)</option>
            <option value="above80">Above 80 (Super Senior)</option>
          </select>
        </Field>
      </div>
      {form.regime === 'auto' && (
        <p className="text-xs text-[var(--text-muted)] bg-[var(--surface-raised)] rounded-lg px-3 py-2">
          Auto mode computes both regimes and selects the lower tax option.
        </p>
      )}

      {/* Salary Income */}
      <Section title="Salary Income" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gross Salary" hint="If you provide gross salary directly, individual allowance fields are ignored">
            <NumberInput value={form.grossSalary} onChange={(v) => set('grossSalary', v)} placeholder="e.g. 1200000" prefix="₹" />
          </Field>
          <Field label="Basic Salary" hint="Required for HRA exemption calculation">
            <NumberInput value={form.basicSalary} onChange={(v) => set('basicSalary', v)} placeholder="e.g. 600000" prefix="₹" />
          </Field>
          <Field label="HRA Received">
            <NumberInput value={form.hra} onChange={(v) => set('hra', v)} placeholder="e.g. 240000" prefix="₹" />
          </Field>
          <Field label="Special Allowance">
            <NumberInput value={form.specialAllowance} onChange={(v) => set('specialAllowance', v)} prefix="₹" />
          </Field>
          <Field label="Bonus">
            <NumberInput value={form.bonus} onChange={(v) => set('bonus', v)} prefix="₹" />
          </Field>
          <Field label="Other Allowances">
            <NumberInput value={form.otherAllowances} onChange={(v) => set('otherAllowances', v)} prefix="₹" />
          </Field>
        </div>

        {/* HRA sub-section */}
        {(form.hra || 0) > 0 && (
          <div className="mt-2 pt-3 border-t border-[var(--border)] space-y-3">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">HRA Exemption Details</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Annual Rent Paid">
                <NumberInput value={form.rentPaid} onChange={(v) => set('rentPaid', v)} prefix="₹" />
              </Field>
              <Field label="City Type">
                <SegmentControl
                  value={form.metroCity ? 'metro' : 'non_metro'}
                  options={[{ value: 'metro', label: 'Metro' }, { value: 'non_metro', label: 'Non-Metro' }]}
                  onChange={(v) => set('metroCity', v === 'metro')}
                />
              </Field>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2 pt-3 border-t border-[var(--border)]">
          <Field label="Professional Tax" hint="Deductible up to ₹2,500">
            <NumberInput value={form.professionalTax} onChange={(v) => set('professionalTax', v)} placeholder="2500" prefix="₹" />
          </Field>
          <Field label="Employer NPS (80CCD(2))" hint="Deductible in both regimes — max 10% of salary">
            <NumberInput value={form.employerNPS} onChange={(v) => set('employerNPS', v)} prefix="₹" />
          </Field>
        </div>
      </Section>

      {/* House Property */}
      <Section title="House Property Income">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Home Loan Interest (Self-Occupied)" hint="Max ₹2,00,000 deductible (old regime)">
            <NumberInput value={form.homeLoanInterest} onChange={(v) => set('homeLoanInterest', v)} prefix="₹" />
          </Field>
          <Field label="Pre-Construction Interest" hint="1/5th deductible per year for 5 years (old regime)">
            <NumberInput value={form.properties?.[0]?.preConstructionInterest} onChange={(v) => set('properties', [{ type: 'self_occupied', homeLoanInterest: form.homeLoanInterest, preConstructionInterest: v }])} prefix="₹" />
          </Field>
        </div>
        <div className="mt-2 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-3">
          <Field label="Annual Rent Received (Let-Out)">
            <NumberInput value={form.properties?.find((p) => p.type === 'let_out')?.annualRentReceived} onChange={(v) => {
              const existing = form.properties?.filter((p) => p.type !== 'let_out') || [];
              set('properties', [...existing, { type: 'let_out', annualRentReceived: v, municipalTaxPaid: form.properties?.find((p) => p.type === 'let_out')?.municipalTaxPaid || 0, homeLoanInterest: form.properties?.find((p) => p.type === 'let_out')?.homeLoanInterest || 0 }]);
            }} prefix="₹" />
          </Field>
          <Field label="Municipal Tax (Let-Out Property)">
            <NumberInput value={form.properties?.find((p) => p.type === 'let_out')?.municipalTaxPaid} onChange={(v) => {
              const letOut = form.properties?.find((p) => p.type === 'let_out') || { type: 'let_out' as const };
              const rest = form.properties?.filter((p) => p.type !== 'let_out') || [];
              set('properties', [...rest, { ...letOut, type: 'let_out', municipalTaxPaid: v }]);
            }} prefix="₹" />
          </Field>
          <Field label="Loan Interest (Let-Out Property)" hint="No cap — full interest deductible">
            <NumberInput value={form.properties?.find((p) => p.type === 'let_out')?.homeLoanInterest} onChange={(v) => {
              const letOut = form.properties?.find((p) => p.type === 'let_out') || { type: 'let_out' as const };
              const rest = form.properties?.filter((p) => p.type !== 'let_out') || [];
              set('properties', [...rest, { ...letOut, type: 'let_out', homeLoanInterest: v }]);
            }} prefix="₹" />
          </Field>
        </div>
      </Section>

      {/* Business / Profession */}
      <Section title="Business / Profession Income">
        <Field label="Income Type">
          <select
            value={form.businessType}
            onChange={(e) => set('businessType', e.target.value as IndiaInput['businessType'])}
            className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] transition-colors"
          >
            <option value="none">None</option>
            <option value="44AD">Presumptive — Sec 44AD (Business, max ₹2Cr)</option>
            <option value="44ADA">Presumptive — Sec 44ADA (Profession, max ₹75L)</option>
            <option value="regular">Regular Business / Profession</option>
          </select>
        </Field>
        {form.businessType === '44AD' && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Field label="Total Turnover">
              <NumberInput value={form.turnover44AD} onChange={(v) => set('turnover44AD', v)} prefix="₹" />
            </Field>
            <Field label="Receipt Mode">
              <SegmentControl
                value={form.digitalReceipts44AD ? 'digital' : 'cash'}
                options={[{ value: 'digital', label: 'Digital (6%)' }, { value: 'cash', label: 'Cash/Mixed (8%)' }]}
                onChange={(v) => set('digitalReceipts44AD', v === 'digital')}
              />
            </Field>
          </div>
        )}
        {form.businessType === '44ADA' && (
          <Field label="Gross Professional Receipts">
            <NumberInput value={form.grossReceipts44ADA} onChange={(v) => set('grossReceipts44ADA', v)} prefix="₹" />
          </Field>
        )}
        {form.businessType === 'regular' && (
          <Field label="Net Business / Profession Profit">
            <NumberInput value={form.businessProfit} onChange={(v) => set('businessProfit', v)} prefix="₹" />
          </Field>
        )}
      </Section>

      {/* Capital Gains */}
      <Section title="Capital Gains">
        {[
          { label: 'Equity / Equity MF — Short-Term (STCG)', type: 'equity_mf' as const, gain: 'short' as const, hint: '20% flat — STT paid' },
          { label: 'Equity / Equity MF — Long-Term (LTCG)', type: 'equity_mf' as const, gain: 'long' as const, hint: '12.5% above ₹1.25L exemption' },
          { label: 'Debt MF / Bonds — Short-Term', type: 'debt_mf' as const, gain: 'short' as const, hint: 'Taxed at slab rate' },
          { label: 'Debt MF / Bonds — Long-Term', type: 'debt_mf' as const, gain: 'long' as const, hint: 'Taxed at slab rate (post Apr 2023)' },
          { label: 'Property — Long-Term (with Indexation)', type: 'property' as const, gain: 'long' as const, hint: '20% with CII indexation' },
          { label: 'Gold / Other Assets — Short-Term', type: 'gold' as const, gain: 'short' as const, hint: 'Taxed at slab rate' },
          { label: 'Gold / Other Assets — Long-Term', type: 'gold' as const, gain: 'long' as const, hint: '12.5% (post Budget 2024)' },
        ].map(({ label, type, gain, hint }) => {
          const existing = form.capitalGains?.find((g) => g.assetType === type && g.gainType === gain);
          return (
            <Field key={`${type}-${gain}`} label={label} hint={hint}>
              <NumberInput
                value={existing?.amount}
                onChange={(v) => {
                  const others = (form.capitalGains || []).filter((g) => !(g.assetType === type && g.gainType === gain));
                  set('capitalGains', v > 0 ? [...others, { assetType: type, gainType: gain, amount: v, sttPaid: type === 'equity_mf' }] : others);
                }}
                prefix="₹"
                placeholder="0"
              />
            </Field>
          );
        })}
      </Section>

      {/* Other Sources */}
      <Section title="Other Income">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Savings Account Interest" hint="80TTA: max ₹10,000 exempt in old regime">
            <NumberInput value={form.savingsInterest} onChange={(v) => set('savingsInterest', v)} prefix="₹" />
          </Field>
          <Field label="FD / RD Interest" hint="Fully taxable at slab rate">
            <NumberInput value={form.fdInterest} onChange={(v) => set('fdInterest', v)} prefix="₹" />
          </Field>
          <Field label="Dividend Income" hint="Fully taxable at slab rate">
            <NumberInput value={form.dividendIncome} onChange={(v) => set('dividendIncome', v)} prefix="₹" />
          </Field>
          <Field label="Lottery / Game Winnings" hint="30% flat tax + cess, no basic exemption">
            <NumberInput value={form.lotteryWinnings} onChange={(v) => set('lotteryWinnings', v)} prefix="₹" />
          </Field>
          <Field label="Other Income">
            <NumberInput value={form.otherIncome} onChange={(v) => set('otherIncome', v)} prefix="₹" />
          </Field>
          <Field label="Agricultural Income (Exempt)" hint="Exempt from tax; noted for surcharge computation">
            <NumberInput value={form.agriculturalIncome} onChange={(v) => set('agriculturalIncome', v)} prefix="₹" />
          </Field>
        </div>
      </Section>

      {/* Deductions — Old Regime */}
      {isOldOrAuto && (
        <Section title="Chapter VI-A Deductions" subtitle="Old Regime only">
          <p className="text-xs text-[var(--text-muted)]">80C + 80CCC + 80CCD(1) combined cap: ₹1,50,000</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="80C — PPF / ELSS / LIC / EPF / NSC" hint="Max ₹1,50,000">
              <NumberInput value={form.section80C} onChange={(v) => set('section80C', v)} prefix="₹" placeholder="Max 150000" />
            </Field>
            <Field label="80CCD(1B) — NPS Additional" hint="Over and above 80C, max ₹50,000">
              <NumberInput value={form.section80CCD1B} onChange={(v) => set('section80CCD1B', v)} prefix="₹" placeholder="Max 50000" />
            </Field>
            <Field label="80D — Health Insurance (Self + Family)" hint="Max ₹25,000 (₹50,000 if senior)">
              <NumberInput value={form.section80D_self} onChange={(v) => set('section80D_self', v)} prefix="₹" placeholder="Max 25000" />
            </Field>
            <Field label="80D — Health Insurance (Parents)" hint="Max ₹25,000 (₹50,000 if parents are senior)">
              <NumberInput value={form.section80D_parents} onChange={(v) => set('section80D_parents', v)} prefix="₹" placeholder="Max 25000" />
            </Field>
            <Field label="80E — Education Loan Interest" hint="No limit, max 8 years from repayment start">
              <NumberInput value={form.section80E} onChange={(v) => set('section80E', v)} prefix="₹" />
            </Field>
            <Field label="80EEA — Affordable Housing Loan" hint="Additional to Sec 24, max ₹1,50,000">
              <NumberInput value={form.section80EEA} onChange={(v) => set('section80EEA', v)} prefix="₹" placeholder="Max 150000" />
            </Field>
            <Field label="80G — Donations (50% eligible)" hint="50% of donated amount is deductible">
              <NumberInput value={form.section80G} onChange={(v) => set('section80G', v)} prefix="₹" />
            </Field>
            <Field label="80G — Donations (100% without limit)">
              <NumberInput value={form.section80G_unlimited} onChange={(v) => set('section80G_unlimited', v)} prefix="₹" />
            </Field>
            <Field label="80TTA — Savings Interest" hint="Max ₹10,000 (not for senior citizens)">
              <NumberInput value={form.section80TTA} onChange={(v) => set('section80TTA', v)} prefix="₹" placeholder="Max 10000" />
            </Field>
            {(form.age === '60to80' || form.age === 'above80') && (
              <Field label="80TTB — Sr. Citizen Interest (FD+Savings)" hint="Max ₹50,000">
                <NumberInput value={form.section80TTB} onChange={(v) => set('section80TTB', v)} prefix="₹" placeholder="Max 50000" />
              </Field>
            )}
            <Field label="80DDB — Specified Disease Treatment" hint="Max ₹40,000 (₹1,00,000 senior)">
              <NumberInput value={form.section80DDB} onChange={(v) => set('section80DDB', v)} prefix="₹" />
            </Field>
          </div>
          <div className="mt-2 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-3">
            <Field label="80U — Self Disability" hint="₹75,000 fixed deduction (severe: ₹1,25,000)">
              <div className="flex gap-2">
                <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <input type="checkbox" checked={!!form.section80U} onChange={(e) => set('section80U', e.target.checked)} className="rounded" />
                  Disabled
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <input type="checkbox" checked={!!form.section80U_severe} onChange={(e) => set('section80U_severe', e.target.checked)} className="rounded" disabled={!form.section80U} />
                  Severe (₹1.25L)
                </label>
              </div>
            </Field>
            <Field label="80DD — Dependent Disability" hint="₹75,000 (severe: ₹1,25,000)">
              <div className="flex gap-2">
                <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <input type="checkbox" checked={!!form.section80DD} onChange={(e) => set('section80DD', e.target.checked ? 75000 : 0)} className="rounded" />
                  Disabled Dependent
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <input type="checkbox" checked={!!form.section80DD_severe} onChange={(e) => set('section80DD_severe', e.target.checked)} className="rounded" />
                  Severe
                </label>
              </div>
            </Field>
          </div>
        </Section>
      )}

      {/* Advanced — ESOP */}
      <Section title="Advanced — ESOP">
        <div className="grid grid-cols-2 gap-3">
          <Field label="ESOP Perquisite Value" hint="Market value at exercise minus exercise price × shares. Taxable as salary.">
            <NumberInput value={form.esopPerquisite} onChange={(v) => set('esopPerquisite', v)} prefix="₹" placeholder="e.g. 500000" />
          </Field>
          <Field label="ESOP Subsequent Gain Type">
            <SegmentControl
              value={(form.esopSubsequentGain?.[0]?.gainType ?? 'short') as 'short' | 'long'}
              options={[{ value: 'short', label: 'Short-term' }, { value: 'long', label: 'Long-term' }]}
              onChange={(v) => {
                const existing = form.esopSubsequentGain?.[0];
                set('esopSubsequentGain', [{ gainType: v, amount: existing?.amount ?? 0 }]);
              }}
            />
          </Field>
        </div>
        <Field label="ESOP Subsequent Gain Amount" hint="Gain on sale: sale price minus FMV at exercise">
          <NumberInput
            value={form.esopSubsequentGain?.[0]?.amount}
            onChange={(v) => {
              const gainType = form.esopSubsequentGain?.[0]?.gainType ?? 'short';
              set('esopSubsequentGain', [{ gainType, amount: v }]);
            }}
            prefix="₹"
            placeholder="0"
          />
        </Field>
      </Section>

      {/* Advanced — Other Income */}
      <Section title="Advanced — Other Income">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gift Received (from non-relative)" hint="Gifts above ₹50,000 from non-relatives are fully taxable as other sources (Section 56(2)(x))">
            <NumberInput value={form.giftReceived} onChange={(v) => set('giftReceived', v)} prefix="₹" placeholder="e.g. 100000" />
          </Field>
          <Field label="Minor Child Income (total)" hint="Income of minor children clubbed with parent. ₹1,500 per child is exempt (Section 64(1A))">
            <NumberInput value={form.minorChildIncome} onChange={(v) => set('minorChildIncome', v)} prefix="₹" placeholder="0" />
          </Field>
        </div>
        <Field label="Gift from Relative (Exempt)" hint="If from spouse, parents, siblings, etc. — fully exempt regardless of amount">
          <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.giftFromRelative}
              onChange={(e) => set('giftFromRelative', e.target.checked)}
              className="rounded"
            />
            Gift from relative (exempt)
          </label>
        </Field>
      </Section>

      {/* Advanced — Business (Section 50C / 80-IAC) */}
      <Section title="Advanced — Business (Section 50C / 80-IAC)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Property Sale — Stamp Duty Value (Section 50C)" hint="If stamp duty value exceeds sale price, capital gain is computed on stamp duty value">
            <NumberInput
              value={form.capitalGains?.find((g) => g.assetType === 'property')?.stampDutyValue}
              onChange={(v) => {
                const existing = form.capitalGains?.find((g) => g.assetType === 'property' && g.gainType === 'long');
                const others = (form.capitalGains || []).filter((g) => !(g.assetType === 'property' && g.gainType === 'long'));
                const updated = { assetType: 'property' as const, gainType: 'long' as const, amount: existing?.amount ?? 0, stampDutyValue: v };
                set('capitalGains', [...others, updated]);
              }}
              prefix="₹"
              placeholder="0"
            />
          </Field>
          <Field label="Startup Tax Holiday (80-IAC)" hint="Eligible startup profit deduction (100% for 3 consecutive years of first 10). Requires DPIIT certificate.">
            <NumberInput value={form.section80IAC} onChange={(v) => set('section80IAC', v)} prefix="₹" placeholder="0" />
          </Field>
        </div>
      </Section>

      {/* TDS / Advance Tax */}
      <Section title="TDS & Advance Tax">
        <div className="grid grid-cols-2 gap-3">
          <Field label="TDS Already Deducted" hint="Form 16 / 26AS total TDS">
            <NumberInput value={form.tdsDeducted} onChange={(v) => set('tdsDeducted', v)} prefix="₹" />
          </Field>
          <Field label="Advance Tax Paid">
            <NumberInput value={form.advanceTaxPaid} onChange={(v) => set('advanceTaxPaid', v)} prefix="₹" />
          </Field>
        </div>
      </Section>

    </div>
  );
}
