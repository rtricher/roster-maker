# Deployment Guide

This guide covers deploying Roster Maker to production using free platforms.

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         Vercel/Netlify (Frontend)               │
│  ├── Web App (Roster Builder)                   │
│  └── Mobile App (Game Tracker)                  │
└──────────���───────┬──────────────────────────────┘
                   │ HTTPS API Calls
                   ▼
┌─────────────────────────────────────────────────┐
│      Railway/Render (Backend API)               │
│      ├── Express.js Server                      │
│      └── REST Endpoints                         │
└──────────────────┬──────────────────────────────┘
                   │ SQL Queries
                   ▼
┌─────────────────────────────────────────────────┐
│     Supabase (Database)                         │
│     ├── PostgreSQL Database                     │
│     ├── Real-time Subscriptions                 │
│     └── Authentication (JWT)                    │
└─────────────────────────────────────────────────┘
```

## Step 1: Set Up Database (Supabase)

### Create Supabase Project

1. Go to https://supabase.com
2. Sign up/login
3. Click "Create new project"
4. Fill in project details:
   - Name: `roster-maker`
   - Region: Choose closest to you
   - Password: Create a strong password
5. Click "Create new project"

### Get API Credentials

1. In Supabase dashboard, go to **Settings > API**
2. Copy these values:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (for API only)

### Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy and paste the schema from `packages/database/src/schema.ts`
4. Execute the queries

Or run migrations:

```bash
pnpm --filter @roster-maker/database migrate
```

## Step 2: Deploy Backend API

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub account
4. Select `rtricher/roster-maker` repository
5. Choose `apps/api` as the root directory
6. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `SUPABASE_URL`: (from Supabase)
   - `SUPABASE_ANON_KEY`: (from Supabase)
   - `SUPABASE_SERVICE_ROLE_KEY`: (from Supabase)
7. Click "Deploy"

### Option B: Render

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `roster-maker-api`
   - Environment: `Node`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start`
   - Root Directory: `apps/api`
5. Add same environment variables as Railway
6. Click "Create Web Service"

### Get API URL

After deployment, you'll get a public URL like:
```
https://roster-maker-api.railway.app
```

Save this for the next step.

## Step 3: Deploy Frontend Apps

### Deploy Web App (Roster Builder)

#### With Vercel (Recommended)

1. Go to https://vercel.com
2. Click "Import Project"
3. Paste: `https://github.com/rtricher/roster-maker`
4. Configure:
   - Framework: `Vite`
   - Root Directory: `apps/web`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: (your Railway/Render URL)
   - `VITE_SUPABASE_URL`: (from Supabase)
   - `VITE_SUPABASE_ANON_KEY`: (from Supabase)
6. Click "Deploy"

#### With Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   - Base directory: `apps/web`
   - Build command: `pnpm build`
   - Publish directory: `dist`
5. Add same environment variables
6. Deploy

### Deploy Mobile App (Game Tracker)

Repeat the same steps as Web App but:
- Root Directory: `apps/mobile`
- Add to a new Vercel/Netlify project (separate URL)

## Step 4: Update Environment Variables

After all deployments, update your `.env` file:

```env
# Frontend
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-api.railway.app

# Backend (set in Railway/Render dashboard)
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
PORT=3000
```

## Step 5: Test Deployment

1. **Web App**: Visit your Vercel/Netlify URL for web app
2. **Mobile App**: Visit your second Vercel/Netlify URL for mobile
3. **API Health**: Visit `https://your-api.railway.app/api/health`

You should see:
```json
{"status":"ok","timestamp":"2026-05-03T04:00:00.000Z"}
```

## Production URLs

Once deployed, you'll have:

- **Web App**: `https://roster-maker-web.vercel.app`
- **Mobile App**: `https://roster-maker-mobile.vercel.app`
- **API**: `https://roster-maker-api.railway.app`

## Cost Summary (All FREE)

| Service | Cost | Limits |
|---------|------|--------|
| Supabase | FREE | 500MB DB, 50K rows |
| Railway | FREE | 5GB/month bandwidth |
| Vercel | FREE | Unlimited deployments |
| Netlify | FREE | Unlimited deployments |
| **Total** | **$0** | **Generous limits** |

## Monitoring & Logs

### Railway Logs
```bash
railway logs
```

### Vercel Logs
- Go to Vercel dashboard → Your project → Deployments → View logs

### Supabase Monitoring
- Supabase dashboard → Logs → Backend Logs

## Next Steps

1. ✅ Database set up
2. ✅ Backend deployed
3. ✅ Frontend deployed
4. 📊 Monitor logs and errors
5. 🔐 Implement authentication (see next section)
6. 🚀 Add features and scale

## Scaling Beyond Free Tier

When you outgrow free tiers:

- **Supabase**: $10/month for 10GB database
- **Railway**: $5/month for reserved compute
- **Vercel**: Stays free (standard plan)

**Estimated cost at scale: $15-20/month**

## Troubleshooting

### API Not Responding
1. Check Railway/Render logs
2. Verify environment variables
3. Check Supabase connection

### Frontend Can't Reach API
1. Verify `VITE_API_URL` environment variable
2. Check CORS settings in API
3. Test API directly: `curl https://your-api.railway.app/api/health`

### Database Connection Issues
1. Verify Supabase credentials
2. Check firewall rules (Supabase → Settings → Security)
3. Ensure database tables exist

---

**Deployment complete! 🚀**
