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

## Step 3: Visual Verification — 5-Iteration Loop

If the agent changed page UI, run the **5-iteration visual verification loop** from `docs/fix-gaps-workflow.md` Step 4. This is mandatory — do not commit until the loop passes or exhausts 5 iterations.

In summary: screenshot → zoom into changed zone → compare against reference → apply hierarchy/proportion/weight/spacing checks → fix if wrong → repeat up to 5 times. Revert if 5 iterations fail.

Invoke `/impeccable:frontend-design` before the first iteration.

**Fallback (no Chrome MCP):** Replace screenshots with code review against style references. Use "partial — code-review only" for catalog entries. The 5-iteration loop still applies.

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
