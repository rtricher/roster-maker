import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GameTracker from './pages/GameTracker'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<GameTracker />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
