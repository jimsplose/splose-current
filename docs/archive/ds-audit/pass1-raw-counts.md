# DS Audit — Pass 1: Raw mechanical counts

**Scan date:** 2026-04-20
**Scope:** `src/app/**/page.tsx` (~91), `src/app/**/*Client.tsx` (8), and 9 in-scope DS templates/composites (`ListPage`, `DetailPage`, `FormPage`, `SettingsListPage`, `Modal`, `Navbar`, `TopNav`, `SideNav`, `PageHeader`). Total: **111 in-scope files**.
**Out of scope:** all other `src/components/ds/*.tsx` primitives (inline styles inside them ARE the implementation), `src/components/ds/stories/**`, test files, `docs/`, generated code. Primitive-level files are still read for Pass 3 consolidation (not here).
**Methodology:** Deterministic grep-based counts. No interpretation — pure data. See the "Methodology log" at the bottom for exact commands.
**Output purpose:** Input for Pass 2 (violation classification on top-20 + stratified sample) and Pass 3 (DS consolidation). Per the spec, a violation is any `style={{` occurrence that duplicates DS responsibility (color / background / border / font / shadow, or a shape-forming inline). Pure-layout inlines (margin / padding / gap / flex / position / width / height) are NOT violations but ARE counted here. Pass 2 applies the classifier.

## Headline numbers

| Metric | Value |
|--------|-------|
| Total in-scope files | 111 |
| Files with >= 1 `style={{` | 98 |
| Files with 0 `style={{` | 13 |
| Total `style={{` occurrences (Section A sum) | 1422 |
| Total Tailwind `text-*` occurrences (Section B) | 497 |
| Total Tailwind `bg-*` occurrences (Section B) | 3 |
| Total Tailwind `border-*` occurrences (Section B) | 27 |
| Total Tailwind `font-*` occurrences (Section B) | 1 |
| DS components with <= 3 imports ("possibly under-adopted") | 26 of 49 |
| Worst file | `src/app/clients/[id]/ClientDetailClient.tsx` (86) |

