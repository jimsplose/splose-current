# Section 2 — DS adoption gaps (new components needed)

Patterns that appear on 2+ pages with no existing DS component. Priority: **High** = 5+ occurrences, **Medium** = 3-4, **Low** = 2.

Each entry includes occurrences, example snippet, proposed API, and a rationale.

---

## NewDS-1: `Icon` (size + tone wrapper) — **High priority**

**Occurrences:** 130+ across nearly all top-20 files (every page uses at least 3).

**Files (sample):**
- `src/app/settings/data-import/page.tsx` (×10+ — lines 125, 128, 136, 175, 182, 192, 199, 212, 241, 281)
- `src/app/waitlist/page.tsx` (×16+ — 541, 573, 613, 632, 650, 746, 766, 894, 914, 928, 932, 936, 957, 964, 995, 1043)
- `src/app/notes/[id]/edit/page.tsx` (×18+ — rich text toolbar 307, 312, 313, 324, 347, 350, 351, 355, 358, 361, 364, 368, 371, 374, 377, 380, 383, 386)
- `src/app/DashboardClient.tsx` (×25+)
- `src/app/online-booking/page.tsx` (×18+)

**Example snippet** (from `src/app/settings/data-import/page.tsx:125`):
```tsx
<MessageOutlined style={{ fontSize: 16 }} /> Chat with us
```

**Proposed API:**
```tsx
// src/components/ds/Icon.tsx
import type { ComponentType, SVGProps } from "react";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
type IconTone = "default" | "secondary" | "tertiary" | "primary" | "success" | "warning" | "danger" | "inverted";

interface IconProps {
  as: ComponentType<SVGProps<SVGSVGElement>>; // or an AntD IconComponentProps
  size?: IconSize;     // default: "md" → 16px
  tone?: IconTone;     // default: "default"
  className?: string;
}

// Usage:
<Icon as={MessageOutlined} size="md" />
<Icon as={DeleteOutlined} size="sm" tone="secondary" />
```

**Size token map:** `xs: 12, sm: 14, md: 16, lg: 20, xl: 24, 2xl: 32, 3xl: 40` (cover the current range of inline values).

**Priority:** **High** (by a wide margin). This single component reduces the inline-style count by ~15% across the codebase.

**Rationale:** Icon sizing is the most inlined style in the entire app. A thin wrapper with a `size` prop centralises a token system for fontSize, and a `tone` prop keeps icon colors aligned with DS palette. Storybook recipe should show every size + tone combination. Migration is mechanical (codemod-friendly).

---

## NewDS-2: `FeatureCard` (tinted card with inverted text) — **Medium priority**

**Occurrences:** 4 blocks across 3 files.

**Files:**
- `src/app/clients/[id]/ClientDetailClient.tsx:282` — Account balance primary-tinted card
- `src/app/DashboardClient.tsx` — similar tinted widgets (2 blocks)
- Likely: more as the dashboard matures

**Example snippet** (from `src/app/clients/[id]/ClientDetailClient.tsx:282`):
```tsx
<div style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary)', padding: 16, color: 'white' }}>
  <Flex justify="space-between" align="center">
    <Text variant="label/lg" as="h3" style={{ color: 'white' }}>Account balance</Text>
    <HintIcon style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.8)' }} />
  </Flex>
  …
</div>
```

**Proposed API:**
```tsx
// src/components/ds/FeatureCard.tsx
interface FeatureCardProps {
  tone?: "primary" | "success" | "neutral" | "inverted"; // default: "primary"
  padding?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

// Inside: wraps Card with the correct bg/text-color pairing + context so HintIcon/Text
// inside the card can detect inverted mode via CSS vars.
```

Note this pairs with `ExtendDS:Text:tone="inverted"` and `ExtendDS:HintIcon:tone="inverted"` (Section 3) so the children automatically look right.

**Priority:** **Medium** — only 4 blocks today, but dashboard growth is likely to drive more.

**Rationale:** Colored/filled cards with inverted text are a distinctive marketing/dashboard pattern. Getting this right in one component prevents drift as more tinted widgets appear.

---

## NewDS-3: `IconButton` (small icon-only button) — **Medium priority**

**Occurrences:** 8+ across 4 files.

**Files:**
- `src/app/settings/forms/[id]/page.tsx:134` (delete field button)
- `src/app/settings/forms/[id]/page.tsx:210` (close side panel)
- `src/app/waitlist/page.tsx:743, 891` (close chip)
- `src/app/settings/progress-notes/edit/[id]/page.tsx:160`
- Various `<button style={{ borderRadius: 4, padding: 4, color: 'var(--color-text-secondary)' }}>` across settings pages

