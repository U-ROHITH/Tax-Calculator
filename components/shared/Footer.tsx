import Link from 'next/link';
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
            <Calculator className="h-4 w-4 text-primary" />
            TaxCalc Global
          </Link>
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/in" className="hover:text-foreground">India Calculator</Link>
            <Link href="/us" className="hover:text-foreground">US Calculator</Link>
            <Link href="/uk" className="hover:text-foreground">UK Calculator</Link>
            <Link href="/compare" className="hover:text-foreground">Compare</Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          <strong>Disclaimer:</strong> TaxCalc Global provides estimates for informational purposes only and does not constitute tax advice.
          Tax laws change frequently. Always consult a qualified tax professional for your specific situation.
          Calculations are based on FY 2025-26 (India), TY 2025 (US), and TY 2025-26 (UK) rules.
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} TaxCalc Global. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
