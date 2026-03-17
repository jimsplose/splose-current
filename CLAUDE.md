# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

**Live URL**: https://splose-current.vercel.app

## Session Start Menu

**At the beginning of every new session**, Claude Code MUST present the user with a choice using AskUserQuestion before doing any other work:

> **What would you like to work on this session?**
>
> 1. **Review status** — Show the current todo list, recently completed tasks, build/deploy status, and fidelity gap summary
> 2. **Process new screenshots** — Scan `screenshots/reference/` for unprocessed screenshots, categorize them, and update the gap list
> 3. **Run fidelity improvement loops** — Pick the next batch of fidelity gaps and run parallel screenshot comparison + code update cycles
> 4. **Build Dev Navigator** — Implement the Dev Toolbar & State Registry (see "Dev Navigator" section below) for browsing all pages, states, and variants
> 5. **Something else** — Free-form request

Wait for the user's answer before proceeding. This ensures each session starts with clear direction and avoids wasted context on the wrong task.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Database**: Turso (libSQL) via Prisma 7 `@prisma/adapter-libsql`
- **Styling**: Tailwind CSS 4 with CSS theme variables
- **Icons**: Lucide React
- **Hosting**: Vercel (auto-deploys from `main` branch)
- **Repo**: github.com/jimsplose/splose-current

## Reference Screenshots

Reference screenshots of the real Splose app are in `screenshots/reference/`. These are the design targets — each page in the prototype should match these as closely as possible. **New screenshots are added regularly** — there are ~380+ and growing (including ~200 recently added with detailed state variants, modals, dropdowns, and interactive menus).

### Screenshot naming convention
Files are named `Screenshot YYYY-MM-DD at H.MM.SS am/pm.png`. They are NOT organized by page — you must read them to determine which page/feature they show.

### Handling new screenshots
When the user selects "Process new screenshots" from the Session Start Menu (or asks directly):
1. **Scan for unprocessed screenshots** — Compare the full list in `screenshots/reference/` against `screenshots/processed.txt` (a log of already-reviewed filenames)
2. **Review new screenshots in parallel** — Launch Explore agents to read batches of new screenshots and categorize them by page/feature
3. **Update state registry** — For each new state/variant/modal discovered, add an entry to `src/lib/state-registry.ts` (once the Dev Navigator exists)
4. **Implement changes** — Use the parallel subagent workflow (see below) to update pages to match
5. **Log processed screenshots** — Append reviewed filenames to `screenshots/processed.txt` so future sessions skip them

### When working on UI fidelity
1. Read the relevant screenshot(s) from `screenshots/reference/`
2. Compare against the current prototype page source code
3. Adjust layout, spacing, colors, typography, component structure, and interactivity to match
4. Pay attention to: modals, dropdowns, hover states, tab switching, expandable rows, form fields, and other interactive elements shown in screenshots
5. Build, commit, and push changes

## Environment Variables

Required in both `.env` (local) and Vercel dashboard:

```
TURSO_DATABASE_URL=libsql://splose-current-jimsplose.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=<your-turso-token>
```

## Development

```bash
npm install              # Install deps (also runs prisma generate via postinstall)
npm run dev              # Start dev server at localhost:3000
```

## Deployment

