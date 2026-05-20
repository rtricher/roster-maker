/**
 * WoundTracker — adapts display based on unit profile:
 *
 * - Multi-model, 1W each → simple model pips (click to kill/revive)
 * - Single model, many wounds → wound pips (click to damage/heal)
 * - Multi-model, many wounds → per-model wound rows with individual pips
 */

interface WoundTrackerProps {
  /** Number of models in the unit */
  modelCount: number
  /** Wounds per model */
  woundsPerModel: number
  /** Array of current wounds per model (length = modelCount) */
  modelWounds: number[]
  /** Called when wounds change */
  onChange: (modelWounds: number[]) => void
}

export default function WoundTracker({ modelCount, woundsPerModel, modelWounds, onChange }: WoundTrackerProps) {
  // Simple case: multi-model, 1W each — model alive/dead pips
  if (woundsPerModel === 1) {
    const alive = modelWounds.filter((w) => w > 0).length
    return (
      <div>
        <div className="text-[10px] text-gray-500 uppercase mb-1">
          Models Remaining: {alive}/{modelCount}
        </div>
        <div className="flex flex-wrap gap-1">
          {modelWounds.map((w, i) => (
            <button
              key={i}
              onClick={() => {
                const next = [...modelWounds]
                next[i] = w > 0 ? 0 : 1
                onChange(next)
              }}
              className={`w-5 h-5 rounded-full border-2 transition-colors ${
                w > 0
                  ? 'bg-green-500 border-green-400'
                  : 'bg-transparent border-surface-600'
              }`}
              title={w > 0 ? `Model ${i + 1}: alive` : `Model ${i + 1}: dead`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Single model, many wounds — wound pips
  if (modelCount === 1) {
    const current = modelWounds[0]
    return (
      <div>
        <div className="text-[10px] text-gray-500 uppercase mb-1">
          Wounds: {current}/{woundsPerModel}
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: woundsPerModel }, (_, i) => (
            <button
              key={i}
              onClick={() => {
                // Click pip i: if it's filled (i < current), set wounds to i
                // If it's empty (i >= current), set wounds to i+1
                const next = [...modelWounds]
                if (i < current) {
                  next[0] = i
                } else {
                  next[0] = i + 1
                }
                onChange(next)
              }}
              className={`w-5 h-5 rounded-full border-2 transition-colors ${
                i < current
                  ? 'bg-green-500 border-green-400'
                  : 'bg-transparent border-surface-600'
              }`}
              title={`Wound ${i + 1}`}
            />
          ))}
        </div>
      </div>
    )
  }

  // Multi-model, multi-wound — compact per-model rows
  const totalAlive = modelWounds.filter((w) => w > 0).length
  const totalWoundsRemaining = modelWounds.reduce((sum, w) => sum + w, 0)
  const totalWoundsMax = modelCount * woundsPerModel

  return (
    <div>
      <div className="text-[10px] text-gray-500 uppercase mb-1">
        Models: {totalAlive}/{modelCount} · Wounds: {totalWoundsRemaining}/{totalWoundsMax}
      </div>
      <div className="space-y-1">
        {modelWounds.map((current, modelIdx) => (
          <div key={modelIdx} className="flex items-center gap-2">
            <span className={`text-[10px] w-4 text-right ${current > 0 ? 'text-gray-400' : 'text-gray-600 line-through'}`}>
              {modelIdx + 1}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: woundsPerModel }, (_, woundIdx) => (
                <button
                  key={woundIdx}
                  onClick={() => {
                    const next = [...modelWounds]
                    if (woundIdx < current) {
                      next[modelIdx] = woundIdx
                    } else {
                      next[modelIdx] = woundIdx + 1
                    }
                    onChange(next)
                  }}
                  className={`w-4 h-4 rounded-full border transition-colors ${
                    woundIdx < current
                      ? 'bg-green-500 border-green-400'
                      : 'bg-transparent border-surface-600'
                  }`}
                />
              ))}
            </div>
            {current === 0 && (
              <span className="text-[10px] text-red-400/60">dead</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
