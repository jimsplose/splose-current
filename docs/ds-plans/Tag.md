# Tag build plan

**Phase:** 2
**Status:** Done
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A small, user-generated label that categorises a record. Used on patient profiles ("VIP", "NDIS", "Overdue account"), waitlist entries (service type), and note templates. Distinct from `Badge` in meaning: `Badge` signals a system-defined state or status (Paid, Overdue, Active); `Tag` represents user-applied, colour-coded metadata managed through `/settings/tags`. In production they currently share the AntD `Tag` primitive underneath, which has caused consumer confusion — naming the distinction in the DS stops the drift.

## API

```ts
interface TagProps {
  children: ReactNode;                 // label text
  color?: string;                      // hex or CSS colour from /settings/tags config
  icon?: ReactNode;
  onRemove?: () => void;               // shows × affordance
  size?: "sm" | "md" | "lg";
  interactive?: boolean;               // true → rendered as <button> with hover/focus
  selected?: boolean;                  // for filter-style multi-select UIs
  onClick?: () => void;
}
```

Colour comes from the tag record in settings (ColorDot palette). The component owns the contrast logic — given a background colour, it chooses white or dark text for legibility automatically.

## What it extends

The existing `Badge` component under the hood (same AntD `Tag` primitive). The Splose wrapper differentiates by **intent and defaults**, not implementation:

- `Badge` defaults to bordered, status-coloured, non-interactive.
- `Tag` defaults to solid-filled (user colour), size `sm`, allows removal, allows click-to-filter.

Implementation option: `Tag` is a thin wrapper around `Badge` that passes `solid`, computes the appropriate text colour from `color`, and exposes `interactive`/`selected` like `ColorDot`. No new AntD import, no new DS primitive — just a better API surface for the user-tag use case.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — patient detail page has 13 AntD Tags rendering. First tag captured: white bg, `rgb(217, 217, 217)` border, 8px border-radius, 0px 7px padding, 22px tall, 12px/400, `rgb(44, 44, 44)` text. These are currently uncoloured (default state). Tag colour is configured per-tag in `/settings/tags`.

- `https://acme.splose.com/patients/446604/details` — tag row on the patient header (VIP, NDIS, etc. when populated).
- `https://acme.splose.com/waitlist` — service and category tags per entry.
- `https://acme.splose.com/settings/tags` — the tag management page, showing colour swatches beside each tag name.
- `https://acme.splose.com/notes/{id}/edit` — optional category tags on notes.

## Measurement targets

Captured 2026-04-22 from the patient detail page:

- Border-radius: `8px` (default), `9999px` (pill, when `shape="pill"` promoted from Badge).
- Padding: `0px 7px` (sm default), `2px 10px` (md), `4px 12px` (lg).
- Height: `22px` (sm), `24px` (md), `28px` (lg).
- Font: `12px` (sm), `13px` (md), `14px` (lg), `400`.
- Text colour: white when `color` dark (luminance < 0.55), `rgb(44, 44, 44)` when light.
- Border: only when `color` is absent (uncoloured default uses `rgb(217, 217, 217)` hairline).
- Remove icon: 10px × mark, 4px left margin from text.

## Accessibility

- If `interactive`, renders as `<button type="button">` with focus ring and `aria-pressed={selected}`.
- If `onRemove`, the × is a nested focusable `<button>` with `aria-label="Remove {label}"`.
- Colour is **never** the only signal — every tag has a text label. Users relying on SR get the label read; users with colour vision differences still see the text.
- Contrast ratio validated by the text-colour picker: all palette colours + chosen text colour hit WCAG AA for body text (4.5:1). If a user picks a custom colour that fails contrast, the DS should warn (out of scope for this plan — note in Open questions).

## Visual states

- Default (uncoloured)
- Coloured (light bg → dark text)
- Coloured (dark bg → white text)
- With leading icon
- Removable (× affordance)
- Interactive (clickable, focus ring)
- Interactive + selected (ring + subtle shadow)
- Disabled (not in initial build unless requested)
- Sizes sm / md / lg

## Stories to build

- **Playground:** args-driven with colour, size, icon, onRemove, interactive, selected.
- **Feature stories:**
  - `Default` — uncoloured.
  - `Coloured` — palette grid of named colours.
  - `WithIcon`.
  - `Removable`.
  - `Interactive` — toggle on click.
  - `SelectedState` — selected ring.
  - `Sizes` — sm / md / lg.
- **Recipe stories:**
  - `PatientTags` — `// Source: acme.splose.com/patients/446604/details — VIP / NDIS / Payment plan tags`
  - `WaitlistTags` — `// Source: acme.splose.com/waitlist — service chips per row`
  - `TagFilterBar` — `// Source: planned — tag filters above a patient list, interactive + selected`

## MDX docs outline

- H1: Tag
- When to use — user-configured, colour-coded labels from `/settings/tags`.
- When not to use — system status (`Badge`), navigation (`Tab`), actions (`Button`).
- Variants — default, coloured, removable, interactive, selected.
- Composition — tag row on a patient header, tag filter bar above a list.
- Accessibility — interactive role, remove button, label + colour.
- Sizing — sm is the default for row-level tags; md for headers; lg rarely used.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production patient detail tag row.
- [ ] Passes `@storybook/addon-a11y` checks, with palette-colour contrast check passing AA.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`, including the `Tag` vs `Badge` decision rule.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit — add a `Tag` row distinct from `Badge` with the user-tag intent documented.
- [ ] At least one real consumer migrated (suggest: `src/app/waitlist/...` — current audit shows 2-3 ad-hoc tag renderings there).

## Open questions

1. ~~**Naming overlap risk with `Badge`**~~ — **Resolved 2026-04-22 (B3): ship as a separate `Tag` component.**
2. **Contrast warning on custom colours** — out of scope for this build but track as a follow-up: should `/settings/tags` gate-keep user colour choice to AA-contrast combinations? Suggest yes, raise with Jim as a separate product decision.
