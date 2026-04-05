import type { Metadata } from 'next';
import SlabHistoryPage from '@/components/slab-history/SlabHistoryPage';

export const metadata: Metadata = {
  title: 'Income Tax Slab History India 2013-2026 | TaxCalc Global',
  description:
    'Complete history of India income tax slabs from FY 2013-14 to FY 2025-26. See how basic exemption, standard deduction, and 87A rebate changed every year.',
};

export default function SlabHistory() {
  return <SlabHistoryPage />;
}
