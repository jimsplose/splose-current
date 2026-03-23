# Functional Scaffolding Reference

Extracted from 186 pages of the real Splose app. Use this to scaffold prototype features, routing, navigation, forms, tables, and interactive patterns.

## Router Structure (Next.js App Router)

```
app/
  page.tsx                              # Dashboard
  calendar/
    [view]/[day]/[month]/[year]/page.tsx  # day | week | month
  patients/
    page.tsx                            # Patient list
    new/page.tsx                        # New patient form
    [id]/
      details/page.tsx
      appointments/page.tsx
      communications/page.tsx
      files/page.tsx
      forms/page.tsx
      notes/page.tsx
      cases/
        page.tsx
        new/page.tsx
        [caseId]/page.tsx
      invoices/page.tsx
      letters/page.tsx
      payments/page.tsx
      statements/page.tsx
      support-activities/page.tsx
      practitioner-access/page.tsx
  contacts/
    page.tsx                            # Contact list
    new/page.tsx
    [id]/
      details/page.tsx
      cases/page.tsx
      invoices/page.tsx
      letters/page.tsx
  invoices/
    page.tsx                            # Invoice list
    new/page.tsx                        # ?patientId= context
    [id]/view/page.tsx
    batch-invoice/
      page.tsx
      new/page.tsx
      preview/page.tsx
      [id]/page.tsx
  payments/
    page.tsx                            # Payment list
    new/page.tsx                        # ?patientId= or ?invoiceId= context
    [id]/view/page.tsx
  reports/
    page.tsx                            # Reports overview
    aged-debtors/page.tsx
    appointments/page.tsx
    billed-items/page.tsx
    cases/page.tsx
    form/page.tsx
    ndis-bulk-upload/
      page.tsx
      new/page.tsx
      [id]/page.tsx
    patients/page.tsx
    payments/page.tsx
    performance/page.tsx
    progress-notes/page.tsx
    support-activities/page.tsx
    uninvoiced/page.tsx
    waitlist/page.tsx
  products/page.tsx
  waitlist/page.tsx
  notes/
    [id]/
      view/page.tsx
      edit/page.tsx                     # ?patientId= context
  letters/
    new/page.tsx                        # ?patientId= context
  settings/
    page.tsx                            # Settings overview
    details/page.tsx
    ai/page.tsx
    busy-times/page.tsx
    cancellationReasons/page.tsx
    communications/types/page.tsx
    custom-fields/page.tsx
    export/page.tsx
    import/page.tsx
    integrations/page.tsx
    invoices/page.tsx
    locations/
      page.tsx
      new/page.tsx
    online-booking/
      page.tsx
      new/page.tsx
    patient-data/page.tsx
    payments/page.tsx
    referralTypes/page.tsx
    rooms-resources/page.tsx
    services/
      page.tsx
      new/page.tsx
    smsSettings/page.tsx
    tags/page.tsx
    tax-rates/page.tsx
    templates/
      appointments/
        page.tsx
        new/page.tsx
      body-charts/page.tsx
      emails/
        page.tsx
        new/page.tsx
      forms/page.tsx
      letters/
        page.tsx
        new/page.tsx
      progress-notes/
        page.tsx
        new/page.tsx
    user-groups/page.tsx
    users/page.tsx
```

## Navigation Config

### Header (horizontal, 56px tall)

```ts
const headerNav = [
  { label: 'Dashboard', path: '/', icon: null },
  { label: 'Calendar', path: '/calendar/day/{today}', icon: null },
  { label: 'More', type: 'submenu', children: [
    { label: 'Patients', path: '/patients' },
    { label: 'Contacts', path: '/contacts' },
    { label: 'Waitlist', path: '/waitlist' },
    { label: 'Invoices', path: '/invoices' },
    { label: 'Payments', path: '/payments' },
    { label: 'Reports', path: '/reports' },
    { label: 'Products', path: '/products' },
  ]},
];

const headerIcons = [
  { icon: 'bell', badge: true, action: 'notifications' },
  { icon: 'message', badge: true, action: 'messages' },
  { icon: 'setting', action: '/settings' },
  { icon: 'question-circle', action: 'help' },
  { type: 'avatar', action: 'user-menu' },
];
```

