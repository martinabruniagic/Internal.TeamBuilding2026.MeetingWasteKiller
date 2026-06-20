'use client';
import { useRouter } from 'next/navigation';
import type { MeetingListItem } from '@/types';
import ScoreRing from './ScoreRing';

interface Props {
  meetings: MeetingListItem[];
}

export default function MeetingList({ meetings }: Props) {
  const router = useRouter();

  if (meetings.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#5a6472', padding: '32px', textAlign: 'center' }}>
        Nessun meeting trovato.
      </p>
    );
  }

  const cols = '70px minmax(0,1fr) 160px 40px';

  return (
    <div
      style={{
        background: '#13161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 18,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: cols,
          alignItems: 'center',
          gap: 16,
          padding: '15px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#5a6472',
        }}
      >
        <div>Score</div>
        <div>Meeting</div>
        <div>Quando</div>
        <div />
      </div>

      {/* Rows */}
      {meetings.map((m) => (
        <div
          key={m.id}
          onClick={() => router.push(`/meetings/${m.id}`)}
          style={{
            display: 'grid',
            gridTemplateColumns: cols,
            alignItems: 'center',
            gap: 16,
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            cursor: 'pointer',
            transition: 'background .12s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
        >
          <ScoreRing score={m.wasteScore} />

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#eef2f6',
                }}
              >
                {m.title}
              </span>
              {m.isAlert && (
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    padding: '3px 7px',
                    borderRadius: 6,
                    background: 'rgba(52,211,153,0.16)',
                    color: '#6ee7b7',
                  }}
                >
                  ALERT
                </span>
              )}
              {m.isFuture && (
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    padding: '3px 7px',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: '#8b95a4',
                  }}
                >
                  FUTURO
                </span>
              )}
            </div>
            <div style={{ fontSize: 12.5, color: '#5a6472' }}>
              {m.durationMinutes}m · {m.participantCount} partecipanti
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#9aa4b2' }}>
            <span style={{ color: '#c8d0da', fontWeight: 500 }}>
              {new Date(m.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5a6472" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

