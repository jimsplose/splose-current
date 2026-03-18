# Fidelity Improvement Workflow

Use **parallel subagents** for speed when working through fidelity gaps.

## Step 1: Launch parallel agents (worktree isolation)

Group non-conflicting gaps and launch them simultaneously using the Agent tool with `isolation: "worktree"`. Each agent should:
1. Read the relevant reference screenshot(s) from `screenshots/reference/`
2. Read the current page source code
3. Rewrite/edit the code to match the screenshot
4. Ensure no TypeScript errors in the changed files

### Parallelization rules
- Gaps touching **different page directories** can always run in parallel
- Gaps touching the **same file** must run sequentially
- The **database re-seed** gap should run alone (it changes seed data that pages read)
- The **general screenshot review** agent should run last as a sweep

## Step 2: Collect and apply changes

After agents complete:
1. For each agent that made changes in a worktree, review the diff and cherry-pick/apply to the main branch
2. **After each agent's changes are applied**, run `npx tsc --noEmit` to catch type conflicts before applying the next agent
3. If an agent's worktree has conflicts with another, resolve manually
4. If applying an agent's changes breaks the build, **revert that agent's changes** and continue with the next — don't spend the session debugging a single agent's output

## Step 3: Build, commit, push

1. Run `npx next build` to verify no errors — **never push a broken build**
2. Stage and commit all changes with a descriptive message
3. Push to the `claude/*` branch
4. Fast-forward `main` via `gh api repos/jimsplose/splose-current/git/refs/heads/main -X PATCH -f sha="$SHA"`
5. Note the Vercel preview URL in the session progress log (see `docs/progress.md`)

## Step 4: Before/After Review

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
- Skip this step if the round only produced infrastructure changes (database, config, tooling)
- Skip if all changes were minor polish with no visual difference

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

## Step 5: Repeat

Pick the next batch of gaps (by priority — see `docs/fidelity-gaps.md`) and repeat. Keep going until all gaps are resolved or the session runs low on context.

If running low on context, **stop and commit** what you have rather than risking lost work.