> Pass 1 counts **all** `style={{` occurrences (including pure-layout inlines like `style={{ marginLeft: 12 }}` that the spec's classifier does not count as violations). Pass 2 applies the classifier file-by-file; expect the Pass-2 "real violation" numbers to be lower than the Pass-1 raw numbers. Pass 1's job is to rank files so Pass 2 knows where to look.

---

## Section A — Per-file inline-style occurrence counts

Ranked descending. All 111 in-scope files listed (including zero-count files at the bottom). Count = occurrences of literal `style={{` per file via `grep -c`.

| Rank | File | Violations |
|------|------|------------|
| 1 | `src/app/clients/[id]/ClientDetailClient.tsx` | 86 |
| 2 | `src/app/DashboardClient.tsx` | 82 |
| 3 | `src/app/notes/[id]/edit/page.tsx` | 73 |
| 4 | `src/app/invoices/[id]/page.tsx` | 58 |
| 5 | `src/app/waitlist/page.tsx` | 52 |
| 6 | `src/app/settings/details/page.tsx` | 51 |
| 7 | `src/app/settings/data-import/page.tsx` | 50 |
| 8 | `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 48 |
| 9 | `src/app/settings/online-bookings/[id]/page.tsx` | 47 |
| 10 | `src/app/reports/page.tsx` | 46 |
| 11 | `src/app/settings/forms/[id]/page.tsx` | 42 |
| 12 | `src/app/products/page.tsx` | 38 |
| 13 | `src/app/invoices/new/page.tsx` | 36 |
| 14 | `src/app/contacts/[id]/page.tsx` | 35 |
| 15 | `src/app/notes/[id]/page.tsx` | 34 |
| 16 | `src/app/payments/new/page.tsx` | 33 |
| 17 | `src/app/reports/performance/page.tsx` | 22 |
| 18 | `src/app/online-booking/page.tsx` | 22 |
| 19 | `src/app/settings/ai/page.tsx` | 20 |
| 20 | `src/app/reports/progress-notes/page.tsx` | 20 |
| 21 | `src/app/settings/custom-fields/page.tsx` | 18 |
| 22 | `src/app/login/page.tsx` | 18 |
| 23 | `src/app/reports/ndis-bulk-upload/new/page.tsx` | 17 |
| 24 | `src/app/invoices/batch-invoice/[id]/page.tsx` | 17 |
| 25 | `src/app/settings/users/[id]/UserDetailClient.tsx` | 16 |
| 26 | `src/app/notes/new/page.tsx` | 16 |
| 27 | `src/app/settings/progress-notes/edit/[id]/page.tsx` | 15 |
| 28 | `src/app/payments/page.tsx` | 14 |
| 29 | `src/app/invoices/batch-invoice/page.tsx` | 14 |
| 30 | `src/app/clients/[id]/invoices/page.tsx` | 13 |
| 31 | `src/app/clients/ClientsPageClient.tsx` | 13 |
| 32 | `src/app/settings/integrations/page.tsx` | 12 |
| 33 | `src/app/settings/data-import/csv/page.tsx` | 12 |
| 34 | `src/app/patient-form/[id]/view/page.tsx` | 12 |
| 35 | `src/app/settings/sms-settings/page.tsx` | 10 |
| 36 | `src/app/settings/locations/page.tsx` | 10 |
| 37 | `src/app/contacts/page.tsx` | 10 |
| 38 | `src/app/reports/uninvoiced/page.tsx` | 9 |
| 39 | `src/app/reports/appointments/page.tsx` | 9 |
| 40 | `src/app/clients/[id]/statements/page.tsx` | 9 |
| 41 | `src/app/clients/[id]/payments/page.tsx` | 9 |
| 42 | `src/app/clients/[id]/notes/page.tsx` | 9 |
| 43 | `src/components/ds/DetailPage.tsx` | 8 |
| 44 | `src/app/settings/tags/page.tsx` | 8 |
| 45 | `src/app/settings/services/page.tsx` | 8 |
| 46 | `src/app/settings/progress-notes/page.tsx` | 8 |
| 47 | `src/app/settings/invoice-settings/page.tsx` | 8 |
| 48 | `src/app/settings/appointment-templates/new/page.tsx` | 8 |
| 49 | `src/app/reports/patients/page.tsx` | 8 |
| 50 | `src/app/reports/form/page.tsx` | 8 |
| 51 | `src/app/clients/[id]/support-activities/page.tsx` | 8 |
| 52 | `src/app/clients/[id]/files/page.tsx` | 8 |
| 53 | `src/app/clients/[id]/communications/page.tsx` | 8 |
| 54 | `src/app/settings/body-charts/page.tsx` | 7 |
| 55 | `src/app/reports/aged-debtors/page.tsx` | 7 |
| 56 | `src/app/clients/[id]/practitioner-access/page.tsx` | 7 |
| 57 | `src/app/settings/rooms-resources/page.tsx` | 6 |
| 58 | `src/app/reports/payments/page.tsx` | 6 |
| 59 | `src/app/reports/billed-items/page.tsx` | 6 |
| 60 | `src/app/invoices/batch-invoice/preview/page.tsx` | 6 |
| 61 | `src/components/ds/Navbar.tsx` | 5 |
| 62 | `src/app/settings/users/page.tsx` | 5 |
| 63 | `src/app/settings/user-groups/page.tsx` | 5 |
| 64 | `src/app/settings/data-export/page.tsx` | 5 |
| 65 | `src/app/reports/waitlist/page.tsx` | 5 |
| 66 | `src/app/clients/[id]/forms/page.tsx` | 5 |
| 67 | `src/components/ds/TopNav.tsx` | 4 |
| 68 | `src/components/ds/SettingsListPage.tsx` | 4 |
| 69 | `src/app/settings/services/edit/[id]/EditServiceClient.tsx` | 4 |
| 70 | `src/app/settings/payment-settings/page.tsx` | 4 |
| 71 | `src/app/settings/locations/new/page.tsx` | 4 |
| 72 | `src/app/settings/cancellation-reasons/page.tsx` | 4 |
| 73 | `src/app/reports/support-activities/page.tsx` | 4 |
| 74 | `src/app/reports/cases/page.tsx` | 4 |
| 75 | `src/app/invoices/InvoicesClient.tsx` | 4 |
| 76 | `src/components/ds/ListPage.tsx` | 3 |
| 77 | `src/components/ds/FormPage.tsx` | 3 |
| 78 | `src/app/settings/locations/edit/[id]/EditLocationClient.tsx` | 3 |
| 79 | `src/app/settings/forms/page.tsx` | 3 |
| 80 | `src/app/settings/appointment-templates/page.tsx` | 3 |
| 81 | `src/app/clients/new/page.tsx` | 3 |
| 82 | `src/app/clients/[id]/letters/page.tsx` | 3 |
| 83 | `src/app/clients/[id]/cases/page.tsx` | 3 |
| 84 | `src/components/ds/PageHeader.tsx` | 2 |
| 85 | `src/app/waitlist/new/page.tsx` | 2 |
| 86 | `src/app/settings/tax-rates/page.tsx` | 2 |
| 87 | `src/app/settings/page.tsx` | 2 |
| 88 | `src/app/settings/online-bookings/page.tsx` | 2 |
| 89 | `src/app/settings/client-data/page.tsx` | 2 |
| 90 | `src/app/settings/busy-times/page.tsx` | 2 |
| 91 | `src/components/ds/Modal.tsx` | 1 |
| 92 | `src/app/settings/letter-templates/page.tsx` | 1 |
| 93 | `src/app/settings/letter-templates/edit/[id]/page.tsx` | 1 |
| 94 | `src/app/settings/email-templates/page.tsx` | 1 |
| 95 | `src/app/settings/email-templates/edit/[id]/page.tsx` | 1 |
| 96 | `src/app/reports/ndis-bulk-upload/page.tsx` | 1 |
| 97 | `src/app/reports/ndis-bulk-upload/[id]/page.tsx` | 1 |
| 98 | `src/app/contacts/new/page.tsx` | 1 |
| 99 | `src/components/ds/SideNav.tsx` | 0 |
| 100 | `src/app/settings/users/[id]/page.tsx` | 0 |
| 101 | `src/app/settings/services/edit/[id]/page.tsx` | 0 |
| 102 | `src/app/settings/referral-types/page.tsx` | 0 |
| 103 | `src/app/settings/locations/edit/[id]/page.tsx` | 0 |
| 104 | `src/app/settings/communication-types/page.tsx` | 0 |
| 105 | `src/app/products/new/page.tsx` | 0 |
| 106 | `src/app/page.tsx` | 0 |
| 107 | `src/app/invoices/page.tsx` | 0 |
| 108 | `src/app/clients/page.tsx` | 0 |
| 109 | `src/app/clients/[id]/page.tsx` | 0 |
| 110 | `src/app/clients/[id]/appointments/page.tsx` | 0 |
| 111 | `src/app/calendar/page.tsx` | 0 |

---

## Section B — Tailwind-token bypass counts

Each category counts `className="..."` attributes that contain at least one Tailwind token of that shape (`text-*`, `bg-*`, `border-*`, `font-*`). These are frequently places where a DS component should carry the variant instead. Only non-zero rows shown per category.

> **Caveat:** These matches include DS-approved token classes (e.g. `text-body-md`, `text-text-secondary`, `bg-white` used inside Cards). The counts are a prospecting signal for Pass 2, not a violation count. A `text-*` occurrence inside a `<Text variant="…">` wrapper is already correct; the audit asks Pass 2 to identify the *bypass* cases.

### B.1 Tailwind text-* occurrences (should likely be `<Text>`)

| File | text-* count |
|------|--------------|
| `src/app/settings/data-import/page.tsx` | 33 |
| `src/app/settings/online-bookings/[id]/page.tsx` | 32 |
| `src/app/settings/ai/page.tsx` | 27 |
| `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 25 |
| `src/app/settings/details/page.tsx` | 24 |
| `src/app/products/page.tsx` | 17 |
| `src/app/invoices/[id]/page.tsx` | 16 |
| `src/app/clients/[id]/ClientDetailClient.tsx` | 16 |
| `src/app/settings/forms/[id]/page.tsx` | 15 |
| `src/app/settings/custom-fields/page.tsx` | 12 |
| `src/app/settings/invoice-settings/page.tsx` | 11 |
| `src/app/settings/data-export/page.tsx` | 11 |
| `src/app/notes/[id]/page.tsx` | 10 |
| `src/app/invoices/batch-invoice/page.tsx` | 10 |
| `src/app/settings/users/page.tsx` | 9 |
| `src/app/settings/progress-notes/edit/[id]/page.tsx` | 9 |
| `src/app/settings/data-import/csv/page.tsx` | 9 |
| `src/app/reports/performance/page.tsx` | 9 |
| `src/app/settings/users/[id]/UserDetailClient.tsx` | 8 |
| `src/app/settings/locations/page.tsx` | 8 |
| `src/app/reports/progress-notes/page.tsx` | 8 |
| `src/app/contacts/[id]/page.tsx` | 8 |
| `src/app/clients/[id]/invoices/page.tsx` | 8 |
| `src/app/clients/[id]/cases/page.tsx` | 8 |
| `src/app/DashboardClient.tsx` | 8 |
| `src/app/settings/sms-settings/page.tsx` | 7 |
| `src/app/settings/body-charts/page.tsx` | 7 |
| `src/app/settings/payment-settings/page.tsx` | 6 |
| `src/app/reports/page.tsx` | 6 |
| `src/app/invoices/InvoicesClient.tsx` | 6 |
| `src/app/contacts/page.tsx` | 6 |
| `src/app/settings/locations/edit/[id]/EditLocationClient.tsx` | 5 |
| `src/app/patient-form/[id]/view/page.tsx` | 5 |
| `src/app/invoices/batch-invoice/[id]/page.tsx` | 5 |
| `src/app/clients/[id]/practitioner-access/page.tsx` | 5 |
| `src/app/clients/[id]/forms/page.tsx` | 5 |
| `src/app/clients/[id]/files/page.tsx` | 5 |
| `src/app/clients/[id]/communications/page.tsx` | 5 |
| `src/app/waitlist/page.tsx` | 4 |
| `src/app/settings/tags/page.tsx` | 4 |
| `src/app/settings/appointment-templates/new/page.tsx` | 4 |
| `src/app/payments/page.tsx` | 4 |
| `src/app/notes/[id]/edit/page.tsx` | 4 |
| `src/app/invoices/batch-invoice/preview/page.tsx` | 4 |
| `src/app/clients/[id]/letters/page.tsx` | 4 |
| `src/app/settings/user-groups/page.tsx` | 3 |
| `src/app/settings/progress-notes/page.tsx` | 3 |
| `src/app/clients/[id]/statements/page.tsx` | 3 |
| `src/app/clients/[id]/notes/page.tsx` | 3 |
| `src/app/settings/cancellation-reasons/page.tsx` | 2 |
| `src/app/reports/payments/page.tsx` | 2 |
| `src/app/reports/ndis-bulk-upload/new/page.tsx` | 2 |
| `src/app/reports/billed-items/page.tsx` | 2 |
| `src/app/reports/aged-debtors/page.tsx` | 2 |
| `src/app/login/page.tsx` | 2 |
| `src/app/clients/ClientsPageClient.tsx` | 2 |
| `src/app/waitlist/new/page.tsx` | 1 |
| `src/app/settings/tax-rates/page.tsx` | 1 |
| `src/app/settings/services/page.tsx` | 1 |
| `src/app/settings/services/edit/[id]/EditServiceClient.tsx` | 1 |
| `src/app/settings/rooms-resources/page.tsx` | 1 |
| `src/app/settings/online-bookings/page.tsx` | 1 |
| `src/app/settings/letter-templates/page.tsx` | 1 |
| `src/app/settings/letter-templates/edit/[id]/page.tsx` | 1 |
| `src/app/settings/integrations/page.tsx` | 1 |
| `src/app/settings/forms/page.tsx` | 1 |
| `src/app/settings/email-templates/page.tsx` | 1 |
| `src/app/settings/email-templates/edit/[id]/page.tsx` | 1 |
| `src/app/settings/appointment-templates/page.tsx` | 1 |
| `src/app/reports/waitlist/page.tsx` | 1 |
| `src/app/reports/uninvoiced/page.tsx` | 1 |
| `src/app/reports/patients/page.tsx` | 1 |
| `src/app/reports/cases/page.tsx` | 1 |
| `src/app/reports/appointments/page.tsx` | 1 |
| `src/app/online-booking/page.tsx` | 1 |

### B.2 Tailwind bg-* occurrences (should likely be DS Card/Alert/etc.)

| File | bg-* count |
|------|------------|
| `src/app/reports/progress-notes/page.tsx` | 2 |
| `src/app/products/page.tsx` | 1 |

### B.3 Tailwind border-* occurrences (should likely be Divider/Card)

| File | border-* count |
|------|----------------|
| `src/app/settings/locations/edit/[id]/EditLocationClient.tsx` | 4 |
| `src/app/reports/progress-notes/page.tsx` | 4 |
| `src/app/invoices/batch-invoice/page.tsx` | 3 |
| `src/app/products/page.tsx` | 2 |
| `src/app/invoices/[id]/page.tsx` | 2 |
| `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 2 |
| `src/app/settings/users/[id]/UserDetailClient.tsx` | 1 |
| `src/app/settings/data-import/csv/page.tsx` | 1 |
| `src/app/settings/data-export/page.tsx` | 1 |
| `src/app/settings/busy-times/page.tsx` | 1 |
| `src/app/reports/ndis-bulk-upload/page.tsx` | 1 |
| `src/app/reports/ndis-bulk-upload/new/page.tsx` | 1 |
| `src/app/reports/ndis-bulk-upload/[id]/page.tsx` | 1 |
| `src/app/payments/page.tsx` | 1 |
| `src/app/payments/new/page.tsx` | 1 |
| `src/app/invoices/batch-invoice/preview/page.tsx` | 1 |

### B.4 Tailwind font-* occurrences (should likely be `<Text>`)

| File | font-* count |
|------|--------------|
| `src/app/DashboardClient.tsx` | 1 |

### Totals

| Category | Total |
|----------|-------|
| text-* | 497 |
| bg-* | 3 |
| border-* | 27 |
| font-* | 1 |

---

## Section C — DS component import frequency

For each file under `src/components/ds/*.tsx` (excluding `stories/` and `index.ts`), the count of import occurrences in `src/app/**`. Extracted by scanning every `from '@/components/ds'` import block, splitting the braces on commas, and counting component names (including multi-line import blocks). Components imported 3 or fewer times are flagged **possibly under-adopted** per the plan.

Note: some popular names in the raw extraction are DS re-exports that live inside the primitives (e.g. `Th`, `Td`, `Tr`, `TableHead`, `TableBody`, `DropdownItem`, `DropdownTriggerButton`, `LinkCell`, `ActionsCell`, `SideNavSection`, `statusVariant`). They do not correspond to a top-level `.tsx` file and therefore do not appear in this table; they confirm healthy usage of the DS barrel.

| Component | Import count in src/app | Flag |
|-----------|-------------------------|------|
| `Button` | 45 |  |
| `Card` | 25 |  |
| `DataTable` | 23 |  |
| `FormInput` | 22 |  |
| `PageHeader` | 19 |  |
| `Badge` | 18 |  |
| `FormSelect` | 17 |  |
| `Text` | 16 |  |
| `Pagination` | 14 |  |
| `Dropdown` | 12 |  |
| `Divider` | 12 |  |
| `Modal` | 11 |  |
| `Checkbox` | 11 |  |
| `Grid` | 10 |  |
| `FormTextarea` | 9 |  |
| `Toggle` | 8 |  |
| `EmptyState` | 7 |  |
| `SearchBar` | 6 |  |
| `FormPage` | 6 |  |
| `ListPage` | 4 |  |
| `ColorDot` | 4 |  |
| `Avatar` | 4 |  |
| `Alert` | 4 |  |
| `Tab` | 3 | possibly under-adopted |
| `SideNav` | 2 | possibly under-adopted |
| `SettingsListPage` | 2 | possibly under-adopted |
| `OnOffBadge` | 2 | possibly under-adopted |
| `Navbar` | 2 | possibly under-adopted |
| `List` | 2 | possibly under-adopted |
| `Filter` | 2 | possibly under-adopted |
| `ThemeProvider` | 1 | possibly under-adopted |
| `Stat` | 1 | possibly under-adopted |
| `Spinner` | 1 | possibly under-adopted |
| `RadioGroup` | 1 | possibly under-adopted |
| `HintIcon` | 1 | possibly under-adopted |
| `FormColorPicker` | 1 | possibly under-adopted |
| `FileUpload` | 1 | possibly under-adopted |
| `Collapse` | 1 | possibly under-adopted |
| `TopNav` | 0 | possibly under-adopted |
| `Status` | 0 | possibly under-adopted |
| `Section` | 0 | possibly under-adopted |
| `RichTextEditor` | 0 | possibly under-adopted |
| `ReorderModal` | 0 | possibly under-adopted |
| `IconText` | 0 | possibly under-adopted |
| `FormField` | 0 | possibly under-adopted |
| `EmailPreview` | 0 | possibly under-adopted |
| `DetailPage` | 0 | possibly under-adopted |
| `DateRangeFilter` | 0 | possibly under-adopted |
| `AsyncSelect` | 0 | possibly under-adopted |

**Under-adopted observations (for Pass 3 consolidation input):**

- `DetailPage` has **0** direct imports despite being one of the four templates the plan names as in-scope — this strongly suggests most detail pages hand-roll the shell. Confirm in Pass 2 against the Top-10.
- `TopNav` has **0** direct imports — `Navbar` (2) appears to be the adopted top-chrome component. Consolidation candidate.
- `AsyncSelect`, `DateRangeFilter`, `EmailPreview`, `FormField`, `IconText`, `ReorderModal`, `RichTextEditor`, `Section`, `Status` all show 0 imports — Pass 3 should confirm whether they are indirectly re-exported or genuine dead code.
- `Text` at 16 imports vs 1422 `style={{` occurrences (and 497 `text-*` className hits) is the single strongest signal: typography is being inlined or className-tokenised rather than flowing through the DS `<Text>` component.

---

## Section D — Candidate duplicate JSX patterns

Six JSX shapes scanned across `src/app/**/*.tsx`, with first 5 file:line matches per pattern. These patterns are the prospecting set for Pass 2 classification into `AdoptAsIs` / `ExtendDS:<Component>:<prop>` / `NewDS:<ProposedName>`.

### D.1 `<span style={{...}}>...` — inline styled text

**Total occurrences:** 48

First 5 matches:

- `src/app/waitlist/page.tsx:739` — `<span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service}</span>`
- `src/app/clients/[id]/statements/page.tsx:37` — `<span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>&mdash;</span>`
- `src/app/clients/[id]/notes/page.tsx:63` — `<span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>&raquo;</span>`
- `src/app/clients/[id]/notes/page.tsx:64` — `<span style={{ fontSize: 14 }}>{note.template}</span>`
- `src/app/clients/[id]/communications/page.tsx:248` — `<span style={{ color: 'var(--color-text-secondary)' }}>{comm.direction}</span>`

### D.2 `<div style={{...border...}}>` — bordered containers (Card candidate)

**Total occurrences:** 66

First 5 matches:

- `src/app/clients/[id]/ClientDetailClient.tsx:282` — `<div style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary)', padding: 16, color: 'white' }}>`
- `src/app/clients/[id]/files/page.tsx:134` — `<div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, borderRadius: 8, backgroundColor: '#1f2937', ... }}>`
- `src/app/clients/[id]/communications/page.tsx:293` — `<div className="text-body-md whitespace-pre-wrap" style={{ borderRadius: 8, backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>`
- `src/app/settings/online-bookings/[id]/page.tsx:82` — `<div style={{ borderBottom: '1px solid var(--color-border)', padding: '0 24px', margin: '-24px -24px 0' }}>`
- `src/app/settings/online-bookings/[id]/page.tsx:146` — `<div style={{ borderRadius: 8, border: '1px solid var(--color-border)', padding: 16 }}>`

