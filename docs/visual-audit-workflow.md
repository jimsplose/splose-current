# Visual Audit Workflow

Verify implemented pages match their reference screenshots. This closes the loop — without it, gaps get marked "done" based on page existence alone.

## When to run

- After a batch of fidelity loop work
- When gaps may have been marked done prematurely
- Periodically as a health check

## Source of truth

See **Gap completion rule** in CLAUDE.md. The catalog (`screenshots/screenshot-catalog.md`) Match column determines gap status: **yes** (matches), **partial** (with notes on what's missing), or **no** (does not match / unverified).

## Step 0: Chrome MCP availability check

At audit start, check if Chrome MCP tools are available in the current session. This determines which verification path to use throughout:

- **Chrome MCP available:** Use the full visual verification path (capture live screenshots, compare against references)
- **Chrome MCP not available:** Use the fallback path (main-agent reads reference screenshots + code comparison)

Record the result for the session and inform Jim if fallback mode is active.

## Step 1: Pick pages to audit

Read `screenshots/screenshot-catalog.md` and identify entries with Match = "no" or "partial". Prioritize: (1) "partial" entries, (2) high-traffic pages (Dashboard, Calendar, Clients), (3) recently worked-on pages.

## Step 2: Capture current state

**Chrome MCP available:**
Use Chrome MCP to navigate to each page at `http://localhost:3000/<page-path>` and take screenshots. For pages with multiple states, navigate to each `?state=<variant>` or interact (click tabs, open dropdowns) and capture each state.

**Chrome MCP not available (fallback):**
Read the page source code (`src/app/<page>/page.tsx` or relevant component files). Note that live visual capture is unavailable — the audit will use reference screenshot reading and code comparison instead.

## Step 3: Three-source comparison

**Use `/impeccable:frontend-design` for comparison analysis.** Invoke the skill before starting comparisons. It provides design-quality analysis — catching visual weight mismatches, proportion errors, and hierarchy problems that a mechanical checklist misses. Without it, audits tend to check "element exists: yes" while missing that the element is the wrong size, weight, or visual prominence.

### 3a. Visual — Chrome MCP vs saved references

**Chrome MCP available:** Capture the current prototype page with Chrome MCP, then compare side-by-side against the saved reference in `screenshots/reference/`. Use zoomed crops of specific areas (nav, headers, cards) for precise comparison — full-page screenshots hide sizing issues.

**Chrome MCP not available:** Skip this step; use Step 3d instead.

### 3b. Style reference — extracted CSS values

Read style references from `splose-style-reference/`:
- `page-structures/<page>.md` — DOM hierarchy, class names, nesting
- `components/` — exact CSS values (colors, fonts, borders, spacing)
- `design-tokens/` — colours, typography, borders, shadows

Compare Tailwind classes against extracted CSS values for font sizes, colors, border radius, and spacing.

### 3c. Structural — DOM hierarchy

Compare the prototype's component tree against page-structure references: same nesting depth, element roles (list/table/tabs/cards), and interactive states (dropdowns/modals/panels).

### 3d. Main-agent screenshot reading (fallback only)

When Chrome MCP is not available, the main agent reads reference screenshots directly:

1. Read reference screenshots from `screenshots/reference/` using the Read tool — **max 2 screenshots per comparison pass**
2. Process one page group at a time to avoid context overload
3. Compare the reference image against the page source code and `splose-style-reference/page-structures/<page>.md`
4. Write findings as a structured Gap Report (see format below)

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

When using the fallback path (no Chrome MCP), use "partial — code-review only" for entries where structural match is confirmed but visual verification is pending.

**Fidelity gaps:** For gaps marked `[x]` where ANY related catalog entries are "no" or "partial", **uncheck back to `[ ]`** with note: "Reopened: visual audit found mismatches". For new mismatches with no existing gap, create one in the appropriate priority group with specific details.

## Step 5: Fix mismatches with design skill

For pages still at "partial" or "no":

1. Check if a design spec exists at `screenshots/specs/<page-name>.md`. If not, extract one now following `docs/design-spec-workflow.md`. Prioritize: (1) pages stuck at "partial", (2) pages with >20% mismatch, (3) skip pages with up-to-date specs.
2. **Invoke `/impeccable:frontend-design` before implementing fixes.** The skill analyses the gap with design expertise — understanding *why* a value should be what it is (e.g. a logo SVG has internal whitespace affecting rendered size), not just what the target value is.

## Step 6: Report results

Present a summary to Jim: pages audited, matching/partial/no counts, gaps reopened, new gaps created, and biggest mismatches. Note whether audit used Chrome MCP or fallback path.

## Parallelization

**Agents must NOT receive screenshot file paths.** Screenshot images are too large for subagent context windows and cause "Prompt is too long" errors.

Instead, use the "See then Do" pattern:

1. **Main agent does the "See" phase:** Reads reference screenshots (max 2 at a time), compares against code and style references, and writes a structured Gap Report per page group
2. **Subagents receive text-only Gap Reports:** Each agent audits one page group using the text description, the page source code, and the style reference files
3. **Subagents return structured reports:** `filename | mismatch_area | match_status | notes`
4. **Subagents remain read-only** — they do NOT modify code. The main agent collects results and updates catalog + gaps

**Batch limits:**
- Max 1 page per audit sub-task
- Max 3 screenshots' worth of text descriptions per agent prompt
- Main agent reads screenshots in passes of 2

### Gap Report Format

For each page audited, produce:

```
**Page:** `/path/to/page`
**Reference screenshots read:** `filename1.png`, `filename2.png`
**Overall match:** yes | partial | no

| Area | Reference shows | Current code has | Match | Fix needed |
|---|---|---|---|---|
| Header | "Form templates" title, Learn dropdown | Correct title, Learn dropdown present | yes | — |
| Table columns | Title, Form type, Created at, Updated at | All present | yes | — |
| Pagination | Bottom pagination bar | Not visible in code | no | Add Pagination component |
```

## Step 7: Return to menu (or continue in autonomous mode)

**Quick/Standard:** Show the session start menu (see CLAUDE.md) with audit summary.

**Extended/Until-done:** Commit audit results, re-read `docs/fidelity-gaps.md`, launch fidelity loop agents for highest-priority open gaps, and continue the autonomous loop (see fidelity-workflow.md Step 8 for stop conditions). When stopping: commit all work, push, show full session summary.
