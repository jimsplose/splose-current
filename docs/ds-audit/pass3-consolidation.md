# Pass 3 — DS consolidation scan

For each of the 49 DS components under `src/components/ds/*.tsx`, the underlying primitive, render shape, and consumer count were noted. Near-duplicate pairs are flagged at the end.

## Methodology note — Pass 1 Section C correction

Pass 1's import counts use the regex `<ComponentName` to count "JSX tag usage" in `src/app/**`. **This undercounts multi-line named imports** like:
```tsx
import {
  RichTextEditor,
  EmailPreview,
} from "@/components/ds";
```
A verification sweep showed the following components are actually used 3-5× each despite Pass 1 reporting 0:

| Component | Pass 1 count | True consumer count | Under-adopted? |
|---|---|---|---|
| `RichTextEditor` | 0 | 4 | No |
| `EmailPreview` | 0 | 3 | No |
| `AlertCallout` | 0 | 1 | Yes (low) |
| `SideNav` | 2 | 2+ (via layout.tsx) | No |
| `FormField` | 0 | 0 (direct) but used internally by FormInput/FormSelect/FormTextarea | Intentional internal |

The corrections here shift the "genuinely under-adopted" set to:
- `TopNav` (0 app usages, 0 internal — genuine low adoption, but not a duplicate of Navbar)
- `Status` (0 usages)
- `IconText` (0 usages)
- `Section` (0 direct usages, 0 internal)
- `DetailPage` (0 direct usages — confirmed Pass 2b finding that detail pages hand-roll headers)

## Component inventory

| Component | Primitive | Prop signature | Render shape | Consumers (app) |
|---|---|---|---|---|
| `Alert` | AntD Alert | `variant`, `icon`, `children` | Variant-coloured alert box | 4 |
| `AlertCallout` | `div` | `variant`, `children` | Custom-styled bordered callout | 1 |
| `AsyncSelect` | AntD Select | async variant | Searchable async-loading select | 0 |
| `Avatar` | `div` | `name`, `size`, `color`, `variant` | Coloured circle with initials | 4 |
| `Badge` | AntD Tag | `variant` (7 colors), `solid`, `solidBg`/`solidText`, `shape` (rounded/pill), `onRemove` | Coloured tag with close option | 18 |
| `Button` | AntD Button | `variant`, `size`, `icon`, etc. | DS-styled button | 45 |
| `Card` | AntD Card | `title`, `headerBar`, `padding` (none/sm/md/lg/xl), `shadow` | Bordered container | 25 |
| `Checkbox` | AntD Checkbox | `checked`, `label` | Styled checkbox | 11 |
| `Collapse` | AntD Collapse | `items` (panels) | Expandable panel | 1 |
| `ColorDot` | `span` | `color`, `size` (xs/sm/md/lg) | Coloured circle | 4 |
| `DataTable` + Th/Td/Tr | `table` | `children`, `variant` | Styled table with subcomponents | 23 |
| `DateRangeFilter` | AntD RangePicker | `startDate`, `endDate`, onChange | Date range input | 2+ |
| `DetailPage` | `div` | `title`, `tabs`, `sidebar`, `actions`, `children` | Page template: header + tab bar + sidebar + content | 0 direct |
| `Divider` | `hr`/AntD Divider | `variant`, `spacing` | Horizontal separator | 12 |
| `Dropdown` | AntD Dropdown | `items`, `trigger`, `open` | Dropdown menu | 12 |
| `EmailPreview` | `div` | `subject`, `recipient`, `body`, `sender` | Email preview card | 3 |
| `EmptyState` | `div` | `icon`, `title`, `description`, `action` | Centred empty state | 7 |
| `FileUpload` | `label` | `onFileSelect`, `accept` | Dashed drop zone | 1 |
| `Filter` | AntD Segmented | `items`, `value`, `onChange` | Pill-toggle selector | 2 |
| `FormColorPicker` | color input | `value`, `onChange`, `variant` | Color picker | 1 |
| `FormField` | `div` | `label`, `error`, `required`, `hint` | Label + error wrapper (used internally by FormInput/FormSelect/FormTextarea) | 0 direct (4 internal) |
| `FormInput` | AntD Input + FormField | `label`, `error`, all input props | Labeled text input | 22 |
| `FormPage` | `div` | `title`, `backHref`, `actions`, `children` | Page template: navbar + form + actions | 6 |
| `FormSelect` | AntD Select + FormField | `label`, `options`, `searchable` | Labeled select | 17 |
| `FormTextarea` | AntD TextArea + FormField | `label`, `rows`, `value` | Labeled textarea | 9 |
| `Grid` | `div` | `cols`, `gap`, `children` | Responsive grid | 10 |
| `HintIcon` | AntD Tooltip + InfoCircleOutlined | `tooltip`, `style` | `ⓘ` icon with tooltip | 1 |
| `IconText` | `Flex` | `icon`, `children` | Single row: icon + secondary-tone text | 0 |
| `List` | AntD List | `items` (label/value), `labelWidth` | Label-value detail rows | 2 |
| `ListPage` | `div` | `title`, `searchPlaceholder`, `actions`, `filters`, `children` | Page template: header + search + filters + content | 4 |
| `Modal` | AntD Modal | `open`, `onClose`, `title`, `maxWidth` (sm/md/lg/xl), `footer` | Modal overlay | 11 |
| `Navbar` | `Flex` | `backHref`, `title`, `backLabel`, `badge`, `children` | Page back-nav + title + actions | 2 |
| `OnOffBadge` | `span` | `value: boolean`, `onLabel`, `offLabel` | Coloured text (green/red) for On/Off | 2 |
| `PageHeader` | `Flex` | `title`, `subtitle`, `actions`, `backHref` | Page-level header | 19 |
| `Pagination` | AntD Pagination | `total`, `pageSize`, `current` | Pagination bar | 14 |
| `RadioGroup` | AntD Radio.Group | `options`, `value`, `onChange` | Labeled radio group | 1 |
| `ReorderModal` | Modal + dnd-kit | `open`, `items`, `onReorder` | Modal with drag-to-reorder list | 0 |
| `RichTextEditor` | AntD + TipTap | `value`, `onChange`, `rows`, `templateVariables` | Rich text editor | 4 |
| `SearchBar` | AntD Search | `placeholder`, `onSearch` | Search input | 6 |
| `Section` | Card | `title`, `description`, `headerBar`, `padding` | Card with title+description | 0 (direct or internal) |
| `SettingsListPage` | `div` (composite) | `title`, `items`, `columns`, `dropdownItems`, etc. | Generic CRUD settings page | 2 |
| `SideNav` | `nav` | `sections`, `isActive` | Left-side nav with sections | 2+ |
| `Spinner` | AntD Spin | `size` | Loading spinner | 1 |
| `Stat` | AntD Statistic | `value`, `label`, `description`, `align`, `color` | Metric card | 1 |
| `Status` | AntD Badge + Flex | `color` (7 presets), `label` | Coloured dot + label | 0 |
| `Tab` | AntD Tabs | `items`, `value`, `onChange` | Horizontal tab bar | 3 |
| `Text` | `ElementType` (default per variant) | `variant` (20+ variants), `as`, `color` (7 tones incl. danger/warning/success) | Typography primitive | 16 |
| `ThemeProvider` | Context wrapper | (none) | Theme context for AntD | 1 (in layout.tsx) |
| `Toggle` | AntD Switch | `checked`, `onChange`, `label` | Boolean toggle | 8 |
| `TopNav` | `header` | `brand`, `items`, `children` | Site-level top nav with overflow menu | 0 |

