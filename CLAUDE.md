# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

## Session Start Menu — MANDATORY

**STOP. Before doing ANY other work — before reading files, running commands, or responding to the user's first message — you MUST use AskUserQuestion to present this menu.** Even if the user says "let's go", "start", or gives a vague instruction, show the menu FIRST. The only exception is if the user's first message is a specific, detailed request (e.g. "fix the bug in the sidebar component").

Use AskUserQuestion with these options:

> **What would you like to work on this session?**
>
> 1. **Review status** — Read `docs/progress.md` and `docs/fidelity-gaps.md`, show recently completed tasks, build/deploy status, and what's next
> 2. **Upload screenshots** — User will upload new reference screenshots to be saved into `screenshots/reference/`. Follow `docs/screenshot-workflow.md`
> 3. **Process screenshots** — Catalog unprocessed screenshots, compare against prototype, and create fidelity gaps for every mismatch. Follow `docs/screenshot-workflow.md`
> 4. **Run fidelity loops** — Pick open gaps from `docs/fidelity-gaps.md` (by priority), implement fixes, and visually verify against references. Follow `docs/fidelity-workflow.md`
> 5. **Visual audit** — Verify implemented pages match references, update Match status in catalog, reopen/create gaps for mismatches. Follow `docs/visual-audit-workflow.md`
> 6. **Build Dev Navigator** — Implement Dev Toolbar, state registry, and navigation menu. Follow `docs/dev-navigator-spec.md`
> 7. **Something else** — Free-form request

**Do NOT skip this step. Do NOT start working without the user's menu selection.**

### Lifecycle overview

```
Upload → Process → Fidelity loops → Visual audit → (repeat)
  (2)      (3)         (4)              (5)
```

- **Upload (2)** adds raw screenshots to `screenshots/reference/`
- **Process (3)** catalogs them in `screenshots/screenshot-catalog.md` and creates gaps in `docs/fidelity-gaps.md` for every "no" match
- **Fidelity loops (4)** implements code changes to close those gaps
- **Visual audit (5)** verifies the work actually matches, updates the catalog Match column, and reopens/creates gaps for anything still wrong
- **Dev Navigator (6)** is independent infrastructure — build anytime

### Gap completion rule (single source of truth)

**A fidelity gap is only `[x]` done when ALL related entries in `screenshots/screenshot-catalog.md` show Match = "yes".** This rule is defined here and referenced from other workflow docs. If a gap's catalog entries show "no" or "partial", it stays `[ ]`.

## Workflow Files (RAG)

**ALWAYS read the relevant instruction file before starting a workflow.** Do not rely on memory of these files from previous sessions.

| Workflow | Read first |
|---|---|
| Review status | `docs/progress.md`, `docs/fidelity-gaps.md` |
| Upload / Process screenshots | `docs/screenshot-workflow.md` |
| Fidelity improvements | `docs/fidelity-gaps.md`, `docs/fidelity-workflow.md`, `docs/agent-block.md`, `docs/quality-gate.md` |
| Visual audit | `docs/visual-audit-workflow.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Understanding the codebase | `docs/project-structure.md` |

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel hosting.

## Viewing Changes — Vercel Preview URLs

Every push to any branch gets a **Vercel preview deployment**. This is how Jim reviews changes.

- **Vercel dashboard**: https://vercel.com/jimyencken-4159s-projects/splose-current
- **Production** (main branch): `https://splose-current-git-main-jimyencken-4159s-projects.vercel.app`

**After every push**, Claude Code MUST:
1. Link Jim to the Vercel dashboard
2. Tell him the preview will be available in 1-2 minutes
3. Show visual progress (see `docs/quality-gate.md` for details)
4. Production auto-updates via GitHub Action — no manual step needed

## Design System (`src/components/ds/`)

**ALWAYS use design system components instead of inline Tailwind for common patterns.** Import from `@/components/ds`.

