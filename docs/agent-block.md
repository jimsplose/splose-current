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

### Banned patterns — do NOT write these:
- `const inputClass = "..."` or `const labelClass = "..."` — use `<FormInput>` / `<FormSelect>`
- Inline badge/button/color-dot/on-off styles — use `<Badge>`, `<Button>`, `<ColorDot>`, `<OnOffBadge>`
- Inline `<input type="color">` — use `<FormColorPicker>`
- Repeated dropdown arrays or modal state — use `@/lib/dropdown-presets` / `useFormModal`
- Raw `text-[Npx]` font sizes or `text-{size} font-{weight}` combos — use typography classes

### DS naming convention:
New components use [DaisyUI](https://daisyui.com/components/) names where a match exists (e.g. `Tab`, `Toggle`, `Modal`, `Avatar`, `Dropdown`, `Card`, `Collapse`, `Filter`, `Status`). See CLAUDE.md for the full table.

### When DS components don't fit:
- Tiny icon-only toolbar buttons (rich text editors) or one-off custom layouts — inline is fine
- All planned DS components are now created: Tab, Toggle, Modal, Avatar, Dropdown, Card, Collapse, Filter, Status, List, Navbar, EmptyState, Select, DateRangeFilter, ColorDot, OnOffBadge, FormColorPicker, SettingsListPage. Use the DS component rather than inline patterns.

## Design Spec — USE EXACT VALUES

If a design spec exists at `screenshots/specs/<page-name>.md`, read it and implement using those **exact values** — colors, font sizes, spacing, border-radius. Do not approximate. Cross-reference your Tailwind classes against the spec.

## Visual Verification — CONDITIONAL

After making your code changes, verify visually if Chrome MCP is available:

**If Chrome MCP is available:**
1. Navigate to the changed page at `http://localhost:3000/<page-path>`
2. Take a Chrome MCP screenshot and compare against `screenshots/reference/` and `splose-style-reference/`
3. Fix any visual mismatches and re-check

**If Chrome MCP is NOT available:**
1. Skip screenshot capture — do not attempt Chrome MCP operations
2. Report your changes in a structured summary:
   - Files modified and what changed in each
   - DS components used (with props)
   - Tailwind classes applied for key visual elements (colors, spacing, typography)
   - Any areas of uncertainty where visual verification would help
3. The main agent will verify your work afterward

### Acceptance criteria (apply regardless of verification method):
- **Layout**: Same grid/flex structure, same sidebar/header/content arrangement
- **Components**: Correct DS components used (Button not bare `<button>`, Badge not inline pill, etc.)
- **Content**: Same column headers, labels, placeholder text, button labels as reference
- **Colors/Spacing**: Exact hex/Tailwind values and padding/margin from design spec (not approximations)
- **Typography**: Use typography classes (`text-display-lg`, `text-heading-md`, etc.) — not raw combos. See `docs/typography-spec.md`
- **Interactive elements**: Modals, dropdowns, tabs shown in reference exist in code and are wired up
- **Data shape**: Tables have same columns, forms have same fields as reference

---END AGENT BLOCK---
```
