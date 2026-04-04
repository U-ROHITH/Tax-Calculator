'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaxResult } from '@/engine/types';
import { formatByCurrency, formatPercent } from '@/lib/formatters';
import TaxBreakdownChart from './TaxBreakdownChart';
import BracketWaterfall from './BracketWaterfall';
import MonthlyBreakdown from './MonthlyBreakdown';
import RegimeComparison from './RegimeComparison';
import SavingTips from './SavingTips';

interface Props {
  result: TaxResult;
}

export default function ResultsDashboard({ result }: Props) {
  const [downloading, setDownloading] = useState(false);
  const { grossIncome, totalTax, netIncome, effectiveRate, marginalRate, currency, breakdown } = result;

  const handleDownloadPDF = async () => {
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
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* PDF Download */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold shadow-sm transition-all hover:bg-accent disabled:opacity-50"
        >
          {downloading ? '⏳ Generating...' : '📄 Download PDF Report'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Gross Income', value: formatByCurrency(grossIncome, currency), color: 'text-foreground' },
          { label: 'Total Tax', value: formatByCurrency(totalTax, currency), color: 'text-red-600' },
          { label: 'Net Income', value: formatByCurrency(netIncome, currency), color: 'text-green-600' },
          { label: 'Effective Rate', value: formatPercent(effectiveRate), color: 'text-primary' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="rounded-xl border border-border bg-card p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
          >
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-lg font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Marginal rate badge */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Marginal Rate:</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {formatPercent(marginalRate)}
        </span>
        {result.regime && (
          <>
            <span className="text-muted-foreground ml-2">Regime:</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 capitalize">
              {result.regime}
            </span>
          </>
        )}
      </div>

      {/* India regime comparison */}
      {result.regime && result.alternateResult && (
        <RegimeComparison primary={result} alternate={result.alternateResult} />
      )}

      {/* Charts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TaxBreakdownChart breakdown={breakdown} currency={currency} />
        <MonthlyBreakdown result={result} />
      </div>

      {/* Bracket waterfall */}
      {result.bracketDetails.length > 0 && (
        <BracketWaterfall bracketDetails={result.bracketDetails} currency={currency} />
      )}

      {/* Breakdown table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Tax Breakdown</h3>
        </div>
        <div className="divide-y divide-border">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {item.color && (
                  <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                )}
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{formatByCurrency(item.amount, currency)}</span>
                {item.rate !== undefined && (
                  <span className="ml-2 text-xs text-muted-foreground">({formatPercent(item.rate)})</span>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
            <span className="text-sm font-semibold">Total Tax</span>
            <span className="text-sm font-bold text-red-600">{formatByCurrency(totalTax, currency)}</span>
          </div>
        </div>
      </div>

      {/* Saving tips */}
      {result.tips.length > 0 && <SavingTips tips={result.tips} currency={currency} />}
    </motion.div>
  );
}
