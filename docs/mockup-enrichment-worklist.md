# Mockup Enrichment Work List

Interactive enrichments to make the prototype more realistic. Organized by category, prioritized by visibility.

## 1. No-op Dropdown Actions (onSelect={() => {}})

These dropdowns have action items that do nothing when clicked. Enrichment: wire to show edit modals, confirm dialogs, or toast feedback.

| Page | File | Enrichment |
|---|---|---|
| **Products** | `src/app/products/page.tsx:183` | Edit/Archive/Delete actions → edit modal + confirm dialog |
| **Client files** | `src/app/clients/[id]/files/page.tsx:88` | Download/Delete/Rename actions |
| **Client forms** | `src/app/clients/[id]/forms/page.tsx:123` | View/Resend/Archive actions |
| **Client comms** | `src/app/clients/[id]/communications/page.tsx:136` | View/Delete actions |
| **Settings users** | `src/app/settings/users/page.tsx:45` | Edit/Deactivate/Reset password actions |
| **Data export** | `src/app/settings/data-export/page.tsx:186` | Download/Re-export actions |
| **Data import** | `src/app/settings/data-import/page.tsx:158` | View details/Re-import actions |

## 2. Missing New/Edit/View Sub-Pages

List pages that have no "create new" or "edit detail" flow. These are high-value enrichments.

| Page | What's missing | Priority |
|---|---|---|
| **Contacts** | `/contacts/new` — New contact form | High |
| **Products** | `/products/new` and `/products/[id]/edit` — New/edit product form | High |
| **Invoices** | `/invoices/new` — Create invoice flow (line items, client, dates) | High |
| **Waitlist** | `/waitlist/new` — Add to waitlist form | Medium |
| **Practitioners** | `/practitioners/[id]` — Practitioner detail/profile page | Medium |
| **Client new** | `/clients/new` — New client registration form | Medium |

## 3. Modals Needing Richer Content

Modals that currently have basic FormInput fields but could be more realistic.

| Page | Modal | Enrichment |
|---|---|---|
| **Settings locations** | Edit location | Add map preview, opening hours table, room list |
| **Settings SMS** | SMS settings modal | Add preview of SMS message, character count |
| **Settings tags** | Edit tag | Add "used by N clients" count, merge tag option |
| **Calendar** | Create appointment | Add client search with recent clients, conflict warnings |
| **Calendar** | Edit appointment | Add change log, notification preview |
| **Invoice detail** | Payment modal | Add payment method selector, receipt preview |
| **Settings body charts** | Body chart edit | Add body region selector/diagram |
| **Settings custom fields** | Reorder fields | Already has ReorderModal — add field type preview |

## 4. Incomplete Multi-Step Flows

Flows where only part of the journey exists.

| Flow | Current state | Missing steps |
|---|---|---|
| **Batch invoicing** | Has list + preview pages | Missing: select clients step, line item editing |
| **NDIS bulk upload** | Has form page | Missing: file upload, validation results, submit confirmation |
| **Online booking (public)** | Has 2-step flow | Missing: confirmation email preview, calendar add-to-calendar |
| **Payment flow** | Has new payment form | Missing: receipt/confirmation page |
| **Note → Send** | Has send modal | Missing: email preview with actual note content |
| **Client import** | Has CSV upload card | Missing: column mapping step, preview of imported data |

## 5. Static Interactive States

Elements that look interactive but don't respond to user input.

| Page | Element | Enrichment |
|---|---|---|
| **Dashboard** | Messages panel | Click message → expand to show full content |
| **Dashboard** | Income chart | Hover → show tooltip with values |
| **Dashboard** | Recent forms | Click → navigate to form view |
| **Reports** | Chart visualizations | Hover tooltips, click-to-drill-down |
| **Reports** | Sortable table headers | Already have `sortable` prop — wire actual sort logic |
| **Client detail** | Edit mode toggle | Make all fields editable in edit mode (some are still static) |
| **Waitlist** | Map view | Click markers → show client card popup |
| **Products** | Expand rows | Show product details, usage history |
| **Invoices list** | Filter dropdowns in Th | Wire actual filtering logic |

## 6. Data Enrichment

Pages that would benefit from more realistic data volume or variety.

| Page | Current | Target |
|---|---|---|
| **Practitioners** | 5 practitioners | Add specialties, availability, photos |
| **Products** | ~5 products | Expand to 15+ with categories |
| **Contacts** | ~5 contacts | Expand to 15+ with organizations |
| **Client comms** | Few rows | Add 10+ with mix of SMS/email/phone |
| **Client cases** | 3 cases | Add more with varied statuses |
| **Reports data** | Static mock charts | Wire chart data to match seed data |

---

## Priority Order (suggested)

1. **No-op dropdowns** (quick wins, 7 items) — makes the app feel responsive
2. **Missing sub-pages** (contacts/new, products/new, invoices/new) — fills biggest gaps
3. **Static interactive states** (dashboard clicks, report drill-down) — adds depth
4. **Modal enrichments** — realistic content in existing modals
5. **Multi-step flows** — most complex, highest effort
6. **Data enrichment** — seed data updates
