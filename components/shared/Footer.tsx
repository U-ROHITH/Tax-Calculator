import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

const NAV_LINKS = [
  { href: '/in', label: 'India Calculator' },
  { href: '/us', label: 'US Calculator' },
  { href: '/uk', label: 'UK Calculator' },
  { href: '/compare', label: 'Compare' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] no-underline shrink-0"
          >
            <BarChart3 className="h-4 w-4 text-[var(--primary)]" />
            TaxCalc<span className="text-[var(--text-muted)] font-normal ml-0.5">Global</span>
          </Link>

          {/* Nav */}
          <nav className="flex flex-wrap gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Disclaimer */}
          <p className="text-xs text-[var(--text-muted)] max-w-xs text-right hidden lg:block">
            Estimates only. Not tax advice. Consult a qualified tax professional.
            FY 2025-26 (India) · TY 2025 (US) · TY 2025-26 (UK).
          </p>
        </div>

        {/* Mobile disclaimer */}
        <p className="mt-4 text-xs text-[var(--text-muted)] lg:hidden">
          Estimates only. Not tax advice. Always consult a qualified tax professional.
          Based on FY 2025-26 (India), TY 2025 (US), and TY 2025-26 (UK) rules.
        </p>
      </div>
    </footer>
  );
}
