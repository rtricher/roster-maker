# Roster Maker - Shared

Shared types, interfaces, and utilities used across all Roster Maker apps.

## Exports

### Types
- `Unit` - Individual unit in a roster
- `Roster` - Complete army roster
- `GameStats` - Game statistics and tracking
- `User` - User account information
- `ApiResponse` - Standard API response format
- `PaginatedResponse` - Paginated API responses

### Utilities
- `calculateRosterPoints()` - Calculate total points in a roster
- `formatDate()` - Format date for display
- `formatTime()` - Format time for display
- `generateId()` - Generate unique IDs

## Usage

```typescript
import { Roster, calculateRosterPoints } from '@roster-maker/shared'

const myRoster: Roster = {
  // ...
}

const total = calculateRosterPoints(myRoster.units)
```
