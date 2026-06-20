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
    return <p className="text-muted-foreground text-sm">Nessun meeting trovato.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left text-xs font-semibold uppercase text-muted-foreground">
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
              className={`cursor-pointer border-t border-border/50 transition-colors hover:bg-muted/60 ${m.isAlert ? 'bg-red-500/10 dark:bg-red-500/20' : ''}`}
            >
              <td className="px-4 py-3 font-medium text-foreground">{m.title}</td>
              <td className="px-4 py-3 text-muted-foreground">{new Date(m.date).toLocaleDateString('it-IT')}</td>
              <td className="px-4 py-3 text-muted-foreground">{m.durationMinutes} min</td>
              <td className="px-4 py-3 text-muted-foreground">{m.participantCount}</td>
              <td className="px-4 py-3"><ScoreBadge score={m.wasteScore} /></td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.isFuture ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
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
