# DS Component Catalog

Quick reference for all 50+ design system components. Browse live in Storybook (`npm run storybook`).

## Page Templates

| Component | Use for |
|---|---|
| `ListPage` | List pages with PageHeader, SearchBar, filters, Card-wrapped table + pagination |
| `DetailPage` | Detail pages with title/subtitle header, tab bar, optional sidebar |
| `FormPage` | Form pages with Navbar back-nav, centered content area, action buttons |
| `SettingsListPage` | Generic CRUD settings page with modal form, search, and pagination |

## Layout

| Component | Use for |
|---|---|
| `Card` | Bordered content containers. `tint`: `default \| subtle \| muted` (background fill). `variant`: `default \| dashed` (border style — dashed = 2px dashed for upload zones). `interactive`: renders as `<button>` with cursor+hover for clickable card UIs. `description`: subtitle text rendered below title (Section-style header). Also: title, headerBar, padding, shadow. |
| `FeatureCard` | Tinted/colored card containers — `tone: primary \| success \| neutral \| inverted`. Use for account balance, summary stats, or any card on a colored background. |
| `Grid` | 1-4 column responsive grid with gap sizing |
| `Divider` | Separator with `orientation` (horizontal/vertical), `variant` (default/subtle/primary), `spacing` (none/xs/sm/md/lg) |
| `Collapse` | **Deprecated** — use `Accordion`. Kept as a single-panel alias during Wave 4 migration. |
| `Accordion` | Vertical stack of expandable panels for forms, FAQs, disclosures. `items`: `{ id, title, description, icon, children, defaultOpen }`. `type`: `single`/`multiple` (default). `tone`: `default`/`subtle` (borderless for use inside a Card). `divider` (hairline rows). Controlled via `value`/`onValueChange`. |
| `PageHeader` | Page title + action buttons (prefer ListPage/DetailPage templates) |

## Actions

| Component | Use for |
|---|---|
| `Button` | All interactive buttons. `variant`: primary/secondary/danger/ghost/link/icon/toolbar. `size`: sm/md/lg. `shape`: default/pill/circle (pill = borderRadius 9999 for filter chips; circle = borderRadius 50% for icon FABs). `round`: true for circle FAB buttons (alias for shape="circle"). `iconOnly`: true for icon-only buttons — centres icon, no text padding (38×38 md, 29×29 sm). |

## Forms

