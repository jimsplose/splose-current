#!/bin/bash
# PreToolUse hook for Bash(git commit): Block commits on UI page files without verification evidence.
# Requires .verification-evidence file listing verified page paths before committing.
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

EVIDENCE_FILE=".verification-evidence"

# Find staged page.tsx files under src/app/ (these are the visual pages that need verification)
STAGED_PAGES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '^src/app/.*/page\.tsx$' || true)

# No UI pages staged → nothing to check
[ -z "$STAGED_PAGES" ] && exit 0

# UI pages are staged — evidence file must exist
if [ ! -f "$EVIDENCE_FILE" ]; then
  echo "BLOCKED: UI page files staged but no verification evidence found."
  echo ""
  echo "Staged pages requiring verification:"
  echo "$STAGED_PAGES" | sed 's/^/  /'
  echo ""
  echo "You must run the measurement verification loop (quality-gate.md Step 3)"
  echo "and write evidence before committing. Create $EVIDENCE_FILE with verified paths."
  echo ""
  echo "Common rationalizations that are NOT acceptable reasons to skip:"
  echo "  - \"The fix was simple\" — drift hides in simple changes"
  echo "  - \"I'll verify later\" — verification debt compounds"
  echo "  - \"TypeScript passes\" — TypeScript checks types, not visual fidelity"
  echo "  - \"The instructions were specific\" — instructions can be wrong or stale"
  echo ""
  echo "If this is a non-visual change (refactor, types only), add to $EVIDENCE_FILE:"
  echo "  SKIP: <filepath> — <reason>"
  exit 1
fi

# Check that each staged page is listed in the evidence file
MISSING=""
while IFS= read -r page; do
  if ! grep -qF "$page" "$EVIDENCE_FILE"; then
    MISSING+="  $page\n"
  fi
done <<< "$STAGED_PAGES"

if [ -n "$MISSING" ]; then
  echo "BLOCKED: Some staged UI pages have no verification evidence."
  echo ""
  echo "Missing from $EVIDENCE_FILE:"
  echo -e "$MISSING"
  echo ""
  echo "Either verify these pages (measurement loop) and add them to $EVIDENCE_FILE,"
  echo "or if non-visual, add: SKIP: <filepath> — <reason>"
  exit 1
fi

echo "Verification evidence found for all staged UI pages."
