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
   - **Selector:** `<CSS selector to measure this element>`
   - **Target values** (from splose-style-reference):
     ```
     color: rgb(65, 69, 73)
     fontSize: 14px
     fontWeight: 600
     lineHeight: 22px
     padding: 0px 15px
     ```
   - Current measured: [value from getBoundingClientRect/getComputedStyle]
   - Delta: [e.g. fontSize 16px→14px, fontWeight 400→600]
   - Fix: [specific Tailwind class change, e.g. `text-body-md` → `text-heading-sm`]
   - Verify by: Run measurement snippet with selector above; all target values must pass thresholds

**Do NOT change:**
- [Things that already match]
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

## Step 3: Quality gate

After each agent completes, run `docs/quality-gate.md`:
1. DS violation scan (grep)
2. TypeScript check (`npx tsc --noEmit`)
3. Visual verification — **the 5-iteration loop below**

## Step 4: 5-Iteration Measurement Verification Loop

**Mandatory for every visual fix. Do not commit until the loop passes or exhausts 5 iterations.**

```
FOR iteration = 1 to 5:

  1. MEASURE — Run the measurement snippet via Chrome MCP `javascript_tool`
     for every element in the Fix Brief:

     (() => {
       const selectors = [
         { sel: '<SELECTOR>', label: '<LABEL>' }
         // One entry per element from Fix Brief
       ];
       const props = [
         'color','backgroundColor','fontSize','fontWeight','fontFamily',
         'lineHeight','letterSpacing','padding','paddingTop','paddingRight',
         'paddingBottom','paddingLeft','margin','gap','borderRadius',
         'borderColor','borderWidth','boxShadow','display','flexDirection',
         'alignItems','justifyContent','opacity'
       ];
       const results = [];
       for (const {sel,label} of selectors) {
         const el = document.querySelector(sel);
         if (!el) { results.push({label,sel,error:'NOT FOUND'}); continue; }
         const s = getComputedStyle(el);
         const r = el.getBoundingClientRect();
         const m = {}; for (const p of props) m[p] = s[p];
         m._rect = {
           width: Math.round(r.width*10)/10,
           height: Math.round(r.height*10)/10
         };
         results.push({label,sel,measured:m});
       }
       JSON.stringify(results,null,2)
     })()

  2. COMPARE — Build a comparison table for each element:

     | Property | Target | Measured | Threshold | Pass? |
     |---|---|---|---|---|
     | color | rgb(65, 69, 73) | rgb(65, 69, 73) | exact RGB | PASS |
     | fontSize | 14px | 16px | exact | FAIL |

  3. VISUAL CHECK (supplement) — Take screenshot, zoom into changed zone,
     compare against reference screenshot of same zone. Catches structural
     issues measurement misses: missing elements, wrong order, layout breaks.

  4. EVALUATE:
     - IF 0 measurement failures AND no structural issues → PASS, exit loop
     - IF failures found:
       a. Log failing properties with exact deltas
       b. Fix using the delta (e.g. fontSize 16px→14px = use text-[14px])
       c. Adjust in 2px increments max for dimensions
       d. Continue to next iteration

  5. LOG — Record iteration in the Verification Log:

     #### Iteration N
     | Element | Props | Pass | Fail | Failing Properties |
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
| Font family (`fontFamily`) | Primary font match (first in stack) |
| Line height (`lineHeight`) | +/-1px |
| Dimensions (`height`, `width` from rect) | +/-2px |
| Padding, margin, gap (each side) | +/-2px |
| Border radius, border width | Exact match |
| Box shadow | Same structure, color exact, offsets +/-1px |
| Layout (`display`, `flexDirection`, `alignItems`, `justifyContent`) | Exact match |

### Fallback (no Chrome MCP)

When Chrome MCP is unavailable, use a **code-audit loop**:

1. Read the source file for the changed component
2. For each element in the Fix Brief, trace JSX → Tailwind classes
3. Resolve each class to CSS values using:
   - `globals.css` typography classes (e.g. `text-heading-sm` → `font-size: 14px; font-weight: 600`)
   - Tailwind defaults (e.g. `p-4` → `padding: 16px`)
   - Arbitrary values (e.g. `h-[56px]` → `height: 56px`)
   - CSS variables from `globals.css` @theme (e.g. `text-primary` → `color: #8250ff`)
4. Build the same comparison table with resolved values vs target values
5. Mark uncertain resolutions as "UNCERTAIN"
6. Pass/fail: resolved values must meet thresholds. UNCERTAIN = "partial — code-review only" in catalog
7. The 5-iteration cap still applies — re-read code after each change

## Step 5: Update catalog

Update `screenshots/screenshot-catalog.md` Match column for every changed page. Only mark gap `[x]` if ALL entries show "yes".

## Step 6: Build, commit, push

`npx next build` → commit → push. Never push broken code.

## Step 7: Return to menu or continue

**Quick/Standard:** Show session start menu with summary.
**Until done:** Re-read `docs/fidelity-gaps.md`, continue with next gaps until stop conditions met (all gaps closed, or no more fixable gaps remain).
