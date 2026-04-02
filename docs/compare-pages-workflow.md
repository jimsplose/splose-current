# Compare Pages Workflow

Compare localhost pages against production (`acme.splose.com`) using four mandatory verification flows. Find mismatches, update the catalog, reopen gaps. This is analysis only — no code changes.

## Core Principles

1. **Live production is the source of truth.** Navigate Chrome to the actual production site. Do NOT compare against static screenshots or style-reference markdown files.
2. **Depth over coverage.** Do 2-3 pages thoroughly rather than 8 pages superficially. Every page gets all four verification flows.
3. **Four flows per page — all mandatory:**
   - **Flow 1: Screenshot Overlay** — Visual side-by-side, catches layout and structural differences humans see instantly
   - **Flow 2: Structural Checklist** — Element-by-element existence and correctness check, catches missing/wrong sections
   - **Flow 3: CSS Measurement** — Dual-tab property comparison, catches subtle sizing/color/spacing drift
   - **Flow 4: DS Audit** — Verify the page uses DS components correctly, flag inline styles and raw HTML that should use DS

## Scope (set by menu prompt)

- **Quick**: 1-2 pages — pick the highest-priority partials
- **Standard**: 2-3 pages per batch — all partial/no entries in the catalog
- **Full sweep**: Every page in `src/lib/state-registry.ts`. Process in **batches of 2-3 pages**. Each batch gets all four flows. Commit after each batch.
- **Until done**: Full sweep using batches, keep doing batches until all pages are checked.

## Step 0: Prerequisites and Viewport Setup

1. Dev server running (`npm run dev` on localhost:3000)
2. Chrome MCP available
3. **Production login:** Navigate to `https://acme.splose.com/` — if it loads the dashboard, auth is good. If it redirects to login, ask Jim to log in first.
4. **MANDATORY: Set canonical viewport size:**
   ```
   mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }
   ```
5. Read `docs/route-mapping.md` — needed for production URL lookups

## Step 1: Pick pages (batch selection)

**Batch size: 2-3 pages max.** This is intentionally small — each page gets extensive coverage.

Batch selection priority:
1. Pages marked "partial" or "no" in catalog
2. Pages marked "yes — visual only" (need deep verify to upgrade)
3. Pages marked "yes" without measurement evidence
4. Pages marked "yes" with prior measurement verification (re-verify)

For each page in the batch, identify which **template type** it uses (ListPage, DetailPage, FormPage, SettingsListPage, or custom). This determines which structural checklist to use in Flow 2.

## Step 2: Per-Page Verification (all three flows)

For each page, set up dual tabs then run all three flows in order.

### 2a. Set up dual tabs

1. Look up the page in `docs/route-mapping.md` to get both URLs
2. **Tab A (Production):** Navigate to `https://acme.splose.com/<production-route>`
3. **Tab B (Localhost):** Navigate to `http://localhost:3000/<localhost-route>`

---

### Flow 1: Screenshot Overlay

**Purpose:** Catch layout, structural, and visual differences that are obvious to the human eye but invisible to CSS measurement.

1. **Screenshot both tabs** at 1440x900
2. **Side-by-side visual comparison** — look at screenshots together and identify:
   - Overall layout structure (same number of columns? same sidebar position?)
   - Color scheme (right colors in right places?)
   - Element density (same amount of content visible?)
   - White space distribution (similar spacing rhythm?)
3. **Zone-by-zone comparison** — divide each page into 3-5 zones and compare each:

   | Zone | What to check |
   |---|---|
   | **Header/Toolbar** | Title text, button count, button labels, button order, breadcrumbs |
   | **Navigation** | Tab/sidebar items, active state, badges/counts, icons |
   | **Main content** | Section count, section order, headings, data layout |
   | **Sidebar** (if present) | Section count, section order, collapsed/expanded state |
   | **Footer/Actions** (if present) | Button labels, alignment, spacing |

4. **Record every difference** — no matter how obvious. If production has 5 sidebar sections and localhost has 4, that's a finding. If a divider is orange instead of purple, that's a finding. Don't filter — record everything.

**Output:** A numbered list of visual differences found, organized by zone.

---

### Flow 2: Structural Checklist

**Purpose:** Systematically verify every element exists with correct properties. Screenshot overlay catches what's visually wrong; the checklist ensures nothing is missed.

**How it works:** Scan the page for which UI components are present, then run the matching component checklist for each one. Every page is different — use only the checklists that apply. Check each item by running `javascript_tool` on BOTH tabs. Mark each as match/mismatch with measured values.

#### Step 1: Identify which components are on the page

Scan both production and localhost for these common UI components. Check all that are present on either side:

