# Compare Pages Workflow

Compare localhost pages against production (`acme.splose.com`) using five mandatory verification flows. Find mismatches, update the catalog, reopen gaps. This is analysis only — no code changes.

## Core Principles

1. **Live production is the source of truth.** Navigate Chrome to the actual production site. Do NOT compare against static screenshots or style-reference markdown files.
2. **Depth over coverage.** Do 1 page thoroughly rather than 3 pages superficially. Every page gets all five verification flows, at every scroll position.
3. **Five flows per page — all mandatory, in order:**
   - **Flow 0: Visual Diff** — Region-by-region zoom comparison at pixel level. This is the FIRST thing you do. It frames everything else.
   - **Flow 1: Screenshot Overlay** — Full-page side-by-side at each scroll position, zone-by-zone written analysis
   - **Flow 2: Structural Checklist** — Element-by-element existence and correctness check via JS on both tabs
   - **Flow 3: CSS Measurement** — Dual-tab property comparison for every key element, full comparison table
   - **Flow 4: DS Audit** — Read source, verify DS usage, count violations, grade

## Scope (set by menu prompt)

- **Quick**: 1 page — pick the highest-priority partial/no
- **Standard**: 1-2 pages per session — deep audit with all five flows
- **Full sweep**: Every page. Process in **batches of 1-2 pages**. Each batch gets all five flows. Commit after each batch.
- **Until done**: Full sweep, keep going until all pages are checked.

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

**Batch size: 1-2 pages max.** This is intentionally small — each page gets exhaustive coverage.

Batch selection priority:
1. Pages marked "partial" or "no" in catalog
2. Pages marked "yes — visual only" (need deep verify to upgrade)
3. Pages marked "yes" without measurement evidence
4. Pages marked "yes" with prior measurement verification (re-verify)

For each page in the batch, identify which **template type** it uses (ListPage, DetailPage, FormPage, SettingsListPage, or custom). This determines which structural checklist to use in Flow 2.

## Step 2: Per-Page Verification (all five flows)

For each page, set up dual tabs then run all five flows in order.

### 2a. Set up dual tabs

1. Look up the page in `docs/route-mapping.md` to get both URLs
2. **Tab A (Production):** Navigate to `https://acme.splose.com/<production-route>`
3. **Tab B (Localhost):** Navigate to `http://localhost:3000/<localhost-route>`

---

### Flow 0: Visual Diff (MANDATORY FIRST STEP)

**Purpose:** Pixel-level region comparison before any measurement. This catches everything — layout, color, spacing, missing elements, wrong fonts — at a glance. It produces the "hit list" that the remaining flows verify and quantify.

**How it works:** Divide the page into rectangular regions. Use the `zoom` tool on BOTH tabs for each region. Compare the zoomed images side by side. Record every difference, no matter how small.

#### Step 0a: Full-page screenshots at each scroll position

1. Scroll to top on both tabs
2. Take screenshot of both tabs (these are the "overview" shots)
3. Scroll down one viewport height on both tabs, take screenshots again
4. Repeat until you've captured the full page on both tabs
5. **Minimum: 2 scroll positions** (top + one scroll). Complex pages need 3-4.

#### Step 0b: Region zoom comparison

Divide each scroll position into **4-6 rectangular regions**. For each region:

1. Use `zoom` on Tab A (production) with `region: [x0, y0, x1, y1]`
2. Use `zoom` on Tab B (localhost) with the **same region coordinates**
3. Compare the two zoomed images
4. Record every visible difference

**Standard region grid (for a 1440x900 viewport):**

| Region | Coordinates | What it captures |
|--------|-------------|------------------|
| Top-left | [0, 0, 720, 300] | Sidebar + page header area |
| Top-right | [720, 0, 1440, 300] | Action buttons, search bar area |
| Mid-left | [0, 300, 720, 600] | Sidebar (lower) + content top |
| Mid-right | [720, 300, 1440, 600] | Content middle area |
| Bottom-left | [0, 600, 720, 900] | Sidebar bottom + content bottom |
| Bottom-right | [720, 600, 1440, 900] | Content bottom area |

