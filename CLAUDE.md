# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com) for allied health professionals.
Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel.

## Session Start — MANDATORY

Before ANY other work, print this menu as a text message (do NOT use AskUserQuestion — it has a 4-option limit that forces awkward splits). Exception: user's first message is a specific, detailed request.

Print this exactly:

```
What would you like to work on this session?

1. Compare pages — Dual-tab comparison: production vs localhost
2. Fix gaps — Implement code to close gaps
3. Bugshot Chrome — Point at bugs in the browser to fix or log
4. Screenshots — Process uploaded reference screenshots
5. Dev Navigator — Update Dev Navigator registry
6. Review status — Show progress and what's next
7. Commits & deploys — Check commit/deploy status or trigger a deploy
8. Something else
```

Wait for Jim to reply with a number or keyword. Do NOT proceed until he responds.

For option 3, follow with mode question: **Fix one now** / **Log many** (saves to fidelity-gaps.md for later).
For option 7, show sub-menu:
- **Check recent commits** — `git log --oneline -10` and summarise
- **Check deployment status** — `gh run list --workflow=deploy.yml --limit=5` and summarise
- **Deploy to production** — Full flow: merge branch → main, trigger `deploy.yml` workflow. **Requires Jim's express permission.** Confirm branch name and show what will be deployed before proceeding.
For options 1/2, follow with scope question:
- **Quick** (2-3 pages)
- **Standard** (all partials)
- **Full sweep** (every page in the prototype)
- **Until done** (autonomous, keep going)
**Return to menu** after completing any workflow. Show brief summary of what was done.

**Chrome MCP detection:** At session start, check if Chrome MCP tools are available (look for browser/Chrome tools in the tool list). Record the result for the session. If unavailable, inform Jim and note that visual verification will use the fallback path (main-agent screenshot reading + code review). All workflows adapt automatically — see `docs/quality-gate.md` Step 3.

## Workflow Files — ALWAYS read before starting

| Workflow | Read first |
|---|---|
| Compare pages | `docs/compare-pages-workflow.md`, `docs/route-mapping.md` |
| Fix gaps | `docs/fix-gaps-workflow.md`, `docs/agent-block.md`, `docs/quality-gate.md`, `docs/route-mapping.md` |
| Screenshots | `docs/screenshot-workflow.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Codebase | `docs/project-structure.md` |

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

## Chrome MCP Visual Verification

**All UI work** must be verified visually before committing. Chrome MCP dual-tab comparison is the preferred method. If Chrome MCP is unavailable in a session, use the fallback verification path described in `docs/quality-gate.md` Step 3 Path B.

**When Chrome MCP is available (dual-tab):**
1. Ensure dev server is running (`npm run dev` on localhost:3000)
2. Set viewport: `resize_window → { width: 1440, height: 900 }`
3. Navigate Tab A to `acme.splose.com/<route>` and Tab B to `localhost:3000/<route>` (see `docs/route-mapping.md`)
4. Run the same `javascript_tool` measurement snippet on both tabs — compare intrinsic CSS properties directly
5. Screenshot both tabs for structural comparison (missing elements, layout, icons)
6. Fix any mismatches before committing

**When Chrome MCP is not available (fallback):**
1. Main agent reads reference screenshots (max 2 at a time) and compares against page source code
2. Cross-reference against `splose-style-reference/` for expected token values
3. Use "partial — code-review only" for uncertain catalog entries (never false-positive to "yes")

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
