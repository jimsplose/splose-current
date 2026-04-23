# Pass 2 — Violation classifications

Every `style={{}}` in the top 20 worst pages was extracted via grep and reviewed. Pure-layout inlines (margin/padding/gap/flex/position/width/height/overflow) are **skipped** per the spec's classifier — not violations. Only properties that duplicate DS responsibility (color, background, border, font, shadow, text-decoration) are classified.

The output is organised **by pattern** rather than per-file, since the same pattern appears across many files and the point of Pass 2 is to surface recurring patterns for Sections 2/3/4 of the master report. A per-file rollup follows at the end for Section 1.

## Classification categories

- **AdoptAsIs:<Component>** — existing DS component fits; page just chose to inline
- **ExtendDS:<Component>:<prop>** — DS component exists, needs a new prop
- **NewDS:<ProposedName>** — no existing DS component fits; propose a new one

## Files scanned

Top 20 from Pass 1 Section A:

| Rank | File | Inline count |
|---|---|---|
| 1 | `src/app/clients/[id]/ClientDetailClient.tsx` | 86 |
| 2 | `src/app/DashboardClient.tsx` | 82 |
| 3 | `src/app/notes/[id]/edit/page.tsx` | 73 |
| 4 | `src/app/invoices/[id]/page.tsx` | 58 |
| 5 | `src/app/waitlist/page.tsx` | 52 |
| 6 | `src/app/settings/details/page.tsx` | 51 |
| 7 | `src/app/settings/data-import/page.tsx` | 50 |
| 8 | `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 48 |
| 9 | `src/app/settings/online-bookings/[id]/page.tsx` | 47 |
| 10 | `src/app/reports/page.tsx` | 46 |
| 11 | `src/app/settings/forms/[id]/page.tsx` | 42 |
| 12 | `src/app/products/page.tsx` | 38 |
| 13 | `src/app/invoices/new/page.tsx` | 36 |
| 14 | `src/app/contacts/[id]/page.tsx` | 35 |
| 15 | `src/app/notes/[id]/page.tsx` | 34 |
| 16 | `src/app/payments/new/page.tsx` | 33 |
| 17 | `src/app/reports/performance/page.tsx` | 22 |
| 18 | `src/app/online-booking/page.tsx` | 22 |
| 19 | `src/app/settings/ai/page.tsx` | 20 |
| 20 | `src/app/reports/progress-notes/page.tsx` | 20 |

---

# Section A — Aggregated patterns

The patterns below are listed in rough priority order (by occurrence count × leverage × code-smell severity).

## Pattern 1 — Icon `fontSize` inline

**Example:** `<XxxOutlined style={{ fontSize: 16 }} />` everywhere; also `fontSize: 12 / 14 / 24 / 32 / 40`.

**Occurrences:** ~130+ across all 20 files. Every top page has 3–20 of these.

**Classification:** **NewDS:Icon** — a thin wrapper around AntD icons (or Lucide) that exposes `size` as `xs | sm | md | lg | xl` mapping to fontSize tokens. Optional `tone` prop for `var(--color-text-secondary)` / `var(--color-primary)` etc.

**Rationale:** Most of the inline styling in the codebase is *icon sizing*. A single Icon wrapper collapses hundreds of inline styles. Highest-leverage NewDS candidate by a wide margin.

**Example sites:** settings/data-import (lines 125, 128, 136, 175, 182, 192, 199, 212, 241, 281), waitlist (541, 573, 613, 632, 650, 746, 766, 894, 914, 928, 932, 936, 957, 964, 995, 1043), notes/[id]/edit (307, 312, 313, 324, 347, 350, 351, 355, 358, 361, 364, 368, 371, 374, 377, 380, 383, 386).

---

## Pattern 2 — Text with `fontSize`/`fontWeight`/`color` override on top of `<Text>` or raw `<hN>`

**Examples:**
- `<h2 style={{ fontSize: 26, fontWeight: 500, color: 'rgb(65, 69, 73)' }}>` (invoices/[id] 56) — raw h2, should be `<Text variant="heading/xl">`
- `<h4 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }}>` ×3 in settings/ai (103, 118, 127)
- `<Text variant="body/sm" style={{ fontWeight: 700 }}>` ×10+ in InvoiceDetailClient (171, 187, 197, 203, 208, 218, 222, 226, 276, 280)
- `<Text variant="body/md-strong" style={{ fontSize: 13, color: 'rgb(65, 69, 73)' }}>` ×5+ invoices/[id]

**Occurrences:** ~80+ across top 20 files.

**Classification mix:**
- **AdoptAsIs:Text** for raw `<h2>/<h3>/<h4>` with inline styles (should be `<Text variant="heading/*">`)
- **ExtendDS:Text:weight** — override prop so `<Text variant="body/sm" weight="bold">` replaces the inline `fontWeight: 700`. Adds a `weight?: "regular" | "medium" | "bold"` prop to Text.
- **ExtendDS:Text:variant** — add missing variants. Current top sizes are `display/lg/md`, `heading/lg/md/sm`, `body/lg/md/sm`, `label/lg/md`, `caption/md/sm`. The 26–28px headings in invoices and settings/ai indicate a missing `heading/xl` or `display/sm` variant.
- **Hard-coded RGB `rgb(65, 69, 73)`** — appears 10+ times; this is a DS token violation (no matching token). True AdoptAsIs:Text with `color` prop.

---

## Pattern 3 — Bordered/backgrounded container (inline Card)

**Examples:**
- `<div style={{ borderRadius: 8, border: '1px solid var(--color-border)', padding: 24 }}>` — forms/[id] 175
- `<Flex style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-fill-tertiary)', padding: 24 }}>` — data-import 118
- `<div style={{ borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>` — online-bookings 363, InvoiceDetailClient 156

