# Ant Design Migration — Design Spec

**Date:** 2026-03-30
**Status:** Draft
**Goal:** Replace the custom Tailwind-based design system with Ant Design 5.x wrappers, maintaining visual identity. Zero Tailwind remaining in the codebase.

---

## Motivation

- Production Splose already uses Ant Design — this prototype should align with the same component foundation
- Engineers copy-paste Tailwind classes between files instead of using consistent component APIs
- A wrapper layer enforces one way to build UI: import from `@/components/ds`, never from `antd` directly

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Migration approach | Wrapper layer (Approach A) | Single controlled API surface; kills copy-paste; swap internals without touching consumers |
| Ant Design version | 5.x (latest) | Matches production; CSS-in-JS token system |
| DataTable solution | Ant Design Table (built-in) | Zero extra deps, column definition system, covers 80% of patterns natively |
| Tailwind | Remove entirely | No utility classes, no PostCSS — all styling via AntD tokens + CSS Modules for edge cases |
| Typography | Keep Sprig Sans (display) + Inter (body) | Configured via AntD fontFamily token (Inter) + custom Text wrapper (Sprig Sans) |
| Icons | @ant-design/icons | Replace Lucide React; align with AntD ecosystem |
| Storybook | Rebuild all 43 stories | Document every migrated component |
| Portable components | Drop | AntD components are framework-agnostic; Storybook adapter handles Next.js deps |
| Utilities | Replace with AntD equivalents | useFormModal → Form + Modal; usePagination → Table pagination; keep formatTimestamp, getBadgeVariant |
| Branching | tailwind-archive (frozen) + antd-migration (work branch) | Safety net; phase-by-phase merges to main |

## Component Mapping

### Direct Wrappers (~25 components)

Thin wrappers around Ant Design equivalents. Engineers import from `@/components/ds` — the wrapper applies Splose-specific defaults.

| Current DS | Ant Design 5.x | Notes |
|-----------|----------------|-------|
| Alert | Alert | Map variants to AntD types |
| Avatar | Avatar | Direct match |
| Badge | Tag | AntD Tag is closer to current Badge (colored labels) |
| Button | Button | Map 7 variants to AntD type/danger/ghost props |
| Card | Card | Map headerBar → title + extra |
| Checkbox | Checkbox | Direct match |
| Collapse | Collapse | Direct match |
| DataTable | Table | Heaviest migration — sort, filter, expand, responsive hiding. Column definition system replaces inline JSX .map() loops |
| DateRangeFilter | DatePicker.RangePicker | Wrap with filter presets |
| Dropdown | Dropdown | Map items array to AntD menu format |
| FormInput | Form.Item + Input | Label + error via Form.Item |
| FormSelect | Form.Item + Select | Same pattern |
| FormTextarea | Form.Item + Input.TextArea | Same pattern |
| AsyncSelect | Select + async search | AntD Select has built-in async/search |
| Filter | Select (tag mode) | Filter chip pattern |
| List | List | Direct match |
| Modal | Modal | Map maxWidth sizes to AntD width |
| Pagination | Pagination | Direct match, drop usePagination hook |
| RadioGroup | Radio.Group | Direct match |
| SearchBar | Input.Search | Direct match |
| Select | Select | Direct match |
| Spinner | Spin | Direct match |
| Stat | Statistic | Direct match |
| Tab | Tabs | Map TabItem[] to AntD items |
| Toggle | Switch | Direct match |

### Custom Components (~18 components)

No Ant Design equivalent — built as standalone React components using AntD design tokens and CSS Modules for visual consistency.

| Component | Why Custom |
|-----------|-----------|
| Chip | Splose-specific styled tag variant |
| ColorDot | Tiny colored circle indicator — no AntD match |
| EmailPreview | Domain-specific email rendering |
| EmptyState | AntD Empty is simpler — keep custom for Splose layout |
| FileUpload | Splose-specific upload UX |
| FormColorPicker | Evaluate if AntD ColorPicker wrapper suffices during implementation |
| HintIcon | Tooltip + icon combo — could wrap AntD Tooltip |
| IconText | Simple icon + text layout helper |
| Navbar | Splose-specific horizontal navigation |
| OnOffBadge | On/off status indicator — domain-specific |
| PageHeader | Splose-specific page header layout |
| RichTextEditor | Third-party editor — independent of DS library |
| ReorderModal | Drag-and-drop reorder — uses @dnd-kit + AntD Modal wrapper |
| SettingsListPage | Page-level layout template |
| SideNav | Evaluate if AntD Menu (vertical) wrapper suffices |
| Status | Colored status indicator — domain-specific |
| Text | Custom typography scale (Sprig Sans + Inter) |
| TopNav | Responsive nav with "More" menu — Splose-specific |

### Utilities

| Current | Replacement | Notes |
|---------|-------------|-------|
| useFormModal | Form.useForm() + Modal | AntD's standard pattern |
| usePagination | Table built-in pagination | AntD Table has pagination prop |
| formatTimestamp | Keep (date-fns) | Not a UI concern |
| getBadgeVariant | Keep (maps status → color) | Business logic |
| Presets (STANDARD_SETTINGS etc.) | Keep / refactor | Page-level patterns — may simplify with AntD |

