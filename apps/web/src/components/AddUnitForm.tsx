import { useState } from 'react'
import type { Unit } from '../../../packages/shared/src/types'
import { generateId } from '../../../packages/shared/src/utils'

interface AddUnitFormProps {
  onAdd: (unit: Unit) => void
  onCancel: () => void
}

export default function AddUnitForm({ onAdd, onCancel }: AddUnitFormProps) {
  const [name, setName] = useState('')
  const [points, setPoints] = useState(0)
  const [count, setCount] = useState(1)
  const [wounds, setWounds] = useState(1)
  const [movement, setMovement] = useState('6"')
  const [toughness, setToughness] = useState(4)
  const [save, setSave] = useState('3+')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const unit: Unit = {
      id: generateId(),
      name: name.trim(),
      points,
      count,
      wounds,
      movement,
      toughness,
      save,
      leadership: 6,
      objectiveControl: 1,
      currentWounds: count,
      notes: notes || undefined,
      abilities: [],
      weapons: [],
    }

    onAdd(unit)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="bg-surface-800 rounded-lg max-w-md w-full border border-surface-600 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-100 mb-4">Add Unit</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase">Unit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              placeholder="e.g. Intercessor Squad"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            Add Unit
          </button>
        </div>
      </form>
    </div>
  )
}