Vercel auto-deploys when `main` is updated. The build command:
1. `prisma generate` — generates the Prisma client
2. `tsx scripts/db-push.ts` — ensures Turso tables exist (custom script because `prisma db push` doesn't support `libsql://` URLs)
3. `next build` — builds the Next.js app

## Database

### Seeding
The database can be seeded via API: `GET /api/seed` (safe to call multiple times — skips if data exists).

### Schema changes
1. Edit `prisma/schema.prisma`
2. Update `scripts/db-push.ts` if new migrations are needed
3. Run `npx prisma generate` locally to regenerate the client
4. Push to `main` — the build will apply schema changes to Turso

### Models
- **Practitioner** — Clinicians (physios, OTs, speech pathologists). Has `color` for calendar display.
- **Client** — Patients with optional Medicare/NDIS/private funding fields.
- **Appointment** — Scheduled sessions linking a client to a practitioner. Has date, time, status, type.
- **ClinicalNote** — Progress notes with template type and signed/unsigned status.
- **Invoice** — Billing with support for Medicare/NDIS/Private billing types.
- **InvoiceItem** — Line items on an invoice.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Dashboard (messages + analytics)
    layout.tsx            # Root layout with TopNav
    globals.css           # Tailwind theme variables
    api/seed/route.ts     # Database seed endpoint
    login/page.tsx        # Login page (purple gradient)
    calendar/page.tsx     # Week view calendar
    clients/page.tsx      # Client list table with search/pagination
    clients/[id]/page.tsx # Client detail (sidebar + details + right panel)
    contacts/page.tsx     # Contacts list (Type, Name, Company, Email, Phone)
    waitlist/page.tsx     # Waitlist with Screener/Waitlist tabs
    invoices/page.tsx     # Invoice table with search/pagination
    payments/page.tsx     # Payments list
    notes/page.tsx        # Progress notes table
    practitioners/page.tsx# Practitioner cards
    reports/page.tsx      # Reports with sidebar (Performance overview)
    products/page.tsx     # Products list
    settings/page.tsx     # Settings with categorized sidebar
  components/
    TopNav.tsx            # Horizontal top navigation bar ("use client")
    Sidebar.tsx           # Legacy sidebar (unused, kept for reference)
    Header.tsx            # Legacy header (unused, kept for reference)
    StatusBadge.tsx       # Color-coded status badges (server component)
  lib/
    prisma.ts             # Prisma client singleton with Turso adapter
  generated/prisma/       # Auto-generated Prisma client (gitignored)
screenshots/
  reference/              # ~80 screenshots of real Splose app (design targets)
prisma/
  schema.prisma           # Database schema (6 models)
  seed.ts                 # Standalone seed script
  migrations/             # SQL migrations
scripts/
  db-push.ts              # Executes migration SQL against Turso during build
```

## Key Conventions

- **Server components by default** — only use `"use client"` when React hooks or browser APIs are needed
- **`export const dynamic = "force-dynamic"`** on pages that fetch data, for fresh reads
- **Prisma v7 adapter pattern** — `PrismaLibSql` takes `{ url, authToken }` directly (not a libsql Client instance)
- **Tailwind CSS variables** — colors defined in `globals.css` under `@theme inline` (e.g. `--color-primary: #7c3aed`, `--color-accent: #2d6d40`)
- **Australian locale** — dates, Medicare numbers, NDIS references, AUD currency
- **`tsconfig.json` excludes** — `prisma/seed.ts` and `scripts/` are excluded from Next.js type checking (they run standalone via `tsx`)

## Working Style

**The project owner (Jim) is non-technical and does not use the terminal.** All coding, git operations, builds, deployments, and debugging should be handled entirely by Claude Code. Never ask Jim to:
- Run terminal commands locally
- Edit code or config files manually
- Debug build errors or git conflicts
- Install packages or tools

If something requires action on Jim's local Mac (e.g. pushing screenshots), provide exact copy-paste commands with clear context. Keep these to an absolute minimum — prefer doing everything from the cloud environment.

When changes need to reach production:
1. Claude Code commits and pushes to `claude/*` branch
2. Claude Code updates `main` via GitHub API (fast-forward)
3. Vercel auto-deploys from `main`

## Fidelity Improvement Workflow

When asked to improve fidelity or work through gaps, use **parallel subagents** for speed:

### Step 1: Launch parallel agents (worktree isolation)
Group non-conflicting gaps and launch them simultaneously using the Agent tool with `isolation: "worktree"`. Each agent should:
1. Read the relevant reference screenshot(s) from `screenshots/reference/`
2. Read the current page source code
3. Rewrite/edit the code to match the screenshot
4. Ensure no TypeScript errors in the changed files

**Parallelization rules — which gaps can run together:**
- Gaps touching **different page directories** can always run in parallel
- Gaps touching the **same file** must run sequentially
- The **database re-seed** gap should run alone (it changes seed data that pages read)
- The **general screenshot review** agent should run last as a sweep

### Step 2: Collect and apply changes
After agents complete:
1. For each agent that made changes in a worktree, review the diff and cherry-pick/apply to the main branch
2. If an agent's worktree has conflicts with another, resolve manually

### Step 3: Build, commit, push, deploy
1. Run `npx next build` to verify no errors
2. Stage and commit all changes with a descriptive message
3. Push to the `claude/*` branch
4. Fast-forward `main` via `gh api repos/jimsplose/splose-current/git/refs/heads/main -X PATCH -f sha="$SHA"`

### Step 4: Repeat
Pick the next batch of gaps and repeat. Keep going until all gaps are resolved or the session runs low on context.

## Remaining Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.

### Group A — Waitlist (`src/app/waitlist/`)
1. **Waitlist Screener tab** — Make waitlist page a `"use client"` component with switchable Screener/Waitlist views. Screener view needs: Triage Yes/No thumb buttons, Tags, Client, DOB, Address, Form, Date submitted columns. The screener data is already defined in the page. Reference: screenshots at 11:21:40-11:22:02 am.
2. **Waitlist Map view** — Add Map/List toggle to the Waitlist tab. Show a placeholder map with pins when Map is selected. Reference: screenshot at 11:22:02 am.

### Group B — Reports (`src/app/reports/`)
3. **Reports sidebar consistency** — The main reports page and sub-pages each duplicate the sidebar. Extract a shared `reports/layout.tsx` or a `ReportsSidebar` component.

### Group C — Settings (`src/app/settings/`)
4. **Settings Details page** — Currently a placeholder. Add a form with: clinic name, ABN, address, phone, email, logo upload area. Reference: screenshot at 5:56:30 pm.

### Group D — Dashboard (`src/app/page.tsx`)
5. **Dashboard improvements** — Compare against reference screenshots (10:53:42-10:56:57 am). Improve messages panel, analytics cards, compose area.

### Group E — Client detail (`src/app/clients/[id]/`)
6. **Client appointments sub-tab** — Add "Send upcoming appointments" button and "+ New appointment" button matching reference at 11:15:20 am.

### Group F — Responsive (touches multiple files)
7. **Mobile/responsive layouts** — Reference screenshots at 11:14:41, 11:14:52 am show mobile views. Add responsive breakpoints to TopNav, tables, and key pages.

### Group G — Database (`prisma/seed.ts`, `src/app/api/seed/`)
8. **Database re-seed** — Expand to 10+ clients, 18+ appointments, 8+ invoices with varied statuses.

### Group H — New screenshot intake (reads all files)
9. **Process new screenshots** — Check `screenshots/reference/` against `screenshots/processed.txt` to find unreviewed screenshots. Launch Explore agents in parallel (batches of 10-15) to read and categorize them by page/feature. Then create new gaps or update existing pages to match. Append processed filenames to `screenshots/processed.txt`. This should run at the **start** of each session to pick up newly added screenshots.

### Group I — Dev Navigator (`src/components/`, `src/lib/`, `src/app/layout.tsx`)
10. **Dev Navigator Phase 1** — Create state registry, floating toolbar component, and wire into root layout. See "Dev Navigator" section for full spec.
11. **Dev Navigator Phase 2** — Wire `?state=` param reading into all interactive pages (calendar, waitlist, settings, payments, products, notes/new). Add all known variants to the registry.

### Group J — Sweep (reads all files)
12. **General fidelity sweep** — Review all pages against their closest reference screenshots and fix remaining visual gaps. Run this last after all other gaps are resolved.

## Dev Navigator (Option D — Floating Toolbar + URL State)

A development-only navigation system for browsing every page, state variant, modal, and interactive view in the prototype. This is NOT part of the real Splose UI — it's a tool for reviewing fidelity against screenshots.

### Architecture

```
src/
  components/
    DevNavigator.tsx       # Floating toolbar component ("use client")
  lib/
    state-registry.ts      # Central registry of all pages and their state variants
  app/
    layout.tsx             # Conditionally renders <DevNavigator /> (always on in dev, hidden via ?devnav=0)
```

### 1. State Registry (`src/lib/state-registry.ts`)

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

**Key rule**: When a new page or state variant is created (from screenshot comparison), the developer MUST also add it to the state registry. This keeps the navigator in sync.

### 2. URL State Parameter

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
  // etc.
}, [forcedState]);
```

This makes every state variant **bookmarkable** and **linkable**: `/waitlist?state=screener-triage` always shows the screener triage view.

### 3. Dev Navigator Component (`src/components/DevNavigator.tsx`)

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

### 4. Page Integration Pattern

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

### 5. Implementation Order

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

### 6. Future Enhancements

- **Screenshot overlay mode**: Load the reference screenshot as a semi-transparent overlay on top of the live page for pixel comparison
- **Automated state crawling**: A script that visits every registry URL and captures screenshots for automated diffing
- **State completeness report**: Compare registry entries against `screenshots/processed.txt` to find states that have screenshots but no registry entry (and vice versa)

## Git Workflow

- Claude Code works on `claude/*` branches, then updates `main` via GitHub API
- Vercel deploys from both `main` (production) and other branches (preview)
- Production URL: splose-current.vercel.app
