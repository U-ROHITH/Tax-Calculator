import Link from 'next/link';
import { Calculator } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          <span>TaxCalc Global</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/in"
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span>🇮🇳</span>
            <span className="hidden sm:inline">India</span>
          </Link>
          <Link
            href="/us"
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span>🇺🇸</span>
            <span className="hidden sm:inline">USA</span>
          </Link>
          <Link
            href="/uk"
            className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span>🇬🇧</span>
            <span className="hidden sm:inline">UK</span>
          </Link>
          <Link
            href="/compare"
            className="ml-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
