import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Roster } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { getRosters, createRoster, deleteRoster } from '../lib/rosterService'
import CreateRosterModal from '../components/CreateRosterModal'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading: authLoading, signOut } = useAuth()
  const [rosters, setRosters] = useState<Roster[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (authLoading) return
    loadRosters()
  }, [user, authLoading])

  const loadRosters = async () => {
    setLoading(true)
    const data = await getRosters(user)
    setRosters(data)
    setLoading(false)
  }

  const handleCreate = async (name: string, faction: string, detachment: string, maxPoints: number) => {
    const roster = await createRoster(user, name, faction, detachment, maxPoints)
    if (roster) {
      setRosters((prev) => [roster, ...prev])
    }
    setShowCreateModal(false)
  }

  const handleDelete = async (e: React.MouseEvent, rosterId: string) => {
    e.stopPropagation()
    if (!confirm('Delete this roster? This cannot be undone.')) return
    const success = await deleteRoster(user, rosterId)
    if (success) {
      setRosters((prev) => prev.filter((r) => r.id !== rosterId))
    }
  }

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
            {authLoading ? (
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
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-gray-300 text-sm transition-colors"
                >
                  Sign In
                </button>
                <span className="text-[10px] text-gray-600">Guest mode — data saved locally</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Roster list */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">Your Rosters</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium transition-colors"
          >
            + New Roster
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading rosters...</div>
        ) : rosters.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No rosters yet</p>
            <p className="text-sm mt-1">Create your first roster to get started</p>
            {!user && (
              <p className="text-xs text-gray-600 mt-4">
                💡 Your rosters are saved in this browser. Sign in to sync across devices.
              </p>
            )}
          </div>
        ) : (
          rosters.map((roster) => (
            <div
              key={roster.id}
              onClick={() => navigate(`/builder?id=${roster.id}`)}
              className="w-full text-left bg-surface-800 hover:bg-surface-700 border border-surface-600 rounded-lg p-4 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-100">{roster.name}</h3>
                  <div className="text-sm text-olive-400">{roster.faction || 'No faction'}</div>
                  {roster.detachment && (
                    <div className="text-xs text-gray-500">{roster.detachment}</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-400">{roster.totalPoints}</div>
                    <div className="text-xs text-gray-500">/ {roster.maxPoints} pts</div>
                    <div className="text-xs text-gray-500">{roster.units.length} unit{roster.units.length !== 1 ? 's' : ''}</div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, roster.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                    title="Delete roster"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateRosterModal
          onCreate={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
