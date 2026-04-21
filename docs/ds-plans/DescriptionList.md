# DescriptionList build plan

**Phase:** 1
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A structured label/value display for read-only attributes — patient details, invoice metadata, contact info blocks. Either "horizontal" (label on the left, value on the right, fixed-width label column) or "stacked" (label above value). Not the same as `List` — `List` already supports this shape, but by stretching a generic primitive to fit. `DescriptionList` is a narrower, semantic component with richer affordances.

Wait — `List` in the current catalog already lists both `horizontal` and `stacked` layouts. Confirm with Jim whether `DescriptionList` is meant to **replace** `List` or **sit alongside** it. Logged in Open questions.

## API

```ts
interface DescriptionListProps {
  items: Array<{
    label: string;
    value: ReactNode;
    hint?: string;           // renders a HintIcon beside the label
    editable?: boolean;      // shows a pencil affordance; triggers onEdit
    onEdit?: () => void;
  }>;
  layout?: "horizontal" | "stacked";   // default "horizontal"
  labelWidth?: number;                 // default 160 (horizontal layout)
  divider?: boolean;                   // hairline between rows, default false
  tight?: boolean;                     // halves vertical padding, default false
}
```

Exposing `items` as an array (rather than `<Item>` children) matches the existing `List` API and keeps consumers one-line-per-row.

## What it extends

Existing DS `List` component, depending on the resolution of the "replace vs alongside" question. If `DescriptionList` supersedes `List`, delete `List` and migrate consumers. If it sits alongside, have `DescriptionList` wrap `List` internally so there's a single source of truth for row layout.

Semantically, this component should render `<dl>`, `<dt>`, `<dd>` under the hood — `List` currently renders generic divs. The semantic upgrade is the main reason `DescriptionList` is on the planned list.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — the patient detail page (`/patients/446604/details`) has extensive label/value rows that are the canonical inline pattern this component replaces.

- `https://acme.splose.com/patients/446604/details` — Contact info, Referrer info, Billing info sections. Each is a block of ~6-10 label/value rows.
- `https://acme.splose.com/contacts/416008/details` — similar label/value grid on contact records.
- `https://acme.splose.com/invoices/14130707/view` — invoice header block with Invoice #, Date, Client, Status rows (stacked layout).
- `https://acme.splose.com/patients/446604/cases` — case summary label/value pairs.

## Measurement targets

From the patient detail page (measured via existing inline label-value rows — DS catalog Grade C, uses raw `<div>` + className pattern):

- Row vertical padding: `8px` (horizontal), `12px` (stacked).
- Label width (horizontal): `160px`, wraps if longer.
- Label typography: `label/md` (14px/500), `rgb(65, 69, 73)` (secondary text).
- Value typography: `body/md` (14px/400), `rgb(44, 44, 44)` (text).
- Optional divider: `1px solid var(--color-border-subtle)` between rows.
- Tight mode: `4px` / `8px` padding.

## Accessibility

- Renders `<dl>` / `<dt>` / `<dd>` — semantically meaningful for screen readers.
- Labels and values are programmatically associated via the DL structure.
- Edit affordance (`editable={true}`) is a keyboard-focusable `<Button variant="icon">` that announces "Edit {label}".
- `hint` renders a `HintIcon` after the label, which keeps tooltip wiring in one place.

## Visual states

- Horizontal layout (default)
- Stacked layout
- With divider between rows
- Tight density
- Row with hint icon
- Row with editable affordance
- Empty value ("—" placeholder, italic, secondary colour)

## Stories to build

- **Playground:** args-driven with layout, labelWidth, divider, tight, items array.
- **Feature stories:**
  - `Horizontal`, `Stacked`, `WithDivider`, `Tight`.
  - `WithHints` — hint icons on labels.
  - `Editable` — pencil affordances and onEdit wire-up.
  - `MixedContent` — values that are text, Badge, Button, link.
  - `EmptyValues` — how the "—" placeholder looks.
- **Recipe stories:**
  - `PatientContactBlock` — `// Source: acme.splose.com/patients/446604/details — contact info card`
  - `InvoiceHeaderBlock` — `// Source: acme.splose.com/invoices/14130707/view — stacked invoice meta`
  - `ContactBillingBlock` — `// Source: acme.splose.com/contacts/416008/details — billing details card`

## MDX docs outline

- H1: DescriptionList
- When to use — label/value blocks on detail pages, read-only attribute dumps.
- When not to use — forms (use `FormField`), data tables (use `DataTable`), single-line badges (use `Badge`).
- Variants — horizontal, stacked, with divider, tight.
- Composition — inside `Card`, inside `DetailPage` main column, alongside `Accordion` for collapsible sections.
- Accessibility — DL semantics, hint/edit focus order.
- Sizing — label width tokens, tight vs default density.

## Acceptance criteria

- [ ] Renders at 1440x900 matching the production patient detail contact-info block.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit, including guidance on when to reach for `DescriptionList` vs `List`.
- [ ] At least two real consumer blocks migrated (suggest: patient contact info card, contact billing card) — proves the API covers both layout directions.

## Open questions

1. **Biggest open question**: does `DescriptionList` replace `List` or sit alongside? The current `List` already supports horizontal and stacked. The case for replace: `<dl>` semantics, hint/edit affordances belong in the description-list primitive, and we avoid API duplication. The case for alongside: `List` is also used for non-description cases (e.g. items with links, stat blocks) that aren't strictly label/value pairs. Lean toward **replace + fold-in** if `List` is only ever used for label/value data. Needs Jim's call.
2. The `editable` prop introduces a new affordance the existing `List` doesn't have. If `DescriptionList` is alongside `List`, we need to prevent confusion about which to reach for. Document crisply in the MDX.
