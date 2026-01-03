#!/bin/bash
# PostgreSQL setup script for Daleel
# Run this script to create the database and user

echo "Setting up PostgreSQL for Daleel..."
echo ""

# Create user (will prompt for sudo password)
sudo -u postgres psql <<EOF
-- Create user if it doesn't exist
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'kronbii') THEN
    CREATE USER kronbii WITH PASSWORD 'kronbii';
  ELSE
    RAISE NOTICE 'User kronbii already exists';
  END IF;
END
\$\$;

-- Grant privileges
ALTER USER kronbii CREATEDB;

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE daleel'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'daleel')\gexec

-- Grant privileges on database
GRANT ALL PRIVILEGES ON DATABASE daleel TO kronbii;

-- List databases to confirm
\l

-- Exit
\q
EOF

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Update your .env file with:"
echo "DATABASE_URL=\"postgresql://kronbii:kronbii@localhost:5432/daleel\""
echo ""

