# Monorepo frontend stack

> Read-only discovery output for the splose-current → splose-monorepo alignment roadmap.
> Spec: [`docs/superpowers/specs/2026-04-28-monorepo-stack-discovery.md`](superpowers/specs/2026-04-28-monorepo-stack-discovery.md).
> Plan: [`docs/superpowers/plans/2026-04-28-monorepo-stack-discovery.md`](superpowers/plans/2026-04-28-monorepo-stack-discovery.md).
> Tracking issue: [#26](https://github.com/jimsplose/splose-current/issues/26). Umbrella: [#25](https://github.com/jimsplose/splose-current/issues/25).
> Source repo: [`sploseans/splose-monorepo`](https://github.com/sploseans/splose-monorepo) (default branch: `main`). Read-only access via `gh api`.
> Total file reads consumed: **121 / 150**.

## 1. Executive summary

The splose-monorepo is a **pnpm 10 + Turborepo 2.6 monorepo** on **Node 22.21.1**, with one frontend package (`packages/web-app`) and several backend packages (custom-Express `server`, NestJS `public-api`, AI workers, Lambda services). The frontend is a **React 18 + Vite 7 + Ant Design 5.21 + react-router-dom 5.3.4 + TanStack Query 5 + tiptap-legacy** SPA with a **multi-entry Vite build** that produces two HTML bundles from one React tree: `index.html` for the practitioner-facing admin app (acme.splose.com) and `booking.html` for the patient-facing booking form. Online Bookings 2.0 admin configuration lives at `/settings/online-booking` and renders a **prop-driven static visual mockup preview** (not a functional iframe). Shared concerns are well-organised: `@splose/dto` provides Zod-typed API contracts, `@splose/eslint` provides four linting sub-configs (frontend / backend / common / prettier), and a deep `src/components/shared/` tree (~80+ components across `ui/`, `formControls/`, etc.) wraps AntD primitives consistently. Splose-current's prototype is currently on Next.js 16 + Prisma + React 19 + CSS Modules — material divergence from the monorepo. Online Bookings 2.0 is the in-scope feature for prototype POC fidelity.

## 2. Repo topology

### 2.1 Workspace tooling

- **Package manager:** pnpm 10.28.2 (managed via `corepack`); never `npm`/`yarn`. `linkWorkspacePackages: true`, `saveWorkspaceProtocol: true`, `savePrefix: ''` (exact pinning). `minimumReleaseAge: 1440` (24h supply-chain mitigation; `@splose/*` exempt). Build scripts of common 3rd-party packages (`@nestjs/core`, `aws-sdk`, `esbuild`, `playwright`, `sharp`, `bufferutil`) gated behind `pnpm approve-builds`.
- **Workspace globs:** `packages/*` with explicit excludes: `!packages/cloud-infrastructure`, `!packages/data-import` (Python), `!packages/database-scripts` (SQL), `!packages/fusionauth` (docker container).
- **Catalogs:** `big.js@6`, `node@22`, `sequelize@6`, `react-router@5`, `react-router-dom@5`, `uuid@7`, `tiptap@legacy` (~40 tiptap packages + bundled prosemirror peers).
- **Global overrides:** `@types/node` 22.18.13, `@types/validator` 13.15.4, `tough-cookie` 4.1.3, `nodemailer` 6.9.9, `prosemirror-model` 1.19.4.
- **Build orchestrator:** Turborepo 2.6.1. Pipeline tasks: `build` (depends on `^build`, outputs `dist/**`+`build/**`), `web-app#build` (Vite-specific inputs/env including `TIPTAP_TOKEN`, `O11Y_SOURCEMAP_*`), `build:watch`, `test`, `test:unit:coverage`, `test:integration:pipeline` (no cache), `test:api:pipeline` (no cache), `typecheck`, `lint`, `format:check`, `format:fix`, `dev` (persistent, no cache).
- **Node:** v22.21.1 (`.nvmrc`); root `engines.node: ">=22.0.0"`. Volta pin: node 22.21.1, pnpm 10.28.2.
- **TypeScript:** **No root `tsconfig.json`** at repo root. Each package owns its own `tsconfig.json` (and often a `tsconfig.build.json`). Root `package.json` declares TS `5.9.3` as a dev dep used by Turbo `typecheck`. (`turbo.json` lists `tsconfig.json` in `globalDependencies` even though no root file exists — no-op.)
- **ESLint:** flat config (`eslint.config.mjs`) at root is minimal — only sets package-wide ignores. The real configuration lives in `@splose/eslint` which exports four sub-configs (`backend`, `frontend`, `common`, `prettier`). Root devDeps: `eslint 9.39.1`, `eslint-config-turbo 2.6.1`, `prettier 3.6.2`.

### 2.2 Package inventory

(All paths are `packages/<name>` in the monorepo.)

| Package | One-line purpose | In scope? |
|---|---|---|
| `web-app` | **React 18 + Vite + AntD 5 + TanStack Query + tiptap-legacy** SPA. The single frontend codebase. Hosts admin (`acme.splose.com`) and public booking form via multi-entry Vite. | **Yes** — primary. |
| `web-app-automated-testing` | Playwright E2E tests against `web-app`. | No — test harness. |
| `server` | Custom-Express + tsyringe **main backend** (the "monolith"). Powers admin app + booking-form data + AI/tiptap. **Not** NestJS despite Express decorators. | Context only — Agent 7 reads selected files. |
| `public-api` | NestJS 10 + Fastify + Winston **public REST API** for **third-party integrations**. Naming clash: NOT the patient-facing booking form. | No — backend API. |
| `notification-service` | Email/SMS/reminders event processor (Express, Twilio, SES, ical). | No — backend. |
| `ai-note-embeddings-service` | SQS worker for AI note embedding events; uses OpenAI + Sequelize. | No — backend. |
| `ai-voice-to-text-service` | SQS worker for AI voice-to-text events. | No — backend. |
| `lambda-image-processor` | AWS Lambda for image processing. | No — backend. |
| `lambda-pdf` | AWS Lambda for PDF generation. | No — backend. |
| `cli` | Internal developer CLI (zx + AWS SDKs + tsyringe). | No — tooling. |
| `dto` | `@splose/dto` — shared Zod request/response schemas + types between server and web-app. | Shared lib (relevant context). |
| `helper` | `@splose/helper` — shared utility functions (big.js, dayjs helpers). | Shared lib. |
| `logger` | `@splose/logger` — pino logger wrapper. | Shared lib. |
| `models` | `@splose/models` — Sequelize models, migrations, OAuth2 server, MySQL2. | No — backend foundation. |
| `eslint` | `@splose/eslint` — flat-config ESLint with sub-configs (`backend`/`frontend`/`common`/`prettier`). | Shared lib. |
| `cloud-infrastructure` | Pulumi IaC (AWS). Excluded from pnpm workspace. | No — infra. |
| `data-import` | Python data import scripts. Excluded from workspace. | No — not JS/TS. |
| `database-scripts` | SQL scripts. Excluded from workspace. | No — not JS/TS. |
| `fusionauth` | FusionAuth docker container. Excluded from workspace. | No — auth service. |

### 2.3 Monorepo onboarding docs (key facts)

The monorepo's own `CLAUDE.md` and `AGENTS.md` files at the root are **byte-identical** (same 171-line content). Frontend-specific conventions live in `packages/web-app/AGENTS.md`. Key facts extracted:

- **Brand:** "splose" is always lowercase — never "Splose". Healthcare practice management SaaS for allied health (AU/UK; future US).
- **Multi-tenancy:** Every DB query MUST include `organisationId`. Localisation uses British English in identifiers (`organisation`, `colour`); user-facing strings driven by `Organisation.country` (no hardcoded "GST", "ABN", "$").
- **Money:** Always `big.js`.
- **Sequelize models:** `BIGINT.UNSIGNED` PKs/FKs, `paranoid: true`, no new `@Scopes`.
- **`packages/server` is NOT NestJS** — uses custom Express decorators (`@Controller`, `@Get`, `@Authentication`) on `reflect-metadata` + `tsyringe`. Do not import from `@nestjs/*` in server code.
- **`packages/public-api` IS NestJS 10** (with Fastify + Winston). Different framework from main server.
- **Recent upgrade** (`UPGRADE-GUIDE.md`): Node v22 LTS (Node 18 EOL). pnpm 10.28.2 via corepack. `lambda-pdf-playwright` mentioned but not yet a directory — likely deferred.

## 3. In-scope app sections

### 3.1 Admin app — `packages/web-app` (acme.splose.com)

**Overview:** Practitioner-facing practice management UI. Single-page React 18 application served from Vite-built `index.html` bundle. All admin routes live behind a catch-all `*` route in `App.tsx` that routes to a `Main` component, which itself defines a deep nested `<Switch>` of `<PrivateRoute>`-guarded routes (Dashboard, Calendar, Patients, Invoices, Settings, etc.). Versioned in lockstep with `packages/server` (both at v35.17.0 at time of discovery).

#### Build & runtime
- **What:** React 18 + Vite 7 + TypeScript 5.x. Vite multi-entry build: `main` (index.html), `uk` (index.uk.html), `booking_main` (booking.html), `booking_uk` (booking.uk.html) — 4 entries, separate output bundles. Manual chunk splitting (froala, iconv, medipass, pdfjs, antd, react). Custom Elastic APM sourcemap upload plugin. PDF cmaps copied statically. CI flag skips type/lint checks during build for speed.
- **Consistency:** Single `vite.config.ts` for prod/staging; separate `vite.dev.config.ts` for dev (HTTPS, `acme.splose.test:4200`, simpler plugins, dev metadata injected).
- **Representative paths:**
  - `packages/web-app/vite.config.ts` — production build with multi-entry rollup inputs.
  - `packages/web-app/vite.dev.config.ts` — dev/preview with HTTPS certs.
  - `packages/web-app/tsconfig.json` — primary; 10 path aliases (`@assets`, `@shared`, `@routes`, `@config`, `@contexts`, `@models`, `@api`, `@services`, `@styles`, `@utils`, `@testing`); jsx: `react-jsxdev`; target: ES2022; isolatedModules + verbatimModuleSyntax.
  - `packages/web-app/tsconfig.build.json` — separate build config (referenced from vite).
  - `packages/web-app/tsconfig.eslint.json` — ESLint scope.
  - `packages/web-app/plugins/vite-plugin-elastic-sourcemaps/sourcemaps.plugin.ts` — custom sourcemap upload plugin.
- **Qualitative health:** Mature, well-structured Vite setup with deliberate vendor chunking. Partial TypeScript strictness (strictNullChecks + noImplicitAny disabled; documented migration path to enable). HTTPS-by-default for dev keeps parity with production cookies/CSP.

#### Styling
- **What:** Multi-technique stack — SCSS + CSS Modules (primary for component styling), AntD `ConfigProvider` tokens (theme), inline `style={{}}` for runtime colour calcs, SCSS variables/mixins. AntD 5 ships Emotion under the hood for component styles.
- **Consistency:** CSS Modules dominate component-level styling. SCSS variables in `src/styles/variable.scss` are the single source of truth for colours/spacing. Theme tokens in `src/styles/theme.config.ts` reference SCSS vars (e.g. `colorPrimary: styles.vibrantViolet`) ensuring DRY. `src/styles/colors.module.scss` uses `:export` to make SCSS vars consumable from TS.
- **Representative paths:**
  - `packages/web-app/src/styles/theme.config.ts` — AntD `ThemeConfig` with 60+ component-token overrides + global tokens.
  - `packages/web-app/src/styles/variable.scss` — SCSS variables (`$vibrant-violet`, `$cool-black`, etc.).
  - `packages/web-app/src/styles/colors.module.scss` — `:export` block bridging SCSS → TS.
  - `packages/web-app/src/styles/global.scss` — global utilities.
  - `packages/web-app/src/styles/antdCustom.scss` — custom AntD overrides imported globally.
  - `packages/web-app/src/index.tsx` — global style imports + `ConfigProvider`.
- **Qualitative health:** Healthy. Single theme (no light/dark switching observed). No hardcoded hex values in components. Inline styles minimal and purpose-driven.

#### Components
- **What:** AntD 5.21.0 + `@ant-design/pro-layout` 7.22.7 + `@ant-design/icons` 6.0.2 + tiptap-legacy + Stripe React + Medipass partner SDK. ~80+ shared components in `src/components/shared/` organised across 11 subdirectories.
- **Consistency:** Shared components consistently wrap AntD primitives (`Table` wraps `AntdTable`, `DatePicker` wraps `AntdDatePicker` with dayjs+format enforcement, `CustomizableSelect` wraps `Select` with custom-input toggle). Raw AntD imports exist in top-level layouts (`Main.tsx` uses `Layout`, `Modal`, `notification` directly); downstream pages use shared wrappers.
- **Representative paths:**
  - `packages/web-app/src/components/shared/ui/Table/Table.tsx` — wrapped Table.
  - `packages/web-app/src/components/shared/formControls/DatePicker/DatePicker.tsx` — dayjs-only DatePicker.
  - `packages/web-app/src/components/shared/ui/CustomizableSelect/CustomizableSelect.tsx` — wrapped Select.
  - `packages/web-app/src/components/Main/Main.tsx` — admin shell (raw `Layout`, not ProLayout).
  - `packages/web-app/src/components/shared/` — 11 subdirs (`ui/` 34 components, `formControls/` 44 wrappers, `forms/`, `banners/`, `customFilters/`, `editor/`, `errorBoundaries/`, `hooks/`, `modals/`, `portals/`, `wrappers/`).
- **Qualitative health:** Strong, consistent wrapping discipline. **`@ant-design/pro-layout` is declared but NOT used in the main admin layout** — appears vestigial or used in non-primary path.

#### State management
- **What:** **React Context** (NOT Redux/Zustand/Jotai). Multiple specialised contexts per domain: `AuthContext`, `OrganisationContext`, `OnlineBookingNewContext`, `OnlineBookingContext`, `ReleaseFlagContext`, `AnalyticsContext`, `QueryClient.context`, `WebSocketContext`, `AppointmentContext`, `CaseContext`.
- **Consistency:** Context API is the dominant pattern. Each domain owns a context.
- **Representative paths:**
  - `packages/web-app/src/contexts/AuthContext.tsx` — currentUser, login/logout/2FA, ACL.
  - `packages/web-app/src/contexts/OrganisationContext.tsx` — multi-tenant preload data on app start.
  - `packages/web-app/src/contexts/OnlineBookingNewContext.tsx` — Bookings 2.0 wizard state.
  - `packages/web-app/src/contexts/QueryClient.context.tsx` — TanStack Query singleton.
  - `packages/web-app/src/contexts/ReleaseFlagContext.tsx` — feature flags.
- **Qualitative health:** Minimalist. No Redux ceremony. Contexts are well-scoped per domain.

#### Data fetching
- **What:** TanStack Query 5.90.21 for new code; legacy code uses raw axios with global request interceptor. QueryClient centralised but query *hooks* are NOT centralised — call sites use direct axios in `src/services/api/...` or `src/services/<domain>API.ts`.
- **Consistency:** QueryClient setup uses defaults (no custom `staleTime`, `retry`, `refetchOnWindowFocus`). No abstracted hook layer (`useClients`, `useAppointments`) observed.
- **Representative paths:**
  - `packages/web-app/src/contexts/QueryClient.context.tsx` — client setup.
  - `packages/web-app/src/services/api/appointmentAPI.ts` — direct axios calls.
  - `packages/web-app/src/services/onlineBookingNewAPI.ts` — `getOnlineBookingSettingByUUIDAPI`, `bookAppointmentAPI`, etc.
  - `packages/web-app/src/services/authenticationAPI.ts` — auth API calls.
  - `packages/web-app/src/App.tsx` — `initializeAxios()` configures global interceptor (DOMAIN_HEADER_NAME, `withCredentials: true`, baseURL).
- **Qualitative health:** Functional but inconsistent abstraction layer. Mix of TanStack Query and raw axios per call site. Migration to consistent hook-per-resource pattern would tighten the code.

#### Forms
- **What:** AntD `Form` + `Form.Item` + `useForm` (NOT React Hook Form, NOT Formik). Form values typed via `@splose/dto` request types. Validation: dual-layer — AntD `rules` (UI) + DTO/Zod types (contract).
- **Consistency:** Uniform across admin and booking. Every form-heavy page uses `Form.useForm<DTOType>()` and triggers `formInstance.validateFields()`. 50+ reusable form-control components in `shared/formControls/` extending `CustomFormControlProps<Value, FieldValue>`.
- **Representative paths:**
  - `packages/web-app/src/components/Main/Settings/AppointmentTemplatesSettings/CreateEditAppointmentTemplateSettings/CreateEditAppointmentTemplateSettings.tsx` — `Form.useForm<TemplateFormValues>()`.
  - `packages/web-app/src/components/OnlineForm/OnlineForm.tsx` — `Form.useForm<PatientOnlineFormInstance>()`.
  - `packages/web-app/src/components/Main/Settings/OnlineBookingNewSettings/CreateEditOnlineBookingSettingPage.tsx` — Bookings 2.0 admin form.
  - `packages/web-app/src/components/shared/formControls/PatientSelect/PatientSelect.tsx` — domain-specific form control.
  - `packages/web-app/src/components/shared/formControls/` — 50+ controls (DatePicker, BirthDate, ServiceSelect, LocationSelect, etc.).
- **Qualitative health:** High consistency. DTO-typed forms give compile-time contract safety.

#### Tables / lists
- **What:** Custom `Table` wrapper at `shared/ui/Table/Table.tsx` extending AntD `Table` v5.21.0. Adds custom empty state, pagination formatting (Intl.NumberFormat), styling overrides. **No TanStack Table or AntD Pro Table.**
- **Consistency:** All admin list views use the wrapped Table. `ColumnsType<T>` column defs. Manual pagination state and array filtering for search.
- **Representative paths:**
  - `packages/web-app/src/components/shared/ui/Table/Table.tsx` — the wrapper.
  - `packages/web-app/src/components/Main/Settings/LocationSettings/LocationSettings.tsx` — `ColumnsType<OrganisationLocation>`.
  - `packages/web-app/src/components/Main/Settings/AppointmentTemplatesSettings/AppointmentTemplatesSettings.tsx` — `AppointmentTemplatesTable`.
- **Qualitative health:** Solid consistent wrapping. Mostly in-memory filtering/sorting; no advanced features (cursor-token pagination, virtualisation) observed.

#### Routing
- **What:** `react-router-dom` 5.3.4 (catalog-pinned) with `<BrowserRouter>` + `<Switch>`. Top-level routes in `App.tsx` route public flows (`/booking`, `/online-booking/:uuid`, `/booking-modify/:code`, `/forms`, `/public-form`, `/join`, `/invoice`, `/credit-note`, `/error`); catch-all `*` → `Main` (admin app). Admin routes nested inside `Main` with `<PrivateRoute>` guards. Aggressive lazy-loading via `React.lazy()` + `<Suspense fallback={<GenericSuspenseFallback />}>`.
- **Consistency:** All top-level routes lazy-loaded. Single fallback component.
- **Representative paths:**
  - `packages/web-app/src/App.tsx` — top-level Switch.
  - `packages/web-app/src/components/Main/Main.tsx` — admin nested Switch with ~50 sub-routes.
  - Online Bookings 2.0 admin lives at `/settings/online-booking` (gated by `flags.enableNewOnlineBookings`).
- **Qualitative health:** Modern split between public/admin entries. Note: react-router 5 is two major versions behind v7; future upgrade would touch `<Switch>` → `<Routes>` migration.

#### Layout primitives
- **What:** Raw AntD `<Layout>` + `<Header id="adminHeader">` + `<Content>` (NOT ProLayout despite the dependency). `<AdminHeader>` handles top nav (avatar, notifications, help, settings dropdown, SMS/calendar alerts, announcement modal, Intercom). Mobile menu toggle below 460px width.
- **Consistency:** Flat layout (no Sider/sidebar). Pages own their headers — no enforced PageHeader pattern.
- **Representative paths:**
  - `packages/web-app/src/components/Main/Main.tsx` — admin Layout shell.
  - `packages/web-app/src/components/Main/AdminHeader/...` — header.
- **Qualitative health:** Simple but inconsistent at page level. No shared layout template — each page builds its own structure.

#### Tests
- **What:** Vitest 4.0.18 with multi-project setup; jsdom for React unit tests, Node env for Vite plugin tests; coverage via v8 (HTML/LCOV/JSON); JUnit reporter for CI; setup file at `test-utils/vitest.setup.ts`. E2E tests in separate `packages/web-app-automated-testing` (Playwright).
- **Consistency:** Two-project Vitest config keeps plugin tests (Node) and app tests (jsdom) isolated.
- **Representative paths:**
  - `packages/web-app/vitest.config.ts` — multi-project config.
  - `packages/web-app/plugins/vitest.config.ts` — Vite plugin tests.
  - `packages/web-app-automated-testing/` — Playwright E2E.
- **Qualitative health:** Good. AntD explicit in `optimizeDeps` to avoid side-effect issues. Test mocking conventions documented in `packages/web-app/AGENTS.md` (mock transitive context deps directly; hoist mock values; co-locate `__mocks__`; `/* empty */` comments in empty arrows).

### 3.2 Public booking form — `packages/web-app` (`booking.html` entry)

**Overview:** Patient-facing end-user booking experience. Same React tree and `App.tsx` as the admin app, but built into a separate `booking.html` Vite entry. Routes are URL-path-gated: `/booking` (legacy `OnlineBookingApp`), `/online-booking/:uuid` (Bookings 2.0 `OnlineBookingNewApp`), `/booking-modify/:code` (patient self-service modify), `/forms` (`OnlineForm`), `/public-form` (`EmbeddableForm` for cross-domain embedding). UK variants exist as `booking.uk.html`. No admin chrome on booking entry — minimal full-screen booking shell.

#### Build & runtime
Same as admin (§3.1) — shared `vite.config.ts` produces both bundles. Booking entry includes Google Analytics + Medipass SDK in its HTML (vs admin's defaults). Same TypeScript and Node configuration.

#### Styling
Same multi-technique stack as admin (§3.1). Booking entry uses CSS Modules for `OnlineBooking.module.scss` and `animation.module.scss`. Inline `style={{}}` observed in `OnlineBookingNew/OnlineBooking.tsx` for runtime colour calcs (uses `Color` package for opacity/luminance). Mix-by-route: Admin (`src/components/Admin/`) styling not deeply sampled; OnlineBookingNew confirmed CSS Modules + AntD tokens.

#### Components
Booking entry uses the same shared components in `src/components/shared/` as admin. Booking-specific components live in `src/components/OnlineBookingNew/` (Bookings 2.0), `src/components/OnlineBooking/` (legacy), `src/components/OnlineForm/`, `src/components/EmbeddableForm/`, plus card-based layouts (per Agent 6) for service/location/practitioner selection.

#### State management
Booking-specific state via `OnlineBookingNewContext` (and `OnlineBookingContext` for legacy). Holds `bookingSetting`, `appointments`, `services`, `locations`, `practitioners`, selected choices, AntD form instances (`patientInfoForm`, `paymentForm`). Multi-step wizard pages: location → service → appointment → confirmation → summary.

#### Data fetching
Direct axios via `src/services/onlineBookingNewAPI.ts`. Public endpoints (no auth required for new bookings; token-based for modify flow). Key calls:
- `getOnlineBookingSettingByUUIDAPI(uuid)` — fetches `OnlineBookingSetting` config.
- `getOrganisationOnlineBookingNewAPI(uuid)` — fetches org + setting.
- `bookAppointmentAPI(bookingInfo)` — submits booking.
- Token-based patient-actions API for reschedule/modify.

No TanStack Query observed for booking config — appears to be raw axios with local context state.

#### Forms
Same AntD Form pattern as admin. `OnlineForm.tsx` uses `Form.useForm<PatientOnlineFormInstance>()` with `EmbeddableFormDTO` types from `@splose/dto`. Multi-step booking form managed by `OnlineBookingNewContext` rather than a single `Form.useForm` instance.

#### Tables / lists
Booking flows use **card-based** layouts for selection (services, locations, practitioners) — not the wrapped `Table`. Different choice from admin which uses tables exclusively.

#### Routing
Routes for booking listed in §3.1 routing subsection; all live in shared `App.tsx`. `OnlineBookingNewApp` wraps `OnlineBooking` with `<OnlineBookingNewProvider>`. No admin nested router.

#### Layout primitives
No ProLayout, no admin Header. Each booking entry component renders its own minimal full-screen shell.

#### Tests
Vitest setup is shared with admin. Booking-specific test files would live alongside booking components (`__tests__` co-located).

## 4. (Embedded above as subsections of §3.1 and §3.2)

The §4 per-app concern template (build/runtime, styling, components, state, data, forms, tables, routing, layout, tests) is fully populated inside each in-scope app's section in §3, per the spec output structure.

## 5. Cross-cutting concerns

### 5.1 Tokens
- **What:** Design tokens are NOT centralised in a dedicated shared package. AntD v5 is the de facto design system. `packages/web-app/src/styles/theme.config.ts` and `variable.scss` are the per-app token sources.
- **Consistency:** Per-app — no monorepo-wide token export.
- **Qualitative health:** Low centralisation; if multiple frontend packages existed, there would be no shared token source. Acceptable given there's only one frontend.

### 5.2 Lint/format conventions
- **What:** Real ESLint config lives in `@splose/eslint` (`packages/eslint`). Four sub-configs:
  - `frontend` — `react`, `a11y`, `typescript`, `vitest`.
  - `backend` — `typescript`.
  - `common` — `security`, `circular` (circular-dep detection).
  - `prettier` — formatting rules.
- **Core rules:** TypeScript strict via `typescript-eslint`. **Import sorting** via `eslint-plugin-perfectionist` (groups: `react`, type-imports, builtins/external, `@splose` packages, internal types/values, tsconfig paths, parent/sibling/index, unknown). **Erasable syntax only** via `eslint-plugin-erasable-syntax-only`.
- **Export shape:** `SploseLinter.base`, `SploseLinter.frontend.*`, `SploseLinter.backend.*`, `SploseLinter.common.*`.
- **Representative paths:**
  - `packages/eslint/src/configs/core.eslint.ts` — core rules.
  - `packages/eslint/src/configs/frontend/...` — frontend sub-config.
  - `packages/eslint/src/prettier/prettier.rules.ts` — prettier rules.
- **Qualitative health:** Well-organised. Splose-current would gain consistency by adopting `@splose/eslint` directly rather than maintaining its own ruleset.

### 5.3 Prettier rules
- `printWidth: 100`, `tabWidth: 2` (spaces, not tabs), `singleQuote: true`, `trailingComma: 'all'`, `arrowParens: 'always'`, `bracketSpacing: true`, `bracketSameLine: false`, `quoteProps: 'as-needed'`, `useTabs: false`.

### 5.4 Shared packages summary
- **`@splose/dto`** — Monorepo-wide Zod schemas + types. Domains: accounts, patients, practitioners, appointments, invoices, payments, integrations (Stripe, Xero, Medipass, QuickBooks, Physitrack, FusionAuth), communications, analytics, custom fields, forms, online booking, SSO, NDIS, healthcodes. One file per domain (`patient.dto.ts`, `invoice.dto.ts`, etc.). Index re-exports everything plus subdirs (`context/`, `reports/`, `shared/`).
- **`@splose/helper`** — Shared utilities: ACC (Australian Aged Care), address formatting, AI utilities, finance/money helpers, form helpers, sanitisation, string utilities.
- **`@splose/logger`** — Pino wrapper.
- **`@splose/models`** — Sequelize models (backend foundation).
- **`@splose/eslint`** — Linting (see §5.2).

### 5.5 Monorepo-wide conventions (from `packages/web-app/AGENTS.md`)
- **State management:** TanStack Query for new code; legacy axios + global interceptor (adds `splose-domain` header, overrides baseURL).
- **Forms:** AntD v5 forms with `Form.Item` + `useForm()`. Not React Hook Form.
- **Date/time:** dayjs with plugins (utc, timezone, duration) loaded globally in `index.tsx`. Not moment.
- **Build tool:** Vite (not webpack). SVG imports use `?react` suffix for component imports.
- **Environment variables:** Runtime, not build-time. Fetched from `/client-variables` API into `window.*` globals.
- **Release flags:** `useReleaseFlags()` hook or `<ReleaseFlagged flag="..." component={...} />` wrapper.
- **Testing:** Vitest, not Jest. `vi.mock()`. Globals enabled.
- **Error handling:** `toError(error)` from `@utils/type-helpers/error` to safely convert `unknown` catch errors. Exception: raw `error` OK for `console.*`.
- **Source maps:** Elastic RUM via `sourcemapUploadPlugin` Vite plugin (`build-deploy-webapp.sh --upload-sourcemaps`).

### 5.6 Pre-commit hooks
Not located in this discovery pass. May be in `.husky/` or `lint-staged` config — escalated to §8.

### 5.7 Code generation / schema generation
DTOs (`@splose/dto`) are hand-maintained Zod schemas + TypeScript types. No OpenAPI codegen or `zod-openapi`-style pipeline detected.

### 5.8 Healthcare-specific conventions
- **NDIS / ACC / Health Fund:** DTOs include `acc.dto.ts`, `acc32.dto.ts`, `health-fund.dto.ts`, `healthcode.dto.ts`.
- **Integrations baked into DTOs:** Medipass, QuickBooks, Xero, FusionAuth SSO, Stripe, Physitrack.
- **Localisation:** British English in identifiers (`organisation`, `colour`); user-facing strings driven by `Organisation.country` (no hardcoded "GST", "ABN", "$" in source).

## 6. Live preview integration deep-dive

### 6.1 Embedding mechanism

**The Online Bookings 2.0 admin live preview is NOT an iframe and NOT a functional booking form.** It is a **direct in-tree React component render** of a static visual mockup — `OnlineBookingNewDesignVisual`. The component accepts design props (colours, notice text, currency) and renders **hardcoded example data** (services like "Initial consultation", "Ongoing Consultation", "Podiatry") to give the admin a visual sense of how the styled booking form will look.

**Code shape** (`CreateEditOnlineBookingSettingPage.tsx`):
```tsx
<OnlineBookingNewDesignVisual
  primaryColor={primaryColor}
  secondaryColor={secondaryColor}
  noticeTitle={noticeTitle}
  noticeMessage={noticeMessage}
  noticeFillColour={noticeFillColour}
  noticeColour={noticeColour}
  currencyCode={...}
/>
```

### 6.2 Component-sharing model
- The mockup component (`OnlineBookingNewDesignVisual`) is its own component, not a shared rendering of `OnlineBookingNewApp`.
- Shared UI subcomponents from `packages/web-app/src/components/shared/` are likely reused (cards, buttons, layout primitives) but **the live preview does NOT mount the real booking form's component tree.**
- Path: `packages/web-app/src/components/Main/Settings/OnlineBookingNewSettings/OnlineBookingSections/OnlineBookingDesignVisual/OnlineBookingDesignVisual.tsx`.

### 6.3 Communication (admin → preview)
- **Mechanism:** Synchronous prop-passing within the same React tree. Admin component holds local state (`useState` for each design knob). On change, state updates → React re-renders → preview component receives new props → re-renders.
- **No postMessage, no async, no message marshalling.**

### 6.4 EmbeddableForm cross-domain mechanism
- **Endpoint:** `GET /api/embeddableForm/:uuid` (from server's `public.controller.ts`).
- **Mechanism:** Standard iframe embedding on third-party sites. CORS configured in Express with whitelist (`Constants.CORS_ORIGIN_WHITELIST`).
- **Helmet:** `frameguard: false` explicitly disabled in `application-server.ts` to allow iframe rendering on external domains:
  ```ts
  app.use(helmet({
    frameguard: false, // disable this as it will prevent online booking iframe to be rendered on other domains
  }));
  ```
- The third-party iframe loads `booking.html` (or a wrapper that includes it), with the form data fetched dynamically.

### 6.5 Backend serving (`booking.html` vs `index.html`)
**Not fully resolved in this pass.** Multi-entry Vite produces both bundles in `dist/`. The Express server in `packages/server` chooses which to serve, but the static-file routing logic was not located within the read budget. Likely candidates: path-prefix matching (`/online-booking/*` → `booking.html`, default → `index.html`) or subdomain split. Escalated to §8.

### 6.6 Replication needs for splose-current

**This lever is DECIDED, not open** (per Jim, 2026-04-28). splose-current must implement a **fully interactive functional live preview**, going beyond production's static mockup. Reason: splose-current is also a vibe-coding foundation — it must be a real working application, not a mockup. See project memory `project_booking_form_interactive_requirement`.

splose-current needs:

- **An iframe** in the Bookings 2.0 admin config UI pointing at a draft URL (e.g. `/online-booking/:tempUuid?draft=true`).
- **A postMessage protocol** (or URL-param fallback) to push config changes (colours, fields, slots) from admin → iframe in real time.
- **Backend support** to serve draft/preview booking forms with injected config — including a way to reconcile draft state with persisted state.
- **Real end-user booking pages** at the same routes the iframe loads from — i.e. the iframe and the public-facing booking experience must share the same React entry, not two separate implementations.

Production's mockup-only approach (§6.1–§6.4) is documented here for reference only. splose-current's implementation is the more ambitious cousin.

## 7. Implications for splose-current alignment

Each lever lists **splose-current today**, **monorepo today**, **what aligning would look like**, **estimated impact**, and **biggest risk**. These are observations only — Step 2 captures Jim's decisions.

### 7.1 React version

- **splose-current:** React 19 (with Next.js 16).
- **monorepo:** **React 18**.
- **If aligning:** Downgrade splose-current to React 18.
- **Estimated impact:** All `package.json` deps; minor JSX runtime changes. React 19 features (e.g. Actions, `use()` hook) would need to be removed if used. Storybook + Storybook MCP (Storybook 10.3+ on React renderer) work fine on React 18.
- **Biggest risk:** Some new React 19 SSR features may be in use; would require audit.

### 7.2 Build tool / framework

- **splose-current:** Next.js 16 (App Router) + Turbopack/webpack.
- **monorepo:** **Vite 7** (multi-entry, no Next.js).
- **If aligning:** Migrate splose-current from Next.js App Router to a Vite SPA with multi-entry build (`index.html`, `booking.html`). Lose Next.js's file-based routing, server components, RSC, middleware, image optimisation, route handlers.
- **Estimated impact:** Major. Every `src/app/.../page.tsx` becomes a route in `react-router-dom`. All server components → client components. Data fetching loses RSC; moves to TanStack Query.
- **Biggest risk:** Splose-current's value as a POC is partly *because* it uses Next.js conventions; alignment may erode demonstration value. Discuss in Step 2 whether to align fully, partially (Vite + RR), or stay on Next as a "modern variant" reference.

### 7.3 Routing

- **splose-current:** Next.js App Router (file-system).
- **monorepo:** **react-router-dom 5.3.4** (declarative, two majors behind v7).
- **If aligning:** Adopt `react-router-dom@5` to match production exactly — accepting v5's API (`<Switch>`, `<Route component>`, `useHistory`). Or pre-emptively use v6/v7 to position splose-current as a "future-state" reference.
- **Estimated impact:** All page routing; `next/navigation` removed; `useHistory` / `useParams` from RR. Layout composition shifts from Next layouts to nested `<Switch>`.
- **Biggest risk:** RR 5 is legacy — alignment may lock splose-current to a stale routing approach. Tradeoff vs. exact monorepo fidelity.

### 7.4 Component library

- **splose-current:** AntD 5 (current splose-current uses AntD directly per recent issues #7–#15; DS wrappers being removed).
- **monorepo:** **AntD 5.21.0** + `@ant-design/pro-layout` (declared but unused in main layout) + `@ant-design/icons`.
- **If aligning:** Already very close. Match AntD version. Adopt the wrapping discipline of `shared/ui/Table`, `shared/formControls/DatePicker`, etc. Keep AntD direct in top-level layouts.
- **Estimated impact:** Small — splose-current is already on AntD 5. Largest gain from importing the shared/formControls catalogue patterns into splose-current's DS.
- **Biggest risk:** Low. This is the lever with smallest delta.

### 7.5 Styling

- **splose-current:** CSS Modules (per `Page.module.css`) + AntD `ConfigProvider` theme tokens. No SCSS.
- **monorepo:** **SCSS + CSS Modules** + AntD `ConfigProvider` tokens + inline `style={{}}` for runtime calcs. SCSS variable layer in `src/styles/variable.scss` exported to TS via `:export`.
- **If aligning:** Adopt SCSS for the variable layer; keep CSS Modules for component scope (already match). Add a `colors.module.scss`-style bridge for SCSS → TS.
- **Estimated impact:** Moderate. Add `sass` dep, port theme config to reference SCSS vars, add `variable.scss` and `colors.module.scss`. Existing CSS Modules already match.
- **Biggest risk:** Low. Adoption is additive.

### 7.6 State management

- **splose-current:** Local React state + Next.js server components for data.
- **monorepo:** **React Context** for client state (multiple specialised contexts) + TanStack Query for server state.
- **If aligning:** Add TanStack Query as the server-state layer. Add per-domain Context providers (Auth, Organisation, ReleaseFlag) to mirror production. Migrate any data flow currently using server components to QueryClient.
- **Estimated impact:** Moderate. New deps; new context boilerplate; migration of any RSC data fetching.
- **Biggest risk:** Splose-current may not have enough real data flow to demonstrate the patterns convincingly. Consider mock APIs.

### 7.7 Forms

- **splose-current:** AntD Form + `Form.useForm()` (per CLAUDE.md "AntD Form adoption" track).
- **monorepo:** **AntD Form + `Form.useForm()`** with DTO types.
- **If aligning:** Already aligned. Add typed form values via shared DTO types if a shared types package is adopted.
- **Estimated impact:** Trivial.

### 7.8 Tables

- **splose-current:** AntD Table directly (per "DS removal: Replace DataTable with AntD Table columns" track in #8).
- **monorepo:** Custom `Table` wrapper around AntD `Table` (adds empty state, pagination format).
- **If aligning:** Adopt the `shared/ui/Table` wrapping pattern in splose-current's DS.
- **Estimated impact:** Small. One wrapper to add.

### 7.9 Lint / format

- **splose-current:** Likely default Next.js ESLint + Prettier.
- **monorepo:** `@splose/eslint` flat-config sub-configs (frontend / backend / common / prettier). Specific rules: `eslint-plugin-perfectionist` import sorting, `eslint-plugin-erasable-syntax-only`, security + circular-dep checks, AntD-aware React rules.
- **If aligning:** Pull in `@splose/eslint`'s frontend + prettier configs.
- **Estimated impact:** Small. New dev deps + flat config rewrite.
- **Biggest risk:** Low.

### 7.10 Node / pnpm / TypeScript

- **splose-current:** Probably Node 20+, npm or pnpm, TS 5.x. Not verified in this pass.
- **monorepo:** **Node 22.21.1, pnpm 10.28.2, TS 5.9.3**. No root tsconfig (each package owns its own).
- **If aligning:** Match Node + pnpm versions. Already on TS 5.x likely.
- **Estimated impact:** Small.

### 7.11 Live preview — **DECIDED (not open)**

- **splose-current:** No live preview today.
- **monorepo:** Static visual mockup via prop-driven React component (NOT iframe).
- **DECISION (per Jim, 2026-04-28):** splose-current must implement a **fully interactive functional live preview** — iframe + postMessage + draft-mode backend — and **fully interactive end-user booking pages**. This goes BEYOND production's mockup approach. Reason: splose-current is also a vibe-coding foundation; it must be a real working application.
- **Estimated impact:** Moderate-to-large. Need: iframe component in admin Bookings 2.0 config UI, draft URL convention (`/online-booking/:tempUuid?draft=true`), postMessage protocol (or URL-param fallback) for live config sync, backend draft-state handling, real public booking pages sharing the same React entry as the iframe.
- **Biggest risk:** Scope creep — backend draft-state plumbing is the largest unknown. Iframe sync and end-user pages are well-trodden patterns.
- **Reference:** Project memory `project_booking_form_interactive_requirement`.

## 8. Open questions

Read-only access cannot answer:

1. **`@ant-design/pro-layout` actual usage** — declared but Main.tsx uses raw AntD Layout. Is it dead, used in PageHeader pattern, or a different non-primary layout? (Would need codebase grep beyond budget.)
2. **Backend static-file routing** for `booking.html` vs `index.html` — path prefix? Subdomain? Located in deployment / NGINX / Express middleware not surfaced in reads. Step 4 cookbook may need this.
3. **Husky / lint-staged setup** — pre-commit hooks not located. May be in `.husky/` or `package.json`.
4. **Client-side runtime Zod validation** via `@splose/dto` — is the client running Zod parses, or only consuming types?
5. **`/client-variables` API endpoint** implementation and full list of runtime-injected variables.
6. **TanStack Query hook abstraction** — are query/mutation hooks centralised in any directory, or always inline in components?
7. **Booking form draft/preview backend support** — does the server support draft URLs (`/online-booking/:tempUuid?draft=true`) or is the live preview strictly a static mockup?
8. **Monorepo release-train coupling** — `web-app` + `server` share v35.17.0; `notification-service` + `public-api` share v35.16.2. Is this intentional release-train policy?
9. **Frontend conventions doc completeness** — `packages/web-app/AGENTS.md` has been read fully; subdirectories may have additional `CONVENTIONS.md` we haven't located.
10. **`packages/server/AGENTS.md`** (if it exists) — backend-specific conventions might affect any Step 4 cookbook entry that involves API calls.
11. **Shared component coverage of admin surface area** — agents sampled `Main/Settings` and `OnlineBookingNew`; deeper admin features (Calendar, Patients, Reports, Invoices) not sampled. Step 4 cookbook will need to grep these for pattern-density.
12. **`tsconfig.build.json` differences** from `tsconfig.json` — the build config was referenced but not read. Likely stricter rules for build-time.
13. **Test utility setup** — `test-utils/vitest.setup.ts` contents not read. Test conventions documented in AGENTS.md but actual setup not inspected.
14. **`lambda-pdf-playwright` package** — referenced in `UPGRADE-GUIDE.md` but not present as a directory. Status unknown.
