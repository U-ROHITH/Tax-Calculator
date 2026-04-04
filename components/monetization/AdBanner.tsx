'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'leaderboard';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ slot, format = 'auto', className = '' }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adsenseId && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [adsenseId]);

  // Dev/no-AdSense: show placeholder
  if (!adsenseId) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-xs text-muted-foreground ${
          format === 'leaderboard' ? 'h-16 w-full' : 'h-[250px] w-full max-w-[300px] mx-auto'
        } ${className}`}
      >
        Ad placeholder ({format})
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
