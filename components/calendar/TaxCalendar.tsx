'use client';

import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Country = 'IN' | 'US' | 'UK';
type Category =
  | 'filing'
  | 'payment'
  | 'tds'
  | 'gst'
  | 'advance_tax'
  | 'other';

interface TaxDeadline {
  id: string;
  country: Country;
  date: string; // "YYYY-MM-DD" ISO format
  title: string;
  description: string;
  category: Category;
  penaltyIfMissed?: string;
  isRecurring?: boolean;
}

// ─── Deadline Data ────────────────────────────────────────────────────────────

const RAW_DEADLINES: Omit<TaxDeadline, 'id'>[] = [
  // India — Advance Tax
  {
    country: 'IN',
    date: '2026-06-15',
    title: 'Advance Tax — Q1 Instalment',
    description: '15% of estimated annual tax liability due for FY 2025-26',
    category: 'advance_tax',
    penaltyIfMissed: 'Interest u/s 234C @ 1% per month on shortfall',
  },
  {
    country: 'IN',
    date: '2026-09-15',
    title: 'Advance Tax — Q2 Instalment',
    description: '45% of estimated annual tax due (cumulative)',
    category: 'advance_tax',
    penaltyIfMissed: 'Interest u/s 234C @ 1% per month',
  },
  {
    country: 'IN',
    date: '2026-12-15',
    title: 'Advance Tax — Q3 Instalment',
    description: '75% of estimated annual tax due (cumulative)',
    category: 'advance_tax',
    penaltyIfMissed: 'Interest u/s 234C @ 1% per month',
  },
  {
    country: 'IN',
    date: '2027-03-15',
    title: 'Advance Tax — Q4 Instalment',
    description: '100% of estimated annual tax due',
    category: 'advance_tax',
    penaltyIfMissed: 'Interest u/s 234C @ 1% per month',
  },
  // India — ITR Filing
  {
    country: 'IN',
    date: '2026-07-31',
    title: 'ITR Filing Deadline (Non-Audit)',
    description:
      'Last date to file Income Tax Return for FY 2025-26 without audit',
    category: 'filing',
    penaltyIfMissed:
      '₹5,000 penalty u/s 234F; loss carry-forward forfeited; ₹1,000 if income ≤ ₹5L',
  },
  {
    country: 'IN',
    date: '2026-10-31',
    title: 'ITR Filing Deadline (Audit Cases)',
    description:
      'Companies, firms, and individuals requiring tax audit',
    category: 'filing',
    penaltyIfMissed: '₹5,000 penalty u/s 234F',
  },
  {
    country: 'IN',
    date: '2026-11-30',
    title: 'ITR Filing — Transfer Pricing Cases',
    description:
      'Entities with international/specified domestic transactions',
    category: 'filing',
  },
  {
    country: 'IN',
    date: '2026-12-31',
    title: 'Belated/Revised ITR Deadline',
    description:
      'Last date to file belated return or revise original return for AY 2026-27',
    category: 'filing',
    penaltyIfMissed:
      'Cannot file after this date; prosecution possible for large defaults',
  },
  // India — TDS
  {
    country: 'IN',
    date: '2026-04-30',
    title: 'TDS Return — Q4 FY 2025-26 (24Q/26Q)',
    description:
      'Quarterly TDS return for salary and non-salary deductions',
    category: 'tds',
    isRecurring: true,
  },
  {
    country: 'IN',
    date: '2026-07-31',
    title: 'TDS Return — Q1 FY 2026-27',
    description: 'April–June quarter TDS return',
    category: 'tds',
    isRecurring: true,
  },
  {
    country: 'IN',
    date: '2026-10-31',
    title: 'TDS Return — Q2 FY 2026-27',
    description: 'July–September quarter TDS return',
    category: 'tds',
    isRecurring: true,
  },
  // India — GST
  {
    country: 'IN',
    date: '2026-04-11',
    title: 'GSTR-1 — March 2026',
    description:
      'Monthly outward supplies return for regular taxpayers',
    category: 'gst',
    isRecurring: true,
  },
  {
    country: 'IN',
    date: '2026-04-20',
    title: 'GSTR-3B — March 2026',
    description: 'Monthly summary GST return and tax payment',
    category: 'gst',
    isRecurring: true,
  },
  // US — Tax Year 2025
  {
    country: 'US',
    date: '2026-01-15',
    title: 'Q4 2025 Estimated Tax Payment',
    description:
      '4th quarter 2025 estimated tax payment (Form 1040-ES)',
    category: 'payment',
    penaltyIfMissed: 'Underpayment penalty Form 2210',
  },
  {
    country: 'US',
    date: '2026-04-15',
    title: 'Federal Tax Return Due (Form 1040)',
    description:
      'File 2025 federal income tax return or request extension (Form 4868)',
    category: 'filing',
    penaltyIfMissed:
      '5% per month penalty on unpaid tax + interest; failure-to-file penalty',
  },
  {
    country: 'US',
    date: '2026-04-15',
    title: 'Q1 2026 Estimated Tax Payment',
    description: '1st quarter 2026 estimated tax payment',
    category: 'payment',
  },
  {
    country: 'US',
    date: '2026-04-15',
    title: 'IRA Contribution Deadline (2025)',
    description:
      'Last day to contribute to Traditional or Roth IRA for tax year 2025',
    category: 'other',
  },
  {
    country: 'US',
    date: '2026-06-16',
    title: 'Q2 2026 Estimated Tax Payment',
    description: '2nd quarter 2026 estimated tax payment',
    category: 'payment',
  },
  {
    country: 'US',
    date: '2026-06-16',
    title: 'Extended Deadline — US Citizens Abroad',
    description:
      'Automatic 2-month extension for US citizens/residents outside the country',
    category: 'filing',
  },
  {
    country: 'US',
    date: '2026-09-15',
    title: 'Q3 2026 Estimated Tax Payment',
    description: '3rd quarter 2026 estimated tax payment',
    category: 'payment',
  },
  {
    country: 'US',
    date: '2026-10-15',
    title: 'Extended Return Deadline',
    description:
      'Deadline for extended 2025 federal returns (Form 4868 must have been filed by April 15)',
    category: 'filing',
    penaltyIfMissed: 'Late filing penalties apply',
  },
  {
    country: 'US',
    date: '2026-12-31',
    title: '401k/403b Contribution Deadline',
    description:
      'Last day to make 2026 401k/403b contributions via payroll deduction',
    category: 'other',
  },
  // UK — Tax Year 2025-26
  {
    country: 'UK',
    date: '2026-04-05',
    title: 'End of Tax Year 2025-26',
    description:
      'UK tax year ends. Last day for 2025-26 ISA contributions, pension contributions, and CGT planning.',
    category: 'other',
  },
  {
    country: 'UK',
    date: '2026-04-06',
    title: 'Start of Tax Year 2026-27',
    description:
      'New personal allowance, new ISA limits, and new NI thresholds take effect',
    category: 'other',
  },
  {
    country: 'UK',
    date: '2026-07-31',
    title: 'Second Payment on Account',
    description:
      'Second advance payment on account for 2025-26 Self Assessment tax bill',
    category: 'payment',
    penaltyIfMissed: 'Interest accrues from due date',
  },
  {
    country: 'UK',
    date: '2026-10-05',
    title: 'Register for Self Assessment',
    description:
      'Deadline to register for Self Assessment if you need to file for the first time for 2025-26',
    category: 'filing',
    penaltyIfMissed: 'Penalty for late registration',
  },
  {
    country: 'UK',
    date: '2026-10-31',
    title: 'Paper Self Assessment Return',
    description:
      'Deadline for filing paper Self Assessment tax return for 2025-26',
    category: 'filing',
    penaltyIfMissed: '£100 immediate penalty',
  },
  {
    country: 'UK',
    date: '2027-01-31',
    title: 'Online Self Assessment Return + Tax Payment',
    description:
      'File 2025-26 Self Assessment online AND pay all tax owed including balancing payment',
    category: 'filing',
    penaltyIfMissed:
      '£100 immediate + daily £10 penalties after 3 months; 5% surcharge after 30 days',
  },
  {
    country: 'UK',
    date: '2027-01-31',
    title: 'First Payment on Account (2026-27)',
    description: 'First advance payment on account for the 2026-27 tax year',
    category: 'payment',
  },
  {
    country: 'UK',
    date: '2027-01-31',
    title: 'CGT on Property — 60-Day Rule',
    description:
      'Capital gains on UK residential property must be reported and paid within 60 days of completion',
    category: 'other',
  },
];