### Patient Detail Sidebar

```ts
const patientSideNav = [
  { label: 'Details', path: 'details' },
  { label: 'Appointments', path: 'appointments', count: true },
  { label: 'Communications', path: 'communications', count: true },
  { label: 'Files', path: 'files', count: true },
  { label: 'Notes', path: 'notes', count: true },
  { label: 'Cases', path: 'cases', count: true },
  { label: 'Invoices', path: 'invoices', count: true },
  { label: 'Letters', path: 'letters', count: true },
  { label: 'Payments', path: 'payments', count: true },
  { label: 'Statements', path: 'statements' },
  { label: 'Forms', path: 'forms', count: true },
  { label: 'Support Activities', path: 'support-activities', count: true },
  { label: 'Practitioner Access', path: 'practitioner-access' },
];
```

### Settings Sidebar

```ts
const settingsNav = [
  { group: 'Workspace', items: [
    { label: 'Details', path: 'details' },
    { label: 'Locations', path: 'locations' },
    { label: 'Rooms & Resources', path: 'rooms-resources' },
    { label: 'Services', path: 'services' },
    { label: 'Busy Times', path: 'busy-times' },
    { label: 'Tags', path: 'tags' },
    { label: 'Custom Fields', path: 'custom-fields' },
    { label: 'Cancellation Reasons', path: 'cancellationReasons' },
    { label: 'Referral Types', path: 'referralTypes' },
    { label: 'Communication Types', path: 'communications/types' },
    { label: 'Patient Data', path: 'patient-data' },
  ]},
  { group: 'Templates', items: [
    { label: 'Appointments', path: 'templates/appointments' },
    { label: 'Progress Notes', path: 'templates/progress-notes' },
    { label: 'Forms', path: 'templates/forms' },
    { label: 'Letters', path: 'templates/letters' },
    { label: 'Emails', path: 'templates/emails' },
    { label: 'Body Charts', path: 'templates/body-charts' },
  ]},
  { group: 'Billing', items: [
    { label: 'Invoices', path: 'invoices' },
    { label: 'Payments', path: 'payments' },
    { label: 'Tax Rates', path: 'tax-rates' },
    { label: 'Online Booking', path: 'online-booking' },
  ]},
  { group: 'Admin', items: [
    { label: 'Users', path: 'users' },
    { label: 'User Groups', path: 'user-groups' },
    { label: 'SMS Settings', path: 'smsSettings' },
    { label: 'Integrations', path: 'integrations' },
    { label: 'AI', path: 'ai' },
    { label: 'Import', path: 'import' },
    { label: 'Export', path: 'export' },
  ]},
];
```

### Reports Sidebar

```ts
const reportsNav = [
  { group: 'Overview', items: [
    { label: 'Appointments', path: 'appointments' },
    { label: 'Patients', path: 'patients' },
    { label: 'Performance', path: 'performance' },
    { label: 'Waitlist', path: 'waitlist' },
  ]},
  { group: 'Billing', items: [
    { label: 'Payments', path: 'payments' },
    { label: 'Billed Items', path: 'billed-items' },
    { label: 'Aged Debtors', path: 'aged-debtors' },
    { label: 'Uninvoiced', path: 'uninvoiced' },
  ]},
  { group: 'Clinical', items: [
    { label: 'Progress Notes', path: 'progress-notes' },
    { label: 'Forms', path: 'form' },
    { label: 'Cases', path: 'cases' },
    { label: 'Support Activities', path: 'support-activities' },
  ]},
  { group: 'NDIS', items: [
    { label: 'NDIS Bulk Upload', path: 'ndis-bulk-upload' },
  ]},
];
```

## Page Templates

### 1. List View (patients, contacts, invoices, payments, waitlist)

```
+-------------------------------------------------------+
| Page Header                           [+ Add New] btn  |
+-------------------------------------------------------+
| [Search input]  [Filter dropdown]  [More filters...]   |
+-------------------------------------------------------+
| Table                                                   |
|  Name  | Contact  | Status  | Last Visit | Actions (…) |
|--------|----------|---------|------------|-------------|
|  Row   |   ...    |  Tag    |   Date     |   Menu      |
|  Row   |   ...    |  Tag    |   Date     |   Menu      |
+-------------------------------------------------------+
| Pagination                                              |
+-------------------------------------------------------+
```

