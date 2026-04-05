'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogArticle } from '@/content/blog/articles';

type CountryFilter = 'ALL' | 'IN' | 'US' | 'UK';

const FILTER_TABS: { key: CountryFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'IN', label: 'India' },
  { key: 'US', label: 'United States' },
  { key: 'UK', label: 'United Kingdom' },
];

const COUNTRY_LABELS: Record<string, string> = {
  IN: 'India',
  US: 'United States',
  UK: 'United Kingdom',
  ALL: 'Global',
};

const COUNTRY_CLASSES: Record<string, string> = {
  IN: 'bg-[var(--india)]/10 text-[var(--india)] border border-[var(--india)]/20',
  US: 'bg-[var(--us)]/10 text-[var(--us)] border border-[var(--us)]/20',
  UK: 'bg-[var(--uk)]/10 text-[var(--uk)] border border-[var(--uk)]/20',
  ALL: 'bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)]',
};

interface Props {
  articles: BlogArticle[];
}

export default function BlogIndexClient({ articles }: Props) {
  const [filter, setFilter] = useState<CountryFilter>('ALL');

  const visible = articles.filter(
    (a) => filter === 'ALL' || a.country === filter,
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Tax Guides
          </h1>
          <p className="text-[var(--text-secondary)] text-base">
            Expert analysis on India, US, and UK tax rules.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-8 border-b border-[var(--border)]">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={[
                'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
                filter === key
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        {visible.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm py-12 text-center">
            No articles found for this filter.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => {
              const formattedDate = new Date(article.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              return (
                <article
                  key={article.slug}
                  className="flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-sm transition-all"
                >
                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Country badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded ${COUNTRY_CLASSES[article.country]}`}
                      >
                        {COUNTRY_LABELS[article.country]}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-semibold text-[var(--text-primary)] leading-snug mb-2 flex-1">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readingTime} min
                        </span>
                      </div>

                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
                      >
                        Read article
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
