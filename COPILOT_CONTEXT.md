# Copilot Context — Roster Maker

> **Purpose:** Catch up Copilot quickly on project history, decisions, and current state.
> **Last updated:** 2026-05-12

---

## Project Overview

**Roster Maker** is a Warhammer 40K roster builder and game-day companion. It's a pnpm monorepo with three apps and two shared packages.

**Repo:** `rtricher/roster-maker` (public)
**Owner:** rtricher

---

## Architecture

```
roster-maker/
├── apps/
│   ├── web/          # Desktop roster builder (React + Vite + Tailwind)
│   ├── mobile/       # Mobile game tracker (React + Vite + Tailwind)
│   └── api/          # Backend API (Node.js + Express)
├── packages/
│   ├── shared/       # Shared TypeScript types & utilities
│   └── database/     # Database schemas (Supabase/PostgreSQL)
├── vercel.json       # Vercel deploy config (web app)
├── railway.toml      # Railway deploy config (API)
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express, in-memory storage (Supabase-ready)
- **Database:** Supabase (PostgreSQL) — tables created, not yet wired to API
- **Hosting:** Vercel (web frontend), Railway (API)

---

## What Was Built (Session 1 — 2026-05-12)

### Starting State
- Repo had config files (package.json, tsconfig, pnpm-workspace.yaml, .env.example) and docs (README, SETUP, DEPLOYMENT, DEVELOPMENT)
- `App.tsx` existed but imported `Home` and `RosterBuilder` pages that didn't exist
- `index.css` referenced Tailwind but no Tailwind config existed
- API had placeholder endpoints returning hardcoded data
- Mobile app had zero source files
- **Nothing compiled or ran**

### What Was Scaffolded

#### Shared Types (`packages/shared/src/types.ts`)
Extended the `Unit` interface with game-relevant fields:
- `movement`, `toughness`, `save`, `wounds`, `leadership`, `objectiveControl`
- `currentWounds` (in-game tracking)
- `abilities: string[]`, `weapons: Weapon[]`
- Added `Weapon` interface with `name`, `range`, `attacks`, `skill`, `strength`, `ap`, `damage`, `type` (melee/ranged)
- Added `GameState` interface: `currentTurn`, `commandPoints`, `playerOneScore`, `playerTwoScore`, `unitStates`
- Added `Roster.detachment`, `Roster.maxPoints`

#### Web App (`apps/web/`)
- **Tailwind config** (`tailwind.config.js`, `postcss.config.js`) — dark military theme with custom colors: `surface-900/800/700/600`, `olive-400/500/600`, `amber-400/500`
- **Pages:**
  - `Home.tsx` — Roster list with cards, "New Roster" button, click to open builder
  - `RosterBuilder.tsx` — Contacts-style layout with sticky header, scrollable unit cards, sticky footer
  - `GameOptions.tsx` — Placeholder page for mission/scoring/battle log
- **Components:**
  - `Header.tsx` — Sticky top bar: roster name, faction, detachment, points/max
  - `Footer.tsx` — Sticky bottom bar: Game Options button, Turn counter, CP counter
  - `Counter.tsx` — Reusable ◀/▶ increment/decrement component
  - `UnitCard.tsx` — Unit entry with name, points, model count, life pips, stats toggle, More button
  - `LifeCounter.tsx` — Clickable green pips (filled = alive, empty = dead)
  - `StatsDropdown.tsx` — Expandable accordion showing M/T/SV/W/LD/OC stats, abilities, weapons table
  - `UnitDetailModal.tsx` — Full unit detail overlay with all stats, ranged/melee weapon tables, notes
  - `AddUnitForm.tsx` — Modal form to add a unit (name, points, models, move, toughness, save, notes)
- **Mock Data** (`src/data/mockData.ts`) — 4 sample units: Intercessor Squad, Redemptor Dreadnought, Captain in Terminator Armour, Eliminators. Two sample rosters.

#### Mobile App (`apps/mobile/`)
- Full Vite + React + Tailwind setup (index.html, vite.config.ts, tailwind/postcss configs, main.tsx, App.tsx, index.css)
- `GameTracker.tsx` — Mobile-first page with Turn counter, CP counter, Player 1/2 score counters
- Runs on port 5174

#### API (`apps/api/`)
- Full CRUD routes (in-memory storage, no database yet):
  - `GET/POST /api/rosters`, `GET/PUT/DELETE /api/rosters/:id`
  - `POST /api/rosters/:id/units`, `PUT/DELETE /api/units/:id`
  - `POST /api/games`, `GET /api/games/:rosterId`
  - `GET /api/health`
- `src/supabase.ts` — Commented-out Supabase client setup, ready to uncomment
- Standalone `tsconfig.json` (doesn't extend root — needed for Railway)

#### Database (`packages/database/`)
- `src/index.ts` — Exports schema definitions
- `src/schema.ts` — PostgreSQL CREATE TABLE statements for: `users`, `rosters`, `units`, `game_stats`

---

## Deployment

### Web App → Vercel
- **Framework:** Vite (auto-detected)
- **Root Directory:** Leave blank (repo root) — `vercel.json` handles pathing
- **vercel.json** uses `npm install --legacy-peer-deps` (pnpm had `ERR_INVALID_THIS` issues on Vercel)
- Build command: `cd apps/web && npx vite build`
- Output: `apps/web/dist`
- **Status: ✅ DEPLOYED AND WORKING**

### API → Railway
- **railway.toml** in repo root
- Build: `cd apps/api && npm install && npx tsc`
- Start: `cd apps/api && node dist/server.js`
- **Status: ⚠️ Deployed, not fully verified** — check `/api/health`

### Mobile App → Not deployed yet
- Would need a second Vercel project with root dir `apps/mobile`

---

## Supabase

- **Project URL:** `https://nxzyaseddqefjfmxxsix.supabase.co`
- **Tables created:** `users`, `rosters`, `units`, `game_stats` (see `packages/database/src/schema.ts`)
- **Not yet wired** to the API — API currently uses in-memory arrays
- Credentials are in `.env.example` (anon key is committed — this is public/safe for RLS-protected Supabase)

