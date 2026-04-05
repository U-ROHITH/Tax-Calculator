import type { Metadata } from 'next';
import RetirementCalculator from '@/components/retire/RetirementCalculator';

export const metadata: Metadata = {
  title: 'Retirement Calculator — NPS, PPF, 401k Projections | TaxCalc Global',
  description:
    'Plan your retirement corpus. Calculate NPS, PPF, EPF projections for India or 401k/IRA for the US. See monthly income at retirement.',
};

export default function RetirePage() {
  return <RetirementCalculator />;
}
