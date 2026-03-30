# Ant Design Migration — Phase 3: Page Migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all 96 pages to use the new AntD-based DS components, replace all Tailwind classes with AntD layout components and CSS Modules, and replace all Lucide icons with @ant-design/icons.

**Architecture:** Pages import components from @/components/ds (unchanged). Layout uses AntD Flex, Row, Col, Space directly. Remaining spacing/padding uses CSS Modules. Icons switch from lucide-react to @ant-design/icons.

**Tech Stack:** antd 5.x, @ant-design/icons, CSS Modules, Next.js 16, React 19, TypeScript strict

**Spec:** `docs/superpowers/specs/2026-03-30-antd-migration-design.md`

**Colour tokens:** `docs/superpowers/specs/2026-03-30-colour-tokens-reference.md` — canonical source for any colour values used in pages.

**Prerequisite:** Phase 2 (DS Component Rewrite) must be complete — all DS components use AntD internally.

---

## ESLint Exception Reminder

AntD layout components (`Flex`, `Row`, `Col`, `Space`) are imported directly from `antd` in page code. This is the one exception to the "no direct antd imports in pages" rule. These layout primitives add no value as wrappers.

```typescript
// Allowed in pages:
import { Flex, Row, Col, Space } from "antd";

// Still required for all other components:
import { Button, Card, DataTable, Modal } from "@/components/ds";
```

---

## Task 1: Create Icon Mapping Utility

Create a reference module that maps every lucide-react icon used across the 75 importing files to its @ant-design/icons equivalent. This file serves as both documentation and a runtime mapping for any shared utilities.

**Files:**
- `src/lib/icon-mapping.ts` (new)

### Icon Inventory (all icons found in src/app/)

| Lucide Icon | @ant-design/icons Equivalent | Used In |
|---|---|---|
| `AlertCircle` | `ExclamationCircleOutlined` | ndis-bulk-upload/new |
| `AlertTriangle` | `WarningOutlined` | CalendarView, settings/ai |
| `AlignCenter` | `AlignCenterOutlined` | SendNoteModal |
| `AlignLeft` | `AlignLeftOutlined` | SendNoteModal |
| `AlignRight` | `AlignRightOutlined` | SendNoteModal |
| `ArrowLeft` | `ArrowLeftOutlined` | settings/data-import |
| `ArrowRight` | `ArrowRightOutlined` | settings/data-import |
| `ArrowUp` | `ArrowUpOutlined` | CalendarView |
| `ArrowUpDown` | `SwapOutlined` | contacts, payments, multiple client sub-pages |
| `Ban` | `StopOutlined` | CalendarView |
| `Bold` | `BoldOutlined` | SendNoteModal |
| `BookOpen` | `ReadOutlined` | settings/services, settings/sms-settings, settings/user-groups |
| `Building2` | `BankOutlined` | contacts/[id] |
| `Calendar` | `CalendarOutlined` | CalendarView, online-booking |
| `CalendarDays` | `CalendarOutlined` | CalendarView, settings/invoice-settings |
| `CalendarPlus` | `CalendarOutlined` | online-booking |
| `Check` | `CheckOutlined` | CalendarView, settings/progress-notes/edit, settings/user-groups |
| `CheckCircle` | `CheckCircleOutlined` | notes/[id], payments/new, online-booking |
| `CheckCircle2` | `CheckCircleFilled` | settings/data-import/csv |
| `ChevronDown` | `DownOutlined` | DashboardClient, CalendarView, multiple pages |
| `ChevronLeft` | `LeftOutlined` | CalendarView, online-booking |
| `ChevronRight` | `RightOutlined` | DashboardClient, login, online-booking |
| `ClipboardList` | `SnippetsOutlined` | CalendarView, notes/new |
| `Clock` | `ClockCircleOutlined` | CalendarView, online-booking |
| `Columns2` | `ColumnWidthOutlined` | notes/new |
| `Copy` | `CopyOutlined` | notes/new, online-booking, settings/online-bookings/[id] |
| `Database` | `DatabaseOutlined` | settings/data-import |
| `Edit3` | `EditOutlined` | SendNoteModal |
| `ExternalLink` | `LinkOutlined` | settings/online-bookings/[id] |
| `Eye` | `EyeOutlined` | SendNoteModal |
| `EyeOff` | `EyeInvisibleOutlined` | login |
| `FileSpreadsheet` | `FileExcelOutlined` | settings/data-import, settings/data-import/csv |
| `FileText` | `FileTextOutlined` | CalendarView, online-booking, client files, ndis-bulk-upload/new |
| `Filter` | `FilterOutlined` | CalendarView, contacts, payments, multiple client sub-pages |
| `FolderPlus` | `FolderAddOutlined` | clients/[id]/files |
| `Grid3X3` | `TableOutlined` | SendNoteModal |
| `GripVertical` | `HolderOutlined` | settings/progress-notes/edit, settings/forms/[id] |
| `Hash` | `NumberOutlined` | settings/forms/[id] |
| `History` | `HistoryOutlined` | CalendarView |
| `Image` | `PictureOutlined` | SendNoteModal |
| `Info` | `InfoCircleOutlined` | CalendarView, settings/invoice-settings |
| `Italic` | `ItalicOutlined` | SendNoteModal |
| `LayoutGrid` | `AppstoreOutlined` | CalendarView, notes/new |
| `Lightbulb` | `BulbOutlined` | CalendarView |
| `Link2` | `LinkOutlined` | SendNoteModal, settings/online-bookings/[id] |
| `List` | `UnorderedListOutlined` | settings/forms/[id] |
| `ListOrdered` | `OrderedListOutlined` | SendNoteModal |
| `Lock` | `LockOutlined` | NoteViewToolbar |
| `Mail` | `MailOutlined` | CalendarView, online-booking, patient-form, contacts/[id], InvoiceActions, InvoiceDetailClient |
| `MapPin` | `EnvironmentOutlined` | CalendarView, online-booking, contacts/[id] |
| `Menu` | `MenuOutlined` | TopNav (ds/) |
| `MessageCircle` | `MessageOutlined` | settings/sms-settings, settings/data-import |
| `Minus` | `MinusOutlined` | SendNoteModal, products |
| `Monitor` | `DesktopOutlined` | CalendarView |
| `MoreHorizontal` | `MoreOutlined` | products, settings/progress-notes/edit |
| `Paperclip` | `PaperClipOutlined` | SendNoteModal |
| `Pencil` | `EditOutlined` | ClientDetailClient, NoteViewToolbar |
| `Phone` | `PhoneOutlined` | contacts/[id] |
| `Plus` | `PlusOutlined` | contacts, products, payments, client sub-pages, invoices/new, CalendarView |
| `Printer` | `PrinterOutlined` | payments/new |
| `Repeat` | `SyncOutlined` | CalendarView |
| `RotateCcw` | `UndoOutlined` | NoteViewToolbar |
| `Search` | `SearchOutlined` | CalendarView, payments/new |
| `Send` | `SendOutlined` | SendNoteModal, NoteViewToolbar |
| `Settings` | `SettingOutlined` | CalendarView, settings/page, settings/forms/[id], reports/page |
| `Share2` | `ShareAltOutlined` | settings/forms/[id] |
| `Sparkles` | `ThunderboltOutlined` | CalendarView, settings/progress-notes, notes/[id]/edit |
| `Trash2` | `DeleteOutlined` | invoices/new, settings/forms/[id] |
| `ToggleLeft` | `SwitcherOutlined` | settings/forms/[id] |
| `Type` | `FontSizeOutlined` | SendNoteModal, settings/forms/[id] |
| `Underline` | `UnderlineOutlined` | SendNoteModal |
| `Upload` | `UploadOutlined` | settings/data-import, settings/data-import/csv, settings/online-bookings/[id], settings/forms/[id] |
| `User` | `UserOutlined` | CalendarView, online-booking |
| `UserPlus` | `UserAddOutlined` | CalendarView |
| `Users` | `TeamOutlined` | CalendarView |
| `Video` | `VideoCameraOutlined` | CalendarView |
| `X` | `CloseOutlined` | CalendarView, settings/progress-notes, TopNav (ds/) |

