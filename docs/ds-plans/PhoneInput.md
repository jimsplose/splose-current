# PhoneInput build plan

**Phase:** 2
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A formatted phone-number input with country-code selection and E.164 normalisation. Used on patient, contact, user, and practitioner forms. Replaces the current bare `<FormInput type="tel">` pattern, which accepts any text and stores it as typed — leading to dirty data ("0412 345 678", "+61412345678", "(07) 1234 5678" all coexist).

## API

```ts
interface PhoneInputProps {
  label?: string;
  value?: string | null;            // stored as E.164 ("+61412345678")
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  defaultCountry?: "AU" | "NZ" | "US" | "GB" | string;   // ISO 3166 alpha-2
  preferredCountries?: string[];    // bubbled to top of the picker, default ["AU", "NZ"]
  placeholder?: string;             // e.g. "0412 345 678"
}
```

The component always emits E.164 (`+61412345678`) for storage and formats the display string based on the selected country. Call sites should not parse or format the value themselves.

## What it extends

`react-phone-number-input` (https://github.com/catamphetamine/react-phone-number-input) wrapped in `FormField`. AntD does not ship a phone-specific input; adding `react-phone-number-input` gives us country picker, E.164 normalisation, and `libphonenumber-js` validation out of the box. The Splose wrapper:

- Hides `react-phone-number-input`'s default styling and re-themes to Splose tokens.
- Limits country selection to `preferredCountries` by default (AU + NZ is ≥ 99% of Splose customers).
- Threads `label`, `error`, `hint` into `FormField`.
- Uses DS `Icon` for the country flag slot (flag emojis render inconsistently across OSes; swap for an SVG lookup during build).

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — phone fields are on form pages that open as modals, so no visible instances on the pages walked. Confirm during the build by opening an "Add patient" modal.

- `https://acme.splose.com/patients/new` — mobile and home phone fields.
- `https://acme.splose.com/contacts/new` — phone field.
- `https://acme.splose.com/settings/users` (add user modal) — phone field.
- `https://acme.splose.com/settings/locations` (add location modal) — phone field.

## Measurement targets

TBC from production — capture during build with an open form. Expected defaults:

- Wrapper height: `32px` (md), matches `FormInput.md`.
- Border-radius: `8px` outer on wrapper; internal country selector has `8px 0 0 8px`, number input `0 8px 8px 0`.
- Divider between country and number: `1px` border-right on the country selector, `var(--color-border)`.
- Country selector width: `92px` (shows flag + code, e.g. `🇦🇺 +61`).
- Flag size: `16px` tall.
- Number font: `body/md` (14px/400).
- Focus ring: primary colour, applied to the whole wrapper.
- Error border: `var(--color-danger)` applied to whole wrapper.

## Accessibility

- Country selector is `role="combobox"` with `aria-label="Country"`; opens a list of countries filterable by typing.
- Number input is a plain `<input type="tel" inputmode="tel">` so mobile keyboards surface numeric + `+`.
- `aria-invalid` on error, `aria-describedby` linking to the FormField error text.
- Validation: on blur, verify via `libphonenumber-js`; if invalid, set `error` (consumer-managed via React Hook Form or similar).

## Visual states

- Empty / filled / focused / disabled / error
- With default country (AU)
- With user-selected alternate country (NZ)
- Invalid number (wrong length for country) — shown as error
- Country picker open (dropdown visible)
- Truncated long numbers (should not occur — max E.164 is 15 digits)

## Stories to build

- **Playground:** args-driven with label, defaultCountry, preferredCountries, error.
- **Feature stories:**
  - `Empty`, `Filled`, `Disabled`, `Error`.
  - `DefaultAU` — AU default with a real AU number.
  - `NZFlag` — NZ default with a real NZ number.
  - `AllCountries` — preferredCountries not set; picker shows all.
  - `Sizes` — sm / md / lg.
- **Recipe stories:**
  - `PatientMobile` — `// Source: acme.splose.com/patients/new — mobile phone field`
  - `ContactPhone` — `// Source: acme.splose.com/contacts/new — main phone field`
  - `LocationPhone` — `// Source: acme.splose.com/settings/locations — clinic phone`

## MDX docs outline

- H1: PhoneInput
- When to use — any phone number field that enters persisted storage.
- When not to use — free-text "contact notes" fields, SMS-message composition (no phone to parse there).
- Variants — default country, with preferred list, compact/full picker.
- Composition — inside `FormField`, inside a modal form, inside `FormPage`.
- Accessibility — combobox country picker, invalid-number announcement.
- Sizing — matches `FormInput` tokens.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production "Add patient" mobile field.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] `react-phone-number-input` added as a dep; lockfile committed.
- [ ] At least one real consumer migrated (suggest: `src/app/patients/new/page.tsx` mobile field).
- [ ] Verified E.164 is what reaches the backend (check Prisma input after a save).

## Open questions

1. **Data migration** — existing production phone numbers are stored as typed (inconsistent format). Do we migrate existing records to E.164, or only enforce the format on new saves? Suggest **new saves only** in the component PR; queue a backfill script as a separate task.
2. **Country picker visibility** — some customers only use AU. Do we hide the country selector entirely when `preferredCountries` is length 1? Lean yes, and expose `showCountrySelector={false}` for single-country accounts.
3. ~~**Dep choice**~~ — **Resolved 2026-04-22 (A3): use `react-phone-number-input` with `libphonenumber-js/min`** (≈ 40KB gz). If AU/NZ coverage is insufficient for the metadata subset, escalate during build before expanding to `mobile` or `max`.
