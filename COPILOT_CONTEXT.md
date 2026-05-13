# Copilot Context — Roster Maker

> **Purpose:** Catch up Copilot quickly on project history, decisions, and current state.
> **Last updated:** 2026-05-13

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
| Game state (turn, CP, scores, life pips) | localStorage | Ephemeral, per-session only |

### Key Design Decisions
- **No bundled unit data.** The app ships zero game content. Users enter their own units manually. This avoids copyright issues and makes the app game-agnostic.
- **Guest mode works fully.** Users can create rosters, add units, and play games without ever signing up. Data persists in localStorage between visits.
- **Signed-in users get cloud sync.** Rosters saved to Supabase, accessible from any device.
- **Future paywall hook:** Limit free users to N rosters, paid users get unlimited. The `rosterService.ts` is structured to make this easy.

---

## What Was Built (Session 1 — 2026-05-12)

### Starting State
- Repo had config files (package.json, tsconfig, pnpm-workspace.yaml, .env.example) and docs (README, SETUP, DEPLOYMENT, DEVELOPMENT)
- `App.tsx` existed but imported pages that didn't exist
- Nothing compiled or ran

### What Was Scaffolded

#### Shared Types (`packages/shared/src/types.ts`)
- `Unit` interface: `movement`, `toughness`, `save`, `wounds`, `leadership`, `objectiveControl`, `currentWounds`, `abilities`, `weapons`
- `Weapon` interface: `name`, `range`, `attacks`, `skill`, `strength`, `ap`, `damage`, `type` (melee/ranged)
- `Roster` interface: added `detachment`, `maxPoints`
- `GameState`, `GameStats`, `ApiResponse`, `PaginatedResponse` interfaces

#### Web App (`apps/web/`)
- **Tailwind config** — dark military theme: `surface-900/800/700/600`, `olive-400/500/600`, `amber-400/500`
- **Pages:** Home, RosterBuilder, GameOptions (placeholder)
- **Components:** Header, Footer, Counter, UnitCard, LifeCounter, StatsDropdown, UnitDetailModal, AddUnitForm
- **Mock Data** — 4 sample units, 2 sample rosters (used as fallback, no longer primary data source)

#### Mobile App (`apps/mobile/`)
- Full Vite + React + Tailwind setup
- `GameTracker.tsx` — Turn counter, CP counter, Player 1/2 score counters
- Runs on port 5174

#### API (`apps/api/`)
- Full CRUD routes (in-memory storage)
- Standalone `tsconfig.json` (needed for Railway)

#### Database (`packages/database/`)
- PostgreSQL schemas for: `users`, `rosters`, `units`, `game_stats`

#### Deployment
- Vercel deployed for web app (with `vercel.json` workaround for pnpm issues)
- Railway deployed for API

---

## What Was Built (Session 2 — 2026-05-13)

### Authentication
- **Supabase Auth integration** — email/password signup with email verification
- **`apps/web/src/lib/supabase.ts`** — Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- **`apps/web/src/lib/AuthContext.tsx`** — React context provider with `useAuth()` hook exposing `user`, `session`, `loading`, `signUp`, `signIn`, `signOut`
- **`apps/web/src/pages/Auth.tsx`** — Login/signup page with toggle, error handling, email confirmation sent screen, "Continue without account" guest link
- **Home page** updated with auth-aware header: shows email + sign out when logged in, sign in button when guest, "Guest mode — data saved locally" hint

### Roster Persistence (Hybrid Storage)
- **`apps/web/src/lib/rosterService.ts`** — Unified service that routes to Supabase (logged in) or localStorage (guest):
  - `getRosters()`, `createRoster()`, `deleteRoster()`, `updateRoster()`
  - `addUnit()` — returns the saved unit with DB-generated UUID
  - `removeUnit()` — deletes by UUID
  - Guest IDs use `crypto.randomUUID()` (not the old `generateId()`)
  - Supabase inserts omit `id` field — lets DB generate UUIDs via `gen_random_uuid()`
- **`apps/web/src/lib/storage.ts`** — localStorage service for game state, unit library, roster cache
- **`apps/web/src/components/CreateRosterModal.tsx`** — Modal form: name, faction, detachment, max points
- **Home page** — loads real rosters, create/delete roster functionality, delete button (🗑) per roster with confirmation
- **RosterBuilder** — loads real roster by ID from URL params, add/remove units with proper UUID handling
- **UnitCard** — added remove (✕) button

