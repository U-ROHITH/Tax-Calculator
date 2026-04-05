import type { Metadata } from 'next';
import StudentTaxMode from '@/components/student/StudentTaxMode';

export const metadata: Metadata = {
  title: 'International Student Tax Guide — F1/J1 Visa USA | TaxCalc Global',
  description:
    'Tax guide for international students on F1 and J1 visas in the US. Substantial presence test, 1040 vs 1040-NR, FICA exemption, treaty benefits.',
};

export default function StudentPage() {
  return <StudentTaxMode />;
}