- [ ] **Page header** (title bar with heading + action buttons)
- [ ] **Buttons** (any `.ant-btn` or `<button>` elements)
- [ ] **Navigation** (sidebar nav, tab bar, breadcrumbs)
- [ ] **Data table** (rows + columns of data)
- [ ] **Search bar** (search input with button)
- [ ] **Form fields** (inputs, selects, textareas, date pickers)
- [ ] **Dividers** (horizontal rules between sections)
- [ ] **Content sections** (headed groups of content — e.g. "General details", "Contact details")
- [ ] **Collapsible panels** (accordion/collapse sections)
- [ ] **Cards** (bordered content containers)
- [ ] **Badges / Tags** (small colored labels)
- [ ] **Sidebar panel** (right-side info panel)
- [ ] **Pagination** (page controls below tables)
- [ ] **Modals / Drawers** (if visible)
- [ ] **Empty states** (placeholder when no data)
- [ ] **Avatars / Icons** (profile images, inline icons)
- [ ] **Totals / Summary rows** (calculated values at bottom of table/form)

#### Step 2: Run the checklist for each present component

##### Page Header
```
- [ ] Title text — exact match
- [ ] Title style — fontSize, fontWeight, color
- [ ] Subtitle text (if present) — exact match, style
- [ ] Button count — same number
- [ ] Button labels — same text, same order (left to right)
```

##### Buttons (check every visible button)
```
- [ ] Height — same px
- [ ] Background color — same
- [ ] Text color — same
- [ ] Border color — same
- [ ] Border radius — same
- [ ] Icons — present/absent, position (left/right of text)
- [ ] Dropdown arrows — present/absent on action/dropdown buttons
```

##### Navigation (sidebar or tab bar)
```
- [ ] Item count — same number of nav items
- [ ] Item labels — same text, same order
- [ ] Active item — correct item highlighted
- [ ] Active style — bg color, text color, font weight
- [ ] Count badges — present/absent per item
- [ ] Badge values — correct numbers
- [ ] Badge colors — bg, text color per badge
- [ ] Width (sidebar) — within 2px
```

##### Data Table
```
- [ ] Column count — same number
- [ ] Column headers — same text, same order
- [ ] Header row — bg color, text style (fontSize, fontWeight, color)
- [ ] Row height — within 2px
- [ ] Cell padding — within 2px
- [ ] Row borders — style, color
- [ ] Cell content types — text, links, badges, icons match per column
```

##### Search Bar
```
- [ ] Input placeholder text
- [ ] Search button style — bg, text color, border (NOT purple)
- [ ] Position relative to table/content
- [ ] Gap between search and content below — within 2px
```

##### Form Fields
```
- [ ] Field count — same number visible
- [ ] Field labels — same text, same order
- [ ] Field types — input/select/textarea/datepicker match per field
- [ ] Required indicators — same fields marked required
- [ ] Input bg color — matches
- [ ] Input border — color, width, radius
- [ ] Layout — fields in same grid/stack arrangement
```

##### Dividers
```
- [ ] Count — same number of dividers
- [ ] Color — exact RGB match (e.g. purple #8250FF, gray, etc.)
- [ ] Width/style — solid, dashed, thickness
- [ ] Position — between same sections
```

##### Content Sections
```
- [ ] Section count — same number
- [ ] Section headings — same text, same order
- [ ] Heading style — fontSize, fontWeight
- [ ] Content layout — label:value pairs, paragraphs, lists match
- [ ] Label text — same labels present
- [ ] Label style — fontSize, fontWeight, color
- [ ] Value style — fontSize, fontWeight, color
```

##### Collapsible Panels
```
- [ ] Panel count — same number
- [ ] Panel titles — same text, same order
- [ ] Default state — open/closed matches per panel
- [ ] Content — key content items present
```

##### Cards
```
- [ ] Present/absent — production uses cards vs flat layout?
- [ ] Card border — color, radius
- [ ] Card shadow — present/absent
- [ ] Card padding — within 2px
```

##### Badges / Tags
```
- [ ] Count — same number
- [ ] Text — same labels
- [ ] Colors — bg, text color per badge
- [ ] Shape — rounded-full vs rounded-md
```

##### Sidebar Panel (right side)
```
- [ ] Width — within 2px
- [ ] Section count — same number
- [ ] Section titles — same text, same order
- [ ] Key content — amounts, statuses, links present
- [ ] Border — left border style
```

##### Pagination
```
- [ ] Present/absent
- [ ] Position — bottom-left, center, right
- [ ] Style — page numbers, prev/next buttons
```

##### Totals / Summary
```
- [ ] Row count — same number of summary rows
- [ ] Labels — same text (e.g. "Subtotal excl. tax", "TOTAL AUD")
- [ ] Alignment — right-aligned, left-aligned
- [ ] Formatting — currency symbol, decimal places
```

**Output:** The completed checklist with match/mismatch for each item, plus the measured values for mismatches.

---

### Flow 3: CSS Measurement

**Purpose:** Precise numerical comparison of styling properties.

1. **Select 10-15 key elements** per page (informed by Flow 1 and Flow 2 findings — prioritize elements that looked different or had checklist mismatches)
2. **Run the same `javascript_tool` snippet on both tabs**, measuring:
   - Colors: `color`, `backgroundColor`, `borderColor`
   - Typography: `fontSize`, `fontWeight`, `lineHeight`, `fontFamily`
   - Spacing: `padding`, `margin`, `gap`
   - Sizing: `height`, `width` (fixed elements only — buttons, badges, icons)
   - Borders: `borderWidth`, `borderRadius`, `borderStyle`
