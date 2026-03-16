# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Database**: SQLite via Prisma 7 (with better-sqlite3 adapter)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## Getting Started

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

## Project Structure

```
src/
  app/              # Next.js App Router pages
    page.tsx        # Dashboard
    calendar/       # Appointment calendar (day/week view)
    clients/        # Client list + detail pages
    notes/          # Clinical notes
    invoices/       # Invoice management
    practitioners/  # Practitioner profiles
    settings/       # Settings page
  components/       # Shared UI components
    Sidebar.tsx     # Main navigation sidebar
    Header.tsx      # Page header with search
    StatusBadge.tsx # Color-coded status badges
  lib/
    prisma.ts       # Prisma client singleton
  generated/
    prisma/         # Generated Prisma client (gitignored)
prisma/
  schema.prisma     # Database schema
  seed.ts           # Seed data script
  migrations/       # Database migrations
```

## Database Models

- **Practitioner** - Clinicians (physios, OTs, speech pathologists)
- **Client** - Patients with Medicare/NDIS/private funding
- **Appointment** - Scheduled sessions linking clients and practitioners
- **ClinicalNote** - Progress notes, NDIS notes, etc.
- **Invoice** / **InvoiceItem** - Billing with Medicare/NDIS/Private support

## Key Conventions

- Server components by default; `"use client"` only where needed (Sidebar, Header)
- `export const dynamic = "force-dynamic"` on data-fetching pages for fresh reads
- Prisma client uses better-sqlite3 adapter (Prisma v7 requirement)
- Tailwind uses CSS theme variables defined in `globals.css`
- Australian locale (date formats, Medicare, NDIS references)
