import { useState, useRef } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import { useAuth } from '../lib/AuthContext'
import { uploadUnitImage, deleteUnitImage } from '../lib/storageService'

interface UnitDetailModalProps {
  unit: Unit
  onClose: () => void
  onEdit?: () => void
  onImageChange?: (imageUrl: string | undefined) => void
}

export default function UnitDetailModal({ unit, onClose, onEdit, onImageChange }: UnitDetailModalProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    const url = await uploadUnitImage(user.id, unit.id, file)
    if (url && onImageChange) {
      onImageChange(url)
    }
    setUploading(false)
  }

  const handleRemoveImage = async () => {
    if (!user || !unit.imageUrl) return
    await deleteUnitImage(user.id, unit.id, unit.imageUrl)
    if (onImageChange) {
      onImageChange(undefined)
    }
  }

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
            {unit.wounds > 1 && (
              <span className="text-gray-500 ml-2">· {unit.wounds}W each</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => { onClose(); onEdit(); }}
                className="px-3 py-1.5 rounded text-xs font-medium bg-olive-600 text-white hover:bg-olive-500 transition-colors"
              >
                ✎ Edit
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Unit Image */}
          <div>
            <h3 className="text-xs text-gray-500 uppercase mb-2">Unit Image</h3>
            {unit.imageUrl ? (
              <div className="relative">
                <img
                  src={unit.imageUrl}
                  alt={unit.name}
                  className="w-full max-h-48 object-cover rounded-lg border border-surface-600"
                />
                {user && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2 py-1 rounded text-xs bg-surface-800/80 text-gray-300 hover:text-white transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      onClick={handleRemoveImage}
                      className="px-2 py-1 rounded text-xs bg-surface-800/80 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => user ? fileInputRef.current?.click() : null}
                className={`w-full h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                  user
                    ? 'border-surface-600 text-gray-500 hover:text-olive-400 hover:border-olive-500/50 cursor-pointer'
                    : 'border-surface-700 text-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">📷</span>
                <span className="text-xs">
                  {user ? (uploading ? 'Uploading...' : 'Click to upload an image') : 'Sign in to upload images'}
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

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
