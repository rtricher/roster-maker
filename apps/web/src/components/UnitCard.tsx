import { useState } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import WoundTracker from './WoundTracker'
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
                className="w-10 h-10 rounded-lg object-cover border border-surface-600 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-surface-700 border border-surface-600 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 text-sm">⚔</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-100 truncate">{unit.name}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-400 font-semibold">{unit.points} pts</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">{unit.count} model{unit.count !== 1 ? 's' : ''}</span>
                    {unit.wounds > 1 && (
                      <>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-400">{unit.wounds}W</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons — stop propagation so they don't toggle expand */}
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
            <span className="text-[10px] text-gray-600">{expanded ? '▲ tap to collapse' : '▼ tap to expand'}</span>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-surface-700 pt-3">
            {/* Wound tracker */}
            <div onClick={(e) => e.stopPropagation()}>
              <WoundTracker
                modelCount={unit.count}
                woundsPerModel={unit.wounds}
                modelWounds={modelWounds}
                onChange={(newWounds) => onUpdateModelWounds(unit.id, newWounds)}
              />
            </div>

            {/* Stats — single line */}
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
