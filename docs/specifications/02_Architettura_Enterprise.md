# 🏛 ARCHITETTURA ENTERPRISE

# Meeting Waste Killer

| Voce | Dettaglio |
|---|---|
| **Versione** | 1.1 |
| **Data** | Giugno 2026 |
| **Stato** | Draft |
| **Riferimento PoC** | `docs/specifications/03_Architettura_PoC.md` |

---

## 📑 Indice

1. Obiettivo Enterprise
2. Stack Enterprise
3. Struttura della Solution
4. Modello Dati
5. Autenticazione — Entra ID
6. Endpoint API
7. Integrazione Microsoft Graph API
8. Azure AI Foundry — WasteScore intelligente
9. Azure Blob Storage — Allegati reali
10. Layer Responsibilities
11. Configurazione (`appsettings.json`)
12. Test
13. Frontend — Next.js 15
14. Sicurezza — Defence in Depth
15. Performance e Scalabilità

---

# 1. 🎯 Obiettivo Enterprise

Evoluzione del PoC verso un'applicazione aziendale completa che:

- Recupera meeting e profili utente **direttamente da Microsoft 365** tramite Graph API (niente seed statici)
- Calcola il WasteScore in modo **intelligente e semantico** tramite Azure AI Foundry (niente hardcode)
- Persiste i meeting con **embedding vettoriali** su PostgreSQL + pgvector per ricerca semantica
- Gestisce gli allegati su **Azure Blob Storage** reale
- Autentica gli utenti tramite **Microsoft Entra ID** (SSO aziendale)
- Espone il frontend come **Azure Static Web App** (Next.js 15)

---

# 2. 🛠 Stack Enterprise

| Componente | Tecnologia | Note |
|---|---|---|
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui | Azure Static Web App |
| **Backend** | .NET 10 Web API (Controller) | Azure App Service, DDD multi-layer |
| **Database** | PostgreSQL + pgvector | Azure Database for PostgreSQL Flexible Server |
| **ORM** | EF Core Code First | Provider Npgsql |
| **Auth** | Microsoft Entra ID (SSO + JWT Bearer) | Sostituisce JWT mock del PoC |
| **AI** | Azure AI Foundry | WasteScore semantico, analisi meeting |
| **Storage** | Azure Blob Storage | Allegati meeting reali |
| **Secrets** | Azure Key Vault | Managed Identity, zero secret in config |
| **Graph API** | Microsoft Graph API | Sorgente meeting (Outlook) e profili utente (Azure AD) |
| **Gateway** | Azure API Management | Rate limiting, JWT validation, IP filtering |
| **CDN / WAF** | Azure Front Door Premium | Edge caching, WAF OWASP 3.2, DDoS protection |
| **Cache** | Azure Cache for Redis | Dashboard KPI, Foundry results, Graph delta tokens |
| **Network** | Azure VNet + Private Endpoints | Zero public exposure per DB, Storage, Key Vault |

---

# 3. 📁 Struttura della Solution

Stessa struttura DDD del PoC, estesa con i client enterprise nell'Infrastructure:

```
Internal.TeamBuilding2026.MeetingWasteKiller/
├── src/
│   ├── MeetingWasteKiller.Domain/               # Entità, contratti repository
│   ├── MeetingWasteKiller.Business/             # Servizi applicativi, DTO, logica
│   ├── MeetingWasteKiller.Infrastructure/       # EF Core (PostgreSQL), Graph API client,
│   │                                            # Foundry client, Blob Storage client, Key Vault
│   └── MeetingWasteKiller.Presentation/         # Web API, Controller, Program.cs
└── tests/
    └── MeetingWasteKiller.Business.Tests/       # Unit test con xUnit + NSubstitute + FluentAssertions
```

---

# 4. 🗂 Modello Dati

Le entità core sono le stesse del PoC. In enterprise si aggiunge `MeetingEmbedding` per la ricerca semantica su pgvector, e `GraphId` sulle entità sincronizzate da Graph API.

### User _(esteso)_
```csharp
public class User
{
    public Guid Id { get; set; }
    public string GraphId { get; set; }       // OID da Azure AD
    public string Name { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }          // ruolo aziendale da Azure AD
    public decimal DailyCost { get; set; }    // configurato in app, non da Graph
}
```

