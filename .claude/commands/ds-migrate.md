Run the next Wave 5 DS adoption + utility-class removal plan from `docs/ds-plans-wave5/`. Read these files first:

1. Read `docs/ds-plans-wave5/README.md` — phase ordering (00 → 08), the authoritative utility-class replacement mapping + priority ladder, and how Wave 5 closes the open audit backlog (sessions 27/28/29).
2. Read `docs/ds-audit-fix-backlog.md` — current state of sessions 27 (partial) / 28 (blocked) / 29 (partial). Plan 01 closes session 29's biggest line item; Plan 08 re-runs sessions 27 + 28.
3. Read `docs/quality-gate.md` — dual-tab Chrome MCP measurement protocol. Every Wave 5 migration MUST verify against production.
4. Read `docs/reference/measurement-protocol.md` — measurement JS snippet + threshold table.
5. Read `docs/agent-block.md` — subagent prompt template.
6. Read `docs/ds-audit-session-log.md` — prior session outcomes, particularly W4-P0 and W4-ALL entries describing Wave 4 component surface.
7. Read CLAUDE.md "Design System" (extend-don't-bypass), "Chrome MCP Visual Verification", and "Commit Discipline" sections.
8. Read `docs/reference/ds-component-catalog.md` — canonical API surface for every Wave 4 component.

**Finding the next plan:**

Status lives on row 2 of each plan file as `**Status:** Planned | In progress | Done | Partial`. Wave 5 plans are numbered `00-Prep.md` through `08-Cleanup.md`.

```
grep -H "^\*\*Status:\*\*" docs/ds-plans-wave5/*.md
```

The next plan to run is the first `Planned` (or `In progress`) plan in numeric order.

**Hard dependencies (enforce before starting):**

- **Plan 00 must be `Done` before any other plan.** 00 establishes ESLint tracking rules + the `<Td color>` prop + AiChatPanel CSS module, which later plans depend on.
- **Plan 08 must run AFTER 00–07.** 08 deletes `globals.css` utility blocks; safe only when all TSX callers are clean.
- **Plan 07 must run AFTER 01–06.** MDX "Composition" sections cite real shipped consumers.

**Within 01–06, any order is acceptable.** Recommended: 01-Calendar first (highest visibility + closes audit 29).

**Pre-start checks:**

- Run `git log --oneline -10` and look for commits (especially WIP auto-saves) that touch files in the target plan's surface. If found, summarise what's already there so you don't redo work.
- Check the plan's `Open questions` section. If any are unresolved and the answer meaningfully changes what to ship, surface them to Jim before starting.
- If the target plan is 07 but any of 01–06 are still `Planned`, stop and tell Jim — MDX must run last.
- If the target plan is 08 but any of 00–07 are still `Planned`, stop and tell Jim — the utility-class deletion is only safe after every caller is migrated.

**If the user's message already names a specific plan** (e.g. "ds-migrate Calendar", "migrate invoice", "run 05"):

- Skip the confirmation question — proceed immediately to execution.
- Still show a brief header: plan title, surfaces touched, DS components being adopted, utility-class zero-check scope, dependencies, open questions.
- If the named plan has unmet dependencies, stop and tell Jim.

**Otherwise** (no plan named — just `/ds-migrate`):

Show Jim the next runnable plan:

- Title + estimated effort
- Surfaces touched (routes / directories)
- DS components being adopted
- Utility-class grep scope (which directories it zeroes)
- Dependencies on other Wave 5 plans
- Open questions
- Any files already touched by prior WIP commits

Ask: Run this one? (yes / skip to next / show phase summary)

**On yes (or immediately if a plan was named):**

1. Flip the plan's `Status:` to `In progress`, commit that change.
2. Execute both halves of the plan in coherent per-file edits:
   - **A. DS adoption** — adopt the Wave 4 components per the plan's migration table. DS-first, extend don't bypass. Missing prop? Add to the component.
   - **B. Utility-class cleanup** — remove typography/color/layout/structural classes per the README mapping. Layout priority: `<Flex vertical gap={N}>` → DS props → AntD native props → `style={{}}` last resort.
   - For plans 06/07 (cleanup-only), A is absent — only B runs.
   - For plan 08, neither A nor B in the usual sense — it's the `globals.css` delete + regression sweep + ESLint promote + audit close-out.
3. Run Chrome MCP dual-tab measurement on every migrated surface per `docs/quality-gate.md`. Produce `.verification-evidence` with production vs localhost rows covering typography + spacing + color (not just the DS adoption).
4. Commit per surface, not per component. The plan's "Commit discipline" section names the groupings.
5. Run `npx tsc --noEmit` and `npx next build` after the migration lands. Any error blocks the status flip.
6. Run the plan's "Acceptance criteria" — every checkbox. Split into "DS adoption" + "Utility-class cleanup" + "Gate" sub-sections per plan. Any miss means `Partial` with a follow-up note.
7. If the plan unblocks audit backlog work (e.g. Plan 01 closes session 29; Plan 08 enables 27/28), update `docs/ds-audit-fix-backlog.md` in the same commit block.
8. Commit.
9. Flip the plan's `Status:` to `Done` (or `Partial` with explicit note).
10. Append one-line entry to `docs/ds-audit-session-log.md`: plan name, date, model, scope delta, Chrome MCP results, any blockers.
11. Ask Jim whether to run the next Wave 5 plan, run an unblocked audit backlog session, or stop.

If Chrome MCP is unavailable, stop and troubleshoot per CLAUDE.md "Chrome MCP not responding" — do not use fallback paths for visual work.

**Supersedes:**

This command replaces the workflow described in `docs/superpowers/plans/2026-04-22-remove-utility-classes.md`. That plan is preserved for reference; its phases have been absorbed into Wave 5 per the mapping table in `docs/ds-plans-wave5/README.md`. Do not run it directly.
