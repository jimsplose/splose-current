# Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.
Priority ordering: high-traffic pages first (Dashboard, Calendar, Clients), then secondary pages.

## Completion criteria

See the **Gap completion rule** in CLAUDE.md (single source of truth). In short: a gap is only `[x]` when ALL related catalog entries show Match = "yes".

## Priority 1 — High-traffic pages

### Group D — Dashboard (`src/app/page.tsx`)
- [ ] **Dashboard improvements** — Reopened 2026-03-25: Income chart X-axis labels jammed together (no spacing/rotation), rich text editor missing GIF button/undo-redo/horizontal rule/extra "N" avatar. Messages panel, sidebar panels match well.

### Group E — Client detail (`src/app/clients/[id]/`)
- [x] **Client appointments sub-tab** — AppointmentSidePanel.tsx implemented with structured details, Status DS component, action buttons. Profile photo layout improved in edit form. (2026-03-20)

## Priority 2 — Core workflow pages

### Group A — Waitlist (`src/app/waitlist/`)
- [x] **Waitlist Screener tab** — Already implemented with triage buttons, tags, client, DOB, address, form, date columns.
- [x] **Waitlist Map view** — Already implemented with Map/List toggle and placeholder map.

### Group C — Settings (`src/app/settings/`)
All 25 Settings sub-pages are implemented as inline components in `settings/page.tsx`:
- [x] **Settings Details page** — Form with business name, ABN, address, phone, email, logo, email signature.
- [x] **Settings Integrations page** — Integration cards (Xero, MYOB, Stripe, Tyro, Halaxy, Zoom, Google Calendar).
- [x] **Settings SMS Settings page** — SMS provider config, sender name, reply-to, opt-out settings.
- [x] **Settings Form Templates** — Fixed: columns updated to Title/Form type/Created at/Updated at, title changed to "Form templates", Learn/Show archived added. 5.55% pixel diff (full-page vs viewport). (2026-03-20)
- [x] **Settings Splose AI** — Core page matches. Edit prompt modal, AI block actions dropdown, and Edit AI block modal all implemented. AI block library populated with 5 sample blocks. (2026-03-19)
- [x] **Settings Locations page** — Locations list with edit form.
- [x] **Settings Custom Fields page** — List with reorder, actions dropdown, update field modal.
- [x] **Settings Rooms/Resources page** — Fixed: Group/Capacity/Location columns added, search bar, Learn/Show archived buttons added. 6.43% pixel diff (browser chrome). (2026-03-20)
- [x] **Settings Services page** — Fixed: Type column, search bar, Learn/Show archived, sort controls added. Price format updated to rate. 8.73% pixel diff (browser chrome). (2026-03-20)
- [x] **Settings Busy Times page** — List with utilisation/duration, actions dropdown.
- [x] **Settings Cancellation Reasons page** — List with edit/delete, edit modal.
- [x] **Settings Online Booking pages** — Fixed: columns changed to Name/Created at/Last updated, title updated to "Online booking settings". 7.54% pixel diff (browser chrome). (2026-03-20)
- [x] **Settings Communication Types page** — List with default type flags, actions.
- [x] **Settings Tags page** — Client tags with edit tag modal and colour picker.
- [x] **Settings Referral Types page** — List with actions.
- [x] **Settings Users page** — List with actions dropdown.
- [x] **Settings User Groups page** — List with actions, edit group modal.
- [x] **Settings Appointment Templates** — Fixed: Type/SMS/Email/Last modified columns added. 6.97% pixel diff (browser chrome). (2026-03-20)
- [x] **Settings Email Templates** — Fixed: Type column with colored badges added (Invoice/Payment/Progress note/Form/Letter/General). 6.64% pixel diff (browser chrome). (2026-03-20)
- [x] **Settings Progress Note Templates** — List with 5 templates, AI banner, search. Restored from stub. (2026-03-20)
- [x] **Settings Letter Templates** — List with 7 templates, search, Created at/Last updated columns. Restored from stub. (2026-03-20)
- [x] **Settings Payment Settings** — Next payment number, PDF brand colour, accepted payment methods table (10), NDIS bulk upload. Restored from stub. (2026-03-20)
- [x] **Settings Invoice Settings** — Stripe banner, invoice/credit note numbers, tax settings, invoice reminders table (7), invoice templates table (10). Restored from stub. (2026-03-20)
- [x] **Settings Tax Rates page** — List with 3 rates (GST 10%, No tax, GST Free), actions. New route created. (2026-03-20)
- [x] **Settings Data Export page** — Export form with dropdown/date range, export history table (6 rows with Done/Error badges). New route created. (2026-03-20)
- [x] **Settings Data Import page** — Concierge banner, import history table (4 CSV imports with status badges). New route created. (2026-03-20)