**UI patterns (build with Tailwind CSS):** page header section, search input, filter dropdowns (select), data table with sortable columns, status badges (coloured pill spans), action dropdown menus, pagination controls

### 2. Detail View (patient/[id]/*, contact/[id]/*)

```
+-------------------------------------------------------+
| Page Header: [Name]  [badges]  [Actions dropdown]      |
+-------------------+-----------------------------------+
| Sidebar           | Content Area                       |
|                   |                                    |
| Details          | (varies by sub-route)               |
| Appointments (3) |                                    |
| Communications   | Could be: form, table, cards,      |
| Files (2)        | timeline, etc.                     |
| Notes (5)        |                                    |
| ...              |                                    |
+-------------------+-----------------------------------+
```

**UI patterns (build with Tailwind CSS):** page header with breadcrumb, vertical sidebar navigation (active state highlighting), count badges (small rounded spans), action dropdown menus

### 3. Form View (new patient, new invoice, new payment)

```
+-------------------------------------------------------+
| Page Header: New [Entity]                               |
+-------------------------------------------------------+
| Form (vertical label layout)                             |
|                                                         |
| [Label]                                                 |
| [Input field]                                           |
| [Field description text]                                |
|                                                         |
| [Label]                                                 |
| [Select dropdown]                                       |
|                                                         |
| [Label]                                                 |
| [Date picker]                                           |
|                                                         |
+-------------------------------------------------------+
| [Cancel]                              [Save] primary    |
+-------------------------------------------------------+
```

**UI patterns (build with Tailwind CSS):** vertical form layout with label/input/helper-text groups, text inputs, select dropdowns, date picker, primary and secondary buttons

### 4. Settings Page (settings/*)

```
+-------------------+-----------------------------------+
| Settings Sidebar  | Settings Content                   |
|                   |                                    |
| [Group Header]    | [Section Title]                    |
|   Item            | [Description text]                 |
|   Item (active)   |                                    |
|   Item            | [Form fields]                      |
|                   |                                    |
| [Group Header]    |                          [Save]    |
|   Item            |                                    |
+-------------------+-----------------------------------+
```

**UI patterns (build with Tailwind CSS):** grouped vertical sidebar navigation, form layout, text inputs, toggle switches, select dropdowns, primary and secondary buttons

### 5. Report Page (reports/*)

```
+-------------------+-----------------------------------+
| Reports Sidebar   | Report Header                      |
|                   | [All locations v] [All practitioners v] |
| [Group Header]    | [Date range picker]                |
|   Report type     +-----------------------------------+
|   Report type     | Chart / Summary                    |
|   (active)        |                                    |
|                   +-----------------------------------+
| [Group Header]    | Data Table                         |
|   Report type     |                                    |
+-------------------+-----------------------------------+
```

**UI patterns (build with Tailwind CSS):** sidebar navigation, filter dropdowns (select), date range picker, data table, chart visualisations (use a charting library like Recharts or Chart.js)

## Key Form Schemas

### New Patient

```ts
const newPatientFields = [
  { name: 'firstName', label: 'First name', type: 'input', required: true },
  { name: 'lastName', label: 'Last name', type: 'input', required: true },
  { name: 'preferredName', label: 'Preferred name', type: 'input' },
  { name: 'email', label: 'Email', type: 'input', inputType: 'email' },
  { name: 'phone', label: 'Phone', type: 'input', inputType: 'tel' },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'datepicker' },
  { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  { name: 'address', label: 'Address', type: 'input' },
  { name: 'city', label: 'City', type: 'input' },
  { name: 'state', label: 'State', type: 'select' },
  { name: 'postcode', label: 'Postcode', type: 'input' },
];
```

### New Invoice

