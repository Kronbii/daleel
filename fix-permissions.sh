#!/bin/bash
# Fix PostgreSQL permissions for Daleel database

echo "Fixing PostgreSQL permissions..."
echo "You may be prompted for your system password"

sudo -u postgres psql -d daleel <<EOF
-- Grant schema permissions
GRANT ALL ON SCHEMA public TO kronbii;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO kronbii;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO kronbii;

-- Make sure the user can create tables
ALTER USER kronbii CREATEDB;
\q
EOF

echo "✅ Permissions fixed!"

