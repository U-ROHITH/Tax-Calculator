import type { Metadata } from 'next';
import UKCalculator from '@/components/calculator/UKCalculator';

export const metadata: Metadata = {
  title: 'UK Income Tax Calculator 2025-26 — PAYE, NI & Scotland',
  description:
    'Free UK income tax calculator for TY 2025-26. Calculate PAYE tax for England, Wales, NI and Scotland. Includes National Insurance, student loan repayments, and the 60% Personal Allowance trap.',
  keywords: [
    'income tax calculator UK',
    'PAYE calculator 2025',
    'tax calculator Scotland',
    'National Insurance calculator',
    'personal allowance taper calculator',
    'student loan repayment calculator UK',
  ],
  openGraph: {
    title: 'UK Income Tax Calculator 2025-26',
    description: 'England & Scotland bands, NI, student loans. Includes the 60% PA trap warning.',
  },
};

export default function UKPage() {
  return <UKCalculator />;
}
