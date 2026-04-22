#!/usr/bin/env bash
# setup/setup.sh — Splose design review pilot setup
# Usage: bash setup.sh [project-path]

set -e

PROJECT_DIR="${1:-$(pwd)}"
GITHUB_TOKEN="REPLACE_WITH_BOT_TOKEN_BEFORE_DISTRIBUTION"

echo ""
echo "🎨 Splose Design Review — Pilot Setup"
echo "======================================="
echo "Project: $PROJECT_DIR"
echo ""

# Write .env.local
ENV_FILE="$PROJECT_DIR/.env.local"
if grep -q "GITHUB_TOKEN" "$ENV_FILE" 2>/dev/null; then
  echo "✅ GITHUB_TOKEN already in .env.local — skipping"
else
  echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> "$ENV_FILE"
  echo "✅ GITHUB_TOKEN written to .env.local"
fi

# Install deps
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "📦 Installing dependencies…"
  cd "$PROJECT_DIR" && npm install
  echo "✅ Dependencies installed"
else
  echo "✅ node_modules exists — skipping install"
fi

# Print bookmarklet
BOOKMARKLET_FILE="$PROJECT_DIR/public/bookmarklet-uri.txt"
echo ""
echo "📌 Bookmarklet URI (add to Chrome bookmarks):"
echo "----------------------------------------------"
if [ -f "$BOOKMARKLET_FILE" ]; then
  cat "$BOOKMARKLET_FILE"
else
  echo "(Build bookmarklet first: npm run build:bookmarklet)"
fi

echo ""
echo "Chrome bookmark setup:"
echo "  1. Right-click bookmark bar → Add page…"
echo "  2. Name: Splose Capture"
echo "  3. URL: paste the URI above"
echo "  4. Save"
echo ""
echo "✅ Setup complete! Run: cd $PROJECT_DIR && npm run dev"
echo "   Then open: http://localhost:3000"
echo ""
