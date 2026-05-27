# Copilot Context — Roster Maker

> **Purpose:** Catch up Copilot quickly on project history, decisions, and current state.
> **Last updated:** 2026-05-27

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
│   └── api/          # Backend API (Node.js + Express) — UNUSED, Railway expiring
├── packages/
│   ├── shared/       # Shared TypeScript types & utilities
│   └── database/     # Database schemas (Supabase/PostgreSQL)
├── docs/
│   ├── migrations/   # SQL migration scripts
│   └── SUPABASE_AUTH_TEMPLATES.md
├── vercel.json       # Vercel deploy config (web app)
├── railway.toml      # Railway deploy config (API) — EXPIRING/UNUSED
├── pnpm-workspace.yaml
└── package.json
```

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Database:** Supabase (PostgreSQL) — web app connects directly via `@supabase/supabase-js`
- **Auth:** Supabase Auth (email/password with email verification)
- **Storage:** Supabase Storage (`unit-images` bucket, 200kb limit)
- **Hosting:** Vercel (web frontend)

---

## Data Architecture (Hybrid Offline/Online)

| Data | Where | Why |
|------|-------|-----|
| User accounts & auth | Supabase Auth | Needs a server |
| Roster metadata (name, faction, points) | Supabase (logged in) / localStorage (guest) | Cloud sync for logged-in users |
| Unit data in rosters (stats, weapons, abilities) | Supabase (logged in) / localStorage (guest) | User-entered, personal data |
| Unit Library (reusable unit templates) | localStorage (all users) | Quick access, no DB needed yet |
| Unit images | Supabase Storage (logged in only) | Needs server-side hosting |
| Game state (turn, CP, scores, wound tracking) | React state | Ephemeral, per-session only |

### Key Design Decisions
- **No bundled unit data.** The app ships zero game content. Users enter their own units manually.
- **Guest mode works fully.** Users can create rosters, add units, and play games without signing up.
- **Signed-in users get cloud sync.** Rosters saved to Supabase, accessible from any device.
- **Guest → signed-in import.** When a user signs in with existing guest data, a modal prompts to import rosters/units.
- **Max points is a soft cap** — displayed as warning (red text) when over budget, never enforced.
- **Unit Library is localStorage-only** (for now) — shared between guest and signed-in states.
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
- `rosterService.ts` — unified Supabase/localStorage service
- `CreateRosterModal.tsx`
- Home page: real data loading, create/delete, auth-aware header
- Database migrations: unit stat columns, auth trigger for `public.users`
- RLS policies, `docs/SUPABASE_AUTH_TEMPLATES.md`

---

## What Was Built (Session 3 — 2026-05-20)

### Edit Roster & Edit Unit — ✅ DEPLOYED
- `EditRosterModal.tsx`, `EditUnitModal.tsx`
- `rosterService.ts` — added `updateUnit()`
- `Header.tsx` — ✎ edit button, "Over budget" warning
- `UnitDetailModal.tsx` — ✎ Edit button, wounds per model display

### UI Consistency — ✅ DEPLOYED
- `⋮` for more/details, `🗑` for delete, `✎` for edit everywhere

### Wound Tracking Overhaul — ✅ DEPLOYED
- `WoundTracker.tsx` — adapts: model pips / wound pips / per-model wound rows
- `UnitCard.tsx` uses `WoundTracker`, wound state is `Record<string, number[]>`

---

## What Was Built (Session 4 — 2026-05-27)

### Unit Images & Storage — ✅ DEPLOYED
- **`storageService.ts`** — Supabase Storage upload/delete with cache-busting (`?t=timestamp`)
- **`UnitDetailModal.tsx`** — image upload/replace/remove UI
- **`UnitCard.tsx`** — 40x40 thumbnail on left side of card
- **`AddUnitForm.tsx`** — image upload at creation time (signed-in users)
- **`EditUnitModal.tsx`** — image upload/replace/remove in edit flow
- **`types.ts`** — added `imageUrl?: string` to `Unit` interface
- **`rosterService.ts`** — `image_url` mapped in addUnit/updateUnit/mapUnitFromDb
- **Migration `004_add_image_url.sql`** — `ALTER TABLE units ADD COLUMN image_url TEXT`
- **Supabase Storage bucket** `unit-images`: public, 200kb limit, RLS policies for INSERT/UPDATE/DELETE

### Tabbed Home Page — ✅ DEPLOYED
- **"Your Rosters"** tab (existing roster list)
- **"Your Units"** tab (unit library — create, edit, delete units with thumbnails)
- Unit Library page (`UnitLibrary.tsx`) removed — functionality merged into Home tabs

### Add Unit to Roster Flow — ✅ DEPLOYED
- **`AddUnitToRosterModal.tsx`** — "From Library" picker + "Create New" option
- Creating a new unit in a roster auto-saves to unit library
- Picking from library clones the unit (including imageUrl) into the roster

### Guest → Account Import — ✅ DEPLOYED
- **`ImportGuestDataModal.tsx`** — prompts on sign-in when guest data exists
- **`guestImport.ts`** — imports guest rosters (with units) to Supabase, merges unit library
- Checkbox selection: import rosters, units, or both
- Clears guest localStorage after import, stores dismissed flag

### Railway
- **Railway trial expiring** — confirmed the API is completely unused. Web app talks directly to Supabase. Let it expire.

---

## Deployment

### Web App → Vercel
- **Root Directory:** Blank (repo root) — `vercel.json` handles pathing
- **vercel.json:** `npm install --legacy-peer-deps`
- **Build:** `cd apps/web && npx vite build`
- **Output:** `apps/web/dist`
- **Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Auto-deploys** on push to `main`
- **Status: ✅ DEPLOYED AND WORKING**

### API → Railway — ⚠️ EXPIRING / UNUSED
- Not needed. Can be removed from repo eventually.

### Mobile App → Not deployed yet

---

## Supabase

- **Project URL:** `https://nxzyaseddqefjfmxxsix.supabase.co`
- **Tables:** `users`, `rosters`, `units`, `game_stats`
- **Unit columns:** `id`, `roster_id`, `name`, `points`, `count`, `notes`, `movement`, `toughness`, `save`, `wounds`, `leadership`, `objective_control`, `abilities` (JSONB), `weapons` (JSONB), `image_url` (TEXT)
- **RLS:** Enabled on `rosters`, `units`, `game_stats`
- **Auth:** Email provider, email verification on, sessions auto-refresh (7 day JWT)
- **Trigger:** `on_auth_user_created` → auto-creates `public.users` row
- **Storage:** `unit-images` bucket (public, 200kb limit)
  - Policies: INSERT (own folder), UPDATE (own folder), DELETE (own folder), SELECT (all)
