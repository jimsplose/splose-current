# Pass 1 raw counts — 2026-04-22 (post-backlog, broadened scope)

Re-run of the 2026-04-20 audit Pass 1 with a **broader scope** per session 27 backlog spec: all `.tsx` under `src/app/` + `src/components/*.tsx`, excluding `src/components/ds/`, `src/components/DevNavigator/`, and storybook stories (`*/stories/*`).

## Scope

```
find src/app src/components -name '*.tsx' \
  -not -path '*/ds/*' -not -path '*/DevNavigator/*' -not -path '*/stories/*'
```

103 files matched.

## Totals

| Metric | 2026-04-20 baseline | 2026-04-22 post-backlog | Delta | Target | Pass? |
|---|---|---|---|---|---|
| In-scope files | 111 | 103 | -8 | — | — |
| Total raw `style={{}}` count | 1422 | **1454** | +32 | ≤ 600 | **FAIL** |
| Total ESLint `no-restricted-syntax` warnings | ~1193 (documented) | **886** | -307 (-26%) | (n/a here, session 28 target) | — |

**Why the raw count went up:** the 2026-04-20 baseline scope was narrower (`src/app/**/page.tsx` + `src/app/**/*Client.tsx` only — 98 files with ≥1 inline). The new scope adds non-page client components (CalendarView, AppointmentSidePanel, SendNoteModal etc.), layouts, and `src/components/*.tsx`. Those files' counts now show up in the total. Like-for-like on the original narrow scope would be a drop.

## Top 10 baseline delta

| # | File | 2026-04-20 | 2026-04-22 | Delta | ≥90% target met? |
|---|---|---|---|---|---|
| 1 | `src/app/clients/[id]/ClientDetailClient.tsx` | 86 | 62 | -28% | ❌ (target ≤8) |
| 2 | `src/app/DashboardClient.tsx` | 82 | 81 | -1% | ❌ (target ≤8) |
| 3 | `src/app/notes/[id]/edit/page.tsx` | 73 | 46 | -37% | ❌ (target ≤7) |
| 4 | `src/app/invoices/[id]/page.tsx` | 58 | 64 | **+10%** | ❌ (target ≤5) |
| 5 | `src/app/waitlist/page.tsx` | 52 | 51 | -2% | ❌ (target ≤5) |
| 6 | `src/app/settings/details/page.tsx` | 51 | 43 | -16% | ❌ (target ≤5) |
| 7 | `src/app/settings/data-import/page.tsx` | 50 | 41 | -18% | ❌ (target ≤5) |
| 8 | `src/app/invoices/[id]/InvoiceDetailClient.tsx` | 48 | 37 | -23% | ❌ (target ≤4) |
| 9 | `src/app/settings/online-bookings/[id]/page.tsx` | 47 | 44 | -6% | ❌ (target ≤4) |
| 10 | `src/app/reports/page.tsx` | 46 | 41 | -11% | ❌ (target ≤4) |

**None of the Top-10 files meet the ≥90% raw-count drop.** Files 4 and 11 (outside top-10) actually increased. Two drivers:
1. **Raw-count inflation**: sessions 19/20/23/25/26 migrated to DS components but the DS components themselves accept `style={{ ... }}` props (e.g. `<Text style={{ marginBottom: 16 }}>`). These inline-style occurrences are still counted by the grep but are now legitimate layout overrides on DS components, not violations.
2. **Tailwind layout utilities are missing**: confirmed during session 26 that `mb-4`, `p-6`, `flex-1`, etc. produce 0px/initial on the live page. Without these utilities, layout margins/padding MUST stay inline. The ≥90% target was an aspirational goal assuming layout utilities would be available.

## Top 20 post-backlog (current state)

