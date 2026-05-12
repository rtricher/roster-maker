interface HeaderProps {
  rosterName: string
  faction: string
  detachment?: string
  totalPoints: number
  maxPoints: number
  onBack: () => void
}

export default function Header({ rosterName, faction, detachment, totalPoints, maxPoints, onBack }: HeaderProps) {
  const overBudget = totalPoints > maxPoints

  return (
    <div className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur border-b border-surface-600 px-4 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-200 text-lg">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-100 truncate">{rosterName}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-olive-400">{faction}</span>
            {detachment && (
              <>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400">{detachment}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl font-bold ${overBudget ? 'text-red-400' : 'text-amber-400'}`}>
            {totalPoints}
          </div>
          <div className="text-xs text-gray-500">/ {maxPoints} pts</div>
        </div>
      </div>
    </div>
  )
}
