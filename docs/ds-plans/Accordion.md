# Accordion build plan

**Phase:** 2
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A vertical list of expandable panels. Each panel has a header and a body; clicking the header toggles the body visible. Used for long forms that benefit from optional-section collapse, FAQ-style reference blocks, and "additional details" disclosures on detail pages. The DS already has `Collapse` which covers this use case — the question is whether `Accordion` is a rename, a richer sibling, or a layer of naming hygiene. See Open questions.

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

Radix `@radix-ui/react-accordion` — cleaner accessibility story (arrow-key nav, correct `aria-controls` wiring) than AntD's `Collapse`. The existing `Collapse` DS component wraps AntD `Collapse`. Three reasonable paths:

- **(a) Replace `Collapse` with `Accordion`**, migrate consumers, delete `Collapse`. Lines up with naming convention (DaisyUI uses `accordion`).
- **(b) Keep both**: `Collapse` stays for the single-panel disclosure case, `Accordion` is multi-panel only.
- **(c) Upgrade `Collapse` in place** to the Radix primitive, rename the export, keep a deprecated re-export of `Collapse` during a migration window.

Lean toward **(a)** — the DS already uses DaisyUI naming and Radix gives us a better base. Note this in Open questions for Jim.

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

- Radix exposes correct roles: `button` on the trigger, `region` on the panel, `aria-controls`, `aria-expanded`.
- Keyboard: Space/Enter toggles the focused row; Up/Down navigates between triggers; Home/End jumps to first/last.
- Screen reader announces state changes on toggle.
- Do not rely on colour alone to signal open state — chevron rotation plus aria-expanded is the belt-and-braces default.

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
- [ ] Decision on `Collapse` → `Accordion` migration documented (delete + migrate, keep both with guidance, or deprecate alias).
- [ ] At least one real consumer migrated to prove the API (suggest: the patient detail "Additional details" block).

## Open questions

1. **Collapse vs Accordion** — resolve before building. See the three options under "What it extends". Lean replace.
2. If keeping both, how does a consumer pick? The MDX needs a crisp rule. Suggest: "one pane = Collapse, stack = Accordion" but open to alternatives.
3. Radix dependency — if the DS already added `@radix-ui/*` for `AlertDialog` (Phase 2), this Accordion is "free". If AlertDialog stays on AntD, adding Radix here is the first Radix dep. Decide together.