### Sizing Conversion

Lucide icons use Tailwind className for sizing. AntD icons use the `style` prop:

```typescript
// BEFORE (Lucide + Tailwind):
<Plus className="h-4 w-4" />
<Settings className="h-5 w-5" />
<ChevronDown className="h-3 w-3" />

// AFTER (AntD icons):
<PlusOutlined style={{ fontSize: 16 }} />
<SettingOutlined style={{ fontSize: 20 }} />
<DownOutlined style={{ fontSize: 12 }} />
```

Size mapping: `h-3 w-3` = 12px, `h-4 w-4` = 16px (default, can omit style), `h-5 w-5` = 20px, `h-6 w-6` = 24px.

AntD icons default to 14px (inheriting font-size). When no className sizing is present on the Lucide icon, omit the style prop on the AntD icon.

### Steps

- [ ] Create `src/lib/icon-mapping.ts` with a `LUCIDE_TO_ANTD` record type mapping icon names to AntD equivalents
- [ ] Include a `LUCIDE_SIZE_MAP` record mapping Tailwind size classes to pixel values
- [ ] Export both as named exports for use in migration and any shared utilities
- [ ] Run `npx tsc --noEmit` to verify the file compiles
- [ ] Commit: `feat(migration): add lucide-to-antd icon mapping utility`

---

## Task 2: Create Page CSS Module Template

Create a reference CSS Module showing the standard patterns for replacing common Tailwind layout classes that do not map cleanly to AntD layout components.

**Files:**
- `src/app/page-template.module.css` (new — reference template, deleted after migration)

### Template Content

```css
/* page-template.module.css
 * Reference template for Phase 3 page migration.
 * Copy this file as <page-folder>/page.module.css and keep only
 * the classes you actually use. Delete this template after migration.
 */

/* ── Page-level padding (replaces p-6, p-8, px-6 py-4, etc.) ── */
.page {
  padding: 32px;             /* p-8 */
}
.pageCompact {
  padding: 24px;             /* p-6 */
}
.pageNarrow {
  padding: 24px;
  max-width: 896px;          /* max-w-4xl */
}

/* ── Section spacing (replaces space-y-4, space-y-6) ── */
.stack4 {
  display: flex;
  flex-direction: column;
  gap: 16px;                 /* space-y-4 → gap-4 */
}
.stack6 {
  display: flex;
  flex-direction: column;
  gap: 24px;                 /* space-y-6 → gap-6 */
}

/* ── Divider spacing (replaces border-t + pt-6 + mt-6) ── */
.dividerSection {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--ant-color-border);
}

/* ── Header row (replaces mb-6 flex items-center justify-between) ── */
.headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

/* ── Two-column layout (replaces flex gap-8 with flex-1) ── */
.twoCol {
  display: flex;
  gap: 32px;
}
.twoColMain {
  flex: 1;
}
.twoColSide {
  width: 320px;
  flex-shrink: 0;
}

/* ── Text colour helpers (replaces text-text, text-text-secondary) ── */
.textPrimary {
  color: var(--ant-color-text);
}
.textSecondary {
  color: var(--ant-color-text-secondary);
}
.textTertiary {
  color: var(--ant-color-text-tertiary);
}

/* ── Typography (replaces text-display-lg, text-heading-md, text-sm, etc.) ── */
/* NOTE: prefer <Text variant="..."> from DS for headings.
   Use these only for inline text styling in non-heading contexts. */
.textSm {
  font-size: 12px;
  line-height: 16px;
}
.textBase {
  font-size: 14px;
  line-height: 20px;
}
.textLg {
  font-size: 18px;
  line-height: 28px;
}
```

