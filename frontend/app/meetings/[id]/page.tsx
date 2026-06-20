'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMeetingById } from '@/lib/api';
import { getMockMeetingById } from '@/lib/mocks';
import type { MeetingDetail } from '@/types';
import ScoreBadge from '@/components/ScoreBadge';

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    setError('');
    setIsUsingMock(false);
    getMeetingById(id)
      .then(setMeeting)
      .catch(() => {
        const fallback = getMockMeetingById(id);
        if (fallback) {
          setMeeting(fallback);
          setIsUsingMock(true);
          setError('Backend non raggiungibile: visualizzo dati mock.');
        } else {
          setError('Meeting non trovato.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Caricamento...</p>;
  if (error && !meeting) return <p className="text-destructive">{error}</p>;
  if (!meeting) return null;

  return (
    <div className="space-y-6">
      {isUsingMock && <p className="text-sm text-amber-500">{error}</p>}
      <button
        onClick={() => router.push('/meetings')}
        className="text-sm text-primary hover:underline transition-colors"
      >
        ← Torna alla lista
      </button>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{meeting.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(meeting.date).toLocaleDateString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              · {meeting.durationMinutes} min
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${meeting.isFuture ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {meeting.isFuture ? 'Futuro' : 'Passato'}
            </span>
            <ScoreBadge score={meeting.wasteScore} />
          </div>
        </div>

        <div
          className={`mt-4 rounded-lg p-3 text-sm ${meeting.isAlert ? 'bg-red-50 font-medium text-red-700' : 'bg-gray-50 text-gray-700'}`}
        >
          <span className="font-semibold">Motivo: </span>
          {meeting.wasteReason}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Costo stimato</p>
          <p className="mt-1 text-2xl font-bold text-foreground">€ {meeting.estimatedCost.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Partecipanti</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{meeting.participantCount}</p>
        </div>
      </div>

      {meeting.summary && (
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-foreground">Sommario</h2>
          <p className="text-sm text-muted-foreground">{meeting.summary}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">Partecipanti</h2>
        <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Ruolo</th>
              <th className="px-4 py-3">Costo/giorno</th>
            </tr>
          </thead>
          <tbody>
            {meeting.participants.map((participant) => (
              <tr key={participant.userId} className="border-t border-border/50">
                <td className="px-4 py-3 font-medium text-foreground">{participant.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{participant.role}</td>
                <td className="px-4 py-3 text-muted-foreground">€ {participant.dailyCost.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meeting.attachments.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Allegati</h2>
          <ul className="space-y-2">
            {meeting.attachments.map((attachment) => (
              <li key={attachment.id}>
                <a
                  href={attachment.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline transition-colors"
                >
                  📎 {attachment.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
