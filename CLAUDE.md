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
> 5. **Visual audit** — Take fresh screenshots of implemented pages, compare against references, update Match status in catalog, and reopen/create gaps for anything that doesn't match. Follow `docs/visual-audit-workflow.md`
> 6. **Something else** — Free-form request

**Do NOT skip this step. Do NOT start working without the user's menu selection.**

### Lifecycle overview

The full fidelity workflow is a pipeline. Each menu option maps to a stage:

```
Upload → Process → Fidelity loops → Visual audit → (repeat)
  (2)      (3)         (4)              (5)
```

- **Upload** adds raw screenshots to `screenshots/reference/`
- **Process** catalogs them in `screenshots/screenshot-catalog.md` and creates gaps in `docs/fidelity-gaps.md` for every "no" match
- **Fidelity loops** implements code changes to close those gaps
- **Visual audit** verifies the work actually matches, updates the catalog Match column, and reopens/creates gaps for anything still wrong

A gap is only truly done when its catalog entries all show Match = "yes".

## Workflow Files (RAG)

**ALWAYS read the relevant instruction file before starting a workflow.** Do not rely on memory of these files from previous sessions.

| Workflow | Read first |
|---|---|
| Review status | `docs/progress.md`, `docs/fidelity-gaps.md` |
| Upload screenshots | `docs/screenshot-workflow.md` |
| Process screenshots | `docs/screenshot-workflow.md` |
| Fidelity improvements | `docs/fidelity-gaps.md`, `docs/fidelity-workflow.md` |
| Visual audit | `docs/visual-audit-workflow.md`, `screenshots/screenshot-catalog.md` |
| Dev Navigator | `docs/dev-navigator-spec.md` |
| Understanding the codebase | `docs/project-structure.md` |

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript (strict), Turso/Prisma 7, Tailwind CSS 4, Lucide icons, Vercel hosting.

## Viewing Changes — Vercel Preview URLs

Every push to any branch gets a **Vercel preview deployment**. This is how Jim reviews changes.

- **Vercel dashboard**: https://vercel.com/jimyencken-4159s-projects/splose-current
- **Production** (main branch): `https://splose-current-git-main-jimyencken-4159s-projects.vercel.app`

**After every push**, Claude Code MUST:
1. Link Jim to the Vercel dashboard: https://vercel.com/jimyencken-4159s-projects/splose-current
2. Tell him the most recent preview will be available there once it finishes building (1-2 minutes)
3. Take 1-2 Playwright screenshots of the most significant page changes and show them inline in chat
4. Production auto-updates after preview build succeeds (via GitHub Action) — no manual step needed

## Design System

### Component Library (`src/components/ds/`)

**ALWAYS use design system components instead of inline Tailwind for common patterns.** Import from `@/components/ds`.

| Component | Use for | Replaces |
|---|---|---|
| `Button` | All buttons (primary/secondary/danger/ghost, sm/md/lg) | Inline `rounded-lg border bg-white px-4 py-2...` |
| `PageHeader` | Page title + action buttons | Inline `flex items-center justify-between mb-4` + `text-2xl font-bold` |
| `SearchBar` | Search input + button combos | Inline `h-10 flex-1 rounded-lg border...` + search button |
| `DataTable` | Table wrapper with overflow scroll | Inline `overflow-x-auto rounded-lg border bg-white` |
| `TableHead/Th` | Table headers with purple bg | Inline `bg-purple-50` headers |
| `TableBody/Td` | Table body rows with dividers | Inline `divide-y divide-border` + cell padding |
| `Pagination` | Table pagination footer | Inline pagination with page buttons |
| `Badge` | Status pills and tags | Inline `rounded-full px-2 py-0.5 text-xs font-medium bg-green-100...` |
| `FormInput` | Labeled text inputs with error states | Inline `rounded-lg border bg-white px-3 py-2 text-sm focus:border-primary...` |
| `FormSelect` | Labeled select dropdowns | Inline `<select>` with focus styles |

### Storybook

**`npm run storybook`** — Runs Storybook on port 6006 with all DS components documented:
- Button, Badge, PageHeader, SearchBar, DataTable, FormInput, FormSelect, Pagination
- Each component has multiple stories showing variants and states
- Stories live in `src/components/ds/stories/`

**When adding new DS components**, always add a Storybook story file.

### Eng Toolkit Page

**`/eng`** — Secret internal page for engineers. Shows:
- Live component showcase with code examples
- Directory of all app pages with links

### Tailwind CSS Practices

- **Prettier sorts classes** — `prettier-plugin-tailwindcss` is installed. Run `npx prettier --write` to sort classes.
- **Use design tokens** from `globals.css` (`text-primary`, `bg-primary`, `border-border`, `text-text`, `text-text-secondary`) — avoid hardcoded colors like `text-gray-700` when a token exists.
- **Responsive pattern**: Use `p-4 sm:p-6` for page padding, `hidden md:table-cell` for table columns, `flex-col sm:flex-row` for header layouts.
- **When creating new pages**, use the DS components. Don't inline common patterns. Also:
  - Add the page to `src/lib/state-registry.ts` (Dev Navigator)
  - Add interactive variants with `?state=` wiring
- **When editing existing pages**, opportunistically migrate to DS components if touching that section anyway.
- **When adding DS components**, create a Storybook story in `src/components/ds/stories/`.

## Subagent Prompt Template — MANDATORY

