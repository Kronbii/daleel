# Deployment Guide

## 🚀 Quick Start: Migrate Your Local Database to Cloud

**Yes, you need a cloud database** - Vercel can't access your local database.

### Simple 3-Step Process:

1. **Create a free cloud database** (takes 2 minutes)
   - Go to https://supabase.com (recommended) or https://neon.tech
   - Sign up and create a new project
   - Copy the connection string (looks like `postgresql://postgres:password@host:5432/postgres`)

2. **Run the migration script** (copies everything from local to cloud)
   ```bash
   # Set your production database URL
   export DATABASE_URL="postgresql://postgres:password@your-cloud-db-host:5432/postgres"
   
   # Run the automated migration
   ./scripts/migrate-db-to-production.sh
   ```
   This will:
   - Export all your local data
   - Create all tables in the cloud database
   - Import all your data to the cloud

3. **Set it in Vercel**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` with your cloud database connection string
   - Redeploy

**That's it!** Your local database is now in the cloud and Vercel can access it.

---

## 🗄️ Database Setup for Production

**Important**: Your local database data does NOT get deployed. You need a separate production database.

**Yes, you need a cloud database** - Vercel can't access your local database. You'll need to:
1. Create a cloud database (free options available)
2. Migrate your local data to the cloud database
3. Point Vercel to the cloud database

### Step 1: Choose a Database Provider

Recommended options:

1. **Supabase** (Free tier available, easy setup)
   - https://supabase.com
   - Free tier: 500MB database, 2GB bandwidth
   - Includes PostgreSQL + dashboard

2. **Neon** (Serverless PostgreSQL, free tier)
   - https://neon.tech
   - Free tier: 0.5GB storage
   - Auto-scaling, great for Vercel

3. **Railway** (Simple, good free tier)
   - https://railway.app
   - Free tier: $5 credit/month
   - Easy PostgreSQL setup

4. **Vercel Postgres** (Integrated with Vercel)
   - https://vercel.com/storage/postgres
   - Directly integrated
   - Pay-as-you-go

### Step 2: Create Production Database

#### Option A: Using Supabase (Recommended for beginners)

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for database to be created
4. Go to **Settings** → **Database**
5. Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

#### Option B: Using Neon

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string from the dashboard

### Step 3: Run Migrations on Production Database

You need to apply your database schema to the production database:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="postgresql://user:password@your-production-db-host:5432/database"

# Run migrations (from project root)
pnpm prisma:migrate:deploy
```

Or from the db package:
```bash
cd packages/db
pnpm prisma:migrate:deploy
```

**Important**: 
- Use `prisma migrate deploy` (not `migrate dev`) for production
- This applies all migrations without creating new ones
- Make sure `DATABASE_URL` points to your production database before running!

### Step 4: Seed Production Database (Optional)

If you want to add initial data to production:

```bash
# Make sure DATABASE_URL points to production
export DATABASE_URL="postgresql://user:password@your-production-db-host:5432/database"

# Run seed script
pnpm seed
```

**⚠️ Warning**: Only seed if you want test data. For real production, you'll add data through your admin interface.

### Step 5: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

   ```
   DATABASE_URL = postgresql://user:password@your-production-db-host:5432/database
   NEXTAUTH_URL = https://your-app.vercel.app
   NEXTAUTH_SECRET = (generate a new one: openssl rand -base64 32)
   NODE_ENV = production
   ```

4. Make sure to set them for **Production** environment
5. Redeploy your app

### Step 6: Verify Production Database

After deployment:

1. Check Vercel logs to ensure database connection works
2. Visit your production site
3. Test that pages load (they'll be empty until you add data)

## 🔄 Migrating Data from Local to Production

If you have important data in your local database that you want in production:

### Option 1: Automated Migration Script (Easiest) ⭐

We've created a script that does everything for you:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="postgresql://user:password@your-production-db-host:5432/database"

# Run the migration script
./scripts/migrate-db-to-production.sh
```

This script will:
1. ✅ Export your local database
2. ✅ Apply migrations to production
3. ✅ Import all your data to production
4. ✅ Clean up temporary files

**Make sure your `.env` file has your local `DATABASE_URL` set!**

### Option 2: Manual Export/Import

```bash
# Step 1: Export from local database
./scripts/export-local-db.sh local_backup.sql

# Step 2: Apply migrations to production
export DATABASE_URL="postgresql://user:password@your-production-host:5432/database"
pnpm prisma:migrate:deploy

# Step 3: Import to production
psql -h your-production-host -U user -d database < local_backup.sql
```

### Option 3: Using Prisma Studio (Manual, for small datasets)

1. Connect Prisma Studio to production:
   ```bash
   DATABASE_URL="your-production-url" pnpm prisma:studio
   ```
2. Manually copy important records from local to production

### Option 4: Direct pg_dump/psql

```bash
# Export from local
pg_dump -h localhost -U postgres -d daleel --no-owner --no-acl > local_backup.sql

# Import to production
psql -h your-production-host -U user -d database < local_backup.sql
```

## 📋 Deployment Checklist

Before deploying:

- [ ] Production database created
- [ ] Migrations run on production database (`prisma migrate deploy`)
- [ ] `DATABASE_URL` set in Vercel environment variables
- [ ] `NEXTAUTH_URL` set to your production domain
- [ ] `NEXTAUTH_SECRET` generated and set (use a new one, not your local one)
- [ ] Test database connection works
- [ ] Code deployed to Vercel
- [ ] Verify production site loads

## 🔐 Security Notes

1. **Never commit** `.env` files or database URLs to git
2. **Use different secrets** for production (don't reuse local `NEXTAUTH_SECRET`)
3. **Enable SSL** for database connections (most providers do this by default)
4. **Use connection pooling** for production (most providers include this)

## 🆘 Troubleshooting

### "Can't connect to database"
- Check `DATABASE_URL` is correct in Vercel
- Verify database allows connections from Vercel IPs
- Check if database requires SSL (add `?sslmode=require` to connection string)

### "Migration failed"
- Make sure you're using `prisma migrate deploy` (not `migrate dev`)
- Check database user has permissions to create tables
- Verify connection string is correct

### "Empty data on production"
- This is normal! Your production database starts empty
- Add data through your admin interface or seed script
- Local data stays local unless you explicitly migrate it

