# Server Session Persistence - Branch Summary

## Branch: `feature/server-session-persistence`

### Problem Solved
Users were losing all roster progress (wounds, turn counter, command points) when refreshing the page or closing the app.

### Solution Implemented
Hybrid session persistence with two-tier storage:
1. **localStorage** for instant, local saves
2. **Server API** for permanent, cross-device persistence

### What Changed

#### Backend (apps/api/src/server.ts)
✅ Added three new endpoints:
- `POST /api/rosters/:rosterId/session` - Save session state
- `GET /api/rosters/:rosterId/session` - Load session state  
- `DELETE /api/rosters/:rosterId/session` - Clear session state

Session storage includes: woundState, turn, commandPoints, timestamp

#### Frontend New Files

1. **apps/web/src/lib/serverSessionService.ts** (NEW)
   - `saveSessionToServer()` - POST session to API
   - `loadSessionFromServer()` - GET session from API
   - `clearSessionFromServer()` - DELETE session from API

2. **docs/SESSION_PERSISTENCE.md** (NEW)
   - Complete feature documentation
   - Architecture diagram
   - Usage guide
   - Testing checklist

#### Frontend Updated Files

1. **apps/web/src/lib/sessionStorage.ts** (UPDATED)
   - Now calls server sync functions in background
   - Falls back to server if localStorage is empty
   - Async clearSession with server cleanup

2. **apps/web/src/pages/RosterBuilder.tsx** (UPDATED)
   - Calls `loadSession()` on mount (now async)
   - Debounced `saveSession()` every 500ms
   - Async `clearSession()` on back button

### How It Works

1. **User opens a roster** → Checks localStorage first, then server
2. **User makes changes** → Saved to localStorage immediately (instant)
3. **Background sync** → Saved to server asynchronously (non-blocking)
4. **User refreshes** → Loads from localStorage (fast), or server if needed
5. **User closes app** → Session persists on server
6. **User leaves roster** → Session cleared from both local and server

### Key Features

✅ **Instant feedback** - localStorage saves are synchronous  
✅ **Persistent storage** - Server keeps data even after browser closes  
✅ **Offline first** - Works fine even if server is down  
✅ **Non-blocking** - Server sync doesn't freeze UI  
✅ **Small data size** - ~200-300 bytes per roster (~300KB for 1000 rosters)  
✅ **Fallback behavior** - Gracefully handles network errors  

### Files Modified
- `apps/api/src/server.ts` - Added 3 new endpoints
- `apps/web/src/lib/sessionStorage.ts` - Updated to include server sync
- `apps/web/src/pages/RosterBuilder.tsx` - Updated to use async session loading

### Files Added
- `apps/web/src/lib/serverSessionService.ts` - Server sync service
- `docs/SESSION_PERSISTENCE.md` - Feature documentation

### Testing Steps

```bash
# Start backend
cd apps/api && pnpm dev

# Start frontend (in another terminal)
cd apps/web && pnpm dev

# Test:
1. Load a roster
2. Make changes (wound units, change turn/CP)
3. Refresh page → Progress restores from localStorage
4. Close DevTools Network tab to simulate offline
5. Refresh again → Still restores from localStorage
6. Clear localStorage in DevTools
7. Refresh → Loads from server (if API available)
```

### Environment Setup

Add to `.env` (if not already present):
```
REACT_APP_API_URL=http://localhost:3000
```

### Breaking Changes
None - feature is backward compatible

### Future Work
- Migrate to Supabase for persistent storage
- Add per-user sessions via authentication
- Implement conflict resolution for simultaneous edits
- Add session history/undo functionality