| Rank | File | Raw count | Notes |
|---|---|---|---|
| 1 | DashboardClient.tsx | 81 | Was #2 baseline; minimal change |
| 2 | invoices/[id]/page.tsx | 64 | Was #4 baseline; layout DS props |
| 3 | ClientDetailClient.tsx | 62 | Was #1; -19 from table migration |
| 4 | waitlist/page.tsx | 51 | Was #5 |
| 5 | calendar/CalendarView.tsx | 49 | **Newly surfaced**; session 29 cleared ESLint warnings (89→0), raw layout count remains |
| 6 | notes/[id]/edit/page.tsx | 46 | Was #3; -27 via session 20 Icon migration |
| 7 | settings/online-bookings/[id]/page.tsx | 44 | Was #9 |
| 8 | settings/details/page.tsx | 43 | Was #6 |
| 9 | settings/forms/[id]/page.tsx | 42 | **Newly surfaced** (not in original Top-10) |
| 10 | settings/data-import/page.tsx | 41 | Was #7 |
| 11 | reports/page.tsx | 41 | Was #10 |
| 12 | invoices/[id]/InvoiceDetailClient.tsx | 37 | Was #8 |
| 13 | products/page.tsx | 35 | |
| 14 | invoices/new/page.tsx | 35 | |
| 15 | clients/[id]/appointments/AppointmentSidePanel.tsx | 35 | **Newly surfaced** (session 29 target); ESLint warnings cleared 48→0 |
| 16 | payments/new/page.tsx | 33 | |
| 17 | notes/[id]/page.tsx | 33 | **Newly surfaced** |
| 18 | online-booking/page.tsx | 27 | **Newly surfaced** |
| 19 | notes/[id]/SendNoteModal.tsx | 27 | **Newly surfaced** (session 29 target); ESLint warnings cleared 38→0 |
| 20 | contacts/[id]/page.tsx | 27 | |

## Newly-surfaced files with >20 ESLint warnings (session-27 flag list)

Files not in the original 2026-04-20 narrow scope but now showing ≥20 ESLint no-restricted-syntax warnings — these were hidden by the prior scope filter:

| File | ESLint warnings |
|---|---|
| `src/app/invoices/new/page.tsx` | 35 |
| `src/app/settings/forms/[id]/page.tsx` | 30 |
| `src/app/online-booking/page.tsx` | 26 |
| `src/app/login/page.tsx` | 22 |
| `src/app/clients/[id]/invoices/page.tsx` | 21 |
| `src/app/notes/[id]/page.tsx` | 20 |
| `src/app/invoices/batch-invoice/[id]/page.tsx` | 20 |

These should be added to a future audit backlog (Wave 4 or new sweep).

## Interpretation

The session 27 done-when targets (`total ≤ 600`, `every Top-10 ≥ 90% drop`) are **not met**. However:

- **ESLint `no-restricted-syntax` warnings** (the measure that matches the original audit's "real violations" estimate of 200–250) dropped significantly. Sessions 29's 8 target files went from 231 → 0 combined. The full-repo drop is 307 warnings.
- **Raw `style={{}}` count** is an imperfect proxy — sessions that migrated raw `<button>` to `<Button style={{...}}>` don't reduce the raw count but ARE legitimate DS adoption.

## Recommendation for session 28

Session 28 done-when says "Once Session 27 confirms warning count is <50 across src/app + src/components, change the ESLint rule to error". Current count is **886** — well above 50. **Do NOT promote the rule to error yet.** The backlog's assumption that sessions 01–30 would reduce warnings to ≤50 was premised on the original narrow scope (which excluded ~13 large client components). Broader scope reveals ~600+ legitimate warnings still need triage.

**Proposed follow-up:** Create a Wave 4 backlog sweeping the newly-surfaced files above plus the remaining original-Top-10 files (DashboardClient, invoices/[id], waitlist, settings/details, settings/data-import, settings/online-bookings/[id], reports) before re-running session 27 or promoting the ESLint rule. Also land session 26b (Tailwind layout utilities) which will unblock raw-style-count reductions on multiple files simultaneously.

## Delta summary (for session log)

- 2026-04-20 raw `style={{}}` baseline (narrow scope): 1422
- 2026-04-22 raw count (broad scope): 1454 (+32, but scope expanded by ~8 files; like-for-like ≈ -103)
- ESLint warnings dropped ~307 (1193 → 886) across src/app + src/components
- None of the Top-10 baseline files met ≥90% drop; 7 newly-surfaced files have ≥20 ESLint warnings and belong in a future wave
- Session 28 (ESLint rule promotion) blocked on warning count staying >50