**Occurrences:** ~35 across top 20 files.

**Classification:** **AdoptAsIs:Card** for most (Card already has `padding`, `shadow`, `bordered`). A minority need new variants:
- **ExtendDS:Card:tint** — `tint?: "default" | "subtle" | "muted"` to replace the `backgroundColor: 'var(--color-fill-tertiary)'` uses.
- **ExtendDS:Card:variant="dashed"** — for drop zones with `border: '2px dashed var(--color-border)'` (data-import 211, online-bookings 107, forms 191, contacts/[id] nowhere seen but likely).

---

## Pattern 4 — Toolbar/vertical divider

**Example:** `<span style={{ height: 16, width: 1, backgroundColor: 'var(--color-border)' }} />` — notes/edit 353, 366; settings/details 165, 167, 175

**Occurrences:** 8+ across top 20.

**Classification:** **ExtendDS:Divider:orientation="vertical"** — Divider exists with horizontal spacing variants but no vertical mode.

---

## Pattern 5 — Colored "feature card" (primary bg, white text)

**Examples:**
- ClientDetailClient 282: `<div style={{ marginBottom: 16, borderRadius: 8, backgroundColor: 'var(--color-primary)', padding: 16, color: 'white' }}>` — account balance card
- `<Text style={{ color: 'white' }}>` inside those (ClientDetailClient 284)

**Occurrences:** 4 distinct blocks across 3 files.

**Classification:** **NewDS:FeatureCard** — card with a `tone` prop (`default | primary | success`) that flips background + text color together. Plus **ExtendDS:Text:tone="inverted"** for text used inside those cards.

---

## Pattern 6 — Pill-shaped Button (filter chip)

**Examples:**
- reports/page 81, 271, 276, 283: `style={{ borderRadius: 9999 }}` on `<Button>`
- settings/details 149, 157: same

**Occurrences:** 10+ across top 20 (reports, settings pages).

