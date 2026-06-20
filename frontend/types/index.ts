export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface MeetingListItem {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  wasteScore: number;
  wasteReason: string;
  isAlert: boolean;
  isFuture: boolean;
  participantCount: number;
}

export interface Participant {
  userId: string;
  name: string;
  role: string;
  dailyCost: number;
}

export interface Attachment {
  id: string;
  fileName: string;
  blobUrl: string;
}

export interface MeetingDetail extends MeetingListItem {
  summary: string;
  estimatedCost: number;
  participants: Participant[];
  attachments: Attachment[];
}

export interface DashboardKpis {
  totalMeetings: number;
  avgWasteScore: number;
  percentMeetingsBelowThreshold: number;
  totalWastedCost: number;
  threshold: number;
  alertCount: number;
}
