# Daleel - دليل

**Security-first, web-first application for Lebanese parliamentary election information**

Daleel is an independent civic initiative providing public, educational information about Lebanese parliamentary elections (الانتخابات النيابية).

## 🏗️ Architecture

This is a **single repository** with clear separation between frontend and backend:

```
/
├── frontend/         # Next.js 14+ App Router (UI only, no database access)
├── backend/          # Standalone Express server (API, auth, database)
├── shared/           # Plain TypeScript shared code (types, schemas, constants)
├── docs/             # Documentation
├── scripts/          # Utility scripts
└── legal/            # Legal content (AR/EN/FR)
```

### Key Architectural Decisions

- **Frontend**: Next.js App Router, purely UI-focused. Fetches data from backend via HTTP.
- **Backend**: Standalone Express server with its own entry point. Contains all API routes, authentication, database access.
- **Shared**: Plain TypeScript files (no build system). Imported by both frontend and backend via relative paths.
- **No monorepo tooling**: No Turborepo, pnpm workspaces, or internal packages.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm (comes with Node.js)
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
   
   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` and set:
   - **`DATABASE_URL`**: Your PostgreSQL connection string
     - Format: `postgresql://USERNAME:PASSWORD@localhost:5432/daleel`
     - Example: `postgresql://postgres:mypassword@localhost:5432/daleel`
   - **`PORT`**: Backend server port (default: 4000)
   - **`FRONTEND_URL`**: Frontend URL (default: `http://localhost:3000`)
   - **`NODE_ENV`**: `development`
   
   **Frontend** (`frontend/.env.local`):
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
   
   Edit `frontend/.env.local` and set:
   - **`API_URL`**: Backend API URL (default: `http://localhost:4000`)
   - **`NEXTAUTH_SECRET`**: Generate with: `openssl rand -base64 32`
   - **`NEXTAUTH_URL`**: `http://localhost:3000` (for local dev)

4. **Install dependencies:**
   ```bash
   npm run install:all
   ```
   This installs dependencies in root, backend, and frontend.

5. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

6. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

7. **Seed database:**
   ```bash
   npm run seed
   ```
   This creates:
   - Test admin user: `admin@daleel.test` / `admin123`
   - Default election cycle (2022)
   - Sample districts
   - Sample topics