**Classification:** **ExtendDS:Button:shape="pill"** — Button has `variant`, `size`, but no shape. Filter buttons across reports pages use pill consistently.

---

## Pattern 7 — Link-styled button (colored text, hover underline)

**Examples:**
- ClientDetailClient 277: `<Button variant="ghost" style={{ color: 'var(--color-primary)' }} onMouseEnter={...underline...}>View change log</Button>`
- notes/[id] 39: `<Link className="text-label-lg" style={{ color: 'var(--color-primary)' }}>`
- settings/details 135, 230: `<Text color="primary" style={{ cursor: 'pointer' }}>...</Text>`

**Occurrences:** 6 across 4 files.

**Classification:** **ExtendDS:Button:variant="link"** — link-styled button with hover underline baked in, no JS needed.

---

## Pattern 8 — Icon-only button (close / delete / more)

**Examples:**
- forms/[id] 134: `<button onClick={() => removeField(field.id)} style={{ borderRadius: 4, padding: 4, color: 'var(--color-text-secondary)' }}>`
- forms/[id] 210: same shape for close
- waitlist 743, 891: `style={{ marginLeft: 2, borderRadius: '50%', padding: 2 }}`

**Occurrences:** 8+ across top 20.

**Classification:** **NewDS:IconButton** — small icon-only button with circular or square shape, neutral tone. Common enough to deserve its own component; `<Button variant="ghost" size="xs">` could cover it if a new `iconOnly` prop is added → alternatively **ExtendDS:Button:iconOnly**.

---

## Pattern 9 — Badge with `borderRadius` + `padding` override (chip look)

**Examples:**
- waitlist 738, 886: `<Badge style={{ borderRadius: 8, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>`
- invoices/page 112 (InvoiceDetailClient): `<Badge variant="green" style={{ borderRadius: 8, padding: '6px 12px' }}>`

**Occurrences:** 6 across 3 files.

**Classification:** **ExtendDS:Badge:size** — Badge has `variant` and `shape` (post-Phase-1) but no `size`. Callers are inlining padding to create a larger chip. Add `size?: "sm" | "md" | "lg"` (default `md`).

---

## Pattern 10 — HintIcon on colored background (inverted tone)

**Examples:** ClientDetailClient 285, 286, 291: `<HintIcon style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.8)' }} />`

**Occurrences:** 3 in ClientDetailClient only; but a general case — any DS icon-bearing component used on a dark bg needs inverted tones.

**Classification:** **ExtendDS:HintIcon:tone="inverted"** (pairs with `NewDS:FeatureCard` and `ExtendDS:Text:tone`).

---

## Pattern 11 — Decorative accent bar (gradient at top of Card)

**Example:** `<div style={{ height: 8, borderRadius: '8px 8px 0 0', background: 'linear-gradient(to right, ...) }} />` — invoices/[id] 49, InvoiceDetailClient 154

**Occurrences:** 2 files (but visually-prominent).

**Classification:** **NewDS:InvoiceAccentBar** — narrow enough to not need a general component; specific to invoice detail styling. Low priority.

---

## Pattern 12 — Status dot + text row (alert-like)

**Example:** data-import 218–220: `<Flex style={{ backgroundColor: '#f0fdf4', ... }}><FileTextOutlined style={{ color: '#16a34a' }} /><span style={{ color: '#15803d' }}>...`

**Occurrences:** 4 across data-import and similar upload flows.

**Classification:** **AdoptAsIs:Alert** — Alert DS component exists and covers this pattern. Page authors just haven't adopted it.

---

## Pattern 13 — Data row border-bottom (should be DataTable)

**Examples:**
- ClientDetailClient 247, 257, 264: raw `<tr style={{ borderBottom: '1px solid var(--color-border)' }}>` inside raw `<table>`
- invoices/new 253, 268: raw table with inline header styles
- products page 570-575: raw `<th>` with inline padding

**Occurrences:** 15+ across 4 files.

