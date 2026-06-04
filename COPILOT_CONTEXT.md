# Copilot Context — Roster Maker

> **Purpose:** Catch up Copilot quickly on project history, decisions, and current state.
> **Last updated:** 2026-06-04

---

> ⚠️ **START-OF-SESSION REMINDER:** Before doing anything, review the current state of the repo — check what branches exist, what's on `main`, and what's in progress. The user may have uploaded files or made changes between sessions.

---

## Project Overview

**Roster Maker** is a **game-agnostic** tabletop wargame roster builder and game-day companion. While initially inspired by Warhammer 40K, it is designed to work with **any tabletop game** — users enter their own unit data manually.

**Repo:** `rtricher/roster-maker` (public)
**Owner:** rtricher

---

## Architecture

```
roster-maker/
├── apps/
│   ├── web/          # Desktop roster builder (React + Vite + Tailwind)
│   ├── mobile/       # Mobile game tracker (React + Vite + Tailwind)
│   └── api/          # Backend API — UNUSED, Railway expired
├── packages/
│   ├── shared/       # Shared TypeScript types & utilities
│   └── database/     # Database schemas (Supabase/PostgreSQL)
├── docs/
│   ├── migrations/   # SQL migration scripts
│   └── SUPABASE_AUTH_TEMPLATES.md
├── vercel.json       # Vercel deploy config (web app, SPA rewrites)
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
| Weapon templates | Supabase (logged in) / localStorage (guest) | Reusable weapon library |
| Game systems | Supabase (global, read-only for all) | Defines stat templates per game |
| Unit images | Supabase Storage (logged in only) | Needs server-side hosting |
| Game state (turn, CP, scores, wound tracking) | React state | Ephemeral, per-session only |

### Key Design Decisions
- **No bundled unit data.** The app ships zero game content. Users enter their own units manually.
- **Guest mode works fully.** Users can create rosters, add units, and play games without signing up.
- **Signed-in users get cloud sync.** Rosters saved to Supabase, accessible from any device.
- **Guest → signed-in import.** When a user signs in with existing guest data, a modal prompts to import rosters/units.
- **Units in rosters are independent copies** — editing a roster unit does NOT affect the unit library.
- **Unit Library = templates** — creating units in roster auto-saves to library, but they're disconnected after.
- **Weapons: hybrid approach** — weapon templates (normalized, reusable library) + per-unit JSONB copies (independent).
- **Max points is a soft cap** — displayed as warning (red text) when over budget, never enforced.
- **Future paywall hook:** Limit free users to N rosters, paid users get unlimited.

---

## What Was Built (Session 1 — 2026-05-12)

### Starting State
- Repo had config files but nothing compiled or ran

### What Was Scaffolded
- Shared types, Web app, Mobile app, API, Database schemas, Deployment

---

## What Was Built (Session 2 — 2026-05-13)

### Authentication & Roster Persistence
- Supabase Auth, `AuthContext.tsx`, `rosterService.ts`, Home page, RLS policies

---

## What Was Built (Session 3 — 2026-05-20)

### Edit Roster & Edit Unit, UI Consistency, Wound Tracking Overhaul — ✅ DEPLOYED

---

## What Was Built (Session 4 — 2026-05-27)

### Unit Images & Storage, Tabbed Home Page, Add Unit to Roster Flow, Guest → Account Import — ✅ DEPLOYED

---

## What Was Built (Session 5 — 2026-06-01)

### Wound Tracking Redesign — ✅ DEPLOYED
- **Replaced pip-based WoundTracker** with compact ± counters (same style as Turn/CP)
- **Max 2 counters per unit card:** "Models" (only if multi-model) + "Wounds" (always)
- **Counters always visible** — not hidden inside expansion
- **Deleted:** `WoundTracker.tsx`, `StatsDropdown.tsx` (no longer used)

### Tap-to-Expand Unit Cards — ✅ DEPLOYED
- Tapping the unit card body expands/collapses stats, weapons, abilities, notes
- Stats display on single scrollable line (responsive for mobile)
- Notes shown in expanded view
- Works on both Roster Builder and Home → Units tab
- Removed dedicated "Stats" button

### Weapon Management — ✅ DEPLOYED
- **`WeaponForm.tsx`** — add/edit weapon with all WH40K stats (Range, A, BS/WS, S, AP, D)
- **`WeaponManager.tsx`** — inline weapon list inside EditUnitModal (add/edit/remove/pick from library)
- **`weaponService.ts`** — weapon template CRUD (Supabase for logged-in, localStorage for guest)
- **`gameSystemService.ts`** — loads game system definitions from Supabase
- **Weapon Library** — creating a weapon auto-saves to templates; can pick from library when adding
- **Bug fix:** nested `<form>` tags caused accidental form submission → replaced WeaponForm with `<div>`

### Game Systems Schema — ✅ DEPLOYED (DB only, not yet wired into UI)
- **`game_systems` table** — defines unit stat templates, weapon stat templates, roles per game
- **`weapon_templates` table** — per-user reusable weapons with game_system_id
- **`rosters.game_system_id`** — FK added (nullable)
- **`units.role`** — column added (text, e.g. "Character", "Battleline")
- **WH40K 10th Edition seeded** with full stat templates and roles
- **RLS:** weapon_templates (user owns), game_systems (public read)
- **Migration:** `docs/migrations/005_game_systems_and_weapons.sql`

### SPA Routing Fix — ✅ DEPLOYED
- **`vercel.json`** — added `rewrites` for SPA routing (fixes 404 on refresh/back on mobile)

### Navigation Bug Fix — ✅ DEPLOYED
- **`RosterBuilder.tsx`** — `hasLoaded` ref prevents re-triggering `loadRoster()` on render
- `setEditingUnit(null)` only fires on successful save; shows alert on failure

### Debug Logging (temporary)
- `rosterService.ts` has `console.log('[updateUnit]...')` — can remove once stable

---

## What Was Built (Session 6 — 2026-06-04)

### Weapon Display Redesign — 🔄 IN PROGRESS (feat/weapon-display-redesign)
- **Redesigned weapon display** in UnitCard expanded view to match stat box styling
  - Weapons now display in a table alongside base stats for perfect alignment
  - Each weapon name + type badge, followed by stat boxes (R, A, BS/WS, S, AP, D)
  - Fixed BS/WS detection: correctly displays BS for ranged, WS for melee
  - Single unified table: Base Stats row + Weapon rows all aligned
  
### Unit Library Styling — 🔄 IN PROGRESS (feat/weapon-display-redesign)
- **Synced Unit Library expanded view** to match UnitCard exactly
  - Updated Home.tsx Unit Library cards to use same table layout with Base Stats + Weapons
  - Consistent visual appearance across both views
  - Applied to: `apps/web/src/pages/Home.tsx` (lines 372-429)

### Wound Counter Layout — 🔄 IN PROGRESS (feat/weapon-display-redesign)
- **Model/Wound counters now vertical** (label above buttons + display)
  - Changed from horizontal to `flex-col` layout with `items-center`
  - Labels ("Models", "Wounds") appear above the counter controls
  - **Saves significant horizontal space** on collapsed unit cards
  - Applies to: UnitCard (lines 88-126)

### Summary of Changes
- **UnitCard.tsx (lines 74, 77):** Fixed thumbnail size back to `w-10 h-10` (was accidentally `w-15 h-15`, not valid Tailwind)
- **UnitCard.tsx (lines 88-126):** Restructured wound counters to vertical layout (`flex-col`)
- **UnitCard.tsx (lines 163-218):** Unified table for Base Stats + all Weapon rows (perfect alignment)
- **Home.tsx (lines 374-429):** Mirrored UnitCard table layout in Unit Library expanded view

---

## Deployment

### Web App → Vercel
- **vercel.json:** install, build, output, **SPA rewrites** (`"source": "/(.*)"` → `/index.html`)
- **Auto-deploys** on push to `main`
- **Status: ✅ DEPLOYED AND WORKING**

### API → Railway — ❌ EXPIRED / UNUSED
- Can remove `apps/api/` and `railway.toml` from repo

### Mobile App → Not deployed yet

---

## Supabase

- **Project URL:** `https://nxzyaseddqefjfmxxsix.supabase.co`
- **Tables:** `users`, `rosters`, `units`, `game_stats`, `game_systems`, `weapon_templates`
- **Unit columns:** `id`, `roster_id`, `name`, `points`, `count`, `notes`, `movement`, `toughness`, `save`, `wounds`, `leadership`, `objective_control`, `abilities` (JSONB), `weapons` (JSONB)
- **Roster columns:** includes `game_system_id` (UUID, nullable FK)
- **RLS:** Enabled on `rosters`, `units`, `game_stats`, `weapon_templates`, `game_systems`
  - Units policy: `roster_id IN (SELECT id FROM rosters WHERE user_id = auth.uid())`
  - Weapon templates: user owns
  - Game systems: public read
