/**
 * Roster Service
 *
 * Logged-in users: rosters are saved to Supabase
 * Guest users: rosters are saved to localStorage (persists between visits)
 *
 * This is where you could introduce limits for free vs paid users:
 * - Free: max 3 rosters
 * - Paid: unlimited rosters
 */

import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Roster, Unit } from '../../../../packages/shared/src/types'
import { generateId } from '../../../../packages/shared/src/utils'

const GUEST_ROSTERS_KEY = 'rm_guest_rosters'

// ── Guest (localStorage) ────────────────────────────────────────

function loadGuestRosters(): Roster[] {
  try {
    const data = localStorage.getItem(GUEST_ROSTERS_KEY)
    if (!data) return []
    return JSON.parse(data).map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }))
  } catch {
    return []
  }
}

function saveGuestRosters(rosters: Roster[]): void {
  try {
    localStorage.setItem(GUEST_ROSTERS_KEY, JSON.stringify(rosters))
  } catch (e) {
    console.warn('Failed to save guest rosters:', e)
  }
}

// ── Public API ──────────────────────────────────────────────────

export async function getRosters(user: User | null): Promise<Roster[]> {
  if (!user) {
    return loadGuestRosters()
  }

  const { data: rosters, error } = await supabase
    .from('rosters')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Failed to load rosters:', error)
    return []
  }

  // Load units for each roster
  const rosterIds = rosters.map((r: any) => r.id)
  const { data: units } = await supabase
    .from('units')
    .select('*')
    .in('roster_id', rosterIds.length > 0 ? rosterIds : ['none'])

  return rosters.map((r: any) => ({
    id: r.id,
    name: r.name,
    faction: r.faction || '',
    detachment: r.detachment || '',
    totalPoints: r.total_points || 0,
    maxPoints: r.max_points || 2000,
    units: (units || [])
      .filter((u: any) => u.roster_id === r.id)
      .map(mapUnitFromDb),
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
  }))
}

export async function createRoster(
  user: User | null,
  name: string,
  faction: string,
  detachment?: string,
  maxPoints?: number
): Promise<Roster | null> {
  const now = new Date()

  if (!user) {
    // Guest: save to localStorage
    const roster: Roster = {
      id: generateId(),
      name,
      faction,
      detachment,
      totalPoints: 0,
      maxPoints: maxPoints || 2000,
      units: [],
      createdAt: now,
      updatedAt: now,
    }
    const rosters = loadGuestRosters()
    rosters.unshift(roster)
    saveGuestRosters(rosters)
    return roster
  }

  // Logged in: save to Supabase
  const { data, error } = await supabase
    .from('rosters')
    .insert({
      user_id: user.id,
      name,
      faction,
      detachment: detachment || null,
      total_points: 0,
      max_points: maxPoints || 2000,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create roster:', error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    faction: data.faction || '',
    detachment: data.detachment || '',
    totalPoints: 0,
    maxPoints: data.max_points || 2000,
    units: [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export async function deleteRoster(user: User | null, rosterId: string): Promise<boolean> {
  if (!user) {
    const rosters = loadGuestRosters()
    saveGuestRosters(rosters.filter((r) => r.id !== rosterId))
    return true
  }

  const { error } = await supabase.from('rosters').delete().eq('id', rosterId)
  if (error) {
    console.error('Failed to delete roster:', error)
    return false
  }
  return true
}

export async function updateRoster(
  user: User | null,
  rosterId: string,
  updates: { name?: string; faction?: string; detachment?: string; maxPoints?: number }
): Promise<boolean> {
  if (!user) {
    const rosters = loadGuestRosters()
    const idx = rosters.findIndex((r) => r.id === rosterId)
    if (idx === -1) return false
    rosters[idx] = { ...rosters[idx], ...updates, updatedAt: new Date() }
    saveGuestRosters(rosters)
    return true
  }

  const dbUpdates: any = { updated_at: new Date().toISOString() }
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.faction !== undefined) dbUpdates.faction = updates.faction
  if (updates.detachment !== undefined) dbUpdates.detachment = updates.detachment
  if (updates.maxPoints !== undefined) dbUpdates.max_points = updates.maxPoints

  const { error } = await supabase.from('rosters').update(dbUpdates).eq('id', rosterId)
  if (error) {
    console.error('Failed to update roster:', error)
    return false
  }
  return true
}

// ── Units ───────────────────────────────────────────────────────

export async function addUnit(user: User | null, rosterId: string, unit: Unit): Promise<boolean> {
  if (!user) {
    const rosters = loadGuestRosters()
    const idx = rosters.findIndex((r) => r.id === rosterId)
    if (idx === -1) return false
    rosters[idx].units.push(unit)
    rosters[idx].totalPoints = rosters[idx].units.reduce((sum, u) => sum + u.points, 0)
    rosters[idx].updatedAt = new Date()
    saveGuestRosters(rosters)
    return true
  }

  const { error } = await supabase.from('units').insert({
    id: unit.id,
    roster_id: rosterId,
    name: unit.name,
    points: unit.points,
    count: unit.count,
    notes: unit.notes || null,
    movement: unit.movement,
    toughness: unit.toughness,
    save: unit.save,
    wounds: unit.wounds,
    leadership: unit.leadership,
    objective_control: unit.objectiveControl,
    abilities: unit.abilities,
    weapons: unit.weapons,
  })

  if (error) {
    console.error('Failed to add unit:', error)
    return false
  }

  // Update roster total points
  await recalculateRosterPoints(rosterId)
  return true
}

export async function removeUnit(user: User | null, rosterId: string, unitId: string): Promise<boolean> {
  if (!user) {
    const rosters = loadGuestRosters()
    const idx = rosters.findIndex((r) => r.id === rosterId)
    if (idx === -1) return false
    rosters[idx].units = rosters[idx].units.filter((u) => u.id !== unitId)
    rosters[idx].totalPoints = rosters[idx].units.reduce((sum, u) => sum + u.points, 0)
    rosters[idx].updatedAt = new Date()
    saveGuestRosters(rosters)
    return true
  }

  const { error } = await supabase.from('units').delete().eq('id', unitId)
  if (error) {
    console.error('Failed to remove unit:', error)
    return false
  }

  await recalculateRosterPoints(rosterId)
  return true
}

// ── Helpers ─────────────────────────────────────────────────────

async function recalculateRosterPoints(rosterId: string): Promise<void> {
  const { data: units } = await supabase
    .from('units')
    .select('points')
    .eq('roster_id', rosterId)

  const total = (units || []).reduce((sum: number, u: any) => sum + u.points, 0)

  await supabase
    .from('rosters')
    .update({ total_points: total, updated_at: new Date().toISOString() })
    .eq('id', rosterId)
}

function mapUnitFromDb(u: any): Unit {
  return {
    id: u.id,
    name: u.name,
    points: u.points,
    count: u.count || 1,
    notes: u.notes || undefined,
    movement: u.movement || '6"',
    toughness: u.toughness || 4,
    save: u.save || '3+',
    wounds: u.wounds || 1,
    leadership: u.leadership || 6,
    objectiveControl: u.objective_control || 1,
    currentWounds: u.count || 1,
    abilities: u.abilities || [],
    weapons: u.weapons || [],
  }
}
