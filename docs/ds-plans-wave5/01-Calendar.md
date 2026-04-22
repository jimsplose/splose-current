# Wave 5 · Plan 01 — Calendar surface migration

**Status:** Done
**Estimated effort:** L (largest Wave 5 plan; touches the highest-visibility page)
**Recommended model:** Opus 4.7 (complex page, many inline styles, visual-regression risk)
**Thinking budget:** think hard

## Surface

- `src/app/calendar/CalendarView.tsx` — the calendar week/day view. Today renders inline `_calendarEvent_WaeeuXUs`-class blocks per appointment. 89 `style={{` instances pre-fix; some migrated to Tailwind utilities in session 31; appointment card markup remains inline.
- `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` — right-rail appointment detail. 50 `style={{` instances, bespoke right-rail layout. Open target for `Drawer`.
- `src/app/calendar/*` toolbar — Week/Day/Month + Calendar/Rooms buttons, currently hand-rolled secondary Button groups.
- Calendar empty-slot right-click — today falls back to browser default menu (not a deliberate pattern).
- Calendar appointment hover — today no preview; clicking opens the side panel.

## Migrations

This plan does TWO things in one pass for every file it touches: (1) adopt the new Wave 4 DS components, and (2) remove hand-written utility classes from `globals.css`. Both migrations happen in the same edit per file to avoid double-touch.

### A. DS component adoption

| From | To | Files |
|---|---|---|
| Inline `_calendarEvent_` markup | `AppointmentCard density="compact"` (week/day grid) and `density="expanded"` (agenda list) | CalendarView.tsx |
| Inline right-rail panel | `Drawer side="right" size="lg"` with sticky `footer` action row | AppointmentSidePanel.tsx |
| Week/Day/Month Button group | `SegmentedControl` with `aria-label="Calendar view"` | CalendarView.tsx or wherever the toolbar lives |
| Calendar/Rooms toggle | `SegmentedControl` with `aria-label="Calendar or Rooms view"` | same |
| Browser default right-click | `ContextMenu` on empty slots (New appointment / New busy time / New support activity) | CalendarView.tsx — wrap each slot cell |
| Browser default right-click | `ContextMenu` on existing appointments (Edit / Duplicate / Reschedule / Cancel) | CalendarView.tsx — wrap each AppointmentCard |
| No hover preview | `HoverCard` on agenda rows (show patient + time + service + practitioner) | CalendarView.tsx (agenda view only — skip on tight week-grid cells) |
| No Cmd+K scope | `useRegisterCommands` from Plan 05 adds calendar-specific commands | Deferred to Plan 05; flag the integration points in CalendarView so 05 can wire them |

### B. Utility-class removal on `src/app/calendar/**`

Use the replacement mapping + priority ladder in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference). Applies to every `.tsx` under `src/app/calendar/`.

**Structural classes** in calendar scope: primarily `row-hover` on any table-based agenda views. Confirm via grep before starting.

## Chrome MCP verification

At 1440×900 on both tabs (`acme.splose.com/calendar/week/22/4/2026` vs `localhost:3000/calendar/week/...`):

1. **Appointment card:** colour bar, time string, patient name truncation, service line, status affordances (check / warning dot / strike-through) pixel-match within 2px.
2. **Side panel Drawer:** width 560px (lg), sticky footer action row, close × position, overlay opacity.
3. **View switcher:** SegmentedControl highlight slides smoothly; matches the Week/Day/Month pill look from production.
4. **Right-click menu:** menu opens AT cursor, doesn't get clipped at grid edges, keyboard arrow-down works.
5. **Agenda hover:** preview card appears after ~400ms hover, stays visible when cursor crosses into card, closes 200ms after cursor leaves.

Per `docs/quality-gate.md` — 5-iteration measurement loop. `.verification-evidence` written.

## Acceptance criteria

### DS adoption
- [ ] CalendarView.tsx raw `style={{` count drops from 49 to ≤15 (session 29 target).
- [ ] `_calendarEvent_WaeeuXUs` class no longer in the rendered DOM of `/calendar/week/...`.
- [ ] AppointmentSidePanel.tsx is a thin wrapper over `<Drawer>` (or deleted entirely if Drawer + AppointmentCard cover the use case inline).
- [ ] Week/Day/Month + Calendar/Rooms toggles are `SegmentedControl`.
- [ ] Right-click on an empty calendar slot opens the Splose ContextMenu (not the browser default).
- [ ] Right-click on an appointment opens a menu with Edit/Duplicate/Reschedule/Cancel; existing click behaviour (opens side panel) still works.
- [ ] Agenda row hover reveals a HoverCard with the appointment preview.

### Utility-class cleanup on `src/app/calendar/**`
- [ ] `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' src/app/calendar --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*border-border\|className=.*bg-primary' src/app/calendar --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' src/app/calendar --include='*.tsx'` = 0
- [ ] `grep -rn 'row-hover\|hover-underline-on-row-hover' src/app/calendar --include='*.tsx'` = 0
- [ ] Layout inline ratio (D4 in utility plan terms) ≤10% — most `mb-*` migrations become `<Flex vertical gap>`; inline style only for overflow/max-width/flexShrink/border-b legitimate cases.

### Gate
- [ ] Audit session 29 status: if CalendarView raw-style-count ≤15 AND the 8-file ESLint total stays ≤20, flip session 29 to `done`. Otherwise spawn 29b with the residual.
- [ ] tsc 0 errors, `npx next build` passes, storybook builds.
- [ ] `.verification-evidence` written with production + localhost comparison rows (typography + spacing + color — not just the DS-adoption changes).

## Commit discipline

Commit the calendar migration as one coherent change per surface:

1. One commit for CalendarView grid migration (AppointmentCard adoption + layout cleanup).
2. One commit for AppointmentSidePanel → Drawer.
3. One commit for toolbar SegmentedControl toggles.
4. One commit for ContextMenu wiring (empty slot + appointment card variants in one).
5. One commit for HoverCard on agenda rows.
6. One commit to flip Wave 5 Plan 01 status + append session log + (if applicable) flip audit session 29 to `done`.

If a commit would exceed ~15 files or the diff feels unreviewable, split it further.

## Known pitfalls (from prior sessions)

- CalendarView's grid positioning uses CSS custom properties for row/column spans — **don't** migrate those to Tailwind utilities; they're genuine one-offs for the grid engine.
- AppointmentSidePanel has an existing WIP history (session 29 touched it). Check `git log --oneline -10 src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` before starting.
- Right-click on the calendar currently shows the browser default menu; AntD Dropdown's `preventDefault` in ContextMenu will suppress that. Verify spell-check hasn't been inadvertently disabled anywhere that matters (rich-text inputs on other pages shouldn't be affected because ContextMenu is opt-in per target).
- The `_calendarEvent_WaeeuXUs` class selector is used in some E2E-style queries — grep for it across the repo before deleting the markup.

## Open questions

1. **Availability slots** — look like appointments but semantically different (empty bookable time). Wave 4 flagged `AvailabilityCard` as a separate component; not in AppointmentCard. Migrate availability to a plain styled div for now, or pass `status="scheduled"` with a neutral tone and a "available" label? Suggest the latter until `AvailabilityCard` is planned.
2. **Multi-practitioner columns** — if the calendar shows multiple practitioners as side-by-side columns, each AppointmentCard still renders correctly; confirm on build that column width doesn't squash cards below `compact` density's 44px minimum.
