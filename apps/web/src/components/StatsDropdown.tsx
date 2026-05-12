import type { Unit } from '../../../packages/shared/src/types'

interface StatsDropdownProps {
  unit: Unit
  isOpen: boolean
}

export default function StatsDropdown({ unit, isOpen }: StatsDropdownProps) {
  if (!isOpen) return null

  return (
    <div className="mt-3 pt-3 border-t border-surface-600 animate-in">
      {/* Core Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
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
            <div className="text-sm font-bold text-gray-200">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Abilities */}
      {unit.abilities.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-500 uppercase mb-1">Abilities</div>
          <div className="flex flex-wrap gap-1">
            {unit.abilities.map((ability) => (
              <span
                key={ability}
                className="text-xs bg-olive-600/30 text-olive-400 px-2 py-0.5 rounded"
              >
                {ability}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weapons */}
      {unit.weapons.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase mb-1">Weapons</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 uppercase">
                  <th className="text-left py-1 pr-2">Name</th>
                  <th className="text-center py-1 px-1">Rng</th>
                  <th className="text-center py-1 px-1">A</th>
                  <th className="text-center py-1 px-1">BS/WS</th>
                  <th className="text-center py-1 px-1">S</th>
                  <th className="text-center py-1 px-1">AP</th>
                  <th className="text-center py-1 px-1">D</th>
                </tr>
              </thead>
              <tbody>
                {unit.weapons.map((weapon) => (
                  <tr key={weapon.name} className="text-gray-300 border-t border-surface-700">
                    <td className="py-1 pr-2 font-medium">{weapon.name}</td>
                    <td className="text-center py-1 px-1">{weapon.range}</td>
                    <td className="text-center py-1 px-1">{weapon.attacks}</td>
                    <td className="text-center py-1 px-1">{weapon.skill}</td>
                    <td className="text-center py-1 px-1">{weapon.strength}</td>
                    <td className="text-center py-1 px-1">{weapon.ap}</td>
                    <td className="text-center py-1 px-1">{weapon.damage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
