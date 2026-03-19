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

### If Playwright browsers are available:
```bash
npx playwright screenshot --wait-for-timeout=3000 http://localhost:3000/<page-path> /tmp/audit-<page>.png
```
Then read the screenshot with the Read tool.

### If Playwright browsers are NOT available (fallback):
Read the page source code directly. The comparison becomes: "does the source code produce the same UI as the reference screenshot?"

### For pages with multiple states:
Check that modals, tabs, dropdowns, and interactive variants shown in reference screenshots exist in the code and are wired to `?state=` params or click handlers.

## Step 3: Compare against references

For each page:
1. Read the reference screenshot(s) from `screenshots/reference/`
2. Read the current page (screenshot if available, source code if not)
3. Compare using these **acceptance criteria**:

| Criterion | What to check | Example fail |
|---|---|---|
| **Layout** | Same grid/flex structure, sidebar/header/content arrangement | Reference has 2-column layout, prototype has single column |
| **DS components** | Correct DS components used, no banned inline patterns | Bare `<button>` where `<Button variant="secondary">` should be |
| **Content** | Same column headers, labels, button text, placeholder text | Reference says "Search clients...", prototype says "Search..." |
| **Colors** | Correct badge variants, button variants, status colors | Green badge in reference, blue in prototype |
| **Typography** | Headings/body/secondary text correct weight and size | Page title is `text-lg` but should be `text-2xl font-bold` |
| **Spacing** | No glaring differences in padding/margins | Reference has tight table rows, prototype has huge gaps |
| **Interactive states** | Modals, dropdowns, tabs from reference exist in code | Reference shows actions dropdown, prototype has no dropdown |
| **Data shape** | Tables have same columns, forms have same fields | Reference has 6 columns, prototype only has 3 |

## Step 4: Update the catalog

For each screenshot entry compared:
- If it matches → update Match to "yes"
- If it partially matches → update Match to "partial" and add a note describing what's missing
- If it doesn't match → keep Match as "no"

## Step 5: Update fidelity gaps

Based on the audit results:

### For gaps currently marked `[x]` (done):
- If ALL related catalog entries are "yes" → leave as `[x]`
- If ANY related catalog entries are "no" or "partial" → **uncheck back to `[ ]`** with a note: "Reopened: visual audit found mismatches"

### For new mismatches found:
- If there's no existing gap → create a new one in the appropriate priority group
- Include specific details: what's wrong, which screenshot(s) show the issue

## Step 6: Report results

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
1. Read the relevant reference screenshots from `screenshots/reference/`
2. Read the current page source code
3. If Playwright available, take screenshots; otherwise compare source against reference visually
4. Compare using the acceptance criteria table above
5. Return a structured report per screenshot entry: `filename | match status (yes/partial/no) | notes`
6. Do NOT modify code — audit is read-only

The main agent then collects results and updates the catalog and gaps.

## Storybook verification

As part of the audit, also verify DS component coverage:
1. Run `npm run storybook` (or check `src/components/ds/stories/`) to confirm all DS components have stories
2. For any new DS components added during fidelity work, verify a story exists
3. If a story is missing, flag it as a gap (not a blocker — can be added later)

## Step 7: Return to menu

After completing the audit, **show the session start menu again** (see CLAUDE.md). Include the audit summary (pages audited, matches, gaps reopened/created).

Jim may want to run fidelity loops to fix the gaps found, upload more screenshots, or do something else. Let him choose.
