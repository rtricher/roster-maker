import { useState } from 'react'
import type { Unit } from '../../../../packages/shared/src/types'
import { loadUnitLibrary } from '../lib/storage'

interface ImportGuestDataModalProps {
  guestRosterCount: number
  guestUnitCount: number
  onImport: (options: { rosters: boolean; units: boolean }) => void
  onSkip: () => void
}

export default function ImportGuestDataModal({ guestRosterCount, guestUnitCount, onImport, onSkip }: ImportGuestDataModalProps) {
  const [importRosters, setImportRosters] = useState(true)
  const [importUnits, setImportUnits] = useState(true)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-800 rounded-lg max-w-md w-full border border-surface-600 p-6">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">📦</div>
          <h2 className="text-lg font-bold text-gray-100">Import Guest Data?</h2>
          <p className="text-sm text-gray-400 mt-2">
            We found data from when you were using the app without an account.
            Would you like to import it into your account?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {guestRosterCount > 0 && (
            <label className="flex items-center gap-3 bg-surface-700 rounded-lg p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={importRosters}
                onChange={(e) => setImportRosters(e.target.checked)}
                className="w-4 h-4 accent-olive-500"
              />
              <div>
                <div className="text-sm text-gray-200 font-medium">
                  {guestRosterCount} Roster{guestRosterCount !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500">Will be saved to your account</div>
              </div>
            </label>
          )}

          {guestUnitCount > 0 && (
            <label className="flex items-center gap-3 bg-surface-700 rounded-lg p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={importUnits}
                onChange={(e) => setImportUnits(e.target.checked)}
                className="w-4 h-4 accent-olive-500"
              />
              <div>
                <div className="text-sm text-gray-200 font-medium">
                  {guestUnitCount} Unit{guestUnitCount !== 1 ? 's' : ''} in Library
                </div>
                <div className="text-xs text-gray-500">Will be merged into your unit library</div>
              </div>
            </label>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => onImport({ rosters: importRosters, units: importUnits })}
            disabled={!importRosters && !importUnits}
            className="flex-1 py-2.5 rounded-lg bg-olive-500 hover:bg-olive-600 disabled:opacity-40 text-white font-medium text-sm transition-colors"
          >
            Import
          </button>
        </div>

        <p className="text-[10px] text-gray-600 text-center mt-3">
          Guest data will be cleared from this browser after import
        </p>
      </div>
    </div>
  )
}
