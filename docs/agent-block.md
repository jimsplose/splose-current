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

Import: `import { Button, FormInput, FormSelect, Badge, PageHeader } from "@/components/ds";`

### Banned patterns — do NOT write these:
- `const inputClass = "w-full rounded-lg border..."` — use `<FormInput>` instead
- `const labelClass = "block text-sm font-medium..."` — `<FormInput label="">` includes the label
- Inline badge styles (`rounded-full px-2 py-0.5 text-xs font-medium`) — use `<Badge>`
- Inline button styles (`rounded-lg bg-primary px-4 py-2 text-sm font-medium`) — use `<Button>`

### DS naming convention:
New components use [DaisyUI](https://daisyui.com/components/) names where a match exists (e.g. `Tab`, `Toggle`, `Modal`, `Avatar`, `Dropdown`, `Card`, `Collapse`, `Filter`, `Status`). This keeps naming predictable. See CLAUDE.md for the full table.

### When DS components don't fit:
- Tiny icon-only toolbar buttons (rich text editors) — inline is fine
- One-off custom layouts — inline is fine
- If a planned DS component (Tab, Toggle, Modal, Avatar, Dropdown, Card, Collapse, Filter, Status, List, Navbar, EmptyState, Select, DateRangeFilter) hasn't been created yet, use the inline pattern but add a `// TODO: extract to DS <ComponentName>` comment so it's easy to find later

## Screenshot Verification Loop — MANDATORY

After making your code changes, you MUST run this loop. Do NOT skip it.

### If Playwright browsers are available:
1. Run `npx playwright screenshot --wait-for-timeout=2000 http://localhost:3000/<page-path> /tmp/screenshot-<page>.png`
2. Read the screenshot using the Read tool (it supports images)
3. Read the reference screenshot from `screenshots/reference/<relevant-file>`
4. Compare using the acceptance criteria below
5. If not matching, make changes and repeat (up to 3 iterations)
6. On final iteration, save the screenshot to `/tmp/screenshot-<page>-final.png`

### If Playwright browsers are NOT available (fallback):
1. Read the reference screenshot from `screenshots/reference/<relevant-file>` using the Read tool
2. Read your page source code
3. Compare the source code structure against what the reference screenshot shows
4. Check: correct DS components used, correct data/labels, correct layout structure, correct colors/variants
5. If not matching, make changes and repeat (up to 3 iterations)

**Note:** Playwright is installed as a dev dependency but browsers must be downloaded separately (`npx playwright install chromium`). Some environments block the CDN download. The fallback approach (reading reference screenshots + comparing against source) is acceptable when browsers aren't available.

### Acceptance criteria (what "matches" means):
- **Layout**: Same grid/flex structure, same sidebar/header/content arrangement
- **Components**: Correct DS components used (Button not bare `<button>`, Badge not inline pill, etc.)
- **Content**: Same column headers, labels, placeholder text, button labels as reference
- **Colors**: Correct badge variants (green/red/yellow/blue), correct button variants (primary/secondary/danger)
- **Typography**: Headings are headings, secondary text is muted, correct font weights
- **Spacing**: Reasonable match — no glaring differences in padding/margins (exact pixel match not required)
- **Interactive elements**: Modals, dropdowns, tabs shown in reference exist in code and are wired up
- **Data shape**: Tables have same columns, forms have same fields as reference

---END AGENT BLOCK---
```
