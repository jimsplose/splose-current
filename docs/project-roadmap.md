# Project roadmap — post-Wave-4

Linear order for everything that's scheduled or open in the repo, with the slash command that triggers each step. Dated 2026-04-22, after Wave 4 (`docs/ds-plans/`) closed.

## TL;DR — what to run, in order

```
/ds-migrate Calendar            # Plan 01 — biggest visible win; closes audit 29
/ds-migrate Invoice             # Plan 02 — PaymentStatusBadge sweep, invoice adoption
/ds-migrate Patient             # Plan 03 — PatientAvatar + Tag + List
/ds-migrate Forms               # Plan 04 — modals + destructive confirms + toast
/ds-migrate GlobalShell         # Plan 05 — CommandPalette, Breadcrumbs, Tooltips, Skeleton
/ds-fix                         # re-run session 27 Pass 1 counts; flip to done if targets hit
/ds-fix                         # unblock + run session 28 (ESLint rule flip) if warnings <50
/ds-migrate Docs                # Plan 06 — per-component MDX sweep (runs LAST on purpose)
/audit                          # full DS audit re-run once all of Wave 5 lands (regression check)
/deploy                         # ship
```

You can kick `/ds-migrate` with no argument and it picks up the next `Planned` plan automatically. Naming the plan (`/ds-migrate Calendar`) skips the confirmation step.

## Why this order

**Wave 5 plans (`docs/ds-plans-wave5/`) are the real-page consumer migrations that Wave 4 deferred.** Each plan is a coherent page-surface migration, not one component at a time. See `docs/ds-plans-wave5/README.md` for phase ordering rationale.

**Audit backlog sessions 27 and 28 slot between Plans 05 and 06** because:

- Session 27 re-runs Pass 1 raw-style counts across `src/app` + `src/components`. Wave 5 migrations dramatically reduce inline styles (AppointmentCard replaces 89 on CalendarView, PaymentStatusBadge replaces 20+ across invoice surfaces, etc.). After Plan 05 lands, the total raw `style={{` count should drop under 600 and every Top-10 file should hit ≥90% drop. Then session 27 flips to `done`.
- Session 28 promotes the `no-restricted-syntax` ESLint rule from `warn` to `error`. It's currently blocked on 886 warnings. Wave 5 should drop warnings under 50. Promote the rule + add per-file `eslint-disable-next-line` for legitimate exceptions.

**Plan 06 (MDX docs) runs LAST** because every MDX "Composition" section should cite a real shipped consumer, not a hypothetical one. Running it before the migrations means the examples are inferred from Storybook recipes; running it after means they reference actual production code.

**Audit (`/audit`) runs after all of Wave 5** as a regression check — full DS audit to prove the Wave 4 + Wave 5 effort delivered what the 2026-04-20 audit flagged. Also seeds the Wave 6 backlog if new patterns surface.

## State of things today (2026-04-22)

**Done:**
- `docs/ds-plans/` Wave 4 — all 25 plans (Session0 + 23 components + List enhancement). Every plan `Status: Done`. Components built + exported + Storybook stories shipped. Deployed via `gh workflow run deploy.yml --ref main` on 2026-04-22.
- `docs/ds-audit-fix-backlog.md` sessions 01–26, 26b, 30, 31 — all `done`.
- `docs/ds-audit-session-log.md` — full history including W4-P0 and W4-ALL entries.

**In the repo, not yet on production consumer paths:**
- 23 new DS components + enhanced List — exported from `@/components/ds`, documented in catalog, zero production imports.
- `<Toaster />` — mounted in `src/app/layout.tsx` but no consumer calls `toast.*` yet.
- `SploseDocHeader` + `parameters.splose` metadata — works in Storybook but only the smoke MDX uses it.

**Open audit backlog:**
- Session 27 — `partial`. Re-run Pass 1 after Wave 5 Plans 01–05.
- Session 28 — `blocked`. Needs warning count <50 first (Wave 5 should deliver this).
- Session 29 — `partial`. CalendarView is the biggest line item; Plan 01 addresses it.

**Not planned yet (Wave 6+ backlog candidates):**
- `MultiSelect` component (Wave 4 shipped single-select ComboBox only).
- `DateTimePicker` (combined date+time) if a real consumer needs one input.
- Typed-signature fallback baked into SignaturePad.
- HoverCard safe-triangle (AntD close-delay is adequate for v1).
- ContextMenu long-press for touch.
- AI command suggestions in CommandPalette (`suggestCommands` hook).
- `AvailabilityCard` (distinct from AppointmentCard — empty bookable slot).
- `BusyTimeBlock` (calendar overlay for busy time — distinct from appointment).
- E.164 phone backfill script for existing records.
- Full DS audit re-run scheduled 2026-07-20 (3 months post-baseline).

## Commands reference

| Command | When to run | What it does |
|---|---|---|
| `/ds-migrate` | Next Wave 5 plan | Reads `docs/ds-plans-wave5/README.md`, picks next `Planned` plan in numeric order, walks the migration workflow (Chrome MCP dual-tab verification, commit discipline, session log, status flip). Accepts a name argument (`/ds-migrate Calendar`). |
| `/ds-fix` | Open audit backlog | Reads `docs/ds-audit-fix-backlog.md`, picks next `open` session. Use after Plan 05 lands to re-run sessions 27 + 28. |
| `/ds-plan` | Wave 4 plans (all done) | Reads `docs/ds-plans/`. No-op now that Wave 4 is complete, but the command still works if Jim reopens a plan as Partial. |
| `/audit` | After Wave 5 complete | Full DS audit pass (the 2026-04-20 process). Seeds the Wave 6 backlog if new patterns surface. |
| `/fidelity` | Orthogonal to DS work | Production-fidelity gap tracking. Unrelated to this roadmap. |
| `/verify` | Per-page sanity check | Dual-tab comparison for a named route. Can be used ad-hoc between Wave 5 plans. |
| `/deploy` | After a milestone | Shows the deploy sub-menu. Per CLAUDE.md, never deploy without Jim's express permission. |

## If priorities shift

The Wave 5 plans are self-contained. You can reshuffle order if there's a business reason:

- Running Plan 02 (Invoice) first is fine — PaymentStatusBadge is the thinnest migration and the lowest-risk. Good choice if you want a confidence win before the Calendar work.
- Skipping Plan 05 (GlobalShell) and going straight to Plan 06 (MDX docs) leaves CommandPalette unmounted and no Breadcrumbs in production — MDX can still reference Plans 01–04 consumers, but the "Composition" sections for CommandPalette / Breadcrumbs / Skeleton / Tooltip will be hypothetical. Acceptable if there's urgency on docs.
- Running audit sessions 27 + 28 before all Wave 5 plans is fine but the targets won't be met. Save them until after Plan 05 or you'll just be flipping them back to `Partial` repeatedly.

## One-line instructions for the next session

> "Run `/ds-migrate` and work through Wave 5 in order, then run `/ds-fix` twice to close out audit sessions 27 and 28, then run `/ds-migrate Docs` last, then run `/audit` to regression-check the whole DS. Ask before deploying."

That's the happy path.
