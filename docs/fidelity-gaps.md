# Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.
Priority ordering: high-traffic pages first (Dashboard, Calendar, Clients), then secondary pages.

## Priority 1 — High-traffic pages

### Group D — Dashboard (`src/app/page.tsx`)
- [ ] **Dashboard improvements** — Compare against reference screenshots (10:53:42-10:56:57 am). Improve messages panel, analytics cards, compose area.

### Group E — Client detail (`src/app/clients/[id]/`)
- [ ] **Client appointments sub-tab** — Add "Send upcoming appointments" button and "+ New appointment" button matching reference at 11:15:20 am.

## Priority 2 — Core workflow pages

### Group A — Waitlist (`src/app/waitlist/`)
- [x] **Waitlist Screener tab** — Already implemented with triage buttons, tags, client, DOB, address, form, date columns.
- [x] **Waitlist Map view** — Already implemented with Map/List toggle and placeholder map.

### Group C — Settings (`src/app/settings/`)
- [ ] **Settings Details page** — Currently a placeholder. Add a form with: clinic name, ABN, address, phone, email, logo upload area. Add business history modal. Reference: 6.39.04 pm, 5:56:30 pm.
- [ ] **Settings Integrations page** — Not yet implemented. Reference: screencapture 18_34_17.
- [ ] **Settings SMS Settings page** — Not yet implemented. Reference: screencapture 18_34_37, 18_39_35.
- [ ] **Settings Form Templates** — List page with actions dropdowns, Learn menu, form view with Share/Automate panel, form settings (design/completion/notifications), email notification editing with conditional logic. Reference: 6.41-6.43 pm series.
- [ ] **Settings Splose AI** — Preferences tab, Saved prompts tab with CRUD, AI block library tab with CRUD, edit AI block modal. Reference: 6.44 pm series, screencapture 18_36-18_37.
- [ ] **Settings Locations page** — Locations list (partially exists). Edit location form. Reference: 6.44.56 pm, screencapture 18_37_26, 18_45_03.
- [ ] **Settings Custom Fields page** — Not yet implemented. List with reorder modal, actions dropdown, update field modal (with multiple choice options). Reference: 6.45 pm series.
- [ ] **Settings Rooms/Resources page** — Not yet implemented. List with color dots, actions dropdown, update room modal with color picker. Reference: 6.46.09-6.46.25 pm.
- [ ] **Settings Services page** — List with item codes/durations/prices, actions dropdown, edit service (online payment, appointment notifications with reminder dropdown). Reference: 6.46.36-6.47.38 pm, screencapture 18_46_52.
- [ ] **Settings Busy Times page** — Not yet implemented. List with utilisation/duration, actions dropdown, edit modal with color picker. Reference: 6.47.48-6.48.02 pm.
- [ ] **Settings Cancellation Reasons page** — Not yet implemented. List with edit/delete icons, edit modal with cancellation rules. Reference: 6.48.12-6.48.19 pm.
- [ ] **Settings Online Booking pages** — Not yet implemented. List page, Design/Settings/Builder/Share tabs, manage locations modal, public booking page (select location step). Reference: 6.48.28-6.51.45 pm series, screencapture 18_48-18_52.
- [ ] **Settings Communication Types page** — Not yet implemented. List with default type flags, actions dropdown, update modal. Reference: 6.53 pm series.
- [ ] **Settings Tags page** — Not yet implemented. Client tags tab, edit tag modal with colour picker. Reference: 6.54.43 pm, screencapture 18_53-18_55.
- [ ] **Settings Referral Types page** — Not yet implemented. Reference: screencapture 18_56_10.
- [ ] **Settings Users page** — List with actions dropdown (Deactivate/Reset password/Log out/Change log), user detail tabs (Details/Availability/Body chart templates). Edit availability modal with recurring options. Reference: 6.57.42 pm, 7.00 pm series, screencapture 18_56-19_00.
- [ ] **Settings User Groups page** — Not yet implemented. List with actions dropdown, edit group modal with users. Reference: 7.01 pm series, screencapture 19_01_14.
- [ ] **Settings Appointment Templates** — Not yet implemented. List, actions dropdown, edit template (SMS/Email with variable insertion, preview modal), new template (Confirmation/Reschedule/Cancellation/Reminder types). Reference: 7.02-7.04 pm series, screencapture 19_02_29.
- [ ] **Settings Email Templates** — Not yet implemented. List with actions dropdown. Reference: 7.04.18-7.04.27 pm, screencapture 19_04_32.
- [ ] **Settings Progress Note Templates** — Not yet implemented. List with actions, rich editor with AI blocks, AI block library modal with tag filtering, Actions menu (Load/Duplicate/Save to library). Reference: 7.05-7.06 pm series, screencapture 19_04_46.
- [ ] **Settings Letter Templates** — Not yet implemented. List with actions dropdown, edit template. Reference: 7.07.38 pm, screencapture 19_07.
- [ ] **Settings Payment Settings** — Not yet implemented. Payment number prefix/padding, PDF brand colour, accepted payment forms with edit modal, add new payment type dropdown. Reference: 7.09 pm series, screencapture 19_08_11.
- [ ] **Settings Invoice Settings** — Not yet implemented. Tax settings dropdown, invoice reminders list, edit reminder modal with rich text editor. Reference: 7.11.05-7.11.32 pm, screencapture 19_10_06.
- [ ] **Settings Tax Rates page** — Not yet implemented. List, new tax rate modal. Reference: 7.11.44-7.11.55 pm.
- [ ] **Settings Data Export page** — Not yet implemented. Export type/date selection, export history with download/delete. Reference: 7.12 pm series, screencapture 19_12_04.
- [ ] **Settings Data Import page** — Not yet implemented. Import source modal (CSV/Cliniko), CSV import with tabs. Reference: 7.13 pm series, screencapture 19_13_00.

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
