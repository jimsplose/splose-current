Run the next Wave 5 DS adoption migration from `docs/ds-plans-wave5/`. Read these files first:

1. Read `docs/ds-plans-wave5/README.md` — phase ordering, launch sequence (01 → 06), and how Wave 5 closes the open audit backlog (sessions 27/28/29).
2. Read `docs/ds-audit-fix-backlog.md` — current state of sessions 27 (partial) / 28 (blocked) / 29 (partial). Plan 01 is the biggest single lever for closing session 29.
3. Read `docs/quality-gate.md` — dual-tab Chrome MCP measurement protocol. Every Wave 5 migration MUST verify against production.
4. Read `docs/reference/measurement-protocol.md` — the actual measurement JS snippet + threshold table.
5. Read `docs/agent-block.md` — subagent prompt template if the plan dispatches parallel agents.
6. Read `docs/ds-audit-session-log.md` — prior session outcomes, particularly the W4-ALL entry at the bottom that describes what each Wave 4 component does and where.
7. Read CLAUDE.md "Design System" (extend-don't-bypass), "Chrome MCP Visual Verification", and "Commit Discipline" sections.
8. Read `docs/reference/ds-component-catalog.md` — the canonical API surface for every Wave 4 component you'll be adopting.

**Finding the next plan:**

Status lives on row 2 of each plan file as `**Status:** Planned | In progress | Done | Partial`. The Wave 5 plans are numbered `01-Calendar.md` through `06-Docs.md`. Grep for status with:

```
grep -H "^\*\*Status:\*\*" docs/ds-plans-wave5/*.md
```

The next plan to run is the first `Planned` (or `In progress`) plan in numeric order:

1. `01-Calendar.md` — CalendarView + AppointmentSidePanel + toolbar + right-click + hover previews. Closes audit session 29 CalendarView line item.
2. `02-Invoice.md` — PaymentStatusBadge + NumberInput + SignaturePad + DatePicker + ComboBox across invoice pages.
3. `03-Patient.md` — PatientAvatar + Tag + enhanced List + DatePicker(DOB) + PhoneInput.
4. `04-Forms.md` — settings modals + destructive confirms + save toasts; broad mechanical sweep.
5. `05-GlobalShell.md` — CommandPalette mount, Breadcrumbs, Tooltip sweep on icon buttons, Skeleton loading states.
6. `06-Docs.md` — per-component MDX sweep (24 MDX files). Must run LAST so MDX cites real shipped consumers.

**Pre-start checks:**

- Run `git log --oneline -10` and look for commits (especially WIP auto-saves) that touch files in the target plan's surface. If found, summarise what's already there so you don't redo work.
- Check the plan's `Open questions` section. If any are unresolved and the answer meaningfully changes what you'd ship, surface them to Jim before starting.
- If Plan 06 is requested but any of Plans 01–05 are still `Planned`, stop and tell Jim — MDX must run last to cite real consumers.

**If the user's message already names a specific plan** (e.g. "ds-migrate Calendar", "migrate invoice", "run Wave 5 Patient"):

- Skip the confirmation question — proceed immediately to execution.
- Still show a brief header: plan title, surfaces touched, components being adopted, dependencies on other Wave 5 plans, open questions.
- If the named plan has unmet dependencies (Plan 06 before earlier plans), stop and tell Jim.

**Otherwise** (no plan named — just `/ds-migrate`):

Show Jim the next runnable plan:

- Title + estimated effort
- Surfaces touched (which routes / files)
- Components being adopted
- Dependencies on other Wave 5 plans
- Open questions
- Any files already touched by prior WIP commits

Ask: Run this one? (yes / skip to next / show phase summary)

**On yes (or immediately if a plan was named):**

1. Flip the plan's `Status:` to `In progress`, commit that change.
2. Execute the plan's Migrations table. **DS-first discipline, extend don't bypass.** If a Wave 4 component is missing a prop the migration needs, add the prop to the component — don't inline.
3. Run Chrome MCP dual-tab measurement on every migrated surface per `docs/quality-gate.md`. Produce `.verification-evidence` entries with production vs localhost diff rows.
4. For each page or logical unit, commit as one coherent change. See the plan's "Commit discipline" section for grouping.
5. Run `npx tsc --noEmit` and `npx next build` after the migration lands. Any type or build error blocks the status flip.
6. Run the plan's "Acceptance criteria" checks. Every criterion must pass (or the plan flips to `Partial` with a follow-up row).
7. If the plan's acceptance criteria unblock an audit backlog session (e.g. Plan 01 closes session 29; Plan 05 enables session 27 re-run + session 28 promotion), update `docs/ds-audit-fix-backlog.md` accordingly in the SAME commit block.
8. Commit the changes.
9. Flip the plan's `Status:` to `Done` (or `Partial` with explicit note).
10. Append a one-line entry to `docs/ds-audit-session-log.md`: plan name, date, model used, scope delta (promised vs landed), Chrome MCP results, any blockers.
11. Ask Jim if he wants to run the next Wave 5 plan, run an unblocked audit backlog session (27/28/29), or stop.

If Chrome MCP is unavailable, stop and troubleshoot per CLAUDE.md "Chrome MCP not responding" — do not use fallback paths for visual work.
