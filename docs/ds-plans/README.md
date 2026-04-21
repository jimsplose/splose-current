# DS Plans — Wave 4

Implementation plans for the 24 new Design System components queued after the 2026-04-20 audit backlog. One plan per component. Each plan is a self-contained brief for a future build session — Jim kicks these off one at a time.

## How to use

1. Pick a plan with status `Planned` that has no open questions.
2. Open a fresh Claude Code session, paste the plan file into the prompt, and run the build.
3. Before shipping, the build must satisfy the acceptance criteria at the bottom of the plan.
4. Flip the plan's `Status` to `In progress`, then `Done` when landed.

## Phases

Phases reflect delivery ordering, not dependency. A plan in Phase 2 does not depend on Phase 1 plans being complete unless its body says so. Phases group components by a rough "fix the biggest gaps first" rationale.

| Phase | Components | Rationale |
|---|---|---|
| 1 | Tooltip, Skeleton, Toast, DatePicker, DescriptionList, NumberInput | Everyday primitives that unblock the broadest set of pages. |
| 2 | Drawer, AlertDialog, Accordion, Tag, Breadcrumbs, Stepper, SegmentedControl, PhoneInput | Secondary primitives for mid-complexity flows (forms, overlays, navigation). |
| 3 | AppointmentCard, PatientAvatar, PaymentStatusBadge, Sparkline | Splose-specific compositions that lift recurring inline patterns into named components. |
| 4 | CommandPalette, HoverCard, ContextMenu, SignaturePad, TimePicker, ComboBox | Higher-fidelity or lower-frequency components; save for last. |

## Baseline

These plans assume the post-backlog baseline described in `docs/ds-audit-fix-backlog.md`. New components landed: `Icon`, `FeatureCard`, `ProgressBar`. Extended components: `Text` (weight, `page-title`, `heading/xl`, `color="inverted"`), `Button` (`shape="pill"`, `variant="link"`, `iconOnly`, `shape="circle"`), `Card` (`tint`, `interactive`, `variant="dashed"`, `description`), `Badge` (`size`), `ColorDot` (`shape`, `interactive`, `selected`, `label`), `Divider` (`orientation="vertical"`), `HintIcon` (`tone`, `size`). Deleted: `IconText`, `Section`, `Status`, `OnOffBadge`.

## Session 22 snapshot

At planning time, sessions 01–24 in the audit backlog are `done`. Sessions 25–30 are `open` — those are cleanup, verification, and ESLint promotion, not new DS API. Plans that depend on components shipped in sessions 25–30 call this out explicitly in their `Open questions`.
