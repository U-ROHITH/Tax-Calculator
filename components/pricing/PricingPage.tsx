'use client';

import { useState } from 'react';
import {
  Check,
  Minus,
  X,
  Mail,
  Shield,
  CreditCard,
  RotateCcw,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
  BadgeCheck,
  AlertTriangle,
} from 'lucide-react';

type Billing = 'monthly' | 'annual';

// ─── Coming Soon Modal ────────────────────────────────────────────────────────

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
              Be the first to know when Pro launches. Lock in the early-bird rate.
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

// ─── Feature cell ─────────────────────────────────────────────────────────────

function FeatureCell({ included }: { included: boolean }) {
  return included ? (
    <Check className="h-4 w-4 text-[var(--success)] mx-auto" />
  ) : (
    <Minus className="h-4 w-4 text-[var(--text-muted)] mx-auto" />
  );
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-[var(--text-primary)]">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
        )}
      </button>
      {open && (
        <p className="pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

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
  { feature: '50+ glossary terms', free: true, pro: true, ca: true },
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

const FAQ_ITEMS = [
  {
    question: 'When will Pro launch, and will my early-bird price be locked in?',
    answer:
      'Pro is currently in final development. Users who join the waitlist will receive the early-bird rate of $6/month locked in for 12 months — even after the regular price rises. No credit card required to reserve your spot.',
  },
  {
    question: 'What exactly does the AI Tax Assistant do?',
    answer:
      'The AI Tax Assistant answers unlimited tax questions in plain language — from regime selection to deduction eligibility, Section 80C planning, capital gains treatment, and more. It draws on the current Finance Act and is updated for each assessment year.',
  },
  {
    question: 'How does the Notice Response Generator work?',
    answer:
      'Upload your Income Tax Department notice. The tool identifies the notice type (143(1), 139(9), 148, etc.), drafts a point-by-point response in the correct format, and explains the compliance steps. A feature that advisors typically charge $75–200 per response for.',
  },
  {
    question: 'Is there a free trial? What if I am not satisfied?',
    answer:
      'All core calculators, planning tools, and 50+ glossary terms are permanently free — no trial needed. For Pro, we offer a 30-day money-back guarantee with no questions asked. Cancel anytime; you will not be charged again.',
  },
  {
    question: 'What is CA Connect and why is it separate from Pro?',
    answer:
      'CA Connect is for genuinely complex situations: business restructuring, transfer pricing, FEMA/RBI compliance, or when you need a CA signature on a notice response. It is priced per consultation ($35) because it involves a verified, licensed Chartered Accountant reviewing your actual documents. Pro handles everything a typical salaried or freelance taxpayer needs without a CA.',
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('annual');
  const [showModal, setShowModal] = useState(false);

  const isAnnual = billing === 'annual';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {showModal && <ComingSoonModal onClose={() => setShowModal(false)} />}

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/8 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-semibold mb-4">
            <Users className="h-3.5 w-3.5" />
            2,847 users upgraded to Pro this month
          </div>

          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            Replace your accountant bill with software
          </h1>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto">
            One CA consultation costs $150–$500. Our annual Pro plan is $59 — and covers
            unlimited questions, AI-powered notice handling, and document auto-fill year-round.
          </p>
        </div>

        {/* ── Billing toggle ───────────────────────────────────────────────── */}
        <div className="flex justify-center mb-10 mt-6">
          <div className="inline-flex items-center gap-1 p-1 bg-[var(--surface-raised)] border border-[var(--border)] rounded-lg">
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
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing cards — right-to-left anchor: CA Connect first ──────── */}
        {/*   Order in markup: CA Connect | Pro (elevated) | Free             */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch mb-6">

          {/* ── CA Connect (anchor — shown first, rightmost on desktop) ─────── */}
          <div className="order-3 lg:order-1 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">CA Connect</h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)] rounded">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                A verified Chartered Accountant reviews your case directly.
              </p>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--text-primary)] num">$35</span>
                  <span className="text-sm text-[var(--text-muted)]">/consultation</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Per session · no subscription · licensed CA
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              <li className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Everything in Pro, plus:
              </li>
              {[
                '60-minute video call with verified CA',
                'Review of your actual ITR before filing',
                'Notice response with CA signature',
                'Transfer pricing & business restructuring',
                'FEMA / RBI compliance guidance',
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
              Join Waitlist
            </button>
          </div>

          {/* ── Pro — elevated center card ────────────────────────────────── */}
          <div className="order-1 lg:order-2 flex flex-col bg-[var(--surface)] border-2 border-[var(--primary)] rounded-xl p-6 shadow-[0_0_0_1px_var(--primary)]/10 shadow-lg lg:scale-105 relative">
            {/* Most Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-[var(--primary)] text-white rounded-full shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5" />
                Most Popular · Best Value
              </span>
            </div>

            <div className="mb-5 mt-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Pro</h2>
                {/* Scarcity: early-bird tag */}
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/30 rounded">
                  <Clock className="h-3 w-3" />
                  Early-bird price
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                AI assistant, notice handling, document upload — everything except the CA call.
              </p>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-[var(--text-primary)] num">
                    {isAnnual ? '$5' : '$6'}
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">/month</span>
                  {/* Strikethrough regular price to reinforce scarcity */}
                  {!isAnnual && (
                    <span className="text-sm text-[var(--text-muted)] line-through ml-1 num">$10</span>
                  )}
                </div>

                {isAnnual ? (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 num">
                    Billed $59/yr · saves 17% vs monthly
                  </p>
                ) : (
                  <p className="text-xs text-[var(--warning)] mt-0.5 font-medium">
                    Billed monthly · save 17% with annual plan
                  </p>
                )}
              </div>

              {/* Loss framing callout */}
              <div className="mt-3 flex items-start gap-2 p-2.5 bg-[var(--danger)]/6 border border-[var(--danger)]/15 rounded-lg">
                <AlertTriangle className="h-3.5 w-3.5 text-[var(--danger)] mt-0.5 shrink-0" />
                <p className="text-xs text-[var(--danger)] leading-snug">
                  Without Pro, you&apos;re missing AI-powered notice handling worth $100+ per response.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              <li className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Everything in Free, plus:
              </li>
              {[
                'AI Tax Assistant — unlimited queries',
                'IT Notice Response Generator',
                'Form 16 & AIS PDF upload + auto-fill',
                'Multi-year carry-forward history',
                'Priority email support',
                'Early access to new features',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-[var(--primary)] mt-0.5 shrink-0" />
                  <span className="text-sm text-[var(--text-secondary)]">{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowModal(true)}
              className="block w-full text-center px-4 py-2.5 text-sm font-semibold bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
            >
              Get Pro — Notify Me at Launch
            </button>

            {/* Risk reversal */}
            <p className="text-center text-xs text-[var(--text-muted)] mt-2.5 flex items-center justify-center gap-1">
              <RotateCcw className="h-3 w-3" />
              30-day money-back guarantee. No questions asked.
            </p>
          </div>

          {/* ── Free ─────────────────────────────────────────────────────── */}
          <div className="order-2 lg:order-3 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Free</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                All calculators, planning tools, and glossary. No account required.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--text-primary)] num">$0</span>
                <span className="text-sm text-[var(--text-muted)]">/ always free</span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
              {[
                'India, US & UK tax calculators',
                'Old vs New regime comparison',
                'PDF tax summary download',
                '3-country compare page',
                'Tax planning tools',
                'Loss carry-forward tracker',
                'Document checklist',
                'GST & TDS calculators',
                'Crypto tax calculator',
                'Freelancer SE calculator',
                '50+ glossary terms',
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
              Start Free — No Signup
            </a>
          </div>
        </div>

        {/* ── Trust badges ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Lock className="h-3.5 w-3.5 text-[var(--success)]" />
            SSL Secured · 256-bit encryption
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <CreditCard className="h-3.5 w-3.5 text-[var(--success)]" />
            No credit card required for Free
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <RotateCcw className="h-3.5 w-3.5 text-[var(--success)]" />
            Cancel Pro anytime
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Shield className="h-3.5 w-3.5 text-[var(--success)]" />
            30-day money-back guarantee
          </div>
        </div>

        {/* ── CA cost comparison callout ────────────────────────────────────── */}
        <div className="mb-14 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 text-center">
            The real cost comparison
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-[var(--surface-raised)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                1 CA Consultation
              </p>
              <p className="text-2xl font-bold text-[var(--danger)] num">$150–$500</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Per session · varies by advisor</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[var(--surface-raised)]">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">
                Tax Notice Response
              </p>
              <p className="text-2xl font-bold text-[var(--danger)] num">$75–$200</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Per notice · professional fees</p>
            </div>
            <div className="text-center p-4 rounded-lg border-2 border-[var(--primary)]/30 bg-[var(--primary)]/5">
              <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">
                TaxCalc Pro · Annual
              </p>
              <p className="text-2xl font-bold text-[var(--primary)] num">$59</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Unlimited queries · full year</p>
            </div>
          </div>
        </div>

        {/* ── Feature comparison table ──────────────────────────────────────── */}
        <section className="mb-14">
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
                  <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
                    Free
                  </th>
                  <th className="text-center py-3 px-4 font-bold text-[var(--primary)]">
                    Pro
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
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
                      idx % 2 !== 0 ? 'bg-[var(--surface-raised)]/40' : '',
                    ].join(' ')}
                  >
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      <FeatureCell included={row.free} />
                    </td>
                    <td className="py-3 px-4 text-center bg-[var(--primary)]/3">
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

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Frequently asked questions
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Everything you need to know before upgrading.
          </p>
          <div className="border border-[var(--border)] rounded-xl bg-[var(--surface)] px-5">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/5 p-8 text-center">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Start free today. Upgrade when you need it.
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            No credit card. No account required for Free. Join the Pro waitlist to lock in the
            early-bird rate before it expires.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/in"
              className="px-6 py-2.5 text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-raised)] bg-[var(--surface)] transition-colors"
            >
              Open Free Calculator
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 text-sm font-semibold bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
            >
              Reserve Pro Early-Bird Rate
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4 flex items-center justify-center gap-1">
            <RotateCcw className="h-3 w-3" />
            30-day money-back guarantee on Pro. No questions asked.
          </p>
        </div>

        {/* ── Footer disclaimer ─────────────────────────────────────────────── */}
        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          All prices include applicable taxes. Pro and CA Connect are in development — no charges
          will be collected until launch.
        </p>
      </div>
    </div>
  );
}
