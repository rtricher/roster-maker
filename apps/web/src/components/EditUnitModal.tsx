import { useState } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'

interface EditUnitModalProps {
  unit: Unit
  onSave: (updates: Partial<Omit<Unit, 'id' | 'currentWounds'>>) => void
  onCancel: () => void
}

export default function EditUnitModal({ unit, onSave, onCancel }: EditUnitModalProps) {
  const [name, setName] = useState(unit.name)
  const [points, setPoints] = useState(unit.points)
  const [count, setCount] = useState(unit.count)
  const [wounds, setWounds] = useState(unit.wounds)
  const [movement, setMovement] = useState(unit.movement)
  const [toughness, setToughness] = useState(unit.toughness)
  const [save, setSave] = useState(unit.save)
  const [leadership, setLeadership] = useState(unit.leadership)
  const [objectiveControl, setObjectiveControl] = useState(unit.objectiveControl)
  const [notes, setNotes] = useState(unit.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      points,
      count,
      wounds,
      movement,
      toughness,
      save,
      leadership,
      objectiveControl,
      notes: notes || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="bg-surface-800 rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto border border-surface-600 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-100 mb-4">Edit Unit</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase">Unit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Models</label>
              <input
                type="number"
                value={count}
                min={1}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Wounds (per model)</label>
              <input
                type="number"
                value={wounds}
                min={1}
                onChange={(e) => setWounds(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Move</label>
              <input
                type="text"
                value={movement}
                onChange={(e) => setMovement(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Toughness</label>
              <input
                type="number"
                value={toughness}
                onChange={(e) => setToughness(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Save</label>
              <input
                type="text"
                value={save}
                onChange={(e) => setSave(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Leadership</label>
              <input
                type="number"
                value={leadership}
                onChange={(e) => setLeadership(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Objective Control</label>
              <input
                type="number"
                value={objectiveControl}
                onChange={(e) => setObjectiveControl(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500 h-20 resize-none"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 rounded text-sm font-medium bg-olive-500 text-white hover:bg-olive-600 disabled:opacity-40 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