### Group K — Calendar enhancements (`src/app/calendar/`)
- [x] **Calendar Rooms/Resources view** — Calendar/Rooms toggle, room filter dropdown. Reference: 7.22.38-7.22.53 pm.
- [x] **Calendar view type switcher** — Month/Week/Day dropdown. Reference: 7.23.04 pm.
- [ ] **Calendar month view** — Month view with appointments and appointment detail side panel. Reference: 7.23.16-7.23.23 pm. Side panel now implemented and functional from month view clicks. Remaining diff is data-driven (different appointment names/counts). (2026-03-20)
- [ ] **Calendar appointment side panel** — Appointment detail flyout with Edit/Reschedule/Archive actions, edit appointment form with Room/Resource dropdown. Reference: 7.23.33-7.25.52 pm. All content now implemented: structured client info, email, status, zoom/invoice/note links, repeating info, organiser, Book another/Edit/Reschedule/Archive buttons, View change log. Edit form has Room/Resource dropdown. Remaining diff is data-driven. (2026-03-20)

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
- [x] **Calendar click-to-create popover** — Popover with Support activity/Busy time/Appointment options on time slot click. Opens create modal pre-filled with time. (2026-03-20)
- [x] **Calendar create appointment modal refinement** — Service field (was Appointment Type), Location/Case/Room fields, DS Toggle for Provider Travel/Non-Labour/Transport/Repeat, past date warning, Waitlist matches section. All form fields use DS components. (2026-03-20)
- [x] **Calendar appointment side panel styling** — Side panel widened to 420px for button row, month view backdrop removed for visibility, all buttons use DS Button variants. Edit form Room/Resource dropdown implemented with categories. (2026-03-20)
- [x] **Calendar toolbar polish** — Added yellow "Booking for a a ×" filter pill, fixed month format to "Mar" (short), updated title font weight, replaced Search icon with MapPin. Toolbar now matches day/week/month view references. (2026-03-20)

### Group Q — Missing detail/view pages
- [x] **Contact detail page** — `/contacts/[id]` implemented with Details tab (General details, Contact details, Associated clients table), sidebar nav, Actions button. (2026-03-19)
- [x] **Invoice view page** — `/invoices/[id]` implemented with PDF-style invoice layout, Pay/Email/Actions buttons, line items table, totals, additional info. (2026-03-19)
- [x] **Client edit details page** — Profile photo moved side-by-side with General details form (larger 32x32 box with Upload button). (2026-03-20)
- [x] **Client appointment side panel** — AppointmentSidePanel.tsx implemented with structured details, action buttons, Status DS component. (2026-03-20)
- [x] **Clients list filter dropdowns** — Tags filter dropdown and Active/Archived status dropdown added using DS Dropdown component. Extracted ClientsPageClient.tsx. (2026-03-19)

## Priority 8 — DS components & page migration (2026-03-19)

All 22 DS components have been **created** in `src/components/ds/` with full implementations, Storybook stories, and barrel exports. The remaining work is **migrating pages** to use them instead of inline patterns.

