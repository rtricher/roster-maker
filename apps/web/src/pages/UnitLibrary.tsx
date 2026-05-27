import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Unit } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { loadUnitLibrary, saveUnitLibrary, removeFromUnitLibrary } from '../lib/storage'
import AddUnitForm from '../components/AddUnitForm'
import EditUnitModal from '../components/EditUnitModal'

export default function UnitLibrary() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [units, setUnits] = useState<Unit[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  useEffect(() => {
    setUnits(loadUnitLibrary())
  }, [])

  const handleAddUnit = (unit: Unit) => {
    const savedUnit = { ...unit, id: crypto.randomUUID() }
    const updated = [...units, savedUnit]
    setUnits(updated)
    saveUnitLibrary(updated)
    setShowAddForm(false)
  }

  const handleEditUnit = (updates: Partial<Omit<Unit, 'id' | 'currentWounds'>>) => {
    if (!editingUnit) return
    const updated = units.map((u) =>
      u.id === editingUnit.id ? { ...u, ...updates } : u
    )
    setUnits(updated)
    saveUnitLibrary(updated)
    setEditingUnit(null)
  }

  const handleDelete = (unitId: string) => {
    if (!confirm('Remove this unit from your library?')) return
    removeFromUnitLibrary(unitId)
    setUnits((prev) => prev.filter((u) => u.id !== unitId))
  }

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur border-b border-surface-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-200 text-lg">
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-100">Unit Library</h1>
            <p className="text-xs text-gray-500">Your saved units — add them to any roster</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 rounded-lg bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium transition-colors"
          >
            + Add Unit
          </button>
        </div>
      </div>

      {/* Unit List */}
      <div className="p-4 space-y-3">
        {units.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No saved units</p>
            <p className="text-sm mt-1">Add units here to quickly reuse them across rosters</p>
            <p className="text-xs text-gray-600 mt-4">
              💡 Units you create here are saved in your browser's local storage
            </p>
          </div>
        )}

        {units.map((unit) => (
          <div
            key={unit.id}
            className="bg-surface-800 border border-surface-600 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Thumbnail placeholder */}
                {unit.imageUrl ? (
                  <img
                    src={unit.imageUrl}
                    alt={unit.name}
                    className="w-12 h-12 rounded-lg object-cover border border-surface-600 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-surface-700 border border-surface-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-lg">⚔</span>
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-100 truncate">{unit.name}</h3>
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
                  {unit.notes && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{unit.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setEditingUnit(unit)}
                  className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Edit unit"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(unit.id)}
                  className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete unit"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <AddUnitForm onAdd={handleAddUnit} onCancel={() => setShowAddForm(false)} />
      )}

      {editingUnit && (
        <EditUnitModal
          unit={editingUnit}
          onSave={handleEditUnit}
          onCancel={() => setEditingUnit(null)}
        />
      )}
    </div>
  )
}
