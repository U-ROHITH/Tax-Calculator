import { articles } from '@/content/blog/articles';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title + ' | TaxCalc Global',
    description: article.description,
  };
}

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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  // Related articles: same country or ALL, excluding current
  const related = articles
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.country === article.country || a.country === 'ALL' || article.country === 'ALL'),
    )
    .slice(0, 2);

  const formattedDate = new Date(article.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Articles
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded ${COUNTRY_CLASSES[article.country]}`}
            >
              {COUNTRY_LABELS[article.country]}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime} min read
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight mb-3">
            {article.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-base leading-relaxed">
            {article.description}
          </p>
        </header>

        {/* Divider */}
        <hr className="border-[var(--border)] mb-8" />

        {/* Article content */}
        <article
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Related Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="block p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)] transition-colors group"
                >
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded mb-2 ${COUNTRY_CLASSES[rel.country]}`}
                  >
                    {COUNTRY_LABELS[rel.country]}
                  </span>
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {rel.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {rel.readingTime} min read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
