# MeetingWasteKiller — Frontend Bootstrap Plan

## Obiettivo

PoC frontend in **Next.js 15** che consuma i 4 endpoint read-only del backend .NET 10 e visualizza meeting (passati e futuri), WasteScore e KPI di dashboard. Autenticazione JWT mock, nessuna integrazione esterna, dati sempre da seed.

---

## Stack Tecnologico

| Componente | Scelta |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguaggio | TypeScript |
| Stile | Tailwind CSS |
| Componenti UI | shadcn/ui |
| HTTP client | `fetch` nativo (wrapper tipizzato in `lib/api.ts`) |
| Auth | JWT in `localStorage` (client-side only, PoC) |
| Env | `.env.local` → `NEXT_PUBLIC_API_URL` |

---

## Struttura Cartelle

```
frontend/
├── app/
│   ├── layout.tsx                  # Root layout: Navbar + AuthGuard
│   ├── page.tsx                    # Dashboard KPI
│   ├── login/
│   │   └── page.tsx                # Login form
│   └── meetings/
│       ├── page.tsx                # Lista meeting
│       └── [id]/
│           └── page.tsx            # Dettaglio meeting
├── components/
│   ├── AuthGuard.tsx               # Redirect a /login se non autenticato
│   ├── Navbar.tsx                  # Navigazione + logout
│   ├── ScoreBadge.tsx              # Badge colorato per WasteScore
│   ├── KpiCard.tsx                 # Card KPI generica
│   └── MeetingList.tsx             # Tabella/lista meeting con badge
├── hooks/
│   └── useAuth.ts                  # Token storage, isAuthenticated, logout
├── lib/
│   └── api.ts                      # Fetch wrapper tipizzato + funzioni API
├── types/
│   └── index.ts                    # Interfacce TypeScript (DTOs backend)
├── .env.local
└── next.config.ts
```

---

## Contratti API (TypeScript)

File: `types/index.ts`

```typescript
export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface MeetingListItem {
  id: string;
  title: string;
  date: string;                 // ISO 8601
  durationMinutes: number;
  wasteScore: number;           // 0–100
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
```

---

## API Client

File: `lib/api.ts`

```typescript
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

// Auth
export const login = (email: string, password: string) =>
  apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Meetings
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

// Dashboard
export const getDashboard = () =>
  apiFetch<DashboardKpis>('/dashboard');
```

---

## Regole colore WasteScore

Usate da `ScoreBadge` e ovunque si voglia colorare un valore WasteScore:

| Intervallo | Colore Tailwind | Label |
|---|---|---|
| ≥ 80 | `bg-red-600 text-white` | 🔴 Alto |
| 60 – 79 | `bg-orange-400 text-white` | 🟠 Medio-alto |
| 40 – 59 | `bg-yellow-400 text-black` | 🟡 Medio |
| < 40 | `bg-green-500 text-white` | 🟢 Basso |

```typescript
// lib/scoreColor.ts
export function scoreColor(score: number) {
  if (score >= 80) return 'bg-red-600 text-white';
  if (score >= 60) return 'bg-orange-400 text-white';
  if (score >= 40) return 'bg-yellow-400 text-black';
  return 'bg-green-500 text-white';
}
```

---

## Configurazione

### `.env.local`
```
NEXT_PUBLIC_API_URL=https://localhost:5001
```

### `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

---

## Piano di Esecuzione per Agenti

Il lavoro è suddiviso in **3 fasi**. Le fasi 2 e 3 sono parallelizzabili: ogni agente riceve un task indipendente dagli altri nella stessa fase.

```
Fase 1 ──────────────────────────────────── [Agent: Setup]
   └─ Scaffold + types + api.ts + config

Fase 2 ──────────────── [Parallel: 3 agenti]
   ├─ [Agent A] Auth             login page + useAuth hook + AuthGuard
   ├─ [Agent B] Components       ScoreBadge + KpiCard + MeetingList + Navbar
   └─ [Agent C] Layout           app/layout.tsx + global styles

Fase 3 ──────────────── [Parallel: 3 agenti — dipende da Fase 2]
   ├─ [Agent D] Dashboard        app/page.tsx
   ├─ [Agent E] Lista Meeting    app/meetings/page.tsx
   └─ [Agent F] Dettaglio        app/meetings/[id]/page.tsx
```

---

## Fase 1 — Setup (sequenziale)

**Agente:** Setup  
**Input:** nessuno  
**Output:** cartella `frontend/` scaffold completo, `types/index.ts`, `lib/api.ts`, `lib/scoreColor.ts`, `.env.local`, `next.config.ts`

### Comandi di scaffold

```bash
# Dalla root del repository
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd frontend
npx shadcn@latest init --defaults
npx shadcn@latest add badge card table
```

