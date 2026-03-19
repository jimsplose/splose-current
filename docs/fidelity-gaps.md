# Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.
Priority ordering: high-traffic pages first (Dashboard, Calendar, Clients), then secondary pages.

## Completion criteria

See the **Gap completion rule** in CLAUDE.md (single source of truth). In short: a gap is only `[x]` when ALL related catalog entries show Match = "yes".

## Priority 1 — High-traffic pages

### Group D — Dashboard (`src/app/page.tsx`)
- [x] **Dashboard improvements** — Messages panel, income chart, incomplete progress notes, recently submitted forms, compose area all implemented.

### Group E — Client detail (`src/app/clients/[id]/`)
- [ ] **Client appointments sub-tab** — Table structure and badges match, but appointment side panel from client page not implemented (11.12.37 = no). Reopened: visual audit found side panel missing. Badge styling on 11.15.20 slightly off (partial).

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
- [ ] **Settings Splose AI** — Core page matches (3 full-page + 3 March 11 screenshots = yes). Reopened: modal/dropdown screenshots still partial (Edit prompt modal, AI block actions dropdown, Edit AI block modal).
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
- [ ] **Calendar month view** — Month view with appointments and appointment detail side panel. Reference: 7.23.16-7.23.23 pm. Reopened: visual audit found month view side panel not implemented (7.23.23 pm = no).
- [ ] **Calendar appointment side panel** — Appointment detail flyout with Edit/Reschedule/Archive actions, edit appointment form with Room/Resource dropdown. Reference: 7.23.33-7.25.52 pm. Reopened: visual audit found side panel has placeholder content only, missing structured client info, Edit/Reschedule/Archive actions, and Room/Resource form (all 3 screenshots = no).

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
- [x] **Patient form view page** — Implemented at `/patient-form/[id]/view` with sections, file links, status badge (2026-03-18).
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
- [x] **Dev Navigator Phase 1** — State registry (30+ pages, 60+ variants), floating toolbar, grouped page tree, search, keyboard shortcut (2026-03-18).
- [x] **Dev Navigator Phase 2** — Wired `?state=` param into Calendar (7 variants), Waitlist (3 variants), Settings (25 variants), Settings AI (2 variants). All interactive pages now navigable via URL. (2026-03-18)

## Priority 5 — New pages and final polish

### Group N — New pages
- [x] **Online booking page** — Public appointment booking flow with practitioner selection, date/time picker, confirmation form, appointment summary sidebar. Two-step flow matching reference screenshots. (2026-03-18)
- [x] **Calendar practitioner columns** — Day view shows practitioner columns with name headers. Week view has practitioner sub-columns within each day. Completed (2026-03-18).

### Group H — New screenshot intake (reads all files)
- [ ] **Process new screenshots** — Check `screenshots/reference/` against `screenshots/processed.txt` to find unreviewed screenshots. Launch Explore agents in parallel (batches of 10-15) to read and categorize them. See `docs/screenshot-workflow.md`.

### Group J — Sweep (reads all files)
- [x] **General fidelity sweep** — Sweep completed: cases page expanded to 10 rows with pagination, forms page expanded to 10 rows, client detail edit mode added, reports frequency dropdown added. All major pages verified against references. (2026-03-18)
- [x] **Design system migration** — All 13 pages migrated to DS components (2026-03-19). See Group O below for details.

## Priority 6 — DS component migration (remaining violations)

### Group O — DS migration (per-page violations)

These pages contain inline patterns that should use DS components. Each must be migrated and verified.

