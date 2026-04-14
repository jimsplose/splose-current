# Measurement Protocol

Shared reference for all visual comparison work. Every workflow that touches visual fidelity MUST follow this protocol.

**This is the canonical source** for thresholds (Section 5), DS scan patterns (Section 6), and the verification loop (Section 7). The agent block (`docs/agent-block.md`) contains an inline copy for subagent self-containment — see the Sync Map in CLAUDE.md. When updating any section here, sync downstream files listed in the Sync Map.

## 1. Viewport

All Chrome MCP work uses **1440x900**. Set at session start:
```
mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }
```

## 2. Dual-Tab Setup

1. Look up the page in `docs/route-mapping.md` for both URLs
2. **Tab A (Production):** `https://acme.splose.com/<production-route>`
3. **Tab B (Localhost):** `http://localhost:3000/<localhost-route>`

Both tabs must be in the same Chrome MCP tab group. Navigate both before starting any comparison.

## 3. Visual Diff (zoom region comparison)

**This is the FIRST step in any visual comparison.** Do this before measurement, before checklists, before anything else. It produces the hit list that everything else verifies and quantifies.

### 3a. Full-page screenshots at each scroll position

1. Scroll to top on both tabs
2. Screenshot both tabs
3. Scroll down one viewport height, screenshot again
4. Repeat until full page captured on both tabs
5. **Minimum:** 2 scroll positions (top + one scroll). Complex pages: 3-4.

### 3b. Region zoom comparison

Divide each scroll position into **6 rectangular regions**. For each region:

1. `zoom` on Tab A (production) with `region: [x0, y0, x1, y1]`
2. `zoom` on Tab B (localhost) with **same region coordinates**
3. Compare the two zoomed images carefully
4. Record every visible difference

**Standard region grid (1440x900 viewport):**

| Region | Coordinates | Captures |
|--------|-------------|----------|
| Top-left | [0, 0, 720, 300] | Sidebar + page header |
| Top-right | [720, 0, 1440, 300] | Action buttons, search |
| Mid-left | [0, 300, 720, 600] | Sidebar lower + content top |
| Mid-right | [720, 300, 1440, 600] | Content middle |
| Bottom-left | [0, 600, 720, 900] | Sidebar bottom + content bottom |
| Bottom-right | [720, 600, 1440, 900] | Content bottom |

Adjust regions for the page layout. For full-width pages without a sidebar, use horizontal strips instead.

### 3c. Targeted zoom on mismatches

For any region where you spot a difference:

1. Zoom tighter (e.g., 200x150px around the mismatch)
2. Compare at high magnification on both tabs
3. Record the pixel area and nature of the mismatch

**Output:** Numbered list of every visual difference, organized by region, with zoom coordinates.

## 4. CSS Measurement

### 4a. What to measure

Run `javascript_tool` on **BOTH tabs** with identical snippets. Measure:

| Category | Properties |
|----------|-----------|
| Colors | `color`, `backgroundColor`, `borderColor` |
| Typography | `fontSize`, `fontWeight`, `lineHeight`, `fontFamily` |
| Spacing | `padding`, `margin`, `gap` |
| Sizing | `height`, `width` (fixed elements: buttons, badges, icons) |
| Borders | `borderWidth`, `borderRadius`, `borderStyle` |

**Skip:** Container width/height (viewport-dependent), `position`, `display` (structural, not visual).

### 4b. Selector guidance

- Use generic selectors that work on BOTH sites
- Avoid `.ant-*` classes (production only)
- Good: `document.querySelector('h1')`, `document.querySelectorAll('button')`
- Good: `Array.from(els).find(el => el.textContent.includes('Save'))`

### 4c. Comparison table format

Every measurement MUST produce a table with values from BOTH tabs:

| Element | Property | Production | Localhost | Delta | Pass? |
|---------|----------|------------|-----------|-------|-------|
| Page title | fontSize | 30px | 30px | 0 | PASS |
| Page title | fontWeight | 700 | 700 | 0 | PASS |
| Save button | bg | rgb(130,80,255) | rgb(130,80,255) | 0 | PASS |

