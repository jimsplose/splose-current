# Wave 6 · Plan 06 — Notes + Waitlist + Forms deep-clean

**Status:** Planned
**Estimated effort:** 40 min
**Model:** Sonnet
**Thinking:** think
**Must run after:** Plans 00, 01

> **Architecture update (2026-04-23):** DS Button wrapper is removed. All `<Button variant="...">` → AntD `<Button type="..." danger>` directly. DS Icon wrapper removed — icons use `style={{fontSize: N, color: token.colorXxx}}` directly. The split-button pattern in notes/edit stays as `// ds-exempt: split-button`.

## Current state

- `src/app/notes/[id]/edit/page.tsx`: **47 inline styles**
- `src/app/waitlist/page.tsx`: **53 inline styles**
- `src/app/settings/forms/[id]/page.tsx`: **45 inline styles**

Combined: **145 inline styles** → target **≤ 45 combined**

## Analysis

### notes/[id]/edit/page.tsx (47)

After plan 01 (icon migration) removes ~3, expect ~44 remaining.

1. **Page shell** (~6): `minHeight: 'calc(100vh - 3rem)'`, scroll container, padding. → `NoteEdit.module.css`
2. **Editor toolbar** (~10): The rich-text toolbar is already Card-wrapped; remaining `style` props on toolbar buttons (padding, gap, fontSize). → CSS module `.toolbarBtn`
3. **Section heading area** (~5): Service name/client link spans. → `<Text>` + keep unique parts inline
4. **Split-button pattern** (~3): Save button + dropdown chevron with custom borderRadius. → Comment as `// ds-exempt: split-button border-radius`. Consider if Button should get a `splitLeft`/`splitRight` variant.
5. **AI block** (~8): AI typing indicator, section styling. → CSS module `.aiBlock`, `.aiHeader`
6. **Note content area** (~12): The note editor flex layout, scroll container, content max-width. → CSS module `.noteBody`, `.editorArea`, `.sidebar`

### waitlist/page.tsx (53)

After plan 01 (icon migration removes ~16), expect ~37 remaining.

1. **Inline SVG components** (~4): The `Sun`, `Moon`, `SunMedium`, `MapIcon` SVGs at the top of the file with `style={{ width: 16, height: 16 }}`. These are legitimate — keep inline (they're the SVG's own `style`, not page layout).
2. **Filter panel** (~8): Screener/filter drawer layout. → `waitlist.module.css` (already exists) — add `.filterPanel`, `.filterRow`
3. **Screener entry rows** (~8): Row layout in the screener list. → `.screenerRow`, `.screenerCell`
4. **Text spacing** (~10): `mb`/`mt` props (plan 00)
5. **Unique one-offs** (~7): Sentiment indicator styling, custom slider, toggle UI

### settings/forms/[id]/page.tsx (45)

After plan 01 (icon migration removes ~5), expect ~40 remaining.

1. **Form builder shell** (~8): The two-column form builder layout. → `FormEdit.module.css`
2. **Field preview cards** (~10): Field type preview cards — dynamic per field type. Some to CSS module, some stay (dynamic `borderColor` etc.)
3. **Text spacing** (~10): `mb`/`mt` props
4. **Label styling** (~4): Migrate `<label style=...>` to `<Form.Item label="...">` (AntD Form.Item directly — FormLabel DS wrapper removed)
5. **Unique one-offs** (~8): Drag handle, reorder indicator, field type badge custom colors

## CSS module additions

### NoteEdit.module.css (new — scaffolded in plan 00)

```css
.shell { min-height: calc(100vh - 3rem); background-color: rgba(249, 250, 251, 0.3); }
.layout { display: flex; }
.editorCol { flex: 1; overflow-y: auto; padding: 24px; background-color: #fff; max-height: calc(100vh - 6rem); }
.editorBody { max-width: 768px; margin: 0 auto; }
.sidebar { width: 320px; overflow-y: auto; padding: 16px; border-left: 1px solid var(--color-border); }
.aiBlock { border-radius: 8px; border: 1px solid #e9d5ff; padding: 16px; background-color: rgba(130, 80, 255, 0.05); }
.aiBlockHeader { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
```

### waitlist.module.css (already exists — add to it)

```css
.filterPanel { padding: 0 0 8px; }
.screenerRow { display: flex; gap: 16px; padding: 12px 16px; border-bottom: 1px solid var(--color-border); }
```

### FormEdit.module.css (new — scaffolded in plan 00)

```css
.shell { display: flex; gap: 0; min-height: calc(100vh - 3rem); }
.fieldList { width: 320px; border-right: 1px solid var(--color-border); overflow-y: auto; }
.previewCol { flex: 1; padding: 24px; overflow-y: auto; }
.fieldCard { border-radius: 8px; border: 1px solid var(--color-border); padding: 12px 16px; margin-bottom: 8px; }
.dragHandle { cursor: grab; color: var(--color-text-secondary); }
```

## Chrome MCP verification

- `/notes/1/edit` — editor renders, toolbar icons correct, AI block visible
- `/waitlist` — filter panel, screener rows
- `/settings/forms/1` — form builder two-column layout

## Acceptance criteria

- [ ] `grep -c 'style={{' "src/app/notes/[id]/edit/page.tsx"` ≤ 15
- [ ] `grep -c 'style={{' src/app/waitlist/page.tsx` ≤ 15
- [ ] `grep -c 'style={{' "src/app/settings/forms/[id]/page.tsx"` ≤ 15
- [ ] CSS modules created/extended for all three files
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] Chrome MCP: all 3 pages verified

## Open questions

- The split-button pattern in notes/edit (two `<Button>` with custom `borderRadius` to merge into one visual unit) — should Button get `splitLeft`/`splitRight` shape variants? Only appears in one place, so probably not worth a new variant. Mark as `// ds-exempt: split-button`.
