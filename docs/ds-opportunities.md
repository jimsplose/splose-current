# Design System Opportunities

Audit of interactive states implementation (Phase 1-4) identifying patterns for extraction into DS components, hooks, and page templates.

## Status: Typography & DS

**Typography migration:** Phase 1-3 complete (2026-03-20). 18 semantic styles, 65+ files migrated, zero regressions. Phase 4 (enforcement/linting) not yet implemented.

**DS components:** 24/24 complete with 100% Storybook coverage. All follow DaisyUI naming where applicable.

**Interactive states:** 30+ settings pages now have working DS Dropdown + Modal with edit/create flows.

---

## Priority 1 — Hooks & Utilities

### `useFormModal` hook

**Pattern:** Every settings page with a modal repeats 15-20 lines of identical state management — `modalOpen`, `editingIndex`, form field states, `openCreate()`, `openEdit()`, `handleSave()`.

**Proposed API:**
```typescript
const { modalOpen, isEditing, openCreate, openEdit, closeModal, formState, setField } =
  useFormModal<Tag>({
    fields: { name: "", color: "#EAB308" },
    onSave: (item, index) => { /* upsert logic */ },
  });
```

**Impact:** 30+ pages, ~300 lines saved.

### Dropdown Presets (`src/lib/dropdown-presets.ts`)

**Pattern:** 20+ pages define identical dropdown item arrays. Three standard patterns exist:

| Preset | Items | Pages |
|--------|-------|-------|
| `STANDARD_SETTINGS` | Edit, Duplicate, Change log, ---, Archive | tags, busy-times, templates, rooms, user-groups, services (~20 pages) |
| `SIMPLE_CRUD` | Edit, Delete | cancellation-reasons, tax-rates, payment-settings, communication-types |
| `USER_ADMIN` | Deactivate, Reset password, Log out everywhere, Change log | users |

**Impact:** 20+ pages, ~200 lines saved.

### `formatTimestamp()` utility

**Pattern:** `new Date().toLocaleString("en-AU", { hour: "numeric", minute: "2-digit", hour12: true, ... })` repeated in 5+ pages.

**Impact:** 5+ pages, ~50 lines saved.

---

## Priority 2 — New DS Components

### `FormColorPicker`

**Pattern:** Two inconsistent implementations — native `<input type="color">` (tags, busy-times) and swatch grid (rooms-resources). Both do the same thing.

**Proposed API:**
```typescript
<FormColorPicker
  label="Colour"
  value={color}
  onChange={setColor}
  variant="swatches" // or "native"
  swatches={COLOR_SWATCHES} // optional, defaults to standard palette
/>
```

**Impact:** 3 pages, standardizes UX.

### `OnOffBadge` / `StatusText`

**Pattern:** appointment-templates has a hand-rolled `OnOffText` component. Communication-types/referral-types use inline green/red spans for Yes/No.

**Proposed API:**
```typescript
<OnOffBadge value={isEnabled} onLabel="On" offLabel="Off" />
<OnOffBadge value={isDefault} onLabel="Yes" offLabel="No" />
```

**Impact:** 3+ pages, consistent boolean display.

### `ColorDot`

**Pattern:** `<span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />` in rooms-resources, busy-times, services.

**Proposed API:**
```typescript
<ColorDot color="#ef4444" size="sm" /> // sm=3, md=4, lg=5
```

**Impact:** 3+ pages, minor but consistent.

---

## Priority 3 — Page Templates

### `SettingsListPage` template

**Pattern:** ALL 30+ settings pages follow the identical layout:
1. `<div className="p-6">` wrapper
2. PageHeader with title + buttons
3. SearchBar (optional)
4. DataTable with columns
5. Dropdown in Actions column
6. Pagination
7. Modal for edit/create

**Each page is ~150 lines. With a template, each would be ~30 lines.**

**Proposed API:**
```typescript
<SettingsListPage
  title="Tags"
  items={tags}
  columns={[
    { key: "name", label: "Name" },
    { key: "color", label: "Colour", render: (tag) => <ColorDot color={tag.color} /> },
  ]}
  dropdownPreset="STANDARD_SETTINGS"
  modalTitle={(editing) => editing ? "Edit tag" : "New tag"}
  renderForm={(item) => (
    <>
      <FormInput label="Name" value={item.name} ... />
      <FormColorPicker label="Colour" value={item.color} ... />
    </>
  )}
  onSave={handleSave}
  hasSearch
  searchPlaceholder="Search for tag name"
  headerButtons={<Button variant="primary">+ New tag</Button>}
/>
```

**Impact:** 30+ pages, ~3000 lines saved. Biggest single opportunity.

### `TabbedSettingsPage` variant

**Pattern:** Tags page has tabs (Client/Service/Waitlist/AI) scoping the data table and modal to the active tab.

**Impact:** 1 page currently, but future settings may need tabs too.

---

## Priority 4 — Badge & Variant Mappings

### `BADGE_TYPE_VARIANTS` mapping utility

**Pattern:** email-templates maps TemplateType → Badge variant. This pattern will recur whenever entity types need colored badges.

```typescript
export const BADGE_TYPE_VARIANTS: Record<string, BadgeVariant> = {
  Invoice: "blue",
  Payment: "green",
  "Progress note": "purple",
  Form: "yellow",
  Letter: "gray",
  General: "gray",
};
export function getBadgeVariant(type: string): BadgeVariant {
  return BADGE_TYPE_VARIANTS[type] || "gray";
}
```

**Impact:** 2+ pages, centralizes type-to-color mapping.

---

## Implementation Order

1. `useFormModal` hook + `DROPDOWN_PRESETS` — foundation for everything else
2. `FormColorPicker` + `OnOffBadge` + `ColorDot` — small DS components
3. `SettingsListPage` template — massive refactor, builds on #1 and #2
4. `BADGE_TYPE_VARIANTS` + `formatTimestamp` — utilities
5. Update `docs/agent-block.md` with new DS guidance
6. Add Storybook stories for all new components
