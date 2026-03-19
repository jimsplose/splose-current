# Fidelity Improvement Workflow

Use **parallel subagents** for speed when working through fidelity gaps.

## Design System First — MANDATORY

**All fidelity work MUST use design system components.** See the Component Library table in CLAUDE.md for the full list. Import from `@/components/ds`. Run `npm run storybook` to see all components live.

If a fidelity gap requires a component not in the DS, **add it to the DS first** (`src/components/ds/`), then use it in the page. Write a Storybook story in `src/components/ds/stories/` and verify it renders with `npm run storybook` before pushing.

## Completion criteria

See the **Gap completion rule** in CLAUDE.md (single source of truth). In short: a gap is only `[x]` when ALL related catalog entries show Match = "yes". If entries still show "no" or "partial", the gap stays `[ ]` — note partial progress in the gap description (e.g. "layout matches, colors wrong").

## Step 1: Launch parallel agents (worktree isolation)

Group non-conflicting gaps and launch them simultaneously using the Agent tool with `isolation: "worktree"`. Worktree isolation creates a separate git working directory for each agent so they don't overwrite each other's files — this is what enables safe parallel work on different pages.

**Every agent prompt MUST include the full Agent Block from CLAUDE.md** (between `---START AGENT BLOCK---` and `---END AGENT BLOCK---` markers). Do NOT launch without it — this embeds DS enforcement and screenshot verification directly into the agent.

Each agent should:
1. Read the relevant reference screenshot(s) from `screenshots/reference/`
2. Read the current page source code
3. Rewrite/edit the code to match the screenshot **using DS components**
4. Ensure no TypeScript errors in the changed files
5. Run the **Screenshot Verification Loop** from the Agent Block (up to 3 iterations)

### Parallelization rules
- Gaps touching **different page directories** can always run in parallel
- Gaps touching the **same file** must run sequentially
- **Database changes** should run alone — they modify `prisma/seed.ts` which affects all pages. After changing seed data, run `npx tsx prisma/seed.ts` (or the seed API route) and verify affected pages still render correctly
- The **general screenshot review** agent should run last as a sweep

## Step 2: Collect and apply changes (with Post-Agent Quality Gate)

After each agent completes, run the **Post-Agent Quality Gate from CLAUDE.md** before committing. This is mandatory — do not batch or skip.

For each agent:
1. Review the diff and cherry-pick/apply to the main branch
2. **Run the Quality Gate** (DS violation scan → TypeScript check → screenshot verification → commit or revert)
3. If an agent's worktree has conflicts with another, resolve manually
4. If applying an agent's changes breaks the build, **revert that agent's changes** and continue with the next — don't spend the session debugging a single agent's output

## Step 3: Screenshot Verification

**This is handled automatically** if you included the Agent Block from CLAUDE.md in each agent's prompt (Step 1) and ran the Post-Agent Quality Gate (Step 2).

- **Subagents**: Run the Screenshot Verification Loop embedded in the Agent Block (up to 3 iterations)
- **Main agent**: Run the screenshot check in the Post-Agent Quality Gate after applying each agent's changes
- **After push**: Follow the Post-Push Screenshots section in CLAUDE.md (take 1-2 screenshots, show inline)

See CLAUDE.md for the full instructions. Do not duplicate them here.

## Step 4: Update catalog Match status

After code changes are committed, update `screenshots/screenshot-catalog.md`:

1. For each page that was changed, capture its current state (Playwright screenshot if available, or read the source code)
2. Compare against ALL reference screenshots for that page using the acceptance criteria from the Agent Block
3. Update the Match column:
   - "yes" — matches the reference
   - "partial" — some elements match (add note on what's still wrong)
   - Leave as "no" if still not matching
4. Only mark the corresponding gap as `[x]` in `docs/fidelity-gaps.md` if ALL entries for that page show "yes"

**This step is mandatory.** The catalog is the source of truth for fidelity status.

## Step 5: Build, commit, push

1. Run `npx next build` to verify no errors — **never push a broken build**
2. Stage and commit all changes (including catalog updates) with a descriptive message
3. Push to the `claude/*` branch — GitHub Action auto-promotes to production after Vercel build succeeds
4. Note the Vercel preview URL in the session progress log (see `docs/progress.md`)

## Step 6: Before/After Review

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
- Skip if changes have no visual impact (see CLAUDE.md "When to skip screenshots" for the definition)

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

## Step 7: Repeat

Pick the next batch of gaps (by priority — see `docs/fidelity-gaps.md`) and repeat. Keep going until all gaps are resolved or the session runs low on context.

If running low on context, **stop and commit** what you have rather than risking lost work.
