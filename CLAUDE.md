# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

**Live URL**: https://splose-current.vercel.app

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Database**: Turso (libSQL) via Prisma 7 `@prisma/adapter-libsql`
- **Styling**: Tailwind CSS 4 with CSS theme variables
- **Icons**: Lucide React
- **Hosting**: Vercel (auto-deploys from `main` branch)
- **Repo**: github.com/jimsplose/splose-current

## Reference Screenshots

Reference screenshots of the real Splose app are in `screenshots/reference/`. These are the design targets — each page in the prototype should match these as closely as possible.

When working on UI fidelity:
1. Read the relevant screenshot(s) from `screenshots/reference/`
2. Compare against the current prototype page
3. Adjust layout, spacing, colors, typography, and component structure to match
4. Commit and push changes

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
    page.tsx              # Dashboard (stats, schedule, invoices)
    layout.tsx            # Root layout with Sidebar
    globals.css           # Tailwind theme variables
    api/seed/route.ts     # Database seed endpoint
    calendar/page.tsx     # Day view calendar with practitioner columns
    clients/page.tsx      # Client list table
    clients/[id]/page.tsx # Client detail (appointments, notes)
    notes/page.tsx        # Clinical notes list
    invoices/page.tsx     # Invoice table with status stats
    practitioners/page.tsx# Practitioner cards
    settings/page.tsx     # Settings categories
  components/
    Sidebar.tsx           # Navigation sidebar ("use client")
    Header.tsx            # Page header with search ("use client")
    StatusBadge.tsx       # Color-coded status badges (server component)
  lib/
    prisma.ts             # Prisma client singleton with Turso adapter
  generated/prisma/       # Auto-generated Prisma client (gitignored)
screenshots/
  reference/              # Screenshots of real Splose app (design targets)
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
- **Tailwind CSS variables** — colors defined in `globals.css` under `@theme inline` (e.g. `--color-primary`, `--color-sidebar`)
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

## Git Workflow

- Claude Code works on `claude/*` branches, then updates `main` via GitHub API
- Vercel deploys from both `main` (production) and other branches (preview)
- Production URL: splose-current.vercel.app
