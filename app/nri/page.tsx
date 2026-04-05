import type { Metadata } from 'next';
import NRICalculator from '@/components/nri/NRICalculator';

export const metadata: Metadata = {
  title: 'NRI Tax Calculator India 2025-26 — Income, TDS, DTAA | TaxCalc Global',
  description:
    'Calculate Indian income tax for NRIs. Covers salary from India, rental income, capital gains, interest, DTAA treaty benefits, and TDS rates for non-residents.',
};

export default function NRIPage() {
  return <NRICalculator />;
}