---

## Near-duplicate pairs

Criteria: same (or equivalent) primitive + ≥50% overlap in rendered shape + can collapse into one component via a new prop. Consumer count shown for merge-risk assessment.

### Pair 1 — `Section` + `Card` (HIGH confidence, LOW risk)

**Shared primitive:** AntD Card (Section wraps Card)
**Prop overlap:** 80% — Section adds `description` and renders a wider title style; Card has `title` + `headerBar` + `padding` + `shadow`. Section doesn't have `shadow`, Card doesn't have `description`.
**Render shape:**
- Section: Card with an internal title block using `<Text variant="label/lg" as="h3">` and optional `description`
- Card: bordered container with AntD's default `<h3>` title or headerBar-style title

**Proposed merge:** absorb Section into Card by:
- Add `description?: string` prop to Card
- When both `title` and `description` given, render the Section-style header block internally

```tsx
// After merge:
<Card title="Settings" description="Configure how things behave." padding="md" shadow>
  …
</Card>
```

**Consumer counts:** Card = 25 (app) + several internal; Section = 0 (direct or internal uses).
**Migration risk:** **Low** — zero Section consumers. Just delete Section and update Card.
**Priority:** **High** — zero-cost cleanup, reduces component count by one.

### Pair 2 — `Status` + `ColorDot` (HIGH confidence, LOW risk)

**Shared primitive:** visually equivalent — both render a small coloured circle. Status wraps AntD Badge (a dot); ColorDot uses a plain `<span>` with inline style.
**Prop overlap:** ~60% — both take a color (Status via preset, ColorDot as hex string). Status adds `label`.
**Render shape:**
- Status: `<Flex>` with `<Badge color=...>` (dot) + optional label
- ColorDot: plain `<span>` with `backgroundColor` and `borderRadius: 50%`

