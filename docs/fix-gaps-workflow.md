# Fix Gaps Workflow

Implement code changes to close fidelity gaps. Uses parallel subagents for speed, with a mandatory 5-iteration visual verification loop per fix.

## Scope (set by menu prompt)

- **Quick**: 2-3 gaps
- **Standard**: All open gaps (partial/no entries)
- **Full sweep**: Re-verify and fix everything, including "yes" entries that look wrong
- **Until done**: Keep going autonomously until all gaps are closed

## Prerequisites — MANDATORY

**Chrome MCP:** Preferred for the verification loop. If unavailable, use fallback (code review + style reference comparison).

**Viewport:** At session start, set canonical viewport:
```
mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }
```

**Route mapping:** Read `docs/route-mapping.md` for production URL lookups.

**Design specs:** Check `screenshots/specs/<page-name>.md` before working on a page. If none exists, extract one first per `docs/design-spec-workflow.md`.

**Design System:** All work MUST use DS components from `@/components/ds`. See `docs/agent-block.md`.

**Target values — where to get them (priority order):**
1. **Live production measurement** (preferred) — Run `javascript_tool` on `acme.splose.com` to get current values. Same browser, same viewport = most accurate target.
2. `splose-style-reference/` — Use as documentation to understand the design system, but prefer live measurement when Chrome MCP is available.
3. Reference screenshots — Visual reference only, don't extract pixel values from static images.

Only invoke `/impeccable:frontend-design` when no production reference exists for the element (new design decisions, not reference-matching).

## Step 0: Measure before fixing (dual-tab)

**MANDATORY before any visual change.** Do not skip this.

1. Set up dual tabs per `docs/route-mapping.md` (Tab A = production, Tab B = localhost)
2. Run the measurement snippet from `docs/quality-gate.md` Step 3 on BOTH tabs for each element to be fixed
3. Calculate delta — don't guess, use exact values from both measurements
4. Use arbitrary Tailwind values (`h-[34px]`, `px-[15px]`, `text-[rgb(65,69,73)]`) for precision

**Sizing iteration rule:** When the first fix doesn't match, adjust in **2px increments max**. Never jump 10px hoping to land on the right value.

**Selector guidance:** Use generic selectors that work on both sites. Avoid `.ant-*` classes — those only exist on production.

## Step 1: Prepare Fix Briefs ("See" phase)

Before launching agents, the main agent reads references and produces Fix Briefs.

1. Read `screenshots/screenshot-catalog.md` — identify partial/no entries
2. **Measure production live** via dual-tab for each page to be fixed
3. **Measure localhost live** via dual-tab for the same elements
4. Cross-reference against page source and design spec
5. Produce a Fix Brief per page:

```
### Fix Brief: <Page Name>

**Page path:** `/localhost-path` (production: `/production-path`)
**Source files:** `src/app/<path>/page.tsx`
**Design spec:** `screenshots/specs/<page-name>.md`

**Gaps to fix:**

1. **[Zone]** — Production shows [X], localhost has [Y].
   - **Selector:** `<CSS selector that works on BOTH sites>`
   - **Production values** (measured live):
     ```
     color: rgb(65, 69, 73)
     fontSize: 14px
     fontWeight: 600
     lineHeight: 22px
     padding: 0px 15px
     ```
   - **Localhost values** (measured live):
     ```
     color: rgb(107, 114, 128)
     fontSize: 16px
     fontWeight: 400
     lineHeight: 24px
     padding: 0px 16px
     ```
   - Delta: fontSize 16px→14px, fontWeight 400→600, color grey-500→custom
   - Fix: [specific Tailwind class change, e.g. `text-body-md` → `text-heading-sm`]
   - Verify by: Run measurement snippet with selector above; localhost values must match production values within thresholds

**Do NOT change:**
- [Things that already match production]
```

## Step 2: Launch parallel agents

Group non-conflicting gaps and launch simultaneously. **Worktree strategy:**
- **Different files** → direct agents (no isolation), parallel OK
- **Same file** → worktree agents (`isolation: "worktree"`), sequential only. See `docs/worktree-guardrails.md`

Every agent prompt MUST include:
- The full Agent Block from `docs/agent-block.md`
- `You are working in /Users/jimyenckensplose/claude/splose-current. Edit files directly.`
- The Fix Brief (text only — never screenshot file paths)
- **If worktree agent:** `Before finishing, you MUST run: git add -A && git commit -m "<summary>"`

## Step 3: Quality gate — HARD GATE, NO EXCEPTIONS

After each agent completes, run `docs/quality-gate.md` **in full**. All three steps are required:
1. DS violation scan (grep)
2. TypeScript check (`npx tsc --noEmit`)
3. **Visual verification — the 5-iteration measurement loop below**

**Step 3 is the verification step that validates the fix actually works.** Steps 1-2 only catch code-level issues. Without Step 3, you have no evidence the visual fix is correct. Do NOT commit after only Steps 1-2.

**If you find yourself about to commit without running the measurement loop, STOP.** You are skipping the most important step. The gap is not fixed until you have measurement evidence.

## Step 4: 5-Iteration Measurement Verification Loop

**Mandatory for every visual fix. Do not commit until the loop passes or exhausts 5 iterations.**

Run the full 5-iteration dual-tab measurement loop from `docs/quality-gate.md` Step 3. That document is the canonical source for:
- The JS measurement snippet (run on both production and localhost tabs)
- The comparison table format (Property | Production | Localhost | Delta | Threshold | Pass?)
- Structural screenshot check format
- Acceptance thresholds (colors exact RGB, font size/weight exact, line height +/-1px, padding/gap +/-2px, border radius exact)
- Fallback code-audit loop when Chrome MCP is unavailable

**Fix Gaps-specific rules:**
- Use selectors from the Fix Brief for each iteration
- Log each iteration with failing properties and the fix applied
- After 5 iterations without PASS: revert all changes, log root cause hypothesis, move on
- Write `.verification-evidence` with the page path after PASS (required by pre-commit hook)

## Step 5: Update catalog

Update `screenshots/screenshot-catalog.md` Match column for every changed page. Only mark gap `[x]` if ALL entries show "yes".

## Step 6: Build, commit, push

**Pre-commit gate:** Before running `git commit`, confirm:
1. Every gap in this batch has a measurement comparison table with PASS verdict
2. `npx next build` passes
3. No unverified gaps are being committed as "fixed"

If a gap passed Steps 1-2 of the quality gate but NOT Step 3 (measurement verification), it is **not fixed**. Do not mark it `[x]` in fidelity-gaps.md. Leave it `[ ]` and note "needs verification" so the next session picks it up.

Commit → push. Never push broken code. Never push unverified visual fixes as complete.

## Step 7: Return to menu or continue

**Quick/Standard:** Show session start menu with summary.
**Until done:** Re-read `docs/fidelity-gaps.md`, continue with next gaps until stop conditions met (all gaps closed, or no more fixable gaps remain).