| Component | Use for |
|---|---|
| `FormField` | Label + error + hint + required wrapper for any input |
| `FormInput` | Labeled text inputs with error states |
| `FormSelect` | Labeled select dropdowns (supports searchable, placeholder) |
| `FormTextarea` | Labeled textarea matching FormInput styling |
| `DatePicker` | Single-date input with calendar popover. Emits native `Date` at boundary (AntD's dayjs is hidden). Props: `label`, `value`, `onChange`, `minDate`, `maxDate`, `disabledDates`, `format`, `clearable`, `size` (sm/md/lg), `error`, `hint`. Locale locked to en-AU (DD/MM/YYYY). For date ranges use `DateRangeFilter`; for date+time pair with `TimePicker`. |
| `SegmentedControl` | 2-4 mutually-exclusive labelled options with a sliding highlight. Use for view switchers (Week/Day/Month), filter modes (All/Active/Archived), tone toggles. Props: `options`, `value`, `onChange`, `size` (sm/md/lg), `fullWidth`, `disabled`, required `aria-label`. Distinct from `Tab` (routes content) and `Filter` (icon-only toggle group). |
| `NumberInput` | Typed numeric input with stepper, clamping, and format-aware display. `format`: `integer` / `decimal` / `currency` (AUD `$1,234.50`) / `percent` (`12.5%`). Emits `number \| null` (never strings). Props: `min`, `max`, `step`, `precision`, `currency`, `showSteppers`, `prefix`, `suffix`, `size` (sm/md/lg), `error`, `hint`. Replaces `<FormInput type="number">` + manual `parseFloat()`. |
| `PhoneInput` | Formatted phone input with country-code awareness and E.164 normalisation. Always emits E.164 (`+61412345678`) for storage; displays country-appropriate format. Props: `defaultCountry` (ISO alpha-2, default `AU`), `value`, `onChange`, `size` (sm/md/lg), `error`, `hint`, `placeholder`. Wraps `react-phone-number-input`. |
| `SignaturePad` | Handwritten signature capture for invoice sign-off, consent forms, practitioner note sign-off. Emits base64 data URL on every stroke (`null` when empty). `width`/`height` (default 360×120), `penColor`, `background` (transparent default; white for PDF embedding), `format` (png/svg). Accompany with a typed-signature fallback for keyboard-only users — the canvas itself is not screen-reader accessible. Wraps `signature_pad`. |
| `TimePicker` | Time-of-day input with popover for appointments, clinic hours, reminders. Always emits canonical `HH:mm` 24h strings at the boundary; `format` prop (`12h` default / `24h`) controls display. `step` constrains to 5/10/15/30/60-minute increments. `minTime`/`maxTime` clamp selectable range. Seconds excluded. Pair with `DatePicker` for full datetime. |
| `FormColorPicker` | Color picker with native and swatches variants |
| `Toggle` | Boolean on/off switches |
| `Checkbox` | Styled checkbox with optional label |
| `RadioGroup` | Labeled radio button group |
| `FileUpload` | Dashed-border upload drop zone |
| `RichTextEditor` | Rich text editor with optional template variables |

## Data Display

| Component | Use for |
|---|---|
| `DataTable` / `Th` / `Td` / `Tr` | Tables with sortable/filterable headers, link cells, action cells |
| `Pagination` | Table pagination footer with page size dropdown |
| `Badge` | Status pills, tags, filter chips (shape: rounded/pill; size: sm/md/lg; onRemove for closable) |
| `Tag` | User-generated colour-coded metadata label (VIP, NDIS, service type). Distinct from `Badge` (system status) by intent and defaults — solid-filled with a user-configured `color`, contrast-aware text colour picked automatically. Props: `color`, `icon`, `onRemove`, `size` (sm/md/lg), `interactive` (renders as button), `selected`. |
| `AppointmentCard` | Splose-specific composition for a single calendar appointment. Renders time + patient + service + optional practitioner/location with status-driven tone fallback (`scheduled`/`confirmed`/`completed`/`no-show`/`cancelled`). Densities: `compact` (44px, grid), `standard` (56px, list), `expanded` (78px, drawer). `tone` overrides status colour (practitioner assignment). `onClick` toggles `<button>` semantics + focus ring. |
| `PatientAvatar` | Splose-specific patient avatar. Deterministic hash (FNV-1a over `patient.id`) picks one of 7 palette colours so the same patient always gets the same hue. Sizes xs/sm/md(36)/lg/xl. Uses `photoUrl` when present with initials fallback on image error. `status="archived"` desaturates; `"deceased"` shows a corner marker. Use the generic `Avatar` for non-patient cases (users, reviewers, orgs). |
| `PaymentStatusBadge` | Purpose-built badge for invoice/payment status — `paid`/`outstanding`/`overdue`/`partial`/`refunded`/`failed`/`draft`/`void`. Encodes the Splose colour + label mapping; always `solid` by default. Thin wrapper over `Badge` for intent clarity at every invoice/payment render site. Helper `paymentStatusToVariant(status)` exposes `{variant, label}` for non-JSX contexts. |
| `Sparkline` | Glanceable inline trend chart (hand-rolled SVG, no dep). `data: number[]`, default 96×24. Shapes: `line`/`area`/`bar`. Tone auto-infers from series direction (≥5% up→success, ≥5% down→danger, else neutral) — pass `tone` to override. `markLast` highlights the last point; `showDots` highlights all points; `baseline` draws a dashed reference line. Required `aria-label` summary. Use beside a Stat or in a DataTable trend cell. |
| `Stat` | Metric value + label display |
| `Text` | Semantic typography. Variants: `page-title` (30px/700/Sprig Sans/green — detail page headers), `heading/xl` (28px/700), `display/lg\|md\|sm\|xs`, `heading/lg\|md\|sm`, `body/lg\|md\|sm\|md-strong\|lg-strong`, `label/lg\|md\|sm`, `caption/md\|sm`, `metric/lg\|md`. `weight="regular\|medium\|bold"` overrides variant default. `color` accepts preset names (`text`, `secondary`, `tertiary`, `primary`, `danger`, `warning`, `success`, `inverted`) or a Tailwind/CSS class. Use `color="inverted"` for white text on dark/colored backgrounds. |
| `Avatar` | Colored circles with initials (sm/md/lg/xl) |
| `Icon` | Wrapper for AntD icon components with `size: xs/sm/md/lg/xl/2xl/3xl/4xl/5xl` (10–40px) and `tone: default/secondary/tertiary/primary/success/warning/danger/inverted`. Pass `style={{ color: 'inherit' }}` inside primary Buttons to preserve white text. |
| `ColorDot` | Colored indicator (xs/sm/md/lg/xl). Props: `shape: circle\|rect` (default circle), `interactive: boolean` (renders as `<button>`), `selected: boolean` (selection ring), `onClick`, `rectWidth` (default 80). Accepts semantic color tokens (green/red/yellow/blue/gray/purple/orange) or raw CSS color. Optional `label` prop renders dot + text inline. |
| `ProgressBar` | Horizontal progress bar. `value` (0–100), `tone`: `default/success/warning/danger`, `size`: `sm/md/lg` (4/6/8px height), optional `width` prop for fixed-width bars. |
| `List` | Label-value detail rows rendering `<dl>/<dt>/<dd>` by default. `layout`: `horizontal` (default — label beside value, fixed-width label column) or `stacked` (label above value). Per-item `hint` (HintIcon) + `editable`/`onEdit` (pencil button). `divider` (hairline rows), `tight` (halves padding), `semantic` (`dl` default, `div` opt-out for stat/glossary use). Empty values render `—` placeholder. |
| `HintIcon` | Info tooltip trigger. `tone`: `default \| inverted` (inverted = white-on-dark, for use inside FeatureCard or coloured backgrounds). `size`: `sm \| md \| lg` (12/14/20px, default md). |
| `EmailPreview` | Email preview modal with subject, recipient, body, sender |

## Navigation

| Component | Use for |
|---|---|
| `TopNav` | App navigation bar |
| `SideNav` | Grouped sidebar navigation with active state |
| `Tab` | Underline-style tab bars with active state, supports `href` for link tabs |
| `Navbar` | Document headers with back nav + actions (prefer FormPage template) |
| `SearchBar` | Search input + button combos (prefer ListPage template) |
| `Breadcrumbs` | Horizontal path indicator for deep hierarchies, nested settings, batch flows. Items: `{ label, href?, icon? }`. Last item renders with `aria-current="page"`. Custom `separator` (chevron Icon default); `maxItems` collapses middle entries into an overflow dropdown. Use inside or above `PageHeader`/`Navbar`. |
| `Stepper` | Numbered progress indicator for wizards. Two API shapes: per-item `status` (`pending`/`current`/`complete`/`error`) OR a single `current` id (auto-marks earlier=complete, later=pending). `orientation`: `horizontal` (default) / `vertical` (reveals per-item descriptions). `size` sm/md/lg. Per-item `onClick` enables back-navigation. |

## Overlays

| Component | Use for |
|---|---|
| `Drawer` | Edge-anchored panel overlay for secondary surfaces (appointment details, filters, help). Sides: left/right/top/bottom (default right). Size tokens: sm=320, md=400, lg=560, xl=720 (or custom px). Props: `open`, `onClose`, `title`, `description`, `headerBar`, `footer` (sticky action row), `dismissOnOverlayClick`, `dismissOnEsc`. Use for contextual side panels; use `Modal` for blocking dialogs. |
| `alertDialog.confirm` | Imperative blocking confirmation. `await alertDialog.confirm({ title, description, confirmLabel, cancelLabel, tone })` resolves `true` (confirmed) or `false` (cancel/escape/overlay). Tones: `primary` / `danger` / `warning`. Cancel autofocus by default. Use for destructive actions; use `Modal` for arbitrary content, `toast` for non-blocking confirmations. |
| `CommandPalette` | Cmd+K / Ctrl+K launcher. Wraps `cmdk` with DS tokens. `commands`: flat array `{ id, label, group?, icon?, shortcut?, keywords?, onSelect }`. `open`/`onOpenChange` controlled; `triggerOnShortcut` (default `true`) binds Cmd/Ctrl+K globally. Group header groups rows under heading. Shortcut kbd chips render right-aligned. |
| `ContextMenu` | Right-click (or long-press) menu for contextual actions on calendar slots, DataTable rows, notes. Wraps AntD Dropdown with `trigger={['contextMenu']}`. Items: `{ id, label, icon?, shortcut?, tone?, disabled?, divider?, submenu?, onSelect }`. Suppresses the browser's native context menu by default; pass `preserveBrowserMenu` on rich-text areas to keep spell-check. Always keep a visible affordance for the same actions (right-click is a power-user alternative). |
| `Modal` | Dialog overlays with backdrop |
| `Dropdown` | Action menus, context menus |
| `AsyncSelect` | Searchable dropdown with async data fetching |
| `ReorderModal` | Drag-and-drop reorder modal |
| `Tooltip` | Hover/focus label overlay for icon-only buttons, truncated text, and abbreviations. Props: `content`, `side` (top/right/bottom/left), `align` (start/center/end), `delay` (ms), `disabled`. Wraps AntD Tooltip. For long-form help content use `HintIcon` instead. |
| `HoverCard` | Richer-than-Tooltip hover preview for patients, appointments, linked records. Hover-only (never fires on focus — content is supplementary by design). Props: `content`, `side`, `align`, `openDelay` (400ms default), `closeDelay` (200ms), `disabled`. 320px max-width card with 8px radius + 8-24px shadow. Wraps AntD Popover. Content must be supplementary — never hide critical info here (touch + keyboard users won't see it). |

## Feedback

| Component | Use for |
|---|---|
| `Alert` | Info/warning/success/error banners |
| `Spinner` | Loading indicator (sm/md/lg) |
| `EmptyState` | "No data" placeholders with icon + CTA |
| `Skeleton` | Loading placeholder with shimmer — shapes `text`/`rect`/`circle`, `lines` for multi-line text (ragged last bar), `animated` for shimmer toggle. Subcomponents: `Skeleton.Text`, `Skeleton.Avatar`, `Skeleton.Block`, `Skeleton.Loading` (conditional swap). Respects `prefers-reduced-motion`. |
| `Toast` / `toast` | Imperative, auto-dismissing notification pinned to bottom-right for success/error confirmations. Call `toast.success/error/warning/info/loading/promise/dismiss` from any client component. Wraps sonner. `<Toaster />` is mounted once in `src/app/layout.tsx`; consumers never import sonner directly. |

## Filters

| Component | Use for |
|---|---|
| `DateRangeFilter` | Date range picker for reports |
| `Filter` | Segmented control / icon toggle groups |

## Utilities

| Utility | Import | Use for |
|---|---|---|
| `useFormModal` | `@/hooks/useFormModal` | Modal state management (open/close/edit/create) |
| `STANDARD_SETTINGS` / `SIMPLE_CRUD` / `USER_ADMIN` | `@/lib/dropdown-presets` | Standard dropdown action items |
| `formatTimestamp` | `@/lib/format` | Australian locale date formatting |
| `getBadgeVariant` | `@/lib/badge-variants` | Type-to-badge-variant mapping |
| `statusVariant` | `@/components/ds` | Status string → Badge variant mapping |

## DS Compliance Grading

| Grade | Criteria | Target |
|---|---|---|
| **A** | ≤10 inline `style={{}}` props | All new/migrated pages |
| **B** | 11-30 inline styles | Acceptable for complex pages |
| **C** | 31+ inline styles | Needs migration work |

Current averages (2026-04-02 post-Phase 3):
- Total inline `style={{}}` in src/app/: ~2,002
- Highest: invoices/[id] (101), ClientDetailClient (91), DashboardClient (82)
- Templates adopted: ListPage (14 pages), FormPage (6 pages)
