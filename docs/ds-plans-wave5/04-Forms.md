# Wave 5 · Plan 04 — Forms, modals, and feedback surfaces

**Status:** In progress
**Estimated effort:** L (broad sweep across ~15 files; each change small)
**Recommended model:** Sonnet 4.6 (mostly mechanical substitutions)
**Thinking budget:** think

## Surface

Settings-heavy surfaces that host form fields and destructive actions. Most are modals; the changes are small per file but add up across the section.

- `src/app/settings/services/*` — add/edit service modal (price, duration).
- `src/app/settings/tax-rates/*` — tax rate field.
- `src/app/settings/invoices/*` + `src/app/settings/invoice-settings/*` — late-fee amount, due-date defaults.
- `src/app/settings/locations/*` — clinic phone, opening/closing hours.
- `src/app/settings/busy-times/*` — start/end time, date.
- `src/app/settings/users/*` — phone.
- `src/app/settings/tags/*` — tag CRUD (validates colour contrast pre-save).
- `src/app/settings/practitioner-access/*` — confirmations on user access changes.
- `src/app/settings/ai/*` + `src/app/settings/details/*` + `src/app/settings/custom-fields/*` — save handler toasts.
- Globally: every caller of AntD `message.*` / `notification.*`.
- Globally: every call site of `window.confirm()` / bespoke confirmation modals for destructive actions (delete service, delete tag, cancel invoice, discard changes).

## Migrations

This plan does TWO things in one pass for every file it touches: (1) adopt the new Wave 4 DS components, and (2) remove hand-written utility classes from `globals.css`. Both migrations happen in the same edit per file to avoid double-touch.

### A. DS component adoption

| From | To | Scope |
|---|---|---|
| `<FormInput type="number">` + `parseFloat` | `<NumberInput format="currency" currency="AUD">` | late fees, service prices, gap fees |
| `<FormInput type="number">` + `parseInt` | `<NumberInput format="integer">` | durations, reminder intervals, rate limits |
| `<FormInput type="number">` + `%` suffix | `<NumberInput format="percent">` | tax rate, discount, commission |
| AntD `TimePicker` / `Input` for time | `<TimePicker format="12h">` | location opening hours, busy-time start/end |
| AntD `DatePicker` | `<DatePicker>` | any remaining raw AntD picker imports |
| `<FormInput type="tel">` | `<PhoneInput defaultCountry="AU">` | settings/users, settings/locations |
| AntD `AutoComplete` / `Select` with typeahead | `<ComboBox>` | practitioner/service/tag/referrer pickers on any setting form |
| `window.confirm("Are you sure?")` / `<Modal onOk>` confirmation | `await alertDialog.confirm({ title, tone: "danger" })` | every destructive action — delete service, delete tag, cancel invoice, discard unsaved changes |
| `message.success(...)` / `notification.info(...)` | `toast.success(...)` / `toast.info(...)` | every save handler and async action across settings pages |

### B. Utility-class removal on settings surfaces

Use the replacement mapping + priority ladder in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference). Applies to every `.tsx` under `src/app/settings/**`.

Audit session 24 migrated some typography on `/settings/ai`; re-grep after edits to confirm no regressions. Setting pages often have form-heavy layouts where `<Flex vertical gap={16}>` replaces dozens of `mb-4` instances at once — look for those opportunities first.

## Chrome MCP verification

At 1440×900 on both tabs, per migrated modal:

1. **Service price** — `$1,234.50` format, currency=AUD.
2. **Duration** — stepper increments by 5 (or the `step` configured), min 5, max 240.
3. **Tax rate** — `12.5%` format, precision 2.
4. **Clinic opening hours** — `9:00 AM` display, emits `HH:mm` 24h at the data boundary.
5. **Delete confirmation** — opens centred AlertDialog with `Cancel` autofocus. Danger button red.
6. **Save toast** — appears bottom-right, 4s auto-dismiss, richColors tone.

## Acceptance criteria

### DS adoption
- [ ] `grep -c "parseFloat\|parseInt\|Number(" src/app/settings/` drops by ≥20.
- [ ] `grep -c "from 'antd'.*message\|from 'antd'.*notification" src/` = 0. Use `toast` from `@/components/ds` everywhere.
- [ ] `grep -c "window\.confirm\|Modal\.confirm" src/app/` = 0.
- [ ] `grep -c "<FormInput type=.tel." src/app/` = 0 (replaced with `<PhoneInput>`).
- [ ] Every destructive action is gated by `alertDialog.confirm` (scan for `onClick` handlers next to "Delete" / "Cancel" / "Archive" labels).

### Utility-class cleanup on settings surfaces
- [ ] `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' src/app/settings --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*border-border\|className=.*bg-primary' src/app/settings --include='*.tsx'` = 0
- [ ] `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' src/app/settings --include='*.tsx'` = 0

### Gate
- [ ] tsc 0 errors, `npx next build` passes.
- [ ] `.verification-evidence` written covering the 4 most-visited settings modals (typography + spacing).

## Commit discipline

Group commits by setting section, not per-field:

1. settings/services add+edit modal (NumberInput for price + duration)
2. settings/tax-rates + settings/invoices (NumberInput for rates + currency fields)
3. settings/locations (PhoneInput + TimePicker for opening hours)
4. settings/busy-times (TimePicker start/end)
5. settings/users (PhoneInput)
6. settings/tags (ensure contrast gate — surface a warning if user picks a colour that fails contrast)
7. Destructive-confirm sweep across every settings page — single coordinated commit
8. Toast migration — swap every `message.*` / `notification.*` for `toast.*` — single coordinated commit (grep-driven)
9. Wave 5 Plan 04 status flip + session log

## Known pitfalls

- Some AntD `message.*` callers are inside server actions (Route Handlers) — `toast.*` runs client-only, so the server action has to return a success signal and a client component has to fire the toast. This is standard sonner pattern; document the idiom in MDX as part of Plan 06.
- `alertDialog.confirm` is imperative and returns a Promise. Some existing call sites use a state-ful confirm (`setShowDeleteModal(true)` + modal in JSX) — delete the state variables and the JSX when you migrate, or the old confirm will linger.
- `window.confirm` blocks the JS thread; `alertDialog.confirm` is async. If any handler depends on the synchronous boolean return, it needs to be awaited or restructured.
- PhoneInput stores E.164; if the backend currently receives free-form strings and stores them as-is, existing records stay as-typed. Only NEW saves hit E.164 format (per ds-plans/PhoneInput.md open question 1). Document this behaviour in the session log.

## Open questions

1. **Backfill phone numbers to E.164** — out of scope for this plan but queue the script if Jim wants it. Could be a small `scripts/backfill-phones.ts` that runs `parsePhoneNumberFromString()` per row.
2. **Locale** — all pickers locked to en-AU per plan defaults. Confirm no international users need a non-AU locale on their tax / currency / date fields.
3. **Contrast warning on tags** — if a user picks a colour that fails 4.5:1 against white, do we block save or just warn? Lean "warn only" for v1; hard-block is a product decision.
