#!/bin/bash

# Configuration
DIST_BRANCH="dist"
MAIN_BRANCH="main"

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🚀 Starting Distribution Sync..."

# Check if current branch is main
if [ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]; then
    echo "⚠️ Warning: You are not on the $MAIN_BRANCH branch."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Build the plugin
echo "🛠  Building project..."
bun run release

# 2. Store the build files temporarily if needed? 
# No, they are in dist/ which is ignored on main but NOT on the 'dist' branch.

# 3. Switch to dist branch
echo "🌿 Switching to $DIST_BRANCH branch..."
git checkout $DIST_BRANCH

# 4. Merge changes from main (to keep codebase in sync)
echo "🔄 Merging $MAIN_BRANCH into $DIST_BRANCH..."
# Backup our distribution-specific .gitignore
cp .gitignore .gitignore.bak
git merge $MAIN_BRANCH --no-edit || (echo "❌ Merge failed. Please resolve conflicts." && exit 1)
# Restore distribution-specific .gitignore
mv .gitignore.bak .gitignore
git add .gitignore

# 5. Add build files (now unignored in this branch)
echo "📂 Tracking build artifacts..."
git add dist/
git add productbay.zip --force

# 6. Commit build
echo "💾 Committing changes..."
git commit -m "Build: Distribution update $(date '+%Y-%m-%d %H:%M:%S')"

# 7. Push (Optional: uncomment to enable auto-push)
# echo "⬆️ Pushing to origin..."
# git push origin $DIST_BRANCH

# 8. Switch back to original branch
echo "🔙 Returning to $CURRENT_BRANCH branch..."
git checkout $CURRENT_BRANCH

echo "✅ Done! Build is committed to the '$DIST_BRANCH' branch."
