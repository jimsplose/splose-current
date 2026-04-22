Run the next Wave 4 DS component build from `docs/ds-plans/`. Read these files first:

1. Read `docs/ds-plans/README.md` — phase ordering, launch sequence, and resolved decisions. Phase 0 (Session0-StoryMetadata) is a mandatory precursor; Drawer must land before AppointmentCard; AppointmentCard must land before audit session 29 resumes.
2. Read `docs/ds-audit-fix-backlog.md` — confirm the post-backlog baseline (sessions 01–24 done) so plans don't conflict with open cleanup sessions (25–30).
3. Read `docs/quality-gate.md` — post-change verification (5-iteration loop + Storybook fallback for orphan components).
4. Read `docs/agent-block.md` — subagent prompt template (copy into any UI-touching agent).
5. Read `docs/ds-audit-session-log.md` — past session outcomes and pitfalls.
6. Read CLAUDE.md "Design System" and "Subagents" sections — DS-first, extend don't bypass, worktree rules.

**Finding the next plan:**

Status is tracked per-plan via a `Status:` line at the top of each plan file (Planned / In progress / Done). Grep for `^Status:` across `docs/ds-plans/` to see current state.

**First-run bootstrap:** If no plan files contain a `Status:` line yet, add `Status: Planned` as the second line of every plan file in `docs/ds-plans/` (except `README.md`), commit with message "Seed Status: Planned on ds-plans". Then proceed.

The next plan to run is the first `Planned` plan in the launch sequence order defined in the README:

1. Phase 0 — `Session0-StoryMetadata.md` (must be Done before any other plan)
2. Phase 1 — Tooltip → Skeleton → Toast → DatePicker → ListEnhancement → NumberInput (flexible within phase)
3. Phase 2 — Drawer first, then AppointmentCard, then the rest (AlertDialog, Accordion, Tag, Breadcrumbs, Stepper, SegmentedControl, PhoneInput) in any order
4. Phase 3 — AppointmentCard, PatientAvatar, PaymentStatusBadge, Sparkline
5. Phase 4 — CommandPalette, HoverCard, ContextMenu, SignaturePad, TimePicker, ComboBox

**Pre-start checks:**

- Run `git log --oneline -10` and look for commits (especially WIP auto-saves) that touch files in the target plan's scope. If found, summarise what's already there so you don't redo work.
- If Phase 0 is not yet `Done`, and the requested plan is not Phase 0, stop and tell Jim — Session0-StoryMetadata must land first.
- Check the plan's `Open questions` section. If any are unresolved, surface them to Jim before starting.

**If the user's message already names a specific plan** (e.g. "ds-plan Tooltip", "build Drawer", "run Toast plan"):
- Skip the confirmation question — proceed immediately to execution.
- Still show a brief header: plan title, phase, DS components touched, dependencies on other plans, open questions.
- If the named plan has unmet dependencies (e.g. AppointmentCard before Drawer lands), stop and tell Jim.
- If the plan recommends a different model than the one currently running, flag it once (one sentence) and continue.

**Otherwise** (no plan named — just `/ds-plan`):
Show Jim the next runnable plan: title, phase, estimated effort, DS components touched, dependencies, open questions, and any files already touched by prior WIP commits. Ask:
- Run this one? (yes / skip to next / show phase summary)

On yes (or immediately if a plan was named):

1. Flip the plan's `Status:` to `In progress`, commit that change.
2. Execute the plan's scope following DS-first discipline. Extend existing DS components when possible (see "extend, don't bypass" in CLAUDE.md).
3. Add / update Storybook stories using the `SploseDocHeader` + `splose-types` metadata infrastructure from Phase 0.
4. Verify via Chrome MCP per `docs/quality-gate.md`. For orphan components not yet mounted on a route, use the Storybook fallback (Step 3a in quality-gate.md).
5. Run `npx tsc --noEmit` and `npx next build`.
6. Run the plan's "Acceptance criteria" checks at the bottom of the plan file. Every criterion must pass.
7. Commit the changes.
8. Flip the plan's `Status:` to `Done` (or `Partial` with a follow-up note if scope was blocked).
9. Append a one-line entry to `docs/ds-audit-session-log.md`: plan name, date, model used, scope delta (promised vs landed), any blockers.
10. Ask Jim if he wants to run the next plan or stop for now.

If Chrome MCP is unavailable, stop and troubleshoot per CLAUDE.md "Chrome MCP not responding" — do not use fallback paths for visual work.
