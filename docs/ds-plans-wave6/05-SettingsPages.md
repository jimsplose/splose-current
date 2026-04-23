# Wave 6 · Plan 05 — Settings high-count pages

**Status:** Planned
**Estimated effort:** 45 min
**Model:** Sonnet
**Thinking:** think
**Must run after:** Plans 00, 01

> **Architecture update (2026-04-23):** Plan 02 (FormLabel) is superseded — FormLabel is **removed**. Instead of `<FormLabel>`, use AntD `<Form.Item label="..." required tooltip="...">` directly. Form.Item label styling is now configured in `sploseTheme.components.Form` in `src/components/ds/theme.ts`. Also: `<Button variant="link">` → `<Button type="link">` (AntD directly, no DS Button wrapper).

## Current state

- `src/app/settings/data-import/page.tsx`: **59 inline styles**
- `src/app/settings/online-bookings/[id]/page.tsx`: **57 inline styles**
- `src/app/settings/details/page.tsx`: **52 inline styles**

Combined: **168 inline styles** → target **≤ 60 combined**

## Analysis

### settings/data-import/page.tsx (59)

After plans 01 (icon) + 02 (FormLabel): ~50 remaining.

1. **Card layout overrides** (~10): `<Card ... style={{ marginBottom: 32 }}>` → `mb` prop; Card-level layout stays inline if unique
2. **Inline link styles** (~5): `<a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500 }}>` → Note: no DS Link component yet. Create one? Or use `<Button variant="link" size="sm">` if semantically a button. Evaluate at call site.
3. **Upload zone** (~8): Progress/step indicators. Mix of layout + visual. → CSS module `DataImport.module.css`
4. **Text spacing** (~15): `<Text ... style={{ marginBottom: N }}>` → `mb` prop
5. **`<span style={{ color: 'var(--color-text-secondary)' }}>` inside Td** (~5) → `Td color="secondary"` or `<Text color="secondary">`
6. **Unique one-offs** (~7): Progress bar inline, emoji icon sizing. → keep inline

### settings/online-bookings/[id]/page.tsx (57)

After plans 01 (icon) + 02 (FormLabel): ~44 remaining.

1. **Tab/preview split shell** (~8): Complex layout with conditional `showPreview`. → CSS module `OnlineBookingsEdit.module.css`
2. **Color preview buttons** (~6): `style={{ backgroundColor: buttonColor, ... }}` — **dynamic user-defined color, must stay inline**
3. **Text spacing** (~12): `mb` prop
4. **Upload zone** (~5): Drag-drop area → CSS module
5. **Accessible color suggestions** (~6): Static preview swatches → CSS module or keep (small)
6. **Section preview** (~7): The preview panel on the right side → CSS module

### settings/details/page.tsx (52)

After migrating 9 `<label style=...>` to `<Form.Item label="...">`: ~43 remaining.

1. **Form section structure** (~10): `<div style={{ marginBottom: 32 }}>` wrappers → CSS module `SettingsDetails.module.css`
2. **Text spacing** (~15): `mb`/`mt` props
3. **Profile avatar** (~5): `<Avatar style={{ ...}}>` sizing overrides → keep (dynamic avatar size)
4. **Divider + vertical patterns** (~4): Already migrated. Check what's left.
5. **Unique one-offs** (~9): Timezone selector, color picker inline overrides → keep

## CSS module additions

### DataImport.module.css

```css
.shell { padding: 24px; }
.uploadZone { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.uploadStep { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.progressRow { display: flex; justify-content: space-between; align-items: center; width: 100%; }
```

### OnlineBookingsEdit.module.css

```css
.shell { padding: '0 24px'; border-bottom: 1px solid var(--color-border); margin: -24px -24px 0; }
.splitBody { margin: 0 -24px -24px; }
.formCol { padding: 24px; }
.previewCol { padding: 24px; flex: 1; }
.previewHeading { font-size: 16px; font-weight: 600; margin-bottom: 12px; }
.uploadZone { display: flex; align-items: center; justify-content: center; height: 128px; }
```

### SettingsDetails.module.css

```css
.section { margin-bottom: 32px; }
.formRow { margin-bottom: 16px; }
.avatarRow { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
```

## Migration table

| Before | After |
|---|---|
| `<Text variant="heading/lg" style={{ marginBottom: 4 }}>` | `<Text variant="heading/lg" mb={4}>` |
| `<Text variant="body/md" color="secondary" style={{ marginBottom: 12 }}>` | `<Text variant="body/md" color="secondary" mb={12}>` |
| `<span style={{ color: 'var(--color-text-secondary)' }}>text</span>` inside Td | `<Text color="secondary" as="span">text</Text>` |
| `<a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500 }}>` | `<Button type="link" size="small" href="#">` (AntD Button directly — no DS Button wrapper) |

## Chrome MCP verification

Visit each page:
- `/settings/data-import` — upload steps render, progress bar works
- `/settings/online-bookings/1` — form + preview split shows, color swatches render
- `/settings/details` — form labels correct, sections spaced properly

## Acceptance criteria

- [ ] `grep -c 'style={{' src/app/settings/data-import/page.tsx` ≤ 20
- [ ] `grep -c 'style={{' "src/app/settings/online-bookings/[id]/page.tsx"` ≤ 20
- [ ] `grep -c 'style={{' src/app/settings/details/page.tsx` ≤ 20
- [ ] CSS modules created for all three pages
- [ ] `<label style=...>` count in these files = 0 (Form.Item adopted directly — no DS FormLabel wrapper)
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] Chrome MCP: all 3 pages verified

## Open questions

- `<a style={{ display: 'inline-flex', fontSize: 12 }}>` in data-import: use `<Button type="link" size="small">` (AntD) if it's a click action, keep `<a>` with inline style if it's a true external link. Do NOT create an InlineLink DS wrapper — the pattern is thin enough to express directly.
