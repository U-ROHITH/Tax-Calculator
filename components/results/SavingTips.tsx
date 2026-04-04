'use client';

import { SavingTip } from '@/engine/types';
import { formatByCurrency } from '@/lib/formatters';

interface Props {
  tips: SavingTip[];
  currency: string;
}

export default function SavingTips({ tips, currency }: Props) {
  if (tips.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">💡 Tax Saving Opportunities</h3>
      </div>
      <div className="divide-y divide-border">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-start gap-3 px-4 py-4">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm">
              💰
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tip.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{tip.description}</p>
              {tip.potentialSaving > 0 && (
                <p className="mt-1 text-xs font-semibold text-green-600">
                  Potential saving: {formatByCurrency(tip.potentialSaving, currency)}
                </p>
              )}
            </div>
            {tip.affiliateLink && (
              <a
                href={tip.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Learn more →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
