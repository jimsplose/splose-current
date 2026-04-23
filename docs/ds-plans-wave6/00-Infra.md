# Wave 6 · Plan 00 — Infra: Text mb/mt props + CSS module pattern baseline

**Status:** Done
**Estimated effort:** 20 min
**Model:** Sonnet
**Thinking:** think
**Must run before:** All other Wave 6 plans

## What this plan does

Two infrastructure changes that every subsequent plan depends on:

### A. Extend Text with `mb` and `mt` props

Many pages have `<Text variant="..." style={{ marginBottom: 16 }}>` or `<Text ... style={{ marginTop: 8 }}>`. The `style` prop is already supported on Text, but extracting these into a dedicated `mb`/`mt` prop:
1. Keeps the inline style count per element to zero when only spacing is needed
2. Makes intent explicit
3. Avoids needing a CSS module just for one spacing override

**Changes to `Text.tsx`:**
- Add `mb?: number` and `mt?: number` to TextProps
- Apply via `style={{ ...style, marginBottom: mb, marginTop: mt }}` inside the component
- The prop takes precedence over any `style.marginBottom` passed inline

**Storybook:** Add a `Spacing` story to Text.stories showing mb/mt in action.

### B. Establish CSS module pattern in existing module files

6 files already have `.module.css` siblings. Add a comment header to each explaining the pattern so future plans know they can add classes there:

Files already with modules:
- `src/app/DashboardClient.module.css` — add `.messageCard`, `.chartShell` structural classes
- `src/app/calendar/CalendarView.module.css` — already has content; document
- `src/app/online-booking/online-booking.module.css` — add `.shell`, `.section`
- `src/app/waitlist/waitlist.module.css` — add `.filterPanel`, `.screenerRow`
- `src/app/products/products.module.css` — add `.shell`
- `src/app/clients/ClientsPageClient.module.css` — already has content; document

Also create new `.module.css` files for the top-count pages that currently lack them (no CSS changes yet — just empty files with a header comment, so plans 04–07 can add classes without creating files themselves):
- `src/app/invoices/[id]/InvoicePage.module.css`
- `src/app/invoices/[id]/InvoiceDetailClient.module.css`
- `src/app/settings/data-import/DataImport.module.css`
- `src/app/settings/online-bookings/[id]/OnlineBookingsEdit.module.css`
- `src/app/settings/details/SettingsDetails.module.css`
- `src/app/notes/[id]/edit/NoteEdit.module.css`
- `src/app/settings/forms/[id]/FormEdit.module.css`
- `src/app/settings/users/[id]/UserDetail.module.css`
- `src/app/reports/Reports.module.css`

## Migration table

| Before | After |
|---|---|
| `<Text variant="heading/lg" style={{ marginBottom: 16 }}>` | `<Text variant="heading/lg" mb={16}>` |
| `<Text variant="body/md" style={{ marginTop: 8, marginBottom: 12 }}>` | `<Text variant="body/md" mt={8} mb={12}>` |
| `<Text variant="caption/sm" style={{ marginBottom: 4, color: 'var(--color-text-secondary)' }}>` | `<Text variant="caption/sm" color="secondary" mb={4}>` |

## Acceptance criteria

- [ ] `Text.tsx` has `mb?: number` and `mt?: number` props
- [ ] `Text.tsx` applies them as inline style (merged with any passed `style` prop)
- [ ] Storybook Spacing story added to `Text.stories.tsx`
- [ ] 9 new empty `.module.css` files created (with header comment)
- [ ] Existing 6 module files have structural classes added
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] No Chrome MCP needed (Text prop is additive; no visual change until callers migrate)

## Open questions

None. Text props are purely additive; backward-compatible.
