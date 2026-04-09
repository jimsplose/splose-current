# Fix Gaps Workflow

Implement code changes to close fidelity gaps. Uses parallel subagents with mandatory visual verification.

**Shared procedures:** `docs/reference/measurement-protocol.md` (visual diff, measurement, thresholds, DS rules). Read it before starting.

## Scope

- **Quick**: 2-3 gaps
- **Standard**: All open gaps (partial/no entries)
- **Full sweep**: Re-verify and fix everything
- **Until done**: Keep going until all gaps closed

## Prerequisites

1. Chrome MCP available (preferred; fallback in protocol Section 7)
2. Viewport: 1440x900 (protocol Section 1)
3. `docs/route-mapping.md` read
4. Design specs checked (`screenshots/specs/<page-name>.md`)
5. DS components mandatory (`docs/agent-block.md`)

**Target values priority:** Live production measurement > `splose-style-reference/` > reference screenshots.

## Step 0: Measure before fixing

**MANDATORY before any visual change.**

1. Set up dual tabs (protocol Section 2)
2. **Visual diff first** — Run protocol Section 3 (zoom regions) to establish baseline
3. Run measurement snippet on BOTH tabs for each element to be fixed
4. Calculate deltas with exact values
5. Use arbitrary Tailwind values (`h-[34px]`, `text-[rgb(65,69,73)]`) for precision

**Sizing iteration rule:** 2px increments max. Never jump 10px.

## Step 1: Prepare Fix Briefs

For each page to fix:

```
### Fix Brief: <Page Name>

**Page path:** `/localhost-path` (production: `/production-path`)
**Source files:** `src/app/<path>/page.tsx`
**Design spec:** `screenshots/specs/<page-name>.md`

**Gaps to fix:**

1. **[Zone]** — Production shows [X], localhost has [Y].
   - **Selector:** `<generic CSS selector>`
   - **Production values** (measured live): [values]
   - **Localhost values** (measured live): [values]
   - Delta: [specific deltas]
   - Fix: [specific change]
   - Verify by: [measurement instructions]

**Do NOT change:** [things that already match]
```

## Step 2: Launch parallel agents

Group non-conflicting gaps. Every agent prompt MUST include:
- Agent Block from `docs/agent-block.md`
- Working directory path
- The Fix Brief (text only)

## Step 3: Quality gate

After each agent, run `docs/quality-gate.md` **in full**:
1. DS violation scan
2. TypeScript check
3. **Visual verification — 5-iteration loop (protocol Section 7)**

**Do NOT commit without Step 3.** Steps 1-2 catch code issues only. Without Step 3 you have no evidence the visual fix works.

## Step 4: Update catalog

Update `screenshots/screenshot-catalog.md` (protocol Section 8 qualifiers). Only mark gap `[x]` if ALL entries show "yes".

## Step 5: Build, commit, push

Pre-commit: every gap has comparison table with PASS, `npx next build` passes, no unverified gaps committed as fixed.

## Step 6: Return to menu or continue

**Quick/Standard:** Show menu with summary.
**Until done:** Re-read `docs/fidelity-gaps.md`, continue.