### D.3 `<div style={{...background...}}>` — backgrounded containers

**Total occurrences:** 64

First 5 matches:

- `src/app/clients/[id]/ClientDetailClient.tsx:282` — `<div style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary)', padding: 16, color: 'white' }}>`
- `src/app/clients/[id]/files/page.tsx:134` — `<div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, borderRadius: 8, backgroundColor: '#1f2937', ... }}>`
- `src/app/clients/[id]/communications/page.tsx:293` — `<div className="text-body-md whitespace-pre-wrap" style={{ borderRadius: 8, backgroundColor: 'var(--color-fill-quaternary)', padding: 16 }}>`
- `src/app/settings/online-bookings/[id]/page.tsx:316` — `<div style={{ flex: 1, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: '10px 16px' }}>`
- `src/app/settings/online-bookings/[id]/page.tsx:356` — `<div style={{ width: 400, flexShrink: 0, borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: 24 }}>`

### D.4 `<button style={{...}}>` — inline styled buttons

**Total occurrences:** 6

First 5 matches:

- `src/app/settings/online-bookings/[id]/page.tsx:149` — `<button style={{ borderRadius: 8, padding: '10px 24px', color: 'white', backgroundColor: buttonColor }} className="text-label-lg">`
- `src/app/settings/online-bookings/[id]/page.tsx:152` — `<button style={{ borderRadius: 8, padding: '10px 24px', backgroundColor: secondaryColor, color: buttonColor }} className="text-label-lg">`
- `src/app/settings/data-import/page.tsx:191` — `<button type="button" onClick={handleImportNext} style={{ display: 'flex', flexDirection: 'column', ... border: '1px solid var(--color-border)', ... }}>`
- `src/app/settings/data-import/page.tsx:198` — `<button type="button" onClick={handleImportNext} style={{ display: 'flex', flexDirection: 'column', ... border: '1px solid var(--color-border)', ... }}>`
- `src/app/settings/progress-notes/edit/[id]/page.tsx:160` — `<button style={{ borderRadius: 4, padding: 4, color: 'var(--color-text-secondary)' }}>`

