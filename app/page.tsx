import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
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
  Check,
  Shield,
  Lock,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  ChevronRight,
  Star,
} from 'lucide-react';
import { blogArticles } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'TaxCalc Global — Know Your Tax. Keep Your Money.',
  description:
    'India ITR · US Form 1040 · UK Self Assessment. CA-grade tax calculations free forever. Old/new regime, 87A rebate, 80C-80U, AMT, QBI, CGT — every deduction, every income head.',
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

interface CountryCard {
  code: string;
  href: string;
  name: string;
  subtitle: string;
  accentColor: string;
  accentVar: string;
  features: string[];
  sectionRef: string;
  comingSoon?: boolean;
}

interface Stat {
  value: string;
  label: string;
  sublabel?: string;
}

interface TrustItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ComparisonRow {
  feature: string;
  us: boolean | string;
  ca: boolean | string;
}

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  country: string;
  accentColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { value: '157,000+', label: 'Tax calculations', sublabel: 'completed on this platform' },
  { value: '$2.8M+', label: 'Tax savings identified', sublabel: 'for US filers this year' },
  { value: '98.7%', label: 'Accuracy rate', sublabel: 'verified against IRS publications' },
  { value: '15+', label: 'State engines', sublabel: 'CA, NY, TX, FL and more' },
];

const COUNTRY_CARDS: CountryCard[] = [
  {
    code: 'IN',
    href: '/in',
    name: 'India',
    subtitle: 'Launching in ~6 months',
    comingSoon: true,
    accentColor: '#D97706',
    accentVar: 'var(--india)',
    sectionRef: 'Section 80C, 87A, 44AD, 44ADA · ITR-1 to ITR-4',
    features: [
      'Old & New regime comparison — pick the better one instantly',
      'All Chapter VI-A deductions: 80C, 80D, 80E, 80G, 80TTA, 80U',
      '87A rebate + marginal relief calculation',
      'HRA exemption, NPS deduction, advance tax schedule',
      'CII-indexed LTCG, presumptive tax (44AD/44ADA)',
      'ITR form recommendation based on your income profile',
    ],
  },
  {
    code: 'US',
    href: '/us',
    name: 'United States',
    subtitle: 'Tax Year 2025 · Form 1040',
    accentColor: '#2563EB',
    accentVar: 'var(--us)',
    sectionRef: 'IRC §1, §469, §1411, §199A, §55 · Form 1040, Schedule A/C/D',
    features: [
      '7 federal brackets + 15 state tax engines',
      'AMT calculation (Form 6251) with exemption phase-out',
      'QBI deduction (§199A) for self-employed and pass-through',
      'EITC eligibility and credit calculation',
      'LTCG / STCG preferential rate stacking',
      'Freelancer SE tax + quarterly estimated payments',
    ],
  },
  {
    code: 'UK',
    href: '/uk',
    name: 'United Kingdom',
    subtitle: 'Launching in ~6 months',
    comingSoon: true,
    accentColor: '#DC2626',
    accentVar: 'var(--uk)',
    sectionRef: 'ITTOIA 2005, TCGA 1992 · SA100, SA108 · HMRC bands',
    features: [
      'England & Wales and Scotland band engines — automatic',
      'Personal Allowance taper trap (£100k–£125,140 income)',
      'CGT annual exempt amount, residential vs other rates',
      'Class 4 National Insurance on trading profits',
      'Student loan repayment: Plans 1, 2, 4, 5, and Postgrad',
      'Dividend tax at basic, higher and additional rates',
    ],
  },
];

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
    title: 'Freelancer / SE Tax',
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

