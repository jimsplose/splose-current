# Tooltip build plan

**Phase:** 1
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A lightweight label overlay that appears on hover or focus of a trigger element, describing what the trigger does. Used for icon-only buttons, truncated text, and abbreviations where the meaning isn't obvious from the visual alone. Not for long-form help content — that's what `HintIcon` is for.

## API

```ts
interface TooltipProps {
  children: ReactNode;                 // trigger element (cloned with handlers)
  content: ReactNode;                  // label text or small node
  side?: "top" | "right" | "bottom" | "left";   // default "top"
  align?: "start" | "center" | "end";           // default "center"
  delay?: number;                      // ms before showing on hover, default 200
  disabled?: boolean;                  // suppress even on hover
}
```

No `open`/`onOpenChange` — if a consumer needs controlled open state, they should reach for Radix directly. Keep the DS API closed for the common case.

## What it extends

AntD `Tooltip`. AntD's API already covers placement, open delay, disabled, and trigger types. Splose wrapper strips the AntD-only props we don't want exposed (`arrow`, `color`, `fresh`, `getPopupContainer`) and renames `title` → `content` so the prop signature matches the Radix mental model most React engineers carry.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — tooltips are not visible in the default (non-hover) state, so no live RGB values were captured. Use AntD defaults as the reference and tune against production on hover during the build session.

- `https://acme.splose.com/patients/446604/details` — hover any icon button in the detail page header to see the native AntD tooltip in action.
- `https://acme.splose.com/calendar/week/{d}/{m}/{y}` — calendar toolbar icon buttons show AntD tooltips on hover (filter, settings).
- `https://acme.splose.com/invoices` — row action icons in the invoices table.

## Measurement targets

TBC — capture during build by hovering over the first production icon button with a tooltip, then running the measurement snippet against the visible `.ant-tooltip-inner` node. Expected ballpark from AntD defaults:

- Background: dark (≈ `rgba(0, 0, 0, 0.85)`)
- Text: white, `12px`, `400`
- Padding: `6px 8px`
- Border-radius: `6px`
- Arrow: 8px, matching background
- Delay: 200ms enter, 0ms exit

## Accessibility

- Role: `tooltip` on the floater, `aria-describedby` wire-up on the trigger.
- Triggered by hover AND focus. Keyboard-only users must see the label.
- Escape closes an open tooltip.
- Not for critical interactions — tooltips are supplementary, not primary. If the label is the only way a user learns what a button does, the button also needs a visible text label for touch/mobile users.
- Radix `@radix-ui/react-tooltip` is the accessibility reference — AntD's behaviour mostly matches but check focus-open behaviour during the build.

## Visual states

- Hidden (default)
- Open — from hover, after delay
- Open — from keyboard focus, immediate
- Closing (fade-out)
- Disabled — no open state

## Stories to build

- **Playground:** args-driven, single trigger button with editable `content`, `side`, `align`, `delay`.
- **Feature stories:**
  - `Sides` — one tooltip per side (top/right/bottom/left).
  - `Aligns` — start/center/end for a single side.
  - `OnIconButton` — the most common consumer (icon-only Button).
  - `OnTruncatedText` — multi-line text that's been truncated with ellipsis.
  - `DisabledTrigger` — confirm tooltip still shows on a disabled Button wrapper (known Radix/AntD quirk — tooltips don't fire on `disabled` natively; wrap in a span).
- **Recipe stories:**
  - `CalendarToolbarIconTooltips` — `// Source: acme.splose.com/calendar/week — filter/settings/map icon buttons`
  - `TableRowActionTooltips` — `// Source: acme.splose.com/invoices — row action icons`

## MDX docs outline

- H1: Tooltip
- When to use — icon-only buttons, truncated text, abbreviation expansion.
- When not to use — long help copy (use `HintIcon`), critical instructions (make them visible), mobile-primary interactions.
- Variants — sides, aligns.
- Composition — with `Button variant="icon"`, with truncated `Text`, with AntD icons.
- Accessibility — keyboard triggering, focus behaviour, tooltip vs label distinction.
- Sizing — single-line vs two-line wrapping.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production AntD tooltip (hover a calendar icon button on both tabs and measure against the reference pages above).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] Status flipped from `planned` to `beta` in splose story metadata (once that metadata contract exists — see Open questions).

## Open questions

1. The planning prompt references placeholder stories in `src/components/ds/stories/planned/` and a metadata contract at `src/components/ds/stories/_docs/splose-types.ts`. Neither file exists yet. Either Jim stands up the placeholder infrastructure first, or the build session treats the splose metadata contract as a separate, deferred step.
2. Do we want a `.tooltip-trigger` helper class or small wrapper to handle the "trigger is a `disabled` button" edge case centrally, so call sites don't each wrap in a span? Suggest resolving during the build.
