'use client';

import { useEffect, useState } from 'react';
import KpiCard from '@/components/KpiCard';
import { getDashboard } from '@/lib/api';
import { mockDashboardKpis } from '@/lib/mocks';
import type { DashboardKpis } from '@/types';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    getDashboard()
      .then(setKpis)
      .catch(() => {
        setKpis(mockDashboardKpis);
        setIsUsingMock(true);
        setError('Backend non raggiungibile: visualizzo dati mock.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Caricamento...</p>;
  if (!kpis) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>
      {isUsingMock && <p className="mb-4 text-sm text-amber-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <KpiCard title="Meeting totali" value={kpis.totalMeetings} />
        <KpiCard title="Waste Score medio" value={kpis.avgWasteScore.toFixed(1)} />
        <KpiCard title="% meeting OK" value={kpis.percentMeetingsBelowThreshold.toFixed(0) + '%'} />
        <KpiCard
          title="Costo sprecato totale"
          value={'€' + kpis.totalWastedCost.toFixed(0)}
          highlight={kpis.totalWastedCost > 0}
        />
        <KpiCard title="Meeting in alert" value={kpis.alertCount} highlight={kpis.alertCount > 0} />
        <KpiCard title="Soglia alert" value={kpis.threshold} />
      </div>
    </div>
  );
}
