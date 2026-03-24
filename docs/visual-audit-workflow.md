# Visual Audit Workflow

Verify that implemented pages actually match their reference screenshots. This is the quality gate that closes the loop — without it, gaps get marked "done" based on page existence alone.

## When to run

- After a batch of fidelity loop work
- When you suspect gaps were marked done prematurely
- Periodically as a health check (every few sessions)

## The source of truth

See the **Gap completion rule** in CLAUDE.md. The catalog (`screenshots/screenshot-catalog.md`) Match column determines gap status:
- **yes** — prototype matches the reference screenshot
- **partial** — some elements match, with notes on what's missing (format: `partial — <what's wrong>`)
- **no** — does not match or has not been verified

## Step 1: Pick pages to audit

Read `screenshots/screenshot-catalog.md` and identify entries with Match = "no" or "partial". Group by page/route. Prioritize:
1. Pages marked "partial" (closest to done)
2. High-traffic pages (Dashboard, Calendar, Clients)
3. Pages that were recently worked on (may have been marked done without verification)

## Step 2: Capture current state of each page

Use **Chrome MCP** to navigate to each page and take screenshots. This gives the most accurate rendering since it uses the same Chrome browser the user sees.

1. Navigate to `http://localhost:3000/<page-path>` using Chrome MCP
2. Take a screenshot using Chrome MCP's screenshot capability
3. For pages with interactive states, use Chrome MCP to click/interact before capturing

### For pages with multiple states:
Navigate to each state using `?state=` params:
- `http://localhost:3000/<page-path>?state=<variant>`
- Or use Chrome MCP to interact (click tabs, open dropdowns) and capture each state

## Step 3: Three-source comparison

Each page is compared against **three sources of truth**:

### 3a. Visual comparison — Chrome MCP screenshots vs saved references

Use Chrome MCP to capture the current prototype page, then visually compare against the saved reference screenshot from `screenshots/reference/`.

**Read both images** side by side to compare layout, structure, and content. Chrome MCP captures match the real browser rendering exactly — no DPI mismatches.

### 3b. Style reference comparison — extracted CSS values

Read the style reference for the page from `splose-style-reference/`:
- **Page structure**: `splose-style-reference/page-structures/<page>.md` — DOM hierarchy, class names, nesting
- **Component styles**: `splose-style-reference/components/` — exact CSS values (colors, fonts, borders, spacing)
- **Design tokens**: `splose-style-reference/design-tokens/` — colours, typography, borders, shadows

Compare the prototype's Tailwind classes against the extracted CSS values:
- Font sizes match? (e.g. `text-base` = 14px, reference says 14px ✓)
- Colors match? (e.g. `text-text` = #414549, reference `rgb(65, 69, 73)` ✓)
- Border radius match? (e.g. `rounded-lg` = 8px, reference `border-radius: 8px` ✓)
- Spacing match? (e.g. `p-4` = 16px, reference `padding: 16px` ✓)

### 3c. Structural comparison — DOM hierarchy

Compare the prototype's component tree against the page-structure reference:
- Same nesting depth? (header → sidebar → content)
- Same element roles? (list, table, tabs, cards)
- Same interactive states? (dropdowns, modals, side panels)

### Match criteria

| Check | Pass | Fail |
|---|---|---|
| **Layout** | Same column/section structure as reference | Missing sections, wrong nesting |
| **DS components** | Correct DS components used | Bare `<button>` instead of `<Button>` |
| **Content** | Same column headers, labels, placeholders | Wrong text, missing columns |
| **Interactive states** | Modals, dropdowns, tabs exist | Reference shows dropdown, prototype has none |
| **Typography** | Font sizes/weights match style reference | Wrong size or weight |
| **Colors** | Token colors match style reference | Wrong color values |
| **Spacing** | Padding/margins match style reference | Visibly different spacing |

## Step 4: Update the catalog

For each screenshot entry compared:
- If it matches → update Match to "yes"
- If it partially matches → update Match to "partial" and add a note describing what's missing
- If it doesn't match → keep Match as "no"

## Step 5: Extract design specs for problem pages

For pages with Match = "partial" or "no", check if a design spec exists at `screenshots/specs/<page-name>.md`. **If not, extract one now** by following `docs/design-spec-workflow.md`. This ensures the next fidelity loop has exact values to work with instead of eyeballing.

Priority:
1. Pages that were "partial" before the audit and are still "partial" — these are stuck and need exact specs
2. Pages with high mismatch % (>20%) — specs help agents make bigger jumps
3. Skip pages that already have up-to-date specs

## Step 6: Update fidelity gaps

Based on the audit results:

### For gaps currently marked `[x]` (done):
- If ALL related catalog entries are "yes" → leave as `[x]`
- If ANY related catalog entries are "no" or "partial" → **uncheck back to `[ ]`** with a note: "Reopened: visual audit found mismatches"

### For new mismatches found:
- If there's no existing gap → create a new one in the appropriate priority group
- Include specific details: what's wrong, which screenshot(s) show the issue

## Step 7: Report results

Present a summary to Jim:

```
### Visual Audit Results

**Pages audited:** 15
**Matching (yes):** 3
**Partial match:** 7
**No match:** 5

**Gaps reopened:** 4
**New gaps created:** 2

**Biggest mismatches:**
- Settings Details: form layout doesn't match, missing business history modal
- Calendar Week: appointment blocks wrong color, missing practitioner columns
```

## Parallelization

You can run audit comparisons in parallel using subagents — each agent audits a different page group. Agents should:
1. Capture screenshots using `npx tsx scripts/screenshot-capture.ts`
2. Run `npx tsx scripts/pixel-diff.ts` against each reference screenshot
3. Read the diff images to understand what's different
4. Return a structured report per screenshot entry: `filename | mismatch % | match status (yes/partial/no) | notes`
5. Do NOT modify code — audit is read-only

The main agent then collects results and updates the catalog and gaps.

## Storybook verification

As part of the audit, also verify DS component coverage:
1. Run `npm run storybook` (or check `src/components/ds/stories/`) to confirm all DS components have stories
2. For any new DS components added during fidelity work, verify a story exists
3. If a story is missing, flag it as a gap (not a blocker — can be added later)

## Step 8: Return to menu (or continue in autonomous mode)

**Quick/Standard duration modes:** After completing the audit, **show the session start menu again** (see CLAUDE.md). Include the audit summary (pages audited, matches, gaps reopened/created). Let Jim choose what's next.

**Extended/Until-done duration modes:** After the audit, automatically transition to fidelity loops for any gaps found or reopened:
1. Commit audit results (catalog + gap updates)
2. Re-read `docs/fidelity-gaps.md` for the latest state
3. Launch fidelity loop agents for the highest-priority open gaps
4. Continue the autonomous loop (see fidelity-workflow.md Step 8 for stop conditions)
5. When stopping: commit all work, push, show full session summary
