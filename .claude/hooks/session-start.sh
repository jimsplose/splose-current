#!/bin/bash
set -euo pipefail

# Create .env.local with Turso credentials if it doesn't exist.
# Reads from environment variables (set via settings.local.json env field)
# so the token is never hardcoded in a tracked file.
ENV_FILE="$CLAUDE_PROJECT_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  if [ -n "${TURSO_DATABASE_URL:-}" ] && [ -n "${TURSO_AUTH_TOKEN:-}" ]; then
    cat > "$ENV_FILE" << EOF
TURSO_DATABASE_URL=$TURSO_DATABASE_URL
TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN
EOF
    echo "Created .env.local from environment variables"
  else
    echo "Warning: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set in environment. Add them to settings.local.json env field."
  fi
fi

# Install dependencies if node_modules is missing
if [ ! -d "$CLAUDE_PROJECT_DIR/node_modules" ]; then
  cd "$CLAUDE_PROJECT_DIR"
  npm install
fi
