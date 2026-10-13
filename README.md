# CoalOps – Coal Mining Production Monitor

A comprehensive, bilingual (EN/ID) web application for monitoring coal mining production progress using a **Backward Tracing** approach (from downstream/hilir to upstream/hulu), starting from **Load to Barge** and tracing back to **Land Clearing** and **Drilling & Blasting** — extended with equipment, maintenance, manpower, engineering reconciliation, environment, coal quality, sales/contract & royalty, cost/budget, pit-to-port coal accounting, risk management, and an AI-generated executive summary.

## Highlights

- **CORE RULE honored**: every dashboard and report begins with the SAFETY RECAP & SAFETY ISSUES section before any other data.
- **Bilingual (EN | ID)**: header toggle, persisted in `localStorage`. i18n dictionaries in `src/i18n/en.json` and `src/i18n/id.json`.
- **Backward tracing dashboard**: process chain Load-to-Barge → Coal Hauling → Coal Getting → OB Removal → Drilling & Blasting → Land Clearing; click any node to drill down.
- **Standard period selector**: Daily / Yesterday / MTD / YTD / LTD, respected by every KPI, chart, and table.
- **Standard Recap Table** (per spec): rows = stage, columns = Today, Yesterday, Δ vs Yesterday %, MTD Plan/Actual/Achievement, YTD Plan/Actual/Achievement, LTD Actual, status chip.
- **Trace-Back Report** with 4 branches: Process, Equipment, Manpower, Quality. Each branch highlights the most probable bottleneck.
- **All 19 modules** wired up with the right owners, cross-module links, and bilingual data.
- **Mid-life onboarding scenario** as the demo seed (cutoff date, opening balances, 4 weeks of daily data).
- **AI Executive Summary** pre-generated and approved (EN) with bilingual labels, fallback to deterministic template engine, plumbed for pluggable LLM provider (Anthropic Claude / OpenAI / self-hosted).
- **Risk Register** with 5×5 heatmap (inherent ↔ residual), 18 seeded risks (including auto-suggested), KRI dashboard.
- **Pit-to-Port Coal Accounting** with mass balance, value waterfall, and flow diagram.
- **Audit Log** with user, timestamp, before/after.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom coal/brand palette)
- Recharts for charts (line, bar, composed, pie)
- lucide-react for icons
- In-memory + static seed data (no DB needed for the demo; data shape designed to be portable to PostgreSQL/SQLite)

## Quick start

```bash
cd coal-mine-monitor
npm install
npm run dev
# → http://localhost:3000
```

Production build & serve:

```bash
npm run build
npm start -p 3000
```

## Docker

A production-ready multi-stage `Dockerfile` is included, using Next.js'
`output: "standalone"` mode for a small final image (alpine, ~150 MB).

```bash
# One-shot
docker build -t coalops:1.0 .
docker run -d --name coalops -p 3000:3000 coalops:1.0

# Or with docker compose
cp .env.example .env   # then edit if you want a real LLM provider
docker compose up -d
```

Files added for Docker:
- `Dockerfile` — multi-stage, `node:20-alpine`, non-root `nextjs` user, healthcheck
- `docker-compose.yml` — single-service compose file with env wiring
- `.dockerignore` — keeps the build context small
- `.env.example` — sample env vars (LLM provider, locale)
- `scripts/docker-build.sh` — convenience wrapper
- `next.config.js` — `output: "standalone"` and a `serverRuntimeConfig.llmProvider` switch

The container exposes port 3000 and ships with a `HEALTHCHECK` against `/`.

## LLM provider (Module 19)

Set one of these in your environment / `.env` to switch Module 19 from the
deterministic fallback template to a real LLM:

