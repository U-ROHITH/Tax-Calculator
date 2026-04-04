'use client';

import { SavingTip } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';
import { Lightbulb, ExternalLink } from 'lucide-react';

interface Props { tips: SavingTip[]; currency: string }

export default function SavingTips({ tips, currency }: Props) {
  if (tips.length === 0) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[var(--surface-raised)] border-b border-[var(--border)]">
        <Lightbulb className="h-4 w-4 text-[var(--warning)]" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Tax Optimisation Opportunities</h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-start gap-3 px-4 py-3.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-raised)] border border-[var(--border)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{tip.title}</p>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">{tip.description}</p>
              {tip.potentialSaving > 0 && (
                <p className="mt-1 text-xs font-semibold text-[var(--success)] num">
                  Potential saving: {formatByCurrency(tip.potentialSaving, currency)}
                </p>
              )}
            </div>
            {tip.affiliateLink && (
              <a href={tip.affiliateLink} target="_blank" rel="noopener noreferrer sponsored"
                className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors">
                Explore <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
