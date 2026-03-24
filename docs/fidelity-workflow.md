# Fidelity Improvement Workflow

Use **parallel subagents** for speed when working through fidelity gaps.

## Prerequisites — MANDATORY

**Chrome MCP:** Preferred for screenshot capture and visual verification. If unavailable, use the fallback path (see Step 0.5 and Step 3).

**Design specs:** Check `screenshots/specs/<page-name>.md` before working on a page. If none exists, extract one first per `docs/design-spec-workflow.md`. Skip only if the page has no reference screenshots.

**Design System:** All fidelity work MUST use DS components from `@/components/ds`. See `docs/agent-block.md` for the full component list. Run `npm run storybook` to preview.

**New DS components:** If a gap requires a missing component, create it in `src/components/ds/` first with a Storybook story. When the same inline pattern appears on 2+ pages, extract it into a DS component — this is higher priority than finishing more pages. After creating a component: add story, export from `index.ts`, update `CLAUDE.md` and `docs/agent-block.md`.

## Completion criteria

A gap is only `[x]` when ALL related catalog entries show Match = "yes". If any show "no" or "partial", the gap stays `[ ]` — note partial progress in the description.

## Step 0.5: Prepare Fix Briefs ("See" phase)

**Before launching any agents**, the main agent reads reference screenshots and produces text-only Fix Briefs. This separates "seeing" (image comprehension) from "doing" (code editing) — subagents have smaller context windows and cannot handle screenshot image files.

1. Read `screenshots/screenshot-catalog.md` to identify the partial/no entries for the pages being worked on
2. For each page, read reference screenshots using the Read tool (**max 2 screenshots per pass** to avoid context overload)
3. Cross-reference each screenshot against:
   - The page source code (`src/app/<path>/page.tsx`)
   - The style reference (`splose-style-reference/page-structures/<page>.md`)
   - The design spec (`screenshots/specs/<page-name>.md`) if it exists
4. Produce a **Fix Brief** for each page (text only):

```
### Fix Brief: <Page Name>

**Page path:** `/path/to/page`
**Source files:** `src/app/<path>/page.tsx`, `src/app/<path>/SomeClient.tsx`
**Design spec:** `screenshots/specs/<page-name>.md` (if exists)
**Style reference:** `splose-style-reference/page-structures/<page>.md`

**Gaps to fix:**

1. **[Area]** — Reference shows [X], code currently has [Y]. Fix: [specific instruction with exact values].
   - Tailwind class: change `X` to `Y`
   - Component: replace `<bare element>` with `<DSComponent prop="value">`

2. **[Area]** — [Description]. Fix: [instruction].

**Do NOT change:**
- [List anything that already matches and should not be touched]
```

5. Fix briefs do NOT need to be saved to disk — they're passed directly into agent prompts as text

**When Chrome MCP is available:** You may skip writing fix briefs and let agents verify visually instead. Fix briefs are most valuable when Chrome MCP is unavailable.

## Step 1: Launch parallel agents (direct, no worktrees)

Group non-conflicting gaps and launch simultaneously. **Do NOT use `isolation: "worktree"`** (see CLAUDE.md for rationale).

**Every agent prompt MUST include:**
- The full Agent Block from `docs/agent-block.md` (between the `---START/END AGENT BLOCK---` markers)
- `You are working in /Users/jimyenckensplose/claude/splose-current. Edit files directly. Do NOT use worktrees.`
- The Fix Brief for the page (text only — **never include screenshot file paths in agent prompts**)

Each agent should:
1. Read the fix brief (provided in the prompt as text)
2. Read the design spec (`screenshots/specs/<page-name>.md`) if referenced in the fix brief
3. Read and edit the page source to match, using DS components and exact spec values
4. Ensure no TypeScript errors
5. **If Chrome MCP is available:** Capture a screenshot and compare against the reference — iterate until it matches
6. **If Chrome MCP is not available:** Report what was changed (files, components, values) so the main agent can verify afterward

**Parallelization rules:**
- Different page directories → parallel safe
- Same file → sequential
- Database changes (`prisma/seed.ts`) → run alone, then verify affected pages
- General screenshot review agent → run last

## Step 2: Quality gate and commit

After each agent completes, run the **Post-Agent Quality Gate from `docs/quality-gate.md`** before committing.

**CWD safety check — MANDATORY:** Run `cd /Users/jimyenckensplose/claude/splose-current && pwd` before any post-agent work. If it returns a `.claude/worktrees/` path, `cd` to the real repo first.

For each agent: verify CWD → `git diff` → run Quality Gate (DS scan, TS check, visual verify) → commit or revert. If changes break the build, **revert and continue** with the next agent.

## Step 3: Visual verification

Follow the Visual Verification step in `docs/quality-gate.md` — it adapts based on Chrome MCP availability (Path A or Path B).

## Step 4: Update catalog Match status

For each changed page, update `screenshots/screenshot-catalog.md` Match column ("yes" / "partial — <detail>" / "no"). Only mark the gap `[x]` if ALL entries show "yes". **This step is mandatory.**

When Chrome MCP is not available and verification was code-review only, use "partial — code-review only" for entries where visual confirmation is needed.

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
