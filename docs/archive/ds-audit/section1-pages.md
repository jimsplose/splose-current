# Section 1 — Pages audit

Ranked listing of every in-scope file by inline-style count. Counts come from Pass 1 Section A (raw `style={{` occurrences). Top patterns come from Pass 2 classification. Remember: raw count ≠ violation count — roughly half of each file's inline styles are pure layout (margin/padding/flex) which the spec's classifier correctly ignores.

## Top 10 worst pages (quick reference)

| Rank | Page | Path | Inline count | Top 3 patterns |
|---|---|---|---|---|
| 1 | Client detail | `src/app/clients/[id]/ClientDetailClient.tsx` | 86 | DataTable-adopt (6), FeatureCard-new (4), HintIcon-inverted (3) |
| 2 | Dashboard | `src/app/DashboardClient.tsx` | 82 | Icon-new (25+), Text-weight-extend (8), decorative one-off art |
| 3 | Notes edit | `src/app/notes/[id]/edit/page.tsx` | 73 | Icon-new (18+), Divider-vertical-extend (3), Button-shape-extend (2) |
| 4 | Invoice detail (server) | `src/app/invoices/[id]/page.tsx` | 58 | Text-adopt (raw h2/h3 — 8), Text-weight-extend (12), DataTable-adopt (4) |
| 5 | Waitlist | `src/app/waitlist/page.tsx` | 52 | Badge-size-extend (4), Icon-new (16+), IconButton-new (2) |
| 6 | Settings: Details | `src/app/settings/details/page.tsx` | 51 | Divider-vertical-extend (4), FormInput-disabled-fix (3), Button-pill-extend (2) |
| 7 | Settings: Data import | `src/app/settings/data-import/page.tsx` | 50 | Icon-new (10+), Alert-adopt (4), Card-interactive-extend (2) |
| 8 | Invoice detail (client) | `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 48 | Text-weight-extend (10), Card-tint-extend (2), Badge-size-extend (1) |
| 9 | Settings: Online-booking config | `src/app/settings/online-bookings/[id]/page.tsx` | 47 | Card-container-adopt (5), ColorDot-selectable-extend (1), Card-dashed-extend (1) |
| 10 | Reports index | `src/app/reports/page.tsx` | 46 | Button-pill-extend (4+), ProgressBar-new (2), Dropdown-adopt (2) |

## Full ranked list

| Rank | Path | Inline count | In Pass 2? |
|---|---|---|---|
| 1 | `src/app/clients/[id]/ClientDetailClient.tsx` | 86 | ✓ |
| 2 | `src/app/DashboardClient.tsx` | 82 | ✓ |
| 3 | `src/app/notes/[id]/edit/page.tsx` | 73 | ✓ |
| 4 | `src/app/invoices/[id]/page.tsx` | 58 | ✓ |
| 5 | `src/app/waitlist/page.tsx` | 52 | ✓ |
| 6 | `src/app/settings/details/page.tsx` | 51 | ✓ |
| 7 | `src/app/settings/data-import/page.tsx` | 50 | ✓ |
| 8 | `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 48 | ✓ |
| 9 | `src/app/settings/online-bookings/[id]/page.tsx` | 47 | ✓ |
| 10 | `src/app/reports/page.tsx` | 46 | ✓ |
| 11 | `src/app/settings/forms/[id]/page.tsx` | 42 | ✓ |
| 12 | `src/app/products/page.tsx` | 38 | ✓ |
| 13 | `src/app/invoices/new/page.tsx` | 36 | ✓ |
| 14 | `src/app/contacts/[id]/page.tsx` | 35 | ✓ |
| 15 | `src/app/notes/[id]/page.tsx` | 34 | ✓ |
| 16 | `src/app/payments/new/page.tsx` | 33 | ✓ |
| 17 | `src/app/reports/performance/page.tsx` | 22 | ✓ |
| 18 | `src/app/online-booking/page.tsx` | 22 | ✓ |
| 19 | `src/app/settings/ai/page.tsx` | 20 | ✓ |
| 20 | `src/app/reports/progress-notes/page.tsx` | 20 | ✓ |
| 21 | `src/app/settings/custom-fields/page.tsx` | 18 | — |
| 22 | `src/app/login/page.tsx` | 18 | — |
| 23 | `src/app/reports/ndis-bulk-upload/new/page.tsx` | 17 | — |
| 24 | `src/app/invoices/batch-invoice/[id]/page.tsx` | 17 | — |
| 25 | `src/app/settings/users/[id]/UserDetailClient.tsx` | 16 | — |
| 26 | `src/app/notes/new/page.tsx` | 16 | — |
| 27 | `src/app/settings/progress-notes/edit/[id]/page.tsx` | 15 | — |
| 28 | `src/app/payments/page.tsx` | 14 | — |
| 29 | `src/app/invoices/batch-invoice/page.tsx` | 14 | — |
| 30 | `src/app/clients/[id]/invoices/page.tsx` | 13 | — |
| 31 | `src/app/clients/ClientsPageClient.tsx` | 13 | — |
| 32 | `src/app/settings/integrations/page.tsx` | 12 | — |
| 33 | `src/app/settings/data-import/csv/page.tsx` | 12 | — |
| 34 | `src/app/patient-form/[id]/view/page.tsx` | 12 | — |
| 35 | `src/app/settings/sms-settings/page.tsx` | 10 | ✓ (Pass 2b) |
| 36 | `src/app/settings/locations/page.tsx` | 10 | — |
| 37 | `src/app/contacts/page.tsx` | 10 | ✓ (Pass 2b) |
| 38 | `src/app/reports/uninvoiced/page.tsx` | 9 | ✓ (Pass 2b) |
| 39 | `src/app/reports/appointments/page.tsx` | 9 | — |
| 40 | `src/app/clients/[id]/statements/page.tsx` | 9 | — |
| 41 | `src/app/clients/[id]/payments/page.tsx` | 9 | ✓ (Pass 2b) |
| 42 | `src/app/clients/[id]/notes/page.tsx` | 9 | — |
| 43 | **DS:** `src/components/ds/DetailPage.tsx` | 8 | ✓ (Pass 2b) |
| 44 | `src/app/settings/tags/page.tsx` | 8 | ✓ (Pass 2b) |
| 45–60 | (see Pass 1 Section A for remaining entries) | 4–8 | selective |
| 61 | **DS:** `src/components/ds/Navbar.tsx` | 5 | ✓ (Pass 2b) |
| 62–72 | (settings tail) | 4–5 | — |
| 72 | `src/app/settings/cancellation-reasons/page.tsx` | 4 | ✓ (Pass 2b, **0 violations**) |
| 73–91 | (various) | 1–4 | — |
| 99–111 | Zero-violation files | 0 | — |

