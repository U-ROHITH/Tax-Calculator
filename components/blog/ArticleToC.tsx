'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  label: string;
}

interface Props {
  toc: TocItem[];
}

export default function ArticleToC({ toc }: Props) {
  const [active, setActive] = useState<string>(toc[0]?.id ?? '');

  useEffect(() => {
    if (toc.length === 0) return;

    const observers: IntersectionObserver[] = [];

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '0px 0px -70% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
        In this article
      </p>
      <ol className="space-y-1">
        {toc.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                'flex items-start gap-2 text-sm py-1 transition-colors rounded',
                active === item.id
                  ? 'text-[var(--primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              <span
                className={[
                  'tabular-nums text-[10px] mt-0.5 shrink-0',
                  active === item.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]',
                ].join(' ')}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
