#!/bin/bash
# Script to migrate local database to production database
# Usage: ./scripts/migrate-db-to-production.sh

set -e  # Exit on error

echo "🔄 Database Migration Script"
echo "=============================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set your production DATABASE_URL:"
  echo "  export DATABASE_URL='postgresql://user:password@host:5432/database'"
  echo ""
  echo "Or run:"
  echo "  DATABASE_URL='your-production-url' ./scripts/migrate-db-to-production.sh"
  exit 1
fi

# Check if local DATABASE_URL exists in .env
if [ -f .env ]; then
  LOCAL_DB=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  if [ -n "$LOCAL_DB" ]; then
    echo "📋 Found local DATABASE_URL in .env"
    echo ""
  fi
fi

echo "⚠️  WARNING: This will migrate data from your LOCAL database to PRODUCTION"
echo "   Make sure your DATABASE_URL points to PRODUCTION, not local!"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "📦 Step 1: Exporting local database..."
if [ -z "$LOCAL_DB" ]; then
  echo "Please enter your local DATABASE_URL:"
  read -p "Local DATABASE_URL: " LOCAL_DB
fi

# Extract connection details for pg_dump
# Format: postgresql://user:password@host:port/database
LOCAL_CONN=$(echo "$LOCAL_DB" | sed 's|postgresql://||')
LOCAL_USER=$(echo "$LOCAL_CONN" | cut -d ':' -f1)
LOCAL_PASS=$(echo "$LOCAL_CONN" | cut -d ':' -f2 | cut -d '@' -f1)
LOCAL_HOST=$(echo "$LOCAL_CONN" | cut -d '@' -f2 | cut -d ':' -f1)
LOCAL_PORT=$(echo "$LOCAL_CONN" | cut -d ':' -f3 | cut -d '/' -f1)
LOCAL_DBNAME=$(echo "$LOCAL_CONN" | cut -d '/' -f2)

# Export local database
echo "Exporting from: $LOCAL_HOST:$LOCAL_PORT/$LOCAL_DBNAME"
PGPASSWORD="$LOCAL_PASS" pg_dump -h "$LOCAL_HOST" -p "${LOCAL_PORT:-5432}" -U "$LOCAL_USER" -d "$LOCAL_DBNAME" --no-owner --no-acl > /tmp/daleel_local_backup.sql

if [ $? -ne 0 ]; then
  echo "❌ Failed to export local database"
  exit 1
fi

echo "✅ Local database exported to /tmp/daleel_local_backup.sql"
echo ""

echo "📤 Step 2: Applying schema migrations to production..."
cd packages/db
DATABASE_URL="$DATABASE_URL" pnpm prisma:migrate:deploy
cd ../..

if [ $? -ne 0 ]; then
  echo "❌ Failed to run migrations"
  exit 1
fi

echo "✅ Migrations applied"
echo ""

echo "📥 Step 3: Importing data to production database..."
# Extract production connection details
PROD_CONN=$(echo "$DATABASE_URL" | sed 's|postgresql://||')
PROD_USER=$(echo "$PROD_CONN" | cut -d ':' -f1)
PROD_PASS=$(echo "$PROD_CONN" | cut -d ':' -f2 | cut -d '@' -f1)
PROD_HOST=$(echo "$PROD_CONN" | cut -d '@' -f2 | cut -d ':' -f1)
PROD_PORT=$(echo "$PROD_CONN" | cut -d ':' -f3 | cut -d '/' -f1)
PROD_DBNAME=$(echo "$PROD_CONN" | cut -d '/' -f2)

echo "Importing to: $PROD_HOST:${PROD_PORT:-5432}/$PROD_DBNAME"
PGPASSWORD="$PROD_PASS" psql -h "$PROD_HOST" -p "${PROD_PORT:-5432}" -U "$PROD_USER" -d "$PROD_DBNAME" < /tmp/daleel_local_backup.sql

if [ $? -ne 0 ]; then
  echo "❌ Failed to import data"
  echo "You may need to manually fix conflicts or run migrations first"
  exit 1
fi

echo ""
echo "✅ Migration complete!"
echo ""
echo "🧹 Cleaning up..."
rm -f /tmp/daleel_local_backup.sql
echo ""
echo "✨ Your local database has been migrated to production!"
echo ""
echo "Next steps:"
echo "1. Set DATABASE_URL in Vercel environment variables"
echo "2. Redeploy your app"
echo "3. Verify data appears on your production site"

