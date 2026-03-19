# Visual Audit Workflow

Verify that implemented pages actually match their reference screenshots. This is the quality gate that closes the loop — without it, gaps get marked "done" based on page existence alone.

## When to run

- After a batch of fidelity loop work
- When you suspect gaps were marked done prematurely
- Periodically as a health check (every few sessions)

## The source of truth

**`screenshots/screenshot-catalog.md`** is the source of truth for fidelity status, not `docs/fidelity-gaps.md`. The catalog has a Match column per screenshot entry:
- **yes** — prototype matches the reference screenshot
- **partial** — some elements match, with notes on what's missing
- **no** — does not match or has not been verified

A fidelity gap in `docs/fidelity-gaps.md` can only be marked `[x]` when ALL of its related catalog entries show Match = "yes".

## Step 1: Pick pages to audit

Read `screenshots/screenshot-catalog.md` and identify entries with Match = "no" or "partial". Group by page/route. Prioritize:
1. Pages marked "partial" (closest to done)
2. High-traffic pages (Dashboard, Calendar, Clients)
3. Pages that were recently worked on (may have been marked done without verification)

## Step 2: Take fresh screenshots

For each page to audit, take a Playwright screenshot:

```bash
npx playwright screenshot --wait-for-timeout=3000 http://localhost:3000/<page-path> /tmp/audit-<page>.png
```

For pages with multiple states (modals, tabs, dropdowns), you may need to take multiple screenshots or verify the interactive states exist in the code.

## Step 3: Compare against references

For each page:
1. Read the fresh screenshot with the Read tool
2. Read the reference screenshot(s) from `screenshots/reference/`
3. Compare visually:
   - Layout and structure (sidebar, header, content area)
   - Table columns, rows, and data format
   - Button labels, positions, variants
   - Badge/status colors and text
   - Form fields and labels
   - Modal content and styling
   - Typography (headings, body text, secondary text)
   - Spacing and padding
   - Icons and decorative elements

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
1. Read the relevant reference screenshots
2. Take fresh Playwright screenshots
3. Compare and return a structured report of matches/mismatches
4. Do NOT modify code — audit is read-only

The main agent then collects results and updates the catalog and gaps.
