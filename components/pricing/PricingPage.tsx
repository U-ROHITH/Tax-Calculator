'use client';

import { useState } from 'react';
import { Check, Minus, X, Mail } from 'lucide-react';

type Billing = 'monthly' | 'annual';

// ─── Coming Soon Modal ───────────────────────────────────────────────────────

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Coming Soon</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              We&apos;re working on this feature. Be the first to know when it launches.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3 p-3 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg">
            <Check className="h-4 w-4 text-[var(--success)] shrink-0" />
            <p className="text-sm text-[var(--success)] font-medium">
              You&apos;re on the list. We&apos;ll notify you at {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Feature row cell ────────────────────────────────────────────────────────

function FeatureCell({ included }: { included: boolean }) {
  return included ? (
    <Check className="h-4 w-4 text-[var(--success)] mx-auto" />
  ) : (
    <Minus className="h-4 w-4 text-[var(--text-muted)] mx-auto" />
  );
}

// ─── Comparison table ────────────────────────────────────────────────────────

interface ComparisonRow {
  feature: string;
  free: boolean;
  pro: boolean;
  ca: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: 'Tax calculators (India, US, UK)', free: true, pro: true, ca: true },
  { feature: 'Old vs New regime comparison', free: true, pro: true, ca: true },
  { feature: 'PDF tax summary download', free: true, pro: true, ca: true },
  { feature: '3-country compare page', free: true, pro: true, ca: true },
  { feature: 'Tax planning tools', free: true, pro: true, ca: true },
  { feature: 'Loss carry-forward tracker', free: true, pro: true, ca: true },
  { feature: 'Document checklist', free: true, pro: true, ca: true },
  { feature: 'GST & TDS calculators', free: true, pro: true, ca: true },
  { feature: 'Crypto tax calculator', free: true, pro: true, ca: true },
  { feature: 'Freelancer SE calculator', free: true, pro: true, ca: true },
  { feature: 'AI Tax Assistant (unlimited)', free: false, pro: true, ca: true },
  { feature: 'IT Notice Response Generator', free: false, pro: true, ca: true },
  { feature: 'Form 16 & AIS PDF upload', free: false, pro: true, ca: true },
  { feature: 'Multi-year carry-forward history', free: false, pro: true, ca: true },
  { feature: 'Priority email support', free: false, pro: true, ca: true },
  { feature: 'Early access to new features', free: false, pro: true, ca: true },
  { feature: '60-min CA video consultation', free: false, pro: false, ca: true },
  { feature: 'ITR review before filing', free: false, pro: false, ca: true },
  { feature: 'Notice response with CA signature', free: false, pro: false, ca: true },
  { feature: 'Transfer pricing & FEMA guidance', free: false, pro: false, ca: true },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [showModal, setShowModal] = useState(false);

  const isAnnual = billing === 'annual';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto">
            Start free — upgrade when you need AI assistance, document upload, or a real CA.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 mt-6 p-1 bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg">
            <button
              onClick={() => setBilling('monthly')}
              className={[
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                billing === 'monthly'
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={[
                'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                billing === 'annual'
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              Annual
              <span className="px-1.5 py-0.5 text-xs font-semibold bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch mb-16">
          {/* Free */}
          <div className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Free</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                All core calculators. No account needed.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--text-primary)]">₹0</span>
                <span className="text-sm text-[var(--text-muted)]">/ always free</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'All 3 country tax calculators',
                'Old vs New regime comparison',
                'PDF tax summary download',
                'Compare page (3 countries)',
                'Tax planning tools',
                'Loss carry-forward tracker',
                'Document checklist',
                'GST & TDS calculators',
                'Crypto tax calculator',
                'Freelancer SE calculator',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[var(--success)] mt-0.5 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{feat}</span>
                </li>
              ))}
            </ul>

            <a
              href="/in"
              className="block w-full text-center px-4 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-raised)] transition-colors"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro */}
          <div className="flex flex-col bg-[var(--surface)] border-2 border-[var(--primary)] rounded-xl p-6 shadow-lg lg:scale-105">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pro</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-[var(--primary)] text-white rounded">
                  Most Popular
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                AI assistant, document upload, priority support.
              </p>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">
                    {isAnnual ? '₹399' : '₹499'}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Billed ₹4,788/yr &middot; $7/mo &middot; £6/mo
                  </p>
                )}
                {!isAnnual && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Also $9/month &middot; £7/month
                  </p>
                )}
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              <li className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Everything in Free, plus:
              </li>
              {[
                'AI Tax Assistant (unlimited queries)',
                'IT Notice Response Generator',
                'Form 16 & AIS PDF upload + auto-fill',
                'Multi-year carry-forward history',
                'Priority email support',
                'Early access to new features',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowModal(true)}
              className="block w-full text-center px-4 py-2.5 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
            >
              Coming Soon
            </button>
          </div>

          {/* CA Connect */}
          <div className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">CA Connect</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)] rounded">
                  For Complex Cases
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Expert Chartered Accountant consultation.
              </p>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)]">₹2,999</span>
                  <span className="text-sm text-[var(--text-muted)]">/consultation</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Per-session pricing, no subscription</p>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              <li className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Everything in Pro, plus:
              </li>
              {[
                '60-minute video consultation with verified CA',
                'Review of your actual ITR before filing',
                'Notice response with CA signature',
                'Transfer pricing & business restructuring',
                'FEMA/RBI compliance guidance',
              ].map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[var(--success)] mt-0.5 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{feat}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowModal(true)}
              className="block w-full text-center px-4 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-raised)] transition-colors"
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Feature comparison table */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            Full feature comparison
          </h2>
          <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)] w-1/2">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--text-primary)]">
                    Free
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--primary)]">
                    Pro
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--text-primary)]">
                    CA Connect
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--surface)]">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={[
                      'border-b border-[var(--border)] last:border-0',
                      idx % 2 === 0 ? '' : 'bg-[var(--surface-raised)]/40',
                    ].join(' ')}
                  >
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      <FeatureCell included={row.free} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <FeatureCell included={row.pro} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <FeatureCell included={row.ca} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          All prices shown include applicable taxes. Pro and CA Connect features are in development. No charges will be collected until launch.
        </p>
      </div>
    </div>
  );
}
