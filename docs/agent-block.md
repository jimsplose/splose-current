# Subagent Prompt Template

**Every subagent that creates or modifies page UI MUST receive this block at the top of its prompt.** Do NOT launch a UI-touching subagent without it. This is a single, self-contained block that covers DS enforcement AND visual verification.

**Maintenance & sync:** This block is self-contained so subagents get everything they need. But it derives from canonical sources — see the Sync Map in CLAUDE.md. When updating thresholds, DS rules, or measurement procedures: update `docs/reference/measurement-protocol.md` first (canonical), then sync changes into this block. Never update this block without updating the canonical source.

**Copy everything between the `---START AGENT BLOCK---` and `---END AGENT BLOCK---` markers into every subagent prompt verbatim.**

```
---START AGENT BLOCK---

## Design System — MANDATORY

You MUST use DS components from `@/components/ds` instead of inline Tailwind for these patterns.
Failure to do so creates tech debt that must be cleaned up later.

| Instead of | Use |
|---|---|
| `<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white...">` | `<Button variant="primary">` |
| `<button className="rounded-lg border border-border bg-white px-4 py-2...">` | `<Button variant="secondary">` |
| `<button className="border border-red-... text-red-600...">` | `<Button variant="danger">` |
| `<div><label>...</label><input className="w-full rounded-lg border..."/></div>` | `<FormInput label="Name" />` |
| `<div><label>...</label><select className="..."><option>...</select></div>` | `<FormSelect label="..." options={[...]} />` |
| `<span className="rounded-full px-2 py-0.5 text-xs font-medium bg-green-100...">` | `<Badge variant="green">` |
| `<div className="flex items-center justify-between mb-4"><h1 className="text-2xl...">` | `<PageHeader title="...">` |
| `<span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor }}>` | `<ColorDot color={color} />` |
| `<span className={value ? "text-green-600" : "text-red-500"}>` | `<OnOffBadge value={value} />` |
| `<input type="color" ...>` + label | `<FormColorPicker value={color} onChange={...} />` |
| Repeated dropdown item arrays (`{ label: "Edit"... }`) | `import { STANDARD_SETTINGS } from "@/lib/dropdown-presets"` |
| Repeated `modalOpen`/`editingIndex`/`openCreate`/`openEdit`/`handleSave` state | `import { useFormModal } from "@/hooks/useFormModal"` |
| `new Date().toLocaleString("en-AU", { hour: "numeric", ... })` | `import { formatTimestamp } from "@/lib/format"` |
| Simple CRUD settings page with DataTable + Modal | `<SettingsListPage>` template |

Import: `import { Button, FormInput, FormSelect, Badge, PageHeader, ColorDot, OnOffBadge, FormColorPicker, SettingsListPage } from "@/components/ds";`

### Typography — MANDATORY

Use typography utility classes or `<Text>` component instead of inline font-size + font-weight combos. See `docs/typography-spec.md` for the full spec and mapping table.

| Instead of | Use class | Or component |
|---|---|---|
| `text-2xl font-bold` (page title) | `text-display-lg` | `<Text variant="display/lg">` |
| `text-lg font-semibold` | `text-heading-lg` | `<Text variant="heading/lg">` |
| `text-base font-semibold` | `text-heading-md` | `<Text variant="heading/md">` |
| `text-sm font-semibold` | `text-heading-sm` | `<Text variant="heading/sm">` |
| `text-base` (16px body) | `text-body-lg` | `<Text variant="body/lg">` |
| `text-sm` (14px body) | `text-body-md` | `<Text variant="body/md">` |
| `text-xs` (12px content) | `text-body-sm` | `<Text variant="body/sm">` |
| `text-sm font-medium` (label) | `text-label-lg` | `<Text variant="label/lg">` |
| `text-xs font-medium` (tag) | `text-label-md` | `<Text variant="label/md">` |
| `text-xs` (12px helper/meta) | `text-caption-md` | `<Text variant="caption/md">` |

Import: `import { Text } from "@/components/ds";`

Typography classes set font-family, size, weight, line-height, and letter-spacing. Keep color (`text-text-secondary`), alignment, and truncation as separate classes.

### Extend, don't bypass

When a DS component exists but doesn't support the exact value production needs (e.g. Badge renders square but production is pill-shaped), the correct fix is:
1. Add a prop/variant to the DS component (e.g. `shape="pill"`)
2. Use the DS component with the new prop from the page

**Do NOT** replace the DS component with an inline `<span style={{...}}>` or `<div style={{...}}>`. Even if the inline version visually matches production, it bypasses the design system and creates drift. The same rule applies inside DS components — expose values as props, don't hardcode them.

### Banned patterns — do NOT write these:
- `const inputClass = "..."` or `const labelClass = "..."` — use `<FormInput>` / `<FormSelect>`
- Inline badge/button/color-dot/on-off styles — use `<Badge>`, `<Button>`, `<ColorDot>`, `<OnOffBadge>`
- Inline `<input type="color">` — use `<FormColorPicker>`
- Repeated dropdown arrays or modal state — use `@/lib/dropdown-presets` / `useFormModal`
- Raw `text-[Npx]` font sizes or `text-{size} font-{weight}` combos — use typography classes
- `<span style={{ borderRadius, backgroundColor, fontSize, ... }}>` replacing a DS Badge/Button — extend the DS component instead
- `style={{ fontSize: N, fontWeight: N }}` on headings — add a typography class to `globals.css` if none fits

