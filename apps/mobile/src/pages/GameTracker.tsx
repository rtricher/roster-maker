import { useState } from 'react'

export default function GameTracker() {
  const [turn, setTurn] = useState(1)
  const [cp, setCp] = useState(0)
  const [p1Score, setP1Score] = useState(0)
  const [p2Score, setP2Score] = useState(0)

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-surface-800 border-b border-surface-600 px-4 py-4 text-center">
        <h1 className="text-xl font-bold">⚔ Game Tracker</h1>
        <p className="text-xs text-gray-500 mt-1">Roster Maker</p>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Turn & CP */}
        <div className="grid grid-cols-2 gap-4">
          <CounterBlock label="Turn" value={turn} onChange={setTurn} min={1} max={5} />
          <CounterBlock label="Command Points" value={cp} onChange={setCp} min={0} max={20} />
        </div>

        {/* Scores */}
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
          <h2 className="text-sm text-gray-500 uppercase text-center mb-4">Victory Points</h2>
          <div className="grid grid-cols-2 gap-4">
            <CounterBlock label="Player 1" value={p1Score} onChange={setP1Score} min={0} max={100} color="olive" />
            <CounterBlock label="Player 2" value={p2Score} onChange={setP2Score} min={0} max={100} color="amber" />
          </div>
        </div>

        {/* Placeholder sections */}
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4 text-center text-gray-500 text-sm">
          Battle log & unit tracking coming soon
        </div>
      </div>
    </div>
  )
}

function CounterBlock({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  color = 'amber',
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  color?: 'amber' | 'olive'
}) {
  const colorClass = color === 'olive' ? 'text-olive-400' : 'text-amber-400'

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-500 uppercase mb-2">{label}</div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-full bg-surface-700 hover:bg-surface-600 text-gray-300 text-lg font-bold transition-colors"
        >
          −
        </button>
        <span className={`text-3xl font-bold ${colorClass} w-12 text-center`}>{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-full bg-surface-700 hover:bg-surface-600 text-gray-300 text-lg font-bold transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
