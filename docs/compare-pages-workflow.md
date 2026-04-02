# Compare Pages Workflow

Compare localhost pages against production (`acme.splose.com`) using dual-tab live measurement. Find mismatches, update the catalog, reopen gaps. This is analysis only — no code changes.

## Core Principle: Live Production as Source of Truth

**Do NOT compare against static screenshots or style-reference markdown files.** Navigate Chrome to the actual production site and measure values directly. This eliminates scaling, cropping, viewport, and staleness issues.

The `splose-style-reference/` directory is documentation for understanding the design system. It is NOT a comparison target.

## Scope (set by menu prompt)

- **Quick**: 2-3 pages — pick the highest-priority partials
- **Standard**: All partial/no entries in the catalog
- **Full sweep**: Every page in `src/lib/state-registry.ts`, including pages marked "yes" (re-verify). Process in **batches of 5-8 pages**. Each batch gets full measurement verification. Commit after each batch.
- **Until done**: Full sweep using batches, keep doing batches until all pages are checked. Depth over coverage — never rush through pages.

## Verification Depth Levels

Every page comparison has one of three depth levels. The depth determines what work is required.

| Depth | When to use | Requirements |
|---|---|---|
| **deep** | Pages marked "partial" or "no". Pages marked "yes — visual only". First time verifying any page. | Full dual-tab measurement (3+ properties), structural screenshot comparison, comparison table |
| **quick-reverify** | Pages already marked "yes" from a previous **measurement-verified** session | Visual check + 1 spot measurement (min 3 rows in comparison table) |
| **visual-only** | **NOT ALLOWED for catalog updates.** Only used when Chrome MCP is unavailable and fallback code-review is used | Code-review comparison. Catalog entry MUST say "yes — visual only" |

**Rule:** A page cannot be marked "yes" in the catalog without at least one measurement pass. If measurement is skipped, the entry MUST say "yes — visual only" so we know it wasn't deeply verified.

## Step 0: Prerequisites and Viewport Setup

1. Dev server running (`npm run dev` on localhost:3000)
2. Chrome MCP available (if not, use fallback path — read references + code comparison)
3. **Production login:** Jim must be logged into `acme.splose.com` in Chrome for dual-tab to work. At session start, navigate to `https://acme.splose.com/` — if it loads the dashboard, auth is good. If it redirects to login, ask Jim to log in first, or fall back to static reference comparison for all pages.
4. **MANDATORY: Set canonical viewport size:**
   ```
   mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }
   ```
   This is non-negotiable. All measurements and screenshots in the session happen at this size. If the window cannot be resized, note the actual size in the verification log.
5. Read `docs/route-mapping.md` — needed for production URL lookups
6. Invoke `/impeccable:frontend-design` — activates design-informed analysis for the session

## Step 1: Pick pages (batch selection)

**Quick/Standard:** Read `screenshots/screenshot-catalog.md`, pick entries with Match = "no" or "partial". Prioritize: (1) partials, (2) high-traffic pages (Dashboard, Calendar, Clients), (3) recently changed pages.

**Full sweep / Until done:** Read `src/lib/state-registry.ts` for all pages grouped by section. Build a batch of **5-8 pages** from the next unverified group. Process one batch at a time.

Batch selection priority:
1. Pages marked "partial" or "no" (always deep verify)
2. Pages marked "yes — visual only" (need deep verify to upgrade)
3. Pages marked "yes" without measurement evidence (need deep verify)
4. Pages marked "yes" with prior measurement verification (quick-reverify)

## Step 2: Dual-Tab Compare Loop (per page)

For each page, run this loop. **This is the core of the workflow — do not shortcut it.**

### 2a. Set up dual tabs

1. Look up the page in `docs/route-mapping.md` to get both URLs
2. **Tab A (Production):** Navigate to `https://acme.splose.com/<production-route>`
3. **Tab B (Localhost):** Navigate to `http://localhost:3000/<localhost-route>`
4. If production requires auth and redirects to login, fall back to static reference screenshot for that page (note in verification log: "production auth-gated, used static reference")

### 2b. Visual structural comparison (MANDATORY — do not skip)

This step catches issues that measurement cannot: missing elements, wrong order, wrong icons, layout differences.

1. **Screenshot both tabs** at the same viewport size
2. Identify 2-4 **comparison zones** on both:
   - Navigation/header (logo, nav items, icons)
   - Page title and toolbar area
   - Main content (table, cards, form)
   - Interactive elements (modals, dropdowns, side panels)
3. For each zone, compare the production screenshot against the localhost screenshot:
   - **Missing elements**: Anything in production absent from localhost?
   - **Extra elements**: Anything in localhost not in production?
   - **Order/layout**: Same arrangement, same stacking?
   - **Icons**: Correct icons used? (Production uses Ant Design icons; localhost uses Lucide — shapes should be similar, not identical)
   - **Components**: Correct DS components used? (Button not bare `<button>`, etc.)
   - **Content**: Same column headers, labels, placeholder text, button labels?

