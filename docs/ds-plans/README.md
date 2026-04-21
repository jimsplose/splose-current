# DS Plans — Wave 4

Implementation plans for the 23 new Design System components and 1 existing-component upgrade queued after the 2026-04-20 audit backlog. One plan per component. Each plan is a self-contained brief for a future build session — Jim kicks these off one at a time.

## How to use

1. Pick a plan with status `Planned` that has no open questions.
2. Open a fresh Claude Code session, paste the plan file into the prompt, and run the build.
3. Before shipping, the build must satisfy the acceptance criteria at the bottom of the plan.
4. Flip the plan's `Status` to `In progress`, then `Done` when landed.

## Phases

Phases reflect delivery ordering, not dependency. A plan in Phase 2 does not depend on Phase 1 plans being complete unless its body says so. Phases group components by a rough "fix the biggest gaps first" rationale.

| Phase | Components | Rationale |
|---|---|---|
| 0 | **Session0-StoryMetadata** | Precursor session: creates `_docs/splose-types.ts`, `SploseDocHeader`, and 24 placeholder stories that all Wave 4 builds reference. Run before any component build. |
| 1 | Tooltip, Skeleton, Toast, DatePicker, ListEnhancement, NumberInput | Everyday primitives that unblock the broadest set of pages. |
| 2 | Drawer, AlertDialog, Accordion, Tag, Breadcrumbs, Stepper, SegmentedControl, PhoneInput | Secondary primitives for mid-complexity flows (forms, overlays, navigation). |
| 3 | AppointmentCard, PatientAvatar, PaymentStatusBadge, Sparkline | Splose-specific compositions that lift recurring inline patterns into named components. |
| 4 | CommandPalette, HoverCard, ContextMenu, SignaturePad, TimePicker, ComboBox | Higher-fidelity or lower-frequency components; save for last. |

## Resolved decisions (2026-04-22)

| # | Decision | Resolution |
|---|---|---|
| A1 | Splose story metadata infrastructure | Stand up as Wave 4 Phase 0 before any component build. See [Session0-StoryMetadata.md](Session0-StoryMetadata.md). |
| A2 | Radix adoption as a first-class DS dep | **No.** Stay on AntD across the DS. AlertDialog, Accordion, HoverCard, ContextMenu all extend AntD primitives. |
| A3 | Dep budget | Approve sonner, cmdk, signature_pad, Downshift. Cap `react-phone-number-input` to `libphonenumber-js/min` (~40KB). |
| B1 | DescriptionList vs List | Upgrade `List` in place with `<dl>` semantics + hint + editable. Drop the separate DescriptionList component. See [ListEnhancement.md](ListEnhancement.md). |
| B2 | Accordion vs Collapse | Upgrade Collapse in place, rename the export to `Accordion`, keep `Collapse` as a deprecated alias. |
| B3 | Tag vs Badge | Ship `Tag` as a separate component. |
| B4 | SegmentedControl vs Filter | Keep both. `Filter` = icon-only toggle groups. `SegmentedControl` = labelled mutually-exclusive. MDX documents the rule. |
| C1 | Drawer + AppointmentCard vs audit session 29 | Delay audit session 29 until both plans ship. Session 29 then migrates `AppointmentSidePanel.tsx` and `CalendarView.tsx` onto the new primitives in one pass. |
| D1 | Toast corner | `bottom-right`. |
| D2 | CommandPalette registry | Hybrid: static `src/commands/index.ts` for globals + `useRegisterCommands` hook for per-route scope. |
| D3 | ContextMenu on calendar slot | Right-click opens a power-user alternative; existing click popover stays. |
| D4 | ComboBox base library | Downshift. |

## Wave 4 launch sequence

1. **Phase 0** — Run Session0-StoryMetadata.md. Mandatory precursor.
2. **Phase 1** — Tooltip → Skeleton → Toast → DatePicker → ListEnhancement → NumberInput. Order flexible within the phase.
3. **Phase 2** — Drawer **before** AppointmentCard; AppointmentCard **before** audit backlog session 29. Within Phase 2 the rest can run in any order.
4. **Phase 3** — After Drawer and AppointmentCard land, audit backlog session 29 can resume; the rest of Phase 3 runs in parallel.
5. **Phase 4** — Last, once the rest of the DS is stable.

## Baseline

These plans assume the post-backlog baseline described in `docs/ds-audit-fix-backlog.md`. New components landed: `Icon`, `FeatureCard`, `ProgressBar`. Extended components: `Text` (weight, `page-title`, `heading/xl`, `color="inverted"`), `Button` (`shape="pill"`, `variant="link"`, `iconOnly`, `shape="circle"`), `Card` (`tint`, `interactive`, `variant="dashed"`, `description`), `Badge` (`size`), `ColorDot` (`shape`, `interactive`, `selected`, `label`), `Divider` (`orientation="vertical"`), `HintIcon` (`tone`, `size`). Deleted: `IconText`, `Section`, `Status`, `OnOffBadge`.

## Session 22 snapshot

At planning time, sessions 01–24 in the audit backlog are `done`. Sessions 25–30 are `open` — those are cleanup, verification, and ESLint promotion, not new DS API. Plans that depend on components shipped in sessions 25–30 call this out explicitly in their `Open questions`.
