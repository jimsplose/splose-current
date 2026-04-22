# Wave 5 · Plan 06 — Utility-class cleanup on remaining app surfaces

**Status:** Done
**Estimated effort:** M (broad sweep, ~10–15 files with ~30–100 utility usages each)
**Recommended model:** Sonnet 4.6 (mostly mechanical); Opus 4.7 if `dashboard/DashboardClient.tsx` looks tangled
**Thinking budget:** think

## Why this plan exists

Plans 01–05 clean utility classes as a side-effect of their DS adoption work. Several app surfaces don't have a Wave 4 DS adoption story of their own but still carry utility-class usage. This plan sweeps those surfaces so `globals.css` can be fully deleted in Plan 08.

## Surfaces

Everything under `src/app/` that isn't covered by Plans 01–05:

- `src/app/DashboardClient.tsx` + `src/app/page.tsx` — home / dashboard
- `src/app/reports/**` — reports + aged-debtors (if Plan 02 didn't fully cover) + performance + ndis-bulk-upload
- `src/app/notes/**` — note list + note edit + note view
- `src/app/products/**` — products list
- `src/app/payments/new/**` — new payment flow (if Plan 02 didn't cover)
- `src/app/online-booking/**` — public booking surface
- Any remaining `.tsx` files in `src/app/` not covered elsewhere (check via grep before starting)

## Scope

Utility-class removal only. No new DS component adoption (use the existing DS components that are already on those pages — `Text`, `Card`, `Badge`, etc. — plus Wave 4 components where a pattern clearly matches, but don't force migrations).

Follow the replacement mapping + priority ladder in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference).

## Pre-start audit

Get the list of remaining files with utility-class hits:

```bash
# Typography
grep -rln 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app --include='*.tsx' | grep -v stories \
  | grep -v -E 'calendar|invoices|payments|clients|patients|waitlist|contacts|settings'

# Layout
grep -rln 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b' \
  src/app --include='*.tsx' | grep -v stories \
  | grep -v -E 'calendar|invoices|payments|clients|patients|waitlist|contacts|settings'
```

Record the file list + hit count per file. Dispatch one subagent per top-level subdirectory (dashboard, reports, notes, products, online-booking) so they run in parallel — surfaces are independent.

## Chrome MCP verification

For each subdirectory's representative route, dual-tab measure production vs localhost using the snippets in README.md. Routes:

- `/` (dashboard)
- `/reports` + `/reports/performance`
- `/notes/[id]` + `/notes/[id]/edit`
- `/products`
- `/online-booking`

Thresholds: typography exact; spacing ±2px; color exact RGB.

## Commit discipline

One commit per top-level subdirectory:

1. `dashboard/` + `/` home
2. `reports/` (all report sub-pages)
3. `notes/` (list + edit + view)
4. `products/`
5. `online-booking/`
6. Any leftover files in a catch-all commit
7. Wave 5 Plan 06 status flip + session log

## Acceptance criteria

- [ ] All files listed in pre-start audit now return 0 utility-class hits via the grep commands above.
- [ ] Full-repo grep (for all of `src/app/`) returns 0 for typography / color / layout utility class patterns EXCEPT the directories covered by Plans 01–05 (those plans' own acceptance criteria gate their zero).
- [ ] tsc 0 errors, `npx next build` passes.
- [ ] `.verification-evidence` written for the 5 representative routes (typography + spacing + color tables).

## Known pitfalls

- Dashboard has chart components (`ChartBar` in DashboardClient.tsx) with genuine one-off positioning — don't force those into Flex wrappers. They're legitimate inline cases.
- Reports page uses `ProgressBar` from DS; confirm it's not falling back to any raw `bg-primary` styling.
- Notes editor has an existing `.module.css` pattern — use that over inline styles where a module class already exists.
- Online-booking is a public (unauthenticated) route and has its own styling quirks; test with a logged-out browser session.

## Open questions

1. **Dashboard tabs that show charts** — any chart container with `overflow-x-auto-util` (structural class from original utility plan)? Check during audit; if present, migrate to `style={{ overflowX: 'auto' }}`.
2. **Reports aged-debtors overlap with Plan 02** — if Plan 02 already touched this page for PaymentStatusBadge, double-check the utility-class cleanup isn't double-migrated. Do a grep BEFORE starting to see if the page is already clean.
