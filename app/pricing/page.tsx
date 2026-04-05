import type { Metadata } from 'next';
import PricingPage from '@/components/pricing/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing — TaxCalc Global',
  description:
    'Free tax calculators for India, US, and UK. Upgrade to Pro for AI Tax Assistant, Form 16 upload, and notice response generator.',
};

export default function PricingRoute() {
  return <PricingPage />;
}
