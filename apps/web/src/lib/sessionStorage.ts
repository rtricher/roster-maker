/**
 * Session Storage for persisting in-game state
 * Saves to localStorage (instant) and syncs to server (persistent)
 */

import { saveSessionToServer, loadSessionFromServer, clearSessionFromServer } from './serverSessionService'

interface RosterSession {
  rosterId: string
  woundState: Record<string, number[]>
  turn: number
  commandPoints: number
  savedAt: string
}

const SESSION_KEY = 'roster-session'

/**
 * Save session to localStorage immediately and sync to server in background
 */
export async function saveSession(
  rosterId: string,
  woundState: Record<string, number[]>,
  turn: number,
  commandPoints: number
): Promise<void> {
  // Save to localStorage immediately (instant feedback)
  const session: RosterSession = {
    rosterId,
    woundState,
    turn,
    commandPoints,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  // Sync to server in background (don't await, don't block UI)
  saveSessionToServer(rosterId, woundState, turn, commandPoints).catch((error) => {
    console.error('Background sync failed:', error)
  })
}

/**
 * Load session from localStorage first, then try server if needed
 */
export async function loadSession(rosterId: string): Promise<RosterSession | null> {
  // First, try localStorage (fast)
  const stored = localStorage.getItem(SESSION_KEY)
  if (stored) {
    try {
      const session: RosterSession = JSON.parse(stored)
      if (session.rosterId === rosterId) {
        return session
      }
    } catch (e) {
      console.error('Failed to parse stored session:', e)
    }
  }

  // If not in localStorage, try loading from server
  try {
    const serverSession = await loadSessionFromServer(rosterId)
    if (serverSession) {
      // Cache it locally
      localStorage.setItem(SESSION_KEY, JSON.stringify(serverSession))
      return serverSession
    }
  } catch (error) {
    console.warn('Failed to load session from server:', error)
  }

  return null
}

/**
 * Clear session from both localStorage and server
 */
export async function clearSession(rosterId?: string): Promise<void> {
  // Always clear localStorage
  localStorage.removeItem(SESSION_KEY)

  // Also clear from server if rosterId provided
  if (rosterId) {
    try {
      await clearSessionFromServer(rosterId)
    } catch (error) {
      console.warn('Failed to clear session from server:', error)
    }
  }
}

/**
 * Check if a session exists for a roster
 */
export function hasSession(rosterId: string): boolean {
  const session = localStorage.getItem(SESSION_KEY)
  if (!session) return false

  try {
    const parsed: RosterSession = JSON.parse(session)
    return parsed.rosterId === rosterId
  } catch {
    return false
  }
}
