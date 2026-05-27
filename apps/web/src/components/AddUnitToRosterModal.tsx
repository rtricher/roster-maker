import { useState } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import { loadUnitLibrary, saveUnitLibrary } from '../lib/storage'
import AddUnitForm from './AddUnitForm'

interface AddUnitToRosterModalProps {
  onAdd: (unit: Unit) => void
  onCancel: () => void
}

type View = 'pick' | 'create'

export default function AddUnitToRosterModal({ onAdd, onCancel }: AddUnitToRosterModalProps) {
  const [view, setView] = useState<View>('pick')
  const [library] = useState<Unit[]>(loadUnitLibrary())

  const handlePickUnit = (unit: Unit) => {
    // Clone the unit — imageUrl comes along from the library
    onAdd({ ...unit, id: crypto.randomUUID(), currentWounds: unit.count * unit.wounds })
  }

  const handleCreateNew = (unit: Unit) => {
    // Save to library (with image if uploaded)
    const savedUnit = { ...unit, id: crypto.randomUUID() }
    const updatedLibrary = [...loadUnitLibrary(), savedUnit]
    saveUnitLibrary(updatedLibrary)
    // Add to roster
    onAdd(savedUnit)
  }

  if (view === 'create') {
    return <AddUnitForm onAdd={handleCreateNew} onCancel={() => setView('pick')} />
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div
        className="bg-surface-800 rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto border border-surface-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-surface-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-100">Add Unit to Roster</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Create new button */}
          <button
            onClick={() => setView('create')}
            className="w-full py-3 rounded-lg border-2 border-dashed border-olive-500/50 text-olive-400 hover:bg-olive-500/10 transition-colors text-sm font-medium"
          >
            + Create New Unit
          </button>

          {/* Library units */}
          {library.length > 0 && (
            <>
              <div className="text-xs text-gray-500 uppercase mt-4 mb-2">From Your Library</div>
              {library.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => handlePickUnit(unit)}
                  className="w-full text-left bg-surface-700 hover:bg-surface-600 border border-surface-600 rounded-lg p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {unit.imageUrl ? (
                      <img
                        src={unit.imageUrl}
                        alt={unit.name}
                        className="w-10 h-10 rounded-lg object-cover border border-surface-600 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-800 border border-surface-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 text-sm">⚔</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-100 text-sm truncate">{unit.name}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-400">{unit.points} pts</span>
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
                    <span className="text-olive-400 text-xs font-medium">+ Add</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {library.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No units in your library yet</p>
              <p className="text-xs mt-1">Create one above — it'll be saved for reuse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
