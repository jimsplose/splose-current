# SegmentedControl build plan

**Phase:** 2
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A horizontal group of mutually exclusive options, sized for 2-4 choices where all options are visible at once. Used for view switchers (Week / Day / Month on calendar), tone toggles (Positive / Neutral / Negative), and filter modes (All / Active / Archived). Different from `Tab` in purpose — `Tab` routes between panels of content, `SegmentedControl` filters the same content in place.

The DS already has `Filter` described as "Segmented control / icon toggle groups" — likely this needs to **merge into** `Filter` or supersede it. See Open questions.

## API

```ts
interface SegmentedControlProps<T extends string = string> {
  options: Array<{
    value: T;
    label: string;
    icon?: ReactNode;
  }>;
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md" | "lg";          // default "md"
  fullWidth?: boolean;                // segments grow to fill container
  disabled?: boolean;
  "aria-label": string;                // required — there's no visible label
}
```

Icon-only mode: pass `icon` and an empty `label`. Either way, a `title` / SR label is derived from the label string; in icon-only mode, `aria-label` on the button carries the option name.

## What it extends

AntD `Segmented`. It handles the classic iOS-style segmented control with a sliding highlight, keyboard left/right arrows, and disabled state. Splose wrapper:

- Normalises the option shape to `{value, label, icon}` (AntD accepts mixed shapes).
- Enforces `aria-label` prop so the control is never label-less.
- Size tokens sm/md/lg matching the rest of the DS.
- Colour tokens match `var(--color-fill-secondary)` for the track and white for the selected segment.

Radix doesn't ship a segmented control. React Aria does (`ToggleButtonGroup`) but AntD is closer to what production looks like — use AntD.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — `.ant-segmented` returned 0 hits on the pages walked. Splose production uses button groups styled similarly to a segmented control for view switching (Week/Day/Month) and filter toggles, but the underlying markup is separate buttons rather than a proper segmented control.

- `https://acme.splose.com/calendar/week/22/4/2026` — top-right "Calendar / Rooms" and "Week / Day / Month" toggles are visually segmented, currently built from secondary Buttons.
- `https://acme.splose.com/waitlist` — filter toggles (All / Active / Archived).
- `https://acme.splose.com/reports/performance` — time range toggle (This week / Month / Quarter).

These are current inline patterns that `SegmentedControl` should replace.

## Measurement targets

Captured informally from calendar — validate during build against real production:

- Track height: `28px` (sm), `32px` (md), `36px` (lg).
- Track bg: `var(--color-fill-secondary)` (`rgba(0, 0, 0, 0.04)`).
- Track padding: `2px`.
- Track border-radius: `8px` outer.
- Segment: transparent default, white bg when selected, `4px` inner border-radius.
- Selected shadow: `0 1px 2px rgba(0, 0, 0, 0.08)`.
- Segment padding: `4px 12px` (md), `2px 10px` (sm), `6px 16px` (lg).
- Typography: `label/md` (14px/500) for selected, `label/md` secondary colour for unselected.
- Animation: 180ms ease on selection slide.

## Accessibility

- Wrapper is `role="radiogroup"` with the passed `aria-label`.
- Each segment is `role="radio"` with `aria-checked` reflecting `value === option.value`.
- Keyboard: Left/Right arrows move selection; Home/End jump to first/last.
- Tab enters and leaves the group (only one tab stop for the whole group).
- Icon-only segments must still have `aria-label` describing the option.

## Visual states

- Default (first option selected)
- Middle option selected
- Last option selected
- Icon-only
- Icon + label
- Full-width
- Disabled
- Sizes sm / md / lg

## Stories to build

- **Playground:** args-driven with options, value, size, fullWidth.
- **Feature stories:**
  - `TwoOption`, `ThreeOption`, `FourOption`.
  - `IconOnly`.
  - `IconPlusLabel`.
  - `FullWidth`.
  - `Disabled`.
  - `Sizes`.
- **Recipe stories:**
  - `CalendarViewSwitcher` — `// Source: acme.splose.com/calendar/week — Week / Day / Month`
  - `CalendarResourceToggle` — `// Source: acme.splose.com/calendar — Calendar / Rooms`
  - `WaitlistStatusFilter` — `// Source: acme.splose.com/waitlist — All / Active / Archived`

## MDX docs outline

- H1: SegmentedControl
- When to use — 2-4 mutually exclusive options, view/filter toggles.
- When not to use — routing between different content (`Tab`), more than 4 options (`FormSelect`), checkbox-style multi-select (`Filter` or `FormCheckbox` group).
- Variants — label only, icon only, icon + label, full-width.
- Composition — top-right of a page header, inside a toolbar, as a filter bar item.
- Accessibility — radiogroup role, arrow-key navigation, required aria-label.
- Sizing — sm for toolbars, md default, lg for modal headers.

## Acceptance criteria

- [ ] Renders at 1440x900 matching the production calendar "Week/Day/Month" toggle.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] Relationship to existing `Filter` component resolved (merge, replace, or document the distinction).
- [ ] At least one real consumer migrated. Suggest: the calendar view switcher — it's the most visible and replaces a complex button group.

## Open questions

1. **Overlap with `Filter`** — the current catalog lists `Filter` as "Segmented control / icon toggle groups". Three options:
   - (a) Delete `Filter`, replace with `SegmentedControl`. Clean but risky if `Filter` has consumers doing something `SegmentedControl` won't.
   - (b) Keep `Filter` as icon-only toggle groups (for calendar filter/settings/grid/map icon row), keep `SegmentedControl` as labelled mutually-exclusive. Documentable.
   - (c) Fold `SegmentedControl` into `Filter` with a new `labelled` mode. Keeps the existing import paths but muddies the API.
   Lean **(b)**. Confirm with Jim.
2. **Calendar switcher migration** — doing this in the same session proves the API, but the calendar is a high-risk surface. If the build session feels tight, ship SegmentedControl + stories only and queue the calendar migration separately.
