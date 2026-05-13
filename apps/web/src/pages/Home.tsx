import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ROSTERS } from '../data/mockData'
import type { Roster } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const [rosters] = useState<Roster[]>(MOCK_ROSTERS)

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100">
      {/* Header */}
      <div className="bg-surface-800 border-b border-surface-600 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">⚔ Roster Maker</h1>
            <p className="text-sm text-gray-400 mt-1">Tabletop Wargame Roster Builder & Game Tracker</p>
          </div>
          <div className="text-right">
            {loading ? (
              <span className="text-xs text-gray-500">...</span>
            ) : user ? (
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-olive-400">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-gray-300 text-sm transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Roster list */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">Your Rosters</h2>
          <button className="px-4 py-2 rounded-lg bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium transition-colors">
            + New Roster
          </button>
        </div>

        {rosters.map((roster) => (
          <button
            key={roster.id}
            onClick={() => navigate(`/builder?id=${roster.id}`)}
            className="w-full text-left bg-surface-800 hover:bg-surface-700 border border-surface-600 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-100">{roster.name}</h3>
                <div className="text-sm text-olive-400">{roster.faction}</div>
                {roster.detachment && (
                  <div className="text-xs text-gray-500">{roster.detachment}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-400">{roster.totalPoints}</div>
                <div className="text-xs text-gray-500">/ {roster.maxPoints} pts</div>
                <div className="text-xs text-gray-500">{roster.units.length} unit{roster.units.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </button>
        ))}

        {rosters.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No rosters yet</p>
            <p className="text-sm mt-1">Create your first roster to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
