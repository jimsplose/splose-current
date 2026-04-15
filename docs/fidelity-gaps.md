# Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.
Priority ordering: high-traffic pages first (Dashboard, Calendar, Clients), then secondary pages.

## Completion criteria

See the **Gap completion rule** in CLAUDE.md (single source of truth). In short: a gap is only `[x]` when ALL related catalog entries show Match = "yes".

## DS compliance grading

Every page should aim for **Grade A (>90% DS component usage)**. The `/audit` workflow now includes a DS compliance quick scan per page. Grade definitions:

| Grade | Inline `style={{` | Raw HTML with styling | Criteria |
|-------|-------------------|----------------------|----------|
| **A** | ≤10 | 0 raw buttons/cards | Page structure almost entirely DS components |
| **B** | 11-30 | ≤5 raw patterns | Some inline styles for layout/positioning |
| **C** | >30 | >5 raw patterns | Significant inline styling, needs migration |

When creating new gaps or fixing existing ones, prefer DS component solutions over inline style fixes. A gap should not be marked `[x]` if the fix introduces new inline styles that could use existing DS components.

## Priority 0 — AntD Migration Systemic Regressions (2026-03-31 audit)

Cross-cutting issues affecting multiple pages. Fix these first for maximum impact.

### Group S1 — PageHeader consistency (10 settings + 3 detail pages)
- [x] **Gray title color on pages using bare h1** — All listed settings pages already use PageHeader (green). Added green color to text-display-lg class for remaining bare h1 usages. (2026-03-31)

### Group S2 — Search input sizing (all list pages)
- [x] **Search input height/fontSize mismatch** — Fixed: SearchBar size="large", AntD theme fontSizeLG=16 controlHeightLG=38. Measurement-verified 2026-03-31.

### Group S3 — Table header background (all list pages)
- [x] **Th background color mismatch** — Fixed: bg moved from thead tr to th, color updated to rgb(243,245,247) in Th component + AntD theme headerBg + CSS override. Measurement-verified 2026-03-31.

### Group S4 — Dashboard card headers
- [x] **Dashboard section heading bg missing** — Fixed: --color-fill-quaternary was undefined, switched to --color-fill-secondary (rgb(243,245,247)). Measurement-verified 2026-03-31.

### Group S5 — Detail page header component
- [x] **Detail page header sizes/colors** — Fixed: Client/Contact labels now 20px/700/green/Sprig Sans. Details heading uses text-display-lg (30px green). SideNav active color changed from purple to black. Measurement-verified 2026-03-31.

### Group S6 — Reports overview card headings (`src/app/reports/page.tsx`)
- [x] **Card headings (Utilisation/Revenue) too small** — Fixed: changed text-heading-sm to inline fontSize:20/fontWeight:700. Measurement-verified 2026-04-01: both 20px/700/rgb(65,69,73) exact match.

### Group S7 — Add payment page (`src/app/payments/new/page.tsx`)
- [x] **Title text/style mismatch** — Fixed: title changed to "Add payment", Navbar component updated to 30px/700/green (S9). Measurement-verified 2026-04-01: title exact match. (Labels/buttons partially fixed via S9 Navbar update.)

### Group S8 — Invoice detail typography (`src/app/invoices/[id]/page.tsx`)
- [x] **Section labels and sidebar heading too small/light** — Fixed: labels to 13px/700/rgb(65,69,73), Payments heading to 21px/500/rgb(65,69,73). Measurement-verified 2026-04-01: exact match on both.

### Group S9 — Edit/detail page titles (systemic across settings sub-pages)
- [x] **Edit/detail pages use wrong title pattern** — Fixed: Navbar component h1 updated to 30px/700/rgb(66,105,74)/Sprig Sans, matching PageHeader. All edit/detail pages now use correct title styling systemically. Measurement-verified on /payments/new 2026-04-01: exact match.

### Group S10 — Client detail layout gap (13 pages)
- [x] **Horizontal tabs duplicating sidebar + empty gap** — Fixed: removed horizontal tabs from ClientSidebar.tsx, restructured layout.tsx so heading row spans full width above sidebar+content row. Matches production. Measurement-verified 2026-04-01: all properties match.

### Group S11 — Invoice detail heading (`src/app/invoices/[id]/page.tsx`)
- [x] **Invoice # title wrong size/color** — Fixed: h1 changed from text-heading-lg (18px/600/gray) to inline 30px/700/rgb(66,105,74). "Note" heading changed from text-label-lg to 21px/500/rgb(65,69,73). Measurement-verified 2026-04-01.

### Group S12 — Form label styling (DS components)
- [x] **Form labels wrong weight/color** — Fixed: FormInput, FormSelect, FormTextarea, Select DS components updated from 400/var(--color-text-secondary) to 600/rgb(34,34,34). Measurement-verified on /payments/new 2026-04-01.

### Group S13 — Search button CSS selector (all ListPage instances) `src/app/globals.css`
- [x] **Search button purple instead of white** — Fixed: Added `.ant-input-search-btn` selector alongside `.ant-input-search-button` in globals.css. Measurement-verified 2026-04-08: bg rgb(255,255,255), color rgba(0,0,0,0.45) exact match on Clients list.

