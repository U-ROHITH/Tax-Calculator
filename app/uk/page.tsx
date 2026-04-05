// UK Calculator is preserved in components/calculator/UKCalculator.tsx — launching in ~6 months
import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight, Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'UK Tax Calculator — Coming Soon | TaxCalc Global',
  description: 'UK Self Assessment tax calculator is coming soon. Try our US tax calculator today.',
};

export default function UKPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)]">
          <Clock className="h-4 w-4" />
          Launching in ~6 months
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            UK Tax Calculator
          </h1>
          <p className="text-[var(--text-muted)] leading-relaxed">
            We are building a complete UK Self Assessment calculator covering income tax,
            National Insurance, capital gains, and all HMRC reliefs. Coming soon.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">What will be included:</p>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {[
              'England/Wales and Scotland income tax bands',
              'National Insurance: Class 1, 2, and 4',
              'Capital Gains Tax: 18%/24% property, 10%/18% other assets',
              'Personal Allowance taper (60% trap above £100K)',
              'Marriage Allowance, Pension Annual Allowance, ISA guide',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--uk)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/us"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Calculator className="h-4 w-4" />
            Try US Tax Calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
