## Project: Splose Practice Management Prototype

**Repo**: `jimsplose/splose-current` — already cloned at `/home/user/splose-current`
**Branch**: `claude/fidelity-gaps-insights-pr-9Eoev`
**Live**: https://splose-current.vercel.app
**CLAUDE.md**: Read it first — it has the full tech stack, project structure, conventions, and deployment workflow.

### Current State
- 15 pages built (dashboard, calendar, clients, contacts, waitlist, invoices, payments, notes, practitioners, products, reports, settings, login, plus client detail and reports sub-pages)
- 80 reference screenshots in `screenshots/reference/`, 82 lines in `screenshots/processed.txt`
- Database seeded with 5 practitioners, 12 clients, 25 appointments, 12 invoices, 8 clinical notes
- Last deploy included: waitlist screener/map tabs, reports sidebar extraction, settings detail form, dashboard improvements, client appointment buttons, expanded seed data

---

### Task 1: Dynamic Content Engine (do this first)

Build a **dynamic content system** so the prototype always feels alive and current, no matter when someone opens it:

1. **Create `src/lib/demo-content.ts`** — a copywriting utility module with:
   - `today()`, `relativeDate(offsetDays)`, `formatDate(date)`, `formatTime(date)` — all Australian locale (`en-AU`, `Australia/Sydney` timezone)
   - `generateAppointments(baseDate: Date)` — returns 2 weeks of realistic appointments spread across practitioners, always anchored to today. Include morning, afternoon, and late slots. Mix of Initial Assessment, Follow Up, Standard, Review, Telehealth, Group Session types. Statuses: past appointments are Completed/No Show/Cancelled, future are Scheduled/Confirmed.
   - `generateMessages(baseDate: Date)` — returns 8-12 realistic dashboard messages (appointment reminders, cancellations, form submissions, payment received, new referral) with timestamps like "2 minutes ago", "1 hour ago", "Yesterday at 3:45 PM"
   - `generateAnalytics(baseDate: Date)` — returns dashboard stats (appointments today, this week, revenue this month, outstanding invoices) with plausible numbers
   - `generateCalendarWeek(baseDate: Date)` — returns a full week of calendar slots for the week view, anchored to today's actual week
   - `generateInvoices(baseDate: Date)` — invoices with dates spread across the last 60 days, with realistic aging (recent = Draft/Sent, older = Paid/Overdue)
   - `generateWaitlistEntries(baseDate: Date)` — entries with "days waiting" that compute from today
   - All text content should read like a real allied health clinic — use Australian names, Medicare/NDIS references, realistic service descriptions ("Initial OT Assessment — Sensory Profile", "Speech Pathology Review — Articulation"), and plausible dollar amounts in AUD

2. **Wire it into every page** — Replace all hardcoded dates, dummy text, and static arrays with calls to the demo-content module. The calendar should show this actual week. The dashboard should say "Today" and mean today. Invoice dates should make sense relative to now. Waitlist "days waiting" should increment naturally.

3. **Keep the DB as fallback** — Pages should try to read from the database first (preserving the Prisma queries), but overlay/merge with generated content so the app always has rich data even if the DB is empty or stale.

---

### Task 2: Screenshot Fidelity Loop (10 rounds)

Run a **10-round fidelity improvement loop** using parallel subagents. Each round:

#### Phase A — Audit (parallel Explore agents)
Launch 4-5 Explore agents simultaneously, each assigned a group of pages:
- Agent 1: Dashboard (`page.tsx`) + Calendar (`calendar/`)
- Agent 2: Clients list + Client detail (`clients/`, `clients/[id]/`)
- Agent 3: Invoices + Payments + Notes (`invoices/`, `payments/`, `notes/`)
- Agent 4: Waitlist + Contacts + Products (`waitlist/`, `contacts/`, `products/`)
- Agent 5: Reports + Settings + Practitioners + Login (`reports/`, `settings/`, `practitioners/`, `login/`)

Each agent should:
1. Read ALL reference screenshots in `screenshots/reference/` that relate to their pages
2. Read the current source code for those pages
3. Produce a **gap list** — specific, actionable items like "Missing filter dropdown in header bar", "Table row height is 48px, should be 40px", "Status badge colors don't match", "Missing hover state on table rows", "Sidebar active state needs left border accent"
4. Rate each gap: P1 (major layout/structure wrong), P2 (component missing or broken), P3 (spacing/color/typography mismatch)

#### Phase B — Fix (parallel worktree agents)
Group the P1 and P2 gaps by file. Launch parallel agents with `isolation: "worktree"` to fix them:
- Each agent reads the relevant screenshots, reads the code, makes fixes, and verifies no TypeScript errors
- Non-conflicting pages run in parallel; same-file changes run sequentially

#### Phase C — Build & Commit
1. Cherry-pick/apply changes from worktrees to the main branch
2. Run `npx next build` to verify
3. Commit with message: `Fidelity round N: [summary of changes]`
4. Push to `claude/fidelity-gaps-insights-pr-9Eoev`

#### Phase D — Log
After each round, append a summary to `FIDELITY_LOG.md`:
```
## Round N — [date]
### Gaps found: X (P1: a, P2: b, P3: c)
### Gaps fixed: Y
### Pages touched: [list]
### Remaining P1/P2: [list]
```

#### Round strategy
- Rounds 1-3: Focus on P1 gaps (layout, structure, missing components)
- Rounds 4-6: Focus on P2 gaps (interactive elements, modals, dropdowns, hover states)
- Rounds 7-8: Focus on P3 gaps (pixel-level spacing, exact colors, typography weights)
- Round 9: Process any NEW screenshots added to `screenshots/reference/` since the session started
- Round 10: Final sweep — every page gets one last comparison, fix any regressions

---

### Task 3: Make It Usable

Beyond visual fidelity, make the prototype **feel functional** for demos:

1. **Working navigation** — Every link in the nav, sidebar, and breadcrumbs should go somewhere real. No dead links.
2. **Clickable table rows** — Clicking a client, invoice, appointment, or note row should navigate to a detail view (even if minimal).
3. **Functional search** — Search bars on clients, invoices, notes pages should filter the displayed data client-side.
4. **Tab switching** — All tab UIs (waitlist screener/waitlist, client detail tabs, settings tabs, report tabs) should switch content.
5. **Modal interactions** — "New appointment", "New client", "New invoice" buttons should open modal forms (don't need to save, just look real).
6. **Calendar navigation** — Week forward/back buttons should work, day headers should update.
7. **Status badges** — Should use consistent colors matching the reference screenshots.
8. **Toast/notification stubs** — Clicking action buttons (Save, Send, Delete) should show a brief toast "Saved successfully" etc.

---

### Deployment

After completing all tasks:
1. Ensure `npx next build` passes clean
2. Commit everything to `claude/fidelity-gaps-insights-pr-9Eoev`
3. Push and fast-forward `main`: `gh api repos/jimsplose/splose-current/git/refs/heads/main -X PATCH -f sha="$(git rev-parse HEAD)"`

---

### Priority Order
1. Dynamic content engine (Task 1) — do this before fidelity rounds so all content is fresh
2. Fidelity loop rounds 1-5 (Task 2, first half)
3. Usability improvements (Task 3) — interleave with fidelity work
4. Fidelity loop rounds 6-10 (Task 2, second half)
5. Final build + deploy
