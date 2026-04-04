'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingDown, Wallet, PieChart as PieIcon, BarChart2, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { TaxResult } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';
import TaxBreakdownChart from './TaxBreakdownChart';
import BracketWaterfall from './BracketWaterfall';
import MonthlyBreakdown from './MonthlyBreakdown';
import RegimeComparison from './RegimeComparison';
import SavingTips from './SavingTips';

interface Props { result: TaxResult }

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
      <p className={`mt-1.5 text-xl font-bold num tracking-tight ${accent ?? 'text-[var(--text-primary)]'}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--text-muted)] num">{sub}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--border)] transition-colors">
        <Icon className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
        <span className="text-sm font-semibold text-[var(--text-primary)]">{title}</span>
        <span className="ml-auto">{open ? <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" /> : <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function TableRow({ label, value, accent, bold, indent }: {
  label: string; value: string; accent?: string; bold?: boolean; indent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] last:border-0 ${bold ? 'bg-[var(--surface-raised)]' : ''}`}>
      <span className={`text-sm ${bold ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'} ${indent ? 'pl-3' : ''}`}>{label}</span>
      <span className={`text-sm num font-${bold ? 'bold' : 'medium'} ${accent ?? 'text-[var(--text-primary)]'}`}>{value}</span>
    </div>
  );
}

export default function ResultsDashboard({ result }: Props) {
  const [downloading, setDownloading] = useState(false);
  const { grossIncome, totalTax, netIncome, effectiveRate, marginalRate, currency, breakdown } = result;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { generateTaxPDF } = await import('@/lib/pdf');
      await generateTaxPDF(result, false);
    } catch (e) { console.error(e); } finally { setDownloading(false); }
  };

  return (
    <motion.div className="space-y-4"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* PDF download */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Tax Assessment</h2>
        <button onClick={handleDownload} disabled={downloading}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-50">
          <Download className="h-3.5 w-3.5" />
          {downloading ? 'Generating…' : 'Download PDF'}
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Gross Income', value: formatByCurrency(grossIncome, currency) },
          { label: 'Total Tax', value: formatByCurrency(totalTax, currency), accent: 'text-[var(--danger)]' },
          { label: 'Net Income', value: formatByCurrency(netIncome, currency), accent: 'text-[var(--success)]' },
          { label: 'Effective Rate', value: formatPercent(effectiveRate), sub: `Marginal: ${formatPercent(marginalRate)}`, accent: 'text-[var(--primary)]' },
        ].map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.22 }}>
            <SummaryCard {...card} />
          </motion.div>
        ))}
      </div>

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
              <p className={`text-sm font-bold num mt-0.5 ${result.totalTaxPayable > 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
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
          <TableRow label="Less: Deductions (Chapter VI-A)" value={`(${formatByCurrency(result.totalDeductions, currency)})`} accent="text-[var(--success)]" />
        )}
        {result.taxableIncome !== undefined && (
          <TableRow label="Taxable Income" value={formatByCurrency(result.taxableIncome, currency)} bold />
        )}
        {breakdown.map((item) => (
          <TableRow key={item.label} label={item.label} value={formatByCurrency(item.amount, currency)}
            accent={item.amount < 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'} indent />
        ))}
        <TableRow label="Total Tax Liability" value={formatByCurrency(totalTax, currency)} accent="text-[var(--danger)]" bold />
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
              <span>Due Date</span><span className="text-center">Cumulative %</span><span className="text-right num">Amount Due</span>
            </div>
            {result.advanceTaxSchedule.map((ins) => (
              <div key={ins.dueDate} className="grid grid-cols-3 px-4 py-2.5 text-sm">
                <span className="text-[var(--text-secondary)]">{ins.dueDate}</span>
                <span className="text-center text-[var(--text-secondary)]">{ins.cumulativePercent}%</span>
                <span className="text-right num font-medium text-[var(--text-primary)]">{formatByCurrency(ins.amount, currency)}</span>
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
