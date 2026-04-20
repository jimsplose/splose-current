Run the next DS audit fix session. Read these files first:

1. Read `docs/ds-audit-fix-backlog.md` — the ordered list of fix sessions. Find the next one with status `open`.
2. Read `docs/ds-audit-2026-04-20.md` (or the most recent `docs/ds-audit-*.md`) — the context for the session's findings
3. Read `docs/quality-gate.md` — post-change verification (5-iteration loop)
4. Read `docs/agent-block.md` — subagent prompt template (copy into any UI-touching agent)
5. Read CLAUDE.md "Design System" and "Decision Trees" sections — DS-first, extend don't bypass

Show Jim the next open session: title, scope, estimated effort, **recommended model (Sonnet/Opus)**, and DS components touched. If the session recommends Opus and you're currently running Sonnet (or vice versa), flag this to Jim before proceeding — he may want to switch models for this session. Ask:
- Run this one? (yes / skip to next / show full backlog)

On yes:
1. Mark the session `in-progress` in the backlog, commit that change
2. Execute the session's scope following DS-first discipline
3. Verify via Chrome MCP per `docs/quality-gate.md`
4. Run `npx tsc --noEmit` and `npx next build`
5. Commit the changes
6. Mark the session `done` in the backlog, commit
7. Ask Jim if he wants to run the next session or stop for now

If Chrome MCP is unavailable, stop and troubleshoot per CLAUDE.md "Chrome MCP not responding" — do not use fallback paths for visual work.
