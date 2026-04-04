import type { Metadata } from 'next';
import IndiaCalculator from '@/components/calculator/IndiaCalculator';

export const metadata: Metadata = {
  title: 'India Income Tax Calculator FY 2025-26 — Old vs New Regime',
  description:
    'Free India income tax calculator for FY 2025-26. Compare old vs new regime, calculate Section 87A rebate, HRA exemption, 80C/80D deductions. Instant results.',
  keywords: [
    'income tax calculator India',
    'old vs new regime calculator',
    'tax calculator FY 2025-26',
    'section 87A rebate calculator',
    'HRA exemption calculator',
    '80C deduction calculator',
  ],
  openGraph: {
    title: 'India Income Tax Calculator FY 2025-26',
    description: 'Compare old vs new regime. Calculate 87A rebate, HRA, 80C/80D. Free, instant, no signup.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the income tax slab for FY 2025-26 new regime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under the new regime for FY 2025-26: 0% up to ₹4L, 5% ₹4L-8L, 10% ₹8L-12L, 15% ₹12L-16L, 20% ₹16L-20L, 25% ₹20L-24L, 30% above ₹24L. Standard deduction of ₹75,000 applies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is income up to ₹12.75 lakh tax-free under new regime?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Under the new regime, if your taxable income (after ₹75,000 standard deduction) is up to ₹12,75,000, the Section 87A rebate makes your tax liability zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which regime is better — old or new for FY 2025-26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on your deductions. The new regime is generally better if your total deductions (80C, HRA, 80D etc.) are below ₹3.75 lakh. Use our Auto mode to calculate both and pick the lower tax.',
      },
    },
  ],
};

export default function IndiaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IndiaCalculator />
    </>
  );
}