```bash
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
# or
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Leave `LLM_PROVIDER=fallback` (the default) to use the built-in rule-based
template that produced the seed executive summary.

## Project layout

```
src/
  app/
    page.tsx                  # Backward-tracing dashboard
    module/0..19/             # One page per module
    admin/                    # Initialization wizard, users, audit log
    reports/                  # Daily/Monthly/Exec reports
  components/
    AppShell.tsx              # Sidebar + header + language toggle
    SafetyRecap.tsx           # Always-first safety section
    ProcessChain.tsx          # Backward chain visualization
    StandardRecapTable.tsx    # Global standard recap table
    SupportKPIStrip.tsx       # Compact KPI chips
    TopRisksPanel.tsx
    ExecSummaryPreview.tsx
    TraceBack.tsx             # 4-branch trace-back
    PeriodSelectorInline.tsx
    ModulePage.tsx
    ProductionModuleView.tsx
  lib/
    types.ts
    seed.ts                   # Mid-life onboarded mine demo data
    aggregations.ts           # Stage aggregation, formatting
    i18n.tsx                  # Bilingual provider
    period.tsx                # Global period selector context
  i18n/
    en.json
    id.json
```

## How to extend

- **New module**: drop a folder under `src/app/module/NN`, reuse `ModulePage` and `ProductionModuleView` (or build a new view). Add an entry to `nav.groups` in `AppShell.tsx` and a string in `en.json`/`id.json` under `modules`.
- **New KPI / chart**: use existing `fmtNum`, `fmtPct`, `fmtIDR`, `fmtUSD` from `aggregations.ts`.
- **Real DB**: replace the imports from `seed.ts` with Prisma queries; the types in `lib/types.ts` map 1:1 to the data model.
- **LLM provider**: add an `llm` adapter module reading `process.env.ANTHROPIC_API_KEY` (or OpenAI) and wire it to the "Generate Summary" button in `Module 19`.

## Bilingual coverage

- App, navigation, module names, common UI strings, period labels, safety/production/kpi/dashboard/execSummary/risk/init/footer sections.
- Period selector: Daily / Yesterday / MTD / YTD / LTD ↔ Harian / Kemarin / Bulan Ini / Tahun Ini / Akumulasi Sejak Awal.
- Standard example translations:
  - "Days Without LTI" ↔ "Hari Tanpa LTI"
  - "Life-to-Date (LTD)" ↔ "Akumulasi Sejak Awal (LTD)"
  - "Shipment Realization" ↔ "Realisasi Pengapalan"
  - "Royalty" ↔ "Royalti"
  - "Coal Account" ↔ "Neraca Batubara"
  - "Budget vs Actual" ↔ "Anggaran vs Realisasi"
  - "Burn Rate" ↔ "Laju Serapan Anggaran"
  - "Opening Balance" ↔ "Saldo Awal"

## Demo data — what's included

- Mid-life onboarded mine: mine start `2020-10-12`, cutoff `2026-09-14`, 28 days of daily production (M1–M7).
- Deliberate underperformers: 2 weak days in Hauling, 3 in OB Removal, 1 in Drilling, 1 in Load to Barge.
- 20 equipment units (Excavator, DumpTruck, DrillRig, Dozer, Loader, Barge, Grader, Crane) with live status.
- 2 bad-actor units (EX-102 hydraulic, DT-204 engine).
- 8 Work Orders (2 Critical, 2 High, mix of Breakdown / PM / Modification / Predictive).
- 15 employees with one expired SIMPER and three certifications within 30 days.
- Environment: 1 TSS exceedance at OP-01, settling pond SP-02 at 71%, permits nearing expiry.
- Coal quality: 7 lab samples, 1 off-spec barge (BG-002), 1 blending deviation.
- Sales: 4 contracts (2 export + 1 DMO + 1 spot), DMO at 92%, royalty computed for last month.
- Cost: 11 departments; maintenance 108% of YTD budget; unit rate contracts.
- Coal account: Sept closed with +0.6% variance; Oct in Draft.
- Risk register: 18 risks (3 auto-suggested), 5×5 residual matrix populated.
- 1 pre-approved executive summary (English), bilingual labels, data-coverage indicator.

## License

Demo / educational use. Replace the seed and integrate real data sources for production.
