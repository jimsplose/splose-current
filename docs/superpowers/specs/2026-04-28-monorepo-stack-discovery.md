# Step 1 — Monorepo frontend stack discovery

**Status:** Active
**Filed:** 2026-04-28
**Tracking issue:** [#25](https://github.com/jimsplose/splose-current/issues/25) (umbrella)
**Parent spec:** `2026-04-28-monorepo-alignment-roadmap.md`
**Successor spec:** Step 2 stack alignment design (filed after this step's output exists)

## Goal

Produce `docs/monorepo-frontend-stack.md` — a single canonical reference describing the production splose-monorepo frontend stack, in enough depth to inform Step 2 alignment decisions without further read-only exploration.

**No prototype changes.** This step is pure discovery.

## Constraints

- **Read-only access** to `sploseans/splose-monorepo`. All reads via `gh api repos/sploseans/splose-monorepo/contents/<path>` or `gh api repos/sploseans/splose-monorepo/git/trees/<sha>`.
- **No clone, no checkout** in this step. (Cloning is reserved for Step 4 cookbook work where pattern-density grep is needed — per Q4 hybrid strategy.)
- **Hybrid C path**: surgical reads only. Target ~50–100 file reads total across the whole step.

## Audience

The next-session author of the Step 2 alignment-decision spec. They will read this doc and answer: "for each alignment lever, what are the options and which should we pick?" If they cannot answer that from this doc alone, this step has failed.

## Deep-analysis scope (per Jim, 2026-04-28)

1. **Admin app** powering `acme.splose.com` (likely `packages/app` or similar — confirmed during topology pass).
2. **Online Bookings 2.0 configuration** UI inside the admin app.
3. **Live preview** of the booking form embedded inside the admin app.
4. **End-user booking form pages** (the public-facing booking experience — likely a separate package).

The live-preview integration is its own dedicated section, even though it spans both the admin and booking apps.

## Output structure: `docs/monorepo-frontend-stack.md`

### 1. Executive summary

One paragraph. The 30-second "this is what the monorepo frontend is" — primary tools, primary frameworks, primary apps.

### 2. Repo topology

- Workspace tooling (pnpm workspaces + Turborepo confirmed).
- Full `packages/` enumeration with one-line purpose per package.
- In-scope-for-deep-analysis flag (yes/no) on each package, with reasoning.
- Deployment URL where known.
- Reference to monorepo's own `CLAUDE.md` / `AGENTS.md` / `UPGRADE-GUIDE.md` — summarise key facts for the splose-current author.

### 3. In-scope app sections

One section per:
- Admin app
- Public booking form
- (Live preview gets its own dedicated section in §6, not here.)

Each section contains the subsections below (§4).

### 4. Per-app subsection template

For each in-scope app, populate every concern. **Each concern records: what + consistency + 5–10 representative paths + qualitative health (1–2 sentences).**

| Concern | What to capture |
|---|---|
| **Build & runtime** | React version, build tool (Vite/Webpack/Next/etc.), TS config highlights, Node version, framework |
| **Styling** | Approach(es), consistency, mix of techniques |
| **Component library / internal DS** | External lib (MUI/AntD/Chakra/Radix/etc.), internal shared components, wrapping patterns |
| **State management** | Redux/Zustand/Context/RTK/etc., consistency |
| **Data fetching** | TanStack Query / RTK Query / SWR / fetch / Apollo / mix |
| **Forms** | Form library (RHF / Formik / native / custom), validation approach |
| **Tables / lists** | Table library, recurring table patterns, virtualization |
| **Routing** | Approach, layout primitives |
| **Tests** | Stack (vitest/jest/playwright/etc.), coverage signal |

### 5. Cross-cutting concerns

- Shared packages / internal libs (paths and one-line purpose).
- Token system (CSS vars / theme files / hardcoded / nothing).
- Lint/format config (eslint flat config confirmed; record rules of note).
- Monorepo-wide conventions extracted from `CLAUDE.md`/`AGENTS.md`.

### 6. Live preview integration deep-dive

Separate section. Answer:

- **Embedding mechanism**: iframe / shared React tree / script embed / micro-frontend / other.
- **Component-sharing model**: do admin and booking form share components? Through what package/path?
- **Communication**: how does the admin push config changes into the preview?
- **What splose-current would need to replicate** if we wanted the same behaviour.

### 7. Implications for splose-current alignment

Observations only — **not decisions**. Format: "If we wanted to match X, we'd need Y." Examples:

- "If we wanted to match their styling: switch from CSS Modules to <X>; estimated impact: <N> files; biggest risk: <thing>."
- "If we wanted to match their component library base: replace AntD wrapping with <X> wrapping; estimated impact: ..."

This section directly feeds Step 2.

### 8. Open questions

Things read-only access cannot answer. Honest list. Examples:

- Decisions made in Slack / docs we can't see.
- Runtime behaviour we can't observe without a deploy.
- Internal package boundaries that aren't clear from code alone.

## Approach: subagent-orchestrated discovery

Parent session does the topology pass (reads monorepo's own AI/onboarding docs, enumerates packages, identifies in-scope apps). Then dispatches **8 Explore subagents in parallel**, each with a tight remit. Parent synthesises fragments into the final doc.

### Why subagents

- Concerns are independent (styling discovery doesn't depend on state-mgmt discovery).
- `gh api` calls are stateless and parallelizable.
- Per-concern fragments are auditable independently before synthesis.
- Keeps parent context lean.

### Subagent dispatch plan

| # | Agent | Remit | Scope |
|---|---|---|---|
| 0 | **Topology** (parent does this directly first) | Enumerate `packages/`, classify each, identify in-scope apps. Read monorepo's `CLAUDE.md`/`AGENTS.md`/`UPGRADE-GUIDE.md`/`turbo.json`/`pnpm-workspace.yaml`/root `package.json`. | Whole repo |
| 1 | Build & runtime | React version, build tool, TS config, Node version, framework | In-scope apps only |
| 2 | Styling | Approach, consistency (count files per technique), 5–10 paths, health | In-scope apps only |
| 3 | Components | Internal DS / shared component packages, external lib usage, wrapping patterns | In-scope apps + shared packages |
| 4 | State & data | State mgmt, data fetching, query layer | In-scope apps only |
| 5 | Forms & tables | Form lib, table lib, recurring patterns | In-scope apps only |
| 6 | Routing & layout | Routing approach, layout primitives, page composition | In-scope apps only |
| 7 | Live preview | Embedding mechanism, component-sharing model, communication. Read source for any preview component | Spans admin + booking |
| 8 | Cross-cutting | Tokens, lint/format, shared packages | Whole repo |

Each subagent receives:

- Repo coordinates (`sploseans/splose-monorepo`, default branch `main`).
- Read-only constraint and `gh api` exemplar commands.
- The §4 template for output formatting (what + consistency + paths + health).
- A token budget hint (target ~10–20 file reads per agent).
- Explicit instruction: cite paths, no speculation, flag open questions.

### Synthesis

Parent receives 8 fragments. Synthesises into the §1–§8 structure above. Resolves contradictions by re-reading source where needed. Produces `docs/monorepo-frontend-stack.md`.

## Acceptance criteria

- [ ] `docs/monorepo-frontend-stack.md` committed.
- [ ] All 8 sections populated.
- [ ] Each concern in §4 has: **what** + **consistency** + **5–10 representative paths** + **qualitative health note**.
- [ ] §6 (live preview) answers all four questions: mechanism, sharing model, communication, replication needs.
- [ ] §7 (alignment implications) lists at least one observation per major lever (React version, styling, components, state, build).
- [ ] §8 (open questions) is non-empty — proves we acknowledged read-only limits honestly.
- [ ] Total file reads ≤ 150 (cap to enforce hybrid-C surgical discipline).
- [ ] No prototype code changed.

## Out of scope for Step 1

- Cloning the monorepo. (Reserved for Step 4 if needed.)
- Any decisions about what splose-current should change. (Step 2.)
- Pattern-density counts (e.g. "324 inline `<div style={{}}>` patterns"). (Step 4.)
- Authentication-required exploration of running services. (Out of scope entirely — read-only GitHub only.)

## Open questions to resolve before execution

None — design is ready to plan. Implementation plan will be written by the writing-plans skill after Jim approves this spec.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Subagent fragments contradict each other | Synthesis step re-reads source on conflicts; flag unresolvable conflicts in §8 |
| File-read budget blown by deep nested traversal | Per-agent ~10–20 read budget; parent monitors |
| In-scope app misidentified during topology pass | Topology agent must cite reasoning for each in-scope flag; Jim reviews before deep-analysis dispatch |
| Live-preview architecture not documented in code | Agent 7 flags as open question rather than guess |
| Monorepo's CLAUDE.md/AGENTS.md is stale/aspirational | Cross-check claims against actual code before treating as fact |
