import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Roster, Unit } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { getRosters, addUnit, removeUnit, updateRoster, updateUnit } from '../lib/rosterService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UnitCard from '../components/UnitCard'
import AddUnitToRosterModal from '../components/AddUnitToRosterModal'
import EditRosterModal from '../components/EditRosterModal'
import EditUnitModal from '../components/EditUnitModal'

function initModelWounds(unit: Unit): number[] {
  return Array.from({ length: unit.count }, () => unit.wounds)
}

export default function RosterBuilder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rosterId = searchParams.get('id')
  const { user, loading: authLoading } = useAuth()
  const hasLoaded = useRef(false)

  const [roster, setRoster] = useState<Roster | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [woundState, setWoundState] = useState<Record<string, number[]>>({})
  const [loading, setLoading] = useState(true)
  const [turn, setTurn] = useState(1)
  const [commandPoints, setCommandPoints] = useState(0)
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [showEditRoster, setShowEditRoster] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!rosterId) {
      navigate('/')
      return
    }
    // Only load once — don't re-trigger on user object reference changes
    if (!hasLoaded.current) {
      hasLoaded.current = true
      loadRoster()
    }
  }, [rosterId, authLoading])

  const loadRoster = async () => {
    setLoading(true)
    const rosters = await getRosters(user)
    const found = rosters.find((r) => r.id === rosterId)
    if (found) {
      setRoster(found)
      setUnits(found.units)
      const wounds: Record<string, number[]> = {}
      found.units.forEach((u) => {
        wounds[u.id] = initModelWounds(u)
      })
      setWoundState(wounds)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const handleUpdateModelWounds = (unitId: string, modelWounds: number[]) => {
    setWoundState((prev) => ({ ...prev, [unitId]: modelWounds }))
  }

  const handleAddUnit = async (unit: Unit) => {
    if (!rosterId) return
    const savedUnit = await addUnit(user, rosterId, unit)
    if (savedUnit) {
      setUnits((prev) => [...prev, savedUnit])
      setWoundState((prev) => ({ ...prev, [savedUnit.id]: initModelWounds(savedUnit) }))
      if (roster) {
        setRoster({ ...roster, totalPoints: roster.totalPoints + savedUnit.points })
      }
    }
    setShowAddUnit(false)
  }

  const handleRemoveUnit = async (unitId: string) => {
    if (!rosterId) return
    if (!confirm('Remove this unit from the roster?')) return
    const unit = units.find((u) => u.id === unitId)
    const success = await removeUnit(user, rosterId, unitId)
    if (success) {
      setUnits((prev) => prev.filter((u) => u.id !== unitId))
      setWoundState((prev) => {
        const next = { ...prev }
        delete next[unitId]
        return next
      })
      if (roster && unit) {
        setRoster({ ...roster, totalPoints: roster.totalPoints - unit.points })
      }
    }
  }

  const handleEditRoster = async (name: string, faction: string, detachment: string, maxPoints: number) => {
    if (!rosterId || !roster) return
    const success = await updateRoster(user, rosterId, { name, faction, detachment, maxPoints })
    if (success) {
      setRoster({ ...roster, name, faction, detachment, maxPoints })
    }
    setShowEditRoster(false)
  }

  const handleEditUnit = async (updates: Partial<Omit<Unit, 'id' | 'currentWounds'>>) => {
    if (!rosterId || !editingUnit) return
    const saved = await updateUnit(user, rosterId, editingUnit.id, updates)
    if (saved) {
      setUnits((prev) => prev.map((u) => (u.id === editingUnit.id ? saved : u)))
      if (updates.count !== undefined || updates.wounds !== undefined) {
        setWoundState((prev) => ({ ...prev, [editingUnit.id]: initModelWounds(saved) }))
      }
      if (roster) {
        const newTotal = units.reduce((sum, u) => {
          if (u.id === editingUnit.id) return sum + (updates.points ?? u.points)
          return sum + u.points
        }, 0)
        setRoster({ ...roster, totalPoints: newTotal })
      }
      setEditingUnit(null)
    } else {
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleImageChange = async (unitId: string, imageUrl: string | undefined) => {
    if (!rosterId) return
    const saved = await updateUnit(user, rosterId, unitId, { imageUrl })
    if (saved) {
      setUnits((prev) => prev.map((u) => (u.id === unitId ? saved : u)))
    }
  }

  const totalPoints = units.reduce((sum, u) => sum + u.points, 0)

  if (loading || !roster) {
    return (
      <div className="min-h-screen bg-surface-900 text-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading roster...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100 flex flex-col">
      <Header
        rosterName={roster.name}
        faction={roster.faction}
        detachment={roster.detachment}
        totalPoints={totalPoints}
        maxPoints={roster.maxPoints}
        onBack={() => navigate('/')}
        onEdit={() => setShowEditRoster(true)}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {units.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No units yet</p>
            <p className="text-sm mt-1">Add your first unit to build this roster</p>
          </div>
        )}

        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            modelWounds={woundState[unit.id] || initModelWounds(unit)}
            onUpdateModelWounds={handleUpdateModelWounds}
            onRemove={() => handleRemoveUnit(unit.id)}
            onEdit={() => setEditingUnit(unit)}
            onImageChange={handleImageChange}
          />
        ))}

        <button
          onClick={() => setShowAddUnit(true)}
          className="w-full py-3 rounded-lg border-2 border-dashed border-surface-600 text-gray-500 hover:text-olive-400 hover:border-olive-500/50 transition-colors text-sm font-medium"
        >
          + Add Unit
        </button>
      </div>

      <Footer
        turn={turn}
        commandPoints={commandPoints}
        onTurnChange={setTurn}
        onCPChange={setCommandPoints}
        onGameOptions={() => navigate('/game')}
      />

      {showAddUnit && (
        <AddUnitToRosterModal onAdd={handleAddUnit} onCancel={() => setShowAddUnit(false)} />
      )}

      {showEditRoster && roster && (
        <EditRosterModal
          name={roster.name}
          faction={roster.faction}
          detachment={roster.detachment || ''}
          maxPoints={roster.maxPoints}
          onSave={handleEditRoster}
          onCancel={() => setShowEditRoster(false)}
        />
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
