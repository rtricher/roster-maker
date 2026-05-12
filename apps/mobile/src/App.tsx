import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GameTracker from './pages/GameTracker'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameTracker />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