## Theming Architecture

### Token Mapping

Current CSS variables map to Ant Design 5.x theme tokens:

**Colors:**

| CSS Variable | AntD Token | Value |
|-------------|-----------|-------|
| --color-primary | colorPrimary | #8250ff |
| --color-primary-dark | colorPrimaryHover | #6d3dd4 |
| --color-primary-light | colorPrimaryBg | #a78bfa |
| --color-success | colorSuccess | #22c55e |
| --color-warning | colorWarning | #f59e0b |
| --color-danger | colorError | #ef4444 |
| --color-bg | colorBgContainer | #ffffff |
| --color-border | colorBorder | #e8e8e8 |
| --color-text | colorText | #414549 |
| --color-text-secondary | colorTextSecondary | #6b7280 |
| --color-surface-header | colorFillAlter | #f3f5f7 |

**Typography:**

| CSS Variable | AntD Token | Value |
|-------------|-----------|-------|
| --font-sans (Inter) | fontFamily | 'Inter', sans-serif |
| --font-display (Sprig Sans) | Custom (Text wrapper) | Applied via CSS Module on display variants only |
| --text-base (14px) | fontSize | 14 |
| --text-sm (12px) | fontSizeSM | 12 |
| --text-lg (18px) | fontSizeLG | 18 |
| --text-xl (24px) | fontSizeXL | 24 |
| --text-2xl (30px) | fontSizeHeading1 | 30 |

**Spacing & Shape:**

| Current | AntD Token | Value |
|---------|-----------|-------|
| rounded-lg (8px) | borderRadius | 8 |
| Tailwind spacing scale | AntD Flex/Space + tokens | 4px base unit |

### Layout Without Tailwind

| Tailwind | Replacement | Notes |
|----------|-------------|-------|
| flex, flex-col, items-center | AntD `Flex` component | direction, align, justify props |
| gap-4, gap-6 | AntD `Flex gap={16}` or `Space` | Numeric pixel values |
| grid, grid-cols-2 | AntD `Row` + `Col` | 24-column grid system |
| p-4, px-6, mt-8 | CSS Modules or inline style | Minimal — mostly inside components |
| w-full, max-w-screen-xl | AntD `Layout` component | Header, Sider, Content, Footer |
| hidden sm:block | AntD Grid responsive props | `<Col xs={0} sm={12}>` |
| overflow-x-auto | AntD Table `scroll={{ x: true }}` | Built into Table component |

For rare edge cases where AntD layout components don't fit, use CSS Modules (co-located .module.css files).

### Sprig Sans Handling

AntD's `fontFamily` token is set to Inter (the 95% case). The custom `Text` component applies Sprig Sans for display variants (display/lg, display/md, display/sm) via a CSS Module. This is the one place where a font-family override exists outside AntD's token system.

## Project Architecture

### Directory Structure

```
src/
├── components/
│   └── ds/                          ← Single import point (unchanged)
│       ├── index.ts                 ← Barrel export
│       ├── theme.ts                 ← NEW: AntD ConfigProvider theme config
│       ├── ThemeProvider.tsx         ← NEW: Wraps app in ConfigProvider
│       │
│       ├── Alert.tsx                ← Wrapper: AntD Alert + Splose defaults
│       ├── Button.tsx               ← Wrapper: AntD Button + variant mapping
│       ├── DataTable.tsx            ← Wrapper: AntD Table + column defs
│       ├── ...                      ← ~22 more AntD wrappers
│       │
│       ├── ColorDot.tsx             ← Custom: standalone, uses AntD tokens
│       ├── Text.tsx                 ← Custom: Sprig Sans + Inter type scale
│       ├── TopNav.tsx               ← Custom: responsive nav
│       ├── ...                      ← ~15 more custom components
│       │
│       └── stories/                 ← Storybook stories (rebuilt)
│
├── app/
│   ├── layout.tsx                   ← Wraps children in AntdRegistry + ThemeProvider
│   ├── globals.css                  ← REDUCED: @font-face declarations only
│   └── ...pages                     ← Import from @/components/ds only
│
└── styles/                          ← NEW (if needed): CSS Modules for edge cases
```

### Import Rules (Enforced by ESLint)

| Rule | Description |
|------|-------------|
| **Allowed** | Import from `@/components/ds` in page/feature code |
| **Banned** | Direct import from `antd` in page/feature code |
| **Banned** | Direct import from `@ant-design/icons` in page/feature code |
| **Allowed** | Direct `antd` imports inside `ds/` components only |
| **Exception** | AntD layout components (Flex, Row, Col, Space) allowed in pages — wrapping them adds no value |

### Data Flow

```
theme.ts (Splose token overrides)
  → ThemeProvider.tsx (ConfigProvider wrapper)
    → layout.tsx (AntdRegistry + ThemeProvider)
      → DS wrappers (import from antd, apply Splose defaults)
        → Pages (import from @/components/ds)
```

