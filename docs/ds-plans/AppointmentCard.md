# AppointmentCard build plan

**Phase:** 3
**Status:** Done
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** Calendar.md (if it exists), else n/a

## What it does

A compact card representing a single appointment — used on the calendar (week/day views), on the patient appointments list, and inside the appointment side drawer. Encapsulates the current inline markup (`_calendarEvent_WaeeuXUs` in production) that renders an appointment with colour bar, time, patient name, service, and status. Lifting this into a DS component lets us iterate on appointment visuals without touching the calendar grid code.

## API

```ts
interface AppointmentCardProps {
  time: string;                    // e.g. "9:00 AM - 9:30 AM"
  patientName: string;
  service?: string;                // e.g. "Physio Initial"
  location?: string;
  practitioner?: string;
  status?: "scheduled" | "confirmed" | "completed" | "no-show" | "cancelled";
  tone?: string;                   // hex or token name, defaults from status
  density?: "compact" | "standard" | "expanded";   // compact for week/day grid; expanded for sidebar
  onClick?: () => void;
  onHover?: () => void;            // for HoverCard preview integration (Phase 4)
}
```

The card computes its visual treatment from `status` when `tone` isn't passed (e.g. `cancelled` → red with strike-through). Explicit `tone` wins when the practitioner assigns a colour.

## What it extends

`Card` (DS) with specific composition on top. Structurally:

- Top-of-card colour bar (6px high) — re-uses the measurement captured from production (6px 6px 0 0 border-radius on the inner block).
- Body: time + patient + service stacked with tight leading.
- Status affordances: strike-through for cancelled, check icon for completed, warning dot for no-show.

Under the hood, the DS `Card` already handles the shell (border, shadow, interactive). `AppointmentCard` passes `interactive={true}` when `onClick` is provided, and composes the coloured header bar as a child.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — calendar week view confirmed appointment card markup and key style tokens.

- `https://acme.splose.com/calendar/week/22/4/2026` — one instance per appointment in the grid. Class: `_calendarEvent_WaeeuXUs`.
- `https://acme.splose.com/calendar/day/22/4/2026` — day view shows taller cards, same markup.
- `https://acme.splose.com/patients/446604/appointments` — list view, expanded variant.
- `https://acme.splose.com/clients/{id}/appointments` (via side panel) — inside `AppointmentSidePanel.tsx`.

## Measurement targets

Captured 2026-04-22 from production week view (`_calendarEvent_WaeeuXUs`):

- Outer border-radius: `2px` (cell is flush with grid).
- Outer padding: `0`.
- Font: `12px` / `15px` line-height / `400`.
- Text colour: `rgb(255, 255, 255)` (white).
- Inner block border-radius: `6px 6px 0 0` (rounded top, flush bottom to cell edge).
- Cell is coloured on the inner block; outer wrapper is transparent.
- Colour bar source: practitioner colour (fallback: service colour → status colour → brand primary).

Further tokens to resolve during build (expanded / standard densities, status overlays):

- Compact density: one-line time + name, 44px tall minimum.
- Standard density: two lines (time / patient + service), 56px tall.
- Expanded density: three lines (time / patient / service + location), 78px tall.
- Cancelled strike-through: 1px line through patient name, 50% text opacity.
- Completed check icon: 12px, positioned top-right of card.
- No-show warning dot: 8px yellow dot, top-right.

## Accessibility

- Renders as `<button type="button">` when `onClick` is passed, otherwise `<article>`.
- `aria-label` includes patient name, service, and time for SR readability.
- Status announced as part of the label (e.g. "Harry Nguyen, Physio Initial, 9am to 9:30am, cancelled").
- Colour contrast — since the card is coloured by practitioner, text is always white; contrast ratio is 4.5:1 against any hue in the Splose palette. Reject a user-chosen colour that fails contrast (backend validation, separate task).
- Focus ring: primary colour 2px ring outside the card, keyboard-only (`:focus-visible`).

## Visual states

- Compact / standard / expanded density
- Scheduled / confirmed / completed / no-show / cancelled
- With practitioner colour / inherited from status
- Hover (slight shadow lift)
- Focused (ring)
- Pressed (active, slight darken)
- Stacked appointments (overlapping start times) — not part of the component, but document the contract for how calendar positioning wraps the card

## Stories to build

- **Playground:** args-driven with all props.
- **Feature stories:**
  - `Compact`, `Standard`, `Expanded` — one per density.
  - `StatusScheduled`, `StatusConfirmed`, `StatusCompleted`, `StatusNoShow`, `StatusCancelled`.
  - `PractitionerColour` — explicit tone override.
  - `Interactive` — onClick wiring with focus ring.
- **Recipe stories:**
  - `WeekViewGrid` — `// Source: acme.splose.com/calendar/week/22/4/2026 — 5 cards tiled in a day column`
  - `DayViewHour` — `// Source: acme.splose.com/calendar/day — stacked appointments in a single hour slot`
  - `PatientAppointmentList` — `// Source: acme.splose.com/patients/446604/appointments — vertical list of expanded cards`

## MDX docs outline

- H1: AppointmentCard
- When to use — any place that renders a single appointment.
- When not to use — availability slots (different concept; might need an `AvailabilityCard` later), busy-time blocks (stylistically distinct, use `BusyTimeBlock` — not yet planned).
- Variants — densities, statuses, tone override.
- Composition — inside `CalendarView`, inside `AppointmentSidePanel`, inside patient detail appointments tab.
- Accessibility — button vs article, aria-label pattern.
- Sizing — density maps to layout context; don't override height directly.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production calendar week-view card.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least one real consumer migrated. Suggest: `src/app/calendar/CalendarView.tsx` — audit session 29 also needs this file (89 inline styles); lifting the card out is the highest-leverage part of that cleanup.

## Open questions

1. ~~**CalendarView migration**~~ — **Resolved 2026-04-22 (C1): AppointmentCard lands first; audit session 29 waits.** Sequence this build **before** session 29 so session 29 can migrate `CalendarView.tsx` onto the new AppointmentCard in one pass.
2. **Availability vs Appointment** — availability slots look similar but mean something different. Confirm with Jim whether they share this component (with an `empty` status) or deserve their own. Lean **separate component** for clarity.
3. **Practitioner colour source** — the data model stores a practitioner colour already. `AppointmentCard` should accept the hex directly, not look it up. Confirm the component never fetches and that the parent always resolves the tone.
