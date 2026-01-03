# Daleel - دليل

**Security-first, web-first monorepo for Lebanese parliamentary election information**

Daleel is an independent civic initiative providing public, educational information about Lebanese parliamentary elections (الانتخابات النيابية).

## 🏗️ Architecture

This is a **Turborepo monorepo** with the following structure:

```
/
├── apps/
│   └── web/          # Next.js 14+ App Router (public + admin + API)
├── packages/
│   ├── db/           # Prisma schema, migrations, DB utilities
│   ├── core/         # Shared types, Zod schemas, constants
│   └── ui/           # Shared UI components (shadcn)
└── legal/            # Legal content (AR/EN/FR)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### Setup

> **📖 Detailed setup instructions:** See [SETUP.md](./SETUP.md) for step-by-step guidance.

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql@14 && brew services start postgresql@14`
   - Ubuntu: `sudo apt install postgresql && sudo systemctl start postgresql`
   - Windows: Download from https://www.postgresql.org/download/windows/

2. **Create the database:**
   ```bash
   # Open PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE daleel;
   \q
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - **`DATABASE_URL`**: Your PostgreSQL connection string
     - Format: `postgresql://USERNAME:PASSWORD@localhost:5432/daleel`
     - Example: `postgresql://postgres:mypassword@localhost:5432/daleel`
   - **`NEXTAUTH_SECRET`**: Generate with: `openssl rand -base64 32`
   - **`NEXTAUTH_URL`**: `http://localhost:3000` (for local dev)

3. **Generate Prisma client:**
   ```bash
   pnpm prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   pnpm prisma:migrate
   ```

5. **Seed database:**
   ```bash
   pnpm seed
   ```
   This creates:
   - Test admin user: `admin@daleel.test` / `admin123`
   - Default election cycle (2022)
   - Sample districts
   - Sample topics

6. **Start development server:**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) (default locale: Arabic)

## 🔒 Security Model

### Append-Only Versioning

- **Immutable models**: `Statement`, `Affiliation`, `Source`, `AuditLog`, `ProfileVersion`
- These models **cannot be deleted or directly updated** after creation
- Updates require creating new records or using the versioning system
- Enforced via Prisma middleware in `packages/db/src/middleware.ts`

### Source Archiving Enforcement

- **Every Source must have**:
  - `archivedUrl` (NOT NULL)
  - `archivedAt` (NOT NULL)
  - `archiveMethod` (NOT NULL)

- Sources cannot be published without archived copies
- Enforced at database schema level and API validation

### Admin Authentication

- **Auth.js (NextAuth)** with Credentials provider
- Password hashing with bcryptjs
- Role-based access control: `ADMIN`, `EDITOR`, `REVIEWER`
- Session-based authentication (JWT)

### Security Headers

- CSP (Content Security Policy)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- HSTS in production

### CSRF Protection

- CSRF tokens required for all admin POST requests
- Tokens stored in httpOnly cookies

### Rate Limiting

- Public API: 100 requests/minute
- Admin API: 30 requests/minute
- Auth: 5 attempts/15 minutes
- In-memory implementation (can swap with Redis)

### Input Validation

- **Zod schemas** for all API inputs
- URL and slug sanitization
- No raw SQL (Prisma only, parameterized queries)

## 📊 Database Schema

### Core Models

- **User**: Admin users with roles
- **ElectionCycle**: Election periods
- **District**: Electoral districts
- **ElectoralList**: Electoral lists
- **Candidate**: Candidates with multilingual names
- **Affiliation**: Political affiliations (append-only)
- **Statement**: Candidate statements by topic (append-only)
- **Source**: Archived sources (archive fields immutable)
- **Topic**: Statement topics
- **ProfileVersion**: Versioned candidate profiles (append-only)
- **CandidateSubmission**: User-submitted content
- **RightOfReply**: Candidate right of reply
- **CorrectionRequest**: Correction requests
- **AuditLog**: All admin actions logged

### Key Constraints

- No cascading deletes (`onDelete: Restrict`)
- Required archive fields on `Source`
- Required `sourceId` on `Affiliation` and `Statement`
- Unique candidate slugs
- Indexed foreign keys and common query fields

## 🌐 Routing

### Public Routes

- `/[locale]/` - Home
- `/[locale]/candidates` - Candidate index
- `/[locale]/candidates/[slug]` - Candidate profile
- `/[locale]/districts` - District index
- `/[locale]/districts/[id]` - District detail
- `/[locale]/lists` - Lists index
- `/[locale]/lists/[id]` - List detail
- `/[locale]/legal` - Legal hub
- `/[locale]/legal/*` - Legal pages (disclaimer, neutrality, methodology, etc.)

### Admin Routes (Protected)

- `/[locale]/admin` - Admin dashboard
- `/[locale]/admin/candidates` - Manage candidates
- `/[locale]/admin/lists` - Manage lists
- `/[locale]/admin/districts` - Manage districts
- `/[locale]/admin/sources` - Manage sources
- `/[locale]/admin/submissions` - Review submissions
- `/[locale]/admin/replies` - Review right of reply
- `/[locale]/admin/versions` - Manage profile versions
- `/[locale]/admin/corrections` - Handle corrections
- `/[locale]/admin/audit` - Audit log viewer

### API Routes

