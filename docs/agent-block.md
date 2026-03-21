# Subagent Prompt Template

**Every subagent that creates or modifies page UI MUST receive this block at the top of its prompt.** Do NOT launch a UI-touching subagent without it. This is a single, self-contained block that covers DS enforcement AND screenshot verification.

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
| `<div><label className="...">Name</label><input className="w-full rounded-lg border..."/></div>` | `<FormInput label="Name" />` |
| `<div><label>...</label><select className="..."><option>...</select></div>` | `<FormSelect label="..." options={[...]} />` |
| `<span className="rounded-full px-2 py-0.5 text-xs font-medium bg-green-100...">` | `<Badge variant="green">` |
| `<div className="flex items-center justify-between mb-4"><h1 className="text-2xl font-bold">` | `<PageHeader title="...">` |

| `<span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />` | `<ColorDot color={color} />` |
| `<span className={value ? "text-green-600" : "text-red-500"}>{value ? "On" : "Off"}</span>` | `<OnOffBadge value={value} />` |
| `<input type="color" value={color} onChange={...} className="h-10 w-10...">` + label | `<FormColorPicker value={color} onChange={...} />` |
| Repeated `const dropdownItems = [{ label: "Edit"... }]` | `import { STANDARD_SETTINGS } from "@/lib/dropdown-presets"` |
| Repeated `modalOpen`/`editingIndex`/`openCreate`/`openEdit`/`handleSave` state | `import { useFormModal } from "@/hooks/useFormModal"` |
| `new Date().toLocaleString("en-AU", { hour: "numeric", ... })` | `import { formatTimestamp } from "@/lib/format"` |
| Simple CRUD settings page with DataTable + Modal | `<SettingsListPage>` template |

Import: `import { Button, FormInput, FormSelect, Badge, PageHeader, ColorDot, OnOffBadge, FormColorPicker, SettingsListPage } from "@/components/ds";`

### Typography — MANDATORY

Use typography utility classes or `<Text>` component instead of inline font-size + font-weight combos. See `docs/typography-spec.md` for the full spec and `docs/typography-migration.md` for the mapping table.

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

### Banned patterns — do NOT write these:
- `const inputClass = "w-full rounded-lg border..."` — use `<FormInput>` instead
- `const labelClass = "block text-sm font-medium..."` — `<FormInput label="">` includes the label
- Inline badge styles (`rounded-full px-2 py-0.5 text-xs font-medium`) — use `<Badge>`
- Inline button styles (`rounded-lg bg-primary px-4 py-2 text-sm font-medium`) — use `<Button>`
- Inline color dot (`<span className="inline-block h-3 w-3 rounded-full"...>`) — use `<ColorDot>`
- Inline on/off text (`text-green-600`/`text-red-500` conditional) — use `<OnOffBadge>`
- Inline `<input type="color">` — use `<FormColorPicker>`
- Repeated dropdown item arrays — use presets from `@/lib/dropdown-presets`
- Repeated modal state (modalOpen/editingIndex/formFields) — use `useFormModal` from `@/hooks/useFormModal`
- Raw `text-[Npx]` font sizes (`text-[11px]`, `text-[13px]`) — use the nearest typography class
- Raw `text-{size} font-{weight}` combos — use a typography class instead

### DS naming convention:
New components use [DaisyUI](https://daisyui.com/components/) names where a match exists (e.g. `Tab`, `Toggle`, `Modal`, `Avatar`, `Dropdown`, `Card`, `Collapse`, `Filter`, `Status`). This keeps naming predictable. See CLAUDE.md for the full table.

### When DS components don't fit:
- Tiny icon-only toolbar buttons (rich text editors) — inline is fine
- One-off custom layouts — inline is fine
- All planned DS components are now created: Tab, Toggle, Modal, Avatar, Dropdown, Card, Collapse, Filter, Status, List, Navbar, EmptyState, Select, DateRangeFilter, ColorDot, OnOffBadge, FormColorPicker, SettingsListPage. Use the DS component rather than inline patterns.

## Design Spec — USE EXACT VALUES

If a design spec exists at `screenshots/specs/<page-name>.md`, read it and implement using those **exact values** — colors, font sizes, spacing, border-radius. Do not approximate. Cross-reference your Tailwind classes against the spec.

## Screenshot Verification Loop — MANDATORY (Puppeteer)

After making your code changes, you MUST run this loop. Puppeteer bundles Chromium automatically via `npm install` — no separate browser download needed. If a persistent browser is running (start-browser.ts), captures auto-connect and skip the ~3-5s cold start.

### Capture and diff:
1. Capture: `npx tsx scripts/screenshot-capture.ts http://localhost:3000/<page-path> /tmp/current-<page>.png`
2. Run pixel diff: `npx tsx scripts/fidelity-loop.ts screenshots/reference/<relevant-file> /tmp/current-<page>.png --iteration=1 --history=/tmp/convergence-<page>.json --threshold=5`
3. **Iteration 1 only:** Read the diff image at `/tmp/diff-iteration-1.png` to see exactly which pixels differ. Also read both the reference and current screenshots visually for context.

### Convergence loop:
4. If the fidelity-loop script outputs `CONTINUE` — fix the highlighted differences, re-capture, and run again with `--iteration=2`, etc.
5. **Iterations 2+:** Do NOT re-read the diff image or screenshots. You already know what's wrong from iteration 1. Just read the mismatch % from the script output and fix based on that + your memory of the diff. Only re-read the diff image if the mismatch % goes UP (regression) or if you're stuck.
6. If it outputs `CONVERGED` (mismatch <= 5%) — you're done, move on
7. If it outputs `PLATEAU` — mismatch stopped improving. The remaining diff likely needs a structural change (missing component, wrong layout). Describe what's still wrong in your output so the main agent can decide next steps.
8. If it outputs `MAX_ITERATIONS` (10) — stop and report remaining mismatch %

**Do NOT use a fixed iteration cap.** Let the convergence tracker decide when to stop.

### Acceptance criteria (what "matches" means):
- **Pixel diff**: Mismatch <= 5% (measured by `scripts/pixel-diff.ts`)
- **Layout**: Same grid/flex structure, same sidebar/header/content arrangement
- **Components**: Correct DS components used (Button not bare `<button>`, Badge not inline pill, etc.)
- **Content**: Same column headers, labels, placeholder text, button labels as reference
- **Colors**: Exact hex/Tailwind values from design spec (not "close enough")
- **Typography**: Use typography classes (`text-display-lg`, `text-heading-md`, etc.) — not raw `text-sm font-semibold` combos. See `docs/typography-spec.md`
- **Spacing**: Exact padding/margin values from design spec (not "reasonable match")
- **Interactive elements**: Modals, dropdowns, tabs shown in reference exist in code and are wired up
- **Data shape**: Tables have same columns, forms have same fields as reference

---END AGENT BLOCK---
```