- [x] **Dashboard DS migration** (`src/app/page.tsx`) — Send button migrated to Button. Toolbar icons kept inline (allowed). (2026-03-19)
- [x] **Login DS migration** (`src/app/login/page.tsx`) — FormInput for email/password, Button for login. (2026-03-19)
- [x] **Reports DS migration** (`src/app/reports/page.tsx`) — 7 buttons → Button, 1 select → FormSelect. (2026-03-19)
- [x] **Clients list DS migration** (`src/app/clients/page.tsx`) — SearchBar, Badge for NDIS/Medicare. (2026-03-19)
- [x] **Contacts DS migration** (`src/app/contacts/page.tsx`) — SearchBar. (2026-03-19)
- [x] **Invoices DS migration** (`src/app/invoices/page.tsx`) — SearchBar. (2026-03-19)
- [x] **Notes list DS migration** (`src/app/notes/page.tsx`) — SearchBar, Badge for Final/Draft. (2026-03-19)
- [x] **Products DS migration** (`src/app/products/page.tsx`) — SearchBar, Button, Pagination. (2026-03-19)
- [x] **Waitlist DS migration** (`src/app/waitlist/page.tsx`) — Triage action buttons → Button. Tabs kept inline. (2026-03-19)
- [x] **Online booking DS migration** (`src/app/online-booking/page.tsx`) — FormInput/FormSelect for phone/email, Button. (2026-03-19)
- [x] **Practitioners DS migration** (`src/app/practitioners/page.tsx`) — Badge for specialty tags. (2026-03-19)
- [x] **Calendar DS migration** (`src/app/calendar/CalendarView.tsx`) — 14 form fields → FormInput/FormSelect. (2026-03-19)
- [x] **Client detail DS migration** (`src/app/clients/[id]/ClientDetailClient.tsx`) — Removed banned inputClass pattern. (2026-03-19)

## Priority 7 — Visual audit findings (2026-03-19)

### Group P — Calendar interaction gaps (`src/app/calendar/CalendarView.tsx`)
- [ ] **Calendar click-to-create popover** — Reference shows a popover when clicking time slots for quick appointment creation. Currently only modal-based creation exists. Reference: 5.53.13-5.53.18 pm.
- [ ] **Calendar create appointment modal refinement** — Missing Service field (has Appointment Type instead), toggles, and past date validation. Reference: 5.53.25-5.54.19 pm.
- [ ] **Calendar appointment side panel styling** — Detail flyout panel and edit form are coded but button styling (DS Button variants), modal container styling (backdrop/shadow), and dropdown arrow directions don't match references. Reference: 7.23.33, 7.25.23, 7.25.52 pm (all = no). (2026-03-19 audit)
- [ ] **Calendar toolbar polish** — Week/day view toolbar needs button styling refinement, dropdown chevron directions, filter pill styling, and hover states on cells. All week view screenshots remain partial. (2026-03-19 audit)

### Group Q — Missing detail/view pages
- [ ] **Contact detail page** — `/contacts/[id]` not implemented. Reference shows Details tab with Associated clients, and Invoices tab. Reference: 11.14.14-11.14.21 am.
- [ ] **Invoice view page** — `/invoices/[id]` not implemented. Reference shows PDF-style invoice with Pay/Email/Actions buttons. Reference: 11.16.02-11.16.25 am.
- [ ] **Client edit details page** — Edit form exists but interaction is limited, profile photo upload missing prominence. Reference: 11.11.08 am.
- [ ] **Client appointment side panel** — Side panel for appointment details from client page not implemented. Reference: 11.12.37 am.
- [ ] **Clients list filter dropdowns** — Tags filter dropdown (11.10.08) and Active/Archived status dropdown (11.10.24) not implemented in UI. Only SearchBar present. (2026-03-19 audit)

## Priority 8 — New DS components needed (2026-03-19 audit)

Common inline patterns found across 2+ pages that should be extracted into reusable DS components in `src/components/ds/`.

