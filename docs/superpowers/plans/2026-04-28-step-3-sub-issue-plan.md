# Step 3 — Sub-issue plan

**Status:** Active — repo [`jimyencken/splose-vite`](https://github.com/jimyencken/splose-vite) created 2026-04-28; sub-issues being filed
**Filed:** 2026-04-28
**Parent spec:** [`docs/superpowers/specs/2026-04-28-stack-alignment-design.md`](../specs/2026-04-28-stack-alignment-design.md)
**Tracking issue:** [#27](https://github.com/jimsplose/splose-current/issues/27)
**Investigation gate:** [#28](https://github.com/jimsplose/splose-current/issues/28) — calendar/tiptap/complex-form depth scoping, blocks per-page porting issues only

## Goal

Decompose the Step 2 alignment spec into Step 3 sub-issues that get filed in `jimyencken/splose-vite`. This document is the source-of-truth list — once Jim creates the splose-vite repo, file these in a batch using the bodies in this doc.

## Issue creation order

Issues are grouped by phase. **File all phases at once** in splose-vite; the dependency chain is encoded in each issue's `Depends on` field.

### Phase 1 — Foundations (no deps; can run in parallel)

| # | Title | Why |
|---|---|---|
| F1 | Vite 7 + React 18 + react-router-dom 5 scaffold (Node 22, pnpm 10, TS 5.9) | Bundles §7.1, §7.2, §7.3, §7.10 — they're inseparable. |
| F2 | Lint + format: vendor @splose/eslint rules + prettier verbatim | §7.9. Independent of scaffold but conventionally happens early. |

### Phase 2 — Building blocks (depend on F1)

| # | Title | Why |
|---|---|---|
| B1 | Styling: SCSS variable layer + AntD ConfigProvider tokens + global styles | §7.5. Needs Vite scaffold for sass plugin. |
| B2 | Storybook 10.3+ setup with @storybook/addon-mcp | Needs Vite to mount the renderer. Unlocks MCP for engineers. |

### Phase 3 — Component layer (depend on F1 + B1)

| # | Title | Why |
|---|---|---|
| C1 | Components: AntD 5.21.0 pin + local PageHeader (no pro-layout) | §7.4 PageHeader part. Lead with PageHeader since it's high-frequency in admin shells. |
| C2 | Shared tree scaffold: ui/, formControls/, forms/, banners/, customFilters/, editor/, errorBoundaries/, hooks/, modals/, portals/, wrappers/ | §7.4 directory shape. Empty dirs + index.ts conventions. |
| C3 | Table shim: AntD direct + default-supplier wrapper at shared/ui/Table | §7.8. Includes empty state + Intl.NumberFormat pagination. |
| C4 | formControls catalog: DatePicker, BirthDate, MonthSelect, YearSelect, ServiceSelect, PractitionerSelect, LocationSelect, PatientSelect | §7.7. CustomFormControlProps base + first wave of controls. |

### Phase 4 — State & data (depend on F1)

| # | Title | Why |
|---|---|---|
| S1 | Context provider scaffold: Auth, Organisation, ReleaseFlag, Analytics, QueryClient, OnlineBookingNew | §7.6. Empty contexts wired into App.tsx. |
| S2 | Axios singleton: initializeAxios() + DOMAIN_HEADER_NAME interceptor + apiBaseUrl helper | §7.6. Foundation for all API calls. |
| S3 | TanStack Query 5 + DTO types vendored locally at src/dto/ | §7.6. Pulls in monorepo's @splose/dto types we need (booking, auth, forms first). |

### Phase 5 — First-page port (HARD SWITCH TRIGGER)

| # | Title | Why |
|---|---|---|
| P1 | Port Dashboard (minimal — proves the scaffold) | First parity-bar page. Hard-switch trigger event = this issue closing alongside F1, F2, B1, B2. |

### Phase 6 — Hard-switch logistics (run immediately after P1 closes)

These get filed in **splose-current** (not splose-vite) since they modify splose-current's state.

| # | Title (in splose-current) | Why |
|---|---|---|
| H1 | splose-current FROZEN: banner, SessionStart hook, slash command stubs | Prevents accidental edits to legacy repo. |
| H2 | Re-file carry-over issues from splose-current to splose-vite (#19, #21, #22, #23, #24) | Migrate Storybook/Design Review work to active repo. |
| H3 | Update splose-current README with FROZEN status + backlink to splose-vite | Public-facing record of the switch. |

And these get filed in **splose-vite**:

| # | Title (in splose-vite) | Why |
|---|---|---|
| H4 | splose-vite SessionStart hook + active-project memory file | Confirms context every session. |
| H5 | Port slash commands from splose-current to splose-vite | /work, /audit, /fidelity, /verify, /deploy, /status, /devnav, /screenshots, /ds-fix, /ds-migrate. |

### Phase 7 — Remaining parity-bar pages (depend on Phase 3 + Phase 4 + #28 investigation results)

| # | Title | Why |
|---|---|---|
| P2 | Port Patients list | Demonstrates Table shim + filter UI patterns. Depends on C3. |
| P3 | Port Settings shell + side nav | Foundation for all /settings/* sub-routes. Depends on C1, C2. |
| P4 | Port Settings/Online Booking (Bookings 2.0 admin) | Critical for §7.11 live-preview demo. Depends on C2, C4, S1. |
| P5 | Port one further admin page (Invoices, candidate) | Round out the parity-bar with a complex admin page. Depends on C3, C4, S1. |
| P6 | Port Calendar | Depends on #28 investigation classification. **Defer if classified as "skip" or "simplified placeholder" until later.** |

### Phase 8 — Live preview + public booking pages (depend on P4 + most Phase 3/4)

| # | Title | Why |
|---|---|---|
| L1 | Public booking entry: booking.html Vite entry + /online-booking/:uuid route + OnlineBookingNew page | §7.11 functional public pages. Same React tree as admin per spec. |
| L2 | Iframe live preview component in admin Bookings 2.0 config UI | §7.11 iframe. Renders L1's route in iframe. |
| L3 | postMessage protocol (or URL-param fallback) for admin → iframe config sync | §7.11 communication. |
| L4 | Backend draft-state endpoint for preview booking config | §7.11 backend support. Splose-vite Prisma+Turso route. |

### Phase 9 — Tiptap (post parity-bar; tracked but not blocking)

| # | Title | Why |
|---|---|---|
| T1 | Tiptap integration scaffold (tiptap-legacy catalog versions; minimal block editor) | §7.12 port-at-parity classification. Lower priority than parity-bar pages. |

---

## Issue body templates

Each phase's issues use a similar body shape. Below are the templates by phase. When filing, copy the relevant template and fill in the per-issue specifics.

### Template — F1: Vite scaffold

```
## Context

Implements §7.1 + §7.2 + §7.3 + §7.10 of the Step 2 alignment spec
(splose-current/docs/superpowers/specs/2026-04-28-stack-alignment-design.md).

## Goal

Stand up the Vite 7 multi-entry scaffold matching monorepo's web-app stack:
- React 18, TypeScript 5.9.3, Node 22.21.1, pnpm 10.28.2.
- Vite 7 with multi-entry rollup config (index.html admin + booking.html booking).
- react-router-dom 5.3.4 with App.tsx top-level Switch + Main catch-all.
- Path aliases: @assets, @shared, @routes, @config, @contexts, @models, @api, @services, @styles, @utils, @testing.
- Vite plugins: @vitejs/plugin-react, vite-tsconfig-paths, vite-plugin-checker, vite-plugin-svgr.
- Two configs: vite.config.ts (prod) + vite.dev.config.ts (HTTPS).

## Constraints

- No Next.js. No App Router. No server components.
- React 18 only. No React 19 features.
- Match monorepo's tsconfig.json structure (per Agent 1 fragment).

## Acceptance criteria

- [ ] `pnpm install` works on Node 22.21.1.
- [ ] `pnpm dev` boots Vite at acme.splose.test:4200 (or local equivalent) over HTTPS.
- [ ] `pnpm build` produces dist/index.html + dist/booking.html.
- [ ] `pnpm typecheck` passes.
- [ ] Both entries render a stub "hello world" page that confirms routing.

## Depends on

- Independent (Phase 1).
```

### Template — B1: Styling layer

```
## Context

Implements §7.5 of the Step 2 alignment spec.

## Goal

Add SCSS variable layer + AntD ConfigProvider tokens + global styles, mirroring monorepo's
packages/web-app/src/styles/ structure.

## Files to create

- src/styles/variable.scss — SCSS colour, spacing, breakpoint vars.
- src/styles/colors.module.scss — :export block bridging SCSS → TS.
- src/styles/theme.config.ts — AntD ThemeConfig referencing SCSS vars.
- src/styles/global.scss — global utilities and resets.
- src/styles/antdCustom.scss — AntD overrides.
- src/index.tsx — global imports + ConfigProvider wiring.

## Constraints

- Per-component styles use CSS Modules (.module.scss).
- Inline style={{}} only for runtime calcs (mirror monorepo).
- No hardcoded hex values in components.

## Acceptance criteria

- [ ] sass dev dep installed.
- [ ] All five style files created.
- [ ] AntD ConfigProvider in App.tsx referencing theme.config.ts.
- [ ] One stub page proves SCSS module imports work and styles apply.

## Depends on

- F1 (scaffold).
```

### Template — C1: PageHeader

```
## Context

Implements §7.4 PageHeader portion of the Step 2 alignment spec. We are NOT adopting
@ant-design/pro-layout (per Jim's research; PE-6084 is removing it from monorepo).
Building a local PageHeader with AntD v4 API compatibility instead.

## Goal

Local PageHeader component compatible with AntD v4 API:
- Props: title, subTitle, extra, breadcrumb, onBack, footer.
- Built on AntD v5 primitives: Space, Typography.Title, Button.
- Responsive sizing per Josh Worthley's typography audit:
  - Title: 30px desktop, 24px tablet, 18px mobile, weight 700.
  - Sub-title: 18px, weight 400.
- Storybook story at Layout/PageHeader.

## Reference

splose-current's existing PageHeader DS component is the starting point —
port and refine to match the AntD v4 API exactly. Verify against:
https://splose-current.vercel.app/storybook/index.html?path=/story/layout-pageheader--with-multiple-actions

## Acceptance criteria

- [ ] PageHeader.tsx in src/components/Layout/ (or ds/, mirror monorepo's PageHeader location).
- [ ] All six API props supported.
- [ ] Responsive sizing implemented per Josh's audit.
- [ ] Storybook story at Layout/PageHeader with multiple variants (with/without onBack, with/without breadcrumb, with multiple actions).
- [ ] No @ant-design/pro-layout dep added to package.json.

## Depends on

- F1 (scaffold), B1 (styling).
```

(Templates for C2, C3, C4, S1, S2, S3, P1, etc. follow the same shape — fill in per-issue specifics from the spec.)

---

## Filing order recommendation

1. **Jim creates `jimyencken/splose-vite` repo** (manual step; required before any of this can be filed).
2. **File F1, F2, B1, B2 simultaneously** — Phase 1 + Phase 2 are mostly parallel.
3. **File C1–C4, S1–S3 with Depends-on F1** — Phase 3 + Phase 4 are filed but blocked.
4. **File P1 with Depends-on most-of-above** — Phase 5 is the hard-switch trigger.
5. **File H1–H5 (logistics) with Depends-on P1** — Phase 6.
6. **File P2–P5 with Depends-on Phase 3/4** — Phase 7. P6 (Calendar) additionally depends on #28.
7. **File L1–L4 with Depends-on P4** — Phase 8 live preview.
8. **File T1 — Phase 9**, low priority.

## Total issue count

- Phase 1: 2 issues
- Phase 2: 2 issues
- Phase 3: 4 issues
- Phase 4: 3 issues
- Phase 5: 1 issue
- Phase 6: 5 issues (3 in splose-current, 2 in splose-vite)
- Phase 7: 5 issues (P6 Calendar may be deferred)
- Phase 8: 4 issues
- Phase 9: 1 issue

**~27 total** (counting H1–H5 across both repos).

## Out of this plan

- Per-page porting beyond the parity-bar five (Patients sub-pages, Calendar deep features, Reports, etc.) — file these post-parity, after the hard switch.
- DTO synchronisation automation — vendor on demand, no automated sync.
- Backend feature work beyond what L4 requires — stays out of scope for splose-vite's POC value.
