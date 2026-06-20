interface Props {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  accent?: boolean;
}

export default function KpiCard({ label, value, unit, sub, accent }: Props) {
  return (
    <div
      style={{
        background: '#13161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18,
        padding: 22,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8b95a4',
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: accent ? '#6ee7b7' : '#eef2f6',
          }}
        >
          {value}
        </span>
        {unit && <span style={{ fontSize: 16, color: '#5a6472', fontWeight: 600 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#5a6472', marginTop: 8 }}>{sub}</div>}
    </div>
  );
}