**Proposed merge:** absorb Status into ColorDot by:
- Add `label?: string` prop to ColorDot → when present, wrap in a flex row
- Accept both hex strings (existing) AND semantic tokens (green/red/yellow/etc. — Status's current enum)

```tsx
// After merge:
<ColorDot color="green" label="Active" size="md" />
<ColorDot color="#b4eb64" size="sm" />
```

**Consumer counts:** ColorDot = 4; Status = 0.
**Migration risk:** **Low** — zero Status consumers.
**Priority:** **High** — zero-cost cleanup.

### Pair 3 — `OnOffBadge` + `Text` (MEDIUM confidence, LOW risk)

**Shared primitive:** both render a coloured `<span>` with text. Text has `color="success"` and `color="danger"` — OnOffBadge hard-codes the green/red via AntD tokens.
**Prop overlap:** ~30% — OnOffBadge is essentially `<Text color={value ? "success" : "danger"}>{value ? onLabel : offLabel}</Text>`.
**Render shape:**
- OnOffBadge: `<span style={{color: token.colorSuccess|Error}}>{label}</span>`
- Text: `<element class={variant + colorPreset}>{children}</element>`

**Proposed merge:** replace OnOffBadge consumers with `<Text>` and delete OnOffBadge:

```tsx
// Before:
<OnOffBadge value={user.active} />

// After:
<Text as="span" variant="body/md" color={user.active ? "success" : "danger"}>
  {user.active ? "On" : "Off"}
</Text>
```

**Consumer counts:** OnOffBadge = 2; Text = 16 (app) + heavy internal usage.
**Migration risk:** **Low** — 2 consumers to migrate; `<Text>` already has all required colors.
**Priority:** **Medium** — small cleanup, but two fewer files.

### Pair 4 — `IconText` (delete, not a merge)

**Status:** 0 direct consumers, 0 internal consumers. Genuine dead code.
**Function:** Renders `<Flex align="center" gap={8} style={{ fontSize: 14, color: "var(--color-text-secondary)" }}><icon/><children/></Flex>`. Trivial and hard-coded to secondary tone + 14px — not flexible enough to be reused.
**Recommendation:** **Delete** IconText. If the icon+text pattern is needed later, extract from a real use site with explicit prop customisation.
**Migration risk:** none (no consumers).
**Priority:** **High** — one fewer file, deletes unused code.

---

## Non-duplicate pairs worth noting (for the record, not fixes)

These pairs share a theme but are not consolidation candidates:

### `Navbar` vs `TopNav` (naming collision, different purposes)

- **Navbar:** per-page back-nav + title + actions (used by DetailPage-like layouts). 2 consumers.
- **TopNav:** site-wide top header with links and overflow menu. 0 direct consumers (likely referenced in layout.tsx which the Pass 1 grep missed).

Different responsibilities — **do not merge**. Consider renaming TopNav → `SiteHeader` in a future cleanup to reduce name collision.

### `Alert` vs `AlertCallout` (similar purpose, different impls)

- **Alert:** thin wrapper around AntD Alert. 4 consumers.
- **AlertCallout:** custom-styled `<div>` with its own CSS module, custom variant set. 1 consumer.

They serve similar notification purposes but AlertCallout has bespoke styling (module.css) that AntD's Alert doesn't match. Could unify long-term but risky without a visual audit. **Not a Section-4 candidate for this audit.**

### `Modal` vs `ReorderModal`

ReorderModal is a specialised composition (Modal + dnd-kit). Not a duplicate — ReorderModal depends on Modal. **Keep.**

### `Filter` vs `DateRangeFilter` vs `Dropdown`

All three are "filter-style" widgets but:
- Filter: Segmented (pill toggle)
- DateRangeFilter: date range picker
- Dropdown: popover menu

Different widgets, different UX patterns. **Keep separate.**

### `SettingsListPage` vs `ListPage`

Both are page-level templates for list views, but:
- SettingsListPage: tightly-coupled CRUD (modal form + table + dropdown actions) — takes `items`, `columns`, `dropdownItems`
- ListPage: generic layout with filters + children (works for reports, main list pages)

SettingsListPage = specialised, opinionated. ListPage = generic. **Not duplicates.** Could refactor SettingsListPage to compose ListPage internally but not worth the churn for 2 + 4 = 6 total consumers.

---

## Summary

- **4 consolidation opportunities** identified, all low-risk
- **3 are High priority** (Section, Status, IconText) — all have zero consumers, pure cleanup
- **1 is Medium priority** (OnOffBadge → Text) — 2 consumers to migrate
- Estimated total impact: **-4 DS components** (49 → 45), zero new components
- Zero migrations require prop-change on heavily-used components, so breaking change risk is minimal

Scan date: 2026-04-20.
