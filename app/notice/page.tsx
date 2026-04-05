import type { Metadata } from 'next';
import NoticeGenerator from '@/components/notice/NoticeGenerator';

export const metadata: Metadata = {
  title: 'IT Notice Response Generator | TaxCalc Global',
  description:
    'Received an Income Tax notice? Get an AI-generated explanation and draft response letter for 143(1), 143(2), 148, 245, and other notices.',
};

export default function NoticePage() {
  return <NoticeGenerator />;
}