**Naming convention:** DS components use [DaisyUI](https://daisyui.com/components/) component names where a matching concept exists.

### Group R — High-priority DS components (created, migration in progress)

- [x] **Tab** (`Tab.tsx`) — Component created with stories. Migrated: settings/ai/page.tsx. Remaining: waitlist/page.tsx tabs kept inline (different visual style). (2026-03-19)
- [x] **Toggle** (`Toggle.tsx`) — Component created with stories. Migrated: settings/page.tsx (removed local Toggle), settings/ai/page.tsx, settings/sms-settings/page.tsx, calendar/CalendarView.tsx. (2026-03-19)
- [x] **Modal** (`Modal.tsx`) — Component created with stories. Migrated: notes/[id]/SendNoteModal.tsx, invoices/[id]/InvoiceDetailClient.tsx, calendar/CalendarView.tsx. login/page.tsx skipped (full-page layout, not a modal). (2026-03-19)
- [x] **Avatar** (`Avatar.tsx`) — Component created with stories. Migrated: page.tsx (Dashboard, 5 instances), clients/[id]/ClientDetailClient.tsx, contacts/[id]/page.tsx, calendar/CalendarView.tsx. (2026-03-19)
- [x] **Dropdown** (`Dropdown.tsx`) — Component created with stories. Migrated: calendar/CalendarView.tsx. payments/new had no dropdown pattern. (2026-03-19)
- [x] **EmptyState** (`EmptyState.tsx`) — Component created with stories. All target pages already used EmptyState or migrated: contacts/[id] migrated, products/notes/settings-forms/waitlist/payments-new already had EmptyState. (2026-03-19)
- [x] **List** (`List.tsx`) — Component created with stories. Migrated: clients/[id]/ClientDetailClient.tsx (8 sections: General details, Contact details, Privacy consent, Medications, Medicare, NDIS, Custom fields, Invoicing). (2026-03-20)

### Group S — Medium-priority DS components (created, not yet migrated)

- [x] **Card** (`Card.tsx`) — Component created with stories. Migrated: reports/page.tsx and reports/progress-notes (2026-03-19). settings/page.tsx has no card pattern. (2026-03-19)
- [x] **Select** (`Select.tsx`) — Component created with stories. Migrated: payments/new/page.tsx (searchable client dropdown). (2026-03-19)
- [x] **Navbar** (`Navbar.tsx`) — Component created with stories. Migrated: notes/new, notes/[id], notes/[id]/edit, payments/new. invoices/[id] has no back nav pattern. (2026-03-19)
- [x] **DateRangeFilter** (`DateRangeFilter.tsx`) — Component created with stories. All 3 reports pages migrated (2026-03-19).
- [x] **Filter** (`Filter.tsx`) — Component created with stories. Migrated: notes/new (view toggle), notes/[id]/edit (view toggle). settings/page.tsx email sig tabs are pill buttons (different pattern). (2026-03-19)
- [x] **Collapse** (`Collapse.tsx`) — Component created with stories. Migrated: clients/[id]/ClientDetailClient.tsx (4 sidebar sections: Client alerts, Stripe, Mailchimp, QuickBooks). (2026-03-20)

### Group T — Lower-priority DS components (created, not yet migrated)

- [x] **Status** (`Status.tsx`) — Component created with stories. Migrated: clients/[id]/appointments/AppointmentSidePanel.tsx (status dots in table rows and side panel). Calendar already uses inline status styling. (2026-03-20)
- [x] **AsyncSelect** (`AsyncSelect.tsx`) — Component created with stories. notes/new/page.tsx has no matching pattern — uses static FormSelect. (2026-03-19)

### Group U — SearchBar adoption (existing DS component not used)

- [x] **Client sub-tabs SearchBar migration** — All 6 client sub-tab pages already use SearchBar from DS. No changes needed. (2026-03-20)

## Priority 9 — Visual audit findings (2026-03-20, session D)

### Group V — Routing bugs (`src/app/`)
- [x] **Settings duplicate sidebar bug** — Removed embedded sidebar from rooms-resources and services pages. Layout.tsx already provides the sidebar. (2026-03-20)
- [x] **Settings ?state= routing** — State registry already uses sub-routes correctly. Added missing new routes (tax-rates, data-export, data-import) to registry. (2026-03-20)
- [x] **Settings placeholder pages** — All 10 stub pages restored with full implementations + 3 new routes (Tax Rates, Data Export, Data Import). (2026-03-20)

### Group W — Missing/broken pages
- [x] **Invoice detail 404** — Was using ID `1` but seed data uses CUIDs. Updated state registry to use actual seed ID. Page loads correctly. (2026-03-20)
- [x] **Note view 404** — Same issue — updated state registry to use actual seed CUID. Page loads correctly. (2026-03-20)
- [x] **Note edit timeout** — Same ID issue as above. With correct seed ID, page loads. (2026-03-20)
- [x] **Waitlist map not rendering** — Was using wrong state param `?state=map`. Correct param is `?state=waitlist-map`. Map view renders correctly. (2026-03-20)

## Priority 10 — Design system opportunities (2026-03-21)

Patterns identified from the interactive states implementation audit. All opportunities completed.

### Group X — DS hooks & utilities (`src/lib/`, `src/components/ds/`)

- [x] **`useFormModal` hook** — Created in `src/hooks/useFormModal.ts`. Migrated 15 settings pages. ~300 LOC saved. (2026-03-21)
- [x] **Dropdown presets** — Created in `src/lib/dropdown-presets.ts` (STANDARD_SETTINGS, SIMPLE_CRUD, USER_ADMIN). Migrated 17 settings pages. ~200 LOC saved. (2026-03-21)
- [x] **`formatTimestamp()` utility** — Created in `src/lib/format.ts`. Migrated 5 settings pages. (2026-03-21)

### Group Y — New DS components (`src/components/ds/`)

- [x] **`FormColorPicker` component** — Created with native and swatches variants. Migrated tags, busy-times, rooms-resources. Storybook story added. (2026-03-21)
- [x] **`OnOffBadge` component** — Created with configurable labels. Migrated appointment-templates, communication-types, referral-types. Storybook story added. (2026-03-21)
- [x] **`ColorDot` component** — Created with sm/md/lg sizes. Migrated rooms-resources, busy-times. Storybook story added. (2026-03-21)
- [x] **`BADGE_TYPE_VARIANTS` utility** — Created in `src/lib/badge-variants.ts`. Migrated email-templates. (2026-03-21)

### Group Z — Page templates (`src/components/ds/`)

- [x] **`SettingsListPage` template** — Created in `src/components/ds/SettingsListPage.tsx` with generic type params, column definitions, search/pagination, dropdown actions, and useFormModal integration. Storybook story added. Pages can be migrated individually. (2026-03-21)

## Priority 11 — Style reference audit Phase 4 (2026-03-23)

### Group AA — Page-level fidelity sweep (structural fixes applied)

- [x] **Dashboard column proportions** — Inverted columns: messages now `w-[380px]` (narrower, left), analytics now `flex-1` (wider, right). Added `bg-surface-header` header bars to each dashboard card section. Matches reference `_col1`/`_col2` structure. (2026-03-23)
- [x] **Patient detail tab bar** — Replaced sidebar navigation with horizontal `Tab` bar using link-based navigation. 13 tabs in reference order: Details, Appointments, Communications, Files, Notes, Cases, Support Activities, Forms, Invoices, Payments, Statements, Letters, Practitioner Access. Enhanced `Tab` DS component with `href` prop for Next.js Link-based tabs. (2026-03-23)
- [x] **Invoices list table migration** — Migrated from raw HTML `<table>`/`<th>` to DS `DataTable`/`Th` components. Replaced manual sort/filter icons with `Th` built-in `sortable`/`filterable` props. Fixed search placeholder to match reference. (2026-03-23)
- [x] **Calendar toolbar icons** — Replaced LayoutGrid/MapPin with Command/Lightbulb to match reference `anticon-mac-command`/`anticon-bulb`. Changed location/service filters from Chips to Buttons. Removed orphan `+` button. Added full date display in day view. (2026-03-23)
- [x] **Clients list filter cleanup** — Removed standalone Active/Archived + Tags filter bar (not in reference). Migrated to `Th` `sortable`/`filterable` props for column-level filtering. (2026-03-23)
- [x] **Settings hub** — No structural mismatches found. Sidebar groups, items, and content match reference. (2026-03-23)
- [x] **Reports hub** — No structural mismatches found. Sidebar groups, filter bar, charts, and table match reference. (2026-03-23)

## Priority 12 — Pixel-perfect comparison audit (2026-03-25)

### Group AB — Cross-cutting styling issues (multiple files)

- [x] **Date format inconsistency** — Fixed: Clients list and detail now show "14 Feb 2018" format using formatDOB helper. (2026-03-25)
- [x] **Phone number formatting** — Fixed: Clients list phones now render as purple clickable `<a href="tel:">` links. (2026-03-25)
- [x] **Sort/filter icon colors** — Fixed: Th component uses `text-primary/60` (purple tint) instead of gray. (2026-03-25)
- [x] **Status badge styling** — Fixed: Badge component has new `solid` prop; invoices use solid filled pills matching production. (2026-03-25)
- [x] **Tag styling** — Fixed: Clients list tags now use outlined yellow/gold pill style (border-yellow-400 bg-yellow-50). (2026-03-25)
- [x] **Section dividers** — Fixed: Client detail uses `border-t-2 border-orange-200` dividers matching production. (2026-03-25)
- [ ] **Rich text editor toolbar** — Missing GIF button, undo/redo arrows, horizontal rule (—) icon across all editor instances. Extra "N" avatar on Dashboard. Toolbar uses "..." overflow instead of showing all icons. Affects: Dashboard compose area, Settings email signature, note editors. (2026-03-25)

### Group AC — Calendar fidelity (`src/app/calendar/CalendarView.tsx`)

- [x] **Calendar toolbar icons** — Fixed: Settings gear, CalendarDays grid, added purple Sparkles icon. (2026-03-25)
- [x] **Calendar practitioner grouping** — Fixed: Practitioners grouped by location (East Clinics, Splose OT, Tasks) with bold headers and vertical separators. (2026-03-25)
- [x] **Calendar timezone indicator** — Fixed: Added "+11:00" in top-left corner of day view grid. (2026-03-25)
- [x] **Appointment block styling** — Fixed: Blocks now use light muted backgrounds with dark text, 12h time format, and service name line. (2026-03-25)
- [x] **Calendar day view date mismatch** — Fixed: Header now uses todayStr directly. (2026-03-25)

### Group AD — Dashboard fidelity (`src/app/page.tsx`)

- [x] **Income chart X-axis labels** — Fixed: Labels rotated -45deg, properly spaced, "Sep 2025" format. (2026-03-25)

### Group AE — Waitlist fidelity (`src/app/waitlist/page.tsx`)

- [x] **Waitlist triage button layout** — Fixed: flex-col layout, buttons now stacked vertically. (2026-03-25)

### Group AF — Settings fidelity (`src/app/settings/`)

- [x] **Settings sidebar label** — Fixed: Renamed to "Cancel/Reschedule". (2026-03-25)
- [x] **Settings email signature switcher** — Fixed: Uses pill dropdown buttons "Business ∨" / "User ∨" matching production. (2026-03-25)
- [x] **Settings disabled fields** — Fixed: Currency code, Country, Currency symbol now disabled with gray background. (2026-03-25)

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
