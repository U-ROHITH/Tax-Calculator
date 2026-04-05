'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type VisaType = 'F1' | 'J1' | 'H1B' | 'other' | null;
type YearsInUS = '<1' | '1-2' | '2-4' | '5+' | null;
type IncomeType = 'none' | 'scholarship' | 'tara' | 'opt' | 'investment' | null;
type TabId = 'filing' | 'spt' | 'estimate';

const TABS: { id: TabId; label: string }[] = [
  { id: 'filing', label: 'Do I Need to File?' },
  { id: 'spt', label: 'Residency Status' },
  { id: 'estimate', label: 'Tax Estimate' },
];

// ── Federal tax brackets 2025 (single) ────────────────────────────────────────

const FEDERAL_BRACKETS = [
  { min: 0, max: 11925, rate: 0.1 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

function calcFederalTax(taxableIncome: number): number {
  let tax = 0;
  for (const b of FEDERAL_BRACKETS) {
    if (taxableIncome <= b.min) break;
    const slice = Math.min(taxableIncome, b.max) - b.min;
    tax += slice * b.rate;
  }
  return tax;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
      {text}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — Do I Need to File?
// ─────────────────────────────────────────────────────────────────────────────

function FilingTab() {
  const [visa, setVisa] = useState<VisaType>(null);
  const [years, setYears] = useState<YearsInUS>(null);
  const [income, setIncome] = useState<IncomeType>(null);

  const visaOptions: { id: VisaType; label: string; desc: string }[] = [
    { id: 'F1', label: 'F-1', desc: 'Student' },
    { id: 'J1', label: 'J-1', desc: 'Exchange Visitor' },
    { id: 'H1B', label: 'H-1B', desc: 'Work' },
    { id: 'other', label: 'Other', desc: 'Visa type not listed' },
  ];

  const yearsOptions: { id: YearsInUS; label: string }[] = [
    { id: '<1', label: 'Less than 1 year' },
    { id: '1-2', label: '1 – 2 years' },
    { id: '2-4', label: '2 – 4 years' },
    { id: '5+', label: '5 or more years' },
  ];

  const incomeOptions: { id: IncomeType; label: string; desc: string }[] = [
    { id: 'none', label: 'No income', desc: 'No US-source income at all' },
    { id: 'scholarship', label: 'Scholarship / Stipend', desc: 'Fellowship or grant income' },
    { id: 'tara', label: 'TA / RA Income', desc: 'Teaching or research assistantship' },
    { id: 'opt', label: 'Internship / OPT', desc: 'On-campus, CPT, or OPT wages' },
    { id: 'investment', label: 'Investment Income', desc: 'Dividends, interest, capital gains' },
  ];

  type ResultStatus = 'nra' | 'resident' | 'check' | 'none';
  type Result = {
    status: ResultStatus;
    headline: string;
    form: string;
    fica: string;
    deadline: string;
    notes: string[];
  };

  let result: Result | null = null;

  const showStep3 =
    ((visa === 'F1' || visa === 'J1') && years !== null) ||
    visa === 'H1B' ||
    visa === 'other';

  if (visa === 'H1B' || visa === 'other') {
    if (income !== null) {
      result = {
        status: 'check',
        headline: 'Standard resident alien rules likely apply.',
        form: 'Form 1040 (if resident alien) or consult an immigration tax advisor.',
        fica: 'FICA taxes apply (Social Security 6.2% + Medicare 1.45%).',
        deadline: 'April 15, 2026',
        notes: [
          'H-1B holders are generally treated as resident aliens for tax purposes.',
          'If you changed status during the year, you may have a dual-status return.',
        ],
      };
    }
  } else if ((visa === 'F1' || visa === 'J1') && years !== null && income !== null) {
    const f1NRA = visa === 'F1' && years !== '5+';
    const j1NRA = visa === 'J1' && (years === '<1' || years === '1-2');
    const isNRA = f1NRA || j1NRA;

    if (isNRA && income === 'none') {
      result = {
        status: 'none',
        headline: 'No income tax return required — but Form 8843 is mandatory.',
        form: 'Form 8843 (Statement for Exempt Individuals). No 1040-NR required when income is zero.',
        fica: 'FICA exempt — no Social Security or Medicare tax applies.',
        deadline:
          'Form 8843 must be filed by June 15, 2026 (April 15 if present inside the US on the deadline).',
        notes: [
          'Form 8843 establishes your exempt status and prevents your US days from counting toward the Substantial Presence Test.',
          'Even with no income, failure to file 8843 can create residency problems in future years.',
        ],
      };
    } else if (isNRA && income !== 'none') {
      result = {
        status: 'nra',
        headline: 'Non-Resident Alien — file Form 1040-NR.',
        form: 'Form 1040-NR (U.S. Nonresident Alien Income Tax Return). Also file Form 8843.',
        fica: 'FICA exempt — you save Social Security (6.2%) and Medicare (1.45%) taxes on all wages.',
        deadline:
          'April 15, 2026 if you received wages. June 15 if no US wages (October 15 with extension via Form 4868).',
        notes: [
          'NRAs generally cannot claim the standard deduction — exceptions exist via tax treaties.',
          'Indian students may claim the standard deduction under Article 21(2) of the India-US DTAA.',
          'Scholarship income above tuition and required fees is taxable; universities withhold 14% by default.',
          ...(income === 'investment'
            ? ['Investment income for NRAs is generally taxed at a flat 30% (or lower treaty rate).']
            : []),
        ],
      };
    } else {
      // Resident alien
      result = {
        status: 'resident',
        headline:
          visa === 'F1'
            ? 'F-1 students present 5+ years may be Resident Aliens under the Substantial Presence Test.'
            : 'J-1 students present 2+ years may become Resident Aliens.',
        form: 'Form 1040 (U.S. Individual Income Tax Return) if SPT is met.',
        fica: 'FICA taxes apply once classified as a Resident Alien (SS 6.2% + Medicare 1.45%).',
        deadline: 'April 15, 2026 (October 15 with extension).',
        notes: [
          'Use the Residency Status tab to calculate your Substantial Presence Test score.',
          'If SPT is NOT met (rare after 5 years for F-1), you may still file 1040-NR.',
          'You can claim the standard deduction ($15,000 for single filers, 2025) as a resident alien.',
        ],
      };
    }
  }

  const statusStyles: Record<ResultStatus, string> = {
    nra: 'border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]',
    resident: 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
    check: 'border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]',
    none: 'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]',
  };

  return (
    <div className="space-y-6">
      {/* Step 1 */}
      <div>
        <SectionLabel text="Step 1 — Visa Type" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {visaOptions.map((opt) => (
            <button
              key={String(opt.id)}
              onClick={() => {
                setVisa(opt.id);
                setYears(null);
                setIncome(null);
              }}
              className={[
                'rounded-xl border p-3 text-left transition-colors duration-100',
                visa === opt.id
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50',
              ].join(' ')}
            >
              <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — F1 / J1 only */}
      {(visa === 'F1' || visa === 'J1') && (
        <div>
          <SectionLabel text="Step 2 — Time in the US on This Visa" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {yearsOptions.map((opt) => (
              <button
                key={String(opt.id)}
                onClick={() => {
                  setYears(opt.id);
                  setIncome(null);
                }}
                className={[
                  'rounded-xl border p-3 text-left transition-colors duration-100',
                  years === opt.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50',
                ].join(' ')}
              >
                <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {showStep3 && (
        <div>
          <SectionLabel text="Step 3 — US Income This Year" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {incomeOptions.map((opt) => (
              <button
                key={String(opt.id)}
                onClick={() => setIncome(opt.id)}
                className={[
                  'rounded-xl border p-3 text-left transition-colors duration-100',
                  income === opt.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50',
                ].join(' ')}
              >
                <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
          <div
            className={[
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold',
              statusStyles[result.status],
            ].join(' ')}
          >
            {result.status === 'nra' && <AlertTriangle size={13} />}
            {result.status === 'resident' && <CheckCircle2 size={13} />}
            {result.status === 'check' && <HelpCircle size={13} />}
            {result.status === 'none' && <CheckCircle2 size={13} />}
            {result.status === 'nra' && 'Non-Resident Alien'}
            {result.status === 'resident' && 'Likely Resident Alien'}
            {result.status === 'check' && 'Check Your Specific Status'}
            {result.status === 'none' && 'No Tax Return Required'}
          </div>

          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {result.headline}
          </h3>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-[var(--surface-raised)] p-3">
              <p className="text-xs font-medium text-[var(--text-muted)]">Form to File</p>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{result.form}</p>
            </div>
            <div className="rounded-lg bg-[var(--surface-raised)] p-3">
              <p className="text-xs font-medium text-[var(--text-muted)]">FICA Status</p>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{result.fica}</p>
            </div>
            <div className="rounded-lg bg-[var(--surface-raised)] p-3">
              <p className="text-xs font-medium text-[var(--text-muted)]">Filing Deadline</p>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{result.deadline}</p>
            </div>
          </div>

          {result.notes.length > 0 && (
            <ul className="space-y-1.5">
              {result.notes.map((note, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <HelpCircle size={14} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                  {note}
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-[var(--border)] pt-3">
            <a
              href="https://www.irs.gov/individuals/tax-withholding-estimator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              <FileText size={14} />
              IRS Tax Withholding Estimator — verify your specific situation
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — Substantial Presence Test
// ─────────────────────────────────────────────────────────────────────────────

function SPTTab() {
  const [currentDays, setCurrentDays] = useState('');
  const [priorDays, setPriorDays] = useState('');
  const [twoYearsBackDays, setTwoYearsBackDays] = useState('');
  const [visaForSPT, setVisaForSPT] = useState<'F1' | 'J1' | 'other'>('F1');

  const cy = Math.min(365, Math.max(0, parseInt(currentDays) || 0));
  const py = Math.min(365, Math.max(0, parseInt(priorDays) || 0));
  const tyb = Math.min(365, Math.max(0, parseInt(twoYearsBackDays) || 0));

  const weightedPrior = py / 3;
  const weightedTYB = tyb / 6;
  const spt = cy + weightedPrior + weightedTYB;
  const isSPTMet = spt >= 183 && cy >= 31;

  const hasInput = currentDays !== '' || priorDays !== '' || twoYearsBackDays !== '';
  const progressPct = Math.min(100, (spt / 183) * 100);

  return (
    <div className="space-y-6">
      {/* Visa selector */}
      <div>
        <SectionLabel text="Visa Type" />
        <div className="flex gap-3">
          {(['F1', 'J1', 'other'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVisaForSPT(v)}
              className={[
                'rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-100',
                visaForSPT === v
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50',
              ].join(' ')}
            >
              {v === 'other' ? 'Other' : v}
            </button>
          ))}
        </div>
      </div>

      {/* Exempt-year note */}
      {(visaForSPT === 'F1' || visaForSPT === 'J1') && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
          <div className="flex gap-2">
            <HelpCircle size={16} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              {visaForSPT === 'F1' ? (
                <>
                  <span className="font-semibold text-[var(--text-primary)]">F-1 Exempt Years: </span>
                  F-1 students are exempt from counting days toward the Substantial Presence Test for their first{' '}
                  <span className="font-semibold">5 calendar years</span> of US presence. Days as a student do not
                  count during exempt years. Enter only days during non-exempt years below.
                </>
              ) : (
                <>
                  <span className="font-semibold text-[var(--text-primary)]">J-1 Exempt Years: </span>
                  J-1 exchange visitors are exempt for{' '}
                  <span className="font-semibold">2 out of every 6 calendar years</span>. Enter only days during
                  non-exempt years below.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Day inputs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            { label: '2025 (current year)', value: currentDays, setter: setCurrentDays },
            { label: '2024 (prior year)', value: priorDays, setter: setPriorDays },
            {
              label: '2023 (two years back)',
              value: twoYearsBackDays,
              setter: setTwoYearsBackDays,
            },
          ] as { label: string; value: string; setter: (v: string) => void }[]
        ).map(({ label, value, setter }) => (
          <div key={label}>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              Days in US — {label}
            </label>
            <input
              type="number"
              min="0"
              max="365"
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder="0"
              className="num w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      {hasInput && (
        <div className="space-y-4">
          {/* SPT score card */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--text-muted)]">SPT Score</p>
                <p
                  className={`num mt-1 text-4xl font-bold ${
                    isSPTMet ? 'text-[var(--danger)]' : 'text-[var(--success)]'
                  }`}
                >
                  {spt.toFixed(1)}
                </p>
                <p className="num mt-0.5 text-xs text-[var(--text-muted)]">Threshold: 183 days</p>
              </div>
              <div
                className={[
                  'rounded-xl border px-4 py-2 text-sm font-semibold',
                  isSPTMet
                    ? 'border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]'
                    : 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
                ].join(' ')}
              >
                {isSPTMet ? 'Resident Alien' : 'Non-Resident Alien'}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-lg bg-[var(--surface-raised)]">
                <div
                  className={`h-full transition-all duration-300 ${
                    isSPTMet ? 'bg-[var(--danger)]' : 'bg-[var(--primary)]'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-[var(--text-muted)]">
                <span className="num">0</span>
                <span className="num">183 (threshold)</span>
                <span className="num">365</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {isSPTMet
                ? 'SPT is met. You are a Resident Alien for tax purposes — file Form 1040. Standard deduction and all resident benefits apply.'
                : `SPT is not met${
                    cy < 31 ? ' (fewer than 31 days in current year)' : ' (score below 183)'
                  }. You are a Non-Resident Alien — file Form 1040-NR.`}
            </p>
          </div>

          {/* Breakdown table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">
                    Year
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)]">
                    Days Present
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)]">
                    Fraction Used
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)]">
                    Weighted Days
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--text-primary)]">2025 (current)</td>
                  <td className="num px-4 py-3 text-right text-[var(--text-primary)]">{cy}</td>
                  <td className="px-4 py-3 text-right text-[var(--text-muted)]">1 / 1</td>
                  <td className="num px-4 py-3 text-right font-medium text-[var(--text-primary)]">
                    {cy.toFixed(1)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--text-primary)]">2024 (prior)</td>
                  <td className="num px-4 py-3 text-right text-[var(--text-primary)]">{py}</td>
                  <td className="px-4 py-3 text-right text-[var(--text-muted)]">1 / 3</td>
                  <td className="num px-4 py-3 text-right font-medium text-[var(--text-primary)]">
                    {weightedPrior.toFixed(1)}
                  </td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-[var(--text-primary)]">2023 (two years back)</td>
                  <td className="num px-4 py-3 text-right text-[var(--text-primary)]">{tyb}</td>
                  <td className="px-4 py-3 text-right text-[var(--text-muted)]">1 / 6</td>
                  <td className="num px-4 py-3 text-right font-medium text-[var(--text-primary)]">
                    {weightedTYB.toFixed(1)}
                  </td>
                </tr>
                <tr className="bg-[var(--surface-raised)]">
                  <td
                    className="px-4 py-3 font-semibold text-[var(--text-primary)]"
                    colSpan={3}
                  >
                    SPT Total
                  </td>
                  <td className="num px-4 py-3 text-right font-bold text-[var(--text-primary)]">
                    {spt.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {cy < 31 && (
            <div className="flex items-start gap-2 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-4 text-sm text-[var(--warning)]">
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <span>
                The SPT requires at least 31 days of presence in the current year. Even if your
                weighted total reaches 183, the SPT cannot be met without 31 current-year days.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — Tax Estimate
// ─────────────────────────────────────────────────────────────────────────────

type IncomeCategory = 'tara' | 'scholarship' | 'opt' | 'investment';

const INCOME_CATEGORIES: { id: IncomeCategory; label: string; desc: string }[] = [
  { id: 'tara', label: 'TA / RA Salary', desc: 'Teaching or research assistantship wages' },
  {
    id: 'scholarship',
    label: 'Taxable Scholarship',
    desc: 'Amount above tuition and required fees',
  },
  { id: 'opt', label: 'OPT / Internship Income', desc: 'On-campus or CPT/OPT wages' },
  { id: 'investment', label: 'Investment Income', desc: 'Dividends, interest (NRA flat rate)' },
];

function TaxEstimateTab() {
  const [incomeType, setIncomeType] = useState<IncomeCategory>('tara');
  const [grossIncomeStr, setGrossIncomeStr] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState<'IN' | 'other'>('other');

  const grossIncome = Math.max(0, parseFloat(grossIncomeStr) || 0);
  const isIndian = countryOfOrigin === 'IN';

  // Standard deduction: NRAs cannot claim except via India-US DTAA Article 21(2)
  const standardDeduction = isIndian ? 15000 : 0;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  // Investment income for NRAs: flat 30%
  const federalTax =
    incomeType === 'investment' ? taxableIncome * 0.3 : calcFederalTax(taxableIncome);

  // FICA savings vs US citizen: 7.65% of gross wages
  const ficaSavings = incomeType === 'investment' ? 0 : grossIncome * 0.0765;

  const netTakeHome = grossIncome - federalTax;
  const effectiveRate = grossIncome > 0 ? (federalTax / grossIncome) * 100 : 0;

  const hasInput = grossIncomeStr !== '' && grossIncome > 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Income category */}
        <div>
          <SectionLabel text="Income Category" />
          <div className="space-y-2">
            {INCOME_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setIncomeType(cat.id)}
                className={[
                  'w-full rounded-xl border p-3 text-left transition-colors duration-100',
                  incomeType === cat.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50',
                ].join(' ')}
              >
                <p className="text-sm font-semibold text-[var(--text-primary)]">{cat.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right column inputs */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              Annual Gross Income (USD)
            </label>
            <input
              type="number"
              min="0"
              value={grossIncomeStr}
              onChange={(e) => setGrossIncomeStr(e.target.value)}
              placeholder="e.g. 25000"
              className="num w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
            {incomeType === 'scholarship' && (
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Enter only the taxable portion above tuition and required fees. Amounts covering
                tuition are not taxable.
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
              Home Country (for treaty benefits)
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setCountryOfOrigin('IN')}
                className={[
                  'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-100',
                  countryOfOrigin === 'IN'
                    ? 'border-[var(--india)] bg-[var(--india)]/5 text-[var(--india)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--india)]/50',
                ].join(' ')}
              >
                India
              </button>
              <button
                onClick={() => setCountryOfOrigin('other')}
                className={[
                  'flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors duration-100',
                  countryOfOrigin === 'other'
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50',
                ].join(' ')}
              >
                Other Country
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3 text-xs text-[var(--text-secondary)] space-y-0.5">
            <p className="font-medium text-[var(--text-primary)]">Filing status: Non-Resident Alien (NRA)</p>
            <p>FICA: Exempt (F-1 / J-1 NRA — first 5 years)</p>
            <p>
              Standard deduction:{' '}
              {isIndian ? '$15,000 via India-US DTAA Article 21(2)' : 'Not available for NRA'}
            </p>
            {incomeType === 'investment' && (
              <p className="text-[var(--warning)]">
                Investment income taxed at flat 30% NRA rate (or lower treaty rate). FICA does not apply.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* India DTAA amber box */}
      {isIndian && (
        <div className="rounded-xl border border-[var(--india)]/30 bg-[var(--india)]/5 p-4">
          <div className="flex items-start gap-2">
            <Globe size={15} className="mt-0.5 shrink-0 text-[var(--india)]" />
            <div className="text-sm">
              <p className="font-semibold text-[var(--india)]">
                India-US Tax Treaty — Standard Deduction Advantage
              </p>
              <p className="mt-1 text-[var(--text-secondary)]">
                Indian students on F-1 visas can claim the standard deduction ($15,000 in 2025) under
                Article 21(2) of the India-US DTAA — a significant advantage over other international
                students who must use itemized deductions (rarely beneficial). Article 22 also exempts
                scholarship income for 5 years. Visit IRS Publication 901 for details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {hasInput ? (
        <div className="space-y-4">
          {/* Summary cards */}
          <div
            className={`grid gap-3 ${
              isIndian && standardDeduction > 0
                ? 'sm:grid-cols-2 lg:grid-cols-4'
                : 'sm:grid-cols-3'
            }`}
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-medium text-[var(--text-muted)]">Gross Income</p>
              <p className="num mt-1 text-xl font-bold text-[var(--text-primary)]">
                {fmt(grossIncome)}
              </p>
            </div>

            {isIndian && standardDeduction > 0 && (
              <div className="rounded-xl border border-[var(--india)]/30 bg-[var(--india)]/5 p-4">
                <p className="text-xs font-medium text-[var(--india)]">Standard Deduction (Treaty)</p>
                <p className="num mt-1 text-xl font-bold text-[var(--india)]">
                  - {fmt(standardDeduction)}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-medium text-[var(--text-muted)]">Federal Tax</p>
              <p className="num mt-1 text-xl font-bold text-[var(--danger)]">{fmt(federalTax)}</p>
              <p className="num mt-0.5 text-xs text-[var(--text-muted)]">
                {effectiveRate.toFixed(1)}% effective rate
              </p>
            </div>

            {ficaSavings > 0 && (
              <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/5 p-4">
                <p className="text-xs font-medium text-[var(--success)]">FICA Savings vs US Citizen</p>
                <p className="num mt-1 text-xl font-bold text-[var(--success)]">
                  + {fmt(ficaSavings)}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">SS 6.2% + Medicare 1.45%</p>
              </div>
            )}
          </div>

          {/* Net take-home */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[var(--text-muted)]">
                  Estimated Net Take-Home
                </p>
                <p className="num mt-1 text-3xl font-bold text-[var(--text-primary)]">
                  {fmt(netTakeHome)}
                </p>
              </div>
              {ficaSavings > 0 && (
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">
                    vs US citizen earning same income
                  </p>
                  <p className="num mt-1 text-sm font-semibold text-[var(--success)]">
                    You save {fmt(ficaSavings)} in FICA taxes
                  </p>
                </div>
              )}
            </div>

            {/* Breakdown bar */}
            <div className="mt-4">
              <div className="flex h-3 w-full overflow-hidden rounded-lg">
                <div
                  className="h-full bg-[var(--danger)] transition-all duration-300"
                  style={{ width: `${Math.max(0, (federalTax / grossIncome) * 100)}%` }}
                />
                <div
                  className="h-full bg-[var(--success)]/60 transition-all duration-300"
                  style={{ width: `${Math.max(0, (netTakeHome / grossIncome) * 100)}%` }}
                />
              </div>
              <div className="mt-1.5 flex gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-[var(--danger)]" />
                  Federal tax
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-[var(--success)]/60" />
                  Take-home
                </span>
              </div>
            </div>
          </div>

          {/* State tax note */}
          <div className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-sm text-[var(--text-secondary)]">
            <HelpCircle size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
            <span>
              <span className="font-medium text-[var(--text-primary)]">
                State income tax not included.
              </span>{' '}
              Most states follow federal NRA rules and tax US-source income. Nine states have no
              income tax (TX, FL, WA, NV, SD, WY, AK, NH, TN). Check your state revenue department
              for NRA-specific rules.
            </span>
          </div>

          {/* India DTAA info card */}
          {isIndian && (
            <div className="rounded-xl border border-[var(--border)] border-l-4 border-l-[var(--india)] bg-[var(--surface)] p-4">
              <div className="flex items-start gap-2">
                <FileText size={15} className="mt-0.5 shrink-0 text-[var(--india)]" />
                <div className="text-sm">
                  <p className="font-semibold text-[var(--text-primary)]">
                    India-US Tax Treaty — Key Articles for Students
                  </p>
                  <ul className="mt-2 space-y-1 text-[var(--text-secondary)]">
                    <li>
                      <span className="font-medium">Article 21(2):</span> Indian students may claim
                      the standard deduction ($15,000 for 2025) on Form 1040-NR.
                    </li>
                    <li>
                      <span className="font-medium">Article 22:</span> Scholarship and fellowship
                      income is exempt from US tax for 5 years from date of arrival.
                    </li>
                    <li>
                      <span className="font-medium">Article 25:</span> Students are exempt from FICA
                      taxes while maintaining Non-Resident Alien status.
                    </li>
                  </ul>
                  <a
                    href="https://www.irs.gov/publications/p901"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[var(--primary)] hover:underline"
                  >
                    <Globe size={13} />
                    IRS Publication 901 — US Tax Treaties
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] py-12 text-center">
          <GraduationCap size={32} className="text-[var(--text-muted)]" />
          <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">
            Enter your income above to see the estimate
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Federal tax, FICA savings, and net take-home
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentTaxMode() {
  const [activeTab, setActiveTab] = useState<TabId>('filing');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--us)]/10">
          <GraduationCap size={22} className="text-[var(--us)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            International Student Tax Guide
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            F-1 and J-1 visa holders in the US — filing obligations, residency status, FICA
            exemption, and treaty benefits.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border)] gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'shrink-0 px-4 py-2.5 text-sm transition-colors duration-100 -mb-px',
              activeTab === tab.id
                ? 'border-b-2 border-[var(--primary)] text-[var(--text-primary)] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] border-b-2 border-transparent',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'filing' && <FilingTab />}
        {activeTab === 'spt' && <SPTTab />}
        {activeTab === 'estimate' && <TaxEstimateTab />}
      </div>
    </div>
  );
}
