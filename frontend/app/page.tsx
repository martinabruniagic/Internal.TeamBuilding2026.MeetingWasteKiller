'use client';

import { useEffect, useState } from 'react';
import KpiCard from '@/components/KpiCard';
import { getDashboard } from '@/lib/api';
import type { DashboardKpis } from '@/types';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(setKpis)
      .catch(() => setError('Errore nel caricamento dei dati.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Caricamento...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!kpis) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>
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
