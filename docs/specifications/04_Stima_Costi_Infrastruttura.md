# 💶 STIMA COSTI INFRASTRUTTURA ENTERPRISE

# Meeting Waste Killer

| Voce | Dettaglio |
|---|---|
| **Versione** | 1.0 |
| **Data** | Giugno 2026 |
| **Autore** | *(da compilare — Architect / PM)* |
| **Stato** | Template — da completare |
| **Riferimento** | Architettura Enterprise Finale v1.1 |

> ⚠️ **Nota:** I valori sotto sono stime indicative basate su listino Azure pubblico (giugno 2026).
> Devono essere verificati e personalizzati in base al tenant, accordi EA/MCA del cliente e volumi reali.

---

## 📑 Indice

1. Ipotesi di dimensionamento
2. Stima costi Azure mensili
3. Costi one-time (setup)
4. Riepilogo TCO (3 anni)
5. Scenari di scaling
6. Note e assunzioni

---

# 1. 📐 Ipotesi di dimensionamento

| Parametro | Valore ipotizzato | Note |
|---|---|---|
| Utenti attivi | 500 | Azienda target media |
| Meeting medi/giorno | ~50 | 0,1 meeting/utente/giorno |
| Analisi pre-meeting/giorno | ~50 | 1:1 con meeting |
| Richieste API/giorno | ~500–1.000 | CRUD + analyze + stats |
| Storage dati stimato (annuo) | < 10 GB | Meeting + log + export |
| Uptime richiesto | 99,5% | ~3,6h downtime/mese tollerato |

---

# 2. ☁️ Stima costi Azure mensili

| Servizio | SKU / Config | Costo/mese stimato | Note |
|---|---|---|---|
| **Azure App Service** | S2 (2 core, 3.5 GB RAM) | ~75 € | Backend .NET |
| **Azure Static Web App** | Standard tier | ~9 € | Next.js 15 (App Router, Server Components) |
| **Azure Database for PostgreSQL Flexible Server** | GP_Standard_D4s_v3 (4 vCore, pgvector) | ~200 € | Prod DB, HA integrata, embedding vettoriali |
| **Azure Cache for Redis** | C1 Standard (1 GB) | ~50 € | Engine caching |
| **Azure AI Foundry** | GPT-4o deployment (WasteScore + embedding) | ~100 € | Stima 1M token/mese, embedding inclusi |
| **Azure API Management** | Developer tier | ~50 € | Rate limiting, JWT validation, IP filtering |
| **Azure Front Door Premium** | WAF + CDN | ~200 € | WAF OWASP CRS 3.2, DDoS protection, edge caching |
| **Application Insights** | Pay-per-use (~5 GB/mese) | ~15 € | Telemetria + log |
| **Log Analytics Workspace** | Pay-per-use | ~10 € | Audit log, query |
| **Azure Key Vault** | Standard | ~5 € | Secrets |
| **Azure Queue Storage** | LRS, uso minimo | ~2 € | Coda async per calcolo WasteScore Foundry |
| **Azure DevOps** | Basic (5 utenti inclusi) | 0–30 € | CI/CD pipelines |
| **Bandwidth egress** | ~10 GB/mese stimati | ~10 € | |
| **Backup / Storage** | LRS, < 10 GB | ~5 € | |
| **TOTALE MENSILE** | | **~731–761 € (≈ 750 €)** | |
| **TOTALE ANNUO** | | **~9.000 €** | |

> 📝 *Da compilare: verificare se il cliente ha già accordi EA o MACC con Microsoft che riducono i listini del 20–40%.*

---

# 3. 🔧 Costi one-time (setup)

| Voce | Stima | Note |
|---|---|---|
| Setup tenant Azure / subscription | 0 € | Se già esistente |
| Configurazione Entra ID SSO | *(incluso in GG uomo)* | Vedi doc Stima GG |
| Setup CI/CD pipelines | *(incluso in GG uomo)* | |
| Licenze shadcn/ui, librerie open-source | 0 € | MIT license |
| Licenza Next.js / .NET | 0 € | Open source |
| Domini / certificati SSL | ~50 € | Se non già in accordo |
| **TOTALE ONE-TIME** | **~50 €** | Escluso lavoro |

---

# 4. 📊 Riepilogo TCO (3 anni)

| Anno | Infrastruttura | Manutenzione (est.) | Totale |
|---|---|---|---|
| Anno 1 | ~9.000 € | ~*(vedi offerta commerciale)* | — |
| Anno 2 | ~9.000 € | ~*(vedi offerta commerciale)* | — |
| Anno 3 | ~9.000 € | ~*(vedi offerta commerciale)* | — |
| **Totale 3 anni** | **~27.000 €** | | |

> 📝 *ROI vs costo medio meeting annuo aziendale (> 1,2M€): payback stimato < 5 mesi.*

---

# 5. 📈 Scenari di scaling

| Scenario | Utenti | Variazione infrastruttura | Δ Costo/mese |
|---|---|---|---|
| **Small** | 100–200 | App Service B2, PostgreSQL Flexible Burstable B2ms | ~280 € |
| **Medium** (base) | 500 | App Service S2, PostgreSQL Flexible GP_D4s + pgvector + APIM + Front Door | ~750 € |
| **Large** | 1.000–2.000 | App Service P2v3, PostgreSQL Flexible GP_D8s + Read Replica | ~1.400 € |
| **Enterprise** | > 5.000 | AKS + PostgreSQL Flexible Business Critical + replica | ~3.500 €+ |

---

# 6. 📝 Note e assunzioni

- Prezzi basati su **listino Azure pubblico West Europe** (giugno 2026)
- Non include IVA
- Non include costi di licenza Microsoft 365 (già presenti nel cliente target)
- Azure OpenAI: disponibile solo in regioni specifiche — verificare disponibilità nel tenant cliente
- PostgreSQL Flexible Server: costo dominante nella fascia Medium/Large — valutare tier Burstable per PoC/small
- Per deployment multi-tenant SaaS (v2.0): aggiungere replica PostgreSQL e rivedere architettura DB

> ⚠️ **Da aggiornare prima dell'offerta:** inserire prezzi da Azure Pricing Calculator con configurazione esatta e sconto accordi cliente.