### Meeting _(esteso)_
```csharp
public class Meeting
{
    public Guid Id { get; set; }
    public string GraphEventId { get; set; }     // ID evento Outlook Calendar
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public string Summary { get; set; }          // trascrizione/riassunto da Foundry
    public decimal WasteScore { get; set; }      // calcolato da Foundry
    public string WasteReason { get; set; }      // spiegazione semantica da Foundry
    public bool IsFuture { get; set; }
    public bool IsAlert { get; set; }            // WasteScore > soglia
    public ICollection<MeetingParticipant> Participants { get; set; }
    public ICollection<Attachment> Attachments { get; set; }
    public MeetingEmbedding Embedding { get; set; }
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

### Attachment _(esteso)_
```csharp
public class Attachment
{
    public Guid Id { get; set; }
    public Guid MeetingId { get; set; }
    public string FileName { get; set; }
    public string BlobUrl { get; set; }   // URL reale su Azure Blob Storage
    public Meeting Meeting { get; set; }
}
```

### MeetingEmbedding _(nuovo)_
```csharp
public class MeetingEmbedding
{
    public Guid MeetingId { get; set; }
    public float[] Vector { get; set; }   // embedding pgvector da Foundry
    public Meeting Meeting { get; set; }
}
```

---

# 5. 🔐 Autenticazione — Entra ID

Sostituisce il JWT mock del PoC con Microsoft Entra ID (SSO aziendale).

| Aspetto | PoC | Enterprise |
|---|---|---|
| Provider | JWT mock hardcodato | Microsoft Entra ID |
| Utenti | 2 hardcodati in `appsettings.json` | Tutti gli utenti Azure AD aziendali |
| Ruoli | `role` nel JWT | App Roles da Azure AD (User / Manager) |
| Token | JWT firmato localmente | JWT firmato da Entra ID |
| Flusso | `POST /auth/login` custom | OAuth 2.0 Authorization Code + PKCE |

Tutti gli endpoint (tranne health check) richiedono `[Authorize]` con policy basate su App Roles Entra ID.

---

# 6. 🌐 Endpoint API

Gli endpoint rimangono gli stessi del PoC. In enterprise la sorgente dati non è il seed ma Graph API + PostgreSQL, e il WasteScore è calcolato da Foundry.

| Metodo | Endpoint | Auth | Descrizione |
|---|---|---|---|
| GET | `/meetings` | ✅ | Lista meeting sincronizzati da Outlook, con WasteScore Foundry e IsAlert |
| GET | `/meetings/{id}` | ✅ | Dettaglio meeting + partecipanti (profili da AD) + allegati (Blob) + estimatedCost |
| GET | `/dashboard` | ✅ | KPI aggregati (spreco totale, avg score, % sotto soglia) |

### `GET /meetings` — query params
- `?isFuture=true|false` — filtra meeting passati/futuri
- `?onlyAlerts=true` — solo meeting con `IsAlert = true`

### `GET /meetings/{id}` — `estimatedCost`
```
estimatedCost = SUM(participant.DailyCost / 8 * (durationMinutes / 60))
```

### `GET /dashboard` — response
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

# 7. 🔗 Integrazione Microsoft Graph API

Graph API è la **sorgente primaria** dei dati in enterprise, sostituisce il seed statico del PoC.

| Dato | Graph API endpoint | Uso |
|---|---|---|
| Meeting passati | `GET /me/events?$filter=end/dateTime lt {now}` | Popola lista meeting storici |
| Meeting futuri | `GET /me/events?$filter=start/dateTime gt {now}` | Meeting schedulati + alert predittivi |
| Profilo utente | `GET /users/{id}` | Nome, email, job title (→ `Role`) |
| Partecipanti | `event.attendees` | Lista partecipanti con email |
| Allegati | `GET /me/events/{id}/attachments` | File allegati → uploadati su Blob Storage |

### Flusso di sincronizzazione
1. Al login, il backend chiama Graph API con il token Entra ID dell'utente
2. I meeting vengono upsertati nel database PostgreSQL
3. Per ogni meeting nuovo/aggiornato, Foundry calcola il WasteScore e salva l'embedding
4. `IsAlert` è derivato: `WasteScore > AlertThreshold`

---

# 8. 🤖 Azure AI Foundry — WasteScore intelligente

Sostituisce il WasteScore hardcodato del PoC con analisi semantica.

### Input al modello Foundry
```json
{
  "title": "Sprint Planning Q3",
  "durationMinutes": 90,
  "participantCount": 8,
  "participantRoles": ["Manager", "Senior Dev", "Junior Dev", "..."],
  "summary": "Discussione agenda, nessuna decisione presa...",
  "hasAttachments": true,
  "isFuture": false
}
```

### Output atteso
```json
{
  "wasteScore": 78.5,
  "wasteReason": "Meeting con 8 partecipanti di ruoli senior senza decisioni operative registrate. Costo stimato elevato rispetto all'output prodotto.",
  "confidence": 0.91
}
```

### Embedding per ricerca semantica
- Foundry genera un embedding vettoriale del `summary` di ogni meeting
- L'embedding è salvato nella tabella `MeetingEmbedding` (colonna `vector` pgvector)
- Permette ricerca semantica tipo "trovami meeting simili a questo"

---

# 9. 📦 Azure Blob Storage — Allegati reali

Sostituisce gli URL mock del PoC con upload reale.

| Aspetto | PoC | Enterprise |
|---|---|---|
| URL allegati | Mock hardcodati nel seed | URL reali su Azure Blob Storage |
| Upload | Non implementato | Graph API scarica l'allegato → upload su Blob |
| Container | — | `meeting-attachments` (private, access via SAS token) |
| Naming | — | `{meetingId}/{attachmentId}/{fileName}` |

---

# 10. ⚙️ Layer Responsibilities

Stessa struttura DDD del PoC, con responsabilità estese all'enterprise:

### Domain
- Entità: `User`, `Meeting`, `MeetingParticipant`, `Attachment`, `MeetingEmbedding`
- Interfacce repository: `IMeetingRepository`, `IUserRepository`, `IEmbeddingRepository`
- Contratti servizi esterni: `IFoundryService`, `IGraphService`, `IBlobStorageService`

### Business
- `MeetingService` — lista, dettaglio, calcolo `estimatedCost`, sincronizzazione da Graph
- `DashboardService` — aggregazione KPI
- `WasteScoreService` — orchestrazione chiamata Foundry + salvataggio embedding
- DTO di output (response models)

### Infrastructure
- `MeetingWasteKillerDbContext` (EF Core + Npgsql + pgvector)
- Implementazioni repository
- `GraphApiClient` — chiamate a Microsoft Graph
- `FoundryClient` — chiamate ad Azure AI Foundry
- `AzureBlobStorageService` — upload/download allegati
- Configurazioni EF (Fluent API)

### Presentation
- `MeetingsController`
- `DashboardController`
- `Program.cs` — DI, Entra ID middleware, EF, Swagger

---

# 11. 🔧 Configurazione (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "Default": "Host=...;Database=MeetingWasteKillerDb;Username=...;Password=..."
  },
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "<tenant-id>",
    "ClientId": "<client-id>",
    "ClientSecret": "<from-key-vault>"
  },
  "GraphApi": {
    "BaseUrl": "https://graph.microsoft.com/v1.0"
  },
  "Foundry": {
    "Endpoint": "https://<foundry-endpoint>.openai.azure.com/",
    "DeploymentName": "meeting-waste-analyzer",
    "ApiKey": "<from-key-vault>"
  },
  "BlobStorage": {
    "ConnectionString": "<from-key-vault>",
    "ContainerName": "meeting-attachments"
  },
  "WasteScore": {
    "AlertThreshold": 60
  }
}
```

