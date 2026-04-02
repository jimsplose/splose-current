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

## FormPage Template Issues

**Status:** Needs measurement — compare production settings edit pages vs localhost.

Pages to check:
- `/settings/email-templates/edit/[id]` (production) vs localhost
- `/invoices/new` (production) vs localhost
- `/notes/new` (production) vs localhost

Expected issues: Navbar height, form section spacing, button alignment.

## DetailPage Template Issues

**Status:** Needs measurement — compare production client detail vs localhost.

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