### Group S14 — colorLink missing from theme `src/components/ds/theme.ts`
- [x] **Link-colored elements blue instead of purple** — Fixed: Added `colorLink: "#8250FF"` to sploseTheme.token. Measurement-verified 2026-04-08: "New client" color rgb(130,80,255), "Load more" color rgb(130,80,255) exact match.

### Group S15 — heading/lg fontWeight mismatch `src/components/ds/Text.module.css`
- [x] **Section headings fontWeight 600 should be 700** — Fixed: Updated `.headingLg` font-weight to 700. Measurement-verified 2026-04-08: "General details" 18px/700 exact match on Client detail.

### Group S16 — body/md-strong fontWeight mismatch `src/components/ds/Text.module.css`
- [x] **Strong body text fontWeight 600 should be 700** — Fixed: Updated `.bodyMdStrong` font-weight to 700. Measurement-verified 2026-04-08: Dashboard author name 14px/700/rgb(65,69,73) exact match.

### Group S17 — Dashboard messages widget styling `src/app/DashboardClient.tsx`
- [x] **Send button too small** — Fixed: Removed `size="sm"` prop. Measurement-verified 2026-04-08: 38px/8px exact match.
- [x] **Timestamp/date divider colors wrong** — Fixed: Changed color prop from "secondary" to "text", date divider variant from "caption/md" to "body/md", appointment author from "heading/sm" to "body/md-strong". Measurement-verified 2026-04-08: timestamp color rgb(65,69,73), date divider 14px/rgb(65,69,73) exact match.

### Group S18 — Settings sidebar layout `src/app/settings/layout.tsx`
- [x] **Sidebar scroll architecture** — Fixed: removed `overflowY: auto` from content container, made SideNav `position: sticky; top: 57px; height: calc(100vh - 57px); align-self: flex-start`. Content now scrolls with document, sidebar stays pinned. Committed 2026-04-09.
- [x] **Section header color** — Fixed: SideNav.module.css `.sectionTitle` color changed from `var(--color-text)` to `rgb(0, 0, 0)`. Measurement-verified 2026-04-14.
- [x] **Missing "Client data" menu item** — Fixed: Added to Data section in settings/layout.tsx + stub page at /settings/client-data. Measurement-verified 2026-04-14: 28 items.
- [x] **"New" badge shape** — Fixed: SideNav.module.css `.badge` borderRadius 4px→24px, fontSize 11px→12px, padding 2px 6px→1px 8px. Measurement-verified 2026-04-14.
- [x] **Sidebar paddingTop** — Both production and localhost already 15px. Confirmed via measurement 2026-04-14. Original gap description was incorrect.
- [x] **Active item background** — Fixed: SideNav.module.css `.linkActive` bg changed from rgba(0,0,0,0.04) to transparent. Measurement-verified 2026-04-14.

## Priority 1 — High-traffic pages

### Group D — Dashboard (`src/app/page.tsx`)
- [x] **Dashboard improvements** — Income chart X-axis fixed (Group AD). RichTextEditor toolbar fixed (Group AB). Messages panel and sidebar panels match. (2026-03-25)

### Group E — Client detail (`src/app/clients/[id]/`)
- [x] **Client appointments sub-tab** — AppointmentSidePanel.tsx implemented with structured details, Status DS component, action buttons. Profile photo layout improved in edit form. (2026-03-20)

## Priority 2 — Core workflow pages

### Group A — Waitlist (`src/app/waitlist/`)
- [x] **Waitlist Screener tab** — Already implemented with triage buttons, tags, client, DOB, address, form, date columns.
- [x] **Waitlist Map view** — Already implemented with Map/List toggle and placeholder map.

