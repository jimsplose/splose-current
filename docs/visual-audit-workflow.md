# Visual Audit Workflow

Verify implemented pages match their reference screenshots. This closes the loop — without it, gaps get marked "done" based on page existence alone.

## When to run

- After a batch of fidelity loop work
- When gaps may have been marked done prematurely
- Periodically as a health check

## Source of truth

See **Gap completion rule** in CLAUDE.md. The catalog (`screenshots/screenshot-catalog.md`) Match column determines gap status: **yes** (matches), **partial** (with notes on what's missing), or **no** (does not match / unverified).

## Step 1: Pick pages to audit

Read `screenshots/screenshot-catalog.md` and identify entries with Match = "no" or "partial". Prioritize: (1) "partial" entries, (2) high-traffic pages (Dashboard, Calendar, Clients), (3) recently worked-on pages.

## Step 2: Capture current state

Use **Chrome MCP** to navigate to each page at `http://localhost:3000/<page-path>` and take screenshots. For pages with multiple states, navigate to each `?state=<variant>` or interact (click tabs, open dropdowns) and capture each state.

## Step 3: Three-source comparison

### 3a. Visual — Chrome MCP vs saved references

Capture the current prototype page with Chrome MCP, then compare side-by-side against the saved reference in `screenshots/reference/`.

### 3b. Style reference — extracted CSS values

Read style references from `splose-style-reference/`:
- `page-structures/<page>.md` — DOM hierarchy, class names, nesting
- `components/` — exact CSS values (colors, fonts, borders, spacing)
- `design-tokens/` — colours, typography, borders, shadows

Compare Tailwind classes against extracted CSS values for font sizes, colors, border radius, and spacing.

### 3c. Structural — DOM hierarchy

Compare the prototype's component tree against page-structure references: same nesting depth, element roles (list/table/tabs/cards), and interactive states (dropdowns/modals/panels).

### Match criteria

| Check | Pass | Fail |
|---|---|---|
| Layout | Same column/section structure | Missing sections, wrong nesting |
| DS components | Correct DS components used | Bare HTML instead of DS components |
| Content | Same headers, labels, placeholders | Wrong text, missing columns |
| Interactive states | Modals, dropdowns, tabs exist | Missing interactive elements |
| Typography | Font sizes/weights match reference | Wrong size or weight |
| Colors | Token colors match reference | Wrong color values |
| Spacing | Padding/margins match reference | Visibly different spacing |

## Step 4: Update catalog and fidelity gaps

**Catalog:** For each entry — if it matches, set Match to "yes". If partial, set to "partial" with a note. Otherwise keep "no".

**Fidelity gaps:** For gaps marked `[x]` where ANY related catalog entries are "no" or "partial", **uncheck back to `[ ]`** with note: "Reopened: visual audit found mismatches". For new mismatches with no existing gap, create one in the appropriate priority group with specific details.

## Step 5: Extract design specs for problem pages

For pages still at "partial" or "no", check if a design spec exists at `screenshots/specs/<page-name>.md`. If not, extract one now following `docs/design-spec-workflow.md`. Prioritize: (1) pages stuck at "partial", (2) pages with >20% mismatch, (3) skip pages with up-to-date specs.

## Step 6: Report results

Present a summary to Jim: pages audited, matching/partial/no counts, gaps reopened, new gaps created, and biggest mismatches.

## Parallelization

Run audit comparisons in parallel using subagents (each audits a different page group). Agents capture screenshots via Chrome MCP, compare against references, and return structured reports: `filename | mismatch % | match status | notes`. Agents do NOT modify code — audit is read-only. The main agent collects results and updates catalog + gaps.

## Step 7: Return to menu (or continue in autonomous mode)

**Quick/Standard:** Show the session start menu (see CLAUDE.md) with audit summary.

**Extended/Until-done:** Commit audit results, re-read `docs/fidelity-gaps.md`, launch fidelity loop agents for highest-priority open gaps, and continue the autonomous loop (see fidelity-workflow.md Step 8 for stop conditions). When stopping: commit all work, push, show full session summary.