### D.5 `className="inline-flex items-center"` — badge / button shapes

**Total occurrences:** 2

First 5 matches:

- `src/app/settings/user-groups/page.tsx:108` — `<span className="inline-flex items-center gap-1">`
- `src/app/settings/locations/edit/[id]/EditLocationClient.tsx:260` — `className="inline-flex items-center justify-center"`

### D.6 `className="flex items-center gap-*"` — icon+text rows

**Total occurrences:** 6

First 5 matches:

- `src/app/settings/user-groups/page.tsx:108` — `<span className="inline-flex items-center gap-1">`
- `src/app/settings/ai/page.tsx:307` — `<Th><div className="flex items-center gap-1">AI block <span className="text-caption-md text-text-secondary">&#8645;</span></div></Th>`
- `src/app/settings/ai/page.tsx:308` — `<Th><div className="flex items-center gap-1">Tag <span className="text-caption-md text-text-secondary">&#8645;</span></div></Th>`
- `src/app/settings/ai/page.tsx:309` — `<Th><div className="flex items-center gap-1">Created by <span className="text-caption-md text-text-secondary">&#9660;</span></div></Th>`
- `src/app/settings/ai/page.tsx:310` — `<Th><div className="flex items-center gap-1">Last modified <span className="text-caption-md text-text-secondary">&#8645;</span></div></Th>`

