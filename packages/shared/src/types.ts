/**
 * Shared types and interfaces for Roster Maker
 */

export interface Unit {
  id: string
  name: string
  points: number
  count?: number
  notes?: string
}

export interface Roster {
  id: string
  name: string
  faction: string
  totalPoints: number
  units: Unit[]
  createdAt: Date
  updatedAt: Date
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
