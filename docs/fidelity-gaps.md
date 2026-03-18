# Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.
Priority ordering: high-traffic pages first (Dashboard, Calendar, Clients), then secondary pages.

## Priority 1 — High-traffic pages

### Group D — Dashboard (`src/app/page.tsx`)
- [x] **Dashboard improvements** — Messages panel, income chart, incomplete progress notes, recently submitted forms, compose area all implemented.

### Group E — Client detail (`src/app/clients/[id]/`)
- [x] **Client appointments sub-tab** — Already has "Send upcoming appointments" and "+ New appointment" buttons.

## Priority 2 — Core workflow pages

### Group A — Waitlist (`src/app/waitlist/`)
- [x] **Waitlist Screener tab** — Already implemented with triage buttons, tags, client, DOB, address, form, date columns.
- [x] **Waitlist Map view** — Already implemented with Map/List toggle and placeholder map.

### Group C — Settings (`src/app/settings/`)
All 25 Settings sub-pages are implemented as inline components in `settings/page.tsx`:
- [x] **Settings Details page** — Form with business name, ABN, address, phone, email, logo, email signature.
- [x] **Settings Integrations page** — Integration cards (Xero, MYOB, Stripe, Tyro, Halaxy, Zoom, Google Calendar).
- [x] **Settings SMS Settings page** — SMS provider config, sender name, reply-to, opt-out settings.
- [x] **Settings Form Templates** — List with actions dropdowns.
- [x] **Settings Splose AI** — Implemented at `/settings/ai` with Preferences, Saved Prompts, AI Block Library tabs.
- [x] **Settings Locations page** — Locations list with edit form.
- [x] **Settings Custom Fields page** — List with reorder, actions dropdown, update field modal.
- [x] **Settings Rooms/Resources page** — List with color dots, actions, update room modal.
- [x] **Settings Services page** — List with item codes/durations/prices, actions dropdown.
- [x] **Settings Busy Times page** — List with utilisation/duration, actions dropdown.
- [x] **Settings Cancellation Reasons page** — List with edit/delete, edit modal.
- [x] **Settings Online Booking pages** — List page with Design/Settings/Builder/Share tabs.
- [x] **Settings Communication Types page** — List with default type flags, actions.
- [x] **Settings Tags page** — Client tags with edit tag modal and colour picker.
- [x] **Settings Referral Types page** — List with actions.
- [x] **Settings Users page** — List with actions dropdown.
- [x] **Settings User Groups page** — List with actions, edit group modal.
- [x] **Settings Appointment Templates** — List, actions dropdown, edit template.
- [x] **Settings Email Templates** — List with actions dropdown.
- [x] **Settings Progress Note Templates** — List with actions, rich editor.
- [x] **Settings Letter Templates** — List with actions dropdown, edit template.
- [x] **Settings Payment Settings** — Payment number prefix/padding, accepted payment forms.
- [x] **Settings Invoice Settings** — Tax settings, invoice reminders list.
- [x] **Settings Tax Rates page** — List, new tax rate modal.
- [x] **Settings Data Export page** — Export type/date selection, export history.
- [x] **Settings Data Import page** — Import source modal, CSV import tabs.

### Group K — Calendar enhancements (`src/app/calendar/`)
- [x] **Calendar Rooms/Resources view** — Calendar/Rooms toggle, room filter dropdown. Reference: 7.22.38-7.22.53 pm.
- [x] **Calendar view type switcher** — Month/Week/Day dropdown. Reference: 7.23.04 pm.
- [x] **Calendar month view** — Month view with appointments and appointment detail side panel. Reference: 7.23.16-7.23.23 pm.
- [x] **Calendar appointment side panel** — Appointment detail flyout with Edit/Reschedule/Archive actions, edit appointment form with Room/Resource dropdown. Reference: 7.23.33-7.25.52 pm.

### Group L — Progress Notes (`src/app/notes/`)
- [x] **New progress note page** — Service selector, template selector, Select/Copy recent note/Copy recent practitioner note buttons. Reference: 7.25.45 pm.
- [x] **Edit progress note page** — Rich editor with AI-generated sections (Subjective/Objective/Treatment/Assessment), Accept button, AI block integration. Reference: 7.26.58 pm, screencapture 19_26-19_27.
- [x] **View progress note page** — Send progress note modal with email template, recipient, Summarise session button. Reference: 7.28.32-7.29.15 pm, screencapture 19_27_58-19_28_07.

