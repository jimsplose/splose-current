# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com) for allied health professionals.
Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel.

## ⛔ FREEZE: No Deployments or Merges to Main

The `antd-migration` branch has serious visual issues that must be resolved first. Until Jim lifts this freeze:
- **Do NOT merge any branch to main**
- **Do NOT trigger deployments**
- **Do NOT ask Jim about deploying** — the answer is no
- Focus all work on fixing visual issues on the `antd-migration` branch

## Session Start

Unless Jim's first message is a specific request, print available workflows:

```
/audit       — Compare pages (production vs localhost)
/fidelity    — Fix gaps (implement code to close gaps)
/screenshots — Process uploaded reference screenshots
/status      — Show progress and what's next
/devnav      — Update Dev Navigator registry
/deploy      — Commits, deploys, git status
```

Or tell me what you'd like to work on. Bugshot: use `/bugshot-chrome`.

After completing any workflow, show this list again with a brief summary of what was done.

## Required Reading

Before doing ANY visual/UI work, read these docs. Do not skip them even if the task seems simple.

| Situation | Read BEFORE starting |
|---|---|
| Any visual change (direct or subagent) | `docs/quality-gate.md`, `docs/reference/measurement-protocol.md` |
| Launching a UI-touching subagent | `docs/agent-block.md` (copy the block into the prompt) |
| Running `/fidelity` or fixing gaps | `docs/fix-gaps-workflow.md`, `docs/route-mapping.md` |
| Running `/audit` or comparing pages | `docs/route-mapping.md`, `docs/reference/measurement-protocol.md` |

These docs contain the actual procedures (measurement snippets, threshold tables, DS scan patterns). CLAUDE.md provides the rules and principles — the docs above provide the step-by-step execution.

## Judgment Calls — Decision Trees

### Live measurement vs design spec
1. **Live production measurement always wins.** If you can measure it on `acme.splose.com`, use that value.
2. Design specs (`screenshots/specs/`) are reference material for understanding intent — not override values.
3. If a Fix Brief specifies a value and your live measurement differs, re-measure. If they still differ, use the live measurement and note the discrepancy.

### DS: extend vs inline
1. Does a DS component exist for this pattern? (Badge, Button, Text, Divider, etc.) → **Use it.**
2. Does the DS component exist but lack the exact prop you need? → **Add a prop/variant to the component, then use it.**
3. Is this a one-off layout value (`maxWidth`, `margin`, `flex`, `gap`, `position`)? → **Inline style is fine.**
4. Is this a tiny icon-only toolbar button or truly unique one-off? → **Inline is fine, but if the pattern appears on 2+ pages, extract to DS.**

If in doubt, extend the DS component. The cost of one extra prop is lower than the cost of inline drift.

### Chrome MCP not responding
**Chrome MCP is mandatory for visual work. Do not use fallback code-review paths.** Instead, troubleshoot:
1. Check Chrome is running and visible on the desktop
2. Run `mcp__claude-in-chrome__tabs_context_mcp` — if it fails, the MCP server may need restarting
3. Ask Jim to restart Chrome or the MCP extension if repeated failures
4. If Chrome MCP cannot be restored in this session, stop visual work and do non-visual tasks (refactoring, docs, TypeScript fixes) until the next session

## Canonical Viewport

**All Chrome MCP work uses 1440x900.** At the start of every session that uses Chrome MCP, run:
```
mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }
```
This is non-negotiable. All measurements and screenshots happen at this size.

## Visual Fix Priority: Dual-Tab Live Measurement

**For matching production** (most work): Navigate Chrome to `acme.splose.com` AND `localhost:3000` (see `docs/route-mapping.md` for URL pairs). Run the same `javascript_tool` measurement snippet on both tabs. Compare production values vs localhost values directly. Use arbitrary Tailwind values (`h-[34px]`, `px-[15px]`) for precision. Adjust in 2px increments if iterating.

**`splose-style-reference/` is documentation, not a comparison target.** Use it to understand the design system (what font-size a heading should be, what colors are used). But always prefer live production measurement when Chrome MCP is available.

**For new design decisions** (no production reference): Invoke `/impeccable:frontend-design` for design-informed analysis — hierarchy, proportion, weight, spacing.

## Gap Completion Rule

A gap is `[x]` only when ALL related `screenshots/screenshot-catalog.md` entries show Match = "yes".

## Design System (`src/components/ds/`)

