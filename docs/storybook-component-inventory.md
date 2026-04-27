# Splose Storybook component inventory

Generated as part of GitHub issue #17 (Storybook hierarchy refactor).

All 67 components currently in the Splose DS Storybook. Tier classification, source path, and app routes where the component is used.

## Tier definitions

- `antd` — pure AntD with `ConfigProvider` + `sploseTheme`, no wrapper. (Tier reserved for issue #22 stories of pure-AntD direct usage; no current DS components fall in this tier.)
- `extended` — AntD-based wrapper, library wrapper (Radix, cmdk, sonner, signature_pad), or composed pattern (e.g. `ListPage`, `AsyncSelect`).
- `custom` — first-party primitive with no underlying library.

## Tier counts

| Tier | Count |
|---|---|
| `antd` | 0 |
| `extended` | 50 |
| `custom` | 17 |
| **Total** | **67** |

## Components by category

### Typography

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| Badge | `custom` | `src/components/ds/Badge.tsx` | — | Waitlist (status pills, service tags); Client > Notes tab (note status badges); Client > Cases tab (case state badges); Settings: Data import (import status badges) |
| Text | `custom` | `src/components/ds/Text.tsx` | — | Dashboard (page title, metrics, body copy); Client detail (display heading, body, label/value pairs); Waitlist (table headings, captions); Client > Appointments side panel (heading + body stack) |

### Forms

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| AsyncSelect | `extended` | `src/components/ds/AsyncSelect.tsx` | — | _no call sites in `src/app/` yet_ |
| Checkbox | `extended` | `src/components/ds/Checkbox.tsx` | [docs](https://ant.design/components/checkbox) | Waitlist — New; Login; Settings — SMS settings; Products |
| ComboBox | `extended` | `src/components/ds/ComboBox.tsx` | [docs](https://www.downshift-js.com/) | Initial consult (60 min); Follow-up (30 min); Physio review (45 min); Assessment (90 min); Telehealth (30 min); Group session (60 min) |
| DatePicker | `extended` | `src/components/ds/DatePicker.tsx` | [docs](https://ant.design/components/date-picker) | _no call sites in `src/app/` yet_ |
| DateRangeFilter | `extended` | `src/components/ds/DateRangeFilter.tsx` | [docs](https://ant.design/components/date-picker) | Invoices — Batch invoice; Reports — Payments; Reports — Appointments; Reports — Waitlist |
| FileUpload | `extended` | `src/components/ds/FileUpload.tsx` | [docs](https://ant.design/components/upload) | Patient details; Settings — Practice details; Reports — NDIS bulk upload (new) |
| Filter | `custom` | `src/components/ds/Filter.tsx` | — | Notes — New; Notes — Edit |
| FormColorPicker | `custom` | `src/components/ds/FormColorPicker.tsx` | — | Settings — Online bookings (edit); Settings — Tags; Settings — Rooms & resources; Settings — Busy times |
| FormField | `custom` | `src/components/ds/FormField.tsx` | — | Settings — Forms (edit); Patient form view |
| FormInput | `extended` | `src/components/ds/FormInput.tsx` | [docs](https://ant.design/components/input) | Settings — Online bookings (edit); Settings — Email templates (edit); Settings — Forms (edit); Settings — Cancellation reasons |
| FormSelect | `extended` | `src/components/ds/FormSelect.tsx` | [docs](https://ant.design/components/select) | Settings — Online bookings (edit); Settings — Email templates (edit); Settings — Data import; Settings — Tags |
| FormTextarea | `extended` | `src/components/ds/FormTextarea.tsx` | [docs](https://ant.design/components/input) | Settings — Online bookings (edit); Settings — Forms (edit); Settings — Invoice settings; Settings — AI |
| HintIcon | `custom` | `src/components/ds/HintIcon.tsx` | — | Client detail (Associated contacts hint, Account balance hints); Settings: Business details (Workspace URL, Patient terminology hints) |
| NumberInput | `extended` | `src/components/ds/NumberInput.tsx` | [docs](https://ant.design/components/input-number) | Settings: SMS settings (numeric thresholds) |
| RadioGroup | `extended` | `src/components/ds/RadioGroup.tsx` | [docs](https://ant.design/components/radio) | Settings: Online bookings (booking option selection); Settings: Edit service (radio options); Calendar (recurring appointment apply/delete radios) |
| RichTextEditor | `extended` | `src/components/ds/RichTextEditor.tsx` | — | Settings: Edit email template; Settings: Edit progress note template; Settings: Edit letter template; Settings: Invoice settings (invoice notes editor) |
| SearchBar | `custom` | `src/components/ds/SearchBar.tsx` | — | Waitlist (filter by name); Client > Files tab (filter by file name); Settings: Forms (filter by form name); Settings: Email templates (filter by template) |
| SegmentedControl | `extended` | `src/components/ds/SegmentedControl.tsx` | [docs](https://ant.design/components/segmented) | Calendar (Week/Day/Month view switcher) |
| SignaturePad | `extended` | `src/components/ds/SignaturePad.tsx` | [docs](https://github.com/szimek/signature_pad) | _no call sites in `src/app/` yet_ |
| TimePicker | `extended` | `src/components/ds/TimePicker.tsx` | [docs](https://ant.design/components/time-picker) | _no call sites in `src/app/` yet_ |
| Toggle | `extended` | `src/components/ds/Toggle.tsx` | [docs](https://ant.design/components/switch) | Settings: AI (voice/recording toggles); Settings: Business details (preference toggles); Settings: Online booking (per-location enable toggles); Client detail (notification + consent toggles) |

### Actions

_(No components — reserved for future stories.)_

### Data Display

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| AppointmentCard | `custom` | `src/components/ds/AppointmentCard.tsx` | — | Calendar |
| Avatar | `extended` | `src/components/ds/Avatar.tsx` | [docs](https://ant.design/components/avatar) | Dashboard; Calendar; Reports; Online booking |
| ColorDot | `custom` | `src/components/ds/ColorDot.tsx` | — | Dashboard; Calendar; Settings — Tags; Reports |
| DataTable | `extended` | `src/components/ds/DataTable.tsx` | [docs](https://ant.design/components/table) | Clients list; Invoices list; Invoice detail; Waitlist |
| List | `extended` | `src/components/ds/List.tsx` | [docs](https://ant.design/components/list) | Client detail; Note detail; Waitlist; Contact detail |
| PatientAvatar | `custom` | `src/components/ds/PatientAvatar.tsx` | — | Client detail |
| PaymentStatusBadge | `custom` | `src/components/ds/PaymentStatusBadge.tsx` | — | Invoices list; Invoice detail; Client invoices |
| ProgressBar | `extended` | `src/components/ds/ProgressBar.tsx` | [docs](https://ant.design/components/progress) | Reports |
| Sparkline | `custom` | `src/components/ds/Sparkline.tsx` | — | _no call sites in `src/app/` yet_ |
| Stat | `extended` | `src/components/ds/Stat.tsx` | [docs](https://ant.design/components/statistic) | Settings — SMS settings; Reports — Progress notes |

### Feedback

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| Alert | `extended` | `src/components/ds/Alert.tsx` | [docs](https://ant.design/components/alert) | Calendar (past-date / edit modals); Settings — AI (beta banner); Settings — Invoice settings (Stripe banner); Settings — Data import |
| AlertCallout | `custom` | `src/components/ds/AlertCallout.tsx` | — | Client detail |
| EmptyState | `extended` | `src/components/ds/EmptyState.tsx` | [docs](https://ant.design/components/empty) | Waitlist; Settings — Forms; Products; Client invoices tab |
| Skeleton | `extended` | `src/components/ds/Skeleton.tsx` | [docs](https://ant.design/components/skeleton) | Clients list; Invoices list; Contacts list; Waitlist |
| Spinner | `extended` | `src/components/ds/Spinner.tsx` | [docs](https://ant.design/components/spin) | Note edit |
| Toast | `extended` | `src/components/ds/Toast.tsx` | [docs](https://sonner.emilkowal.ski) | Invoice detail; Reports — Performance |

### Navigation

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| Breadcrumbs | `extended` | `src/components/ds/Breadcrumbs.tsx` | [docs](https://ant.design/components/breadcrumb) | _no call sites in `src/app/` yet_ |
| Navbar | `extended` | `src/components/ds/Navbar.tsx` | [docs](https://ant.design/components/menu) | _no call sites in `src/app/` yet_ |
| Pagination | `extended` | `src/components/ds/Pagination.tsx` | [docs](https://ant.design/components/pagination) | _no call sites in `src/app/` yet_ |
| SideNav | `extended` | `src/components/ds/SideNav.tsx` | [docs](https://ant.design/components/menu) | _no call sites in `src/app/` yet_ |
| Stepper | `extended` | `src/components/ds/Stepper.tsx` | [docs](https://ant.design/components/steps) | Select clients; Review; Preview; Send |
| Tab | `extended` | `src/components/ds/Tab.tsx` | [docs](https://ant.design/components/tabs) | _no call sites in `src/app/` yet_ |
| TopNav | `custom` | `src/components/ds/TopNav.tsx` | — | _no call sites in `src/app/` yet_ |

### Layout

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| Accordion | `extended` | `src/components/ds/Accordion.tsx` | [docs](https://ant.design/components/collapse) | _no call sites in `src/app/` yet_ |
| Card | `extended` | `src/components/ds/Card.tsx` | [docs](https://ant.design/components/card) | Dashboard; Patient details; Patient invoices; New client form |
| Collapse | `extended` | `src/components/ds/Collapse.tsx` | [docs](https://ant.design/components/collapse) | Patient details; Settings — Locations (edit); Settings — Appointment templates (new) |
| Divider | `extended` | `src/components/ds/Divider.tsx` | [docs](https://ant.design/components/divider) | Dashboard; Patient details; Settings — Details; Waitlist |
| FeatureCard | `custom` | `src/components/ds/FeatureCard.tsx` | — | Patient details |
| Grid | `extended` | `src/components/ds/Grid.tsx` | [docs](https://ant.design/components/grid) | New client form; Patient details; Settings — Forms (edit); Settings — Details |
| PageHeader | `custom` | `src/components/ds/PageHeader.tsx` | — | Patient — Notes; Patient — Invoices; Patient — Files; Patient — Cases |

### Overlays

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| AlertDialog | `extended` | `src/components/ds/AlertDialog.tsx` | [docs](https://www.radix-ui.com/primitives/docs/components/alert-dialog) | _no call sites in `src/app/` yet_ |
| CommandPalette | `extended` | `src/components/ds/CommandPalette.tsx` | [docs](https://cmdk.paco.me) | Globally mounted (Cmd+K from any route via CommandPaletteMount in layout.tsx) |
| ContextMenu | `extended` | `src/components/ds/ContextMenu.tsx` | [docs](https://ant.design/components/dropdown) | Calendar (right-click on time slots / appointments) |
| Drawer | `extended` | `src/components/ds/Drawer.tsx` | [docs](https://ant.design/components/drawer) | Calendar (appointment details / side panels via CalendarView) |
| Dropdown | `extended` | `src/components/ds/Dropdown.tsx` | [docs](https://ant.design/components/dropdown) | Client forms (row actions menu); Settings: Online bookings (overflow menu); Settings: Forms list (row actions); Settings: Data export (action menu) |
| EmailPreview | `extended` | `src/components/ds/EmailPreview.tsx` | — | Settings: Email templates editor; Settings: Appointment templates |
| HoverCard | `extended` | `src/components/ds/HoverCard.tsx` | [docs](https://www.radix-ui.com/primitives/docs/components/hover-card) | Calendar (hover preview on appointments / patient avatars) |
| Modal | `extended` | `src/components/ds/Modal.tsx` | [docs](https://ant.design/components/modal) | Invoice detail (Send invoice modal); Waitlist (add / edit waitlist entry); Client forms (assign / send form modal); Settings: Online bookings (edit modal) |
| ReorderModal | `custom` | `src/components/ds/ReorderModal.tsx` | — | Settings: Custom fields (reorder fields) |
| Tooltip | `extended` | `src/components/ds/Tooltip.tsx` | [docs](https://ant.design/components/tooltip) | Dashboard; Settings — Forms (edit); Note edit |

### Templates

| Component | Tier | Source | Reference | App routes |
|---|---|---|---|---|
| DetailPage | `extended` | `src/components/ds/DetailPage.tsx` | — | _no call sites in `src/app/` yet_ |
| FormPage | `extended` | `src/components/ds/FormPage.tsx` | — | _no call sites in `src/app/` yet_ |
| ListPage | `extended` | `src/components/ds/ListPage.tsx` | — | _no call sites in `src/app/` yet_ |
| SettingsListPage | `extended` | `src/components/ds/SettingsListPage.tsx` | — | _no call sites in `src/app/` yet_ |

### Utility

_(No components — reserved for future stories.)_

## Stories with no current call sites

These components have `appPages: []` because they are not yet adopted in `src/app/`. Built and ready, awaiting migration:

- Accordion
- AlertDialog
- AsyncSelect
- Breadcrumbs
- DatePicker
- DetailPage
- FormPage
- ListPage
- Navbar
- Pagination
- SettingsListPage
- SideNav
- SignaturePad
- Sparkline
- Tab
- TimePicker
- TopNav

## Notes

- Categories shown in the order they appear in the Storybook sidebar (per `docs/superpowers/specs/2026-04-27-storybook-hierarchy-design.md`).
- `Actions/` and `Utility/` are currently empty — `Button`, `Tag`, `Icon`, `FormLabel`, `PhoneInput` were removed during issue #15 in favour of direct AntD usage. Issue #22 adds back the pure-AntD direct-usage stories under `Actions/Button`, `Typography/Tag` (AntD raw), and `Utility/Icon`.
- App route URLs (Vercel + production) live in each story’s `parameters.appPages`. This inventory shows route labels only; URL pairs drive issue #18 (screenshots) and issue #19 (MDX docs).