**Zero-violation files (13 total):** `src/components/ds/SideNav.tsx`, `src/app/settings/users/[id]/page.tsx`, `src/app/settings/services/edit/[id]/page.tsx`, `src/app/settings/referral-types/page.tsx`, `src/app/settings/locations/edit/[id]/page.tsx`, `src/app/settings/communication-types/page.tsx`, `src/app/products/new/page.tsx`, `src/app/page.tsx`, `src/app/invoices/page.tsx`, `src/app/clients/page.tsx`, `src/app/clients/[id]/page.tsx`, `src/app/clients/[id]/appointments/page.tsx`, `src/app/calendar/page.tsx`.

These pages are **golden-standard references** — use them as models when refactoring high-violation pages.

---

## Per-page detail (Top 10)

Three representative violations per page, each categorised into AdoptAsIs / ExtendDS / NewDS.

### 1. Client detail — `src/app/clients/[id]/ClientDetailClient.tsx` (86)

**First 3 violations:**

1. **Line 246** — `<tr style={{ borderBottom: '1px solid var(--color-border)' }}>` (associated-contacts table, repeats at 256, 264)
   → **AdoptAsIs:DataTable** — the raw `<table>/<tr>/<td>` should be replaced with `<DataTable>`.
2. **Line 282** — `<div style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary)', padding: 16, color: 'white' }}>` (account-balance card)
   → **NewDS:FeatureCard** — primary-tinted card with inverted text; propose a new `<FeatureCard tone="primary">` wrapper.
3. **Line 285, 286, 291** — `<HintIcon style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.8)' }} />` (icon inside the colored card)
   → **ExtendDS:HintIcon:tone="inverted"** — add a tone prop for icons used on colored/dark backgrounds.

### 2. Dashboard — `src/app/DashboardClient.tsx` (82)

**First 3 violations:**

1. **Line 199** — `<DownOutlined style={{ fontSize: 14 }} />` (and `<RightOutlined style={{ fontSize: 14 }} />` at same line)
   → **NewDS:Icon** — icon-sizing wrapper is the single biggest pattern in the codebase.
