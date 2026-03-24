# Style Reference Handoff Prompt

Copy and paste the prompt below into a Claude session when you want it to use the extracted style data to match the real Splose app's look and feel.

---

## Prompt

You have access to a comprehensive style reference extracted from the real Splose web app (acme.splose.com). It is located in the `splose-style-reference/` folder. Before making any UI changes or building new components, you must read and follow this reference to achieve pixel-accurate fidelity.

### Tech Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 4 (via @tailwindcss/postcss, no tailwind.config -- tokens in globals.css)
- Lucide React 0.577 (icon library)
- Prisma 7 with Turso/LibSQL (database)
- Storybook 10 (component documentation)
- date-fns 4 (date utilities)

### Design System

The prototype has a full component library at `src/components/ds/` with **46 components** and matching Storybook stories. Always import from `@/components/ds` -- do not build custom equivalents or install third-party UI libraries. Do not install or import `antd`.

Read `splose-style-reference/functional-scaffolding.md` for the complete component inventory with props and usage examples.

Key components: TopNav, SideNav, Navbar, PageHeader, Button (7 variants), DataTable/Th/Pagination (sortable, filterable), FormInput/FormSelect/FormTextarea, Modal, Dropdown, Badge (with statusVariant helper), Tab, Toggle, Select (searchable), Avatar, Card, Text (18 typography variants), Spinner, EmptyState, Alert, SettingsListPage (full CRUD table), SearchBar, FileUpload, Chip, Collapse, DateRangeFilter, Filter, and more.

### Typography

Use the `<Text variant="...">` component or the CSS utility classes:

- Display: `text-display-lg` / `text-display-md` / `text-display-sm` (Sprig Sans, Bold)
- Heading: `text-heading-lg` / `text-heading-md` / `text-heading-sm` (Inter, SemiBold)
- Body: `text-body-lg` / `text-body-md` / `text-body-sm` / `text-body-md-strong` / `text-body-lg-strong` (Inter)
- Label: `text-label-lg` / `text-label-md` / `text-label-sm` (Inter, Medium)
- Caption: `text-caption-md` / `text-caption-sm` (Inter, Regular)
- Metric: `text-metric-lg` / `text-metric-md` (Inter, Bold, tabular figures)

### Design Tokens (globals.css)

