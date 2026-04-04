interface Props {
  title: string;
  description: string;
  cta: string;
  url: string;
  color?: string;
  icon?: string;
}

export default function AffiliateCard({ title, description, cta, url, color = '#2563EB', icon = '💰' }: Props) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
        style={{ background: `${color}20` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        style={{ background: color }}
      >
        {cta}
      </a>
    </div>
  );
}