| Component | Use for |
|---|---|
| `Button` | All buttons (primary/secondary/danger/ghost, sm/md/lg) |
| `PageHeader` | Page title + action buttons |
| `SearchBar` | Search input + button combos |
| `DataTable` / `TableHead` / `Th` / `TableBody` / `Td` | Tables with headers and rows |
| `Pagination` | Table pagination footer |
| `Badge` | Status pills and tags |
| `FormInput` | Labeled text inputs with error states |
| `FormSelect` | Labeled select dropdowns |

- **Storybook**: `npm run storybook` on port 6006. Stories in `src/components/ds/stories/`. When adding new DS components, always add a story.
- **Eng toolkit**: `/eng` — component showcase + page directory.
- **Tailwind**: Use design tokens (`text-primary`, `bg-primary`, `border-border`). Prettier sorts classes automatically.
- **New pages**: Use DS components, add to `src/lib/state-registry.ts`, wire `?state=` variants.
- **Editing pages**: Opportunistically migrate to DS components when touching that section.

## Subagent & Quality Gate

When launching subagents for UI work, read and follow:
- **`docs/agent-block.md`** — Copy the Agent Block into every UI-touching subagent prompt verbatim
- **`docs/quality-gate.md`** — Run after every subagent completes, before committing

## Key Conventions

- **Server components by default** — only `"use client"` when hooks/browser APIs needed
- **`export const dynamic = "force-dynamic"`** on pages that fetch data
- **Tailwind CSS variables** in `globals.css` (e.g. `--color-primary: #7c3aed`)
- **Australian locale** — dates, Medicare numbers, NDIS references, AUD currency

## Working Style

**Jim is non-technical.** Handle all coding, git, builds, and debugging. Never ask Jim to run commands, edit files, or debug. If something requires action on Jim's Mac, provide exact copy-paste commands.

## Commit Discipline

- **Commit after every logical unit of work** — never let ~30 minutes go uncommitted
- **NEVER push without a passing build** — run `npx next build` before every push
- Run `npx tsc --noEmit` after applying worktree agent changes to catch conflicts early
- If agent changes break the build, **revert them** and continue with other agents
- If a change breaks things after push, `git revert` rather than force-pushing

## Session End Checklist

**Before a session ends** (context running low, user ending, or task complete):
1. **Commit** all work in progress — even partial work as a `WIP:` commit
2. **Push** to the `claude/*` branch
3. **Append** a summary to `docs/progress.md`
4. **Update** `docs/fidelity-gaps.md` — only mark gaps `[x]` if catalog entries ALL show Match = "yes"
5. **Update** `screenshots/screenshot-catalog.md` Match column for changed pages
6. **Tell Jim** the preview URL

## Progress Tracking

- Use **TodoWrite** at session start to create tasks from `docs/fidelity-gaps.md` or user requests
- Mark tasks complete **immediately** as each one finishes (don't batch)
- The persistent record lives in `docs/progress.md` (survives between sessions)

## Development

```bash
npm install              # Install deps (also runs prisma generate via postinstall)
npm run dev              # Start dev server at localhost:3000
npm run storybook        # Storybook on localhost:6006
npx playwright install chromium  # Download browser for screenshots (may fail in sandboxed environments)
```

## Environment Variables

```
TURSO_DATABASE_URL=libsql://splose-current-jimsplose.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=<your-turso-token>
```

## Deployment

Vercel auto-deploys when `main` is updated. Build: `prisma generate` → `tsx scripts/db-push.ts` → `next build`.

## Git Workflow

### Session start — sync with main FIRST
**Before doing any work**, every session MUST run:
```bash
git fetch origin main
git merge origin/main --no-edit
```
This prevents branch divergence and auto-promote conflicts.

### How code reaches production
1. Claude Code pushes to `claude/*` branch
2. Vercel builds a preview deployment
3. GitHub Action (`.github/workflows/auto-promote.yml`) merges into `main`
4. Vercel auto-deploys production from `main`

### Before every push
1. `npx next build` — never push broken code
2. `git fetch origin main && git merge origin/main --no-edit`
3. If merge brings new changes, rebuild to verify