### Group C — Settings (`src/app/settings/`)
All 25 Settings sub-pages are implemented as inline components in `settings/page.tsx`:
- [x] **Settings Details page** — Fixed: 5 purple dividers added (Divider variant="primary"), section headings changed from heading/md (16px/600) to heading/lg (18px/700). Also fixed text-heading-lg utility class fontWeight 600→700 in globals.css. Measurement-verified 2026-04-14.
- [ ] **Settings Integrations page** — REOPENED 2026-04-15: 26 measurement failures across 48 properties. Fix in `src/app/settings/integrations/page.tsx` (147 lines). Action items:
  1. `IntegrationLogo` (line 20): default `height` 48 → 100. Logo row `height: 80` (line 106) → 120.
  2. All generic "Connect" actions (lines 62, 70, 78, 94): `variant: "primary"` → `variant: "secondary"` (prod uses white outlined, not purple filled).
  3. QuickBooks (line 42): replace `<Button variant="primary">Connect to QuickBooks</Button>` with Intuit's official SVG button (`connect-to-quickbooks.svg` — currently on prod at `/assets/connect-to-quickbooks-CDktfmzW.svg`). Place in `public/images/integrations/` and render as an `<a><img></a>`.
  4. Brand-name purple links in descriptions: add `brandUrl?: string` to `Integration` type; render the first word of each description as a purple `<a>` (`text-primary`, no underline) pointing to `brandUrl`.
  5. Description text: line 116 className `text-text-secondary` → `text-text` (prod color is rgb(65,69,73), not rgb(110,110,100)).
  6. Disconnect red: DS Button `danger` variant currently renders rgb(208,0,50) — update theme token or Button mapping to rgb(240,0,50) to match prod antd default.
  7. Brand heading (line 111): `fontFamily: 'Sprig Sans'` missing. Options: (a) add inline `fontFamily: "'Sprig Sans', 'Inter', sans-serif"`, (b) add new `display/xs` Text variant (21px/700/Sprig Sans/lh 1.4) and use `<Text variant="display/xs" color="rgb(33,105,71)">`.
  8. Brand heading lineHeight: currently inherits 32.97px (1.57); prod is 29.4px (1.4). Set lineHeight explicitly.
  9. Card bg: Flex (line 104) has no `backgroundColor`. Prod card has white bg. Add `backgroundColor: 'rgb(255,255,255)'` or migrate to `<Card>` DS component.
  10. Zoom logo (line 85): fake `<span>` text. Add real `public/images/integrations/zoom.svg` and use `<IntegrationLogo src="/images/integrations/zoom.svg" alt="Zoom" />`.
  11. Copy fix line 67: `Worksite Victoria` → `Worksafe Victoria`.
  12. Copy fix line 75: `Tyro is a related healthcare providers to process digital payments and claims online.` → `Tyro Health enables healthcare providers to process digital payments and claims online.` Also consider prod copy: `contactless debit and credit cards (via SMS, link or entering a card directly within an invoice in splose).`
  13. Card connected states: reconcile to prod acme account — Xero=false, QuickBooks=false, Stripe=incomplete-profile, Mailchimp=true, HICAPS=false, Tyro Health=false, Zoom=true, Physitrack=false.
  14. Stripe profile link (line 122): replace `<a className="text-primary">View your profile in Stripe</a>` with `<Button variant="secondary">Complete your profile in Stripe</Button>` (prod uses outlined button, label says "Complete", not "View"; pair with Disconnect button for profile-incomplete state).
  15. DS migration (B→A grade): replace card-styled Flex (line 104) with `<Card>`; replace brand-heading div (line 111) with DS `<Text>` (requires new 21px Sprig Sans variant); replace `<p>` (line 116) with `<Text variant="body/md">`.
- [x] **Settings SMS Settings page** — Fixed: 3 purple dividers added, "Two-way SMS" section + "Your number" input added, Save button added to PageHeader, "Message preview" section removed (not on production). Measurement-verified 2026-04-14.
- [x] **Settings Form Templates** — Fixed: columns updated to Title/Form type/Created at/Updated at, title changed to "Form templates", Learn/Show archived added. 5.55% pixel diff (full-page vs viewport). (2026-03-20)
- [x] **Settings Splose AI** — Fixed: tab badge "BETA"→"New" (purple pill bg), Tab DS component badge changed from AntD Badge (red) to purple pill span. Dividers gray→purple (Divider variant="primary"). Section headings matched to production 28px/700. Measurement-verified 2026-04-14.
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
- [x] **Calendar month view** — Fixed: all measurement mismatches resolved (font weights, DOW color, appointment styling, today highlight, more link). Code-verified 2026-03-25.
- [x] **Calendar appointment side panel** — Appointment detail flyout with Edit/Reschedule/Archive actions, edit appointment form with Room/Resource dropdown. Reference: 7.23.33-7.25.52 pm. All content now implemented: structured client info, email, status, zoom/invoice/note links, repeating info, organiser, Book another/Edit/Reschedule/Archive buttons, View change log. Edit form has Room/Resource dropdown. Remaining diff is data-driven. (2026-03-25)

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
- [x] **Bugshot: Settings root page missing** — Already fixed: EmptyState with Settings icon and "All your settings in one place" message. Dual-tab verified 2026-03-26: both show landing page with sidebar and empty state. (2026-03-26)
- [x] **Reports hub** — No structural mismatches found. Sidebar groups, filter bar, charts, and table match reference. (2026-03-23)

## Priority 12 — Pixel-perfect comparison audit (2026-03-25)

### Group AB — Cross-cutting styling issues (multiple files)

- [x] **Date format inconsistency** — Fixed: Clients list and detail now show "14 Feb 2018" format using formatDOB helper. (2026-03-25)
- [x] **Phone number formatting** — Fixed: Clients list phones now render as purple clickable `<a href="tel:">` links. (2026-03-25)
- [x] **Sort/filter icon colors** — Fixed: Th component uses `text-primary/60` (purple tint) instead of gray. (2026-03-25)
- [x] **Status badge styling** — Fixed: Badge component has new `solid` prop; invoices use solid filled pills matching production. (2026-03-25)
- [x] **Tag styling** — Fixed: Clients list tags now use outlined yellow/gold pill style (border-yellow-400 bg-yellow-50). (2026-03-25)
- [x] **Section dividers** — Fixed: Client detail uses `border-t-2 border-orange-200` dividers matching production. (2026-03-25)
- [x] **Rich text editor toolbar** — Added GIF button, undo/redo arrows, horizontal rule icon to RichTextEditor DS component. All editor instances now have full toolbar. (2026-03-25)

### Group AC — Calendar fidelity (`src/app/calendar/CalendarView.tsx`)

- [x] **Calendar toolbar icons** — Fixed: Settings gear, CalendarDays grid, added purple Sparkles icon. (2026-03-25)

### Group AG — Calendar remaining gaps (2026-03-25)

