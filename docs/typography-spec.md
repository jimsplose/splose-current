# Splose Typography Spec

Two typefaces: **Sprig Sans** (display headings) and **Inter** (everything else).
Pattern: `{category}/{size}` — semantic role, not HTML element. T-shirt sizing within category.

> Full spec with "Where X appears" descriptions archived at `docs/archive/typography-full-spec.md`.

## Categories

| Category | Purpose | Font |
|---|---|---|
| **display** | Hero headings, page titles | Sprig Sans |
| **heading** | Section and card headings | Inter |
| **body** | Running text and default UI content | Inter |
| **label** | Form labels, table headers, nav items, tags | Inter |
| **caption** | Helper text, hints, timestamps, metadata | Inter |
| **metric** | Dashboard KPIs and summary numbers | Inter (tabular figures) |

## Style Definitions

### display/ (Sprig Sans)

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **display/lg** | 30px | Bold (700) | 1.2x (36px) | tight (-0.02em) |
| **display/md** | 24px | Bold (700) | 1.33x (32px) | tight (-0.02em) |
| **display/sm** | 18px | Bold (700) | 1.33x (24px) | normal |

### heading/ (Inter)

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **heading/lg** | 18px | SemiBold (600) | 1.33x (24px) | normal |
| **heading/md** | 16px | SemiBold (600) | 1.375x (22px) | normal |
| **heading/sm** | 14px | SemiBold (600) | 1.43x (20px) | normal |

### body/ (Inter)

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **body/lg** | 16px | Regular (400) | 1.375x (22px) | normal |
| **body/md** | 14px | Regular (400) | 1.43x (20px) | normal |
| **body/sm** | 12px | Regular (400) | 1.33x (16px) | normal |
| **body/md-strong** | 14px | Bold (700) | 1.43x (20px) | normal |
| **body/lg-strong** | 16px | Bold (700) | 1.375x (22px) | normal |

### label/ (Inter)

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **label/lg** | 14px | Medium (500) | 1.43x (20px) | normal |
| **label/md** | 12px | Medium (500) | 1.33x (16px) | normal |
| **label/sm** | 11px | Medium (500) | 1.45x (16px) | wide (0.02em) |

### caption/ (Inter)

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **caption/md** | 12px | Regular (400) | 1.33x (16px) | normal |
| **caption/sm** | 11px | Regular (400) | 1.27x (14px) | normal |

### metric/ (Inter, tabular figures)

| Style | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| **metric/lg** | 30px | Bold (700) | 1.2x (36px) | tight (-0.02em) |
| **metric/md** | 24px | Bold (700) | 1.33x (32px) | tight (-0.02em) |

## Quick Identification Table

| If you see... | Size | Weight | It's probably... |
|---|---|---|---|
| Sprig Sans, 30px, Bold | 30 | 700 | display/lg |
| Sprig Sans, 24px, Bold | 24 | 700 | display/md |
| Sprig Sans, 18px, Bold | 18 | 700 | display/sm |
| Inter, 18px, SemiBold | 18 | 600 | heading/lg |
| Inter, 16px, SemiBold | 16 | 600 | heading/md |
| Inter, 14px, SemiBold | 14 | 600 | heading/sm |
| Inter, 16px, Regular | 16 | 400 | body/lg |
| Inter, 14px, Regular | 14 | 400 | body/md |
| Inter, 12px, Regular | 12 | 400 | body/sm or caption/md |
| Inter, 14px, Bold | 14 | 700 | body/md-strong |
| Inter, 16px, Bold | 16 | 700 | body/lg-strong |
| Inter, 14px, Medium | 14 | 500 | label/lg |
| Inter, 12px, Medium | 12 | 500 | label/md |
| Inter, 11px, Medium | 11 | 500 | label/sm |
| Inter, 11px, Regular | 11 | 400 | caption/sm |
| Inter, 30px, Bold (tabular figs) | 30 | 700 | metric/lg |
| Inter, 24px, Bold (tabular figs) | 24 | 700 | metric/md |

**body/sm vs caption/md:** Both are Inter 12px Regular. Differentiate by role: primary content (table data) = body/sm. Supporting metadata (timestamps, helper text) = caption/md.

**display/ vs metric/:** Both Bold 700 at same sizes. Display = Sprig Sans (headings). Metric = Inter with tabular figures (numbers).

## Tailwind → Typography Token Mapping

| Tailwind | Typography class | `<Text>` variant |
|---|---|---|
| `text-2xl font-bold` (page title) | `text-display-lg` | `display/lg` |
| `text-xl font-bold` | `text-display-md` | `display/md` |
| `text-lg font-bold` | `text-display-sm` | `display/sm` |
| `text-lg font-semibold` | `text-heading-lg` | `heading/lg` |
| `text-base font-semibold` | `text-heading-md` | `heading/md` |
| `text-sm font-semibold` | `text-heading-sm` | `heading/sm` |
| `text-base` (16px regular) | `text-body-lg` | `body/lg` |
| `text-sm` (14px regular) | `text-body-md` | `body/md` |
| `text-xs` (12px regular content) | `text-body-sm` | `body/sm` |
| `text-sm font-bold` | `text-body-md-strong` | `body/md-strong` |
| `text-base font-bold` | `text-body-lg-strong` | `body/lg-strong` |
| `text-sm font-medium` | `text-label-lg` | `label/lg` |
| `text-xs font-medium` | `text-label-md` | `label/md` |
| `text-[11px] font-medium` | `text-label-sm` | `label/sm` |
| `text-xs` (12px metadata/helper) | `text-caption-md` | `caption/md` |
| `text-[11px]` (11px metadata) | `text-caption-sm` | `caption/sm` |

Typography classes handle: font-family, font-size, font-weight, line-height, letter-spacing.
Keep as separate classes: color, alignment, truncation, whitespace, margin/padding.
