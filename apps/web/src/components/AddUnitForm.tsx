import { useState, useRef } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import { generateId } from '../../../../packages/shared/src/utils'
import { useAuth } from '../lib/AuthContext'
import { uploadUnitImage } from '../lib/storageService'

interface AddUnitFormProps {
  onAdd: (unit: Unit) => void
  onCancel: () => void
}

export default function AddUnitForm({ onAdd, onCancel }: AddUnitFormProps) {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [points, setPoints] = useState(0)
  const [count, setCount] = useState(1)
  const [wounds, setWounds] = useState(1)
  const [movement, setMovement] = useState('6"')
  const [toughness, setToughness] = useState(4)
  const [save, setSave] = useState('3+')
  const [leadership, setLeadership] = useState(6)
  const [objectiveControl, setObjectiveControl] = useState(1)
  const [notes, setNotes] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    // Create preview
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setUploading(true)

    // Upload image if provided and user is signed in
    let imageUrl: string | undefined
    if (imageFile && user) {
      const tempId = crypto.randomUUID()
      const url = await uploadUnitImage(user.id, tempId, imageFile)
      if (url) imageUrl = url
    }

    const unit: Unit = {
      id: generateId(),
      name: name.trim(),
      points,
      count,
      wounds,
      movement,
      toughness,
      save,
      leadership,
      objectiveControl,
      currentWounds: count * wounds,
      notes: notes || undefined,
      imageUrl,
      abilities: [],
      weapons: [],
    }

    setUploading(false)
    onAdd(unit)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        className="bg-surface-800 rounded-lg max-w-md w-full max-h-[85vh] overflow-y-auto border border-surface-600 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-100 mb-4">Add Unit</h2>

        <div className="space-y-3">
          {/* Image Upload */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Unit Image</label>
            {imagePreview ? (
              <div className="relative mt-1">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-surface-600"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 px-2 py-1 rounded text-xs bg-surface-800/80 text-gray-300 hover:text-red-400 transition-colors"
                >
                  🗑
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => user ? fileInputRef.current?.click() : null}
                className={`w-full mt-1 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${
                  user
                    ? 'border-surface-600 text-gray-500 hover:text-olive-400 hover:border-olive-500/50 cursor-pointer'
                    : 'border-surface-700 text-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="text-lg">📷</span>
                <span className="text-[10px]">
                  {user ? 'Click to add image' : 'Sign in to upload images'}
                </span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Unit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              placeholder="e.g. Intercessor Squad"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Models</label>
              <input
                type="number"
                value={count}
                min={1}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Wounds / model</label>
              <input
                type="number"
                value={wounds}
                min={1}
                onChange={(e) => setWounds(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Move</label>
              <input
                type="text"
                value={movement}
                onChange={(e) => setMovement(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Toughness</label>
              <input
                type="number"
                value={toughness}
                onChange={(e) => setToughness(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Save</label>
              <input
                type="text"
                value={save}
                onChange={(e) => setSave(e.target.value)}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Leadership</label>
              <input
                type="number"
                value={leadership}
                onChange={(e) => setLeadership(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Objective Control</label>
              <input
                type="number"
                value={objectiveControl}
                onChange={(e) => setObjectiveControl(Number(e.target.value))}
                className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 bg-surface-900 border border-surface-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-olive-500 h-20 resize-none"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded text-sm text-gray-400 hover:text-gray-200 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || uploading}
            className="px-4 py-2 rounded text-sm font-medium bg-olive-500 text-white hover:bg-olive-600 disabled:opacity-40 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Add Unit'}
          </button>
        </div>
      </form>
    </div>
  )
}
