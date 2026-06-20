# 🧪 ARCHITETTURA DELLA PoC

# Meeting Waste Killer — PoC

| Voce | Dettaglio |
|---|---|
| **Versione** | 1.1 |
| **Data** | Giugno 2026 |
| **Stato** | Operativo per demo |
| **Fonte di verità** | `docs/plans/be-bootstrap.md` |

---

## 📑 Indice

1. Obiettivo PoC
2. Stack PoC
3. Architettura PoC
4. Struttura della Solution
5. Modello Dati
6. Autenticazione — JWT Mock
7. Endpoint implementati
8. Dati di seed
9. Layer Responsibilities
10. Configurazione (`appsettings.json`)
11. Test
12. Ordine di sviluppo
13. Note Architettura Enterprise
14. Checklist Demo

---

# 1. 🎯 Obiettivo PoC

PoC full-stack con **.NET 10 Web API** (backend) e **Next.js 15** (frontend) che espone **4 endpoint read-only** per visualizzare meeting (passati e futuri), il loro Waste Score e KPI aggregati di dashboard. Dati interamente seed statici, autenticazione JWT mock, nessuna integrazione esterna.

**Vincoli PoC:**

- Dati seed statici (nessun form di inserimento)
- WasteScore hardcodato nel seed (no calcolo algoritmico)
- Auth JWT mock con utenti hardcodati (no Entra ID)
- Nessuna integrazione esterna (no Azure Storage reale, URL allegati mock)

---

# 2. 🛠 Stack PoC

| Componente | Scelta |
|---|---|
| Frontend | Next.js 15 + Tailwind CSS + shadcn/ui (`npm run dev` → porta 3000) |
| Runtime | .NET 10 |
| Framework | ASP.NET Core Web API (Controller) |
| ORM | EF Core Code First |
| Database | SQL Server (LocalDB o Docker) |
| Auth | JWT Bearer con utenti hardcodati |
| Struttura | DDD multi-layer |

---

# 3. 🏗 Architettura PoC

```mermaid
graph LR
  subgraph FE["🖥 Frontend · Next.js 15 · porta 3000"]
    PageDashboard["🏠 Dashboard KPI"]
    PageLista["📋 Lista Meeting\n(filtri: isFuture, onlyAlerts)"]
    PageDettaglio["🔍 Dettaglio Meeting"]
  end

  subgraph BE["⚙️ Backend · .NET 10 · porta 5001"]
    Auth["POST /auth/login"]
    Meetings["GET /meetings"]
    MeetingById["GET /meetings/{id}"]
    DashboardBE["GET /dashboard"]
  end

  subgraph DB["🗄 SQL Server LocalDB"]
    MeetingsT[("meetings")]
    UsersT[("users")]
  end

  PageDashboard -->|GET /dashboard| DashboardBE
  PageLista -->|GET /meetings| Meetings
  PageDettaglio -->|GET /meetings/{id}| MeetingById
  DashboardBE --> MeetingsT
  Meetings --> MeetingsT
  MeetingById --> MeetingsT
  MeetingById --> UsersT
  Auth --> UsersT
```

---

# 4. 📁 Struttura della Solution

```
Internal.TeamBuilding2026.MeetingWasteKiller/
├── frontend/                                    # Next.js 15 app
│   ├── app/
│   │   ├── page.tsx                             # Dashboard KPI
│   │   ├── meetings/
│   │   │   ├── page.tsx                         # Lista meeting (filtri: isFuture, onlyAlerts)
│   │   │   └── [id]/page.tsx                    # Dettaglio meeting
│   ├── components/
│   │   ├── ScoreBadge.tsx
│   │   ├── KpiCard.tsx
│   │   └── MeetingList.tsx
│   └── package.json
├── src/
│   ├── MeetingWasteKiller.Domain/               # Entità, contratti repository
│   ├── MeetingWasteKiller.Business/             # Servizi applicativi, DTO, logica
│   ├── MeetingWasteKiller.Infrastructure/       # EF Core, DbContext, seed, repository impl
│   └── MeetingWasteKiller.Presentation/         # Web API, Controller, Program.cs
└── tests/
    └── MeetingWasteKiller.Business.Tests/       # Unit test con xUnit + NSubstitute + FluentAssertions
```

---

# 5. 🗂 Modello Dati

### User
```csharp
public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }          // es. "Senior Dev", "Manager", "Junior Dev"
    public decimal DailyCost { get; set; }    // costo giornaliero in € (usato per calcolo spreco)
}
```

