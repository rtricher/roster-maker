# Server Session Persistence

## Overview

This feature implements **hybrid session persistence** for the Roster Builder. Game progress (wounds, turn counter, command points) is automatically saved to prevent data loss, with multiple fallback levels:

1. **Browser localStorage** (instant, local-only)
2. **Server API** (persistent, survives browser restart)

## How It Works

### Architecture

```
User makes changes in Roster Builder
    ↓
Immediate save to localStorage (instant UI feedback)
    ↓
Background sync to server (non-blocking, fire-and-forget)
    ↓
On page reload:
  - Try localStorage first (fast)
  - Fall back to server (if local data missing)
  - Initialize defaults (if neither available)
```

### Components

#### 1. **sessionStorage.ts** (Local Persistence)
- `saveSession()` - Save to localStorage + queue server sync
- `loadSession()` - Load from localStorage or server
- `clearSession()` - Clean up after leaving roster
- `hasSession()` - Check if session exists

#### 2. **serverSessionService.ts** (Server Sync)
- `saveSessionToServer()` - POST to `/api/rosters/:id/session`
- `loadSessionFromServer()` - GET from `/api/rosters/:id/session`
- `clearSessionFromServer()` - DELETE from `/api/rosters/:id/session`

#### 3. **API Endpoints** (Backend)
```
POST /api/rosters/:rosterId/session
  Body: { woundState, turn, commandPoints }
  Response: { id, rosterId, woundState, turn, commandPoints, savedAt }

GET /api/rosters/:rosterId/session
  Response: Same as above (404 if not found)

DELETE /api/rosters/:rosterId/session
  Response: { success: true }
```

#### 4. **RosterBuilder.tsx** (Integration)
- Auto-saves state every 500ms (debounced)
- Loads session on mount
- Clears session when navigating away

## Data Size

Each roster session is approximately **200-300 bytes** as JSON:
- Typical scenario: 10 units × 5 models = 50 numbers
- At scale: 1,000 rosters = ~300KB (negligible vs Supabase 1GB free tier)

## Usage

### For Users
1. **Load a roster** → Previous session (if exists) is restored
2. **Make changes** → Automatically saved locally and synced to server
3. **Refresh page** → Progress is restored from localStorage or server
4. **Close app** → Session is cleared (ready for fresh start next time)

### For Developers

**Enable server persistence:**
Set environment variable in `.env`:
```
REACT_APP_API_URL=http://localhost:3000
```

**Run development servers:**
```bash
# Terminal 1: Backend API
cd apps/api
pnpm dev

# Terminal 2: Frontend
cd apps/web
pnpm dev
```

**Test the feature:**
1. Load a roster
2. Wound some units, change turn/command points
3. Observe console logs showing saves
4. Refresh page → Session restores
5. Open DevTools → Network tab → See POST requests to `/api/rosters/:id/session`

## Fallback Behavior

| Scenario | Behavior |
|----------|----------|
| Network up, API up | Save locally, sync to server |
| Network up, API down | Save locally, background sync fails silently |
| Browser reloaded, localStorage exists | Load from localStorage immediately |
| Browser reloaded, localStorage missing, API up | Load from server, cache locally |
| Browser reloaded, both missing | Start fresh with defaults |
| User signs out | Session cleared |

## Future Enhancements

1. **Supabase Integration** - Replace in-memory storage with Supabase
2. **User-Specific Sessions** - Per-user persistence via Auth
3. **Conflict Resolution** - Handle simultaneous edits
4. **Session History** - Undo/redo last saves
5. **Export/Import** - Download session JSON locally

## Testing Checklist

- [ ] Save to localStorage works
- [ ] Server sync happens in background
- [ ] Page refresh restores from localStorage
- [ ] Closing browser and reopening restores from server (if API available)
- [ ] Network errors don't crash app
- [ ] Session clears when leaving roster
- [ ] Multiple rosters don't interfere with each other
