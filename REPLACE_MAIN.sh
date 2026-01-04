#!/bin/bash
# Script to replace main branch with current branch (electoral-pens)
# WARNING: This is destructive and will completely overwrite main

set -e

CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo ""
echo "WARNING: This will COMPLETELY REPLACE main with $CURRENT_BRANCH"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

# Step 1: Make sure current branch is pushed (backup)
echo "Step 1: Pushing current branch to remote..."
git push origin "$CURRENT_BRANCH" || echo "Branch already pushed or no changes"

# Step 2: Switch to main
echo "Step 2: Switching to main..."
git checkout main

# Step 3: Reset main to match current branch
echo "Step 3: Resetting main to $CURRENT_BRANCH..."
git reset --hard "$CURRENT_BRANCH"

# Step 4: Force push to main (DESTRUCTIVE)
echo "Step 4: Force pushing to main (THIS WILL OVERWRITE REMOTE MAIN)..."
git push origin main --force

echo ""
echo "Done! Main branch has been replaced with $CURRENT_BRANCH"
echo "You can now switch back: git checkout $CURRENT_BRANCH"