> Tutti i valori sensibili (`ClientSecret`, `ApiKey`, `ConnectionString`) sono letti da **Azure Key Vault** tramite Managed Identity. Non sono mai in chiaro in config o in source control.

---

# 12. 🧪 Test (`Business.Tests`)

Stessa struttura del PoC, con mock dei client enterprise:

| Test | Descrizione |
|---|---|
| `MeetingService_GetAll_ReturnsMeetingsWithCorrectAlertFlag` | Verifica IsAlert corretto per ogni WasteScore |
| `MeetingService_GetById_ReturnsCorrectEstimatedCost` | Verifica formula costo stimato |
| `DashboardService_GetKpis_ReturnsCorrectAggregates` | Verifica KPI aggregati |
| `WasteScoreService_Analyze_CallsFoundryAndPersistsEmbedding` | Verifica orchestrazione Foundry |
| `MeetingService_Sync_CallsGraphAndUpsertsDb` | Verifica sincronizzazione da Graph API |

> Stack test: **xUnit + [Theory] + [InlineData]** dove possibile, **NSubstitute** per i mock di `IFoundryService`, `IGraphService`, `IBlobStorageService`, **FluentAssertions** per le asserzioni.

---

# 13. 🖥 Frontend — Next.js 15

### Stack
| Componente | Scelta |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguaggio | TypeScript |
| Stile | Tailwind CSS |
| Component library | shadcn/ui |
| Auth | NextAuth.js con provider Entra ID |
| Hosting | Azure Static Web App |

