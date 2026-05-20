# Copilot Context — Roster Maker

> **Purpose:** Catch up Copilot quickly on project history, decisions, and current state.
> **Last updated:** 2026-05-20

---

> ⚠️ **START-OF-SESSION REMINDER:** Before doing anything, review the current state of the repo — check what branches exist, what's on `main`, and what's in progress. The user may have uploaded files or merged branches between sessions.

---

## Project Overview

**Roster Maker** is a **game-agnostic** tabletop wargame roster builder and game-day companion. While initially inspired by Warhammer 40K, it is designed to work with **any tabletop game** — users enter their own unit data from their own sources.

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
├── docs/
│   ├── migrations/   # SQL migration scripts
│   └── SUPABASE_AUTH_TEMPLATES.md
├── vercel.json       # Vercel deploy config (web app)
├── railway.toml      # Railway deploy config (API)
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express (Railway) — in-memory storage, not yet wired to Supabase
- **Database:** Supabase (PostgreSQL) — web app connects directly via `@supabase/supabase-js`
- **Auth:** Supabase Auth (email/password with email verification)
- **Hosting:** Vercel (web frontend), Railway (API)

---

## Data Architecture (Hybrid Offline/Online)

| Data | Where | Why |
|------|-------|-----|
| User accounts & auth | Supabase | Needs a server |
| Roster metadata (name, faction, points) | Supabase (logged in) / localStorage (guest) | Small, needs sync for logged-in users |
| Unit data in rosters (stats, weapons, abilities) | Supabase (logged in) / localStorage (guest) | User-entered, personal data |
| Game state (turn, CP, scores, wound tracking) | localStorage / React state | Ephemeral, per-session only |

### Key Design Decisions
- **No bundled unit data.** The app ships zero game content. Users enter their own units manually. This avoids copyright issues and makes the app game-agnostic.
- **Guest mode works fully.** Users can create rosters, add units, and play games without ever signing up. Data persists in localStorage between visits.
- **Signed-in users get cloud sync.** Rosters saved to Supabase, accessible from any device.
- **Max points is a soft cap** — displayed as warning (red text) when over budget, never enforced/blocked.
- **Future paywall hook:** Limit free users to N rosters, paid users get unlimited.

---

## What Was Built (Session 1 — 2026-05-12)

### Starting State
- Repo had config files but nothing compiled or ran

### What Was Scaffolded
- Shared types (`Unit`, `Weapon`, `Roster`, `GameState`)
- Web app: pages (Home, RosterBuilder, GameOptions), components (Header, Footer, Counter, UnitCard, LifeCounter, StatsDropdown, UnitDetailModal, AddUnitForm), Tailwind dark theme, mock data
- Mobile app: Vite + React + Tailwind, GameTracker page
- API: Express CRUD routes (in-memory)
- Database schemas, Vercel + Railway deployment

---

## What Was Built (Session 2 — 2026-05-13)

### Authentication & Roster Persistence
- Supabase Auth (email/password + verification)
- `AuthContext.tsx` with `useAuth()` hook
- `Auth.tsx` page (login/signup/guest mode)
- `rosterService.ts` — unified Supabase/localStorage service: `getRosters`, `createRoster`, `deleteRoster`, `updateRoster`, `addUnit`, `removeUnit`
- `CreateRosterModal.tsx`
- Home page: real data loading, create/delete, auth-aware header
- Database migrations: unit stat columns, auth trigger for `public.users`
- RLS policies, `docs/SUPABASE_AUTH_TEMPLATES.md`

---

## What Was Built (Session 3 — 2026-05-20)

### Edit Roster & Edit Unit — ✅ DEPLOYED
- **`EditRosterModal.tsx`** — edit name, faction, detachment, max points
- **`EditUnitModal.tsx`** — edit all unit fields (name, points, models, wounds/model, M/T/SV/W/LD/OC, notes)
- **`rosterService.ts`** — added `updateUnit()` function
- **`Header.tsx`** — added ✎ edit button next to roster name, "Over budget" warning text
- **`UnitDetailModal.tsx`** — added ✎ Edit button in header, shows wounds per model
- **`RosterBuilder.tsx`** — wired up edit roster + edit unit flows

### UI Consistency — ✅ DEPLOYED
- **"More" button → `⋮`** (vertical ellipsis) on UnitCard
- **Delete button → `🗑`** everywhere (UnitCard + Home page roster cards)

### Wound Tracking Overhaul — ✅ DEPLOYED
- **`WoundTracker.tsx`** — smart component that adapts based on unit profile:
  - **Multi-model, 1W each** (e.g., 10 Intercessors): Model pips (green = alive, empty = dead)
  - **Single model, many wounds** (e.g., 1 Dreadnought 12W): Wound pips (click to damage)
  - **Multi-model, many wounds** (e.g., 3 Aggressors 3W each): Per-model wound rows
- **`UnitCard.tsx`** uses `WoundTracker` instead of old `LifeCounter`
- **`RosterBuilder.tsx`** — wound state is `Record<string, number[]>` (per-model wound arrays)
- **`AddUnitForm.tsx`** synced with EditUnitModal — includes wounds/model, leadership, OC fields

### Unit Library & Image Upload — 🚧 IN PROGRESS (on branch, not merged)
- **`UnitLibrary.tsx`** — uploaded to branch
- **`storageService.ts`** — uploaded to branch
- **`UnitDetailModal.tsx`** — needs update for image upload support (was being worked on when session ended)
- Still needed: wiring image upload into UnitDetailModal, thumbnail on UnitCard

