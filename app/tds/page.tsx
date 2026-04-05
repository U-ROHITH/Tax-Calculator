import type { Metadata } from 'next';
import TDSCalculator from '@/components/tds/TDSCalculator';

export const metadata: Metadata = {
  title: 'TDS Calculator India — All Sections | TaxCalc Global',
  description:
    'Calculate TDS under all sections: 192 (salary), 194A (interest), 194C (contractor), 194H (commission), 194I (rent), 194J (professional fees) and more.',
};

export default function TDSPage() {
  return <TDSCalculator />;
}
