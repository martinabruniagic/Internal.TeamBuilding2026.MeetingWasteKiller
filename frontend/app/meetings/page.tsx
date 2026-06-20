'use client';
import { useEffect, useState } from 'react';
import { getMeetings } from '@/lib/api';
import { getMockMeetings } from '@/lib/mocks';
import type { MeetingListItem } from '@/types';
import MeetingList from '@/components/MeetingList';

type FilterKey = 'all' | 'past' | 'future' | 'alerts';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tutti' },
  { key: 'past', label: 'Passati' },
  { key: 'future', label: 'Futuri' },
  { key: 'alerts', label: 'Solo alert' },
];

const mono = { fontFamily: 'var(--font-mono)' } as const;
const head = { fontFamily: 'var(--font-heading)' } as const;

export default function MeetingsPage() {
  const [all, setAll] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [filterKey, setFilterKey] = useState<FilterKey>('all');

  useEffect(() => {
    getMeetings()
      .then(setAll)
      .catch(() => { setAll(getMockMeetings()); setIsUsingMock(true); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(m => {
    if (filterKey === 'past') return !m.isFuture;
    if (filterKey === 'future') return m.isFuture;
    if (filterKey === 'alerts') return m.isAlert;
    return true;
  });

  const counts: Record<FilterKey, number> = {
    all: all.length,
    past: all.filter(m => !m.isFuture).length,
    future: all.filter(m => m.isFuture).length,
    alerts: all.filter(m => m.isAlert).length,
  };

  return (
    <div style={{ padding: '38px 44px 60px', maxWidth: 1180 }}>
      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ ...mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#34d399', marginBottom: 8 }}>
          Analisi
        </div>
        <div style={{ ...head, fontWeight: 600, fontSize: 32, letterSpacing: '-0.02em', color: '#eef2f6' }}>
          Meeting
        </div>
        {!loading && (
          <div style={{ fontSize: 14, color: '#8b95a4', marginTop: 6 }}>
            {all.length} riunioni analizzate · filtra per individuare gli sprechi
          </div>
        )}
      </div>

      {isUsingMock && (
        <p style={{ ...mono, marginBottom: 16, fontSize: 12, color: '#d97706' }}>
          ⚠ Backend non raggiungibile: dati mock
        </p>
      )}

      {/* Filter chips */}
      {!loading && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const active = filterKey === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilterKey(f.key)}
                style={{
                  padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  border: `1px solid ${active ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? '#6ee7b7' : '#9aa4b2',
                  background: active ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.02)',
                  transition: 'all .14s',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label} · {counts[f.key]}
              </button>
            );
          })}
        </div>
      )}

      {loading && <p style={{ ...mono, fontSize: 13, color: '#5a6472' }}>Caricamento...</p>}
      {!loading && <MeetingList meetings={filtered} />}
    </div>
  );
}
