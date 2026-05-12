import { useNavigate } from 'react-router-dom'

export default function GameOptions() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-900 text-gray-100 p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-200 text-lg">←</button>
        <h1 className="text-xl font-bold">Game Options</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
          <h2 className="font-semibold text-gray-200 mb-2">Mission</h2>
          <p className="text-sm text-gray-500">Coming soon — select mission and deployment.</p>
        </div>
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
          <h2 className="font-semibold text-gray-200 mb-2">Scoring</h2>
          <p className="text-sm text-gray-500">Coming soon — track primary and secondary objectives.</p>
        </div>
        <div className="bg-surface-800 border border-surface-600 rounded-lg p-4">
          <h2 className="font-semibold text-gray-200 mb-2">Battle Log</h2>
          <p className="text-sm text-gray-500">Coming soon — notes and events per turn.</p>
        </div>
      </div>
    </div>
  )
}