---

## Section E — Totals and cross-references

### Total violations across in-scope files

**1422** `style={{` occurrences (Section A sum).

### Top 20 worst pages

- `src/app/clients/[id]/ClientDetailClient.tsx` — 86 violations
- `src/app/DashboardClient.tsx` — 82 violations
- `src/app/notes/[id]/edit/page.tsx` — 73 violations
- `src/app/invoices/[id]/page.tsx` — 58 violations
- `src/app/waitlist/page.tsx` — 52 violations
- `src/app/settings/details/page.tsx` — 51 violations
- `src/app/settings/data-import/page.tsx` — 50 violations
- `src/app/invoices/[id]/InvoiceDetailClient.tsx` — 48 violations
- `src/app/settings/online-bookings/[id]/page.tsx` — 47 violations
- `src/app/reports/page.tsx` — 46 violations
- `src/app/settings/forms/[id]/page.tsx` — 42 violations
- `src/app/products/page.tsx` — 38 violations
- `src/app/invoices/new/page.tsx` — 36 violations
- `src/app/contacts/[id]/page.tsx` — 35 violations
- `src/app/notes/[id]/page.tsx` — 34 violations
- `src/app/payments/new/page.tsx` — 33 violations
- `src/app/reports/performance/page.tsx` — 22 violations
- `src/app/online-booking/page.tsx` — 22 violations
- `src/app/settings/ai/page.tsx` — 20 violations
- `src/app/reports/progress-notes/page.tsx` — 20 violations

