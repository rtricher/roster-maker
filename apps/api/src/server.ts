import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// ── In-memory storage (replace with Supabase later) ──────────────
let rosters: any[] = []
let units: any[] = []
let games: any[] = []
let nextId = 1
const genId = () => String(nextId++)

// ── Health ───────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Rosters CRUD ─────────────────────────────────────────────────
app.get('/api/rosters', (_req, res) => {
  const result = rosters.map((r) => ({
    ...r,
    units: units.filter((u) => u.rosterId === r.id),
  }))
  res.json({ rosters: result })
})

app.get('/api/rosters/:id', (req, res) => {
  const roster = rosters.find((r) => r.id === req.params.id)
  if (!roster) return res.status(404).json({ error: 'Roster not found' })
  res.json({ ...roster, units: units.filter((u) => u.rosterId === roster.id) })
})

app.post('/api/rosters', (req, res) => {
  const { name, faction, detachment, maxPoints } = req.body
  if (!name) return res.status(400).json({ error: 'Roster name is required' })
  const roster = {
    id: genId(),
    name,
    faction: faction || '',
    detachment: detachment || '',
    maxPoints: maxPoints || 2000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  rosters.push(roster)
  res.status(201).json(roster)
})

app.put('/api/rosters/:id', (req, res) => {
  const idx = rosters.findIndex((r) => r.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Roster not found' })
  rosters[idx] = { ...rosters[idx], ...req.body, updatedAt: new Date().toISOString() }
  res.json(rosters[idx])
})

app.delete('/api/rosters/:id', (req, res) => {
  rosters = rosters.filter((r) => r.id !== req.params.id)
  units = units.filter((u) => u.rosterId !== req.params.id)
  res.json({ success: true })
})

// ── Units CRUD ───────────────────────────────────────────────────
app.post('/api/rosters/:id/units', (req, res) => {
  const roster = rosters.find((r) => r.id === req.params.id)
  if (!roster) return res.status(404).json({ error: 'Roster not found' })
  const unit = { id: genId(), rosterId: req.params.id, ...req.body, createdAt: new Date().toISOString() }
  units.push(unit)
  res.status(201).json(unit)
})

app.put('/api/units/:id', (req, res) => {
  const idx = units.findIndex((u) => u.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Unit not found' })
  units[idx] = { ...units[idx], ...req.body }
  res.json(units[idx])
})

app.delete('/api/units/:id', (req, res) => {
  units = units.filter((u) => u.id !== req.params.id)
  res.json({ success: true })
})

// ── Game Stats ───────────────────────────────────────────────────
app.post('/api/games', (req, res) => {
  const game = { id: genId(), ...req.body, createdAt: new Date().toISOString() }
  games.push(game)
  res.status(201).json(game)
})

app.get('/api/games/:rosterId', (req, res) => {
  const result = games.filter((g) => g.rosterId === req.params.rosterId)
  res.json({ games: result })
})

// ── Error handling ───────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`)
})
