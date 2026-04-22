# Wave 5 · Plan 05 — Global shell adoption

**Status:** Done
**Estimated effort:** M
**Recommended model:** Opus 4.7 (requires judgment on command registry shape + tooltip sweep discipline)
**Thinking budget:** think hard

## Surface

Site-wide shell polish. Nothing here is "broken" — every change is an UX upgrade on top of the existing page chrome.

- Root layout — `src/app/layout.tsx` + `src/components/SploseTopNav.tsx`.
- `src/commands/index.ts` — NEW file. Global command registry.
- `src/hooks/useRegisterCommands.ts` — NEW hook. Per-route command scope.
- Any icon-only button on any page — `Tooltip` wrap sweep.
- Deep-hierarchy pages — `src/app/settings/templates/emails/*`, `src/app/invoices/batch-invoice/*`, `src/app/reports/ndis-bulk-upload/*` — `Breadcrumbs` header adoption.
- Initial-load states on list pages — `Skeleton` placeholders while data fetches.

## Migrations / additions

This plan does TWO things in one pass for every file it touches: (1) add new global-shell capabilities (CommandPalette, Breadcrumbs, Tooltip sweep, Skeleton), and (2) remove hand-written utility classes from `src/components/**` non-DS files.

### A. Shell adoption

| Component | What to do |
|---|---|
| `CommandPalette` | Mount once in `src/app/layout.tsx`. Wire `open` state + `Cmd/Ctrl+K` trigger (the component already binds the shortcut). Feed `commands` from `src/commands/index.ts` + any commands collected via `useRegisterCommands`. |
| Command registry | Create `src/commands/index.ts` with ~10 global commands: Navigate (Dashboard / Calendar / Patients / Invoices / Reports / Settings), Create (New appointment / New patient / New invoice), Recents (driven by local storage of the last 5 clicked records). |
| `useRegisterCommands` | Hook that pushes route-specific commands into a context-local list while the route is mounted and pops them on unmount. |
| `Tooltip` sweep | Wrap every icon-only `<Button iconOnly>` (toolbar buttons, DataTable row actions, Navbar back, filter icons) with `<Tooltip content="...">`. Most call sites already have an `aria-label`; reuse that text. |
| `Breadcrumbs` | Add a `<Breadcrumbs>` row above the `PageHeader` on: `/settings/templates/emails/[id]/edit`, `/invoices/batch-invoice/[id]`, `/reports/ndis-bulk-upload/new`, `/settings/forms/[id]`. Skip top-level pages — back-button covers those. |
| `Skeleton` | Add loading-state skeletons on the primary list pages (`/patients`, `/invoices`, `/waitlist`, `/clients`). Use `<Skeleton.Loading loaded={!isLoading}>` around the list body, with `Skeleton.ListPageRow` recipe as the fallback shape. |

### B. Utility-class removal on `src/components/**` (non-DS)

Use the replacement mapping + priority ladder in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference). Applies to every `.tsx` under `src/components/` EXCLUDING `src/components/ds/**` (stories cleanup is Plan 07) and `src/components/DevNavigator/**`.

Primary targets (known utility-class usage):

- `src/components/AiChatPanel.tsx` — still has 4 utility classes (`text-text-secondary`, `text-body-sm`, `text-text`, `text-text-inverted`, `bg-primary`) after 00-Prep isolated the `ai-*` classes. Clean these along with the Tooltip sweep on the chat launcher.
- `src/components/SploseTopNav.tsx` — any residual utility classes on nav items.
- `src/components/DevNavigator/*` — EXCLUDED from cleanup (dev-only surface).

## Chrome MCP verification

At 1440×900 on both tabs:

1. **Cmd+K opens palette** — on macOS Chrome. Ctrl+K opens on Windows/Linux (manual test).
2. **Palette search** — typing "invo" filters to "New invoice" + "Go to Invoices".
3. **Route-scoped commands** — navigate to `/patients/446604/details`, reopen Cmd+K, confirm "New note", "New invoice for Harry Nguyen" commands appear (added via `useRegisterCommands` from the detail page).
4. **Tooltip** — hover any icon-only toolbar button, confirm Tooltip appears after ~200ms.
5. **Breadcrumbs** — deep settings page (e.g. `/settings/templates/emails/reminder/edit`) shows the path, each segment links back up.
6. **Skeleton** — force a slow network (Chrome devtools) and reload `/patients`. Skeleton rows render, then swap to real rows without layout shift.

## Acceptance criteria

### Shell adoption
- [ ] `<CommandPalette />` mounted in `src/app/layout.tsx`.
- [ ] `src/commands/index.ts` exports a static array of ≥8 global commands.
- [ ] `useRegisterCommands` hook exists and is used on at least 3 routes (patient detail, calendar, invoice detail).
- [ ] `grep -c "<Button.*iconOnly\|<Button.*variant=\"icon\"" src/app/` sampled across 5+ pages — every icon-only Button is wrapped in `<Tooltip>`.
- [ ] At least 4 deep-hierarchy pages render `<Breadcrumbs>`.
- [ ] At least 4 list pages render `<Skeleton.Loading>` during initial fetch.

### Utility-class cleanup on src/components/** (non-DS)
- [ ] `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-' src/components --include='*.tsx' | grep -v '/ds/\|/DevNavigator/'` = 0
- [ ] `grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*bg-primary' src/components --include='*.tsx' | grep -v '/ds/\|/DevNavigator/'` = 0
- [ ] `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b' src/components --include='*.tsx' | grep -v '/ds/\|/DevNavigator/'` = 0
- [ ] AiChatPanel.tsx has 0 `text-*` / `bg-*` utility classes remaining.

### Gate
- [ ] tsc 0 errors, `npx next build` passes.
- [ ] `.verification-evidence` written for CommandPalette open flow + Skeleton loading flow + AiChatPanel post-cleanup.

## Commit discipline

1. CommandPalette mount + command registry + useRegisterCommands hook (new infra)
2. Per-route command registration — 3-5 routes in one pass
3. Tooltip sweep — one commit per page section (calendar toolbar, invoices actions, patients actions, etc.)
4. Breadcrumbs adoption — one commit covering all 4 deep pages
5. Skeleton loading states — one commit covering all 4 list pages
6. Wave 5 Plan 05 status flip + session log

## Known pitfalls

- CommandPalette's Cmd+K shortcut conflicts with Chrome's default address-bar shortcut on some platforms — `e.preventDefault()` is already in the component but verify no consumer page unmounts the listener prematurely.
- Tooltip wrap on a disabled Button requires a `<span>` wrapper (AntD quirk documented in Wave 4 story). For the sweep, grep for `<Button disabled>` and wrap those in a span before adding the Tooltip.
- Skeleton dimensions must match the real row ±2px to avoid layout shift when data loads. Measure the real row first, then size the skeleton.
- Breadcrumbs should NOT be added on pages that already have a Navbar back arrow + title — that's redundant. Stick to pages where the hierarchy is ≥3 levels deep.

## Open questions

1. **Recent records** — local-storage of clicked records vs server-side last-visited list? Local-storage is simpler and private per-browser; server-side syncs across devices. Lean local-storage for v1; revisit if user feedback says "it forgot".
2. **Cmd+K hint discoverability** — should the TopNav show a `⌘K` kbd chip so users know the shortcut exists? Good UX but takes nav real estate. Suggest a small chip in the search icon's Tooltip ("Search — Cmd+K") rather than chrome-level chip.
3. **AI command suggestions** — Wave 4 left a `suggestCommands` hook stub note; not wired in this plan. Queue for Wave 6.