### Low-violation stratified sample (Pass 2b input)

Ten files with between 1 and 10 `style={{` occurrences each, picked deterministically (evenly spaced across the 64-file pool sorted by path). Used by Pass 2b to catch long-tail patterns that the top-20 ranking misses.

- `src/app/clients/[id]/notes/page.tsx` — 9 violations
- `src/app/contacts/new/page.tsx` — 1 violation
- `src/app/reports/cases/page.tsx` — 4 violations
- `src/app/reports/support-activities/page.tsx` — 4 violations
- `src/app/settings/cancellation-reasons/page.tsx` — 4 violations
- `src/app/settings/invoice-settings/page.tsx` — 8 violations
- `src/app/settings/online-bookings/page.tsx` — 2 violations
- `src/app/settings/sms-settings/page.tsx` — 10 violations
- `src/components/ds/DetailPage.tsx` — 8 violations
- `src/components/ds/TopNav.tsx` — 4 violations

### Files with ZERO `style={{` occurrences

**13 files** have zero inline-style props. Listed here for completeness (they still may use className-level DS bypasses captured in Section B) but are not Pass 2 candidates.

Count only (not listed individually): **13**. These are clean from a Pass-1 perspective and at least suggest where the DS templates are being adopted successfully.

---

## Methodology log

