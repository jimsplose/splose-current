# HoverCard build plan

**Phase:** 4
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A richer-than-tooltip preview that opens on hover and shows formatted content — small avatar, title, secondary line, maybe a link. Used to preview a patient on hover of their name in a list, preview an appointment by hovering its row in the calendar agenda, preview a linked invoice without navigating away. Differs from `Tooltip` in that it may contain images, links, and multi-line formatted content; differs from `Popover` in that it's hover-triggered only.

## API

```ts
interface HoverCardProps {
  children: ReactNode;                 // the trigger
  content: ReactNode;                  // card content
  side?: "top" | "right" | "bottom" | "left";   // default "top"
  align?: "start" | "center" | "end";           // default "center"
  openDelay?: number;                  // ms before open, default 400
  closeDelay?: number;                 // ms before close, default 200
  disabled?: boolean;
}
```

Same shape as `Tooltip` but with longer delays and rich content. Never fires on keyboard focus — hover-only by design, because HoverCard content is always redundant with the link label or a visible affordance.

## What it extends

AntD `Popover` with `trigger="hover"` and `mouseEnterDelay` / `mouseLeaveDelay` (A2 resolution 2026-04-22: stay on AntD). AntD's popover covers the common case — the main gap vs Radix is the "safe triangle" (detecting when the cursor is travelling toward the popover and pausing the close timer). Without it, users who aim at the popover but cross a diagonal momentarily can lose it.

For v1, skip the safe-triangle implementation; the 200ms close delay is enough grace time in practice. If real-world use reveals friction, we revisit — either add a small safe-triangle helper ourselves or reopen the Radix question for this specific component.

Splose wrapper:

- Normalises `placement` → `side`, `mouseEnterDelay` → `openDelay`, `mouseLeaveDelay` → `closeDelay`.
- Forces `trigger="hover"` — no click or focus triggers supported (keyboard users get the link/label directly; see Accessibility section).
- Applies DS tokens for the card shell.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no `.ant-popover` rendered in default state on any page walked. Production does not currently use hover previews as a deliberate pattern.

- Candidate future homes:
  - `/calendar/week/...` agenda view — hover an appointment row to preview without clicking.
  - `/patients` list — hover a patient's name to preview their status tags, last visit, and balance.
  - `/invoices` list — hover a linked client cell to preview that client.
  - Any `DataTable` cell that contains a patient/contact/invoice link.

## Measurement targets

No live sample — design defaults:

- Card: white bg, `1px solid var(--color-border)`, `8px` border-radius.
- Shadow: `0 8px 24px rgba(0, 0, 0, 0.10)`.
- Max-width: `320px`.
- Padding: `12px 16px`.
- Title typography: `body/md-strong` (14px/600).
- Description typography: `body/sm` (12px/400, secondary colour).
- Avatar in card (when applicable): 32px circle, aligned top-left.
- Enter delay: `400ms` (gives time to not fire on accidental hovers).
- Exit delay: `200ms` (grace period to move cursor into the card).
- Safe triangle: Radix handles.
- Animation: 120ms fade + slight translate.

## Accessibility

- AntD Popover renders with `role="tooltip"` by default — this is wrong for hover cards that contain interactive content. Override to `role="group"` via Popover's `rootClassName` + a DOM patch on open, or (cleaner) open a build-session follow-up to upstream a `role` prop to AntD.
- Does NOT fire on keyboard focus — hover-only by design. AntD Popover supports `trigger={['hover', 'focus']}` but we explicitly set `trigger="hover"` only.
- Keyboard users must always have a visible affordance or link to reach the same information.
- Inside the card, links and buttons are keyboard-focusable when the card is open via mouse.
- If the card contains critical info (not just a preview), reconsider — use a `Popover` or inline reveal instead.

## Visual states

- Closed
- Open, default content
- With avatar + title + description
- With a link at the bottom
- Long content (wraps, stays under max-width)
- Different sides (top / right / bottom / left)
- Hover onto the card (stays open)
- Hover away (exit delay fires)

## Stories to build

- **Playground:** args-driven with content, side, align, delays.
- **Feature stories:**
  - `Sides` — four sides.
  - `WithAvatar` — patient preview shape.
  - `WithLink` — card with a "View patient →" link inside.
  - `LongContent` — wrapping and max-width.
  - `DelayControls` — long vs short open/close delays.
- **Recipe stories:**
  - `PatientHoverPreview` — `// Source: planned /patients — hover patient name, show avatar + tags + last visit`
  - `AppointmentAgendaHover` — `// Source: planned /calendar/week — hover agenda row, show appointment details`
  - `InvoiceClientHover` — `// Source: planned /invoices — hover client cell, show client summary`

## MDX docs outline

- H1: HoverCard
- When to use — mouse-user previews that avoid a full navigation.
- When not to use — critical information, keyboard/mobile users, when the content is a single label (use `Tooltip`).
- Variants — sides, with avatar, with link.
- Composition — wrapping a link or avatar, inside a `DataTable` cell, beside a `PatientAvatar`.
- Accessibility — hover-only caveat, mandatory visible affordance for keyboard users.
- Sizing — 320px max-width, single size.

## Acceptance criteria

- [ ] Renders at 1440x900 via Storybook-only verification (no production comparator yet).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] No production migration in this session — HoverCard is new. Adoption follows once Jim picks a first home.

## Open questions

1. **Mobile behaviour** — hover doesn't exist on touch. On touch devices, should HoverCard open on tap (and risk conflict with the underlying link), or not render at all (and fall back to tooltip-style label)? Lean **not render** — touch users reach the same info by tapping the link to navigate.
2. **Keyboard equivalent** — if a HoverCard hides useful info, keyboard users lose it. MDX should mandate that the content in the card is always supplementary, never essential. Document this loudly.
3. **Splose branding** — patient preview HoverCard is a recurring pattern worth designing once. Consider a `PatientHoverCard` convenience wrapper that takes a patient ID and renders the standard preview shape. Lean yes, file as a follow-up to this plan.
4. **Safe triangle** — skipped in v1 (see "What it extends"). Reopen if hover-away friction is reported.
