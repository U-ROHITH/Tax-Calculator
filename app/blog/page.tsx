import type { Metadata } from 'next';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { articles } from '@/content/blog/articles';

export const metadata: Metadata = {
  title: 'Tax Guides & Articles | TaxCalc Global',
  description:
    'Expert tax guides for India, US, and UK. Learn about HRA exemption, LTCG rules, US freelancer tax, UK personal allowance trap, and more.',
};

export default function BlogPage() {
  return <BlogIndexClient articles={articles} />;
}
