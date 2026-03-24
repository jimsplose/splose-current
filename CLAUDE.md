# Splose Practice Management Prototype

High-fidelity UI prototype of [Splose](https://splose.com), a practice management platform for allied health professionals.

## Session Start Menu — MANDATORY

**STOP. Before doing ANY other work — before reading files, running commands, or responding to the user's first message — you MUST use AskUserQuestion to present this menu.** Even if the user says "let's go", "start", or gives a vague instruction, show the menu FIRST. The only exception is if the user's first message is a specific, detailed request (e.g. "fix the bug in the sidebar component").

Use AskUserQuestion with these options:

> **What would you like to work on this session?**
>
> 1. **Review status** — Read `docs/progress.md` and `docs/fidelity-gaps.md`, show recently completed tasks, build/deploy status, and what's next
> 2. **Upload screenshots** — Upload reference screenshots (user will paste/attach images). Claude saves, catalogs, and creates fidelity gaps. Follow `docs/screenshot-workflow.md`
> 3. **Run fidelity loops** — Pick open gaps from `docs/fidelity-gaps.md` (by priority), implement fixes, and visually verify against references. Follow `docs/fidelity-workflow.md`
> 4. **Visual audit** — Verify implemented pages match references, update Match status in catalog, reopen/create gaps for mismatches. Follow `docs/visual-audit-workflow.md`
> 5. **Update Dev Navigator registry** — Verify all pages and `?state=` variants are in `src/lib/state-registry.ts`. Cross-check against routes and screenshots. Follow `docs/dev-navigator-spec.md`
> 6. **Something else** — Free-form request

**Do NOT skip this step. Do NOT start working without the user's menu selection.**

### Part 2: Duration (for fidelity loops and visual audits)

When the user selects option **3** or **4**, immediately show a second AskUserQuestion:

> **How long should this session run?**
>
> 1. **Quick (2-3 gaps)** — ~20-30 min, interactive. Check in after each gap.
> 2. **Standard (5-6 gaps)** — ~1 hour. Check in after each round of parallel agents.
> 3. **Extended (all open gaps)** — ~2 hours, fully autonomous. Commit & push after each round, skip return-to-menu between rounds. Stop when gaps exhausted or context low.
> 4. **Until done** — Run until all open gaps are closed or context limit reached. Same as Extended but no time target.

**Autonomous mode behavior (options 3 and 4):**
- Use Chrome MCP for visual verification throughout the session
- Auto-select gaps by priority from `docs/fidelity-gaps.md` — highest priority first
- Skip "return to menu" between rounds — go straight to next batch
- Commit after every completed gap (not every batch) to preserve work
- Push every 2-3 gaps (or after each round of parallel agents)
- Run `git fetch origin main && git merge origin/main --no-edit` before each push
- Re-read `docs/fidelity-gaps.md` after each round to stay current (in case other session updated it)
- **Stop conditions:** all gaps closed, context compression triggered 2+ times, build failure that can't be auto-fixed, or Jim sends a message
- When stopping: commit all WIP, push, update progress.md, show summary of what was completed

### Return to menu after completing a workflow

After finishing any workflow (screenshot upload, fidelity loop round, visual audit, etc.), **show the session start menu again** so Jim can pick what's next. Include a brief summary of what was just completed before showing the menu. Do NOT assume what Jim wants to do next — let him choose.

### Lifecycle overview

```
Upload screenshots → Fidelity loops → Visual audit → (repeat)
       (2)                (3)              (4)
```

- **Upload (2)** — Jim pastes/attaches images. Claude saves to `screenshots/reference/`, catalogs them, and creates fidelity gaps for mismatches. All in one step.
- **Fidelity loops (3)** — implements code changes to close those gaps
- **Visual audit (4)** — verifies the work actually matches, updates the catalog Match column, and reopens/creates gaps for anything still wrong
- **Dev Navigator (5)** — verify all pages/states are registered, fix gaps in navigation

### Gap completion rule (single source of truth)

**A fidelity gap is only `[x]` done when ALL related entries in `screenshots/screenshot-catalog.md` show Match = "yes".** This rule is defined here and referenced from other workflow docs. If a gap's catalog entries show "no" or "partial", it stays `[ ]`.

## Workflow Files (RAG)

**ALWAYS read the relevant instruction file before starting a workflow.** Do not rely on memory of these files from previous sessions.

| Workflow | Read first |
|---|---|
| Review status | `docs/progress.md`, `docs/fidelity-gaps.md` |
| Upload screenshots | `docs/screenshot-workflow.md`, `docs/design-spec-workflow.md` |
| Fidelity improvements | `docs/fidelity-gaps.md`, `docs/fidelity-workflow.md`, `docs/agent-block.md`, `docs/quality-gate.md`, `docs/design-spec-workflow.md` |
| Visual audit | `docs/visual-audit-workflow.md`, `docs/design-spec-workflow.md` |
| Design spec extraction | `docs/design-spec-workflow.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Understanding the codebase | `docs/project-structure.md` |
| Typography migration | `docs/typography-spec.md`, `docs/typography-migration.md`, `docs/agent-block.md` |

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
4. Tell Jim how to promote to production (see Git Workflow below)

## Design System (`src/components/ds/`)

**ALWAYS use design system components instead of inline Tailwind for common patterns.** Import from `@/components/ds`.

### Naming convention

**Use [DaisyUI](https://daisyui.com/components/) component names** when a matching concept exists. This keeps our vocabulary aligned with a well-known Tailwind component library and makes it easy to look up expected behavior/API. Where no DaisyUI equivalent exists, use a descriptive name. See `docs/fidelity-gaps.md` Priority 8 for the full mapping.

### Existing components

| Component | DaisyUI name | Use for |
|---|---|---|
| `Button` | `button` | All buttons (primary/secondary/danger/ghost, sm/md/lg) |
| `PageHeader` | — (custom) | Page title + action buttons |
| `SearchBar` | — (custom) | Search input + button combos |
| `DataTable` / `TableHead` / `Th` / `TableBody` / `Td` | `table` | Tables with headers and rows |
| `Pagination` | — (custom) | Table pagination footer |
| `Badge` | `badge` | Status pills and tags |
| `FormInput` | `input` | Labeled text inputs with error states |
| `FormSelect` | `select` | Labeled select dropdowns |
| `Text` | — (custom) | Semantic typography (display/heading/body/label/caption/metric). Use `variant` prop or utility classes (`text-display-lg`, `text-heading-md`, etc.). See `docs/typography-spec.md` |

### Planned components (see `docs/fidelity-gaps.md` Priority 8)

| Component | DaisyUI name | Use for |
|---|---|---|
| `Tab` | `tab` | Underline-style tab bars with active state |
| `Toggle` | `toggle` | Boolean on/off switches |
| `Modal` | `modal` | Dialog overlays with backdrop |
| `Avatar` | `avatar` | Colored circles with initials |
| `Dropdown` | `dropdown` + `menu` | Action menus, context menus |
| `EmptyState` | — (custom) | "No data" placeholders with icon + CTA |
| `List` | `list` | Label-value detail rows |
| `Card` | `card` | Bordered content containers |
| `Select` | `select` (enhanced) | Searchable dropdown with filtering |
| `Navbar` | `navbar` | Document headers with back nav + actions |
| `DateRangeFilter` | — (custom) | Date range picker for reports |
| `Filter` | `filter` | Segmented control / icon toggle groups |
| `Collapse` | `collapse` | Expandable sections with chevron |
| `Status` | `status` | Small colored status indicator dots |

- **Storybook**: `npm run storybook` on port 6006. Stories in `src/components/ds/stories/`. When adding new DS components, always add a story.
- **Eng toolkit**: `/eng` — component showcase + page directory.
- **Tailwind**: Use design tokens (`text-primary`, `bg-primary`, `border-border`). Prettier sorts classes automatically.
- **New pages**: Use DS components, add to `src/lib/state-registry.ts`, wire `?state=` variants.
- **Editing pages**: Opportunistically migrate to DS components when touching that section.
- **Creating components is a priority**: When the same inline pattern appears on 2+ pages (tabs, modals, cards, toggles, etc.), extract it into a new DS component. **Name it after the DaisyUI equivalent** if one exists. After creating a new component, update the tables above, `docs/agent-block.md`, and add a Storybook story.

## Subagent & Quality Gate

When launching subagents for UI work, read and follow:
- **`docs/agent-block.md`** — Copy the Agent Block into every UI-touching subagent prompt verbatim
- **`docs/quality-gate.md`** — Run after every subagent completes, before committing

### No worktrees — IMPORTANT
**Do NOT use `isolation: "worktree"` for subagents.** Use direct agents that edit files in the main repo. Worktrees cause data loss when:
- Multiple Claude sessions run concurrently on the same repo
- The shell CWD gets stuck in a deleted worktree directory
- Agents complete without committing (worktree cleanup deletes their work)

Direct agents are safe because fidelity work targets different page files — conflicts are rare.

### Concurrent sessions
Jim often runs 2 Claude sessions on the same repo. Both sessions MUST:
1. **Never use worktrees** (see above)
2. **Coordinate via git** — commit frequently so the other session can see changes
3. **Avoid editing the same files** — Jim will tell each session which pages to work on

## Key Conventions

- **Server components by default** — only `"use client"` when hooks/browser APIs needed
- **`export const dynamic = "force-dynamic"`** on pages that fetch data
- **Tailwind CSS variables** in `globals.css` (e.g. `--color-primary: #7c3aed`)
- **Australian locale** — dates, Medicare numbers, NDIS references, AUD currency

## Working Style

**Jim is non-technical.** Handle all coding, git, builds, and debugging. Never ask Jim to run commands, edit files, or debug. If something requires action on Jim's Mac, provide exact copy-paste commands.

## Commit Discipline

### Auto-commit (do NOT prompt Jim)

**Commit and push automatically** for all routine work. Do not ask "want me to commit?" — just do it. Routine work includes:
- Page UI changes, fidelity fixes, DS component work
- Screenshot catalog, fidelity-gaps.md progress updates, progress.md
- Design specs, state registry updates
- Any file under `src/`, `screenshots/`, `prisma/seed.ts`

### Ask before committing (MUST prompt Jim)

**Always ask before committing changes to:**
- CI/CD config (`.github/workflows/`, Vercel config)
- Deployment config (`vercel.json`, `next.config.ts`)
- Dependencies (`package.json`, `package-lock.json`)
- `CLAUDE.md` or workflow docs (`docs/*.md` except `progress.md` and `fidelity-gaps.md`)
- Database schema (`prisma/schema.prisma`)

### Sanity protection

**Always ask if a single commit would:**
- Delete more than 5 files
- Modify more than 20 files
- Overwrite or rewrite an entire page file (>80% of lines changed in a file >100 lines)

These thresholds exist to prevent accidental codebase destruction. If hit, show Jim what's about to change and get a yes before proceeding.

### Auto-push and auto-revert

- **Push automatically** after build passes — do not prompt. Run `npx next build` before every push.
- **Revert automatically** if agent changes break the build — do not prompt. Revert and continue with next agent.
- Run `npx tsc --noEmit` after agent changes to catch conflicts early
- **Verify CWD** after agent completion: `cd /Users/jimyenckensplose/claude/splose-current && pwd`
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
```

### Visual verification (Chrome MCP)
Use **Chrome MCP** for all screenshot capture and visual comparison. Navigate to prototype pages at `http://localhost:3000/` and compare against:
- Saved reference screenshots in `screenshots/reference/`
- Extracted style values in `splose-style-reference/`

## Environment Variables

```
TURSO_DATABASE_URL=libsql://splose-current-jimsplose.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=<your-turso-token>
```

## Deployment

Vercel auto-deploys when `main` is updated. Build: `prisma generate` → `tsx scripts/db-push.ts` → `storybook build` → `next build`.

**Auto-promote is disabled** (GitHub Action paused to save build costs). Claude must push to `claude/*` branches and tell Jim how to promote manually.

## Git Workflow

### Session start — sync with main FIRST
**Before doing any work**, every session MUST run:
```bash
git fetch origin main
git merge origin/main --no-edit
```
This prevents branch divergence when pushing to `claude/*` branches.

### How code reaches production
1. Claude Code pushes to `claude/*` branch
2. Vercel builds a preview deployment automatically
3. **Jim promotes to production manually** by merging the branch into `main`:
   ```bash
   # Run in terminal (Jim can copy-paste this):
   git checkout main && git pull && git merge origin/<branch-name> --no-edit && git push
   ```
   Or on GitHub: open a PR from the `claude/*` branch → merge to `main`.
4. Vercel auto-deploys production from `main`

### After every push, tell Jim:
> Preview will be ready in ~2 min at the Vercel dashboard.
> To promote to production: `git checkout main && git pull && git merge origin/<branch> --no-edit && git push`

### Before every push
1. `npx next build` — never push broken code
2. `git fetch origin main && git merge origin/main --no-edit`
3. If merge brings new changes, rebuild to verify