### Group M — Patient detail sub-tabs (`src/app/clients/[id]/`)
- [x] **Patient communications tab** — Implemented at `/clients/[id]/communications`. Reference: screencapture 19_31_23, 19_31_35.
- [x] **Patient files tab** — Implemented at `/clients/[id]/files`. Reference: screencapture 19_31_50.
- [x] **Patient notes tab** — Implemented at `/clients/[id]/notes`. Reference: screencapture 19_32_09.
- [x] **Patient cases tab** — Implemented at `/clients/[id]/cases`. Reference: screencapture 19_32_26.
- [x] **Patient support activities tab** — Implemented at `/clients/[id]/support-activities`. Reference: screencapture 19_32_35.
- [x] **Patient forms tab** — Implemented at `/clients/[id]/forms`. Reference: 7.33.31 pm, screencapture 19_32_45.
- [ ] **Patient form view page** — Not yet implemented. Reference: screencapture 19_32_54, 19_33_46.
- [x] **Patient invoices tab** — Implemented at `/clients/[id]/invoices`. Reference: screencapture 19_33_57.
- [x] **Patient payments tab** — Implemented at `/clients/[id]/payments`. Reference: screencapture 19_34_16.
- [x] **Patient statements tab** — Implemented at `/clients/[id]/statements`. Reference: screencapture 19_34_27.
- [x] **Patient letters tab** — Implemented at `/clients/[id]/letters`. Reference: screencapture 19_34_39.
- [x] **Patient practitioner access tab** — Implemented at `/clients/[id]/practitioner-access`. Reference: screencapture 19_34_47.

## Priority 3 — Supporting pages

### Group B — Reports (`src/app/reports/`)
- [x] **Reports sidebar consistency** — Already uses shared `reports/layout.tsx` with `ReportsSidebar` component.

### Group F — Responsive (touches multiple files)
- [x] **Mobile/responsive layouts** — TopNav has hamburger menu, dashboard stacks on mobile, client sidebar hidden on mobile.

## Priority 4 — Infrastructure

### Group G — Database (`prisma/seed.ts`, `src/app/api/seed/`)
- [x] **Database re-seed** — Already has 12 clients, 25 appointments, 8 notes, 12 invoices with varied statuses.

### Group I — Dev Navigator (`src/components/`, `src/lib/`, `src/app/layout.tsx`)
- [ ] **Dev Navigator Phase 1** — Create state registry, floating toolbar component, and wire into root layout. See `docs/dev-navigator-spec.md`.
- [ ] **Dev Navigator Phase 2** — Wire `?state=` param reading into all interactive pages. Add all known variants to the registry.

## Priority 5 — Final polish

### Group H — New screenshot intake (reads all files)
- [ ] **Process new screenshots** — Check `screenshots/reference/` against `screenshots/processed.txt` to find unreviewed screenshots. Launch Explore agents in parallel (batches of 10-15) to read and categorize them. See `docs/screenshot-workflow.md`.

### Group J — Sweep (reads all files)
- [ ] **General fidelity sweep** — Review all pages against their closest reference screenshots and fix remaining visual gaps. Run this last after all other gaps are resolved.

---

## Completed Gaps

- [x] **Calendar Rooms/Resources view** — Calendar/Rooms toggle dropdown (2026-03-18)
- [x] **Calendar view type switcher** — Month/Week/Day dropdown (2026-03-18)
- [x] **Calendar month view** — Full month grid with appointment blocks and today highlight (2026-03-18)
- [x] **Calendar appointment side panel** — Enhanced with email, zoom, repeating info, Room/Resource edit form (2026-03-18)
- [x] **Edit progress note page** — `/notes/[id]/edit` with AI SOAP sections (Subjective/Objective/Assessment/Plan/Goals), Generate button, split view (2026-03-18)
- [x] **View progress note page** — Updated with SOAP sections, client info table, Edit link (2026-03-18)
- [x] **Mobile/responsive layouts** — Dashboard stacks on mobile, client sidebar hidden on small screens, action bar wraps (2026-03-18)
- [x] **Patient sub-tabs** — All already implemented under `/clients/[id]/` (Communications, Files, Notes, Cases, Support Activities, Forms, Invoices, Payments, Statements, Letters, Practitioner Access) (2026-03-18)
- [x] **Waitlist Screener tab** — Already has triage buttons, tags, client, DOB, address, form, date columns (2026-03-18)
- [x] **Waitlist Map view** — Already has Map/List toggle with placeholder map (2026-03-18)
- [x] **Reports sidebar consistency** — Already uses shared layout.tsx with ReportsSidebar component (2026-03-18)
- [x] **Database re-seed** — Already has 12 clients, 25 appointments, 8 notes, 12 invoices (2026-03-18)
