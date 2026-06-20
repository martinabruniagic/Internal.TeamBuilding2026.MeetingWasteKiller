interface Props {
  title: string;
  value: string | number;
  description?: string;
  highlight?: boolean;
}

export default function KpiCard({ title, value, description, highlight }: Props) {
  return (
    <div
      className={`rounded-xl border bg-card p-5 shadow-sm transition-colors ${
        highlight ? 'border-red-500/70' : 'border-border'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <p
        className={`mt-2 text-3xl font-bold tabular-nums ${
          highlight ? 'text-red-500' : 'text-card-foreground'
        }`}
      >
        {value}
      </p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}
