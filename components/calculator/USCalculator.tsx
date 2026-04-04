'use client';

import { useState } from 'react';
import { TaxResult } from '@/engine/types';
import USForm from './USForm';
import ResultsDashboard from '@/components/results/ResultsDashboard';

export default function USCalculator() {
  const [result, setResult] = useState<TaxResult | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">🇺🇸 US Income Tax Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          TY 2025 · Federal Brackets · FICA &amp; Medicare · State Tax (CA, NY, TX, FL, WA)
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold">Enter your details</h2>
          <USForm onResult={setResult} />
        </div>

        <div>
          {result ? (
            <ResultsDashboard result={result} />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div>
                <div className="mb-3 text-5xl">🇺🇸</div>
                <p className="text-sm font-medium">Enter your income to see your federal &amp; state tax</p>
                <p className="mt-1 text-xs text-muted-foreground">Includes FICA, Medicare, and self-employment tax</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
