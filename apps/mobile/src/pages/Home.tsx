import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">⚔️ Game Tracker</h1>
          <p className="text-base sm:text-lg text-slate-300 mb-8">
            Track your Warhammer 40K games on the fly
          </p>
          
          <div className="space-y-3 mt-8">
            <Link
              to="/tracker"
              className="block w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition text-center"
            >
              📊 Start Tracking
            </Link>
            <button
              className="block w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
              disabled
            >
              🏆 Battle History (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
