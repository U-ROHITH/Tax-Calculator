import type { Metadata } from 'next';
import USCalculator from '@/components/calculator/USCalculator';

export const metadata: Metadata = {
  title: 'US Income Tax Calculator 2025 — Federal, State & FICA',
  description:
    'Free US federal income tax calculator for TY 2025. Calculate federal brackets, Social Security, Medicare, self-employment tax, and state tax for CA, NY, TX, FL, WA.',
  keywords: [
    'income tax calculator USA',
    'federal tax calculator 2025',
    'take home pay calculator',
    'FICA calculator',
    'self employment tax calculator',
    'California income tax calculator',
    'New York tax calculator',
  ],
  openGraph: {
    title: 'US Income Tax Calculator 2025',
    description: 'Federal brackets, FICA, Medicare, state tax. Free, instant, no signup.',
  },
};

export default function USPage() {
  return <USCalculator />;
}