const DEADLINES: TaxDeadline[] = RAW_DEADLINES.map((d, i) => ({
  ...d,
  id: `dl-${i}`,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date('2026-04-05');

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysRemaining(dateStr: string): number {
  const target = parseDate(dateStr);
  const todayMs = Date.UTC(
    TODAY.getFullYear(),
    TODAY.getMonth(),
    TODAY.getDate(),
  );
  const targetMs = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  return Math.round((targetMs - todayMs) / 86_400_000);
}

function formatDateFull(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatMonthYear(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function formatDay(dateStr: string): string {
  const d = parseDate(dateStr);
  return String(d.getDate()).padStart(2, '0');
}

function formatMonthAbbr(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
}

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

const COUNTRY_LABEL: Record<Country, string> = { IN: 'India', US: 'USA', UK: 'UK' };
const CATEGORY_LABEL: Record<Category, string> = {
  filing: 'Filing',
  payment: 'Payment',
  tds: 'TDS',
  gst: 'GST',
  advance_tax: 'Advance Tax',
  other: 'Other',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountryBadge({ country }: { country: Country }) {
  const colors: Record<Country, string> = {
    IN: 'bg-[var(--india)]/15 text-[var(--india)]',
    US: 'bg-[var(--us)]/15 text-[var(--us)]',
    UK: 'bg-[var(--uk)]/15 text-[var(--uk)]',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-semibold tracking-wide ${colors[country]}`}
      style={{ borderRadius: '3px' }}
    >
      {COUNTRY_LABEL[country]}
    </span>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  const colors: Record<Category, string> = {
    filing: 'bg-[var(--primary)]/10 text-[var(--primary)]',
    payment: 'bg-[var(--success)]/10 text-[var(--success)]',
    tds: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    gst: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
    advance_tax: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    other: 'bg-[var(--surface-raised)] text-[var(--text-secondary)]',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium ${colors[category]}`}
      style={{ borderRadius: '3px' }}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}

function DaysRemainingPill({ days }: { days: number }) {
  if (days < 0) {
    return (
      <span className="text-xs text-[var(--text-muted)] font-medium">Past</span>
    );
  }
  if (days === 0) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[var(--danger)]/10 text-[var(--danger)]"
        style={{ borderRadius: '3px' }}
      >
        <AlertTriangle size={11} />
        Today — URGENT
      </span>
    );
  }
  if (days < 7) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[var(--danger)]/10 text-[var(--danger)]"
        style={{ borderRadius: '3px' }}
      >
        <AlertTriangle size={11} />
        <span className="num">{days}</span> days — URGENT
      </span>
    );
  }
  if (days <= 30) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[var(--warning)]/10 text-[var(--warning)]"
        style={{ borderRadius: '3px' }}
      >
        <Clock size={11} />
        <span className="num">{days}</span> days
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[var(--success)]/10 text-[var(--success)]"
      style={{ borderRadius: '3px' }}
    >
      <CheckCircle2 size={11} />
      <span className="num">{days}</span> days
    </span>
  );
}

// ─── KPI Summary Bar ──────────────────────────────────────────────────────────

function SummaryBar({ deadlines }: { deadlines: TaxDeadline[] }) {
  const upcoming30 = deadlines.filter((d) => {
    const days = daysRemaining(d.date);
    return days >= 0 && days <= 30;
  }).length;

  const thisQuarterEnd = new Date(TODAY);
  const qMonth = TODAY.getMonth();
  const qEnd = new Date(
    TODAY.getFullYear(),
    qMonth + (3 - (qMonth % 3)),
    0,
  );
  const thisQuarter = deadlines.filter((d) => {
    const dt = parseDate(d.date);
    return dt >= TODAY && dt <= qEnd;
  }).length;

  const yearStart = new Date(TODAY.getFullYear(), 0, 1);
  const past = deadlines.filter((d) => {
    const dt = parseDate(d.date);
    return dt < TODAY && dt >= yearStart;
  }).length;

  const kpis = [
    {
      label: 'Next 30 Days',
      value: upcoming30,
      icon: <Bell size={16} className="text-[var(--warning)]" />,
      color: 'text-[var(--warning)]',
    },
    {
      label: 'This Quarter',
      value: thisQuarter,
      icon: <Clock size={16} className="text-[var(--primary)]" />,
      color: 'text-[var(--primary)]',
    },
    {
      label: 'Past (This Year)',
      value: past,
      icon: <CheckCircle2 size={16} className="text-[var(--text-muted)]" />,
      color: 'text-[var(--text-muted)]',
    },
    {
      label: 'Total Tracked',
      value: DEADLINES.length,
      icon: <Calendar size={16} className="text-[var(--success)]" />,
      color: 'text-[var(--success)]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="bg-[var(--surface)] border border-[var(--border)] p-4"
          style={{ borderRadius: '6px' }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              {k.label}
            </span>
            {k.icon}
          </div>
          <p className={`num text-2xl font-bold ${k.color}`}>{k.value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Timeline View ────────────────────────────────────────────────────────────

function TimelineView({ deadlines }: { deadlines: TaxDeadline[] }) {
  // Group by month key
  const grouped = useMemo(() => {
    const map = new Map<string, TaxDeadline[]>();
    const sorted = [...deadlines].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    for (const d of sorted) {
      const key = monthKey(d.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries());
  }, [deadlines]);

  if (grouped.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)]">
        No deadlines match the selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map(([mk, items]) => (
        <section key={mk}>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <Calendar size={15} className="text-[var(--text-muted)]" />
            {formatMonthYear(mk + '-01')}
          </h2>
          <div className="space-y-2">
            {items.map((d) => {
              const days = daysRemaining(d.date);
              const isPast = days < 0;
              return (
                <div
                  key={d.id}
                  className={`bg-[var(--surface)] border border-[var(--border)] p-4 flex gap-4 ${isPast ? 'opacity-60' : ''}`}
                  style={{ borderRadius: '6px' }}
                >
                  {/* Date badge */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <p className="num text-2xl font-bold text-[var(--text-primary)] leading-none">
                      {formatDay(d.date)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
                      {formatMonthAbbr(d.date)}
                    </p>
                  </div>

                  {/* Vertical divider */}
                  <div className="w-px bg-[var(--border)] flex-shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <CountryBadge country={d.country} />
                      <CategoryBadge category={d.category} />
                      <DaysRemainingPill days={days} />
                      {d.isRecurring && (
                        <span
                          className="text-xs text-[var(--text-muted)] bg-[var(--surface-raised)] px-2 py-0.5"
                          style={{ borderRadius: '3px' }}
                        >
                          Recurring
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[var(--text-primary)] text-sm leading-snug">
                      {d.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                      {d.description}
                    </p>
                    {d.penaltyIfMissed && (
                      <p className="mt-2 text-xs text-[var(--warning)] flex items-start gap-1.5">
                        <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                        <span>{d.penaltyIfMissed}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ─── Table View ───────────────────────────────────────────────────────────────

type SortKey = 'date' | 'country' | 'category';

function TableView({ deadlines }: { deadlines: TaxDeadline[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...deadlines].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortKey === 'country') cmp = a.country.localeCompare(b.country);
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      return sortAsc ? cmp : -cmp;
    });
  }, [deadlines, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function SortHeader({
    col,
    label,
  }: {
    col: SortKey;
    label: string;
  }) {
    return (
      <th
        className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide cursor-pointer select-none hover:text-[var(--text-primary)] whitespace-nowrap"
        onClick={() => handleSort(col)}
      >
        {label}
        {sortKey === col && (
          <span className="ml-1 text-[var(--primary)]">
            {sortAsc ? '↑' : '↓'}
          </span>
        )}
      </th>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)]">
        No deadlines match the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
            <SortHeader col="date" label="Date" />
            <SortHeader col="country" label="Country" />
            <SortHeader col="category" label="Category" />
            <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Deadline
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide whitespace-nowrap">
              Days Left
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              Penalty if Missed
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d, idx) => {
            const days = daysRemaining(d.date);
            const isPast = days < 0;
            return (
              <tr
                key={d.id}
                className={`border-b border-[var(--border)] ${
                  idx % 2 === 0
                    ? 'bg-[var(--surface)]'
                    : 'bg-[var(--surface-raised)]/40'
                } ${isPast ? 'opacity-55' : ''}`}
              >
                <td className="px-3 py-3 text-[var(--text-secondary)] text-xs whitespace-nowrap num">
                  {formatDateFull(d.date)}
                </td>
                <td className="px-3 py-3">
                  <CountryBadge country={d.country} />
                </td>
                <td className="px-3 py-3">
                  <CategoryBadge category={d.category} />
                </td>
                <td className="px-3 py-3">
                  <p className="font-semibold text-[var(--text-primary)] leading-snug text-xs">
                    {d.title}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5 leading-relaxed">
                    {d.description}
                  </p>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <DaysRemainingPill days={days} />
                </td>
                <td className="px-3 py-3 text-xs text-[var(--warning)] max-w-xs">
                  {d.penaltyIfMissed ?? (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ALL_COUNTRIES: Country[] = ['IN', 'US', 'UK'];
const ALL_CATEGORIES: Category[] = [
  'filing',
  'payment',
  'tds',
  'gst',
  'advance_tax',
  'other',
];

type ViewMode = 'timeline' | 'table';

export default function TaxCalendar() {
  const [selectedCountries, setSelectedCountries] = useState<Set<Country>>(
    new Set(ALL_COUNTRIES),
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    'all',
  );
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  function toggleCountry(c: Country) {
    setSelectedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(c)) {
        if (next.size > 1) next.delete(c); // keep at least one
      } else {
        next.add(c);
      }
      return next;
    });
  }

  const filtered = useMemo(() => {
    return DEADLINES.filter((d) => {
      if (!selectedCountries.has(d.country)) return false;
      if (selectedCategory !== 'all' && d.category !== selectedCategory)
        return false;
      return true;
    });
  }, [selectedCountries, selectedCategory]);

  const countryButtonStyle = (country: Country): string => {
    const active = selectedCountries.has(country);
    const colorMap: Record<Country, string> = {
      IN: active
        ? 'bg-[var(--india)] text-white border-[var(--india)]'
        : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--india)] hover:text-[var(--india)]',
      US: active
        ? 'bg-[var(--us)] text-white border-[var(--us)]'
        : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--us)] hover:text-[var(--us)]',
      UK: active
        ? 'bg-[var(--uk)] text-white border-[var(--uk)]'
        : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--uk)] hover:text-[var(--uk)]',
    };
    return colorMap[country];
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pb-16">
      {/* Page header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start gap-3">
            <Calendar size={28} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Tax Calendar 2025-26
              </h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                India FY 2025-26, US Tax Year 2025, UK 2025-26 — all key
                deadlines in one place. Reference date:{' '}
                <span className="num font-medium text-[var(--text-primary)]">
                  5 April 2026
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Summary KPI bar */}
        <SummaryBar deadlines={filtered} />

        {/* Filter + View toggle bar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 mb-6 flex flex-wrap items-center gap-4"
          style={{ borderRadius: '6px' }}
        >
          {/* Country toggles */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mr-1">
              Country
            </span>
            {ALL_COUNTRIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleCountry(c)}
                className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${countryButtonStyle(c)}`}
                style={{ borderRadius: '4px' }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mr-1">
              Category
            </span>
            {(['all', ...ALL_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
                style={{ borderRadius: '4px' }}
              >
                {cat === 'all'
                  ? 'All'
                  : CATEGORY_LABEL[cat as Category]}
              </button>
            ))}
          </div>

          {/* View toggle — pushed to right */}
          <div className="ml-auto flex items-center gap-1 bg-[var(--surface-raised)] p-1"
            style={{ borderRadius: '4px' }}
          >
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              style={{ borderRadius: '3px' }}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              style={{ borderRadius: '3px' }}
            >
              Table
            </button>
          </div>
        </div>

        {/* Views */}
        {viewMode === 'timeline' ? (
          <TimelineView deadlines={filtered} />
        ) : (
          <TableView deadlines={filtered} />
        )}
      </div>
    </main>
  );
}