Adjust regions based on the page layout. For pages with a sidebar, the left column captures sidebar; the right column captures content.

#### Step 0c: Targeted zoom on suspected mismatches

For any region where you spot a difference in Step 0b:

1. Zoom in tighter (smaller region, e.g., 200x150px around the mismatch)
2. Compare at high magnification
3. Record the specific pixel area and nature of the mismatch

**Output:** A numbered list of every visual difference found, organized by region, with the zoom coordinates used. This list drives the remaining flows.

---

### Flow 1: Screenshot Overlay

**Purpose:** Written analysis of overall page composition. This is a structured narrative, not just a list.

1. **Look at the full-page screenshots from Flow 0** and write a paragraph comparing overall composition:
   - Same number of major sections?
   - Same visual rhythm and density?
   - Same color temperature (warm/cool, light/dark)?
   - Same whitespace distribution?

2. **Zone-by-zone comparison** — divide each page into 3-5 zones and write a detailed analysis of each:

   | Zone | What to check |
   |---|---|
   | **Header/Toolbar** | Title text, button count, button labels, button order, breadcrumbs, icon types, button spacing |
   | **Navigation** | Tab/sidebar items, active state, badges/counts, icons, hover states, section dividers |
   | **Main content** | Section count, section order, headings, data layout, card borders, form field arrangement, label positions |
   | **Sidebar** (if present) | Section count, section order, collapsed/expanded state, width, scroll behavior |
   | **Footer/Actions** (if present) | Button labels, alignment, spacing, sticky behavior |

3. **Record every difference** — no matter how obvious or minor. If production has a 1px border and localhost has 2px, that's a finding. If an icon is slightly different, that's a finding. Don't filter — record everything.

4. **Scroll-state comparison** — compare the page at each scroll position captured in Flow 0. Note any differences in sticky behavior, fixed elements, or scroll-dependent layout changes.

**Output:** A structured narrative with a numbered list of visual differences found, organized by zone, referencing Flow 0 zoom regions.

---

### Flow 2: Structural Checklist

**Purpose:** Systematically verify every element exists with correct properties. Run `javascript_tool` on BOTH tabs for each check. Mark each as match/mismatch with measured values.

**Important:** Check EVERY element on the page, not just "key" elements. If production has 15 form fields, check all 15. If there are 8 buttons, check all 8.

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
- [ ] **Toggle switches** (on/off controls)
- [ ] **Rich text editors** (WYSIWYG editors with toolbars)
- [ ] **Phone mockups / Previews** (device frame previews)
- [ ] **Links** (inline text links, "Learn more", "Change log")

#### Step 2: Run the checklist for each present component

For EACH component type present, run the full checklist. Do not skip items. Run `javascript_tool` on BOTH tabs and record the exact values.

##### Page Header
```
- [ ] Title text — exact match
- [ ] Title style — fontSize, fontWeight, color (measure on both tabs)
- [ ] Subtitle text (if present) — exact match, style
- [ ] Button count — same number
- [ ] Button labels — same text, same order (left to right)
- [ ] Button styles — bg, color, border, borderRadius for each button
- [ ] Button icons — present/absent, icon type, position
- [ ] Spacing between title and buttons
- [ ] Overall header height and padding
```

##### Buttons (check EVERY visible button)
```
- [ ] Height — same px
- [ ] Background color — same
- [ ] Text color — same
- [ ] Border color — same
- [ ] Border radius — same
- [ ] Font size — same
- [ ] Font weight — same
- [ ] Padding — same
- [ ] Icons — present/absent, position (left/right of text)
- [ ] Dropdown arrows — present/absent on action/dropdown buttons
- [ ] Hover state (if testable)
```

##### Navigation (sidebar or tab bar)
```
- [ ] Item count — same number of nav items
- [ ] Item labels — same text, same order
- [ ] Active item — correct item highlighted
- [ ] Active style — bg color, text color, font weight, border
- [ ] Inactive style — bg color, text color, font weight
- [ ] Count badges — present/absent per item
- [ ] Badge values — correct numbers
- [ ] Badge colors — bg, text color per badge
- [ ] Badge shape — borderRadius
- [ ] Width (sidebar) — within 2px
- [ ] Section headers — text, color, fontWeight, fontSize
- [ ] Dividers between sections — present/absent, color
- [ ] Scroll behavior — fixed vs scrolling, overflow handling
```

