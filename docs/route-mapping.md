# Route Mapping: Production vs Localhost

Maps `acme.splose.com` routes to `localhost:3000` equivalents for dual-tab comparison.

**Production base:** `https://acme.splose.com`
**Localhost base:** `http://localhost:3000`

## ID Mapping

Production uses real numeric IDs. Localhost uses Prisma CUIDs.

**Canonical reference patient:** Production `446604` (Harry Nguyen) ↔ Localhost `cmngtw7n9005eycwg4e67506h` (Noah Campbell). Use these IDs for all patient/client detail page comparisons.

| Entity | Production ID (example) | Localhost ID |
|---|---|---|
| Patient/Client | `446604` (Harry Nguyen) | `cmngtw7n9005eycwg4e67506h` (Noah Campbell) |
| Contact | `416008` | `1` |
| Invoice | `14130707` | `cmngtwrue007kycwg65dgipx3` (INV-012) |
| Note (Draft) | `35255497` (patient 5918810) | `cmngtwibv006rycwgpdt246vd` (client cmngtw7n9005eycwg4e67506h) |
| Note (Final) | `35255656` (patient 5918810) | (no Final notes in seed — use Draft for view page too) |
| Payment | `14689638` | (use first available) |
| Batch Invoice | `330044` | `1` |
| Case | `740288` | (use first available) |

## Core Pages

| Production Route | Localhost Route | Notes |
|---|---|---|
| `/` | `/` | Dashboard |
| `/calendar/week/{d}/{m}/{y}` | `/calendar` | Week view. Production requires dated URL — construct with current date (e.g. `/calendar/week/25/3/2026`). Plain `/calendar` redirects to dashboard. |
| `/calendar/month/{d}/{m}/{y}` | `/calendar?state=month-view` | Month view. Same date construction rule. |
| `/calendar/day/{d}/{m}/{y}` | `/calendar?state=day-view` | Day view. Same date construction rule. |

### Calendar comparison checklist

Production calendar requires `/calendar/{view}/{d}/{m}/{y}` format. Localhost uses `/calendar` with `?state=` query params.

Compare these states in order:

1. **Week view** (default) — Production: `/calendar/week/{d}/{m}/{y}`, Localhost: `/calendar`
2. **Day view** — Production: `/calendar/day/{d}/{m}/{y}`, Localhost: `/calendar?state=day-view`
3. **Month view** — Production: `/calendar/month/{d}/{m}/{y}`, Localhost: `/calendar?state=month-view`
4. **Rooms/Resources view** — Switch via Calendar/Rooms toggle on both tabs (from week view)
5. **Location filter on** — Select a location, compare filtered columns
6. **Location filter off** — Deselect location filter, compare layout
7. **Practitioner filter on** — Select specific practitioner(s), compare filtered view
8. **Practitioner filter off** — Show all practitioners
| `/patients` | `/clients` | Different entity name |
| `/patients/446604/details` | `/clients/cmngtw7n9005eycwg4e67506h` | Default tab = details |
| `/patients/446604/appointments` | `/clients/cmngtw7n9005eycwg4e67506h/appointments` | |
| `/patients/446604/communications` | `/clients/cmngtw7n9005eycwg4e67506h/communications` | |
| `/patients/446604/files` | `/clients/cmngtw7n9005eycwg4e67506h/files` | |
| `/patients/446604/notes` | `/clients/cmngtw7n9005eycwg4e67506h/notes` | |
| `/patients/446604/cases` | `/clients/cmngtw7n9005eycwg4e67506h/cases` | |
| `/patients/446604/support-activities` | `/clients/cmngtw7n9005eycwg4e67506h/support-activities` | |
| `/patients/446604/forms` | `/clients/cmngtw7n9005eycwg4e67506h/forms` | |
| `/patients/446604/invoices` | `/clients/cmngtw7n9005eycwg4e67506h/invoices` | |
| `/patients/446604/payments` | `/clients/cmngtw7n9005eycwg4e67506h/payments` | |
| `/patients/446604/statements` | `/clients/cmngtw7n9005eycwg4e67506h/statements` | |
| `/patients/446604/letters` | `/clients/cmngtw7n9005eycwg4e67506h/letters` | |
| `/patients/446604/practitioner-access` | `/clients/cmngtw7n9005eycwg4e67506h/practitioner-access` | |
| `/patients/new` | `/clients/new` | Not in state registry yet |
| `/contacts` | `/contacts` | |
| `/contacts/{id}/details` | `/contacts/1` | |
| `/contacts/{id}/cases` | `/contacts/1?tab=cases` | Tab variant |
| `/contacts/{id}/invoices` | `/contacts/1?tab=invoices` | Tab variant |
| `/contacts/{id}/letters` | `/contacts/1?tab=letters` | Tab variant |
| `/contacts/new` | `/contacts/new` | Not in state registry yet |
| `/waitlist` | `/waitlist` | |
| `/invoices` | `/invoices` | |
| `/invoices/{id}/view` | `/invoices/{id}` | Different path shape |
| `/invoices/batch-invoice` | `/invoices/batch-invoice` | |
| `/invoices/batch-invoice/{id}` | `/invoices/batch-invoice/1` | |
| `/invoices/batch-invoice/new` | `/invoices/batch-invoice/new` | Not in registry |
| `/invoices/batch-invoice/preview` | `/invoices/batch-invoice/preview` | |
| `/payments` | `/payments` | |
| `/payments/{id}/view` | (no equivalent) | Payment view page not implemented yet |
| `/payments/new` | `/payments/new` | |
| `/notes/{id}/view` | `/notes/{id}` | Final notes go to view |
| `/notes/{id}/edit` | `/notes/{id}/edit` | Draft notes go to edit |
| `/notes/new` | `/notes/new` | Not in registry |
| `/products` | `/products` | |

