# Wave 6 · Plan 01 — Icon sweep: remaining 150 AntD icon inlines

**Status:** Planned
**Estimated effort:** 45 min
**Model:** Sonnet
**Thinking:** think
**Must run after:** Plan 00 (none strictly, but 00 establishes the module pattern)

## What this plan does

Replace every remaining `<XxxOutlined style={{ fontSize: N, color: '...' }} />` with `<Icon as={XxxOutlined} size="..." tone="..." />` across all files. This is the single biggest mechanical win — 150 inlines → 0.

The DS `Icon` component was created in audit session 02 and migrated the top 3 files (DashboardClient, notes/edit, data-import). That left ~150 icon inlines in other files.

## Icon size mapping

| `fontSize` value | `size` prop |
|---|---|
| 10, 11, 12 | `"xs"` |
| 14 | `"sm"` |
| 16, 18 | `"md"` (default) |
| 20, 22, 24 | `"lg"` |
| 28, 32, 36 | `"xl"` |
| 40+ | `"2xl"` |

## Icon tone mapping

| `color` value | `tone` prop |
|---|---|
| `'var(--color-text-secondary)'` | `"secondary"` |
| `'var(--color-text)'` | `"default"` |
| `'var(--color-primary)'` | `"primary"` |
| `'var(--color-danger)'` or `'#ef4444'` etc. | `"danger"` |
| `'var(--color-success)'` or `'#22c55e'` etc. | `"success"` |
| `'white'` or `'#fff'` | `"inverted"` |
| `'inherit'` | use `style={{ color: 'inherit' }}` on Icon |

**Exception:** If the icon color is dynamic (e.g. `color: practitionerColor`) or is a unique one-off hex, keep the `style={{ color: '...' }}` inline on the Icon (the DS Icon accepts `style` passthrough).

## Target files (ordered by icon-inline count)

| File | Icon inlines | Notes |
|---|---|---|
| `src/app/waitlist/page.tsx` | 16 | Mix of sizes/tones |
| `src/app/online-booking/page.tsx` | 15 | Mix + some inherit |
| `src/app/notes/new/page.tsx` | 7 | |
| `src/app/clients/[id]/invoices/page.tsx` | 7 | |
| `src/app/settings/progress-notes/edit/[id]/page.tsx` | 6 | |
| `src/app/contacts/page.tsx` | 6 | |
| `src/app/clients/[id]/files/page.tsx` | 6 | |
| `src/app/settings/forms/[id]/page.tsx` | 5 | |
| `src/app/reports/ndis-bulk-upload/new/page.tsx` | 5 | |
| `src/app/contacts/[id]/page.tsx` | 5 | |
| `src/app/settings/custom-fields/page.tsx` | 4 | |
| `src/app/payments/page.tsx` | 4 | |
| `src/app/payments/new/page.tsx` | 4 | |
| `src/app/clients/[id]/payments/page.tsx` | 4 | |
| `src/app/settings/user-groups/page.tsx` | 3 | |
| (remaining files with 1–2 each) | ~30 | |

## Commit grouping

Group by functional area, one commit per group:
1. Waitlist + online-booking (highest count)
2. clients/[id] sub-pages (invoices, files, payments)
3. contacts page + contacts/[id]
4. settings pages (progress-notes, forms, custom-fields, user-groups)
5. reports + notes/new
6. payments pages
7. Any remaining files with 1–2 icons

## Chrome MCP

Run verification on one representative page from each commit group:
- `/waitlist` (group 1)
- `/clients/1/invoices` (group 2)
- `/contacts` (group 3)
- `/settings/forms/1` (group 4)

Key check: icon sizes and colors match production. Use `getComputedStyle(iconEl).fontSize` and `.color`.

## Acceptance criteria

- [ ] `grep -rn 'Outlined style=\|Filled style=\|TwoTone style=' src/app/ --include='*.tsx'` returns ≤ 10 (exempt: dynamic `style={{ color: dynamicVar }}` on Icon)
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx next build` → passes
- [ ] Chrome MCP verified on 4 representative pages
- [ ] `.verification-evidence` updated

## Open questions

- If `Icon` is missing a `tone` needed for a specific color, add the tone to Icon.tsx (extend don't bypass). Check if tone already exists before adding.
