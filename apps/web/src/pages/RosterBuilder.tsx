import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Roster, Unit } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { getRosters, addUnit, removeUnit } from '../lib/rosterService'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UnitCard from '../components/UnitCard'
import AddUnitForm from '../components/AddUnitForm'

export default function RosterBuilder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rosterId = searchParams.get('id')
  const { user, loading: authLoading } = useAuth()

  const [roster, setRoster] = useState<Roster | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [turn, setTurn] = useState(1)
  const [commandPoints, setCommandPoints] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!rosterId) {
      navigate('/')
      return
    }
    loadRoster()
  }, [rosterId, user, authLoading])

  const loadRoster = async () => {
    setLoading(true)
    const rosters = await getRosters(user)
    const found = rosters.find((r) => r.id === rosterId)
    if (found) {
      setRoster(found)
      setUnits(found.units.map((u) => ({ ...u, currentWounds: u.count })))
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  const handleUpdateWounds = (unitId: string, newWounds: number) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, currentWounds: newWounds } : u))
    )
  }

  const handleAddUnit = async (unit: Unit) => {
    if (!rosterId) return
    const savedUnit = await addUnit(user, rosterId, unit)
    if (savedUnit) {
      // Use the DB-generated unit (with real UUID) not the form-generated one
      setUnits((prev) => [...prev, { ...savedUnit, currentWounds: savedUnit.count }])
      if (roster) {
        setRoster({ ...roster, totalPoints: roster.totalPoints + savedUnit.points })
      }
    }
    setShowAddForm(false)
  }

  const handleRemoveUnit = async (unitId: string) => {
    if (!rosterId) return
    if (!confirm('Remove this unit from the roster?')) return
    const unit = units.find((u) => u.id === unitId)
    const success = await removeUnit(user, rosterId, unitId)
    if (success) {
      setUnits((prev) => prev.filter((u) => u.id !== unitId))
      if (roster && unit) {
        setRoster({ ...roster, totalPoints: roster.totalPoints - unit.points })
      }
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
            onUpdateWounds={handleUpdateWounds}
            onRemove={() => handleRemoveUnit(unit.id)}
          />
        ))}

        <button
          onClick={() => setShowAddForm(true)}
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

      {showAddForm && (
        <AddUnitForm onAdd={handleAddUnit} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  )
}
