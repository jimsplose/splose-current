# Compare Pages Workflow

Compare localhost pages against reference screenshots. Find mismatches, update the catalog, reopen gaps. This is analysis only — no code changes.

## Scope (set by menu prompt)

- **Quick**: 2-3 pages — pick the highest-priority partials
- **Standard**: All partial/no entries in the catalog
- **Full sweep**: Every page in `src/lib/state-registry.ts`, including pages marked "yes" (re-verify). Process in **batches of 5-8 pages**. Each batch gets full measurement verification. Commit after each batch.
- **Until done**: Full sweep using batches, keep doing batches until all pages are checked. Depth over coverage — never rush through pages.

## Verification Depth Levels

Every page comparison has one of three depth levels. The depth determines what work is required.

| Depth | When to use | Requirements |
|---|---|---|
| **deep** | Pages marked "partial" or "no". Pages marked "yes — visual only". First time verifying any page. | Full measurement (3+ properties), structural check, comparison table |
| **quick-reverify** | Pages already marked "yes" from a previous **measurement-verified** session | Visual check + 1 spot measurement (min 3 rows in comparison table) |
| **visual-only** | **NOT ALLOWED for catalog updates.** Only used when Chrome MCP is unavailable and fallback code-review is used | Code-review comparison. Catalog entry MUST say "yes — visual only" |

**Rule:** A page cannot be marked "yes" in the catalog without at least one measurement pass. If measurement is skipped, the entry MUST say "yes — visual only" so we know it wasn't deeply verified.

## Step 0: Prerequisites

1. Dev server running (`npm run dev` on localhost:3000)
2. Chrome MCP available (if not, use fallback path — read references + code comparison)
3. Invoke `/impeccable:frontend-design` — this activates design-informed analysis for the session

## Step 1: Pick pages (batch selection)

**Quick/Standard:** Read `screenshots/screenshot-catalog.md`, pick entries with Match = "no" or "partial". Prioritize: (1) partials, (2) high-traffic pages (Dashboard, Calendar, Clients), (3) recently changed pages.

**Full sweep / Until done:** Read `src/lib/state-registry.ts` for all pages grouped by section. Build a batch of **5-8 pages** from the next unverified group. Process one batch at a time.

Batch selection priority:
1. Pages marked "partial" or "no" (always deep verify)
2. Pages marked "yes — visual only" (need deep verify to upgrade)
3. Pages marked "yes" without measurement evidence (need deep verify)
4. Pages marked "yes" with prior measurement verification (quick-reverify)

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

### 2b. Mandatory measurement verification

**Every page MUST have at least one `javascript_tool` measurement run.** This is not optional, even for quick-reverify pages.

**Minimum requirements:**
- **Deep verify**: Measure primary content zone + at least one secondary zone. Minimum 3 selectors, producing a comparison table with 3+ rows.
- **Quick-reverify**: Measure one key element from the primary content zone. Minimum 1 selector, producing a comparison table with 3+ rows.

**Target values** come from (in order of preference):
1. `splose-style-reference/` — extracted production CSS values
2. Reference screenshot visible properties — measure from the screenshot if no style-ref exists

**Standard measurement snippet** (customize selectors per page):
```js
const selectors = [
  { sel: '<SELECTOR>', label: '<LABEL>' }
];
const props = [
  'color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontFamily',
  'lineHeight', 'padding', 'paddingTop', 'paddingRight', 'paddingBottom',
  'paddingLeft', 'margin', 'gap', 'borderRadius', 'borderColor',
  'borderWidth', 'boxShadow', 'display', 'flexDirection', 'alignItems',
  'justifyContent', 'opacity'
];
const results = [];
for (const {sel,label} of selectors) {
  const el = document.querySelector(sel);
  if (!el) { results.push({label, sel, error:'NOT FOUND'}); continue; }
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const m = {}; for (const p of props) m[p] = s[p];
  m._rect = {width: Math.round(r.width*10)/10, height: Math.round(r.height*10)/10};
  results.push({label, sel, measured: m});
}
JSON.stringify(results)
```

**Key elements to measure per zone:**

| Zone | Elements | Key Properties |
|---|---|---|
| Nav/header | `header`, nav links, active item | height, fontSize, fontWeight, color, backgroundColor, padding |
| Page title/toolbar | `h1`/`h2`, toolbar buttons | fontSize, fontWeight, lineHeight, color, height, padding, gap |
| Main content (table) | `th`, `td`, table wrapper | fontSize, fontWeight, backgroundColor, padding, height, borderColor |
| Main content (cards) | card wrapper, title, body | padding, gap, borderRadius, boxShadow, fontSize, color |
| Sidebar | sidebar wrapper, menu items | width, fontSize, fontWeight, color, padding, backgroundColor |

**Build a comparison table per zone:**

```
| Property | Target (style-ref) | Measured | Threshold | Pass? |
|---|---|---|---|---|
| color | rgb(65, 69, 73) | rgb(65, 69, 73) | exact RGB | PASS |
| fontSize | 14px | 14px | exact | PASS |
```

**Thresholds:** Colors = exact RGB match. Font size/weight = exact. Dimensions/spacing = +/-2px. Border radius = exact.

**Fallback (no Chrome MCP):** Read the page source code, resolve Tailwind classes to CSS values using `globals.css` and Tailwind defaults. Build the same comparison table with resolved values. Mark uncertain resolutions as "UNCERTAIN". Catalog entry MUST say "yes — visual only".

### 2c. Structural visual check (supplement)

After measurement, apply these structural checks that measurement cannot catch:
- **Layout**: Same grid/flex structure, sidebar/header/content arrangement?
- **Content**: Same column headers, labels, placeholder text, button labels?
- **Components**: Correct DS components used (Button not bare `<button>`, etc.)?
- **Missing elements**: Anything in reference that is absent from localhost?
- **Interactive elements**: Modals, dropdowns, tabs from reference exist in code?

These checks are visual — use the zoomed screenshots from Step 2a. They catch things measurement misses (wrong element present, incorrect stacking order, missing icons).

**The measurement table (2b) is the pass/fail authority for CSS properties. The structural check (2c) catches layout and content issues.**

### 2d. Per-page verification log (MANDATORY)

For each page checked, output this structured block. This is required — it makes it auditable whether the agent actually did the work.

```
**Page:** `/path/to/page`
**Depth:** deep | quick-reverify | visual-only
**Measurements:** [count] properties checked across [count] selectors
**Zones:** [list of zones inspected]
**Comparison table:**
| Property | Target | Measured | Pass? |
|---|---|---|---|
| ... | ... | ... | ... |
**Structural:** [summary of structural check findings]
**Verdict:** yes | partial | no
**Delta from previous:** changed | unchanged | first check
```

Pages without this log block cannot have their catalog entries updated.

### 2e. Fallback (no Chrome MCP)

When Chrome MCP is unavailable:
1. Read reference screenshots (max 2 per pass) using the Read tool
2. Read page source code and cross-reference against style references
3. Build comparison table with resolved Tailwind values
4. Write verification log with `Depth: visual-only`
5. Catalog entry MUST include "visual only" qualifier

## Step 3: Update catalog and gaps (per batch)

**After each batch of 5-8 pages**, not at the end of the full sweep:

**Catalog:** Update `screenshots/screenshot-catalog.md` Match column for every page in the batch. Include verification qualifier:
- `yes` — measurement-verified
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
