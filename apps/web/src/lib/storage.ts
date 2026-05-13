/**
 * Local storage service for offline-first data.
 *
 * What lives here (NOT in the database):
 * - Game state (turn, CP, scores, life pips) — ephemeral, per-session
 * - Unit reference data (user-entered stats) — personal, stays on device
 * - Offline roster cache — so the app works without internet
 *
 * What lives in Supabase (cloud):
 * - User account & auth
 * - Roster metadata (name, faction, points)
 * - Unit selections per roster (name, points, count — lightweight)
 */

import type { GameState, Unit } from '../../../../packages/shared/src/types'

const KEYS = {
  GAME_STATE: 'rm_game_state',
  UNIT_LIBRARY: 'rm_unit_library',
  ROSTER_CACHE: 'rm_roster_cache',
} as const

// ── Game State (ephemeral, current game session) ────────────────

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(KEYS.GAME_STATE, JSON.stringify(state))
  } catch (e) {
    console.warn('Failed to save game state:', e)
  }
}

export function loadGameState(): GameState | null {
  try {
    const data = localStorage.getItem(KEYS.GAME_STATE)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function clearGameState(): void {
  localStorage.removeItem(KEYS.GAME_STATE)
}

// ── Unit Library (user's personal unit reference data) ──────────
// Users enter their own unit stats from their own sources.
// This is their personal library they can pull from when building rosters.

export function saveUnitLibrary(units: Unit[]): void {
  try {
    localStorage.setItem(KEYS.UNIT_LIBRARY, JSON.stringify(units))
  } catch (e) {
    console.warn('Failed to save unit library:', e)
  }
}

export function loadUnitLibrary(): Unit[] {
  try {
    const data = localStorage.getItem(KEYS.UNIT_LIBRARY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToUnitLibrary(unit: Unit): void {
  const library = loadUnitLibrary()
  // Avoid duplicates by name
  const exists = library.find((u) => u.name.toLowerCase() === unit.name.toLowerCase())
  if (!exists) {
    library.push(unit)
    saveUnitLibrary(library)
  }
}

export function removeFromUnitLibrary(unitId: string): void {
  const library = loadUnitLibrary()
  saveUnitLibrary(library.filter((u) => u.id !== unitId))
}

// ── Roster Cache (offline access to cloud rosters) ──────────────

export function cacheRosters(rosters: any[]): void {
  try {
    localStorage.setItem(KEYS.ROSTER_CACHE, JSON.stringify(rosters))
  } catch (e) {
    console.warn('Failed to cache rosters:', e)
  }
}

export function loadCachedRosters(): any[] {
  try {
    const data = localStorage.getItem(KEYS.ROSTER_CACHE)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}