8. **Start development servers:**
   ```bash
   npm run dev
   ```
   
   This starts both:
   - **Backend**: http://localhost:4000
   - **Frontend**: http://localhost:3000
   
   Open [http://localhost:3000](http://localhost:3000) (default locale: Arabic)

## 🔒 Security Model

### Append-Only Versioning

- **Immutable models**: `Statement`, `Affiliation`, `Source`, `AuditLog`, `ProfileVersion`
- These models **cannot be deleted or directly updated** after creation
- Updates require creating new records or using the versioning system
- Enforced via Prisma middleware in `backend/src/db/middleware.ts`

### Source Archiving Enforcement

- **Every Source must have**:
  - `archivedUrl` (NOT NULL)
  - `archivedAt` (NOT NULL)
  - `archiveMethod` (NOT NULL)

- Sources cannot be published without archived copies
- Enforced at database schema level and API validation

### Admin Authentication

- **NextAuth.js** in frontend for session management (JWT)
- **Backend API** validates credentials and manages sessions
- Password hashing with bcryptjs
- Role-based access control: `ADMIN`, `EDITOR`, `VIEWER`
- Session-based authentication

### Security Headers

- CSP (Content Security Policy)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- HSTS in production

### CSRF Protection

- CSRF tokens required for all admin POST requests
- Tokens stored in httpOnly cookies
- Validated on backend API routes

### Rate Limiting

- Public API: 100 requests/minute
- Admin API: 30 requests/minute
- Auth: 5 attempts/15 minutes
- In-memory implementation (can swap with Redis)

### Input Validation

- **Zod schemas** for all API inputs (in `shared/schemas.ts`)
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

### Public Routes (Frontend)

- `/[locale]/` - Home
- `/[locale]/candidates` - Candidate index
- `/[locale]/candidates/[slug]` - Candidate profile
- `/[locale]/districts` - District index
- `/[locale]/districts/[id]` - District detail
- `/[locale]/lists` - Lists index
- `/[locale]/lists/[id]` - List detail
- `/[locale]/centers` - Electoral centers map
- `/[locale]/legal` - Legal hub
- `/[locale]/legal/*` - Legal pages (disclaimer, neutrality, methodology, etc.)

### Admin Routes (Protected, Frontend)

- `/[locale]/admin` - Admin dashboard
- `/[locale]/admin/login` - Admin login
- `/[locale]/admin/candidates` - Manage candidates
- `/[locale]/admin/lists` - Manage lists
- `/[locale]/admin/districts` - Manage districts
- `/[locale]/admin/sources` - Manage sources
- `/[locale]/admin/submissions` - Review submissions
- `/[locale]/admin/replies` - Review right of reply
- `/[locale]/admin/versions` - Manage profile versions
- `/[locale]/admin/corrections` - Handle corrections
- `/[locale]/admin/audit` - Audit log viewer

### API Routes (Backend)

**Public (GET only):**
- `GET /api/public/cycles`
- `GET /api/public/districts?cycleId=`
- `GET /api/public/lists?districtId=&cycleId=`
- `GET /api/public/candidates?districtId=&listId=&status=&q=`
- `GET /api/public/candidates/[slug]`
- `GET /api/public/centers?districtId=`

**Auth:**
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

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

```bash
POST http://localhost:4000/api/admin/sources
Content-Type: application/json
Cookie: daleel-session=...

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

```bash
POST http://localhost:4000/api/admin/candidates
Content-Type: application/json
Cookie: daleel-session=...

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

```bash
POST http://localhost:4000/api/admin/candidates/[id]/affiliations
Content-Type: application/json
Cookie: daleel-session=...

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

```bash
POST http://localhost:4000/api/admin/candidates/[id]/statements
Content-Type: application/json
Cookie: daleel-session=...

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
   ```bash
   POST http://localhost:4000/api/admin/candidates/[id]/versions
   {
     "changeNote": "...",
     "csrfToken": "..."
   }
   ```

2. Review it:
   ```bash
   POST http://localhost:4000/api/admin/versions/[versionId]/review
   {
     "publishStatus": "REVIEWED",
     "csrfToken": "..."
   }
   ```

3. Publish:
   ```bash
   POST http://localhost:4000/api/admin/versions/[versionId]/publish
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

- **Frontend**: Vercel, Cloudflare Pages, or similar
- **Backend**: Railway, Render, Fly.io, or similar (Node.js hosting)
- **Database**: Managed PostgreSQL (Supabase, Neon, AWS RDS)
- **WAF**: Cloudflare or AWS WAF for DDoS protection
- **CDN**: Cloudflare or similar for static assets

### Environment Variables

**Backend:**
- `DATABASE_URL`: Production PostgreSQL connection string
- `PORT`: Backend server port (default: 4000)
- `FRONTEND_URL`: Production frontend URL
- `NODE_ENV`: `production`

**Frontend:**
- `API_URL`: Production backend API URL
- `NEXTAUTH_URL`: Production frontend URL
- `NEXTAUTH_SECRET`: Strong random secret
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
- [ ] Configure CORS properly (backend)
- [ ] Set secure cookie flags in production

## 🛠️ Development

### Scripts

**Root:**
- `npm run dev` - Start both backend and frontend dev servers
- `npm run dev:backend` - Start only backend server
- `npm run dev:frontend` - Start only frontend server
- `npm run build` - Build both backend and frontend
- `npm run build:backend` - Build only backend
- `npm run build:frontend` - Build only frontend
- `npm run start` - Start both in production mode
- `npm run lint` - Lint frontend code
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:migrate:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database
- `npm run install:all` - Install all dependencies

**Backend:**
- `cd backend && npm run dev` - Start backend dev server
- `cd backend && npm run build` - Build backend
- `cd backend && npm run start` - Start backend in production

**Frontend:**
- `cd frontend && npm run dev` - Start frontend dev server
- `cd frontend && npm run build` - Build frontend
- `cd frontend && npm run start` - Start frontend in production

### Adding New Features

1. **Schema changes**: Edit `backend/prisma/schema.prisma`
2. **Create migration**: `npm run prisma:migrate`
3. **Update types**: Types auto-generated from Prisma
4. **Add validation**: Add Zod schemas in `shared/schemas.ts`
5. **Create API route**: Add to `backend/src/api/`
6. **Create page**: Add to `frontend/src/app/[locale]/`
7. **Update frontend queries**: Add fetch calls in `frontend/src/lib/queries/`

### Project Structure

```
backend/
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── api/            # API routes (public, admin, auth)
│   ├── db/             # Prisma client, middleware, seed
│   ├── lib/            # Utilities (auth, csrf, rate-limit, audit)
│   └── server.ts       # Express server entry point

frontend/
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities (api-client, queries, auth)
│   └── i18n/           # Internationalization config
└── messages/           # Translation files

shared/
├── constants.ts         # Constants (locales, rate limits, headers)
├── schemas.ts          # Zod validation schemas
├── types.ts            # TypeScript types and utilities
├── validation.ts       # Common validation patterns
└── utils.ts            # Utility functions
```

## 📄 License

[Specify your license]

## 🤝 Contributing

[Contributing guidelines]

---

**Daleel** - Independent, neutral, transparent election information.
