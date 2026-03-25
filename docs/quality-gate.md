# Post-Agent Quality Gate

**After EVERY UI change — whether made by a subagent or the main agent directly — and BEFORE committing, MUST run these checks.** This is not optional. Do not batch — run the gate after each individual agent or each round of direct edits.

## Step 1: DS Violation Scan

Use the Grep tool (NOT bash grep) on the agent's changed files. If any matches are found, fix them before committing.

**Scan 1 — Banned inline patterns:**
```
Grep pattern: "const (inputClass|labelClass)|rounded-full px-2 py-0\.5 text-xs font-medium|rounded-lg bg-primary px-4 py-2 text-sm font-medium"
```
Run using the Grep tool with the pattern above on each changed `.tsx` file.

**Scan 2 — Missing DS imports:**
For each changed `.tsx` file that contains `<button` or `<input` tags, verify it imports from `@/components/ds`. Use the Grep tool to check:
```
Grep pattern: "from [\"']@/components/ds[\"']"
```
If the file has bare HTML form/button elements but no DS import, it's a violation.

**Red flags and fixes:**
1. `const inputClass` or `const labelClass` → replace with `<FormInput>` / `<FormSelect>`
2. `rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white` → `<Button variant="primary">`
3. `rounded-lg border border-border bg-white px-4 py-2` → `<Button variant="secondary">`
4. `rounded-full px-2 py-0.5 text-xs font-medium` → `<Badge>`
5. `.tsx` file with bare `<button` or `<input` but no `@/components/ds` import → migrate to DS

**Allowed exceptions** (do NOT flag these):
- Icon-only toolbar buttons (e.g. rich text editor formatting buttons)
- Tab switcher buttons with active/inactive state toggles
- Checkbox/radio `<input type="checkbox">` or `<input type="radio">`
- Hidden inputs `<input type="hidden">`

## Step 2: TypeScript Check

```bash
npx tsc --noEmit
```

If it fails, fix or revert the agent's changes before continuing.

## Step 3: Dual-Tab Measurement Verification — 5-Iteration Loop

If the agent changed page UI, run the **5-iteration measurement verification loop** from `docs/fix-gaps-workflow.md` Step 4. This is mandatory — do not commit until the loop passes or exhausts 5 iterations.

### Viewport

Ensure canonical viewport is set:
```
mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }
```

### Dual-tab setup

1. Look up route in `docs/route-mapping.md`
2. Tab A → `https://acme.splose.com/<production-route>`
3. Tab B → `http://localhost:3000/<localhost-route>`
4. If production is auth-gated, fall back to Path B below

### Path A: Dual-tab live comparison (preferred)

1. **MEASURE** — Run the same `javascript_tool` snippet on both production and localhost tabs. Measure intrinsic CSS properties only (color, fontSize, fontWeight, padding, borderRadius, etc.). Skip viewport-dependent properties (container width/height).
2. **COMPARE** — Build a structured table: Property | Production | Localhost | Delta | Threshold | Pass?
3. **STRUCTURAL CHECK** — Screenshot both tabs, compare zones visually. Record findings explicitly:
   - Production screenshot: taken/skipped
   - Localhost screenshot: taken/skipped
   - Missing/extra elements: list
   - Layout diffs: list
4. Pass only if **0 measurement failures** AND no structural issues
5. Log each iteration in a Verification Log with exact deltas

### Path B: Fallback (no Chrome MCP or auth-gated production page)

1. Read reference screenshots (max 2 per pass) and compare against localhost source code
2. Cross-reference against `splose-style-reference/` for expected token values
3. Build comparison table with resolved Tailwind values vs target values
4. Use "partial — code-review only" for catalog entries with any uncertain resolutions
5. Structural check: compare reference screenshot visually against page source to check for missing elements, wrong order, etc.

**Do NOT use** subjective checks (hierarchy/proportion/weight/spacing) as pass criteria. These are replaced by numerical property comparison. The visual screenshot step catches structural issues only.

**Thresholds:** Colors = exact RGB. Font size/weight = exact. Line height +/-1px. Dimensions/spacing = +/-2px (fixed-size elements only). Border radius = exact. See `docs/fix-gaps-workflow.md` Step 4 for the full threshold table.

### Catalog entry qualifiers

When updating `screenshots/screenshot-catalog.md` after verification, use the correct qualifier:
- `yes` — measurement-verified via dual-tab live comparison
- `yes — visual only` — no measurement data, verified by visual/code comparison only. Needs deep verify in a future session.
- `partial` — with specific reason for the gap
- `no` — page does not exist or fundamentally doesn't match

Pages marked "yes — visual only" should be prioritized for deep verification in the next compare-pages session. See `docs/compare-pages-workflow.md` for the full verification depth levels.

## Step 3.5: Worktree Merge (if agent used worktree isolation)

If the agent was given `isolation: "worktree"`:

1. Check the agent's output for the worktree branch name
2. Verify the agent committed: `git log --oneline -1` on the branch should show the agent's commit
3. Merge: `git merge --no-ff <agent-branch> --no-edit`
4. Verify: `git log --oneline -3` should show a merge commit
5. Cleanup: `git worktree prune`

If the agent did NOT commit (no changes on the branch), the work is lost — re-run the agent.

## Step 4: Commit or Revert

- If all checks pass → commit the agent's changes
- If any check fails and can't be fixed quickly → revert the agent's changes and move on

---

# Post-Push Visual Verification

After every push that includes visual changes, the main agent MUST:

**Chrome MCP available:**
1. Use Chrome MCP to capture 1-2 screenshots of the most significant page changes
2. Read and display screenshots inline in chat so Jim can see progress immediately
3. Tell Jim the branch preview URL and link to the Vercel dashboard

**Chrome MCP not available:**
1. Skip screenshot capture
2. Tell Jim the branch preview URL and link to the Vercel dashboard
3. Recommend Jim visually spot-check the preview URL for the changed pages
4. List the specific pages/routes that changed so Jim knows where to look

### When to skip

- Infrastructure-only changes (config, tooling, docs)
- Changes with no visual impact — meaning no end-user visible differences to page layout, colors, typography, or interactive behavior. Examples: refactoring code, updating comments, renaming variables, TypeScript type fixes.
