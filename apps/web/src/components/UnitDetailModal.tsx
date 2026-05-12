import type { Unit } from '../../../../packages/shared/src/types'

interface UnitDetailModalProps {
  unit: Unit
  onClose: () => void
}

export default function UnitDetailModal({ unit, onClose }: UnitDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-surface-800 rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto border border-surface-600"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-600">
          <div>
            <h2 className="text-xl font-bold text-gray-100">{unit.name}</h2>
            <span className="text-amber-400 font-semibold">{unit.points} pts</span>
            <span className="text-gray-500 ml-2">· {unit.count} model{unit.count !== 1 ? 's' : ''}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Stats Grid */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-2">Characteristics</h3>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'M', value: unit.movement },
                { label: 'T', value: unit.toughness },
                { label: 'SV', value: unit.save },
                { label: 'W', value: unit.wounds },
                { label: 'LD', value: unit.leadership },
                { label: 'OC', value: unit.objectiveControl },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-900 rounded p-2 text-center">
                  <div className="text-[10px] text-gray-500 uppercase">{stat.label}</div>
                  <div className="text-lg font-bold text-gray-200">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities */}
          {unit.abilities.length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {unit.abilities.map((ability) => (
                  <span key={ability} className="text-sm bg-olive-600/30 text-olive-400 px-3 py-1 rounded">
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ranged Weapons */}
          {unit.weapons.filter((w) => w.type === 'ranged').length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Ranged Weapons</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase">
                      <th className="text-left py-1">Name</th>
                      <th className="text-center py-1">Rng</th>
                      <th className="text-center py-1">A</th>
                      <th className="text-center py-1">BS</th>
                      <th className="text-center py-1">S</th>
                      <th className="text-center py-1">AP</th>
                      <th className="text-center py-1">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.weapons.filter((w) => w.type === 'ranged').map((weapon) => (
                      <tr key={weapon.name} className="text-gray-300 border-t border-surface-700">
                        <td className="py-1.5 font-medium">{weapon.name}</td>
                        <td className="text-center">{weapon.range}</td>
                        <td className="text-center">{weapon.attacks}</td>
                        <td className="text-center">{weapon.skill}</td>
                        <td className="text-center">{weapon.strength}</td>
                        <td className="text-center">{weapon.ap}</td>
                        <td className="text-center">{weapon.damage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Melee Weapons */}
          {unit.weapons.filter((w) => w.type === 'melee').length > 0 && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Melee Weapons</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase">
                      <th className="text-left py-1">Name</th>
                      <th className="text-center py-1">Rng</th>
                      <th className="text-center py-1">A</th>
                      <th className="text-center py-1">WS</th>
                      <th className="text-center py-1">S</th>
                      <th className="text-center py-1">AP</th>
                      <th className="text-center py-1">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.weapons.filter((w) => w.type === 'melee').map((weapon) => (
                      <tr key={weapon.name} className="text-gray-300 border-t border-surface-700">
                        <td className="py-1.5 font-medium">{weapon.name}</td>
                        <td className="text-center">{weapon.range}</td>
                        <td className="text-center">{weapon.attacks}</td>
                        <td className="text-center">{weapon.skill}</td>
                        <td className="text-center">{weapon.strength}</td>
                        <td className="text-center">{weapon.ap}</td>
                        <td className="text-center">{weapon.damage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {unit.notes && (
            <div>
              <h3 className="text-xs text-gray-500 uppercase mb-2">Notes</h3>
              <p className="text-sm text-gray-300 bg-surface-900 rounded p-3">{unit.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