### Struttura pagine

```
app/
├── page.tsx                  # Dashboard KPI
├── meetings/
│   ├── page.tsx              # Lista meeting (past + future) con badge WasteScore
│   └── [id]/
│       └── page.tsx          # Dettaglio meeting: partecipanti, allegati, costo stimato
└── layout.tsx                # Shell con navigazione e auth guard
```

### Pagine principali

| Pagina | Endpoint consumato | Contenuto |
|---|---|---|
| **Dashboard** | `GET /dashboard` | KPI: spreco totale, avg score, % meeting sotto soglia, alert count |
| **Lista Meeting** | `GET /meetings` | Tabella con badge colorati WasteScore, filtri past/future/alert |
| **Dettaglio Meeting** | `GET /meetings/{id}` | Summary, partecipanti con ruolo e costo, allegati, estimatedCost, WasteReason |

### Badge WasteScore
```
WasteScore ≥ 70  →  🔴 Alto spreco    (alert visivo)
WasteScore 40–69 →  🟠 Spreco medio
WasteScore < 40  →  🟢 Meeting utile
```

---

# 14. 🔐 Sicurezza — Defence in Depth

Approccio a **strati concentrici**: ogni layer ha le proprie difese indipendenti. Una singola vulnerabilità non compromette il sistema.

## 14.1 Perimetro di rete

```
Internet → Azure Front Door (WAF) → API Management → App Service (VNet Integration)
                                                            │
                                            ┌───────────────┼───────────────┐
                                     Private Endpoint   Private Endpoint   Private Endpoint
                                      PostgreSQL         Blob Storage       Key Vault
                                     (no public IP)     (no public IP)    (no public IP)
```

| Componente | Configurazione sicura |
|---|---|
| **Azure Front Door Premium** | WAF policy OWASP CRS 3.2, rate limiting 100 req/min per IP, geo-blocking opzionale |
| **Azure API Management** | JWT validation prima che la request raggiunga il backend, IP allowlist, subscription keys opzionali |
| **App Service** | VNet Integration abilitata, `WEBSITE_DNS_SERVER` su Azure DNS privato, accesso in ingresso solo da APIM |
| **PostgreSQL Flexible Server** | Private Endpoint, SSL required (`sslmode=require`), no public network access |
| **Blob Storage** | Private Endpoint, public blob access disabled, accesso solo tramite SAS token o Managed Identity |
| **Key Vault** | Private Endpoint, firewall abilitato, accesso solo da Managed Identity del App Service |

## 14.2 Identità e accesso (Zero Trust)

| Principio | Implementazione |
|---|---|
| **Never trust, always verify** | Ogni chiamata backend verifica il JWT Entra ID (audience, issuer, expiry, signature) |
| **Least privilege** | App Service ha Managed Identity con permessi minimi: `get/list` su Key Vault, `Storage Blob Data Contributor` su container specifico |
| **MFA enforced** | Conditional Access policy Entra ID: MFA obbligatorio per tutti gli utenti dell'app |
| **App Roles** | `MeetingWasteKiller.User` e `MeetingWasteKiller.Manager` — assegnazione esplicita, nessun accesso default |
| **Token lifetime** | Access token: 1h. Refresh token: 8h. Nessun token persistito su localStorage |
| **PKCE** | OAuth 2.0 Authorization Code + PKCE sul frontend (niente implicit flow) |

