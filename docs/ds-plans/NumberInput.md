# NumberInput build plan

**Phase:** 1
**Status:** Done
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A numeric input with stepper controls, min/max clamping, and explicit typing for currency, percentage, and integer use cases. Used for service prices, invoice line-item quantities, duration in minutes, and discount rates. Replaces the current `<FormInput type="number">` + manual `parseFloat()` pattern that scatters integer and currency logic across pages.

## API

```ts
interface NumberInputProps {
  label?: string;
  value?: number | null;
  defaultValue?: number;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  min?: number;
  max?: number;
  step?: number;                    // arrow / scroll increment, default 1
  precision?: number;               // decimal places; defaults per format
  format?: "integer" | "decimal" | "currency" | "percent";
  currency?: "AUD" | "USD" | "NZD"; // required when format="currency"
  showSteppers?: boolean;           // default true; hide for free-entry uses
  prefix?: ReactNode;               // e.g. "$" when format="currency"
  suffix?: ReactNode;               // e.g. "%" when format="percent"
  placeholder?: string;
}
```

Emits a `number` (or `null` for empty). Never strings. The component owns the currency/percent formatting and parsing — call sites should never `parseFloat` the input themselves.

## What it extends

AntD `InputNumber`. It handles stepper buttons, keyboard `↑`/`↓`/`Enter`, min/max clamp, and precision out of the box. The Splose wrapper:

- Renames `controls` → `showSteppers` to match the Splose naming style.
- Exposes `format` as a string union so consumers don't have to wire prefix/suffix/parser/formatter themselves for the common cases (currency and percent are the dominant uses).
- Threads `label`, `error`, `hint` into `FormField` like other form controls.
- Locks currency display to Australian locale (`$1,234.50`, not `1234.5`).

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — numeric inputs live on form pages where they're only visible when the modal/form is open. The list page `/settings/services` shows rendered values (price, duration) but the input form opens as a modal on "Add". Capture the live input during the build.

- `https://acme.splose.com/settings/services` — "Add service" modal has price (currency) and duration (integer, minutes) inputs.
- `https://acme.splose.com/invoices/new` — line-item quantity (integer) and discount (percent) inputs.
- `https://acme.splose.com/settings/tax-rates` — tax rate field (percent, up to 2 decimal places).
- `https://acme.splose.com/settings/invoices` — late-fee amount (currency).

## Measurement targets

TBC from production — capture during the build session with a modal form open. Expected from matching `FormInput`:

- Height: `32px` (md), matches `FormInput.md`.
- Border-radius: `8px`.
- Border: `var(--color-border)` default, `var(--color-primary)` focus, `var(--color-danger)` error.
- Stepper buttons: `1px` separator on the left, 20px tall each, primary icon colour.
- Prefix/suffix: `14px`, secondary colour, 8px gap from the value.
- Currency format (AUD): `$1,234.50` — two decimal places, thousand separators.
- Percent format: `12.5%` — up to `precision` decimals, suffix inside the input.

## Accessibility

- `role="spinbutton"` (AntD applies this automatically — verify on build).
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` reflected from props.
- Up/Down keyboard steps by `step`; Shift+Up/Down steps by `step * 10`.
- Stepper buttons are `<button type="button">` with `aria-label` like "Increase price".
- Empty value announces as "no value" rather than "0" — don't force a zero state.

## Visual states

- Empty / filled / focused / disabled / error
- With stepper buttons / without
- Currency format
- Percent format
- Integer format
- Decimal format with custom precision
- Reached min (disabled decrement)
- Reached max (disabled increment)

## Stories to build

- **Playground:** args-driven with all props.
- **Feature stories:**
  - `Integer` — quantity-style.
  - `Decimal` — free decimal entry.
  - `Currency` — AUD, prefix `$`, 2 decimal places.
  - `Percent` — suffix `%`, 2 decimal places.
  - `WithoutSteppers` — free-entry style.
  - `Clamped` — min 1, max 100 behaviour.
  - `Sizes` — sm/md/lg.
- **Recipe stories:**
  - `ServicePrice` — `// Source: acme.splose.com/settings/services — Add Service modal price field (AUD)`
  - `InvoiceLineQty` — `// Source: acme.splose.com/invoices/new — line item quantity (integer)`
  - `DiscountPercent` — `// Source: acme.splose.com/invoices/new — line item discount (percent)`
  - `DurationMinutes` — `// Source: acme.splose.com/settings/services — duration field (integer, suffix "min")`

## MDX docs outline

- H1: NumberInput
- When to use — any numeric field with clamping, currency, or percent semantics.
- When not to use — free-form strings that happen to be numeric (phone, SKU — use `FormInput`), sliders (no slider component yet — escalate).
- Variants — integer, decimal, currency, percent.
- Composition — inside `FormField`, inside `FormPage`, inline in a table row (see `DataTable` recipe).
- Accessibility — spinbutton semantics, keyboard stepping.
- Sizing — matches `FormInput` tokens exactly.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production "Add service" modal price field and "New invoice" line-item quantity field.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] At least three real consumers migrated: service price, invoice line qty, tax rate percent.
- [ ] `parseFloat` and `Number()` grep in `src/app/` drops by at least 10 call sites after migration.

## Open questions

1. Currency formatting — do we ever need a multi-currency scenario in practice, or is AUD hardcoded fine? If AUD-only, we can drop the `currency` prop and always format as AUD. Confirm with Jim.
2. Negative numbers — should `format="currency"` allow negatives (for credits / refunds)? Default to yes but render them as `-$1,234.50`, not `($1,234.50)`. Confirm.
