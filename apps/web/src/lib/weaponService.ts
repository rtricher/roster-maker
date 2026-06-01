/**
 * Weapon Template Service
 *
 * Logged-in users: weapon templates saved to Supabase
 * Guest users: weapon templates saved to localStorage
 */

import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Weapon } from '../../../../packages/shared/src/types'

const GUEST_WEAPONS_KEY = 'rm_guest_weapons'

export interface WeaponTemplate {
  id: string
  name: string
  type: 'ranged' | 'melee'
  stats: {
    range?: string
    attacks?: string
    skill?: string
    strength?: number
    ap?: number
    damage?: string
  }
  gameSystemId?: string
  createdAt?: Date
}

// ── Guest (localStorage) ────────────────────────────────────────

function loadGuestWeapons(): WeaponTemplate[] {
  try {
    const data = localStorage.getItem(GUEST_WEAPONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveGuestWeapons(weapons: WeaponTemplate[]): void {
  try {
    localStorage.setItem(GUEST_WEAPONS_KEY, JSON.stringify(weapons))
  } catch (e) {
    console.warn('Failed to save guest weapons:', e)
  }
}

// ── Public API ──────────────────────────────────────────────────

export async function getWeaponTemplates(user: User | null): Promise<WeaponTemplate[]> {
  if (!user) return loadGuestWeapons()

  const { data, error } = await supabase
    .from('weapon_templates')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    console.error('Failed to load weapon templates:', error)
    return []
  }

  return data.map(mapWeaponFromDb)
}

export async function createWeaponTemplate(
  user: User | null,
  weapon: Omit<WeaponTemplate, 'id' | 'createdAt'>
): Promise<WeaponTemplate | null> {
  if (!user) {
    const saved: WeaponTemplate = { ...weapon, id: crypto.randomUUID() }
    const weapons = loadGuestWeapons()
    weapons.push(saved)
    saveGuestWeapons(weapons)
    return saved
  }

  const { data, error } = await supabase
    .from('weapon_templates')
    .insert({
      user_id: user.id,
      name: weapon.name,
      type: weapon.type,
      stats: weapon.stats,
      game_system_id: weapon.gameSystemId || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create weapon template:', error)
    return null
  }

  return mapWeaponFromDb(data)
}

export async function updateWeaponTemplate(
  user: User | null,
  weaponId: string,
  updates: Partial<Omit<WeaponTemplate, 'id' | 'createdAt'>>
): Promise<boolean> {
  if (!user) {
    const weapons = loadGuestWeapons()
    const idx = weapons.findIndex((w) => w.id === weaponId)
    if (idx === -1) return false
    weapons[idx] = { ...weapons[idx], ...updates }
    saveGuestWeapons(weapons)
    return true
  }

  const dbUpdates: any = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.type !== undefined) dbUpdates.type = updates.type
  if (updates.stats !== undefined) dbUpdates.stats = updates.stats
  if (updates.gameSystemId !== undefined) dbUpdates.game_system_id = updates.gameSystemId || null

  const { error } = await supabase.from('weapon_templates').update(dbUpdates).eq('id', weaponId)
  if (error) {
    console.error('Failed to update weapon template:', error)
    return false
  }
  return true
}

export async function deleteWeaponTemplate(user: User | null, weaponId: string): Promise<boolean> {
  if (!user) {
    const weapons = loadGuestWeapons()
    saveGuestWeapons(weapons.filter((w) => w.id !== weaponId))
    return true
  }

  const { error } = await supabase.from('weapon_templates').delete().eq('id', weaponId)
  if (error) {
    console.error('Failed to delete weapon template:', error)
    return false
  }
  return true
}

/** Convert a WeaponTemplate to the Weapon format stored on units */
export function templateToUnitWeapon(template: WeaponTemplate): Weapon {
  return {
    name: template.name,
    type: template.type,
    range: template.stats.range || (template.type === 'melee' ? 'Melee' : '-'),
    attacks: template.stats.attacks || '1',
    skill: template.stats.skill || '4+',
    strength: template.stats.strength || 4,
    ap: template.stats.ap || 0,
    damage: template.stats.damage || '1',
  }
}

/** Convert a unit's Weapon to a template (for saving to library) */
export function unitWeaponToTemplate(weapon: Weapon): Omit<WeaponTemplate, 'id' | 'createdAt'> {
  return {
    name: weapon.name,
    type: weapon.type,
    stats: {
      range: weapon.range,
      attacks: weapon.attacks,
      skill: weapon.skill,
      strength: weapon.strength,
      ap: weapon.ap,
      damage: weapon.damage,
    },
  }
}

// ── Helpers ─────────────────────────────────────────────────────

function mapWeaponFromDb(row: any): WeaponTemplate {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    stats: row.stats || {},
    gameSystemId: row.game_system_id || undefined,
    createdAt: row.created_at ? new Date(row.created_at) : undefined,
  }
}
