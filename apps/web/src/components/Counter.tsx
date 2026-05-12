import { useState } from 'react'

interface CounterProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function Counter({ label, value, onChange, min = 0, max = 99 }: CounterProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded bg-surface-600 hover:bg-surface-700 text-gray-300 font-bold text-lg flex items-center justify-center transition-colors"
          disabled={value <= min}
        >
          ◀
        </button>
        <span className="text-xl font-bold text-amber-400 w-8 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded bg-surface-600 hover:bg-surface-700 text-gray-300 font-bold text-lg flex items-center justify-center transition-colors"
          disabled={value >= max}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