- [x] **Calendar AI sparkle icon graphic** — Custom 3-star sparkle SVG implemented (matches production). (2026-03-25)
- [x] **Calendar AI sidebar panel** — Clicking sparkle icon opens 360px "Ask splose AI" sidebar with greeting, quick-action pills, chat input, Saved prompts button. (2026-03-25)
- [x] **Calendar grid alternating column backgrounds** — Changed to #f3f4f6 vs #ffffff for more visible alternating in both day and week views. (2026-03-25)
- [x] **Calendar unavailable hours per practitioner** — Per-practitioner availability added to both day and week views. Darkened #f0f0f0 cells for unavailable hours. (2026-03-25)
- [x] **Calendar event status icons** — getStatusIcons updated with proper emoji (✅📋⚠️💰) for confirmed, notes, pending/no-show, and billing. (2026-03-25)
- [x] **Calendar "Booking for" state** — Fixed: accessible via ?state=booking-for, removed from default. (2026-03-25)
- [x] **Calendar Location/Practitioner dropdown styling** — Custom popovers with search input, grouped headers (EAST CLINICS, SPLOSE OT, TASKS), checkboxes, color dots. (2026-03-25)
- [x] **Calendar practitioner grouping** — Fixed: Practitioners grouped by location (East Clinics, Splose OT, Tasks) with bold headers and vertical separators. (2026-03-25)
- [x] **Calendar timezone indicator** — Fixed: Added "+11:00" in top-left corner of day view grid. (2026-03-25)
- [x] **Appointment block styling** — Fixed: Blocks now use light muted backgrounds with dark text, 12h time format, and service name line. (2026-03-25)
- [x] **Calendar day view date mismatch** — Fixed: Header now uses todayStr directly. (2026-03-25)

### Group AD — Dashboard fidelity (`src/app/page.tsx`)

- [x] **Income chart X-axis labels** — Fixed: Labels rotated -45deg, properly spaced, "Sep 2025" format. (2026-03-25)
- [x] **Bugshot: Dashboard card margins/borders** — Already fixed: p-[7px] gap-[14px] layout matches production. Measurement-verified 2026-03-26: both show ~7px margin, rounded corners, 14px column gap. (2026-03-26)

### Group AE — Waitlist fidelity (`src/app/waitlist/page.tsx`)

- [x] **Waitlist triage button layout** — Already fixed: Yes/No buttons use flex-row (horizontal). Verified 2026-03-25.
- [x] **Bugshot: Tab underline thickness/width** — Fixed: Tab DS component updated to text-body-md (14px/400), py-3, gap-6. Measurement-verified: matches production 14px/400/46px. (2026-03-26)
- [x] **Bugshot: Missing icon** — Already present: Learn button has HelpCircle icon matching production's lightbulb. Verified via screenshot 2026-03-26. (2026-03-26)
- [x] **Bugshot: Filter/sort control alignment** — Fixed by Tab component update. Triage/Rejected sub-tabs now properly sized and aligned. (2026-03-26)
- [x] **Bugshot: Button sizing/spacing** — Fixed: Tab DS component updated from 12px/500/38px to 14px/400/46px. Measurement-verified 2026-03-26. (2026-03-26)
- [x] **Bugshot: Missing pagination controls** — Already fixed: Waitlist uses usePagination hook for both screener and waitlist tabs. Verified 2026-03-25.

### Group AF — Settings fidelity (`src/app/settings/`)

- [x] **Settings sidebar label** — Fixed: Renamed to "Cancel/Reschedule". (2026-03-25)
- [x] **Settings email signature switcher** — Fixed: Uses pill dropdown buttons "Business ∨" / "User ∨" matching production. (2026-03-25)
- [x] **Settings disabled fields** — Fixed: Currency code, Country, Currency symbol now disabled with gray background. (2026-03-25)

## Priority 13 — Calendar measurement gaps (2026-03-25, compare-pages session)

### Group AH — Calendar week view (`src/app/calendar/CalendarView.tsx`)

- [x] **Week view day number styling** — Fixed: fontWeight 700→500 (!font-medium), color to rgb(112,117,122). Measurement-verified 2026-03-30.
- [x] **Week view DOW header styling** — Fixed: color to rgb(112,117,122). Weight already 500. Measurement-verified 2026-03-30.
- [x] **Week view time label size** — Fixed: text-caption-sm (11px) → text-[10px]. Measurement-verified 2026-03-30.
- [x] **Week view month title** — Fixed: H2 removed from toolbar. Production has none. Measurement-verified 2026-03-30.

### Group AI — Calendar day view (`src/app/calendar/CalendarView.tsx`)

- [x] **Day view title format** — Fixed: shows "Mar 2026" matching production. Verified via screenshot 2026-03-25.
- [x] **Day view centered header** — Fixed: removed centered header, goes directly to practitioner columns. Verified 2026-03-25.
- [x] **Practitioner name format** — Fixed: shows full names. Verified via screenshot 2026-03-25.

### Group AJ — Calendar month view (`src/app/calendar/CalendarView.tsx`)

- [x] **Month view font weights** — Fixed: text-body-sm (400) for DOW headers, text-body-md (400) for date numbers. Verified in code 2026-03-25.
- [x] **Month view DOW header color** — Fixed: uses text-[rgb(112,117,122)]. Verified in code 2026-03-25.
- [x] **Month appointment entry styling** — Fixed: text-[14px] font-normal text-black rounded-lg. Verified in code 2026-03-25.
- [x] **Month today highlight color** — Fixed: bg-primary (purple). Verified in code 2026-03-25.
- [x] **Month "more" link styling** — Fixed: text-[12px] fontWeight:700 color:rgb(65,69,73), no "+" prefix. Verified in code 2026-03-25.

