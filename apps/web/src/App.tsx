import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RosterBuilder from './pages/RosterBuilder'
import Home from './pages/Home'
import GameOptions from './pages/GameOptions'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<RosterBuilder />} />
        <Route path="/game" element={<GameOptions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
