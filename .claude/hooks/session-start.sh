#!/bin/bash
set -euo pipefail

# Only run in remote (web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Create .env with Turso credentials if it doesn't exist
ENV_FILE="$CLAUDE_PROJECT_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" << 'ENVEOF'
TURSO_DATABASE_URL=libsql://splose-current-jimsplose.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiIxMGJkYWJkYS1iM2M1LTQxNDYtOWYyNC00MWU1OGY0M2NkODMiLCJpYXQiOjE3NzM4OTQzNDUsInJpZCI6ImUzNWM0YTkwLTNkMTUtNDZlNS1hN2ExLTNiMzc4M2RmM2QzNSJ9.wKrb835j-yQXIgsEMbBZ9eZVNRaJZyJRg1SQinZPU0yoNY8evyWk_p64H3L3UZBGVxjsGm0ELzWvKLIuZHg-DQ
ENVEOF
  echo "Created .env with Turso credentials"
fi

# Install dependencies if node_modules is missing
if [ ! -d "$CLAUDE_PROJECT_DIR/node_modules" ]; then
  cd "$CLAUDE_PROJECT_DIR"
  npm install
fi
