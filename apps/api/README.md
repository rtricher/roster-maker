# Roster Maker - API

Backend API for roster management and game tracking.

## Features

- REST API for roster operations
- Game statistics tracking
- User authentication (coming soon)
- Data persistence with Supabase

## Development

```bash
# Start development server with auto-reload
pnpm dev

# Build TypeScript
pnpm build

# Start production server
pnpm start
```

API will run on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Rosters
- `GET /api/rosters` - List all rosters
- `POST /api/rosters` - Create a new roster
- `GET /api/rosters/:id` - Get roster details
- `PUT /api/rosters/:id` - Update roster
- `DELETE /api/rosters/:id` - Delete roster

### Games
- `POST /api/games` - Record game stats
- `GET /api/games/:rosterId` - Get game history

## Stack

- Node.js
- Express.js
- TypeScript
- Supabase (PostgreSQL)
