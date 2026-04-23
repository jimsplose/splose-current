# Section 3 — DS extension gaps (existing components need props)

Existing DS components being bypassed because they lack a prop. Priority: **High** = 5+ occurrences, **Medium** = 3-4, **Low** = 2.

---

## Extend-1: `Text` — missing `weight` prop — **High priority**

**Occurrences of inline workaround:** 20+ across 6+ files.

**Files (sample):**
- `src/app/invoices/[id]/InvoiceDetailClient.tsx:171, 187, 197, 203, 208, 218, 222, 226, 276, 280` (×10+)
- `src/app/invoices/[id]/page.tsx:127, 151, 163, 171, 177, 185, 189, 193` (all `body/md-strong` with fontSize + color inline)
- `src/app/DashboardClient.tsx:269` (`style={{ fontWeight: 500 }}`)
- `src/app/settings/body-charts/page.tsx:150` (Td with fontWeight 500)
- `src/app/settings/tags/page.tsx:198` (span with fontWeight 600)
- `src/app/reports/uninvoiced/page.tsx:60, 61` (span with fontWeight 600)

**Example inline workaround** (from `src/app/invoices/[id]/InvoiceDetailClient.tsx:171`):
```tsx
<Text variant="body/sm" as="h3" color="text" style={{ marginBottom: 4, fontWeight: 700 }}>Client</Text>
```

**Proposed prop addition:**
```tsx
// src/components/ds/Text.tsx
export type TextWeight = "regular" | "medium" | "bold";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  weight?: TextWeight;        // overrides the variant's default weight
  // ... existing props
}

// Usage:
<Text variant="body/sm" as="h3" color="text" weight="bold">Client</Text>
```

