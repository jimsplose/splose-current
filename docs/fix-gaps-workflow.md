# Fix Gaps Workflow

Implement code changes to close fidelity gaps. Uses parallel subagents with mandatory visual verification.

**Shared procedures:** `docs/reference/measurement-protocol.md` (visual diff, measurement, thresholds, DS rules). Read it before starting.

## Scope

- **Quick**: 2-3 gaps
- **Standard**: All open gaps (partial/no entries)
- **Full sweep**: Re-verify and fix everything
- **Until done**: Keep going until all gaps closed

## Prerequisites

1. Chrome MCP available and responding (**mandatory** — no fallback. See CLAUDE.md Decision Trees if not working.)
2. Viewport: 1440x900 (protocol Section 1)
3. `docs/reference/measurement-protocol.md` read (thresholds, measurement snippet, DS scan patterns)
4. `docs/route-mapping.md` read (production ↔ localhost URL pairs)
5. Design specs checked (`screenshots/specs/<page-name>.md`)
6. DS components mandatory (`docs/agent-block.md`)

**Target values priority:** Live production measurement wins. Always. Design specs and reference screenshots are supporting context, not overrides.

## Step 0: Measure before fixing

**MANDATORY before any visual change.**

1. Set up dual tabs (protocol Section 2)
2. **VISUAL DIFF FIRST — NOT OPTIONAL.** Screenshot both tabs side-by-side. Look at the WHOLE page, not just the elements in the gap description. Note ALL visible differences including backgrounds, card containers, content width, spacing, and layout structure. Gap descriptions are often incomplete — they name specific properties but miss structural/layout differences that are obvious visually. **If you skip this step, you WILL miss things.**
3. Run measurement snippet on BOTH tabs for every difference found in step 2
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
1. DS violation scan (all 4 scans — including inline style and DS bypass checks)
2. TypeScript check
3. **Visual verification — 5-iteration loop (protocol Section 7)**

**Do NOT commit without Step 3.** Steps 1-2 catch code issues only. Without Step 3 you have no evidence the visual fix works.

## Step 3.5: DS implementation review

Before committing, review each changed file and ask:

1. **Did I extend or bypass?** If production needs a value a DS component doesn't support, the fix must add a prop/variant to the DS component — not inline the style on the page. A visually correct fix that bypasses DS is incomplete.
2. **Did I hardcode in a DS component?** If a changed file is in `src/components/ds/`, check that new values are exposed as props, not baked in as inline styles. DS components should be configurable, not page-specific.
3. **Did I use typography classes?** Any `fontSize`/`fontWeight` combo in `style={{}}` should use a typography utility class or `<Text>` variant instead. If no class fits, add one to `globals.css` and the typography spec.

If any answer is wrong, fix it before committing. The gap stays open until the DS-proper implementation is done — visual match alone is not sufficient.

## Step 4: Update BOTH tracking files

**You must update both files — not one, not the other, both.**

1. **`screenshots/screenshot-catalog.md`** — Update match status using protocol Section 8 qualifiers.
2. **`docs/fidelity-gaps.md`** — Mark gap `[x]` only if ALL related catalog entries show "yes". Include a one-line summary with date (e.g. "Fixed: ... Measurement-verified 2026-04-14.")

If you update the catalog but forget fidelity-gaps.md (or vice versa), the next session will see inconsistent state and waste time re-verifying.

## Step 5: Build, commit, push

Pre-commit: every gap has comparison table with PASS, `npx next build` passes, no unverified gaps committed as fixed.

## Step 6: Return to menu or continue

**Quick/Standard:** Show menu with summary.
**Until done:** Re-read `docs/fidelity-gaps.md`, continue.
