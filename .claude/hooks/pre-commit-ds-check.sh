#!/bin/bash
# PreToolUse hook for Bash(git commit): Block commits with DS violations in staged .tsx files.
# Catches inline patterns that should use DS components from @/components/ds.
set -euo pipefail

cd "$CLAUDE_PROJECT_DIR"

STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep '\.tsx$' || true)
[ -z "$STAGED" ] && exit 0

VIOLATIONS=""

for f in $STAGED; do
  # Skip files that don't exist (deleted files appear in diff but can't be scanned)
  [ -f "$f" ] || continue

  # Scan 1: Banned inline patterns (should use DS components)
  if grep -qE 'const (inputClass|labelClass)' "$f"; then
    VIOLATIONS+="  $f: const inputClass/labelClass → use <FormInput> / <FormSelect>\n"
  fi
  if grep -qE 'rounded-full px-2 py-0\.5 text-xs font-medium' "$f"; then
    VIOLATIONS+="  $f: inline badge pattern → use <Badge>\n"
  fi
  if grep -qE 'rounded-lg bg-primary px-4 py-2 text-sm font-medium' "$f"; then
    VIOLATIONS+="  $f: inline primary button → use <Button variant=\"primary\">\n"
  fi

  # Scan 2: Bare <button> or <input> without DS import
  # Exceptions: checkbox, radio, hidden inputs; icon-only toolbar buttons are OK
  if grep -qE '<button[ >]|<input[ >]' "$f"; then
    # Check for DS import
    if ! grep -qE "from ['\"]@/components/ds['\"]" "$f"; then
      # Check if ALL inputs are exempted types (checkbox, radio, hidden)
      NON_EXEMPT=$(grep -cE '<input[ >]' "$f" || true)
      EXEMPT=$(grep -cE '<input type="(checkbox|radio|hidden)"' "$f" || true)
      HAS_BUTTONS=$(grep -cE '<button[ >]' "$f" || true)

      if [ "$HAS_BUTTONS" -gt 0 ] || [ "$NON_EXEMPT" -gt "$EXEMPT" ]; then
        VIOLATIONS+="  $f: bare <button>/<input> without @/components/ds import\n"
      fi
    fi
  fi
done

if [ -n "$VIOLATIONS" ]; then
  echo "BLOCKED: DS violations in staged files."
  echo ""
  echo "These patterns must use Design System components from @/components/ds:"
  echo -e "$VIOLATIONS"
  echo ""
  echo "Fix these before committing. See docs/quality-gate.md Step 1 for details."
  exit 1
fi