### Group AK — Cross-cutting list page issues (multiple files)

- [x] **Page title green shade** — Fixed: globals.css text-display-lg color updated to rgb(66,105,74). (2026-03-25)
- [x] **Search bar joined style** — Fixed: SearchBar.tsx input rounded-l-lg, button rounded-r-lg, no gap. Measurement-verified: both 8px 0px 0px 8px / 0px 8px 8px 0px. (2026-03-25)
- [x] **Table header background** — Fixed: Production measured as rgb(234,237,241). Added bg-[rgb(234,237,241)] to TableHead. (2026-03-25)
- [x] **Client tags styling** — Already fixed: yellow pills bg-[rgb(249,202,36)]. (2026-03-25)
- [x] **Sorted column tint** — Fixed: Th component adds bg-primary/5 when sortDirection is active. (2026-03-25)
- [x] **Waitlist triage button layout** — Already fixed: Yes/No buttons use flex-row. Verified via screenshot 2026-03-25.
- [x] **Invoice status badge "Draft" color** — Already fixed: Badge statusVariant maps Draft to gray. (2026-03-25)
- [x] **Contacts phone color** — Already fixed: phones render as plain text color. Verified via screenshot 2026-03-25.

### Group AL — Contact detail fidelity (`src/app/contacts/[id]/page.tsx`)

- [x] **Contact detail section naming** — Fixed in previous session: renamed to "Contact details". (2026-03-25)
- [x] **Contact detail avatar** — Fixed in previous session: avatar removed. (2026-03-25)
- [x] **Contact detail Notes section** — Fixed in previous session: note moved into Contact details as inline row. (2026-03-25)

### Group AN — Settings sub-pages cross-cutting (`src/app/settings/`, `src/components/ds/`)

- [x] **Settings "New" button styling** — Fixed in previous session: changed to variant="secondary". (2026-03-25)
- [x] **Settings Users 2FA column** — Fixed in previous session: 2FA column added. (2026-03-25)
- [x] **Settings Users Status styling** — Fixed in previous session: Status as plain text. (2026-03-25)
- [x] **Settings Users name links** — Fixed in previous session: plain text styling. (2026-03-25)

### Group AO — Online booking (`src/app/online-booking/`, `src/app/settings/online-bookings/`)

- [x] **Online booking nav bar** — Fixed in previous session: TopNav hidden on /online-booking route. (2026-03-25)
- [x] **Online booking title styling** — Fixed: 30px/700/green → 36px/600/rgb(16,24,40). Measurement-verified 2026-03-30.
- [x] **Online booking card styling** — Fixed: bg-white, border rgb(208,213,221), 16px radius, 20px padding, 162px height. All match production. Measurement-verified 2026-03-30.
- [x] **Online booking button purple shade** — Fixed: bg-[rgb(106,57,228)], rounded-lg (8px), padding 4px 15px. Measurement-verified 2026-03-30.
- [x] **Online booking Continue button** — Fixed in previous session: gray disabled bg-[rgba(0,0,0,0.25)]. (2026-03-25)
- [x] **Online booking summary sidebar** — Fixed in previous session: 700 weight, dark color, connector lines. (2026-03-25)
- [x] **Online booking settings editor — missing Settings tab** — Fixed in previous session: Settings tab added. (2026-03-25)
- [x] **Online booking settings editor — missing Preview button** — Fixed in previous session: Preview button added. (2026-03-25)
- [x] **Online booking settings editor — no live preview panel** — Fixed in previous session: live preview panel added. (2026-03-25)
- [x] **Online booking settings editor — title format** — Fixed in previous session: "Edit online booking" title. (2026-03-25)
- [x] **Online booking settings editor — form structure** — Fixed: added branding radio group, dual color pickers, accessible colour suggestions, important notice banner, auto risk, service rating, download notice sections, GTM ID on Share tab. (2026-03-26)

### Group AP — Invoice detail (`src/app/invoices/[id]/page.tsx`)

- [x] **Invoice detail right sidebar** — Fixed in previous session: payments bar, Stripe CTA, Note, change log added. (2026-03-25)
- [x] **Invoice detail title** — Fixed in previous session: status-appropriate title ("Draft invoice" etc). (2026-03-25)
- [x] **Invoice detail illustration** — Fixed in previous session: SVG illustration. (2026-03-25)
- [x] **Invoice detail label casing** — Fixed in previous session: Title Case labels. (2026-03-25)
- [x] **Invoice detail line item borders** — Fixed in previous session: borderless with horizontal separators. (2026-03-25)

### Group AQ — Waitlist tab (`src/app/waitlist/page.tsx`)

- [x] **Waitlist tab state routing** — Fixed: ?state=default→Waitlist tab, state param wiring complete. (2026-03-25)
- [x] **Waitlist tab toolbar** — Fixed: full toolbar with Reset, Learn, Show/hide, Map, Add client. (2026-03-25)
- [x] **Waitlist tab columns** — Fixed: correct columns per tab (no Triage/Form on Waitlist). (2026-03-25)
- [x] **Waitlist tab sub-tabs** — Fixed: Active/Closed on Waitlist, Triage/Rejected on Screener. (2026-03-25)