### File da creare dopo lo scaffold

1. `types/index.ts` — interfacce TypeScript (vedere sezione "Contratti API")
2. `lib/api.ts` — fetch wrapper + funzioni API (vedere sezione "API Client")
3. `lib/scoreColor.ts` — helper colore WasteScore (vedere sezione "Regole colore")
4. `.env.local` — variabile `NEXT_PUBLIC_API_URL`
5. `next.config.ts` — rewrite verso il backend

### Checklist completamento Fase 1

- [ ] `frontend/` esiste e `npm run dev` parte senza errori
- [ ] `types/index.ts` esporta tutte le interfacce
- [ ] `lib/api.ts` compila senza errori TypeScript
- [ ] `.env.local` contiene `NEXT_PUBLIC_API_URL`

---

## Fase 2A — Auth

**Agente:** Auth  
**Dipende da:** Fase 1  
**File da creare:**
- `hooks/useAuth.ts`
- `components/AuthGuard.tsx`
- `app/login/page.tsx`

### `hooks/useAuth.ts`

```typescript
'use client';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api';

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = () => !!tokenStorage.get();
  const logout = () => {
    tokenStorage.clear();
    router.push('/login');
  };
  return { isAuthenticated, logout };
}
```

### `components/AuthGuard.tsx`

```typescript
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!tokenStorage.get()) router.push('/login');
  }, [router]);
  return <>{children}</>;
}
```

### `app/login/page.tsx`

- Form con campi `email` e `password`
- Alla submit: chiama `login(email, password)`, salva il token con `tokenStorage.set()`, redirect a `/`
- In caso di errore: mostra messaggio "Credenziali non valide"
- Se già autenticato: redirect immediato a `/`
- Utenti di test: `martina@company.com / password` · `dev@company.com / password`

### Checklist completamento Fase 2A

- [ ] `/login` renderizza il form
- [ ] Login con credenziali valide → redirect a `/`
- [ ] Login con credenziali errate → messaggio di errore
- [ ] `AuthGuard` redirige a `/login` se il token è assente

---

## Fase 2B — Componenti Condivisi

**Agente:** Components  
**Dipende da:** Fase 1  
**File da creare:**
- `lib/scoreColor.ts` (già previsto in Fase 1 ma qui si usa)
- `components/ScoreBadge.tsx`
- `components/KpiCard.tsx`
- `components/MeetingList.tsx`

### `components/ScoreBadge.tsx`

```typescript
import { scoreColor } from '@/lib/scoreColor';

interface Props { score: number; }

export default function ScoreBadge({ score }: Props) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${scoreColor(score)}`}>
      {score.toFixed(0)}
    </span>
  );
}
```

### `components/KpiCard.tsx`

```typescript
interface Props {
  title: string;
  value: string | number;
  description?: string;
  highlight?: boolean;   // true → bordo rosso (alert)
}

