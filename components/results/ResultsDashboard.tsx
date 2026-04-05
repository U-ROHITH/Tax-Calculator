'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  TrendingDown,
  Wallet,
  PieChart as PieIcon,
  BarChart2,
  FileText,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { TaxResult, IndiaInput } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';
import TaxBreakdownChart from './TaxBreakdownChart';
import BracketWaterfall from './BracketWaterfall';
import MonthlyBreakdown from './MonthlyBreakdown';
import RegimeComparison from './RegimeComparison';
import SavingTips from './SavingTips';

interface Props {
  result: TaxResult;
  indiaInput?: Partial<IndiaInput>;
}

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
      <p className={`mt-1.5 text-xl font-bold num tracking-tight ${accent ?? 'text-[var(--text-primary)]'}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-[var(--text-muted)] num">{sub}</p>}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--border)] transition-colors"
      >
        <Icon className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
        <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
        <span className="ml-auto">
          {open ? (
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
          )}
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function TableRow({
  label,
  value,
  accent,
  bold,
  indent,
}: {
  label: string;
  value: string;
  accent?: string;
  bold?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] last:border-0 ${bold ? 'bg-[var(--surface-raised)]' : ''}`}
    >
      <span
        className={`text-sm ${bold ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'} ${indent ? 'pl-3' : ''}`}
      >
        {label}
      </span>
      <span className={`text-sm num font-${bold ? 'bold' : 'medium'} ${accent ?? 'text-[var(--text-primary)]'}`}>
        {value}
      </span>
    </div>
  );
}

// India tax brackets for visual breakdown
const INDIA_NEW_REGIME_BRACKETS = [
  { from: 0, to: 400000, rate: 0, label: 'Exempt' },
  { from: 400000, to: 800000, rate: 0.05, label: '5%' },
  { from: 800000, to: 1200000, rate: 0.10, label: '10%' },
  { from: 1200000, to: 1600000, rate: 0.15, label: '15%' },
  { from: 1600000, to: 2000000, rate: 0.20, label: '20%' },
  { from: 2000000, to: 2400000, rate: 0.25, label: '25%' },
  { from: 2400000, to: null, rate: 0.30, label: '30%' },
];

const INDIA_OLD_REGIME_BRACKETS = [
  { from: 0, to: 250000, rate: 0, label: 'Exempt' },
  { from: 250000, to: 500000, rate: 0.05, label: '5%' },
  { from: 500000, to: 1000000, rate: 0.20, label: '20%' },
  { from: 1000000, to: null, rate: 0.30, label: '30%' },
];

const BRACKET_COLORS = [
  '#16A34A', // 0% — green
  '#65A30D', // 5% — lime
  '#CA8A04', // 10% — yellow
  '#D97706', // 15% — amber
  '#EA580C', // 20% — orange
  '#DC2626', // 25% — red-orange
  '#991B1B', // 30% — dark red
];

const CAP_INCOME = 3000000; // ₹30L display cap

