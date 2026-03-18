# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

## Session Start Menu

**At the beginning of every new session**, present the user with a choice using AskUserQuestion before doing any other work:

> **What would you like to work on this session?**
>
> 1. **Review status** — Read `docs/progress.md` and `docs/fidelity-gaps.md`, show recently completed tasks, build/deploy status, and what's next
> 2. **Process new screenshots** — Follow `docs/screenshot-workflow.md` to scan, categorize, and catalog new screenshots
> 3. **Run fidelity improvement loops** — Read `docs/fidelity-gaps.md` (pick by priority), then follow `docs/fidelity-workflow.md`
> 4. **Build Dev Navigator** — Follow `docs/dev-navigator-spec.md` to implement floating toolbar + state registry
> 5. **Something else** — Free-form request

Wait for the user's answer before proceeding.

## Workflow Files (RAG)

**ALWAYS read the relevant instruction file before starting a workflow.** Do not rely on memory of these files from previous sessions.

| Workflow | Read first |
|---|---|
| Review status | `docs/progress.md`, `docs/fidelity-gaps.md` |
| Process screenshots | `docs/screenshot-workflow.md` |
| Fidelity improvements | `docs/fidelity-gaps.md`, `docs/fidelity-workflow.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Understanding the codebase | `docs/project-structure.md` |

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel hosting.

## Viewing Changes — Vercel Preview URLs

Every push to any branch gets a **Vercel preview deployment**. This is how Jim reviews changes.

- **Production** (main branch): https://splose-current.vercel.app
- **Branch previews**: `https://splose-current-<git-branch-slug>.vercel.app`
  - Example: branch `claude/fidelity-sprint-automation-0cFV5` → `https://splose-current-git-claude-fidelity-sprint-auto-jimyencken-4159s.vercel.app`
- **Per-commit previews**: Each push also gets a unique URL like `https://splose-current-<hash>.vercel.app`

**After every push**, Claude Code MUST:
1. Tell Jim the branch preview URL so he can check changes immediately
2. Note: Vercel previews take 1-2 minutes to build after push
3. Production auto-updates after preview build succeeds (via GitHub Action) — no manual step needed

To check deployment status: `gh api repos/jimsplose/splose-current/deployments --jq '.[0] | {env: .environment, url: .payload.web_url, status: .state}'`

## Key Conventions

- **Server components by default** — only `"use client"` when hooks/browser APIs needed
- **`export const dynamic = "force-dynamic"`** on pages that fetch data
- **Tailwind CSS variables** in `globals.css` (e.g. `--color-primary: #7c3aed`)
- **Australian locale** — dates, Medicare numbers, NDIS references, AUD currency

## Working Style

**Jim is non-technical.** Handle all coding, git, builds, and debugging. Never ask Jim to run commands, edit files, or debug. If something requires action on Jim's Mac, provide exact copy-paste commands.

## Commit Discipline

### Commit cadence
- **Commit after every logical unit of work** — each page change, each batch of screenshot processing, each infrastructure change
- **Never let more than ~30 minutes of work go uncommitted**
- If a diff touches more than 3 files or ~300 lines, consider splitting into multiple commits

### Build gate
- **NEVER push without a passing build** — run `npx next build` before every push
- If the build fails, fix it before pushing. Do not push broken code.

### After applying worktree agent changes
- Run `npx tsc --noEmit` after each agent's changes are applied to catch conflicts early
- If an agent's changes break the build, **revert them** and continue with other agents

### Rollback protocol
- If a change breaks things after push, `git revert` the commit rather than force-pushing
- If multiple commits need reverting, revert them in reverse order

## Session End Checklist

**Before a session ends** (context running low, user ending session, or task complete):
1. **Commit** all work in progress — even partial work as a `WIP:` commit
2. **Push** to the `claude/*` branch
3. **Append** a summary to `docs/progress.md` (what was done, what's in progress, what was discovered)
4. **Update** `docs/fidelity-gaps.md` — check off completed gaps, add any newly discovered ones
5. **Tell Jim** the preview URL so he can review

## Progress Tracking

- Use **TodoWrite** at session start to create tasks from `docs/fidelity-gaps.md` or user requests
- Mark tasks complete **immediately** as each one finishes (don't batch)
- The persistent record lives in `docs/progress.md` (survives between sessions)
- TodoWrite is ephemeral (resets each session) — it's for in-session tracking only

## Environment Variables

```
TURSO_DATABASE_URL=libsql://splose-current-jimsplose.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=<your-turso-token>
```

## Development

```bash
npm install              # Install deps (also runs prisma generate via postinstall)
npm run dev              # Start dev server at localhost:3000
```

## Deployment

Vercel auto-deploys when `main` is updated. Build runs: `prisma generate` → `tsx scripts/db-push.ts` → `next build`.

## Git Workflow

1. Claude Code commits and pushes to `claude/*` branch
2. Vercel builds a preview deployment for the branch
3. On success, GitHub Action (`.github/workflows/auto-promote.yml`) auto-fast-forwards `main` to the deployed SHA
4. Vercel auto-deploys production from `main`

No manual fast-forward needed — pushing to `claude/*` automatically promotes to production after a successful Vercel build.
