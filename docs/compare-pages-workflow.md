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

### 2b. Measurement verification

For each comparison zone, run the measurement snippet via Chrome MCP `javascript_tool` targeting key elements. Compare measured values against targets from `splose-style-reference/`.

**Standard measurement snippet** (customize selectors per page):
```js
(() => {
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
  for (const { sel, label } of selectors) {
    const el = document.querySelector(sel);
    if (!el) { results.push({ label, sel, error: 'NOT FOUND' }); continue; }
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const m = {}; for (const p of props) m[p] = s[p];
    m._rect = { width: Math.round(r.width * 10) / 10, height: Math.round(r.height * 10) / 10 };
    results.push({ label, sel, measured: m });
  }
  JSON.stringify(results, null, 2)
})()
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

**Fallback (no Chrome MCP):** Read the page source code, resolve Tailwind classes to CSS values using `globals.css` and Tailwind defaults. Build the same comparison table with resolved values. Mark uncertain resolutions as "UNCERTAIN".

### 2c. Structural visual check (supplement)

After measurement, apply these structural checks that measurement cannot catch:
- **Layout**: Same grid/flex structure, sidebar/header/content arrangement?
- **Content**: Same column headers, labels, placeholder text, button labels?
- **Components**: Correct DS components used (Button not bare `<button>`, etc.)?
- **Missing elements**: Anything in reference that is absent from localhost?
- **Interactive elements**: Modals, dropdowns, tabs from reference exist in code?

These checks are visual — use the zoomed screenshots from Step 2a. They catch things measurement misses (wrong element present, incorrect stacking order, missing icons).

**The measurement table (2b) is the pass/fail authority for CSS properties. The structural check (2c) catches layout and content issues.**

### 2d. Record findings

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

### 2e. Fallback (no Chrome MCP)

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
