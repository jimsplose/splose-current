# Dev Navigator — Option D Implementation Plan

A development-only floating toolbar, state registry, and navigation menu for browsing every page, state variant, modal, and interactive view in the prototype. This is NOT part of the real Splose UI — it's a tool for reviewing fidelity against reference screenshots.

---

## Problem

The prototype has 30+ page routes, many with multiple tab states, modals, and interactive views. There's no easy way to:
- See all available pages and states at a glance
- Navigate directly to a specific state (e.g. "Waitlist → Screener → Triage")
- Know which states have reference screenshots and whether they match
- Bookmark or link to a specific UI state for review

## Solution

Three interconnected pieces:

1. **State Registry** — A TypeScript data file cataloging every page + variant
2. **URL State Parameter** — `?state=<id>` forces any page into a specific state
3. **Dev Navigator Component** — Floating toolbar with expandable navigation panel

---

## Existing App Structure

### Routes (30 pages)

| Section | Routes |
|---|---|
| Dashboard | `/` |
| Calendar | `/calendar` |
| Clients | `/clients`, `/clients/[id]`, `/clients/[id]/appointments`, `/clients/[id]/cases`, `/clients/[id]/forms`, `/clients/[id]/invoices`, `/clients/[id]/notes`, `/clients/[id]/practitioner-access` |
| Contacts | `/contacts`, `/contacts/[id]` |
| Waitlist | `/waitlist` |
| Invoices | `/invoices`, `/invoices/[id]` |
| Payments | `/payments`, `/payments/new` |
| Notes | `/notes`, `/notes/[id]`, `/notes/new` |
| Practitioners | `/practitioners` |
| Products | `/products` |
| Reports | `/reports`, `/reports/appointments`, `/reports/performance`, `/reports/progress-notes` |
| Settings | `/settings`, `/settings/ai` |
| Login | `/login` |

### Existing Components

- `TopNav.tsx` — Main navigation bar (client component, `usePathname`)
- `ReportsSidebar.tsx` — Sidebar for reports section
- `StatusBadge.tsx` — Reusable status badge

### Layout Structure

- `src/app/layout.tsx` — Root layout (renders `<TopNav />` + `<main>`)
- `src/app/login/layout.tsx` — Login layout (no nav)
- `src/app/reports/layout.tsx` — Reports layout (with sidebar)

### Reference Screenshots

80 screenshots in `screenshots/reference/`, tracked in `screenshots/processed.txt`. Once processed, `screenshots/screenshot-catalog.md` maps each to a page/variant/match-status.

---

## Architecture

```
src/
  lib/
    state-registry.ts        # Central catalog of all pages and state variants
  components/
    DevNavigator.tsx          # Floating toolbar + expandable panel ("use client")
  app/
    layout.tsx                # Conditionally renders <DevNavigator />
```

---

## 1. State Registry (`src/lib/state-registry.ts`)

A single TypeScript file that catalogs every page and its navigable variants.

### Types

```ts
export interface StateVariant {
  id: string;              // URL-safe identifier, e.g. "screener-triage"
  label: string;           // Human-readable, e.g. "Screener → Triage"
  description?: string;    // Tooltip/context
  screenshot?: string;     // Reference screenshot filename
  match?: "yes" | "partial" | "no" | "unknown";  // Fidelity match status
}

export interface PageEntry {
  path: string;            // Route pattern, e.g. "/clients/[id]"
  resolvedPath?: string;   // Concrete path with real IDs, e.g. "/clients/1"
  label: string;           // Display name, e.g. "Client Detail"
  group?: string;          // Nav section for grouping: "Clients", "Reports", etc.
  variants: StateVariant[];
  children?: PageEntry[];  // Sub-pages (tabs, nested routes)
}

export const stateRegistry: PageEntry[] = [ ... ];
```

### Initial Population

The registry should be populated from two sources:
1. **Route audit** (above) — every route gets a `default` variant at minimum
2. **Screenshot catalog** (`screenshots/screenshot-catalog.md`) — if it exists, add variants with screenshot references and match status

