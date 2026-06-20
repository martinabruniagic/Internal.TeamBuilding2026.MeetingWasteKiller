'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KpiCard from '@/components/KpiCard';
import { getDashboard } from '@/lib/api';
import { mockDashboardKpis, getMockBarItems } from '@/lib/mocks';
import type { DashboardKpis } from '@/types';
import type { BarItem } from '@/lib/mocks';

const eur = (n: number) => '€' + Math.round(n).toLocaleString('it-IT');
const ringColor = (s: number) => `rgba(52,211,153,${(0.4 + 0.6 * s / 100).toFixed(2)})`;
const mono = { fontFamily: 'var(--font-mono)' } as const;
const head = { fontFamily: 'var(--font-heading)' } as const;

export default function DashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [bars] = useState<BarItem[]>(() => getMockBarItems());

  useEffect(() => {
    getDashboard()
      .then(setKpis)
      .catch(() => { setKpis(mockDashboardKpis); setIsUsingMock(true); })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40 }}>
        <p style={{ ...mono, fontSize: 13, color: '#5a6472' }}>Caricamento...</p>
      </div>
    );

  if (!kpis) return null;

  const maxWasted = Math.max(...bars.map(b => b.wastedCost), 1);
  const topAlerts = bars.filter(b => b.wasteScore > 60).slice(0, 3);
  const gaugeR = 92;
  const gaugeC = 2 * Math.PI * gaugeR;
  const gaugeOffset = gaugeC * (1 - kpis.avgWasteScore / 100);

  return (
    <div style={{ padding: '38px 44px 60px', maxWidth: 1280 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ ...mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#34d399', marginBottom: 8 }}>
            Panoramica
          </div>
          <div style={{ ...head, fontWeight: 600, fontSize: 32, letterSpacing: '-0.02em', color: '#eef2f6' }}>
            Dashboard
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', fontSize: 13, color: '#9aa4b2' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#34d399', boxShadow: '0 0 8px #34d399', display: 'inline-block' }} />
          Giugno 2026
        </div>
      </div>

      {isUsingMock && (
        <p style={{ ...mono, marginBottom: 20, fontSize: 12, color: '#d97706' }}>
          ⚠ Backend non raggiungibile: dati mock
        </p>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 18 }}>
        <KpiCard label="Waste Score medio" value={Math.round(kpis.avgWasteScore)} unit="/100" sub="soglia alert a 60" accent />
        <KpiCard label="Costo sprecato" value={eur(kpis.totalWastedCost)} sub={`su ${eur(kpis.totalMeetings * 450)} stimati`} />
        <KpiCard label="Meeting in alert" value={kpis.alertCount} unit={`/${kpis.totalMeetings}`} sub="oltre la soglia di spreco" />
        <KpiCard label="Sotto soglia" value={Math.round(kpis.percentMeetingsBelowThreshold)} unit="%" sub={`${kpis.totalMeetings - kpis.alertCount} meeting virtuosi`} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.85fr 1fr', gap: 18 }}>
        {/* Bar chart */}
        <div style={{ background: '#13161c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ ...head, fontWeight: 600, fontSize: 17, color: '#eef2f6' }}>Costo sprecato per meeting</div>
              <div style={{ fontSize: 12.5, color: '#5a6472', marginTop: 3 }}>stima in € · ordinato per impatto</div>
            </div>
            <div style={{ ...mono, fontSize: 11, color: '#5a6472' }}>€ sprecati</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {bars.map(b => (
              <div
                key={b.id}
                onClick={() => router.push(`/meetings/${b.id}`)}
                style={{ display: 'grid', gridTemplateColumns: '168px 1fr 76px', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: '#c8d0da', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.title}
                </div>
                <div style={{ height: 22, background: 'rgba(255,255,255,0.04)', borderRadius: 7, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.max(4, b.wastedCost / maxWasted * 100).toFixed(1)}%`,
                      background: ringColor(b.wasteScore),
                      borderRadius: 7,
                      boxShadow: `0 0 16px -2px ${ringColor(b.wasteScore)}`,
                    }}
                  />
                </div>
                <div style={{ ...mono, fontSize: 13, fontWeight: 500, textAlign: 'right', color: '#eef2f6' }}>
                  {eur(b.wastedCost)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: gauge + alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Gauge */}
          <div style={{ background: '#13161c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ alignSelf: 'flex-start', ...head, fontWeight: 600, fontSize: 17, color: '#eef2f6', marginBottom: 8 }}>
              Waste Score medio
            </div>
            <div style={{ position: 'relative', width: 200, height: 200, margin: '6px 0' }}>
              <svg viewBox="0 0 220 220" width="200" height="200">
                <circle cx="110" cy="110" r="92" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
                <circle
                  cx="110" cy="110" r="92" fill="none" stroke="#34d399" strokeWidth="16"
                  strokeLinecap="round" strokeDasharray={gaugeC} strokeDashoffset={gaugeOffset}
                  transform="rotate(-90 110 110)"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(52,211,153,0.55))' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...head, fontWeight: 700, fontSize: 52, letterSpacing: '-0.03em', color: '#6ee7b7', lineHeight: 1 }}>
                  {Math.round(kpis.avgWasteScore)}
                </div>
                <div style={{ ...mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5a6472', marginTop: 6 }}>
                  su 100
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: '#8b95a4', textAlign: 'center', marginTop: 4 }}>
              livello di spreco medio sui {kpis.totalMeetings} meeting analizzati
            </div>
          </div>

          {/* Top alerts */}
          <div style={{ background: '#13161c', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 18, padding: 22 }}>
            <div style={{ ...head, fontWeight: 600, fontSize: 15, color: '#eef2f6', marginBottom: 16 }}>
              Meeting da rivedere
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topAlerts.map(a => {
                const c = 2 * Math.PI * 22;
                const off = c * (1 - a.wasteScore / 100);
                const rc = ringColor(a.wasteScore);
                return (
                  <div
                    key={a.id}
                    onClick={() => router.push(`/meetings/${a.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                  >
                    <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
                      <svg viewBox="0 0 56 56" width="38" height="38">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke={rc} strokeWidth="5"
                          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
                          transform="rotate(-90 28 28)" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono, fontSize: 11, fontWeight: 600, color: '#eef2f6' }}>
                        {a.wasteScore}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#eef2f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                      <div style={{ fontSize: 11.5, color: '#5a6472' }}>{eur(a.wastedCost)} sprecati</div>
                    </div>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#5a6472" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3.5L10.5 8L6 12.5" />
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