- **Web app connects directly** to Supabase (RLS protects data)

---

## Current Component Architecture

```
Home.tsx (tabbed)
├── Tab: "Your Rosters" — roster list, create/delete
├── Tab: "Your Units" — unit library, create/edit/delete with thumbnails
├── CreateRosterModal.tsx
├── AddUnitForm.tsx (with image upload)
├── EditUnitModal.tsx (with image upload/replace/remove)
└── ImportGuestDataModal.tsx (shown on sign-in if guest data exists)

RosterBuilder.tsx
├── Header.tsx (sticky top — roster name ✎, faction, points/max)
├── UnitCard.tsx (per unit, with thumbnail)
│   ├── WoundTracker.tsx (adapts to model/wound profile)
│   ├── StatsDropdown.tsx (expandable M/T/SV/W/LD/OC + weapons table)
│   └── UnitDetailModal.tsx (full detail with image upload/replace/remove, ✎ Edit)
├── Footer.tsx (sticky bottom — Game Options, Turn counter, CP counter)
├── AddUnitToRosterModal.tsx ("From Library" picker + "Create New")
├── EditRosterModal.tsx (name, faction, detachment, max points)
└── EditUnitModal.tsx (all unit fields + image)
```

---

## Known Issues / Cleanup Needed

1. **Stray files in repo root** — `mockData.ts`, `packages_shared_src_*.ts` should be deleted
2. **`apps/web/src/data/mockData.ts`** — no longer used, can be removed
3. **`LifeCounter.tsx`** — deprecated, replaced by `WoundTracker.tsx`, should be deleted
4. **No `pnpm-lock.yaml`** committed — Vercel uses npm workaround
5. **Mobile app not deployed**
6. **Railway API unused** — can remove `apps/api/` and `railway.toml` eventually
7. **Unit Library is localStorage-only** — doesn't sync across devices for signed-in users (future improvement)
8. **Image replace** — requires UPDATE policy on Supabase Storage (was just added this session)

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
- **Image cache-busting** — `?t=timestamp` appended to image URLs after replace
- **Unit Library = reusable templates** — creating units in roster auto-saves to library
- **Guest import on sign-in** — non-intrusive modal, dismissable, remembers choice

---

## What to Build Next (Priority Order)

1. **Superuser dashboard** — admin page for app control, user management (when needed)
2. **Session timeout configuration** — currently 7-day auto-refresh, may want shorter
3. **Deploy mobile app** to Vercel as second project
4. **Game Options page** — mission selection, scoring, battle log
5. **Export roster** (JSON, PDF, shareable link)
6. **Roster limits / paywall** — free users get N rosters, paid get unlimited
7. **Sync Unit Library to Supabase** — so it persists across devices for signed-in users
8. **Clean up** — remove stray root files, deprecated components, unused API code

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
- Image URLs use cache-busting: `?t=timestamp` — `deleteUnitImage` strips query params before extracting path
- Supabase Storage policies needed: INSERT, UPDATE, DELETE, SELECT on `unit-images` bucket
