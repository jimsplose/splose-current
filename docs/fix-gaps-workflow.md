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

1. **Set up dual tabs** per `docs/route-mapping.md`:
   - Tab A → `https://acme.splose.com/<production-route>`
   - Tab B → `http://localhost:3000/<localhost-route>`
2. **Measure production** — Run `javascript_tool` on Tab A for each element to be fixed:
   ```js
   (() => {
     const el = document.querySelector('<selector>');
     const rect = el.getBoundingClientRect();
     const style = getComputedStyle(el);
     return JSON.stringify({
       fontSize: style.fontSize, fontWeight: style.fontWeight,
       color: style.color, backgroundColor: style.backgroundColor,
       padding: style.padding, lineHeight: style.lineHeight,
       borderRadius: style.borderRadius, borderColor: style.borderColor,
       gap: style.gap, letterSpacing: style.letterSpacing
     });
   })()
   ```
3. **Measure localhost** — Run the same snippet on Tab B
4. **Calculate delta** — Don't guess. Use exact values from both measurements.
5. Use arbitrary Tailwind values (`h-[34px]`, `px-[15px]`, `text-[rgb(65,69,73)]`) for precision

**Sizing iteration rule:** When the first fix doesn't match, adjust in **2px increments max**. Never jump 10px hoping to land on the right value.

**Selector guidance:** Use generic selectors that work on both sites (see `docs/compare-pages-workflow.md` Step 2c for details). Avoid `.ant-*` classes — those only exist on production.

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

```
FOR iteration = 1 to 5:

  1. MEASURE — Run the measurement snippet via Chrome MCP `javascript_tool`
     on BOTH production (Tab A) and localhost (Tab B) for every element in the Fix Brief.

     Use the same snippet on both tabs:
     (() => {
       const selectors = [
         { sel: '<SELECTOR>', label: '<LABEL>' }
         // One entry per element from Fix Brief
       ];
       // Intrinsic properties only
       const props = [
         'color','backgroundColor','fontSize','fontWeight','fontFamily',
         'lineHeight','letterSpacing','padding','paddingTop','paddingRight',
         'paddingBottom','paddingLeft','gap','borderRadius',
         'borderColor','borderWidth','boxShadow'
       ];
       const results = [];
       for (const {sel,label} of selectors) {
         const el = document.querySelector(sel);
         if (!el) { results.push({label,sel,error:'NOT FOUND'}); continue; }
         const s = getComputedStyle(el);
         const m = {}; for (const p of props) m[p] = s[p];
         results.push({label,sel,measured:m});
       }
       JSON.stringify(results,null,2)
     })()

  2. COMPARE — Build a table comparing production vs localhost:

     | Property | Production | Localhost | Delta | Threshold | Pass? |
     |---|---|---|---|---|---|
     | color | rgb(65, 69, 73) | rgb(65, 69, 73) | 0 | exact RGB | PASS |
     | fontSize | 14px | 16px | +2px | exact | FAIL |

  3. STRUCTURAL CHECK — Screenshot both tabs, zoom into changed zone,
     compare visually. Record findings:
     - Production screenshot: [taken]
     - Localhost screenshot: [taken]
     - Missing/extra elements: [none / list]
     - Layout diffs: [none / list]

  4. EVALUATE:
     - IF 0 measurement failures AND no structural issues → PASS, exit loop
     - IF failures found:
       a. Log failing properties with exact deltas
       b. Fix using the delta (e.g. fontSize 16px→14px = use text-[14px])
       c. Adjust in 2px increments max for dimensions
       d. Continue to next iteration

  5. LOG — Record iteration in the Verification Log:

     #### Iteration N
     | Element | Props Checked | Pass | Fail | Failing Properties |
     |---|---|---|---|---|
     | Page title | 8 | 6 | 2 | fontSize (16px→14px), fontWeight (400→600) |
     **Action:** Changed text-body-md to text-heading-sm

IF 5 iterations exhausted without PASS:
  - Revert all changes for this gap
  - Include full Verification Log in the Gap Report
  - Log root cause hypothesis
  - Move on to the next gap
```

### Acceptance Thresholds

| Property Type | Threshold |
|---|---|
| Color (`color`, `backgroundColor`, `borderColor`) | Exact RGB match (normalize to `rgb(R, G, B)`) |
| Font size (`fontSize`) | Exact match |
| Font weight (`fontWeight`) | Exact match (400/500/600/700) |
| Font family (`fontFamily`) | Primary font match (first in stack). Production = Inter + Sprig Sans, localhost = Inter. Both OK. |
| Line height (`lineHeight`) | +/-1px |
| Letter spacing (`letterSpacing`) | +/-0.5px or "normal" matches "0px" |
| Dimensions (`height`, `width` from rect) | +/-2px **only for fixed-size elements** (icons, avatars). Skip for flex/block containers. |
| Padding, margin, gap (each side) | +/-2px |
| Border radius, border width | Exact match |
| Box shadow | Same structure, color exact, offsets +/-1px |
| Layout (`display`, `flexDirection`, etc.) | Report only — different implementations can achieve same visual result |

### Fallback (no Chrome MCP)

When Chrome MCP is unavailable, use a **code-audit loop**:

1. Read the source file for the changed component
2. For each element in the Fix Brief, trace JSX → Tailwind classes
3. Resolve each class to CSS values using:
   - `globals.css` typography classes (e.g. `text-heading-sm` → `font-size: 14px; font-weight: 600`)
   - Tailwind defaults (e.g. `p-4` → `padding: 16px`)
   - Arbitrary values (e.g. `h-[56px]` → `height: 56px`)
   - CSS variables from `globals.css` @theme (e.g. `text-primary` → `color: #8250ff`)
4. Use `splose-style-reference/` as target values (since live measurement is unavailable)
5. Build the same comparison table with resolved values vs target values
6. Mark uncertain resolutions as "UNCERTAIN"
7. Pass/fail: resolved values must meet thresholds. UNCERTAIN = "partial — code-review only" in catalog
8. The 5-iteration cap still applies — re-read code after each change

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