### Meeting
```csharp
public class Meeting
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public string Summary { get; set; }          // riassunto (o agenda per meeting futuri)
    public decimal WasteScore { get; set; }      // 0–100, hardcodato nel seed
    public string WasteReason { get; set; }      // spiegazione testuale del punteggio
    public bool IsFuture { get; set; }           // true = meeting non ancora avvenuto
    public bool IsAlert { get; set; }            // true se WasteScore > soglia
    public ICollection<MeetingParticipant> Participants { get; set; }
    public ICollection<Attachment> Attachments { get; set; }
}
```

### MeetingParticipant
```csharp
public class MeetingParticipant
{
    public Guid MeetingId { get; set; }
    public Guid UserId { get; set; }
    public Meeting Meeting { get; set; }
    public User User { get; set; }
}
```

### Attachment
```csharp
public class Attachment
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public string FileName { get; set; }
    public string BlobUrl { get; set; }   // URL mock: https://fakestorage.blob.core.windows.net/...
    public Meeting Meeting { get; set; }
}
```

---

# 6. 🔐 Autenticazione — JWT Mock

### Endpoint
```
POST /auth/login
Body:    { "email": "user@example.com", "password": "password" }
Response: { "token": "<jwt>", "expiresAt": "..." }
```

### Utenti hardcodati
```json
[
  { "email": "martina@company.com", "password": "password", "role": "Manager" },
  { "email": "dev@company.com",     "password": "password", "role": "Developer" }
]
```

Tutti gli endpoint (tranne `/auth/login`) richiedono `[Authorize]`.

---

# 7. 🌐 Endpoint implementati (PoC)

| Metodo | Endpoint | Auth | Descrizione |
|---|---|---|---|
| POST | `/auth/login` | ❌ | Login mock → JWT |
| GET | `/meetings` | ✅ | Lista meeting (past + future) con WasteScore e IsAlert |
| GET | `/meetings/{id}` | ✅ | Dettaglio meeting + partecipanti + allegati + estimatedCost |
| GET | `/dashboard` | ✅ | KPI aggregati (spreco totale, avg score, % sotto soglia) |

### `GET /meetings`

**Query params opzionali:**
- `?isFuture=true|false` — filtra per tipo
- `?onlyAlerts=true` — ritorna solo meeting con `IsAlert = true`

**Response:**
```json
[
  {
    "id": "...",
    "title": "Sprint Planning Q3",
    "date": "2026-06-10T09:00:00",
    "durationMinutes": 90,
    "wasteScore": 80.0,
    "wasteReason": "Meeting con 6 partecipanti senior, nessuna decisione presa, ordine del giorno assente.",
    "isAlert": true,
    "isFuture": false,
    "participantCount": 6
  }
]
```

### `GET /meetings/{id}`

**Response:**
```json
{
  "id": "...",
  "title": "Sprint Planning Q3",
  "date": "2026-06-10T09:00:00",
  "durationMinutes": 90,
  "summary": "Discussione generale senza decisioni operative.",
  "wasteScore": 80.0,
  "wasteReason": "...",
  "isAlert": true,
  "isFuture": false,
  "estimatedCost": 675.00,
  "participants": [
    { "userId": "...", "name": "Mario Rossi", "role": "Manager", "dailyCost": 800.0 }
  ],
  "attachments": [
    { "id": "...", "fileName": "agenda.pdf", "blobUrl": "https://fakestorage..." }
  ]
}
```

**Calcolo `estimatedCost`:**
```
estimatedCost = SUM(participant.DailyCost / 8 * (durationMinutes / 60))
```

### `GET /dashboard`

**Response:**
```json
{
  "totalMeetings": 5,
  "avgWasteScore": 56.0,
  "percentMeetingsBelowThreshold": 40.0,
  "totalWastedCost": 2430.00,
  "threshold": 60,
  "alertCount": 2
}
```

---

# 8. 🗃 Dati di seed

Precaricare nel `DbContext.OnModelCreating` (o in un `IHostedService` di seed):

### Utenti mock (3)

| Nome | Ruolo | Costo/giorno |
|---|---|---|
| Manager | Manager | €800 |
| Senior Dev | Senior Dev | €600 |
| Junior Dev | Junior Dev | €350 |

### Meeting pre-caricati

- **5 meeting passati** con WasteScore variabili (es. 80, 65, 30, 15, 90)
- **2 meeting futuri** con WasteScore predittivo basato su agenda/partecipanti (es. 75, 20)
- Ogni meeting ha 2–4 partecipanti e 0–2 allegati con URL mock

### Regola IsAlert

```
IsAlert = WasteScore > 60
```

