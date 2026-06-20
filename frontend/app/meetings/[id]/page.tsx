'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMeetingById } from '@/lib/api';
import type { MeetingDetail } from '@/types';
import ScoreBadge from '@/components/ScoreBadge';

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    getMeetingById(id)
      .then(setMeeting)
      .catch(() => setError('Errore nel caricamento del meeting.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500">Caricamento...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!meeting) return null;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/meetings')}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Torna alla lista
      </button>

      <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{meeting.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
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
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Costo stimato</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">€ {meeting.estimatedCost.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Partecipanti</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{meeting.participantCount}</p>
        </div>
      </div>

      {meeting.summary && (
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Sommario</h2>
          <p className="text-sm text-gray-600">{meeting.summary}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <h2 className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">Partecipanti</h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Ruolo</th>
              <th className="px-4 py-3">Costo/giorno</th>
            </tr>
          </thead>
          <tbody>
            {meeting.participants.map((participant) => (
              <tr key={participant.userId} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-800">{participant.name}</td>
                <td className="px-4 py-3 text-gray-600">{participant.role}</td>
                <td className="px-4 py-3 text-gray-600">€ {participant.dailyCost.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meeting.attachments.length > 0 && (
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Allegati</h2>
          <ul className="space-y-2">
            {meeting.attachments.map((attachment) => (
              <li key={attachment.id}>
                <a
                  href={attachment.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
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