### Example Entries

```ts
export const stateRegistry: PageEntry[] = [
  {
    path: "/",
    label: "Dashboard",
    group: "Dashboard",
    variants: [
      { id: "default", label: "Default view" },
    ],
  },
  {
    path: "/calendar",
    label: "Calendar",
    group: "Calendar",
    variants: [
      { id: "default", label: "Week view" },
      { id: "day-view", label: "Day view" },
      { id: "appointment-selected", label: "Appointment selected" },
      { id: "new-appointment", label: "New appointment modal" },
    ],
  },
  {
    path: "/clients",
    label: "Clients",
    group: "Clients",
    variants: [
      { id: "default", label: "Client list" },
    ],
    children: [
      {
        path: "/clients/[id]",
        resolvedPath: "/clients/1",
        label: "Client Detail",
        variants: [
          { id: "default", label: "Details tab" },
          { id: "edit-mode", label: "Details → Edit mode" },
        ],
        children: [
          {
            path: "/clients/[id]/appointments",
            resolvedPath: "/clients/1/appointments",
            label: "Appointments",
            variants: [{ id: "default", label: "Appointments list" }],
          },
          {
            path: "/clients/[id]/notes",
            resolvedPath: "/clients/1/notes",
            label: "Notes",
            variants: [{ id: "default", label: "Notes list" }],
          },
          {
            path: "/clients/[id]/invoices",
            resolvedPath: "/clients/1/invoices",
            label: "Invoices",
            variants: [{ id: "default", label: "Invoices list" }],
          },
          {
            path: "/clients/[id]/cases",
            resolvedPath: "/clients/1/cases",
            label: "Cases",
            variants: [{ id: "default", label: "Cases list" }],
          },
          {
            path: "/clients/[id]/forms",
            resolvedPath: "/clients/1/forms",
            label: "Forms",
            variants: [{ id: "default", label: "Forms list" }],
          },
          {
            path: "/clients/[id]/practitioner-access",
            resolvedPath: "/clients/1/practitioner-access",
            label: "Practitioner Access",
            variants: [{ id: "default", label: "Access list" }],
          },
        ],
      },
    ],
  },
  {
    path: "/waitlist",
    label: "Waitlist",
    group: "Waitlist",
    variants: [
      { id: "default", label: "Waitlist list view" },
      { id: "screener-triage", label: "Screener → Triage" },
      { id: "screener-rejected", label: "Screener → Rejected" },
      { id: "waitlist-map", label: "Map view" },
    ],
  },
  {
    path: "/invoices",
    label: "Invoices",
    group: "Invoices",
    variants: [
      { id: "default", label: "Invoice list" },
    ],
    children: [
      {
        path: "/invoices/[id]",
        resolvedPath: "/invoices/1",
        label: "Invoice Detail",
        variants: [{ id: "default", label: "Invoice detail" }],
      },
    ],
  },
  // ... all remaining pages follow same pattern
];
```

### Helper Functions

```ts
/** Flatten the tree into a flat list for search/filter */
export function flattenRegistry(entries?: PageEntry[]): PageEntry[];

/** Find a page entry by its path */
export function findByPath(path: string): PageEntry | undefined;

/** Get the resolved URL for a variant: /page?state=variant-id */
export function getVariantUrl(page: PageEntry, variant: StateVariant): string;

/** Count total variants across all pages */
export function countVariants(): { pages: number; variants: number };
```

---

## 2. URL State Parameter (`?state=<variant-id>`)

Each interactive page reads `?state=<id>` from the URL and forces itself into that state. This makes every variant **bookmarkable** and **linkable**.

### Integration Pattern

Pages that support multiple states add a `useEffect` that reads the state param:

