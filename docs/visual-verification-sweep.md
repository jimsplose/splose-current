# Full Visual Verification Sweep

Systematic Chrome MCP visual verification of every page in the prototype. Use this when you need confidence that the entire codebase looks correct — not just pages that were recently changed.

## Prerequisites

- Dev server running: `npm run dev` (localhost:3000)
- Chrome MCP connected and working

## Step 1: Load the page list

Read `src/lib/state-registry.ts` to get all pages and their state variants. Group by section:

1. **Core pages** — Dashboard, Login
2. **Calendar** — Week, Day, Month, Rooms, appointment selected, new/edit appointment
3. **Clients** — List, detail, all 13 sub-tabs, new/edit
4. **Contacts** — List, detail, new
5. **Notes** — List, new, view, edit, send modal
6. **Invoices** — List, detail, new
7. **Products** — List, new
8. **Payments** — List, new
9. **Practitioners** — List, detail
10. **Waitlist** — List, screener, map, new
11. **Reports** — Overview, appointments, performance, progress notes
12. **Settings** — All 25+ sub-pages, template editors, new/edit pages
13. **Online booking** — Select, confirm, confirmed

## Step 2: Capture and compare (parallel agents)

Launch parallel agents, each handling a section. Every agent prompt MUST include:

```
You are doing a visual verification sweep using Chrome MCP.

For each page in your section:
1. Navigate to the page in Chrome MCP at http://localhost:3000/<path>
2. Take a screenshot
3. Read the matching reference from screenshots/reference/ (if one exists)
4. Compare: layout, DS component usage, content, typography, colors, spacing, interactive elements
5. Record your findings as: page | status (pass/partial/fail) | notes

For pages with interactive states (?state= variants), navigate to each variant.
For modals/dropdowns, click to open them and verify content.

Do NOT modify any code. This is a read-only audit.

Report format per page:
- **Page**: /path (?state=variant)
- **Status**: pass | partial | fail
- **Issues**: bullet list of specific problems (or "none")
```

**Parallelization** — group by section, one agent per section. Sections that share no files are safe to run simultaneously.

## Step 3: Collect results

Main agent collects all section reports and produces a summary table:

| Section | Pages | Pass | Partial | Fail | Key Issues |
|---|---|---|---|---|---|
| Calendar | 7 | 5 | 2 | 0 | Month view data mismatch |
| ... | | | | | |

## Step 4: Update catalog

Update `screenshots/screenshot-catalog.md` Match column for every page that was verified:
- **yes** — page matches reference
- **partial — [detail]** — specific mismatches noted
- **no** — significant mismatch or broken

## Step 5: Create TODOs

For pages at "partial" or "fail":
1. Add/update fidelity gaps in `docs/fidelity-gaps.md` with specific issues
2. Prioritize: fail > partial, high-traffic pages first
3. Note which issues are structural vs data-driven vs interactive state gaps

## Step 6: Report

Present to Jim:
- Total pages verified
- Pass/partial/fail breakdown
- Top 5 issues by severity
- Recommended next session focus

## When to skip pages

- Pages with no reference screenshots — note as "no reference" in catalog, don't mark as fail
- Pages where the only mismatch is seed data vs production data — mark as "partial — data-driven"
- Login page — browser chrome differences are expected
