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

| # | Status | Title | Scope | Effort | Model | DS components touched |
|---|---|---|---|---|---|---|
| 01 | open | **Text: add `weight` prop** | Add `weight?: "regular" \| "medium" \| "bold"` to `Text`. Update CSS module to apply weight when prop set. Migrate 8+ InvoiceDetailClient callers and 10+ invoices/[id]/page.tsx callers as part of same session. Storybook: add Weight story to Text.stories. | 2h | Sonnet | `Text` |
| 02 | open | **Divider: add `orientation="vertical"`** | Extend Divider with `orientation?: "horizontal" \| "vertical"` (default horizontal). Height derived from context; width = 1px for vertical. Migrate rich-text toolbars: notes/edit (lines 353, 366) + settings/details (165, 167, 175). Storybook: add orientation story. | 1.5h | Sonnet | `Divider` |
| 03 | open | **Button: add `shape="pill"`** | Extend Button with `shape?: "default" \| "pill"` (default = current rounded-4, pill = borderRadius 9999). Migrate reports/page.tsx filters (lines 81, 271, 276, 283) + settings/details.tsx (149, 157). Storybook: add shape story. | 1.5h | Sonnet | `Button` |
| 04 | open | **NewDS: create Icon component** | New `src/components/ds/Icon.tsx` with `size: xs/sm/md/lg/xl/2xl/3xl` and `tone: default/secondary/tertiary/primary/success/warning/danger/inverted` props. Wraps an AntD icon component passed via `as` prop. Storybook: full AllVariants + size/tone grid. **No migrations in this session** — just ship the component. | 2h | Sonnet | `Icon` (new) |
| 05 | open | **Consolidation: delete dead IconText** | Verify 0 usages (grep src/). Delete `src/components/ds/IconText.tsx`. Remove from `src/components/ds/index.ts` exports. Remove from DS component catalog. Remove Storybook story if any. `npx tsc --noEmit` + `npx next build` to confirm. | 0.5h | Sonnet | `IconText` (deleted) |
| 06 | open | **Consolidation: fold Section into Card (add `description`)** | Add `description?: string` to Card. When title+description present, render Section-style header block. Delete `src/components/ds/Section.tsx`. Remove from index/catalog. Verify 0 consumers migrated. | 1h | Sonnet | `Card` (+), `Section` (deleted) |
| 07 | open | **Consolidation: fold Status into ColorDot (add `label`)** | Add `label?: string` to ColorDot; wrap in Flex when label present. Accept semantic color tokens (green/red/yellow/...) in addition to hex. Delete `src/components/ds/Status.tsx`. Remove from index/catalog. | 1h | Sonnet | `ColorDot` (+), `Status` (deleted) |
| 08 | open | **Text: add `page-title` variant + heading/xl** | Add `heading/xl` (28px/700) and `page-title` (30px/700/Sprig Sans/green) variants to Text. Add DS token for the title green if one doesn't already exist. Update Text.module.css with the two new classes. Storybook: extend typography showcase. **No template migrations yet** — done in session 09. | 1.5h | Sonnet | `Text` |
| 09 | open | **DS templates: adopt Text page-title** | Replace hard-coded `<h1 style=…>` in `DetailPage.tsx:45` and `Navbar.tsx:41` with `<Text variant="page-title">{title}</Text>`. Chrome MCP verification: visit a detail page and a form page to confirm no visual regression (title should look identical). | 1h | **Opus** | `DetailPage`, `Navbar` |
| 10 | open | **Migrate Icon component across top 3 pages** | Use the Icon component created in session 04. Replace `<XxxOutlined style={{ fontSize: N }} />` in DashboardClient.tsx, notes/[id]/edit/page.tsx, settings/data-import/page.tsx. Aim for 40+ inline-style reductions. Chrome MCP verification: visit each page. | 2h | Sonnet | — (uses Icon) |
| 11 | open | **Text: `color="inverted"` + FeatureCard** | Add `"inverted"` to TextColor enum. Create `src/components/ds/FeatureCard.tsx` wrapping Card with `tone: primary \| success \| neutral \| inverted`. Migrate ClientDetailClient:282 account-balance card. Storybook recipes for both. | 2h | Sonnet | `Text`, `FeatureCard` (new) |
| 12 | open | **HintIcon: `tone="inverted"` + `size`** | Add `tone` + `size` props to HintIcon. Migrate ClientDetailClient:285, 286, 291. Storybook. | 1h | Sonnet | `HintIcon` |
| 13 | open | **Button: add `variant="link"`** | Add `variant="link"` (primary-colored text, no bg, hover underline). Must render as `<a>` when `href` given. Migrate ClientDetailClient:277 (removes the onMouseEnter/Leave hack) + notes/[id]:39 + settings/details:135,230 + Navbar:31. Storybook. | 1.5h | Sonnet | `Button` |
| 14 | open | **Button: add `iconOnly` + `shape="circle"`** | Add `iconOnly?: boolean` (no padding, centres icon) and extend `shape` with `"circle"`. Migrate settings/forms/[id]:134, 210 + waitlist:743, 891 + progress-notes/edit/[id]:160. Storybook. | 1.5h | Sonnet | `Button` |
| 15 | open | **Card: add `tint`, `interactive`, `variant="dashed"`** | Add three props in one session: `tint: default/subtle/muted`, `interactive: boolean` (hover+focus, renders as button), `variant: default/dashed`. Migrate data-import:118, 191, 198, 211 + online-bookings/[id]:107, 316, 356, 363. | 2h | Sonnet | `Card` |
| 16 | open | **Badge: add `size` prop** | Add `size: sm/md/lg` (default md). Migrate waitlist:738, 886 (service/tag chips) + InvoiceDetailClient:112 (status badge). Storybook. | 1h | Sonnet | `Badge` |
| 17 | open | **FormInput: fix internal disabled styling (bug)** | Investigate why `<FormInput disabled>` doesn't show the grey fill. Fix inside the component (likely AntD `variant="filled"` when disabled). Remove the inline `backgroundColor: '#f3f4f6'` workarounds at settings/details:93, 102, 108. | 1h | Sonnet | `FormInput` |
| 18 | open | **ColorDot: add `shape`, `interactive`, `selected`** | Add `shape: circle/rect`, `interactive: boolean`, `selected: boolean`, `onClick`. Migrate online-bookings/[id]:137 swatches + settings/tags:162 rect preview. | 1h | Sonnet | `ColorDot` |
| 19 | open | **Consolidation: migrate OnOffBadge to Text and delete** | Verify 2 OnOffBadge callers. Replace with `<Text color={value?"success":"danger"}>{value?onLabel:offLabel}</Text>`. Delete component. Remove from index/catalog. | 0.5h | Sonnet | `OnOffBadge` (deleted) |
| 20 | open | **AdoptAsIs session: invoice pages → DS Text/DataTable** | Invoice server (`invoices/[id]/page.tsx`) + new (`invoices/new/page.tsx`). Replace raw `<h2>/<h3>` with Text variants (session 08 variants now exist). Replace raw `<table>` with DataTable. Chrome MCP verification. | 2h | **Opus** | — |
| 21 | open | **AdoptAsIs session: Products page raw table → DataTable** | Replace raw `<table>` + 16 inline `<th>/<td>` with DataTable in products/page.tsx. Chrome MCP verification. | 1.5h | Sonnet | — |
| 22 | open | **AdoptAsIs session: reports/performance + contacts/[id] → List** | Replace raw `<dt>/<dd>` (reports/performance) and raw label-value rows (contacts/[id]) with DS List component. Chrome MCP verification. | 1.5h | Sonnet | — |
| 23 | open | **AdoptAsIs session: settings/ai typography cleanup** | Replace raw `<h3>/<h4>` with Text variants. Remove inline color/font/weight overrides. Chrome MCP verification. | 1h | Sonnet | — |
| 24 | open | **Per-page fix: ClientDetailClient remaining cleanup** | After sessions 1-15 land, revisit ClientDetailClient.tsx. Apply Icon, DataTable for associated-contacts, FeatureCard + inverted tones for account balance. Target: ≤10 inline styles remaining. Chrome MCP verification. | 2h | **Opus** | — |
| 25 | open | **NewDS: ProgressBar + apply to reports** | Create `ProgressBar` with `value`, `tone`, `size`. Migrate reports/page.tsx:444-446 utilisation bars. Storybook. | 1h | Sonnet | `ProgressBar` (new) |

---

## Post-backlog (not individual sessions)

- Update `docs/reference/ds-component-catalog.md` to reflect new components, deletions, and new props once sessions land
- Update `docs/ds-consolidation-plan.md` Phase 5 status once ≥15 sessions complete
- Re-run the audit (same plan) in 3 months to compare counts

---

## Notes for `/ds-fix`

When you (the command) pick up a session:

1. Read the target session's Scope column carefully — it names file paths and line numbers from the audit
2. For sessions that add props: use Storybook to exercise the new API before migrating callers
3. **Chrome MCP verification is mandatory** for any session that touches UI (per `docs/quality-gate.md`)
4. Any session that adds a new DS component or prop must update `docs/reference/ds-component-catalog.md` in the same commit
5. If a session exceeds its effort estimate by 50%+, stop and ask Jim whether to split
