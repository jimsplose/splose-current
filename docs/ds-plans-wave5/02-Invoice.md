# Wave 5 · Plan 02 — Invoice surface migration

**Status:** Done
**Estimated effort:** M
**Recommended model:** Opus 4.7 (high-frequency surface, financial UI — regression risk is high)
**Thinking budget:** think hard

## Surface

- `src/app/invoices/page.tsx` — invoice list with status column.
- `src/app/invoices/[id]/page.tsx` + `InvoiceDetailClient.tsx` — invoice detail view, "Sign & lock", header badge.
- `src/app/invoices/new/page.tsx` — new-invoice form (line items, service picker, due date).
- `src/app/invoices/batch-invoice/[id]/page.tsx` — batch invoice flow.
- `src/app/payments/page.tsx` — payments list (status + amount).
- `src/app/patients/[id]/invoices/*` — patient invoices tab.
- `src/app/reports/aged-debtors/*` — aged debtors report (status column, optional trend cell).

## Migrations

This plan does TWO things in one pass for every file it touches: (1) adopt the new Wave 4 DS components, and (2) remove hand-written utility classes from `globals.css`. Both migrations happen in the same edit per file to avoid double-touch.

### A. DS component adoption

| From | To | Surface |
|---|---|---|
| `<Badge variant="green">Paid</Badge>` + `statusVariant()` lookup | `<PaymentStatusBadge status="paid" />` | All 7 invoice/payment surfaces — 20+ call sites |
| `<FormInput type="number">` + `parseFloat(e.target.value)` | `<NumberInput format="currency" currency="AUD">` | invoice line-item price, refund amount, adjustment |
| `<FormInput type="number">` + `parseInt` | `<NumberInput format="integer" min={1}>` | line-item quantity |
| `<FormInput type="number">` + `parseFloat` + `%` suffix markup | `<NumberInput format="percent">` | discount, tax rate column when editable |
| AntD DatePicker | `<DatePicker>` | new-invoice due date, issue date, batch-invoice date range |
| AntD AutoComplete / FormSelect with typeahead | `<ComboBox>` | line-item service picker (with `onCreate` to let power users add a one-off service) |
| `<Modal>` with typed-in signature | `<SignaturePad>` (+ type-mode fallback from Wave 4 story) | Sign & Lock on InvoiceDetailClient header |
| Aged-debtor amount cell | optional `<Sparkline>` trend alongside amount | reports/aged-debtors row |

### B. Utility-class removal on invoice + payments surfaces

Use the replacement mapping + priority ladder in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference). Applies to every `.tsx` under:

- `src/app/invoices/**`
- `src/app/payments/**`

Task C1 from the original utility plan ("migrate `<Td>` color class usages to `Td color` prop") resolves here because invoice tables are the primary consumer of coloured Td cells. Grep pre-start: `grep -rn 'Td.*className.*text-text-secondary\|Td.*className.*text-primary\|Td.*className.*text-danger' src/app/invoices src/app/payments --include='*.tsx'`.

## Chrome MCP verification

At 1440×900 on both tabs:

1. **Invoices list status column:** PaymentStatusBadge height/padding/font match production for Paid, Draft, Outstanding, Overdue (the four most common statuses). Solid background `#00c887` for Paid verified.
2. **Invoice detail header badge:** correct size (md) beside the invoice number.
3. **New-invoice line item:** quantity stepper works, price formats as `$1,234.50`, discount formats as `12.5%`. Currency locale en-AU.
4. **Service picker ComboBox:** opens on click, filters on type, "Create 'X'" row appears when typing a non-matching value.
5. **Sign & Lock SignaturePad:** modal opens, signature captures, "Sign & lock" button disabled until signature non-empty.

## Acceptance criteria

### DS adoption
- [ ] `grep -r "variant=.\"green\".*Paid" src/app/` = 0 (and same for other status strings — Outstanding / Overdue / etc.). All hardcoded status mappings replaced with `<PaymentStatusBadge>`.
- [ ] `grep -c "parseFloat\|Number(" src/app/invoices/` drops by ≥10.
- [ ] InvoiceDetailClient.tsx raw `style={{` count drops by ≥50%.
- [ ] Sign & Lock flow end-to-end: click → SignaturePad opens → sign → lock persists the base64 signature.

### Utility-class cleanup on invoice + payments surfaces
- [ ] `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' src/app/invoices src/app/payments --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*border-border\|className=.*bg-primary' src/app/invoices src/app/payments --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' src/app/invoices src/app/payments --include='*.tsx'` = 0
- [ ] `grep -rn 'Td.*className.*text-text-secondary\|Td.*className.*text-primary' src/app/invoices src/app/payments --include='*.tsx'` = 0 (uses `<Td color>` prop instead)

### Gate
- [ ] tsc 0 errors, `npx next build` passes.
- [ ] `.verification-evidence` written per migrated surface (typography + spacing + color).

## Commit discipline

One commit per page:
1. invoices/page.tsx status column → PaymentStatusBadge
2. invoices/[id] page + InvoiceDetailClient → PaymentStatusBadge + SignaturePad for Sign & Lock
3. invoices/new → NumberInput (qty, price, discount) + DatePicker (due) + ComboBox (service)
4. invoices/batch-invoice/[id] → (if status badges present) PaymentStatusBadge
5. payments/page.tsx → PaymentStatusBadge
6. patients/[id]/invoices tab → PaymentStatusBadge
7. reports/aged-debtors → PaymentStatusBadge + optional Sparkline trend cell
8. Wave 5 Plan 02 status flip + session log

## Known pitfalls

- `statusVariant()` helper in `src/components/ds/Badge.tsx` is used by non-payment surfaces too (appointment status). Don't delete the helper; just switch payment call sites to `PaymentStatusBadge` which uses its own mapping.
- `parseFloat` on currency input is currently defensive against locale (`$120.50` → `NaN`). NumberInput emits `number` so the call-site code simplifies dramatically; double-check any rounding or precision logic at the persistence boundary.
- SignaturePad on mobile requires `touchAction: "none"` to prevent page scroll — verify on a phone after the Sign & Lock integration.

## Open questions

1. **Backend signature storage** — verify Prisma schema columns (`invoice.signature`, etc.) accept the ~5KB base64 data URL. If the column is too narrow, widen as part of this plan or queue a data migration.
2. **Refunds** — negative currency amounts. Wave 4's NumberInput allows negatives; verify refunds render as `-$1,234.50` and not `($1,234.50)` to match Splose's existing convention.
