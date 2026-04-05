import type { Metadata } from 'next';
import FreelancerCalculator from '@/components/freelancer/FreelancerCalculator';

export const metadata: Metadata = {
  title: 'US Freelancer Tax Calculator 2025 — SE Tax, Quarterly Estimates | TaxCalc Global',
  description:
    'Calculate self-employment tax, quarterly estimated payments, and deductions for US freelancers. Includes SE tax deduction, QBI deduction, 401k/IRA savings optimizer.',
};

export default function FreelancerPage() {
  return <FreelancerCalculator />;
}