##### Data Table
```
- [ ] Column count — same number
- [ ] Column headers — same text, same order
- [ ] Header row — bg color, text style (fontSize, fontWeight, color)
- [ ] Header row height — within 2px
- [ ] Row height — within 2px
- [ ] Cell padding — within 2px
- [ ] Row borders — style, color
- [ ] Cell content types — text, links, badges, icons match per column
- [ ] Row count (if meaningful)
- [ ] Sort indicators — present/absent, direction
- [ ] Row hover style (if testable)
```

##### Search Bar
```
- [ ] Input placeholder text
- [ ] Input height, width, borderRadius
- [ ] Input border color
- [ ] Search button style — bg, text color, border
- [ ] Position relative to table/content
- [ ] Gap between search and content below — within 2px
```

##### Form Fields (check EVERY field)
```
- [ ] Field count — same number visible
- [ ] Field labels — same text, same order
- [ ] Field types — input/select/textarea/datepicker match per field
- [ ] Required indicators — same fields marked required
- [ ] Required indicator style — color, position
- [ ] Input bg color — matches
- [ ] Input border — color, width, radius
- [ ] Input height — within 2px
- [ ] Disabled field styling — bg color, text color
- [ ] Layout — fields in same grid/stack arrangement
- [ ] Label position — above, beside, inline
- [ ] Label style — fontSize, fontWeight, color
- [ ] Helper text — present/absent, text, style
- [ ] Placeholder text — same per field
```

##### Dividers
```
- [ ] Count — same number of dividers
- [ ] Color — exact RGB match (e.g. purple #8250FF, gray, etc.)
- [ ] Width/style — solid, dashed, thickness
- [ ] Position — between same sections
- [ ] Margin above and below
```

##### Content Sections
```
- [ ] Section count — same number
- [ ] Section headings — same text, same order
- [ ] Heading tag — h2, h3, h4 (match)
- [ ] Heading style — fontSize, fontWeight, color
- [ ] Content layout — label:value pairs, paragraphs, lists match
- [ ] Label text — same labels present
- [ ] Label style — fontSize, fontWeight, color
- [ ] Value style — fontSize, fontWeight, color
- [ ] Section spacing — gap between sections
- [ ] Section container — bordered card vs flat layout
```

##### Collapsible Panels
```
- [ ] Panel count — same number
- [ ] Panel titles — same text, same order
- [ ] Default state — open/closed matches per panel
- [ ] Content — key content items present
- [ ] Expand/collapse icon — position, type
```

##### Cards
```
- [ ] Present/absent — production uses cards vs flat layout?
- [ ] Card border — color, width, radius
- [ ] Card shadow — present/absent, values
- [ ] Card padding — within 2px
- [ ] Card margin/gap — within 2px
```

##### Badges / Tags
```
- [ ] Count — same number
- [ ] Text — same labels
- [ ] Colors — bg, text color per badge
- [ ] Shape — rounded-full vs rounded-md, borderRadius value
- [ ] Font size — same
- [ ] Padding — same
```

##### Toggle Switches
```
- [ ] Count — same number
- [ ] Labels — same text per toggle
- [ ] State — on/off matches
- [ ] Toggle color (on) — bg color
- [ ] Toggle color (off) — bg color
- [ ] Size — width, height
```

##### Links
```
- [ ] Count — same number of links
- [ ] Text — same link text
- [ ] Color — same
- [ ] Underline — present/absent
- [ ] Position — same relative position
```

**Output:** The completed checklist with match/mismatch for each item, plus the measured values for mismatches. Every item must have values from BOTH tabs.

---

### Flow 3: CSS Measurement

**Purpose:** Precise numerical comparison of styling properties. Build a COMPLETE comparison table.