3. **Build comparison table:**

   | Element | Property | Production | Localhost | Delta | Pass? |
   |---|---|---|---|---|---|
   | Header title | fontSize | 20px | 30px | -10px | FAIL |
   | ... | ... | ... | ... | ... | ... |

4. **Thresholds:**
   - Colors: exact RGB match
   - Font size/weight: exact match
   - Line height: +/-1px
   - Spacing/dimensions: +/-2px
   - Border radius: exact match

**Output:** Comparison table with pass/fail per property.

---

### Flow 4: DS Audit

**Purpose:** Verify the page uses DS components from `@/components/ds` correctly and flag inline styles / raw HTML that should use DS.

1. **Read the page source file** (the `.tsx` file for this page)
2. **Check DS imports** — list all imports from `@/components/ds`
3. **Scan for violations:**

```
DS COMPONENT USAGE
- [ ] All buttons use <Button> from DS (not raw <button> or antd Button directly)
- [ ] All text inputs use <FormInput> (not raw <input>)
- [ ] All selects use <FormSelect> (not raw <select> or antd Select directly)
- [ ] All badges use <Badge> (not inline rounded-full spans)
- [ ] All dividers use <Divider> (not raw <hr> or border-bottom styles)
- [ ] All headings use <Text variant="heading/*"> or <Text variant="display/*">
- [ ] All body text uses <Text variant="body/*"> (not raw <p> or <span> with className)
- [ ] All cards use <Card> (not manually-styled divs with border/shadow)
- [ ] All toggles use <Toggle> (not raw checkbox-as-toggle)
- [ ] All modals use <Modal> (not custom overlay divs)

INLINE STYLE COUNT
- [ ] Count of inline `style={{` props — target: <10 per page component
- [ ] Count of `className="text-*"` patterns — should use <Text> instead
- [ ] Count of raw color values (hex #xxx, rgb()) — should use CSS vars

TEMPLATE USAGE
- [ ] Page uses appropriate template (ListPage, DetailPage, FormPage) if applicable
- [ ] Page header uses PageHeader or template's built-in header (not custom div)
- [ ] Data tables use DataTable (not raw <table>)

ANTD BYPASS
- [ ] No direct antd imports that have DS wrappers (Button, Input, Select, Table, Divider, Modal, Badge)
- [ ] Allowed direct antd: Flex, Space, Tooltip, Popover, Dropdown (no DS wrapper exists)
```

4. **Grade the page:**
   - **A (>90% DS):** Nearly all UI uses DS components, <10 inline styles
   - **B (60-90% DS):** Most UI uses DS, some inline styles remain
   - **C (<60% DS):** Significant inline styles or raw HTML, needs migration

**Output:** DS grade, import list, violation count, top 5 violations to fix.

---

## Step 3: Per-Page Verification Log (MANDATORY)

After all four flows, write this structured log for each page. **All sections required.**

```
**Page:** `/localhost-path` vs `production-path`
**Template type:** ListPage | DetailPage | FormPage | SettingsListPage | Custom
**Viewport:** 1440x900

### Flow 1: Screenshot Overlay
- Production screenshot: [taken]
- Localhost screenshot: [taken]
- Differences found: [count]
  1. [zone] — [description of difference]
  2. ...

### Flow 2: Structural Checklist
- Items checked: [count]
- Matches: [count]
- Mismatches: [count]
- Key mismatches:
  1. [checklist item] — Production: [value], Localhost: [value]
  2. ...

### Flow 3: CSS Measurement
- Elements measured: [count]
- Properties compared: [count]
- Passes: [count]
- Failures: [count]

| Element | Property | Production | Localhost | Delta | Pass? |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

### Flow 4: DS Audit
- DS imports: [list]
- DS grade: A | B | C
- Inline `style={{` count: [count]
- Raw `className="text-*"` count: [count]
- Direct antd bypasses: [count]
- Top violations:
  1. [description]
  2. ...

### Verdict: yes | partial | no
**Reason:** [if partial/no, specific explanation]
**Action items:** [list of specific fixes needed, or "none"]
```

## Step 4: Update catalog and gaps (per batch)

**After each batch of 2-3 pages:**

**Catalog:** Update `screenshots/screenshot-catalog.md` Match column:
- `yes` — all four flows pass
- `partial — [reason]` — some flows pass, others have issues
- `no — [reason]` — significant mismatches

**Gaps:** For gaps marked `[x]` where catalog entries are now "no" or "partial", **reopen** with note. For new mismatches, create gaps in `docs/fidelity-gaps.md` with specific fix instructions derived from Flow 2 checklist mismatches, Flow 3 measurement failures, and Flow 4 DS violations.

**Commit** catalog and gap updates after each batch.

## Step 5: Report and continue

**Per batch:** Summary — pages compared, verdicts, action items count.

**After all batches:** Full summary: total pages compared, yes/partial/no counts, total action items, biggest mismatches.

Return to session menu.
