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

## Sessions

Columns:
- **Status** — `open` / `in-progress` / `done` / `partial` (partial = some scope landed, rest blocked on a prereq session)
- **Prereq** — session numbers that must be `done` before this one can start (dash = none)
- **Model** — recommended model (see "Model selection" above)
- **Done-when criteria** live below the table in the "## Definition of done" section, one entry per session. Every session has explicit verification checks there.

| # | Status | Title | Scope | Effort | Prereq | Model | DS components touched |
|---|---|---|---|---|---|---|---|
| 01 | done (InvoiceDetailClient only) | **Text: add `weight` prop** | Add `weight?: "regular" \| "medium" \| "bold"` to `Text`. Update CSS module to apply weight when prop set. Migrate 13 InvoiceDetailClient.tsx `fontWeight` callers. Storybook: add Weight story to Text.stories. (invoices/[id]/page.tsx migrations moved to session 01b — most are tangled with fontSize/color overrides that need sessions 08/11 first.) | 2h | — | Sonnet | `Text` |
| 01b | open | **Text weight: migrate invoices/[id]/page.tsx callers (post-prereq)** | After sessions 08 (heading/xl variant) and 11 (color="inverted") land, revisit `src/app/invoices/[id]/page.tsx`. Migrate remaining `fontWeight` inlines at lines 56, 306, 336, 387 using the new variants + weight prop. Lines 359-387 (Stripe/HICAPS branding) stay inline — legitimate one-off. Chrome MCP verification of the invoice page. | 1h | 01, 08, 11 | Sonnet | — |
| 02 | open | **Divider: add `orientation="vertical"`** | Extend Divider with `orientation?: "horizontal" \| "vertical"` (default horizontal). Height derived from context; width = 1px for vertical. Migrate rich-text toolbars: notes/edit (lines 353, 366) + settings/details (165, 167, 175). Storybook: add orientation story. | 1.5h | — | Sonnet | `Divider` |
| 03 | open | **Button: add `shape="pill"`** | Extend Button with `shape?: "default" \| "pill"` (default = current rounded-4, pill = borderRadius 9999). Migrate reports/page.tsx filters (lines 81, 271, 276, 283) + settings/details.tsx (149, 157). Storybook: add shape story. | 1.5h | — | Sonnet | `Button` |
| 04 | open | **NewDS: create Icon component** | New `src/components/ds/Icon.tsx` with `size: xs/sm/md/lg/xl/2xl/3xl` and `tone: default/secondary/tertiary/primary/success/warning/danger/inverted` props. Wraps an AntD icon component passed via `as` prop. Storybook: full AllVariants + size/tone grid. **No migrations in this session** — just ship the component. | 2h | — | Sonnet | `Icon` (new) |
| 05 | open | **Consolidation: delete dead IconText** | Verify 0 usages (grep src/). Delete `src/components/ds/IconText.tsx`. Remove from `src/components/ds/index.ts` exports. Remove from DS component catalog. Remove Storybook story if any. `npx tsc --noEmit` + `npx next build` to confirm. | 0.5h | — | Sonnet | `IconText` (deleted) |
| 06 | open | **Consolidation: fold Section into Card (add `description`)** | Add `description?: string` to Card. When title+description present, render Section-style header block. Delete `src/components/ds/Section.tsx`. Remove from index/catalog. Verify 0 consumers migrated. | 1h | — | Sonnet | `Card` (+), `Section` (deleted) |
| 07 | open | **Consolidation: fold Status into ColorDot (add `label`)** | Add `label?: string` to ColorDot; wrap in Flex when label present. Accept semantic color tokens (green/red/yellow/...) in addition to hex. Delete `src/components/ds/Status.tsx`. Remove from index/catalog. | 1h | — | Sonnet | `ColorDot` (+), `Status` (deleted) |
| 08 | open | **Text: add `page-title` variant + heading/xl** | Add `heading/xl` (28px/700) and `page-title` (30px/700/Sprig Sans/green) variants to Text. Add DS token for the title green if one doesn't already exist. Update Text.module.css with the two new classes. Storybook: extend typography showcase. **No template migrations yet** — done in session 09. | 1.5h | — | Sonnet | `Text` |
| 09 | open | **DS templates: adopt Text page-title** | Replace hard-coded `<h1 style=…>` in `DetailPage.tsx:45` and `Navbar.tsx:41` with `<Text variant="page-title">{title}</Text>`. Chrome MCP verification: visit a detail page and a form page to confirm no visual regression (title should look identical). | 1h | 08 | **Opus** | `DetailPage`, `Navbar` |
| 10 | open | **Migrate Icon component across top 3 pages** | Use the Icon component created in session 04. Replace `<XxxOutlined style={{ fontSize: N }} />` in DashboardClient.tsx, notes/[id]/edit/page.tsx, settings/data-import/page.tsx. Aim for 40+ inline-style reductions. Chrome MCP verification: visit each page. | 2h | 04 | Sonnet | — (uses Icon) |
| 11 | open | **Text: `color="inverted"` + FeatureCard** | Add `"inverted"` to TextColor enum. Create `src/components/ds/FeatureCard.tsx` wrapping Card with `tone: primary \| success \| neutral \| inverted`. Migrate ClientDetailClient:282 account-balance card. Storybook recipes for both. | 2h | — | Sonnet | `Text`, `FeatureCard` (new) |
| 12 | open | **HintIcon: `tone="inverted"` + `size`** | Add `tone` + `size` props to HintIcon. Migrate ClientDetailClient:285, 286, 291. Storybook. | 1h | 11 | Sonnet | `HintIcon` |
| 13 | open | **Button: add `variant="link"`** | Add `variant="link"` (primary-colored text, no bg, hover underline). Must render as `<a>` when `href` given. Migrate ClientDetailClient:277 (removes the onMouseEnter/Leave hack) + notes/[id]:39 + settings/details:135,230 + Navbar:31. Storybook. | 1.5h | — | Sonnet | `Button` |
| 14 | open | **Button: add `iconOnly` + `shape="circle"`** | Add `iconOnly?: boolean` (no padding, centres icon) and extend `shape` with `"circle"`. Migrate settings/forms/[id]:134, 210 + waitlist:743, 891 + progress-notes/edit/[id]:160. Storybook. | 1.5h | 03 | Sonnet | `Button` |
| 15 | open | **Card: add `tint`, `interactive`, `variant="dashed"`** | Add three props in one session: `tint: default/subtle/muted`, `interactive: boolean` (hover+focus, renders as button), `variant: default/dashed`. Migrate data-import:118, 191, 198, 211 + online-bookings/[id]:107, 316, 356, 363. | 2h | — | Sonnet | `Card` |
| 16 | open | **Badge: add `size` prop** | Add `size: sm/md/lg` (default md). Migrate waitlist:738, 886 (service/tag chips) + InvoiceDetailClient:112 (status badge). Storybook. | 1h | — | Sonnet | `Badge` |
| 17 | open | **FormInput: fix internal disabled styling (bug)** | Investigate why `<FormInput disabled>` doesn't show the grey fill. Fix inside the component (likely AntD `variant="filled"` when disabled). Remove the inline `backgroundColor: '#f3f4f6'` workarounds at settings/details:93, 102, 108. | 1h | — | Sonnet | `FormInput` |
| 18 | open | **ColorDot: add `shape`, `interactive`, `selected`** | Add `shape: circle/rect`, `interactive: boolean`, `selected: boolean`, `onClick`. Migrate online-bookings/[id]:137 swatches + settings/tags:162 rect preview. | 1h | — | Sonnet | `ColorDot` |
| 19 | open | **Consolidation: migrate OnOffBadge to Text and delete** | Verify 2 OnOffBadge callers. Replace with `<Text color={value?"success":"danger"}>{value?onLabel:offLabel}</Text>`. Delete component. Remove from index/catalog. | 0.5h | — | Sonnet | `OnOffBadge` (deleted) |
| 20 | open | **AdoptAsIs session: invoice pages → DS Text/DataTable** | Invoice server (`invoices/[id]/page.tsx`) + new (`invoices/new/page.tsx`). Replace raw `<h2>/<h3>` with Text variants (session 08 variants now exist). Replace raw `<table>` with DataTable. Chrome MCP verification. | 2h | 01, 08, 11 | **Opus** | — |
| 21 | open | **AdoptAsIs session: Products page raw table → DataTable** | Replace raw `<table>` + 16 inline `<th>/<td>` with DataTable in products/page.tsx. Chrome MCP verification. | 1.5h | — | Sonnet | — |
| 22 | open | **AdoptAsIs session: reports/performance + contacts/[id] → List** | Replace raw `<dt>/<dd>` (reports/performance) and raw label-value rows (contacts/[id]) with DS List component. Chrome MCP verification. | 1.5h | — | Sonnet | — |
| 23 | open | **AdoptAsIs session: settings/ai typography cleanup** | Replace raw `<h3>/<h4>` with Text variants. Remove inline color/font/weight overrides. Chrome MCP verification. | 1h | 01, 08 | Sonnet | — |
| 24 | open | **Per-page fix: ClientDetailClient remaining cleanup** | After sessions 1-15 land, revisit ClientDetailClient.tsx. Apply Icon, DataTable for associated-contacts, FeatureCard + inverted tones for account balance. Target: ≤10 inline styles remaining. Chrome MCP verification. | 2h | 04, 10, 11, 12 | **Opus** | — |
| 25 | open | **NewDS: ProgressBar + apply to reports** | Create `ProgressBar` with `value`, `tone`, `size`. Migrate reports/page.tsx:444-446 utilisation bars. Storybook. | 1h | — | Sonnet | `ProgressBar` (new) |

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
| 01b | `grep -c 'fontWeight' src/app/invoices/\[id\]/page.tsx` ≤ 4 (decorative Stripe/HICAPS exempt) AND at least 4 of the migrated lines use `<Text variant="heading/xl">` or `weight=` |
| 02 | `grep -c "height: 16, width: 1" src/app/notes/\[id\]/edit/page.tsx src/app/settings/details/page.tsx` = 0 AND `orientation="vertical"` appears in at least 5 call sites |
| 03 | `grep -c "borderRadius: 9999" src/app/reports/page.tsx src/app/settings/details/page.tsx` = 0 AND `shape="pill"` appears in at least 6 call sites |
| 04 | `src/components/ds/Icon.tsx` exists; `src/components/ds/index.ts` exports `Icon`; Storybook story has AllVariants + size grid + tone grid |
| 05 | `src/components/ds/IconText.tsx` does NOT exist; `grep -r "IconText" src/` returns 0 results |
| 06 | `src/components/ds/Section.tsx` does NOT exist; `grep -r "from.*Section" src/` returns 0; Card supports `description` prop |
| 07 | `src/components/ds/Status.tsx` does NOT exist; ColorDot supports `label` + semantic color names |
| 08 | `heading/xl` and `page-title` appear in `TextVariant` type; corresponding CSS classes exist in Text.module.css |
| 09 | `grep -c "fontSize: 30" src/components/ds/DetailPage.tsx src/components/ds/Navbar.tsx` = 0; both use `<Text variant="page-title">` |
| 10 | `grep -c "Outlined style={{ fontSize" src/app/DashboardClient.tsx src/app/notes/\[id\]/edit/page.tsx src/app/settings/data-import/page.tsx` reduced by ≥40 |
| 11 | `TextColor` includes `"inverted"`; `src/components/ds/FeatureCard.tsx` exists; ClientDetailClient.tsx line ~282 uses FeatureCard |
| 12 | `grep -c "HintIcon style={{" src/app/clients/\[id\]/ClientDetailClient.tsx` = 0 |
| 13 | `variant="link"` exists in Button; `grep -c "onMouseEnter.*underline" src/` = 0 |
| 14 | `iconOnly` and `shape="circle"` work in Button; 5 caller sites migrated |
| 15 | `tint`, `interactive`, `variant="dashed"` all work in Card; ≥8 caller sites migrated |
| 16 | `size` prop exists in Badge; 3 caller sites migrated |
| 17 | `grep -c "backgroundColor: '#f3f4f6'" src/app/settings/details/page.tsx` = 0 AND disabled FormInput renders grey fill |
| 18 | `shape`, `interactive`, `selected` all work in ColorDot; 2 caller sites migrated |
| 19 | `src/components/ds/OnOffBadge.tsx` does NOT exist; `grep -r "OnOffBadge" src/` returns 0 results |
| 20 | `grep -c "<h2 style\|<h3 style\|<table" src/app/invoices/\[id\]/page.tsx src/app/invoices/new/page.tsx` reduced by ≥15 |
| 21 | `grep -c "<th style\|<td style" src/app/products/page.tsx` = 0 (now DataTable Th/Td) |
| 22 | `grep -c "<dt\|<dd" src/app/reports/performance/page.tsx` = 0; raw label-value rows in contacts/[id]/page.tsx replaced by `<List>` |
| 23 | `grep -c "<h3 style\|<h4 style" src/app/settings/ai/page.tsx` = 0 |
| 24 | `grep -c "style={{" src/app/clients/\[id\]/ClientDetailClient.tsx` ≤ 10 |
| 25 | `src/components/ds/ProgressBar.tsx` exists; reports/page.tsx lines 444-446 use `<ProgressBar>` |

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
7. **Run the Done-when checks** from the "## Definition of done" section above before flipping status to `done`. If any check fails, flip to `partial` and add a follow-up row to the backlog (like session 01 → 01b).
8. After completing the session, append a one-line entry to `docs/ds-audit-session-log.md` with the session number, date, model used, scope delta (promised vs landed), and any blockers discovered.
9. If a session exceeds its effort estimate by 50%+, stop and ask Jim whether to split.