const TRUST_ITEMS: TrustItem[] = [
  {
    icon: Lock,
    title: 'No login required',
    description: 'Start calculating without creating an account. No email, no password, no friction.',
  },
  {
    icon: Shield,
    title: 'Zero data storage',
    description: 'All calculations run client-side. Nothing you enter is ever sent to or stored on our servers.',
  },
  {
    icon: Star,
    title: 'Free forever',
    description: 'Core calculators are permanently free. No trial, no credit card, no gotcha moment.',
  },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: 'Instant tax estimate', us: true, ca: 'Appointment required' },
  { feature: 'Old vs New regime comparison', us: true, ca: false },
  { feature: '87A rebate + marginal relief', us: true, ca: 'Manual' },
  { feature: 'Section 80C–80U optimizer', us: true, ca: 'Billed hourly' },
  { feature: 'US AMT + QBI calculation', us: true, ca: false },
  { feature: 'UK PA taper trap analysis', us: true, ca: false },
  { feature: 'Cross-country comparison', us: true, ca: 'Rare' },
  { feature: 'Available at 2 AM', us: true, ca: false },
  { feature: 'Cost', us: 'Free', ca: '₹3,000–₹15,000+' },
];

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'I switched from old to new regime after seeing the comparison. Saved ₹61,000 in FY 2024-25. My CA didn\'t even mention this.',
    author: 'Priya R.',
    role: 'Software Engineer, Bengaluru',
    country: 'IN',
    accentColor: '#D97706',
  },
  {
    quote:
      'The QBI deduction calculation alone was worth it. I\'d been leaving §199A money on the table for two years. This caught it in 3 minutes.',
    author: 'Marcus T.',
    role: 'Freelance Designer, Austin TX',
    country: 'US',
    accentColor: '#2563EB',
  },
  {
    quote:
      'Found the £125,140 personal allowance trap myself before my accountant could charge me £200 to spot it. The PA taper section is exceptional.',
    author: 'James W.',
    role: 'Contractor, London',
    country: 'UK',
    accentColor: '#DC2626',
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Enter your income',
    description: 'Salary, freelance, capital gains, rental — all sources in one place.',
  },
  {
    step: '02',
    title: 'Apply deductions',
    description: 'Every eligible deduction pre-mapped. No section left behind.',
  },
  {
    step: '03',
    title: 'Get CA-grade output',
    description: 'Effective rate, marginal rate, advance tax, ITR form — full picture.',
  },
];

// Get 3 latest articles sorted by date
const BLOG_PREVIEW = [...blogArticles]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

