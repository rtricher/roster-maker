import { useState } from 'react'
import type { Weapon } from '../../../../packages/shared/src/types'

interface WeaponFormProps {
  weapon?: Weapon
  onSave: (weapon: Weapon) => void
  onCancel: () => void
}

export default function WeaponForm({ weapon, onSave, onCancel }: WeaponFormProps) {
  const [name, setName] = useState(weapon?.name || '')
  const [type, setType] = useState<'ranged' | 'melee'>(weapon?.type || 'ranged')
  const [range, setRange] = useState(weapon?.range || (weapon?.type === 'melee' ? 'Melee' : '24"'))
  const [attacks, setAttacks] = useState(weapon?.attacks || '1')
  const [skill, setSkill] = useState(weapon?.skill || '3+')
  const [strength, setStrength] = useState(weapon?.strength || 4)
  const [ap, setAp] = useState(weapon?.ap || 0)
  const [damage, setDamage] = useState(weapon?.damage || '1')

  const handleTypeChange = (newType: 'ranged' | 'melee') => {
    setType(newType)
    if (newType === 'melee' && range !== 'Melee') setRange('Melee')
    if (newType === 'ranged' && range === 'Melee') setRange('24"')
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      type,
      range,
      attacks,
      skill,
      strength,
      ap,
      damage,
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-500 uppercase">Weapon Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          placeholder="e.g. Bolt Rifle"
          autoFocus
        />
      </div>

      {/* Type toggle */}
      <div>
        <label className="text-xs text-gray-500 uppercase">Type</label>
        <div className="flex gap-2 mt-1">
          <button
            type="button"
            onClick={() => handleTypeChange('ranged')}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              type === 'ranged' ? 'bg-olive-600 text-white' : 'bg-surface-700 text-gray-400'
            }`}
          >
            Ranged
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('melee')}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              type === 'melee' ? 'bg-olive-600 text-white' : 'bg-surface-700 text-gray-400'
            }`}
          >
            Melee
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-gray-500 uppercase">Range</label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full mt-0.5 bg-surface-900 border border-surface-600 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase">Attacks</label>
          <input
            type="text"
            value={attacks}
            onChange={(e) => setAttacks(e.target.value)}
            className="w-full mt-0.5 bg-surface-900 border border-surface-600 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase">{type === 'ranged' ? 'BS' : 'WS'}</label>
          <input
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full mt-0.5 bg-surface-900 border border-surface-600 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase">Strength</label>
          <input
            type="number"
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-full mt-0.5 bg-surface-900 border border-surface-600 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase">AP</label>
          <input
            type="number"
            value={ap}
            onChange={(e) => setAp(Number(e.target.value))}
            className="w-full mt-0.5 bg-surface-900 border border-surface-600 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase">Damage</label>
          <input
            type="text"
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
            className="w-full mt-0.5 bg-surface-900 border border-surface-600 rounded px-2 py-1.5 text-gray-100 text-sm focus:outline-none focus:border-olive-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded text-xs text-gray-400 hover:text-gray-200 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className="px-3 py-1.5 rounded text-xs font-medium bg-olive-500 text-white hover:bg-olive-600 disabled:opacity-40 transition-colors"
        >
          {weapon ? 'Update Weapon' : 'Add Weapon'}
        </button>
      </div>
    </div>
  )
}