2. **Line 269** — `<Text variant="label/lg" as="h2" color="text" style={{ fontWeight: 500 }}>Messages</Text>`
   → **ExtendDS:Text:weight** — add a `weight` prop so `<Text variant="label/lg" weight="medium">` replaces the inline fontWeight override.
3. **Lines 209–234** — multiple inline gradient backgrounds for decorative pattern art (e.g. `background: 'linear-gradient(to bottom right, #d1d5db, #9ca3af)'`)
   → **Decorative one-off** — can be left inline (pure layout+decoration, low priority to componentise).

### 3. Notes edit — `src/app/notes/[id]/edit/page.tsx` (73)

**First 3 violations:**

1. **Line 347** — `<DownOutlined style={{ fontSize: 12 }} />` (20+ similar icon-sizing usages in the toolbar)
   → **NewDS:Icon**
2. **Line 353** — `<span style={{ height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />` (toolbar divider, repeats at 366)
   → **ExtendDS:Divider:orientation="vertical"**
3. **Line 320, 323** — `<Button variant="primary" style={{ borderRadius: '8px 0px 0px 8px' }}>` (segmented button group)
   → **ExtendDS:Button:grouped** or **NewDS:ButtonGroup** — for buttons that should render as a seam-free horizontal group.

### 4. Invoice detail (server) — `src/app/invoices/[id]/page.tsx` (58)

**First 3 violations:**

1. **Line 56** — `<h2 style={{ fontSize: 26, fontWeight: 500, color: 'rgb(65, 69, 73)' }}>` (invoice title)
   → **AdoptAsIs:Text** — replace raw `<h2>` with `<Text variant="heading/xl">`. Also implies **ExtendDS:Text:variant="heading/xl"** since 26px isn't in the current variant set.
2. **Lines 127, 151, 163, 171, 177, 185, 189, 193** — `<Text variant="body/md-strong" as="h3" style={{ fontSize: 13, color: 'rgb(65, 69, 73)', marginBottom: 8 }}>Client</Text>`
   → **ExtendDS:Text:variant (add `label/md-strong` or similar at 13px)** + replace `rgb(65, 69, 73)` with a DS token.
3. **Line 49** — `<div style={{ height: 8, borderRadius: '8px 8px 0 0', background: 'linear-gradient(to right, #a855f7, #22c55e, #facc15)' }} />`
   → **NewDS:InvoiceAccentBar** — the decorative gradient top bar; low priority, two occurrences.

### 5. Waitlist — `src/app/waitlist/page.tsx` (52)

**First 3 violations:**

1. **Line 738** — `<Badge key={service} variant="blue" style={{ borderRadius: 8, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>` (repeats at 886)
   → **ExtendDS:Badge:size="lg"** — Badge currently has variant + solid + shape + onRemove, no size prop.
2. **Line 743, 891** — `<button style={{ marginLeft: 2, borderRadius: '50%', padding: 2 }}>` (close button inside badge)
   → **NewDS:IconButton** or **ExtendDS:Button:iconOnly** — small circular icon-only button.
3. **Line 573** — `<svg style={{ width: 12, height: 12, color: 'var(--color-text-secondary)' }} ...>`
   → **NewDS:Icon** — icon-sizing wrapper should cover inline SVGs too.

### 6. Settings: Details — `src/app/settings/details/page.tsx` (51)

**First 3 violations:**

1. **Lines 93, 102, 108** — `<FormInput disabled style={{ backgroundColor: '#f3f4f6' }} />` (×3)
   → **AdoptAsIs:FormInput (bug fix)** — disabled state should be styled inside FormInput. Fix the component; no prop change needed.
2. **Lines 165, 167, 175** — `<div style={{ margin: '0 4px', height: 16, width: 1, backgroundColor: '#d1d5db' }} />` (toolbar dividers, 3+ occurrences)
   → **ExtendDS:Divider:orientation="vertical"** — same pattern as notes/edit.
3. **Lines 149, 157** — `<Button variant="secondary" style={{ borderRadius: 9999, paddingLeft: 12, paddingRight: 12 }}>`
   → **ExtendDS:Button:shape="pill"** — add a shape prop.

### 7. Settings: Data import — `src/app/settings/data-import/page.tsx` (50)

**First 3 violations:**