**ALWAYS use DS components** from `@/components/ds` — never inline Tailwind for common patterns. 40+ components (see `docs/reference/ds-component-catalog.md` for full list). Storybook: `npm run storybook` (port 6006). Use [DaisyUI naming](https://daisyui.com/components/). When a pattern appears on 2+ pages, extract to DS and add a Storybook story.

**Extend, don't bypass.** When a DS component exists but doesn't support the exact styling production needs, add a prop to the component — do NOT replace it with an inline `<span style={{...}}>` or `<div style={{...}}>`. Inline styles that duplicate DS component responsibilities are banned even when they visually match production. The correct sequence: (1) measure production, (2) add a prop/variant to the DS component, (3) use it from the page. This keeps styling centralized and prevents drift.

## Chrome MCP Visual Verification

**All UI work** must be verified visually before committing. The pre-commit hook blocks commits on `page.tsx` files without a `.verification-evidence` file. See `docs/quality-gate.md` for the full protocol: dual-tab measurement loop, structural screenshots, and how to write verification evidence.

**Chrome MCP is mandatory** for visual verification — there is no acceptable fallback. If Chrome MCP is down, troubleshoot it (see "Chrome MCP not responding" in Decision Trees above). Do not commit visual changes without Chrome MCP measurement.

**Do NOT use** Puppeteer, Playwright, pixel-diff scripts, or headless browser screenshots. Chrome MCP is the only live visual verification tool.

## Subagents

- Read `docs/agent-block.md` — copy the Agent Block into every UI-touching subagent prompt
- Read `docs/quality-gate.md` — run after every UI change (subagent OR direct edits)
- **Worktrees: sequential only** — Use direct agents for independent page edits (different files = rare conflicts). Use `isolation: "worktree"` only when sequential editing of the same file is needed. See `docs/worktree-guardrails.md` before launching worktree agents.
- Jim runs 2 concurrent sessions. Before creating worktrees, check `git worktree list` — if another session has active worktrees, use direct agents instead.

## GitHub & Accounts

- **Repo**: `jimsplose/splose-current` (owner: `jimsplose`)
- **gh CLI account**: `jimsplose` (Google auth, has `repo` + `workflow` scopes)
- Jim also has a personal account `jimyencken` — this does NOT have write access to the repo. Ensure `gh auth status` shows `jimsplose` as active before running any `gh` commands.
- If `gh` commands fail with permission errors, check: `gh auth status` → verify `jimsplose` is the active account.

## Vercel & Deployment

- **Dashboard**: https://vercel.com/jimyencken-4159s-projects/splose-current
- **Deployment is manual only** via GitHub Actions workflow `deploy.yml` (`gh workflow run deploy.yml --ref main`)
- **NEVER deploy without Jim's express permission.** After major milestones (completing a workflow, closing a batch of gaps), ask Jim if he wants to deploy. Do not auto-deploy.
- **Deploy flow** (when Jim approves):
  1. Merge branch to main: `git checkout main && git pull && git merge origin/<branch> --no-edit && git push`
  2. Trigger deploy: `gh workflow run deploy.yml --ref main`
  3. Share run URL: `gh run list --workflow=deploy.yml --limit=1`
- **Jim is non-technical.** Handle all coding, git, builds, debugging. Provide exact copy-paste commands.
- Server components by default. `export const dynamic = "force-dynamic"` on data-fetching pages.
- Tailwind CSS vars in `globals.css`. Australian locale. Chrome MCP for visual verification.

## Commit Discipline

**Auto-commit** all routine work (src/, screenshots, catalog, progress.md, fidelity-gaps.md). Don't prompt.
**Ask first** for: CI/CD, deployment config, deps (package.json), CLAUDE.md, workflow docs, schema.
**Sanity check** — ask if: >5 deletions, >20 files, or >80% rewrite of a 100+ line file.
**Auto-push** after `npx next build` passes. Auto-revert if build breaks. Run `npx tsc --noEmit` after agents.
Verify CWD after agent completion: `cd /Users/jimyenckensplose/claude/splose-current && pwd`

## Session End

1. Commit all WIP  2. Push to `claude/*` branch  3. Update `docs/progress.md`  4. Ask Jim if he wants to deploy

## Git Workflow

```bash
# Session start — always sync first:
git fetch origin main && git merge origin/main --no-edit
```

Push to `claude/*` branches. Before every push: `npx next build` then `git fetch origin main && git merge origin/main --no-edit`.

### After major milestones — ask about deployment

After completing a workflow or batch of fixes, ask Jim:
> "Ready to deploy? I can merge `<branch-name>` to main and trigger a production deployment."

**Only proceed if Jim says yes.** Then run the full deploy flow (see Vercel & Deployment section above).

## Development

```bash
npm run dev         # localhost:3000
npm run storybook   # localhost:6006
```

## Workflow Documentation Sync Map

Workflow docs have a canonical source for each rule. When updating any rule, update the canonical source FIRST, then sync all downstream files listed below. **Do not update a downstream file without updating the canonical source.**

| Rule / Procedure | Canonical source | Downstream (must sync) |
|---|---|---|
| Measurement thresholds (colors, fonts, spacing) | `measurement-protocol.md` Section 5 | `agent-block.md` (inline thresholds paragraph) |
| DS violation scan patterns (Scans 1-4) | `measurement-protocol.md` Section 6 | `quality-gate.md` Step 1, `agent-block.md` (banned patterns) |
| 5-iteration verification loop | `measurement-protocol.md` Section 7 | `agent-block.md` (verification section), `quality-gate.md` Step 3 |
| Measurement JS snippet | `measurement-protocol.md` Section 4b | `agent-block.md` (inline snippet) |
| Catalog entry qualifiers | `measurement-protocol.md` Section 8 | `fix-gaps-workflow.md` Step 4 |
| DS component lookup table | `agent-block.md` (DS section) | `measurement-protocol.md` Section 6 (component mandate) |
| DS "extend, don't bypass" rule | `CLAUDE.md` (DS section + Decision Trees) | `agent-block.md` (extend section), `quality-gate.md` Step 1 Scans 3-4, `fix-gaps-workflow.md` Step 3.5 |
| Chrome MCP is mandatory | `CLAUDE.md` (Decision Trees) | `quality-gate.md` (remove fallback paths) |
| Gap completion rule | `CLAUDE.md` (Gap Completion Rule) | `fix-gaps-workflow.md` Step 4, `fidelity-gaps.md` header |

**When making workflow/instruction updates:** Read this table. Update the canonical source, then grep for the rule in downstream files and sync them. If you add a new rule, add it to this table.