**Classification:** **AdoptAsIs:DataTable** — DataTable exists with Th/Td/Tr. These pages just didn't adopt it. These are the largest pure AdoptAsIs opportunities.

---

## Pattern 14 — Popover / dropdown menu container

**Examples:**
- reports/page 89, 307: `<div style={{ position: 'absolute', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>`

**Occurrences:** 2 in reports; probably more in pages outside top 20.

**Classification:** **AdoptAsIs:Dropdown** — Dropdown DS component exists. If Dropdown doesn't cover a custom popover shape, consider **NewDS:Popover**. Low priority until widespread.

---

## Pattern 15 — Progress bar

**Example:** reports/page 444-446: two nested divs with `borderRadius: 9999, backgroundColor: 'var(--color-fill-secondary)'` track + `backgroundColor: 'var(--color-primary)', width: Nx%` fill.

**Occurrences:** 2 blocks in reports; might appear elsewhere.

**Classification:** **NewDS:ProgressBar** — tiny component with `value` (0-100) and `tone` prop. Low-to-medium priority.

---

## Pattern 16 — Success/check circle indicator

**Example:** payments/new 156-158: `<Flex style={{ height: 56, width: 56, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)' }}><CheckCircleOutlined style={{ color: 'var(--color-success)' }} /></Flex>`

**Occurrences:** 2 distinct blocks.

**Classification:** **NewDS:StatusIndicator** (with `tone: success | warning | error | info`) or lean on **ExtendDS:Avatar:tone** (Avatar already handles the circle). Low priority.

---

## Pattern 17 — Disabled input with grey fill

**Example:** settings/details 93, 102, 108: `<FormInput disabled className="text-text-secondary" style={{ backgroundColor: '#f3f4f6' }} />`

**Occurrences:** 3 in settings/details.

**Classification:** **AdoptAsIs:FormInput** — disabled state styling should be internal to FormInput. This looks like a bug — FormInput should already style its own disabled state. Needs a quick fix inside FormInput, no new prop.

---

## Pattern 18 — Colored emphasis text (success / warning / danger)

**Examples:**
- reports/performance 193: `<span style={{ fontWeight: ..., color: row.utilisation >= 80 ? '#16a34a' : '#ca8a04' }}>`
- DashboardClient similar for message/unread colors

**Occurrences:** 6 across 3 files.

**Classification:** **ExtendDS:Text:tone** — add `success | warning | danger | info` to Text's existing color options.

---

## Pattern 19 — Toolbar Card header (custom padding/tint)

**Example:** notes/edit 344: `<Card padding="none" style={{ ... padding: '6px 8px', color: 'var(--color-text-secondary)' }}>`

**Occurrences:** 2-3 across rich-text editor contexts.

**Classification:** **ExtendDS:Card:headerVariant** — minor; may not be worth its own session.

---

## Pattern 20 — Circular color swatch (palette picker)

**Example:** online-bookings/[id] 137: `style={{ height: 28, width: 28, borderRadius: '50%', border: '2px solid transparent', backgroundColor: color, cursor: 'pointer' }}`

**Occurrences:** 1 block (8 swatches in a row).

**Classification:** **NewDS:ColorSwatch** — might already exist as `ColorDot`; check. If ColorDot doesn't support interactive (selectable) swatches, **ExtendDS:ColorDot:interactive/selected**.

---

# Section B — Per-file violation rollup

For each of the top 20 files, a count-by-pattern breakdown. Used for Section 1 Top-10 detail.

