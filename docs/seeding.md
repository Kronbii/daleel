# Database Seeding Guide

Guide to seeding the Daleel database with sample data for development and testing.

## Overview

The seed script (`backend/src/db/seed.ts`) creates comprehensive fake data including:

- **Admin user** for testing authentication
- **Election cycle** (2022 Parliamentary Elections)
- **Districts** (all 16 Lebanese electoral districts)
- **Topics** (Economy, Education, Healthcare, Security, Environment, Infrastructure, Social)
- **Sources** (sample archived sources)
- **Electoral lists** (sample lists per district)
- **Candidates** (20+ sample candidates across districts)
- **Affiliations** (political party affiliations for candidates)
- **Statements** (candidate statements by topic)
- **Candidate submissions** (sample user submissions)
- **Right of replies** (sample replies)
- **Electoral centers** (from `data/random_points.csv` if available)

## Prerequisites

Before seeding:

1. **Database is set up** (see [Setup Guide](./setup.md))
2. **Migrations are applied**:
   ```bash
   npm run prisma:migrate
   ```
3. **Prisma client is generated**:
   ```bash
   npm run prisma:generate
   ```

## Running the Seed Script

### Quick Start

```bash
npm run seed
```

This runs the seed script from the root directory.

### Manual Execution

```bash
cd backend
npm run seed
```

Or directly with tsx:

```bash
cd backend
npx tsx src/db/seed.ts
```

## What Gets Created

### Admin User

- **Email**: `admin@daleel.test`
- **Password**: `admin123`
- **Role**: `ADMIN`
- **Status**: Active

**⚠️ Important:** Change this password in production!

### Election Cycle

- **Name**: "2022 Parliamentary Elections"
- **Year**: 2022
- **Status**: Active

### Districts

All 16 Lebanese electoral districts:
- Beirut I, II, III
- Mount Lebanon I, II, III, IV
- North I, II, III
- South I, II, III
- Bekaa I, II, III

### Topics

7 default topics:
- Economy (الاقتصاد)
- Education (التعليم)
- Healthcare (الصحة)
- Security (الأمن)
- Environment (البيئة)
- Infrastructure (البنية التحتية)
- Social (الاجتماعي)

### Sample Data

- **5 Sources** (archived articles, videos, social media)
- **4 Electoral Lists** (distributed across districts)
- **20+ Candidates** (across all districts)
- **15 Affiliations** (political party affiliations)
- **20 Statements** (candidate statements by topic)
- **5 Candidate Submissions** (pending/approved)
- **3 Right of Replies** (published/received)
- **Electoral Centers** (if `data/random_points.csv` exists)

## Electoral Centers from CSV

The seed script can generate electoral centers from a CSV file.

### CSV Format

Create `random_points.csv` in the `data/` directory:

```csv
point_number,latitude,longitude
1,33.8938,35.5018
2,33.8940,35.5020
...
```

### CSV Location

The script looks for `random_points.csv` in:
1. Data directory (`/daleel/data/random_points.csv`)
2. Project root (`/daleel/random_points.csv`) (fallback)

### Generating Centers

If the CSV file exists, the script will:
1. Parse latitude/longitude coordinates
2. Distribute points evenly across districts
3. Generate center names (School, Institute, University, etc.)
4. Create addresses (optional, 70% chance)

**Note:** If the CSV is not found, the script will skip center generation but continue with other data.

## Seed Script Behavior

### Upsert Logic

The seed script uses **upsert** operations:
- If data already exists, it **updates** it
- If data doesn't exist, it **creates** it

This means you can run the seed script multiple times safely.

### Data Reset

To start fresh:

```bash
# Option 1: Reset database (deletes all data)
cd backend
npm run prisma:migrate reset

# Then seed again
npm run seed
```

```bash
# Option 2: Manually drop and recreate
psql postgres -c "DROP DATABASE daleel;"
psql postgres -c "CREATE DATABASE daleel;"
cd backend
npm run prisma:migrate
npm run seed
```

## Customizing Seed Data

### Modify the Seed Script

Edit `backend/src/db/seed.ts` to customize:

1. **Admin credentials:**
   ```typescript
   const adminEmail = "your-email@example.com";
   const adminPassword = "your-password";
   ```

2. **Election cycle:**
   ```typescript
   const cycle = await prisma.electionCycle.upsert({
     where: { year: 2022 },
     // ... change year, name, etc.
   });
   ```

3. **Candidates:**
   ```typescript
   const candidatesData = [
     {
       fullNameAr: "Your Name",
       fullNameEn: "Your Name",
       // ...
     },
   ];
   ```

4. **Add more data:**
   - Add districts, topics, sources, etc.
   - Follow the existing patterns in the seed file

### Environment-Specific Seeding

You can create different seed files:

```bash
# Development seed
backend/src/db/seed.ts

# Production seed (minimal data)
backend/src/db/seed.prod.ts
```

Then add to `backend/package.json`:

```json
{
  "scripts": {
    "seed": "tsx src/db/seed.ts",
    "seed:prod": "tsx src/db/seed.prod.ts"
  }
}
```

## Verifying Seed Data

### Using Prisma Studio

```bash
npm run prisma:studio
```

Navigate to:
- Users → Check admin user
- Candidates → View seeded candidates
- Districts → View all districts
- Sources → View archived sources

### Using psql

```bash
psql -d daleel

# Count records
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Candidate";
SELECT COUNT(*) FROM "District";
SELECT COUNT(*) FROM "Source";

# View admin user
SELECT email, role, "isActive" FROM "User" WHERE role = 'ADMIN';

# View candidates
SELECT "fullNameAr", "fullNameEn", status FROM "Candidate" LIMIT 10;
```

### Using API

```bash
# Get candidates
curl http://localhost:4000/api/public/candidates

# Get districts
curl http://localhost:4000/api/public/districts

# Get cycles
curl http://localhost:4000/api/public/cycles
```

## Troubleshooting

### Error: "Prisma Client not generated"

```bash
cd backend
npm run prisma:generate
npm run seed
```

### Error: "Database connection failed"

1. Check `DATABASE_URL` in `backend/.env`
2. Verify PostgreSQL is running
3. Test connection:
   ```bash
   psql -d daleel -c "SELECT 1;"
   ```

### Error: "Table does not exist"

Run migrations first:

```bash
cd backend
npm run prisma:migrate
npm run seed
```

### Error: "CSV file not found"

The script will continue without electoral centers. To add centers:

1. Create `random_points.csv` in the `data/` directory
2. Format: `point_number,latitude,longitude`
3. Re-run seed script

### Seed Script Hangs

If the script hangs, it might be:
- Waiting for database connection
- Processing large CSV file
- Creating many records

Check database logs or add console.log statements to debug.

## Production Considerations

**⚠️ Never run the seed script in production!**

The seed script is for development only. In production:

1. Use proper data migration scripts
2. Import real data from verified sources
3. Never use default admin credentials
4. Validate all data before importing

## Next Steps

- Read [Setup Guide](./setup.md) for initial setup
- Read [Migration Guide](./migrate-to-neon.md) to migrate to production
- Check [README](../README.md) for development guidelines

