import type { Metadata } from 'next';
import PlanningTools from '@/components/planning/PlanningTools';

export const metadata: Metadata = {
  title: 'Tax Planning Tools — India | TaxCalc Global',
  description:
    'What-if tax planning: salary restructuring optimizer, LTCG timing, NPS optimization, HUF tax splitting. Know your tax before you meet your CA.',
};

export default function PlanPage() {
  return <PlanningTools />;
}
