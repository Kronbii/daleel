# Migrating Local Database to Neon

Guide to migrate your local PostgreSQL database to Neon (serverless PostgreSQL) for production deployment.

## Overview

This guide covers:
1. Setting up a Neon database
2. Running migrations on Neon
3. Exporting data from local database
4. Importing data to Neon
5. Verifying the migration

## Prerequisites

- Local database is set up and contains data (see [Setup Guide](./setup.md))
- Neon account created (sign up at https://neon.tech)
- PostgreSQL client tools installed (`psql`, `pg_dump`)
- `DATABASE_URL` configured in `backend/.env`

## Step 1: Create Neon Database

1. **Sign in to Neon:**
   - Go to https://console.neon.tech
   - Sign in or create an account

2. **Create a new project:**
   - Click "New Project"
   - Choose a name (e.g., "daleel-production")
   - Select a region (closest to your users)
   - Click "Create Project"

3. **Get your connection string:**
   - After project creation, you'll see a connection string
   - Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
   - **Save this connection string** - you'll need it later

4. **Copy the connection string:**
   ```bash
   # Example format
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Update Migration Scripts

The migration scripts in `scripts/` need to be updated for the new structure. Use the updated script below or run commands manually.

## Step 3: Run Migrations on Neon

### Option A: Using Updated Script

First, update the script to work with the new structure (see below), then:

```bash
./scripts/migrate-to-neon.sh
```

### Option B: Manual Migration

```bash
# Set your Neon DATABASE_URL
export NEON_DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Run migrations
cd backend
DATABASE_URL="$NEON_DATABASE_URL" npm run prisma:migrate:deploy
```

This applies all migrations to your Neon database, creating the schema.

## Step 4: Export Local Database

### Option A: Using Export Script

```bash
./scripts/export-local-db.sh [output-file.sql]
```

This creates a SQL dump of your local database.

### Option B: Manual Export

```bash
# Load local DATABASE_URL from backend/.env
cd backend
source .env  # or export DATABASE_URL manually

# Export database
pg_dump "$DATABASE_URL" --no-owner --no-acl > ../local_backup.sql
```

Or with connection details:

```bash
# Parse connection string
# Format: postgresql://user:password@host:port/database

pg_dump -h localhost -p 5432 -U postgres -d daleel --no-owner --no-acl > local_backup.sql
```

## Step 5: Import Data to Neon

### Option A: Using Migration Script

The `migrate-to-neon.sh` script can handle this automatically.

### Option B: Manual Import

```bash
# Set Neon DATABASE_URL
export NEON_DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Import data
psql "$NEON_DATABASE_URL" < local_backup.sql
```

**Note:** You may see warnings about existing objects - this is normal if you've already run migrations.

## Step 6: Verify Migration

### Check Data Counts

```bash
# Connect to Neon
psql "$NEON_DATABASE_URL"

# Run queries
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Candidate";
SELECT COUNT(*) FROM "District";
SELECT COUNT(*) FROM "Source";
SELECT COUNT(*) FROM "ElectoralCenter";
```

### Test with Prisma Studio

```bash
cd backend
DATABASE_URL="$NEON_DATABASE_URL" npm run prisma:studio
```

This opens Prisma Studio connected to your Neon database.

### Test with API

```bash
# Update backend/.env temporarily
DATABASE_URL="$NEON_DATABASE_URL"

# Start backend
cd backend
npm run dev

# Test endpoints
curl http://localhost:4000/api/public/candidates
curl http://localhost:4000/api/public/districts
```

## Step 7: Update Environment Variables

### Backend (Production)

Set `DATABASE_URL` in your production environment:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` with your Neon connection string
3. Redeploy

**Other platforms:**
- Set `DATABASE_URL` environment variable
- Use your Neon connection string

### Frontend (Production)

Ensure `API_URL` points to your backend:

```env
API_URL="https://your-backend-url.com"
```

## Updated Migration Script

Here's an updated version of `scripts/migrate-to-neon.sh` for the new structure:

```bash
#!/bin/bash
# Script to migrate local database to Neon
# Usage: ./scripts/migrate-to-neon.sh

set -e

echo "🔄 Migrating Database to Neon"
echo "=============================="
echo ""

# Step 1: Get Neon DATABASE_URL
if [ -z "$NEON_DATABASE_URL" ]; then
  echo "📋 Step 1: Get your Neon DATABASE_URL"
  echo "   Go to: https://console.neon.tech"
  echo "   Copy the connection string from your project"
  echo ""
  read -p "Paste your Neon DATABASE_URL here: " NEON_DATABASE_URL
  echo ""
fi

# Step 2: Run migrations on Neon
echo "📤 Step 2: Running migrations on Neon..."
cd backend
DATABASE_URL="$NEON_DATABASE_URL" npm run prisma:migrate:deploy
cd ..

if [ $? -ne 0 ]; then
  echo "❌ Failed to run migrations"
  exit 1
fi

echo "✅ Migrations applied to Neon"
echo ""

# Step 3: Ask if they want to migrate data
read -p "Do you want to migrate data from your local database? (yes/no): " migrate_data

if [ "$migrate_data" = "yes" ]; then
  echo ""
  echo "📦 Step 3: Exporting local database..."
  
  # Check for local DATABASE_URL
  if [ -f backend/.env ]; then
    LOCAL_DB=$(grep "^DATABASE_URL=" backend/.env | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
  fi
  
  if [ -z "$LOCAL_DB" ]; then
    echo "Please enter your local DATABASE_URL:"
    read -p "Local DATABASE_URL: " LOCAL_DB
  fi
  
  # Export local database
  echo "Exporting from local database..."
  BACKUP_FILE="/tmp/daleel_local_backup_$(date +%Y%m%d_%H%M%S).sql"
  
  # Parse connection string
  LOCAL_CONN=$(echo "$LOCAL_DB" | sed 's|postgresql://||')
  LOCAL_USER=$(echo "$LOCAL_CONN" | cut -d ':' -f1)
  LOCAL_PASS=$(echo "$LOCAL_CONN" | cut -d ':' -f2 | cut -d '@' -f1)
  LOCAL_HOST=$(echo "$LOCAL_CONN" | cut -d '@' -f2 | cut -d ':' -f1)
  LOCAL_PORT=$(echo "$LOCAL_CONN" | cut -d ':' -f3 | cut -d '/' -f1)
  LOCAL_DBNAME=$(echo "$LOCAL_CONN" | cut -d '/' -f2 | cut -d '?' -f1)
  
  PGPASSWORD="$LOCAL_PASS" pg_dump -h "$LOCAL_HOST" -p "${LOCAL_PORT:-5432}" -U "$LOCAL_USER" -d "$LOCAL_DBNAME" --no-owner --no-acl --data-only > "$BACKUP_FILE"
  
  if [ $? -ne 0 ]; then
    echo "❌ Failed to export local database"
    exit 1
  fi
  
  echo "✅ Local database exported"
  echo ""
  
  # Import to Neon
  echo "📥 Step 4: Importing data to Neon..."
  
  # Use the connection string directly with psql
  echo "Importing to Neon database..."
  psql "$NEON_DATABASE_URL" < "$BACKUP_FILE"
  
  if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Some data may have failed to import (this is normal if tables already exist)"
    echo "   You may need to manually import specific tables"
  else
    echo "✅ Data imported successfully"
  fi
  
  # Cleanup
  rm -f "$BACKUP_FILE"
  echo ""
fi

echo "✨ Migration complete!"
echo ""
echo "Next steps:"
echo "1. Set DATABASE_URL in your production environment (Vercel, etc.)"
echo "2. Redeploy your backend application"
echo "3. Test your production API endpoints"
echo ""
```

## Troubleshooting

### Connection Issues

**Error: "SSL connection required"**
- Neon requires SSL. Ensure your connection string includes `?sslmode=require`
- Example: `postgresql://user:pass@host.neon.tech/db?sslmode=require`

**Error: "Connection timeout"**
- Check your firewall settings
- Verify the connection string is correct
- Try connecting from a different network

### Migration Issues

**Error: "Migration already applied"**
- This is normal if you've run migrations before
- Use `prisma migrate deploy` (not `prisma migrate dev`) for production

**Error: "Table already exists"**
- The schema might already be created
- Try importing only data: `pg_dump --data-only`

### Data Import Issues

**Error: "Foreign key constraint violation"**
- Import in order: tables without foreign keys first
- Or import with `--disable-triggers` flag (use with caution)

**Error: "Duplicate key violation"**
- Data might already exist
- Use `--on-conflict-do-nothing` or clean database first

### Performance Issues

**Slow import:**
- Neon free tier has connection limits
- Import during off-peak hours
- Consider importing in batches for large datasets

## Alternative: Using Neon Branching

Neon supports database branching (like Git branches):

1. Create a branch from your main database
2. Run migrations on the branch
3. Test the branch
4. Merge to main when ready

See [Neon documentation](https://neon.tech/docs) for details.

## Security Best Practices

1. **Never commit connection strings** to Git
2. **Use environment variables** for all database URLs
3. **Rotate passwords** regularly
4. **Use connection pooling** in production
5. **Enable SSL/TLS** (required by Neon)
6. **Limit IP access** if possible (Neon allows IP restrictions)

## Next Steps

- Set up production environment variables
- Configure connection pooling
- Set up database backups
- Monitor database performance
- Read [Setup Guide](./setup.md) for local development
- Read [Seeding Guide](./seeding.md) for database seeding

## Quick Reference

```bash
# Export local database
./scripts/export-local-db.sh backup.sql

# Run migrations on Neon
cd backend
DATABASE_URL="$NEON_DATABASE_URL" npm run prisma:migrate:deploy

# Import data to Neon
psql "$NEON_DATABASE_URL" < backup.sql

# Verify migration
psql "$NEON_DATABASE_URL" -c "SELECT COUNT(*) FROM \"Candidate\";"
```

