# Template Styling Plan

**Goal:** Fix systemic styling differences across all pages that share DS templates (ListPage, FormPage, DetailPage). Fix at the component level so all pages inherit correct styles automatically.

## Status: In progress (2026-04-02)

---

## ListPage Template Issues (measured: production vs localhost)

Affects: clients, contacts, invoices, payments, products, waitlist, all report list pages (~26 pages)

### Issue 1: Button height and border color

| | Production | Localhost |
|---|---|---|
| Height | 38px | 32px |
| Padding | 7px 15px | 0px 15px |
| Border | 1px solid rgb(65,69,73) — dark | 1px solid rgb(231,232,232) — light gray |

**Fix:** Update AntD theme token `controlHeight` to 38 and adjust Button component default border color.
**Files:** `src/components/ds/ThemeProvider.tsx` (AntD theme config)

### Issue 2: Search button is purple instead of white

| | Production | Localhost |
|---|---|---|
| Background | white | rgb(130,80,255) — purple |
| Color | rgba(0,0,0,0.45) | white |

**Fix:** SearchBar component search button should use default/secondary variant, not primary.
**Files:** `src/components/ds/SearchBar.tsx`

### Issue 3: Table header background too light

| | Production | Localhost |
|---|---|---|
| Background | rgb(234,237,241) — #EAEDF1 | rgb(243,245,247) — #F3F5F7 |

**Fix:** Update AntD theme token `colorFillAlter` or DataTable header bg to match production.
**Files:** `src/components/ds/ThemeProvider.tsx` or `src/components/ds/DataTable.tsx`

### Issue 4: Table row height too short

| | Production | Localhost |
|---|---|---|
| Row height | 79px | 68px |
| Cell padding | 16px all | 12px 16px |

**Fix:** Update DataTable `Td` default padding from `12px 16px` to `16px`.
**Files:** `src/components/ds/DataTable.tsx`

### Issue 5: Search-to-table gap too large

| | Production | Localhost |
|---|---|---|
| Gap | 10px | 23px |

**Fix:** Reduce SearchBar `marginBottom` in ListPage template, or adjust SearchBar component margin.
**Files:** `src/components/ds/SearchBar.tsx` or `src/components/ds/ListPage.tsx`

---

## FormPage Template Issues (measured: /invoices/new)

**Status:** Measured 2026-04-02. Significant structural + styling differences.

### Issue F1: Page background color

| | Production | Localhost |
|---|---|---|
| Background | white (`rgb(255,255,255)`) | white (`rgb(255,255,255)`) |

Note: User reported difference — may be a subtle off-white in some areas. Needs visual check.

### Issue F2: Content container structure

| | Production | Localhost |
|---|---|---|
| Layout | Flat form, no Card wrappers | Card sections with `headerBar` titles ("Client", "Invoice details") |
| Max width | No maxWidth constraint visible | 1024px centered |

**Fix:** Production invoices/new uses a flat layout with field groups, not Cards. The localhost version wraps everything in Card components with headerBar. This is a structural difference in the page itself, not the FormPage template.
**Files:** `src/app/invoices/new/page.tsx`

### Issue F3: Missing header buttons

| | Production | Localhost |
|---|---|---|
| Buttons | "Show/hide fields", "Preview", "Cancel" (red), "Create" (purple) | "Cancel" (secondary), "Save" (primary) |

**Fix:** Add missing buttons to invoices/new navbar actions. "Cancel" should have red text/border (`variant="danger"`). "Create" instead of "Save". Add "Show/hide fields" and "Preview" buttons.
**Files:** `src/app/invoices/new/page.tsx`

### Issue F4: Different field set

| | Production | Localhost |
|---|---|---|
| Fields | Invoice #, Reference, Issue date, Due date, Patient, Invoice to, Extra invoice details, Location, Practitioner, Provider numbers | Client name, Contact, Invoice number, Date, Due date, Location, Notes, Payment terms |

**Fix:** Update field labels and add missing fields to match production. This is page-level content, not a template issue.
**Files:** `src/app/invoices/new/page.tsx`

### Issue F5: Input field background color (DS-level)