**Record findings explicitly** — this is un-skippable. The verification log requires a structural findings section.

### 2c. Dual-tab measurement verification

Run the measurement snippet from `docs/quality-gate.md` Step 3 on BOTH the production and localhost tabs. That document has the canonical JS snippet, comparison table format, and acceptance thresholds.

**Selectors:** Use generic CSS selectors that work on both production AND localhost. Prefer semantic selectors:
- `header`, `nav`, `main`, `h1`, `h2`
- `table`, `th`, `td`, `tr`
- `[role="menuitem"]`, `[role="tab"]`
- `.ant-*` classes exist on production only — do NOT use them as selectors

If a selector works on one site but not the other, note it and try an alternative.

### 2d. Property classification

Not all properties should be pass/fail. Classify each:

| Category | Properties | Comparison Rule |
|---|---|---|
| **Intrinsic (pass/fail)** | color, backgroundColor, fontSize, fontWeight, fontFamily, lineHeight, letterSpacing, borderRadius, borderColor, borderWidth, boxShadow | Must meet thresholds from `docs/quality-gate.md` |
| **Spacing (pass/fail)** | padding*, gap | Must meet thresholds when element has fixed/intrinsic sizing |
| **Layout (report only)** | display, flexDirection, alignItems, justifyContent | Report differences but don't auto-fail — production may use different layout achieving same visual result |
| **Viewport-dependent (skip)** | width, height (from rect) on flex/block containers | Do not compare. Only compare width/height on elements with explicit sizing (icons, avatars, fixed-size components) |

### 2f. Per-page verification log (MANDATORY)

For each page checked, output this structured block. **All sections are required.** A page without the structural findings or dual-tab evidence cannot have its catalog entry updated.

```
**Page:** `/localhost-path` vs `production-path`
**Depth:** deep | quick-reverify | visual-only
**Viewport:** 1440x900 (or actual if different)
**Comparison method:** dual-tab live | static reference (with reason)

**Structural comparison:**
- Production screenshot: [taken / skipped — reason]
- Localhost screenshot: [taken / skipped — reason]
- Zones compared: [nav, header, content, ...]
- Missing elements: [none / list with details]
- Extra elements: [none / list]
- Order/layout diffs: [none / list]
- Icon diffs: [none / list — note: Ant vs Lucide is expected]
- Content diffs: [none / list]

**Measurement comparison:**
- Selectors measured: [count] on production, [count] on localhost
- Properties compared: [count]

| Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

**Verdict:** yes | partial | no
**Reason:** [if partial/no, specific explanation]
**Delta from previous:** changed | unchanged | first check

**DS compliance (quick scan):**
- DS imports: [count] — e.g. "Button, Card, Text, DataTable, PageHeader"
- Inline `style={{` count: [count] — target: <10 per page
- Raw HTML with styling: [count] — raw `<button>`, `<div style=`, `<span className="text-`
- DS grade: A (>90% DS) | B (60-90%) | C (<60%)
- Violations: [list top 3 — e.g. "12 raw div with card pattern", "8 className text- instead of Text"]
```

### 2g. Fallback (no Chrome MCP)

Use the fallback code-audit loop from `docs/quality-gate.md` Step 3 Path B. Write verification log with `Depth: visual-only`, `Comparison method: static reference (Chrome MCP unavailable)`. Catalog entry MUST include "visual only" qualifier.

## Step 3: Update catalog and gaps (per batch)

**After each batch of 5-8 pages**, not at the end of the full sweep:

**Catalog:** Update `screenshots/screenshot-catalog.md` Match column for every page in the batch. Include verification qualifier:
- `yes` — measurement-verified via dual-tab live comparison
- `yes — visual only` — no measurement data, needs deep verify in future session
- `partial` — with specific reason
- `no` — with specific reason

**Gaps:** For gaps marked `[x]` where catalog entries are now "no" or "partial", **reopen** with note: "Reopened: compare found mismatches". For new mismatches, create gaps in `docs/fidelity-gaps.md`.

**Commit** catalog and gap updates after each batch. Do not batch up all commits to the end.

## Step 4: Report (per batch and final)

**Per batch:** Brief summary — pages compared, verdicts, any new gaps.

**Final (after all batches):** Full summary: total pages compared, yes/partial/no counts, measurement-verified vs visual-only counts, gaps reopened, new gaps created, biggest mismatches.

## Step 5: Return to menu or continue

**Quick/Standard:** Show session start menu with summary.
**Full sweep/Until done:** Start next batch. When all batches done, commit final catalog updates, push, show full summary, return to menu.
