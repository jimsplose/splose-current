Run the next DS audit fix session. Read these files first:

1. Read `docs/ds-audit-fix-backlog.md` — the ordered list of fix sessions. Find the next one with status `open`. Check its `Prereq` column; if any prereq session is not yet `done`, skip to the next `open` session with satisfied prereqs. Tell Jim which sessions were skipped and why.
2. Read `docs/ds-audit-2026-04-20.md` (or the most recent `docs/ds-audit-*.md`) — the context for the session's findings
3. Read `docs/quality-gate.md` — post-change verification (5-iteration loop + Storybook fallback for orphan components)
4. Read `docs/agent-block.md` — subagent prompt template (copy into any UI-touching agent)
5. Read `docs/ds-audit-session-log.md` — past session outcomes and pitfalls, to learn from prior runs
6. Read CLAUDE.md "Design System" and "Decision Trees" sections — DS-first, extend don't bypass

**Pre-start checks:**

- Run `git log --oneline -10` and look for commits (especially WIP auto-saves) that touch files in the target session's scope. If found, summarise what's already there so you don't redo work.
- Check the most recent WIP commit's `Co-Authored-By` line. If it names a different model than the backlog recommends for this session, surface this to Jim:
  > "Last WIP was [detected model]; backlog recommends [model] for this session. Continue anyway?"
  Note: the `stop-auto-save.sh` hook historically hardcoded Opus in WIP commits; verify the hook is correct before trusting the Co-Authored-By.

Show Jim the next runnable session: title, scope, estimated effort, **recommended model (Sonnet/Opus)**, prereq status, DS components touched, and any files already touched by prior WIP commits. If the session recommends Opus and you're currently running Sonnet (or vice versa), flag this to Jim before proceeding — he may want to switch models. Ask:
- Run this one? (yes / skip to next / show full backlog)

On yes:
1. Mark the session `in-progress` in the backlog, commit that change
2. Execute the session's scope following DS-first discipline
3. Verify via Chrome MCP per `docs/quality-gate.md`. If the migrated component isn't mounted on any current route, use the Storybook fallback (Step 3a in quality-gate.md).
4. Run `npx tsc --noEmit` and `npx next build`
5. **Run the session's "Done-when" checks** from the backlog's "## Definition of done" section. Every explicit check must pass.
6. Commit the changes
7. Mark the session `done` (or `partial` if some scope was blocked on a prereq — create a follow-up row in that case) in the backlog, commit
8. Append a one-line entry to `docs/ds-audit-session-log.md` with the session number, date, model used, scope delta (promised vs landed), and any blockers discovered.
9. Ask Jim if he wants to run the next session or stop for now

If Chrome MCP is unavailable, stop and troubleshoot per CLAUDE.md "Chrome MCP not responding" — do not use fallback paths for visual work.
