import type { Metadata } from 'next';
import CryptoTaxCalculator from '@/components/crypto/CryptoTaxCalculator';

export const metadata: Metadata = {
  title: 'Crypto Tax Calculator — India, US, UK 2025 | TaxCalc Global',
  description:
    'Calculate cryptocurrency capital gains tax across India, US, and UK. Handles STCG, LTCG, 30% India flat tax, US wash sale rules, and UK CGT.',
};

export default function CryptoPage() {
  return <CryptoTaxCalculator />;
}