### Commands used

In-scope file list build (run from repo root):

```bash
{
  find src/app -type f -name "page.tsx"
  find src/app -type f -name "*Client.tsx"
  echo "src/components/ds/ListPage.tsx"
  echo "src/components/ds/DetailPage.tsx"
  echo "src/components/ds/FormPage.tsx"
  echo "src/components/ds/SettingsListPage.tsx"
  echo "src/components/ds/Modal.tsx"
  echo "src/components/ds/Navbar.tsx"
  echo "src/components/ds/TopNav.tsx"
  echo "src/components/ds/SideNav.tsx"
  echo "src/components/ds/PageHeader.tsx"
} | sort -u > /tmp/in-scope-files.txt
```

Section A (per-file `style={{` count):

```bash
while IFS= read -r f; do
  [ -f "$f" ] && printf "%d\t%s\n" "$(grep -c 'style={{' "$f")" "$f"
done < /tmp/in-scope-files.txt | sort -rn -k1,1
```

Section B (Tailwind-token bypass counts, per file per category):

```bash
while IFS= read -r f; do
  text=$(grep -oE 'className="[^"]*text-[a-zA-Z0-9-]+[^"]*"' "$f" | wc -l | tr -d ' ')
  bg=$(grep -oE 'className="[^"]*bg-[a-zA-Z0-9-]+[^"]*"' "$f" | wc -l | tr -d ' ')
  border=$(grep -oE 'className="[^"]*border-[a-zA-Z0-9-]+[^"]*"' "$f" | wc -l | tr -d ' ')
  font=$(grep -oE 'className="[^"]*font-[a-zA-Z0-9-]+[^"]*"' "$f" | wc -l | tr -d ' ')
  printf "%s\t%s\t%s\t%s\t%s\n" "$text" "$bg" "$border" "$font" "$f"
done < /tmp/in-scope-files.txt
```

