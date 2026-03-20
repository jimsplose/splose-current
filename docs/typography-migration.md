# Typography Migration Workflow

This document describes how to migrate existing inline text styles to the typography design system. See `docs/typography-spec.md` for the full specification.

## Two ways to apply typography

1. **CSS utility class** — `className="text-display-lg"` — use for inline styling, one-offs, or when `<Text>` would be awkward (e.g., inside an existing DS component)
2. **`<Text>` component** — `<Text variant="display/lg">` — use for page content, labels, captions where the semantic wrapper is helpful. Import from `@/components/ds`.

Both resolve to the same CSS. Choose whichever reads better in context.

## Migration mapping table

Use this table when converting existing inline Tailwind to typography tokens.

### Direct replacements

| Old Tailwind | New class | New component |
|---|---|---|
| `text-2xl font-bold` (page title) | `text-display-lg` | `<Text variant="display/lg">` |
| `text-xl font-bold` | `text-display-md` | `<Text variant="display/md">` |
| `text-lg font-bold` | `text-display-sm` | `<Text variant="display/sm">` |
| `text-lg font-semibold` | `text-heading-lg` | `<Text variant="heading/lg">` |
| `text-base font-semibold` | `text-heading-md` | `<Text variant="heading/md">` |
| `text-sm font-semibold` | `text-heading-sm` | `<Text variant="heading/sm">` |
| `text-base` (16px regular) | `text-body-lg` | `<Text variant="body/lg">` |
| `text-sm` (14px regular) | `text-body-md` | `<Text variant="body/md">` |
| `text-xs` (12px regular content) | `text-body-sm` | `<Text variant="body/sm">` |
| `text-sm font-bold` | `text-body-md-strong` | `<Text variant="body/md-strong">` |
| `text-base font-bold` | `text-body-lg-strong` | `<Text variant="body/lg-strong">` |
| `text-sm font-medium` | `text-label-lg` | `<Text variant="label/lg">` |
| `text-xs font-medium` | `text-label-md` | `<Text variant="label/md">` |
| `text-[11px] font-medium` | `text-label-sm` | `<Text variant="label/sm">` |
| `text-xs` (12px metadata/helper) | `text-caption-md` | `<Text variant="caption/md">` |
| `text-[11px]` (11px metadata) | `text-caption-sm` | `<Text variant="caption/sm">` |

### Ambiguous cases — decide by context

| Old Tailwind | If it's... | Use... |
|---|---|---|
| `text-xs` (12px) | Content (table data, event text) | `text-body-sm` |
| `text-xs` (12px) | Metadata (timestamps, helper text) | `text-caption-md` |
| `text-2xl font-bold` | A title heading | `text-display-lg` |
| `text-2xl font-bold` | A KPI number | `text-metric-lg` |
| `text-xl font-bold` | A title heading | `text-display-md` |
| `text-xl font-bold` | A KPI number | `text-metric-md` |

### Arbitrary pixel values

| Old | New | Notes |
|---|---|---|
| `text-[10px]` | `text-caption-sm` | Rounds up to 11px |
| `text-[11px]` | `text-caption-sm` or `text-label-sm` | Regular weight → caption, medium weight → label |
| `text-[13px]` | `text-body-md` | Rounds up to 14px |
| `text-[15px]` | `text-body-lg` | Rounds up to 16px |

## What to keep alongside typography classes

Typography classes handle: font-family, font-size, font-weight, line-height, letter-spacing.

Keep these as separate Tailwind classes — they're NOT part of typography:
- **Color**: `text-text`, `text-text-secondary`, `text-primary`, `text-danger` — or use `<Text color="text-text-secondary">`
- **Alignment**: `text-center`, `text-right`
- **Truncation**: `truncate`, `line-clamp-2`
- **Whitespace**: `whitespace-nowrap`
- **Margin/padding**: Keep as-is

## Phase 2: DS component migration

Update existing DS components to use typography tokens internally. Priority order:

1. **PageHeader** — `text-2xl font-bold` → `text-display-lg`
2. **Button** — `font-medium` → weight already correct (500), but should reference the token system
3. **Badge** — `text-xs font-medium` → `text-label-md`
4. **FormInput** — label `text-sm font-medium` → `text-label-lg`, helper text → `text-caption-md`
5. **FormSelect** — same as FormInput
6. **Card** — title `text-sm font-semibold` → `text-heading-sm`
7. **Th** (table header) — should use `text-label-lg`
8. **Tab** — tab text should use `text-label-md` or `text-label-lg`
9. **Navbar** — title text → `text-heading-md`
10. **Collapse** — header text → `text-heading-sm`

After updating a DS component, every page using that component automatically gets correct typography — this is the highest-leverage work.

## Phase 3: Page-by-page migration

Add a fidelity gap for each page that needs typography migration. When touching a page for any reason, migrate its typography at the same time. Priority:

1. Pages with the most screenshot references (highest fidelity visibility)
2. Pages with many arbitrary pixel values (`text-[Npx]`)
3. Remaining pages in route order

### Per-page migration checklist
- [ ] Replace all `font-bold`/`font-semibold`/`font-medium` + `text-{size}` combos with typography classes
- [ ] Replace all `text-[Npx]` arbitrary values
- [ ] Verify no visual regression (screenshot diff)
- [ ] Remove now-redundant `leading-*` and `tracking-*` classes (typography classes include these)

## Phase 4: Enforcement

After migration is substantially complete:
- Agent block bans raw `text-[Npx]` patterns
- Agent block requires typography classes for all new text
- DS components are the only place raw Tailwind text styles should appear (internal implementation)

## Sprig Sans font setup

Sprig Sans is used only for `display/*` styles. Until the font files are added:
- Display styles fall back to Inter (via the `--font-display` variable)
- Once font files are in `public/fonts/`, uncomment the `@font-face` block in `globals.css`
- The production app loads Sprig Sans at weights 500, 600, 700 — we only need 700 (Bold)
