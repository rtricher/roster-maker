/**
 * Database schema definitions
 * These define the structure for PostgreSQL (Supabase)
 */

// Users table
export const usersSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

// Rosters table
export const rostersSchema = `
  CREATE TABLE IF NOT EXISTS rosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    faction VARCHAR(255),
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

// Units table
export const unitsSchema = `
  CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL,
    count INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`

// Game stats table
export const gameStatsSchema = `
  CREATE TABLE IF NOT EXISTS game_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
    turn INTEGER NOT NULL,
    player_one_points INTEGER DEFAULT 0,
    player_two_points INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`
