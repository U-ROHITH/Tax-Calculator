'use client';

import Link from 'next/link';
import { Calculator, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          <span>TaxCalc Global</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {[
            { href: '/in', flag: '🇮🇳', label: 'India' },
            { href: '/us', flag: '🇺🇸', label: 'USA' },
            { href: '/uk', flag: '🇬🇧', label: 'UK' },
          ].map(({ href, flag, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span>{flag}</span>
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
          <Link
            href="/compare"
            className="ml-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Compare
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