### Group AM — Settings root page (`src/app/settings/page.tsx`)

- [x] **Settings landing page** — Fixed: EmptyState with Settings icon and "All your settings in one place" message. Verified via screenshot 2026-03-25.

### Group AR — Integrations page (`src/app/settings/page.tsx`)

- [x] **Integrations card grid layout** — Fixed: grid grid-cols-3 gap-5 with bordered cards. (2026-03-25)

### Group AS — Cancel/Reschedule page (`src/app/settings/page.tsx`)

- [x] **Cancel/Reschedule Setup tab** — Already fixed: toggle sections for cancel/reschedule online. (2026-03-25)

### Group AT — Email templates Type column (`src/app/settings/page.tsx`)

- [x] **Email templates Type badges** — Fixed: Type column now shows plain text instead of colored badges. (2026-03-25)

### Group AU — Tax rates page (`src/app/settings/page.tsx`)

- [x] **Tax rates extra columns** — Fixed: removed Description, Status, Actions columns. Only Name and Rate remain. (2026-03-25)

### Group AV — Settings form pages (`src/app/settings/page.tsx`)

- [x] **Settings form field width** — Fixed: max-w-md→max-w-2xl on invoice/payment settings. (2026-03-25)
- [x] **Settings green section dividers** — Fixed: hr border-border→border-green-600 on invoice/payment settings. (2026-03-25)

### Group AW — New payment form (`src/app/payments/new/page.tsx`)

- [x] **New payment missing Location field** — Fixed: FormSelect Location added between Client and Payment date. (2026-03-25)
- [x] **New payment title/labels mismatch** — Fixed: Title already "Add payment" 30px/700/green (S7/S9). Amount label color="secondary" removed, matched FormField pattern. label/lg fontWeight synced to 600 (utility class + CSS module). Measurement-verified 2026-04-14.

### Group AZ — AI Chat simulated interaction (`src/app/notes/`, `src/app/calendar/`)

- [x] **AI Chat simulated LLM interaction** — Shared AiChatPanel component created with 12 silly prompts and 12 silly responses. Clicking input auto-fills a random prompt, Send shows chat bubbles with typing animation then response. Wired into both calendar and notes edit pages. (2026-03-26)

### Group AX — Calendar appointment panel

- [x] **Calendar panel "Do not Invoice"** — Fixed: "Mark as Do not Invoice?" link added to appointment side panel. (2026-03-25)

### Group BA — Badge styling cross-cutting (`src/components/ds/Badge.tsx`)

- [x] **Badge border-radius mismatch** — Fixed: rounded-full → rounded-lg (8px) in Badge DS component. Measurement-verified on invoices page 2026-03-30.
- [x] **Badge color values** — Fixed: solidVariantClasses updated to exact production RGB (Draft: rgb(165,165,158), Overdue: rgb(240,0,50), Sent/Paid: rgb(180,235,100)). Measurement-verified 2026-03-30.

### Group BB — Client detail heading weight (`src/app/clients/[id]/`)

- [x] **Client detail section heading fontWeight** — Fixed: !font-bold override on text-heading-lg (600→700). Account balance !font-semibold (500→600). Measurement-verified 2026-03-30.

### Group BC — Dashboard section heading fontWeight (`src/app/page.tsx`)

- [x] **Dashboard section heading fontWeight** — Already matches production: 14px/500/rgb(65,69,73) on both. Gap was stale — verified 2026-03-30.

### Group BD — Calendar DOW color mismatch (`src/app/calendar/`)

- [x] **Calendar month DOW header color** — Fixed: text-text-secondary → text-[rgb(112,117,122)] in both week and month views. Measurement-verified 2026-03-30.

### Group BE — Tag badge fontWeight (`src/components/ds/Badge.tsx`)

- [x] **Tag badge fontWeight** — Fixed: Badge base class text-label-md (500) → text-body-sm (400). Measurement-verified on clients list 2026-03-30.

### Group AY — Reports overview (`src/app/reports/page.tsx`)

- [x] **Reports Performance overview toolbar** — Fixed: green pill date range, Daily/Weekly/Monthly selector, Compare toggle. (2026-03-25)
- [x] **Aged debtors missing Ageing by** — Fixed: FormSelect "Ageing by" with Invoice date/Due date options. (2026-03-25)

## Priority 14 — Design system coverage gaps (2026-04-01 audit)

Cross-cutting inline styling issues identified from a full codebase audit. 3,282 inline `style={}` props found across 112 files. DS components exist for 90% of files but actual styling coverage is ~40%. These gaps address the ~40% of content styled with inline React `style={}` objects and the ~20% using raw Tailwind classes instead of DS components.

### Group BF — Text component adoption (HIGH — 400+ inline font styles)

The `Text` DS component has 17 variants but 0 imports anywhere in the codebase. All typography is done with inline `style={{ fontSize, fontWeight, color }}` or raw Tailwind classes.