1. **Lines 125, 128, 136, 175, 182, 212** — `<MessageOutlined style={{ fontSize: 16 }} />` and other icons (10+ occurrences)
   → **NewDS:Icon** — dominant pattern.
2. **Lines 218–220** — `<Flex style={{ backgroundColor: '#f0fdf4', ... }}><FileTextOutlined style={{ color: '#16a34a' }} /><span style={{ color: '#15803d' }}>...</span></Flex>` (file-uploaded status row)
   → **AdoptAsIs:Alert** — Alert DS component covers this.
3. **Lines 191, 198** — `<button onClick={...} style={{ display: 'flex', flexDirection: 'column', ..., border: '1px solid var(--color-border)', padding: 24, ..., backgroundColor: 'transparent' }}>` (CSV/Cliniko import choice tiles)
   → **ExtendDS:Card:interactive** — Card with an onClick behaviour and focus/hover states.

### 8. Invoice detail (client) — `src/app/invoices/[id]/InvoiceDetailClient.tsx` (48)

**First 3 violations:**

1. **Lines 171, 187, 197, 203, 208, 218, 222, 226** — `<Text variant="body/sm" as="h3" color="text" style={{ marginBottom: 4, fontWeight: 700 }}>` (×10+ through the invoice header blocks)
   → **ExtendDS:Text:weight** — add a weight prop so `<Text variant="body/sm" weight="bold">` replaces these.
2. **Line 112** — `<Badge variant="green" className="text-label-lg" style={{ borderRadius: 8, padding: '6px 12px' }}>`
   → **ExtendDS:Badge:size="lg"**
3. **Lines 154, 156** — invoice accent gradient bar (same as page.tsx)
   → **NewDS:InvoiceAccentBar**

### 9. Settings: Online-booking config — `src/app/settings/online-bookings/[id]/page.tsx` (47)

**First 3 violations:**

1. **Line 137** — `<button style={{ height: 28, width: 28, borderRadius: '50%', border: '2px solid transparent', backgroundColor: color, cursor: 'pointer' }}>` (8 color swatches)
   → **ExtendDS:ColorDot:interactive** — ColorDot is non-interactive; add selectable variant.
2. **Line 107** — `<Flex style={{ height: 128, borderRadius: 8, border: '2px dashed var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)' }}>` (upload drop zone)
   → **ExtendDS:Card:variant="dashed"** or **AdoptAsIs:FileUpload**.
3. **Line 149, 152, 379** — `<button style={{ borderRadius: 8, padding: '10px 24px', color: 'white', backgroundColor: buttonColor }}>` (preview "Book now" / "Learn more" buttons with custom colors)
   → **ExtendDS:Button:customColor** — since the button color is user-configurable (themeColor), need a prop to pass a color through rather than inline.

### 10. Reports index — `src/app/reports/page.tsx` (46)

**First 3 violations:**

1. **Lines 271, 276, 283** — `<Button variant="secondary" size="sm" style={{ borderRadius: 9999 }}>{filterLabel}</Button>` (×4+)
   → **ExtendDS:Button:shape="pill"** — same as settings/details.
2. **Lines 444–446** — `<div style={{ height: 6, width: 64, borderRadius: 9999, backgroundColor: 'var(--color-fill-secondary)' }}><div style={{ height: 6, borderRadius: 9999, backgroundColor: 'var(--color-primary)', width: 'N%' }}/>` (practitioner utilisation progress)
   → **NewDS:ProgressBar** — small component with `value` and `tone`.
3. **Line 89, 307** — `<div style={{ position: 'absolute', ..., borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>` (custom popover panels for date range & utilisation config)
   → **AdoptAsIs:Dropdown** — Dropdown likely covers this; if not, **NewDS:Popover**.

---

## Summary

- **111 in-scope files** total
- **98 files have ≥1 inline style**
- **13 files are clean** (0 inline styles) — use as references
- **Top 20 concentrate 60%+ of the inline-style volume** (877 of 1422 raw count)
- **DS templates (DetailPage, Navbar, SettingsListPage, ListPage, FormPage, Modal, PageHeader, SideNav, TopNav) contribute 31 inline styles combined** — worth a dedicated fix session, since cleaning them up propagates to every page using the template

**Worst pages are concentrated in detail flows:** ClientDetailClient, DashboardClient, Invoice detail (both server + client), Notes edit. Fixing these 5 files would cut ~347 raw inline styles (roughly 24% of the total).
