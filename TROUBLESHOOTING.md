# Troubleshooting PostgreSQL Connection Issues

## Error: "role 'kronbii' does not exist"

This happens because PostgreSQL is trying to use your system username, but that role doesn't exist in PostgreSQL.

### Solution 1: Connect as the default 'postgres' user (Recommended)

```bash
psql -U postgres
```

If it asks for a password and you don't know it, you may need to reset it or connect differently.

### Solution 2: Create your user role in PostgreSQL

If you want to use your system username:

```bash
# First, connect as postgres (might need sudo)
sudo -u postgres psql

# Then create your user
CREATE USER kronbii WITH PASSWORD 'your_password';
ALTER USER kronbii CREATEDB;
\q
```

Then you can connect as:
```bash
psql -U kronbii -d postgres
```

### Solution 3: Use sudo (Linux)

On Linux, you can use sudo to connect as the postgres user:

```bash
sudo -u postgres psql
```

### Solution 4: Check if PostgreSQL service is running

Make sure PostgreSQL is actually running:

```bash
# Check status
sudo systemctl status postgresql

# Or start it
sudo systemctl start postgresql
```

## Once Connected

After you successfully connect to PostgreSQL, create the database:

```sql
CREATE DATABASE daleel;
\q
```

## Update Your .env File

Once you know which user works, update your `.env` file:

**If using postgres user:**
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/daleel"
```

**If using your system user (kronbii):**
```env
DATABASE_URL="postgresql://kronbii:your_password@localhost:5432/daleel"
```

**If postgres user has no password (local dev):**
```env
DATABASE_URL="postgresql://postgres@localhost:5432/daleel"
```

## Reset PostgreSQL Password (if needed)

If you need to set/reset the postgres password:

```bash
# Connect as postgres (using sudo if needed)
sudo -u postgres psql

# Set password
ALTER USER postgres PASSWORD 'your_new_password';
\q
```

Then update your `.env` with the new password.

