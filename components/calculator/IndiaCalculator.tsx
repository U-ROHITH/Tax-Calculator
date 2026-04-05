'use client';

import { useState, useEffect } from 'react';
import { TaxResult } from '@/engine/types';
import { IndiaInput } from '@/engine/types';
import IndiaForm from './IndiaForm';
import ResultsDashboard from '@/components/results/ResultsDashboard';

export default function IndiaCalculator() {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [indiaInput, setIndiaInput] = useState<Partial<IndiaInput> | null>(null);
  const [prefillValues, setPrefillValues] = useState<Partial<IndiaInput> | null>(null);

  useEffect(() => {
    const prefill = localStorage.getItem('taxcalc_prefill');
    if (prefill) {
      try {
        const data = JSON.parse(prefill);
        const age = Date.now() - data.timestamp;
        if (age < 10 * 60 * 1000) {
          setPrefillValues(data.values as Partial<IndiaInput>);
          localStorage.removeItem('taxcalc_prefill');
        }
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">🇮🇳 India Income Tax Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          FY 2025-26 · Old &amp; New Regime · Section 87A Rebate · HRA &amp; Chapter VI-A Deductions
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold">Enter your details</h2>
          <IndiaForm onResult={setResult} onInputChange={setIndiaInput} initialValues={prefillValues ?? undefined} />
        </div>

        <div>
          {result ? (
            <ResultsDashboard result={result} indiaInput={indiaInput ?? undefined} />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div>
                <div className="mb-3 text-5xl">🇮🇳</div>
                <p className="text-sm font-medium">Enter your income to see your tax breakdown</p>
                <p className="mt-1 text-xs text-muted-foreground">Auto mode picks the best regime for you</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