### Database Migrations
- **`docs/migrations/002_add_unit_fields.sql`** — Added columns to `units` table: `movement`, `toughness`, `save`, `wounds`, `leadership`, `objective_control`, `abilities` (JSONB), `weapons` (JSONB). Added `detachment` and `max_points` to `rosters`.
- **`docs/migrations/003_fix_user_fk.sql`** — Created trigger `on_auth_user_created` on `auth.users` that auto-creates a `public.users` row on signup. Backfill query for existing auth users.

### Supabase Configuration
- **RLS policies** applied: users can only access their own rosters, units, and game stats
- **Auth trigger** — `handle_new_user()` function syncs `auth.users` → `public.users` on signup
- **Env vars set in Vercel:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Documentation
- **`docs/SUPABASE_AUTH_TEMPLATES.md`** — Guide to customizing Supabase auth email templates with branded examples (signup confirmation, password reset, magic link)

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
- **Status: ⚠️ Deployed, not fully verified** — check `/api/health`

### Mobile App → Not deployed yet
- Would need a second Vercel project with root dir `apps/mobile`

---

## Supabase

- **Project URL:** `https://nxzyaseddqefjfmxxsix.supabase.co`
- **Tables:** `users`, `rosters`, `units`, `game_stats`
- **RLS:** Enabled on `rosters`, `units`, `game_stats` — users can only access their own data
- **Auth:** Email provider enabled, email verification on
- **Trigger:** `on_auth_user_created` — auto-creates `public.users` row when someone signs up
- **Web app connects directly** to Supabase (no API intermediary for roster CRUD)

---

## Known Issues / Cleanup Needed

1. **Stray files in repo root** that should be deleted:
   - `mockData.ts`, `packages_shared_src_index.ts`, `packages_shared_src_types.ts`, `packages_shared_src_utils.ts`

2. **Mock data still imported** — `apps/web/src/data/mockData.ts` is no longer used as primary data source but still exists. Could be removed or kept as reference.

3. **No `pnpm-lock.yaml`** committed — Vercel uses npm as workaround.

4. **Mobile app not deployed.**

5. **Railway API not verified** — may or may not be working.

6. **API (`apps/api`) is disconnected** — web app talks directly to Supabase. The Express API with in-memory storage is currently unused. Could be repurposed for server-side logic later or removed.

---

## Design Decisions

- **Game-agnostic** — no hardcoded game data, stat labels are generic, works for any tabletop game
- **No bundled unit data** — users enter their own data, avoids copyright issues entirely
- **Guest-first** — app is fully functional without an account, data saved in localStorage
- **Hybrid storage** — `rosterService.ts` abstracts Supabase vs localStorage, components don't care which backend
- **Contacts-page layout** — sticky header (roster info), scrollable unit cards, sticky footer (game controls)
- **Dark military theme** — `surface-900` (#0f1114) background, olive green accents, amber for points
- **UUIDs everywhere** — `crypto.randomUUID()` for guest, `gen_random_uuid()` for Supabase
- **Direct Supabase access** from frontend — no API intermediary needed for roster CRUD (RLS protects data)

---

## What to Build Next (Priority Order)

1. **Deploy mobile app** to Vercel as second project
2. **Game Options page** — mission selection, scoring, battle log
3. **Unit Library** — save user-created units to localStorage for reuse across rosters
4. **Export roster** (JSON, PDF, shareable link)
5. **Roster limits / paywall** — free users get N rosters, paid get unlimited
6. **Clean up** — remove stray root files, unused mock data, decide on API's future
7. **Guest → account migration** — prompt guests to sign up, migrate localStorage rosters to Supabase

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

- User does **NOT** have terminal/CLI access — all file changes are done via GitHub web UI
- Copilot coding agent is **NOT** enabled on this repo — provide files as code blocks for manual upload
- Vercel **auto-deploys** on push to `main` — user merges PRs on GitHub to trigger deploys
- Import paths from `apps/web/src/pages/` or `apps/web/src/components/` to shared types: `'../../../../packages/shared/src/types'`
- `vercel.json` uses **npm** (not pnpm) due to Vercel compatibility issues
- Supabase env vars are set in **Vercel dashboard** (not committed) — `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Database changes require running SQL in **Supabase Dashboard → SQL Editor** — save migration files in `docs/migrations/`
- `rosterService.ts` is the single source of truth for roster CRUD — always modify this file for data changes, not individual pages
- `addUnit()` returns the saved unit with DB-generated UUID — always use the returned unit in React state
