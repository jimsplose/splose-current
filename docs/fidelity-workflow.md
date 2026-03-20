# Fidelity Improvement Workflow

Use **parallel subagents** for speed when working through fidelity gaps.

## Prerequisites — MANDATORY

### Puppeteer (screenshot capture)
Puppeteer is a dev dependency and bundles Chromium automatically via `npm install`. No separate browser download step needed. If screenshots fail, run `npm install puppeteer` to re-download.

### Persistent browser (recommended for multi-gap sessions)
Start a persistent browser to eliminate the ~3-5s Chromium cold start per screenshot capture:
```bash
npx tsx scripts/start-browser.ts
```
Run this in the background at session start. All `screenshot-capture.ts` calls auto-connect via `/tmp/chrome-ws-endpoint.txt`. **For Extended/Until-done duration modes, this is mandatory.**

### Design specs
Before working on a page, check if a design spec exists at `screenshots/specs/<page-name>.md`. **If not, extract one first** by following `docs/design-spec-workflow.md`. This is not optional — agents produce better results when they have exact values to target. Skip only if the page has no reference screenshots.

### Design System
**All fidelity work MUST use design system components.** See the Component Library table in `docs/agent-block.md` for the full list. Import from `@/components/ds`. Run `npm run storybook` to see all components live.

If a fidelity gap requires a component not in the DS, **add it to the DS first** (`src/components/ds/`), then use it in the page. Write a Storybook story in `src/components/ds/stories/` and verify it renders with `npm run storybook` before pushing.

### Component creation is a priority

When working through fidelity gaps, **actively look for opportunities to create new DS components**. If you see the same inline pattern repeated across 2+ pages (e.g. tabs, modals, cards, toggles, sidebars), extract it into a reusable DS component rather than copying inline Tailwind. This is higher priority than finishing more pages — one good component saves work across many pages.

**After creating a new DS component**, you MUST:
1. Add a Storybook story in `src/components/ds/stories/`
2. Export it from `src/components/ds/index.ts`
3. Update the component table in `CLAUDE.md` (Design System section)
4. Update the Agent Block table in `docs/agent-block.md`

## Completion criteria

See the **Gap completion rule** in `docs/agent-block.md` (single source of truth). In short: a gap is only `[x]` when ALL related catalog entries show Match = "yes". If entries still show "no" or "partial", the gap stays `[ ]` — note partial progress in the gap description (e.g. "layout matches, colors wrong").

## Step 1: Launch parallel agents (direct, no worktrees)

Group non-conflicting gaps and launch them simultaneously using the Agent tool. **Do NOT use `isolation: "worktree"`** — worktrees cause data loss when multiple sessions run concurrently or when the shell CWD gets stuck in a deleted worktree directory. Direct agents are safer and nearly as fast for this project.

**Every agent prompt MUST include the full Agent Block from `docs/agent-block.md`** (between `---START AGENT BLOCK---` and `---END AGENT BLOCK---` markers). Do NOT launch without it — this embeds DS enforcement and screenshot verification directly into the agent.

**Every agent prompt MUST include:** `You are working in /Users/jimyenckensplose/claude/splose-current. Edit files directly. Do NOT use worktrees.`

Each agent should:
1. Read the design spec from `screenshots/specs/<page-name>.md` (if available) for exact values
2. Read the relevant reference screenshot(s) from `screenshots/reference/`
3. Read the current page source code
4. Rewrite/edit the code to match the screenshot **using DS components** and **exact spec values**
5. Ensure no TypeScript errors in the changed files
6. Run the **Screenshot Verification Loop** from the Agent Block (convergence-based, up to 10 iterations)

### Parallelization rules
- Gaps touching **different page directories** can always run in parallel (direct agents are safe since each edits different files)
- Gaps touching the **same file** must run sequentially
- **Database changes** should run alone — they modify `prisma/seed.ts` which affects all pages. After changing seed data, run `npx tsx prisma/seed.ts` (or the seed API route) and verify affected pages still render correctly
- The **general screenshot review** agent should run last as a sweep

### Why no worktrees
Worktrees (`isolation: "worktree"`) were removed from this workflow because:
1. **Concurrent session conflicts** — two Claude sessions creating worktrees in the same repo corrupt `.git` metadata
2. **CWD corruption** — if the shell ends up in a deleted worktree dir, all file operations silently go to the wrong path
3. **Uncommitted work loss** — worktree cleanup deletes uncommitted changes with no recovery
4. **Minimal benefit** — most fidelity agents touch a single page file, so file conflicts are rare even without isolation

## Step 2: Verify and commit changes (with Post-Agent Quality Gate)

After each agent completes, run the **Post-Agent Quality Gate from `docs/quality-gate.md`** before committing. This is mandatory — do not batch or skip.

### CWD safety check — MANDATORY
Before doing anything after an agent completes, verify you're in the right directory:
```bash
cd /Users/jimyenckensplose/claude/splose-current && pwd
```
If this returns a `.claude/worktrees/` path, you're in a stale worktree. `cd` to the real repo first.

For each agent:
1. Verify CWD is the real repo (not a worktree)
2. Run `git diff` to see what changed
3. **Run the Quality Gate** (DS violation scan → TypeScript check → screenshot verification → commit or revert)
4. If applying an agent's changes breaks the build, **revert that agent's changes** and continue with the next — don't spend the session debugging a single agent's output

## Step 3: Screenshot Verification (Pixel Diff)