**Rules:**
- Never write "PASS" without listing both actual values
- Every row must show the measured value from each tab
- Group rows by element for readability

### 4d. Minimum measurement counts

| Page complexity | Minimum properties compared |
|----------------|---------------------------|
| Simple list page | 30+ |
| Form page | 50+ |
| Complex multi-section/tabbed page | 60+ |

## 5. Thresholds

These thresholds are the single source of truth. Do not redefine them elsewhere.

| Property | Threshold | Notes |
|----------|-----------|-------|
| Colors (color, bg, border) | **Exact RGB match** | rgba alpha values: exact to 2 decimal places |
| Font size | **Exact match** | |
| Font weight | **Exact match** | |
| Line height | **±1px** | |
| Letter spacing | **±0.5px** | |
| Padding, margin, gap | **±2px** | |
| Width, height (fixed elements) | **±2px** | Skip viewport-dependent containers |
| Border radius | **Exact match** | |
| Border width | **Exact match** | |

## 6. DS Compliance Scan

### Component mandate

| Instead of | Use |
|-----------|-----|
| Raw `<button>` | `<Button>` from DS |
| Raw `<input>` | `<FormInput>` from DS |
| Raw `<select>` | `<FormSelect>` from DS |
| Raw `<hr>` | `<Divider>` from DS |
| Inline badge span | `<Badge>` from DS |
| Raw heading tags with className | `<Text variant="heading/*">` |
| Raw `<p>` with className | `<Text variant="body/*">` |
| Styled div as card | `<Card>` from DS |
| Raw toggle checkbox | `<Toggle>` from DS |
| Custom modal div | `<Modal>` from DS |

### Violation scan patterns

```
Scan 1 — Banned inline patterns:
  "const (inputClass|labelClass)"
  "rounded-full px-2 py-0.5 text-xs font-medium"
  "rounded-lg bg-primary px-4 py-2 text-sm font-medium"

Scan 2 — Missing DS imports:
  Files with <button or <input tags but no @/components/ds import

Scan 3 — Inline style visual properties:
  style={{ containing fontSize, fontWeight, borderRadius, backgroundColor, color, padding, lineHeight
  Each hit: is there a DS component or typography class? → Use it. DS component almost fits? → Extend it.
  Layout-only values (maxWidth, marginTop, flex, gap) are allowed.

Scan 4 — DS component bypass:
  Changes in src/components/ds/ that add inline <span style={{ or <div style={{ duplicating the
  component's own responsibility. DS components must expose variants/props, not hardcode inline styles.
```

**Allowed exceptions:** Icon-only toolbar buttons, tab switcher active/inactive toggles, checkbox/radio `<input>`, hidden inputs. Layout positioning (`maxWidth`, `margin`, `flex`, `gap`, `position`) is fine as inline style.

### DS Grade

| Grade | Inline `style={{` | Raw HTML with styling | Criteria |
|-------|-------------------|----------------------|----------|
| **A** | ≤10 | 0 raw buttons/cards | Nearly all DS components |
| **B** | 11-30 | ≤5 raw patterns | Most DS, some inline styles |
| **C** | >30 | >5 raw patterns | Significant inline styling |

## 7. 5-Iteration Verification Loop

Used by fix-gaps workflow and quality gate. Not used by audit (audit is read-only).

1. **MEASURE** — Run JS snippet on both tabs for every changed element
2. **COMPARE** — Build comparison table (Section 4c format)
3. **EVALUATE** — 0 failures + no structural issues = PASS
4. If FAIL: fix using exact delta, increment iteration, go to 1
5. Max 5 iterations. If still failing after 5, revert and report.

**Sizing iteration rule:** Adjust in 2px increments max. Never jump 10px hoping to land.

## 8. Catalog Entry Qualifiers

Used when updating `screenshots/screenshot-catalog.md`:

| Qualifier | Meaning |
|-----------|---------|
| `yes` | Measurement-verified via dual-tab live comparison |
| `yes — visual only` | No measurement data; verified by visual/code comparison only. Prioritize for deep verify. |
| `partial — [reason]` | Some checks pass, specific issues noted |
| `no — [reason]` | Significant mismatches or page fundamentally different |