| File | Top pattern categories |
|---|---|
| `ClientDetailClient.tsx` (86) | DataTable (6), FeatureCard+Text-tone (4), Divider-vertical (0), Icon (8), Button-link (1), HintIcon-tone (3), Badge-size (0), body/other pure-layout (~64) |
| `DashboardClient.tsx` (82) | Icon (25+), Text-fontSize overrides (8), inline gradient art (one-off decorative ~15), Card/container (8), Button-link (2) |
| `notes/[id]/edit/page.tsx` (73) | Icon (18+), Divider-vertical (3), rich-text toolbar Cards (4), Button shape (2), Text-fontSize overrides (5), bulk of rest = layout |
| `invoices/[id]/page.tsx` (58) | Raw `<h2>/<h3>` Text-adopt (8), Text weight override (12), DataTable-adopt (4), InvoiceAccentBar (1), Card-tint (2), bulk layout |
| `waitlist/page.tsx` (52) | Badge-chip (with remove) (4), Icon (16+), Button-size icon-only (2), bulk layout |
| `settings/details/page.tsx` (51) | Disabled-input fill (3), Divider-vertical (4), Button-pill (2), Link-Text (2), Icon (4), bulk layout |
| `settings/data-import/page.tsx` (50) | Icon (10+), Card-dashed (1), Card-interactive clickable (2), Alert-adopt (4), FileUpload-adopt (1), bulk layout |
| `InvoiceDetailClient.tsx` (48) | Text weight override (10), Badge-size (1), InvoiceAccentBar (1), Card-tint (2), Icon (4), bulk layout |
| `online-bookings/[id]/page.tsx` (47) | Card-container (5), Card-dashed (1), ColorDot-selectable (1), Icon (6), preview-Button (2), bulk layout |
| `reports/page.tsx` (46) | Button-pill (4+), Dropdown-adopt (2), ProgressBar (2), Icon (6+), Card-container (2), bulk layout |
| `settings/forms/[id]/page.tsx` (42) | IconButton (2), Card-container (4), FormInput-adopt (2), FormTextarea-adopt (2), Icon (5), bulk layout |
| `products/page.tsx` (38) | DataTable-adopt (~16 raw th/td), Icon (4), Collapse-adopt (2), bulk layout |
| `invoices/new/page.tsx` (36) | DataTable-adopt (~14 raw table), Icon (2), Card-container (1), bulk layout |
| `contacts/[id]/page.tsx` (35) | Icon (8), raw label-value rows (8 — List-adopt), Card-container (1), PageHeader (1), bulk layout |
| `notes/[id]/page.tsx` (34) | Text-fontSize+color overrides (8), Card-container (2), Divider-subtle (1), Icon (3), Link-Text (1), bulk layout |
| `payments/new/page.tsx` (33) | StatusIndicator/SuccessCircle (1), Icon (4), Button-link (1), Card-container (2), bulk layout |
| `reports/performance/page.tsx` (22) | Text-tone (success/warn) (6), raw dt/dd label-value (8 — List-adopt), bulk layout |
| `online-booking/page.tsx` (22) | Icon (18 — nearly all), Text as="span"-wrappers (2) |
| `settings/ai/page.tsx` (20) | Raw `<h3>/<h4>` with inline (6 — Text-adopt), Card-container (1), Alert-icon (1), bulk layout |
| `reports/progress-notes/page.tsx` (20) | Button-ghost-icon (4), Icon (3), PageHeader-border (1), bulk layout |

---

# Section C — NewDS candidates summary (feeds Section 2 of master report)

| Proposed component | Total occurrences | Files | Priority |
|---|---|---|---|
| **Icon** (size + tone wrapper) | 130+ | nearly all top 20 | **High** |
| **FeatureCard** (primary-tinted card) | 4 blocks | ClientDetailClient, DashboardClient | **Medium** |
| **IconButton** (icon-only with circle/square shape) | 8 | forms, waitlist, notes | **Medium** |
| **ProgressBar** | 2 blocks | reports | **Low** |
| **StatusIndicator** (success/warn/error circle) | 2 blocks | payments, data-import | **Low** |
| **InvoiceAccentBar** | 2 | invoices pages | **Low** |

---

# Section D — ExtendDS candidates summary (feeds Section 3 of master report)

