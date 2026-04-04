import type { Metadata } from 'next';
import CompareCalculator from '@/components/calculator/CompareCalculator';

export const metadata: Metadata = {
  title: 'Compare Taxes — India vs USA vs UK',
  description:
    'Compare income tax across India, United States, and United Kingdom side by side. See effective rates, take-home pay, and total tax for the same income in all three countries.',
  keywords: [
    'compare taxes India US UK',
    'NRI tax comparison',
    'expat tax calculator',
    'income tax comparison 2025',
  ],
};

export default function ComparePage() {
  return <CompareCalculator />;
}
