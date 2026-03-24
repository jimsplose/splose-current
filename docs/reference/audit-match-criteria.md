# Visual Audit Match Criteria

Detailed criteria for comparing prototype pages against reference screenshots.

## Three-Source Comparison

### 1. Visual comparison (Chrome MCP vs saved references)
Navigate to prototype page, capture screenshot with Chrome MCP, compare against `screenshots/reference/`.

### 2. Style reference comparison (extracted CSS values)
Read from `splose-style-reference/`:
- **Page structures**: `page-structures/<page>.md` — DOM hierarchy, class names
- **Component styles**: `components/` — exact CSS values
- **Design tokens**: `design-tokens/` — colours, typography, borders, shadows

Compare Tailwind classes against extracted values:
- Font sizes (e.g. `text-base` = 14px, reference 14px ✓)
- Colors (e.g. `text-text` = #414549, reference `rgb(65, 69, 73)` ✓)
- Border radius (e.g. `rounded-lg` = 8px, reference 8px ✓)
- Spacing (e.g. `p-4` = 16px, reference 16px ✓)

### 3. Structural comparison (DOM hierarchy)
- Same nesting depth (header → sidebar → content)
- Same element roles (list, table, tabs, cards)
- Same interactive states (dropdowns, modals, side panels)

## Match Criteria Table

| Check | Pass | Fail |
|---|---|---|
| **Layout** | Same column/section structure | Missing sections, wrong nesting |
| **DS components** | Correct DS components used | Bare `<button>` instead of `<Button>` |
| **Content** | Same headers, labels, placeholders | Wrong text, missing columns |
| **Interactive** | Modals, dropdowns, tabs exist | Reference shows dropdown, prototype has none |
| **Typography** | Font sizes/weights match style ref | Wrong size or weight |
| **Colors** | Token colors match style ref | Wrong color values |
| **Spacing** | Padding/margins match style ref | Visibly different spacing |

## Match Status Values

- **yes** — prototype visually matches reference
- **partial — <what's wrong>** — some elements match, notes on differences
- **no** — significant mismatch or not verified

## Parallelization

Audit agents can run in parallel (different page groups). Each agent should:
1. Capture page with Chrome MCP
2. Compare against reference screenshots and style reference
3. Return structured report: `filename | match status (yes/partial/no) | notes`
4. Do NOT modify code — audit is read-only