export default function KpiCard({ title, value, description, highlight }: Props) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${highlight ? 'border-red-500' : 'border-gray-200'}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </div>
  );
}
```

### `components/MeetingList.tsx`

- Riceve `meetings: MeetingListItem[]`
- Renderizza una tabella con colonne: **Titolo**, **Data**, **Durata**, **Partecipanti**, **WasteScore** (via `ScoreBadge`), **Tipo** (Past / Future badge)
- Ogni riga è cliccabile → naviga a `/meetings/{id}`
- Riga con `isAlert = true` ha sfondo leggermente rosso (`bg-red-50`)

### Checklist completamento Fase 2B

- [ ] `ScoreBadge` renderizza il colore corretto per i 4 range
- [ ] `KpiCard` mostra bordo rosso quando `highlight=true`
- [ ] `MeetingList` renderizza righe cliccabili con `ScoreBadge`

---

## Fase 2C — Layout Root

**Agente:** Layout  
**Dipende da:** Fase 1  
**File da modificare/creare:**
- `components/Navbar.tsx`
- `app/layout.tsx`

### `components/Navbar.tsx`

- Link: **Dashboard** (`/`) · **Meeting** (`/meetings`)
- Pulsante **Logout** (chiama `useAuth().logout()`)
- Usa `next/link` per la navigazione

### `app/layout.tsx`

```typescript
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <AuthGuard>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </AuthGuard>
      </body>
    </html>
  );
}
```

> **Nota:** la pagina `/login` deve essere esclusa dall'`AuthGuard`. Implementare la logica di esclusione dentro `AuthGuard` verificando `usePathname() === '/login'`.

### Checklist completamento Fase 2C

- [ ] Navbar visibile su tutte le pagine tranne `/login`
- [ ] Il contenuto è centrato con `max-w-5xl`
- [ ] Logout funziona e reindirizza a `/login`

---

## Fase 3D — Pagina Dashboard

**Agente:** Dashboard  
**Dipende da:** Fase 2B (KpiCard), Fase 2A (auth)  
**File da creare:** `app/page.tsx`

### Comportamento

- Recupera `GET /dashboard` (autenticato)
- Mostra una griglia di `KpiCard` con:

| KpiCard | Valore | `highlight` |
|---|---|---|
| Meeting totali | `totalMeetings` | no |
| Waste Score medio | `avgWasteScore.toFixed(1)` | no |
| % meeting OK | `percentMeetingsBelowThreshold.toFixed(0) + '%'` | no |
| Costo sprecato totale | `'€' + totalWastedCost.toFixed(0)` | sì se `totalWastedCost > 0` |
| Meeting in alert | `alertCount` | sì se `alertCount > 0` |
| Soglia alert | `threshold` | no |

- Durante il caricamento: mostra skeleton o spinner
- In caso di errore: mostra messaggio

### Checklist completamento Fase 3D

- [ ] La griglia KPI renderizza tutti e 6 i valori
- [ ] I `KpiCard` con `highlight` mostrano il bordo rosso
- [ ] Stato di caricamento gestito

---

## Fase 3E — Pagina Lista Meeting

**Agente:** Lista Meeting  
**Dipende da:** Fase 2B (MeetingList), Fase 2A (auth)  
**File da creare:** `app/meetings/page.tsx`

### Comportamento

- Recupera `GET /meetings` con i filtri correnti
- Controlli filtro (client-side, aggiornano la query):
  - **Tipo**: `Tutti` · `Passati` · `Futuri` → imposta `isFuture`
  - **Solo alert**: checkbox → imposta `onlyAlerts=true`
- Renderizza `<MeetingList meetings={...} />`
- Badge contatore: "X meeting trovati"
- Durante il caricamento: spinner

### Checklist completamento Fase 3E

- [ ] Lista si carica con tutti i meeting
- [ ] Filtro `isFuture` filtra correttamente
- [ ] Filtro `onlyAlerts` filtra correttamente
- [ ] Click su una riga naviga a `/meetings/{id}`

---

## Fase 3F — Pagina Dettaglio Meeting

**Agente:** Dettaglio  
**Dipende da:** Fase 2B (ScoreBadge), Fase 2A (auth)  
**File da creare:** `app/meetings/[id]/page.tsx`

### Comportamento

- Recupera `GET /meetings/{id}` (l'`id` viene da `params.id`)
- Mostra:
  - **Header**: Titolo, Data, Durata, badge `IsFuture` (Past / Future), `ScoreBadge` con WasteScore
  - **WasteReason**: testo evidenziato se `isAlert`
  - **Costo stimato**: `€ estimatedCost.toFixed(2)`
  - **Summary**: paragrafo testo
  - **Tabella partecipanti**: Nome · Ruolo · Costo/giorno (€)
  - **Allegati**: lista con link al `blobUrl` (target `_blank`)
- Pulsante **← Torna alla lista** → naviga a `/meetings`

### Formato costo stimato

```
Costo stimato = SUM(participant.dailyCost / 8 * (durationMinutes / 60))
```
Il valore è già calcolato dal backend: mostrare `estimatedCost` direttamente.

### Checklist completamento Fase 3F

- [ ] Tutti i campi del dettaglio sono visibili
- [ ] Tabella partecipanti renderizza correttamente
- [ ] Gli allegati hanno link funzionanti (mock URL)
- [ ] Il pulsante "Torna alla lista" funziona

---

## Dipendenze tra Fasi — Riepilogo

```
Fase 1 (Setup)
  └──► Fase 2A (Auth)       ──► Fase 3D (Dashboard)
  └──► Fase 2B (Components) ──► Fase 3D (Dashboard)
  │                         ──► Fase 3E (Lista)
  │                         ──► Fase 3F (Dettaglio)
  └──► Fase 2C (Layout)     ──► tutte le Fase 3
```

Gli agenti di Fase 3 possono partire non appena **tutti e tre** gli agenti di Fase 2 hanno completato.

---

## Smoke Test Finale

```bash
cd frontend
npm run build   # deve completare senza errori TypeScript
npm run dev

# 1. Aprire http://localhost:3000 → redirect a /login
# 2. Login con martina@company.com / password → redirect a /
# 3. Dashboard: 6 KpiCard visibili con valori
# 4. /meetings: lista con ScoreBadge colorati
# 5. /meetings/<id>: dettaglio con partecipanti e allegati
# 6. Logout → redirect a /login
```

---

## Vincoli PoC

- Nessuna gestione del token in cookie (solo `localStorage`)
- Nessun SSR per pagine autenticate (tutto `'use client'` dove necessario)
- Nessuna internazionalizzazione
- Nessun test E2E (fuori scope PoC)
