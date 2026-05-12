/**
 * Utility functions for Roster Maker
 */

import type { Unit, Roster } from './types'

export function calculateRosterPoints(units: Unit[]): number {
  return units.reduce((total, unit) => total + unit.points, 0)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function createEmptyRoster(name: string, faction: string): Roster {
  return {
    id: generateId(),
    name,
    faction,
    totalPoints: 0,
    maxPoints: 2000,
    units: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}