import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Check,
  ArrowRight,
  Calculator,
  Globe,
  BarChart2,
  ArrowUpDown,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Bot,
  FileWarning,
  Zap,
  RefreshCw,
  CheckSquare,
  Calendar,
  Receipt,
  Building,
  Upload,
} from 'lucide-react';
import { articles } from '@/content/blog/articles';

export const metadata: Metadata = {
  title: 'TaxCalc Global — The Tax Platform That Prepares You Like a CA',
  description:
    '20+ calculators for India, US, and UK. AI-powered answers, document checklist, notice response drafts. Know your tax before you walk into any advisor\'s office.',
};

interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Calculator,
    title: 'India Tax Calculator',
    description: 'Old/new regime, all income heads, 80C-80U, advance tax schedule',
    href: '/in',
  },
  {
    icon: Globe,
    title: 'US Tax Calculator',
    description: 'Form 1040, 15 states, AMT, EITC, QBI deduction, LTCG rates',
    href: '/us',
  },
  {
    icon: BarChart2,
    title: 'UK Tax Calculator',
    description: 'Scotland/E&W bands, PA taper trap, CGT, Class 4 NI',
    href: '/uk',
  },
  {
    icon: ArrowUpDown,
    title: 'Compare Countries',
    description: 'India vs US vs UK effective rate, take-home, marginal rate',
    href: '/compare',
  },
  {
    icon: TrendingUp,
    title: 'Crypto Tax',
    description: 'India 30% flat, US STCG/LTCG, UK CGT. Up to 10 trades.',
    href: '/crypto',
  },
  {
    icon: Briefcase,
    title: 'Freelancer SE Tax',
    description: 'SE tax, quarterly estimates, deductions optimizer, scenarios',
    href: '/freelancer',
  },
  {
    icon: GraduationCap,
    title: 'Student / F1 Mode',
    description: 'SPT test, 1040-NR guide, India DTAA treaty benefits',
    href: '/student',
  },
  {
    icon: Bot,
    title: 'AI Tax Assistant',
    description: 'Ask any tax question. Cites actual sections. India/US/UK.',
    href: '/assistant',
    badge: 'AI',
  },
  {
    icon: FileWarning,
    title: 'Notice Response',
    description: 'Describe your IT notice. Get a draft reply letter.',
    href: '/notice',
    badge: 'AI',
  },
  {
    icon: Zap,
    title: 'Tax Planning Tools',
    description: 'Salary optimizer, LTCG timing, NPS calculator, HUF splitting',
    href: '/plan',
  },
  {
    icon: RefreshCw,
    title: 'Loss Carry-Forward',
    description: 'Track BF losses across 8 years. See exact tax saved.',
    href: '/carryforward',
  },
  {
    icon: CheckSquare,
    title: 'Document Checklist',
    description: 'Know exactly what to collect before filing. AIS guide.',
    href: '/checklist',
  },
  {
    icon: Calendar,
    title: 'Tax Calendar',
    description: 'Every deadline for IN/US/UK with countdown and penalty info',
    href: '/calendar',
  },
  {
    icon: Receipt,
    title: 'GST Calculator',
    description: 'CGST/SGST/IGST, reverse charge, composition scheme guide',
    href: '/gst',
  },
  {
    icon: Building,
    title: 'TDS Calculator',
    description: 'All 12 sections, PAN impact, threshold reference table',
    href: '/tds',
  },
  {
    icon: Upload,
    title: 'Form 16 Upload',
    description: 'Upload PDF — auto-extract salary, TDS, deductions',
    href: '/upload',
  },
];

const STATS = [
  { value: '20+', label: 'Tools' },
  { value: '3', label: 'Countries' },
  { value: 'AI-Powered', label: 'Assistance' },
  { value: '169', label: 'Tests' },
];

interface DifferentiatorItem {
  title: string;
  description: string;
}

const DIFFERENTIATORS: DifferentiatorItem[] = [
  {
    title: 'Formula Accuracy',
    description:
      'Every Indian tax rule coded: 87A rebate, marginal relief, CII indexation, 44AD/44ADA presumptive, advance tax schedule, ITR form recommendation.',
  },
  {
    title: 'AI + Engine Combined',
    description:
      'Formulas handle what\'s computable. AI handles what isn\'t — legal interpretation, notice drafts, what-if planning.',
  },
  {
    title: '"Know Before You Go"',
    description:
      'Prepares you to walk into any CA, CPA, or tax advisor fully informed. The app doesn\'t replace your advisor — it makes the meeting 10x more productive.',
  },
];

