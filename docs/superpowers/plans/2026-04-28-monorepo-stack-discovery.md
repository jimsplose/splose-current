# Monorepo Stack Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `docs/monorepo-frontend-stack.md` — a single canonical reference describing the production splose-monorepo frontend stack — via read-only `gh api` exploration, ≤150 file reads total, no clone, no prototype changes.

**Architecture:** Parent session does the topology pass directly (reads the monorepo's own AI/onboarding docs, enumerates `packages/`, identifies in-scope apps). Then dispatches **8 Explore subagents in parallel**, each with a tight per-concern remit. Parent synthesises fragments into the final doc. Fragments persist in `.superpowers/discovery/2026-04-28-stack/` (untracked) for audit.

**Tech Stack:** `gh` CLI, `gh api` for read-only GitHub access. No code changes; deliverable is a markdown doc plus intermediate fragment files.

**Spec:** `docs/superpowers/specs/2026-04-28-monorepo-stack-discovery.md`
**Tracking issue:** [#26](https://github.com/jimsplose/splose-current/issues/26)
**Umbrella:** [#25](https://github.com/jimsplose/splose-current/issues/25)

---

## File structure

| Path | Type | Purpose |
|---|---|---|
| `.superpowers/discovery/2026-04-28-stack/topology.md` | Create (intermediate, untracked) | Parent's topology fragment — package inventory, in-scope flags, monorepo-doc summary |
| `.superpowers/discovery/2026-04-28-stack/agent-1-build-runtime.md` | Create (intermediate, untracked) | Subagent 1 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-2-styling.md` | Create (intermediate, untracked) | Subagent 2 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-3-components.md` | Create (intermediate, untracked) | Subagent 3 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-4-state-data.md` | Create (intermediate, untracked) | Subagent 4 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-5-forms-tables.md` | Create (intermediate, untracked) | Subagent 5 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-6-routing-layout.md` | Create (intermediate, untracked) | Subagent 6 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-7-live-preview.md` | Create (intermediate, untracked) | Subagent 7 fragment |
| `.superpowers/discovery/2026-04-28-stack/agent-8-cross-cutting.md` | Create (intermediate, untracked) | Subagent 8 fragment |
| `.superpowers/discovery/2026-04-28-stack/read-budget.txt` | Create (intermediate, untracked) | Running tally of file reads (target ≤150) |
| `docs/monorepo-frontend-stack.md` | Create (committed) | Final synthesised reference doc |

---

## Task 1: Topology pass (parent only, no subagent)

**Files:**
- Create: `.superpowers/discovery/2026-04-28-stack/topology.md`
- Create: `.superpowers/discovery/2026-04-28-stack/read-budget.txt`

- [ ] **Step 1: Verify access and create working directory**

```bash
gh api repos/sploseans/splose-monorepo --jq '.permissions' && \
mkdir -p .superpowers/discovery/2026-04-28-stack && \
echo "0" > .superpowers/discovery/2026-04-28-stack/read-budget.txt
```

Expected: `{"admin":false,"maintain":false,"pull":true,...}` and directory created.

- [ ] **Step 2: Read monorepo onboarding/AI docs**

Read these three files via `gh api`. Each is one read against the budget.

```bash
gh api repos/sploseans/splose-monorepo/contents/CLAUDE.md --jq '.content' | base64 -d > /tmp/monorepo-CLAUDE.md
gh api repos/sploseans/splose-monorepo/contents/AGENTS.md --jq '.content' | base64 -d > /tmp/monorepo-AGENTS.md
gh api repos/sploseans/splose-monorepo/contents/UPGRADE-GUIDE.md --jq '.content' | base64 -d > /tmp/monorepo-UPGRADE-GUIDE.md
```

Use the Read tool to read each of the three /tmp files. **Increment read-budget.txt by 3.**

- [ ] **Step 3: Read root config files**

```bash
gh api repos/sploseans/splose-monorepo/contents/package.json --jq '.content' | base64 -d > /tmp/monorepo-root-package.json
gh api repos/sploseans/splose-monorepo/contents/pnpm-workspace.yaml --jq '.content' | base64 -d > /tmp/monorepo-pnpm-workspace.yaml
gh api repos/sploseans/splose-monorepo/contents/turbo.json --jq '.content' | base64 -d > /tmp/monorepo-turbo.json
gh api repos/sploseans/splose-monorepo/contents/.nvmrc --jq '.content' | base64 -d > /tmp/monorepo-nvmrc
gh api repos/sploseans/splose-monorepo/contents/eslint.config.mjs --jq '.content' | base64 -d > /tmp/monorepo-eslint.config.mjs
gh api repos/sploseans/splose-monorepo/contents/tsconfig.json --jq '.content' 2>/dev/null | base64 -d > /tmp/monorepo-tsconfig.json || echo "no root tsconfig"
```

Read each. **Increment read-budget.txt by 6.**

- [ ] **Step 4: Enumerate `packages/` directory**

```bash
gh api repos/sploseans/splose-monorepo/contents/packages --jq '.[] | "\(.type)\t\(.name)"'
```

This is one API call (does not count against the per-file budget — it's a directory listing). Capture the output.

- [ ] **Step 5: Read each package's `package.json` to identify purpose and stack**

For each package directory returned in Step 4:

```bash
gh api repos/sploseans/splose-monorepo/contents/packages/<NAME>/package.json --jq '.content' | base64 -d
```

**Increment read-budget.txt by N (where N = number of packages).** Do not exceed 30 packages — if more exist, sample top 30 alphabetically.

- [ ] **Step 6: Write topology fragment**

Create `.superpowers/discovery/2026-04-28-stack/topology.md` with this structure:

```markdown
# Topology fragment

## Monorepo onboarding docs (key facts)

- Source: `CLAUDE.md` — [3-5 bullet points of the most relevant facts for splose-current alignment]
- Source: `AGENTS.md` — [3-5 bullets]
- Source: `UPGRADE-GUIDE.md` — [3-5 bullets]

## Workspace tooling

- pnpm workspaces — packages globs: [from pnpm-workspace.yaml]
- Turborepo — pipeline summary: [from turbo.json]
- Node version: [from .nvmrc]
- TypeScript: [from root tsconfig.json if present]
- ESLint: [flat config, key rules of note]

## Package inventory

| Package | Path | One-line purpose | In-scope? | Reasoning |
|---|---|---|---|---|
| <name> | packages/<name> | <purpose from package.json> | yes/no | <why> |

## In-scope apps for deep analysis

Confirmed in-scope per Jim (2026-04-28):

1. **Admin app** (acme.splose.com) — package: `packages/<X>` — reasoning: [...]
2. **Public booking form** — package: `packages/<Y>` — reasoning: [...]

Live preview integration spans both — covered by Agent 7.

## Open questions from topology pass

- [...]
```

- [ ] **Step 7: Verify in-scope identification with Jim**

Pause and ask Jim: "Topology pass identified `packages/<X>` as the admin app and `packages/<Y>` as the public booking form. Confirm before I dispatch the 8 subagents?" Wait for approval.

If Jim corrects the identification, update `topology.md` accordingly before continuing.

- [ ] **Step 8: Commit topology fragment progress to issue**

Update [#26](https://github.com/jimsplose/splose-current/issues/26) with a session progress comment:

```bash
gh issue comment 26 --body "## Session $(date +%Y-%m-%d) — topology pass complete

**Confirmed:**
- In-scope admin app: \`packages/<X>\`
- In-scope public booking form: \`packages/<Y>\`
- Reads consumed: $(cat .superpowers/discovery/2026-04-28-stack/read-budget.txt) / 150

Next: dispatch 8 Explore subagents in parallel."
```

---

## Task 2: Dispatch 8 Explore subagents in parallel

**Files:**
- Create (each subagent writes one): `.superpowers/discovery/2026-04-28-stack/agent-{1..8}-*.md`

**Critical constraint:** All 8 Agent calls **must be issued in a single message** so they run in parallel. Single-message dispatch is the only thing that achieves true parallelism.

- [ ] **Step 1: Prepare the shared subagent prompt scaffold**

Every agent prompt starts with this block (substitute concern-specific sections after):

```
You are dispatched as a discovery subagent for splose-current's monorepo stack discovery (Step 1 of the alignment roadmap).

REPO: sploseans/splose-monorepo (default branch: main)
ACCESS: read-only via `gh api` and `gh api repos/sploseans/splose-monorepo/contents/<path>`
DO NOT clone, do not checkout, do not create PRs/branches.

IN-SCOPE APPS (from parent's topology pass):
- Admin app: packages/<X>
- Public booking form: packages/<Y>

YOUR REMIT: <concern-specific>

YOUR FILE-READ BUDGET: 10–20 reads. Hard cap: 25.

OUTPUT: Return a single markdown fragment matching this template:

  ## <Concern name>

  ### <Sub-concern A>
  - **What:** <plain description>
  - **Consistency:** <evidence — counts, ratios, or "applied uniformly" / "mixed">
  - **Representative paths (5–10):**
    - `packages/X/path/to/file.ts` — <one-line note on what it shows>
    - ...
  - **Qualitative health:** <1–2 sentences>

  ### <Sub-concern B>
  ... (same template)

  ## Open questions
  - <any read-only-access blind spots>

RULES:
1. Cite paths, no speculation. If you don't know, say so in Open questions.
2. Re-use any reads the parent already did — don't re-fetch CLAUDE.md/AGENTS.md/root configs.
3. Prefer directory listings over file reads to map structure cheaply: `gh api repos/sploseans/splose-monorepo/contents/<path>`
4. Return your full fragment as your final message; do not write files yourself.
```

- [ ] **Step 2: Compose the 8 concern-specific remits**

| Agent | Concern | Sub-concerns to cover |
|---|---|---|
| 1 | Build & runtime | React version, build tool (Vite/Webpack/Next/Remix/etc.), TS config highlights, framework, dev/build scripts |
| 2 | Styling | Approach(es), consistency (count files per technique where feasible), token use, theme files, mix of techniques |
| 3 | Components | Internal DS / shared component packages, external lib (MUI/AntD/Chakra/Radix/shadcn/headless/etc.), wrapping patterns, where shared components live |
| 4 | State & data | State mgmt (Redux/Zustand/Context/RTK/Jotai/etc.), data fetching (TanStack Query / RTK Query / SWR / Apollo / fetch), caching, server-state vs client-state split |
| 5 | Forms & tables | Form library (RHF / Formik / native / custom hooks), validation (Zod/Yup/etc.), table library (TanStack Table / MUI DataGrid / AntD Table / custom), recurring patterns |
| 6 | Routing & layout | Router (React Router / TanStack Router / Next.js / Remix / file-based / etc.), layout primitives (AppShell / Layout components), page composition, code splitting |
| 7 | Live preview | Embedding mechanism (iframe / shared React tree / script / micro-frontend), component-sharing model, how admin pushes config changes into preview, what splose-current would need to replicate. **Read source for any preview component in admin app and any matching component in booking app.** |
| 8 | Cross-cutting | Tokens (CSS vars / theme files / hardcoded), lint/format conventions, shared packages summary, monorepo-wide conventions extracted from `CLAUDE.md`/`AGENTS.md` |

- [ ] **Step 3: Dispatch all 8 agents in a single message**

Issue 8 `Agent` tool calls in **one message** with `subagent_type: "Explore"`. Use `description: "Stack discovery — <concern>"`. Set thoroughness to "medium" for all (matches the 10–20 read budget).

For each agent, the `prompt` is the scaffold from Step 1 + the concern-specific remit from the table in Step 2 + a final line: "Begin."

**Verification:** All 8 agents return a markdown fragment as their final message. If any agent's response is incomplete (missing sub-concerns, missing paths, no Open questions section), capture which agent and proceed to Step 4.

- [ ] **Step 4: Write each agent's fragment to disk**

For each of the 8 agents, write their returned fragment to:

```
.superpowers/discovery/2026-04-28-stack/agent-1-build-runtime.md
.superpowers/discovery/2026-04-28-stack/agent-2-styling.md
.superpowers/discovery/2026-04-28-stack/agent-3-components.md
.superpowers/discovery/2026-04-28-stack/agent-4-state-data.md
.superpowers/discovery/2026-04-28-stack/agent-5-forms-tables.md
.superpowers/discovery/2026-04-28-stack/agent-6-routing-layout.md
.superpowers/discovery/2026-04-28-stack/agent-7-live-preview.md
.superpowers/discovery/2026-04-28-stack/agent-8-cross-cutting.md
```

- [ ] **Step 5: Update read budget**

Each agent reports its read count in its final message. Sum them and add to `.superpowers/discovery/2026-04-28-stack/read-budget.txt`.

```bash
echo "<new total>" > .superpowers/discovery/2026-04-28-stack/read-budget.txt
```

If total exceeds 150, **stop** and ask Jim before proceeding to Task 3 — over-budget means the spec's hard cap was breached and we need to decide whether to trim or accept.

- [ ] **Step 6: Audit fragments — verify each meets the §4 template**

For each fragment, check:
- All sub-concerns from the agent's remit are present.
- Each sub-concern has: What + Consistency + 5–10 paths + Qualitative health.
- "Open questions" section exists (may be empty bullet list, but section heading must be there).

If any fragment is incomplete, **re-dispatch only that agent** with explicit feedback on what's missing. Repeat until all 8 fragments pass audit.

---

## Task 3: Synthesise §1 (Executive summary) and §2 (Repo topology)

**Files:**
- Create: `docs/monorepo-frontend-stack.md`

- [ ] **Step 1: Open the synthesis file**

Create `docs/monorepo-frontend-stack.md` with this skeleton:

```markdown
# Monorepo frontend stack

> Read-only discovery output for the splose-current → splose-monorepo alignment roadmap.
> Spec: `docs/superpowers/specs/2026-04-28-monorepo-stack-discovery.md`.
> Source repo: [`sploseans/splose-monorepo`](https://github.com/sploseans/splose-monorepo) (default branch: `main`).
> Total file reads consumed: <N> / 150.

## 1. Executive summary

[1 paragraph — to be filled in this task]

## 2. Repo topology

[To be filled in this task]

## 3. In-scope app sections

[Filled in Task 4]

## 4. Per-app subsections

[Filled in Task 4]

## 5. Cross-cutting concerns

[Filled in Task 5]

## 6. Live preview integration deep-dive

[Filled in Task 5]

## 7. Implications for splose-current alignment

[Filled in Task 6]

## 8. Open questions

[Filled in Task 6]
```

- [ ] **Step 2: Write §1 Executive summary**

One paragraph (3–5 sentences). Pull from `topology.md` and the highest-level findings from the 8 fragments. Cover: workspace tool, primary frontend framework(s), primary styling approach, primary component library base, what apps are in scope.

- [ ] **Step 3: Write §2 Repo topology**

From `topology.md`, port:
- Workspace tooling block
- Package inventory table (with in-scope flags + reasoning)
- Brief summary of monorepo's own onboarding docs (CLAUDE.md / AGENTS.md / UPGRADE-GUIDE.md key facts)

- [ ] **Step 4: Commit progress**

```bash
git add docs/monorepo-frontend-stack.md
git commit -m "$(cat <<'EOF'
docs(issue-26): monorepo-frontend-stack §1-§2 — exec summary + topology

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Synthesise §3 (in-scope app sections) and §4 (per-app subsections)

**Files:**
- Modify: `docs/monorepo-frontend-stack.md`

- [ ] **Step 1: Write §3 In-scope app sections — admin app subsection header**

Add to `docs/monorepo-frontend-stack.md`:

```markdown
### 3.1 Admin app — `packages/<X>` (acme.splose.com)

[One-paragraph overview of what this package is, role in the monorepo, deployment URL.]

#### Build & runtime
[from agent-1, admin-app slice]

#### Styling
[from agent-2, admin-app slice]

#### Components
[from agent-3, admin-app slice]

#### State management
[from agent-4 state slice, admin-app]

#### Data fetching
[from agent-4 data slice, admin-app]

#### Forms
[from agent-5 forms slice, admin-app]

#### Tables / lists
[from agent-5 tables slice, admin-app]

#### Routing
[from agent-6 routing slice, admin-app]

#### Layout primitives
[from agent-6 layout slice, admin-app]

#### Tests
[from agent-1 tests slice, admin-app — if covered; if not, add to §8 Open questions]
```

For each subsection, port the matching fragment content. Preserve all paths and qualitative health notes verbatim.

- [ ] **Step 2: Write §3 In-scope app sections — public booking form subsection header**

Repeat the structure from Step 1 for `### 3.2 Public booking form — packages/<Y>`.

- [ ] **Step 3: Verify §4 template is satisfied**

For each subsection in §3.1 and §3.2, confirm:
- **What** field is present and concrete (not "uses styling" — actual approach named).
- **Consistency** field has a count, ratio, or qualitative descriptor.
- **5–10 representative paths** are listed (cite from fragments).
- **Qualitative health** is 1–2 sentences with a clear judgement.

If any subsection fails the check, re-read the source fragment and fix in place.

- [ ] **Step 4: Commit progress**

```bash
git add docs/monorepo-frontend-stack.md
git commit -m "$(cat <<'EOF'
docs(issue-26): monorepo-frontend-stack §3-§4 — admin + booking subsections

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Synthesise §5 (cross-cutting) and §6 (live preview deep-dive)

**Files:**
- Modify: `docs/monorepo-frontend-stack.md`

- [ ] **Step 1: Write §5 Cross-cutting concerns**

Port from `agent-8-cross-cutting.md`:
- Shared packages list (paths + one-line purpose).
- Token system (CSS vars / theme files / hardcoded / nothing).
- Lint/format config rules of note.
- Monorepo-wide conventions extracted from CLAUDE.md / AGENTS.md.

Format as subsections with the same template (What + Consistency + paths + health).

- [ ] **Step 2: Write §6 Live preview integration deep-dive**

Port from `agent-7-live-preview.md`. Required structure:

```markdown
## 6. Live preview integration deep-dive

### Embedding mechanism

[iframe / shared React tree / script embed / micro-frontend / other — with cited paths]

### Component-sharing model

[Do admin and booking app share components? Through what package/path?]

### Communication

[How does the admin push config changes into the preview? (postMessage? shared store? URL params?)]

### Replication needs for splose-current

[What splose-current would need to do/add to support an equivalent live preview. Observations only — actual decision deferred to Step 2.]
```

If `agent-7-live-preview.md` lacks any of these four answers, escalate it to §8 Open questions instead of speculating.

- [ ] **Step 3: Commit progress**

```bash
git add docs/monorepo-frontend-stack.md
git commit -m "$(cat <<'EOF'
docs(issue-26): monorepo-frontend-stack §5-§6 — cross-cutting + live preview

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Synthesise §7 (alignment implications) and §8 (open questions)

**Files:**
- Modify: `docs/monorepo-frontend-stack.md`

- [ ] **Step 1: Write §7 Implications for splose-current alignment**

Read all 8 fragments + topology. For each major lever where splose-current and monorepo differ, write one observation entry. Required levers (from spec):
- React version
- Styling
- Components
- State
- Build

Format:

```markdown
### 7.N <Lever>

- **splose-current today:** <X>
- **monorepo today:** <Y>
- **If we wanted to match:** <Z — concrete steps, observation only>
- **Estimated impact:** <files / packages affected — best guess>
- **Biggest risk:** <one thing>
```

**This section is observations, not decisions.** Step 2 spec captures decisions.

- [ ] **Step 2: Write §8 Open questions**

Aggregate "Open questions" from all 8 fragments + topology. Deduplicate. Group by theme if useful. Must be non-empty (proves we acknowledged read-only limits honestly).

Format:

```markdown
## 8. Open questions

Read-only access cannot answer:

- [Question 1] — would need: [Slack search / runtime observation / internal doc / etc.]
- [Question 2] — ...
```

- [ ] **Step 3: Update §1 reads-consumed counter**

```bash
TOTAL=$(cat .superpowers/discovery/2026-04-28-stack/read-budget.txt)
```

In `docs/monorepo-frontend-stack.md`, replace `<N> / 150` in the header with `$TOTAL / 150`.

- [ ] **Step 4: Commit progress**

```bash
git add docs/monorepo-frontend-stack.md
git commit -m "$(cat <<'EOF'
docs(issue-26): monorepo-frontend-stack §7-§8 — implications + open questions

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Acceptance check

**Files:**
- Read: `docs/monorepo-frontend-stack.md`
- Read: `docs/superpowers/specs/2026-04-28-monorepo-stack-discovery.md`

- [ ] **Step 1: Walk acceptance criteria from the spec**

Open the spec's "Acceptance criteria" section. For each checkbox, verify in the synthesised doc:

- [ ] All 8 sections populated (no empty bodies).
- [ ] Each concern in §4 has: what + consistency + 5–10 representative paths + qualitative health note.
- [ ] §6 (live preview) answers all four questions: mechanism, sharing model, communication, replication needs.
- [ ] §7 (alignment implications) lists at least one observation per major lever (React version, styling, components, state, build).
- [ ] §8 (open questions) is non-empty.
- [ ] Total file reads ≤ 150 (check `read-budget.txt`).
- [ ] No prototype code changed (run `git diff main -- src/ docs/ds-plans/ docs/ds-plans-wave5/` — should be empty for src/).

If any check fails, return to the appropriate task to fix.

- [ ] **Step 2: Report acceptance status**

If all acceptance criteria pass, proceed to Task 8.

If any fail, document the gaps in `.superpowers/discovery/2026-04-28-stack/acceptance-gaps.md` and return to the appropriate task to fix. Re-run Step 1 after fixes.

---

## Task 8: Close out

**Files:**
- Update: GitHub issue #26 progress log + close
- Update: GitHub issue #25 (umbrella) progress log

- [ ] **Step 1: Run final TypeScript check**

```bash
npx tsc --noEmit
```

Expected: clean, no new errors. (This step is precautionary — Step 1 changes no source code, so any TS error is a sign something unintended happened.)

- [ ] **Step 2: Update issue #26 with completion comment**

```bash
gh issue comment 26 --body "$(cat <<EOF
## Session $(date +%Y-%m-%d) — Step 1 complete

**Completed:**
- Topology pass: in-scope apps confirmed.
- 8 Explore subagents dispatched in parallel; all fragments audited and synthesised.
- \`docs/monorepo-frontend-stack.md\` produced and committed.

**Reads consumed:** \$(cat .superpowers/discovery/2026-04-28-stack/read-budget.txt) / 150

**Acceptance criteria:** all met (verified against spec).

**Build status:** tsc ✓
EOF
)"
```

- [ ] **Step 3: Close issue #26**

```bash
gh issue close 26 --comment "All acceptance criteria met. Closed."
```

- [ ] **Step 4: Update umbrella issue #25**

```bash
gh issue comment 25 --body "$(cat <<EOF
## Step 1 closed ($(date +%Y-%m-%d))

Output: \`docs/monorepo-frontend-stack.md\`.

#27 (Step 2 alignment decisions) is now Ready. Next session: brainstorm alignment levers with Jim, write Step 2 spec.
EOF
)"
```

- [ ] **Step 5: Push**

```bash
git push
```

---

## Self-review

**Spec coverage check:**

Walking the spec's structure against the plan:

- §1 Executive summary → Task 3 Step 2 ✓
- §2 Repo topology → Task 1 (topology pass) + Task 3 Step 3 ✓
- §3 In-scope app sections → Task 4 Steps 1–2 ✓
- §4 Per-app subsections (build/styling/components/state/data/forms/tables/routing/tests) → Task 4 + agents 1, 2, 3, 4, 5, 6 ✓
- §5 Cross-cutting concerns → Task 5 Step 1 + agent 8 ✓
- §6 Live preview deep-dive → Task 5 Step 2 + agent 7 ✓
- §7 Alignment implications → Task 6 Step 1 ✓
- §8 Open questions → Task 6 Step 2 ✓

Spec acceptance criteria → Task 7 ✓
Subagent dispatch table → Task 2 Step 2 ✓
≤150 read cap → tracked in `read-budget.txt`, gate at Task 2 Step 5 + Task 7 ✓
No prototype code changed → verified at Task 7 Step 1 ✓

**Placeholder scan:** No "TBD" / "TODO" / "implement later" present. Bracketed `<X>` and `<Y>` placeholders refer to specific package paths the topology pass will discover — these are runtime values, not authoring placeholders.

**Type consistency:** N/A (no code; all references are file paths and section identifiers, all consistent across tasks).

**One known gap to flag for the executor:** the spec mentions "tests" as a per-app concern in §4, but no dedicated subagent covers tests. Agent 1 (build & runtime) is the natural place — Task 4 Step 1's "Tests" subsection notes "from agent-1 tests slice, admin-app — if covered; if not, add to §8 Open questions." This is correct behaviour: don't speculate, escalate gaps.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-28-monorepo-stack-discovery.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good fit because Task 2's parallel dispatch is already subagent-heavy and the synthesis tasks are short.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Good fit if you want a single coherent author voice through the synthesis.

Which approach?
