import type { Metadata } from 'next';
import USCalculator from '@/components/calculator/USCalculator';

export const metadata: Metadata = {
  title: 'US Income Tax Calculator 2025 — Federal, State & FICA',
  description:
    'Free US federal income tax calculator for TY 2025. Calculate federal brackets, Social Security, Medicare, self-employment tax, and state tax for CA, NY, TX, FL, WA.',
  keywords: [
    'income tax calculator USA',
    'federal tax calculator 2025',
    'take home pay calculator',
    'FICA calculator',
    'self employment tax calculator',
    'California income tax calculator',
    'New York tax calculator',
  ],
  openGraph: {
    title: 'US Income Tax Calculator 2025',
    description: 'Federal brackets, FICA, Medicare, state tax. Free, instant, no signup.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the federal income tax brackets for 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For 2025 (single filers): 10% up to $11,925; 12% $11,925-$48,475; 22% $48,475-$103,350; 24% $103,350-$197,300; 32% $197,300-$250,525; 35% $250,525-$626,350; 37% above $626,350.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is FICA tax in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FICA consists of Social Security tax (6.2% on wages up to $176,100) and Medicare tax (1.45% on all wages, plus 0.9% additional Medicare on wages above $200,000 for single filers).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the standard deduction for 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The standard deduction for 2025 is $15,000 for single filers, $30,000 for married filing jointly, and $22,500 for head of household.',
      },
    },
  ],
};

export default function USPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <USCalculator />
    </>
  );
}
