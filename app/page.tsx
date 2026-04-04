import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, FileText, Calculator, Download, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'TaxCalc Global — Free Income Tax Calculator for India, US & UK',
  description:
    'Calculate your income tax for India (FY 2025-26), United States (TY 2025), or UK (TY 2025-26). Free, accurate, no signup required.',
};

interface CountryCard {
  code: string;
  href: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  borderAccent: string;
  features: string[];
}

const COUNTRY_CARDS: CountryCard[] = [
  {
    code: 'IN',
    href: '/in',
    name: 'India',
    subtitle: 'FY 2025-26',
    description: 'Old vs New regime comparison with 87A rebate, surcharge, HRA, and Chapter VI-A deductions.',
    accentColor: 'text-[var(--india)]',
    borderAccent: 'border-l-[var(--india)]',
    features: [
      'Old & New Regime Comparison',
      'Section 87A Rebate',
      'HRA Exemption',
      'Chapter VI-A Deductions',
    ],
  },
  {
    code: 'US',
    href: '/us',
    name: 'United States',
    subtitle: 'TY 2025',
    description: 'Federal brackets, FICA, five-state income tax support, and self-employment tax.',
    accentColor: 'text-[var(--us)]',
    borderAccent: 'border-l-[var(--us)]',
    features: [
      '7 Federal Tax Brackets',
      'FICA & Medicare',
      '5 State Taxes (CA/NY/TX/FL/WA)',
      'Self-Employment Tax',
    ],
  },
  {
    code: 'UK',
    href: '/uk',
    name: 'United Kingdom',
    subtitle: 'TY 2025-26',
    description: 'England and Scotland bands, personal allowance taper, National Insurance, and student loans.',
    accentColor: 'text-[var(--uk)]',
    borderAccent: 'border-l-[var(--uk)]',
    features: [
      'England & Scotland Bands',
      'Personal Allowance Taper',
      'National Insurance',
      'Student Loan Plans 1, 2, 4, 5',
    ],
  },
];

const STATS = [
  { value: '104', label: 'Tax rules encoded' },
  { value: '3', label: 'Countries supported' },
  { value: 'All', label: 'Income heads covered' },
  { value: 'CA-grade', label: 'Calculation accuracy' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: FileText,
    title: 'Select your country',
    description: 'Choose India, United States, or United Kingdom to load the correct tax form for your jurisdiction.',
  },
  {
    step: '02',
    icon: Calculator,
    title: 'Enter your income details',
    description: 'Input gross income, deductions, filing status, and applicable exemptions. Your data never leaves your browser.',
  },
  {
    step: '03',
    icon: Download,
    title: 'Review and download',
    description: 'Instant tax breakdown with effective rate, take-home pay, and a downloadable PDF summary.',
  },
];

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
            FY 2025-26 &nbsp;&middot;&nbsp; TY 2025 &nbsp;&middot;&nbsp; Updated for latest rules
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Calculate Your Tax.
            <br />
            <span className="text-[var(--primary)]">Understand Every Rupee.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-[var(--text-secondary)] sm:text-lg leading-relaxed">
            Professional-grade income tax calculation for India, United States, and United Kingdom.
            No signup. No ads. Results in seconds.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/in"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              India Calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/us"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-raised)]"
            >
              US / UK Calculator
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

      {/* ── Country cards ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
            Choose your jurisdiction
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Each calculator uses the latest official slabs and rates.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRY_CARDS.map((card) => (
            <div
              key={card.code}
              className={`flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] border-l-4 ${card.borderAccent} p-6 transition-shadow hover:shadow-md`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {card.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                    {card.subtitle}
                  </p>
                </div>
                <span className={`text-xs font-bold ${card.accentColor} font-mono`}>
                  {card.code}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                {card.description}
              </p>

              {/* Feature list */}
              <ul className="space-y-1.5 mb-6">
                {card.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href={card.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--border)]"
                >
                  Calculate {card.name} Tax
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Compare CTA */}
        <div className="mt-6">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          >
            Compare all three countries side by side
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Three steps from input to a full tax breakdown.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="flex flex-col">
                {/* Step number + icon */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="num text-xs font-bold text-[var(--text-muted)] tabular-nums w-6">
                    {step}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                    <Icon className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
