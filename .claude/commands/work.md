Pick up the next issue from the work queue and execute it to completion.

If invoked with a number (`/work 9`), use that issue. If invoked with multiple numbers (`/work 9 10 11`) or the word `all` or `continuously`, set **multi-issue mode** (skip post-task queue display; proceed immediately to the next target after each completion).

---

## Session start

**Step 1 — Read the queue**

```bash
gh issue list --state open --json number,title,labels,body --limit 30
```

**Step 2 — Build and display the queue status**

For each open issue, determine its status:
- **Ready** — no "Depends on" field, or all listed dependencies are closed
- **Blocked** — one or more dependencies are still open (show which issue is blocking it)

Display a table like this:

```
#   Title                              Status      Labels
──────────────────────────────────────────────────────────
12  Migrate CalendarView to DS tokens  ✅ Ready     ds-migration
14  Fix invoice batch preview layout   ✅ Ready     fidelity
17  Update ClientDetail sidebar        🔒 Blocked   ds-migration  (needs #12)
19  Add payment status badge           ✅ Ready     fidelity
```

Then state your suggestion:

> **Suggested start: #N — [title]**
> _[One sentence on why: lowest unblocked, or matches a specific label priority, etc.]_

**Step 3 — Wait for confirmation**

Ask Jim (single question, one line):

> Start with #N, pick a different issue, or stop? [N / <number> / stop]

Wait for a response before proceeding. If Jim names a specific number, use that. If Jim says "stop", exit. If Jim confirms or says nothing unexpected, proceed with #N.

**Step 4 — Load issue context**

```bash
gh issue view <number> --json title,body,labels
```

Read the full body. Extract:
- What files are in scope
- What the migration pattern is
- What the acceptance criteria are
- What the session progress log says (don't redo completed work)

**Step 5 — Pre-flight checks**

```bash
git log --oneline -5          # check for WIP commits that touch the target files
git status                    # confirm clean working tree
npx tsc --noEmit 2>&1 | head -5   # confirm baseline is clean
```

If prior commits already touched the target files, read what was done and continue from that point — do not redo it.

**Step 5b — Capture production baselines (fidelity/layout issues only)**

For issues labeled `fidelity` or any issue that changes layout, spacing, or visual structure: before touching any code, take production screenshots of all affected pages via Chrome MCP at 1440×900. Save them as mental (or file) baselines so you have something to diff against after changes. This is the only way to catch regressions in visual work — you cannot compare against "before" if you didn't capture it.

**Step 6 — Announce and start**

Show Jim:
- Issue number + title
- Scope summary (how many files, what the change is)
- Any already-done work from the progress log
- Estimated session scope

Then start immediately.

---

## During the session

**One commit per logical chunk** (per file or per route group — see individual issue for guidance). Commit message format:

```
feat(issue-N): brief description of what changed

- File 1: what changed
- File 2: what changed

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

**After each file group:**
- Run `npx tsc --noEmit` — fix any errors before continuing
- Don't batch errors across too many files

**Verification strategy (choose based on issue type):**

| Issue type | Primary signal | Chrome MCP coverage |
|---|---|---|
| `ds-migration` / prop-mapping | `npx tsc --noEmit` — TypeScript catches incorrect props, wrong types, missing required props | 1 page per 10 files changed (min 1, max 5) |
| `fidelity` / layout / visual | Chrome MCP dual-tab measurement | All affected pages |
| Refactor / non-visual | TypeScript + build | None required |

**For `ds-migration` issues specifically:** Prop-mapping changes are functionally equivalent when TypeScript passes — the component renders identically because the prop maps to the same AntD output. TypeScript is comprehensive here; visual spot-checking confirms nothing unexpected slipped through. Don't skip it, but don't over-invest either.

**Chrome MCP verification** rules (when required per table above):
- Claim a tab group first (`tabs_context_mcp` with `createIfEmpty: true`)
- Resize to 1440×900
- **Always dual-tab: production `acme.splose.com` side-by-side with `localhost:3000`**. Localhost-only verification is not enough — you need a reference to know what "correct" looks like. See `docs/quality-gate.md` for the measurement loop.
- Scale spot-check page count to scope: 3 pages is not enough for a 100-file migration. Sample pages from different feature areas (calendar, clients, settings, invoices).

---

## Session finish

**Step 1 — Run acceptance criteria**

For each checkbox in the issue's acceptance criteria, verify it. Run the grep commands specified. Run `npx tsc --noEmit`. Run `npx next build` if the issue requires it.

For issues with Chrome MCP verification required (see table in "During the session"): confirm you completed the dual-tab production vs localhost comparison for the required number of pages. If you skipped it, do it now before closing.

**Step 2 — Update the issue's session progress log**

```bash
gh issue comment <number> --body "## Session $(date +%Y-%m-%d)

**Completed:**
- [list what was done]

**Remaining:**
- [list what's left, or 'All acceptance criteria met']

**Build status:** tsc ✓ / build ✓ (or note any failures)"
```

**Step 3 — If all acceptance criteria are met: close the issue**

Ask Jim: "All criteria for #N are met — close it?"

On yes:
```bash
gh issue close <number> --comment "All acceptance criteria met. Closed."
```

**Step 4 — Push**

```bash
git push
```

**Step 5 — Queue status + next step** _(skip this step in multi-issue mode)_

Refresh the queue:

```bash
gh issue list --state open --json number,title,labels,body --limit 30
```

Display the updated queue table (same format as Session start Step 2) showing which issues are now Ready vs Blocked after closing #N.

State a suggestion for what to do next:

> **Suggested next: #N+1 — [title]**
> _[One sentence on why.]_

Then ask Jim (single question):

> Pick up #N+1, choose a different issue, or stop? [N+1 / <number> / stop]

In multi-issue mode: if more targets remain in the original list, proceed immediately. If the list is exhausted, show the queue summary and stop.

---

## Rules

- **Never start an issue whose dependencies aren't all closed.** Show Jim the blocking issue number and ask which to work on instead.
- **Never close an issue unless all its acceptance criteria checkboxes are verifiable.** Partial work → leave open with a progress comment.
- **Don't skip Chrome MCP verification** for visual work. If Chrome MCP is unavailable, stop and troubleshoot.
- **Chrome MCP must be dual-tab** (production `acme.splose.com` + localhost). Localhost-only is not verification — it tells you the page renders, not whether it matches production.
- **TypeScript is the primary regression signal for prop-migration issues**, not Chrome MCP. Zero TypeScript errors after migration means the props map correctly. Chrome MCP is still required for a proportional spot-check to catch anything TypeScript can't see.
- **Scale Chrome MCP coverage to scope**: 3 pages for a 100-file migration is insufficient. Sample at least 1 page per 10 files (min 1, max 5), across different feature areas.
- **Don't redo work** already logged in the session progress log. Read it before starting.
- **Keep the README.md queue table accurate.** If you notice it's out of sync with GitHub (closed issues still showing as active), update it.
