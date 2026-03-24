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

## Step 3: Visual Verification

If the agent changed page UI, verify the page looks correct. Choose the path based on Chrome MCP availability.

**For sizing, spacing, or typography changes:** Invoke `/impeccable:frontend-design` before verifying. The skill catches visual proportion and hierarchy issues that eyeball comparison misses — e.g. a logo that "looks fine" in a full-page screenshot but is obviously wrong when zoomed and compared to the reference.

**Path A — Chrome MCP available:**
1. Navigate to the changed page in Chrome MCP
2. Take a screenshot and compare visually against the saved reference in `screenshots/reference/`. **Zoom into the specific changed area** for precise comparison — don't rely only on full-page screenshots.
3. Also check against the style reference (`splose-style-reference/`) for exact token values (colors, fonts, spacing)
4. Update `screenshots/screenshot-catalog.md` Match column:
   - **yes** = page visually matches reference
   - **partial** = noticeable differences (note what's off)
   - **no** = significant mismatch

**Path B — Chrome MCP not available (fallback):**
1. Read the changed page source code and verify it structurally matches the fix brief / gap report
2. Cross-reference Tailwind classes against `splose-style-reference/` token files (colours, typography, borders, shadows, spacing)
3. Compare the component structure against `splose-style-reference/page-structures/<page>.md`
4. Update `screenshots/screenshot-catalog.md` Match column:
   - **yes** = high-confidence structural match, all values verified against style reference
   - **partial — code-review only** = likely matches but needs visual confirmation in next Chrome MCP session
   - **no** = clear structural mismatch found in code
5. Never false-positive to "yes" when uncertain — use "partial" and flag for visual verification later

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