interface CountryCard {
  code: string;
  href: string;
  name: string;
  subtitle: string;
  accentVar: string;
  borderClass: string;
  features: string[];
}

const COUNTRY_CARDS: CountryCard[] = [
  {
    code: 'IN',
    href: '/in',
    name: 'India',
    subtitle: 'FY 2025-26',
    accentVar: 'var(--india)',
    borderClass: 'border-l-[var(--india)]',
    features: [
      'Old & New Regime with 87A rebate',
      'All Chapter VI-A deductions (80C–80U)',
      'HRA, NPS, advance tax schedule',
    ],
  },
  {
    code: 'US',
    href: '/us',
    name: 'United States',
    subtitle: 'TY 2025',
    accentVar: 'var(--us)',
    borderClass: 'border-l-[var(--us)]',
    features: [
      '7 federal brackets + 15 states',
      'AMT, EITC, QBI, LTCG special rates',
      'Freelancer SE tax + quarterly estimates',
    ],
  },
  {
    code: 'UK',
    href: '/uk',
    name: 'United Kingdom',
    subtitle: 'TY 2025-26',
    accentVar: 'var(--uk)',
    borderClass: 'border-l-[var(--uk)]',
    features: [
      'Scotland & E&W bands, PA taper',
      'CGT and Class 4 National Insurance',
      'Student loan Plans 1, 2, 4, 5',
    ],
  },
];

// Get 3 latest articles sorted by date descending
const BLOG_PREVIEW = [...articles]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

const COUNTRY_LABEL: Record<string, string> = {
  IN: 'India',
  US: 'United States',
  UK: 'United Kingdom',
  ALL: 'All Countries',
};

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[var(--surface)] py-20 sm:py-28">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 grid-pattern opacity-50"
          aria-hidden="true"
        />
        {/* Fade mask at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--surface)] to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Eyebrow */}
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
            INDIA &nbsp;&middot;&nbsp; UNITED STATES &nbsp;&middot;&nbsp; UNITED KINGDOM
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            The Tax Platform That{' '}
            <span className="text-[var(--primary)]">Prepares You Like a CA</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg leading-relaxed">
            20+ calculators. AI-powered answers. Document checklist. Notice response drafts.
            Know your tax before you walk into any advisor&apos;s office.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/in"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              Start Calculating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-raised)]"
            >
              <Bot className="h-4 w-4 text-[var(--primary)]" />
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 divide-x divide-[var(--border)] sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-5 px-4 text-center">
                <dt className="num text-xl font-bold text-[var(--text-primary)] tabular-nums">
                  {value}
                </dt>
                <dd className="mt-0.5 text-xs text-[var(--text-muted)] uppercase tracking-wide">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Everything in One Place ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Everything in One Place
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Every tool you need from first calculation to filing day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all block no-underline"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-[var(--surface-raised)] group-hover:bg-[var(--primary)]/10 transition-colors">
                    <Icon className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                        {card.title}
                      </h3>
                      {card.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── What Sets Us Apart ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              What sets us apart
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {DIFFERENTIATORS.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
              >
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Country Quick-Start ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Country quick-start
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Each calculator uses the latest official slabs and rates.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {COUNTRY_CARDS.map((card) => (
            <div
              key={card.code}
              className={`flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] border-l-4 ${card.borderClass} p-6 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {card.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    {card.subtitle}
                  </p>
                </div>
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: card.accentVar }}
                >
                  {card.code}
                </span>
              </div>

              <ul className="space-y-1.5 mb-6">
                {card.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link
                  href={card.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--border)]"
                >
                  Open Calculator
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Tax guides
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                In-depth articles on real tax questions.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
              View all guides
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {BLOG_PREVIEW.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all no-underline"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--text-muted)] uppercase tracking-wide">
                    {COUNTRY_LABEL[article.country] ?? article.country}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {article.readingTime} min read
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--primary)] transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