## 14.3 Secrets management

```
App Service (Managed Identity)
    │
    └─► Key Vault
            ├── ConnectionStrings__Default          (PostgreSQL connection string)
            ├── Foundry__ApiKey                     (Azure AI Foundry key)
            ├── BlobStorage__ConnectionString        (Blob Storage connection string)
            └── AzureAd__ClientSecret               (Entra ID client secret)
```

- **Zero secret in codice o in `appsettings.json`** — tutti i valori sensibili sono referenziati come `@Microsoft.KeyVault(SecretUri=...)` in App Service Configuration
- **Secret rotation**: Key Vault Soft Delete + Purge Protection abilitati; rotazione semestrale con versioning automatico
- **Audit trail**: ogni accesso a Key Vault è loggato in Azure Monitor

## 14.4 Sicurezza API

| Misura | Dettaglio |
|---|---|
| **HTTPS-only** | `UseHsts()` + `UseHttpsRedirection()` in `Program.cs`; TLS 1.2 minimo, TLS 1.3 preferito |
| **CORS** | Whitelist esplicita: solo l'URL della Static Web App (`https://<app>.azurestaticapps.net`) |
| **Input validation** | FluentValidation su tutti i DTO in ingresso; EF Core usa sempre query parametrizzate (no SQL injection) |
| **Request size limit** | Max 10 MB per request (configurato in Kestrel) |
| **Rate limiting** | Azure APIM: 100 req/min per utente autenticato; 10 req/min per endpoint `/dashboard` |
| **Response headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` |

## 14.5 Sicurezza frontend

| Misura | Dettaglio |
|---|---|
| **CSP** | `Content-Security-Policy` header restrittivo: `default-src 'self'`, nessun `unsafe-inline` |
| **Cookie** | `HttpOnly`, `Secure`, `SameSite=Strict` per session cookie NextAuth.js |
| **Nessun dato sensibile client-side** | Token Entra ID mai in localStorage; sessione gestita server-side da NextAuth.js |
| **Dependency audit** | `npm audit` in CI ad ogni build; Dependabot abilitato sul repo |

## 14.6 Crittografia dei dati

| Layer | Crittografia |
|---|---|
| **In transit** | TLS 1.3 (Frontend → Front Door → APIM → App Service → DB/Storage) |
| **At rest — PostgreSQL** | AES-256 via Azure Disk Encryption (abilitato di default su Flexible Server) |
| **At rest — Blob Storage** | AES-256 via Azure Storage Service Encryption (abilitato di default) |
| **At rest — Embedding vectors** | Crittografati insieme alla riga PostgreSQL (nessuna gestione separata) |
| **SAS token allegati** | Short-lived (TTL 15 min), read-only, scope sul singolo blob |

---

# 15. ⚡ Performance e Scalabilità

## 15.1 Architettura di caching

```
Client → Azure Front Door (edge cache) → APIM → App Service
                                                     │
                                              Azure Cache for Redis
                                              ├── dashboard:kpis        TTL 5 min
                                              ├── meeting:{id}          TTL 15 min
                                              ├── foundry:{hash}        TTL 24h (result cache)
                                              └── graph:delta:{userId}  no TTL (delta token)
