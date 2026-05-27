import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import RosterBuilder from './pages/RosterBuilder'
import Home from './pages/Home'
import GameOptions from './pages/GameOptions'
import Auth from './pages/Auth'
import UnitLibrary from './pages/UnitLibrary'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<RosterBuilder />} />
          <Route path="/game" element={<GameOptions />} />
          <Route path="/library" element={<UnitLibrary />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