function MarginalRateExplainer({
  grossIncome,
  regime,
  effectiveRate,
  marginalRate,
  currency,
}: {
  grossIncome: number;
  regime: 'old' | 'new';
  effectiveRate: number;
  marginalRate: number;
  currency: string;
}) {
  const brackets = regime === 'old' ? INDIA_OLD_REGIME_BRACKETS : INDIA_NEW_REGIME_BRACKETS;
  const cappedIncome = Math.min(grossIncome, CAP_INCOME);
  const markerPct = (cappedIncome / CAP_INCOME) * 100;

  // Determine marginal bracket label
  const marginalBracket = brackets.slice().reverse().find((b) => grossIncome > b.from);
  const marginalRateDisplay = marginalBracket ? `${Math.round(marginalBracket.rate * 100)}%` : '0%';

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Part C: Effective vs Marginal info card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">Effective Rate</p>
          <p className="text-2xl font-bold num text-[var(--primary)]">{formatPercent(effectiveRate)}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
            Your actual tax as % of total income. Every rupee of income on average is taxed at this rate.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">Marginal Rate</p>
          <p className="text-2xl font-bold num text-[var(--warning)]">{formatPercent(marginalRate)}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
            Tax on your next rupee of income. Any bonus, freelance income, or FD interest will be taxed at this rate.
          </p>
        </div>
      </div>

      {/* High bracket warning */}
      {marginalRate >= 0.30 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/8 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-[var(--danger)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--danger)] leading-relaxed">
            You are in the top 30% bracket. Any additional income (freelance, FD interest, bonus, etc.) will cost you 31.2 paise per rupee (including 4% health &amp; education cess).
          </p>
        </div>
      )}

      {/* Bracket bar visualization */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">
          Tax Bracket Bar — your income vs slabs (capped at ₹30L)
        </p>
        <div className="relative h-8 rounded-md overflow-hidden flex" style={{ background: 'var(--surface-raised)' }}>
          {brackets.map((bracket, i) => {
            const segFrom = bracket.from;
            const segTo = bracket.to ?? CAP_INCOME;
            const segWidth = ((Math.min(segTo, CAP_INCOME) - Math.min(segFrom, CAP_INCOME)) / CAP_INCOME) * 100;
            if (segWidth <= 0) return null;
            return (
              <div
                key={i}
                title={`${bracket.label}: ₹${(bracket.from / 100000).toFixed(0)}L – ${bracket.to ? `₹${(bracket.to / 100000).toFixed(0)}L` : '∞'}`}
                style={{
                  width: `${segWidth}%`,
                  backgroundColor: BRACKET_COLORS[i] ?? BRACKET_COLORS[BRACKET_COLORS.length - 1],
                  opacity: 0.85,
                  flexShrink: 0,
                }}
              />
            );
          })}
          {/* Income marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
            style={{ left: `${Math.min(markerPct, 99.5)}%` }}
          />
        </div>
        {/* Scale labels */}
        <div className="flex justify-between mt-1 text-xs num text-[var(--text-muted)]">
          <span>₹0</span>
          <span>₹10L</span>
          <span>₹20L</span>
          <span>₹30L+</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5">
          <span className="font-semibold text-[var(--text-primary)]">Your next ₹1 of income is taxed at {marginalRateDisplay}</span>
          {grossIncome > CAP_INCOME && (
            <span className="text-[var(--text-muted)]"> (income exceeds ₹30L cap — marker shown at right edge)</span>
          )}
        </p>
      </div>

      {/* Breakeven table */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Bracket Breakeven Points</p>
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="grid grid-cols-4 px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide bg-[var(--surface-raised)]">
            <span>Bracket</span>
            <span className="num">From</span>
            <span className="num">To</span>
            <span className="text-right num">Rate</span>
          </div>
          {brackets.map((bracket, i) => {
            const isActive = grossIncome > bracket.from && (bracket.to === null || grossIncome <= bracket.to);
            return (
              <div
                key={i}
                className={`grid grid-cols-4 px-3 py-2 border-t border-[var(--border)] text-xs ${isActive ? 'bg-[var(--primary)]/8' : ''}`}
              >
                <span className={`font-medium ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {bracket.label}
                  {isActive && <span className="ml-1 text-[var(--primary)]">←</span>}
                </span>
                <span className="num text-[var(--text-secondary)]">
                  {bracket.from === 0 ? '₹0' : `₹${(bracket.from / 100000).toFixed(0)}L`}
                </span>
                <span className="num text-[var(--text-secondary)]">
                  {bracket.to === null ? '∞' : `₹${(bracket.to / 100000).toFixed(0)}L`}
                </span>
                <span className={`text-right num font-semibold ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                  {Math.round(bracket.rate * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ResultsDashboard({ result, indiaInput }: Props) {
  const [downloading, setDownloading] = useState(false);
  const { grossIncome, totalTax, netIncome, effectiveRate, marginalRate, currency, breakdown } = result;

  // Tax Saving Opportunities — India only, old/auto regime
  const taxSavingOpportunities: {
    label: string;
    investmentNote: string;
    headroom: number;
    saving: number;
  }[] = (() => {
    if (result.country !== 'IN' || !indiaInput) return [];
    const regime = indiaInput.regime ?? 'auto';
    if (regime === 'new') return [];

    const opportunities: {
      label: string;
      investmentNote: string;
      headroom: number;
      saving: number;
    }[] = [];

    // 80C headroom
    const used80C = indiaInput.section80C || 0;
    const headroom80C = Math.max(0, 150000 - used80C);
    if (headroom80C > 0) {
      opportunities.push({
        label: '80C (unused)',
        investmentNote: `\u20B9${headroom80C.toLocaleString('en-IN')} in PPF/ELSS/LIC`,
        headroom: headroom80C,
        saving: headroom80C * result.marginalRate,
      });
    }

    // 80CCD(1B) NPS extra
    const usedNPS1B = indiaInput.section80CCD1B || 0;
    if (usedNPS1B < 50000) {
      const headroomNPS = 50000 - usedNPS1B;
      opportunities.push({
        label: '80CCD(1B) NPS',
        investmentNote: `\u20B9${headroomNPS.toLocaleString('en-IN')} in NPS`,
        headroom: headroomNPS,
        saving: headroomNPS * result.marginalRate,
      });
    }

    // 80D health insurance
    const used80D = indiaInput.section80D_self || 0;
    const limit80D = indiaInput.age === '60to80' || indiaInput.age === 'above80' ? 50000 : 25000;
    if (used80D < limit80D) {
      const h = limit80D - used80D;
      opportunities.push({
        label: '80D Medical Insurance',
        investmentNote: `\u20B9${h.toLocaleString('en-IN')} premium`,
        headroom: h,
        saving: h * result.marginalRate,
      });
    }

    return opportunities;
  })();

  const totalPotentialSaving = taxSavingOpportunities.reduce((s, o) => s + o.saving, 0);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { generateTaxPDF } = await import('@/lib/pdf');
      await generateTaxPDF(result, false);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* PDF download */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Tax Assessment</h2>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {downloading ? 'Generating\u2026' : 'Download PDF'}
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Gross Income', value: formatByCurrency(grossIncome, currency) },
          { label: 'Total Tax', value: formatByCurrency(totalTax, currency), accent: 'text-[var(--danger)]' },
          { label: 'Net Income', value: formatByCurrency(netIncome, currency), accent: 'text-[var(--success)]' },
          {
            label: 'Effective Rate',
            value: formatPercent(effectiveRate),
            sub: `Marginal: ${formatPercent(marginalRate)}`,
            accent: 'text-[var(--primary)]',
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.22 }}
          >
            <SummaryCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Marginal Rate Analysis (India only) */}
      {result.country === 'IN' && result.regime && (
        <Section title="Marginal Rate Analysis" icon={TrendingUp} defaultOpen={false}>
          <MarginalRateExplainer
            grossIncome={result.grossIncome}
            regime={result.regime}
            effectiveRate={result.effectiveRate}
            marginalRate={result.marginalRate}
            currency={currency}
          />
        </Section>
      )}

      {/* Tax Saving Opportunities (India old/auto regime) */}
      {taxSavingOpportunities.length > 0 && (
        <Section title="Tax Saving Opportunities" icon={Lightbulb} defaultOpen={false}>
          {totalPotentialSaving > 10000 && (
            <div className="mx-4 mt-4 rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3">
              <p className="text-sm font-semibold text-[var(--success)]">
                You could save up to {formatByCurrency(Math.round(totalPotentialSaving), currency)} more in tax with
                these investments
              </p>
            </div>
          )}
          <div className="mt-3 mx-4 mb-4 rounded-lg border border-[var(--border)] overflow-hidden">
            <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide bg-[var(--surface-raised)]">
              <span>Deduction</span>
              <span className="text-center">Investment Needed</span>
              <span className="text-right num">Tax You Save</span>
            </div>
            {taxSavingOpportunities.map((opp) => (
              <div
                key={opp.label}
                className="grid grid-cols-3 px-4 py-2.5 border-t border-[var(--border)] text-sm"
              >
                <span className="text-[var(--text-secondary)]">{opp.label}</span>
                <span className="text-center text-[var(--text-secondary)] text-xs">{opp.investmentNote}</span>
                <span className="text-right num font-medium text-[var(--success)]">
                  {formatByCurrency(Math.round(opp.saving), currency)}
                </span>
              </div>
            ))}
            <div className="grid grid-cols-3 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--surface-raised)] text-sm font-semibold">
              <span className="text-[var(--text-primary)]">Total potential saving</span>
              <span />
              <span className="text-right num text-[var(--success)]">
                {formatByCurrency(Math.round(totalPotentialSaving), currency)}
              </span>
            </div>
          </div>
        </Section>
      )}

      {/* India regime comparison */}
      {result.regime && result.alternateResult && (
        <RegimeComparison primary={result} alternate={result.alternateResult} />
      )}

      {/* ITR recommendation + advance tax (India) */}
      {result.itrFormRecommended && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Recommended ITR Form</p>
            <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{result.itrFormRecommended}</p>
          </div>
          {result.totalTaxPayable !== undefined && (
            <div className="text-right">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Tax Still Payable</p>
              <p
                className={`text-sm font-bold num mt-0.5 ${result.totalTaxPayable > 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}
              >
                {formatByCurrency(result.totalTaxPayable, currency)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tax computation breakdown */}
      <Section title="Tax Computation" icon={FileText}>
        {result.grossTotalIncome !== undefined && (
          <TableRow label="Gross Total Income" value={formatByCurrency(result.grossTotalIncome, currency)} bold />
        )}
        {result.totalDeductions !== undefined && result.totalDeductions > 0 && (
          <TableRow
            label="Less: Deductions (Chapter VI-A)"
            value={`(${formatByCurrency(result.totalDeductions, currency)})`}
            accent="text-[var(--success)]"
          />
        )}
        {result.taxableIncome !== undefined && (
          <TableRow label="Taxable Income" value={formatByCurrency(result.taxableIncome, currency)} bold />
        )}
        {breakdown.map((item) => (
          <TableRow
            key={item.label}
            label={item.label}
            value={formatByCurrency(item.amount, currency)}
            accent={item.amount < 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}
            indent
          />
        ))}
        <TableRow
          label="Total Tax Liability"
          value={formatByCurrency(totalTax, currency)}
          accent="text-[var(--danger)]"
          bold
        />
      </Section>

      {/* Charts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="Tax Components" icon={PieIcon} defaultOpen>
          <div className="px-2 py-2">
            <TaxBreakdownChart breakdown={breakdown} currency={currency} />
          </div>
        </Section>
        <Section title="Take-Home Summary" icon={Wallet} defaultOpen>
          <MonthlyBreakdown result={result} />
        </Section>
      </div>

      {/* Bracket waterfall */}
      {result.bracketDetails.length > 0 && (
        <Section title="Tax by Bracket" icon={BarChart2}>
          <div className="px-2 py-2">
            <BracketWaterfall bracketDetails={result.bracketDetails} currency={currency} />
          </div>
        </Section>
      )}

      {/* Advance Tax Schedule (India) */}
      {result.advanceTaxSchedule && result.advanceTaxSchedule.length > 0 && (
        <Section title="Advance Tax Schedule" icon={TrendingDown} defaultOpen={false}>
          <div className="divide-y divide-[var(--border)]">
            <div className="grid grid-cols-3 px-4 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide bg-[var(--surface-raised)]">
              <span>Due Date</span>
              <span className="text-center">Cumulative %</span>
              <span className="text-right num">Amount Due</span>
            </div>
            {result.advanceTaxSchedule.map((ins) => (
              <div key={ins.dueDate} className="grid grid-cols-3 px-4 py-2.5 text-sm">
                <span className="text-[var(--text-secondary)]">{ins.dueDate}</span>
                <span className="text-center text-[var(--text-secondary)]">{ins.cumulativePercent}%</span>
                <span className="text-right num font-medium text-[var(--text-primary)]">
                  {formatByCurrency(ins.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Saving Tips */}
      {result.tips.length > 0 && <SavingTips tips={result.tips} currency={currency} />}
    </motion.div>
  );
}
