/**
 * Session Storage for persisting in-game state
 * Saves wounds, turn counter, and command points to localStorage
 */

interface RosterSession {
  rosterId: string
  woundState: Record<string, number[]>
  turn: number
  commandPoints: number
  savedAt: string
}

const SESSION_KEY = 'roster-session'

export function saveSession(
  rosterId: string,
  woundState: Record<string, number[]>,
  turn: number,
  commandPoints: number
): void {
  const session: RosterSession = {
    rosterId,
    woundState,
    turn,
    commandPoints,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loadSession(rosterId: string): RosterSession | null {
  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return null
  
  try {
    const session: RosterSession = JSON.parse(stored)
    // Only return if it's for this roster
    if (session.rosterId === rosterId) {
      return session
    }
  } catch (e) {
    console.error('Failed to parse stored session:', e)
  }
  
  return null
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function hasSession(rosterId: string): boolean {
  const session = loadSession(rosterId)
  return session !== null && session.rosterId === rosterId
}
