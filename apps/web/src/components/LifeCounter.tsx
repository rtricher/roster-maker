interface LifeCounterProps {
  total: number
  current: number
  onChange: (newValue: number) => void
}

export default function LifeCounter({ total, current, onChange }: LifeCounterProps) {
  const pips = Array.from({ length: total }, (_, i) => i)

  return (
    <div className="flex flex-wrap gap-1.5">
      {pips.map((i) => {
        const alive = i < current
        return (
          <button
            key={i}
            onClick={() => {
              // If clicking an alive pip, kill it (and everything after)
              // If clicking a dead pip, revive up to that point
              if (alive) {
                onChange(i)
              } else {
                onChange(i + 1)
              }
            }}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              alive
                ? 'bg-olive-500 border-olive-400 shadow-sm shadow-olive-500/30'
                : 'bg-transparent border-gray-600 hover:border-gray-400'
            }`}
            title={alive ? `Kill model ${i + 1}` : `Revive model ${i + 1}`}
          />
        )
      })}
    </div>
  )
}