```

| Cache layer | Cosa viene cachato | TTL | Invalidazione |
|---|---|---|---|
| **Azure Front Door** | Risposte statiche Next.js, assets | Long TTL + CDN purge | Deploy automatico |
| **Redis — dashboard** | `GET /dashboard` response per utente | 5 min | On-demand se dati cambiano |
| **Redis — meeting detail** | `GET /meetings/{id}` response | 15 min | Invalidato on sync Graph |
| **Redis — Foundry result** | Output Foundry per hash del contenuto meeting | 24h | Mai (deterministico) |
| **Redis — Graph delta token** | `@odata.deltaLink` per sync incrementale | Permanente | Aggiornato ad ogni sync |

## 15.2 Database — PostgreSQL

| Ottimizzazione | Dettaglio |
|---|---|
| **Connection pooling** | Npgsql built-in pool: `MinPoolSize=5`, `MaxPoolSize=50`; in produzione aggiungere PgBouncer in transaction mode |
| **Indici** | `Meeting.Date DESC`, `Meeting.WasteScore`, `Meeting.IsFuture`, `Meeting.IsAlert`, `MeetingParticipant.UserId` |
| **pgvector HNSW** | `CREATE INDEX ON meeting_embeddings USING hnsw (vector vector_cosine_ops) WITH (m=16, ef_construction=64)` — ricerca semantica O(log n) |
| **EF Core compiled queries** | `EF.CompileAsyncQuery(...)` per le query hot path (lista meeting, dashboard aggregation) |
| **Pagination** | `GET /meetings` supporta `?page=1&pageSize=20`; cursor-based per grandi dataset |
| **Read replicas** | Flexible Server Read Replica per query di solo lettura (dashboard, lista) — zero impatto sulle write |

## 15.3 Backend .NET — pattern di resilienza

```csharp
// Polly policy per chiamate esterne (Foundry + Graph API)
services.AddHttpClient<IFoundryClient>()
    .AddResilienceHandler("foundry", pipeline =>
    {
        pipeline.AddRetry(new RetryStrategyOptions
        {
            MaxRetryAttempts = 3,
            Delay = TimeSpan.FromSeconds(2),
            BackoffType = DelayBackoffType.Exponential
        });
        pipeline.AddCircuitBreaker(new CircuitBreakerStrategyOptions
        {
            FailureRatio = 0.5,
            SamplingDuration = TimeSpan.FromSeconds(30),
            BreakDuration = TimeSpan.FromSeconds(60)
        });
        pipeline.AddTimeout(TimeSpan.FromSeconds(10));
    });
```

| Pattern | Applicato a | Beneficio |
|---|---|---|
| **Retry + exponential backoff** | Foundry, Graph API, Redis | Transient fault recovery |
| **Circuit breaker** | Foundry, Graph API | Fail fast se servizio esterno è down |
| **Timeout** | Foundry (10s), Graph API (5s) | Nessuna request appesa indefinitamente |
| **Bulkhead** | Foundry (max 10 concurrent calls) | Isolamento del pool di thread |
| **Async/await ovunque** | Tutti i controller e servizi | Nessun thread bloccato su I/O |

## 15.4 Foundry — elaborazione asincrona

Il calcolo del WasteScore **non blocca** la risposta API. Flusso:

```
POST Graph sync → upsert meeting nel DB → risponde 202 Accepted
                                              │
                              (background) Azure Queue Storage / background service
                                              │
                                    Foundry calcola WasteScore
                                              │
                                    Salva WasteScore + Embedding su DB
                                              │
                                    Invalida cache Redis meeting:{id}
```

I meeting appena sincronizzati appaiono in lista con `WasteScore = null` e badge "In analisi" finché Foundry non completa.

## 15.5 Frontend — Next.js 15 performance

| Ottimizzazione | Dettaglio |
|---|---|
| **Server Components** | `GET /dashboard` e `GET /meetings` sono fetch server-side — zero waterfall client |
| **ISR (Incremental Static Regeneration)** | Dashboard rivalidata ogni 5 min (`revalidate: 300`) |
| **Streaming** | Lista meeting usa `<Suspense>` con skeleton mentre arrivano i dati |
| **Image optimization** | `next/image` con lazy loading per avatar partecipanti |
| **Bundle splitting** | shadcn/ui importato a componente (no barrel import) per minimizzare bundle size |
| **Azure Front Door CDN** | Tutti gli asset statici Next.js (`/_next/static/*`) serviti dall'edge con cache immutabile |

## 15.6 Target di performance

| Metrica | Target | Come |
|---|---|---|
| `GET /meetings` (cached) | < 100ms | Redis hit |
| `GET /meetings` (uncached) | < 500ms | DB index + compiled query |
| `GET /dashboard` (cached) | < 80ms | Redis hit |
| `GET /dashboard` (uncached) | < 800ms | DB aggregation + read replica |
| `GET /meetings/{id}` | < 200ms | Redis hit o DB con index |
| Foundry WasteScore (async) | < 15s | Background, non blocca UI |
| Frontend LCP (dashboard) | < 1.2s | SSR + CDN + ISR |
| Scalabilità orizzontale | Auto-scale 2–10 istanze | App Service Plan S2+ con autoscale rule su CPU > 70% |
