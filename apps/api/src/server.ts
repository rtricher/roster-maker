import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rosters endpoints (placeholder)
app.get('/api/rosters', (req, res) => {
  res.json({ rosters: [] })
})

app.post('/api/rosters', (req, res) => {
  const { name } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Roster name is required' })
  }
  res.status(201).json({ id: '1', name, createdAt: new Date().toISOString() })
})

// Game stats endpoints (placeholder)
app.post('/api/games', (req, res) => {
  const { rosterId, turn, playerOnePoints, playerTwoPoints } = req.body
  res.status(201).json({
    id: '1',
    rosterId,
    turn,
    playerOnePoints,
    playerTwoPoints,
    createdAt: new Date().toISOString(),
  })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})
