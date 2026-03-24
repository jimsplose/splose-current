#!/bin/bash
# PreToolUse hook for Bash(git commit): Verify TypeScript compiles before allowing commits.
# Runs a fast tsc check (not full next build) to catch obvious errors.
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

# Quick TypeScript check - catches type errors without full build
ERRORS=$(npx tsc --noEmit 2>&1) || {
  echo "BLOCKED: TypeScript errors found. Fix before committing:"
  echo "$ERRORS" | head -30
  exit 1
}
