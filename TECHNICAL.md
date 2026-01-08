# Daleel Technical Documentation

This document provides detailed technical information about the Daleel platform, its architecture, security model, and development workflows.

## 🏗️ Architecture

Daleel is built as a **single repository** with a clear separation between the frontend and backend layers.

```
/
├── frontend/         # Next.js 14+ App Router (UI only)
├── backend/          # Standalone Express server (API, Auth, DB)
├── shared/           # Plain TypeScript shared code (Types, Schemas)
├── docs/             # Documentation & Legal content
├── scripts/          # Utility scripts
└── legal/            # Multilingual legal content
```

### Key Architectural Decisions
- **Frontend**: Next.js App Router, purely UI-focused. Fetches data from the backend via HTTP.
- **Backend**: Standalone Express server. Manages API routes, authentication, and database access.
- **Shared**: Plain TypeScript files imported by both frontend and backend via relative paths.
- **No monorepo tooling**: Simple structure without Turborepo or pnpm workspaces for easier maintenance.

---

## 🔒 Security Model

### Append-Only Versioning
- **Immutable models**: `Statement`, `Affiliation`, `Source`, `AuditLog`, `ProfileVersion`.
- These models cannot be deleted or directly updated after creation.
- Updates require creating new records or using the versioning system.
- Enforced via Prisma middleware in `backend/src/db/middleware.ts`.

### Source Archiving Enforcement
- Every `Source` must have `archivedUrl`, `archivedAt`, and `archiveMethod`.
- Sources cannot be published without archived copies.
- Enforced at the database schema level and API validation.

### Admin Authentication & Authorization
- **NextAuth.js** in the frontend for session management (JWT).
- **Backend API** validates credentials and manages sessions.
- Password hashing with `bcryptjs`.
- Role-based access control (RBAC): `ADMIN`, `EDITOR`, `VIEWER`.
- CSRF protection for all admin POST requests.

### Rate Limiting
- Public API: 100 requests/minute.
- Admin API: 30 requests/minute.
- Auth: 5 attempts/15 minutes.

---

## 📊 Database Schema

### Core Models
- **User**: Admin users with roles.
- **ElectionCycle**: Election periods (e.g., 2022).
- **District**: Electoral districts.
- **ElectoralList**: Electoral lists.
- **Candidate**: Candidates with multilingual names.
- **Affiliation**: Political affiliations (append-only).
- **Statement**: Candidate statements by topic (append-only).
- **Source**: Archived sources (immutable).
- **Topic**: Statement topics.
- **ProfileVersion**: Versioned candidate profiles (append-only).
- **AuditLog**: Comprehensive logging of admin actions.

---

## 🌐 API Reference

### Public Routes (GET only)
- `GET /api/public/cycles`
- `GET /api/public/districts?cycleId=`
- `GET /api/public/lists?districtId=&cycleId=`
- `GET /api/public/candidates?districtId=&listId=&status=&q=`
- `GET /api/public/candidates/[slug]`
- `GET /api/public/centers?districtId=`

### Admin Routes (POST, requires Auth + CSRF)
- `POST /api/admin/sources`
- `POST /api/admin/candidates`
- `POST /api/admin/candidates/[id]/versions`
- `POST /api/admin/versions/[versionId]/publish`

---

## 🛠️ Development Guide

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup
1. **Install dependencies**: `npm run install:all`
2. **Generate Prisma client**: `npm run prisma:generate`
3. **Run migrations**: `npm run prisma:migrate`
4. **Seed database**: `npm run seed`
5. **Start dev servers**: `npm run dev`

### Scripts
- `npm run dev`: Start both backend and frontend.
- `npm run build`: Build both layers.
- `npm run prisma:studio`: Open Prisma Studio.
- `npm run format`: Format code with Prettier.
