/**
 * WoundTracker — compact counter style (like Turn/CP)
 *
 * - Multi-model, 1W each → "Models: ◀ 7/10 ▶"
 * - Single model, many wounds → "Wounds: ◀ 9/12 ▶"
 * - Multi-model, many wounds → per-model counters in a compact grid
 */

interface WoundTrackerProps {
  modelCount: number
  woundsPerModel: number
  modelWounds: number[]
  onChange: (modelWounds: number[]) => void
}

export default function WoundTracker({ modelCount, woundsPerModel, modelWounds, onChange }: WoundTrackerProps) {
  // Simple case: multi-model, 1W each
  if (woundsPerModel === 1) {
    const alive = modelWounds.filter((w) => w > 0).length
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase w-14">Models</span>
        <button
          onClick={() => {
            // Kill one model (find last alive, set to 0)
            const next = [...modelWounds]
            for (let i = next.length - 1; i >= 0; i--) {
              if (next[i] > 0) { next[i] = 0; break }
            }
            onChange(next)
          }}
          className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
        >
          −
        </button>
        <span className={`text-sm font-bold min-w-[3rem] text-center ${alive === 0 ? 'text-red-400' : 'text-gray-200'}`}>
          {alive} / {modelCount}
        </span>
        <button
          onClick={() => {
            // Revive one model (find first dead, set to 1)
            const next = [...modelWounds]
            for (let i = 0; i < next.length; i++) {
              if (next[i] === 0) { next[i] = 1; break }
            }
            onChange(next)
          }}
          className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
        >
          +
        </button>
      </div>
    )
  }

  // Single model, many wounds
  if (modelCount === 1) {
    const current = modelWounds[0]
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-500 uppercase w-14">Wounds</span>
        <button
          onClick={() => {
            if (current > 0) onChange([current - 1])
          }}
          className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
        >
          −
        </button>
        <span className={`text-sm font-bold min-w-[3rem] text-center ${current === 0 ? 'text-red-400' : 'text-gray-200'}`}>
          {current} / {woundsPerModel}
        </span>
        <button
          onClick={() => {
            if (current < woundsPerModel) onChange([current + 1])
          }}
          className="w-6 h-6 rounded bg-surface-700 text-gray-400 hover:text-gray-200 text-sm font-bold flex items-center justify-center"
        >
          +
        </button>
      </div>
    )
  }

  // Multi-model, multi-wound — compact per-model counters
  const totalAlive = modelWounds.filter((w) => w > 0).length
  return (
    <div>
      <div className="text-[10px] text-gray-500 uppercase mb-1">
        Models: {totalAlive}/{modelCount}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {modelWounds.map((current, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-surface-700/50 rounded px-1.5 py-0.5">
            <span className={`text-[10px] w-3 ${current === 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {idx + 1}
            </span>
            <button
              onClick={() => {
                const next = [...modelWounds]
                if (next[idx] > 0) next[idx]--
                onChange(next)
              }}
              className="w-5 h-5 rounded text-gray-400 hover:text-gray-200 text-xs font-bold flex items-center justify-center"
            >
              −
            </button>
            <span className={`text-xs font-bold min-w-[2rem] text-center ${current === 0 ? 'text-red-400' : 'text-gray-200'}`}>
              {current}/{woundsPerModel}
            </span>
            <button
              onClick={() => {
                const next = [...modelWounds]
                if (next[idx] < woundsPerModel) next[idx]++
                onChange(next)
              }}
              className="w-5 h-5 rounded text-gray-400 hover:text-gray-200 text-xs font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
