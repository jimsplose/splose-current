# Design System Consolidation Plan

**Goal:** Get from ~35% DS component coverage to 95%+ across all pages.
**Status:** Plan drafted 2026-04-02. Ready for execution.

## Current State (2026-04-02)

- 44 DS components, 44 Storybook stories
- 90% of files import from DS, but **2,024 inline `style={{` props remain**
- Text component: 61 usages (should be 500+)
- Card component: 74 usages (decent)
- Grid component: 7 usages (barely adopted)
- ~200 raw `className="text-*"` usages that should be `<Text>`

## Phase 1: Consolidate Components (reduce count, increase capability)

### 1a. FormField wrapper
Merge the duplicated label/error logic from FormInput, FormSelect, FormTextarea into a shared `FormField` wrapper. Keep the three input components but extract the 80 lines of identical label+error rendering.

```
FormField { label?, error?, required?, hint?, children }
  └─ renders: label row → children (any input) → error message
```

Files: `src/components/ds/FormInput.tsx`, `FormSelect.tsx`, `FormTextarea.tsx`
Saves: ~80 lines of duplicated code. Enables new input types (date, number) without duplicating the wrapper.

### 1b. Badge + Chip merge
Merge Chip into Badge by adding `shape` and `onRemove` props.

```
Badge { variant, solid?, shape?: "rounded" | "pill", onRemove?, children }
```

Files: `src/components/ds/Badge.tsx`, `Chip.tsx`
Saves: ~40 lines. Chip becomes `<Badge shape="pill" onRemove={...}>`.

### 1c. Select → FormSelect
Fold Select into FormSelect. They're nearly identical — FormSelect just always has a label.

Files: `src/components/ds/Select.tsx`, `FormSelect.tsx`
Saves: ~25 lines. FormSelect with `label` optional covers both cases.

### 1d. Add Divider component
Wraps AntD Divider with project defaults. Replaces 20+ `borderBottom: '1px solid var(--color-border)'` patterns.

```
Divider { variant?: "default" | "subtle", spacing?: "sm" | "md" | "lg" }
```

### 1e. Add Section component
Card + title + internal spacing. Replaces the "bordered container with heading then form fields" pattern that appears 15+ times.

```
Section { title?, padding?, children, headerBar? }
```

This is similar to Card with title, but optimized for the form-section pattern with proper heading hierarchy.

## Phase 2: Page Templates (highest leverage)

Instead of migrating 60 pages individually, create composable page templates.

### 2a. ListPage template
Covers: clients, contacts, invoices, payments, products, waitlist, all report list pages, all settings list pages (~35 pages).

```
ListPage { title, searchPlaceholder?, actions?, filters?, children: DataTable }
  └─ renders: PageHeader → filter bar → SearchBar → DataTable → Pagination
```

SettingsListPage already exists and covers ~20 settings pages. ListPage would be a generalized version for non-settings pages.

### 2b. DetailPage template  
Covers: client detail, contact detail, invoice detail (~15 pages with sub-tabs).

```
DetailPage { title, subtitle?, tabs?, sidebar?, actions?, children }
  └─ renders: Navbar/PageHeader → Tab bar → sidebar + content layout
```

### 2c. FormPage template
Covers: payments/new, notes/new, all settings edit pages (~10 pages).

```
FormPage { title, backHref?, actions?, children }
  └─ renders: Navbar with back → form Sections → action buttons
```

## Phase 3: Migrate Pages to Templates

Priority order:
1. **Settings list pages** — already use SettingsListPage, verify coverage
2. **Report pages** — all follow identical ListPage pattern
3. **Core list pages** — clients, contacts, invoices, payments, products
4. **Detail pages** — client detail, contact detail, invoice detail
5. **Form pages** — payments/new, notes/new, settings edit pages

For each migration:
- Replace page-level layout code with template
- Replace remaining `style={{` with DS component props
- Replace `className="text-*"` with `<Text variant="...">`
- Target: Grade A (≤10 inline styles per page)

## Phase 4: Enrich Storybook

Use the Button story (573 lines, 10 recipes) as the gold standard. Every component story should have:

1. **Playground** — all props controllable
2. **Feature stories** — one per variant/state
3. **AllVariants comparison** — visual grid of all options
4. **3-5 Recipe stories** — real codebase patterns with source file comments

Priority stories to enrich:
- RichTextEditor (47 lines → needs email/note editor recipes)
- ReorderModal (38 lines → needs drag-to-reorder recipe)
- Grid (59 lines → needs real page layout recipes)
- EmailPreview (50 lines → needs email template recipes)
- Stat (current is OK but needs dashboard/report card recipes)

## Phase 5: Enforce DS-First

- Audit workflow now includes DS compliance grading (A/B/C) per page
- Fidelity workflow requires DS-first solutions
- New work should use DS components and templates, not inline styles
- Consider adding a lint rule or pre-commit check for `style={{` count per file

## Execution Notes

- Phases 1-2 are infrastructure. Do them before page migrations.
- Phase 3 can be parallelized heavily — each page is independent.
- Phase 4 can happen any time.
- Phase 5 is ongoing enforcement.
- Estimated effort: Phase 1 (1 session), Phase 2 (1-2 sessions), Phase 3 (2-3 sessions), Phase 4 (1 session).