| | Production | Localhost |
|---|---|---|
| Input bg | `rgba(0,0,0,0)` (transparent — field renders on white form) | white |
| Select bg | white | white |
| Input border | `1px solid rgb(217,217,217)` | same via AntD |

**Fix:** If input fields appear differently colored, check AntD Input component token `colorBgContainer`. Currently white, may need to be transparent for certain form contexts. Consider adding a `variant` prop to FormInput for "filled" vs "outlined" styles.
**Files:** `src/components/ds/theme.ts`, potentially `src/components/ds/FormInput.tsx`

### Issue F6: Navbar back link style

| | Production | Localhost |
|---|---|---|
| Back element | "Invoices" text link (purple, 14px) | Arrow icon (←) |
| Title | "Create invoice" | "New invoice" |

**Fix:** Production uses text breadcrumb link, not arrow. Consider adding a `backLabel` prop to Navbar/FormPage. Title text is page-level.
**Files:** `src/components/ds/Navbar.tsx`, `src/components/ds/FormPage.tsx`

### Issue F7: Production form has patient-dependent state

When a patient is selected in production, the form shows:
- **Line items table** with columns: Type, Description, Code, Unit, Tax rate, Price, Qty, Discount, Amount
- **Totals section**: Subtotal excl. tax, Total discount, Total tax, TOTAL AUD
- **Additional information** field with "Apply business default" button

