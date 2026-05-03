# Roster Maker - Database

Database schemas and migrations for Roster Maker.

## Setup

### Supabase (Recommended)

1. Create a free Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the migration script (see below)

### Local SQLite

For local development, SQLite is automatically used. No setup needed.

## Running Migrations

```bash
pnpm migrate
```

This will execute all database schema migrations.

## Schema

- **users** - User accounts
- **rosters** - Army rosters
- **units** - Individual units in rosters
- **game_stats** - Game statistics and tracking

See `src/schema.ts` for full SQL definitions.
