import type { LoginResponse, MeetingListItem, MeetingDetail, DashboardKpis } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://localhost:5001';

export const tokenStorage = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem('mwk_token') : null),
  set: (token: string) => localStorage.setItem('mwk_token', token),
  clear: () => localStorage.removeItem('mwk_token'),
};

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const login = (email: string, password: string) =>
  apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export type MeetingsParams = { isFuture?: boolean; onlyAlerts?: boolean };
export const getMeetings = (params: MeetingsParams = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return apiFetch<MeetingListItem[]>(`/meetings${qs ? `?${qs}` : ''}`);
};

export const getMeetingById = (id: string) =>
  apiFetch<MeetingDetail>(`/meetings/${id}`);

export const getDashboard = () =>
  apiFetch<DashboardKpis>('/dashboard');
