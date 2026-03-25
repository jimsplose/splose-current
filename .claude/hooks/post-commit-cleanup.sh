#!/bin/bash
# PostToolUse hook for Bash(git commit): Clean up verification evidence after successful commit.
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

EVIDENCE_FILE=".verification-evidence"

if [ -f "$EVIDENCE_FILE" ]; then
  rm "$EVIDENCE_FILE"
fi
