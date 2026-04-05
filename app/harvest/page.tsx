import type { Metadata } from 'next';
import HarvestingTool from '@/components/planning/HarvestingTool';

export const metadata: Metadata = {
  title: 'LTCG Tax Harvesting Tool — India FY 2025-26 | TaxCalc Global',
  description:
    'Calculate exactly how much equity LTCG to book this financial year to maximize the ₹1.25 lakh exemption without paying tax.',
};

export default function HarvestPage() {
  return <HarvestingTool />;
}
