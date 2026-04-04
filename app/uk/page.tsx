import type { Metadata } from 'next';
import UKCalculator from '@/components/calculator/UKCalculator';

export const metadata: Metadata = {
  title: 'UK Income Tax Calculator 2025-26 — PAYE, NI & Scotland',
  description:
    'Free UK income tax calculator for TY 2025-26. Calculate PAYE tax for England, Wales, NI and Scotland. Includes National Insurance, student loan repayments, and the 60% Personal Allowance trap.',
  keywords: [
    'income tax calculator UK',
    'PAYE calculator 2025',
    'tax calculator Scotland',
    'National Insurance calculator',
    'personal allowance taper calculator',
    'student loan repayment calculator UK',
  ],
  openGraph: {
    title: 'UK Income Tax Calculator 2025-26',
    description: 'England & Scotland bands, NI, student loans. Includes the 60% PA trap warning.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the personal allowance for 2025-26 in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The personal allowance for 2025-26 is £12,570. It tapers by £1 for every £2 of income above £100,000 and is fully withdrawn at £125,140.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the 60% tax trap in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Between £100,000 and £125,140, you lose £1 of personal allowance for every £2 earned. This means you effectively pay 60% marginal tax (40% income tax + 20% on the lost allowance). Consider pension contributions to bring income below £100,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the Scottish income tax rates for 2025-26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scotland has 6 bands: Starter 19% (£12,571-£14,876), Basic 20% (£14,877-£26,561), Intermediate 21% (£26,562-£43,662), Higher 42% (£43,663-£75,000), Advanced 45% (£75,001-£125,140), Top 48% (above £125,140).',
      },
    },
  ],
};

export default function UKPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UKCalculator />
    </>
  );
}
