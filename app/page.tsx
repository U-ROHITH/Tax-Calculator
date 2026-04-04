import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TaxCalc Global — Free Income Tax Calculator for India, US & UK',
  description: 'Calculate your income tax in 30 seconds for India (FY 2025-26), United States (TY 2025), or UK (TY 2025-26). Free, accurate, no signup.',
};

const countries = [
  {
    code: 'IN',
    href: '/in',
    flag: '🇮🇳',
    name: 'India',
    subtitle: 'FY 2025-26',
    description: 'Old vs New regime comparison, 87A rebate, surcharge, HRA, 80C/80D deductions',
    borderColor: 'border-amber-200',
    gradientFrom: 'from-amber-50',
    btnClass: 'bg-amber-500 hover:bg-amber-600',
    features: ['Old & New Regime', 'Section 87A Rebate', 'HRA Exemption', 'Chapter VI-A Deductions'],
  },
  {
    code: 'US',
    href: '/us',
    flag: '🇺🇸',
    name: 'United States',
    subtitle: 'TY 2025',
    description: 'Federal brackets, FICA, state tax (CA/NY/TX/FL/WA), self-employment tax',
    borderColor: 'border-blue-200',
    gradientFrom: 'from-blue-50',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
    features: ['7 Federal Brackets', 'FICA & Medicare', '5 State Taxes', 'Self-Employment Tax'],
  },
  {
    code: 'UK',
    href: '/uk',
    flag: '🇬🇧',
    name: 'United Kingdom',
    subtitle: 'TY 2025-26',
    description: 'England/Scotland bands, personal allowance taper, National Insurance, student loans',
    borderColor: 'border-red-200',
    gradientFrom: 'from-red-50',
    btnClass: 'bg-red-600 hover:bg-red-700',
    features: ['England & Scotland Bands', 'PA Taper (60% trap)', 'National Insurance', 'Student Loan Plans'],
  },
];

const steps = [
  { n: '1', title: 'Pick your country', desc: 'Choose India, US, or UK to get the right tax form' },
  { n: '2', title: 'Enter your income', desc: 'Fill in gross income, deductions, and filing details' },
  { n: '3', title: 'Instant results', desc: 'See tax breakdown, charts, take-home pay, and saving tips' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            FY 2025-26 · TY 2025 · Updated for latest tax rules
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Calculate your taxes{' '}
            <span className="text-primary">in 30 seconds</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Free, accurate income tax calculator for India, United States, and United Kingdom.
            No signup. Your data never leaves your browser.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {countries.map((c) => (
              <Link
                key={c.code}
                href={c.href}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-xl">{c.flag}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Country cards */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">Choose your country</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <div
              key={c.code}
              className={`relative flex flex-col rounded-2xl border bg-gradient-to-br to-white/80 p-6 shadow-sm transition-shadow hover:shadow-lg ${c.borderColor} ${c.gradientFrom}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-4xl">{c.flag}</span>
                <span className="rounded-full border bg-white/80 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {c.subtitle}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.description}</p>
              <ul className="mt-4 space-y-1">
                {c.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={c.href}
                className={`mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${c.btnClass}`}
              >
                Calculate {c.name} Tax →
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            🔄 Compare all 3 countries side-by-side
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">🔒 Data never leaves your browser</span>
            <span className="flex items-center gap-2">⚡ Instant calculations</span>
            <span className="flex items-center gap-2">📊 Official tax slabs</span>
            <span className="flex items-center gap-2">📄 Download PDF report</span>
          </div>
        </div>
      </section>
    </div>
  );
}