**Every subagent that creates or modifies page UI MUST receive this block at the top of its prompt.** Do NOT launch a UI-touching subagent without it. This is a single, self-contained block that covers DS enforcement AND screenshot verification — no need to assemble from multiple sections.

**Copy everything between the `---START AGENT BLOCK---` and `---END AGENT BLOCK---` markers into every subagent prompt verbatim.**

```
---START AGENT BLOCK---

## Design System — MANDATORY

You MUST use DS components from `@/components/ds` instead of inline Tailwind for these patterns.
Failure to do so creates tech debt that must be cleaned up later.

| Instead of | Use |
|---|---|
| `<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white...">` | `<Button variant="primary">` |
| `<button className="rounded-lg border border-border bg-white px-4 py-2...">` | `<Button variant="secondary">` |
| `<button className="border border-red-... text-red-600...">` | `<Button variant="danger">` |
| `<div><label className="...">Name</label><input className="w-full rounded-lg border..."/></div>` | `<FormInput label="Name" />` |
| `<div><label>...</label><select className="..."><option>...</select></div>` | `<FormSelect label="..." options={[...]} />` |
| `<span className="rounded-full px-2 py-0.5 text-xs font-medium bg-green-100...">` | `<Badge variant="green">` |
| `<div className="flex items-center justify-between mb-4"><h1 className="text-2xl font-bold">` | `<PageHeader title="...">` |

Import: `import { Button, FormInput, FormSelect, Badge, PageHeader } from "@/components/ds";`

### Banned patterns — do NOT write these:
- `const inputClass = "w-full rounded-lg border..."` — use `<FormInput>` instead
- `const labelClass = "block text-sm font-medium..."` — `<FormInput label="">` includes the label
- Inline badge styles (`rounded-full px-2 py-0.5 text-xs font-medium`) — use `<Badge>`
- Inline button styles (`rounded-lg bg-primary px-4 py-2 text-sm font-medium`) — use `<Button>`

### When DS components don't fit:
- Tiny icon-only toolbar buttons (rich text editors) — inline is fine
- Tab switcher buttons with active/inactive states — inline is fine (no DS Tab component yet)
- Toggle switches — use the local `Toggle` component pattern
- Custom layouts (sidebars, cards, modals) — inline is fine, no DS component for these yet

## Screenshot Verification Loop — MANDATORY

After making your code changes, you MUST run this loop. Do NOT skip it.

1. Run `npx playwright screenshot --wait-for-timeout=2000 http://localhost:3000/<page-path> /tmp/screenshot-<page>.png`
2. Read the screenshot using the Read tool (it supports images)
3. Read the reference screenshot from `screenshots/reference/<relevant-file>`
4. Compare visually — does the layout, spacing, colors, and content match?
5. If not, make additional changes and repeat (up to 3 iterations)
6. On final iteration, save the screenshot to `/tmp/screenshot-<page>-final.png`

---END AGENT BLOCK---
```

## Post-Agent Quality Gate — MANDATORY

**After EVERY subagent completes and BEFORE committing its work, the main agent MUST run these checks.** This is not optional. Do not batch — run the gate after each individual agent.

### Step 1: DS Violation Scan

Run this grep on the agent's changed files. If any matches are found, fix them before committing.

```bash
# Run on each changed .tsx file from the agent
npx grep -E "const (inputClass|labelClass)|rounded-full px-2 py-0\.5 text-xs font-medium|rounded-lg bg-primary px-4 py-2 text-sm font-medium" <changed-file.tsx>
```

Red flags to scan for:
1. `const inputClass` or `const labelClass` — should be `<FormInput>` / `<FormSelect>`
2. `rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white` — should be `<Button variant="primary">`
3. `rounded-lg border border-border bg-white px-4 py-2` — should be `<Button variant="secondary">`
4. `rounded-full px-2 py-0.5 text-xs font-medium` — should be `<Badge>`
5. A `.tsx` page with `<button` or `<input` tags but no import from `@/components/ds` — likely missed migration

### Step 2: TypeScript Check

```bash
npx tsc --noEmit
```

If it fails, fix or revert the agent's changes before continuing.

### Step 3: Screenshot Verification (main agent)

If the agent changed page UI:
1. Take a Playwright screenshot of the changed page
2. Read it with the Read tool
3. Compare to the reference screenshot from `screenshots/reference/`
4. If the result looks wrong, fix the code before committing

### Step 4: Commit or Revert

- If all checks pass → commit the agent's changes
- If any check fails and can't be fixed quickly → revert the agent's changes and move on

## Post-Push Screenshots — MANDATORY

After every push that includes visual changes, the main agent MUST:

1. Take 1-2 Playwright screenshots of the most significant page changes:
   ```bash
   npx playwright screenshot --wait-for-timeout=3000 http://localhost:3000/<changed-page> /tmp/progress-<page>.png
   ```
2. Read and display them inline in chat so Jim can see progress immediately
3. Tell Jim the branch preview URL

### When to skip screenshots

- Infrastructure-only changes (config, tooling, docs)
- Changes with no visual impact (type fixes, refactoring with identical output)
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
4. **Update** `docs/fidelity-gaps.md` — only check off gaps whose catalog entries ALL show Match = "yes". Add any newly discovered gaps.
5. **Update** `screenshots/screenshot-catalog.md` — update Match column for any pages that were changed this session
6. **Tell Jim** the preview URL so he can review

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
