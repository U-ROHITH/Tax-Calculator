'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Sun,
  Moon,
  Bot,
  ChevronDown,
  Menu,
  X,
  Calculator,
  Globe,
  BarChart2,
  ArrowUpDown,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Zap,
  RefreshCw,
  CheckSquare,
  Calendar,
  Receipt,
  Building,
  Upload,
  BookOpen,
  Tag,
  Bell,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Calculators',
    items: [
      { label: 'India Tax Calculator', href: '/in', icon: Calculator },
      { label: 'US Tax Calculator', href: '/us', icon: Globe },
      { label: 'UK Tax Calculator', href: '/uk', icon: BarChart2 },
      { label: 'Compare All Countries', href: '/compare', icon: ArrowUpDown },
      { label: 'US Freelancer / SE Tax', href: '/freelancer', icon: Briefcase },
      { label: 'Crypto Tax', href: '/crypto', icon: TrendingUp },
    ],
  },
  {
    label: 'Planning',
    items: [
      { label: 'Tax Planning Tools', href: '/plan', icon: Zap },
      { label: 'Loss Carry-Forward', href: '/carryforward', icon: RefreshCw },
      { label: 'Document Checklist', href: '/checklist', icon: CheckSquare },
      { label: 'Tax Calendar', href: '/calendar', icon: Calendar },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'GST Calculator', href: '/gst', icon: Receipt },
      { label: 'TDS Deduction Guide', href: '/tds', icon: Building },
      { label: 'Upload Form 16', href: '/upload', icon: Upload },
      { label: 'Student / F1 Visa', href: '/student', icon: GraduationCap },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Tax Guides (Blog)', href: '/blog', icon: BookOpen },
      { label: 'Pricing', href: '/pricing', icon: Tag },
      { label: 'Notice Response', href: '/notice', icon: Bell },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleGroupClick = (label: string) => {
    setOpenGroup(openGroup === label ? null : label);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-[var(--border)] backdrop-blur-md bg-[var(--surface)]/80"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-primary)] no-underline shrink-0"
        >
          <BarChart3 className="h-5 w-5 text-[var(--primary)] shrink-0" />
          <span className="text-sm font-semibold tracking-tight">
            TaxCalc<span className="text-[var(--text-muted)] font-normal ml-0.5">Global</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_GROUPS.map((group) => {
            const isOpen = openGroup === group.label;
            const isGroupActive = group.items.some(
              (item) => pathname === item.href || pathname.startsWith(item.href + '/')
            );
            return (
              <div key={group.label} className="relative">
                <button
                  onClick={() => handleGroupClick(group.label)}
                  className={[
                    'flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors duration-100 rounded-lg',
                    'hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
                    isGroupActive || isOpen
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]',
                  ].join(' ')}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl p-2 min-w-[220px] z-50">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={[
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-100',
                            'hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
                            isActive
                              ? 'text-[var(--text-primary)] bg-[var(--surface-raised)]'
                              : 'text-[var(--text-secondary)]',
                          ].join(' ')}
                          onClick={() => setOpenGroup(null)}
                        >
                          <Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Assistant — always visible */}
          <Link
            href="/assistant"
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors duration-100 rounded-lg',
              'hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
              pathname === '/assistant'
                ? 'text-[var(--text-primary)] bg-[var(--surface-raised)]'
                : 'text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <Bot className="h-3.5 w-3.5" />
            Assistant
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
              AI
            </span>
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
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

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] max-h-[80vh] overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  {group.label}
                </p>
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={[
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-100',
                          isActive
                            ? 'text-[var(--text-primary)] bg-[var(--surface-raised)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
                        ].join(' ')}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* AI Assistant in mobile */}
            <div className="mb-3">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                AI
              </p>
              <div className="mt-1">
                <Link
                  href="/assistant"
                  className={[
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-100',
                    pathname === '/assistant'
                      ? 'text-[var(--text-primary)] bg-[var(--surface-raised)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  <Bot className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                  <span>AI Tax Assistant</span>
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                    AI
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
