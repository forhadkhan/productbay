#!/bin/bash

set -e # Exit immediately if a command fails

# Configuration
DIST_BRANCH="dist"
MAIN_BRANCH="main"
WORKTREE_DIR="dist-worktree-tmp"

echo "🚀 Starting Distribution Sync..."

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

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

# 2. Check if build was successful
if [ ! -d "dist/productbay" ]; then
    echo "❌ Build directory dist/productbay not found!"
    exit 1
fi

# 3. Setup temporary worktree for the dist branch
echo "🌿 Preparing distribution worktree..."
rm -rf "$WORKTREE_DIR"
git worktree add "$WORKTREE_DIR" "$DIST_BRANCH"

# 4. Clean the worktree and copy artifacts
echo "🧹 Syncing $DIST_BRANCH branch root..."
# Remove all existing tracked files in the worktree
(cd "$WORKTREE_DIR" && git rm -rf . --ignore-unmatch)

# Copy files from dist/productbay to worktree root
echo "📂 Moving build artifacts to distribution branch..."
cp -rv dist/productbay/* "$WORKTREE_DIR/"
cp -v productbay.zip "$WORKTREE_DIR/" 2>/dev/null || true

# 5. Commit changes in the worktree
echo "💾 Committing changes to $DIST_BRANCH..."
(
    cd "$WORKTREE_DIR"
    git add --all
    git commit -m "Build: Distribution update $(date '+%Y-%m-%d %H:%M:%S')"
)

# 6. Push (Optional: uncomment to enable auto-push)
# echo "⬆️ Pushing to origin..."
# git push origin $DIST_BRANCH

# 7. Cleanup worktree
echo "🧹 Cleaning up..."
git worktree remove "$WORKTREE_DIR" --force

echo "✅ Success! The '$DIST_BRANCH' branch now contains ONLY the production-ready plugin files at its root."

echo "🔙 Returning to $CURRENT_BRANCH branch..."
git checkout $CURRENT_BRANCH

echo "✅ Done! Build is committed to the '$DIST_BRANCH' branch."
