# Dev Navigator Spec (Option D — Floating Toolbar + URL State)

A development-only navigation system for browsing every page, state variant, modal, and interactive view in the prototype. This is NOT part of the real Splose UI — it's a tool for reviewing fidelity against screenshots.

## Architecture

```
src/
  components/
    DevNavigator.tsx       # Floating toolbar component ("use client")
  lib/
    state-registry.ts      # Central registry of all pages and their state variants
  app/
    layout.tsx             # Conditionally renders <DevNavigator /> (always on in dev, hidden via ?devnav=0)
```

## 1. State Registry (`src/lib/state-registry.ts`)

A single TypeScript file that catalogs every page and its navigable variants:

```ts
export interface StateVariant {
  id: string;            // URL-safe identifier, e.g. "screener-triage"
  label: string;         // Human-readable, e.g. "Screener → Triage"
  description?: string;  // Optional tooltip
  screenshot?: string;   // Reference screenshot filename for comparison
}

export interface PageEntry {
  path: string;          // Route, e.g. "/waitlist"
  label: string;         // Display name, e.g. "Waitlist"
  variants: StateVariant[];
  children?: PageEntry[]; // Sub-pages, e.g. /clients/[id]/notes
}

export const stateRegistry: PageEntry[] = [
  {
    path: "/",
    label: "Dashboard",
    variants: [
      { id: "default", label: "Default" },
    ],
  },
  {
    path: "/calendar",
    label: "Calendar",
    variants: [
      { id: "default", label: "Week view" },
      { id: "appointment-selected", label: "Appointment selected" },
      { id: "new-appointment", label: "New appointment modal" },
    ],
  },
  {
    path: "/waitlist",
    label: "Waitlist",
    variants: [
      { id: "screener-triage", label: "Screener → Triage" },
      { id: "screener-rejected", label: "Screener → Rejected" },
      { id: "waitlist-list", label: "Waitlist → List" },
      { id: "waitlist-map", label: "Waitlist → Map" },
    ],
  },
  // ... every page and variant
];
```

**Key rule**: When a new page or state variant is created (from screenshot comparison), the developer MUST also add it to the state registry.

**Data source**: The state registry should be populated from `screenshots/screenshot-catalog.md`, which is maintained by the screenshot processing workflow. If the catalog exists when the Dev Navigator is first built, use it to pre-populate all known variants.

## 2. URL State Parameter

Each page reads an optional `?state=<variant-id>` query parameter via `useSearchParams()`. When present, the page forces itself into the specified state:

```ts
// Example: in waitlist/page.tsx
const searchParams = useSearchParams();
const forcedState = searchParams.get("state");

useEffect(() => {
  if (forcedState === "screener-triage") {
    setMainTab("screener");
    setScreenerTab("triage");
  } else if (forcedState === "waitlist-map") {
    setMainTab("waitlist");
    setViewMode("map");
  }
}, [forcedState]);
```

This makes every state variant **bookmarkable** and **linkable**: `/waitlist?state=screener-triage` always shows the screener triage view.

## 3. Dev Navigator Component (`src/components/DevNavigator.tsx`)

A floating panel triggered by a small pill button fixed in the bottom-right corner:

**Collapsed state**: A small `[Nav]` pill button, semi-transparent, bottom-right
**Expanded state**: A 320px-wide panel with:
- Search/filter input at top
- Collapsible tree of all pages and variants from the state registry
- Each variant is a link: clicking navigates to `/<page>?state=<variant-id>`
- Current page/variant highlighted
- "Hide" button to collapse back to pill
- Can be fully hidden with `?devnav=0` query param (for clean screenshots)

**Styling**: Dark semi-transparent overlay (`bg-gray-900/95 text-white`) so it's visually distinct from the Splose UI and doesn't interfere with screenshot comparisons.

## 4. Page Integration Pattern

Each interactive page follows this pattern to support forced state:

```ts
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SomePage() {
  const searchParams = useSearchParams();
  const forcedState = searchParams.get("state");

  const [activeTab, setActiveTab] = useState("default");

  // Force state from URL if present
  useEffect(() => {
    if (forcedState && STATE_MAP[forcedState]) {
      STATE_MAP[forcedState](); // Apply the forced state
    }
  }, [forcedState]);

  // ... rest of page
}
```

## 5. Implementation Order

**Phase 1 — Foundation** (do first, single agent)
1. Create `src/lib/state-registry.ts` with all currently known pages and variants
2. Create `src/components/DevNavigator.tsx` (floating pill + expandable panel)
3. Add `<DevNavigator />` to `src/app/layout.tsx` with `?devnav=0` hide support

**Phase 2 — Wire up existing pages** (parallel agents, one per page)
4. Add `?state=` reading to each interactive page (calendar, waitlist, settings, payments, products, notes/new)
5. Add state entries to the registry as each page is wired

**Phase 3 — Ongoing maintenance** (convention, not a one-time task)
6. Every time a new screenshot comparison loop creates a new state/variant/modal, add it to the registry
7. The Dev Navigator automatically picks up new entries

## 6. Future Enhancements

- **Screenshot overlay mode**: Load the reference screenshot as a semi-transparent overlay on top of the live page for pixel comparison
- **Automated state crawling**: A script that visits every registry URL and captures screenshots for automated diffing
- **State completeness report**: Compare registry entries against `screenshots/processed.txt` to find states that have screenshots but no registry entry (and vice versa)
