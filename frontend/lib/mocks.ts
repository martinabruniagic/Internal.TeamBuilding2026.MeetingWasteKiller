import type { DashboardKpis, LoginResponse, MeetingDetail, MeetingListItem } from '@/types';

const MOCK_USERS: { email: string; password: string; token: string }[] = [
  { email: 'martina@company.com', password: 'password', token: 'mock-token-martina' },
  { email: 'dev@company.com',     password: 'password', token: 'mock-token-dev' },
];

export function getMockLogin(email: string, password: string): LoginResponse | null {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!user) return null;
  return { token: user.token, expiresAt: new Date(Date.now() + 86_400_000).toISOString() };
}

export const mockDashboardKpis: DashboardKpis = {
  totalMeetings: 7,
  avgWasteScore: 56.0,
  percentMeetingsBelowThreshold: 43.0,
  totalWastedCost: 2430.0,
  threshold: 60,
  alertCount: 2,
};

export const mockMeetings: MeetingListItem[] = [
  {
    id: 'm1',
    title: 'Sprint Planning Q3',
    date: '2026-06-10T09:00:00',
    durationMinutes: 90,
    wasteScore: 80,
    wasteReason: 'Meeting con molti partecipanti senior e nessuna decisione finale.',
    isAlert: true,
    isFuture: false,
    participantCount: 6,
  },
  {
    id: 'm2',
    title: 'Weekly Status Update',
    date: '2026-06-12T11:00:00',
    durationMinutes: 60,
    wasteScore: 65,
    wasteReason: 'Aggiornamenti ridondanti, poche azioni concrete assegnate.',
    isAlert: true,
    isFuture: false,
    participantCount: 5,
  },
  {
    id: 'm3',
    title: 'Architecture Review',
    date: '2026-06-14T15:00:00',
    durationMinutes: 45,
    wasteScore: 30,
    wasteReason: 'Obiettivi chiari e decisioni documentate.',
    isAlert: false,
    isFuture: false,
    participantCount: 4,
  },
  {
    id: 'm4',
    title: 'Retro Team Alpha',
    date: '2026-06-16T10:30:00',
    durationMinutes: 40,
    wasteScore: 15,
    wasteReason: 'Meeting breve con action items ben definiti.',
    isAlert: false,
    isFuture: false,
    participantCount: 3,
  },
  {
    id: 'm5',
    title: 'Budget Alignment',
    date: '2026-06-18T14:00:00',
    durationMinutes: 75,
    wasteScore: 90,
    wasteReason: 'Discussione ampia senza owner e decisioni.',
    isAlert: true,
    isFuture: false,
    participantCount: 6,
  },
  {
    id: 'm6',
    title: 'Roadmap Kickoff Q4',
    date: '2026-06-24T09:30:00',
    durationMinutes: 60,
    wasteScore: 75,
    wasteReason: 'Agenda incompleta e partecipanti non essenziali.',
    isAlert: true,
    isFuture: true,
    participantCount: 5,
  },
  {
    id: 'm7',
    title: 'Client Demo Prep',
    date: '2026-06-27T16:00:00',
    durationMinutes: 30,
    wasteScore: 20,
    wasteReason: 'Focus alto e output operativo immediato.',
    isAlert: false,
    isFuture: true,
    participantCount: 3,
  },
];