---

## Deployment

### Web App → Vercel
- **Root Directory:** Blank (repo root) — `vercel.json` handles pathing
- **vercel.json:** `npm install --legacy-peer-deps` (pnpm has `ERR_INVALID_THIS` on Vercel)
- **Build:** `cd apps/web && npx vite build`
- **Output:** `apps/web/dist`
- **Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` set in Vercel dashboard
- **Auto-deploys** on push to `main`
- **Status: ✅ DEPLOYED AND WORKING**

### API → Railway
- **railway.toml** in repo root
- Build: `cd apps/api && npm install && npx tsc`
- Start: `cd apps/api && node dist/server.js`
- **Status: ⚠️ Deployed, not fully verified**

### Mobile App → Not deployed yet

---

## Supabase

- **Project URL:** `https://nxzyaseddqefjfmxxsix.supabase.co`
- **Tables:** `users`, `rosters`, `units`, `game_stats`
- **Unit columns:** `id`, `roster_id`, `name`, `points`, `count`, `notes`, `movement`, `toughness`, `save`, `wounds`, `leadership`, `objective_control`, `abilities` (JSONB), `weapons` (JSONB)
- **RLS:** Enabled on `rosters`, `units`, `game_stats`
- **Auth:** Email provider, email verification on
- **Trigger:** `on_auth_user_created` → auto-creates `public.users` row
- **Web app connects directly** to Supabase (RLS protects data)

---

## Current Component Architecture

```
RosterBuilder.tsx
├── Header.tsx (sticky top — roster name ✎, faction, points/max)
├── UnitCard.tsx (per unit)
│   ├── WoundTracker.tsx (adapts to model/wound profile)
│   ├── StatsDropdown.tsx (expandable M/T/SV/W/LD/OC + weapons table)
│   └── UnitDetailModal.tsx (full detail overlay with ✎ Edit button)
├── Footer.tsx (sticky bottom — Game Options, Turn counter, CP counter)
├── AddUnitForm.tsx (modal — all fields including wounds/model)
├── EditRosterModal.tsx (modal — name, faction, detachment, max points)
└── EditUnitModal.tsx (modal — all unit fields)
```

---

## Known Issues / Cleanup Needed

1. **Stray files in repo root** — `mockData.ts`, `packages_shared_src_*.ts` should be deleted
2. **`apps/web/src/data/mockData.ts`** — no longer used, can be removed
3. **`LifeCounter.tsx`** — deprecated, replaced by `WoundTracker.tsx`, should be deleted
4. **No `pnpm-lock.yaml`** committed — Vercel uses npm workaround
5. **Mobile app not deployed**
6. **Railway API unused** — web app talks directly to Supabase

---

## Design Decisions

- **Game-agnostic** — no hardcoded game data, works for any tabletop game
- **No bundled unit data** — users enter their own, avoids copyright
- **Guest-first** — fully functional without account, localStorage persistence
- **Hybrid storage** — `rosterService.ts` abstracts Supabase vs localStorage
- **Dark military theme** — `surface-900` (#0f1114), olive green, amber for points
- **UUIDs everywhere** — `crypto.randomUUID()` guest, `gen_random_uuid()` Supabase
- **Direct Supabase access** from frontend (RLS protects data)
- **Smart wound tracking** — adapts UI based on models × wounds profile
- **Max points = soft cap** — shows red warning, never blocks
- **Icon consistency** — `⋮` for more/details, `🗑` for delete, `✎` for edit

---

## What to Build Next (Priority Order)

1. **Finish Unit Library + Image Upload** — complete the in-progress branch (UnitDetailModal image support, thumbnail on UnitCard)
2. **Deploy mobile app** to Vercel as second project
3. **Game Options page** — mission selection, scoring, battle log
4. **Export roster** (JSON, PDF, shareable link)
5. **Roster limits / paywall** — free users get N rosters, paid get unlimited
6. **Guest → account migration** — migrate localStorage rosters to Supabase on signup
7. **Clean up** — remove stray root files, deprecated components, unused mock data

---

## Commands

```bash
# Local development
pnpm install
pnpm dev          # Starts all 3 apps

# Individual apps
cd apps/web && pnpm dev      # http://localhost:5173
cd apps/mobile && pnpm dev   # http://localhost:5174
cd apps/api && pnpm dev      # http://localhost:3000

# Git workflow
git checkout -b feat/branch-name
git add .
git commit -m "feat: description"
git push -u origin feat/branch-name
# Then create PR on GitHub and merge
```

---

## Important Notes for Copilot

- **⚠️ AT SESSION START:** Always check open branches and current `main` state before providing files — things may have changed between sessions.
- User is **learning CLI** but still primarily uses GitHub web UI for file uploads
- Copilot coding agent is **NOT** enabled — provide complete files as code blocks for manual upload
- Vercel **auto-deploys** on push to `main`
- Import paths from `apps/web/src/pages/` or `apps/web/src/components/`: `'../../../../packages/shared/src/types'`
- `vercel.json` uses **npm** (not pnpm) due to Vercel compatibility issues
- Supabase env vars in **Vercel dashboard** — `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- DB changes: run SQL in **Supabase Dashboard → SQL Editor**, save scripts in `docs/migrations/`
- `rosterService.ts` is single source of truth for all data CRUD
- `addUnit()` returns saved unit with DB UUID — always use returned unit in React state
- Wound tracking state is `Record<string, number[]>` — array of wounds per model, keyed by unit ID
- When providing updated files, always provide the **complete file** not just diffs