---

## Known Issues / Cleanup Needed

1. **Stray files in repo root** that should be deleted (accidentally created outside their directories):
   - `mockData.ts` (should only exist at `apps/web/src/data/mockData.ts`)
   - `packages_shared_src_index.ts` (should only exist at `packages/shared/src/index.ts`)
   - `packages_shared_src_types.ts` (should only exist at `packages/shared/src/types.ts`)
   - `packages_shared_src_utils.ts` (should only exist at `packages/shared/src/utils.ts`)

2. **Web app uses all local state** — no API calls wired yet. Roster data is mock/hardcoded.

3. **No `pnpm-lock.yaml`** committed — Vercel uses npm as workaround, which is fine.

4. **ESLint config** — Root `package.json` uses `@typescript-eslint@^8` with `eslint@^9` (was fixed from ^7 which conflicted).

5. **Mobile app not deployed** to any hosting.

6. **"New Roster" button on Home page** doesn't do anything yet — no create roster flow.

---

## Design Decisions

- **Contacts-page layout** for roster builder: sticky header (roster info), scrollable unit cards, sticky footer (game controls)
- **Life counter pips**: Green filled circles = alive, empty = dead. Click to toggle.
- **Footer has**: Game Options button (→ `/game` page), Turn counter (1-5), CP counter (0-20)
- **Stats dropdown**: Accordion-style, shows M/T/SV/W/LD/OC grid + abilities tags + weapons table
- **"More" button**: Opens full modal with separated ranged/melee weapon tables
- **Dark military theme**: `surface-900` (#0f1114) background, olive green accents, amber for points
- **No auth yet** — future phase

---

## What to Build Next (Priority Order)

1. **Verify Railway API** is working (`/api/health`)
2. **Deploy mobile app** to Vercel as second project
3. **Wire web app to API** — fetch rosters, save changes
4. **Create Roster flow** — "New Roster" button → form → saves to API
5. **Delete unit** functionality on unit cards
6. **Connect Supabase** — replace in-memory storage with real database
7. **User authentication** (Supabase Auth)
8. **Game Options page** — mission selection, scoring, battle log
9. **Export roster** (JSON, PDF)
10. **Clean up stray root files** listed in Known Issues

---

## Commands

```bash
# Local development (needs terminal)
pnpm install
pnpm dev          # Starts all 3 apps

# Individual apps
cd apps/web && pnpm dev      # http://localhost:5173
cd apps/mobile && pnpm dev   # http://localhost:5174
cd apps/api && pnpm dev      # http://localhost:3000
```

---

## Important Notes for Copilot

- User does NOT have terminal/CLI access — all file changes are done via GitHub web UI
- Copilot coding agent is NOT enabled on this repo — provide files as code blocks for manual upload
- Vercel auto-deploys on push to `main`
- When providing files, use `../../../../packages/shared/src/types` for imports from `apps/web/src/pages/` or `apps/web/src/components/` to reach shared types
- The `vercel.json` install command uses npm (not pnpm) due to Vercel pnpm compatibility issues
