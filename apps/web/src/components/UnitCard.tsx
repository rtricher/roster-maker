import { useState } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import WoundTracker from './WoundTracker'
import StatsDropdown from './StatsDropdown'
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
  const [statsOpen, setStatsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="bg-surface-800 rounded-lg p-4 border border-surface-600 hover:border-surface-600/80 transition-colors">
        {/* Top row: Thumbnail, Name, points, actions */}
        <div className="flex items-start gap-3 mb-2">
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
            <h3 className="text-base font-bold text-gray-100 truncate">{unit.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-400 font-semibold">{unit.points} pts</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400">{unit.count} model{unit.count !== 1 ? 's' : ''}</span>
              {unit.wounds > 1 && (
                <>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-400">{unit.wounds}W each</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setStatsOpen(!statsOpen)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                statsOpen
                  ? 'bg-olive-600 text-white'
                  : 'bg-surface-600 text-gray-400 hover:text-gray-200'
              }`}
            >
              {statsOpen ? '▲ Stats' : '▼ Stats'}
            </button>
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

        {/* Wound tracker */}
        <div className="mb-1">
          <WoundTracker
            modelCount={unit.count}
            woundsPerModel={unit.wounds}
            modelWounds={modelWounds}
            onChange={(newWounds) => onUpdateModelWounds(unit.id, newWounds)}
          />
        </div>

        {/* Expandable stats */}
        <StatsDropdown unit={unit} isOpen={statsOpen} />
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
