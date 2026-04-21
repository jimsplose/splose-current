# DS Audit — Fix Backlog

Ordered list of fix sessions produced by the 2026-04-20 audit. `/ds-fix` reads this file and runs the next session with status `open`. When finished, the session's status flips to `done`.

**Scan source:** [docs/ds-audit-2026-04-20.md](ds-audit-2026-04-20.md) (2026-04-20)

## Status legend

- `open` — not started
- `in-progress` — currently being worked on (at most one)
- `done` — completed

## Session priority rationale

Ordered by **leverage × simplicity**:

1. **High-priority ExtendDS props first** (Text:weight, Divider:vertical, Button:pill) — each is a 10-line additive change to a heavily-used component that unblocks 8-20 inline callers immediately.
2. **One NewDS** (Icon) — the biggest single leverage point, but slightly riskier because it's a new component with codemod-scale migration.
3. **Consolidation cleanups** (delete unused Section/Status/IconText) — zero-consumer deletions, trivial.
4. **Structural DS template fix** (page-title variant) — unlocks further DS consistency.
5. **Medium/Low ExtendDS props** — the long tail of additive props.
6. **Per-page AdoptAsIs cleanups** — highest-effort per unit, lowest per-session leverage, so scheduled last.

## Model selection

Sonnet 4.6 is suitable for most sessions. **Prefer Opus** only when a session (a) touches 15+ call sites across 5+ pages, (b) involves typography rework on a heavily-visited page, or (c) requires complex visual-hierarchy judgment. The `Model` column gives the recommendation per session:

- **Sonnet** — prop additions + 3-10 caller migrations, Storybook stories, zero-consumer deletions. Mechanical work with explicit scope. Most sessions.
- **Opus** — broad-impact visual migrations, DS template structural changes, worst-offender per-page cleanups.

The `/ds-fix` command doesn't enforce this — `Model` is a hint for you when picking the model to run the session in. Either model works; the recommendation is about tokens spent vs. risk.

## Thinking budget

The `Thinking` column recommends a reasoning budget per session (applies whether Sonnet or Opus is running it):

- **none** — trivial mechanical work. Zero-consumer deletions, targeted line-number migrations. No planning needed.
- **think** — prop additions with 5-13 caller migrations, AdoptAsIs structure mapping, bug investigations. Most sessions.
- **think hard** — broad sweeps (20+ call sites), rule promotions with per-exception triage, strategic backlog decisions.

If Sonnet is running an Opus-recommended session, bump thinking up one level (e.g. `think` → `think hard`).

## Sessions

Columns:
- **Status** — `open` / `in-progress` / `done` / `partial` (partial = some scope landed, rest blocked on a prereq session)
- **Prereq** — session numbers that must be `done` before this one can start (dash = none)
- **Model** — recommended model (see "Model selection" above)
- **Thinking** — recommended reasoning budget: `none` / `think` / `think hard` (see "Thinking budget" above)
- **Done-when criteria** live below the table in the "## Definition of done" section, one entry per session. Every session has explicit verification checks there.

Sessions are ordered so `/ds-fix` can walk the list in sequence. **Wave 1** sessions (02–18) have no prereqs and can run in any order; they're ordered by leverage (highest-impact foundation sessions first). **Wave 2** sessions (19–26) have prereqs on Wave 1; they're sequenced so each prereq is satisfied by the time their session runs. **Wave 3** sessions (27–29) are verification and only run after Waves 1+2 are complete.

**Effort column meaning:** wall-clock time for a Claude Code session to complete the work, assuming parallel tool calls and no repeat iterations. Calibrated from Session 01 which took **~8 min** end-to-end for a prop addition + 13 caller migrations + Storybook + Chrome MCP verification. Most sessions are 10–30 min. Add ~50% if Chrome MCP reveals an issue requiring a retry. If a session **doubles** its estimate, stop and ask Jim whether to split or continue.

