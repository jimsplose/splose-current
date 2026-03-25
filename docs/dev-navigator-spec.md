# Dev Navigator Spec

A development-only floating toolbar, state registry, and navigation menu for browsing every page, state variant, modal, and interactive view in the prototype. This is NOT part of the real Splose UI — it's a tool for reviewing fidelity against reference screenshots.

## Implementation Status

- **Phase 1: COMPLETE (2026-03-18)** — State registry (`src/lib/state-registry.ts`) with 30+ pages and 60+ variants, floating toolbar pill, dark panel with search and grouped page tree, keyboard shortcut (Ctrl+Shift+N), `?devnav=0` to hide.
- **Phase 2: COMPLETE (2026-03-18)** — Wired `?state=` URL param into Calendar (7 variants), Waitlist (3 variants), Settings (25 variants), Settings AI (2 variants). All interactive pages navigable via URL.

> Full implementation spec (architecture, component code, phase details) archived at `docs/archive/dev-navigator-full-spec.md`.

## Registry Audit Workflow (Menu Option 5)

When selected from the session start menu, run this workflow to ensure the registry is complete:

### Step 1: Cross-check routes against registry

1. Glob all `src/app/**/page.tsx` files to get the full list of routes
2. Compare against entries in `src/lib/state-registry.ts`
3. Flag any routes missing from the registry

### Step 2: Cross-check states against page code

For each page with interactive states (tabs, modals, view toggles):
1. Read the page source code
2. Check that all interactive states are registered as `StateVariant` entries
3. Verify `?state=<id>` is wired in the page component for each variant
4. Flag any states that exist in code but aren't in the registry

### Step 3: Cross-check against screenshot catalog

1. Read `screenshots/screenshot-catalog.md`
2. For each catalog entry with a distinct state (e.g. "modal open", "tab selected"), verify a corresponding variant exists in the registry
3. Add missing variants

### Step 4: Fix gaps

1. Add missing `PageEntry` and `StateVariant` entries to the registry
2. Wire `?state=` support for any new interactive states
3. Verify TypeScript compiles (`npx tsc --noEmit`)

### Step 5: Report

Present a summary: pages checked, variants found, gaps fixed.

## Maintenance Rules — MANDATORY

**Every session that creates or modifies pages MUST update the Dev Navigator.** These rules ensure the navigator stays useful as the prototype grows:

1. **New page** → Add a `PageEntry` to `src/lib/state-registry.ts` with at least a `default` variant. Use the same `group` as related pages.
2. **New interactive state** (tab, modal, view toggle) → Add a `StateVariant` and wire `?state=` support in the page component
3. **New DS component** → Add a Storybook story in `src/components/ds/stories/`. Storybook is auto-built and deployed to `/storybook/` on Vercel.
4. **New screenshot processed** → Update the variant's `screenshot` and `match` fields
5. **Fidelity improvement completed** → Update `match` from `"no"`/`"partial"` to `"yes"`

### Dev Navigator quick links
The navigator footer includes quick links to:
- **Eng Toolkit** (`/eng`) — Live component showcase + page directory
- **Storybook** (`/storybook/index.html`) — DS component documentation (opens in new tab)

### Storybook deployment
Storybook is built as static files during `npm run build` and deployed to `public/storybook/` so it's available at the same Vercel preview URL under `/storybook/index.html`. The build step is: `storybook build -o storybook-static && mv storybook-static public/storybook`.

## Relationship to Other Workflows

```
Option 2 (Process Screenshots)
    │
    ▼
screenshots/screenshot-catalog.md  ◄── source of truth for what screenshots exist
    │
    ▼
Option 4 (Dev Navigator)
    │
    ├── src/lib/state-registry.ts  ◄── reads catalog, adds variants
    │
    └── src/components/DevNavigator.tsx  ◄── renders registry as nav tree
    │
    ▼
Option 3 (Fidelity Loops)
    │
    ├── Uses navigator to find states that need work (match: "no")
    └── Updates match status after improvements
```