### Steps

- [ ] Create `src/app/page-template.module.css` with the patterns above
- [ ] Commit: `chore(migration): add CSS Module reference template for page migration`

---

## Task 3: Migrate Template Page End-to-End

Migrate `src/app/settings/cancellation-reasons/page.tsx` as the canonical reference migration. This page covers all key patterns: Tailwind layout, DataTable with .map(), Lucide icons (none in this page — good baseline), Modal, form fields, pagination.

**Files:**
- `src/app/settings/cancellation-reasons/page.tsx`
- `src/app/settings/cancellation-reasons/page.module.css` (new)

### Before/After: Full Migration Patterns

#### Pattern 1: Page padding (`className="p-8"` → CSS Module)

```typescript
// BEFORE:
<div className="p-8">

// AFTER:
import styles from "./page.module.css";
// ...
<div className={styles.page}>
```

```css
/* page.module.css */
.page { padding: 32px; }
```

#### Pattern 2: Header row (`className="mb-6 flex items-center justify-between"` → AntD Flex)

```typescript
// BEFORE:
<div className="mb-6 flex items-center justify-between">
  <h1 className="text-display-lg">Cancellation reasons</h1>
  <div className="flex items-center gap-2">
    <Button variant="secondary">Show archived</Button>
    <Button variant="secondary" onClick={openCreate}>+ New reason</Button>
  </div>
</div>

// AFTER:
import { Flex } from "antd";
import { Text } from "@/components/ds";
// ...
<Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
  <Text variant="display/lg">Cancellation reasons</Text>
  <Flex gap={8}>
    <Button variant="secondary">Show archived</Button>
    <Button variant="secondary" onClick={openCreate}>+ New reason</Button>
  </Flex>
</Flex>
```

#### Pattern 3: DataTable `.map()` loop → AntD Table column definitions

This is the biggest change. Every page that uses `<DataTable>` with `<TableHead>/<Th>/<TableBody>/<Tr>/<Td>` must rewrite to column definitions.

```typescript
// BEFORE:
import { DataTable, TableHead, Th, TableBody, Tr, Td, Pagination, Dropdown,
         DropdownTriggerButton, usePagination } from "@/components/ds";
// ...
const { paged, paginationProps } = usePagination(reasons, { pageKey: "..." });
// ...
<DataTable>
  <TableHead>
    <Th>Name</Th>
    <Th>Code</Th>
    <Th align="right">Actions</Th>
  </TableHead>
  <TableBody>
    {paged.map((r, i) => (
      <Tr key={i}>
        <Td className="text-text">{r.name}</Td>
        <Td>{r.code ? <Badge variant="gray">{r.code}</Badge> : ""}</Td>
        <Td align="right">
          <Dropdown
            align="right"
            trigger={<DropdownTriggerButton />}
            items={SIMPLE_CRUD}
            onSelect={(value) => handleAction(value, i)}
          />
        </Td>
      </Tr>
    ))}
  </TableBody>
</DataTable>
<Pagination {...paginationProps} showPageSize={false} />

// AFTER:
import type { ColumnsType } from "antd/es/table";
import { DataTable, Dropdown, DropdownTriggerButton, Badge } from "@/components/ds";
// ...
// No usePagination — AntD Table has built-in pagination.
const columns: ColumnsType<CancellationReason> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    render: (code: string) => code ? <Badge variant="gray">{code}</Badge> : null,
  },
  {
    title: "Actions",
    key: "actions",
    align: "right" as const,
    render: (_: unknown, _record: CancellationReason, index: number) => (
      <Dropdown
        align="right"
        trigger={<DropdownTriggerButton />}
        items={SIMPLE_CRUD}
        onSelect={(value) => handleAction(value, index)}
      />
    ),
  },
];
// ...
<DataTable
  columns={columns}
  dataSource={reasons}
  rowKey={(_, index) => String(index)}
  pagination={{ pageSize: 10, showSizeChanger: false }}
/>
```

#### Pattern 4: `space-y-4` → Flex column with gap

```typescript
// BEFORE:
<div className="space-y-4">
  <FormInput label="Name" ... />
  <FormInput label="Code" ... />
</div>

// AFTER:
<Flex vertical gap={16}>
  <FormInput label="Name" ... />
  <FormInput label="Code" ... />
</Flex>
```

#### Pattern 5: Divider section (`className="mt-6 border-t border-border pt-6"` → CSS Module)

```typescript
// BEFORE:
<div className="mt-6 border-t border-border pt-6">
  <h3 className="text-heading-md text-text mb-4">Cancellation rules</h3>

// AFTER:
<div className={styles.dividerSection}>
  <Text variant="heading/md" style={{ marginBottom: 16 }}>Cancellation rules</Text>
```

#### Pattern 6: Heading elements (`className="text-display-lg"` → Text component)

```typescript
// BEFORE:
<h1 className="text-display-lg">Title</h1>
<h3 className="text-heading-md text-text">Section</h3>

// AFTER:
<Text variant="display/lg">Title</Text>
<Text variant="heading/md">Section</Text>
```

### Steps

- [ ] Create `src/app/settings/cancellation-reasons/page.module.css` with `.page` and `.dividerSection` classes
- [ ] Rewrite `page.tsx`: remove all Tailwind className props
- [ ] Replace `<DataTable>` + `.map()` pattern with column definitions and `dataSource` prop
- [ ] Remove `usePagination` — use DataTable's built-in pagination prop
- [ ] Replace all `<div className="flex ...">` with `<Flex>` from antd
- [ ] Replace all `<div className="space-y-*">` with `<Flex vertical gap={...}>`
- [ ] Replace `<h1>/<h3>` with Tailwind text classes → `<Text variant="...">` from DS
- [ ] Verify no `className=` props remain that contain Tailwind classes
- [ ] Run `npx tsc --noEmit` to verify types
- [ ] Commit: `feat(migration): migrate cancellation-reasons page as reference template`

