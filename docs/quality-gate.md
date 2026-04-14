# Post-Agent Quality Gate

**After EVERY UI change — subagent or direct — and BEFORE committing.** Not optional. Not batchable.

**Prerequisites:** Read `docs/reference/measurement-protocol.md` before running this gate. It contains the canonical thresholds (Section 5), DS scan patterns (Section 6), and verification loop (Section 7) referenced below.

## HARD GATE

A fix is NOT complete until you have a comparison table (production vs localhost values) recorded as evidence. If you cannot produce this table, you have not verified.

**Not acceptable reasons to skip:**
- "The instructions were specific enough"
- "TypeScript passes"
- "I'll verify later in a batch"
- "It's a simple change"
- "Chrome MCP isn't available" (troubleshoot it — see CLAUDE.md Decision Trees. Do not commit visual changes without Chrome MCP.)

## Step 1: DS Violation Scan

Grep changed `.tsx` files for banned patterns (protocol Section 6):

**Scan 1 — Banned inline patterns:**
```
"const (inputClass|labelClass)|rounded-full px-2 py-0\.5 text-xs font-medium|rounded-lg bg-primary px-4 py-2 text-sm font-medium"
```

**Scan 2 — Missing DS imports:**
Files with `<button` or `<input` but no `@/components/ds` import.

**Scan 3 — Inline style visual properties (new):**
Grep changed `.tsx` files for `style={{` containing visual properties: `fontSize`, `fontWeight`, `borderRadius`, `backgroundColor`, `color`, `padding`, `lineHeight`. Each hit is a potential DS violation. For each:
- Is there a DS component or typography class that handles this? → Use it.
- Is there a DS component that *almost* handles it but lacks a prop? → Extend the component first, then use it.
- Is this truly a one-off layout value (e.g. `maxWidth`, `marginTop`, `flex`)? → Allowed.

**Scan 4 — DS component bypass (new):**
If any changed file is inside `src/components/ds/`, check: does the change add inline `<span style={{`, `<div style={{`, or raw HTML that duplicates the component's own responsibility? DS components must be extended via props, not patched with inline elements. A DS component with hardcoded inline styles is a code smell — it should expose a variant or prop instead.

## Step 2: TypeScript Check

```bash
npx tsc --noEmit
```

## Step 3: Visual Verification

**Chrome MCP is required.** There is no fallback path. If Chrome MCP is not responding, troubleshoot it (see CLAUDE.md "Chrome MCP not responding" Decision Tree). Do not proceed with visual work until Chrome MCP is restored.

Run the **5-iteration verification loop** (canonical procedure: `measurement-protocol.md` Section 7):

1. Set up dual tabs (protocol Section 2), viewport 1440x900
2. **Visual diff first** — Zoom into changed zones (protocol Section 3)
3. Measure every changed element on both tabs (protocol Section 4)
4. Build comparison table (protocol Section 4c)
5. Evaluate against thresholds (protocol Section 5)
6. 0 failures = PASS. Otherwise fix, re-measure, max 5 iterations.

**Structural check (mandatory):** Screenshot both tabs, zoom into changed zone. Record missing/extra elements and layout diffs. A verification without structural findings is incomplete — do not skip this.

## Step 3.5: Worktree Merge (if applicable)

If agent used worktree isolation:
1. Verify agent committed (`git log --oneline -1` on branch)
2. Merge: `git merge --no-ff <agent-branch> --no-edit`
3. Cleanup: `git worktree prune`

## Step 4: Write Verification Evidence

Write `.verification-evidence` listing every verified page path (one per line). Pre-commit hook requires this for all staged `page.tsx` files.

For non-visual changes: `SKIP: [reason]`

## Step 5: Commit or Revert

- All steps pass → commit (include "Verified: [N] properties measured" in message)
- Step 3 not run → do NOT commit, gap stays open
- Step 3 failed after 5 iterations → revert, log what was tried

## Post-Push

After every push with visual changes:
- **Chrome MCP available:** capture 1-2 screenshots of significant changes
- **Always:** share branch preview URL and Vercel dashboard link
- **Skip for:** infrastructure-only, no-visual-impact changes
