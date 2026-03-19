# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

## Session Start Menu — MANDATORY

**STOP. Before doing ANY other work — before reading files, running commands, or responding to the user's first message — you MUST use AskUserQuestion to present this menu.** Even if the user says "let's go", "start", or gives a vague instruction, show the menu FIRST. The only exception is if the user's first message is a specific, detailed request (e.g. "fix the bug in the sidebar component").

Use AskUserQuestion with these options:

> **What would you like to work on this session?**
>
> 1. **Review status** — Read `docs/progress.md` and `docs/fidelity-gaps.md`, show recently completed tasks, build/deploy status, and what's next
> 2. **Upload screenshots** — User will upload new reference screenshots to be cataloged for future iterative screenshot comparison loops. Follow `docs/screenshot-workflow.md`
> 3. **Run fidelity loops** — Run iterative screenshot comparison and improvement loops. Read `docs/fidelity-gaps.md` (pick by priority), then follow `docs/fidelity-workflow.md`
> 4. **Build Dev Navigator** — Implement Dev Toolbar, state registry, and navigation menu. Follow `docs/dev-navigator-spec.md`
> 5. **Something else** — Free-form request

**Do NOT skip this step. Do NOT start working without the user's menu selection.**

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

- **Production** (main branch): `https://splose-current-git-main-jimyencken-4159s-projects.vercel.app`
- **Per-commit previews**: `https://splose-current-<hash>-jimyencken-4159s-projects.vercel.app`
  - The `<hash>` is a Vercel-generated ID, not the git SHA — you can't predict it from the commit hash alone

**After every push**, Claude Code MUST:
1. Tell Jim that the preview is building and will be available via the Vercel dashboard shortly
2. Note: Vercel previews take 1-2 minutes to build after push
3. Production auto-updates after preview build succeeds (via GitHub Action) — no manual step needed

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

### Session start — sync with main FIRST
**Before doing any work**, every session MUST run:
```bash
git fetch origin main
git merge origin/main --no-edit
```
This pulls in work from other sessions. If there are merge conflicts, resolve them before doing anything else. This is critical — skipping this causes branches to diverge and breaks auto-promote.

### How code reaches production
1. Claude Code commits and pushes to `claude/*` branch
2. Vercel builds a preview deployment for the branch
3. On success, GitHub Action (`.github/workflows/auto-promote.yml`) **merges** the branch into `main`
4. Vercel auto-deploys production from `main`

If the auto-merge fails due to conflicts, the action will abort and the branch stays unmerged. This is why step 1 (syncing main at session start) is so important — it prevents conflicts.

### Before every push
1. Run `npx next build` — never push broken code
2. Run `git fetch origin main && git merge origin/main --no-edit` — incorporate any changes that landed on main while you were working
3. If the merge brings in new changes, rebuild to verify
