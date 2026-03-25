# Visual Audit Match Criteria

Detailed criteria for comparing prototype pages against production (`acme.splose.com`).

## Dual-Tab Comparison (preferred)

Navigate Chrome to both production and localhost at the same canonical viewport (1440x900). Compare using two methods:

### 1. Measurement comparison (pass/fail authority)
Run the same `javascript_tool` snippet on both tabs. Compare intrinsic CSS properties directly:
- Font sizes, weights, families
- Colors (text, background, border)
- Padding, gap, border-radius
- Line height, letter spacing, box shadow

See `docs/compare-pages-workflow.md` Step 2c for the standard snippet and `docs/fix-gaps-workflow.md` Step 4 for acceptance thresholds.

### 2. Structural comparison (catches what measurement misses)
Screenshot both tabs and compare zones visually:
- Same nesting depth (header → sidebar → content)
- Same element roles (list, table, tabs, cards)
- Same interactive states (dropdowns, modals, side panels)
- Missing/extra elements, wrong order, wrong icons

## Fallback: Style Reference Comparison

When production is auth-gated or Chrome MCP is unavailable, compare against `splose-style-reference/`:
- **Page structures**: `page-structures/<page>.md` — DOM hierarchy, class names
- **Component styles**: `components/` — exact CSS values
- **Design tokens**: `design-tokens/` — colours, typography, borders, shadows

Compare Tailwind classes against extracted values:
- Font sizes (e.g. `text-base` = 14px, reference 14px)
- Colors (e.g. `text-text` = #414549, reference `rgb(65, 69, 73)`)
- Border radius (e.g. `rounded-lg` = 8px, reference 8px)
- Spacing (e.g. `p-4` = 16px, reference 16px)

**Note:** `splose-style-reference/` is a point-in-time snapshot (March 23, 2026). Always prefer live production measurement when possible.

## Match Criteria Table

| Check | Pass | Fail |
|---|---|---|
| **Layout** | Same column/section structure | Missing sections, wrong nesting |
| **DS components** | Correct DS components used | Bare `<button>` instead of `<Button>` |
| **Content** | Same headers, labels, placeholders | Wrong text, missing columns |
| **Interactive** | Modals, dropdowns, tabs exist | Reference shows dropdown, prototype has none |
| **Typography** | Font sizes/weights match production | Wrong size or weight |
| **Colors** | Token colors match production | Wrong color values |
| **Spacing** | Padding/margins match production | Visibly different spacing |

## Match Status Values

- **yes** — measurement-verified via dual-tab live comparison
- **yes — visual only** — no measurement data, needs deep verify
- **partial — <what's wrong>** — some elements match, notes on differences
- **no** — significant mismatch or not verified

## Parallelization

Audit agents can run in parallel (different page groups). Each agent should:
1. Set up dual tabs (production + localhost) per `docs/route-mapping.md`
2. Measure and compare per `docs/compare-pages-workflow.md`
3. Return structured report: `filename | match status (yes/partial/no) | notes`
4. Do NOT modify code — audit is read-only
