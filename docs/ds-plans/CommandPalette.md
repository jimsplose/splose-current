# CommandPalette build plan

**Phase:** 4
**Status:** Planned
**Estimated size:** L
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A keyboard-first launcher (Cmd+K / Ctrl+K) that opens a centred overlay with a search input and a scrollable list of actions. Users type to fuzzy-search across navigation targets, common actions ("New invoice", "New patient"), and recent records ("Harry Nguyen"). Aimed at power users and support staff who live in the app and hate clicking. Also the backbone for AI-driven command suggestions later.

## API

```ts
interface CommandPaletteProps {
  commands: Command[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;          // default "Type a command or search..."
  emptyMessage?: string;         // default "No results"
  triggerOnShortcut?: boolean;   // default true — binds Cmd+K / Ctrl+K at mount
}

interface Command {
  id: string;
  label: string;                 // display text
  group?: string;                 // optional section header ("Navigate", "Create", "Recents")
  icon?: ReactNode;
  shortcut?: string[];            // e.g. ["Cmd", "K"] shown right-aligned
  keywords?: string[];            // additional searchable aliases
  onSelect: () => void;
}
```

Commands can be hardcoded (static app navigation) or computed (recent patients, search results). The component doesn't care about the source.

Optional helper for scoping commands by page context:

```tsx
<CommandPalette.Context context="patient/446604">
  <Command id="new-note" label="New note" onSelect={...} />
  ...
</CommandPalette.Context>
```

## What it extends

`cmdk` (https://cmdk.paco.me) — the React command-menu primitive used by Vercel, Linear, Raycast's web app. Accessibility and keyboard ergonomics are baked in. AntD has nothing comparable; Radix has a basic `DropdownMenu` but nothing purpose-built for command menus. `cmdk` is the right base — Splose wraps it to apply DS tokens, default shortcut binding, and the command schema above.

Bundle cost: `cmdk` is ~6KB gz — acceptable.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no command palette visible or triggerable. Production does not currently ship a command palette. This is **net-new** behaviour.

- Candidate integrations:
  - Global Cmd+K → full command list: navigate to any top-level page, create records, open search.
  - Scoped Cmd+K on patient detail → patient-specific actions (new note, new invoice, add file).
  - Scoped Cmd+K on calendar → new appointment, new busy time, filter by practitioner.

## Measurement targets

No live sample — design defaults:

- Overlay: `rgba(0, 0, 0, 0.45)`.
- Card: centred horizontally, 96px from top, `560px` wide (max 90vw), max-height `60vh`.
- Border-radius: `12px`.
- Shadow: `0 12px 32px rgba(0, 0, 0, 0.16)`.
- Search input: height `48px`, `16px` font, no border (top of card).
- Command row: height `44px`, `12px 16px` padding, icon `20px` on left, shortcut badges right-aligned.
- Highlight on focused row: `var(--color-fill-secondary)`.
- Group header: `11px uppercase, letter-spacing 0.05em, 12px 16px padding, secondary colour`.
- Keyboard affordance: `Cmd+K` hint in the top-right of the search input.
- Animation: 120ms overlay fade, 160ms card slide-in from 8px above final position.

## Accessibility

- Search input is the focused element on open.
- Down / Up arrow moves the highlighted command; Enter invokes `onSelect`.
- Escape closes and returns focus to the trigger (Cmd+K trigger is invisible; focus returns to the previously focused element).
- List uses `role="listbox"`, rows use `role="option"`, `aria-selected` on the focused row.
- Empty state message announced to SR users (`aria-live="polite"`).
- cmdk handles most of this out of the box — verify during build.

## Visual states

- Closed
- Open, no query (shows default groups: Recents, Navigate, Create)
- Typing (filters groups, highlights match)
- Empty results
- With a shortcut chip on a row
- Group header rendered
- Long list scrolling (scrollbar matches Card scrollbar)
- Scoped context variant

## Stories to build

- **Playground:** args-driven with commands array and open state.
- **Feature stories:**
  - `Default` — open with default groups, no query.
  - `Typing` — pre-populated query filtering results.
  - `Empty` — query with no matches.
  - `WithShortcuts` — rows showing keyboard chips.
  - `WithGroups` — Recents / Navigate / Create sections.
  - `Scoped` — context override with patient-specific commands.
- **Recipe stories:**
  - `GlobalCmdK` — `// Source: planned — app-wide Cmd+K, top-level navigation + create actions + recent records`
  - `PatientScopedCmdK` — `// Source: planned /patients/{id}/details — per-patient Cmd+K with scoped actions`
  - `CalendarScopedCmdK` — `// Source: planned /calendar — per-calendar Cmd+K with slot actions`

## MDX docs outline

- H1: CommandPalette
- When to use — app-wide launcher, power-user entry point.
- When not to use — per-element actions (use `Dropdown` or `ContextMenu`), form autocomplete (use `ComboBox`), inline search on a page (use `SearchBar`).
- Variants — global vs scoped context.
- Composition — mounted once at root, scoped via context provider, commands fed from a central registry.
- Accessibility — keyboard binding, listbox roles, announcement.
- Sizing — single size card, responsive max-width.

## Acceptance criteria

- [ ] Renders at 1440x900 via Storybook-only verification (no production comparator — document in `.verification-evidence`).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] `cmdk` added as a dep, lockfile committed.
- [ ] One real integration path proved: mount `<CommandPalette />` at root, wire at least 5 navigation commands + 2 create commands.
- [ ] Cmd+K (macOS) and Ctrl+K (Windows/Linux) both open the palette — manual test.

## Open questions

1. ~~**Command registry**~~ — **Resolved 2026-04-22 (D2): hybrid.** A static `src/commands/index.ts` holds global commands (navigation, top-level creates). Routes that want per-page scope import a `useRegisterCommands(commands)` hook that adds commands while the route is mounted and removes them on unmount.
2. **Recents** — driven by local storage of the last N clicked items? Or a server-side "last visited" list? Simpler = local storage. Confirm.
3. **AI commands** — later, commands could be suggested by an AI that sees the current page. Out of scope for this component; but the API should leave room (suggest: a `suggestCommands` hook that asynchronously fetches and appends).
