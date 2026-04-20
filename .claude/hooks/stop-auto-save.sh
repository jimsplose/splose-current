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
    # Note: WIP commits intentionally omit Co-Authored-By because this hook
    # runs in bash and cannot reliably detect the Claude model that was
    # running. Historically this hook hardcoded "Opus 4.6" which misled
    # post-hoc audits (e.g. DS audit Session 01 2026-04-20). The final
    # work commit made by Claude itself carries the correct attribution.
    git commit -m "WIP: Auto-saved on session end"
    echo "Auto-committed WIP changes on session end"
  fi
fi
