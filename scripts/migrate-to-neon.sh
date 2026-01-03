#!/bin/bash
# Script to migrate local database to Neon (via Vercel)
# Usage: ./scripts/migrate-to-neon.sh

set -e

echo "🔄 Migrating Database to Neon"
echo "=============================="
echo ""

# Step 1: Get Neon DATABASE_URL
if [ -z "$NEON_DATABASE_URL" ]; then
  echo "📋 Step 1: Get your Neon DATABASE_URL"
  echo "   Go to: Vercel Dashboard → Your Project → Settings → Environment Variables"
  echo "   Copy the DATABASE_URL value"
  echo ""
  read -p "Paste your Neon DATABASE_URL here: " NEON_DATABASE_URL
  echo ""
fi

# Step 2: Run migrations on Neon
echo "📤 Step 2: Running migrations on Neon..."
cd packages/db
DATABASE_URL="$NEON_DATABASE_URL" pnpm prisma:migrate:deploy
cd ../..

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
  if [ -f .env ]; then
    LOCAL_DB=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
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
  LOCAL_DBNAME=$(echo "$LOCAL_CONN" | cut -d '/' -f2)
  
  PGPASSWORD="$LOCAL_PASS" pg_dump -h "$LOCAL_HOST" -p "${LOCAL_PORT:-5432}" -U "$LOCAL_USER" -d "$LOCAL_DBNAME" --no-owner --no-acl --data-only > "$BACKUP_FILE"
  
  if [ $? -ne 0 ]; then
    echo "❌ Failed to export local database"
    exit 1
  fi
  
  echo "✅ Local database exported"
  echo ""
  
  # Import to Neon
  echo "📥 Step 4: Importing data to Neon..."
  
  # Use the connection string directly with psql (most reliable)
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
echo "1. Verify DATABASE_URL is set in Vercel (should be auto-set by Neon)"
echo "2. Redeploy your app on Vercel"
echo "3. Test your production site"
echo ""

