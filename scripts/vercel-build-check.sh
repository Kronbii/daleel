#!/bin/bash
# Script to simulate Vercel's build process locally
# This helps catch build errors before deploying

set -e  # Exit on error

echo "🔍 Simulating Vercel build process..."
echo ""

# Step 1: Clean install (like Vercel does)
# Note: Prisma client will be generated automatically via postinstall script
echo "📦 Step 1: Installing dependencies (clean install)..."
echo "   (Prisma client will be generated automatically during install)"
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf .next
rm -rf .turbo
pnpm install --frozen-lockfile

# Step 2: Run the build in production mode (same as Vercel)
# Note: pnpm build runs "turbo run build" which is what Vercel uses
# NODE_ENV=production ensures we catch production-specific issues
echo ""
echo "🏗️  Step 2: Building project in production mode (turbo run build)..."
echo "   This includes static page generation, which is where most build errors occur."
NODE_ENV=production pnpm build

echo ""
echo "✅ Build simulation complete! If you see this, your build should work on Vercel."
echo ""
echo "💡 Tip: Make sure your DATABASE_URL is set if your pages need database access during build."
echo ""

