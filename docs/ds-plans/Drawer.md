# Drawer build plan

**Phase:** 2
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A panel that slides in from a screen edge and overlays the main content. Used for side views that shouldn't hijack a full-page navigation — appointment details, client quick-preview, rich filter panels, help sheets. Differs from `Modal` in that a drawer doesn't demand resolution before the user can keep seeing the underlying page; it's a secondary surface.

## API

```ts
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top" | "bottom";   // default "right"
  size?: "sm" | "md" | "lg" | "xl" | number;    // 320 / 400 / 560 / 720; number = px
  title?: string;
  description?: string;
  headerBar?: boolean;                          // adds the muted header tint
  footer?: ReactNode;                           // sticky footer (for action buttons)
  children: ReactNode;
  dismissOnOverlayClick?: boolean;              // default true
  dismissOnEsc?: boolean;                       // default true
}
```

Controlled via `open` / `onClose`. The Splose wrapper owns the overlay, the focus trap, and the header styling — call sites only supply content.

## What it extends

AntD `Drawer`. AntD's focus trap, scroll locking, and portal placement are solid. Splose wrapper:

- Normalises `placement` (AntD terminology) to `side` (Splose terminology, matches `Tooltip`).
- Fixed size tokens instead of AntD's `width`/`height` free-form strings.
- Enforces title/description typography via `Text` components rather than raw AntD strings.
- Optional sticky `footer` slot for action button rows, with top-border separation.

Radix has `@radix-ui/react-dialog` which can render a drawer too; but AntD's drawer sizing and responsive overrides are already dialled in and match the rest of the DS. Keeping AntD.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no drawer is open on the default dashboard, calendar, patient detail, invoices, or services pages. Drawers open via user interaction (e.g. clicking on a calendar event).

- `https://acme.splose.com/calendar/week/22/4/2026` — click an appointment → appointment side panel slides in from the right. Current app implementation: `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` (per audit backlog session 29, 50 inline styles — ripe for DS migration).
- `https://acme.splose.com/patients/446604/notes` — click a note → send-note drawer slides in. Current impl: `src/app/notes/[id]/SendNoteModal.tsx` (38 inline styles, audit session 29).
- `https://acme.splose.com/` — help panel (bottom-right chat bubble) opens a drawer from the right.

## Measurement targets

TBC for drawer chrome; capture during build with the calendar appointment side panel open. Expected from AntD Drawer defaults + Splose tokens:

- Overlay: `rgba(0, 0, 0, 0.45)`.
- Panel background: white.
- Panel border-radius: `0` (flush to screen edge).
- Size tokens: `sm = 320px`, `md = 400px`, `lg = 560px`, `xl = 720px`.
- Header: 56px tall, `1px solid var(--color-border)` bottom, title `heading/md` (16px/600), close icon 20px on right.
- Header bar tint: `var(--color-fill-alter)` when `headerBar={true}`.
- Footer: 64px tall, `1px solid var(--color-border)` top, sticky to bottom of panel.
- Body padding: `20px` by default (match `Card padding="lg"`).
- Animation: 240ms ease-out on open; ease-in on close.

## Accessibility

- `role="dialog"`, `aria-modal="true"` — same as Modal; focus is trapped inside while open.
- `aria-labelledby` points at the title, `aria-describedby` at the description when provided.
- Escape closes (unless `dismissOnEsc={false}`).
- Focus returns to the trigger element on close.
- Body scroll locked while open.
- Announce drawer open/close to SR users via the dialog role (AntD handles).

## Visual states

- Closed (not in DOM)
- Opening (slide-in transition)
- Open (full opacity overlay, panel settled)
- With headerBar tint / without
- With sticky footer / without
- Four sides (right = default, left, top, bottom)
- Four sizes (sm/md/lg/xl)

## Stories to build

- **Playground:** args-driven trigger button + drawer with all props.
- **Feature stories:**
  - `Sides` — four sides side-by-side (trigger buttons opening right/left/top/bottom).
  - `Sizes` — sm/md/lg/xl.
  - `WithHeaderBar` — tinted header.
  - `WithFooter` — sticky action button row.
  - `Nested` — a drawer that opens a `Modal` from inside it (stacking focus trap test).
- **Recipe stories:**
  - `AppointmentSidePanel` — `// Source: acme.splose.com/calendar/week — click appointment → right drawer with appointment details, action buttons in footer`
  - `SendNoteDrawer` — `// Source: acme.splose.com/patients/{id}/notes — "Send" drawer`
  - `FiltersDrawer` — `// Source: planned — report filters drawer from the right`

## MDX docs outline

- H1: Drawer
- When to use — secondary surfaces, side panels, filter trays.
- When not to use — blocking confirmations (use `Modal` or `AlertDialog`), in-page navigation (use a tab).
- Variants — sides, sizes, headerBar, footer.
- Composition — with sticky footer action buttons, with a form inside, nested inside a `Modal`.
- Accessibility — focus trap, escape to close, body scroll lock.
- Sizing — token ladder and when to use a number override.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production calendar appointment side panel.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] One real consumer migrated end-to-end. Suggest: `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` — big inline-style win (50 styles per audit session 29), high-visibility surface.

## Open questions

1. **Overlap with `Modal`** — confirm the distinction. Drawer = slides from edge, doesn't block page resolution. Modal = centred, blocks page until closed. Document in the MDX so the pattern is clear at import-time.
2. **AppointmentSidePanel migration** — this file is in audit session 29's scope (`open`), which plans to apply already-shipped DS components to it. Question: does Drawer land **before** session 29 runs (ideal — session 29 can use the new Drawer), or does session 29 do inline-style cleanup first and Drawer migrates later? If before, sequence this build after session 29 planning.
