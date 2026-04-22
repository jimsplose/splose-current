# PaymentStatusBadge build plan

**Phase:** 3
**Status:** Done
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** Invoices.md (if it exists), else n/a

## What it does

A purpose-built badge for payment status on invoices and payments — `Paid`, `Outstanding`, `Overdue`, `Partial`, `Refunded`, `Failed`, `Draft`. Encodes the Splose-specific colour assignment and label mapping so consumers don't repeatedly reach for `Badge variant={...}` + a lookup table. Today callers either hardcode `<Badge variant="green">Paid</Badge>` across dozens of call sites, or use the `statusVariant` helper — this component is the more purposeful replacement.

## API

```ts
interface PaymentStatusBadgeProps {
  status: "paid" | "outstanding" | "overdue" | "partial" | "refunded" | "failed" | "draft" | "void";
  size?: "sm" | "md" | "lg";
  solid?: boolean;              // default true — matches production invoice list
}
```

The component owns the label text (capitalised) and the colour mapping. Consumers pass the status; everything else is derived.

Helper export for imperative mapping (e.g. in a DataTable column formatter):

```ts
export function paymentStatusToVariant(status: PaymentStatus): { variant: BadgeVariant; label: string };
```

## What it extends

The existing `Badge` component. `PaymentStatusBadge` is a thin wrapper that:

1. Maps `status` → `Badge variant` (green / yellow / red / etc.).
2. Maps `status` → display label (title-case string).
3. Always renders `solid={true}` by default (matches production invoice list).

It's essentially `Badge` with purpose-built defaults. Shipping it as a named component is about **intent clarity** at call sites — `<PaymentStatusBadge status={invoice.status} />` reads better than `<Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>`.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — invoices list page confirmed production badge styling.

Measured (`acme.splose.com/invoices` list page, first two badge text values):
- `Paid`: `rgb(0, 200, 135)` bg, white text, `8px` border-radius, `0px 7px` padding, `22px` tall, `12px/400`.
- `Draft`: `rgb(165, 165, 158)` bg, white text, same dimensions.

Other statuses inferred from the existing `solidColorMap` in `src/components/ds/Badge.tsx`:
- `Outstanding` / `Pending` → `yellow` solid bg `#FFD232`.
- `Overdue` / `Failed` → `red` solid bg `#D00032`.
- `Refunded` → `blue` solid bg `#5578FF`.

Production routes to confirm on build:

- `https://acme.splose.com/invoices` — list of invoices with status column.
- `https://acme.splose.com/invoices/14130707/view` — single invoice header badge.
- `https://acme.splose.com/payments` — payments list with status.
- `https://acme.splose.com/patients/446604/invoices` — patient invoices tab.
- `https://acme.splose.com/reports/aged-debtors` — aged debtors report.

## Measurement targets

Captured + expected (match `Badge solid={true}` defaults):

- Height: `22px` (sm), `26px` (md), `30px` (lg).
- Border-radius: `8px` (rounded, matches existing `Badge` defaults). Consumer can opt into `shape="pill"` via a passthrough if a future design calls for it — not in the initial API.
- Padding: `0px 7px` (sm), `2px 10px` (md), `4px 12px` (lg).
- Font: `12px` (sm), `13px` (md), `14px` (lg), weight `400`.
- Text: always white (contrast validated for every status colour).
- No border.
- Colour map:

| Status       | Badge variant | Solid bg          | Display label |
|--------------|---------------|-------------------|---------------|
| paid         | green         | `#00c887`         | Paid          |
| outstanding  | yellow        | `#FFD232`         | Outstanding   |
| overdue      | red           | `#D00032`         | Overdue       |
| partial      | orange        | `#f97316`         | Partial       |
| refunded     | blue          | `#5578FF`         | Refunded      |
| failed       | red           | `#D00032`         | Failed        |
| draft        | gray          | `rgb(165,165,158)`| Draft         |
| void         | gray          | `rgb(165,165,158)`| Void          |

## Accessibility

- Rendered via existing `Badge` — inherits its semantics (styled span).
- Status is communicated as text, not colour-only.
- If used in a DataTable cell, the SR reads "Paid" — no extra label needed.
- Validate contrast of every solid bg vs white text during the build (the existing `solidColorMap` was validated when `Badge` was extended in audit session 13; re-confirm here).

## Visual states

- One visual per status (paid/outstanding/overdue/partial/refunded/failed/draft/void)
- Sizes sm / md / lg
- Outline variant (`solid={false}`) for contexts that prefer it — e.g. inline inside text

## Stories to build

- **Playground:** args-driven with status and size.
- **Feature stories:**
  - `AllStatuses` — grid of every status at md size.
  - `Sizes` — sm / md / lg across the Paid status.
  - `Outlined` — `solid={false}` comparison.
- **Recipe stories:**
  - `InvoiceListStatusColumn` — `// Source: acme.splose.com/invoices — status column`
  - `AgedDebtorsRow` — `// Source: acme.splose.com/reports/aged-debtors — status inline with amount`
  - `PatientInvoicesTab` — `// Source: acme.splose.com/patients/446604/invoices — tab with invoice rows`
  - `InvoiceHeaderBadge` — `// Source: acme.splose.com/invoices/14130707/view — header badge beside invoice number`

## MDX docs outline

- H1: PaymentStatusBadge
- When to use — any invoice/payment status display.
- When not to use — non-payment statuses (use `Badge` directly), custom status colour (use `Badge` with explicit variant).
- Variants — statuses, sizes, solid vs outlined.
- Composition — in DataTable cells, in invoice headers, in aged debtor rows.
- Accessibility — text label, colour-is-not-meaning.
- Sizing — sm for list rows, md for headers, lg is rarely used.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production invoice list badge (Paid and Draft colours verified).
- [ ] Passes `@storybook/addon-a11y` checks — every status hits ≥ 4.5:1 contrast.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least three real consumers migrated (suggest: the invoices list row badge, the single invoice header badge, the patient invoices tab row badge).
- [ ] `paymentStatusToVariant` helper is colocated and tested.

## Open questions

1. **Scope vs Badge** — this is the thinnest wrapper in the whole planned wave. Worth it? The argument **for** is intent at call sites and a single place to adjust when the status palette changes. The argument **against** is another component to maintain for zero visual novelty. Lean **for**, because consumer consistency across 20+ invoice rows matters. Confirm with Jim.
2. **Partial status colour** — is orange the right tone for partial payment, or should it be green-orange gradient (some apps use this)? Simpler solid orange wins; confirm during build.
3. **Void status** — confirm the data model has a `void` state. If not, drop it from the union.
