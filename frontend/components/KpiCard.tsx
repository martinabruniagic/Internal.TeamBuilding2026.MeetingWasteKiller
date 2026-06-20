interface Props {
  title: string;
  value: string | number;
  description?: string;
  highlight?: boolean;
}

export default function KpiCard({ title, value, description, highlight }: Props) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${highlight ? 'border-red-500' : 'border-gray-200'}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </div>
  );
}
