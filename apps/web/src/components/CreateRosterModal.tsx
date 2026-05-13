import { useState } from 'react'

interface CreateRosterModalProps {
  onCreate: (name: string, faction: string, detachment: string, maxPoints: number) => void
  onCancel: () => void
}

export default function CreateRosterModal({ onCancel, onCreate }: CreateRosterModalProps) {
  const [name, setName] = useState('')
  const [faction, setFaction] = useState('')
  const [detachment, setDetachment] = useState('')
  const [maxPoints, setMaxPoints] = useState(2000)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), faction.trim(), detachment.trim(), maxPoints)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="bg-surface-800 rounded-lg max-w-md w-full border border-surface-600 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-100 mb-4">Create New Roster</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase">Roster Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              placeholder="e.g. Ultramarines Strike Force"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Faction / Army</label>
            <input
              type="text"
              value={faction}
              onChange={(e) => setFaction(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              placeholder="e.g. Adeptus Astartes, Orks, D&D Party..."
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Detachment / Subfaction</label>
            <input
              type="text"
              value={detachment}
              onChange={(e) => setDetachment(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              placeholder="e.g. Gladius Task Force (optional)"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Max Points</label>
            <input
              type="number"
              value={maxPoints}
              onChange={(e) => setMaxPoints(Number(e.target.value))}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
            />
            <p className="text-xs text-gray-600 mt-1">Standard game sizes: 500 / 1000 / 2000</p>
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
            Create Roster
          </button>
        </div>
      </form>
    </div>
  )
}
