# DS Component Catalog

Quick reference for all 40+ design system components. Browse live in Storybook (`npm run storybook`).

## Core Components

| Component | DaisyUI name | Use for |
|---|---|---|
| `Button` | `button` | All buttons (primary/secondary/danger/ghost/link/icon/toolbar, sm/md/lg) |
| `PageHeader` | — | Page title + action buttons |
| `SearchBar` | — | Search input + button combos |
| `DataTable` / `Th` / `Td` / `Tr` | `table` | Tables with sortable/filterable headers, link cells, action cells |
| `Pagination` | — | Table pagination footer with page size dropdown |
| `Badge` | `badge` | Status pills and tags (green/red/yellow/blue/gray/purple/orange) |
| `FormInput` | `input` | Labeled text inputs with error states |
| `FormSelect` | `select` | Labeled select dropdowns |
| `FormTextarea` | — | Labeled textarea matching FormInput styling |
| `Text` | — | Semantic typography (`variant="display/lg"`, `heading/md`, `body/sm`, etc.) |
| `Tab` | `tab` | Underline-style tab bars with active state, supports `href` for link tabs |
| `Toggle` | `toggle` | Boolean on/off switches |
| `Modal` | `modal` | Dialog overlays with backdrop |
| `Avatar` | `avatar` | Colored circles with initials (sm/md/lg/xl) |
| `Dropdown` | `dropdown` + `menu` | Action menus, context menus |
| `EmptyState` | — | "No data" placeholders with icon + CTA |
| `List` | `list` | Label-value detail rows |
| `Card` | `card` | Bordered content containers |
| `Select` | `select` (enhanced) | Searchable dropdown with filtering |
| `AsyncSelect` | — | Searchable dropdown with async data fetching |
| `Navbar` | `navbar` | Document headers with back nav + actions |
| `DateRangeFilter` | — | Date range picker for reports |
| `Filter` | `filter` | Segmented control / icon toggle groups |
| `Collapse` | `collapse` | Expandable sections with chevron |
| `Status` | `status` | Small colored status indicator dots |
| `Chip` | — | Interactive filter pills with optional remove (6 colors) |
| `Alert` | — | Info/warning/success/error banners |
| `Spinner` | — | Loading indicator (sm/md/lg) |
| `HintIcon` | — | Info tooltip trigger |
| `FileUpload` | — | Dashed-border upload drop zone |
| `Stat` | — | Metric value + label display |
| `IconText` | — | Icon + text row for contact info |
| `Checkbox` | — | Styled checkbox with optional label |
| `RadioGroup` | — | Labeled radio button group |
| `ColorDot` | — | Colored circle indicator (xs/sm/md/lg) |
| `OnOffBadge` | — | Boolean On/Off display with configurable labels |
| `FormColorPicker` | — | Color picker with native and swatches variants |
| `TopNav` | `navbar` | App navigation bar |
| `SideNav` | — | Grouped sidebar navigation with active state |
| `SettingsListPage` | — | Generic CRUD settings page template |

## Utilities

| Utility | Import | Use for |
|---|---|---|
| `useFormModal` | `@/hooks/useFormModal` | Modal state management (open/close/edit/create) |
| `STANDARD_SETTINGS` / `SIMPLE_CRUD` / `USER_ADMIN` | `@/lib/dropdown-presets` | Standard dropdown action items |
| `formatTimestamp` | `@/lib/format` | Australian locale date formatting |
| `getBadgeVariant` | `@/lib/badge-variants` | Type-to-badge-variant mapping |