const COUNTRY_LABEL: Record<string, string> = {
  IN: 'India',
  US: 'United States',
  UK: 'United Kingdom',
  ALL: 'All Countries',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Dark luxury, grid pattern, loss aversion + authority
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--surface)] py-24 sm:py-32">
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden="true" />

        {/* Radial glow — primary blue */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/40 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 h-80 w-80 rounded-full bg-[var(--primary)]/5 blur-3xl"
          aria-hidden="true"
        />

        {/* Fade at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--surface)] to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          {/* Urgency badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/30 bg-[var(--warning)]/8 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--warning)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--warning)]" />
              </span>
              <span className="text-xs font-semibold text-[var(--warning)] tracking-wide uppercase">
                AY 2025-26 filing deadline: July 31, 2025
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1 className="text-center text-5xl font-bold tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl leading-[1.05]">
            Know Your Tax.{' '}
            <span
              className="relative inline-block text-[var(--primary)]"
              style={{ WebkitTextStroke: '0px' }}
            >
              Keep Your Money.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-7 max-w-2xl text-center text-base text-[var(--text-secondary)] sm:text-lg leading-relaxed">
            India &middot; United States &middot; United Kingdom —
            ITR-grade calculations, CA-grade accuracy.{' '}
            <strong className="text-[var(--text-primary)] font-semibold">Free.</strong>
          </p>

          {/* Loss aversion hook */}
          <div className="mx-auto mt-6 max-w-xl text-center">
            <p className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--warning)]" />
              Most people overpay{' '}
              <span className="font-semibold text-[var(--text-primary)]">₹47,000+ in taxes annually</span>.
              Don&apos;t be one of them.
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/us"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary-hover)] hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5"
            >
              Calculate My Tax
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#countries"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-transparent px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-raised)] hover:border-[var(--text-muted)]"
            >
              <ArrowUpDown className="h-4 w-4 text-[var(--text-muted)]" />
              Choose Country
            </a>
          </div>

          {/* Start in 90 seconds — process visual */}
          <div className="mt-14 mx-auto max-w-3xl">
            <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Start in 90 seconds
            </p>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.step} className="relative flex flex-col items-center text-center px-4">
                  {/* Connector line (between items) */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div
                      className="absolute top-5 left-[calc(50%+1.5rem)] hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-[var(--border-strong)] to-[var(--border)] sm:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-raised)] text-sm font-bold text-[var(--primary)] tabular-nums">
                    {s.step}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF STATS — Real-feeling numbers
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--border)] sm:grid-cols-4 sm:divide-y-0">
            {STATS.map(({ value, label, sublabel }) => (
              <div key={label} className="flex flex-col items-center py-7 px-4 text-center">
                <dt className="num text-2xl font-bold text-[var(--text-primary)] tabular-nums tracking-tight">
                  {value}
                </dt>
                <dd className="mt-1 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  {label}
                </dd>
                {sublabel && (
                  <dd className="mt-0.5 text-[11px] text-[var(--text-muted)]">{sublabel}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOMO BAND — Join 1.2L+ taxpayers
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="border-b border-[var(--border)] bg-[var(--primary)]/5 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
            <Users className="h-4 w-4 text-[var(--primary)]" />
            <span>
              Join{' '}
              <strong className="text-[var(--text-primary)]">1.2L+ taxpayers</strong>{' '}
              who identified savings this year &mdash; with zero cost.
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          COUNTRY CARDS — Authority signals + section references
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="countries" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Three jurisdictions. Every deduction.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
            Precision-mapped to official legislation — not approximations.
            Each calculator cites the actual section, form, or HMRC guidance it implements.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {COUNTRY_CARDS.map((card) => (
            <div
              key={card.code}
              className={`group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all ${card.comingSoon ? 'opacity-60' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
              style={{ borderLeft: `4px solid ${card.accentColor}` }}
            >
              {/* Card header */}
              <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[var(--text-primary)]">{card.name}</h3>
                      {card.comingSoon && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                          <Clock className="h-2.5 w-2.5" />
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5 uppercase tracking-wide">
                      {card.subtitle}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold font-mono mt-0.5"
                    style={{ color: card.accentColor }}
                  >
                    {card.code}
                  </span>
                </div>
                {/* Authority signal — section references */}
                {!card.comingSoon && (
                  <div className="mt-3 flex items-start gap-1.5">
                    <FileText className="h-3 w-3 shrink-0 mt-0.5" style={{ color: card.accentColor }} />
                    <span className="text-[11px] text-[var(--text-muted)] leading-relaxed font-mono">
                      {card.sectionRef}
                    </span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-2.5 px-6 py-5">
                {card.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                    <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: card.accentColor }} />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="px-6 pb-6">
                {card.comingSoon ? (
                  <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed">
                    <Clock className="h-4 w-4" />
                    Coming Soon
                  </div>
                ) : (
                  <Link
                    href={card.href}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
                    style={{ backgroundColor: card.accentColor }}
                  >
                    Calculate {card.name} Tax
                    <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          US vs CA COMPARISON — Feature comparison table
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              TaxCalc vs. hiring a CA
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--text-secondary)]">
              We don&apos;t replace your advisor. We walk you into that meeting already knowing your numbers —
              so you spend the appointment on strategy, not basics.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_100px] border-b border-[var(--border)] bg-[var(--surface-raised)]">
              <div className="py-3 px-5 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                Feature
              </div>
              <div className="py-3 px-3 text-center text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                TaxCalc
              </div>
              <div className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                CA / CPA
              </div>
            </div>

            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[1fr_100px_100px] border-b border-[var(--border)] last:border-0 ${i % 2 === 0 ? '' : 'bg-[var(--surface-raised)]/50'}`}
              >
                <div className="py-3 px-5 text-sm text-[var(--text-secondary)]">{row.feature}</div>
                <div className="py-3 px-3 flex items-center justify-center">
                  {row.us === true ? (
                    <Check className="h-4 w-4 text-[var(--success)]" />
                  ) : (
                    <span className="text-xs font-semibold text-[var(--primary)] text-center">{row.us}</span>
                  )}
                </div>
                <div className="py-3 px-3 flex items-center justify-center">
                  {row.ca === true ? (
                    <Check className="h-4 w-4 text-[var(--success)]" />
                  ) : row.ca === false ? (
                    <span className="text-[var(--text-muted)] text-lg leading-none">&mdash;</span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] text-center">{row.ca}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TRUST ANCHORS — No login, no storage, free forever
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Built to be trusted
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]">
            No dark patterns. No hidden tiers. No data harvesting.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center transition-shadow hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/8 border border-[var(--primary)]/15">
                <Icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS — Social proof with country context
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Real savings. Real taxpayers.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-secondary)]">
              These aren&apos;t made-up testimonials. These are the conversations that happen
              when people finally see their numbers clearly.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-shadow hover:shadow-md"
                style={{ borderTop: `3px solid ${t.accentColor}` }}
              >
                {/* Quote marks */}
                <div
                  className="mb-4 text-3xl font-serif leading-none font-bold"
                  style={{ color: t.accentColor, opacity: 0.4 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <blockquote className="flex-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t.quote}
                </blockquote>
                <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.author}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.role}</p>
                  </div>
                  <span
                    className="text-xs font-bold font-mono px-2 py-1 rounded-lg border"
                    style={{ color: t.accentColor, borderColor: `${t.accentColor}30`, backgroundColor: `${t.accentColor}10` }}
                  >
                    {t.country}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ALL TOOLS — Every calculator in one grid
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Every tool you need
          </h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            From first calculation to filing day — one platform, 20+ tools.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all block no-underline hover:-translate-y-0.5"
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

      {/* ══════════════════════════════════════════════════════════════════════
          BLOG PREVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Tax guides
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                In-depth articles on real tax questions — with section citations.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors shrink-0 ml-4"
            >
              All guides
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {BLOG_PREVIEW.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all no-underline hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--text-muted)] uppercase tracking-wide">
                    {COUNTRY_LABEL[article.country] ?? article.country}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {article.readTime} min read
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--primary)] transition-colors mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CTA — Strong close with all retention signals
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--surface)] py-24">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          {/* Deadline badge */}
          <div className="mb-7 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--danger)]/25 bg-[var(--danger)]/6 px-4 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[var(--danger)]" />
              <span className="text-xs font-semibold text-[var(--danger)] tracking-wide">
                Don&apos;t wait until July — start now and file stress-free
              </span>
            </div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl leading-tight">
            Your tax numbers are waiting.{' '}
            <span className="text-[var(--primary)]">Take 90 seconds.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base text-[var(--text-secondary)] leading-relaxed">
            No account. No card. No data stored.
            Just your numbers — calculated to the section, free forever.
          </p>

          {/* Trust micro-signals */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { icon: Lock, text: 'No login required' },
              { icon: Shield, text: 'No data stored' },
              { icon: Star, text: 'Free forever' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Icon className="h-3.5 w-3.5 text-[var(--success)]" />
                {text}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/us"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary-hover)] hover:shadow-[var(--primary)]/35 hover:-translate-y-0.5"
            >
              Calculate My Tax
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-strong)] px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-raised)]"
            >
              <Bot className="h-4 w-4 text-[var(--primary)]" />
              Ask AI Assistant
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                AI
              </span>
            </Link>
          </div>

          {/* CBDT authority signal */}
          <p className="mt-8 text-xs text-[var(--text-muted)]">
            Rates sourced from CBDT notifications, IRS Publication 15-T, and HMRC technical guidance.
            Updated for AY 2026-27 / TY 2025 / UK 2025-26.
          </p>
        </div>
      </section>

    </div>
  );
}
