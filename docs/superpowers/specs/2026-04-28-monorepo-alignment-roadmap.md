# Monorepo alignment roadmap — umbrella spec

**Status:** Active
**Filed:** 2026-04-28
**Tracking issue:** [#25](https://github.com/jimsplose/splose-current/issues/25)
**Owner:** Jim
**Successor specs:** Step 1 spec — `2026-04-28-monorepo-stack-discovery.md`

## Goal

Prepare splose-current as a **proof-of-concept that engineers in the production splose-monorepo can adopt** when:

1. Replacing junk inline patterns with proper DS components (cleanup work).
2. Building new features against clean, well-documented components (greenfield work).

Today there is no formal mapping between splose-current's DS and the monorepo. Engineers cannot easily go from "I have this gnarly DataTable variant in monorepo file X" to "use this DS component with these props." This roadmap closes that gap.

## Constraints

- **Read-only GitHub access** to `sploseans/splose-monorepo`. All exploration via `gh` CLI / `gh api`. No PRs, no commits, no branches in that repo. All outputs land in splose-current.
- **Visual fidelity preserved**: any prototype changes (Step 3) must keep splose-current matching `acme.splose.com` per `docs/quality-gate.md`.
- **No premature commitment**: each step's spec is written *after* the prior step's output exists. Pre-speccing on guesses is forbidden.

## Audience and engineer flow

A monorepo engineer in cleanup or greenfield work consumes the deliverable through a **mix of (A) Storybook visual+code reference and (C) side-by-side mapping doc** (Jim's call, 2026-04-28). They:

1. Open the cookbook doc, find the pattern they're replacing or building.
2. Click through to the matching Storybook story.
3. Copy/translate props and structure into their monorepo PR.

## Five-step decomposition

Each step is its own sub-spec and its own GitHub issue (or set of issues for Step 3). This umbrella stays open across all 5.

### Step 1 — Monorepo frontend stack discovery (prerequisite)

Read-only exploration. Output: `docs/monorepo-frontend-stack.md` — canonical reference covering repo topology, per-app stacks (admin app, public booking form, live preview integration), styling, components, state, data, forms, tables, routing, tests, cross-cutting concerns, live-preview deep-dive, alignment implications, open questions.

**No prototype changes.** Spec: `2026-04-28-monorepo-stack-discovery.md`.

### Step 2 — Stack alignment decision

Decide what splose-current changes to match the monorepo. Each alignment lever is named, options enumerated, and Jim picks. Likely levers (informed by Step 1):

- React version (19 → 18 if monorepo demands it).
- Styling approach (CSS Modules → monorepo's choice).
- Component library base (AntD wrapping → monorepo's library wrapping, if different).
- Token system.
- Build tooling, TS config, lint config.

**Output:** `docs/superpowers/specs/YYYY-MM-DD-stack-alignment-design.md` — decision doc.

### Step 3 — Stack alignment execution

Execute Step 2 decisions. Likely **multiple sub-issues** (one per alignment lever) rather than one big bang. Each lever requires Chrome MCP regression evidence — visual fidelity to `acme.splose.com` must be preserved per `docs/quality-gate.md`.

**Output:** splose-current running on the aligned stack with Storybook + Chrome MCP regression evidence intact.

### Step 4 — Pattern mapping ("junk → DS" cookbook)

Survey monorepo for recurring inline patterns. Each gets:

- Pattern signature (grep-able description).
- Occurrence count + 2–3 representative call sites in monorepo.
- Target DS component + props recipe.
- Storybook story demonstrating the target shape.
- Migration notes (caveats, behavioural differences, accessibility wins).

This will surface DS gaps — patterns the monorepo uses that splose-current doesn't yet have. Those become DS-component-add issues. Already partially anticipated by [#23](https://github.com/jimsplose/splose-current/issues/23) (component coverage audit).

**Output:** `docs/monorepo-migration-cookbook.md` + matching Storybook stories.

### Step 5 — Engineer-facing polish

Make the deliverable consumable:

- Storybook hosted somewhere monorepo engineers can reach.
- Storybook MCP enabled (Storybook 10.3+, React renderer — works on React 18).
- Welcome page framing it as the POC reference.
- Cookbook cross-linked from Storybook stories.
- Optional: Loom/written intro for monorepo team.

**Output:** Storybook + cookbook published, accessible, intro'd.

## Preliminary findings (validated before brainstorming)

- **Storybook + React 18 + MCP**: compatible. Storybook 9 supports React 18 fully. Storybook MCP requires Storybook 10.3+ with the React renderer but does **not** require React 19. Conclusion: downgrading splose-current React 19 → 18 (if monorepo demands it) costs us nothing and unlocks the official Storybook MCP server.
  - [Storybook MCP for React](https://storybook.js.org/blog/storybook-mcp-for-react/)
  - [MCP server docs](https://storybook.js.org/docs/ai/mcp/overview)

- **Monorepo confirmed up-front (`gh api repos/sploseans/splose-monorepo`):**
  - pnpm workspaces (`pnpm-workspace.yaml`) + Turborepo (`turbo.json`).
  - Single `packages/` directory.
  - Microservices visible from Dockerfiles: ai-note-embeddings, ai-voice-to-text, app, notification, public-api.
  - ESLint flat config; `.nvmrc` for Node version.
  - Repo has its own `CLAUDE.md`, `AGENTS.md`, `UPGRADE-GUIDE.md` — high-signal AI/onboarding context, must be read first in Step 1.
  - Read-only access confirmed: `pull: true, push: false`.

## Deep-analysis scope (per Jim, 2026-04-28)

Step 1's deep analysis must include:

1. The admin app powering `acme.splose.com` (likely `packages/app` or similar).
2. **Online Bookings 2.0 configuration** UI inside the admin app.
3. **Live preview** of the booking form embedded inside the admin app.
4. **End-user booking form pages** (the public-facing booking experience — likely a separate package/app).

The live-preview integration is its own deep-dive section because the answer (iframe? shared React tree? script embed? micro-frontend?) tells us how the monorepo handles cross-app component sharing — directly informs Step 2 alignment decisions.

## Decomposition rule

**Each step gets its own spec and its own GitHub issue when we're ready to start it.** Do not pre-spec steps 2–5 before Step 1's discovery output exists — premature decisions become guesses. Step 1's findings may even change the decomposition (e.g., if the monorepo has a usable design system already, "pattern mapping" might become "DS adoption guide" instead).

## Acceptance

The umbrella issue ([#25](https://github.com/jimsplose/splose-current/issues/25)) closes when all 5 steps are done. Each step has its own acceptance criteria in its own spec.
