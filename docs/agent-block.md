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

## Design Spec — USE EXACT VALUES

If a design spec exists at `screenshots/specs/<page-name>.md`, read it and implement using those **exact values** — colors, font sizes, spacing, border-radius. Do not approximate. Cross-reference your Tailwind classes against the spec.

## Screenshot Verification Loop — MANDATORY (Puppeteer)

After making your code changes, you MUST run this loop. Puppeteer bundles Chromium automatically via `npm install` — no separate browser download needed.

### Capture and diff:
1. Capture: `npx tsx scripts/screenshot-capture.ts http://localhost:3000/<page-path> /tmp/current-<page>.png`
2. Run pixel diff: `npx tsx scripts/fidelity-loop.ts screenshots/reference/<relevant-file> /tmp/current-<page>.png --iteration=1 --history=/tmp/convergence-<page>.json --threshold=5`
3. Read the diff image at `/tmp/diff-iteration-1.png` to see exactly which pixels differ
4. Also read both the reference and current screenshots visually for context

### Convergence loop:
5. If the fidelity-loop script outputs `CONTINUE` — fix the highlighted differences, re-capture, and run again with `--iteration=2`, etc.
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
- **Typography**: Exact font sizes and weights from design spec
- **Spacing**: Exact padding/margin values from design spec (not "reasonable match")
- **Interactive elements**: Modals, dropdowns, tabs shown in reference exist in code and are wired up
- **Data shape**: Tables have same columns, forms have same fields as reference

---END AGENT BLOCK---
```
