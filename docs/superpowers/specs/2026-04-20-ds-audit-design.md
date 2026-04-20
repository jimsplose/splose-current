# DS Audit — Phase 5 Diagnostic

**Date:** 2026-04-20
**Status:** Design approved, ready for implementation plan
**Context:** Continuation of `docs/ds-consolidation-plan.md` Phase 5 (ongoing enforcement). Phases 1-4 delivered templates, merged components, and migrated 26 pages. ~2,825 inline `style={{}}` props remain across 99 app files and 80 DS-adjacent files.

## Purpose

Produce a ranked, actionable diagnostic of where the codebase diverges from DS-first discipline. The output drives a series of targeted fix sessions triggered via a new `/ds-fix` slash command. **No code changes this session.** This spec covers the diagnostic work only; each fix session is a separate piece of work with its own scope.

## Scope

### In scope
- All `src/app/**/page.tsx` files (~99)
- All `src/app/**/*Client.tsx` client components rendered by those pages
- DS templates and composites: `ListPage`, `DetailPage`, `FormPage`, `SettingsListPage`, `Modal`, `Navbar`, `TopNav`, `SideNav`, `PageHeader`
- All 45 DS component `.tsx` files — for **consolidation analysis only** (Section 4), not for inline-style violation counts

### Out of scope
- Inline styles inside DS primitives (`Button`, `Badge`, `Text`, `Card`, etc.) — those are the component implementation
- Storybook stories (`src/components/ds/stories/**`), test files, generated code, `docs/`
- Visual/live measurement via Chrome MCP — this is a code-structure audit, not a visual fidelity audit
- Fixing anything — this session produces the report only

## Violation classifier (pragmatic)

An inline `style={{}}` is a **violation** when any property duplicates a DS component's responsibility:

