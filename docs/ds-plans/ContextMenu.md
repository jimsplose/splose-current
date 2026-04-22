# ContextMenu build plan

**Phase:** 4
**Status:** Done
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A menu that opens on right-click (or long-press on touch) of a target element, offering actions contextual to the thing clicked. Used on calendar slots (right-click empty slot → "New appointment" / "New busy time"), on DataTable rows (right-click row → "Edit" / "Duplicate" / "Delete"), on notes (right-click → "Mark as final" / "Duplicate" / "Delete"). Distinct from `Dropdown` which is triggered by clicking an explicit "…" button.

## API

```ts
interface ContextMenuProps {
  children: ReactNode;                 // the target element that accepts right-clicks
  items: ContextMenuItem[];
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string[];                 // e.g. ["Cmd", "D"]
  tone?: "default" | "danger";
  disabled?: boolean;
  onSelect: () => void;
  divider?: boolean;                   // render a divider AFTER this row
  submenu?: ContextMenuItem[];         // nested submenu
}
```

Items that need a section header can use a synthetic `{ label, heading: true }` entry — keeps the items array flat.

## What it extends

AntD `Dropdown` with `trigger={['contextMenu']}` (A2 resolution 2026-04-22: stay on AntD). AntD's right-click trigger is wired; keyboard nav inside the opened menu works via the standard `Menu` component underneath. Splose wrapper:

- Forces `trigger={['contextMenu']}`.
- Normalises the menu items to the `ContextMenuItem` shape above (AntD's `MenuProps['items']` is close but has additional noise).
- Wraps the trigger in a `<span>` that binds `oncontextmenu={(e) => e.preventDefault()}` to suppress the browser's native context menu — but with an escape hatch (`preserveBrowserMenu={true}`) for rich-text areas that need the browser's spell-check.
- Applies DS tokens for the menu card chrome.

Long-press on touch is **not** supported natively by AntD Dropdown. Add a small `onTouchStart` / `setTimeout` wrapper in the Splose component that fires `contextmenu` after ~500ms. If this feels hacky during build, accept that v1 is desktop-right-click only; queue a native long-press implementation as a follow-up.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — right-click behaviour wasn't testable during the walk. Splose production currently shows browser-default context menus on right-click in most places, which is not a desirable pattern for an app.

- Candidate homes:
  - `/calendar/week/...` — right-click empty slot → quick-create menu (appointment / busy time / support activity).
  - `/calendar/week/...` — right-click existing appointment → edit / duplicate / cancel.
  - `/patients` DataTable — right-click row → edit / archive / view invoices.
  - `/notes/{id}/edit` — right-click selection in the editor → format options (already partly handled by rich-text toolbar; consider scope).

## Measurement targets

No live sample — design defaults (match Radix + DS tokens):

- Card: white bg, `1px solid var(--color-border)`, `8px` border-radius, `0 8px 24px rgba(0,0,0,0.10)` shadow.
- Min-width: `200px`, max-width: `320px`.
- Item height: `36px`, padding `8px 12px`.
- Item typography: `body/md` (14px/400).
- Icon: 16px, 12px gap to label.
- Shortcut: secondary colour, right-aligned, `12px` font.
- Divider: `1px solid var(--color-border)`, `4px 0` margin.
- Danger item: `var(--color-danger)` text, light-red hover.
- Submenu indicator: chevron-right icon, 12px, secondary colour.
- Submenu: opens at `Esc` safe distance, `4px` overlap with parent for easier hover traversal.
- Animation: 100ms fade + 4px slide-in from target position.

## Accessibility

- AntD Menu renders items with `role="menuitem"` inside a `role="menu"` container. Confirm during build.
- Arrow Down/Up navigates items; Enter invokes; Escape closes (AntD default). Arrow Right to open submenu works for nested menus.
- Typeahead is **not** in AntD Menu by default — add a small key handler that jumps to the first matching item by first letter. Validate during build whether this is worth the effort or whether typeahead can wait for a Wave 5 follow-up.
- Disabled items are not focusable and announce as unavailable (AntD default).
- Focus returns to the trigger target on close — verify; AntD has been inconsistent here. Patch via `onOpenChange` if needed.

## Visual states

- Closed
- Open at cursor position
- With icons
- With shortcut chips
- With danger item
- With divider between sections
- With submenu
- Disabled item
- Keyboard-focused item (highlight)
- Mobile long-press open

## Stories to build

- **Playground:** args-driven wrapping a large `<div>` target.
- **Feature stories:**
  - `Basic` — three-item menu.
  - `WithIcons` — icon column.
  - `WithShortcuts` — shortcut chips.
  - `WithDanger` — one destructive item at the bottom.
  - `WithSubmenu` — one item with a two-item submenu.
  - `Disabled` — one item disabled, rest clickable.
  - `LongPress` — mobile long-press mode (check manually on a phone).
- **Recipe stories:**
  - `CalendarSlotContextMenu` — `// Source: planned /calendar/week — right-click empty slot`
  - `CalendarAppointmentContextMenu` — `// Source: planned /calendar/week — right-click existing appointment`
  - `DataTableRowContextMenu` — `// Source: planned /patients — right-click table row`

## MDX docs outline

- H1: ContextMenu
- When to use — right-click-discoverable actions, calendar slot actions, DataTable row actions.
- When not to use — primary actions (keep a visible button), mobile-first flows (long-press is not discoverable).
- Variants — basic, with icons, with submenu, with danger item.
- Composition — wrapping a calendar slot, wrapping a DataTable row, wrapping a list item.
- Accessibility — right-click binding, arrow-key nav, typeahead.
- Sizing — single size, content-driven width.

## Acceptance criteria

- [ ] Renders at 1440x900 via Storybook-only verification.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] No new dep — AntD Dropdown is the base.
- [ ] One real consumer integration proved — suggest: calendar empty-slot context menu, **preserving** the existing click popover (D3 resolution: right-click is a power-user alternative, not a replacement).

## Open questions

1. ~~**Calendar interaction overlap**~~ — **Resolved 2026-04-22 (D3): ContextMenu is a right-click alternative for power users; click popover stays.**
2. **Browser default menu coexistence** — AntD Dropdown + `preventDefault` suppresses the browser's context menu for bound targets. Ensure rich-text areas (the note editor) pass `preserveBrowserMenu={true}` so spell-check keeps working.
3. **Mobile long-press** — long-press UX is discoverable only if there's a visible hint. For v1, show a "..." button fallback beside long-press-enabled targets. Out of scope for this plan but flag as follow-up.
4. **Typeahead** — AntD Menu doesn't have it by default. Decide during build whether to add the key handler now or defer.
