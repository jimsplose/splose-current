# Fidelity Gaps

Gaps are grouped by which files they touch, so you can see what's safe to parallelize.
Priority ordering: high-traffic pages first (Dashboard, Calendar, Clients), then secondary pages.

## Priority 1 — High-traffic pages

### Group D — Dashboard (`src/app/page.tsx`)
- [ ] **Dashboard improvements** — Compare against reference screenshots (10:53:42-10:56:57 am). Improve messages panel, analytics cards, compose area.

### Group E — Client detail (`src/app/clients/[id]/`)
- [ ] **Client appointments sub-tab** — Add "Send upcoming appointments" button and "+ New appointment" button matching reference at 11:15:20 am.

## Priority 2 — Core workflow pages

### Group A — Waitlist (`src/app/waitlist/`)
- [ ] **Waitlist Screener tab** — Make waitlist page a `"use client"` component with switchable Screener/Waitlist views. Screener view needs: Triage Yes/No thumb buttons, Tags, Client, DOB, Address, Form, Date submitted columns. Reference: screenshots at 11:21:40-11:22:02 am.
- [ ] **Waitlist Map view** — Add Map/List toggle to the Waitlist tab. Show a placeholder map with pins when Map is selected. Reference: screenshot at 11:22:02 am.

### Group C — Settings (`src/app/settings/`)
- [ ] **Settings Details page** — Currently a placeholder. Add a form with: clinic name, ABN, address, phone, email, logo upload area. Reference: screenshot at 5:56:30 pm.

## Priority 3 — Supporting pages

### Group B — Reports (`src/app/reports/`)
- [ ] **Reports sidebar consistency** — The main reports page and sub-pages each duplicate the sidebar. Extract a shared `reports/layout.tsx` or a `ReportsSidebar` component.

### Group F — Responsive (touches multiple files)
- [ ] **Mobile/responsive layouts** — Reference screenshots at 11:14:41, 11:14:52 am show mobile views. Add responsive breakpoints to TopNav, tables, and key pages.

## Priority 4 — Infrastructure

### Group G — Database (`prisma/seed.ts`, `src/app/api/seed/`)
- [ ] **Database re-seed** — Expand to 10+ clients, 18+ appointments, 8+ invoices with varied statuses.

### Group I — Dev Navigator (`src/components/`, `src/lib/`, `src/app/layout.tsx`)
- [ ] **Dev Navigator Phase 1** — Create state registry, floating toolbar component, and wire into root layout. See `docs/dev-navigator-spec.md`.
- [ ] **Dev Navigator Phase 2** — Wire `?state=` param reading into all interactive pages. Add all known variants to the registry.

## Priority 5 — Final polish

### Group H — New screenshot intake (reads all files)
- [ ] **Process new screenshots** — Check `screenshots/reference/` against `screenshots/processed.txt` to find unreviewed screenshots. Launch Explore agents in parallel (batches of 10-15) to read and categorize them. See `docs/screenshot-workflow.md`.

### Group J — Sweep (reads all files)
- [ ] **General fidelity sweep** — Review all pages against their closest reference screenshots and fix remaining visual gaps. Run this last after all other gaps are resolved.

---

## Completed Gaps

_Move completed items here with the date they were finished._
