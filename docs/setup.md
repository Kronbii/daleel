# Setup Guide

Complete guide to set up the Daleel repository for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
psql --version  # Should be 14.0 or higher
```

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd daleel
```

## Step 2: Install PostgreSQL

### macOS

```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14

# Verify it's running
psql postgres -c "SELECT version();"
```

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify it's running
sudo systemctl status postgresql
```

### Windows

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user
4. PostgreSQL service should start automatically

## Step 3: Create the Database

### Option A: Using psql Command Line

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE daleel;

# Create a user (optional, you can use postgres user)
CREATE USER daleel_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE daleel TO daleel_user;

# Exit psql
\q
```

### Option B: Using createdb Command

```bash
createdb daleel
```

### Verify Database Creation

```bash
psql -l | grep daleel
```

## Step 4: Install Dependencies

Install all dependencies (root, backend, and frontend):

```bash
npm run install:all
```

This command will:
1. Install root dependencies (dev tools like TypeScript, Prettier)
2. Install backend dependencies (Express, Prisma, etc.)
3. Install frontend dependencies (Next.js, React, etc.)

### Manual Installation (Alternative)

If you prefer to install manually:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

## Step 5: Configure Environment Variables

### Backend Environment Variables

Create `backend/.env`:

```bash
cd backend
cp .env.example .env  # If .env.example exists, or create manually
```

Edit `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/daleel"

# Server
PORT=4000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

**Important:** Replace `your_password` with your PostgreSQL password.

### Frontend Environment Variables

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local  # If .env.example exists, or create manually
```

Edit `frontend/.env.local`:

```env
# Backend API URL
API_URL="http://localhost:4000"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

## Step 6: Generate Prisma Client

```bash
npm run prisma:generate
```

Or manually:

```bash
cd backend
npm run prisma:generate
```

This generates the Prisma Client based on your schema.

## Step 7: Run Database Migrations

```bash
npm run prisma:migrate
```

Or manually:

```bash
cd backend
npm run prisma:migrate
```

This will:
1. Create all database tables
2. Set up relationships and constraints
3. Apply any pending migrations

### Verify Migrations

```bash
cd backend
npm run prisma:studio
```

This opens Prisma Studio in your browser where you can view your database schema.

## Step 8: Seed the Database (Optional)

To populate the database with sample data:

```bash
npm run seed
```

Or manually:

```bash
cd backend
npm run seed
```

This creates:
- Test admin user: `admin@daleel.test` / `admin123`
- Default election cycle (2022)
- Sample districts, lists, candidates
- Sample topics and sources

See [Seeding Guide](./seeding.md) for more details.

## Step 9: Start Development Servers

### Start Both Servers (Recommended)

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:4000
- **Frontend**: http://localhost:3000

### Start Servers Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# or
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

## Step 10: Verify Installation

1. **Backend Health Check:**
   ```bash
   curl http://localhost:4000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   Open http://localhost:3000 in your browser
   - Should see the Daleel homepage
   - Default locale is Arabic

3. **Admin Login:**
   - Navigate to http://localhost:3000/ar/admin/login
   - Use: `admin@daleel.test` / `admin123` (if you seeded the database)

## Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
- Ensure PostgreSQL is running:
  ```bash
  # macOS
  brew services list | grep postgresql
  
  # Linux
  sudo systemctl status postgresql
  ```

**Error: "password authentication failed"**
- Check your `DATABASE_URL` in `backend/.env`
- Verify PostgreSQL user and password
- Try connecting manually:
  ```bash
  psql -U postgres -d daleel
  ```

**Error: "database does not exist"**
- Create the database (see Step 3)
- Verify database name in `DATABASE_URL`

### Port Already in Use

**Error: "Port 3000 already in use"**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Or use a different port
cd frontend
PORT=3001 npm run dev
```

**Error: "Port 4000 already in use"**
```bash
# Find process using port 4000
lsof -ti:4000

# Kill it
kill -9 $(lsof -ti:4000)

# Or use a different port
cd backend
PORT=4001 npm run dev
```

### Prisma Issues

**Error: "Prisma Client not generated"**
```bash
cd backend
npm run prisma:generate
```

**Error: "Migration failed"**
```bash
# Reset database (WARNING: Deletes all data)
cd backend
npm run prisma:migrate reset

# Or manually drop and recreate
psql postgres -c "DROP DATABASE daleel;"
psql postgres -c "CREATE DATABASE daleel;"
npm run prisma:migrate
```

### Module Not Found Errors

**Error: "Cannot find module"**
```bash
# Reinstall dependencies
npm run install:all

# Or manually
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## Next Steps

- Read [Seeding Guide](./seeding.md) to learn about database seeding
- Read [Migration Guide](./migrate-to-neon.md) to migrate to production
- Check [README](../README.md) for development guidelines

## Quick Reference

```bash
# Install dependencies
npm run install:all

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed

# Start development
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend

# Open Prisma Studio
npm run prisma:studio
```

