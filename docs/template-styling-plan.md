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

### Summary: FormPage template vs page-level fixes

| Fix | Level | Priority |
|---|---|---|
| Back link as text breadcrumb | **DS template** (Navbar/FormPage) | High |
| Input field bg transparency | **DS theme** | Medium |
| Cancel button red variant | **DS** (Button already supports `danger`) | Low — already works |
| Missing buttons, field labels, layout | **Page-level** (invoices/new) | High |
| Card wrappers → flat layout | **Page-level** (invoices/new) | High |

---

## DetailPage Template Issues

**Status:** Needs measurement — compare production patient detail vs localhost client detail.

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
