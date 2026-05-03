import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RosterBuilder from './pages/RosterBuilder'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<RosterBuilder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