### Notes comparison checklist

Production note IDs go stale frequently (notes get deleted/finalized). **Do not hardcode a single production note ID.** Instead, find a fresh one each session:

1. Navigate to `https://acme.splose.com/patients/5918810/notes` (patient "a a" — has 16+ notes)
2. Look for a **Draft** note in the list (Draft notes open in `/notes/{id}/edit`, Final notes open in `/notes/{id}/view`)
3. Click on a Draft note — the URL will contain the current note ID (e.g. `/notes/35255497/edit?patientId=5918810`)
4. Use that ID for the production comparison tab

**Why not Harry Nguyen (446604)?** He has few/no notes. Patient 5918810 ("a a") is the test patient with the most notes on production.

**Edit vs View:** Production redirects Final notes to `/view` (edit URL returns 404). Only Draft notes can be compared on the `/edit` route. The `/view` route works for both statuses.

## Reports

| Production Route | Localhost Route |
|---|---|
| `/reports` | `/reports` |
| `/reports/appointments` | `/reports/appointments` |
| `/reports/performance` | `/reports/performance` |
| `/reports/progress-notes` | `/reports/progress-notes` |
| `/reports/aged-debtors` | `/reports/aged-debtors` |
| `/reports/billed-items` | `/reports/billed-items` |
| `/reports/cases` | `/reports/cases` |
| `/reports/form` | `/reports/form` |
| `/reports/patients` | `/reports/patients` |
| `/reports/payments` | `/reports/payments` |
| `/reports/support-activities` | `/reports/support-activities` |
| `/reports/uninvoiced` | `/reports/uninvoiced` |
| `/reports/waitlist` | `/reports/waitlist` |
| `/reports/ndis-bulk-upload` | `/reports/ndis-bulk-upload` |
| `/reports/ndis-bulk-upload/new` | `/reports/ndis-bulk-upload/new` |
| `/reports/ndis-bulk-upload/{id}` | `/reports/ndis-bulk-upload/1` |

## Settings

Production uses camelCase and `/templates/` prefix for some routes. Localhost uses kebab-case with flat paths.

| Production Route | Localhost Route |
|---|---|
| `/settings` or `/settings/details` | `/settings` |
| `/settings/integrations` | `/settings/integrations` |
| `/settings/smsSettings` | `/settings/sms-settings` |
| `/settings/ai` | `/settings/ai` |
| `/settings/locations` | `/settings/locations` |
| `/settings/custom-fields` | `/settings/custom-fields` |
| `/settings/rooms-resources` | `/settings/rooms-resources` |
| `/settings/services` | `/settings/services` |
| `/settings/busy-times` | `/settings/busy-times` |
| `/settings/cancellationReasons` | `/settings/cancellation-reasons` |
| `/settings/online-booking` | `/settings/online-bookings` |
| `/settings/communications/types` | `/settings/communication-types` |
| `/settings/tags` | `/settings/tags` |
| `/settings/referralTypes` | `/settings/referral-types` |
| `/settings/users` | `/settings/users` |
| `/settings/user-groups` | `/settings/user-groups` |
| `/settings/templates/appointments` | `/settings/appointment-templates` |
| `/settings/templates/emails` | `/settings/email-templates` |
| `/settings/templates/forms` | `/settings/forms` |
| `/settings/templates/progress-notes` | `/settings/progress-notes` |
| `/settings/templates/letters` | `/settings/letter-templates` |
| `/settings/templates/body-charts` | `/settings/body-charts` |
| `/settings/invoices` | `/settings/invoice-settings` |
| `/settings/payments` | `/settings/payment-settings` |
| `/settings/tax-rates` | `/settings/tax-rates` |
| `/settings/export` | `/settings/data-export` |
| `/settings/import` | `/settings/data-import` |
| `/settings/patient-data` | (no equivalent) |

## Other

| Production Route | Localhost Route |
|---|---|
| `/patient-form/{id}/view` | `/patient-form/1/view` |
| `/online-booking/{uuid}` | `/online-booking` | Public booking preview. Production URL is dynamic/ephemeral — navigate to `/settings/online-booking/{id}` and click Preview to get the live URL. |
| `/login` | `/login` |

## Usage

When running dual-tab comparison:
1. Look up the page's localhost route in the state registry
2. Find the corresponding production route in this table
3. Navigate Tab A to `https://acme.splose.com{production_route}`
4. Navigate Tab B to `http://localhost:3000{localhost_route}`
5. Both tabs should show the equivalent page for measurement comparison

**Authentication:** `acme.splose.com` requires login. Chrome MCP uses Jim's actual Chrome browser, so if Jim is logged in, all routes are accessible. If Chrome navigates to a production route and gets redirected to `/login`, ask Jim to log into `acme.splose.com` in Chrome first. If auth can't be established, fall back to static reference screenshot comparison for that session.
