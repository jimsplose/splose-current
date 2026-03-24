# Compare Pages Workflow

Compare localhost pages against reference screenshots. Find mismatches, update the catalog, reopen gaps. This is analysis only — no code changes.

## Scope (set by menu prompt)

- **Quick**: 2-3 pages — pick the highest-priority partials
- **Standard**: All partial/no entries in the catalog
- **Full sweep**: Every page in `src/lib/state-registry.ts`, including pages marked "yes" (re-verify)
- **Until done**: Full sweep, then keep iterating until all pages are checked

## Step 0: Prerequisites

1. Dev server running (`npm run dev` on localhost:3000)
2. Chrome MCP available (if not, use fallback path — read references + code comparison)
3. Invoke `/impeccable:frontend-design` — this activates design-informed analysis for the session

## Step 1: Pick pages

**Quick/Standard:** Read `screenshots/screenshot-catalog.md`, pick entries with Match = "no" or "partial". Prioritize: (1) partials, (2) high-traffic pages (Dashboard, Calendar, Clients), (3) recently changed pages.

**Full sweep:** Read `src/lib/state-registry.ts` for all pages grouped by section. Work through every section.

## Step 2: Zoom-Compare Loop (per page)

For each page, run this loop. **This is the core of the workflow — do not shortcut it.**

### 2a. Capture and crop

1. Navigate to the page in Chrome MCP
2. Take a **full-page screenshot**
3. Read the matching reference from `screenshots/reference/`
4. Identify 2-4 **comparison zones** — areas most likely to have mismatches:
   - Navigation/header (logo, nav items, icons)
   - Page title and toolbar area
   - Main content (table, cards, form)
   - Interactive elements (modals, dropdowns, side panels)
5. **Zoom into each zone** on both localhost and reference for side-by-side comparison

### 2b. Design-informed comparison

For each zone, apply these checks (from `/impeccable:frontend-design`):

| Check | What to look for | How to verify |
|---|---|---|
| **Hierarchy** | Is the visual importance ranking correct? | Compare relative prominence of elements (bigger = more important) |
| **Proportion** | Are relative sizes right? | Zoom and compare element A height vs element B height |
| **Weight** | Does visual density match? | Check font-weight, stroke width, color saturation, not just size |
| **Spacing** | Is the rhythm correct? | Compare gaps between elements — are they proportional? |
| **Typography** | Do fonts match? | Check size, weight, line-height, letter-spacing against style reference |
| **Color** | Do colors match tokens? | Cross-reference against `splose-style-reference/design-tokens/` |
| **Structure** | Is the DOM hierarchy right? | Compare against `splose-style-reference/page-structures/<page>.md` |

### 2c. Record findings

For each page, produce a Gap Report:

```
**Page:** `/path/to/page`
**Reference:** `filename.png`
**Overall:** yes | partial | no

| Zone | Reference | Localhost | Match | Detail |
|---|---|---|---|---|
| Nav/header | Logo 24px, bold, prominent | Logo 12px, thin, dwarfed by nav items | no | Logo SVG has whitespace, needs viewBox crop |
| Table | 8 columns, sortable headers | 8 columns, sortable | yes | — |
```

### 2d. Fallback (no Chrome MCP)

When Chrome MCP is unavailable:
1. Read reference screenshots (max 2 per pass) using the Read tool
2. Read page source code and cross-reference against style references
3. Write Gap Report based on code analysis
4. Use "partial — code-review only" for uncertain entries

## Step 3: Update catalog and gaps

**Catalog:** Update `screenshots/screenshot-catalog.md` Match column for every page checked.

**Gaps:** For gaps marked `[x]` where catalog entries are now "no" or "partial", **reopen** with note: "Reopened: compare found mismatches". For new mismatches, create gaps in `docs/fidelity-gaps.md`.

## Step 4: Report

Present summary: pages compared, yes/partial/no counts, gaps reopened, new gaps created, biggest mismatches.

## Step 5: Return to menu or continue

**Quick/Standard:** Show session start menu with summary.
**Full sweep/Until done:** Continue through remaining pages. When done, commit catalog updates, push, show full summary.
