import Counter from './Counter'

interface FooterProps {
  turn: number
  commandPoints: number
  onTurnChange: (turn: number) => void
  onCPChange: (cp: number) => void
  onGameOptions: () => void
}

export default function Footer({ turn, commandPoints, onTurnChange, onCPChange, onGameOptions }: FooterProps) {
  return (
    <div className="sticky bottom-0 z-40 bg-surface-900/95 backdrop-blur border-t border-surface-600 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onGameOptions}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-gray-300 text-sm font-medium transition-colors"
        >
          ⚙ Game Options
        </button>

        <div className="flex items-center gap-6">
          <Counter label="Turn" value={turn} onChange={onTurnChange} min={1} max={5} />
          <Counter label="CP" value={commandPoints} onChange={onCPChange} min={0} max={20} />
        </div>
      </div>
    </div>
  )
}
