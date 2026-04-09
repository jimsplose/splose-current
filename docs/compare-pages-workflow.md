# Compare Pages Workflow

Compare localhost pages against production (`acme.splose.com`). Find mismatches, update the catalog, reopen gaps. **Analysis only — no code changes.**

**Shared procedures:** `docs/reference/measurement-protocol.md` (visual diff, measurement, thresholds, DS rules). Read it before starting.

## Core Principles

1. **Live production is the source of truth.** Navigate Chrome to the actual site. Do NOT compare against static screenshots or style-reference docs.
2. **Depth over coverage.** 1 page thoroughly beats 3 pages superficially.
3. **Visual diff first.** Always start with zoom-region comparison (protocol Section 3) before any measurement or checklist.

## Scope

- **Quick**: 1 page
- **Standard**: 1-2 pages per session
- **Full sweep**: Every page, in batches of 1-2
- **Until done**: Full sweep, keep going until all pages checked

## Step 0: Prerequisites

1. Dev server running (`npm run dev` on localhost:3000)
2. Chrome MCP available
3. Production login verified (`acme.splose.com` loads dashboard)
4. Viewport set to 1440x900 (protocol Section 1)
5. `docs/route-mapping.md` read for URL lookups

## Step 1: Pick pages

**Batch size: 1-2 pages max.**

Priority:
1. Pages marked "partial" or "no" in catalog
2. Pages marked "yes — visual only"
3. Pages marked "yes" without measurement evidence
4. Pages marked "yes" with prior verification (re-verify)

Identify template type: ListPage, DetailPage, FormPage, SettingsListPage, or Custom.

## Step 2: Per-page audit (3 phases)

Set up dual tabs per protocol Section 2.

### Phase 1: See (visual diff + screenshot analysis)

**Do this FIRST. Do not skip to measurement.**

1. **Visual diff** — Follow protocol Section 3 in full. Zoom every region at every scroll position. Record every difference.
2. **Written analysis** — For each zone (header, navigation, content, sidebar, footer):
   - What matches?
   - What differs?
   - What's missing on one side?
   - What's extra on one side?
3. **Scroll-state comparison** — Note sticky behavior, fixed elements, scroll-dependent layout changes.

**Output:** Numbered hit list of every visual difference, organized by zone and region. This drives Phase 2.

### Phase 2: Measure (structural checklist + CSS comparison)

**Check EVERY element on the page. Do not sample.**

1. **Structural checklist** — For each UI component present (buttons, forms, tables, dividers, toggles, badges, etc.), run `javascript_tool` on BOTH tabs. Check:
   - Existence (present on both?)
   - Count (same number?)
   - Text content (exact match?)
   - Styling properties (font, color, size, spacing)
   - State (active, disabled, selected)

   Prioritize elements flagged in Phase 1, but check everything.

2. **CSS measurement** — Follow protocol Section 4. Build complete comparison table per protocol Section 4c format. Meet minimum measurement counts per Section 4d.

**Output:** Complete comparison table with pass/fail per property. Complete structural checklist with match/mismatch.

### Phase 3: Audit (DS compliance)

1. Read the page source (`.tsx` file)
2. List all imports from `@/components/ds`
3. Check every component against DS rules (protocol Section 6)
4. Count inline styles, raw className patterns, antd bypasses
5. List EVERY violation with line numbers
6. Grade the page (protocol Section 6 grades)

**Output:** DS grade, import list, complete violation list.

## Step 3: Verification log

Write this log for each page. **Every section required.**

```
**Page:** `/localhost-path` vs `production-path`
**Template type:** [type]
**Viewport:** 1440x900

### Phase 1: See
- Scroll positions captured: [N]
- Regions zoomed: [N]
- Visual differences found: [N]
  1. [region] — [description]
  2. ...

### Phase 2: Measure
- Structural items checked: [N]
- Matches: [N], Mismatches: [N]
- CSS properties compared: [N]
- Passes: [N], Failures: [N]

[Full comparison table here]

### Phase 3: Audit
- DS grade: [A/B/C]
- DS imports: [list]
- Violations: [N]
  1. Line [N]: [description]
  2. ...

### Verdict: yes | partial | no
**Reason:** [detailed]
**Action items:**
1. [specific fix with file path]
2. ...
```

## Step 4: Update catalog and gaps

- Update `screenshots/screenshot-catalog.md` Match column (protocol Section 8 qualifiers)
- Reopen `[x]` gaps where catalog is now "partial" or "no"
- Create new gaps in `docs/fidelity-gaps.md` with specific fixes from Phase 2 mismatches and Phase 3 violations
- Commit after each batch

## Step 5: Report

Summary: pages compared, verdicts, action item count. Return to session menu.