---

## Task 4: Settings Pages — Batch 1 (SettingsListPage Pattern)

These pages use the `SettingsListPage` component which handles table layout, pagination, modals, and dropdowns internally. Migration is minimal: remove any Tailwind `className` props, replace Lucide icons if present.

**Files:**
- `src/app/settings/referral-types/page.tsx`
- `src/app/settings/communication-types/page.tsx`

### What to change

These pages already use `SettingsListPage` with column definitions — they are already close to the AntD pattern. The main changes:

1. Remove `className="p-2"` or similar Tailwind props (SettingsListPage handles its own padding post-Phase 2)
2. Replace any Lucide icon imports (neither of these two pages imports Lucide icons)
3. Verify TypeScript compiles after Phase 2's SettingsListPage API changes

### Steps

- [ ] Migrate `src/app/settings/referral-types/page.tsx` — remove Tailwind className props
- [ ] Migrate `src/app/settings/communication-types/page.tsx` — remove Tailwind className props
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate SettingsListPage-pattern settings pages`

---

## Task 5: Settings Pages — Batch 2 (Custom Layouts)

These settings pages have custom layouts — forms, tables with inline `.map()`, modals, icons. Each needs individual migration.

### Sub-batch 5a: Simple table pages (DataTable + modal pattern, no icons)

**Files:**
- `src/app/settings/cancellation-reasons/page.tsx` (already migrated in Task 3)
- `src/app/settings/tags/page.tsx`
- `src/app/settings/busy-times/page.tsx`
- `src/app/settings/letter-templates/page.tsx`
- `src/app/settings/body-charts/page.tsx`
- `src/app/settings/appointment-templates/page.tsx`
- `src/app/settings/locations/page.tsx`
- `src/app/settings/email-templates/page.tsx`
- `src/app/settings/tax-rates/page.tsx`
- `src/app/settings/online-bookings/page.tsx`
- `src/app/settings/integrations/page.tsx`

Each page: create `page.module.css`, convert DataTable to column definitions, replace Tailwind layout with Flex/CSS Modules, remove usePagination.

### Sub-batch 5b: Table pages with icons

**Files:**
- `src/app/settings/services/page.tsx` (uses ArrowUpDown, BookOpen)
- `src/app/settings/rooms-resources/page.tsx` (uses ArrowUpDown, Filter)
- `src/app/settings/user-groups/page.tsx` (uses BookOpen, ArrowUpDown, Check)
- `src/app/settings/custom-fields/page.tsx` (uses many Lucide icons)
- `src/app/settings/forms/page.tsx` (uses ChevronDown)
- `src/app/settings/progress-notes/page.tsx` (uses Sparkles, X)

Each page: same as 5a plus replace Lucide icon imports with @ant-design/icons equivalents.

### Sub-batch 5c: Form/detail pages

**Files:**
- `src/app/settings/details/page.tsx` (uses ChevronDown — complex form layout)
- `src/app/settings/invoice-settings/page.tsx` (uses CalendarDays, Info)
- `src/app/settings/payment-settings/page.tsx`
- `src/app/settings/sms-settings/page.tsx` (uses BookOpen, MessageCircle)
- `src/app/settings/ai/page.tsx` (uses AlertTriangle)
- `src/app/settings/page.tsx` (settings hub — uses Settings icon)

### Sub-batch 5d: Edit/detail sub-pages

**Files:**
- `src/app/settings/users/page.tsx`
- `src/app/settings/users/[id]/page.tsx`
- `src/app/settings/users/[id]/UserDetailClient.tsx`
- `src/app/settings/services/edit/[id]/page.tsx`
- `src/app/settings/services/edit/[id]/EditServiceClient.tsx`
- `src/app/settings/locations/edit/[id]/page.tsx`
- `src/app/settings/locations/edit/[id]/EditLocationClient.tsx`
- `src/app/settings/locations/new/page.tsx`
- `src/app/settings/appointment-templates/new/page.tsx`
- `src/app/settings/email-templates/edit/[id]/page.tsx`
- `src/app/settings/letter-templates/edit/[id]/page.tsx`
- `src/app/settings/progress-notes/edit/[id]/page.tsx` (uses Sparkles, Plus, GripVertical, MoreHorizontal, Check)
- `src/app/settings/forms/[id]/page.tsx` (uses GripVertical, Plus, Trash2, Eye, Share2, Settings, Type, Hash, Calendar, ToggleLeft, List, FileText, Upload — 13 icons)
- `src/app/settings/online-bookings/[id]/page.tsx` (uses Upload, Link, Copy, ExternalLink)

### Steps

- [ ] Migrate sub-batch 5a: 10 simple table pages (create CSS Modules, column definitions, remove Tailwind)
- [ ] Migrate sub-batch 5b: 6 table pages with icons (same + replace Lucide → @ant-design/icons)
- [ ] Migrate sub-batch 5c: 6 form/detail pages (replace Tailwind layout, icons)
- [ ] Migrate sub-batch 5d: 14 edit/detail sub-pages (replace Tailwind layout, icons)
- [ ] Run `npx tsc --noEmit` after each sub-batch
- [ ] Commit after each sub-batch:
  - `feat(migration): migrate settings simple table pages`
  - `feat(migration): migrate settings table pages with icons`
  - `feat(migration): migrate settings form and detail pages`
  - `feat(migration): migrate settings edit and sub-pages`

---

## Task 6: Client List and Detail Pages

The client area is the second-most complex route group. The list page uses DataTable + search + filters. The detail page has a sidebar layout with 12 sub-page tabs.

**Files:**
- `src/app/clients/page.tsx` (server component — renders ClientsPageClient)
- `src/app/clients/ClientsPageClient.tsx` (uses Plus icon)
- `src/app/clients/new/page.tsx`
- `src/app/clients/[id]/page.tsx` (server component — renders ClientDetailClient)
- `src/app/clients/[id]/ClientDetailClient.tsx` (uses Pencil icon)
- `src/app/clients/[id]/ClientSidebar.tsx` (Tailwind className)
- `src/app/clients/[id]/layout.tsx` (Tailwind className)
- `src/app/clients/[id]/appointments/page.tsx`
- `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` (many Lucide icons)
- `src/app/clients/[id]/invoices/page.tsx` (uses ArrowUpDown, Filter)
- `src/app/clients/[id]/payments/page.tsx` (uses Plus, ArrowUpDown, Filter)
- `src/app/clients/[id]/communications/page.tsx` (uses Plus, ArrowUpDown, Filter)
- `src/app/clients/[id]/notes/page.tsx` (uses ArrowUpDown)
- `src/app/clients/[id]/files/page.tsx` (uses ArrowUpDown, FolderPlus, ChevronDown, FileText)
- `src/app/clients/[id]/letters/page.tsx` (uses Plus)
- `src/app/clients/[id]/forms/page.tsx`
- `src/app/clients/[id]/cases/page.tsx`
- `src/app/clients/[id]/statements/page.tsx` (uses ChevronDown)
- `src/app/clients/[id]/support-activities/page.tsx` (uses Plus)
- `src/app/clients/[id]/practitioner-access/page.tsx` (uses ArrowUpDown, Filter)

### Key migration patterns

- **ClientSidebar**: Replace Tailwind sidebar layout with AntD Flex + CSS Module for width/padding
- **Client detail layout**: The `[id]/layout.tsx` uses flex layout for sidebar + content area — migrate to `<Flex>` or `<Row><Col>`
- **Sub-page tables**: All follow the same DataTable + .map() pattern. Convert to column definitions.
- **AppointmentSidePanel**: Heavy icon usage — apply icon mapping from Task 1

### Steps

- [ ] Create CSS Modules for pages that need them (ClientSidebar, layout, etc.)
- [ ] Migrate `ClientsPageClient.tsx` — column definitions, icon replacement
- [ ] Migrate `clients/new/page.tsx` — form layout to Flex/CSS Module
- [ ] Migrate `ClientDetailClient.tsx` + `ClientSidebar.tsx` + `[id]/layout.tsx` — sidebar layout
- [ ] Migrate all 12 client sub-pages (appointments, invoices, payments, communications, notes, files, letters, forms, cases, statements, support-activities, practitioner-access)
- [ ] Migrate `AppointmentSidePanel.tsx` — heavy icon replacement
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate client list and detail pages`

