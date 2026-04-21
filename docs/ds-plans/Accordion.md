# Accordion build plan

**Phase:** 2
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A vertical list of expandable panels. Each panel has a header and a body; clicking the header toggles the body visible. Used for long forms that benefit from optional-section collapse, FAQ-style reference blocks, and "additional details" disclosures on detail pages. **This plan delivers an in-place upgrade of the existing `Collapse` component**, renamed to `Accordion`, with a deprecated `Collapse` alias kept for a migration window (B2 resolution 2026-04-22).

## API

```ts
interface AccordionProps {
  items: Array<{
    id: string;
    title: ReactNode;
    description?: ReactNode;          // secondary line under title
    icon?: ReactNode;                 // leading icon
    children: ReactNode;              // panel body
    defaultOpen?: boolean;
  }>;
  type?: "single" | "multiple";       // default "multiple"
  collapsible?: boolean;              // single mode: allow the open item to close? default true
  value?: string | string[];          // controlled
  onValueChange?: (value: string | string[]) => void;
  divider?: boolean;                  // hairline between items, default true
  tone?: "default" | "subtle";        // default uses card shell; subtle is borderless
}
```

Each row's `title` is a ReactNode so consumers can inline a `Badge` or `Icon` without wrapper divs.

## What it extends

Existing `src/components/ds/Collapse.tsx` (wraps AntD `Collapse`). This session:

1. Renames the component export to `Accordion`. The file itself can rename to `Accordion.tsx` or stay as `Collapse.tsx` with the new default export — pick whichever diffs smaller during the build.
2. Adds the new API surface described below (description lines, `tone="subtle"`, `items` array shape).
3. Re-exports `Collapse` as a deprecated alias from `@/components/ds` with a JSDoc `@deprecated Use Accordion instead.` so the TypeScript LSP nudges consumers.
4. Leaves AntD `Collapse` as the underlying primitive. Keyboard navigation (Up/Down, Home/End, typeahead) is added via a small wrapper that attaches key handlers to the header buttons if AntD doesn't provide them natively. Verify AntD's 2025 Collapse accessibility during the build; if acceptable as-is, skip the wrapper.

No new dep. The deprecated `Collapse` alias is removed in a follow-up wave once all consumers migrate.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — patient detail page has one `.ant-collapse` instance (header: 12px/16px padding, 14px/400 text colour `rgb(65, 69, 73)`). Accordion patterns also appear on settings forms.

- `https://acme.splose.com/patients/446604/details` — "Additional details" accordion section.
- `https://acme.splose.com/settings/integrations` — integration cards, each expandable for details.
- `https://acme.splose.com/settings/ai` — collapsible AI feature sections (audit session 24 migrated typography here; accordion is a follow-up migration).
- `https://acme.splose.com/invoices/{id}/view` — line items "more" toggle.

## Measurement targets

Captured 2026-04-22 from the patient detail page `.ant-collapse-header`:

- Header padding: `12px 16px`.
- Header background: transparent (defaults to card background).
- Header title: `14px/400`, `rgb(65, 69, 73)` (text-secondary equivalent).
- Chevron icon: 12px, right-aligned, 180° rotation on open.
- Divider between items: `1px solid var(--color-border)` (to be confirmed).
- Panel body padding: TBC (measure on build with an open item).
- Animation: 200ms ease on height transition.

Additional tokens to resolve during build:

- `tone="subtle"` — removes the outer border and the per-row divider, for use inside a `Card`.
- Spacing between items when `divider={false}` — suggest `4px` gap.

## Accessibility

- AntD Collapse renders the trigger as a `<div role="button" aria-expanded>` with `aria-controls` pointing at the panel. Confirm this in the build — if AntD has regressed (historically it has), patch by rendering our own `<button>` header.
- Keyboard: Space/Enter toggles the focused row (AntD default). Up/Down navigation between triggers and Home/End-to-first/last is **not** in AntD's default; add via a small key handler in the wrapper.
- Screen reader announces state changes on toggle (AntD default).
- Do not rely on colour alone to signal open state — chevron rotation plus `aria-expanded` is the belt-and-braces default.

## Visual states

- Collapsed (default)
- Expanded
- First item expanded / last item expanded (border-radius edges)
- Single vs multiple mode
- With dividers / without
- With leading icon / without
- With description line under title
- `tone="subtle"` borderless inside a Card
- Disabled item (planned, not in initial build unless asked)

## Stories to build

- **Playground:** args-driven trigger button + accordion with items.
- **Feature stories:**
  - `Single` — type="single", only one open at a time.
  - `Multiple` — type="multiple", any subset open.
  - `WithDescriptions` — two-line header rows.
  - `WithIcons` — leading icons.
  - `Subtle` — tone="subtle" inside a `Card`.
  - `Controlled` — external state wiring with `value`/`onValueChange`.
- **Recipe stories:**
  - `PatientAdditionalDetails` — `// Source: acme.splose.com/patients/446604/details — "Additional details" accordion, single-row expansion`
  - `IntegrationSettingsList` — `// Source: acme.splose.com/settings/integrations — stack of expandable integration cards`
  - `AIFeatureSections` — `// Source: acme.splose.com/settings/ai — grouped AI feature toggles`

## MDX docs outline

- H1: Accordion
- When to use — long-form disclosure, optional detail blocks, grouped setting clusters.
- When not to use — nav (use `Tab` or `SideNav`), single disclosure of a small toggle (inline `Collapse` is fine), form sections where users need to see all fields at once.
- Variants — single, multiple, subtle.
- Composition — inside `Card`, inside `Drawer`, inside `DetailPage` main column.
- Accessibility — Radix roles, keyboard order.
- Sizing — default padding, tight option TBD.

## Acceptance criteria

- [ ] Renders at 1440x900 matching production patient detail "Additional details" accordion.
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] `Accordion` export lands; `Collapse` re-exported as a deprecated alias with a JSDoc `@deprecated` tag; `grep -r "from.*Collapse" src/` still resolves (no migration required in this session).
- [ ] At least one real consumer migrated to prove the API (suggest: the patient detail "Additional details" block).

## Open questions

All resolved 2026-04-22. Upgrade-in-place path (B2 option c), AntD stays as base (A2 option b). Build can proceed.
