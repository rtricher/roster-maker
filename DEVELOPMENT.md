# Development Guide

Contributions and improvements are welcome! Here's how to develop Roster Maker.

## Code Structure

### Apps

**apps/web** - Desktop Roster Builder
- Entry: `src/main.tsx`
- Main component: `src/App.tsx`
- Pages: `src/pages/`
- Styling: TailwindCSS (configured in `index.css`)

**apps/mobile** - Mobile Game Tracker
- Entry: `src/main.tsx`
- Main component: `src/App.tsx`
- Pages: `src/pages/`
- Responsive design with mobile-first TailwindCSS

**apps/api** - Backend Server
- Entry: `src/server.ts`
- Routes: Modular Express route handlers
- Middleware: CORS, JSON parsing

### Packages

**packages/shared** - Shared Types & Utilities
- `src/types.ts` - TypeScript interfaces
- `src/utils.ts` - Helper functions
- Used by all apps via path alias `@shared`

**packages/database** - Database Schemas
- `src/schema.ts` - SQL table definitions
- Migration scripts for Supabase

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-new-feature
```

### 2. Make Changes

Make your changes in the appropriate app:

```bash
# Update shared types if needed
cd packages/shared
# Edit src/types.ts or src/utils.ts

# Implement in web app
cd apps/web
# Add new page in src/pages/
# Update component in src/
```

### 3. Test Locally

```bash
# Start dev servers
pnpm dev

# Visit http://localhost:5173 (web) or 5174 (mobile)
# Test your changes
```

### 4. Lint Code

```bash
# Check for issues
pnpm lint

# Fix automatically
pnpm lint --fix
```

### 5. Build & Test

```bash
# Build all apps
pnpm build

# Check for type errors
cd apps/web && tsc --noEmit
```

### 6. Commit Changes

```bash
git add .
git commit -m "feat: add new roster filter"
```

### 7. Push & Create PR

```bash
git push origin feature/my-new-feature
# Create PR on GitHub
```

## Code Style

### TypeScript
- Use strict mode (enabled in tsconfig.json)
- Define types for all functions
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types

Example:

```typescript
import { useState } from 'react'

interface RosterListProps {
  rosters: Roster[]
  onSelect: (id: string) => void
}

export function RosterList({ rosters, onSelect }: RosterListProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      {rosters.map((roster) => (
        <button key={roster.id} onClick={() => onSelect(roster.id)}>
          {roster.name}
        </button>
      ))}
    </div>
  )
}
```

### TailwindCSS Classes
- Use mobile-first approach (start with mobile, add `md:`, `lg:` for larger screens)
- Don't create custom CSS unless necessary
- Use consistent spacing: `p-4`, `mb-6`, etc.

## Adding New Features

### Add a Roster Filter

1. **Update types** in `packages/shared/src/types.ts`:
```typescript
export interface Roster {
  // ... existing fields
  faction: string // new field
}
```

2. **Create UI component** in `apps/web/src/components/`:
```typescript
export function FactionFilter({ onFilter }) {
  return (
    <select onChange={(e) => onFilter(e.target.value)}>
      <option>All</option>
      <option>Imperium</option>
      <option>Chaos</option>
    </select>
  )
}
```

3. **Add API endpoint** in `apps/api/src/server.ts`:
```typescript
app.get('/api/rosters', (req, res) => {
  const faction = req.query.faction
  // Filter rosters by faction
  res.json({ rosters: filtered })
})
```

4. **Use in page** in `apps/web/src/pages/RosterBuilder.tsx`

### Add a Game Stat Tracker

1. **Update shared types**
2. **Create mobile component**
3. **Add API endpoint**
4. **Test locally**

## Useful Commands

```bash
# Development
pnpm dev              # Start all apps
pnpm build            # Build all apps
pnpm lint             # Check code style
pnpm lint --fix       # Auto-fix issues

# Monorepo
pnpm -r build         # Build all packages
pnpm add pkg -w apps/web  # Add package to web app
pnpm remove pkg -w apps/web  # Remove package

# Specific app
cd apps/web && pnpm dev    # Dev web app only
cd apps/api && pnpm dev    # Dev API only
```

## Project Structure Quick Reference

```
apps/web/
├── src/
│   ├── App.tsx         # Main router
│   ├── main.tsx        # Entry point
│   ├── index.css       # Styles
│   ├── pages/          # Page components
│   └── components/     # Reusable components
├── vite.config.ts
├── tsconfig.json
├── package.json
└── index.html

apps/api/
├── src/
│   └── server.ts       # Express server
├── tsconfig.json
├── package.json

packages/shared/
├── src/
│   ├── types.ts        # Shared interfaces
│   ├── utils.ts        # Helper functions
│   └── index.ts        # Exports
├── tsconfig.json
├── package.json
```

## Debugging

### Browser DevTools
1. Open in Chrome: F12 or Right-click → Inspect
2. Console: Check for errors
3. Network: Monitor API calls
4. React DevTools: Inspect components

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/apps/web"
    }
  ]
}
```

### API Debugging

```bash
# Test API endpoint
curl http://localhost:3000/api/health

# With data
curl -X POST http://localhost:3000/api/rosters \
  -H "Content-Type: application/json" \
  -d '{"name": "My Roster"}'
```

## Common Issues

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Type errors in VS Code
```bash
# Rebuild TypeScript
pnpm build
```

### Port conflicts
```bash
# Kill process using port
lsof -ti:5173 | xargs kill -9
```

## Performance Tips

1. **Code splitting**: Use React.lazy() for pages
2. **Optimize images**: Use WebP format
3. **Bundle size**: Check with `pnpm build`
4. **API calls**: Cache responses when possible
5. **Database**: Use indexes for common queries

## Testing (Future)

When ready to add tests:

```bash
# Add Vitest
pnpm add -D vitest

# Add testing library
pnpm add -D @testing-library/react
```

Create `*.test.ts` files alongside source files.

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -m "chore: release v0.2.0"`
4. Tag: `git tag v0.2.0`
5. Push: `git push origin main --tags`
6. Deploy to production

---

**Happy coding! 🚀**
