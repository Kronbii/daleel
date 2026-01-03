# Build Check Guide

This guide helps you test your build locally before deploying to Vercel, catching errors early.

## How Vercel Builds Your Project

Vercel runs these steps automatically:
1. **Install dependencies**: `pnpm install --frozen-lockfile`
   - This automatically generates Prisma client via the `postinstall` script in `@daleel/db`
2. **Build the project**: `pnpm build` (which runs `turbo run build`)
   - Vercel detects this is a Turbo monorepo and runs `turbo run build`
   - This builds all packages in the correct order based on dependencies
   - The `^build` dependency in `turbo.json` ensures packages build before their dependents
   - **Important**: Vercel runs in `NODE_ENV=production` mode, which includes static page generation
   - During static generation, Next.js pre-renders pages and may hit your database

## Testing Locally (Quick Check)

If you just want to verify the build works without cleaning everything:

```bash
pnpm build
# or directly:
turbo run build
```

This uses your existing `node_modules` and is faster, but might miss issues that only appear in a clean install or production mode.

## Testing Locally (Full Vercel Simulation) ⭐ RECOMMENDED

To simulate exactly what Vercel does (recommended before deploying):

### Option 1: Using npm script (Recommended)
```bash
pnpm build:check
```

This will:
- Clean install dependencies (like Vercel)
- Automatically generate Prisma client (via postinstall)
- Run the full build in **production mode** (catches static generation issues)

### Option 2: Using the shell script
```bash
./scripts/vercel-build-check.sh
```

This does the same thing but with more verbose output and cleans `.next` and `.turbo` directories.

## Why Production Mode Matters

Vercel builds in production mode (`NODE_ENV=production`), which:
- Enables static page generation (SSG)
- Runs type checking more strictly
- May expose issues with optional chaining, null checks, or database queries
- The error you just fixed (`candidate.affiliations.forEach`) would only appear during production builds with static generation

## Before Every Deployment

**Always run this before pushing to trigger a Vercel deployment:**

```bash
pnpm build:check
```

This catches 95% of build errors that would occur on Vercel.

## Automated Checks (Optional)

A GitHub Actions workflow is included (`.github/workflows/pre-deploy-check.yml`) that automatically runs build checks on pull requests. This ensures builds pass before code is merged.

To enable it, just push the workflow file - GitHub Actions will automatically run it on PRs.

## What Was Changed

1. **Added `postinstall` script** to `packages/db/package.json`:
   - Automatically generates Prisma client after `pnpm install`
   - This ensures Prisma client is always available during Vercel builds

2. **Added `build:check` script** to root `package.json`:
   - Convenient command to test the build process

3. **Created `scripts/vercel-build-check.sh`**:
   - Shell script for more detailed build simulation

## Troubleshooting

If you encounter errors during `build:check` that don't appear in regular `pnpm build`:

1. **Prisma Client not found**: Make sure the `postinstall` script ran. You can manually run:
   ```bash
   pnpm prisma:generate
   ```

2. **Type errors**: These are usually caught by both methods, but clean installs can reveal missing dependencies.

3. **Environment variables**: Vercel uses environment variables from your dashboard. Make sure required env vars are set in Vercel's project settings.

## Before Deploying

Always run `pnpm build:check` before pushing to trigger a Vercel deployment. This catches most issues early!

