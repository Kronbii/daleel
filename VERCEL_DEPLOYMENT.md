# Vercel Deployment Guide

This guide explains how to deploy the Daleel application (Next.js frontend + Express backend) to Vercel.

## Architecture

- **Frontend**: Next.js app in `frontend/` directory
- **Backend**: Express API server deployed as Vercel serverless function via `api/index.ts`
- **Shared**: TypeScript code shared between frontend and backend

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Setup Steps

### 1. Database Setup

Set up a PostgreSQL database and get the connection string:
- **Neon**: https://neon.tech (recommended for Vercel)
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

### 2. Environment Variables

In your Vercel project settings, add the following environment variables:

#### Required Variables

```
# Database
DATABASE_URL=postgresql://user:password@host:5432/daleel

# Frontend URL (your Vercel deployment URL)
FRONTEND_URL=https://your-app.vercel.app

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app

# API URL (for frontend to connect to backend)
# Leave empty or set to same domain for same-origin requests
NEXT_PUBLIC_API_URL=
```

#### Optional Variables

```
# Node environment
NODE_ENV=production

# Backend port (not used in serverless, but kept for compatibility)
PORT=4000
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. **IMPORTANT**: Configure project settings:
   - **Framework Preset**: Next.js (you may need to select this manually)
   - **Root Directory**: **Set to `frontend`** 
     - Vercel may auto-detect `backend` - change it to `frontend`
     - The `vercel.json` config file is now in the `frontend/` directory
     - The serverless function is at `frontend/api/index.ts`
   - **Build Command**: `npm run build` (auto-detected from vercel.json in frontend/)
   - **Output Directory**: `.next` (auto-detected from vercel.json)
   - **Install Command**: `cd .. && npm install` (installs from repo root to get all workspace dependencies)
4. Add all environment variables
5. Click "Deploy"

**Note**: 
- If Vercel shows "Root Directory" as `backend`, change it to `frontend`
- The install command runs from the parent directory to install all workspace dependencies (backend, frontend, shared)

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? daleel (or your choice)
# - Directory? ./
# - Override settings? No

# Set environment variables
vercel env add DATABASE_URL
vercel env add FRONTEND_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add NEXT_PUBLIC_API_URL

# Deploy to production
vercel --prod
```

### 4. Run Database Migrations

After deployment, run Prisma migrations:

```bash
# Via Vercel CLI
vercel env pull .env.local
cd backend
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Or use Vercel's built-in command (if configured)
# The postinstall script will generate Prisma client automatically
```

**Alternative: Use a migration script**

You can create a one-time migration script that runs on first deploy, or use a separate service to run migrations.

### 5. Seed Database (Optional)

If you need to seed the database:

```bash
cd backend
npx tsx src/db/seed.ts
```

Or set up a one-time seed script that runs after migrations.

## How It Works

### Request Flow

1. **Frontend requests** (e.g., `/candidates`) → Handled by Next.js
2. **API requests** (e.g., `/api/public/candidates`) → Rewritten to `/api/index.ts` serverless function
3. **Serverless function** → Express app handles the request and returns response

### File Structure

```
/
├── api/
│   └── index.ts          # Vercel serverless function wrapper
├── backend/
│   └── src/
│       └── server.ts     # Express app (modified for serverless)
├── frontend/
│   └── .next/            # Next.js build output
├── vercel.json           # Vercel configuration
└── package.json          # Root package.json with workspaces
```

### Build Process

1. `npm install` - Installs all dependencies (including workspace dependencies)
2. `postinstall` script in `backend/package.json` - Generates Prisma client
3. `npm run build:frontend` - Builds Next.js app
4. Vercel packages `api/index.ts` as serverless function

## Troubleshooting

### Issue: Prisma Client not generated

**Solution**: Ensure `postinstall` script is in `backend/package.json`:
```json
"postinstall": "prisma generate --schema=./prisma/schema.prisma"
```

### Issue: API routes return 404

**Solution**: 
- Check that `vercel.json` has the rewrite rule for `/api/:path*`
- Verify `api/index.ts` exists and exports the Express app
- Check Vercel function logs in dashboard

### Issue: CORS errors

**Solution**: 
- Set `FRONTEND_URL` environment variable to your Vercel deployment URL
- Or ensure `NEXT_PUBLIC_API_URL` is empty/relative for same-origin requests

### Issue: Database connection fails

**Solution**:
- Verify `DATABASE_URL` is set correctly in Vercel environment variables
- Check database allows connections from Vercel IPs (most cloud DBs do by default)
- Ensure database is accessible (not behind VPN/firewall)

### Issue: Build fails

**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)
- Check that `shared/` package is accessible

## Environment-Specific Configuration

### Development
- `FRONTEND_URL=http://localhost:3000`
- `NEXT_PUBLIC_API_URL=http://localhost:4000`
- `DATABASE_URL=postgresql://localhost:5432/daleel`

### Production (Vercel)
- `FRONTEND_URL=https://your-app.vercel.app`
- `NEXT_PUBLIC_API_URL=` (empty for same-origin)
- `DATABASE_URL=postgresql://...` (your production database)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