**Example snippet** (from `src/app/settings/forms/[id]/page.tsx:134`):
```tsx
<button onClick={() => removeField(field.id)} style={{ borderRadius: 4, padding: 4, color: 'var(--color-text-secondary)' }}>
  <DeleteOutlined style={{ fontSize: 14 }} />
</button>
```

**Proposed API:**
```tsx
// src/components/ds/IconButton.tsx
interface IconButtonProps {
  icon: React.ReactNode;           // pre-sized Icon or inline SVG
  tone?: "default" | "secondary" | "danger";
  shape?: "square" | "circle";      // square = rounded 4, circle = 50%
  size?: "xs" | "sm" | "md";
  onClick?: () => void;
  "aria-label": string;             // REQUIRED — accessibility
}
```

**Alternative consolidation:** add `iconOnly: boolean` + `shape: "square" | "circle"` to the existing Button component. That keeps the component count lower.

**Decision:** **Pair with ExtendDS-Button:iconOnly** rather than introducing a new component. See Section 3.

**Priority:** **Medium** (either way — new component OR extension prop) — 8+ occurrences.

---

## NewDS-4: `ProgressBar` — **Low priority**

**Occurrences:** 2 blocks.

**Files:**
- `src/app/reports/page.tsx:444-446` (practitioner utilisation bars)
- Possibly 1-2 other places (outside top 20)

**Example snippet**:
```tsx
<div style={{ height: 6, width: 64, borderRadius: 9999, backgroundColor: 'var(--color-fill-secondary)' }}>
  <div style={{ height: 6, borderRadius: 9999, backgroundColor: 'var(--color-primary)', width: `${Math.min(p.utilisation * 10, 100)}%` }} />
</div>
```

**Proposed API:**
```tsx
interface ProgressBarProps {
  value: number;                // 0–100
  tone?: "default" | "success" | "warning" | "danger";
  size?: "xs" | "sm" | "md";
  className?: string;
}
```

**Priority:** **Low** — two occurrences today. Could wait until there's a third.

---

## NewDS-5: `StatusIndicator` (success/warning/error filled circle with icon) — **Low priority**

**Occurrences:** 2 distinct blocks.

**Files:**
- `src/app/payments/new/page.tsx:156-158` (success checkmark in payment-completed screen)
- `src/app/settings/data-import/page.tsx` (inside uploaded-status rows, see Section 1 #7)

**Example snippet** (from `src/app/payments/new/page.tsx:156-158`):
```tsx
<Flex style={{ height: 56, width: 56, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)' }}>
  <CheckCircleOutlined style={{ fontSize: 32, color: 'var(--color-success)' }} />
</Flex>
```

**Proposed API:**
```tsx
interface StatusIndicatorProps {
  tone: "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";    // 32/48/64 px
  icon?: React.ReactNode;        // defaults to per-tone icon (check / warning / alert / info)
}
```

**Priority:** **Low** — two occurrences. Could wait.

---

## NewDS-6: `InvoiceAccentBar` — **Low priority**

**Occurrences:** 2 (both invoice files).

**Files:**
- `src/app/invoices/[id]/page.tsx:49`
- `src/app/invoices/[id]/InvoiceDetailClient.tsx:154`

**Example snippet**:
```tsx
<div style={{ height: 8, borderRadius: '8px 8px 0 0', background: 'linear-gradient(to right, #a855f7, #22c55e, #facc15)' }} />
```

**Priority:** **Low** — niche to invoices. Consider only if invoice visual treatment expands; otherwise keep inline.

---

## NewDS-7: Optional — `ButtonGroup` — **Low priority**

**Occurrences:** 3 (segmented button groups).

**Files:**
- `src/app/notes/[id]/edit/page.tsx:320, 323` (primary + dropdown seam: `borderRadius: '8px 0px 0px 8px'` + `'0px 8px 8px 0px'`)
- Possibly elsewhere in form contexts

**Proposed API:**
```tsx
<ButtonGroup>
  <Button variant="primary">Save</Button>
  <Button variant="primary" iconOnly><DownOutlined/></Button>
</ButtonGroup>
```

**Priority:** **Low** — 3 occurrences.

---

## Summary

| # | Component | Occurrences | Priority |
|---|---|---|---|
| 1 | Icon | 130+ | **High** |
| 2 | FeatureCard | 4 | Medium |
| 3 | IconButton *(prefer Button:iconOnly)* | 8+ | Medium |
| 4 | ProgressBar | 2 | Low |
| 5 | StatusIndicator | 2 | Low |
| 6 | InvoiceAccentBar | 2 | Low |
| 7 | ButtonGroup | 3 | Low |

**Only one High-priority new component.** The rest are relatively small in occurrence count; ExtendDS props on existing components (Section 3) will have more leverage than new components in most cases.