Soglia configurabile in `appsettings.json` → `WasteScore:AlertThreshold`.

---

# 9. ⚙️ Layer Responsibilities

### Domain
- Entità: `User`, `Meeting`, `MeetingParticipant`, `Attachment`
- Interfacce repository: `IMeetingRepository`, `IUserRepository`

### Business
- `MeetingService` — logica per lista, dettaglio, calcolo `estimatedCost`
- `DashboardService` — aggregazione KPI
- `AuthService` — validazione credenziali mock + generazione JWT
- DTO di output (response models)

### Infrastructure
- `MeetingWasteKillerDbContext` (EF Core)
- Implementazioni repository
- Seed data (`DataSeeder`)
- Configurazioni EF (Fluent API)

### Presentation
- `MeetingsController`
- `AuthController`
- `DashboardController`
- `Program.cs` — DI, JWT middleware, EF, Swagger

---

# 10. 🔧 Configurazione (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "Default": "Server=(localdb)\\mssqllocaldb;Database=MeetingWasteKillerDb;Trusted_Connection=True;"
  },
  "Jwt": {
    "Key": "MeetingWasteKiller_SuperSecretKey_32chars!",
    "Issuer": "MeetingWasteKiller",
    "Audience": "MeetingWasteKillerClient",
    "ExpiryHours": 8
  },
  "WasteScore": {
    "AlertThreshold": 60
  }
}
```

---

# 11. 🧪 Test (`Business.Tests`)

| Test | Descrizione |
|---|---|
| `MeetingService_GetAll_ReturnsMeetingsWithCorrectAlertFlag` | Verifica IsAlert corretto per ogni WasteScore |
| `MeetingService_GetById_ReturnsCorrectEstimatedCost` | Verifica formula costo stimato |
| `DashboardService_GetKpis_ReturnsCorrectAggregates` | Verifica KPI aggregati |
| `AuthService_Login_WithValidCredentials_ReturnsToken` | Login valido → JWT |
| `AuthService_Login_WithInvalidCredentials_ThrowsUnauthorized` | Login non valido → 401 |

> Stack test: **xUnit + [Theory] + [InlineData]** dove possibile, **NSubstitute** per i mock dei repository, **FluentAssertions** per le asserzioni.

---

# 12. 🚀 Ordine di sviluppo

1. **Scaffold solution** — creare i 4 progetti + test project con `dotnet new`
2. **Domain** — entità + interfacce repository
3. **Infrastructure** — DbContext + Fluent API + seed + migration
4. **Business** — servizi + DTO
5. **Presentation** — controller + `Program.cs` (DI, JWT, Swagger)
6. **Frontend** — scaffold Next.js 15, configurare proxy API, implementare Dashboard, Lista e Dettaglio
7. **Test** — unit test dei servizi
8. **Smoke test** — avviare backend + frontend, applicare migration, verificare Swagger e UI

### Avvio locale

**Backend:**
```bash
cd src/MeetingWasteKiller.Presentation
dotnet restore
dotnet ef database update
dotnet run
# → https://localhost:5001/swagger
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

> **`.env.local` (frontend):**
> ```
> NEXT_PUBLIC_API_URL=https://localhost:5001
> ```

---

# 13. 🏢 Note Architettura Enterprise (out of scope PoC)

| Componente | Descrizione |
|---|---|
| **Microsoft Graph API** | Recupero meeting da Outlook Calendar, profili utente/ruoli da Azure AD |
| **Azure AI Foundry** | Analisi intelligente del meeting (trascrizione, NLP, scoring semantico) |
| **PostgreSQL + pgvector** | Salvataggio embedding per ricerca semantica su meeting |
| **Azure Blob Storage** | Upload reale degli allegati |
| **Azure Key Vault** | Secrets management |
| **Azure Static Web App** | Hosting frontend |
| **Entra ID** | Autenticazione reale al posto del JWT mock |

---

# 14. ✅ Checklist Demo

| Step | Azione | Effetto atteso |
|---|---|---|
| 1 | Apri la dashboard (`/`) | KPI visibili: avgWasteScore, costo sprecato totale, conteggio alert |
| 2 | Naviga alla lista meeting (`/meetings`) | Badge colorati per WasteScore, filtro `onlyAlerts` funzionante |
| 3 | Clicca su un meeting ad alto WasteScore | Dettaglio con partecipanti, `estimatedCost` calcolato, WasteReason |
| 4 | Filtra per `?isFuture=true` | Visualizzati solo i meeting futuri |
| 5 | Controlla `/swagger` | Tutti e 4 gli endpoint documentati e testabili con JWT |
