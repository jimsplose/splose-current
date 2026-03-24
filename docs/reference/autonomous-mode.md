# Autonomous Mode Behavior

For **Extended** and **Until done** session durations (fidelity loops and visual audits).

## Rules

- Use Chrome MCP for visual verification throughout
- Auto-select gaps by priority from `docs/fidelity-gaps.md` — highest first
- Skip "return to menu" between rounds — go straight to next batch
- Commit after every completed gap (not every batch) to preserve work
- Push every 2-3 gaps (or after each round of parallel agents)
- `git fetch origin main && git merge origin/main --no-edit` before each push
- Re-read `docs/fidelity-gaps.md` after each round (other session may have updated it)

## Stop Conditions (check after each round)

1. All open gaps closed → stop, show summary
2. Context compression triggered 2+ times → stop, commit WIP, show summary
3. Build failure that can't be auto-fixed → stop, revert breaking change, show summary
4. Jim sends a message → stop current round, respond to Jim

## When Stopping

1. Commit all work in progress
2. Push to branch
3. Update `docs/progress.md`
4. Show full session summary (gaps closed, pages improved, remaining work)

## Before/After Review Format

After each round, present Jim with:

```
### Round N Results

**Improved this round:**
- Calendar: Added appointment flyout panel (was missing, now ~80% match)
- Waitlist: Screener tab triage buttons now match reference

**Biggest remaining gaps:**
- Dashboard (ref: screenshot-10-53-42.png) — messages panel layout wrong. ~2 cycles.
- Settings (ref: screenshot-5-56-30.png) — Details form is placeholder only. ~1 cycle.

**Preview URL:** https://splose-current-git-claude-xxx.vercel.app
```

Only show pages where improvement is meaningful — skip trivial spacing tweaks.
Skip review entirely if changes are infrastructure-only with no visual impact.
