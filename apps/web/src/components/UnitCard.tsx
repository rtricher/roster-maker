import { useState } from 'react'
import type { Unit } from '../../../packages/shared/src/types'
import LifeCounter from './LifeCounter'
import StatsDropdown from './StatsDropdown'
import UnitDetailModal from './UnitDetailModal'

interface UnitCardProps {
  unit: Unit
  onUpdateWounds: (unitId: string, newWounds: number) => void
}

export default function UnitCard({ unit, onUpdateWounds }: UnitCardProps) {
  const [statsOpen, setStatsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="bg-surface-800 rounded-lg p-4 border border-surface-600 hover:border-surface-600/80 transition-colors">
        {/* Top row: Name, points, actions */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-100 truncate">{unit.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-400 font-semibold">{unit.points} pts</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-400">{unit.count} model{unit.count !== 1 ? 's' : ''}</span>
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
            >
              More
            </button>
          </div>
        </div>

        {/* Life counter */}
        <div className="mb-1">
          <div className="text-[10px] text-gray-500 uppercase mb-1">
            Models Remaining: {unit.currentWounds}/{unit.count}
          </div>
          <LifeCounter
            total={unit.count}
            current={unit.currentWounds}
            onChange={(newValue) => onUpdateWounds(unit.id, newValue)}
          />
        </div>

        {/* Expandable stats */}
        <StatsDropdown unit={unit} isOpen={statsOpen} />
      </div>

      {/* Detail modal */}
      {modalOpen && <UnitDetailModal unit={unit} onClose={() => setModalOpen(false)} />}
    </>
  )
}
