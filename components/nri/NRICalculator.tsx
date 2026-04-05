'use client';

import { useState } from 'react';
import { Calculator, Info, ChevronDown, ChevronUp } from 'lucide-react';

// ---------- Types ----------
interface NRIInput {
  salaryFromIndia: number;
  rentalIncome: number;
  interestIncome: number;
  ltcgEquity: number;
  stcgEquity: number;
  ltcgProperty: number;
  otherIncome: number;
  tdsDeducted: number;
  dtaaCountry: string;
  residencyStatus: 'NRI' | 'RNOR' | 'ROR';
  assessmentYear: '2025-26' | '2026-27';
}

interface TaxResult {
  totalIncome: number;
  taxableIncome: number;
  basicTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  tdsCredit: number;
  taxPayable: number;
  effectiveRate: number;
  breakdown: Array<{ label: string; amount: number }>;
}

// ---------- DTAA Countries ----------
const DTAA_COUNTRIES = [
  { code: 'US', label: 'USA' },
  { code: 'UK', label: 'United Kingdom' },
  { code: 'AE', label: 'UAE (no tax treaty, but no IT in UAE)' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'SG', label: 'Singapore' },
  { code: 'DE', label: 'Germany' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'JP', label: 'Japan' },
  { code: 'OTHER', label: 'Other' },
];

// ---------- Tax Computation ----------
function computeNRITax(input: NRIInput): TaxResult {
  const {
    salaryFromIndia,
    rentalIncome,
    interestIncome,
    ltcgEquity,
    stcgEquity,
    ltcgProperty,
    otherIncome,
    tdsDeducted,
  } = input;

  // NRIs get standard deduction on salary
  const netSalary = Math.max(0, salaryFromIndia - 75000);
  // Rental: 30% standard deduction
  const netRental = Math.max(0, rentalIncome * 0.7);

  // Ordinary income (slab)
  const ordinaryIncome = netSalary + netRental + interestIncome + otherIncome;

  // Special rate income
  const ltcgEquityTaxable = Math.max(0, ltcgEquity - 125000); // ₹1.25L exempt
  const stcgEquityTax = stcgEquity * 0.20; // 20% post-Jul 2024
  const ltcgEquityTax = ltcgEquityTaxable * 0.125; // 12.5%
  const ltcgPropertyTax = ltcgProperty * 0.125; // 12.5% without indexation

  // NRI slab (2025-26 new regime) — basic exemption ₹3L for NRI
  const exemption = 300000;
  const slabIncome = Math.max(0, ordinaryIncome - exemption);

  let slabTax = 0;
  if (slabIncome <= 300000) slabTax = slabIncome * 0.05;
  else if (slabIncome <= 700000) slabTax = 15000 + (slabIncome - 300000) * 0.10;
  else if (slabIncome <= 1000000) slabTax = 55000 + (slabIncome - 700000) * 0.15;
  else if (slabIncome <= 1200000) slabTax = 100000 + (slabIncome - 1000000) * 0.20;
  else if (slabIncome <= 1500000) slabTax = 140000 + (slabIncome - 1200000) * 0.25;
  else slabTax = 215000 + (slabIncome - 1500000) * 0.30;

  const basicTax = slabTax + stcgEquityTax + ltcgEquityTax + ltcgPropertyTax;
  const totalIncome = ordinaryIncome + ltcgEquity + stcgEquity + ltcgProperty;

  // Surcharge
  let surchargeRate = 0;
  if (basicTax > 0) {
    if (totalIncome > 50000000) surchargeRate = 0.25;
    else if (totalIncome > 20000000) surchargeRate = 0.15;
    else if (totalIncome > 10000000) surchargeRate = 0.15;
    else if (totalIncome > 5000000) surchargeRate = 0.10;
  }
  const surcharge = basicTax * surchargeRate;
  const cess = (basicTax + surcharge) * 0.04;
  const totalTax = basicTax + surcharge + cess;
  const tdsCredit = Math.min(tdsDeducted, totalTax);
  const taxPayable = Math.max(0, totalTax - tdsCredit);
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

  const breakdown = [
    { label: 'Salary from India (net of std deduction)', amount: netSalary },
    { label: 'Rental income (net of 30% deduction)', amount: netRental },
    { label: 'Interest income', amount: interestIncome },
    { label: 'Other income', amount: otherIncome },
    { label: 'LTCG on equity (above ₹1.25L exempt)', amount: ltcgEquityTaxable },
    { label: 'STCG on equity', amount: stcgEquity },
    { label: 'LTCG on property', amount: ltcgProperty },
  ];

  return {
    totalIncome,
    taxableIncome: ordinaryIncome + ltcgEquityTaxable + stcgEquity + ltcgProperty,
    basicTax,
    surcharge,
    cess,
    totalTax,
    tdsCredit,
    taxPayable,
    effectiveRate,
    breakdown,
  };
}

