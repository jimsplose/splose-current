# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com) for allied health professionals.
Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel.

## Session Start — MANDATORY

Before ANY other work, use AskUserQuestion with these options (exception: user's first message is a specific, detailed request):

> **What would you like to work on this session?**
> 1. **compare-pages-workflow.md** — Compare localhost vs reference screenshots
> 2. **fix-gaps-workflow.md** — Implement code to close gaps
> 3. **bugshot-chrome** — Point at bugs in the browser to fix or log
> 4. **screenshot-workflow.md** — Process uploaded reference screenshots
> 5. **dev-navigator-spec.md** — Update Dev Navigator registry
> 6. **Review status** — Show progress and what's next
> 7. **Something else**

For option 3, follow with mode question: **Fix one now** / **Log many** (saves to fidelity-gaps.md for later).
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
| Compare pages | `docs/compare-pages-workflow.md` |
| Fix gaps | `docs/fix-gaps-workflow.md`, `docs/agent-block.md`, `docs/quality-gate.md` |
| Screenshots | `docs/screenshot-workflow.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Codebase | `docs/project-structure.md` |

## Frontend Design Skill — USE FOR ALL VISUAL WORK

Invoke `/impeccable:frontend-design` before any visual comparison or fix. After invoking, apply these specific checks:

- **Hierarchy check**: Does the visual importance ranking match the reference? (e.g. logo should be more prominent than nav items, not equal or smaller)
- **Proportion check**: Are relative sizes correct? Zoom into the specific area and measure element A height vs element B height.
- **Weight check**: Does visual density/boldness match? Consider stroke width, color saturation, font-weight — not just font-size.
- **Structural check**: Before changing a CSS value, understand the underlying asset (e.g. does an SVG have internal whitespace? Does a font render differently at different weights?)

## Gap Completion Rule

A gap is `[x]` only when ALL related `screenshots/screenshot-catalog.md` entries show Match = "yes".

## Design System (`src/components/ds/`)

**ALWAYS use DS components** from `@/components/ds` — never inline Tailwind for common patterns. 40+ components (see `docs/reference/ds-component-catalog.md` for full list). Storybook: `npm run storybook` (port 6006). Use [DaisyUI naming](https://daisyui.com/components/). When a pattern appears on 2+ pages, extract to DS and add a Storybook story.

## Chrome MCP Visual Verification

**All UI work** must be verified visually before committing. Chrome MCP is the preferred method. If Chrome MCP is unavailable in a session, use the fallback verification path described in `docs/quality-gate.md` Step 3 Path B.

**When Chrome MCP is available:**
1. Ensure dev server is running (`npm run dev` on localhost:3000)
2. Navigate to each changed page in Chrome MCP
3. Take a screenshot and compare against `screenshots/reference/`
4. Fix any mismatches before committing

**When Chrome MCP is not available (fallback):**
1. Main agent reads reference screenshots (max 2 at a time) and compares against page source code
2. Cross-reference against `splose-style-reference/` for exact token values
3. Use "partial — code-review only" for uncertain catalog entries (never false-positive to "yes")

**Do NOT use** Puppeteer, Playwright, pixel-diff scripts, or headless browser screenshots. Chrome MCP is the only live visual verification tool.

## Subagents

- Read `docs/agent-block.md` — copy the Agent Block into every UI-touching subagent prompt
- Read `docs/quality-gate.md` — run after every UI change (subagent OR direct edits)
- **No worktrees** — use direct agents only. Worktrees cause data loss with concurrent sessions
- Jim runs 2 concurrent sessions. Coordinate via git, avoid editing same files

## Vercel & Working Style

- **Dashboard**: https://vercel.com/jimyencken-4159s-projects/splose-current
- After push: link dashboard, say preview ready in ~2 min, give promote instructions (see Git Workflow)
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

1. Commit all WIP  2. Push to `claude/*` branch  3. Update `docs/progress.md`  4. Tell Jim preview URL + promote command

## Git Workflow

```bash
# Session start — always sync first:
git fetch origin main && git merge origin/main --no-edit
```

Push to `claude/*` branches. **Auto-promote is disabled** (saves build costs).
Before every push: `npx next build` then `git fetch origin main && git merge origin/main --no-edit`.

### Promoting to production — Claude MUST give Jim these instructions after every push

**Option A (GitHub website — easiest):**
1. Go to: `https://github.com/jimsplose/splose-current/compare/main...<branch-name>`
2. Click **"Create pull request"** → give it a title → click **"Create pull request"** again
3. On the PR page, scroll down and click **"Merge pull request"** → **"Confirm merge"**
4. Vercel auto-deploys production from main within ~2 minutes

**Option B (terminal — one command):**
```bash
git checkout main && git pull && git merge origin/<branch-name> --no-edit && git push
```

Claude: always replace `<branch-name>` with the actual branch name when giving Jim these instructions.

## Development

```bash
npm run dev         # localhost:3000
npm run storybook   # localhost:6006
```
