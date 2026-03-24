#!/bin/bash
# PostToolUse hook: Run TypeScript check on edited files after Edit/Write tool calls.
# Only checks the specific file that was edited, not the whole project.
set -euo pipefail

# The tool result is passed via stdin - extract the file path
# For Edit and Write tools, the file_path is in the tool input
FILE_PATH="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only check TypeScript/TSX files
case "$FILE_PATH" in
  *.ts|*.tsx)
    cd "$CLAUDE_PROJECT_DIR"
    # Run tsc on just this file - if it fails, report the error
    ERRORS=$(npx tsc --noEmit --pretty "$FILE_PATH" 2>&1) || {
      echo "TypeScript error in $FILE_PATH:"
      echo "$ERRORS" | head -20
      exit 0  # Don't block, just report
    }
    ;;
esac