- **Auth:** Email provider, email verification on, sessions auto-refresh (7 day JWT)
- **Trigger:** `on_auth_user_created` → auto-creates `public.users` row
- **Storage:** `unit-images` bucket (public, 200kb limit)
  - Policies: INSERT (own folder), UPDATE (own folder), DELETE (own folder), SELECT (all)

---

## Current Component Architecture

```
Home.tsx (tabbed)
├── Tab: "Your Rosters" — roster list, create/delete
├── Tab: "Your Units" — unit library with expandable cards (table: Base Stats + Weapons)
├── CreateRosterModal.tsx
├── AddUnitForm.tsx (with image upload)
├── EditUnitModal.tsx (with image, WeaponManager)
└── ImportGuestDataModal.tsx (shown on sign-in if guest data exists)

RosterBuilder.tsx
├── Header.tsx (sticky top — roster name ✎, faction, points/max)
├── UnitCard.tsx (per unit — thumbnail, vertical wound counters, tap to expand)
│   └── Expanded: table with Base Stats row + Weapon rows, abilities, notes
│   └── UnitDetailModal.tsx (⋮ button — full detail with image upload, ✎ Edit)
├── Footer.tsx (sticky bottom — Game Options, Turn counter, CP counter)
├── AddUnitToRosterModal.tsx ("From Library" picker + "Create New")
├── EditRosterModal.tsx (name, faction, detachment, max points)
└── EditUnitModal.tsx (all unit fields + WeaponManager + image)

EditUnitModal.tsx
└── WeaponManager.tsx (list/add/edit/remove/pick from library)
    └── WeaponForm.tsx (NOT a <form> — uses <div> to avoid nested form bug)
```

