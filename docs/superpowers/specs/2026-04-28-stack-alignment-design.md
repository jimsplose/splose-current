# Step 2 — Stack alignment design

**Status:** Active (decisions locked, awaiting Step 3 sub-issue execution)
**Filed:** 2026-04-28
**Tracking issue:** [#27](https://github.com/jimsplose/splose-current/issues/27)
**Umbrella:** [#25](https://github.com/jimsplose/splose-current/issues/25)
**Step 1 input:** [`docs/monorepo-frontend-stack.md`](../../monorepo-frontend-stack.md)
**Successor:** Step 3 sub-issues filed in the new `splose-vite` repo (one per accepted alignment).

## Goal

Capture Jim's per-lever decisions for aligning splose-current to `sploseans/splose-monorepo`'s `packages/web-app` so the resulting prototype is a credible proof-of-concept that monorepo engineers can adopt for cleanup work and new feature development. Each decision is binding for Step 3 execution; revisions require updating this spec.

## Constraints (locked)

- **Migration target:** monorepo's `packages/web-app` stack as captured in `docs/monorepo-frontend-stack.md` (snapshot 2026-04-28).
- **Booking form must be fully interactive** — see project memory `project_booking_form_interactive_requirement`. Iframe-embedded live preview in admin + functional public booking pages, NOT production's static mockup. splose-vite goes BEYOND production on this lever because it's also a vibe-coding foundation.
- **Hard switchover** to a new sibling repo. Splose-current freezes the day splose-vite has a booting Vite scaffold + Storybook + at least one ported page.

## Migration logistics

### New repo: `splose-vite`

- **Local path:** `~/claude/splose-vite/` (sibling to `~/claude/splose-current/`).
- **GitHub:** [`jimsplose/splose-vite`](https://github.com/jimsplose/splose-vite) (private; created 2026-04-28).
- **Hard-switch trigger:** Vite scaffold boots + Storybook 10.3+ runs + at least one admin page is ported and visually matches `acme.splose.com` at 1440×900.

### Splose-current after switchover (frozen)

- Continues running on Vercel as a *Next.js variant reference*. No new feature work, no DS additions, no commits except critical bug fixes.
- All open issues at switchover time (#19, #21, #22, #23, #24, this issue #27) get closed in splose-current and re-filed in splose-vite with a `carry-over` label and a backlink.
- `CLAUDE.md` gets a prominent **FROZEN** banner as its first paragraph.
- A `SessionStart` hook in `.claude/settings.json` prints `⚠️ FROZEN — active work is in ../splose-vite/` every session.
- Slash commands (`/work`, `/audit`, `/fidelity`, `/verify`, `/deploy`, `/status`, `/devnav`, `/screenshots`, `/ds-fix`, `/ds-migrate`) get stubbed with "this command no longer applies — use splose-vite."

### Splose-vite from day one

- `CLAUDE.md` declares it the active project with a backlink to splose-current as legacy reference.
- A `SessionStart` hook prints `active project: splose-vite` so context is always confirmed.
- All slash commands move here; the `/work` queue restarts in this repo.
- A new project memory file `project_active_repo_is_vite.md` records this as the canonical state.

### Sequencing

1. **Day 0 (now → first commit in splose-vite):** Step 3 sub-issues filed against `jimsplose/splose-vite`. Splose-current remains active.
2. **Hard-switch event:** Triggered when sub-issues for "Vite scaffold", "Storybook setup", and "first ported page" are all closed.
3. **Post-switch:** Splose-current frozen banner applied. Slash commands moved. Memory updated. SessionStart hooks active.
4. **Parity stretch:** All admin pages ported. Bookings 2.0 admin + interactive iframe preview + functional public booking pages live.

## Decisions per lever

### 7.1 React version → React 18

- Match monorepo's React 18.
- Discard React 19-only features in any ported code (Actions, `use()` hook, etc.).
- Storybook 10.3+ + Storybook MCP both work fine on React 18 (validated in roadmap brainstorm).

### 7.2 Build tool → Vite 7 multi-entry

- Vite 7 with multi-entry rollup config: `index.html` (admin) + `booking.html` (public booking form), plus `index.uk.html` and `booking.uk.html` for UK variants.
- Manual chunk splitting matching monorepo where it makes sense: separate chunks for `antd`, `react`, `tiptap`, `pdfjs` (when those features land).
- Two configs: `vite.config.ts` (production) and `vite.dev.config.ts` (dev). HTTPS-by-default for dev (mirror monorepo's `acme.splose.test:4200` convention adapted to splose-vite local certs).
- Vite plugins: `@vitejs/plugin-react`, `vite-tsconfig-paths`, `vite-plugin-checker` (CI-conditional), `vite-plugin-svgr` (SVG `?react` imports).
- Drop Next.js entirely: no App Router, no server components, no `next/image`, no API routes.

### 7.3 Routing → react-router-dom 5.3.4

- Match monorepo's pinned version exactly.
- Top-level `<BrowserRouter>` + `<Switch>` in `App.tsx` routing public/booking entries by URL path: `/booking`, `/online-booking/:uuid`, `/booking-modify/:code`, `/forms`, `/public-form`. Catch-all `*` → `Main` (admin app).
- Admin nested `<Switch>` inside `Main` with `<PrivateRoute>` guards. Sub-routes mirror monorepo's `/settings/*` map (see monorepo-frontend-stack.md §3.1).
- Aggressive lazy-loading: `React.lazy()` on all top-level routes + `<Suspense fallback={<GenericSuspenseFallback />}>`.
- Accept that RR5 is two majors behind v7. Splose-vite's value depends on stack-matching, not on having the latest RR.

### 7.4 Components → AntD 5.21.0 + local PageHeader (no pro-layout)

- Pin **AntD 5.21.0** exactly (current splose-current is on AntD 5; just pin the patch version).
- `@ant-design/icons` 6.0.2.
- **Do NOT adopt `@ant-design/pro-layout`** (per Jim's investigation 2026-04-28; see `docs/monorepo-frontend-stack.md` §7.4 update). Reasons:
  1. Production team has PE-6084 in flight to remove it (Andy Holton, 18 Feb 2026 Slack thread; Ryan Verner, Q2 2026 retrospective).
  2. ~900kb dependency for a single sub-component (`PageHeader`).
  3. Adopting it would put splose-vite on a different trajectory than where production is heading.
- **Build a local `PageHeader` component** in splose-vite:
  - API mirrors AntD v4 `PageHeader`: `title`, `subTitle`, `extra`, `breadcrumb`, `onBack`, `footer` — drop-in compatible with monorepo's current usage so PE-6084's eventual migration is a no-op.
  - Built on AntD v5 primitives: `Space`, `Typography.Title`, `Button`.
  - Responsive sizing per Josh Worthley's typography audit: 30/24/18px title, 18px sub-title, weight 700.
  - Storybook story at `Layout/PageHeader`.
  - Port splose-current's existing PageHeader DS component as a starting point and refine to match the AntD v4 API exactly.
  - Positions splose-vite *ahead* of monorepo — Platform team can use it as a reference implementation when they execute PE-6084.
- **Build a `src/components/shared/` tree** mirroring monorepo's structure:
  - `ui/` — generic UI components (Table shim, modals, cards, banners, etc.)
  - `formControls/` — form-field wrappers extending `CustomFormControlProps<Value, FieldValue>`
  - `forms/` — form-builder utilities
  - `banners/`, `customFilters/`, `editor/`, `errorBoundaries/`, `hooks/`, `modals/`, `portals/`, `wrappers/` — domain subdirs
- Wrapping discipline matches monorepo: shared components add project-wide defaults / domain logic on top of AntD primitives; raw AntD imports remain acceptable in top-level layouts (`Main.tsx` uses raw `<Layout>`).

### 7.5 Styling → SCSS + CSS Modules + AntD ConfigProvider

- Add `sass` dev dependency; Vite supports SCSS natively.
- `src/styles/variable.scss` — SCSS colour, spacing, breakpoint variables.
- `src/styles/colors.module.scss` — `:export` block bridging SCSS vars → TypeScript imports (`import styles from './colors.module.scss'; styles.vibrantViolet`).
- `src/styles/theme.config.ts` — AntD `ConfigProvider` `ThemeConfig` referencing SCSS vars (e.g. `colorPrimary: styles.vibrantViolet`). Centralises 60+ AntD component-token overrides.
- `src/styles/global.scss` and `src/styles/antdCustom.scss` — global styles imported in `src/index.tsx`.
- **CSS Modules per-component** (`Page.module.scss`) — matches monorepo and current splose-current convention.
- **Inline `style={{}}` allowed only for runtime calculations** (e.g. computed colour using `Color` library). No ad-hoc inline styling.
- Ban hardcoded hex values in components — all colours come through SCSS vars or AntD tokens.
- No theme switching (no light/dark toggle) — single theme matches monorepo.

### 7.6 State & data → Context + TanStack Query 5

- Per-domain React Context providers (no Redux, no Zustand, no Jotai). Initial set:
  - `AuthContext` — currentUser, login/logout/2FA, ACL.
  - `OrganisationContext` — multi-tenant preload data on app start.
  - `ReleaseFlagContext` — feature flags via `useReleaseFlags()` hook + `<ReleaseFlagged>` wrapper component.
  - `AnalyticsContext`.
  - `QueryClient.context` — TanStack Query singleton.
  - `OnlineBookingNewContext` — Bookings 2.0 wizard state (location, service, appointment selection, form instances).
  - Add others as features land.
- **TanStack Query 5.90.21** for server state. QueryClient defaults match monorepo (no custom `staleTime`/`retry`/`refetchOnWindowFocus`).
- **Axios singleton** initialised in `App.tsx` via `initializeAxios()`:
  - `withCredentials: true` for cookie-based auth.
  - Global request interceptor injecting `DOMAIN_HEADER_NAME` (subdomain routing).
  - `baseURL` from `apiBaseUrl()` helper.
  - `paramsSerializer` from a `queryString.ts` helper.
- **API call sites** at `src/services/api/<domain>API.ts` mirroring monorepo paths exactly. Direct axios calls; no centralised hook layer required (mirror monorepo's reality, not idealised pattern).
- **DTO contract usage:** import types from a local `src/dto/` directory mirroring `@splose/dto`'s shape. (We can't depend on the monorepo package; vendor the relevant DTO type definitions for booking/forms/auth/etc. as needed.)

### 7.7 Forms → AntD Form (already aligned)

- AntD `Form.useForm<DTOType>()` + `Form.Item` + `rules` for UI-level validation.
- DTO-typed form values (e.g. `Form.useForm<TemplateFormValues>()` where `TemplateFormValues` is from local DTOs).
- **No React Hook Form, no Formik.**
- **`Form.List` is a must-support pattern.** Per the Nov 2025 component library review, splose has "complex forms with dynamic form list (nested), or highly interactive between different fields." The formControls catalog and any composable form patterns must work cleanly inside a nested `Form.List` — including form-level `setFieldsValue` round-tripping and field-to-field reactivity.
- **AntD Select sophistication is required.** Per the Nov 2025 review, splose uses multi-select, searchable, tag select, option groups, and custom dropdowns extensively. The `formControls/` Select wrappers must support all of these without leaking AntD prop oddities through a too-narrow custom interface.
- Build out `src/components/shared/formControls/` with the booking-2.0-relevant ones first:
  - `DatePicker` (dayjs-only, format `'D MMM YYYY'`, 150-year validation).
  - `BirthDate`, `MonthSelect`, `YearSelect`.
  - `ServiceSelect`, `PractitionerSelect`, `LocationSelect` (domain selects with debounced search).
  - `PatientSelect` (domain-specific search + create).
  - `Editor`, `RichTextEditor`, `FileUploadForm` for richer fields.
- All extend `CustomFormControlProps<Value, FieldValue>`.

### 7.8 Tables → AntD Table direct + thin shim (default-supplier, NOT abstraction)

- **AntD `Table` direct usage** — engineers write `ColumnsType<T>` themselves. Consistent with splose-current's #8 "AntD direct" philosophy.
- **Plus a thin `Table` shim at `src/components/shared/ui/Table/Table.tsx`** that re-exports AntD `Table` with project-wide defaults pre-applied:
  - Custom empty state (`TableNotFoundContent`).
  - `Intl.NumberFormat` pagination formatting.
  - Locale overrides.
  - Default styling tokens.
- The shim **does not abstract column definitions** — call sites import `ColumnsType` from `'antd/es/table'` directly. The shim only supplies defaults; engineers' table code still reads as native AntD.
- Call-site shape:
  ```tsx
  import { Table } from '@shared/ui/Table';
  import type { ColumnsType } from 'antd/es/table';
  const columns: ColumnsType<Patient> = [...];
  <Table columns={columns} dataSource={data} />
  ```
- Booking flows use **card layouts** for service / location / practitioner selection (not tables) — matches monorepo.
- **No TanStack Table, no AntD Pro Table.**
- **Filter UI: Stripe-style, NOT AntD `column.filters`.** Per the Nov 2025 component library review, the splose team explicitly dislikes AntD's in-header filter UI ("I prefer to have a filter UI like stripe"). Production already avoids it — `LocationSettings` and similar use explicit filter state + array filtering, not `column.filters`. The Table shim must NOT enforce AntD header-filter usage; instead, splose-vite leads with explicit filter chips / sidebar / drawer patterns alongside the Table. Filter UI extraction to a `shared/customFilters/` family is on the formControls roadmap.

### 7.9 Lint / format → vendor `@splose/eslint` rules locally

- Vendor (copy in) the rule definitions from `@splose/eslint` rather than depending on the monorepo package — splose-vite cannot pull from the monorepo's pnpm workspace.
- `eslint.config.mjs` (flat config) at repo root with sub-configs equivalent to monorepo's:
  - **Frontend rules:** `react`, `a11y`, `typescript`, `vitest`.
  - **Common rules:** `security`, `circular` (circular-dep detection).
- **Plugins to include:**
  - `eslint-plugin-perfectionist` for import sorting (groups: `react`, type-imports, builtins/external, `@splose` (or our `@/` equivalent), internal types, internal values, parent/sibling/index, unknown).
  - `eslint-plugin-erasable-syntax-only`.
  - `typescript-eslint` (strict).
  - `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-vitest`.
  - `eslint-plugin-security`, `eslint-plugin-import` (or whatever the circular-dep plugin in use is).
- **Prettier rules verbatim:** `printWidth: 100`, `tabWidth: 2` (spaces, no tabs), `singleQuote: true`, `trailingComma: 'all'`, `arrowParens: 'always'`, `bracketSpacing: true`, `bracketSameLine: false`, `quoteProps: 'as-needed'`, `useTabs: false`.
- Adopt the monorepo's `prettier.config.js` content directly.

### 7.10 Node / pnpm / TypeScript → match monorepo exactly

- **Node v22.21.1** (`.nvmrc`).
- **pnpm 10.28.2** via corepack. No npm, no yarn.
- **TypeScript 5.9.3.**
- Per-package `tsconfig.json` (splose-vite is a single package, so just one) + `tsconfig.build.json` referenced from `vite.config.ts`.
- Path aliases mirror monorepo's: `@assets`, `@shared`, `@routes`, `@config`, `@contexts`, `@models`, `@api`, `@services`, `@styles`, `@utils`, `@testing`.
- **Partial strictness with documented migration path:** `strictNullChecks` and `noImplicitAny` start disabled with TODO comments to enable per-feature, matching monorepo's current state. Not splose-vite's job to be more strict than production.
- `jsx: "react-jsxdev"`, `target: "ES2022"`, `isolatedModules: true`, `verbatimModuleSyntax: true`.

### 7.11 Live preview → fully interactive iframe + functional public pages — DECIDED (locked at brainstorm time)

See project memory `project_booking_form_interactive_requirement`.

splose-vite implements:

- **Iframe-embedded live preview** in the Bookings 2.0 admin config UI. The iframe loads a draft URL (proposed shape: `/online-booking/:tempUuid?draft=true`) that renders the actual booking form with admin-supplied config.
- **postMessage protocol** (or URL-param fallback) for admin → iframe config sync. Admin updates colours/notices/services → iframe re-renders.
- **Backend draft-state handling** — server endpoint serves draft booking config to the iframe with injected admin-supplied overrides.
- **Functional public booking pages** at `/online-booking/:uuid` (and friends) sharing the same React entry as the iframe — no duplicated implementations. The iframe and the public-facing booking experience render the same component tree.

Goes BEYOND production's static mockup approach. Reason: vibe-coding foundation requires real working application.

### 7.12 Hand-rolled complex features — parity scope

Per the Nov 2025 component library review, splose-monorepo includes several hand-rolled features that no UI library supplies. splose-vite must classify each as **port full depth**, **port simplified placeholder**, or **out of parity bar**. Definitive scope is set by the follow-up investigation issue (filed alongside this spec — see "Investigation issue" below). Initial classifications:

- **Calendar** (month / week / day, drag-drop, resize, configurable time slots, events with buffers, repeating-conflict resolution, performance-sensitive) — **TBD by investigation.** splose-current already has a calendar UI; investigation must compare its depth against production complexity. Likely outcome: simplified placeholder for now, full-depth port deferred to post-parity.
- **Tiptap (JSON block editor)** — **port at parity.** This is the primary new editor in production. Splose-vite will need it for any rich-text fields (notes, templates, booking confirmations). The monorepo's `tiptap@legacy` catalog (~40 packages) is the version baseline. Production team has documented tiptap pain points (per @Hao Wang TODO in the review) — splose-vite should track those.
- **Quill / Froala (legacy editors)** — **out of parity bar.** Production is keeping them only for legacy letter / email-template features. splose-vite does not adopt either; if a Storybook story or feature demonstration ever needs an HTML WYSIWYG, default to a Tiptap-based variant.
- **Body Chart (canvas-based drawing)** — **out of parity bar.** Production is considering Excalidraw migration; splose-vite waits.
- **AI prompting / voice-to-text UI** — **out of parity bar** unless splose-vite's vibe-coding direction explicitly requires it.
- **Charts (Highcharts)** — **out of parity bar.** Production has licence + version concerns; splose-vite skips charts entirely until a feature demands them. If charts arrive later, evaluate alternatives (Recharts, Tremor, or a licensed Highcharts upgrade).

## Storybook + MCP

- **Storybook 10.3+** with Vite renderer (works seamlessly with React 18).
- **`@storybook/addon-mcp`** — official Storybook MCP server. Engineers' AI agents can query splose-vite's components and stories.
- Storybook hierarchy mirrors what splose-current already established (per closed issue #17): tier tags (`antd` / `extended` / `custom`), `Foundations/`, `Layout/`, `Forms/`, `Tables/`, etc.
- Welcome page in Storybook frames splose-vite as the POC reference for monorepo engineers.

## Out of scope (explicit)

- **Backend implementation** of the draft preview endpoint — splose-vite uses Prisma+Turso (carried over from splose-current); the draft endpoint is a server route in splose-vite itself, not a sync to the real splose-monorepo backend.
- **DTO synchronisation with `@splose/dto`** — splose-vite vendors only the DTO types it needs at the time it needs them. No automated sync.
- **`@ant-design/pro-layout` adoption** — explicitly rejected.
- **TanStack Table or AntD Pro Table** — explicitly rejected.
- **React 19 features** — explicitly rejected (locked to React 18 to match monorepo).
- **Theme switching (light/dark)** — out of scope (matches monorepo's single-theme approach).
- **AntD migration to a non-AntD component library** — explicitly out of scope. The Nov 2025 component library review confirms AntD lock-in due to form complexity; replacing AntD would require migrating every form. splose-vite stays on AntD 5.
- **Quill / Froala / Highcharts / Body Chart** — out of parity bar (see §7.12).
- **AntD `column.filters` header-filter UI** — explicitly avoided in favour of Stripe-style filter UI patterns (see §7.8).

## Acceptance criteria

This issue (#27) closes when:

- [x] `splose-vite` GitHub repo created at [jimsplose/splose-vite](https://github.com/jimsplose/splose-vite) (2026-04-28).
- [ ] `~/claude/splose-vite/` initialised locally with `pnpm init`, Node 22 + pnpm 10 + TS 5.9 baseline.
- [ ] Step 3 sub-issues filed against `jimsplose/splose-vite`, one per accepted alignment lever (8 issues — 7.1 React 18 + 7.2 Vite + 7.3 RR5 are bundled into one "scaffold" issue; the others are separate).
- [ ] Step 3 sub-issues filed against `jimsplose/splose-vite` for the migration logistics (FROZEN banner, hooks, slash command moves, README updates).
- [ ] This spec committed to splose-current at `docs/superpowers/specs/2026-04-28-stack-alignment-design.md`.
- [ ] Issue #27 closed with backlink to spec and to splose-vite issue list.
- [ ] Umbrella issue #25 updated.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Page-porting drag (30+ admin pages) takes months and morale slips | Set parity bar low: "first 5 admin pages + Bookings 2.0 admin + functional public booking pages" is enough to declare splose-vite the active project. The remaining admin pages can port post-switch. |
| Two-repo confusion in concurrent sessions | SessionStart hooks + FROZEN banner + memory file + slash command stubs all flag wrong-folder edits immediately. |
| `@splose/dto` drift — we vendor types and they go stale | Periodic re-vendoring sweep filed as a recurring sub-issue. Acceptable — splose-vite is a POC, not a production consumer. |
| react-router-dom 5 obsolescence | Accept it. splose-vite's value is stack-matching, not future-proofing. If monorepo upgrades to RR7, splose-vite follows. |
| pro-layout PE-6084 takes longer than expected, leaving monorepo on pro-layout while splose-vite isn't | Acceptable — splose-vite leads with the local PageHeader, monorepo catches up. |
| Vite multi-entry + draft preview iframe complexity | Scoped explicitly in §7.11 + filed as its own Step 3 sub-issue with a non-trivial budget. |

## Open questions deferred to Step 3

- Exact `splose-vite` repo description / topics for GitHub.
- Whether to mirror monorepo's release-train coupling (web-app + server share version 35.17.0). For splose-vite (no real backend coupling), this is moot — version freely.
- What gets ported first: the keystone pages chosen for the parity bar. Suggested initial five: Dashboard, Patients list, Settings shell, Settings/Online Booking (since 7.11 demands it), and one further admin page chosen by complexity (e.g. Invoices). **Calendar is intentionally excluded from the initial parity bar** because §7.12 defers calendar-depth scoping to the investigation issue — Calendar joins the parity bar only after the investigation classifies it. Step 3 sub-issue per page.
- Vendor source for `@splose/eslint` rules — direct copy from `packages/eslint/src/` or hand-port. Step 3 lint sub-issue chooses.

## Investigation issue (filed alongside this spec)

A separate investigation issue is filed before any per-feature page-porting Step 3 work begins:

> **Investigate splose-current's existing calendar, tiptap, and complex-form implementation depth.** Compare against the production complexity captured in the Nov 2025 component-library review (calendar drag/drop/resize/buffers/repeating conflicts; tiptap heavy customisation; Form.List nested dynamic forms). For each, classify as "splose-vite must port matching depth," "splose-vite ports a simplified placeholder," or "splose-vite skips entirely (out of parity bar)."

Output: a feature-parity scope decision doc that informs Step 3 sub-issue scoping. This is **not a blocker** for this spec landing or for §7 alignment Step 3 sub-issues that are framework-agnostic (scaffold, lint, styling, tests). It IS a blocker for any Step 3 sub-issue that scopes per-page or per-feature porting.