Colours: `--color-primary` (#7c3aed), `--color-primary-dark` (#6d28d9), `--color-primary-light` (#a78bfa), `--color-accent` (#2d6d40), `--color-success` (#22c55e), `--color-warning` (#f59e0b), `--color-danger` (#ef4444), `--color-background` (#ffffff), `--color-surface` (#ffffff), `--color-border` (#e5e7eb), `--color-text` (#1f2937), `--color-text-secondary` (#6b7280)

Font sizes: `--text-2xl` (30px) through `--text-xs` (11px), base is 14px

Fonts: `--font-sans` (Inter), `--font-display` (Sprig Sans), `--font-mono` (ui-monospace)

### Your workflow for any UI task

1. Read `splose-style-reference/summary.md` for the design system overview.
2. Read `splose-style-reference/functional-scaffolding.md` for the router structure, navigation config, page templates, form/table schemas, and the full DS component inventory with props.
3. Read `splose-style-reference/design-tokens/css-variables.md` and check that existing CSS custom properties are being used.
4. For the specific component or page you are building:
   - Check `splose-style-reference/components/{type}.md` for exact computed styles from the real app.
   - Check `splose-style-reference/screenshots/` for visual reference.
   - Check `splose-style-reference/page-structures/{route}.md` for DOM hierarchy.
5. Use existing DS components from `@/components/ds` wherever possible.
6. Match values exactly: colours (via CSS variables), font families, font sizes, font weights, border radii, box shadows, and spacing.
7. Reference `splose-style-reference/raw/all-css-rules.css` if you need to find a specific CSS rule from the real app.
8. Check `splose-style-reference/assets-required.md` for which images are available and which need placeholders.

### When scaffolding new pages or features

- Follow the page template patterns in `functional-scaffolding.md` (list view, detail view, form view, settings page, report page).
- Use the exact navigation configs provided (header nav, patient sidebar, settings sidebar, reports sidebar).
- Use the form schemas for fields, labels, and input types when building forms.
- Use the table schemas for columns and data types when building list views.
- Use the DS components -- do not recreate buttons, tables, modals, badges, etc. from scratch.
- Use `lucide-react` for icons. Import directly: `import { Bell, Plus, Edit } from 'lucide-react'`.
- Follow the router structure to create the correct file/folder hierarchy.
- Use the utility helpers from `src/lib/`: `getBadgeVariant()`, `formatTimestamp()`, dropdown presets (`STANDARD_SETTINGS`, `SIMPLE_CRUD`, `USER_ADMIN`).
- Default to server components. Only use `"use client"` when hooks or browser APIs are needed.
- Format dates in Australian locale (en-AU).

### When referencing image assets

All images live in `public/images/` and are referenced in code as `/images/{category}/{filename}`.

Brand assets:
- `/images/brand/splose logo.svg` -- main logo in header nav
- `/images/brand/favicon.ico` -- browser tab icon
- `/images/brand/ai-icon.svg` -- AI sparkle icon for AI feature buttons/badges
- `/images/brand/ai feature.png` -- AI feature promotional image
- `/images/brand/settings.png` -- settings page decorative image

Integration logos:
- `/images/integrations/hicaps.png` -- HICAPS health claiming
- `/images/integrations/mailchimp.svg` -- Mailchimp email integration
- `/images/integrations/physitrack.svg` -- Physitrack exercise integration
- `/images/integrations/quickbooks.svg` -- QuickBooks accounting integration
- `/images/integrations/tyro-health.png` -- Tyro Health payment terminal

Other:
- `/images/other/profile photo.png` -- sample user profile photo

For any integration not listed above (Stripe, Xero, NDIS, Medicare, Google Maps, Intercom), use a clearly labelled grey placeholder box showing the integration name.

### Key principles

- Exact match over aesthetics. If the real app uses `border-radius: 6px`, use `6px`, not `8px`.
- Use the same CSS variable names so our token system aligns with the real app.
- When in doubt, check the screenshot for that page and match it visually.
- Log any intentional deviations in the commit message with a reason.

---

## Shorter Version (for quick reference)

> Match the real Splose app using `splose-style-reference/`. Read `summary.md` and `functional-scaffolding.md` first. The prototype uses Next.js 16, Tailwind CSS 4, and a 46-component design system at `src/components/ds/` -- always import from `@/components/ds`, never build custom equivalents or use antd. Use `lucide-react` for icons. Use the `<Text variant="...">` component or typography utility classes for text. Design tokens are CSS variables in `globals.css`. Image assets are in `public/images/` (brand/, integrations/, other/). See `assets-required.md` for the full list. Helpers in `src/lib/`: `getBadgeVariant()`, `formatTimestamp()`, dropdown presets. Default to server components, format dates in en-AU. Match values exactly -- do not invent new tokens.

---

## Supplied Assets Summary

### Brand (`public/images/brand/`)

| File | What it is |
|------|-----------|
| `splose logo.svg` | Main Splose logo for the header nav |
| `favicon.ico` | Browser tab icon |
| `ai-icon.svg` | AI sparkle icon for buttons and badges |
| `ai feature.png` | AI feature promotional/marketing image |
| `settings.png` | Settings page decorative image |

### Integration Logos (`public/images/integrations/`)

| File | Integration |
|------|-----------|
| `hicaps.png` | HICAPS health claiming |
| `mailchimp.svg` | Mailchimp email integration |
| `physitrack.svg` | Physitrack exercise library |
| `quickbooks.svg` | QuickBooks accounting |
| `tyro-health.png` | Tyro Health payment terminal |

### Other (`public/images/other/`)

| File | What it is |
|------|-----------|
| `profile photo.png` | Sample user profile photo for the logged-in user avatar |

### Custom Fonts (already installed)

Fonts are in `public/fonts/` and wired into Tailwind via `globals.css`. No action needed.

- Sprig Sans (Bold, Medium, Regular .woff2 files) -- `--font-display`
- Inter (via next/font/google) -- `--font-sans`

### Icon Library

Uses **`lucide-react`** (v0.577.0). No manual asset supply needed.

### Still Needed (use placeholder until supplied)

These integration logos were not captured. Download from each service's brand/press page and save into `public/images/integrations/`:

- Stripe
- Xero
- NDIS
- Medicare
- Google Maps
- Intercom

### User-Generated Content (placeholder treatment)

| Content type | Placeholder approach |
|-------------|---------------------|
| Patient/contact avatars | `<Avatar name="..." />` component (coloured circle with initials) |
| User profile photos | `<Avatar>` or `/images/other/profile photo.png` for logged-in user |
| Uploaded documents/files | Generic file icon with filename text |
| Body chart templates | Simple outline SVG placeholder |
| Practice logo (per-workspace) | Grey box with "Practice Logo" text |
