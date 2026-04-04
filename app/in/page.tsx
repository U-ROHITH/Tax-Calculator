import type { Metadata } from 'next';
import IndiaCalculator from '@/components/calculator/IndiaCalculator';

export const metadata: Metadata = {
  title: 'India Income Tax Calculator FY 2025-26 — Old vs New Regime',
  description:
    'Free India income tax calculator for FY 2025-26. Compare old vs new regime, calculate Section 87A rebate, HRA exemption, 80C/80D deductions. Instant results.',
  keywords: [
    'income tax calculator India',
    'old vs new regime calculator',
    'tax calculator FY 2025-26',
    'section 87A rebate calculator',
    'HRA exemption calculator',
    '80C deduction calculator',
  ],
  openGraph: {
    title: 'India Income Tax Calculator FY 2025-26',
    description: 'Compare old vs new regime. Calculate 87A rebate, HRA, 80C/80D. Free, instant, no signup.',
  },
};

export default function IndiaPage() {
  return <IndiaCalculator />;
}
