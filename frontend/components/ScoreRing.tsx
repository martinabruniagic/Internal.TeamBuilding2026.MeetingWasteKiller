interface Props {
  score: number;
  large?: boolean;
}

export default function ScoreRing({ score, large = false }: Props) {
  const size = large ? 140 : 52;
  const vb = large ? 168 : 56;
  const cx = large ? 84 : 28;
  const cy = large ? 84 : 28;
  const r = large ? 70 : 22;
  const sw = large ? 12 : 4.5;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const opacity = (0.4 + 0.6 * score / 100).toFixed(2);
  const color = `rgba(52,211,153,${opacity})`;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${vb} ${vb}`} width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={large ? { filter: 'drop-shadow(0 0 10px rgba(52,211,153,0.5))' } : undefined}
        />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: large ? 40 : 15,
            fontWeight: 700,
            color: large ? '#6ee7b7' : '#eef2f6',
            lineHeight: 1,
            letterSpacing: large ? '-0.03em' : undefined,
          }}
        >
          {score}
        </span>
        {large && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#5a6472',
              marginTop: 4,
            }}
          >
            su 100
          </span>
        )}
      </div>
    </div>
  );
}
