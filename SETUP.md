# Setup Guide

## Quick Setup Steps

### 1. Install PostgreSQL (if not already installed)

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from https://www.postgresql.org/download/windows/

### 2. Create the Database

Open PostgreSQL command line:
```bash
# macOS/Linux
psql postgres

# Or if you have a specific user
psql -U your_username postgres
```

Then create the database:
```sql
CREATE DATABASE daleel;
\q
```

### 3. Get Your PostgreSQL Connection String

Your `DATABASE_URL` follows this format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

**Common examples:**

- **Default PostgreSQL user with password:**
  ```
  postgresql://postgres:mypassword@localhost:5432/daleel
  ```

- **Custom user:**
  ```
  postgresql://myuser:mypassword@localhost:5432/daleel
  ```

- **No password (not recommended, but common in dev):**
  ```
  postgresql://postgres@localhost:5432/daleel
  ```

**To find your PostgreSQL username:**
```bash
# On macOS/Linux
whoami

# Or check PostgreSQL users
psql postgres -c "\du"
```

**Default PostgreSQL settings:**
- Host: `localhost`
- Port: `5432` (default)
- Database: `daleel` (you create this)

### 4. Generate NEXTAUTH_SECRET

**Option 1: Using OpenSSL (recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output - this is your `NEXTAUTH_SECRET`.

### 5. Create .env File

```bash
cp .env.example .env
```

Then edit `.env` and replace:
- `DATABASE_URL` with your actual PostgreSQL connection string
- `NEXTAUTH_SECRET` with the generated secret

**Example `.env` file:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/daleel"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here-min-32-chars-long"
NODE_ENV="development"
```

### 6. Install Dependencies

```bash
pnpm install
```

### 7. Run Database Migrations

This creates all the tables in your database:
```bash
pnpm prisma:migrate
```

When prompted, give it a migration name like `init`.

### 8. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 9. Seed the Database

This creates a test admin user and sample data:
```bash
pnpm seed
```

**Default admin credentials:**
- Email: `admin@daleel.test`
- Password: `admin123`

### 10. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 (defaults to Arabic locale)

## Troubleshooting

### "database does not exist"
Make sure you created the database:
```sql
CREATE DATABASE daleel;
```

### "password authentication failed"
Check your PostgreSQL password in the `DATABASE_URL`. You might need to reset it:
```bash
# macOS/Linux - reset postgres password
psql postgres
ALTER USER postgres PASSWORD 'newpassword';
```

### "connection refused"
Make sure PostgreSQL is running:
```bash
# macOS (Homebrew)
brew services start postgresql@14

# Linux
sudo systemctl start postgresql

# Check status
sudo systemctl status postgresql
```

### Can't find psql command
Add PostgreSQL to your PATH:
```bash
# macOS (Homebrew)
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Add to ~/.zshrc or ~/.bashrc to make permanent
```

## Verification

After setup, verify everything works:

1. **Check database connection:**
   ```bash
   pnpm prisma:studio
   ```
   This should open Prisma Studio showing your database tables.

2. **Test login:**
   - Go to http://localhost:3000/ar/admin/login
   - Use: `admin@daleel.test` / `admin123`

3. **View seeded data:**
   - Check http://localhost:3000/ar/candidates
   - (Will be empty initially, but the page should load)

## Next Steps

- Change the default admin password in production
- Add more candidates, districts, and lists via the admin panel
- Configure environment variables for production deployment

