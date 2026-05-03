import { useState } from 'react'

interface GameStats {
  currentTurn: number
  playerOnePoints: number
  playerTwoPoints: number
  notes: string
}

function GameTracker() {
  const [stats, setStats] = useState<GameStats>({
    currentTurn: 1,
    playerOnePoints: 0,
    playerTwoPoints: 0,
    notes: '',
  })

  const nextTurn = () => {
    setStats({ ...stats, currentTurn: stats.currentTurn + 1 })
  }

  const prevTurn = () => {
    if (stats.currentTurn > 1) {
      setStats({ ...stats, currentTurn: stats.currentTurn - 1 })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white pb-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">📊 Game Tracker</h1>
        
        {/* Turn Counter */}
        <div className="bg-slate-700 rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Current Turn</p>
            <p className="text-6xl font-bold mb-4">{stats.currentTurn}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={prevTurn}
                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold transition"
              >
                ← Previous
              </button>
              <button
                onClick={nextTurn}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-900 rounded-lg p-6">
            <p className="text-sm text-blue-300 uppercase tracking-wide mb-2">Player 1</p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-3xl font-bold">{stats.playerOnePoints}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setStats({ ...stats, playerOnePoints: stats.playerOnePoints + 1 })}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => setStats({ ...stats, playerOnePoints: Math.max(0, stats.playerOnePoints - 1) })}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                >
                  −
                </button>
              </div>
            </div>
            <p className="text-xs text-blue-300">Kill Points</p>
          </div>

          <div className="bg-red-900 rounded-lg p-6">
            <p className="text-sm text-red-300 uppercase tracking-wide mb-2">Player 2</p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-3xl font-bold">{stats.playerTwoPoints}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setStats({ ...stats, playerTwoPoints: stats.playerTwoPoints + 1 })}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => setStats({ ...stats, playerTwoPoints: Math.max(0, stats.playerTwoPoints - 1) })}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  −
                </button>
              </div>
            </div>
            <p className="text-xs text-red-300">Kill Points</p>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-700 rounded-lg p-6">
          <label className="block text-sm font-semibold mb-2">Battle Notes</label>
          <textarea
            value={stats.notes}
            onChange={(e) => setStats({ ...stats, notes: e.target.value })}
            placeholder="Record important events, strategies, or notes..."
            className="w-full h-24 px-4 py-2 rounded bg-slate-600 text-white placeholder-slate-400 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

export default GameTracker
