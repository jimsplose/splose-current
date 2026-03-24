#!/bin/bash
# Stop hook: Auto-commit any uncommitted work when session ends.
# Prevents work loss from sessions ending unexpectedly.
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  # Stage all tracked file changes (not untracked)
  git add -u

  # Check if there's anything staged
  if ! git diff --cached --quiet; then
    git commit -m "WIP: Auto-saved on session end

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
    echo "Auto-committed WIP changes on session end"
  fi
fi
