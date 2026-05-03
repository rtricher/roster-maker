/**
 * Utility functions for Roster Maker
 */

export function calculateRosterPoints(units: any[]): number {
  return units.reduce((total, unit) => total + (unit.points * (unit.count || 1)), 0)
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
