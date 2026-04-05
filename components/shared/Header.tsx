'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
  Calculator,
  Globe,
  BarChart2,
  ArrowUpDown,
  Zap,
  RefreshCw,
  CheckSquare,
  Bitcoin,
  Users,
  Briefcase,
  BookOpen,
  Tag,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Nav data
───────────────────────────────────────────────────────────────────────────── */

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

// US-only for now — India & UK launching in 6 months
const CALCULATOR_ITEMS: DropdownItem[] = [
  {
    label: 'US Tax Calculator',
    href: '/us',
    icon: Globe,
    description: 'TY 2025 · Federal + All 50 States',
  },
];

const TOOLS_ITEMS: DropdownItem[] = [
  { label: 'Freelancer / SE Tax', href: '/freelancer', icon: Briefcase },
  { label: 'Crypto Tax', href: '/crypto', icon: Bitcoin },
  { label: 'Student / F1 Visa', href: '/student', icon: Users },
  { label: 'Tax Planning', href: '/plan', icon: Zap },
  { label: 'AI Tax Assistant', href: '/assistant', icon: FileText },
];

const SIMPLE_LINKS = [
  { label: 'Blog', href: '/blog', icon: BookOpen },
  { label: 'Pricing', href: '/pricing', icon: Tag },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Trust bar
───────────────────────────────────────────────────────────────────────────── */

function TrustBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="trust-bar relative flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium">
      <span className="trust-bar-dot" />
      <span className="trust-bar-text">
        Tax Year 2025 · US federal filing deadline April 15, 2025 ·{' '}
        <Link
          href="/blog/us-tax-brackets-2025"
          className="trust-bar-link underline underline-offset-2"
        >
          2025 Tax Brackets Guide
          <ArrowRight className="inline-block h-3 w-3 ml-0.5 -mt-px" />
        </Link>
      </span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="trust-bar-dismiss absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Desktop dropdown
───────────────────────────────────────────────────────────────────────────── */

interface DesktopDropdownProps {
  label: string;
  items: DropdownItem[];
  isActive: boolean;
  columns?: number;
}

function DesktopDropdown({ label, items, isActive, columns = 1 }: DesktopDropdownProps) {
  return (
    <div className="nav-dropdown-root group relative">
      <button
        className={[
          'nav-btn flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-100',
          isActive ? 'nav-btn--active' : '',
        ].join(' ')}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 nav-chevron transition-transform duration-200" />
      </button>

      {/* Dropdown panel — shown on group hover via CSS */}
      <div
        className={[
          'nav-dropdown absolute top-full left-0 mt-2 rounded-xl border shadow-xl p-2 z-50',
          columns === 2 ? 'nav-dropdown--wide grid grid-cols-2 gap-x-1' : '',
        ].join(' ')}
        style={{ minWidth: columns === 2 ? '420px' : '240px' }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="nav-dropdown-item group/item flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors duration-100"
            >
              <span className="nav-dropdown-icon mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="nav-dropdown-label text-sm font-medium leading-none">{item.label}</span>
                {item.description && (
                  <span className="nav-dropdown-desc text-xs leading-snug">{item.description}</span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Header
───────────────────────────────────────────────────────────────────────────── */

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [trustVisible, setTrustVisible] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  /* Theme init */
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    setMounted(true);

    /* Persist trust bar dismissal */
    const dismissed = sessionStorage.getItem('trust-bar-dismissed');
    if (dismissed === '1') setTrustVisible(false);
  }, []);

  /* Close mobile on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const dismissTrustBar = () => {
    setTrustVisible(false);
    sessionStorage.setItem('trust-bar-dismissed', '1');
  };

  /* Active state helpers */
  const calcActive = CALCULATOR_ITEMS.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + '/')
  );
  const toolsActive = TOOLS_ITEMS.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + '/')
  );

  return (
    <>
      <style>{`
        /* ── Trust bar ── */
        .trust-bar {
          background-color: #FEF3C7;
          color: #92400E;
          border-bottom: 1px solid #FDE68A;
        }
        .dark .trust-bar {
          background-color: #1C1506;
          color: #FCD34D;
          border-bottom-color: #2D2108;
        }
        .trust-bar-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D97706;
          flex-shrink: 0;
          animation: trust-pulse 2s ease-in-out infinite;
        }
        .dark .trust-bar-dot { background: #FBBF24; }
        .trust-bar-link { color: inherit; font-weight: 600; }
        .trust-bar-link:hover { text-decoration-color: currentColor; }
        .trust-bar-dismiss { color: inherit; }

        @keyframes trust-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── Sticky header ── */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          border-bottom: 1px solid var(--border);
          background: color-mix(in srgb, var(--surface) 85%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .site-header.scrolled {
          box-shadow: 0 1px 8px 0 rgba(0,0,0,0.08);
        }
        .dark .site-header.scrolled {
          box-shadow: 0 1px 12px 0 rgba(0,0,0,0.32);
        }

        /* ── Nav buttons ── */
        .nav-btn {
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
        }
        .nav-btn:hover { color: var(--text-primary); background: var(--surface-raised); }
        .nav-btn--active { color: var(--text-primary); }

        /* Chevron rotates on group hover */
        .nav-dropdown-root:hover .nav-chevron {
          transform: rotate(180deg);
        }

        /* ── Dropdown panel ── */
        .nav-dropdown {
          background: var(--surface);
          border-color: var(--border);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-6px);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .nav-dropdown-root:hover .nav-dropdown,
        .nav-dropdown-root:focus-within .nav-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        /* Dropdown item */
        .nav-dropdown-item { color: var(--text-secondary); }
        .nav-dropdown-item:hover { background: var(--surface-raised); color: var(--text-primary); }

        .nav-dropdown-icon {
          background: var(--surface-raised);
          color: var(--primary);
          transition: background 0.12s;
        }
        .nav-dropdown-item:hover .nav-dropdown-icon {
          background: color-mix(in srgb, var(--primary) 12%, transparent);
        }

        .nav-dropdown-label { color: inherit; }
        .nav-dropdown-desc { color: var(--text-muted); }

        /* ── Simple nav link ── */
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.1s, background 0.1s;
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--text-primary); background: var(--surface-raised); }
        .nav-link--active { color: var(--text-primary); background: var(--surface-raised); }

        /* ── CTA button ── */
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          background: var(--primary);
          color: var(--primary-foreground);
          text-decoration: none;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
          box-shadow: 0 1px 3px rgba(37,99,235,0.3), 0 0 0 0 transparent;
          letter-spacing: -0.01em;
        }
        .cta-btn:hover {
          background: var(--primary-hover);
          box-shadow: 0 3px 10px rgba(37,99,235,0.35);
          transform: translateY(-1px);
        }
        .cta-btn:active { transform: translateY(0); }

        /* ── Icon button (theme toggle, hamburger) ── */
        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.1s, background 0.1s;
        }
        .icon-btn:hover { color: var(--text-primary); background: var(--surface-raised); }

        /* ── Logo ── */
        .logo-wordmark {
          font-size: 0.9375rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1;
        }
        .logo-global {
          color: var(--primary);
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        /* ── Active underline indicator ── */
        .nav-active-dot::after {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--primary);
          margin: 2px auto 0;
        }

        /* ── Mobile drawer ── */
        .mobile-drawer {
          border-top: 1px solid var(--border);
          background: var(--surface);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-drawer.open {
          max-height: 85vh;
          overflow-y: auto;
        }

        .mobile-section-label {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 12px 12px 4px;
        }

        .mobile-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.1s, background 0.1s;
        }
        .mobile-item:hover, .mobile-item--active {
          color: var(--text-primary);
          background: var(--surface-raised);
        }

        .mobile-item-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-raised);
          color: var(--primary);
          flex-shrink: 0;
        }

        .mobile-item-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.3;
          margin-top: 1px;
        }

        .mobile-accordion-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: background 0.1s;
        }
        .mobile-accordion-btn:hover { background: var(--surface-raised); }

        .mobile-section-body {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.25s ease;
        }
        .mobile-section-body.open { max-height: 600px; }

        .mobile-cta {
          margin: 12px 4px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 13px 16px;
          min-height: 44px;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 700;
          background: var(--primary);
          color: var(--primary-foreground);
          text-decoration: none;
          letter-spacing: -0.01em;
          width: 100%;
          box-sizing: border-box;
        }
      `}</style>

      {/* Trust bar */}
      {trustVisible && <TrustBar onDismiss={dismissTrustBar} />}

      {/* Header */}
      <StickyHeader>
        <header ref={headerRef} className="site-header">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 no-underline"
              aria-label="TaxCalc Global home"
            >
              <BarChart3 className="h-5 w-5 text-[var(--primary)] shrink-0" strokeWidth={2.25} />
              <span className="logo-wordmark">
                TaxCalc<span className="logo-global"> Global</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {/* Calculator dropdown */}
              <div className={calcActive ? 'nav-active-dot' : ''}>
                <DesktopDropdown
                  label="Calculator"
                  items={CALCULATOR_ITEMS}
                  isActive={calcActive}
                />
              </div>

              {/* Tools dropdown */}
              <div className={toolsActive ? 'nav-active-dot' : ''}>
                <DesktopDropdown
                  label="Tools"
                  items={TOOLS_ITEMS}
                  isActive={toolsActive}
                  columns={2}
                />
              </div>

              {/* Simple links */}
              {SIMPLE_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <div key={link.href} className={isActive ? 'nav-active-dot' : ''}>
                    <Link
                      href={link.href}
                      className={['nav-link', isActive ? 'nav-link--active' : ''].join(' ')}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {link.label}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="icon-btn"
              >
                {mounted ? (
                  dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4 block" />
                )}
              </button>

              {/* CTA — desktop */}
              <Link href="/in" className="cta-btn hidden sm:inline-flex">
                Start Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {/* Hamburger — mobile */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="icon-btn lg:hidden"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* ── Mobile drawer ── */}
          <div className={`mobile-drawer lg:hidden ${mobileOpen ? 'open' : ''}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-2">

              {/* Calculator section */}
              <MobileAccordion
                label="Calculator"
                open={mobileSection === 'Calculator'}
                onToggle={() =>
                  setMobileSection((s) => (s === 'Calculator' ? null : 'Calculator'))
                }
              >
                {CALCULATOR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mobile-item ${isActive ? 'mobile-item--active' : ''}`}
                    >
                      <span className="mobile-item-icon">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block">{item.label}</span>
                        {item.description && (
                          <span className="mobile-item-desc">{item.description}</span>
                        )}
                      </span>
                    </Link>
                  );
                })}
              </MobileAccordion>

              {/* Tools section */}
              <MobileAccordion
                label="Tools"
                open={mobileSection === 'Tools'}
                onToggle={() =>
                  setMobileSection((s) => (s === 'Tools' ? null : 'Tools'))
                }
              >
                {TOOLS_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`mobile-item ${isActive ? 'mobile-item--active' : ''}`}
                    >
                      <span className="mobile-item-icon">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </MobileAccordion>

              {/* Simple links */}
              <div className="mt-1 space-y-0.5">
                {SIMPLE_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`mobile-item ${isActive ? 'mobile-item--active' : ''}`}
                    >
                      <span className="mobile-item-icon">
                        <Icon className="h-4 w-4" />
                      </span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <Link href="/in" className="mobile-cta">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>
      </StickyHeader>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   StickyHeader: adds .scrolled class on scroll for shadow