Our localhost version always shows line items (doesn't depend on patient selection). The localhost line items table has: Service, Description, Qty, Unit Price, Tax, Total — **missing**: Type, Code, Unit, Tax rate, Discount columns.

**Fix:** Update line items table columns to match production. Add "Apply business default" button to additional info. Make client pre-selected by default.
**Files:** `src/app/invoices/new/page.tsx`

### Summary: FormPage template vs page-level fixes

| Fix | Level | Priority |
|---|---|---|
| Back link as text breadcrumb | **DS template** (Navbar/FormPage) | High |
| Input field bg transparency | **DS theme** | Medium |
| Cancel button red variant | **DS** (already supports `danger`) | Low — already works |
| Title: "Create invoice" not "New invoice" | **Page-level** | High |
| Navbar buttons: add "Show/hide fields", "Preview" | **Page-level** | High |
| Cancel button: red (danger variant) | **Page-level** | High |
| CTA text: "Create" not "Save" | **Page-level** | High |
| Remove Card wrappers → flat form layout | **Page-level** | High |
| Field labels: match production names | **Page-level** | High |
| Add missing fields: Reference, Invoice to, Practitioner, Provider numbers | **Page-level** | High |
| Line items: add Type, Code, Unit, Tax rate, Discount columns | **Page-level** | Medium |
| Totals: add Subtotal excl. tax, Total discount labels | **Page-level** | Medium |
| Default patient selected | **Page-level** | Medium |

---

## DetailPage Template Issues (measured: /patients/446604/details vs /clients/[id])

**Status:** Measured 2026-04-02. Major structural + styling differences.

### Issue D1: Header — label + name layout

| | Production | Localhost |
|---|---|---|
| Top label | "Patient" — 20px, green (#42694A), fw:700 | "Client" heading — 30px, gray, fw:700 |
| Patient name | "Harry Nguyen" — 15px, gray, fw:400 (below label) | "Jack Thompson" — separate line, different style |

**Fix (DS):** The header should show entity type label ("Patient"/"Client") as the display title, and name as subtitle. DetailPage already has `title` + `subtitle` — but the page isn't using DetailPage at all.
**Fix (Page):** Migrate ClientDetailClient to use DetailPage template.

### Issue D2: Action buttons completely different styling

| | Production | Localhost |
|---|---|---|
| "New SMS" | h:38px, white bg, dark border, icon+text | h:28.5px, white bg, dark border, no icon |
| "New email" | h:38px, white bg, dark border, icon+text | h:28.5px, **purple border+text** (wrong!) |
| "Actions" | h:38px, white bg, dark border, dropdown arrow | h:28.5px, white bg, dark border, no arrow |
| "Edit" | h:38px, white bg, dark border, edit icon | h:28.5px, white bg, dark border |

**Fix (DS):** Button height already fixed to 38px via controlHeight. The "New email" button is using wrong variant — should be secondary not link/outline-primary.
**Fix (Page):** Add icons to buttons. Fix "New email" variant. Add dropdown arrow to "Actions".

### Issue D3: Tab bar / side navigation

| | Production | Localhost |
|---|---|---|
| Style | Vertical left sidebar menu, 215px wide | Vertical left sidebar (similar structure) |
| Active indicator | Purple text color highlight | Needs verification |
| Count badges | "119" (Appointments), "520" (Comms) — red bg for some, white bg for others | No count badges |
| Border | `1px solid rgba(5,5,5,0.06)` right border | Needs measurement |

**Fix (DS):** SideNav component needs count badge support — add `badge` or `count` prop to SideNavItem.
**Fix (Page):** Add count numbers to tab items from mock data.

### Issue D4: Section dividers are PURPLE in production

| | Production | Localhost |
|---|---|---|
| Color | `rgb(130, 80, 255)` — **purple** (primary color) | Standard gray border |
| Style | `1px solid`, margin `0 0 12px` | Gray hr |

**Fix (DS):** Add `variant="primary"` to Divider component for purple dividers. This is a distinctive Splose design pattern — section dividers on detail pages use the brand purple.
**Fix (Page):** Use `<Divider variant="primary">` between sections.

### Issue D5: Content sections — outlined table layout

| | Production | Localhost |
|---|---|---|
| Layout | Label-value pairs with labels as `<label>` elements, inline layout | Uses DS `List` component with different styling |
| Label style | 14px, fw:500, dark gray | Similar but different spacing/weight |
| Section headings | h3, 18px, fw:700 | h2, different size |
| Content padding | Generous padding around sections | Tighter, different spacing |

**Fix (Page):** Review and match the label-value pair layout, heading sizes, and spacing. The production layout is more spacious with clear label:value alignment.

### Issue D6: Right sidebar

| | Production | Localhost |
|---|---|---|
| Width | ~303px | Needs measurement |
| Sections | Account balance ($4,893.40), Patient alerts, Patient tags, Stripe, Mailchimp | Account balance, Client alerts, Stripe, Mailchimp, QuickBooks |
| "Patient tags" section | Has "Plan-managed" tag | **Missing entirely** |
| Balance styling | "They owe" label + large amount | Similar but different styling |

**Fix (Page):** Add "Client tags" collapsible section with tag badges. Match balance styling.

### Issue D7: Missing "Patient tags" sidebar section

Production has a collapsible "Patient tags" section showing tags like "Plan-managed". Localhost doesn't have this.

**Fix (Page):** Add tags section to ClientSidebar.

### Summary: DetailPage fixes

| Fix | Level | Priority |
|---|---|---|
| Purple section dividers (`variant="primary"`) | **DS** (Divider component) | High |
| SideNav count badge support | **DS** (SideNav component) | High |
| Button height 38px | **DS** (already fixed via controlHeight) | Done |
| Migrate to DetailPage template | **Page** (ClientDetailClient) | High |
| Fix "New email" button variant | **Page** | High |
| Add icons to header buttons | **Page** | Medium |
| Add tab count badges | **Page** | Medium |
| Add "Client tags" sidebar section | **Page** | Medium |
| Match label-value pair layout + spacing | **Page** | Medium |
| Section heading sizes (h3, 18px) | **Page** | Low |

---

Pages to check:
- `/patients/[id]` (production) vs `/clients/[id]` (localhost)
- `/invoices/[id]` (production) vs localhost

Expected issues: Header layout, tab bar styling, sidebar width.

## SettingsListPage Issues

**Status:** Needs measurement — compare production settings pages vs localhost.

Pages to check:
- `/settings/services` (production) vs localhost
- `/settings/tags` (production) vs localhost

---

## Execution Order

1. **Fix ListPage DS components first** — highest page count (26+ pages), fixes propagate everywhere
2. **Get user feedback on FormPage** — open production vs localhost in Chrome MCP
3. **Get user feedback on DetailPage** — open production vs localhost in Chrome MCP
4. **Get user feedback on SettingsListPage** — verify existing template