```ts
const newInvoiceFields = [
  { name: 'patient', label: 'Patient', type: 'search-select', required: true },
  { name: 'invoiceDate', label: 'Invoice date', type: 'datepicker', required: true },
  { name: 'dueDate', label: 'Due date', type: 'datepicker' },
  { name: 'lineItems', label: 'Line items', type: 'dynamic-list', fields: [
    { name: 'description', label: 'Description', type: 'input' },
    { name: 'quantity', label: 'Qty', type: 'number' },
    { name: 'unitPrice', label: 'Unit price', type: 'currency' },
    { name: 'tax', label: 'Tax', type: 'select' },
  ]},
  { name: 'notes', label: 'Notes', type: 'textarea' },
];
```

### New Payment

```ts
const newPaymentFields = [
  { name: 'patient', label: 'Patient', type: 'search-select', required: true },
  { name: 'invoice', label: 'Invoice', type: 'search-select' },
  { name: 'amount', label: 'Amount', type: 'currency', required: true },
  { name: 'paymentDate', label: 'Payment date', type: 'datepicker', required: true },
  { name: 'paymentMethod', label: 'Payment method', type: 'select',
    options: ['Cash', 'Card', 'Bank transfer', 'EFTPOS', 'Medicare', 'NDIS', 'Other'] },
  { name: 'reference', label: 'Reference', type: 'input' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];
```

## Key Table Schemas

### Patients List

```ts
const patientColumns = [
  { title: 'Name', dataIndex: 'name', sorter: true },
  { title: 'Email', dataIndex: 'email' },
  { title: 'Phone', dataIndex: 'phone' },
  { title: 'Date of Birth', dataIndex: 'dateOfBirth', sorter: true },
  { title: 'Last Appointment', dataIndex: 'lastAppointment', sorter: true },
  { title: 'Status', dataIndex: 'status', render: 'tag' },
  { title: '', dataIndex: 'actions', render: 'dropdown-menu' },
];
```

### Invoices List

```ts
const invoiceColumns = [
  { title: 'Invoice #', dataIndex: 'invoiceNumber', sorter: true },
  { title: 'Patient', dataIndex: 'patientName', sorter: true },
  { title: 'Date', dataIndex: 'invoiceDate', sorter: true },
  { title: 'Due', dataIndex: 'dueDate', sorter: true },
  { title: 'Amount', dataIndex: 'amount', render: 'currency', sorter: true },
  { title: 'Paid', dataIndex: 'amountPaid', render: 'currency' },
  { title: 'Status', dataIndex: 'status', render: 'tag' }, // draft, sent, paid, overdue
  { title: '', dataIndex: 'actions', render: 'dropdown-menu' },
];
```

### Payments List

```ts
const paymentColumns = [
  { title: 'Date', dataIndex: 'paymentDate', sorter: true },
  { title: 'Patient', dataIndex: 'patientName', sorter: true },
  { title: 'Amount', dataIndex: 'amount', render: 'currency', sorter: true },
  { title: 'Method', dataIndex: 'paymentMethod' },
  { title: 'Reference', dataIndex: 'reference' },
  { title: 'Invoice', dataIndex: 'invoiceNumber', render: 'link' },
  { title: '', dataIndex: 'actions', render: 'dropdown-menu' },
];
```

## Modal and Drawer Patterns

### Right-side Drawer (patient/contact quick-view)

- Width: 378px
- Slide-in from right
- Header: entity name + close button
- Body: summary info, quick actions
- Implementation: `<Modal>` component, positioned fixed right (or custom drawer)

### Confirmation Modal

- Width: ~420px
- Title: "Are you sure?" (20px, weight 600)
- Body: explanation text
- Footer: [Cancel] [Delete/Confirm]
- Implementation: `<Modal maxWidth="sm">` with footer buttons

### Form Modal (email, export, new template)

- Width: 520-1000px depending on content
- Title bar with close button
- Scrollable body with form
- Sticky footer with action buttons
- Implementation: `<Modal maxWidth="lg">` with form content and footer

## Design System Component Library

The prototype has a full design system at `src/components/ds/` with **46 components** and Storybook stories. All components are exported from `src/components/ds/index.ts`. Always import from `@/components/ds` rather than building custom equivalents.

Do not install or import `antd`. The real Splose app uses Ant Design internally, but this prototype recreates those patterns with Tailwind CSS and this component library.

