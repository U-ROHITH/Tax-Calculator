'use client';

import { useState, useCallback } from 'react';
import {
  Briefcase,
  Home,
  Building2,
  BarChart2,
  TrendingUp,
  MapPin,
  Landmark,
  DollarSign,
  Globe,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  Square,
  AlertTriangle,
  Info,
  Printer,
  FileText,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type IncomeSourceId =
  | 'salary'
  | 'house_self'
  | 'house_let'
  | 'business'
  | 'cg_equity'
  | 'cg_property'
  | 'fd_interest'
  | 'dividends'
  | 'foreign';

interface IncomeSource {
  id: IncomeSourceId;
  label: string;
  description: string;
  Icon: React.ElementType;
}

interface DocItem {
  id: string;
  label: string;
  hint?: string;
}

interface DocGroup {
  groupId: string;
  title: string;
  docs: DocItem[];
}

// ── Income sources ─────────────────────────────────────────────────────────────

const INCOME_SOURCES: IncomeSource[] = [
  {
    id: 'salary',
    label: 'Salary / Employment',
    description: 'Income from employer — TDS, Form 16, perquisites',
    Icon: Briefcase,
  },
  {
    id: 'house_self',
    label: 'House Property — Self Occupied',
    description: 'Home loan interest deduction on your primary residence',
    Icon: Home,
  },
  {
    id: 'house_let',
    label: 'House Property — Let Out',
    description: 'Rental income from property you have let out',
    Icon: Building2,
  },
  {
    id: 'business',
    label: 'Business Income',
    description: 'Proprietary or partnership business / freelance / profession',
    Icon: BarChart2,
  },
  {
    id: 'cg_equity',
    label: 'Capital Gains — Equity / MF',
    description: 'Gains from stocks, mutual funds, ETFs',
    Icon: TrendingUp,
  },
  {
    id: 'cg_property',
    label: 'Capital Gains — Property',
    description: 'Gains from sale of residential or commercial property',
    Icon: MapPin,
  },
  {
    id: 'fd_interest',
    label: 'Fixed Deposits / Interest',
    description: 'Interest income from FDs, NSC, savings accounts',
    Icon: Landmark,
  },
  {
    id: 'dividends',
    label: 'Dividends',
    description: 'Dividend income from shares or mutual funds',
    Icon: DollarSign,
  },
  {
    id: 'foreign',
    label: 'Foreign Income / NRI',
    description: 'Income from overseas employment, investments, or remittances',
    Icon: Globe,
  },
];

// ── Document map ───────────────────────────────────────────────────────────────

const UNIVERSAL_DOCS: DocItem[] = [
  { id: 'u1', label: 'PAN Card', hint: 'Required for all tax filings' },
  { id: 'u2', label: 'Aadhaar Card', hint: 'Mandatory linkage with PAN' },
  {
    id: 'u3',
    label: 'Bank account details for refund (IFSC + account number)',
    hint: 'Pre-validate your bank account on the IT portal',
  },
  {
    id: 'u4',
    label: 'Previous year ITR copy',
    hint: 'Required to claim carry-forward losses',
  },
  {
    id: 'u5',
    label: 'Form 26AS',
    hint: 'Download from IT portal — tracks all TDS and advance tax paid',
  },
  {
    id: 'u6',
    label: 'AIS — Annual Information Statement',
    hint: 'Download from IT portal — comprehensive view of all financial transactions',
  },
];

const INCOME_DOCS: Record<IncomeSourceId, DocItem[]> = {
  salary: [
    {
      id: 's1',
      label: 'Form 16 Part A',
      hint: 'TDS from employer — download from TRACES via your employer',
    },
    {
      id: 's2',
      label: 'Form 16 Part B',
      hint: 'Salary breakup provided directly by your employer',
    },
    {
      id: 's3',
      label: 'Form 12BA',
      hint: 'Required only if perquisites (car, accommodation, ESOPs, etc.) were received',
    },
    {
      id: 's4',
      label: 'Monthly payslips (all 12 months)',
      hint: 'Cross-check gross salary with Form 16 figures',
    },
    {
      id: 's5',
      label: 'Investment proof submissions',
      hint: 'Proofs submitted to employer for TDS computation (80C, 80D, etc.)',
    },
    {
      id: 's6',
      label: 'Rent receipts for HRA claim',
      hint: 'Required if you claimed HRA exemption — include landlord PAN if rent exceeds Rs 1L/yr',
    },
    {
      id: 's7',
      label: 'LTA bills / travel tickets',
      hint: 'Required if Leave Travel Allowance was claimed',
    },
  ],
  house_self: [
    {
      id: 'hs1',
      label: 'Home loan interest certificate (annual)',
      hint: 'Download from your bank portal — shows interest paid during FY',
    },
    {
      id: 'hs2',
      label: 'Provisional certificate',
      hint: 'Required if loan was taken during this financial year',
    },
    {
      id: 'hs3',
      label: 'Municipal tax payment receipt',
      hint: 'Property tax paid to municipal corporation',
    },
    {
      id: 'hs4',
      label: 'Property registration documents',
      hint: 'Required for first-time purchase deductions under Section 80EEA',
    },
  ],
  house_let: [
    {
      id: 'hl1',
      label: 'Rent agreement / lease deed',
      hint: 'Registered rental agreement preferred',
    },
    {
      id: 'hl2',
      label: 'Rent receipts issued to tenant',
      hint: 'Monthly rent receipts signed and dated',
    },
    {
      id: 'hl3',
      label: 'Home loan interest certificate',
      hint: 'Full deduction allowed for let-out property (no cap)',
    },
    {
      id: 'hl4',
      label: 'Municipal tax paid receipts',
      hint: 'Deductible from rental income',
    },
    {
      id: 'hl5',
      label: 'TDS certificates from tenant (Form 16A)',
      hint: 'Required if tenant deducted TDS on rent — download from TRACES',
    },
  ],
  business: [
    {
      id: 'b1',
      label: 'Profit and Loss account',
      hint: 'CA-prepared or self-prepared — covers full financial year',
    },
    { id: 'b2', label: 'Balance sheet', hint: 'As of 31st March of the financial year' },
    {
      id: 'b3',
      label: 'GST returns (GSTR-1 and GSTR-3B — all months)',
      hint: 'Download from GST portal — reconcile with books',
    },
    {
      id: 'b4',
      label: 'Bank statements (all business accounts, full year)',
      hint: 'All accounts used for business transactions',
    },
    {
      id: 'b5',
      label: 'Purchase invoices and expense bills',
      hint: 'Support all expense claims in P&L',
    },
    {
      id: 'b6',
      label: 'Asset purchase receipts',
      hint: 'For claiming depreciation under Schedule IV',
    },
    {
      id: 'b7',
      label: 'Tax Audit Report (Form 3CB-3CD) from CA',
      hint: 'Mandatory if turnover exceeds Rs 1 Cr (trading) or Rs 50L (profession)',
    },
  ],
  cg_equity: [
    {
      id: 'ce1',
      label: 'Consolidated Account Statement (CAS)',
      hint: 'Download from CAMS or KFintech — covers all MF holdings',
    },
    {
      id: 'ce2',
      label: 'Broker capital gains report',
      hint: 'Annual P&L statement from Zerodha, Groww, Upstox, etc.',
    },
    {
      id: 'ce3',
      label: 'ELSS / tax-saving MF proofs',
      hint: 'For claiming 80C deduction on ELSS investments',
    },
    {
      id: 'ce4',
      label: 'STT payment confirmation',
      hint: 'Required to avail preferential capital gains tax rates (10% LTCG / 15% STCG)',
    },
  ],
  cg_property: [
    { id: 'cp1', label: 'Sale deed (registered)', hint: 'Registered sale deed from sub-registrar office' },
    {
      id: 'cp2',
      label: 'Original purchase deed',
      hint: 'To establish cost of acquisition',
    },
    {
      id: 'cp3',
      label: 'Stamp duty receipt (sale and purchase)',
      hint: 'Part of cost of acquisition / transfer expenses',
    },
    {
      id: 'cp4',
      label: 'Brokerage and transfer fees receipts',
      hint: 'Deductible as cost of transfer',
    },
    {
      id: 'cp5',
      label: 'Home loan foreclosure statement',
      hint: 'Required if a loan was outstanding on the sold property',
    },
    {
      id: 'cp6',
      label: 'Cost Inflation Index (CII) table',
      hint: 'App provides this — CII is used to index purchase cost for LTCG',
    },
  ],
  fd_interest: [
    {
      id: 'fi1',
      label: 'Form 16A from bank',
      hint: 'TDS certificate — download from your bank portal or TRACES',
    },
    {
      id: 'fi2',
      label: 'FD maturity and renewal receipts',
      hint: 'For all FDs that matured or renewed during the year',
    },
    {
      id: 'fi3',
      label: 'Interest certificate from bank (annual summary)',
      hint: 'Shows total interest credited across all accounts and FDs',
    },
    {
      id: 'fi4',
      label: 'Post office interest certificate',
      hint: 'Required if you hold NSC, KVP, SCSS, or Post Office FDs',
    },
  ],
  dividends: [
    {
      id: 'd1',
      label: 'Dividend income statement from broker (annual)',
      hint: 'Download from Zerodha, Groww, or CDSL/NSDL portal',
    },
    {
      id: 'd2',
      label: 'Form 26AS cross-check',
      hint: 'All dividends are reported by companies — verify amounts match',
    },
    {
      id: 'd3',
      label: 'Note: Dividends are fully taxable since FY 2020-21',
      hint: 'No exemption under Section 10(34) — report under Income from Other Sources',
    },
  ],
  foreign: [
    {
      id: 'fo1',
      label: 'Foreign bank account statements',
      hint: 'All overseas accounts — mandatory Schedule FA disclosure',
    },
    {
      id: 'fo2',
      label: 'Form 67 (for foreign tax credit)',
      hint: 'File Form 67 before filing ITR to claim DTAA relief',
    },
    {
      id: 'fo3',
      label: 'DTAA details for country of residence',
      hint: 'Double Tax Avoidance Agreement between India and your country',
    },
    {
      id: 'fo4',
      label: 'FEMA declaration',
      hint: 'Required for certain remittances and foreign asset disclosures',
    },
    {
      id: 'fo5',
      label: 'PE10 or equivalent from foreign employer',
      hint: 'Proof of tax paid abroad — required for foreign tax credit',
    },
  ],
};

// ── AIS table rows ─────────────────────────────────────────────────────────────

const AIS_ROWS = [
  {
    type: 'Salary TDS',
    reportedBy: 'Your employer',
    action: 'Matches Form 16 — verify same figures',
  },
  {
    type: 'Bank FD interest',
    reportedBy: 'Banks',
    action: 'Often missed — check all banks where you hold FDs',
  },
  {
    type: 'Dividend income',
    reportedBy: 'Companies',
    action: 'Often missed — add to Income from Other Sources',
  },
  {
    type: 'Property sale / purchase',
    reportedBy: 'Sub-Registrar',
    action: 'If you sold property, capital gains are tracked — report CG schedule',
  },
  {
    type: 'Mutual fund redemption',
    reportedBy: 'AMCs / RTAs',
    action: 'Capital gains must be reported — use CAS statement',
  },
  {
    type: 'High-value cash transactions',
    reportedBy: 'Banks',
    action: 'Over Rs 10L cash deposits — must be explained in response to AIS',
  },
  {
    type: 'Foreign remittances',
    reportedBy: 'Banks (SWIFT)',
    action: 'LRS transactions tracked — ensure Schedule FA is filed',
  },
  {
    type: 'Stock / shares purchase',
    reportedBy: 'Depositories (CDSL/NSDL)',
    action: 'Large purchases tracked — reconcile with capital gains',
  },
];

// ── ITR forms ──────────────────────────────────────────────────────────────────

const ITR_FORMS = [
  {
    form: 'ITR-1 (Sahaj)',
    who: 'Salaried (1 house property, other sources) — total income up to Rs 50L',
    forIndividual: true,
  },
  {
    form: 'ITR-2',
    who: 'Salaried with capital gains, multiple properties, or foreign income',
    forIndividual: true,
  },
  {
    form: 'ITR-3',
    who: 'Business or profession income (non-presumptive) — detailed books required',
    forIndividual: true,
  },
  {
    form: 'ITR-4 (Sugam)',
    who: 'Presumptive business income under 44AD / 44ADA — total income up to Rs 50L',
    forIndividual: true,
  },
  {
    form: 'ITR-5',
    who: 'Partnership firms, LLPs, AOP, BOI',
    forIndividual: false,
  },
  {
    form: 'ITR-6',
    who: 'Companies (other than those claiming exemption under Section 11)',
    forIndividual: false,
  },
  {
    form: 'ITR-7',
    who: 'Trusts, political parties, research associations, charities under Section 139(4A-4D)',
    forIndividual: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildDocGroups(selected: IncomeSourceId[]): DocGroup[] {
  const groups: DocGroup[] = [
    {
      groupId: 'universal',
      title: 'Universal — required for every ITR',
      docs: UNIVERSAL_DOCS,
    },
  ];
  for (const id of selected) {
    const source = INCOME_SOURCES.find((s) => s.id === id)!;
    groups.push({
      groupId: id,
      title: source.label,
      docs: INCOME_DOCS[id],
    });
  }
  return groups;
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ['Income Sources', 'Document Checklist', 'AIS / 26AS Guide'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, idx) => {
        const step = idx + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center gap-2 min-w-0">
            <div
              className={[
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold border',
                done
                  ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                  : active
                  ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--surface)]'
                  : 'border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface)]',
              ].join(' ')}
            >
              {done ? <CheckSquare className="h-3.5 w-3.5" /> : step}
            </div>
            <span
              className={[
                'text-sm font-medium hidden sm:block',
                active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
              ].join(' ')}
            >
              {label}
            </span>
            {idx < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: Income source selector ─────────────────────────────────────────────

function Step1({
  selected,
  onToggle,
  onNext,
}: {
  selected: Set<IncomeSourceId>;
  onToggle: (id: IncomeSourceId) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
        Select your income sources
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Select all that apply for this financial year. The checklist is generated based on your
        selection.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {INCOME_SOURCES.map(({ id, label, description, Icon }) => {
          const isSelected = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className={[
                'text-left p-4 rounded-xl border transition-colors duration-100',
                'bg-[var(--surface)] hover:bg-[var(--surface-raised)]',
                isSelected
                  ? 'border-[var(--primary)]'
                  : 'border-[var(--border)]',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-5 w-5 mb-2',
                  isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]',
                ].join(' ')}
              />
              <p
                className={[
                  'text-sm font-medium leading-tight',
                  isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]',
                ].join(' ')}
              >
                {label}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-snug">{description}</p>
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={selected.size === 0}
        className={[
          'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors',
          selected.size === 0
            ? 'bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed'
            : 'bg-[var(--primary)] text-white hover:opacity-90',
        ].join(' ')}
      >
        Generate Checklist
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Step 2: Document checklist ──────────────────────────────────────────────────

function Step2({
  groups,
  checked,
  onToggleDoc,
  onMarkAll,
  onBack,
  onNext,
}: {
  groups: DocGroup[];
  checked: Set<string>;
  onToggleDoc: (id: string) => void;
  onMarkAll: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const allDocIds = groups.flatMap((g) => g.docs.map((d) => d.id));
  const total = allDocIds.length;
  const collected = allDocIds.filter((id) => checked.has(id)).length;
  const pct = total === 0 ? 0 : Math.round((collected / total) * 100);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your document checklist</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            Tick each document as you collect it.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onMarkAll}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            Mark all as collected
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Download / Print
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-secondary)]">Documents collected</span>
          <span className="font-semibold text-[var(--text-primary)] num">
            {collected} / {total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1.5">{pct}% complete</p>
      </div>

      {/* Groups */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.groupId}>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 pb-2 border-b border-[var(--border)]">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.docs.map((doc) => {
                const isChecked = checked.has(doc.id);
                return (
                  <button
                    key={doc.id}
                    onClick={() => onToggleDoc(doc.id)}
                    className="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--surface-raised)] transition-colors"
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 mt-0.5 shrink-0 text-[var(--success)]" />
                    ) : (
                      <Square className="h-4 w-4 mt-0.5 shrink-0 text-[var(--text-muted)]" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={[
                          'text-sm',
                          isChecked
                            ? 'line-through text-[var(--text-muted)]'
                            : 'text-[var(--text-primary)]',
                        ].join(' ')}
                      >
                        {doc.label}
                      </p>
                      {doc.hint && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{doc.hint}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          AIS / 26AS Guide
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Step 3: AIS / 26AS Guide ────────────────────────────────────────────────────

function Step3({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
        AIS / 26AS Cross-Check Guide
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        The Income Tax department cross-checks your return against both Form 26AS and AIS before
        processing. Mismatches trigger notices automatically.
      </p>

      {/* AIS vs 26AS explanation */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Form 26AS</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The original TDS/TCS credit statement. Shows all tax deducted from your income by
            employers, banks, and others. Also shows advance tax and self-assessment tax paid.
            Available on the IT portal since 2003.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-[var(--india)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              AIS — Annual Information Statement
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Introduced in 2021, AIS is far more comprehensive than 26AS. It includes interest income,
            dividends, property transactions, mutual fund redemptions, foreign remittances, and
            high-value cash transactions — reported by banks, registrars, AMCs, and depositories.
          </p>
        </div>
      </div>

      {/* AIS transactions table */}
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        What appears in AIS automatically — do not miss these
      </h3>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Transaction Type
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide hidden sm:table-cell">
                Reported By
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Action Required
              </th>
            </tr>
          </thead>
          <tbody>
            {AIS_ROWS.map((row, idx) => (
              <tr
                key={row.type}
                className={[
                  'border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)] transition-colors',
                  idx % 2 === 1 ? 'bg-[var(--surface-raised)]/40' : 'bg-[var(--surface)]',
                ].join(' ')}
              >
                <td className="px-4 py-3 text-[var(--text-primary)] font-medium text-xs">
                  {row.type}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] text-xs hidden sm:table-cell">
                  {row.reportedBy}
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mismatch warnings */}
      <div className="space-y-3 mb-8">
        {[
          'If AIS shows interest income you did not report, you will receive a Section 143(1) notice with a demand for tax and interest.',
          'If AIS shows a property sale, the IT department expects the Capital Gains schedule in your ITR — even if no tax is due.',
          'Check AIS at least 30 days before filing — mismatches are easier to explain proactively than in response to a notice.',
        ].map((msg) => (
          <div
            key={msg}
            className="flex items-start gap-3 p-3 rounded-lg border bg-[var(--warning)]/10 border-[var(--warning)]/30"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[var(--warning)]" />
            <p className="text-sm text-[var(--text-primary)]">{msg}</p>
          </div>
        ))}
      </div>

      {/* ITR form guide */}
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Which ITR form should you file?
      </h3>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide w-36">
                Form
              </th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Who Should File
              </th>
            </tr>
          </thead>
          <tbody>
            {ITR_FORMS.map((row, idx) => (
              <tr
                key={row.form}
                className={[
                  'border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)] transition-colors',
                  idx % 2 === 1 ? 'bg-[var(--surface-raised)]/40' : 'bg-[var(--surface)]',
                ].join(' ')}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {row.form}
                    </span>
                    {row.forIndividual && (
                      <span className="inline-block w-fit text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                        For individuals
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">{row.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Checklist
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DocumentChecklist() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<Set<IncomeSourceId>>(new Set());
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleSource = useCallback((id: IncomeSourceId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleDoc = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const groups = buildDocGroups(Array.from(selected));

  const markAll = useCallback(() => {
    const allIds = groups.flatMap((g) => g.docs.map((d) => d.id));
    setChecked(new Set(allIds));
  }, [groups]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Tax Document Checklist
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Smart document checklist based on your income sources, plus AIS / 26AS cross-check
            guidance. India FY 2025-26.
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          {step === 1 && (
            <Step1
              selected={selected}
              onToggle={toggleSource}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              groups={groups}
              checked={checked}
              onToggleDoc={toggleDoc}
              onMarkAll={markAll}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && <Step3 onBack={() => setStep(2)} />}
        </div>
      </div>
    </main>
  );
}
