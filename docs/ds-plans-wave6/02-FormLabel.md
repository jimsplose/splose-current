# Wave 6 · Plan 02 — FormLabel: new DS component + 27 callers

**Status:** Planned
**Estimated effort:** 30 min
**Model:** Sonnet
**Thinking:** think
**Must run after:** Plan 00

## What this plan does

Creates a new `FormLabel` DS component that absorbs the `<label style={{ display: 'block', fontSize: 12/14, fontWeight: 500/600, marginBottom: 8 }}>` pattern that repeats across 10+ settings pages.

## Pattern being absorbed

Current pattern (appears 27 times across 10 files):

```tsx
// Variant A — 14px/600 (most common, settings form labels)
<label style={{ display: 'block', fontSize: 14, fontWeight: 600, lineHeight: 1.57, color: 'var(--color-text)', marginBottom: 4 }}>
  Label text
</label>

// Variant B — 12px/500 (compact labels, online-bookings)
<label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
  Label text
</label>

// Variant C — with required asterisk
<label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
  Label text <span style={{ color: '#ef4444' }}>*</span>
</label>

// Variant D — inline-flex with HintIcon
<label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
  Label text <HintIcon tooltip="..." />
</label>
```

## Proposed FormLabel API

```tsx
// src/components/ds/FormLabel.tsx
interface FormLabelProps {
  children: ReactNode;
  required?: boolean;          // appends red asterisk
  hint?: string;               // shows HintIcon with tooltip
  size?: 'sm' | 'md';         // sm = 12px/500, md = 14px/600 (default)
  mb?: number;                 // marginBottom in px (default: 4)
  htmlFor?: string;            // forwarded to <label>
  as?: 'label' | 'div';       // default 'label'
  className?: string;
  style?: CSSProperties;
}
```

Renders as:
```tsx
<label htmlFor={htmlFor} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: size === 'sm' ? 12 : 14, fontWeight: size === 'sm' ? 500 : 600, lineHeight: size === 'sm' ? 1.67 : 1.57, color: 'var(--color-text)', marginBottom: mb ?? 4, ...style }}>
  {children}
  {hint && <HintIcon tooltip={hint} />}
  {required && <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>}
</label>
```

**CSS module:** Extract the label base styles into `FormLabel.module.css` with `.root`, `.rootSm` classes. Keep inline only for `mb` (dynamic) and `style` passthrough.

## Target files and caller counts

| File | `<label style=` count | Notes |
|---|---|---|
| `src/app/settings/details/page.tsx` | 9 | Mix of size md + required |
| `src/app/settings/forms/[id]/page.tsx` | 4 | Size md |
| `src/app/settings/online-bookings/[id]/page.tsx` | 3 | Size sm |
| `src/app/settings/custom-fields/page.tsx` | 2 | Size md |
| `src/app/settings/appointment-templates/new/page.tsx` | 2 | Size md + required |
| `src/app/settings/progress-notes/edit/[id]/page.tsx` | 1 | Size md |
| `src/app/settings/payment-settings/page.tsx` | 1 | Size sm |
| `src/app/settings/letter-templates/edit/[id]/page.tsx` | 1 | Size md |
| `src/app/settings/invoice-settings/page.tsx` | 1 | Size md |
| `src/app/settings/email-templates/edit/[id]/page.tsx` | 1 | Size md |

## Storybook stories

- `Playground` — all controls
- `Default` — label only
- `WithRequired` — label + asterisk
- `WithHint` — label + HintIcon
- `CompactSize` — size="sm"
- `Recipe: SettingsFormRow` — label + input in a form row (from settings/details)

## DS catalog update

Add FormLabel to `docs/reference/ds-component-catalog.md`.

## Chrome MCP verification

Visit `/settings/details` — verify labels are 14px/600, required asterisks appear red, HintIcon tooltips work.

## Acceptance criteria

- [ ] `src/components/ds/FormLabel.tsx` exists and exports `FormLabel`
- [ ] `src/components/ds/FormLabel.module.css` exists
- [ ] `src/components/ds/index.ts` exports `FormLabel`
- [ ] `docs/reference/ds-component-catalog.md` updated
- [ ] All 27 `<label style=...>` callers migrated across 10 files
- [ ] `grep -rn '<label style=' src/app/ --include='*.tsx'` returns 0
- [ ] Storybook stories written (Playground + 4 feature + 1 recipe)
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] Chrome MCP: `/settings/details` label styles verified

## Open questions

None. Pattern is well-understood and API is straightforward.
