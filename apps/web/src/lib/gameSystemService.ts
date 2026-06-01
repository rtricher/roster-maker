/**
 * Game System Service
 *
 * Game systems are global/shared data — any user can read them.
 */

import { supabase } from './supabase'

export interface GameSystem {
  id: string
  name: string
  unitStatTemplate: StatField[]
  weaponStatTemplate: StatField[]
  roles: GameRole[]
}

export interface StatField {
  key: string
  label: string
  type: 'text' | 'number'
  default?: any
}

export interface GameRole {
  name: string
  icon: string
}

let cachedSystems: GameSystem[] | null = null

export async function getGameSystems(): Promise<GameSystem[]> {
  if (cachedSystems) return cachedSystems

  const { data, error } = await supabase
    .from('game_systems')
    .select('*')
    .order('name')

  if (error) {
    console.error('Failed to load game systems:', error)
    return []
  }

  cachedSystems = data.map((row: any) => ({
    id: row.id,
    name: row.name,
    unitStatTemplate: row.unit_stat_template || [],
    weaponStatTemplate: row.weapon_stat_template || [],
    roles: row.roles || [],
  }))

  return cachedSystems
}

export async function getGameSystemById(id: string): Promise<GameSystem | null> {
  const systems = await getGameSystems()
  return systems.find((s) => s.id === id) || null
}
