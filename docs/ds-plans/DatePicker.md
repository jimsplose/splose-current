# DatePicker build plan

**Phase:** 1
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A single-date input with a calendar popover for picking a day. Used on forms (date of birth, appointment date, invoice date) and filters (report start date). Not a range picker — that's `DateRangeFilter`, which already exists. Not a time-of-day picker — that's `TimePicker`, planned in Phase 4.

## API

```ts
interface DatePickerProps {
  label?: string;                       // when present, wraps in FormField
  value?: Date | null;                  // controlled value
  defaultValue?: Date;
  onChange?: (value: Date | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;                       // FormField error passthrough
  hint?: string;                        // FormField hint passthrough
  placeholder?: string;                 // default "DD/MM/YYYY"
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;   // custom disable predicate
  format?: string;                      // default "DD/MM/YYYY" (Australian locale)
  clearable?: boolean;                  // show × on right, default true
  size?: "sm" | "md" | "lg";            // match FormInput sizes
}
```

Always emits a `Date` (or `null`). Never emits a dayjs / moment instance — AntD leaks these; we hide them.

## What it extends

AntD `DatePicker`. AntD has the best calendar popover in the ecosystem (keyboard nav, week-number, today highlighting, year jumper) and ships with our dep tree. The Splose wrapper:

- Converts between AntD's internal `dayjs` type and native `Date` at the boundary — call sites stay `Date`-native.
- Locks the locale to Australian English (Monday-first week, DD/MM/YYYY).
- Threads `label`, `error`, `hint` into `FormField` so pages don't have to compose the wrapper themselves.
- Exposes only `size: sm | md | lg` to match other Splose form controls, not AntD's `large | middle | small`.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — `.ant-picker` selector returned 1 match on the calendar page (the date-nav picker in the top toolbar) and 0 on `/invoices`. More rich examples show when a filter is expanded on reports; measure during the build.

- `https://acme.splose.com/calendar/week/22/4/2026` — the date in the calendar toolbar is an AntD picker (click the date label to open a calendar).
- `https://acme.splose.com/reports/aged-debtors` — date filter on the report header.
- `https://acme.splose.com/patients/new` — date-of-birth field on the patient form (confirm on build).
- `https://acme.splose.com/invoices/new` — invoice date field on the new-invoice form.

## Measurement targets

TBC for popover chrome; measure during build. Captured 2026-04-22 for the calendar-page picker trigger:

- Trigger height matches `FormInput` — `32px` for `size="md"` (default).
- Trigger border-radius: `8px`.
- Border colour: `var(--color-border)` default, `var(--color-primary)` focus, `var(--color-danger)` error.
- Font: `body/md` (14px/400), `rgb(44, 44, 44)` text.
- Placeholder colour: `var(--color-text-tertiary)`.
- Clear icon: 12px, 8px from right edge, `var(--color-text-secondary)`.

Popover (to measure on build):

- Popover background: white, `1px solid var(--color-border)`, `8px` border-radius, `0 4px 16px rgba(0,0,0,0.08)` shadow.
- Day cell: `32x32`, rounded hover, primary-coloured selected state.
- Today marker: primary ring around cell.

## Accessibility

- Input has visible label (via `FormField`) AND `aria-label` mirroring it for screen readers.
- Calendar popover traps focus when open; `Escape` closes and returns focus to the input.
- Arrow keys move the focused day; `PageUp/PageDown` jumps month; `Home/End` jumps week start/end.
- Disabled dates announce as unselectable.
- Min/max dates enforced by the picker AND on blur (typed entry).
- Radix does not ship a date picker — for accessibility reference, use `react-aria`'s date picker spec or AntD's current behaviour, whichever the build session finds more complete.

## Visual states

- Empty (placeholder visible)
- Filled
- Focused (primary ring)
- Disabled (muted)
- Error (danger border + helper text)
- Open popover
- Clear-on-hover (× revealed)

## Stories to build

- **Playground:** args-driven with label, value, min/max, disabled, error, clearable.
- **Feature stories:**
  - `Empty`, `Filled`, `Disabled`, `Error`.
  - `WithMinMax` — DOB picker clamped to past only.
  - `WithDisabledDates` — weekends disabled.
  - `Sizes` — sm/md/lg side by side.
- **Recipe stories:**
  - `PatientDOB` — `// Source: acme.splose.com/patients/new — DOB field clamped to past`
  - `ReportDateFilter` — `// Source: acme.splose.com/reports/aged-debtors — "As of" date filter`
  - `InvoiceDueDate` — `// Source: acme.splose.com/invoices/new — due date field`

## MDX docs outline

- H1: DatePicker
- When to use — single-date fields on forms and filters.
- When not to use — date ranges (`DateRangeFilter`), date+time (stack with `TimePicker`), quick date nav (use a segmented control).
- Variants — sizes, with/without label, min/max constraints.
- Composition — inside `FormField`, inside a list-page filter row, inside a modal form.
- Accessibility — keyboard nav in popover, disabled-date announcements.
- Sizing — matches `FormInput` height tokens exactly.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production `/calendar/week/...` toolbar picker and at least one other production form picker.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least one real consumer migrated (suggest: `src/app/patients/new/page.tsx` DOB field) — proves the `Date` boundary conversion works.

## Open questions

1. Locale — confirm with Jim that all instances should be AU English (DD/MM/YYYY, Monday-first). If any route needs ISO (YYYY-MM-DD) for system-facing fields, we need a `format="iso"` escape hatch.
2. Time zones — this picker emits a `Date` at local midnight. If we ever need timezone-aware dates (e.g. for appointment slots), the `TimePicker` plan in Phase 4 has to coordinate the combined type. Note for Phase 4.
