# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com) for allied health professionals.
Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel.

## Session Start — MANDATORY

Before ANY other work, use AskUserQuestion with these options (exception: user's first message is a specific, detailed request):

> **What would you like to work on this session?**
> 1. **Review status** — Read `docs/progress.md` + `docs/fidelity-gaps.md`, show what's next
> 2. **Upload screenshots** — Follow `docs/screenshot-workflow.md`
> 3. **Run fidelity loops** — Follow `docs/fidelity-workflow.md`
> 4. **Visual audit** — Follow `docs/visual-audit-workflow.md`
> 5. **Update Dev Navigator** — Follow `docs/dev-navigator-spec.md`
> 6. **Something else**

For options 3/4, follow with duration question: Quick (2-3 gaps) / Standard (5-6) / Extended (all, autonomous) / Until done.
**Return to menu** after completing any workflow. Show brief summary of what was done.

## Workflow Files — ALWAYS read before starting

| Workflow | Read first |
|---|---|
| Fidelity loops | `docs/fidelity-workflow.md`, `docs/agent-block.md`, `docs/quality-gate.md` |
| Visual audit | `docs/visual-audit-workflow.md` |
| Screenshots | `docs/screenshot-workflow.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Codebase | `docs/project-structure.md` |

## Gap Completion Rule

A gap is `[x]` only when ALL related `screenshots/screenshot-catalog.md` entries show Match = "yes".

## Design System (`src/components/ds/`)

**ALWAYS use DS components** from `@/components/ds` — never inline Tailwind for common patterns. 40+ components (see `docs/reference/ds-component-catalog.md` for full list). Storybook: `npm run storybook` (port 6006). Use [DaisyUI naming](https://daisyui.com/components/). When a pattern appears on 2+ pages, extract to DS and add a Storybook story.

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
