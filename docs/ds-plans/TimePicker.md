# TimePicker build plan

**Phase:** 4
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A time-of-day input with a popover for picking hours/minutes. Used on appointment forms (start time, end time), clinic opening hours, reminder scheduling, and service duration combined with `NumberInput`. Paired with `DatePicker` when a full date+time is needed.

## API

```ts
interface TimePickerProps {
  label?: string;
  value?: string | null;                // "HH:mm" in 24h ("14:30")
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  format?: "12h" | "24h";               // default "12h" (Australian convention is mixed; 12h more common in consumer surfaces)
  step?: 5 | 10 | 15 | 30 | 60;         // minute increments in the picker, default 15
  minTime?: string;                     // "HH:mm"
  maxTime?: string;                     // "HH:mm"
  clearable?: boolean;                  // default true
  placeholder?: string;                 // default "HH:mm"
}
```

Always emits `HH:mm` in 24h (storage-native). Display is formatted per `format` prop.

## What it extends

AntD `TimePicker`. It ships hour/minute/second columns with scroll-to-select, supports 12h/24h formats, keyboard nav, and min/max clamping. Splose wrapper:

- Hides AntD's `seconds` column (we don't need second precision anywhere in Splose).
- Converts between AntD's `dayjs` type and native `HH:mm` strings at the boundary.
- Threads `label`, `error`, `hint` into `FormField`.
- Exposes `step` (AntD calls it `minuteStep`) with a constrained 5/10/15/30/60 union — those are the only values Splose will ever use.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no `.ant-picker-time` returned 0 hits on the pages walked. Likely lives inside modals (new appointment, clinic hours) that weren't opened.

- Confirm during build:
  - `/calendar/week/...` new-appointment modal — start time + end time fields.
  - `/settings/locations` — clinic opening/closing hour fields.
  - `/settings/busy-times` — busy time start/end.
  - `/waitlist` — preferred time-of-day.

## Measurement targets

Measure on build with a modal open. Expected defaults matching `FormInput` and `DatePicker`:

- Trigger height: `32px` (md).
- Border-radius: `8px`.
- Focus border: primary colour.
- Popover: `220px` wide, `240px` tall.
- Columns: 2 (hour + minute) by default, 3 if `format="12h"` (adds AM/PM).
- Column item: `32px` tall, centred text, `label/md` typography.
- Selected item: `var(--color-primary-bg-subtle)` bg, primary text.
- Step dropdown shows every Nth minute (e.g. 15-minute steps show 00 / 15 / 30 / 45).

## Accessibility

- Input has visible label (`FormField`) and `aria-label`.
- Picker popover: `role="listbox"` per column, arrow-key navigation.
- Escape closes and returns focus to the input.
- `aria-invalid` on error.
- Screen reader announces value changes.
- AntD's built-in accessibility is decent but verify keyboard nav works in the popover column (it has regressed in past AntD releases).

## Visual states

- Empty / filled / focused / disabled / error
- 12h format with AM/PM selector
- 24h format (no AM/PM)
- With min/max clamp (disabled rows outside range)
- With step=15 vs step=5
- Popover open

## Stories to build

- **Playground:** args-driven with all props.
- **Feature stories:**
  - `TwelveHour`, `TwentyFourHour`.
  - `WithMinMax` — clinic-hour style clamp.
  - `SteppedMinutes` — step=15 showing sparse rows.
  - `Sizes` — sm/md/lg.
  - `Disabled`, `Error`.
- **Recipe stories:**
  - `AppointmentStartTime` — `// Source: planned /calendar new-appointment modal — start time field`
  - `ClinicOpeningHours` — `// Source: planned /settings/locations — opening/closing hours pair`
  - `BusyTimeStartEnd` — `// Source: planned /settings/busy-times — start and end time inputs`

## MDX docs outline

- H1: TimePicker
- When to use — any time-of-day input.
- When not to use — free-form typing of an approximate time (rare; use `FormInput` only if there's no picker need).
- Variants — 12h vs 24h, step, min/max clamp.
- Composition — paired with `DatePicker` for full datetime, standalone in a modal form.
- Accessibility — label, keyboard nav in picker, error announcement.
- Sizing — matches `FormInput` and `DatePicker` tokens.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production appointment-modal time picker.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least one real consumer migrated (suggest: the new-appointment modal's start time and end time fields).

## Open questions

1. **12h vs 24h default** — Splose customers in AU and NZ tend toward 12h in consumer UIs and 24h in clinical records. Lean **12h default**; expose `format="24h"` escape hatch. Confirm with Jim.
2. **Paired with DatePicker** — no combined `DateTimePicker` component is on the wave. If appointments genuinely want one input, we'd need it. Usually the current design uses two separate inputs, which is fine.
3. **Seconds** — excluded. Confirm no route needs second precision. If any do, reopen.