```ts
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Map of state IDs to the actions that activate them
const STATE_MAP: Record<string, () => void> = {};

export default function WaitlistPage() {
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  const [mainTab, setMainTab] = useState("waitlist");
  const [viewMode, setViewMode] = useState("list");

  // Populate STATE_MAP after state setters are available
  STATE_MAP["screener-triage"] = () => { setMainTab("screener"); };
  STATE_MAP["screener-rejected"] = () => { setMainTab("screener"); /* then switch sub-tab */ };
  STATE_MAP["waitlist-map"] = () => { setMainTab("waitlist"); setViewMode("map"); };

  useEffect(() => {
    if (forcedState && STATE_MAP[forcedState]) {
      STATE_MAP[forcedState]();
    }
  }, [forcedState]);

  // ... rest of page
}
```

### Pages Requiring State Wiring

Only pages with interactive states (tabs, modals, view toggles) need wiring. Static pages just have a `default` variant.

| Page | States to wire |
|---|---|
| `/calendar` | day/week view, appointment selected, new appointment modal |
| `/waitlist` | screener/waitlist tabs, triage/rejected sub-tabs, list/map view |
| `/clients/[id]` | detail tabs (details, appointments, notes, invoices, cases, forms, access) |
| `/invoices/[id]` | invoice detail states |
| `/notes/new` | template selection, note editing |
| `/payments/new` | payment form states |
| `/settings` | settings form sections |
| `/reports/*` | report type variants |

Simple list pages (`/clients`, `/contacts`, `/invoices`, `/payments`, `/notes`, `/practitioners`, `/products`) only need `default`.

---

## 3. Dev Navigator Component (`src/components/DevNavigator.tsx`)

A floating toolbar that provides quick navigation to any page or state variant.

### Visual Design

**Collapsed state:**
- Small floating pill in bottom-right corner: `[◆ Nav]`
- Semi-transparent, doesn't interfere with page content
- Click to expand

**Expanded state:**
- 320px-wide panel, anchored bottom-right
- Dark overlay background (`bg-gray-900/95 text-white`) — visually distinct from Splose UI
- Max height 70vh, scrollable
- Components:
  - **Header**: "Dev Navigator" title + close button + variant count badge
  - **Search bar**: Filter pages and variants by name (instant, client-side)
  - **Page tree**: Collapsible groups matching TopNav sections
    - Each page shows its route and variant count
    - Expand a page to see all variants as clickable links
    - Current page/variant highlighted with accent color
    - Variants with `match: "no"` shown with red dot (needs work)
    - Variants with `match: "partial"` shown with yellow dot
    - Variants with `match: "yes"` shown with green dot
  - **Footer**: Total pages/variants count, "Hide" button

**Hidden state:**
- Add `?devnav=0` to any URL to fully hide the navigator (for clean screenshots)
- When hidden, no DOM is rendered at all

### Component Structure

```tsx
"use client";
import { useState, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { stateRegistry, flattenRegistry, getVariantUrl, countVariants } from "@/lib/state-registry";

export default function DevNavigator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  // Hide completely if ?devnav=0
  if (searchParams.get("devnav") === "0") return null;

  // Don't render on login page
  if (pathname === "/login") return null;

  const { pages, variants } = countVariants();
  const filtered = useMemo(() => filterBySearch(search), [search]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-gray-900/90 px-3 py-1.5
                   text-xs font-medium text-white shadow-lg hover:bg-gray-900
                   backdrop-blur-sm transition-all"
      >
        ◆ Nav
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-[70vh] rounded-lg
                    bg-gray-900/95 text-white shadow-2xl backdrop-blur-sm
                    flex flex-col overflow-hidden">
      {/* Header */}
      {/* Search */}
      {/* Page tree */}
      {/* Footer */}
    </div>
  );
}
```

### Keyboard Shortcut

- `Ctrl+Shift+N` (or `Cmd+Shift+N` on Mac) toggles the navigator open/closed
- `Escape` closes when open

---

## 4. Layout Integration

Add `<DevNavigator />` to the root layout, rendered on every page:

