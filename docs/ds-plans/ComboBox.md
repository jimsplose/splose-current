# ComboBox build plan

**Phase:** 4
**Status:** Done
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A text input with a filterable dropdown of options underneath — the user can type to filter, pick from the list, or enter a free-text value when the options don't cover their case. Used on service-picker fields, practitioner-picker, tag-picker, and any place where the set of possible values is large but not unbounded. Distinct from `FormSelect` (the dropdown has no filter; options are small) and `AsyncSelect` (the dropdown fetches from a server on every keystroke).

## API

```ts
interface ComboBoxProps<T extends { value: string; label: string }> {
  label?: string;
  options: T[];
  value?: string | null;             // currently selected option's value
  onChange?: (value: string | null, option: T | null) => void;
  inputValue?: string;               // controlled input text
  onInputChange?: (text: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  emptyMessage?: string;             // shown when filter has no matches
  allowFreeEntry?: boolean;          // emit free-text value when no option matches; default false
  onCreate?: (text: string) => void; // if provided, shows "Create '{text}'" in the list
  renderOption?: (option: T) => ReactNode;  // custom row render
  clearable?: boolean;               // show ×, default true
}
```

Exposes both `value` (the picked option's value) and `inputValue` (what the user has typed) so call sites can wire either or both.

## What it extends

Downshift (https://www.downshift-js.com) — the headless autocomplete primitive used in most high-quality React combos. AntD `AutoComplete` covers the common case but its API leaks `dayjs`-like internals and doesn't handle free-entry cleanly.

If Radix is adopted elsewhere for the DS, `@radix-ui/react-combobox` was planned but isn't shipped yet; Downshift stays the safer choice. Splose wrapper applies DS tokens, uses the shared `FormField` wrapper, and binds the keyboard/focus contract.

Alternative if Downshift feels heavy: `react-aria-components` `ComboBox` (same accessibility reputation, newer API). Build session picks after a 30-minute API compare.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — AutoComplete-style inputs aren't directly observable without focusing a field on a form. Likely appears on:

- `/invoices/new` — service picker on each line item.
- `/calendar new-appointment modal` — service picker + practitioner picker.
- `/waitlist new entry modal` — service picker.
- `/patients/new` — referrer picker (search contacts by name).

## Measurement targets

Measure on build with a modal open. Expected defaults matching existing `FormSelect` and `AsyncSelect`:

- Input height: `32px` (md).
- Border-radius: `8px`.
- Border: `var(--color-border)` default, `var(--color-primary)` focus, `var(--color-danger)` error.
- Dropdown: `1px solid var(--color-border)`, `8px` border-radius, `0 4px 16px rgba(0,0,0,0.08)` shadow.
- Option row height: `36px`, padding `8px 12px`.
- Matched portion of the label: bold via `<strong>` tag (SR-safe).
- Highlighted row bg: `var(--color-fill-secondary)`.
- Empty message: secondary colour, italic, centered, 12px padding.
- "Create '{text}'" row: leading `+` icon, primary colour text.

## Accessibility

- Input is `role="combobox"`, `aria-expanded` reflects popover state, `aria-controls` points at the listbox.
- Listbox is `role="listbox"`, options `role="option"` with `aria-selected`.
- Keyboard: Down/Up moves highlight; Enter selects; Escape closes; Home/End jumps to first/last; Tab either selects and moves on or just moves on (depends on convention — Downshift exposes both, pick "select on tab" for power users).
- Typeahead: typing characters filters options as expected.
- `aria-invalid` on error, `aria-describedby` for FormField error.

## Visual states

- Empty / filled / focused / disabled / error
- Typing (filtered list)
- Empty filter result (empty message)
- With free-entry allowed (shows "Create '{text}'" row)
- Dropdown open
- Option with leading icon / avatar
- Option with secondary line (e.g. service + price)

## Stories to build

- **Playground:** args-driven with options, value, size, allowFreeEntry.
- **Feature stories:**
  - `Basic` — 6 options, filtering.
  - `Empty` — filter with no matches.
  - `FreeEntry` — allowFreeEntry=true.
  - `WithCreate` — onCreate wired, "Create '...'" row.
  - `CustomRender` — renderOption with an icon + secondary line.
  - `Disabled`, `Error`.
  - `Sizes`.
- **Recipe stories:**
  - `ServicePicker` — `// Source: planned /invoices/new line item — pick a service, optionally create a new one`
  - `PractitionerPicker` — `// Source: planned /calendar new-appointment — pick a practitioner with avatar + name`
  - `ReferrerPicker` — `// Source: planned /patients/new — search contacts by name`

## MDX docs outline

- H1: ComboBox
- When to use — filterable option sets with a known, finite list.
- When not to use — small closed sets (`FormSelect`), server-side searched data (`AsyncSelect`), multi-select (needs a separate `MultiSelect` component — flag as follow-up).
- Variants — basic, free-entry, with create.
- Composition — inside `FormField`, inside modal forms, inside table line-item editors.
- Accessibility — combobox role, listbox semantics, keyboard nav.
- Sizing — matches `FormInput` tokens.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production service-picker on invoice line item.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] Dep choice locked (Downshift, react-aria, or AntD `AutoComplete` wrapper) and lockfile committed.
- [ ] At least one real consumer migrated (suggest: `/invoices/new` service picker — highest-frequency use).

## Open questions

1. **Multi-select** — not in this plan. If Splose has multi-select use cases (tag assignment, practitioner multi-filter on reports), queue a separate `MultiSelect` plan. Lean: lift the common AntD `Select mode="multiple"` consumers into a new DS component later.
2. ~~**Downshift vs react-aria vs AntD**~~ — **Resolved 2026-04-22 (D4): Downshift.**
3. **Async variant** — existing DS has `AsyncSelect` which covers server-fetched options. Confirm `ComboBox` is strictly client-filtered. If we need a combined component, that's a separate conversation.
