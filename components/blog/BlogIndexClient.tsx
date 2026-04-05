'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Search, ArrowRight, Mail, Tag } from 'lucide-react';
import {
  type BlogArticle,
  type BlogCategory,
  CATEGORIES,
  CATEGORY_COLORS,
} from '@/lib/blog-data';

interface Props {
  articles: BlogArticle[];
}

// ─── Tax deadline: ITR filing for AY 2025-26 ───────────────────────────────
const TAX_DEADLINE = new Date('2025-07-31T23:59:59');

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

function DeadlineCountdown() {
  const { days, hours, minutes, seconds, expired } = useCountdown(TAX_DEADLINE);
  if (expired) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">
          Tax Deadline
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          ITR filing deadline (AY 2025-26) has passed. File a belated return by Dec 31, 2025.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-[var(--india)]/30 bg-[var(--india)]/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--india)] mb-3">
        India ITR Deadline — AY 2025-26
      </p>
      <div className="grid grid-cols-4 gap-1 text-center">
        {[
          { value: days, label: 'Days' },
          { value: hours, label: 'Hrs' },
          { value: minutes, label: 'Min' },
          { value: seconds, label: 'Sec' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-[var(--surface)] rounded border border-[var(--border)] py-2">
            <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums leading-none">
              {String(value).padStart(2, '0')}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-2">July 31, 2025 · Last date without late fee</p>
    </div>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="h-4 w-4 text-[var(--primary)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Tax Digest</p>
      </div>
      <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
        Monthly breakdown of tax rule changes across India, US, and UK. No filler.
      </p>
      {submitted ? (
        <p className="text-xs font-medium text-[var(--success)] bg-[var(--success)]/10 border border-[var(--success)]/20 rounded px-3 py-2">
          Subscribed. Watch your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <button
            type="submit"
            className="w-full rounded bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Subscribe — Free
          </button>
        </form>
      )}
    </div>
  );
}

function CategoryBadge({ category }: { category: BlogCategory }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded tracking-wide ${CATEGORY_COLORS[category]}`}
    >
      {category}
    </span>
  );
}

function FeaturedCard({ article }: { article: BlogArticle }) {
  const formattedDate = new Date(article.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block col-span-full bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-md transition-all"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-2.5 py-1 rounded">
            Featured
          </span>
          <CategoryBadge category={article.category} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-snug mb-3 group-hover:text-[var(--primary)] transition-colors max-w-3xl">
          {article.title}
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-5 max-w-2xl text-sm sm:text-base">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} min read
          </span>
          <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium ml-auto">
            Read article <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article }: { article: BlogArticle }) {
  const formattedDate = new Date(article.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)]/50 hover:shadow-sm transition-all"
    >
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-3">
          <CategoryBadge category={article.category} />
        </div>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] leading-snug mb-2 flex-1 group-hover:text-[var(--primary)] transition-colors">
          {article.title}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime} min
          </span>
          <span className="ml-auto flex items-center gap-1 text-[var(--primary)] font-medium">
            Read <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndexClient({ articles }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');

  const featured = useMemo(() => articles.find((a) => a.featured) ?? articles[0], [articles]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return articles.filter((a) => {
      const matchCat = activeCategory === 'All' || a.category === activeCategory;
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [articles, query, activeCategory]);

  const grid = filtered.filter((a) => a.slug !== featured.slug || query || activeCategory !== 'All');

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Tax Guides</h1>
          <p className="text-[var(--text-secondary)] text-base">
            Authoritative analysis on India, US, and UK tax — no generic summaries, no filler.
          </p>
        </div>

        {/* ── Search bar ───────────────────────────────────────────────────── */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles — regime, HRA, LTCG, SE tax..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>

        {/* ── Main layout: content + sidebar ───────────────────────────────── */}
        <div className="flex gap-8 items-start">

          {/* ── Content column ─────────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            {/* Featured article */}
            {!query && activeCategory === 'All' && featured && (
              <div className="mb-6">
                <FeaturedCard article={featured} />
              </div>
            )}

            {/* Articles grid */}
            {grid.length === 0 && filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[var(--text-muted)] text-sm">
                  No articles match your search. Try a different term.
                </p>
              </div>
            ) : grid.length === 0 && filtered.length > 0 && !query && activeCategory === 'All' ? null : (
              <div className="grid gap-4 sm:grid-cols-2">
                {(query || activeCategory !== 'All' ? filtered : grid).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sticky sidebar ─────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-8 space-y-5">

            {/* Popular Topics */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-[var(--text-muted)]" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">Popular Topics</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['All', ...CATEGORIES] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={[
                      'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                      activeCategory === cat
                        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                        : 'bg-[var(--background)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]/50 hover:text-[var(--text-primary)]',
                    ].join(' ')}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline countdown */}
            <DeadlineCountdown />

            {/* Newsletter */}
            <NewsletterSignup />
          </aside>
        </div>

        {/* ── Mobile: category pills (below content) ───────────────────────── */}
        <div className="mt-8 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">Topics</p>
          <div className="flex flex-wrap gap-1.5">
            {(['All', ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
                  activeCategory === cat
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)]',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mobile deadline + newsletter ─────────────────────────────────── */}
        <div className="mt-6 lg:hidden grid gap-4 sm:grid-cols-2">
          <DeadlineCountdown />
          <NewsletterSignup />
        </div>

      </div>
    </div>
  );
}
