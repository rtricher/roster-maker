import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">⚔️ Roster Maker</h1>
          <p className="text-xl text-slate-300 mb-8">
            Build your Warhammer 40K army and track games with ease
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link
              to="/builder"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold transition"
            >
              🎨 Build Roster
            </Link>
            <button
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold transition"
              disabled
            >
              📊 Game Tracker (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
