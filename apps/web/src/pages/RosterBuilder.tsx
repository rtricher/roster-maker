import { useState } from 'react'

interface Unit {
  id: string
  name: string
  points: number
}

function RosterBuilder() {
  const [units, setUnits] = useState<Unit[]>([])
  const [unitName, setUnitName] = useState('')
  const [unitPoints, setUnitPoints] = useState('')

  const addUnit = () => {
    if (unitName && unitPoints) {
      setUnits([...units, {
        id: Date.now().toString(),
        name: unitName,
        points: parseInt(unitPoints),
      }])
      setUnitName('')
      setUnitPoints('')
    }
  }

  const removeUnit = (id: string) => {
    setUnits(units.filter(u => u.id !== id))
  }

  const totalPoints = units.reduce((sum, unit) => sum + unit.points, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🎨 Roster Builder</h1>
        
        <div className="bg-slate-700 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="px-4 py-2 rounded bg-slate-600 text-white placeholder-slate-400"
            />
            <input
              type="number"
              placeholder="Points"
              value={unitPoints}
              onChange={(e) => setUnitPoints(e.target.value)}
              className="px-4 py-2 rounded bg-slate-600 text-white placeholder-slate-400"
            />
            <button
              onClick={addUnit}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
            >
              Add Unit
            </button>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg overflow-hidden">
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-600">
            <h2 className="text-2xl font-bold">Roster ({totalPoints} pts)</h2>
          </div>
          
          {units.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400">
              No units added yet. Create your first unit above!
            </div>
          ) : (
            <div className="divide-y divide-slate-600">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="px-6 py-4 flex justify-between items-center hover:bg-slate-600 transition"
                >
                  <div>
                    <p className="font-semibold">{unit.name}</p>
                    <p className="text-sm text-slate-400">{unit.points} points</p>
                  </div>
                  <button
                    onClick={() => removeUnit(unit.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RosterBuilder