1. **Measure EVERY element identified in Flow 0 and Flow 2** — not just 10-15 "key" elements. If the page has 20 elements worth measuring, measure all 20.
2. **Run the same `javascript_tool` snippet on both tabs**, measuring:
   - Colors: `color`, `backgroundColor`, `borderColor`
   - Typography: `fontSize`, `fontWeight`, `lineHeight`, `fontFamily`
   - Spacing: `padding`, `margin`, `gap`
   - Sizing: `height`, `width` (fixed elements only — buttons, badges, icons)
   - Borders: `borderWidth`, `borderRadius`, `borderStyle`
3. **Build FULL comparison table:**

   | Element | Property | Production | Localhost | Delta | Pass? |
   |---|---|---|---|---|---|
   | Page title | fontSize | 30px | 30px | 0 | PASS |
   | Page title | fontWeight | 700 | 700 | 0 | PASS |
   | Page title | color | rgb(66,105,74) | rgb(66,105,74) | 0 | PASS |
   | ... | ... | ... | ... | ... | ... |

   **Every row must have values from both tabs.** Never write "PASS" without listing the actual values.

4. **Thresholds:**
   - Colors: exact RGB match
   - Font size/weight: exact match
   - Line height: +/-1px
   - Spacing/dimensions: +/-2px
   - Border radius: exact match

5. **Minimum measurement count per page:**
   - Simple list page: 30+ property comparisons
   - Form page: 50+ property comparisons
   - Complex page (multi-section, tabs): 60+ property comparisons

**Output:** Complete comparison table with pass/fail per property. Count of passes vs failures.

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
- [ ] All textareas use <FormTextarea> if available (not raw <textarea>)

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

4. **List EVERY violation** — not just "top 5". If there are 20 violations, list all 20.

5. **Grade the page:**
   - **A (>90% DS):** Nearly all UI uses DS components, <10 inline styles
   - **B (60-90% DS):** Most UI uses DS, some inline styles remain
   - **C (<60% DS):** Significant inline styles or raw HTML, needs migration

**Output:** DS grade, import list, complete violation list with line numbers.

---

## Step 3: Per-Page Verification Log (MANDATORY)

After all five flows, write this structured log for each page. **All sections required. No skipping.**

```
**Page:** `/localhost-path` vs `production-path`
**Template type:** ListPage | DetailPage | FormPage | SettingsListPage | Custom
**Viewport:** 1440x900

### Flow 0: Visual Diff
- Scroll positions captured: [count]
- Regions zoomed: [count]
- Total visual differences found: [count]
- Difference summary:
  1. [region coords] — [description]
  2. ...

### Flow 1: Screenshot Overlay
- Overall composition analysis: [paragraph]
- Zone-by-zone analysis:
  - Header: [findings]
  - Navigation: [findings]
  - Content: [findings]
  - ...
- Scroll-state differences: [findings]

### Flow 2: Structural Checklist
- Components identified: [list]
- Items checked: [count]
- Matches: [count]
- Mismatches: [count]
- Complete mismatch list:
  1. [component] — [item] — Production: [value], Localhost: [value]
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
- Complete violation list:
  1. Line [N]: [description]
  2. ...

### Verdict: yes | partial | no
**Reason:** [detailed explanation — not just a sentence]
**Action items:** [numbered list of specific fixes, with file paths and line numbers where possible]
```

## Step 4: Update catalog and gaps (per batch)

**After each batch of 1-2 pages:**

**Catalog:** Update `screenshots/screenshot-catalog.md` Match column:
- `yes` — all five flows pass, no significant mismatches
- `partial — [reason]` — some flows pass, others have issues
- `no — [reason]` — significant mismatches

**Gaps:** For gaps marked `[x]` where catalog entries are now "no" or "partial", **reopen** with note. For new mismatches, create gaps in `docs/fidelity-gaps.md` with specific fix instructions derived from Flow 2 checklist mismatches, Flow 3 measurement failures, and Flow 4 DS violations.

**Commit** catalog and gap updates after each batch.

## Step 5: Report and continue

**Per batch:** Summary — pages compared, verdicts, action items count.

**After all batches:** Full summary: total pages compared, yes/partial/no counts, total action items, biggest mismatches.

Return to session menu.