export const mockMeetingDetails: Record<string, MeetingDetail> = {
  m1: {
    ...mockMeetings[0],
    summary: 'Discussione generale su backlog senza decisioni operative finali.',
    estimatedCost: 675.0,
    participants: [
      { userId: 'u1', name: 'Mario Rossi', role: 'Manager', dailyCost: 800 },
      { userId: 'u2', name: 'Giulia Bianchi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u3', name: 'Luca Verdi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u4', name: 'Anna Neri', role: 'Junior Dev', dailyCost: 350 },
      { userId: 'u5', name: 'Paolo Gallo', role: 'Junior Dev', dailyCost: 350 },
      { userId: 'u6', name: 'Elena Conti', role: 'Product Owner', dailyCost: 700 },
    ],
    attachments: [
      {
        id: 'a1',
        fileName: 'agenda-sprint-planning.pdf',
        blobUrl: 'https://fakestorage.blob.core.windows.net/meetings/agenda-sprint-planning.pdf',
      },
    ],
  },
  m2: {
    ...mockMeetings[1],
    summary: 'Aggiornamento settimanale con interventi lunghi e poco orientati al risultato.',
    estimatedCost: 468.75,
    participants: [
      { userId: 'u1', name: 'Mario Rossi', role: 'Manager', dailyCost: 800 },
      { userId: 'u2', name: 'Giulia Bianchi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u4', name: 'Anna Neri', role: 'Junior Dev', dailyCost: 350 },
      { userId: 'u7', name: 'Davide Serra', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u8', name: 'Silvia Russo', role: 'Designer', dailyCost: 500 },
    ],
    attachments: [],
  },
  m3: {
    ...mockMeetings[2],
    summary: 'Review mirata delle decisioni architetturali con pro e contro documentati.',
    estimatedCost: 256.25,
    participants: [
      { userId: 'u2', name: 'Giulia Bianchi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u3', name: 'Luca Verdi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u6', name: 'Elena Conti', role: 'Product Owner', dailyCost: 700 },
      { userId: 'u8', name: 'Silvia Russo', role: 'Designer', dailyCost: 500 },
    ],
    attachments: [
      {
        id: 'a2',
        fileName: 'adr-review-notes.docx',
        blobUrl: 'https://fakestorage.blob.core.windows.net/meetings/adr-review-notes.docx',
      },
    ],
  },
  m4: {
    ...mockMeetings[3],
    summary: 'Retro con focus su miglioramenti concreti e owner assegnati.',
    estimatedCost: 145.83,
    participants: [
      { userId: 'u4', name: 'Anna Neri', role: 'Junior Dev', dailyCost: 350 },
      { userId: 'u5', name: 'Paolo Gallo', role: 'Junior Dev', dailyCost: 350 },
      { userId: 'u2', name: 'Giulia Bianchi', role: 'Senior Dev', dailyCost: 600 },
    ],
    attachments: [],
  },
  m5: {
    ...mockMeetings[4],
    summary: 'Riunione di allineamento budget con scope troppo ampio e senza chiusura.',
    estimatedCost: 625.0,
    participants: [
      { userId: 'u1', name: 'Mario Rossi', role: 'Manager', dailyCost: 800 },
      { userId: 'u6', name: 'Elena Conti', role: 'Product Owner', dailyCost: 700 },
      { userId: 'u7', name: 'Davide Serra', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u8', name: 'Silvia Russo', role: 'Designer', dailyCost: 500 },
      { userId: 'u9', name: 'Carlo Fontana', role: 'Finance Lead', dailyCost: 900 },
      { userId: 'u4', name: 'Anna Neri', role: 'Junior Dev', dailyCost: 350 },
    ],
    attachments: [
      {
        id: 'a3',
        fileName: 'budget-draft.xlsx',
        blobUrl: 'https://fakestorage.blob.core.windows.net/meetings/budget-draft.xlsx',
      },
    ],
  },
  m6: {
    ...mockMeetings[5],
    summary: 'Kickoff roadmap Q4 con agenda da rifinire e obiettivi da consolidare.',
    estimatedCost: 510.42,
    participants: [
      { userId: 'u1', name: 'Mario Rossi', role: 'Manager', dailyCost: 800 },
      { userId: 'u2', name: 'Giulia Bianchi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u6', name: 'Elena Conti', role: 'Product Owner', dailyCost: 700 },
      { userId: 'u8', name: 'Silvia Russo', role: 'Designer', dailyCost: 500 },
      { userId: 'u10', name: 'Francesca Riva', role: 'Marketing Lead', dailyCost: 670 },
    ],
    attachments: [],
  },
  m7: {
    ...mockMeetings[6],
    summary: 'Preparazione demo cliente con task chiari e tempi contenuti.',
    estimatedCost: 181.25,
    participants: [
      { userId: 'u2', name: 'Giulia Bianchi', role: 'Senior Dev', dailyCost: 600 },
      { userId: 'u8', name: 'Silvia Russo', role: 'Designer', dailyCost: 500 },
      { userId: 'u4', name: 'Anna Neri', role: 'Junior Dev', dailyCost: 350 },
    ],
    attachments: [
      {
        id: 'a4',
        fileName: 'demo-script.md',
        blobUrl: 'https://fakestorage.blob.core.windows.net/meetings/demo-script.md',
      },
    ],
  },
};

export function getMockMeetings(params: { isFuture?: boolean; onlyAlerts?: boolean } = {}) {
  return mockMeetings.filter((meeting) => {
    if (params.isFuture !== undefined && meeting.isFuture !== params.isFuture) return false;
    if (params.onlyAlerts && !meeting.isAlert) return false;
    return true;
  });
}

export function getMockMeetingById(id: string) {
  return mockMeetingDetails[id] ?? null;
}

export interface BarItem {
  id: string;
  title: string;
  wasteScore: number;
  estimatedCost: number;
  wastedCost: number;
}

export function getMockBarItems(): BarItem[] {
  return Object.values(mockMeetingDetails)
    .map((d) => ({
      id: d.id,
      title: d.title,
      wasteScore: d.wasteScore,
      estimatedCost: d.estimatedCost,
      wastedCost: d.estimatedCost * d.wasteScore / 100,
    }))
    .sort((a, b) => b.wastedCost - a.wastedCost);
}
