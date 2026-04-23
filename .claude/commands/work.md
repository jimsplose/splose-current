Pick up the next issue from the work queue and execute it to completion.

## Session start

**Step 1 — Read the queue**

```bash
gh issue list --state open --json number,title,labels --limit 30
```

Display all open issues ordered by number. This is the authoritative queue — README.md mirrors it but GitHub is the source of truth.

**Step 2 — Find the next unblocked issue**

An issue is unblocked when all issues listed in its "Depends on" field are closed. Check each dependency:

```bash
gh issue view <number> --json state,title
```

The lowest-numbered open issue with all dependencies closed is the target. If the user named a specific issue number (e.g. `/work 9`), use that instead — still verify dependencies before starting.

**Step 3 — Load issue context**

```bash
gh issue view <number> --json title,body,labels
```

Read the full body. Extract:
- What files are in scope
- What the migration pattern is
- What the acceptance criteria are
- What the session progress log says (don't redo completed work)

**Step 4 — Pre-flight checks**

```bash
git log --oneline -5          # check for WIP commits that touch the target files
git status                    # confirm clean working tree
npx tsc --noEmit 2>&1 | head -5   # confirm baseline is clean
```

If prior commits already touched the target files, read what was done and continue from that point — do not redo it.

**Step 5 — Announce**

Show Jim:
- Issue number + title
- Scope summary (how many files, what the change is)
- Any already-done work from the progress log
- Estimated session scope

Then start immediately — don't ask for confirmation unless a dependency is unmet.

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

**Chrome MCP verification** is required for any change that touches visual appearance. Per `docs/quality-gate.md`:
- Claim a tab group first (`tabs_context_mcp` with `createIfEmpty: true`)
- Resize to 1440×900
- Verify on localhost vs production dual-tab for any layout change

---

## Session finish

**Step 1 — Run acceptance criteria**

For each checkbox in the issue's acceptance criteria, verify it. Run the grep commands specified. Run `npx tsc --noEmit`. Run `npx next build` if the issue requires it.

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

**Step 5 — Report to Jim**

- What was completed
- Issue closed or still open (and what remains)
- Whether the next issue (#N+1) is now unblocked
- Ask: "Run the next issue (#N+1) or stop here?"

---

## Rules

- **Never start an issue whose dependencies aren't all closed.** Show Jim the blocking issue number and ask which to work on instead.
- **Never close an issue unless all its acceptance criteria checkboxes are verifiable.** Partial work → leave open with a progress comment.
- **Don't skip Chrome MCP verification** for visual work. If Chrome MCP is unavailable, stop and troubleshoot.
- **Don't redo work** already logged in the session progress log. Read it before starting.
- **Keep the README.md queue table accurate.** If you notice it's out of sync with GitHub (closed issues still showing as active), update it.
