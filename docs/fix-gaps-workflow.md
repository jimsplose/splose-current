# Fix Gaps Workflow

Implement code changes to close fidelity gaps. Uses parallel subagents for speed, with a mandatory 5-iteration visual verification loop per fix.

## Scope (set by menu prompt)

- **Quick**: 2-3 gaps
- **Standard**: All open gaps (partial/no entries)
- **Full sweep**: Re-verify and fix everything, including "yes" entries that look wrong
- **Until done**: Keep going autonomously until all gaps are closed

## Prerequisites — MANDATORY

**Chrome MCP:** Preferred for the verification loop. If unavailable, use fallback (code review + style reference comparison).

**Design specs:** Check `screenshots/specs/<page-name>.md` before working on a page. If none exists, extract one first per `docs/design-spec-workflow.md`.

**Design System:** All work MUST use DS components from `@/components/ds`. See `docs/agent-block.md`.

**Style reference first:** Read `splose-style-reference/` for exact production CSS values BEFORE touching any code. This is the fastest path to correct values — the nav fix took 1 iteration because exact CSS was available. Only invoke `/impeccable:frontend-design` when no style reference exists for the element (new design decisions, not reference-matching).

## Step 0: Measure before fixing

**MANDATORY before any visual change.** Do not skip this.

1. Read `splose-style-reference/components/` and `splose-style-reference/page-structures/` for the element being fixed — get exact CSS values (color, font-size, font-weight, padding, border)
2. Use Chrome MCP `javascript_tool` to measure current rendered values:
   ```js
   (() => {
     const el = document.querySelector('<selector>');
     const rect = el.getBoundingClientRect();
     const style = getComputedStyle(el);
     return JSON.stringify({ width: rect.width, height: rect.height, fontSize: style.fontSize, fontWeight: style.fontWeight, color: style.color, padding: style.padding });
   })()
   ```
3. Calculate the exact delta between current and target — don't guess
4. Use arbitrary Tailwind values (`h-[34px]`, `px-[15px]`, `text-[rgb(65,69,73)]`) for precision

**Sizing iteration rule:** When the first fix doesn't match, adjust in **2px increments max**. Never jump 10px hoping to land on the right value.

## Step 1: Prepare Fix Briefs ("See" phase)

Before launching agents, the main agent reads references and produces Fix Briefs.

1. Read `screenshots/screenshot-catalog.md` — identify partial/no entries
2. Read reference screenshots (max 2 per pass)
3. Read `splose-style-reference/` for exact production CSS values for the affected elements
4. Cross-reference against page source and design spec
5. Produce a Fix Brief per page:

```
### Fix Brief: <Page Name>

**Page path:** `/path/to/page`
**Source files:** `src/app/<path>/page.tsx`
**Design spec:** `screenshots/specs/<page-name>.md`
**Style reference:** `splose-style-reference/page-structures/<page>.md`

**Gaps to fix:**

1. **[Zone]** — Reference shows [X], code has [Y].
   - Production CSS: [exact value from splose-style-reference, e.g. `color: rgb(65,69,73); font-weight: 400; padding: 0 15px`]
   - Current measured: [value from getBoundingClientRect/getComputedStyle]
   - Fix: [specific Tailwind class change, e.g. `text-text-secondary` → `text-[rgb(65,69,73)]`]
   - Verify by: [what to zoom into and compare]

**Do NOT change:**
- [Things that already match]
```

## Step 2: Launch parallel agents

Group non-conflicting gaps and launch simultaneously. **No worktrees.**

Every agent prompt MUST include:
- The full Agent Block from `docs/agent-block.md`
- `You are working in /Users/jimyenckensplose/claude/splose-current. Edit files directly.`
- The Fix Brief (text only — never screenshot file paths)

## Step 3: Quality gate

After each agent completes, run `docs/quality-gate.md`:
1. DS violation scan (grep)
2. TypeScript check (`npx tsc --noEmit`)
3. Visual verification — **the 5-iteration loop below**

## Step 4: 5-Iteration Visual Verification Loop

**This is mandatory for every visual fix. Do not commit until the loop passes or exhausts 5 iterations.**

```
FOR iteration = 1 to 5:
  1. Navigate to the changed page in Chrome MCP
  2. Take a full-page screenshot
  3. Zoom into the specific zone that was fixed
  4. Read the reference screenshot and zoom into the same zone
  5. Apply design checks:
     - Hierarchy: Is visual importance ranking correct?
     - Proportion: Are relative sizes right? (measure A vs B)
     - Weight: Does visual density match?
     - Spacing: Is rhythm correct?
  6. IF all checks pass → mark as PASS, exit loop
  7. IF mismatch found:
     - Document what's wrong and why
     - Make the fix (understand root cause, don't just guess a different value)
     - Continue to next iteration

IF 5 iterations exhausted without PASS:
  - Revert all changes for this gap
  - Log the issue in the Gap Report with details of what was tried
  - Move on to the next gap
```

**Fallback (no Chrome MCP):** Replace screenshot steps with code review against style references. Use "partial — code-review only" for catalog entries. The 5-iteration loop still applies — re-read code after each change and verify against spec values.

## Step 5: Update catalog

Update `screenshots/screenshot-catalog.md` Match column for every changed page. Only mark gap `[x]` if ALL entries show "yes".

## Step 6: Build, commit, push

`npx next build` → commit → push. Never push broken code.

## Step 7: Return to menu or continue

**Quick/Standard:** Show session start menu with summary.
**Until done:** Re-read `docs/fidelity-gaps.md`, continue with next gaps until stop conditions met (all gaps closed, or no more fixable gaps remain).