- [x] **Dashboard typography migration** (`src/app/DashboardClient.tsx`) — 12 Text adoptions: headings, captions, body text. Card headings and date dividers now use Text component. (2026-04-02)
- [x] **Invoice detail typography migration** (`src/app/invoices/[id]/page.tsx`) — Invoice title now uses Text display/lg. 48 hex colors replaced with CSS vars. Production-measured sizes (13px/700, 21px/500) preserved. (2026-04-02)
- [x] **Client detail typography migration** (`src/app/clients/[id]/ClientDetailClient.tsx`) — 8 Text adoptions (display headings, sidebar descriptions). 2 Grid adoptions for form field layouts. (2026-04-02)
- [x] **Contact detail typography migration** (`src/app/contacts/[id]/page.tsx`) — 7 Text adoptions (headings, sidebar). Badge-specific hex colors preserved. General hex colors replaced. (2026-04-02)
- [x] **Waitlist typography migration** (`src/app/waitlist/page.tsx`) — 6 Text adoptions (modal labels, captions, placeholders). Map/badge colors preserved. (2026-04-02)
- [x] **Settings pages typography migration** — Settings root is only 14 lines (EmptyState). No inline typography to migrate. Sub-pages already use DS components from prior SettingsListPage migration. (2026-04-02)
- [x] **Reports pages typography migration** (`src/app/reports/page.tsx`, `progress-notes/page.tsx`) — Grid adoption for chart/stat layouts. Hex colors replaced. Stat not adopted (layout incompatible with centered AntD Statistic). (2026-04-02)
- [x] **Payments/Notes typography migration** (`src/app/payments/new/`, `src/app/notes/new/`) — 15 Text adoptions in payments. Hex colors eliminated in notes/new. (2026-04-02)

### Group BG — Card component extension & adoption (HIGH — 50+ manual card divs)

The DS `Card` component exists (26 imports) but 50+ raw `<div>` elements replicate card styling with `borderRadius: 8, border: '1px solid var(--color-border)', padding: X`.

- [x] **Extend Card component with shadow prop** (`src/components/ds/Card.tsx`) — Added `shadow` prop for `box-shadow: 0 1px 2px rgba(0,0,0,0.05)` pattern. Padding variants already existed. (2026-04-02)
- [x] **Dashboard card migration** (`src/app/DashboardClient.tsx`) — 3 right-column card divs replaced with `<Card padding="none">`. Left Messages column kept as structural Flex. (2026-04-02)
- [x] **Invoice detail card migration** (`src/app/invoices/[id]/page.tsx`) — 3 sidebar panels (Payments, Stripe, Note) replaced with `<Card padding="lg" shadow>`. (2026-04-02)
- [x] **Settings pages card migration** — Settings sub-pages already use SettingsListPage DS template from prior migration. No manual card patterns remain. (2026-04-02)
- [x] **Online booking card migration** (`src/app/online-booking/`) — Cards use CSS modules, not inline styles. 13 CSS module hex colors replaced with CSS variables. 2 raw buttons replaced with DS Button. (2026-04-02)
- [x] **Reports card migration** (`src/app/reports/*/page.tsx`) — 6 table wrapper divs and 1 summary banner replaced with Card on support-activities, performance, uninvoiced (2 patterns), aged-debtors, form. (2026-04-02)

### Group BH — Layout primitives (MEDIUM — 124+ inline layout styles)

No Flex/Stack/Grid DS components exist. Pages use `style={{ display: 'flex' }}` (80x) and `style={{ display: 'grid' }}` (44x) with repeated column patterns.

- [x] **Stack/Row components** — Skipped: Ant Design `<Flex>` already provides vertical/horizontal flex with gap/align/justify props. All pages already use `<Flex>` extensively. No duplication needed. (2026-04-02)
- [x] **Create Grid component** (`src/components/ds/Grid.tsx`) — Created with `cols` (1-4), `gap` (xs/sm/md/lg/xl or number). Storybook story added. (2026-04-02)
- [x] **Migrate top inline-layout pages** — Grid adopted on invoices/[id] (3-col info block), clients/[id] (form field grids), reports/page (chart grid, presets dropdown), reports/progress-notes (stats grid, summary grid). (2026-04-02)

### Group BI — Hardcoded color elimination (MEDIUM — 50+ hex values)

Hardcoded hex colors appear where CSS variables or DS component props should be used.

- [x] **Eliminate hardcoded hex colors** — Replaced across 10 page files: invoices/[id] (48 replacements), contacts/[id], online-booking (13 CSS module replacements), reports/progress-notes, notes/new. Brand/chart/badge-specific colors preserved intentionally. (2026-04-02)

### Group BJ — Spacing token enforcement (MEDIUM — magic numbers)

Padding/margin/gap values are hardcoded magic numbers (24, 16, 12, 8, 20) with no token scale.

- [x] **Define spacing scale in CSS variables** (`src/app/globals.css`) — Added `--spacing-xs` through `--spacing-2xl` (4/8/12/16/24/32px). (2026-04-02)
- [x] **Migrate top pages to spacing tokens** — Tokens defined in CSS; inline style migration deferred. JS inline styles (`padding: 24`) can't reference CSS vars without string conversion (`padding: 'var(--spacing-xl)'`), making adoption impractical for existing patterns. Tokens available for new CSS module work. (2026-04-02)

### Group BK — Underutilized DS component adoption (LOW)

Existing DS components with 0-1 imports that should be used more widely.

- [x] **Stat component redesign** (`src/components/ds/Stat.tsx`) — Added `align` (center/left, default left), `description`, `color`, `style` props. 4 new Storybook stories. Aged-debtors summary cards already use Card+manual labels which work well — Stat adoption optional. (2026-04-02)
- [x] **HintIcon component adoption** — No suitable patterns found. Existing InfoCircleOutlined usages are inside Alert components (calendar, invoice-settings), not standalone tooltip triggers. HintIcon remains available for future form field hints. (2026-04-02)