### Layout and Navigation

| Component | Import | Usage |
|-----------|--------|-------|
| `TopNav` | `<TopNav brand={{...}} items={[...]} />` | Main header bar. Props: brand, items (NavItem[]), children, className |
| `SideNav` | `<SideNav sections={[...]} />` | Vertical sidebar nav. Props: sections (SideNavSection[]), isActive?, className |
| `Navbar` | `<Navbar backHref="/patients" title="Details" />` | Sub-page header with back button. Props: backHref, title, badge?, children |
| `PageHeader` | `<PageHeader title="Patients">actions</PageHeader>` | Page title row with action slot. Props: title, children? |

### Buttons and Actions

| Component | Import | Usage |
|-----------|--------|-------|
| `Button` | `<Button variant="primary" size="md">` | Universal button. Variants: primary, secondary, danger, ghost, link, icon, toolbar. Sizes: sm, md, lg. Also supports round? |
| `Dropdown` | `<Dropdown trigger={<DropdownTriggerButton />} items={[...]} onSelect={fn} />` | Action menu. Items: {label, value, danger?, divider?}. Also exports `DropdownTriggerButton` (three-dot icon) |
| `Filter` | `<Filter items={[...]} value={v} onChange={fn} />` | Segmented toggle control for filtering |

### Data Display

| Component | Import | Usage |
|-----------|--------|-------|
| `DataTable` | `<DataTable><TableHead>...<TableBody>...` | Table wrapper. Use with TableHead, Th, TableBody, Td, Tr, LinkCell, ActionsCell, ExpandableRow |
| `Th` | `<Th sortable sortDirection="asc" onSort={fn}>` | Sortable/filterable header cell. Props: align, hidden?, sortable?, sortDirection?, onSort?, filterable?, onFilter? |
| `Pagination` | `<Pagination currentPage={1} totalPages={10} onPageChange={fn} />` | Page navigation. Props: totalItems?, itemsPerPage?, showPageSize?, pageSizeOptions? |
| `List` | `<List items={[{label, value}]} />` | Label-value detail list. Props: labelWidth?, className? |
| `Stat` | `<Stat value="142" label="Total patients" />` | Metric display card |
| `SettingsListPage` | Complex wrapper | Full CRUD table with built-in search, pagination, form modal, and action dropdowns. See component source for full props |

### Forms

| Component | Import | Usage |
|-----------|--------|-------|
| `FormInput` | `<FormInput label="First name" error="Required" />` | Text input with label and error. Extends HTMLInputElement |
| `FormSelect` | `<FormSelect label="Gender" options={[...]} />` | Labelled select. Extends HTMLSelectElement |
| `FormTextarea` | `<FormTextarea label="Notes" error={err} />` | Labelled textarea. Extends HTMLTextAreaElement |
| `FormColorPicker` | `<FormColorPicker variant="swatches" value={c} onChange={fn} />` | Colour input. Variants: native, swatches (20 default colours) |
| `Select` | `<Select options={[...]} searchable />` | Enhanced searchable dropdown |
| `AsyncSelect` | `<AsyncSelect url="/api/..." mapOption={fn} />` | Dropdown that fetches options from an API |
| `Checkbox` | `<Checkbox label="Active" />` | Checkbox with optional label |
| `RadioGroup` | `<RadioGroup name="gender" options={[...]} />` | Grouped radio buttons |
| `Toggle` | `<Toggle checked={v} onChange={fn} label="Enabled" />` | On/off switch |
| `DateRangeFilter` | `<DateRangeFilter startDate={s} endDate={e} />` | Date range picker with two inputs |
| `SearchBar` | `<SearchBar onSearch={fn} placeholder="Search..." />` | Search input with button |
| `FileUpload` | `<FileUpload label="Drop files here" />` | Drag-and-drop upload zone |

### Status and Feedback

