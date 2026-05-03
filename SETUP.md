# Setup Guide

This guide will help you set up the Roster Maker project for local development.

## Prerequisites

- **Node.js 18+** - Download from https://nodejs.org/
- **pnpm** - Install with `npm install -g pnpm`
- **Git** - For cloning and version control
- **A code editor** - VS Code recommended (https://code.visualstudio.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/rtricher/roster-maker.git
cd roster-maker
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

For **local development**, you can leave the defaults as-is. The apps will:
- **Web App**: Run on `http://localhost:5173`
- **Mobile App**: Run on `http://localhost:5174`
- **API**: Run on `http://localhost:3000`

### 4. Start Development Servers

Start all apps at once:

```bash
pnpm dev
```

Or start individual apps:

```bash
# Terminal 1: Web App (Roster Builder)
cd apps/web && pnpm dev

# Terminal 2: Mobile App (Game Tracker)
cd apps/mobile && pnpm dev

# Terminal 3: API
cd apps/api && pnpm dev
```

## Accessing the Apps

### Roster Builder (Desktop)
- URL: http://localhost:5173
- Build and manage WH40K rosters
- Add units and track points

### Game Tracker (Mobile/Responsive)
- URL: http://localhost:5174
- Track game statistics
- Real-time turn tracking
- Player kill points

### API Server
- URL: http://localhost:3000
- Health check: http://localhost:3000/api/health

## Project Structure

```
roster-maker/
├── apps/
│   ├── web/          # Desktop roster builder (React + Vite)
│   ├── mobile/       # Mobile game tracker (React + Responsive)
│   └── api/          # Backend API (Node.js + Express)
├── packages/
│   ├── shared/       # Shared types and utilities
│   └── database/     # Database schemas
├── package.json      # Monorepo root
├── pnpm-workspace.yaml
├── tsconfig.json
└── .env.example      # Environment variables template
```

## Useful Commands

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Build all apps for production
pnpm build

# Lint all code
pnpm lint

# Add a new package to a specific app
pnpm add react -w apps/web

# Add a package to the shared package
pnpm add lodash -w packages/shared
```

## Next Steps

1. ✅ **Local Development** - You now have the apps running locally
2. 📝 **Explore the Code** - Check out the app structure in `apps/web`, `apps/mobile`, `apps/api`
3. 🗄️ **Database Setup** - See [Deployment Guide](./DEPLOYMENT.md) for Supabase setup
4. 🚀 **Deploy** - Follow [Deployment Guide](./DEPLOYMENT.md) to deploy to production

## Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" errors:

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change the port in vite.config.ts
```

### Dependencies Not Installing

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
pnpm build

# Check for type errors
cd apps/web && tsc --noEmit
```

## Support

For issues or questions:
1. Check [GitHub Issues](https://github.com/rtricher/roster-maker/issues)
2. Review [API Documentation](./apps/api/README.md)
3. Check individual app READMEs

---

**Happy developing! 🎮**
