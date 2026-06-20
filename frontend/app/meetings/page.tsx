'use client';
import { useEffect, useState } from 'react';
import { getMeetings } from '@/lib/api';
import { getMockMeetings } from '@/lib/mocks';
import type { MeetingListItem } from '@/types';
import MeetingList from '@/components/MeetingList';

type FilterType = 'all' | 'past' | 'future';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [onlyAlerts, setOnlyAlerts] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setIsUsingMock(false);
    const params: { isFuture?: boolean; onlyAlerts?: boolean } = {};
    if (filterType === 'past') params.isFuture = false;
    if (filterType === 'future') params.isFuture = true;
    if (onlyAlerts) params.onlyAlerts = true;

    getMeetings(params)
      .then(setMeetings)
      .catch(() => {
        setMeetings(getMockMeetings(params));
        setIsUsingMock(true);
        setError('Backend non raggiungibile: visualizzo dati mock.');
      })
      .finally(() => setLoading(false));
  }, [filterType, onlyAlerts]);

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'Tutti', value: 'all' },
    { label: 'Passati', value: 'past' },
    { label: 'Futuri', value: 'future' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Meeting</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilterType(btn.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filterType === btn.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={onlyAlerts}
            onChange={(e) => setOnlyAlerts(e.target.checked)}
            className="rounded"
          />
          Solo alert
        </label>

        {!loading && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {meetings.length} meeting trovati
          </span>
        )}
      </div>

      {loading && <p className="text-gray-500">Caricamento...</p>}
      {!loading && isUsingMock && <p className="mb-3 text-amber-700">{error}</p>}
      {!loading && !isUsingMock && error && <p className="text-red-600">{error}</p>}
      {!loading && <MeetingList meetings={meetings} />}
    </div>
  );
}
