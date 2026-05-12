import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_ROSTER } from '../data/mockData'
import type { Unit } from '../../../packages/shared/src/types'
import { calculateRosterPoints } from '../../../packages/shared/src/utils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import UnitCard from '../components/UnitCard'
import AddUnitForm from '../components/AddUnitForm'

export default function RosterBuilder() {
  const navigate = useNavigate()
  const [units, setUnits] = useState<Unit[]>(MOCK_ROSTER.units)
  const [turn, setTurn] = useState(1)
  const [commandPoints, setCommandPoints] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)

  const totalPoints = calculateRosterPoints(units)

  const handleUpdateWounds = (unitId: string, newWounds: number) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, currentWounds: newWounds } : u))
    )
  }

  const handleAddUnit = (unit: Unit) => {
    setUnits((prev) => [...prev, unit])
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100 flex flex-col">
      <Header
        rosterName={MOCK_ROSTER.name}
        faction={MOCK_ROSTER.faction}
        detachment={MOCK_ROSTER.detachment}
        totalPoints={totalPoints}
        maxPoints={MOCK_ROSTER.maxPoints}
        onBack={() => navigate('/')}
      />

      {/* Unit list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} onUpdateWounds={handleUpdateWounds} />
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