---

## Task 7: Contacts Pages

The contacts page has a responsive table with hidden columns on smaller viewports, clickable rows with an absolute-positioned link overlay, and a contact detail page with icon-rich layout.

**Files:**
- `src/app/contacts/page.tsx` (uses Plus, ArrowUpDown, Filter)
- `src/app/contacts/[id]/page.tsx` (uses Mail, Phone, MapPin, Building2)
- `src/app/contacts/new/page.tsx`

### Key migration patterns

- **Hidden columns**: Replace Tailwind `hidden sm:table-cell` with AntD Table `responsive` prop or Column `responsive: ['sm']`
- **Clickable row overlay**: Replace absolute-positioned `<Link>` with AntD Table `onRow` click handler
- **Contact detail icons**: Replace Lucide icons with @ant-design/icons (Mail→MailOutlined, Phone→PhoneOutlined, MapPin→EnvironmentOutlined, Building2→BankOutlined)

### Steps

- [ ] Create `src/app/contacts/page.module.css` if needed
- [ ] Migrate `contacts/page.tsx` — DataTable to column definitions, icon replacement, responsive columns
- [ ] Migrate `contacts/[id]/page.tsx` — icon replacement, Tailwind layout to Flex/CSS Module
- [ ] Migrate `contacts/new/page.tsx` — form layout
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate contacts pages`

---

## Task 8: Products Page

Complex page with expandable rows (product variants), nested tables, multiple modals, and archived item filtering.

**Files:**
- `src/app/products/page.tsx` (uses Plus, Minus, MoreHorizontal)
- `src/app/products/new/page.tsx`

### Key migration patterns

- **Expandable rows**: Replace manual expand toggle with AntD Table `expandable={{ expandedRowRender: (record) => ... }}` prop
- **Plus/Minus toggle**: Currently uses `<Plus className="h-4 w-4" />` and `<Minus>` for expand/collapse — AntD Table handles expand icon automatically
- **Nested variant table**: The expanded row content shows a sub-table of variants. Use a nested `<DataTable>` inside `expandedRowRender`
- **Archived filter**: Keep filter logic, just restyle toggle with AntD components

### Steps

- [ ] Create `src/app/products/page.module.css`
- [ ] Migrate `products/page.tsx` — column definitions, expandable row config, icon replacement
- [ ] Migrate `products/new/page.tsx` — form layout
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate products pages`

---

## Task 9: Invoice Pages

Invoice list, new invoice creation, batch invoice preview. The invoice detail page has a complex multi-section layout with actions dropdown.

**Files:**
- `src/app/invoices/page.tsx` (server component — renders InvoicesClient)
- `src/app/invoices/InvoicesClient.tsx` (uses Plus)
- `src/app/invoices/[id]/page.tsx`
- `src/app/invoices/[id]/InvoiceDetailClient.tsx` (uses ChevronDown, Mail)
- `src/app/invoices/[id]/InvoiceActions.tsx` (uses ChevronDown, Mail)
- `src/app/invoices/new/page.tsx` (uses Plus, Trash2)
- `src/app/invoices/batch-invoice/page.tsx`
- `src/app/invoices/batch-invoice/[id]/page.tsx`
- `src/app/invoices/batch-invoice/preview/page.tsx`

### Key migration patterns

