'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/in', label: 'India' },
  { href: '/us', label: 'United States' },
  { href: '/uk', label: 'United Kingdom' },
  { href: '/compare', label: 'Compare' },
  { href: '/plan', label: 'Tax Planning' },
  { href: '/checklist', label: 'Checklist' },
];

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-primary)] no-underline"
        >
          <BarChart3 className="h-5 w-5 text-[var(--primary)] shrink-0" />
          <span className="text-sm font-semibold tracking-tight">
            TaxCalc<span className="text-[var(--text-muted)] font-normal ml-0.5">Global</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'relative px-3 py-1.5 text-sm font-medium transition-colors duration-100',
                  'hover:text-[var(--text-primary)]',
                  isActive
                    ? 'text-[var(--text-primary)] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-px after:bg-[var(--primary)] after:content-[""]'
                    : 'text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav + theme toggle */}
        <div className="flex items-center gap-2">
          {/* Mobile nav links */}
          <nav className="flex md:hidden items-center gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              const short = label === 'United States' ? 'US' : label === 'United Kingdom' ? 'UK' : label === 'Tax Planning' ? 'Plan' : label;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    'px-2 py-1 text-xs font-medium transition-colors duration-100',
                    isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {short}
                </Link>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          >
            {mounted ? (
              dark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
