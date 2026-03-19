# Fidelity Improvement Workflow

Use **parallel subagents** for speed when working through fidelity gaps.

## Design System First — MANDATORY

**All fidelity work MUST use design system components.** Never write inline Tailwind for patterns covered by the DS.

| Instead of... | Use... |
|---|---|
| Inline `<button className="rounded-lg border...">` | `<Button variant="secondary">` |
| Inline `<div className="rounded-full px-2 py-0.5 bg-green-100...">` | `<Badge variant="green">` |
| Inline `<input className="rounded-lg border...">` | `<FormInput label="..." />` |
| Inline `<select>` | `<FormSelect options={...} />` |
| Inline table wrapper | `<DataTable>`, `<TableHead>`, `<TableBody>` |
| Inline pagination | `<Pagination totalPages={...} />` |
| Inline page header | `<PageHeader title="...">` |
| Inline search input | `<SearchBar placeholder="..." />` |

Import from `@/components/ds`. Run `npm run storybook` to see all components live.

If a fidelity gap requires a component not in the DS, **add it to the DS first** (`src/components/ds/`), then use it in the page. Write a Storybook story for any new DS component.

## Step 1: Launch parallel agents (worktree isolation)

Group non-conflicting gaps and launch them simultaneously using the Agent tool with `isolation: "worktree"`. Each agent should:
1. Read the relevant reference screenshot(s) from `screenshots/reference/`
2. Read the current page source code
3. Rewrite/edit the code to match the screenshot **using DS components**
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

## Step 3: Playwright Screenshot Iteration Loop — MANDATORY

**Every agent MUST verify its own work** by taking Playwright screenshots and comparing them to reference screenshots. This is not optional — agents that skip this step produce lower quality work.

### How it works

Each agent, after making code changes, runs an iterative loop:

```
1. Start dev server: npm run dev (if not already running)
2. Take a Playwright screenshot of the changed page
3. Compare the screenshot to the reference screenshot from screenshots/reference/
4. If the page doesn't match well enough → make more code changes → go to step 2
5. Repeat up to 3 iterations maximum
```

### Taking screenshots with Playwright

Use this pattern in each agent:

```bash
# Take a screenshot of a specific page
npx playwright screenshot --wait-for-timeout=2000 http://localhost:3000/clients /tmp/screenshot-clients.png

# For pages with interactive states, navigate to the state first
npx playwright screenshot --wait-for-timeout=2000 "http://localhost:3000/calendar?state=month-view" /tmp/screenshot-calendar-month.png
```

### Agent prompt template

When launching fidelity agents, include this in the prompt:

```
After making your code changes:
1. Run `npx playwright screenshot --wait-for-timeout=2000 http://localhost:3000/<page-path> /tmp/screenshot-<page>.png`
2. Read the screenshot using the Read tool (it supports images)
3. Read the reference screenshot from `screenshots/reference/<relevant-file>`
4. Compare visually — does the layout, spacing, colors, and content match?
5. If not, make additional changes and repeat (up to 3 iterations)
6. On final iteration, save the screenshot to `/tmp/screenshot-<page>-final.png`
```

### Screenshots to return to user

After each push, the **main agent** (not subagents) MUST:
1. Take 1-2 Playwright screenshots of the most significant page changes
2. Show them inline in the chat so Jim can see progress without visiting the preview URL
3. Focus on pages with the biggest visual improvements

```bash
# Example: take screenshots of 2 major changes after push
npx playwright screenshot --wait-for-timeout=3000 http://localhost:3000/settings /tmp/progress-settings.png
npx playwright screenshot --wait-for-timeout=3000 http://localhost:3000/calendar /tmp/progress-calendar.png
```

Then use the Read tool to display them to the user.

## Step 4: Build, commit, push

1. Run `npx next build` to verify no errors — **never push a broken build**
2. Stage and commit all changes with a descriptive message
3. Push to the `claude/*` branch — GitHub Action auto-promotes to production after Vercel build succeeds
4. Note the Vercel preview URL in the session progress log (see `docs/progress.md`)

## Step 5: Before/After Review

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

## Step 6: Repeat

Pick the next batch of gaps (by priority — see `docs/fidelity-gaps.md`) and repeat. Keep going until all gaps are resolved or the session runs low on context.

If running low on context, **stop and commit** what you have rather than risking lost work.