───────────────────────────────────────────────────────────────────────────── */

function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // We need to inject the scrolled class into the header child
  // We do this by wrapping with a div that signals state via a data attribute,
  // and the inner header reads it. Simpler: just render a wrapper div.
  return (
    <div data-scrolled={scrolled ? 'true' : 'false'} className="contents">
      {/* Clone pattern not available without React.cloneElement; use CSS instead */}
      <ScrolledClassApplier scrolled={scrolled}>{children}</ScrolledClassApplier>
    </div>
  );
}

function ScrolledClassApplier({
  scrolled,
  children,
}: {
  scrolled: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = ref.current?.querySelector('.site-header');
    if (header) {
      header.classList.toggle('scrolled', scrolled);
    }
  }, [scrolled]);

  return <div ref={ref} className="contents">{children}</div>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Mobile accordion section
───────────────────────────────────────────────────────────────────────────── */

function MobileAccordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-1">
      <button className="mobile-accordion-btn" onClick={onToggle} aria-expanded={open}>
        <span>{label}</span>
        <ChevronDown
          className="h-4 w-4 text-[var(--text-muted)] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div className={`mobile-section-body ${open ? 'open' : ''}`}>
        <div className="space-y-0.5 py-1 pl-2 pr-1">{children}</div>
      </div>
    </div>
  );
}