*(Note: this is the post-2026-04-20 reordering. Historical Session 01 stays as #01; older sessions were renumbered — see session log for the mapping. Effort estimates were also recalibrated on 2026-04-20 from engineer-hours to Claude-session-minutes.)*

| # | Status | Title | Scope | Effort | Prereq | Model | Thinking | DS components touched |
|---|---|---|---|---|---|---|---|---|
| 01 | done (InvoiceDetailClient only) | **Text: add `weight` prop** | Add `weight?: "regular" \| "medium" \| "bold"` to `Text`. Update CSS module to apply weight when prop set. Migrate 13 InvoiceDetailClient.tsx `fontWeight` callers. Storybook: add Weight story to Text.stories. (invoices/[id]/page.tsx migrations moved to session 23 — most are tangled with fontSize/color overrides that need sessions 03/04 first.) | 8 min (actual) | — | Sonnet | think | `Text` |
| **— Wave 1: foundation sessions (no prereqs; priority-ordered by leverage) —** | | | | | | | | |
| 02 | done | **NewDS: create Icon component** | New `src/components/ds/Icon.tsx` with `size: xs/sm/md/lg/xl/2xl/3xl` and `tone: default/secondary/tertiary/primary/success/warning/danger/inverted` props. Wraps an AntD icon component passed via `as` prop. Storybook: full AllVariants + size/tone grid. **No migrations in this session** — just ship the component. Unlocks sessions 20 and 26. | 25 min | — | Sonnet | think | `Icon` (new) |
| 03 | done | **Text: add `page-title` variant + heading/xl** | Add `heading/xl` (28px/700) and `page-title` (30px/700/Sprig Sans/green) variants to Text. Add DS token for the title green if one doesn't already exist. Update Text.module.css with the two new classes. Storybook: extend typography showcase. **No template migrations yet** — done in session 19. Unlocks 19, 22, 23, 24, 25. | 15 min | — | Sonnet | think | `Text` |
| 04 | done | **Text: `color="inverted"` + FeatureCard** | Add `"inverted"` to TextColor enum. Create `src/components/ds/FeatureCard.tsx` wrapping Card with `tone: primary \| success \| neutral \| inverted`. Migrate ClientDetailClient:282 account-balance card. Storybook recipes for both. Unlocks 21, 23, 25, 26. | 25 min | — | Sonnet | think | `Text`, `FeatureCard` (new) |
| 05 | done | **Divider: add `orientation="vertical"`** | Extend Divider with `orientation?: "horizontal" \| "vertical"` (default horizontal). Height derived from context; width = 1px for vertical. Migrate rich-text toolbars: notes/edit (lines 353, 366) + settings/details (165, 167, 175). Storybook: add orientation story. | 15 min | — | Sonnet | think | `Divider` |
| 06 | done | **Button: add `shape="pill"`** | Extend Button with `shape?: "default" \| "pill"` (default = current rounded-4, pill = borderRadius 9999). Migrate reports/page.tsx filters (lines 81, 271, 276, 283) + settings/details.tsx (149, 157). Storybook: add shape story. Unlocks 22. | 15 min | — | Sonnet | think | `Button` |
| 07 | done | **Button: add `variant="link"`** | Add `variant="link"` (primary-colored text, no bg, hover underline). Must render as `<a>` when `href` given. Migrate ClientDetailClient:277 (removes the onMouseEnter/Leave hack) + notes/[id]:39 + settings/details:135,230 + Navbar:31. Storybook. | 20 min | — | Sonnet | think | `Button` |
| 08 | done | **Card: add `tint`, `interactive`, `variant="dashed"`** | Add three props in one session: `tint: default/subtle/muted`, `interactive: boolean` (hover+focus, renders as button), `variant: default/dashed`. Migrate data-import:118, 191, 198, 211 + online-bookings/[id]:107, 316, 356, 363. | 30 min | — | Sonnet | think | `Card` |
| 09 | done | **Consolidation: delete dead IconText** | Verify 0 usages (grep src/). Delete `src/components/ds/IconText.tsx`. Remove from `src/components/ds/index.ts` exports. Remove from DS component catalog. Remove Storybook story if any. `npx tsc --noEmit` + `npx next build` to confirm. | 5 min | — | Sonnet | none | `IconText` (deleted) |
| 10 | done | **Consolidation: fold Section into Card (add `description`)** | Add `description?: string` to Card. When title+description present, render Section-style header block. Delete `src/components/ds/Section.tsx`. Remove from index/catalog. Verify 0 consumers migrated. | 15 min | — | Sonnet | none | `Card` (+), `Section` (deleted) |
| 11 | done | **Consolidation: fold Status into ColorDot (add `label`)** | Add `label?: string` to ColorDot; wrap in Flex when label present. Accept semantic color tokens (green/red/yellow/...) in addition to hex. Delete `src/components/ds/Status.tsx`. Remove from index/catalog. | 15 min | — | Sonnet | none | `ColorDot` (+), `Status` (deleted) |
| 12 | done | **Consolidation: migrate OnOffBadge to Text and delete** | Verify 2 OnOffBadge callers. Replace with `<Text color={value?"success":"danger"}>{value?onLabel:offLabel}</Text>`. Delete component. Remove from index/catalog. | 10 min | — | Sonnet | none | `OnOffBadge` (deleted) |
| 13 | done | **Badge: add `size` prop** | Add `size: sm/md/lg` (default md). Migrate waitlist:738, 886 (service/tag chips) + InvoiceDetailClient:112 (status badge). Storybook. | 15 min | — | Sonnet | none | `Badge` |
| 14 | done | **FormInput: fix internal disabled styling (bug)** | Investigate why `<FormInput disabled>` doesn't show the grey fill. Fix inside the component (likely AntD `variant="filled"` when disabled). Remove the inline `backgroundColor: '#f3f4f6'` workarounds at settings/details:93, 102, 108. | 15 min | — | Sonnet | think | `FormInput` |
| 15 | done | **ColorDot: add `shape`, `interactive`, `selected`** | Add `shape: circle/rect`, `interactive: boolean`, `selected: boolean`, `onClick`. Migrate online-bookings/[id]:137 swatches + settings/tags:162 rect preview. | 15 min | — | Sonnet | none | `ColorDot` |
| 16 | done | **AdoptAsIs session: Products page raw table → DataTable** | Replace raw `<table>` + 16 inline `<th>/<td>` with DataTable in products/page.tsx. Chrome MCP verification. | 30 min | — | Sonnet | think | — |
| 17 | done | **AdoptAsIs session: reports/performance + contacts/[id] → List** | Replace raw `<dt>/<dd>` (reports/performance) and raw label-value rows (contacts/[id]) with DS List component. Chrome MCP verification. | 25 min | — | Sonnet | think | — |
| 18 | done | **NewDS: ProgressBar + apply to reports** | Create `ProgressBar` with `value`, `tone`, `size`. Migrate reports/page.tsx:444-446 utilisation bars. Storybook. | 15 min | — | Sonnet | none | `ProgressBar` (new) |
| **— Wave 2: dependent sessions (sequenced so prereqs land first) —** | | | | | | | | |
| 19 | done | **DS templates: adopt Text page-title** | Replace hard-coded `<h1 style=…>` in `DetailPage.tsx:45` and `Navbar.tsx:41` with `<Text variant="page-title">{title}</Text>`. Chrome MCP verification: visit a detail page and a form page to confirm no visual regression (title should look identical). | 15 min | 03 | **Opus** | think | `DetailPage`, `Navbar` |
| 20 | done | **Migrate Icon component across top 3 pages** | Use the Icon component created in session 02. Replace `<XxxOutlined style={{ fontSize: N }} />` in DashboardClient.tsx, notes/[id]/edit/page.tsx, settings/data-import/page.tsx. Aim for 40+ inline-style reductions. Chrome MCP verification: visit each page. | 40 min | 02 | Sonnet | think hard | — (uses Icon) |
| 21 | done | **HintIcon: `tone="inverted"` + `size`** | Add `tone` + `size` props to HintIcon. Migrate ClientDetailClient:285, 286, 291. Storybook. | 10 min | 04 | Sonnet | none | `HintIcon` |
| 22 | done | **Button: add `iconOnly` + `shape="circle"`** | Add `iconOnly?: boolean` (no padding, centres icon) and extend `shape` with `"circle"`. Migrate settings/forms/[id]:134, 210 + waitlist:743, 891 + progress-notes/edit/[id]:160. Storybook. | 20 min | 06 | Sonnet | think | `Button` |
| 23 | done | **Text weight: migrate invoices/[id]/page.tsx callers (was 01b)** | After sessions 03 (heading/xl variant) and 04 (color="inverted") land, revisit `src/app/invoices/[id]/page.tsx`. Migrate remaining `fontWeight` inlines at lines 56, 306, 336, 387 using the new variants + weight prop. Lines 359-387 (Stripe/HICAPS branding) stay inline — legitimate one-off. Chrome MCP verification of the invoice page. | 15 min | 01, 03, 04 | Sonnet | none | — |
| 24 | done | **AdoptAsIs session: settings/ai typography cleanup** | Replace raw `<h3>/<h4>` with Text variants. Remove inline color/font/weight overrides. Chrome MCP verification. | 15 min | 01, 03 | Sonnet | think | — |
| 25 | in-progress | **AdoptAsIs session: invoice pages → DS Text/DataTable** | Invoice server (`invoices/[id]/page.tsx`) + new (`invoices/new/page.tsx`). Replace raw `<h2>/<h3>` with Text variants (session 03 variants now exist). Replace raw `<table>` with DataTable. Chrome MCP verification. | 30 min | 01, 03, 04 | **Opus** | think | — |
| 26 | open | **Per-page fix: ClientDetailClient remaining cleanup** | After Wave 1 + the above Wave 2 items, revisit ClientDetailClient.tsx. Apply Icon, DataTable for associated-contacts, FeatureCard + inverted tones for account balance. Target: ≤10 inline styles remaining. Chrome MCP verification. | 45 min | 02, 04, 20, 21 | **Opus** | think hard | — |
| **— Wave 3: verification (runs after Waves 1+2 complete) —** | | | | | | | | |
| 27 | open | **Verification: re-run Pass 1 (broadened scope) + compare to audit baseline** | Re-run the Pass 1 mechanical-count subagent but with a **broadened scope**: all `.tsx` under `src/app/**` (not just page.tsx + *Client.tsx) AND `src/components/*.tsx` (excluding `src/components/ds/`, `src/components/DevNavigator/`, storybook stories). Produce `docs/ds-audit/pass1-raw-counts-2026-postbacklog.md`. Diff against the 2026-04-20 baseline (1422 across 111 files): combined count across the broader scope should drop ≥60%; every file that was in the original Top 10 should drop ≥90%. Append the diff to the session log. Flag any newly-surfaced files with >20 warnings. | 25 min | 01–26, 29, 30 | Sonnet | think hard | — |
| 28 | open | **Verification: promote ESLint DS-first rule from `warn` to `error`** | Once Session 27 confirms warning count is <50 across `src/app` + `src/components`, change `"no-restricted-syntax": ["warn", …]` → `"error"` in `eslint.config.mjs`. Run `npx eslint src/` to surface any remaining warnings; for each legitimate exception (dynamic user color, decorative gradient) add an inline `eslint-disable-next-line no-restricted-syntax` with a one-line reason comment. Prevents DS regression permanently. | 15 min | 27 | Sonnet | think hard | — |
| 29 | open | **Scope-gap cleanup: non-page client components and layouts** | Fix the 8 files that the original Pass 1 scope missed (total 233 lint warnings): `src/app/calendar/CalendarView.tsx` (89), `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx` (50), `src/app/notes/[id]/SendNoteModal.tsx` (38), `src/components/AiChatPanel.tsx` (29), `src/app/invoices/[id]/InvoiceActions.tsx` (9), `src/components/TopNav.tsx` (7), `src/app/clients/[id]/layout.tsx` (6), `src/app/notes/[id]/NoteViewToolbar.tsx` (5). Apply DS components already available from Wave 1 + 2 (Icon, Text variants, Card, Badge etc.). CalendarView is the biggest — may warrant its own sub-session if it drifts past estimate. Chrome MCP verification per file. | 60 min | 02, 03, 04 | **Opus** | think hard | — |
| 30 | open | **Consolidation: resolve duplicate TopNav** | Two `TopNav.tsx` files exist: `src/components/TopNav.tsx` (imported by `src/app/layout.tsx` — the active production chrome, 7 lint warnings) vs `src/components/ds/TopNav.tsx` (exported from DS index but **zero imports** in `src/app/`). Decide: either (a) delete `src/components/ds/TopNav.tsx` and remove from index/catalog (if the app version is the canonical one), or (b) migrate `src/app/layout.tsx` to the DS version then delete the non-DS version (if the DS version has better props/shape). Prefer (a) unless the DS version is meaningfully better — it's a cleaner delete. Verify no imports of the deleted version remain anywhere. | 15 min | — | Sonnet | think | `TopNav` (deleted — one of two) |

## Definition of done

Every session must satisfy ALL of these checks before flipping status to `done`. `/ds-fix` runs these automatically after the work lands. If any check fails, flip to `partial` and create a follow-up row explaining what's blocked and on which prereq.

**Default checks (apply to every session):**
- `npx tsc --noEmit` → 0 errors
- `npx next build` → build passes
- If the session touches UI: Chrome MCP measurement at 1440×900, `.verification-evidence` written
- If the session adds/removes a DS component: `docs/reference/ds-component-catalog.md` updated in the same commit
- If the session adds a prop: a Storybook story exercising the new prop (or an extended existing story)

**Per-session explicit grep checks:**

| # | Done when (in addition to default checks) |
|---|---|
| 01 | `grep -c 'fontWeight' src/app/invoices/\[id\]/InvoiceDetailClient.tsx` ≤ 1 AND `grep -c 'weight=' src/app/invoices/\[id\]/InvoiceDetailClient.tsx` ≥ 13 |
| 02 | `src/components/ds/Icon.tsx` exists; `src/components/ds/index.ts` exports `Icon`; Storybook story has AllVariants + size grid + tone grid |
| 03 | `heading/xl` and `page-title` appear in `TextVariant` type; corresponding CSS classes exist in `Text.module.css` |
| 04 | `TextColor` includes `"inverted"`; `src/components/ds/FeatureCard.tsx` exists; `ClientDetailClient.tsx` line ~282 uses FeatureCard |
| 05 | `grep -c "height: 16, width: 1" src/app/notes/\[id\]/edit/page.tsx src/app/settings/details/page.tsx` = 0 AND `orientation="vertical"` appears in ≥ 5 call sites |
| 06 | `grep -c "borderRadius: 9999" src/app/reports/page.tsx src/app/settings/details/page.tsx` = 0 AND `shape="pill"` appears in ≥ 6 call sites |
| 07 | `variant="link"` exists in Button; `grep -c "onMouseEnter.*underline" src/` = 0 |
| 08 | `tint`, `interactive`, `variant="dashed"` all work in Card; ≥ 8 caller sites migrated |
| 09 | `src/components/ds/IconText.tsx` does NOT exist; `grep -r "IconText" src/` returns 0 results |
| 10 | `src/components/ds/Section.tsx` does NOT exist; `grep -r "from.*Section" src/` returns 0; Card supports `description` prop |
| 11 | `src/components/ds/Status.tsx` does NOT exist; ColorDot supports `label` + semantic color names |
| 12 | `src/components/ds/OnOffBadge.tsx` does NOT exist; `grep -r "OnOffBadge" src/` returns 0 results |
| 13 | `size` prop exists in Badge; 3 caller sites migrated |
| 14 | `grep -c "backgroundColor: '#f3f4f6'" src/app/settings/details/page.tsx` = 0 AND disabled FormInput renders grey fill |
| 15 | `shape`, `interactive`, `selected` all work in ColorDot; 2 caller sites migrated |
| 16 | `grep -c "<th style\|<td style" src/app/products/page.tsx` = 0 (now DataTable Th/Td) |
| 17 | `grep -c "<dt\|<dd" src/app/reports/performance/page.tsx` = 0; raw label-value rows in `contacts/[id]/page.tsx` replaced by `<List>` |
| 18 | `src/components/ds/ProgressBar.tsx` exists; `reports/page.tsx` lines 444-446 use `<ProgressBar>` |
| 19 | `grep -c "fontSize: 30" src/components/ds/DetailPage.tsx src/components/ds/Navbar.tsx` = 0; both use `<Text variant="page-title">` |
| 20 | `grep -c "Outlined style={{ fontSize" src/app/DashboardClient.tsx src/app/notes/\[id\]/edit/page.tsx src/app/settings/data-import/page.tsx` reduced by ≥ 40 |
| 21 | `grep -c "HintIcon style={{" src/app/clients/\[id\]/ClientDetailClient.tsx` = 0 |
| 22 | `iconOnly` and `shape="circle"` work in Button; 5 caller sites migrated |
| 23 | `grep -c 'fontWeight' src/app/invoices/\[id\]/page.tsx` ≤ 4 (decorative Stripe/HICAPS exempt) AND at least 4 of the migrated lines use `<Text variant="heading/xl">` or `weight=` |
| 24 | `grep -c "<h3 style\|<h4 style" src/app/settings/ai/page.tsx` = 0 |
| 25 | `grep -c "<h2 style\|<h3 style\|<table" src/app/invoices/\[id\]/page.tsx src/app/invoices/new/page.tsx` reduced by ≥ 15 |
| 26 | `grep -c "style={{" src/app/clients/\[id\]/ClientDetailClient.tsx` ≤ 10 |
| 27 | `docs/ds-audit/pass1-raw-counts-2026-postbacklog.md` exists; scope = `find src/app src/components -name '*.tsx' -not -path '*/ds/*' -not -path '*/DevNavigator/*' -not -path '*/stories/*'`; total raw `style={{` count ≤ 600 (was 1422 baseline on narrower scope); every original Top-10 file dropped ≥ 90%; newly-surfaced files with >20 warnings are flagged; delta summary appended to session log |
| 28 | `eslint.config.mjs` has `"no-restricted-syntax": ["error", …]` (not `"warn"`); `npx eslint src/` exits 0 (all legitimate exceptions have inline `eslint-disable-next-line` with a reason comment); commit lists count of exceptions added |
| 29 | ESLint warnings in the 8 named files reduced from 233 to ≤ 20 total (combined). `grep -c 'style={{' src/app/calendar/CalendarView.tsx` ≤ 15. Every file has a Chrome MCP verification entry in `.verification-evidence` (or Storybook fallback if orphan). If CalendarView exceeds estimate, spawn a follow-up row 29b rather than dragging the session. |
| 30 | Exactly one `TopNav.tsx` remains in the repo (`find src -name 'TopNav.tsx' -not -path '*/stories/*' \| wc -l` = 1). `src/app/layout.tsx` imports TopNav from the surviving location and renders correctly. `grep -r 'from.*TopNav' src/ --include='*.tsx'` returns only import lines matching the surviving file. DS component catalog updated if the DS version survived (or removed if it didn't). |

---

## Post-backlog (not individual sessions)

- Update `docs/reference/ds-component-catalog.md` to reflect new components, deletions, and new props once sessions land
- Update `docs/ds-consolidation-plan.md` Phase 5 status once ≥15 sessions complete
- Re-run the audit (same plan) in 3 months to compare counts

---

## Notes for `/ds-fix`

When you (the command) pick up a session:

1. **Check Prereq column** — if any prereq session is not `done`, skip this one and pick the next. Tell Jim why it was skipped.
2. **Check recent commits before starting** — run `git log --oneline -10` and look for WIP commits touching files in the session's scope. If found, summarise what's already there so you don't redo work. (Session 01's "linter reversion" illusion came from missing this check.)
3. Read the target session's Scope column carefully — it names file paths and line numbers from the audit.
4. For sessions that add props: use Storybook to exercise the new API before migrating callers.
5. **Chrome MCP verification is mandatory** for any session that touches UI (per `docs/quality-gate.md`). If the migrated component isn't mounted on any current route, use the Storybook fallback documented in `docs/quality-gate.md`.
6. Any session that adds a new DS component or prop must update `docs/reference/ds-component-catalog.md` in the same commit.
7. **Run the Done-when checks** from the "## Definition of done" section above before flipping status to `done`. If any check fails, flip to `partial` and add a follow-up row to the backlog (like session 01 → session 23 for the page.tsx migration split-off).
8. After completing the session, append a one-line entry to `docs/ds-audit-session-log.md` with the session number, date, model used, scope delta (promised vs landed), and any blockers discovered.
9. If a session **doubles** its effort estimate, stop and ask Jim whether to split. (Margins on 15-min estimates are noise; a 2× overrun is the signal.)
