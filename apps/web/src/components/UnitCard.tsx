import { useState } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import UnitDetailModal from './UnitDetailModal'

interface UnitCardProps {
  unit: Unit
  modelWounds: number[]
  onUpdateModelWounds: (unitId: string, modelWounds: number[]) => void
  onRemove?: () => void
  onEdit?: () => void
  onImageChange?: (unitId: string, imageUrl: string | undefined) => void
}

export default function UnitCard({ unit, modelWounds, onUpdateModelWounds, onRemove, onEdit, onImageChange }: UnitCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Compute display values
  const modelsAlive = modelWounds.filter((w) => w > 0).length
  const totalWoundsRemaining = modelWounds.reduce((sum, w) => sum + w, 0)
  const totalWoundsMax = unit.count * unit.wounds
  const isMultiModel = unit.count > 1
  const isMultiWound = unit.wounds > 1

  // Model counter: kill/revive last/first
  const decrementModels = () => {
    const next = [...modelWounds]
    for (let i = next.length - 1; i >= 0; i--) {
      if (next[i] > 0) { next[i] = 0; break }
    }
    onUpdateModelWounds(unit.id, next)
  }
  const incrementModels = () => {
    const next = [...modelWounds]
    for (let i = 0; i < next.length; i++) {
      if (next[i] === 0) { next[i] = unit.wounds; break }
    }
    onUpdateModelWounds(unit.id, next)
  }

  // Wound counter: damage/heal the first alive model
  const decrementWounds = () => {
    const next = [...modelWounds]
    for (let i = 0; i < next.length; i++) {
      if (next[i] > 0) { next[i]--; break }
    }
    onUpdateModelWounds(unit.id, next)
  }
  const incrementWounds = () => {
    const next = [...modelWounds]
    // Heal first model that's below max but above 0 (or exactly 0 for single model)
    for (let i = 0; i < next.length; i++) {
      if (next[i] < unit.wounds && (isMultiModel ? next[i] > 0 : true)) {
        next[i]++; break
      }
    }
    onUpdateModelWounds(unit.id, next)
  }

  return (
    <>
      <div className="bg-surface-800 rounded-lg border border-surface-600 hover:border-surface-600/80 transition-colors">
        {/* Tappable header area */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-3">
            {/* Thumbnail */}
            {unit.imageUrl ? (
              <img
                src={unit.imageUrl}
                alt={unit.name}
                className="w-15 h-15 rounded-lg object-cover border border-surface-600 flex-shrink-0"
              />
            ) : (
              <div className="w-15 h-15 rounded-lg bg-surface-700 border border-surface-600 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 text-sm">⚔</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-100 truncate">{unit.name} <span className="text-amber-400 font-semibold">{unit.points} pts</span></h3>
                  <div>
                    {/* Wound counters — ALWAYS visible */}
                    <div className="flex items-center gap-4 mt-3" onClick={(e) => e.stopPropagation()}>
                      {/* Model counter (only if multi-model) */}
                      {isMultiModel && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 uppercase w-12">Models</span>
                          <button
                            onClick={decrementModels}
                            className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
                          >−</button>
                          <span className={`text-sm font-bold min-w-[2.5rem] text-center ${modelsAlive === 0 ? 'text-red-400' : 'text-gray-200'}`}>
                            {modelsAlive}/{unit.count}
                          </span>
                          <button
                            onClick={incrementModels}
                            className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
                          >+</button>
                        </div>
                      )}
          
                      {/* Wound counter (always shown — total wounds for unit) */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 uppercase w-12">Wounds</span>
                        <button
                          onClick={decrementWounds}
                          className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
                        >−</button>
                        <span className={`text-sm font-bold min-w-[2.5rem] text-center ${totalWoundsRemaining === 0 ? 'text-red-400' : 'text-gray-200'}`}>
                          {totalWoundsRemaining}/{totalWoundsMax}
                        </span>
                        <button
                          onClick={incrementWounds}
                          className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-gray-200 transition-colors"
                    title="More details"
                  >
                    ⋮
                  </button>
                  {onRemove && (
                    <button
                      onClick={onRemove}
                      className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete unit"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Expand indicator */}
          <div className="flex justify-center mt-2">
            <span className="text-[10px] text-gray-600">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-surface-700 pt-3">
            {/* Stats and Weapons — single table for alignment */}
            <table className="w-full">
              <tbody>
                {/* Base Stats row */}
                <tr>
                  <td className="text-[10px] text-gray-500 uppercase font-semibold pr-3 whitespace-nowrap">Base Stats</td>
                  <td className="w-full">
                    <div className="flex items-center gap-1 overflow-x-auto">
                      {[
                        { label: 'M', value: unit.movement },
                        { label: 'T', value: unit.toughness },
                        { label: 'SV', value: unit.save },
                        { label: 'W', value: unit.wounds },
                        { label: 'LD', value: unit.leadership },
                        { label: 'OC', value: unit.objectiveControl },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-surface-900 rounded px-2 py-1 text-center flex-shrink-0">
                          <div className="text-[9px] text-gray-500 uppercase leading-tight">{stat.label}</div>
                          <div className="text-sm font-bold text-gray-200 leading-tight">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>

                {/* Weapon rows */}
                {unit.weapons.map((weapon, idx) => (
                  <tr key={idx}>
                    <td className="text-xs text-gray-200 font-medium pr-3 whitespace-nowrap">
                      {weapon.name}
                      <span className={`ml-2 px-1 py-0.5 rounded text-[9px] ${
                        weapon.type === 'ranged' ? 'bg-blue-900/40 text-blue-400' : 'bg-red-900/40 text-red-400'
                      }`}>
                        {weapon.type === 'ranged' ? 'Ranged' : 'Melee'}
                      </span>
                    </td>
                    <td className="w-full">
                      <div className="flex items-center gap-1 overflow-x-auto">
                        {[
                          { label: 'R', value: weapon.range || '—' },
                          { label: 'A', value: weapon.attacks },
                          { label: weapon.type === 'ranged' ? 'BS' : 'WS', value: weapon.type === 'ranged' ? (weapon.skill) : (weapon.skill) },
                          { label: 'S', value: weapon.strength },
                          { label: 'AP', value: weapon.ap },
                          { label: 'D', value: weapon.damage },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-surface-900 rounded px-2 py-1 text-center flex-shrink-0">
                            <div className="text-[9px] text-gray-500 uppercase leading-tight">{stat.label}</div>
                            <div className="text-sm font-bold text-gray-200 leading-tight">{stat.value}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Abilities */}
            {unit.abilities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {unit.abilities.map((ability) => (
                  <span key={ability} className="text-[11px] bg-olive-600/30 text-olive-400 px-2 py-0.5 rounded">
                    {ability}
                  </span>
                ))}
              </div>
            )}

            {/* Notes */}
            {unit.notes && (
              <div className="bg-surface-900 rounded p-2">
                <span className="text-[10px] text-gray-500 uppercase">Notes: </span>
                <span className="text-xs text-gray-300">{unit.notes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {modalOpen && (
        <UnitDetailModal
          unit={unit}
          onClose={() => setModalOpen(false)}
          onEdit={onEdit}
          onImageChange={onImageChange ? (url) => onImageChange(unit.id, url) : undefined}
        />
      )}
    </>
  )
}
