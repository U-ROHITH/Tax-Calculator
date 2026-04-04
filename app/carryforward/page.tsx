import type { Metadata } from 'next';
import CarryForwardTracker from '@/components/carryforward/CarryForwardTracker';

export const metadata: Metadata = {
  title: 'Loss Carry-Forward Tracker — India | TaxCalc Global',
  description:
    'Track brought-forward tax losses across years. See how business losses, capital gain losses, and depreciation reduce your current year tax liability.',
};

export default function CarryForwardPage() {
  return <CarryForwardTracker />;
}