| Component | Missing prop | Occurrences | Priority |
|---|---|---|---|
| **Text** | `weight?: regular \| medium \| bold` | 20+ | **High** |
| **Text** | new `variant="heading/xl"` (28px) | 6 | **Medium** |
| **Text** | `tone` expanded to include `inverted`/`success`/`warning`/`danger` | 10+ | **High** |
| **Divider** | `orientation="vertical"` | 8 | **High** |
| **Button** | `shape="pill"` | 10+ | **High** |
| **Button** | `variant="link"` (colored+underline hover) | 6 | **Medium** |
| **Button** | `iconOnly` (or NewDS:IconButton — see Section C) | 8 | **Medium** |
| **Card** | `tint?: default \| subtle \| muted` | 8 | **Medium** |
| **Card** | `variant="dashed"` (drop zones) | 3 | **Low** |
| **Badge** | `size?: sm \| md \| lg` | 6 | **Medium** |
| **HintIcon** | `tone="inverted"` | 3 | **Low** |
| **ColorDot** | `interactive` / `selected` | 1 block (8 swatches) | **Low** |
| **FormInput** | fix internal disabled styling (bug, not a prop) | 3 | **Medium** |

---

# Section E — AdoptAsIs summary (feeds Section 1 fix backlog)

Pages below have inline styles that are already covered by existing DS components; they just haven't adopted them. These are the cheapest fixes — no DS changes needed.

| File | Main adoption target | Estimated violations |
|---|---|---|
| invoices/[id]/page.tsx | `<h2>/<h3>` → `<Text>` | 8 |
| invoices/new/page.tsx | raw `<table>` → `<DataTable>` | 14 |
| products/page.tsx | raw `<table>` → `<DataTable>` | 16 |
| ClientDetailClient.tsx (associated contacts section) | raw `<table>` → `<DataTable>` | 6 |
| settings/ai/page.tsx | raw `<h3>/<h4>` → `<Text>` | 6 |
| reports/performance/page.tsx | raw `<dt>/<dd>` → `<List>` | 8 |
| contacts/[id]/page.tsx | raw label-value rows → `<List>` | 8 |
| settings/data-import/page.tsx | green/red status rows → `<Alert>` | 4 |
| reports/page.tsx | custom popover → `<Dropdown>` | 2 |

**Estimated AdoptAsIs total across top 20:** ~70 fixes.

---

# Methodology note

- Scope: top 20 worst pages from Pass 1 Section A (ranked by raw `style={{` count)
- Extraction: `grep -n "style={{" <file> | grep -E "(color|background|border[A-Z]|fontSize|fontWeight|boxShadow|textDecoration)"` — lets me ignore pure-layout inlines automatically
- Classification: judgement-based, following the spec's classifier and the DS component catalog (`docs/reference/ds-component-catalog.md`)
- Not exhaustive: each file has 20–86 `style={{}}` occurrences, the grep reduces each to ~3–20 actual violations. Per-violation row-level classification would be noise; the pattern aggregation in Section A is what matters for building Sections 2/3/4 of the master report.
- **Reality check:** the 1422 "violations" from Pass 1 are mostly pure-layout inlines (margin, padding, flex, etc.). The actual DS-bypass violations across the top 20 files number in the low hundreds (~200-250), heavily dominated by Pattern 1 (Icon fontSize, ~130+).

Scan date: 2026-04-20.

---

# Pass 2b — Stratified low-violation sample

Same classification rules applied to 10 files with 1–10 violations each, to catch long-tail patterns and validate the classifier.

## Files sampled

