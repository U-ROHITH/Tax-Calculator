import type { Metadata } from 'next';
import CompareCalculator from '@/components/calculator/CompareCalculator';

export const metadata: Metadata = {
  title: 'Tax Comparison — India vs USA vs UK | TaxCalc Global',
  description:
    'Compare income tax across India, United States, and United Kingdom side by side. See effective rates, marginal rates, take-home pay, and total tax liability for the same income.',
  keywords: [
    'compare income tax India US UK',
    'NRI tax comparison 2025',
    'expat tax calculator',
    'income tax comparison India USA United Kingdom',
    'effective tax rate comparison',
  ],
};

export default function ComparePage() {
  return <CompareCalculator />;
}