- **Invoice line items**: The new invoice page uses a dynamic list of line items with add/remove. Replace `<Plus>`/`<Trash2>` icons.
- **Invoice detail**: Multi-section layout (header, line items, payments, notes). Replace Tailwind grid/flex with Row/Col or Flex.
- **Batch invoice**: Multi-step flow — ensure each step renders without Tailwind.

### Steps

- [ ] Create CSS Modules for invoice pages as needed
- [ ] Migrate `InvoicesClient.tsx` — column definitions, icon replacement
- [ ] Migrate `InvoiceDetailClient.tsx` + `InvoiceActions.tsx` — layout, icons
- [ ] Migrate `invoices/new/page.tsx` — dynamic line item list, icons
- [ ] Migrate batch invoice pages (3 files)
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate invoice pages`

---

## Task 10: Payments Page

Payments list with expandable rows showing nested payment allocations.

**Files:**
- `src/app/payments/page.tsx` (uses Plus, ArrowUpDown, Filter)
- `src/app/payments/new/page.tsx` (uses X, Plus, Search, Printer, CheckCircle)

### Key migration patterns

- **Expandable payment rows**: Same pattern as products — use AntD Table `expandable` prop
- **New payment page**: Complex form with search, multiple sections, print button. Replace all Tailwind layout + icons.

### Steps

- [ ] Create CSS Modules for payment pages
- [ ] Migrate `payments/page.tsx` — column definitions, expandable rows, icon replacement
- [ ] Migrate `payments/new/page.tsx` — form layout, icon replacement (5 icons)
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate payments pages`

---

## Task 11: Waitlist Page

The waitlist page has a rich table with multiple columns, sorting, filtering, date range picker, avatars, and tags.

**Files:**
- `src/app/waitlist/page.tsx` (uses many Lucide icons)
- `src/app/waitlist/new/page.tsx`

### Steps

- [ ] Create `src/app/waitlist/page.module.css`
- [ ] Migrate `waitlist/page.tsx` — column definitions, icon replacement, filter/sort integration
- [ ] Migrate `waitlist/new/page.tsx` — form layout
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate waitlist pages`

---

## Task 12: Notes Pages

Notes pages are server-rendered with Prisma data. Some use client components for interactive toolbars and modals.

**Files:**
- `src/app/notes/[id]/page.tsx` (uses CheckCircle)
- `src/app/notes/[id]/edit/page.tsx` (uses many Lucide icons — rich text toolbar)
- `src/app/notes/[id]/NoteViewToolbar.tsx` (uses Pencil, Lock, RotateCcw, ChevronDown, Send)
- `src/app/notes/[id]/SendNoteModal.tsx` (uses 16 Lucide icons — rich text editor toolbar)
- `src/app/notes/new/page.tsx` (uses LayoutGrid, Columns2, Copy, ChevronDown, ClipboardList)

### Key migration patterns

- **SendNoteModal**: The single most icon-heavy non-calendar component (16 icons). Apply icon mapping systematically.
- **Rich text toolbar icons**: These are small inline icons in a toolbar — use AntD icon `style={{ fontSize: 14 }}` to match the toolbar density.
- **NoteViewToolbar**: Replace 5 icons + dropdown trigger.

### Steps

- [ ] Migrate `notes/[id]/page.tsx` — icon replacement, layout
- [ ] Migrate `notes/[id]/edit/page.tsx` — rich text toolbar icons, layout
- [ ] Migrate `NoteViewToolbar.tsx` — 5 icon replacements
- [ ] Migrate `SendNoteModal.tsx` — 16 icon replacements (bulk replacement using icon mapping)
- [ ] Migrate `notes/new/page.tsx` — 5 icon replacements, layout
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate notes pages`

---

## Task 13: Reports Pages

Reports have sortable tables with avatars, charts, progress bars, and DateRangePicker. Custom SVG charts stay as SVG — only replace Tailwind styling.

**Files:**
- `src/app/reports/page.tsx` (uses Calendar, ChevronDown, Settings — reports hub page)
- `src/app/reports/layout.tsx` (Tailwind className)
- `src/app/reports/performance/page.tsx` (charts, progress bars, avatars)
- `src/app/reports/patients/page.tsx`
- `src/app/reports/payments/page.tsx`
- `src/app/reports/appointments/page.tsx`
- `src/app/reports/uninvoiced/page.tsx`
- `src/app/reports/billed-items/page.tsx`
- `src/app/reports/progress-notes/page.tsx`
- `src/app/reports/cases/page.tsx`
- `src/app/reports/support-activities/page.tsx`
- `src/app/reports/form/page.tsx`
- `src/app/reports/waitlist/page.tsx`
- `src/app/reports/aged-debtors/page.tsx`
- `src/app/reports/ndis-bulk-upload/page.tsx`
- `src/app/reports/ndis-bulk-upload/[id]/page.tsx`
- `src/app/reports/ndis-bulk-upload/new/page.tsx` (uses Upload, CheckCircle, AlertCircle, FileText)
- `src/components/ReportsSidebar.tsx` (shared sidebar component)

### Key migration patterns

- **Charts (SVG)**: Keep custom SVG rendering. Replace Tailwind styling classes on chart containers with CSS Modules. Do NOT replace SVG internals with AntD components.
- **Progress bars**: Replace Tailwind `bg-primary w-[65%] h-2 rounded` with AntD `<Progress>` component or CSS Module.
- **Reports layout**: The `layout.tsx` uses a sidebar layout — migrate to Flex + CSS Module.
- **ReportsSidebar**: Shared component — migrate Tailwind to CSS Module.
- **DateRangePicker**: Already wrapped in DS — just ensure page usage is correct post-Phase 2.

### Steps

