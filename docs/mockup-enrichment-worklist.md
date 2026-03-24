# Mockup Enrichment Work List

All 6 categories completed on 2026-03-24.

## 1. No-op Dropdown Actions — DONE

- [x] Products — Edit modal, archive toggle, duplicate
- [x] Client files — Download toast, rename modal, delete confirm
- [x] Client forms — View navigation, email/archive confirms
- [x] Client comms — View detail modal, delete confirm
- [x] Settings users — Edit modal, deactivate/reset password confirms
- [x] Data export — Download toast, re-export/delete confirms
- [x] Data import — View details modal, re-import/delete confirms

## 2. Missing New/Edit/View Sub-Pages — DONE

- [x] `/contacts/new` — New contact form (general, contact, notes)
- [x] `/products/new` — New product form (details, pricing, settings)
- [x] `/invoices/new` — Create invoice (client, line items, totals, notes)
- [x] `/clients/new` — Client registration (general, contact, Medicare, tags)
- [x] `/waitlist/new` — Add to waitlist (client, priority, preferred days/time)
- [x] `/practitioners/[id]` — Practitioner profile (info, availability, services)

## 3. Modals Enriched — DONE

- [x] Settings locations — Opening hours + room count
- [x] Settings SMS — Message preview with char/segment count
- [x] Settings tags — Usage count + merge tag option
- [x] Calendar create — Recent clients chips + conflict warning
- [x] Invoice detail payment — Method selector + receipt preview
- [x] Settings body charts — Region selector + chart view picker
- [x] Settings custom fields — Field type live preview
- [ ] Calendar edit — Change log + notification preview (skipped, calendar file too large for safe edit)

## 4. Multi-Step Flows — DONE

- [x] Batch invoicing — 3-step: filters → client selection → preview
- [x] NDIS bulk upload — 3-step: upload → validation → confirmation
- [x] Payment flow — Receipt/confirmation view after submission
- [ ] Online booking — Confirmation email preview (skipped)
- [ ] Note → Send — Email preview with note content (skipped)
- [ ] Client import — Column mapping step (skipped)

## 5. Static Interactive States — DONE

- [x] Dashboard messages — Expand/collapse on click
- [x] Dashboard income chart — Hover tooltips with values
- [x] Dashboard recent forms — Click navigates to form view
- [x] Reports — All 8 columns sortable (ascending/descending)
- [x] Products — Expandable rows with details
- [x] Client detail — All fields editable in edit mode
- [x] Invoices list — Column filtering with chips
- [x] Waitlist map — Marker popups with client detail cards

## 6. Data Enrichment — DONE

- [x] Products — Expanded to 25 items (Services/Products/Consumables/Archived)
- [x] Contacts — Expanded to 18 (hospitals, schools, GPs, specialists)
- [x] Client comms — Expanded to 14 (mixed SMS/Email/Phone)
- [x] Client cases — Expanded to 14 (NDIS/Medicare/DVA/WorkCover/Private)
- [x] Practitioners — Added Active/On Leave status badges

## Remaining (low priority)

- Calendar edit appointment — change log + notification preview
- Online booking — confirmation email preview + add-to-calendar
- Note send — email preview with actual note content
- Client import — column mapping step + data preview
- Reports chart data — wire to match seed data
