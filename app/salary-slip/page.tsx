import type { Metadata } from 'next';
import SalarySlipGenerator from '@/components/salary/SalarySlipGenerator';

export const metadata: Metadata = {
  title: 'Salary Slip Generator India — CTC Breakdown | TaxCalc Global',
  description:
    'Generate a professional salary slip from your CTC. See Basic, HRA, DA, LTA, NPS, EPF, TDS breakdown. Download as PDF.',
};

export default function SalarySlipPage() {
  return <SalarySlipGenerator />;
}