**Naming convention:** DS components use [DaisyUI](https://daisyui.com/components/) component names where a matching concept exists. This keeps our vocabulary aligned with a well-known Tailwind component library. Where no DaisyUI equivalent exists, we use a descriptive name.

### Group R — High-priority DS components (appear on 3+ pages)

- [ ] **Tab** (`Tab.tsx`) — Underline-style tab bars with active state (`border-b-2 border-primary`). DaisyUI: `tab`. Found: settings/page.tsx (3 instances), settings/ai/page.tsx (1), waitlist/page.tsx (4). **~8+ instances across 3 pages.**
- [ ] **Toggle** (`Toggle.tsx`) — Boolean toggle switch (`h-6 w-11 rounded-full`, checked=bg-primary, unchecked=bg-gray-200). DaisyUI: `toggle`. Found: settings/page.tsx (3+), settings/ai/page.tsx (5+), calendar/CalendarView.tsx (2). **~10+ instances across 3 pages.** Already defined inline as local `Toggle` function in settings — move to DS.
- [ ] **Modal** (`Modal.tsx`) — Centered overlay with backdrop (`fixed inset-0 bg-black/40` + centered white card). DaisyUI: `modal`. Found: calendar/CalendarView.tsx (2 modals), settings/page.tsx (multiple modals), notes/[id]/page.tsx (send modal). **~5+ instances across 3+ pages.**
- [ ] **Avatar** (`Avatar.tsx`) — Colored circle with initials (`rounded-full bg-{color} text-white` + computed initials). DaisyUI: `avatar`. Found: page.tsx (Dashboard), calendar/CalendarView.tsx, reports/page.tsx, clients/[id]/ClientDetailClient.tsx, practitioners/page.tsx, contacts/[id]/page.tsx, online-booking/page.tsx. **~7+ instances across 6+ pages.**
- [ ] **Dropdown** (`Dropdown.tsx`) — Absolute positioned action menu (`absolute z-20 rounded-lg border shadow-lg bg-white py-1`). DaisyUI: `dropdown` + `menu`. Found: calendar/CalendarView.tsx (2 dropdowns), settings/page.tsx (action menus), waitlist/page.tsx. **~5+ instances across 3+ pages.**
- [ ] **EmptyState** (`EmptyState.tsx`) — Centered icon + message + optional CTA (`flex flex-col items-center py-16` + icon circle + text). No DaisyUI equivalent (custom). Found: clients/[id]/invoices, payments, support-activities (3), contacts/[id]/page.tsx, products/page.tsx, settings, reports, waitlist. **~8+ instances across 5+ pages.**
- [ ] **List** (`List.tsx`) — Fixed-width label + value row for detail views (`flex gap-16`, label=w-28 text-secondary). DaisyUI: `list`. Found: clients/[id]/ClientDetailClient.tsx (15+ instances in details sections). **15+ instances, single page but high density.**

### Group S — Medium-priority DS components (appear on 2+ pages)

- [ ] **Card** (`Card.tsx`) — White rounded bordered container (`rounded-lg border border-border bg-white p-5`). DaisyUI: `card`. Found: settings/page.tsx (SMS balance, provider config), reports/page.tsx (chart cards). **4+ instances across 2 pages.**
- [ ] **Select** (`Select.tsx`) — Searchable dropdown with search input, filtered results list, click-to-select. DaisyUI: `select` (enhanced with search). Found: payments/new/page.tsx (client search, invoice search — 2 instances). Pattern also needed for client/practitioner selectors across app.
- [ ] **Navbar** (`Navbar.tsx`) — Back arrow + title + badge + action buttons bar (`border-b bg-white px-6 py-3`). DaisyUI: `navbar`. Found: notes/new, notes/[id], notes/[id]/edit, invoices/[id], payments/new. **5+ instances across 5 pages.** Extends PageHeader with back navigation.
- [ ] **DateRangeFilter** (`DateRangeFilter.tsx`) — Two date boxes + arrow separator (`rounded-lg border px-3 py-2 text-sm`). No DaisyUI equivalent (custom). Found: reports/appointments, reports/performance, reports/progress-notes. **3 instances across 3 pages.**
- [ ] **Filter** (`Filter.tsx`) — Horizontal button group with active highlight / segmented control (`overflow-hidden rounded-lg border` + toggle buttons). DaisyUI: `filter`. Found: notes/new (view toggle), notes/[id]/edit (view toggle), settings/page.tsx (status filters). **3+ instances across 3 pages.**
- [ ] **Collapse** (`Collapse.tsx`) — Expandable section with chevron toggle (`border-b pb-3` + ChevronDown). DaisyUI: `collapse`. Found: clients/[id]/ClientDetailClient.tsx (4 right sidebar sections: Client alerts, Stripe, Mailchimp, QuickBooks).

### Group T — Lower-priority DS components (2 pages or niche use)

- [ ] **Status** (`Status.tsx`) — Small colored circle indicating status (`h-2.5 w-2.5 rounded-full`). DaisyUI: `status`. Found: clients/[id]/appointments (status indicators), calendar/CalendarView.tsx (practitioner dots). Pattern is simple but would standardize sizes/colors.
- [ ] **AsyncSelect** (`AsyncSelect.tsx`) — Select that fetches data from API endpoint on mount. Extension of Select. Found: notes/new/page.tsx (ClientSelect, PractitionerSelect — 2 inline components). Would reduce boilerplate for data-driven selects.

### Group U — SearchBar adoption (existing DS component not used)

- [ ] **Client sub-tabs SearchBar migration** — 6 client sub-tab pages have inline search+button instead of using the existing `SearchBar` DS component. Files: clients/[id]/communications, files, notes, forms, invoices, payments.

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
