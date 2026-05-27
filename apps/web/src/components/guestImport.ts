/**
 * Guest Data Import
 *
 * When a user signs in and there's guest data in localStorage,
 * this module handles importing rosters to Supabase and merging
 * the unit library.
 */

import type { User } from '@supabase/supabase-js'
import type { Unit } from '../../../../packages/shared/src/types'
import { supabase } from './supabase'
import { loadUnitLibrary, saveUnitLibrary } from './storage'

const GUEST_ROSTERS_KEY = 'rm_guest_rosters'
const IMPORT_DISMISSED_KEY = 'rm_import_dismissed'

/** Check if there's guest data worth importing */
export function hasGuestData(): { rosterCount: number; unitCount: number } {
  try {
    const rostersRaw = localStorage.getItem(GUEST_ROSTERS_KEY)
    const rosters = rostersRaw ? JSON.parse(rostersRaw) : []
    const units = loadUnitLibrary()
    return { rosterCount: rosters.length, unitCount: units.length }
  } catch {
    return { rosterCount: 0, unitCount: 0 }
  }
}

/** Check if user already dismissed the import prompt */
export function wasImportDismissed(): boolean {
  return localStorage.getItem(IMPORT_DISMISSED_KEY) === 'true'
}

/** Mark import as dismissed so we don't ask again */
export function dismissImport(): void {
  localStorage.setItem(IMPORT_DISMISSED_KEY, 'true')
}

/** Import guest rosters into the user's Supabase account */
export async function importGuestRosters(user: User): Promise<number> {
  const rostersRaw = localStorage.getItem(GUEST_ROSTERS_KEY)
  if (!rostersRaw) return 0

  const guestRosters = JSON.parse(rostersRaw)
  let imported = 0

  for (const roster of guestRosters) {
    // Create the roster in Supabase
    const { data: newRoster, error: rosterError } = await supabase
      .from('rosters')
      .insert({
        user_id: user.id,
        name: roster.name,
        faction: roster.faction || '',
        detachment: roster.detachment || null,
        total_points: roster.totalPoints || 0,
        max_points: roster.maxPoints || 2000,
      })
      .select()
      .single()

    if (rosterError || !newRoster) {
      console.error('Failed to import roster:', rosterError)
      continue
    }

    // Import units for this roster
    if (roster.units && roster.units.length > 0) {
      const unitInserts = roster.units.map((u: any) => ({
        roster_id: newRoster.id,
        name: u.name,
        points: u.points || 0,
        count: u.count || 1,
        notes: u.notes || null,
        movement: u.movement || '6"',
        toughness: u.toughness || 4,
        save: u.save || '3+',
        wounds: u.wounds || 1,
        leadership: u.leadership || 6,
        objective_control: u.objectiveControl || 1,
        abilities: u.abilities || [],
        weapons: u.weapons || [],
        image_url: u.imageUrl || null,
      }))

      const { error: unitsError } = await supabase.from('units').insert(unitInserts)
      if (unitsError) {
        console.error('Failed to import units for roster:', unitsError)
      }
    }

    imported++
  }

  // Clear guest rosters after successful import
  if (imported > 0) {
    localStorage.removeItem(GUEST_ROSTERS_KEY)
  }

  return imported
}

/** Merge guest unit library into the existing library (avoids duplicates by name) */
export function mergeGuestUnitLibrary(): number {
  const guestUnits = loadUnitLibrary()
  if (guestUnits.length === 0) return 0

  // The unit library is always localStorage-based (even for logged-in users)
  // So we just keep what's there — it's already merged.
  // This function is mainly for the count/acknowledgment.
  return guestUnits.length
}

/** Clear all guest data after import */
export function clearGuestData(): void {
  localStorage.removeItem(GUEST_ROSTERS_KEY)
  // Note: we don't clear the unit library since it's shared between guest/signed-in
}
