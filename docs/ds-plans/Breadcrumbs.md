# Breadcrumbs build plan

**Phase:** 2
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

Horizontal path indicator showing the hierarchy of the current screen and providing quick links back up the tree. "Clients → Harry Nguyen → Notes → Session 3 (Draft)". Useful on deep detail pages, batch workflows, and nested settings where back-button behaviour alone is not obvious.

## API

```ts
interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;                 // clickable when present; current page has no href
    icon?: ReactNode;              // e.g. Home icon on the root
  }>;
  separator?: ReactNode;           // default: chevron icon; can pass "/" or "›"
  maxItems?: number;               // collapse middle items with "..." when exceeded
  overflowDirection?: "head" | "middle" | "tail";   // default "middle"
}
```

Last item in `items` is rendered as plain text with `aria-current="page"`. Items that precede it render as `<a href>` with the DS `Button variant="link"` styling.

## What it extends

AntD `Breadcrumb`. Radix has no breadcrumb primitive; AntD's is decent but its default separator is a styled `/` that isn't on-brand. Splose wrapper:

- Replaces default separator with a chevron icon from the DS `Icon` component.
- Exposes `items` as a simple array (vs AntD's mixed children API).
- Applies DS `Text` tokens and `Button variant="link"` styling to links.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no `.ant-breadcrumb` rendered on the default dashboard, calendar, patient detail, invoices, services, or reports pages. Splose currently uses `Navbar` back-link arrows for hierarchy ("← Back to Clients") rather than breadcrumbs.

- Production does not currently use breadcrumbs as a visible pattern. This component is a **net-new** addition, not a rescue of an inline pattern.
- Candidate placement: deep batch flows (`/invoices/batch-invoice/{id}`), nested settings (`/settings/templates/emails/new`), and the audit trail view (planned).

## Measurement targets

No live production sample — use sensible DS defaults and validate against the designs Jim signs off on:

- Font: `body/sm` (12px/400) for path items, `body/sm-strong` (12px/600) for current page.
- Link colour: `var(--color-text-secondary)` default, `var(--color-primary)` hover.
- Separator: `Icon size="xs"` chevron-right, `var(--color-text-tertiary)` colour.
- Gap between items: `6px` each side of separator (total `12px`).
- Max height: `20px` (single line, no wrap).
- Overflow collapse: `...` button opens a `Dropdown` with the hidden entries.

## Accessibility

- Wrapper is `<nav aria-label="Breadcrumb">` containing an `<ol>` for ordered semantics.
- Each item is `<li>`; non-current items contain an `<a>`.
- Current page item uses `aria-current="page"` on the text span.
- Separators are decorative only — `aria-hidden="true"`.
- Overflow `...` button is keyboard-focusable with `aria-label="Show hidden breadcrumbs"`.

## Visual states

- Two-item path (root + current)
- Three-item path
- Overflow collapsed with `...`
- Link hover state
- With leading icon on the root (Home)
- Alternative separator (`/` or `›`)

## Stories to build

- **Playground:** args-driven with items and separator.
- **Feature stories:**
  - `TwoLevel`, `ThreeLevel`, `FourLevel`.
  - `WithHomeIcon` — leading Home icon on the root.
  - `Overflow` — 7 items collapsed to 3 + ellipsis.
  - `AlternativeSeparator` — "/" character.
- **Recipe stories:**
  - `SettingsDeepLink` — `// Source: planned — Settings → Templates → Emails → New`
  - `BatchInvoiceFlow` — `// Source: planned — Invoices → Batch invoice → #330044 → Preview`
  - `PatientHierarchy` — `// Source: planned — Clients → Harry Nguyen → Notes → Session 3`

## MDX docs outline

- H1: Breadcrumbs
- When to use — deep hierarchy, nested settings, batch flows where back-button alone is confusing.
- When not to use — top-level pages (use `PageHeader` title alone), modal content (use in-modal back).
- Variants — two-level, multi-level, overflow.
- Composition — inside `PageHeader`, above `DetailPage` title, inside a `Navbar`.
- Accessibility — nav semantics, `aria-current="page"`, overflow button.
- Sizing — one size only; the component stays sm.

## Acceptance criteria

- [ ] Renders at 1440x900 on a Storybook-only verification (no production comparator — document this in `.verification-evidence`).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] No production-page migration in this session — breadcrumbs are new behaviour. Adoption happens in a follow-up once Jim picks the first home.

## Open questions

1. **Placement** — Jim to confirm which pages should adopt breadcrumbs first. The deep settings tree and batch-invoice flow are the strongest candidates; patient detail already uses `Navbar` back-link effectively and may not need them.
2. **Interaction with `Navbar`** — if both are present on the same page, do breadcrumbs sit inside the `Navbar` or above it? Suggest inside, so the hierarchy is one line tall. Confirm.
