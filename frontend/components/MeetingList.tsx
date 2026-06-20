'use client';
import { useRouter } from 'next/navigation';
import type { MeetingListItem } from '@/types';
import ScoreBadge from './ScoreBadge';

interface Props {
  meetings: MeetingListItem[];
}

export default function MeetingList({ meetings }: Props) {
  const router = useRouter();

  if (meetings.length === 0) {
    return <p className="text-gray-500 text-sm">Nessun meeting trovato.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Titolo</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Durata</th>
            <th className="px-4 py-3">Partecipanti</th>
            <th className="px-4 py-3">WasteScore</th>
            <th className="px-4 py-3">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => (
            <tr
              key={m.id}
              onClick={() => router.push(`/meetings/${m.id}`)}
              className={`cursor-pointer border-t border-gray-100 hover:bg-gray-50 ${m.isAlert ? 'bg-red-50' : ''}`}
            >
              <td className="px-4 py-3 font-medium text-gray-800">{m.title}</td>
              <td className="px-4 py-3 text-gray-600">{new Date(m.date).toLocaleDateString('it-IT')}</td>
              <td className="px-4 py-3 text-gray-600">{m.durationMinutes} min</td>
              <td className="px-4 py-3 text-gray-600">{m.participantCount}</td>
              <td className="px-4 py-3"><ScoreBadge score={m.wasteScore} /></td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.isFuture ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {m.isFuture ? 'Futuro' : 'Passato'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
