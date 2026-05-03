# Roster Maker

Tabletop wargame roster builder and game-day companion for Warhammer 40K and other tabletop wargames.

## 📋 Features (In Progress)

### 🎨 Web App (Roster Builder)
- Create and manage rosters
- Track unit costs and composition
- Export rosters (JSON, PDF)
- User authentication and roster storage

### 📱 Mobile Web App (Game-Day Tracker)
- Real-time game statistics
- Turn tracker and timer
- Unit health/casualty tracking
- Notes and battle log
- Accessible on any device

### ⚙️ Backend API
- Secure data storage
- User authentication
- Roster management
- Game statistics tracking

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- TailwindCSS for styling
- Responsive design (web & mobile)

**Backend:**
- Node.js + Express
- SQLite (local) / Supabase (production)
- RESTful API

**Hosting (100% FREE):**
- Frontend: Vercel or Netlify
- Backend: Railway or Render
- Database: Supabase (free tier)

## 📁 Project Structure

```
roster-maker/
├── apps/
│   ├── web/                 # Desktop roster builder
│   ├── mobile/              # Mobile game-day tracker
│   └── api/                 # Node.js Express backend
├── packages/
│   ├── shared/              # Shared types & utilities
│   └── database/            # Database schemas & migrations
├── pnpm-workspace.yaml      # Monorepo configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (install with `npm i -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Individual app development
cd apps/web && pnpm dev      # Roster builder on http://localhost:5173
cd apps/mobile && pnpm dev   # Game tracker on http://localhost:5174
cd apps/api && pnpm dev      # API on http://localhost:3000
```

### Environment Setup

1. Copy `.env.example` to `.env` in each app
2. Configure Supabase credentials (see SETUP.md)
3. Run database migrations

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Initial project setup
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [API Documentation](./apps/api/README.md) - API endpoints
- [Development Guide](./DEVELOPMENT.md) - Contributing guidelines

## 📝 Development Roadmap

See [GitHub Issues](https://github.com/rtricher/roster-maker/issues) for detailed feature roadmap and progress tracking.

### Phase 1: Core (In Progress)
- [ ] Project structure & setup
- [ ] Basic roster builder UI
- [ ] API scaffolding
- [ ] Database schema

### Phase 2: MVP
- [ ] User authentication
- [ ] Save/load rosters
- [ ] Game tracker interface
- [ ] Basic stats tracking

### Phase 3: Enhancement
- [ ] Export functionality (JSON, PDF)
- [ ] Advanced filtering & search
- [ ] Mobile optimization
- [ ] Offline support

### Phase 4: Scale
- [ ] Battle history & analytics
- [ ] Multiplayer features
- [ ] Community rosters
- [ ] Third-party integrations

## 🤝 Contributing

This is a personal project, but contributions and feedback are welcome!

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🎮 About

Built for Warhammer 40K enthusiasts and tabletop wargaming communities. By gamers, for gamers.

---

**Last Updated:** May 3, 2026
