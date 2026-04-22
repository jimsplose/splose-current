# Project roadmap — post-Wave-4

Linear order for everything that's scheduled or open in the repo, with the slash command that triggers each step. Dated 2026-04-22, after Wave 4 (`docs/ds-plans/`) closed.

## TL;DR — what to run, in order

```
/ds-migrate            # picks up the next Wave 5 plan automatically (00-Prep first)
/ds-migrate Calendar   # or name the plan — skips the confirmation
/ds-migrate Invoice
/ds-migrate Patient
/ds-migrate Forms
/ds-migrate GlobalShell
/ds-migrate RemainingApp
/ds-migrate Stories
/ds-migrate Cleanup    # final plan — deletes globals.css utility blocks, runs regression sweep, closes audit 27/28
/audit                 # full DS audit re-run as regression check
/deploy                # ship
```

`/ds-migrate` with no argument walks Wave 5 in numeric order (00 → 08). Naming the plan skips the confirmation step.

## Why this order

**Wave 5 plans (`docs/ds-plans-wave5/`) merge two bodies of work into one unified sequence:**

1. **New DS adoption** — real-page consumers for the 25 Wave 4 components (`Tooltip`, `Drawer`, `AppointmentCard`, `PaymentStatusBadge`, `PatientAvatar`, etc.)
2. **Utility-class removal** — replace the ~2000 hand-written `globals.css` utility classes (`text-body-md`, `mb-4`, `flex-1`, etc.) with DS components + `<Flex gap>` + inline `style={{}}` last-resort

Both bodies of work touch the same files. Running them separately means migrating each file twice (one for DS adoption, one for utility removal) with two Chrome MCP verification passes per file. Running them together means one edit, one verification, one commit per surface. Wave 5 is that unified pass.

**Plan ordering:**

- **00-Prep** — baseline counts + ESLint tracking rules (warn mode) + `<Td color>` prop + AiChatPanel CSS module. Mandatory first.
- **01–05** — per-surface (Calendar → Invoice → Patient → Forms → GlobalShell). Each does both DS adoption + utility-class cleanup for its files. Any order within these 5 is acceptable; recommended as listed.
- **06-RemainingApp** — utility-class cleanup on surfaces without a Wave 5 DS-adoption story (dashboard, reports, notes, products, online-booking).
- **07-Stories** — DS stories utility cleanup + per-component MDX docs (24 files). Runs AFTER 01–06 so MDX "Composition" sections cite real shipped consumers.
- **08-Cleanup** — delete `globals.css` utility blocks + Chrome MCP regression sweep (18+ routes) + ESLint rule promote (`warn` → `error`) + close audit backlog sessions 27, 28, and confirm 29. Runs AFTER everything.
- **`/audit` after Plan 08** — full DS audit regression check + seeds the Wave 6 backlog.

## State of things today (2026-04-22)

**Done:**
- `docs/ds-plans/` Wave 4 — all 25 plans (Session0 + 23 components + List enhancement). Every plan `Status: Done`. Deployed on 2026-04-22.
- `docs/ds-audit-fix-backlog.md` sessions 01–26, 26b, 30, 31 — all `done`.

**In the repo, not yet on production consumer paths:**
- 23 new DS components + enhanced List — exported from `@/components/ds`, documented in catalog, zero production imports.
- `<Toaster />` — mounted in `src/app/layout.tsx` but no consumer calls `toast.*` yet.
- `SploseDocHeader` + `parameters.splose` metadata — works in Storybook but only the smoke MDX uses it.

**Open (addressed by Wave 5):**
- ~756 typography utility-class usages across TSX
- ~872 color utility-class usages
- ~425 layout utility-class usages
- ~4 structural utility-class usages (row-hover, hover-underline, ai-*)
- Audit session 27 — `partial` (Wave 5 Plan 08 re-runs Pass 1 counts)
- Audit session 28 — `blocked` (Wave 5 Plan 08 promotes rule to error)
- Audit session 29 — `partial` (Wave 5 Plan 01 closes CalendarView line item)

**Not planned yet (Wave 6+ candidates):**
- `MultiSelect` component (Wave 4 shipped single-select ComboBox only)
- `DateTimePicker` (combined date+time)
- Typed-signature fallback baked into SignaturePad
- HoverCard safe-triangle
- ContextMenu long-press for touch
- AI command suggestions in CommandPalette
- `AvailabilityCard` / `BusyTimeBlock`
- E.164 phone backfill script
- Full DS audit re-run scheduled 2026-07-20

## Commands reference

| Command | When to run | What it does |
|---|---|---|
| `/ds-migrate` | Primary Wave 5 command | Reads `docs/ds-plans-wave5/README.md`, picks next `Planned` plan in numeric order (00 → 08), walks the migration workflow (Chrome MCP dual-tab verification, commit discipline, session log, status flip). Accepts plan name argument (`/ds-migrate Calendar`). |
| `/ds-fix` | Audit backlog | Reads `docs/ds-audit-fix-backlog.md`, picks next `open` session. Currently sessions 27/28 are addressed by Wave 5 Plan 08; run `/ds-fix` only if an audit session reopens or a new audit surfaces one. |
| `/ds-plan` | Wave 4 plans | All 25 plans are `Done`. Command remains available in case a Wave 4 plan reopens as `Partial`. |
| `/audit` | After Plan 08 lands | Full DS audit pass (same shape as the 2026-04-20 baseline). Seeds Wave 6 backlog if new patterns surface. |
| `/fidelity` | Orthogonal to DS work | Production-fidelity gap tracking. Unrelated to this roadmap. |
| `/verify` | Per-page sanity check | Dual-tab comparison for a named route. Usable ad-hoc between Wave 5 plans. |
| `/deploy` | After a milestone | Deploy sub-menu. Per CLAUDE.md, never deploy without Jim's express permission. |

## Do we need one command or multiple?

Kept two active commands (`/ds-migrate` + `/ds-fix`) deliberately:

- **`/ds-migrate`** is planned-forward work. Plans live in numbered files with explicit scope, acceptance criteria, and commit discipline.
- **`/ds-fix`** is audit-discovered work. Sessions come out of an audit pass and are prioritised by leverage × simplicity. Different cadence, different data shape.

Merging them would confuse the mental model. After Plan 08 lands, `/ds-fix` is dormant until the next audit. `/ds-plan` is historical.

For project tracking, use this roadmap + `docs/ds-plans-wave5/README.md` as the source of truth — not TodoWrite (that's per-session working memory).

## If priorities shift

Wave 5 plans are mostly independent within 01–06. Acceptable reshuffles:

- **Run Plan 02 (Invoice) first** after Plan 00 — PaymentStatusBadge is the thinnest migration with highest per-call-site leverage (20+ call sites across invoice + payments surfaces). Good for an early confidence win before tackling the Calendar.
- **Defer Plan 05 (GlobalShell)** — CommandPalette + Breadcrumbs + Tooltip sweep + Skeleton are polish, not "fixing broken UX". Can slip if higher priorities emerge.
- **Run Plan 07 before all of 01–06 lands** — the MDX docs will cite Storybook recipes instead of real consumers. Acceptable if there's urgency on docs; slightly lower quality.
- **DO NOT** run Plan 08 before 00–07 are all Done. It deletes `globals.css` utility blocks; premature deletion breaks every page still using them.

## One-line instructions for the next session

> "Run `/ds-migrate` and work through Wave 5 in numeric order. Ask before deploying after Plan 08, and before running `/audit` afterward."

That's the happy path.
