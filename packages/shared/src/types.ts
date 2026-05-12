/**
 * Shared types and interfaces for Roster Maker
 */

export interface Unit {
  id: string
  name: string
  points: number
  count: number
  notes?: string
  // Stats
  movement: string
  toughness: number
  save: string
  wounds: number
  leadership: number
  objectiveControl: number
  // In-game tracking
  currentWounds: number
  abilities: string[]
  weapons: Weapon[]
}

export interface Weapon {
  name: string
  range: string
  attacks: string
  skill: string
  strength: number
  ap: number
  damage: string
  type: 'melee' | 'ranged'
}

export interface Roster {
  id: string
  name: string
  faction: string
  detachment?: string
  totalPoints: number
  maxPoints: number
  units: Unit[]
  createdAt: Date
  updatedAt: Date
}

export interface GameState {
  rosterId: string
  currentTurn: number
  maxTurns: number
  commandPoints: number
  playerOneScore: number
  playerTwoScore: number
  unitStates: Record<string, number> // unitId -> remaining wounds
}

export interface GameStats {
  id: string
  rosterId: string
  turn: number
  playerOnePoints: number
  playerTwoPoints: number
  notes: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
