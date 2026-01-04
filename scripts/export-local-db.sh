#!/bin/bash
# Simple script to export local database to SQL file
# Usage: ./scripts/export-local-db.sh [output-file.sql]

set -e

OUTPUT_FILE="${1:-./daleel_local_backup_$(date +%Y%m%d_%H%M%S).sql}"

# Load local DATABASE_URL from backend/.env
if [ -f backend/.env ]; then
  export $(grep "^DATABASE_URL=" backend/.env | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL not found in backend/.env"
  echo "Please set DATABASE_URL in your backend/.env file or export it:"
  echo "  export DATABASE_URL='postgresql://user:password@localhost:5432/daleel'"
  exit 1
fi

echo "📦 Exporting local database..."
echo "Source: $DATABASE_URL"
echo "Output: $OUTPUT_FILE"
echo ""

# Extract connection details
CONN=$(echo "$DATABASE_URL" | sed 's|postgresql://||')
USER=$(echo "$CONN" | cut -d ':' -f1)
PASS=$(echo "$CONN" | cut -d ':' -f2 | cut -d '@' -f1)
HOST=$(echo "$CONN" | cut -d '@' -f2 | cut -d ':' -f1)
PORT=$(echo "$CONN" | cut -d ':' -f3 | cut -d '/' -f1)
DBNAME=$(echo "$CONN" | cut -d '/' -f2 | cut -d '?' -f1)

PGPASSWORD="$PASS" pg_dump -h "$HOST" -p "${PORT:-5432}" -U "$USER" -d "$DBNAME" --no-owner --no-acl > "$OUTPUT_FILE"

echo "✅ Database exported to: $OUTPUT_FILE"
echo ""
echo "You can now import this to production:"
echo "  psql -h production-host -U user -d database < $OUTPUT_FILE"
echo ""