### DS naming convention:
New components use [DaisyUI](https://daisyui.com/components/) names where a match exists (e.g. `Tab`, `Toggle`, `Modal`, `Avatar`, `Dropdown`, `Card`, `Collapse`, `Filter`, `Status`). See CLAUDE.md for the full table.

### When DS components don't fit:
- Tiny icon-only toolbar buttons (rich text editors) or one-off custom layouts — inline is fine
- All planned DS components are now created: Tab, Toggle, Modal, Avatar, Dropdown, Card, Collapse, Filter, Status, List, Navbar, EmptyState, Select, DateRangeFilter, ColorDot, OnOffBadge, FormColorPicker, SettingsListPage. Use the DS component rather than inline patterns.

## Design Spec — USE EXACT VALUES

If a design spec exists at `screenshots/specs/<page-name>.md`, read it and implement using those **exact values** — colors, font sizes, spacing, border-radius. Do not approximate. Cross-reference your Tailwind classes against the spec.

**Design intent matters.** When a Fix Brief specifies a value (e.g. `h-9` for a logo), it was derived from live production measurement — don't second-guess it with a different value. If something looks wrong after implementing, report back rather than guessing a different value.

## Visual Verification — 5-ITERATION DUAL-TAB MEASUREMENT LOOP

**THIS IS THE MOST IMPORTANT STEP.** Code changes without measurement verification are unverified guesses. The main agent will reject your work if you do not include a measurement comparison table in your output. After making code changes, run this loop up to 5 times. Do not stop after 1 iteration.

**Canonical viewport:** Ensure window is 1440x900. If you can resize, do so. If not, note actual size.

**If Chrome MCP is available:**

1. **MEASURE** — Run the same `javascript_tool` snippet on BOTH production (`acme.splose.com`) and localhost for every changed element. Use `docs/route-mapping.md` for URL pairs. If production is auth-gated, fall back to style-reference values.

   Use generic selectors that work on both sites (header, nav, main, h1, table, th, td, [role="menuitem"], etc.). Do NOT use `.ant-*` selectors — those only exist on production.

   Measure intrinsic properties only:
   ```js
   (() => {
     const selectors = [{ sel: '<SELECTOR>', label: '<LABEL>' }];
     const props = ['color','backgroundColor','fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','gap','borderRadius','borderColor','borderWidth','boxShadow'];
     const results = [];
     for (const {sel,label} of selectors) {
       const el = document.querySelector(sel);
       if (!el) { results.push({label,sel,error:'NOT FOUND'}); continue; }
       const s = getComputedStyle(el);
       const m = {}; for (const p of props) m[p] = s[p];
       results.push({label,sel,measured:m});
     }
     JSON.stringify(results,null,2)
   })()
   ```

2. **COMPARE** — Build a table for each element:
   ```
   | Property | Production | Localhost | Delta | Threshold | Pass? |
   |---|---|---|---|---|---|
   | color | rgb(65, 69, 73) | rgb(65, 69, 73) | 0 | exact RGB | PASS |
   | fontSize | 14px | 16px | +2px | exact | FAIL |
   ```

3. **STRUCTURAL CHECK** — Screenshot both production and localhost, zoom into changed zone. Record:
   - Production screenshot: [taken / skipped — reason]
   - Localhost screenshot: [taken / skipped — reason]
   - Missing/extra elements: [none / list]
   - Layout diffs: [none / list]

   **This step is mandatory.** A verification without structural findings is incomplete.

4. **EVALUATE** — 0 failures + no structural issues = PASS. Otherwise fix using exact delta, next iteration.

**Thresholds:** Colors exact RGB. Font size/weight exact. Line height +/-1px. Letter spacing +/-0.5px. Padding/gap +/-2px. Border radius exact. Skip container width/height (viewport-dependent).

**Max 5 iterations.** If still wrong after 5, report your Verification Log — don't keep guessing.

**If Chrome MCP is NOT available:**
Chrome MCP is mandatory. If browser tools are not available to you as a subagent, report this in your output: "BLOCKED: Chrome MCP not available — cannot verify." The main agent will handle troubleshooting. Do not attempt code-review-only verification or commit unverified visual changes.

### Acceptance criteria (structural — supplement to measurement):
- **Layout**: Same grid/flex structure, same sidebar/header/content arrangement
- **Components**: Correct DS components used (Button not bare `<button>`, Badge not inline pill, etc.)
- **Content**: Same column headers, labels, placeholder text, button labels as reference
- **Typography**: Use typography classes (`text-display-lg`, `text-heading-md`, etc.) — not raw combos
- **Interactive elements**: Modals, dropdowns, tabs shown in reference exist in code and are wired up
- **Data shape**: Tables have same columns, forms have same fields as reference

## Required Output — Verification Evidence

**Your final output MUST include a structured verification summary.** The main agent uses this to decide whether to commit or revert your work. If this section is missing, your changes will be treated as unverified.

```
### Verification Summary
- Elements checked: [N]
- Properties measured: [N]
- Pass: [N] | Fail: [N]
- Verdict: PASS / FAIL / SKIPPED (with reason)

| Element | Property | Target | Actual | Pass? |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |
```

**Never report PASS without measurement data.** If you didn't measure, say so. If Chrome MCP was not available, report "BLOCKED" — do not report "PARTIAL" or guess.

## Worktree Safety — IF APPLICABLE

**Only if your prompt says you are in a worktree (`isolation: "worktree"`):**

1. **On start:** Verify you are in the worktree directory (`pwd`). Run: `git fetch origin main && git merge origin/main --no-edit`
2. **During work:** Edit only files listed in your Fix Brief. Run `npx tsc --noEmit` after each file change.
3. **Before exiting — CRITICAL:** You MUST commit: `git add -A && git commit -m "<summary of changes>"`. Agents that don't commit lose all work.
4. **Do not** push to remote or manually delete the worktree — the main agent handles merge and cleanup.

---END AGENT BLOCK---
```