Section C (DS import counts):

```bash
# Extract every import-from-'@/components/ds' line (same-line AND multi-line), flatten the braces,
# split on commas, strip whitespace and 'as' aliases, then count uniquely per component name.
imports=$(grep -rhE "from ['\"]@/components/ds['\"]" src/app/)
same_line=$(echo "$imports" | grep -oE '\{[^}]*\}' | tr -d '{}' | tr ',' '\n' | sed 's/[[:space:]]//g;s/as.*//')
multi=$(grep -rhPzo "import\s*\{[^}]*\}\s*from\s*['\"]@/components/ds['\"]" src/app/ \
  | tr '\0' '\n' | grep -oE '\{[^}]*\}' | tr -d '{}' | tr ',' '\n' \
  | sed 's/[[:space:]]//g;s/as.*//')
printf "%s\n%s\n" "$same_line" "$multi" | grep -v '^$' | sort | uniq -c | sort -rn
# Then join against 'ls src/components/ds/*.tsx' basenames (sans .tsx), defaulting missing -> 0.
```

Section D (candidate duplicate JSX patterns):

```bash
grep -rnE '<span style=\{\{' src/app --include="*.tsx"
grep -rnE '<div[^>]*style=\{\{[^}]*border' src/app --include="*.tsx"
grep -rnE '<div[^>]*style=\{\{[^}]*(background|backgroundColor)' src/app --include="*.tsx"
grep -rnE '<button[^>]*style=\{\{' src/app --include="*.tsx"
grep -rnE 'className="[^"]*inline-flex items-center' src/app --include="*.tsx"
grep -rnE 'className="[^"]*flex items-center gap-' src/app --include="*.tsx"
```

Section E (low-violation sample, deterministic):

```bash
awk '$1 >= 1 && $1 <= 10 {print}' /tmp/section-a.txt | sort -k2 > /tmp/low-vio-sorted.txt
# Pool size was 64. Pick 10 evenly-spaced rows:
awk -v total=64 'BEGIN { for (i=1;i<=10;i++) picks[int(total*i/10)]=1 } picks[NR]==1' /tmp/low-vio-sorted.txt
```

### Spot check (Task 1 Step 3)

The plan's Task 1 Step 3 requires manual verification of one top-of-table entry:

- File: `src/app/clients/[id]/ClientDetailClient.tsx`
- Section A table value: **86**
- Manual `grep -c 'style={{' src/app/clients/[id]/ClientDetailClient.tsx` result: **86**
- Match: **yes**

### Files that could not be parsed

None. All 111 in-scope files were readable and produced counts.

### Known limitations and caveats

1. **Pass 1 counts `style={{` literals, not violations.** A `style={{ marginLeft: 12 }}` is a pure-layout inline and is counted here but is NOT a violation per the spec. Pass 2 applies the violation classifier file-by-file. Expect Pass-2 "true violation" totals to be noticeably lower than 1422.
2. **Section B counts include DS-approved token usage.** `text-body-md`, `text-text-secondary`, `bg-white`, `border-border` etc. are used correctly inside DS components. The 497 `text-*` total is a prospecting upper bound, not a bypass count.
3. **Section C does not distinguish unused DS files from indirectly-re-exported ones.** Components flagged "possibly under-adopted" at 0-3 imports may still be re-exported via the DS barrel or used only by other DS components. Pass 3 should confirm before proposing deletion.
4. **Section D patterns overlap.** D.2 (`div` with border) and D.3 (`div` with background) share matches when an element has both. Totals are NOT additive across D.1-D.6.
5. **Tailwind regexes are greedy on the initial token prefix.** `text-text` matches because `text-[a-zA-Z0-9-]+` matches the whole double-dashed name; that is the intended behaviour but means DS-approved classes inflate the count, as noted in (2).
6. The grep runs on the working tree at commit `f89d5d8` on branch `main` (no WIP in `git status`).

### Scan date

2026-04-20