### Flag as violation
- `color`, `background`, `backgroundColor` — `<Text>`, `<Button>`, `<Badge>` supply these
- `border`, `borderColor`, `borderRadius` — DS tokens / `<Card>` / `<Divider>`
- `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `letterSpacing` — should be `<Text variant="...">`
- `boxShadow` matching `--shadow-*` tokens
- `style={{}}` wrapping content that visually forms a DS pattern (badge-shaped span, button-shaped div, card-shaped container) regardless of individual properties

### Ignore (not a violation)
- Pure layout: `margin`, `padding`, `gap`, `flex`, `flexBasis`, `justifyContent`, `alignItems`, `display`, `position`, `top/right/bottom/left`, `width`, `height`, `minWidth`, `maxWidth`, `grid*`
- Viewport/overflow: `overflow`, `overflowX`, `overflowY`, `whiteSpace`, `textOverflow`
- Dynamic computed values (CSS vars set from props, computed positions, animated transforms)

Rationale: CLAUDE.md's decision tree explicitly allows one-off layout inlines. Counting them produces noise that drowns out real DS-bypass patterns.

## Report structure

Four sections in the master audit document, each with findings + examples + priority.

### Section 1 — Pages audit

Per-page table ranked by violation count:

| Page | Path | Violations | Top 3 patterns |
|---|---|---|---|

Plus:
- **Top 10 worst pages** quick-reference at the top of the section
- For each top-10 page: list the first 3 violations as inline code snippets with file:line references
- Every violation must be tagged with the fix category (Section 2, Section 3, or "adopt existing DS component as-is")

### Section 2 — DS adoption gaps (new components needed)

Patterns that appear on 2+ pages with no DS component yet. For each:

- **Pattern name** — short descriptive label
- **Occurrences** — N occurrences across M files (with file list)
- **Example snippet** — real code from one of the occurrences, file:line
- **Proposed DS component** — name + minimal API (props only, no implementation)
- **Priority** — High (5+ occurrences) / Medium (3-4) / Low (2)

### Section 3 — DS extension gaps (existing components need props)

Existing DS components being bypassed because they lack a needed prop. For each:

- **Component** — e.g. `Badge`
- **Missing prop** — e.g. `size="xs"` or `variant="ghost"`
- **Occurrences of inline workaround** — count + file list
- **Proposed API addition** — prop name, type, default
- **Breakage risk** — count of existing consumers
- **Priority** — High / Medium / Low on same thresholds as Section 2

### Section 4 — DS consolidation opportunities

Existing DS components that are near-duplicates and could collapse. For each:

- **Component pair** — A and B
- **Overlap** — rough % of props/rendering surface area that's shared
- **Proposed merge API** — which component absorbs the other, what new props get added
- **Consumer counts** — separately for A and B, so migration risk is knowable
- **Priority** — proportional to (A + B consumers) × overlap %

## Execution methodology (hybrid)

### Pass 1 — Mechanical counts (one Explore subagent)

Subagent performs read-only scans and returns structured data:

- Per-file `style={{` occurrences (app pages + DS templates only)
- Per-file raw `className="text-*"`, `className="bg-*"`, `className="border-*"`, `className="font-*"` occurrences (Tailwind tokens that should be DS component variants)
- DS component import frequency across `src/app/**` (under-adopted components stand out)
- Candidate duplicate-JSX patterns: a short list of JSX shapes that appear ≥2 times across different files

Returns: markdown file with raw numbers, per-file lists, and no interpretation.

### Pass 2 — Pattern extraction (main session)

Read the top 20 worst pages by violation count. Read a stratified sample of 10 low-violation pages (to catch edge patterns). For each inline violation, classify into:

- **AdoptAsIs** — existing DS component already supports this, page just chose to inline
- **ExtendDS** — existing DS component needs a new prop (→ Section 3)
- **NewDS** — no existing component fits (→ Section 2)

This is judgement-heavy work that stays in main session so cross-page patterns can be seen.

### Pass 3 — Consolidation scan (main session)

Read all 45 DS `.tsx` files. For each, note:
- Underlying primitive (span, div, button)
- Prop signature
- Render shape

Pair any components that share the same primitive and overlap ≥50% on props. Output to Section 4.

### Pass 4 — Synthesis (main session)

Rank all findings. Produce the four report sections. Build the fix backlog as an ordered list of sessions, each sized ~1-2 hours, each with:
- Session title (e.g. "DS-Fix 01: replace inline Badge-shaped spans with Badge component")
- Scope (files, patterns)
- Estimated effort
- Success criteria (how to know the session is done)
- DS components touched (for conflict avoidance with other sessions)

## Deliverables

All committed to the repo:

1. **`docs/ds-audit-2026-04-20.md`** — the master audit report (all four sections + methodology + re-run instructions)
2. **`docs/ds-audit-fix-backlog.md`** — ordered fix sessions with status column (`open` / `in-progress` / `done`), consumed by `/ds-fix`
3. **`.claude/commands/ds-fix.md`** — new slash command that reads the backlog and runs the next open session
4. **`CLAUDE.md`** — Session Start menu updated to include `/ds-fix`

## `/ds-fix` command behaviour

When invoked:
1. Read `docs/ds-audit-fix-backlog.md`
2. Show the next `open` session with title + scope + effort
3. Ask Jim to confirm or skip to the next one
4. On confirm:
   - Follow the session's scope (a normal fidelity-style fix workflow)
   - Use Chrome MCP for visual verification per `docs/quality-gate.md`
   - Follow DS-first and "extend, don't bypass" per CLAUDE.md
   - When done: mark the session `done` in the backlog, commit, ask Jim about next steps

The command stays thin — it's a backlog reader + executor. The audit report explains *why*, the backlog explains *what*, the command runs *how* (using existing DS discipline rules).

## Success criteria for this diagnostic

- All four report sections complete, non-empty
- Every finding has an example code snippet with file:line reference
- Fix backlog has ≥10 ordered sessions, each sized ≤2 hours
- Every top-10-worst page has its violations categorised into AdoptAsIs / ExtendDS / NewDS
- Every Section 4 consolidation candidate has consumer counts for both components
- Report is re-runnable: methodology section is explicit enough that the same scan run in 3 months produces comparable numbers
- `/ds-fix` command present in CLAUDE.md Session Start menu

## Non-goals

- Fixing anything
- Visual verification
- Rewriting existing DS components
- Deciding the *order* of fix sessions based on visual priority (that's `/fidelity` territory; this audit orders by leverage — occurrences × components-consolidated)