| Component | Import | Usage |
|-----------|--------|-------|
| `Badge` | `<Badge variant="green">Active</Badge>` | Pill-shaped status badge. Variants: green, red, blue, yellow, orange, gray, purple. Helper: `statusVariant(status)` maps strings to colours |
| `Status` | `<Status color="green" label="Active" />` | Small coloured dot with label |
| `OnOffBadge` | `<OnOffBadge value={true} />` | Simple on/off indicator |
| `Alert` | `<Alert variant="warning">Message</Alert>` | Alert box. Variants: info, warning, success, error |
| `Spinner` | `<Spinner size="md" />` | Loading spinner. Sizes: sm, md, lg |
| `EmptyState` | `<EmptyState icon={Icon} title="No results" message="..." />` | No-data placeholder with optional CTA |

### Overlays

| Component | Import | Usage |
|-----------|--------|-------|
| `Modal` | `<Modal open={v} onClose={fn} title="Edit" maxWidth="md">` | Dialog with backdrop. Sizes: sm, md, lg, xl. Supports footer slot. Escape and click-outside to close |

### Typography and Utility

| Component | Import | Usage |
|-----------|--------|-------|
| `Text` | `<Text variant="heading/lg">Title</Text>` | Semantic typography. Variants: display/lg, display/md, display/sm, heading/lg, heading/md, heading/sm, body/lg, body/md, body/sm, body/md-strong, body/lg-strong, label/lg, label/md, label/sm, caption/md, caption/sm, metric/lg, metric/md. Auto-selects correct HTML element |
| `Avatar` | `<Avatar name="Sarah Chen" size="md" />` | Initials circle. Sizes: sm, md, lg, xl |
| `Card` | `<Card title="Details" padding="md">content</Card>` | Content container. Padding: none, sm, md, lg |
| `Tab` | `<Tab items={[...]} value={v} onChange={fn} />` | Underline tab bar with optional badges |
| `Chip` | `<Chip variant="purple" onRemove={fn}>Tag</Chip>` | Removable tag. Variants: green, purple, yellow, blue, red, gray |
| `Collapse` | `<Collapse title="Advanced" defaultOpen={false}>` | Expandable section with chevron |
| `ColorDot` | `<ColorDot color="#7c3aed" size="md" />` | Inline colour indicator |
| `IconText` | `<IconText icon={<Clock />}>2:30 PM</IconText>` | Icon + text inline pair |
| `HintIcon` | `<HintIcon tooltip="More info" />` | Small "i" icon with tooltip |

### Utility Helpers (src/lib/)

| File | What it provides |
|------|-----------------|
| `badge-variants.ts` | `getBadgeVariant(type)` maps entity types (Invoice, Payment, etc.) to Badge colour variants |
| `dropdown-presets.ts` | Pre-built DropdownItem arrays: `STANDARD_SETTINGS`, `SIMPLE_CRUD`, `USER_ADMIN` |
| `format.ts` | `formatTimestamp(date)` formats dates in Australian locale ("4:51 pm, 10 Feb 2026") |

### Icon Library

The prototype uses **`lucide-react`** (v0.577.0) for all icons. Import icons directly:

```tsx
import { Bell, MessageSquare, Settings, HelpCircle, Search, Plus, Edit, Trash2, Download, Printer, Eye, X, ChevronLeft, ChevronRight, ChevronDown, MoreHorizontal, User, Calendar, FileText, Clock, Undo } from 'lucide-react';
```

### Key Conventions

- Always import DS components from `@/components/ds`
- Use `<Text variant="...">` or the CSS utility classes (`text-display-lg`, `text-heading-md`, etc.) for typography
- Use design tokens via CSS variables (`--color-primary`, `--color-text`, etc.)
- Default to server components; only use `"use client"` when you need hooks or browser APIs
- Dates should be formatted in Australian locale (en-AU) using `formatTimestamp()` from `src/lib/format.ts`
- Storybook is available for component development (`npm run storybook`)

## AI Features

The app has AI functionality marked by a distinctive gradient styling:

- **AI sparkle icon**: purple-to-pink gradient background (`linear-gradient(149.47deg, rgba(130, 80, 255, 0.2), rgba(243, 172, 250, 0.2))`)
- **AI buttons**: gradient border effect with animation
- **AI settings page**: dedicated `/settings/ai` route with unlock background image
- **AI in notes editor**: toolbar button for AI-assisted writing
- **AI prompts modal**: scrollable list of saved prompts
