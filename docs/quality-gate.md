# Post-Agent Quality Gate

**After EVERY subagent completes and BEFORE committing its work, the main agent MUST run these checks.** This is not optional. Do not batch — run the gate after each individual agent.

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

## Step 3: Pixel Diff Verification (main agent)

If the agent changed page UI, run the automated pixel diff. **Puppeteer** (bundled Chromium) is used for screenshots — no separate browser install needed. If a persistent browser is running (`start-browser.ts`), captures auto-connect and skip cold start.

1. Capture current state:
   ```bash
   npx tsx scripts/screenshot-capture.ts http://localhost:3000/<page> /tmp/verify-<page>.png
   ```
2. Run pixel diff against each reference screenshot for that page:
   ```bash
   npx tsx scripts/pixel-diff.ts screenshots/reference/<reference.png> /tmp/verify-<page>.png --threshold=5 --output=/tmp/diff-<page>.png
   ```
3. Read the diff image (`/tmp/diff-<page>.png`) — red pixels show mismatches
4. If mismatch > 5%: fix the highlighted differences and re-run
5. If mismatch <= 5%: pass
6. Update `screenshots/screenshot-catalog.md` Match column:
   - **yes** = mismatch <= 5%
   - **partial** = mismatch 5-20% (note what's still off)
   - **no** = mismatch > 20%

## Step 4: Commit or Revert

- If all checks pass → commit the agent's changes
- If any check fails and can't be fixed quickly → revert the agent's changes and move on

---

# Post-Push Visual Verification

After every push that includes visual changes, the main agent MUST:

1. Take 1-2 screenshots of the most significant page changes:
   - Capture with Puppeteer: `npx tsx scripts/screenshot-capture.ts http://localhost:3000/<changed-page> /tmp/progress-<page>.png`
2. Read and display screenshots inline in chat (or describe changes with reference screenshots) so Jim can see progress immediately
3. Tell Jim the branch preview URL and link to the Vercel dashboard

### When to skip

- Infrastructure-only changes (config, tooling, docs)
- Changes with no visual impact — meaning no end-user visible differences to page layout, colors, typography, or interactive behavior. Examples: refactoring code, updating comments, renaming variables, TypeScript type fixes.
