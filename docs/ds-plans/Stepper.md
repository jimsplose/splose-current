# Stepper build plan

**Phase:** 2
**Status:** Done
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A numbered progress indicator for multi-step flows — client onboarding, batch invoice creation, NDIS bulk upload, form wizards. Shows which steps are complete, current, upcoming, or errored. Can be horizontal (compact, top of page) or vertical (sidebar-style, detailed descriptions per step).

## API

```ts
interface StepperProps {
  items: Array<{
    id: string;
    label: string;
    description?: string;            // only visible in "vertical" orientation
    status?: "pending" | "current" | "complete" | "error";
    icon?: ReactNode;                // override the default numeric/check icon
    onClick?: () => void;            // lets users jump back to a completed step
  }>;
  orientation?: "horizontal" | "vertical";   // default "horizontal"
  size?: "sm" | "md" | "lg";                 // default "md"
}
```

Status defaults are inferred from position if the consumer passes `current` (an id) instead of per-item statuses:

```ts
interface StepperByCurrentProps {
  items: Array<{ id; label; description? }>;
  current: string;                   // id of the active step
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}
```

Two overloads keep call sites terse for the happy path.

## What it extends

AntD `Steps`. Covers horizontal and vertical, shows numbered/check icons by default, and supports error state. Splose wrapper:

- Names `direction` → `orientation` (matches other Splose components).
- Accepts `current` as an id (AntD takes a zero-based index, which is fragile when steps are conditionally rendered).
- Uses DS `Icon` for the numeric circles so the typography matches Splose tokens.
- Adds the `onClick` per-item escape hatch so consumers can allow back-navigation without building a wrapper.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — `.ant-steps` returned 0 hits on the pages walked (dashboard, calendar, patient detail, invoices, services, reports). Stepper-style UI is **not currently live** in Splose production. The audit called it out as a missing pattern for multi-step flows. Candidate future homes:

- `/invoices/batch-invoice/{id}` — batch invoice creation has a natural "Select clients → Review → Preview → Send" flow.
- `/reports/ndis-bulk-upload/new` — NDIS upload has multiple stages (upload, validate, preview, submit).
- `/patients/new` — patient onboarding could use a stepper if we split personal / contact / billing into stages.
- `/settings/integrations/{id}/setup` — per-integration wizard.

## Measurement targets

No live sample in production — reference AntD Steps defaults and tune against what the build session validates:

- Circle (numeric/check): `24px` (md), `20px` (sm), `32px` (lg).
- Circle bg: `var(--color-primary)` for complete, white with primary border for current, white with border for pending, `var(--color-danger)` for error.
- Icon inside circle: `12px` (sm), `14px` (md), `16px` (lg), white for filled states.
- Connector line: `1px solid var(--color-border)` for pending, `2px solid var(--color-primary)` for complete.
- Label typography: `label/md` (14px/500) current and complete, `label/md` secondary colour pending.
- Description: `caption/md` secondary colour, only visible in vertical.
- Horizontal gap: `32px` minimum between steps.
- Vertical gap: `20px` between steps, connector line filling the gap.

## Accessibility

- Wrapper is `<ol aria-label="Progress">`.
- Each step is `<li>` with `aria-current="step"` on the current item.
- Complete steps announce as "step N of M, complete, {label}"; pending as "step N of M, pending".
- `onClick` entries are `<button>` elements, focusable; pending steps without `onClick` are non-focusable.
- Error state announces the error; consumers should set a meaningful `description` for SR context.

## Visual states

- All pending
- Current + pending
- Mixed: complete, current, pending
- With error state on one step
- Horizontal orientation
- Vertical orientation with descriptions
- Clickable complete steps (focus ring on hover)
- Sizes sm / md / lg

## Stories to build

- **Playground:** args-driven with items, current, orientation, size.
- **Feature stories:**
  - `Horizontal` — default.
  - `Vertical` — with descriptions.
  - `Sizes` — sm/md/lg.
  - `WithError` — middle step errored.
  - `Clickable` — back-nav via `onClick`.
  - `ControlledStatuses` — per-item status mode.
- **Recipe stories:**
  - `BatchInvoiceWizard` — `// Source: planned acme.splose.com/invoices/batch-invoice/new — Select clients → Review → Preview → Send`
  - `NDISBulkUpload` — `// Source: planned acme.splose.com/reports/ndis-bulk-upload/new`
  - `PatientOnboarding` — `// Source: planned — splitting /patients/new into staged form`

## MDX docs outline

- H1: Stepper
- When to use — wizards, multi-stage flows with clear boundaries.
- When not to use — one-page forms (use `FormField` sections), tabs for unrelated content (use `Tab`), progress as a fraction of a single operation (use `ProgressBar`).
- Variants — horizontal, vertical, error state.
- Composition — top of a `FormPage`, inside a `Drawer`, as a sidebar list.
- Accessibility — ordered list semantics, current-step announcement, clickable-step focus order.
- Sizing — horizontal is the default; vertical wins when each step needs a description.

## Acceptance criteria

- [ ] Renders at 1440x900 via Storybook-only verification (no production comparator yet — document this in `.verification-evidence`).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] No production migration in the build session — Stepper is new. Migration queued when the first wizard flow is on deck.

## Open questions

1. **First consumer** — pick one of the candidate flows above to migrate immediately after Stepper lands. Suggest `/invoices/batch-invoice/new` as the highest-visibility use. Jim to confirm priority.
2. **Error state vs warning state** — should there be both? Error is for "this step failed and needs attention", warning for "this step has a caution but can proceed". Lean **error only** for v1; add warning when a real use case surfaces.
