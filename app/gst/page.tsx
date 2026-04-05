import type { Metadata } from 'next';
import GSTCalculator from '@/components/gst/GSTCalculator';

export const metadata: Metadata = {
  title: 'GST Calculator India — CGST, SGST, IGST | TaxCalc Global',
  description:
    'Calculate GST for any transaction. Computes CGST + SGST for intra-state or IGST for inter-state. Includes reverse charge, composition scheme guide.',
};

export default function GSTPage() {
  return <GSTCalculator />;
}