**Public (GET only):**
- `GET /api/public/cycles`
- `GET /api/public/districts?cycleId=`
- `GET /api/public/lists?districtId=&cycleId=`
- `GET /api/public/candidates?districtId=&listId=&status=&q=`
- `GET /api/public/candidates/[slug]`

**Admin (POST, requires auth + CSRF):**
- `POST /api/admin/sources`
- `POST /api/admin/candidates`
- `POST /api/admin/candidates/[id]/status`
- `POST /api/admin/candidates/[id]/assign-list`
- `POST /api/admin/candidates/[id]/affiliations`
- `POST /api/admin/candidates/[id]/statements`
- `POST /api/admin/candidates/[id]/submissions/approve|reject`
- `POST /api/admin/candidates/[id]/reply/publish|reject`
- `POST /api/admin/candidates/[id]/versions`
- `POST /api/admin/versions/[versionId]/review`
- `POST /api/admin/versions/[versionId]/publish`
- `POST /api/admin/corrections/[id]/resolve|reject`

## 📝 Adding Content

### 1. Add a Source

**Required fields:**
- `title`, `publisher`, `originalUrl`
- `archivedUrl`, `archivedAt`, `archiveMethod` (REQUIRED)

```typescript
POST /api/admin/sources
{
  "title": "...",
  "publisher": "...",
  "originalUrl": "https://...",
  "archivedUrl": "https://web.archive.org/...",
  "archivedAt": "2024-01-01T00:00:00Z",
  "archiveMethod": "WAYBACK",
  "csrfToken": "..."
}
```

### 2. Add a Candidate

```typescript
POST /api/admin/candidates
{
  "cycleId": "...",
  "districtId": "...",
  "fullNameAr": "...",
  "fullNameEn": "...",
  "fullNameFr": "...",
  "slug": "candidate-name",
  "status": "POTENTIAL",
  "csrfToken": "..."
}
```

### 3. Add an Affiliation

**Requires `sourceId` (must have archived source):**

```typescript
POST /api/admin/candidates/[id]/affiliations
{
  "type": "PARTY",
  "nameAr": "...",
  "nameEn": "...",
  "nameFr": "...",
  "startDate": "2024-01-01",
  "sourceId": "...",
  "csrfToken": "..."
}
```

### 4. Add a Statement

**Requires `sourceId` (must have archived source):**

```typescript
POST /api/admin/candidates/[id]/statements
{
  "topicId": "...",
  "kind": "QUOTE",
  "summaryAr": "...",
  "summaryEn": "...",
  "summaryFr": "...",
  "occurredAt": "2024-01-01",
  "sourceId": "...",
  "csrfToken": "..."
}
```

### 5. Publish Profile Version

1. Create a version snapshot:
   ```typescript
   POST /api/admin/candidates/[id]/versions
   {
     "changeNote": "...",
     "csrfToken": "..."
   }
   ```

2. Review it:
   ```typescript
   POST /api/admin/versions/[versionId]/review
   {
     "publishStatus": "REVIEWED",
     "csrfToken": "..."
   }
   ```

3. Publish:
   ```typescript
   POST /api/admin/versions/[versionId]/publish
   {
     "publishStatus": "PUBLISHED",
     "csrfToken": "..."
   }
   ```

## 🔄 Versioning & Publishing

- **Profile content** is published only via `ProfileVersion` snapshots
- Each version captures the full candidate profile state as JSON
- Versions progress: `DRAFT` → `REVIEWED` → `PUBLISHED`
- Only published versions are shown on public candidate pages
- All versions are preserved (append-only)

## 📦 Deployment Recommendations

### Infrastructure

- **Hosting**: Vercel, Cloudflare Pages, or similar
- **Database**: Managed PostgreSQL (Supabase, Neon, AWS RDS)
- **WAF**: Cloudflare or AWS WAF for DDoS protection
- **CDN**: Cloudflare or similar for static assets

### Environment Variables

- `DATABASE_URL`: Production PostgreSQL connection string
- `NEXTAUTH_URL`: Production app URL
- `NEXTAUTH_SECRET`: Strong random secret
- `UPSTASH_REDIS_URL`: Optional, for Redis rate limiting
- `NODE_ENV`: `production`

### Database Backups

- **Automated daily backups** of PostgreSQL
- **Point-in-time recovery** enabled
- **Backup retention**: 30+ days
- Test restore procedures regularly

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS only
- [ ] Configure WAF rules
- [ ] Set up monitoring and alerts
- [ ] Regular dependency updates
- [ ] Database connection pooling
- [ ] Enable database SSL/TLS

## 🛠️ Development

### Scripts

- `pnpm dev` - Start all dev servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all code
- `pnpm format` - Format code with Prettier
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run migrations
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm seed` - Seed database

### Adding New Features

1. **Schema changes**: Edit `packages/db/prisma/schema.prisma`
2. **Create migration**: `pnpm prisma:migrate`
3. **Update types**: Types auto-generated from Prisma
4. **Add validation**: Add Zod schemas in `packages/core/src/schemas.ts`
5. **Create API route**: Add to `apps/web/src/app/api/`
6. **Create page**: Add to `apps/web/src/app/[locale]/`

## 📄 License

[Specify your license]

## 🤝 Contributing

[Contributing guidelines]

---

**Daleel** - Independent, neutral, transparent election information.

