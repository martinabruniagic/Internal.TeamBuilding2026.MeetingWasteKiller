'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMeetingById } from '@/lib/api';
import { getMockMeetingById } from '@/lib/mocks';
import type { MeetingDetail } from '@/types';
import ScoreRing from '@/components/ScoreRing';

const mono = { fontFamily: 'var(--font-mono)' } as const;
const head = { fontFamily: 'var(--font-heading)' } as const;
const eur = (n: number) => '€' + Math.round(n).toLocaleString('it-IT');
const initials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('');
const dur = (m: number) => { const h = Math.floor(m / 60), mm = m % 60; return h ? (mm ? `${h}h ${mm}m` : `${h}h`) : `${mm}m`; };

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    getMeetingById(id)
      .then(setMeeting)
      .catch(() => {
        const fallback = getMockMeetingById(id);
        if (fallback) { setMeeting(fallback); setIsUsingMock(true); }
        else setError('Meeting non trovato.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
        <p style={{ ...mono, fontSize: 13, color: '#5a6472' }}>Caricamento...</p>
      </div>
    );
  if (error && !meeting) return <p style={{ padding: 40, color: '#ef4444' }}>{error}</p>;
  if (!meeting) return null;

  const dateStr = new Date(meeting.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = new Date(meeting.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ padding: '32px 44px 60px', maxWidth: 1100 }}>
      {/* Back */}
      <button
        onClick={() => router.push('/meetings')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#8b95a4', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3.5L5.5 8L10 12.5" />
        </svg>
        Tutti i meeting
      </button>

      {isUsingMock && (
        <p style={{ ...mono, marginBottom: 16, fontSize: 12, color: '#d97706' }}>
          ⚠ Backend non raggiungibile: dati mock
        </p>
      )}

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          {meeting.isAlert && (
            <span style={{ ...mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '4px 9px', borderRadius: 7, background: 'rgba(52,211,153,0.16)', color: '#6ee7b7' }}>
              ⚠ ALERT SPRECO
            </span>
          )}
          {meeting.isFuture && (
            <span style={{ ...mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '4px 9px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.14)', color: '#8b95a4' }}>
              MEETING FUTURO
            </span>
          )}
        </div>
        <div style={{ ...head, fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: '#eef2f6', marginBottom: 14 }}>
          {meeting.title}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, fontSize: 13.5, color: '#9aa4b2' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#5a6472" strokeWidth="1.6">
              <rect x="2" y="3" width="12" height="11" rx="2" /><path d="M2 6.5H14M5.5 2V4M10.5 2V4" strokeLinecap="round" />
            </svg>
            {dateStr} · {timeStr}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#5a6472" strokeWidth="1.6">
              <circle cx="8" cy="8" r="6" /><path d="M8 4.5V8L10.5 9.5" strokeLinecap="round" />
            </svg>
            {dur(meeting.durationMinutes)}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#5a6472" strokeWidth="1.6">
              <circle cx="6" cy="6" r="2.5" /><path d="M2 13.5C2 11 3.8 9.5 6 9.5C8.2 9.5 10 11 10 13.5" strokeLinecap="round" />
            </svg>
            {meeting.participantCount} partecipanti
          </span>
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Left: score + summary */}
        <div style={{ background: '#13161c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 22 }}>
            <ScoreRing score={meeting.wasteScore} large />
            <div>
              <div style={{ ...mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b95a4', marginBottom: 8 }}>
                Waste Score
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#c8d0da' }}>{meeting.wasteReason}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
            <div style={{ ...mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b95a4', marginBottom: 10 }}>
              {meeting.isFuture ? 'Agenda prevista' : 'Riepilogo'}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: '#9aa4b2' }}>{meeting.summary}</div>
          </div>
        </div>

        {/* Right: cost + participants + attachments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Cost card */}
          <div style={{ background: 'linear-gradient(150deg, rgba(52,211,153,0.12), rgba(19,22,28,0.4))', border: '1px solid rgba(52,211,153,0.22)', borderRadius: 18, padding: 24 }}>
            <div style={{ ...mono, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8b95a4', marginBottom: 12 }}>
              Costo stimato del meeting
            </div>
            <div style={{ ...head, fontWeight: 700, fontSize: 44, letterSpacing: '-0.02em', color: '#eef2f6' }}>
              {eur(meeting.estimatedCost)}
            </div>
            <div style={{ fontSize: 12.5, color: '#8b95a4', marginTop: 8 }}>
              costo orario dei partecipanti × durata
            </div>
          </div>

          {/* Participants */}
          <div style={{ background: '#13161c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 22 }}>
            <div style={{ ...head, fontWeight: 600, fontSize: 15, color: '#eef2f6', marginBottom: 16 }}>Partecipanti</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {meeting.participants.map(p => (
                <div key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 36, height: 36, flexShrink: 0, borderRadius: '50%',
                      background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      ...head, fontWeight: 600, fontSize: 12, color: '#6ee7b7',
                    }}
                  >
                    {initials(p.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#eef2f6' }}>{p.name}</div>
                    <div style={{ fontSize: 11.5, color: '#5a6472' }}>{p.role}</div>
                  </div>
                  <div style={{ ...mono, fontSize: 12, color: '#8b95a4' }}>
                    {eur(p.dailyCost)}<span style={{ color: '#4d5663' }}>/g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {meeting.attachments.length > 0 && (
            <div style={{ background: '#13161c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 22 }}>
              <div style={{ ...head, fontWeight: 600, fontSize: 15, color: '#eef2f6', marginBottom: 16 }}>Allegati</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {meeting.attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 11, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#34d399" strokeWidth="1.5">
                      <path d="M4 2H10L14 6V16H4V2Z" strokeLinejoin="round" />
                      <path d="M10 2V6H14" strokeLinejoin="round" />
                    </svg>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#eef2f6' }}>{att.fileName}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