---

## Known Issues / Cleanup Needed

1. **Stray files in repo root** — `mockData.ts`, `packages_shared_src_*.ts` should be deleted
2. **`apps/web/src/data/mockData.ts`** — no longer used, can be removed
3. **`LifeCounter.tsx`** — deprecated, should be deleted
4. **`WoundTracker.tsx`** — deprecated (replaced by inline counters in UnitCard), should be deleted
5. **`StatsDropdown.tsx`** — deprecated (stats now inline in UnitCard expansion), should be deleted
6. **No `pnpm-lock.yaml`** committed — Vercel uses npm workaround
7. **Mobile app not deployed**
8. **Railway API unused** — can remove `apps/api/` and `railway.toml`
9. **Unit Library is localStorage-only** — doesn't sync across devices for signed-in users
10. **Debug console.log in rosterService.ts** — remove when stable

---

## Design Decisions

- **Game-agnostic** — no hardcoded game data, works for any tabletop game
- **No bundled unit data** — users enter their own, avoids copyright
- **Guest-first** — fully functional without account, localStorage persistence
- **Hybrid storage** — `rosterService.ts` abstracts Supabase vs localStorage
- **Dark military theme** — `surface-900` (#0f1114), olive green, amber for points
- **UUIDs everywhere** — `crypto.randomUUID()` guest, `gen_random_uuid()` Supabase
- **Direct Supabase access** from frontend (RLS protects data)
- **Compact wound tracking** — ± counters with labels above, vertical layout
- **Max points = soft cap** — shows red warning, never blocks
- **Icon consistency** — `⋮` for more/details, `🗑` for delete, `✎` for edit
- **Image cache-busting** — `?t=timestamp` appended to image URLs after replace
- **Unit Library = reusable templates** — creating units in roster auto-saves to library
- **Roster units are independent copies** — edits don't propagate back to library
- **Weapon templates (normalized) + per-unit JSONB copies** — library for reuse, unit owns its data
- **Guest import on sign-in** — non-intrusive modal, dismissable, remembers choice
- **No nested `<form>` tags** — WeaponForm uses `<div>` + `type="button"` to prevent accidental submissions
- **SPA routing** — vercel.json rewrites all paths to index.html
- **Table-based layout for stats** — unified tables in expanded views (Base Stats + Weapons rows) for perfect alignment

---

## What to Build Next (Priority Order)

1. **Merge weapon-display-redesign PR** — test on live, verify all alignments work
2. **Display order / reordering** — units and weapons should be reorderable (drag-and-drop preferred, or ↑↓ buttons)
3. **Wire game systems into UI** — game system picker on roster creation, drives stat fields
4. **Superuser dashboard** — admin page for app control, user management
5. **Stock icons** — unit role icons (Command, Elite, Troops, Heavy Support) + faction icons
6. **Deploy mobile app** to Vercel as second project
7. **Game Options page** — mission selection, scoring, battle log
8. **Export roster** (JSON, PDF, shareable link)
9. **Roster limits / paywall** — free users get N rosters, paid get unlimited
10. **Sync Unit Library to Supabase** — so it persists across devices for signed-in users
11. **Clean up** — remove stray root files, deprecated components, unused API code

---

## Commands

```bash
# Local development
pnpm install
pnpm dev          # Starts all 3 apps

# Individual apps
cd apps/web && pnpm dev      # http://localhost:5173
cd apps/mobile && pnpm dev   # http://localhost:5174

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
- User primarily tests **signed in** — Supabase is the main data path to validate against
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
- **NEVER nest `<form>` inside `<form>`** — use `<div>` + `type="button"` for sub-forms
- Supabase Storage policies needed: INSERT, UPDATE, DELETE, SELECT on `unit-images` bucket
- Units RLS uses subquery: `roster_id IN (SELECT id FROM rosters WHERE user_id = auth.uid())`
- **Table layouts:** Use `<table>` with `<tbody>` for aligned rows of stats/weapons (avoids spacing issues with flex)
