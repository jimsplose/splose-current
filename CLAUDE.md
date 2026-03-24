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

**ALWAYS use DS components** from `@/components/ds` — never inline Tailwind for common patterns. 40+ components with Storybook stories (`npm run storybook`, port 6006). Use [DaisyUI naming](https://daisyui.com/components/). When a pattern appears on 2+ pages, extract to DS and add a Storybook story.

## Subagents

- Read `docs/agent-block.md` — copy the Agent Block into every UI-touching subagent prompt
- Read `docs/quality-gate.md` — run after every subagent completes
- **No worktrees** — use direct agents only. Worktrees cause data loss with concurrent sessions
- Jim runs 2 concurrent sessions. Coordinate via git, avoid editing same files

## Vercel

- **Dashboard**: https://vercel.com/jimyencken-4159s-projects/splose-current
- After push: link dashboard, say preview ready in ~2 min, give promote command (see Git Workflow)

## Key Conventions

- Server components by default — `"use client"` only for hooks/browser APIs
- `export const dynamic = "force-dynamic"` on data-fetching pages
- Tailwind CSS variables in `globals.css`. Australian locale (dates, Medicare, AUD)
- Use Chrome MCP for visual verification against `screenshots/reference/` and `splose-style-reference/`

## Working Style

**Jim is non-technical.** Handle all coding, git, builds, debugging. Never ask Jim to run commands. Provide exact copy-paste if action needed on his Mac.

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
Jim promotes manually: `git checkout main && git pull && git merge origin/<branch> --no-edit && git push`
Before every push: `npx next build` then `git fetch origin main && git merge origin/main --no-edit`.

## Development

```bash
npm run dev         # localhost:3000
npm run storybook   # localhost:6006
```
