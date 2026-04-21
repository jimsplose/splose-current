# List enhancement build plan (formerly "DescriptionList")

**Phase:** 1
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

Upgrades the existing `List` component so it covers the "description list" use case properly. Renders `<dl>/<dt>/<dd>` under the hood for label/value layouts, adds a hint icon per row, and adds an optional editable pencil affordance. Replaces the inline label/value rows scattered across patient detail, contact detail, and invoice headers without adding a parallel component — decision made 2026-04-22 (see README.md).

## API changes to existing List

```ts
interface ListProps {
  items: Array<{
    label: string;
    value: ReactNode;
    hint?: string;                // NEW — renders HintIcon beside the label
    editable?: boolean;           // NEW — shows pencil affordance, triggers onEdit
    onEdit?: () => void;          // NEW
  }>;
  layout?: "horizontal" | "stacked";   // unchanged (existing)
  labelWidth?: number;                 // unchanged (existing)
  divider?: boolean;                   // NEW — hairline between rows, default false
  tight?: boolean;                     // NEW — halves vertical padding, default false
  semantic?: "dl" | "div";             // NEW — default "dl". Allows non-attribute uses to opt out.
}
```

Existing consumers keep working with no changes. New props default to the current behaviour.

## What it extends

The existing `src/components/ds/List.tsx`. No new component, no new dep. Under the hood the component switches from `<div>` wrappers to `<dl>/<dt>/<dd>` when `semantic="dl"` (the default). The two existing layouts (horizontal, stacked) continue to render the same pixels.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — patient detail page has extensive label/value rows that are the canonical pattern this upgrade serves.

- `https://acme.splose.com/patients/446604/details` — contact info, referrer info, billing info blocks.
- `https://acme.splose.com/contacts/416008/details` — similar grid on contacts.
- `https://acme.splose.com/invoices/14130707/view` — invoice header block with stacked rows.
- `https://acme.splose.com/patients/446604/cases` — case summary label/value pairs.

## Measurement targets

Existing List tokens already match production for horizontal and stacked layouts. New additions:

- Divider: `1px solid var(--color-border-subtle)` between rows (when `divider={true}`).
- Tight mode: `4px`/`8px` padding (halves the default `8px`/`12px`).
- Hint icon: reuse `HintIcon size="sm"`, 4px gap after label.
- Edit affordance: `Button variant="icon" size="sm"` with `aria-label="Edit {label}"`, right-aligned in the row.

## Accessibility

- Default semantic is `<dl>/<dt>/<dd>` — labels and values are programmatically associated for screen readers.
- `semantic="div"` escape hatch keeps the old shape for non-attribute uses (stat rows, glossaries).
- Hint tooltip wires through `HintIcon` which already has the correct ARIA wiring.
- Edit button is keyboard-focusable.

## Visual states

- Horizontal (default) and stacked — unchanged
- With divider
- Tight density
- Row with hint icon
- Row with editable affordance
- Empty value placeholder ("—")

## Stories to add to existing List.stories.tsx

- **Playground:** extended with divider, tight, semantic controls.
- **New feature stories:**
  - `WithDivider`
  - `Tight`
  - `WithHints`
  - `Editable`
  - `DivSemantic` — opt-out for stat rows.
- **New recipe stories:**
  - `PatientContactBlock` — `// Source: acme.splose.com/patients/446604/details — contact info card`
  - `InvoiceHeaderStacked` — `// Source: acme.splose.com/invoices/14130707/view`
  - `ContactBillingBlock` — `// Source: acme.splose.com/contacts/416008/details`

## MDX docs additions

Update the existing `List` MDX with the new props. Add a "When to use List for attributes vs other shapes" section. Call out the `<dl>` default and the `div` escape hatch. Keep a single MDX page for List.

## Acceptance criteria

- [ ] Existing List call sites render unchanged (pixel-for-pixel).
- [ ] New `semantic="dl"` default renders `<dl>/<dt>/<dd>` — verified via DOM snapshot in Storybook.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] New feature + recipe stories added to `List.stories.tsx`.
- [ ] MDX updated.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least two real consumer blocks migrated (suggest: patient contact info card, contact billing card).

## Open questions

All resolved 2026-04-22. File retained as reference; build session can proceed.
