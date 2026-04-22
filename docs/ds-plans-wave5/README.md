# Wave 5 — DS adoption sweep

Wave 4 (`docs/ds-plans/`) shipped 25 new/enhanced DS components and their Storybook surface. Nothing on production uses them yet. Wave 5 is the adoption sweep that migrates real-page consumers onto the new components and closes the Wave 4 acceptance criteria that were deferred.

## What Wave 5 contains

| # | Plan | Scope summary | Unblocks |
|---|---|---|---|
| 01 | [Calendar.md](01-Calendar.md) | CalendarView + AppointmentSidePanel + toolbar toggles + right-click menu + agenda hover previews | Audit session 29 CalendarView line item |
| 02 | [Invoice.md](02-Invoice.md) | Invoice list + detail + new-invoice + payments + patient invoices tab + aged debtors — PaymentStatusBadge, NumberInput, DatePicker, SignaturePad, ComboBox | — |
| 03 | [Patient.md](03-Patient.md) | Patient list + detail + new-patient + waitlist — PatientAvatar, Tag, enhanced List, DatePicker (DOB), PhoneInput, HoverCard | Session 26 ClientDetailClient follow-up visuals |
| 04 | [Forms.md](04-Forms.md) | Remaining modal/form surfaces — settings/services, tax-rates, locations, busy-times, users, contacts. Destructive confirms → `alertDialog`. Save toasts. All `message.*` / `notification.*` → `toast.*` | — |
| 05 | [GlobalShell.md](05-GlobalShell.md) | Mount CommandPalette + command registry + icon-button Tooltip sweep + Breadcrumbs on deep pages + Skeleton loading states | — |
| 06 | [Docs.md](06-Docs.md) | Per-component MDX pages (one per Wave 4 component, using `SploseDocHeader`) | Storybook becomes the canonical DS reference |

Plans 01–05 are migrations + Chrome MCP verification. Plan 06 is documentation.

## Launch sequence

**Run in numeric order.** Each plan depends on its predecessor only for project-state reasons (fewer merge conflicts, pass-through learnings), not for strict technical dependency. If a later plan is blocked on a surface the earlier one didn't touch, you can run it early.

1. **01-Calendar** — highest visibility. Migrates the most-used page (calendar) and closes audit session 29's CalendarView line item. Also the first time Drawer + AppointmentCard + ContextMenu + HoverCard + SegmentedControl land on a real page — real consumer feedback loop.
2. **02-Invoice** — PaymentStatusBadge is the thinnest, highest-leverage migration (20+ call sites, pure intent-clarity win). NumberInput for currency/qty lands alongside. SignaturePad gets its first real home on Sign & Lock.
3. **03-Patient** — PatientAvatar + Tag across patient + waitlist surfaces. Enhanced List lands on contact + billing blocks.
4. **04-Forms** — broad sweep of modal/form surfaces. Includes the destructive-confirm + save-toast migrations that touch many files but each change is tiny.
5. **05-GlobalShell** — polish layer. CommandPalette, Breadcrumbs, icon-button Tooltips, loading skeletons. Nothing here is "broken" pre-migration; all are UX upgrades.
6. **06-Docs** — last, so every MDX "Composition" section can reference a real shipped consumer instead of a hypothetical.

## How Wave 5 closes the open audit backlog

| Audit session | Status today | How Wave 5 closes it |
|---|---|---|
| 25 (invoice pages → DS Text/DataTable) | `done` but acceptance wasn't strictly met | Verified as part of 02-Invoice when we touch those pages anyway |
| 26 (ClientDetailClient ≤10 inline styles) | `done` (4 remaining) | Reviewed during 03-Patient; likely stays done |
| 27 (Pass 1 re-run, broadened scope) | `partial` — targets unmet | Re-run AFTER Plan 05 lands. Wave 5 migrations drop raw `style={{` counts on every Top-10 file. Then flip to `done` if ≤600 total + ≥90% per-file drops hit. |
| 28 (ESLint rule `warn` → `error`) | `blocked` — 886 warnings | After Plan 05, re-count warnings. If <50, promote the rule; per-file `eslint-disable-next-line` comments for legitimate exceptions. Then flip to `done`. |
| 29 (scope-gap cleanup, 8 files) | `partial` — ESLint 0, CalendarView raw-style still 49 | Plan 01 migrates CalendarView + AppointmentSidePanel, which are sessions 29's biggest line items. After 01 lands + migration counts recomputed, flip 29 to `done` (or spawn 29b for residuals). |

**After Wave 5:** all audit backlog sessions 01–31 should be `done`. Then the backlog is cleared and the repo is ready for Wave 6 (TBD — likely multi-select, advanced data table features, or whatever product priorities dictate).

## Status tracking

Each plan file has a `Status:` line on row 2 (second line of the file) with one of:

- `Planned` — not started
- `In progress` — actively being worked on (at most one Wave 5 plan at a time)
- `Done` — all acceptance criteria met, status flipped, session log entry appended
- `Partial` — scope landed but one or more acceptance criterion deferred; follow-up row describes what's blocked

The `/ds-migrate` slash command walks Wave 5 plans in numeric order and picks the first `Planned` (or `In progress`) one.

## Ground rules for every Wave 5 session

These are the same as Wave 4 but re-stated so each session runs predictably:

1. **DS-first, extend don't bypass.** A Wave 4 component covers the use case, or it doesn't. If you find a missing prop, add it to the DS component; don't inline `<span style={{...}}>`.
2. **Chrome MCP dual-tab measurement is mandatory** for every page migration (see `docs/quality-gate.md` and `docs/reference/measurement-protocol.md`). Production vs localhost on every migrated surface, at 1440×900.
3. **Verification evidence** lives in `.verification-evidence` per the pre-commit hook. Any UI file change requires measurement evidence.
4. **Commit per surface, not per component.** When migrating CalendarView, the AppointmentCard + ContextMenu + HoverCard + SegmentedControl changes commit together because they're one coherent page change. Don't fragment.
5. **Session log entry** per plan, appended to `docs/ds-audit-session-log.md` on completion. Record: files touched, components landed, Chrome MCP results, any blockers.
6. **Status flip** in the plan file last (Planned → In progress at start → Done at end).

## Not in Wave 5 scope

These were raised during Wave 4 but intentionally deferred to Wave 6+:

- **MultiSelect component** — Wave 4 shipped `ComboBox` (single-select). Multi-select tag assignment + practitioner multi-filter need a new DS component.
- **DateTimePicker** — a combined date+time input. Wave 4 shipped `DatePicker` + `TimePicker` as pair; if a real consumer wants one input, file a separate plan.
- **Typed-signature fallback toggle** — Wave 4's `SignaturePad` supports draw mode only; the TypeMode story demos the fallback pattern but it's not baked into the component. Wave 6 candidate.
- **HoverCard safe-triangle** — AntD close-delay is good enough for v1.
- **Context menu long-press on touch** — not implemented in v1; tap on the affordance is the mobile path.
- **AI command suggestions in CommandPalette** — requires a `suggestCommands` async hook; separate plan.
- **New audit re-run** — re-run the 2026-04-20 Pass 1 audit in 3 months (2026-07-20) to measure Wave 4 + Wave 5 impact.
