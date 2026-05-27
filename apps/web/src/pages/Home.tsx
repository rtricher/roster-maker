import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Roster, Unit } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { getRosters, createRoster, deleteRoster } from '../lib/rosterService'
import { loadUnitLibrary, saveUnitLibrary, removeFromUnitLibrary } from '../lib/storage'
import CreateRosterModal from '../components/CreateRosterModal'
import AddUnitForm from '../components/AddUnitForm'
import EditUnitModal from '../components/EditUnitModal'

type Tab = 'rosters' | 'units'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading: authLoading, signOut } = useAuth()

  const [tab, setTab] = useState<Tab>('rosters')

  // Rosters state
  const [rosters, setRosters] = useState<Roster[]>([])
  const [loadingRosters, setLoadingRosters] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Units state
  const [units, setUnits] = useState<Unit[]>([])
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  useEffect(() => {
    if (authLoading) return
    loadRosters()
    setUnits(loadUnitLibrary())
  }, [user, authLoading])

  const loadRosters = async () => {
    setLoadingRosters(true)
    const data = await getRosters(user)
    setRosters(data)
    setLoadingRosters(false)
  }

  // ── Roster handlers ──
  const handleCreateRoster = async (name: string, faction: string, detachment: string, maxPoints: number) => {
    const roster = await createRoster(user, name, faction, detachment, maxPoints)
    if (roster) {
      setRosters((prev) => [roster, ...prev])
    }
    setShowCreateModal(false)
  }

  const handleDeleteRoster = async (e: React.MouseEvent, rosterId: string) => {
    e.stopPropagation()
    if (!confirm('Delete this roster? This cannot be undone.')) return
    const success = await deleteRoster(user, rosterId)
    if (success) {
      setRosters((prev) => prev.filter((r) => r.id !== rosterId))
    }
  }

  // ── Unit Library handlers ──
  const handleAddUnit = (unit: Unit) => {
    const savedUnit = { ...unit, id: crypto.randomUUID() }
    const updated = [...units, savedUnit]
    setUnits(updated)
    saveUnitLibrary(updated)
    setShowAddUnit(false)
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

  const handleDeleteUnit = (unitId: string) => {
    if (!confirm('Remove this unit from your library?')) return
    removeFromUnitLibrary(unitId)
    setUnits((prev) => prev.filter((u) => u.id !== unitId))
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

      {/* Tabs */}
      <div className="border-b border-surface-600">
        <div className="flex">
          <button
            onClick={() => setTab('rosters')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              tab === 'rosters'
                ? 'text-olive-400 border-b-2 border-olive-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Your Rosters
          </button>
          <button
            onClick={() => setTab('units')}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
              tab === 'units'
                ? 'text-olive-400 border-b-2 border-olive-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Your Units
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {tab === 'rosters' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-200">Rosters</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-lg bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium transition-colors"
              >
                + New Roster
              </button>
            </div>

            {loadingRosters ? (
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
                        onClick={(e) => handleDeleteRoster(e, roster.id)}
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
        )}

        {tab === 'units' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-200">Unit Library</h2>
              <button
                onClick={() => setShowAddUnit(true)}
                className="px-4 py-2 rounded-lg bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium transition-colors"
              >
                + New Unit
              </button>
            </div>

            {units.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No saved units</p>
                <p className="text-sm mt-1">Add units here to reuse them across rosters</p>
                <p className="text-xs text-gray-600 mt-4">
                  💡 Units are saved in your browser's local storage
                </p>
              </div>
            ) : (
              units.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-surface-800 border border-surface-600 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Thumbnail */}
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
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete unit"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRosterModal
          onCreate={handleCreateRoster}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {showAddUnit && (
        <AddUnitForm onAdd={handleAddUnit} onCancel={() => setShowAddUnit(false)} />
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
