# Fidelity Improvement Workflow

Use **parallel subagents** for speed when working through fidelity gaps.

## Prerequisites — MANDATORY

**Chrome MCP:** Use for all screenshot capture and visual verification (navigate, interact, capture).

**Design specs:** Check `screenshots/specs/<page-name>.md` before working on a page. If none exists, extract one first per `docs/design-spec-workflow.md`. Skip only if the page has no reference screenshots.

**Design System:** All fidelity work MUST use DS components from `@/components/ds`. See `docs/agent-block.md` for the full component list. Run `npm run storybook` to preview.

**New DS components:** If a gap requires a missing component, create it in `src/components/ds/` first with a Storybook story. When the same inline pattern appears on 2+ pages, extract it into a DS component — this is higher priority than finishing more pages. After creating a component: add story, export from `index.ts`, update `CLAUDE.md` and `docs/agent-block.md`.

## Completion criteria

A gap is only `[x]` when ALL related catalog entries show Match = "yes". If any show "no" or "partial", the gap stays `[ ]` — note partial progress in the description.

## Step 1: Launch parallel agents (direct, no worktrees)

Group non-conflicting gaps and launch simultaneously. **Do NOT use `isolation: "worktree"`** (see CLAUDE.md for rationale).

**Every agent prompt MUST include:**
- The full Agent Block from `docs/agent-block.md` (between the `---START/END AGENT BLOCK---` markers)
- `You are working in /Users/jimyenckensplose/claude/splose-current. Edit files directly. Do NOT use worktrees.`

Each agent should:
1. Read the design spec (`screenshots/specs/<page-name>.md`) and reference screenshots
2. Read and edit the page source to match, using DS components and exact spec values
3. Ensure no TypeScript errors
4. Use **Chrome MCP** to capture a screenshot and compare against the reference — iterate until it matches

**Parallelization rules:**
- Different page directories → parallel safe
- Same file → sequential
- Database changes (`prisma/seed.ts`) → run alone, then verify affected pages
- General screenshot review agent → run last

## Step 2: Quality gate and commit

After each agent completes, run the **Post-Agent Quality Gate from `docs/quality-gate.md`** before committing.

**CWD safety check — MANDATORY:** Run `cd /Users/jimyenckensplose/claude/splose-current && pwd` before any post-agent work. If it returns a `.claude/worktrees/` path, `cd` to the real repo first.

For each agent: verify CWD → `git diff` → run Quality Gate (DS scan, TS check, screenshot verify) → commit or revert. If changes break the build, **revert and continue** with the next agent.

## Step 3: Screenshot verification (Chrome MCP)

Navigate to each changed page, capture a screenshot, and compare against `screenshots/reference/` and `splose-style-reference/`. Follow the Post-Push Visual Verification section in `docs/quality-gate.md`.

## Step 4: Update catalog Match status

For each changed page, compare Chrome MCP screenshots against ALL references and update `screenshots/screenshot-catalog.md` Match column ("yes" / "partial — <detail>" / "no"). Only mark the gap `[x]` if ALL entries show "yes". **This step is mandatory.**

## Enrichment Deepening Checklist

When a page is structurally complete but feels shallow, deepen it using these categories:

1. **Dropdown actions** — Wire existing dropdown menus to open modals, show toasts, or navigate (edit, delete, archive, duplicate)
2. **Sub-pages** — Add new/edit/view pages for entities that only have list views (e.g. `/contacts/new`, `/products/[id]/edit`)
3. **Modal enrichment** — Add realistic content to modals (form fields, previews, validation, character counts)
4. **Multi-step flows** — Complete incomplete journeys (e.g. import → mapping → preview → done)
5. **Interactive states** — Make static elements respond to clicks (expand/collapse, sort, filter, hover tooltips)
6. **Data enrichment** — Add realistic seed data variety (more rows, mixed statuses, diverse names/dates)

Use this checklist when fidelity gaps are closed but the prototype needs more depth to feel like a real app.

## Step 5: Update Dev Navigator registry

Verify `src/lib/state-registry.ts` is current: add entries for new pages/states, remove deleted ones, cross-check against `src/app/**/page.tsx`.

## Step 6: Build, commit, push

Run `npx next build` (never push broken code) → commit all changes → push to `claude/*` branch → note Vercel preview URL.

## Step 7: Before/after review

Show Jim a brief visual progress report. See `docs/reference/autonomous-mode.md` for format and details.

## Step 8: Return to menu or continue

**Quick/Standard mode:** Show the session start menu (CLAUDE.md) with a summary.
**Extended/Until-done mode:** See `docs/reference/autonomous-mode.md` for full autonomous behavior rules and stop conditions.