**This is handled automatically** if you included the Agent Block from `docs/agent-block.md` in each agent's prompt (Step 1) and ran the Post-Agent Quality Gate (Step 2).

- **Subagents**: Run the convergence-based Screenshot Verification Loop from the Agent Block using `scripts/fidelity-loop.ts` (iterates until CONVERGED, PLATEAU, or MAX_ITERATIONS)
- **Main agent**: Run `scripts/pixel-diff.ts` in the Post-Agent Quality Gate after applying each agent's changes
- **After push**: Follow the Post-Push Visual Verification section in `docs/quality-gate.md`

### Interpreting results
- **CONVERGED** (mismatch <= 5%) — page matches reference, mark catalog as "yes"
- **PLATEAU** — mismatch stopped improving. Remaining diff is structural. Note what's still wrong, keep gap open
- **MAX_ITERATIONS** — 10 iterations without convergence. Needs a different approach or manual intervention

## Step 4: Update catalog Match status

After code changes are committed, update `screenshots/screenshot-catalog.md`:

1. For each page that was changed, capture its current state:
   ```bash
   npx tsx scripts/screenshot-capture.ts http://localhost:3000/<page> /tmp/catalog-<page>.png
   ```
2. Run pixel diff against ALL reference screenshots for that page:
   ```bash
   npx tsx scripts/pixel-diff.ts screenshots/reference/<ref.png> /tmp/catalog-<page>.png --threshold=5 --output=/tmp/diff-catalog-<page>.png
   ```
3. Update the Match column based on mismatch %:
   - "yes" — mismatch <= 5%
   - "partial — <mismatch%>, <what's wrong>" — mismatch 5-20%
   - "no" — mismatch > 20%
4. Only mark the corresponding gap as `[x]` in `docs/fidelity-gaps.md` if ALL entries for that page show "yes"

**This step is mandatory.** The catalog is the source of truth for fidelity status.

## Step 5: Update Dev Navigator registry

After code changes, verify the state registry (`src/lib/state-registry.ts`) is up to date:

1. **New pages** — If any new page routes were created, add a `PageEntry` with at least a `default` variant
2. **New states** — If any new interactive states were added (tabs, modals, view toggles), add `StateVariant` entries and ensure `?state=` is wired in the page component
3. **Removed pages** — If any pages were removed, delete the corresponding registry entries
4. **Verify completeness** — Cross-check `src/app/**/page.tsx` routes against the registry to catch any gaps

This keeps the Dev Navigator accurate so Jim can navigate to every page and state.

## Step 6: Build, commit, push

1. Run `npx next build` to verify no errors — **never push a broken build**
2. Stage and commit all changes (including catalog and registry updates) with a descriptive message
3. Push to the `claude/*` branch — GitHub Action auto-promotes to production after Vercel build succeeds
4. Note the Vercel preview URL in the session progress log (see `docs/progress.md`)

## Step 7: Before/After Review

After each round of changes is pushed, present Jim with a visual progress report:

### What to show
1. **Before/after comparisons** — For each page that had significant changes this round:
   - Read the reference screenshot from `screenshots/reference/`
   - Show it alongside a description of what changed and how it now matches (or doesn't)
   - Only show pages where the improvement is meaningful — skip trivial tweaks (spacing-only, minor color adjustments)

2. **Biggest remaining gaps** — Show 2-3 pages that are still furthest from their reference screenshots:
   - Read the reference screenshot
   - Read the current page source
   - Describe what's still missing
   - Estimate how many more cycles needed:
     - **1 cycle** = minor tweaks (colors, spacing, typography)
     - **2-3 cycles** = structural changes (missing components, layout rework, new interactive states)
     - **4+ cycles** = major missing features (entire sub-pages, complex interactive flows)

### When to skip
- Skip if the round only produced infrastructure changes (database, config, tooling)
- Skip if changes have no visual impact (see `docs/quality-gate.md` "When to skip" for the definition)

### Format
Present as a structured summary like:

```
### Round N Results

**Improved this round:**
- Calendar: Added appointment flyout panel (was missing entirely, now ~80% match)
- Waitlist: Screener tab triage buttons now match reference

**Biggest remaining gaps:**
- Dashboard (ref: screenshot-10-53-42.png) — messages panel layout wrong, analytics cards missing. ~2 cycles remaining.
- Settings (ref: screenshot-5-56-30.png) — Details form is placeholder only. ~1 cycle remaining.

**Preview URL:** https://splose-current-git-claude-xxx.vercel.app
```

## Step 8: Return to menu (or continue in autonomous mode)

**Quick/Standard duration modes:** After completing a round of fidelity work (Steps 1-7), **show the session start menu again** (see CLAUDE.md). Include a summary of what was improved and what gaps remain. Let Jim choose what's next.

**Extended/Until-done duration modes:** Skip the menu. Instead:
1. Re-read `docs/fidelity-gaps.md` to get the latest state (other sessions may have updated it)
2. Auto-select the next batch of highest-priority open gaps
3. Go back to Step 1 and launch the next round of agents
4. **Stop conditions** (check after each round):
   - All open gaps are closed → stop, show summary
   - Context compression has triggered 2+ times → stop, commit WIP, show summary
   - Build failure that can't be auto-fixed → stop, revert breaking change, show summary
   - Jim sends a message → stop current round, respond to Jim
5. When stopping: commit all work, push, update `docs/progress.md`, show full session summary

If running low on context, **stop and commit** what you have rather than risking lost work.
