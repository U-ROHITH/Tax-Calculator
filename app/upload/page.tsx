import type { Metadata } from 'next';
import UploadParser from '@/components/upload/UploadParser';

export const metadata: Metadata = {
  title: 'Upload Form 16 & AIS — Auto-fill Tax Calculator | TaxCalc Global',
  description: 'Upload your Form 16 PDF or AIS to automatically extract salary, TDS, deductions, and pre-fill the India tax calculator.',
};

export default function UploadPage() {
  return <UploadParser />;
}