### SSR: Next.js App Router + AntD CSS-in-JS

Ant Design 5.x uses CSS-in-JS which needs client-side style injection. `@ant-design/nextjs-registry` extracts styles at build time for SSR, preventing FOUC. Wrap the app in `<AntdRegistry>` in layout.tsx alongside ThemeProvider.

## Migration Phases

### Phase 1: Foundation

- Install `antd`, `@ant-design/icons`, `@ant-design/nextjs-registry`
- Create `theme.ts` with all Splose token overrides
- Create `ThemeProvider.tsx` wrapping ConfigProvider
- Wire ThemeProvider + AntdRegistry into `layout.tsx`
- Add ESLint `no-restricted-imports` rule
- Verify AntD renders correctly alongside existing Tailwind (temporary coexistence)

Tailwind still active during this phase. Both systems coexist briefly.

### Phase 2: DS Component Rewrite

Rewrite all 43 components in ds/ to use AntD internally. Keep the same export names and prop APIs where possible.

**Order:**
1. Same-API wrappers first — Button, Card, Modal, Badge, Alert, Checkbox, Toggle, Spinner, Avatar (props barely change)
2. Adapted wrappers next — FormInput, FormSelect, FormTextarea, Select, Dropdown, Tab, Collapse (prop shape changes)
3. DataTable last — heaviest migration. Rewrite from primitive JSX table to AntD Table with column definitions. Changes how every page defines its table.
4. Custom components — rewrite to use AntD tokens + CSS Modules instead of Tailwind classes
5. Rebuild all 43 Storybook stories

Barrel export stays stable. Pages still import from `@/components/ds`.

### Phase 3: Page Migration

Update all 96 pages to use new DS APIs and remove Tailwind classes.

**Order:**
1. Simple pages first — settings pages, static layouts (mostly swapping Tailwind layout → AntD Flex/Row/Col)
2. Table pages next — rewrite inline `.map()` loops to AntD Table column definitions
3. Complex pages last — Dashboard, Calendar, DataImport wizard (most Tailwind-heavy)
4. Replace all Lucide icons with @ant-design/icons equivalents
5. Replace all Tailwind layout classes with AntD layout components

Each page is independently migratable. No big-bang switchover.

### Phase 4: Cleanup

- Uninstall `tailwindcss`, `@tailwindcss/postcss`, `prettier-plugin-tailwindcss`, `lucide-react`
- Delete `postcss.config.mjs`
- Strip `globals.css` down to @font-face declarations only
- Delete `portable/` directory
- Delete `usePagination.ts`
- Verify build passes with zero Tailwind references
- Final Storybook verification

## Branching Strategy

```
main (current) ──→ tailwind-archive (frozen snapshot, never deleted)
      │
      └──→ antd-migration (all work here)
                │
                ├── Phase 1 complete → merge to main
                ├── Phase 2 complete → merge to main
                ├── Phase 3 complete → merge to main
                └── Phase 4 complete → merge to main (done)
```

- `tailwind-archive`: frozen snapshot of the Tailwind codebase. Safety net — never merged back, never deleted.
- `antd-migration`: all migration work. Phase-by-phase merges to main after verification.

## API Breaking Changes

Most wrappers preserve the current API. These are the exceptions where page code must change:

| Component | Current API | New API | Impact |
|-----------|-------------|---------|--------|
| DataTable | Inline JSX: `<Tr><Td>...</Td></Tr>` with `.map()` | Column definitions: `columns={[...]} dataSource={data}` | All 25+ table pages must be rewritten |
| Th (sort) | Props: `sortable, sortDirection, onSort` | Column def: `sorter: true, sortOrder` | Absorbed into DataTable column defs |
| ExpandableRow | Component: `<ExpandableRow expandContent={...}>` | Table prop: `expandable={{ expandedRowRender }}` | Pages using expansion must adapt |
| FormInput | Props: `label, error` on the input | May wrap in Form.Item internally | API stays similar — minor adaptation |
| Dropdown | Props: `items: DropdownItem[]` | Maps to AntD menu items format internally | API stays similar — minor adaptation |
| Button, Card, Modal, Badge, etc. | Current props | Same props — wrapper maps internally | No change needed |

## Dependencies

### Added

| Package | Purpose |
|---------|---------|
| `antd` | Component library |
| `@ant-design/icons` | Icon library |
| `@ant-design/nextjs-registry` | SSR style extraction for Next.js App Router |

### Removed

| Package | Reason |
|---------|--------|
| `tailwindcss` | Replaced by AntD CSS-in-JS |
| `@tailwindcss/postcss` | No PostCSS needed |
| `prettier-plugin-tailwindcss` | No Tailwind classes to sort |
| `lucide-react` | Replaced by @ant-design/icons |

### Kept

| Package | Reason |
|---------|--------|
| `date-fns` | Date utilities — not a UI concern |
| `@dnd-kit/*` | Drag-and-drop for ReorderModal — independent of DS library |
| `leaflet` / `react-leaflet` | Mapping — independent of DS library |
| `html-to-image` | Image export — independent of DS library |
