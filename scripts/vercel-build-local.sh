#!/bin/bash
# Script to replicate Vercel's build process locally
# This simulates building from the frontend directory as root (like Vercel does)

set -e  # Exit on error

echo "🔍 Replicating Vercel build process locally..."
echo ""
echo "Vercel configuration:"
echo "  - Root Directory: frontend"
echo "  - Install Command: cd .. && npm install"
echo "  - Build Command: cd .. && npm run prisma:generate && npm run build:backend && npm run build:frontend"
echo "  - Output Directory: .next (relative to frontend/)"
echo ""

# Get the repo root directory
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"

# Step 1: Change to frontend directory (simulating Vercel's root directory)
echo "📁 Changing to frontend directory (Vercel root)..."
cd "$FRONTEND_DIR" || exit 1

# Step 2: Install dependencies (from repo root, like Vercel does: cd .. && npm install)
echo ""
echo "📦 Step 1: Installing dependencies (cd .. && npm install)..."
cd .. && npm install

# Step 3: Generate Prisma client (cd .. && npm run prisma:generate)
echo ""
echo "🔧 Step 2: Generating Prisma client (cd .. && npm run prisma:generate)..."
npm run prisma:generate

# Step 4: Build backend (cd .. && npm run build:backend)
echo ""
echo "🏗️  Step 3: Building backend (cd .. && npm run build:backend)..."
npm run build:backend

# Step 5: Build frontend (cd .. && npm run build:frontend)
echo ""
echo "🏗️  Step 4: Building frontend (cd .. && npm run build:frontend)..."
npm run build:frontend

echo ""
echo "✅ Build complete! Output is in frontend/.next"
echo ""
echo "💡 To test the build output:"
echo "   cd frontend && npm run start"
echo ""

