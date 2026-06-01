import { useState, useEffect } from 'react'
import type { Weapon } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { getWeaponTemplates, createWeaponTemplate, templateToUnitWeapon, unitWeaponToTemplate } from '../lib/weaponService'
import type { WeaponTemplate } from '../lib/weaponService'
import WeaponForm from './WeaponForm'

interface WeaponManagerProps {
  weapons: Weapon[]
  onChange: (weapons: Weapon[]) => void
}

type View = 'list' | 'add' | 'edit' | 'pick'

export default function WeaponManager({ weapons, onChange }: WeaponManagerProps) {
  const { user } = useAuth()
  const [view, setView] = useState<View>('list')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [library, setLibrary] = useState<WeaponTemplate[]>([])

  useEffect(() => {
    loadLibrary()
  }, [user])

  const loadLibrary = async () => {
    const templates = await getWeaponTemplates(user)
    setLibrary(templates)
  }

  const handleAddWeapon = async (weapon: Weapon) => {
    onChange([...weapons, weapon])
    // Also save to weapon library
    await createWeaponTemplate(user, unitWeaponToTemplate(weapon))
    await loadLibrary()
    setView('list')
  }

  const handleEditWeapon = (weapon: Weapon) => {
    if (editingIndex === null) return
    const updated = [...weapons]
    updated[editingIndex] = weapon
    onChange(updated)
    setEditingIndex(null)
    setView('list')
  }

  const handleRemoveWeapon = (index: number) => {
    onChange(weapons.filter((_, i) => i !== index))
  }

  const handlePickFromLibrary = (template: WeaponTemplate) => {
    onChange([...weapons, templateToUnitWeapon(template)])
    setView('list')
  }

  if (view === 'add') {
    return (
      <div>
        <h4 className="text-xs text-gray-500 uppercase mb-2">Add Weapon</h4>
        <WeaponForm onSave={handleAddWeapon} onCancel={() => setView('list')} />
      </div>
    )
  }

  if (view === 'edit' && editingIndex !== null) {
    return (
      <div>
        <h4 className="text-xs text-gray-500 uppercase mb-2">Edit Weapon</h4>
        <WeaponForm
          weapon={weapons[editingIndex]}
          onSave={handleEditWeapon}
          onCancel={() => { setEditingIndex(null); setView('list') }}
        />
      </div>
    )
  }

  if (view === 'pick') {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs text-gray-500 uppercase">Pick from Library</h4>
          <button onClick={() => setView('list')} className="text-xs text-gray-400 hover:text-gray-200">
            ← Back
          </button>
        </div>
        {library.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-xs">
            <p>No weapons in your library yet</p>
            <button
              onClick={() => setView('add')}
              className="text-olive-400 mt-1"
            >
              Create one
            </button>
          </div>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {library.map((template) => (
              <button
                key={template.id}
                onClick={() => handlePickFromLibrary(template)}
                className="w-full text-left bg-surface-700 hover:bg-surface-600 rounded px-3 py-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-200 font-medium">{template.name}</span>
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${
                      template.type === 'ranged' ? 'bg-blue-900/40 text-blue-400' : 'bg-red-900/40 text-red-400'
                    }`}>
                      {template.type}
                    </span>
                  </div>
                  <span className="text-olive-400 text-xs">+ Add</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default: list view
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs text-gray-500 uppercase">Weapons ({weapons.length})</h4>
        <div className="flex gap-1">
          {library.length > 0 && (
            <button
              onClick={() => setView('pick')}
              className="px-2 py-1 rounded text-[10px] font-medium bg-surface-600 text-gray-400 hover:text-gray-200 transition-colors"
            >
              From Library
            </button>
          )}
          <button
            onClick={() => setView('add')}
            className="px-2 py-1 rounded text-[10px] font-medium bg-olive-600 text-white hover:bg-olive-500 transition-colors"
          >
            + New
          </button>
        </div>
      </div>

      {weapons.length === 0 ? (
        <div className="text-center py-3 text-gray-600 text-xs">
          No weapons added
        </div>
      ) : (
        <div className="space-y-1">
          {weapons.map((weapon, idx) => (
            <div key={idx} className="flex items-center justify-between bg-surface-700/50 rounded px-3 py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-200 font-medium truncate">{weapon.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                    weapon.type === 'ranged' ? 'bg-blue-900/40 text-blue-400' : 'bg-red-900/40 text-red-400'
                  }`}>
                    {weapon.type}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {weapon.range} · A:{weapon.attacks} · {weapon.type === 'ranged' ? 'BS' : 'WS'}:{weapon.skill} · S:{weapon.strength} · AP:{weapon.ap} · D:{weapon.damage}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <button
                  onClick={() => { setEditingIndex(idx); setView('edit') }}
                  className="px-1.5 py-0.5 rounded text-[10px] text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleRemoveWeapon(idx)}
                  className="px-1.5 py-0.5 rounded text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
