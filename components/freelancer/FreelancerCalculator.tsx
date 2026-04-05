'use client';

import { useState, useMemo } from 'react';
import {
  Briefcase,
  Calculator,
  CalendarClock,
  TrendingUp,
  PiggyBank,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  'h-10 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30';

const BRACKETS_2025_SINGLE = [
  { min: 0, max: 11925, rate: 0.1 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: null, rate: 0.37 },
];

const BRACKETS_2025_MFJ = [
  { min: 0, max: 23850, rate: 0.1 },
  { min: 23850, max: 96950, rate: 0.12 },
  { min: 96950, max: 206700, rate: 0.22 },
  { min: 206700, max: 394600, rate: 0.24 },
  { min: 394600, max: 501050, rate: 0.32 },
  { min: 501050, max: 751600, rate: 0.35 },
  { min: 751600, max: null, rate: 0.37 },
];

const TODAY = new Date('2026-04-05');

const QUARTERS = [
  { q: 'Q1 2025', period: 'Jan 1 – Mar 31', dueDate: 'April 15, 2025', dueISO: '2025-04-15' },
  { q: 'Q2 2025', period: 'Apr 1 – May 31', dueDate: 'June 16, 2025', dueISO: '2025-06-16' },
  { q: 'Q3 2025', period: 'Jun 1 – Aug 31', dueDate: 'September 15, 2025', dueISO: '2025-09-15' },
  { q: 'Q4 2025', period: 'Sep 1 – Dec 31', dueDate: 'January 15, 2026', dueISO: '2026-01-15' },
];

type Tab = 'Calculator' | 'Quarterly Estimates' | 'Deductions Optimizer' | 'Scenarios';
type FilingStatus = 'single' | 'mfj';
type RetirementType = 'none' | 'ira' | 'solo401k' | 'sep';

// ── Utility ────────────────────────────────────────────────────────────────────

function fmtUSD(n: number, decimals = 0): string {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

function calcFederalTax(income: number, brackets: typeof BRACKETS_2025_SINGLE): number {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    const upper = b.max === null ? income : Math.min(income, b.max);
    tax += (upper - b.min) * b.rate;
  }
  return tax;
}

function getMarginalRate(income: number, brackets: typeof BRACKETS_2025_SINGLE): number {
  let rate = brackets[0].rate;
  for (const b of brackets) {
    if (income > b.min) rate = b.rate;
    else break;
  }
  return rate;
}

// ── Computation ────────────────────────────────────────────────────────────────

interface Inputs {
  grossSEIncome: number;
  businessExpenses: number;
  retirementContribution: number;
  filingStatus: FilingStatus;
}

interface TaxResult {
  netSEIncome: number;
  seTaxBase: number;
  seTax: number;
  additionalMedicare: number;
  totalSETax: number;
  seTaxDeduction: number;
  retirementContribution: number;
  agi: number;
  standardDeduction: number;
  qbiDeduction: number;
  taxableIncome: number;
  federalIncomeTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  netTakeHome: number;
  monthlyTakeHome: number;
  quarterlyPayment: number;
}

function computeTax(inputs: Inputs): TaxResult {
  const { grossSEIncome, businessExpenses, retirementContribution, filingStatus } = inputs;
  const brackets = filingStatus === 'single' ? BRACKETS_2025_SINGLE : BRACKETS_2025_MFJ;
  const standardDeduction = filingStatus === 'single' ? 15000 : 30000;
  const medicareSingleThreshold = filingStatus === 'single' ? 200000 : 250000;

  const netSEIncome = Math.max(0, grossSEIncome - businessExpenses);
  const seTaxBase = netSEIncome * 0.9235;
  const seTax = seTaxBase > 0 ? seTaxBase * 0.153 : 0;
  const additionalMedicare = Math.max(0, (netSEIncome - medicareSingleThreshold) * 0.009);
  const totalSETax = seTax + additionalMedicare;

  const seTaxDeduction = totalSETax / 2;
  const agi = Math.max(0, netSEIncome - seTaxDeduction - retirementContribution);
  const qbiDeduction = Math.max(0, netSEIncome * 0.2);
  const taxableIncome = Math.max(0, agi - standardDeduction - qbiDeduction);

  const federalIncomeTax = calcFederalTax(taxableIncome, brackets);
  const totalTax = federalIncomeTax + totalSETax;
  const effectiveRate = netSEIncome > 0 ? totalTax / netSEIncome : 0;
  const marginalRate = getMarginalRate(taxableIncome, brackets);
  const netTakeHome = netSEIncome - totalTax;
  const monthlyTakeHome = netTakeHome / 12;
  const quarterlyPayment = totalTax / 4;

  return {
    netSEIncome,
    seTaxBase,
    seTax,
    additionalMedicare,
    totalSETax,
    seTaxDeduction,
    retirementContribution,
    agi,
    standardDeduction,
    qbiDeduction,
    taxableIncome,
    federalIncomeTax,
    totalTax,
    effectiveRate,
    marginalRate,
    netTakeHome,
    monthlyTakeHome,
    quarterlyPayment,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function KPICard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-1">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
      <p className={`num text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ── Tab: Calculator ────────────────────────────────────────────────────────────

interface CalculatorTabProps {
  grossSEIncome: string;
  setGrossSEIncome: (v: string) => void;
  homeOffice: string;
  setHomeOffice: (v: string) => void;
  internetPhone: string;
  setInternetPhone: (v: string) => void;
  equipment: string;
  setEquipment: (v: string) => void;
  vehicleExpenseTotal: string;
  setVehicleExpenseTotal: (v: string) => void;
  vehicleBusinessPct: string;
  setVehicleBusinessPct: (v: string) => void;
  otherExpenses: string;
  setOtherExpenses: (v: string) => void;
  retirementType: RetirementType;
  setRetirementType: (v: RetirementType) => void;
  retirementContribution: string;
  setRetirementContribution: (v: string) => void;
  filingStatus: FilingStatus;
  setFilingStatus: (v: FilingStatus) => void;
  result: TaxResult;
  totalExpenses: number;
  sepIRALimit: number;
}

function CalculatorTab({
  grossSEIncome,
  setGrossSEIncome,
  homeOffice,
  setHomeOffice,
  internetPhone,
  setInternetPhone,
  equipment,
  setEquipment,
  vehicleExpenseTotal,
  setVehicleExpenseTotal,
  vehicleBusinessPct,
  setVehicleBusinessPct,
  otherExpenses,
  setOtherExpenses,
  retirementType,
  setRetirementType,
  retirementContribution,
  setRetirementContribution,
  filingStatus,
  setFilingStatus,
  result,
  totalExpenses,
  sepIRALimit,
}: CalculatorTabProps) {
  const [expExpanded, setExpExpanded] = useState(false);

  const grossVal = parseFloat(grossSEIncome) || 0;

  const retirementMax = useMemo(() => {
    if (retirementType === 'ira') return 7000;
    if (retirementType === 'solo401k') return Math.min(result.netSEIncome, 23500 + 69000);
    if (retirementType === 'sep') return sepIRALimit;
    return 0;
  }, [retirementType, result.netSEIncome, sepIRALimit]);

  const handleRetirementTypeChange = (type: RetirementType) => {
    setRetirementType(type);
    if (type === 'none') {
      setRetirementContribution('0');
    } else if (type === 'ira') {
      setRetirementContribution('7000');
    } else if (type === 'solo401k') {
      setRetirementContribution(String(Math.min(result.netSEIncome, 23500 + 69000)));
    } else if (type === 'sep') {
      setRetirementContribution(String(Math.floor(sepIRALimit)));
    }
  };

  const hasData = grossVal > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Left: Inputs */}
      <div className="space-y-5">
        {/* Income & Expenses */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[var(--us)]" />
            Income &amp; Expenses
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Gross SE Income ($/yr)
              </label>
              <input
                type="number"
                min="0"
                value={grossSEIncome}
                onChange={(e) => setGrossSEIncome(e.target.value)}
                placeholder="e.g. 120000"
                className={INPUT_CLASS}
              />
            </div>

            {/* Business Expenses */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Business Expenses ($/yr)
                </label>
                <button
                  type="button"
                  onClick={() => setExpExpanded((v) => !v)}
                  className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                >
                  {expExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Hide breakdown
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Breakdown
                    </>
                  )}
                </button>
              </div>

              {expExpanded ? (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)]">Home Office ($/yr)</label>
                    <input
                      type="number"
                      min="0"
                      value={homeOffice}
                      onChange={(e) => setHomeOffice(e.target.value)}
                      placeholder="0"
                      className={INPUT_CLASS}
                    />
                    <p className="text-xs text-[var(--text-muted)]">
                      Pro-rata based on % of home used exclusively for business
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)]">Internet &amp; Phone ($/yr)</label>
                    <input
                      type="number"
                      min="0"
                      value={internetPhone}
                      onChange={(e) => setInternetPhone(e.target.value)}
                      placeholder="0"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)]">Equipment &amp; Software ($/yr)</label>
                    <input
                      type="number"
                      min="0"
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      placeholder="0"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--text-secondary)]">Vehicle Total ($/yr)</label>
                      <input
                        type="number"
                        min="0"
                        value={vehicleExpenseTotal}
                        onChange={(e) => setVehicleExpenseTotal(e.target.value)}
                        placeholder="0"
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-[var(--text-secondary)]">Business Use %</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={vehicleBusinessPct}
                        onChange={(e) => setVehicleBusinessPct(e.target.value)}
                        placeholder="50"
                        className={INPUT_CLASS}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)]">Other Expenses ($/yr)</label>
                    <input
                      type="number"
                      min="0"
                      value={otherExpenses}
                      onChange={(e) => setOtherExpenses(e.target.value)}
                      placeholder="0"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                    <span className="text-xs font-medium text-[var(--text-secondary)]">Total Expenses</span>
                    <span className="num text-sm font-semibold text-[var(--text-primary)]">
                      {fmtUSD(totalExpenses)}
                    </span>
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  min="0"
                  value={String(totalExpenses) === '0' ? '' : totalExpenses}
                  readOnly
                  tabIndex={-1}
                  placeholder="Expand to enter breakdown"
                  className={INPUT_CLASS + ' cursor-default bg-[var(--surface-raised)] text-[var(--text-muted)]'}
                />
              )}
            </div>
          </div>
        </div>

        {/* Retirement Contributions */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-[var(--success)]" />
            Retirement Contributions
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                { value: 'none', label: 'None' },
                { value: 'ira', label: 'Trad. IRA' },
                { value: 'solo401k', label: 'Solo 401k' },
                { value: 'sep', label: 'SEP-IRA' },
              ] as { value: RetirementType; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleRetirementTypeChange(opt.value)}
                className={`h-9 rounded-lg border text-xs font-medium transition-colors ${
                  retirementType === opt.value
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--primary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {retirementType !== 'none' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--text-secondary)]">
                  Contribution Amount ($)
                </label>
                <span className="text-xs text-[var(--text-muted)]">
                  Max: {fmtUSD(retirementMax)}
                </span>
              </div>
              <input
                type="number"
                min="0"
                max={retirementMax}
                value={retirementContribution}
                onChange={(e) => setRetirementContribution(e.target.value)}
                className={INPUT_CLASS}
              />
              {retirementType === 'ira' && (
                <p className="text-xs text-[var(--text-muted)]">Traditional IRA: $7,000/yr (2025). Reduces AGI.</p>
              )}
              {retirementType === 'solo401k' && (
                <p className="text-xs text-[var(--text-muted)]">
                  Employee deferral $23,500 + employer up to $69,000 total.
                </p>
              )}
              {retirementType === 'sep' && (
                <p className="text-xs text-[var(--text-muted)]">
                  SEP-IRA: 25% of net SE income, max $69,000 (2025).
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filing Status */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Filing Status</h3>
          <div className="flex gap-2">
            {(
              [
                { value: 'single', label: 'Single' },
                { value: 'mfj', label: 'Married Filing Jointly' },
              ] as { value: FilingStatus; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilingStatus(opt.value)}
                className={`h-9 px-4 rounded-lg border text-xs font-medium transition-colors ${
                  filingStatus === opt.value
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                    : 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--primary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Results */}
      <div className="space-y-5">
        {!hasData ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
            <Calculator className="h-8 w-8 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">
              Enter your gross SE income to see your tax breakdown.
            </p>
          </div>
        ) : (
          <>
            {/* KPI grid */}
            <div className="grid grid-cols-2 gap-3">
              <KPICard
                label="Total Tax Due"
                value={fmtUSD(result.totalTax)}
                color="text-[var(--danger)]"
              />
              <KPICard
                label="Effective Rate"
                value={fmtPct(result.effectiveRate)}
                color="text-[var(--primary)]"
              />
              <KPICard
                label="Net Take-Home"
                value={fmtUSD(result.netTakeHome)}
                color="text-[var(--success)]"
              />
              <KPICard
                label="Monthly Take-Home"
                value={fmtUSD(result.monthlyTakeHome)}
                color="text-[var(--success)]"
              />
            </div>

            {/* SE Tax callout */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Federal Income Tax</span>
                <span className="num text-sm font-semibold text-[var(--text-primary)]">
                  {fmtUSD(result.federalIncomeTax)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  Self-Employment Tax
                  <span
                    title="15.3% covers Social Security (12.4%) + Medicare (2.9%) for self-employed"
                    className="cursor-help"
                  >
                    <Info className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </span>
                </span>
                <span className="num text-sm font-semibold text-[var(--text-primary)]">
                  {fmtUSD(result.totalSETax)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">Total Federal</span>
                <span className="num text-sm font-bold text-[var(--danger)]">
                  {fmtUSD(result.totalTax)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--success)]/8 px-3 py-2">
                <span className="text-xs text-[var(--success)] font-medium">
                  SE Tax Deduction saves you
                </span>
                <span className="num text-xs font-bold text-[var(--success)]">
                  {fmtUSD(result.seTaxDeduction * result.marginalRate)}
                </span>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">
                      Item
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    { label: 'Gross SE Income', value: parseFloat(grossSEIncome) || 0, bold: false, color: '' },
                    { label: 'Business Expenses', value: -totalExpenses, bold: false, color: 'text-[var(--danger)]' },
                    { label: 'Net SE Income', value: result.netSEIncome, bold: true, color: '' },
                    { label: 'SE Tax Deduction', value: -result.seTaxDeduction, bold: false, color: 'text-[var(--success)]' },
                    { label: 'Retirement Contribution', value: -result.retirementContribution, bold: false, color: 'text-[var(--success)]' },
                    { label: 'AGI', value: result.agi, bold: true, color: '' },
                    { label: 'Standard Deduction', value: -result.standardDeduction, bold: false, color: 'text-[var(--success)]' },
                    { label: 'QBI Deduction (20%)', value: -result.qbiDeduction, bold: false, color: 'text-[var(--success)]' },
                    { label: 'Taxable Income', value: result.taxableIncome, bold: true, color: '' },
                    { label: 'Federal Income Tax', value: result.federalIncomeTax, bold: false, color: 'text-[var(--danger)]' },
                    { label: 'Self-Employment Tax', value: result.totalSETax, bold: false, color: 'text-[var(--danger)]' },
                    { label: 'Total Tax', value: result.totalTax, bold: true, color: 'text-[var(--danger)]' },
                    { label: 'Net Take-Home', value: result.netTakeHome, bold: true, color: 'text-[var(--success)]' },
                  ].map((row) => (
                    <tr key={row.label} className={row.bold ? 'bg-[var(--surface-raised)]' : ''}>
                      <td
                        className={`px-4 py-2.5 ${
                          row.bold
                            ? 'font-semibold text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {row.label}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right num ${
                          row.color ||
                          (row.bold ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-primary)]')
                        } ${row.bold ? 'font-semibold' : ''}`}
                      >
                        {row.value < 0 ? '-' : ''}
                        {fmtUSD(row.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Tab: Quarterly Estimates ───────────────────────────────────────────────────

function QuarterlyTab({ quarterlyPayment }: { quarterlyPayment: number }) {
  const hasData = quarterlyPayment > 0;

  const getStatus = (isoDate: string): 'past' | 'soon' | 'upcoming' => {
    const due = new Date(isoDate);
    const diffDays = (due.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'past';
    if (diffDays <= 30) return 'soon';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {!hasData ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col items-center justify-center text-center gap-3">
          <CalendarClock className="h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)]">
            Enter your income in the Calculator tab to see quarterly estimates.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUARTERS.map((q) => {
              const status = getStatus(q.dueISO);
              return (
                <div
                  key={q.q}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{q.q}</p>
                      <p className="text-xs text-[var(--text-muted)]">{q.period}</p>
                    </div>
                    {status === 'past' && (
                      <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]">
                        Past due
                      </span>
                    )}
                    {status === 'soon' && (
                      <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]">
                        Due soon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                    Due {q.dueDate}
                  </div>
                  <p className="num text-2xl font-bold text-[var(--us)]">{fmtUSD(quarterlyPayment)}</p>
                </div>
              );
            })}
          </div>

          {/* Annual summary */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Total Annual Tax</span>
            <span className="num text-lg font-bold text-[var(--danger)]">
              {fmtUSD(quarterlyPayment * 4)}
            </span>
          </div>

          {/* 1040-ES explanation */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Info className="h-4 w-4 text-[var(--us)]" />
              Form 1040-ES &amp; Safe Harbor Rules
            </h3>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                <span className="font-medium text-[var(--text-primary)]">Form 1040-ES</span> is used to
                calculate and pay quarterly estimated taxes. Freelancers and self-employed individuals
                must make these payments if they expect to owe at least $1,000 in federal tax for the year.
              </p>
              <p>
                <span className="font-medium text-[var(--text-primary)]">Safe Harbor Rule:</span> To avoid
                underpayment penalties, pay the lesser of:
              </p>
              <ul className="ml-4 space-y-1 list-disc">
                <li>
                  <strong>90%</strong> of your current year&apos;s tax liability, or
                </li>
                <li>
                  <strong>100%</strong> of your prior year&apos;s tax (110% if prior year AGI exceeded $150,000)
                </li>
              </ul>
              <p className="text-[var(--text-muted)] text-xs">
                Note: These are simplified equal installments. Actual payments may differ based on annualized income method.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Tab: Deductions Optimizer ──────────────────────────────────────────────────

interface DeductionsTabProps {
  homeOffice: string;
  setHomeOffice: (v: string) => void;
  internetPhone: string;
  setInternetPhone: (v: string) => void;
  equipment: string;
  setEquipment: (v: string) => void;
  vehicleExpense: number;
  healthInsurance: string;
  setHealthInsurance: (v: string) => void;
  retirementContribution: number;
  profDev: string;
  setProfDev: (v: string) => void;
  profServices: string;
  setProfServices: (v: string) => void;
  marginalRate: number;
  hasData: boolean;
}

function DeductionsTab({
  homeOffice,
  internetPhone,
  equipment,
  vehicleExpense,
  healthInsurance,
  setHealthInsurance,
  retirementContribution,
  profDev,
  setProfDev,
  profServices,
  setProfServices,
  marginalRate,
  hasData,
}: DeductionsTabProps) {
  const deductions = [
    {
      name: 'Home Office (Form 8829)',
      value: parseFloat(homeOffice) || 0,
      section: 'Deductible if space is used regularly and exclusively for business',
    },
    {
      name: 'Internet & Phone',
      value: parseFloat(internetPhone) || 0,
      section: '100% if business-only; 50–80% if mixed personal/business use',
    },
    {
      name: 'Equipment & Software',
      value: parseFloat(equipment) || 0,
      section: 'Section 179 expensing — full deduction in year purchased',
    },
    {
      name: 'Vehicle Expenses',
      value: vehicleExpense,
      section: 'IRS standard mileage rate: 70¢/mile in 2025',
    },
    {
      name: 'Health Insurance Premium',
      value: parseFloat(healthInsurance) || 0,
      section: '100% deductible above-the-line under IRC §162(l)',
    },
    {
      name: 'Retirement (SEP-IRA / Solo 401k)',
      value: retirementContribution,
      section: 'Reduces AGI dollar-for-dollar',
    },
    {
      name: 'Professional Development',
      value: parseFloat(profDev) || 0,
      section: 'Courses, books, conferences directly related to your business',
    },
    {
      name: 'Professional Services',
      value: parseFloat(profServices) || 0,
      section: 'Accountant and attorney fees for business purposes',
    },
  ];

  const totalDeductions = deductions.reduce((sum, d) => sum + d.value, 0);
  const totalSaved = totalDeductions * marginalRate;

  return (
    <div className="space-y-6">
      {/* Extra inputs */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Zap className="h-4 w-4 text-[var(--warning)]" />
          Additional Deduction Inputs
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Health Insurance Premium ($/yr)
            </label>
            <input
              type="number"
              min="0"
              value={healthInsurance}
              onChange={(e) => setHealthInsurance(e.target.value)}
              placeholder="0"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Professional Development ($/yr)
            </label>
            <input
              type="number"
              min="0"
              value={profDev}
              onChange={(e) => setProfDev(e.target.value)}
              placeholder="0"
              className={INPUT_CLASS}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Professional Services ($/yr)
            </label>
            <input
              type="number"
              min="0"
              value={profServices}
              onChange={(e) => setProfServices(e.target.value)}
              placeholder="0"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Deductions table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">
                Deduction
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--success)]">
                Tax Saved
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] hidden md:table-cell">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {deductions.map((d) => (
              <tr key={d.name} className={d.value === 0 ? 'opacity-50' : ''}>
                <td className="px-4 py-3 text-[var(--text-primary)] font-medium">{d.name}</td>
                <td className="px-4 py-3 text-right num text-[var(--text-primary)]">
                  {d.value > 0 ? fmtUSD(d.value) : '—'}
                </td>
                <td className="px-4 py-3 text-right num text-[var(--success)] font-medium">
                  {d.value > 0 ? fmtUSD(d.value * marginalRate) : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden md:table-cell">
                  {d.section}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border)] bg-[var(--surface-raised)]">
              <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Total</td>
              <td className="px-4 py-3 text-right num font-semibold text-[var(--text-primary)]">
                {fmtUSD(totalDeductions)}
              </td>
              <td className="px-4 py-3 text-right num font-bold text-[var(--success)]">
                {fmtUSD(totalSaved)}
              </td>
              <td className="hidden md:table-cell" />
            </tr>
          </tfoot>
        </table>
      </div>

      {!hasData && (
        <div className="flex items-start gap-2 rounded-lg bg-[var(--warning)]/8 px-4 py-3">
          <Info className="h-4 w-4 text-[var(--warning)] mt-0.5 shrink-0" />
          <p className="text-xs text-[var(--text-secondary)]">
            Enter your gross SE income in the Calculator tab to see actual tax savings at your marginal rate.
          </p>
        </div>
      )}

      {/* Big callout */}
      <div className="rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-5">
        <p className="text-sm font-semibold text-[var(--warning)]">
          If you are missing deductions, you are overpaying.
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Enter all qualifying expenses above. At a {fmtPct(marginalRate || 0.22)} marginal rate, every $1,000
          deduction saves you {fmtUSD((marginalRate || 0.22) * 1000)}.
        </p>
      </div>
    </div>
  );
}

// ── Tab: Scenarios ─────────────────────────────────────────────────────────────

interface ScenariosTabProps {
  baseResult: TaxResult;
  baseGross: number;
  baseExpenses: number;
  baseRetirement: number;
  filingStatus: FilingStatus;
}

function ScenariosTab({
  baseResult,
  baseGross,
  baseExpenses,
  baseRetirement,
  filingStatus,
}: ScenariosTabProps) {
  const [incomeAdj, setIncomeAdj] = useState(0);
  const [extraExpenses, setExtraExpenses] = useState(0);

  const altResult = useMemo(
    () =>
      computeTax({
        grossSEIncome: Math.max(0, baseGross + incomeAdj),
        businessExpenses: Math.max(0, baseExpenses + extraExpenses),
        retirementContribution: baseRetirement,
        filingStatus,
      }),
    [baseGross, baseExpenses, baseRetirement, filingStatus, incomeAdj, extraExpenses]
  );

  const applyPreset = (dIncome: number, dExpenses: number, maxRetirement = false) => {
    setIncomeAdj(dIncome);
    setExtraExpenses(dExpenses);
  };

  const diffTax = altResult.totalTax - baseResult.totalTax;
  const diffTakeHome = altResult.netTakeHome - baseResult.netTakeHome;

  const rows = [
    {
      label: 'Net SE Income',
      base: baseResult.netSEIncome,
      alt: altResult.netSEIncome,
    },
    {
      label: 'Total Tax',
      base: baseResult.totalTax,
      alt: altResult.totalTax,
    },
    {
      label: 'Effective Rate',
      base: baseResult.effectiveRate,
      alt: altResult.effectiveRate,
      isPct: true,
    },
    {
      label: 'Net Take-Home',
      base: baseResult.netTakeHome,
      alt: altResult.netTakeHome,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '+ $10k income', dI: 10000, dE: 0 },
          { label: '+ $20k income', dI: 20000, dE: 0 },
          { label: '+ $5k expenses', dI: 0, dE: 5000 },
          { label: '- $10k income', dI: -10000, dE: 0 },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.dI, p.dE)}
            className="h-8 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setIncomeAdj(0); setExtraExpenses(0); }}
          className="h-8 px-3 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Alternative scenario controls */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--us)]" />
          Alternative Scenario Adjustments
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Income Adjustment
              </label>
              <span className="num text-xs font-semibold text-[var(--text-primary)]">
                {incomeAdj >= 0 ? '+' : ''}
                {fmtUSD(incomeAdj)}
              </span>
            </div>
            <input
              type="range"
              min={-50000}
              max={50000}
              step={5000}
              value={incomeAdj}
              onChange={(e) => setIncomeAdj(Number(e.target.value))}
              className="w-full accent-[var(--us)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>-$50k</span>
              <span>+$50k</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--text-secondary)]">
                Additional Expenses
              </label>
              <span className="num text-xs font-semibold text-[var(--text-primary)]">
                +{fmtUSD(extraExpenses)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={extraExpenses}
              onChange={(e) => setExtraExpenses(Number(e.target.value))}
              className="w-full accent-[var(--us)]"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>$0</span>
              <span>+$50k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">
                Metric
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-secondary)]">
                Base Scenario
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--us)]">
                Alternative
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)]">
                Difference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map((row) => {
              const diff = row.alt - row.base;
              const isPositiveDiff = diff > 0;
              const diffColor =
                row.label === 'Net Take-Home'
                  ? isPositiveDiff
                    ? 'text-[var(--success)]'
                    : 'text-[var(--danger)]'
                  : row.label === 'Total Tax'
                  ? isPositiveDiff
                    ? 'text-[var(--danger)]'
                    : 'text-[var(--success)]'
                  : 'text-[var(--text-muted)]';

              return (
                <tr key={row.label}>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{row.label}</td>
                  <td className="px-4 py-3 text-right num text-[var(--text-primary)]">
                    {row.isPct ? fmtPct(row.base) : fmtUSD(row.base)}
                  </td>
                  <td className="px-4 py-3 text-right num font-medium text-[var(--us)]">
                    {row.isPct ? fmtPct(row.alt) : fmtUSD(row.alt)}
                  </td>
                  <td className={`px-4 py-3 text-right num font-medium ${diffColor}`}>
                    {row.isPct
                      ? (diff >= 0 ? '+' : '') + fmtPct(diff)
                      : (diff >= 0 ? '+' : '-') + fmtUSD(diff)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border)] bg-[var(--surface-raised)]">
              <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Tax Difference</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td
                className={`px-4 py-3 text-right num font-bold ${
                  diffTax > 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'
                }`}
              >
                {diffTax >= 0 ? '+' : '-'}
                {fmtUSD(diffTax)}
              </td>
            </tr>
            <tr className="bg-[var(--surface-raised)]">
              <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">Take-Home Difference</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3" />
              <td
                className={`px-4 py-3 text-right num font-bold ${
                  diffTakeHome >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                }`}
              >
                {diffTakeHome >= 0 ? '+' : '-'}
                {fmtUSD(diffTakeHome)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

const TABS: Tab[] = ['Calculator', 'Quarterly Estimates', 'Deductions Optimizer', 'Scenarios'];

export default function FreelancerCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('Calculator');

  // Income inputs
  const [grossSEIncome, setGrossSEIncome] = useState('');

  // Expense breakdown
  const [homeOffice, setHomeOffice] = useState('0');
  const [internetPhone, setInternetPhone] = useState('0');
  const [equipment, setEquipment] = useState('0');
  const [vehicleExpenseTotal, setVehicleExpenseTotal] = useState('0');
  const [vehicleBusinessPct, setVehicleBusinessPct] = useState('50');
  const [otherExpenses, setOtherExpenses] = useState('0');

  // Retirement
  const [retirementType, setRetirementType] = useState<RetirementType>('none');
  const [retirementContribution, setRetirementContribution] = useState('0');

  // Filing status
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');

  // Deductions optimizer extras
  const [healthInsurance, setHealthInsurance] = useState('0');
  const [profDev, setProfDev] = useState('0');
  const [profServices, setProfServices] = useState('0');

  // Derived values
  const vehicleExpense =
    ((parseFloat(vehicleExpenseTotal) || 0) * (parseFloat(vehicleBusinessPct) || 0)) / 100;

  const totalExpenses =
    (parseFloat(homeOffice) || 0) +
    (parseFloat(internetPhone) || 0) +
    (parseFloat(equipment) || 0) +
    vehicleExpense +
    (parseFloat(otherExpenses) || 0);

  const grossVal = parseFloat(grossSEIncome) || 0;
  const retirementVal = parseFloat(retirementContribution) || 0;

  const sepIRALimit = Math.min(Math.max(0, grossVal - totalExpenses) * 0.25, 69000);

  const result = useMemo(
    () =>
      computeTax({
        grossSEIncome: grossVal,
        businessExpenses: totalExpenses,
        retirementContribution: retirementVal,
        filingStatus,
      }),
    [grossVal, totalExpenses, retirementVal, filingStatus]
  );

  const tabIcons: Record<Tab, React.ReactNode> = {
    Calculator: <Calculator className="h-4 w-4" />,
    'Quarterly Estimates': <CalendarClock className="h-4 w-4" />,
    'Deductions Optimizer': <Zap className="h-4 w-4" />,
    Scenarios: <TrendingUp className="h-4 w-4" />,
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--us)]/10">
              <Briefcase className="h-5 w-5 text-[var(--us)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                US Freelancer Tax Calculator 2025
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                SE Tax · Quarterly Estimates · Deductions Optimizer · Scenarios
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[var(--us)] text-[var(--us)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {tabIcons[tab]}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {activeTab === 'Calculator' && (
          <CalculatorTab
            grossSEIncome={grossSEIncome}
            setGrossSEIncome={setGrossSEIncome}
            homeOffice={homeOffice}
            setHomeOffice={setHomeOffice}
            internetPhone={internetPhone}
            setInternetPhone={setInternetPhone}
            equipment={equipment}
            setEquipment={setEquipment}
            vehicleExpenseTotal={vehicleExpenseTotal}
            setVehicleExpenseTotal={setVehicleExpenseTotal}
            vehicleBusinessPct={vehicleBusinessPct}
            setVehicleBusinessPct={setVehicleBusinessPct}
            otherExpenses={otherExpenses}
            setOtherExpenses={setOtherExpenses}
            retirementType={retirementType}
            setRetirementType={setRetirementType}
            retirementContribution={retirementContribution}
            setRetirementContribution={setRetirementContribution}
            filingStatus={filingStatus}
            setFilingStatus={setFilingStatus}
            result={result}
            totalExpenses={totalExpenses}
            sepIRALimit={sepIRALimit}
          />
        )}

        {activeTab === 'Quarterly Estimates' && (
          <QuarterlyTab quarterlyPayment={result.quarterlyPayment} />
        )}

        {activeTab === 'Deductions Optimizer' && (
          <DeductionsTab
            homeOffice={homeOffice}
            setHomeOffice={setHomeOffice}
            internetPhone={internetPhone}
            setInternetPhone={setInternetPhone}
            equipment={equipment}
            setEquipment={setEquipment}
            vehicleExpense={vehicleExpense}
            healthInsurance={healthInsurance}
            setHealthInsurance={setHealthInsurance}
            retirementContribution={retirementVal}
            profDev={profDev}
            setProfDev={setProfDev}
            profServices={profServices}
            setProfServices={setProfServices}
            marginalRate={result.marginalRate}
            hasData={grossVal > 0}
          />
        )}

        {activeTab === 'Scenarios' && (
          <ScenariosTab
            baseResult={result}
            baseGross={grossVal}
            baseExpenses={totalExpenses}
            baseRetirement={retirementVal}
            filingStatus={filingStatus}
          />
        )}
      </div>
    </div>
  );
}
