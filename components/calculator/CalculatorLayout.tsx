'use client';

import { useState } from 'react';
import { TaxResult } from '@/engine/types';
import ResultsDashboard from '@/components/results/ResultsDashboard';

interface Props {
  title: string;
  subtitle: string;
  flag: string;
  formComponent: React.ReactNode;
  onResult?: (result: TaxResult | null) => void;
}

export default function CalculatorLayout({ title, subtitle, flag, formComponent }: Props) {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleResult = (r: TaxResult | null) => {
    setResult(r);
    if (r) setShowResults(true);
  };

  // Clone the form component to pass handleResult
  const form = formComponent as React.ReactElement<{ onResult: (r: TaxResult | null) => void }>;
  const formWithHandler = { ...form, props: { ...form.props, onResult: handleResult } };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {flag} {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form column */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold">Enter your details</h2>
          {formWithHandler}
        </div>

        {/* Results column */}
        <div>
          {result ? (
            <ResultsDashboard result={result} />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div>
                <div className="mb-3 text-4xl">{flag}</div>
                <p className="text-sm text-muted-foreground">
                  Enter your income details to see your tax breakdown
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky results button */}
      {result && !showResults && (
        <div className="fixed bottom-6 left-0 right-0 mx-4 lg:hidden">
          <button
            onClick={() => setShowResults(true)}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg"
          >
            View Results →
          </button>
        </div>
      )}
    </div>
  );
}