// ---------- Formatters ----------
function fmt(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

// ---------- Field Component ----------
function Field({ label, note, value, onChange }: {
  label: string;
  note?: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-[var(--text-secondary)]">{label}</label>
      {note && <p className="text-xs text-[var(--text-muted)]">{note}</p>}
      <input
        type="number"
        min={0}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        placeholder="0"
      />
    </div>
  );
}

// ---------- Section Component ----------
function Section({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="px-4 pb-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>}
    </div>
  );
}

// ---------- Main Component ----------
export default function NRICalculator() {
  const [input, setInput] = useState<NRIInput>({
    salaryFromIndia: 0,
    rentalIncome: 0,
    interestIncome: 0,
    ltcgEquity: 0,
    stcgEquity: 0,
    ltcgProperty: 0,
    otherIncome: 0,
    tdsDeducted: 0,
    dtaaCountry: 'AE',
    residencyStatus: 'NRI',
    assessmentYear: '2025-26',
  });

  const result = computeNRITax(input);
  const set = (field: keyof NRIInput) => (v: number | string) =>
    setInput(prev => ({ ...prev, [field]: v }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-6 w-6 text-[var(--india)]" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">NRI Tax Calculator India</h1>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          AY 2025-26 · New tax regime · Income accrued or received in India is taxable for NRIs
        </p>
      </div>

      {/* Info banner */}
      <div className="flex gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-6 text-sm text-[var(--text-secondary)]">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary)]" />
        <div>
          <strong>NRI Tax Basics:</strong> Only income accrued or arising in India is taxable.
          Global income is not taxed in India. DTAA benefits may reduce TDS rates.
          NRIs cannot use the old regime from FY 2024-25.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-4">
          {/* Residency */}
          <div className="border border-[var(--border)] rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Residency & Assessment Year</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">Status</label>
                <select
                  value={input.residencyStatus}
                  onChange={e => setInput(p => ({ ...p, residencyStatus: e.target.value as NRIInput['residencyStatus'] }))}
                  className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="NRI">NRI</option>
                  <option value="RNOR">RNOR (Returning NRI)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">Country of Residence</label>
                <select
                  value={input.dtaaCountry}
                  onChange={e => setInput(p => ({ ...p, dtaaCountry: e.target.value }))}
                  className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  {DTAA_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Section title="Income from India">
            <Field label="Salary / Pension from India (₹)" note="Only if employer is Indian" value={input.salaryFromIndia} onChange={set('salaryFromIndia')} />
            <Field label="Rental Income from Indian property (₹)" note="30% standard deduction applied" value={input.rentalIncome} onChange={set('rentalIncome')} />
            <Field label="Interest Income (FD/NRO/Savings) (₹)" note="TDS deducted at 30% typically" value={input.interestIncome} onChange={set('interestIncome')} />
            <Field label="Other Income in India (₹)" value={input.otherIncome} onChange={set('otherIncome')} />
          </Section>

          <Section title="Capital Gains (Indian Assets)">
            <Field label="LTCG on Equity / Mutual Funds (₹)" note="₹1.25L exempt · 12.5% above" value={input.ltcgEquity} onChange={set('ltcgEquity')} />
            <Field label="STCG on Equity / Mutual Funds (₹)" note="20% flat (post-Jul 2024)" value={input.stcgEquity} onChange={set('stcgEquity')} />
            <Field label="LTCG on Property / Land (₹)" note="12.5% without indexation (Budget 2024)" value={input.ltcgProperty} onChange={set('ltcgProperty')} />
          </Section>

          <Section title="TDS Already Deducted" defaultOpen={true}>
            <Field label="Total TDS deducted by Indian payers (₹)" note="From Form 26AS / AIS" value={input.tdsDeducted} onChange={set('tdsDeducted')} />
          </Section>

          {/* DTAA note */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-[var(--text-secondary)]">
            <p className="font-medium text-[var(--text-primary)] mb-1">DTAA Note — {input.dtaaCountry}</p>
            {input.dtaaCountry === 'AE' && (
              <p>UAE has no income tax. DTAA with India covers interest (12.5%), royalties (12.5%). FD interest TDS for UAE NRIs: 30% unless DTAA claim filed with Form 10F.</p>
            )}
            {input.dtaaCountry === 'US' && (
              <p>India-US DTAA: Salary taxed only in country of work. Dividends: 15-25%. Interest: 15%. Capital gains: generally taxed in residence country. File Form 10F for lower TDS.</p>
            )}
            {input.dtaaCountry === 'UK' && (
              <p>India-UK DTAA: Interest 15%, Royalties 15%, Dividends 15%. Capital gains: taxed in country of alienation for immovable property.</p>
            )}
            {!['AE', 'US', 'UK'].includes(input.dtaaCountry) && (
              <p>Consult a CA for DTAA provisions applicable to your country of residence. File Form 10F + Tax Residency Certificate to claim lower TDS rates.</p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 space-y-4">
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <p className="text-xs text-[var(--text-muted)] mb-1">Total Tax</p>
                <p className="text-xl font-bold text-[var(--text-primary)] num">{fmt(result.totalTax)}</p>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <p className="text-xs text-[var(--text-muted)] mb-1">Tax Payable</p>
                <p className="text-xl font-bold text-[var(--india)] num">{fmt(result.taxPayable)}</p>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <p className="text-xs text-[var(--text-muted)] mb-1">Effective Rate</p>
                <p className="text-xl font-bold text-[var(--text-primary)] num">{result.effectiveRate.toFixed(1)}%</p>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <p className="text-xs text-[var(--text-muted)] mb-1">TDS Credit</p>
                <p className="text-xl font-bold text-[var(--success)] num">{fmt(result.tdsCredit)}</p>
              </div>
            </div>

            {/* Tax computation table */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Tax Computation</h3>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {[
                  { label: 'Total Income', value: result.totalIncome },
                  { label: 'Basic Tax', value: result.basicTax },
                  { label: 'Surcharge', value: result.surcharge },
                  { label: 'Health & Education Cess (4%)', value: result.cess },
                  { label: 'Gross Tax Liability', value: result.totalTax, bold: true },
                  { label: 'Less: TDS Credit', value: -result.tdsCredit, red: true },
                  { label: 'Net Tax Payable', value: result.taxPayable, bold: true, highlight: true },
                ].map(row => (
                  <div
                    key={row.label}
                    className={`flex justify-between items-center px-4 py-2.5 text-sm ${row.highlight ? 'bg-[var(--primary)]/5' : ''}`}
                  >
                    <span className={`text-[var(--text-secondary)] ${row.bold ? 'font-semibold text-[var(--text-primary)]' : ''}`}>{row.label}</span>
                    <span className={`num tabular-nums ${row.bold ? 'font-bold text-[var(--text-primary)]' : ''} ${row.red ? 'text-[var(--success)]' : ''}`}>
                      {row.value < 0 ? `(${fmt(-row.value)})` : fmt(row.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Income breakdown */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Income Breakdown</h3>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {result.breakdown.filter(b => b.amount > 0).map(b => (
                  <div key={b.label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <span className="text-[var(--text-secondary)] text-xs">{b.label}</span>
                    <span className="num tabular-nums text-[var(--text-primary)]">{fmt(b.amount)}</span>
                  </div>
                ))}
                {result.breakdown.every(b => b.amount === 0) && (
                  <p className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">Enter income details to see breakdown</p>
                )}
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Computed under new tax regime (default for NRIs from FY 2024-25).
              DTAA benefits and treaty-based TDS reductions require separate CA consultation.
              This is informational only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
