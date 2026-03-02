#!/bin/bash
# ============================================================
# archive-version.sh
# Archives the current docs into a versioned subdirectory.
#
# Usage:
#   ./scripts/archive-version.sh 1.0.0
#
# This will:
#   1. Copy current docs content into docs/v1.0.0/
#   2. Update the version switcher in config.ts
#
# After running this script:
#   1. Update root docs/ with the NEW version's content
#   2. Update the version number in config.ts nav
#   3. Commit and push
# ============================================================

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

DOCS_DIR="$(cd "$(dirname "$0")/.." && pwd)/docs"
VERSION_DIR="$DOCS_DIR/v$VERSION"

if [ -d "$VERSION_DIR" ]; then
    echo "Error: Version directory $VERSION_DIR already exists."
    exit 1
fi

echo "Archiving current docs as v$VERSION..."

# Create the versioned directory
mkdir -p "$VERSION_DIR"

# Copy content pages (not VitePress config or node_modules)
for item in "$DOCS_DIR"/*; do
    basename=$(basename "$item")
    # Skip non-content directories and files
    case "$basename" in
        .vitepress | node_modules | public | package.json | package-lock.json | README.md | v[0-9]*)
            continue
            ;;
        *)
            cp -r "$item" "$VERSION_DIR/"
            ;;
    esac
done

echo ""
echo "✅ Archived to: $VERSION_DIR"
echo ""
echo "Next steps:"
echo "  1. Update root docs/ with the NEW version's content"
echo "  2. Update config.ts → nav version dropdown:"
echo "     - Change the top-level text to the new version"
echo "     - Add { text: 'v$VERSION', link: '/v$VERSION/guide/introduction' } to items"
echo "  3. git add docs/ && git commit && git push"
