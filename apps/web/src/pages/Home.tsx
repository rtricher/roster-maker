import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Roster, Unit } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { getRosters, createRoster, deleteRoster } from '../lib/rosterService'
import { loadUnitLibrary, saveUnitLibrary, removeFromUnitLibrary } from '../lib/storage'
import { hasGuestData, wasImportDismissed, dismissImport, importGuestRosters, clearGuestData } from '../lib/guestImport'
import { uploadUnitImage } from '../lib/storageService'
import CreateRosterModal from '../components/CreateRosterModal'
import AddUnitForm from '../components/AddUnitForm'
import EditUnitModal from '../components/EditUnitModal'
import ImportGuestDataModal from '../components/ImportGuestDataModal'

type Tab = 'rosters' | 'units'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading: authLoading, signOut } = useAuth()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imageTargetUnit, setImageTargetUnit] = useState<string | null>(null)

  const [tab, setTab] = useState<Tab>('rosters')

  // Rosters state
  const [rosters, setRosters] = useState<Roster[]>([])
  const [loadingRosters, setLoadingRosters] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Units state
  const [units, setUnits] = useState<Unit[]>([])
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null)

  // Import state
  const [showImport, setShowImport] = useState(false)
  const [guestCounts, setGuestCounts] = useState({ rosterCount: 0, unitCount: 0 })

  useEffect(() => {
    if (authLoading) return
    loadRosters()
    setUnits(loadUnitLibrary())

    if (user && !wasImportDismissed()) {
      const counts = hasGuestData()
      if (counts.rosterCount > 0 || counts.unitCount > 0) {
        setGuestCounts(counts)
        setShowImport(true)
      }
    }
  }, [user, authLoading])

  const loadRosters = async () => {
    setLoadingRosters(true)
    const data = await getRosters(user)
    setRosters(data)
    setLoadingRosters(false)
  }

  // ── Import handlers ──
  const handleImport = async (options: { rosters: boolean; units: boolean }) => {
    if (!user) return
    if (options.rosters) {
      await importGuestRosters(user)
      const data = await getRosters(user)
      setRosters(data)
    }
    if (options.rosters && !options.units) {
      clearGuestData()
    }
    dismissImport()
    setShowImport(false)
  }

  const handleSkipImport = () => {
    dismissImport()
    setShowImport(false)
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

  const handleDeleteUnit = (e: React.MouseEvent, unitId: string) => {
    e.stopPropagation()
    if (!confirm('Remove this unit from your library?')) return
    removeFromUnitLibrary(unitId)
    setUnits((prev) => prev.filter((u) => u.id !== unitId))
  }

  const handleThumbnailClick = (e: React.MouseEvent, unitId: string) => {
    e.stopPropagation()
    if (!user) return
    setImageTargetUnit(unitId)
    imageInputRef.current?.click()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !imageTargetUnit) return

    const url = await uploadUnitImage(user.id, imageTargetUnit, file)
    if (url) {
      const updated = units.map((u) =>
        u.id === imageTargetUnit ? { ...u, imageUrl: url } : u
      )
      setUnits(updated)
      saveUnitLibrary(updated)
    }
    setImageTargetUnit(null)
    e.target.value = ''
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
              units.map((unit) => {
                const isExpanded = expandedUnitId === unit.id
                return (
                  <div
                    key={unit.id}
                    className="bg-surface-800 border border-surface-600 rounded-lg"
                  >
                    {/* Tappable header */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Tappable thumbnail */}
                          <button
                            onClick={(e) => handleThumbnailClick(e, unit.id)}
                            className="flex-shrink-0 group relative"
                            title={user ? 'Click to upload image' : 'Sign in to upload images'}
                          >
                            {unit.imageUrl ? (
                              <img
                                src={unit.imageUrl}
                                alt={unit.name}
                                className="w-12 h-12 rounded-lg object-cover border border-surface-600 group-hover:border-olive-500 transition-colors"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-surface-700 border border-surface-600 group-hover:border-olive-500 flex items-center justify-center transition-colors">
                                <span className="text-gray-600 group-hover:text-olive-400 text-lg transition-colors">
                                  {user ? '📷' : '⚔'}
                                </span>
                              </div>
                            )}
                            {user && (
                              <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-[10px]">📷</span>
                              </div>
                            )}
                          </button>

                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-100 truncate">{unit.name} <span className="text-amber-400 font-semibold">{unit.points} pts</span> </h3>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400">{unit.count} model{unit.count !== 1 ? 's' : ''}</span>
                              {unit.wounds > 1 && (
                                <>
                                  <span className="text-gray-500">·</span>
                                  <span className="text-gray-400">{unit.wounds}W</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setEditingUnit(unit)}
                            className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-gray-200 transition-colors"
                            title="Edit unit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={(e) => handleDeleteUnit(e, unit.id)}
                            className="px-2 py-1 rounded text-xs font-medium bg-surface-600 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete unit"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      {/* Expand indicator */}
                      <div className="flex justify-center mt-2">
                        <span className="text-[10px] text-gray-600">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Expanded details — same table layout as UnitCard */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-surface-700 pt-3">
                        {/* Stats and Weapons — single table for alignment */}
                        <table className="w-full">
                          <tbody>
                            {/* Base Stats row */}
                            <tr>
                              <td className="text-[10px] text-gray-500 uppercase font-semibold pr-3 whitespace-nowrap">Base Stats</td>
                              <td className="w-full">
                                <div className="flex items-center gap-1 overflow-x-auto">
                                  {[
                                    { label: 'M', value: unit.movement },
                                    { label: 'T', value: unit.toughness },
                                    { label: 'SV', value: unit.save },
                                    { label: 'W', value: unit.wounds },
                                    { label: 'LD', value: unit.leadership },
                                    { label: 'OC', value: unit.objectiveControl },
                                  ].map((stat) => (
                                    <div key={stat.label} className="bg-surface-900 rounded px-2 py-1 text-center flex-shrink-0">
                                      <div className="text-[9px] text-gray-500 uppercase leading-tight">{stat.label}</div>
                                      <div className="text-sm font-bold text-gray-200 leading-tight">{stat.value}</div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>

                            {/* Weapon rows */}
                            {unit.weapons.map((weapon, idx) => (
                              <tr key={idx}>
                                <td className="text-xs text-gray-200 font-medium pr-3 whitespace-nowrap">
                                  {weapon.name}
                                  <span className={`ml-2 px-1 py-0.5 rounded text-[9px] ${
                                    weapon.type === 'ranged' ? 'bg-blue-900/40 text-blue-400' : 'bg-red-900/40 text-red-400'
                                  }`}>
                                    {weapon.type === 'ranged' ? 'Ranged' : 'Melee'}
                                  </span>
                                </td>
                                <td className="w-full">
                                  <div className="flex items-center gap-1 overflow-x-auto">
                                    {[
                                      { label: 'R', value: weapon.range || '—' },
                                      { label: 'A', value: weapon.attacks },
                                      { label: weapon.type === 'ranged' ? 'BS' : 'WS', value: weapon.type === 'ranged' ? (weapon.skill) : (weapon.skill) },
                                      { label: 'S', value: weapon.strength },
                                      { label: 'AP', value: weapon.ap },
                                      { label: 'D', value: weapon.damage },
                                    ].map((stat) => (
                                      <div key={stat.label} className="bg-surface-900 rounded px-2 py-1 text-center flex-shrink-0">
                                        <div className="text-[9px] text-gray-500 uppercase leading-tight">{stat.label}</div>
                                        <div className="text-sm font-bold text-gray-200 leading-tight">{stat.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Abilities */}
                        {unit.abilities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {unit.abilities.map((ability) => (
                              <span key={ability} className="text-[11px] bg-olive-600/30 text-olive-400 px-2 py-0.5 rounded">
                                {ability}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {unit.notes && (
                          <div className="bg-surface-900 rounded p-2">
                            <span className="text-[10px] text-gray-500 uppercase">Notes: </span>
                            <span className="text-xs text-gray-300">{unit.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Hidden file input for thumbnail uploads */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

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

      {showImport && (
        <ImportGuestDataModal
          guestRosterCount={guestCounts.rosterCount}
          guestUnitCount={guestCounts.unitCount}
          onImport={handleImport}
          onSkip={handleSkipImport}
        />
      )}
    </div>
  )
}