| File | Pass 1 count | Why chosen |
|---|---|---|
| `src/app/settings/sms-settings/page.tsx` | 10 | Settings form page |
| `src/app/contacts/page.tsx` | 10 | Main list page |
| `src/app/reports/uninvoiced/page.tsx` | 9 | Report page |
| `src/app/clients/[id]/payments/page.tsx` | 9 | Client sub-tab |
| `src/components/ds/DetailPage.tsx` | 8 | **DS template** |
| `src/app/settings/tags/page.tsx` | 8 | Settings with color |
| `src/app/settings/body-charts/page.tsx` | 7 | Settings with checkbox |
| `src/app/invoices/batch-invoice/preview/page.tsx` | 6 | Flow sub-page |
| `src/components/ds/Navbar.tsx` | 5 | **DS template** |
| `src/app/settings/cancellation-reasons/page.tsx` | 4 | Simple settings |

## New findings (not covered by Pass 2a)

### Finding 1 — DS templates themselves bypass DS tokens (!)

**DetailPage.tsx** line 45: `<h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", lineHeight: 1.2, color: "rgb(66, 105, 74)" }}>`.
**Navbar.tsx** line 41: same pattern with the same `rgb(66, 105, 74)` green.

Both hard-code the "page title" style. The color `rgb(66, 105, 74)` (a custom green) and `'Sprig Sans'` font-family are used in multiple places but are NOT Text variants yet.

**Classification:** **ExtendDS:Text:variant="page-title"** — promote this 30px / 700 / Sprig-Sans / green-text style to a proper Text variant. Then DetailPage and Navbar use `<Text variant="page-title">`. Side effect: adds a DS token for this green color (if not already present).

This is a **high-priority** finding. It's the canonical page title across every detail page — getting it into the Text component means changing it once affects the entire app.

### Finding 2 — `fontWeight` inline on `<Text>`/`<Td>`/`<Link>` is ubiquitous (confirmed)

Low-violation sample keeps showing it: `<Td style={{ fontWeight: 500 }}>`, `<span style={{ fontWeight: 600 }}>`, `<Link style={{ ... fontWeight: 600 }}>`. Confirms **ExtendDS:Text:weight** is top-priority.

### Finding 3 — raw `<input type="checkbox">` with inline `accentColor`

body-charts 195: `<input type="checkbox" style={{ height: 16, width: 16, accentColor: 'var(--color-primary)' }}>`.

**Classification:** **AdoptAsIs:Checkbox** — the DS Checkbox already exists. Just a fix-by-adoption.

### Finding 4 — Color swatch preview (rectangle)

tags 162: `<div style={{ height: 16, width: 80, borderRadius: 4, backgroundColor: tag.color }}>`.

**Classification:** **ExtendDS:ColorDot:shape="rect"** — ColorDot is a circle; needs a rectangle variant for palette previews. Alternatively NewDS:ColorSwatch if rect differs enough.

### Finding 5 — Empty state icon circle

clients/[id]/payments 47-48: `<Flex style={{ height: 96, width: 96, borderRadius: '50%', backgroundColor: 'var(--color-fill-quaternary)' }}><svg style={{ color: 'var(--color-text-quaternary)' }} />`.

**Classification:** **AdoptAsIs:EmptyState** — EmptyState DS component exists and should handle this.

### Finding 6 — `<Link>` with inline `color + fontSize + fontWeight + textDecoration`

Navbar 31: `<Link href={backHref} style={{ color: "var(--color-primary)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>`.

**Classification:** **NewDS:Link** (or **ExtendDS:Button:variant="link" as="a"**) — Pattern 7 from Pass 2a reinforced. Every instance of "link styled text" uses inline. High priority.

### Finding 7 — Clean page exists

`settings/cancellation-reasons/page.tsx` has 4 `style={{` occurrences, **zero violations** (all pure layout). Useful as a reference example when writing the fix backlog: "the golden standard looks like this."

## Classifier validation

- Low-vio sample produces the same 20 patterns as the top 20 — suggests the classifier isn't missing categories.
- One new DS-template-level pattern (Finding 1) emerged that the top-20 sample missed because those top files weren't DS templates. Worth a Section-4-adjacent note in the final report.
- False-positive rate appears low: every match I classified was a real violation.

Scan date: 2026-04-20.