```tsx
// src/app/layout.tsx
import DevNavigator from "@/components/DevNavigator";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TopNav />
        <main>{children}</main>
        <DevNavigator />
      </body>
    </html>
  );
}
```

Since `DevNavigator` is a client component with its own `"use client"` directive, this works fine in the server layout — Next.js handles the boundary automatically.

---

## 5. Implementation Phases

### Phase 1 — Foundation (single session, ~1-2 hours)

**Goal**: Get the navigator visible and functional with basic page navigation.

| Step | Task | Files |
|---|---|---|
| 1.1 | Create state registry with all 30 routes and `default` variants | `src/lib/state-registry.ts` |
| 1.2 | Add known interactive variants (calendar views, waitlist tabs, client tabs) | `src/lib/state-registry.ts` |
| 1.3 | Build DevNavigator component (collapsed pill + expanded panel) | `src/components/DevNavigator.tsx` |
| 1.4 | Add search/filter functionality | `src/components/DevNavigator.tsx` |
| 1.5 | Add keyboard shortcut (Ctrl+Shift+N) | `src/components/DevNavigator.tsx` |
| 1.6 | Integrate into root layout | `src/app/layout.tsx` |
| 1.7 | Verify build passes, commit + push | — |

**Acceptance criteria:**
- Navigator pill visible on every page (except login)
- Clicking pill opens panel with all pages grouped by section
- Clicking a page name navigates to it
- Search filters pages by name
- `?devnav=0` hides everything
- Build passes

### Phase 2 — State Wiring (parallel agents, one per page group)

**Goal**: Make `?state=<id>` work on interactive pages so variants are directly navigable.

| Agent | Pages | States to wire |
|---|---|---|
| Agent A | `/calendar` | week-view, day-view, appointment-selected, new-appointment |
| Agent B | `/waitlist` | screener-triage, screener-rejected, waitlist-list, waitlist-map |
| Agent C | `/clients/[id]` + sub-tabs | details, appointments, notes, invoices, cases, forms, practitioner-access |
| Agent D | `/invoices/[id]`, `/notes/new`, `/payments/new` | detail views, form states |
| Agent E | `/settings`, `/reports/*` | settings sections, report types |

Each agent:
1. Reads the page source
2. Adds `useSearchParams()` + state switching logic
3. Ensures the page's variants in the registry have correct IDs
4. Verifies no TS errors (`npx tsc --noEmit`)

**Acceptance criteria:**
- Every interactive variant is reachable via `/<page>?state=<id>`
- Navigator links go directly to the correct state
- No TS errors

### Phase 3 — Screenshot Integration (after screenshot catalog exists)

**Goal**: Connect the navigator to the screenshot catalog so you can see which states match and which need work.

| Step | Task |
|---|---|
| 3.1 | Parse `screenshots/screenshot-catalog.md` and populate `screenshot` and `match` fields in the registry |
| 3.2 | Show match-status dots (green/yellow/red) next to each variant in the navigator |
| 3.3 | Add a "Needs work" filter that shows only `match: "no"` or `match: "partial"` variants |
| 3.4 | Add variant count summary in navigator footer: "12/45 matched, 8 partial, 25 unmatched" |

### Phase 4 — Enhanced Features (future, low priority)

| Feature | Description |
|---|---|
| Screenshot overlay | Load reference screenshot as semi-transparent overlay on live page for pixel comparison |
| Automated crawling | Script that visits every registry URL and captures screenshots for diffing |
| Completeness report | Compare registry vs screenshot catalog to find missing coverage |
| State URL sharing | Copy button next to each variant that copies the full URL to clipboard |

---

## 6. Maintenance Rules — MANDATORY

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

---

## 7. Relationship to Other Workflows

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

- **Option 2 feeds Option 4**: Processing screenshots creates the catalog that populates the registry
- **Option 4 feeds Option 3**: The navigator shows which states need fidelity work
- **Option 3 updates Option 4**: Fidelity improvements update match status in the registry
- They work independently but feed each other — no circular dependency
