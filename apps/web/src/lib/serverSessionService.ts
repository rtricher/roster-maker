/**
 * Server Session Service
 * Handles syncing session state to/from the backend API
 */

interface RosterSession {
  id: string
  rosterId: string
  woundState: Record<string, number[]>
  turn: number
  commandPoints: number
  savedAt: string
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000'

/**
 * Save session to server
 * Returns true if successful, false otherwise
 */
export async function saveSessionToServer(
  rosterId: string,
  woundState: Record<string, number[]>,
  turn: number,
  commandPoints: number
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/rosters/${rosterId}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        woundState,
        turn,
        commandPoints,
      }),
    })

    if (!response.ok) {
      console.warn('Failed to save session to server:', response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.warn('Failed to sync session to server:', error)
    return false
  }
}

/**
 * Load session from server
 * Returns session data if found, null otherwise
 */
export async function loadSessionFromServer(rosterId: string): Promise<RosterSession | null> {
  try {
    const response = await fetch(`${API_BASE}/api/rosters/${rosterId}/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // 404 is expected if no session exists
      if (response.status === 404) {
        return null
      }
      console.warn('Failed to load session from server:', response.statusText)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.warn('Failed to load session from server:', error)
    return null
  }
}

/**
 * Clear session from server
 * Returns true if successful, false otherwise
 */
export async function clearSessionFromServer(rosterId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/rosters/${rosterId}/session`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn('Failed to clear session from server:', response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.warn('Failed to clear session from server:', error)
    return false
  }
}