**Existing consumer count:** Text has 16 direct imports + heavy usage internally. The prop is **additive** (doesn't change existing behaviour — variants keep their default weight when `weight` is omitted). Zero breakage.

**Priority:** **High** — 20+ inline workarounds eliminated by one prop. No breaking change.

**Rationale:** Designers often want to override the variant's default weight for emphasis without jumping to a larger variant. The existing `body/md-strong` and `body/lg-strong` variants only cover two specific cases; a `weight` override provides general-purpose control.

---

## Extend-2: `Text` — missing `heading/xl` (and `label/sm-strong`?) variants — **Medium priority**

**Occurrences:** 8–10 across 3 files.

**Files:**
- `src/app/invoices/[id]/page.tsx:56` — `<h2 style={{ fontSize: 26, fontWeight: 500 }}>` (invoice title)
- `src/app/settings/ai/page.tsx:91, 103, 118, 127` — `<h3/h4 style={{ fontSize: 28, fontWeight: 700 }}>` (×4)
- `src/components/ds/DetailPage.tsx:45` — `<h1 style={{ fontSize: 30, fontWeight: 700, color: "rgb(66, 105, 74)", fontFamily: "Sprig Sans..." }}>` (this is the **DS template hardcoding!** See Section 4b below)
- `src/components/ds/Navbar.tsx:41` — same 30px/700/Sprig Sans green title

**Example inline workaround** (from `src/components/ds/DetailPage.tsx:45`):
```tsx
<h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", lineHeight: 1.2, color: "rgb(66, 105, 74)" }}>
  {title}
</h1>
```

**Proposed variant additions:**

```tsx
// src/components/ds/Text.tsx
export type TextVariant =
  | "display/lg" | "display/md" | "display/sm" | "display/xs"
  | "heading/xl" | "heading/lg" | "heading/md" | "heading/sm"   // ← add heading/xl (28px)
  | "page-title"                                                 // ← add page-title (30px, Sprig Sans, green)
  | "body/lg" | "body/md" | "body/sm" | "body/md-strong" | "body/lg-strong"
  // ... existing
```

- `heading/xl` — 26–28px, weight 600–700, default color (replaces invoices/ai title inlines)
- `page-title` — 30px, weight 700, `'Sprig Sans'` family, green color (replaces DetailPage/Navbar hardcoding)

**Existing consumer count:** Text = 16. Additive. Zero breakage.

**Priority:** **Medium** — fewer occurrences but the `page-title` variant has **structural importance** (unlocks Section 4b's DS-template cleanup).

---

## Extend-3: `Text` — expand `color` to include `inverted` — **Medium priority**

**Occurrences:** 5-6 across 3 files (paired with FeatureCard contexts).

**Files:**
- `src/app/clients/[id]/ClientDetailClient.tsx:284, 340` (white text on primary bg)
- `src/app/DashboardClient.tsx` (tooltip / primary-tinted panels)

**Example inline workaround**:
```tsx
<Text variant="label/lg" as="h3" style={{ color: 'white' }}>Account balance</Text>
```

**Proposed prop addition:**
```tsx
// Text already has: text | secondary | tertiary | primary | danger | warning | success
// Add:                                                                      ↓
//   "inverted" — pure white, optimised for use on colored backgrounds
export type TextColor = "text" | "secondary" | "tertiary" | "primary" | "danger" | "warning" | "success" | "inverted" | (string & {});
```

**Priority:** **Medium** — pairs with FeatureCard adoption. Low individual count but completes the "colored card" story.

---

## Extend-4: `Divider` — missing `orientation="vertical"` — **High priority**

**Occurrences:** 8+ across 3+ files.

**Files:**
- `src/app/notes/[id]/edit/page.tsx:353, 366` (rich-text toolbar dividers)
- `src/app/settings/details/page.tsx:165, 167, 175` (rich-text toolbar dividers, 3+)
- Pattern likely appears in every rich-text toolbar

**Example inline workaround**:
```tsx
<span style={{ height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />
```

**Proposed prop addition:**
```tsx
// src/components/ds/Divider.tsx
interface DividerProps {
  orientation?: "horizontal" | "vertical";    // ← add
  variant?: "default" | "subtle" | "primary";
  spacing?: "none" | "sm" | "md" | "lg";
}

// Usage:
<Divider orientation="vertical" />
```

**Existing consumer count:** Divider = 12. Additive. Zero breakage.

**Priority:** **High** — 8+ occurrences, all identical 3-line patterns.

---

## Extend-5: `Button` — missing `shape="pill"` — **High priority**

**Occurrences:** 10+ across 3+ files.

**Files:**
- `src/app/reports/page.tsx:271, 276, 283` (filter buttons ×4+)
- `src/app/settings/details/page.tsx:149, 157` (Business/User selectors)
- `src/app/reports/page.tsx:81` (date-range trigger button)

**Example inline workaround**:
```tsx
<Button variant="secondary" size="sm" style={{ borderRadius: 9999 }}>{locationLabel}</Button>
```

**Proposed prop addition:**
```tsx
// src/components/ds/Button.tsx
interface ButtonProps {
  // ... existing
  shape?: "default" | "pill";  // default = current rounded-4
}
```

**Existing consumer count:** Button = 45. Additive. Zero breakage.

**Priority:** **High** — 10+ occurrences, and the pill-shape is used across the reports UI as a filter convention.

---

## Extend-6: `Button` — missing `variant="link"` — **Medium priority**

**Occurrences:** 6 across 4 files.

**Files:**
- `src/app/clients/[id]/ClientDetailClient.tsx:277` (with manual onMouseEnter/Leave for underline)
- `src/app/notes/[id]/page.tsx:39` (`<Link style={{ color: ..., fontSize: 14 }}>` — could be Button as="a")
- `src/app/settings/details/page.tsx:135, 230` (`<Text color="primary" style={{ cursor: 'pointer' }}>`)
- `src/components/ds/Navbar.tsx:31` (`<Link style={{ color, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>`)

**Example inline workaround** (from `src/app/clients/[id]/ClientDetailClient.tsx:277`):
```tsx
<Button variant="ghost" size="sm" style={{ color: 'var(--color-primary)' }} onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; e.currentTarget.style.background = 'transparent'; }} onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}>
  View change log
</Button>
```

**Proposed prop addition:**
```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "icon" | "toolbar" | "link";
  // ... existing
}
// link variant: primary-colored text, no background, underline on hover — rendered as <a> when href given.
```

**Existing consumer count:** Button = 45. Additive for new variant value. Zero breakage.

**Priority:** **Medium** — 6 occurrences. The `onMouseEnter/Leave` JS hack in ClientDetailClient is the most painful example.

---

## Extend-7: `Button` — `iconOnly` prop (or NewDS:IconButton — see Section 2) — **Medium priority**

See Section 2 item #3. Decision: prefer **Button:iconOnly + shape** over a new IconButton component, to keep component count lower.

```tsx
interface ButtonProps {
  iconOnly?: boolean;            // removes padding, centres icon
  shape?: "default" | "pill" | "circle";  // circle for icon-only buttons
}
```

**Priority:** **Medium** — 8+ occurrences.

---

## Extend-8: `Card` — missing `tint` prop — **Medium priority**

**Occurrences:** 8 across 4 files.

**Files:**
- `src/app/invoices/[id]/InvoiceDetailClient.tsx:279` (`background: '#f9fafb'`)
- `src/app/invoices/[id]/page.tsx:294, 310` (`background: 'var(--color-fill-secondary|tertiary)'`)
- `src/app/settings/online-bookings/[id]/page.tsx:107, 316, 356, 363` (tinted panels)
- `src/app/settings/data-import/page.tsx:118` (`backgroundColor: 'var(--color-fill-tertiary)'`)

**Example inline workaround** (from `src/app/settings/data-import/page.tsx:118`):
```tsx
<Flex align="flex-start" gap={16} style={{ marginBottom: 32, borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: 24 }}>
```

**Proposed prop addition:**
```tsx
interface CardProps {
  tint?: "default" | "subtle" | "muted";   // maps to fill-secondary / tertiary / quaternary
  // ... existing
}
```

**Existing consumer count:** Card = 25. Additive. Zero breakage.

**Priority:** **Medium** — 8 occurrences.

---

## Extend-9: `Card` — missing `variant="dashed"` — **Low priority**

**Occurrences:** 3 across 3 files (all upload/empty drop zones).

**Files:**
- `src/app/settings/data-import/page.tsx:211` (CSV upload zone)
- `src/app/settings/online-bookings/[id]/page.tsx:107` (logo upload)
- `src/app/settings/forms/[id]/page.tsx:191` (form upload)

**Example inline workaround**:
```tsx
<Flex vertical align="center" gap={12} style={{ borderRadius: 8, border: '2px dashed var(--color-border)', padding: 40 }}>
```

**Proposed prop addition:**
```tsx
interface CardProps {
  variant?: "default" | "dashed";
  // ... existing
}
```

**Alternative:** most of these are `<FileUpload>` use cases. **AdoptAsIs:FileUpload** may cover it already — verify and prefer adoption.

**Priority:** **Low** — 3 occurrences, and FileUpload may already cover most.

---

## Extend-10: `Card` — `interactive` prop — **Medium priority**

**Occurrences:** 3 across 1 file (but pattern likely appears elsewhere).

**Files:**
- `src/app/settings/data-import/page.tsx:191, 198` (CSV/Cliniko import choice tiles rendered as `<button>` with card styling)

**Example inline workaround**:
```tsx
<button type="button" onClick={handleImportNext} style={{ display: 'flex', flexDirection: 'column', ..., borderRadius: 8, border: '1px solid var(--color-border)', padding: 24, ..., cursor: 'pointer', backgroundColor: 'transparent' }}>
```

**Proposed prop addition:**
```tsx
interface CardProps {
  interactive?: boolean;           // adds hover/focus states and renders as <button>
  onClick?: () => void;            // required if interactive
  // ... existing
}
```

**Priority:** **Medium** — 3 occurrences, and the pattern will recur whenever a card is clickable (settings tiles, dashboard widgets).

---

## Extend-11: `Badge` — missing `size` prop — **Medium priority**

**Occurrences:** 6 across 3 files.

**Files:**
- `src/app/waitlist/page.tsx:738, 886` (service tags, tag tags)
- `src/app/invoices/[id]/InvoiceDetailClient.tsx:112` (status badge in header)

**Example inline workaround**:
```tsx
<Badge key={service} variant="blue" style={{ borderRadius: 8, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
```

**Proposed prop addition:**
```tsx
interface BadgeProps {
  size?: "sm" | "md" | "lg";      // md = current; sm/lg adjust font + padding
  // ... existing
}
```

**Existing consumer count:** Badge = 18. Additive. Zero breakage.

**Priority:** **Medium** — 6 occurrences.

---

## Extend-12: `HintIcon` — `tone="inverted"` — **Low priority**

**Occurrences:** 3 in one file (ClientDetailClient).

**Files:**
- `src/app/clients/[id]/ClientDetailClient.tsx:285, 286, 291`

**Example inline workaround**:
```tsx
<HintIcon style={{ height: 20, width: 20, borderColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.8)' }} />
```

**Proposed prop addition:**
```tsx
interface HintIconProps {
  tone?: "default" | "inverted";    // inverted = semi-transparent white for use on colored bg
  size?: "sm" | "md" | "lg";        // current has no size options
}
```

**Priority:** **Low** — 3 occurrences, all in one file. But pair with FeatureCard + Text:inverted for coherent "colored card" story.

---

## Extend-13: `ColorDot` — `interactive` / `shape` — **Low priority**

**Occurrences:** 2 distinct patterns (one per spec Finding 4).

**Files:**
- `src/app/settings/online-bookings/[id]/page.tsx:137` (8 color swatches — interactive selectable)
- `src/app/settings/tags/page.tsx:162` (rectangle color preview, not circle)

**Example inline workaround** (from `src/app/settings/online-bookings/[id]/page.tsx:137`):
```tsx
<button style={{ height: 28, width: 28, borderRadius: '50%', border: '2px solid transparent', backgroundColor: color, cursor: 'pointer' }} />
```

**Proposed prop additions:**
```tsx
interface ColorDotProps {
  shape?: "circle" | "rect";        // rect for tag palette previews
  interactive?: boolean;             // adds cursor + focus border
  selected?: boolean;                // adds a selection ring
  onClick?: () => void;
  // ... existing size, color
}
```

**Priority:** **Low** — 2 occurrences.

---

## Extend-14: `FormInput` — disabled styling fix (bug, not a prop) — **Medium priority**

**Occurrences:** 3 in one file — but likely more across disabled-state usages.

**Files:**
- `src/app/settings/details/page.tsx:93, 102, 108` — `<FormInput disabled style={{ backgroundColor: '#f3f4f6' }} />`

**Issue:** the disabled state should already have the grey fill. The fact that all three callers add an identical inline style indicates FormInput's internal disabled treatment isn't firing. Fix inside the component, no API change needed.

**Priority:** **Medium** — not a prop addition, but a real bug that repeats across the disabled-input pattern.

---

## Summary

| # | Component | Prop/fix | Occurrences | Priority |
|---|---|---|---|---|
| 1 | Text | `weight` | 20+ | **High** |
| 2 | Text | new variants `heading/xl`, `page-title` | 8-10 | Medium |
| 3 | Text | `color="inverted"` | 5-6 | Medium |
| 4 | Divider | `orientation="vertical"` | 8+ | **High** |
| 5 | Button | `shape="pill"` | 10+ | **High** |
| 6 | Button | `variant="link"` | 6 | Medium |
| 7 | Button | `iconOnly` + `shape="circle"` | 8+ | Medium |
| 8 | Card | `tint` | 8 | Medium |
| 9 | Card | `variant="dashed"` | 3 | Low |
| 10 | Card | `interactive` | 3 | Medium |
| 11 | Badge | `size` | 6 | Medium |
| 12 | HintIcon | `tone="inverted"` + `size` | 3 | Low |
| 13 | ColorDot | `shape`, `interactive`, `selected` | 2 | Low |
| 14 | FormInput | internal disabled fix | 3 | Medium |

**3 High-priority extensions** drive the most leverage:
- `Text:weight` — 20+ fixes
- `Divider:vertical` — 8+ fixes
- `Button:shape="pill"` — 10+ fixes

Each is a 10-line change to a heavily-used component, all additive, zero breakage. Top-3 ExtendDS sessions will eliminate ~40 inline styles across the codebase.