- [ ] Migrate `reports/layout.tsx` + `ReportsSidebar.tsx` — shared layout first
- [ ] Migrate `reports/page.tsx` — hub page with icons, layout
- [ ] Migrate `reports/performance/page.tsx` — charts (keep SVG), progress bars, avatars
- [ ] Migrate remaining 10 standard report pages (patients, payments, appointments, uninvoiced, billed-items, progress-notes, cases, support-activities, form, waitlist)
- [ ] Migrate `reports/aged-debtors/page.tsx`
- [ ] Migrate NDIS bulk upload pages (3 files) — icon replacement
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate reports pages`

---

## Task 14: Dashboard

The dashboard is the most Tailwind-heavy page (107 className occurrences). Complex two-column layout, custom chart bars (SVG), expandable messages, and inline SVGs.

**Files:**
- `src/app/page.tsx` (server component — renders DashboardClient)
- `src/app/DashboardClient.tsx` (uses ChevronDown, ChevronRight — 107 className usages)

### Key migration patterns

- **Two-column layout**: Replace `<div className="grid grid-cols-...">` with `<Row><Col span={16}><Col span={8}>`
- **Income chart**: Custom SVG bars — keep SVG, replace Tailwind styling on containers with CSS Module
- **Appointment list**: Replace Tailwind card layout with AntD Card + Flex
- **Expandable messages**: Replace `<ChevronDown>`/`<ChevronRight>` toggle with `<DownOutlined>`/`<RightOutlined>`
- **Stat cards**: May align with AntD Statistic component (check if DS Stat wrapper covers this)

### Steps

- [ ] Create `src/app/dashboard.module.css` for the complex layout
- [ ] Migrate `DashboardClient.tsx` — replace all 107 className usages
- [ ] Convert two-column grid to Row/Col
- [ ] Keep SVG chart internals, replace Tailwind on containers
- [ ] Replace ChevronDown/ChevronRight with AntD icons
- [ ] Migrate `page.tsx` if it has any Tailwind (likely minimal)
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate dashboard page`

---

## Task 15: Calendar

The calendar is the most icon-heavy page (35+ Lucide icons) and has complex custom rendering (appointment positioning, time grid, drag interactions). This is the highest-risk migration.

**Files:**
- `src/app/calendar/page.tsx` (server component)
- `src/app/calendar/CalendarView.tsx` (uses 25+ distinct Lucide icons, complex Tailwind layout)

### Icon replacements needed (from CalendarView.tsx)

| Lucide | AntD |
|---|---|
| ChevronLeft | LeftOutlined |
| ChevronRight | RightOutlined |
| ChevronDown | DownOutlined |
| Filter | FilterOutlined |
| Settings | SettingOutlined |
| CalendarDays | CalendarOutlined |
| LayoutGrid | AppstoreOutlined |
| Lightbulb | BulbOutlined |
| Sparkles | ThunderboltOutlined |
| X | CloseOutlined |
| Clock | ClockCircleOutlined |
| User | UserOutlined |
| Users | TeamOutlined |
| MapPin | EnvironmentOutlined |
| FileText | FileTextOutlined |
| Calendar | CalendarOutlined |
| Video | VideoCameraOutlined |
| Monitor | DesktopOutlined |
| UserPlus | UserAddOutlined |
| Ban | StopOutlined |
| Mail | MailOutlined |
| Repeat | SyncOutlined |
| History | HistoryOutlined |
| AlertTriangle | WarningOutlined |
| Info | InfoCircleOutlined |
| ArrowUp | ArrowUpOutlined |
| ClipboardList | SnippetsOutlined |
| Search | SearchOutlined |
| Check | CheckOutlined |

### Key migration patterns

- **Time grid**: Custom CSS grid for time slots — replace Tailwind grid utilities with CSS Module. This is precision layout that needs careful handling.
- **Appointment positioning**: Uses calculated `top`/`height` inline styles — these stay as-is. Replace surrounding Tailwind classes.
- **View toggle (Day/Week/Month)**: Replace icon-based toggle with AntD Segmented or Radio.Group if appropriate, otherwise just swap icons.
- **Side panel**: Appointment detail side panel — migrate layout + icons.

### Steps

- [ ] Create `src/app/calendar/calendar.module.css` for the time grid and custom layout
- [ ] Replace all 29 Lucide icon imports with @ant-design/icons equivalents
- [ ] Migrate time grid layout from Tailwind to CSS Module (preserve exact positioning)
- [ ] Migrate appointment cards from Tailwind to CSS Module + AntD tokens
- [ ] Migrate toolbar/header from Tailwind to Flex
- [ ] Migrate side panel layout
- [ ] Run `npx tsc --noEmit`
- [ ] Visual smoke test — calendar rendering is fragile, verify layout hasn't shifted
- [ ] Commit: `feat(migration): migrate calendar page`

---

## Task 16: Data Import Wizard

Multi-step modal flow with multiple DataTable instances.

**Files:**
- `src/app/settings/data-import/page.tsx` (uses Upload, MessageCircle, BookOpen, FileSpreadsheet, Database, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, FileText — 10 icons)
- `src/app/settings/data-import/csv/page.tsx` (uses Upload, FileSpreadsheet, CheckCircle2)
- `src/app/settings/data-export/page.tsx`

### Key migration patterns

- **Multi-step wizard**: Replace step indicators with AntD Steps component if appropriate, or CSS Module
- **File upload area**: The DS FileUpload component handles this — just ensure the page layout around it migrates
- **Multiple DataTable instances**: Each preview table needs column definitions
- **10 distinct icons**: Bulk replacement using icon mapping

### Steps

