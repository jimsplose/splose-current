# Project Structure

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
    contacts/[id]/page.tsx# Contact detail with sidebar tabs
    waitlist/page.tsx     # Waitlist with Screener/Waitlist tabs
    invoices/page.tsx     # Invoice table with search/pagination
    invoices/[id]/page.tsx# Invoice detail document view
    payments/page.tsx     # Payments list with expandable rows
    payments/new/page.tsx # New payment form
    notes/page.tsx        # Progress notes table
    notes/new/page.tsx    # New progress note editor
    notes/[id]/page.tsx   # Note detail view
    practitioners/page.tsx# Practitioner cards
    reports/page.tsx      # Reports with sidebar (Performance overview)
    reports/performance/  # Performance sub-report
    products/page.tsx     # Products list with expandable variants
    settings/page.tsx     # Settings with categorized sidebar
    settings/ai/page.tsx  # AI settings with tabs
  components/
    TopNav.tsx            # Horizontal top navigation bar ("use client")
    DevNavigator.tsx      # Dev-only floating nav (once built)
    StatusBadge.tsx       # Color-coded status badges (server component)
  lib/
    prisma.ts             # Prisma client singleton with Turso adapter
    state-registry.ts     # Dev Navigator state registry (once built)
  generated/prisma/       # Auto-generated Prisma client (gitignored)
docs/
  screenshot-workflow.md  # How to process new screenshots
  fidelity-workflow.md    # Parallel subagent workflow for fidelity improvements
  fidelity-gaps.md        # Prioritized list of remaining gaps (with checkboxes)
  dev-navigator-spec.md   # Full Dev Navigator specification
  progress.md             # Append-only session progress log
  project-structure.md    # This file
screenshots/
  reference/              # ~380+ screenshots of real Splose app (design targets)
  processed.txt           # Log of already-reviewed screenshot filenames
  screenshot-catalog.md   # Organized lookup table of screenshots by page/state
prisma/
  schema.prisma           # Database schema (6 models)
  seed.ts                 # Standalone seed script
  migrations/             # SQL migrations
scripts/
  db-push.ts              # Executes migration SQL against Turso during build
```

## Database Models

- **Practitioner** — Clinicians (physios, OTs, speech pathologists). Has `color` for calendar display.
- **Client** — Patients with optional Medicare/NDIS/private funding fields.
- **Appointment** — Scheduled sessions linking a client to a practitioner. Has date, time, status, type.
- **ClinicalNote** — Progress notes with template type and signed/unsigned status.
- **Invoice** — Billing with support for Medicare/NDIS/Private billing types.
- **InvoiceItem** — Line items on an invoice.
