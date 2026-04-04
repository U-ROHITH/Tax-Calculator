import type { Metadata } from 'next';
import DocumentChecklist from '@/components/checklist/DocumentChecklist';

export const metadata: Metadata = {
  title: 'Tax Document Checklist & AIS Guide | TaxCalc Global',
  description:
    'Know exactly which documents to collect before filing your tax return. Smart checklist based on your income sources, plus AIS/26AS cross-check guide.',
};

export default function ChecklistPage() {
  return <DocumentChecklist />;
}