- [ ] Create CSS Modules for data-import pages
- [ ] Migrate `data-import/page.tsx` — 10 icon replacements, wizard layout, DataTable column defs
- [ ] Migrate `data-import/csv/page.tsx` — 3 icon replacements, file upload layout
- [ ] Migrate `data-export/page.tsx` — layout
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate data import/export pages`

---

## Task 17: Root Layout, Shared Components, and Remaining Pages

Migrate the root layout (already partially done in Phase 1 with ThemeProvider), shared non-DS components, and any remaining pages.

**Files:**
- `src/app/layout.tsx` (root layout — add AntdRegistry if not already present from Phase 1)
- `src/app/login/page.tsx` (uses ChevronRight, EyeOff)
- `src/app/login/layout.tsx`
- `src/app/online-booking/page.tsx` (uses 11 Lucide icons)
- `src/app/patient-form/[id]/view/page.tsx` (uses ChevronDown, Mail)
- `src/components/TopNav.tsx` (shared nav wrapper — uses Tailwind)
- `src/components/AiChatPanel.tsx` (uses Lucide icons)
- `src/components/ReportsSidebar.tsx` (migrated with reports in Task 13)
- `src/components/MapView.tsx`

### Steps

- [ ] Verify `layout.tsx` has AntdRegistry + ThemeProvider from Phase 1; remove Tailwind className from `<body>`
- [ ] Migrate `src/components/TopNav.tsx` — Tailwind to CSS Module, replace Lucide icons
- [ ] Migrate `src/components/AiChatPanel.tsx` — replace Lucide icons
- [ ] Migrate `src/components/MapView.tsx` — replace any Tailwind (Leaflet styles stay)
- [ ] Migrate `login/page.tsx` — icon replacement, form layout
- [ ] Migrate `online-booking/page.tsx` — 11 icon replacements, multi-step booking flow layout
- [ ] Migrate `patient-form/[id]/view/page.tsx` — icon replacement, layout
- [ ] Run `npx tsc --noEmit`
- [ ] Commit: `feat(migration): migrate root layout, shared components, and remaining pages`

---

## Task 18: Build Verification

Full type-check and build to catch any remaining issues.

**Files:** None to modify (fix-up task).

### Steps

- [ ] Run `npx tsc --noEmit` — fix any TypeScript errors
- [ ] Run `npx next build` — fix any build errors
- [ ] Search for remaining `lucide-react` imports: `grep -r "lucide-react" src/app/` — must return zero results
- [ ] Search for remaining Tailwind className in pages: `grep -r "className=" src/app/` — review each hit:
  - CSS Module class references (`className={styles.foo}`) are OK
  - Inline `className="..."` with Tailwind utilities must be eliminated
  - `className` props passed to DS components (if the component accepts them) should be reviewed
- [ ] Verify no `usePagination` imports remain in page code (AntD Table handles pagination)
- [ ] Fix all issues found
- [ ] Commit: `fix(migration): resolve build errors from Phase 3 page migration`

---

## Task 19: Visual Smoke Test

Navigate every major route and verify rendering matches pre-migration state.

**Files:** None to modify (verification task).

### Routes to verify

| Route | Key things to check |
|---|---|
| `/` (Dashboard) | Two-column layout, chart bars, expandable messages |
| `/calendar` | Time grid alignment, appointment card positioning, icon rendering |
| `/clients` | Table rendering, search, pagination |
| `/clients/[id]` | Sidebar layout, tab navigation, all 12 sub-pages |
| `/contacts` | Responsive column hiding, clickable rows |
| `/products` | Expandable rows, nested variant tables |
| `/invoices` | List table, invoice detail layout, batch invoice flow |
| `/payments` | Expandable rows, new payment form |
| `/waitlist` | Table with tags, avatars, date filtering |
| `/notes/new` | Template selector layout |
| `/notes/[id]` | Note view, toolbar, send modal |
| `/reports` | Hub page, performance charts, all report sub-pages |
| `/settings` | Hub page, all settings sub-pages (spot-check 5-6) |
| `/online-booking` | Multi-step booking flow |
| `/login` | Form layout, eye icon toggle |

### Steps

- [ ] Open each route listed above in the browser
- [ ] Verify layout renders correctly (no broken layouts, missing spacing, collapsed columns)
- [ ] Verify icons render (no missing icon placeholders)
- [ ] Verify tables render with data (columns aligned, pagination working)
- [ ] Verify modals open/close correctly
- [ ] Verify responsive behaviour on calendar and contacts pages
- [ ] Document any visual regressions found
- [ ] Fix regressions and re-verify
- [ ] Commit any fixes: `fix(migration): resolve visual regressions from Phase 3 smoke test`

---

## Phase 3 Complete Checklist

- [ ] **Task 1:** Icon mapping utility created and exported
- [ ] **Task 2:** CSS Module template created
- [ ] **Task 3:** Template page (cancellation-reasons) fully migrated as reference
- [ ] **Task 4:** SettingsListPage-pattern pages migrated (2 pages)
- [ ] **Task 5:** All remaining settings pages migrated (36 files across 4 sub-batches)
- [ ] **Task 6:** Client list and detail pages migrated (20 files)
- [ ] **Task 7:** Contacts pages migrated (3 files)
- [ ] **Task 8:** Products pages migrated (2 files)
- [ ] **Task 9:** Invoice pages migrated (9 files)
- [ ] **Task 10:** Payments pages migrated (2 files)
- [ ] **Task 11:** Waitlist pages migrated (2 files)
- [ ] **Task 12:** Notes pages migrated (5 files)
- [ ] **Task 13:** Reports pages migrated (18 files)
- [ ] **Task 14:** Dashboard migrated (2 files)
- [ ] **Task 15:** Calendar migrated (2 files)
- [ ] **Task 16:** Data import/export pages migrated (3 files)
- [ ] **Task 17:** Root layout, shared components, and remaining pages migrated (8 files)
- [ ] **Task 18:** `npx tsc --noEmit` passes, `npx next build` passes, zero `lucide-react` imports in `src/app/`, zero Tailwind className in pages
- [ ] **Task 19:** Visual smoke test passed on all major routes
- [ ] **All commits pushed** to `antd-migration` branch
- [ ] **Ready for Phase 4:** Tailwind removal, dependency cleanup, final Storybook verification