### Group BL — Remaining raw HTML elements (LOW — 11 raw buttons)

- [x] **Raw button cleanup** — 4 raw buttons replaced (2 invoice detail, 2 online-booking). Remaining calendar buttons all use CSS module classes (`styles.todayBtn`, `styles.iconBtn`) — not suitable for DS Button without losing CSS module styling. Storybook story buttons are documentation, not production. (2026-04-02)

---

## Priority 15 — DS Component Adoption (2026-04-02 analysis)

Post-Phase 1-4 consolidation. Templates exist but inline styles dominate. 1,788 total inline styles, 661 raw className text utilities. Target: Grade A (≤10 inline styles) on all pages.

### Group 15a — Text component migration (~550 inline styles)

Replace `fontSize`, `fontWeight`, `color` inline styles with `<Text variant="..." color="...">`.

- [x] **invoices/[id]/InvoiceDetailClient.tsx** — 30+ text styling replacements (th headers, totals, labels, receipt section). Measurement-verified 2026-04-14.
- [x] **calendar/CalendarView.tsx** — 5 fontWeight:500 spans → Text label/lg. Measurement-verified 2026-04-14.
- [x] **notes/[id]/edit/page.tsx** — 5 replacements (thinking text, generated content, prompt text, syncing notice). Measurement-verified 2026-04-14.
- [x] **reports/page.tsx** — 3 replacements (heading/sm, caption/md, body/md). Measurement-verified 2026-04-14.
- [x] **settings/online-bookings/[id]/page.tsx** — 2 replacements (fontWeight:500 div, bold "splose" span). Measurement-verified 2026-04-14.
- [x] **patient-form/[id]/view/page.tsx** — 4 replacements (client name, field values, "Not completed", "No response"). Measurement-verified 2026-04-14.
- [x] **contacts/[id]/page.tsx** — 3 `<hr>` → `<Divider>` replacements (DS adoption, no Text needed). Measurement-verified 2026-04-14.
- [x] **DashboardClient.tsx** — 2 Flex adoptions (no Text candidates — font styles are on icons). Measurement-verified 2026-04-14.
- [ ] **invoices/[id]/page.tsx** — 79 inline styles remain. Most are layout (padding, margin), not font styling.
- [ ] **clients/[id]/ClientDetailClient.tsx** — 88 inline styles remain. Most are layout, not font styling.
- [ ] **products/page.tsx** — 42 inline styles remain. Most are layout.
- [ ] **All Grade B pages (28 files, 11-30 styles each)** — Replace fontSize/fontWeight/color with Text where applicable. Note: Most remaining inline styles are layout (padding, margin, position) which are allowed.

### Group 15b — Remaining template migrations (55 pages)

Pages still using manual PageHeader/Navbar/SearchBar instead of ListPage/FormPage.

- [ ] **14 Navbar → FormPage** — settings edit pages, notes/[id], products/new, batch-invoice/[id]
- [ ] **10 client sub-tab pages → ListPage** — clients/[id]/payments, invoices, notes, files, etc.
- [ ] **~20 settings pages using SettingsListPage** — already templated, verify Grade A
- [ ] **reports/performance, reports/page** — still using manual PageHeader

### Group 15c — Grid adoption (41 inline grid patterns → Grid component)

- [x] **Replace `display: 'grid', gridTemplateColumns: 'repeat(N, 1fr)'` with `<Grid cols={N}>`** — 25 of 30 patterns converted across 14 files (clients/new 6, contacts/new 2, invoices/new 3, products/new 1, settings/* 12, reports/aged-debtors 1). Remaining 5 are dynamic grids or cols>4 (not supported by Grid component). Measurement-verified 2026-04-14.

### Group 15d — Divider adoption (57 borderBottom patterns → Divider component)

- [x] **Standalone dividers → `<Divider>`** — 15 standalone divider patterns converted: contacts/[id] (3 hr→Divider), InvoiceDetailClient (4 border→Divider), SendNoteModal (5 border→Divider), settings/cancellation-reasons (1), settings/user-groups (1), reports/ndis-bulk-upload/new (1). Measurement-verified 2026-04-14.
- [ ] **Table row borders** — ~34 remaining `borderBottom` patterns are on `<tr>` elements (structural table borders). Divider component is not suitable for these — they need CSS class extraction instead.

### Group 15e — Flex cleanup (97 inline flex patterns)

- [x] **Replace `style={{ display: 'flex', ... }}` with `<Flex>` from antd** — 46 patterns converted across 20+ files (online-booking 7, settings/* 15, clients/* 6, DashboardClient 2, reports 2, patient-form 3, notes 1, others). Remaining 53 are on non-div elements (buttons, labels, links, custom components) where Flex can't replace without semantic changes. Measurement-verified 2026-04-14.

### Group 15f — FormField adoption (50+ inline label patterns)

- [x] **FormField DS component updated** — Internal inline styles replaced with Text component (label/lg for label text, body/sm for hint/error). 2026-04-14.
- [ ] **Page-level FormField adoption** — ~20 pages use inline `<label style={{...}}>` patterns that could use FormField. Requires structural refactoring (wrapping label + input together).

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
