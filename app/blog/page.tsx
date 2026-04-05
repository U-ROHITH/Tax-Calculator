import type { Metadata } from 'next';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { blogArticles } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'Tax Guides & Articles | TaxCalc Global',
  description:
    'Expert tax guides for India, US, and UK. Old vs new regime, HRA exemption, LTCG rules, US freelancer SE tax, UK 60% personal allowance trap, and ITR form selection.',
};

export default function BlogPage() {
  return <BlogIndexClient articles={blogArticles} />;
}
