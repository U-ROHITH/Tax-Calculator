import { blogArticles, getRelatedArticles, CATEGORY_COLORS } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import ArticleToC from '@/components/blog/ArticleToC';
import ShareButtons from '@/components/blog/ShareButtons';

export async function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title + ' | TaxCalc Global',
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = getRelatedArticles(article, 3);

  const formattedDate = new Date(article.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Back link ──────────────────────────────────────────────────────── */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Articles
        </Link>

        <div className="flex gap-10 items-start">

          {/* ── Article body ─────────────────────────────────────────────────── */}
          <article className="min-w-0 flex-1 max-w-2xl">

            {/* Article header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded tracking-wide ${CATEGORY_COLORS[article.category]}`}
                >
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime} min read
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
                {article.excerpt}
              </p>
            </header>

            {/* Mobile TOC */}
            {article.toc.length > 0 && (
              <div className="lg:hidden mb-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                  In this article
                </p>
                <ol className="space-y-1.5">
                  {article.toc.map((item, i) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                      >
                        <span className="text-[var(--text-muted)] tabular-nums shrink-0 text-xs mt-0.5">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <hr className="border-[var(--border)] mb-8" />

            {/* Article content */}
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Calculator CTA — embedded after article body */}
            {article.calculatorCta && (
              <div className="mt-10 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Calculator className="h-8 w-8 text-[var(--primary)] shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                    Put this to work with real numbers
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Use the calculator to model your exact scenario — takes under 2 minutes.
                  </p>
                </div>
                <Link
                  href={article.calculatorCta.href}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors shrink-0"
                >
                  {article.calculatorCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Share buttons */}
            <div className="mt-8 pt-6 border-t border-[var(--border)]">
              <ShareButtons title={article.title} slug={article.slug} />
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <section className="mt-10 pt-8 border-t border-[var(--border)]">
                <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
                  Related Articles
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {related.slice(0, 2).map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="block p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)]/50 transition-colors group"
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded mb-2 tracking-wide ${CATEGORY_COLORS[rel.category]}`}
                      >
                        {rel.category}
                      </span>
                      <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                        {rel.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {rel.readTime} min read
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ── Sticky desktop TOC ───────────────────────────────────────────── */}
          {article.toc.length > 0 && (
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-8">
              <ArticleToC toc={article.toc} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
