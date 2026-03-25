# Worktree Safety Guardrails

Git worktrees are re-enabled for subagent isolation, with strict safety rules to prevent the data loss that occurred in the 2026-03-19 sessions. The three original failure modes were: (1) concurrent worktree creation corrupting `.git` metadata, (2) shell CWD getting stuck in deleted worktree directories, (3) agents not committing before worktree cleanup.

## Rule 1: Sequential Creation Only

**CRITICAL.** Never create two worktrees at the same time across sessions.

Before creating a worktree, the main agent MUST run:
```bash
git worktree list
```
If it shows anything besides the main working tree, STOP — another session has an active worktree. Use direct agents (no isolation) instead.

## Rule 2: Agents Must Commit

**CRITICAL.** Any agent using `isolation: "worktree"` MUST `git commit` before exiting.

Uncommitted work is lost when the worktree is cleaned up. Include this in every worktree agent prompt:
> Before you finish, you MUST run: `git add -A && git commit -m "<summary of changes>"`

## Rule 3: Main Agent Verifies and Merges

After a worktree agent completes:

1. Check the agent's output for the worktree path and branch name
2. Run the quality gate (`docs/quality-gate.md`) on the agent's changes
3. If all checks pass: merge the agent's branch back
4. If any check fails: discard the agent's changes
5. Run `git worktree prune` to clean up

## Rule 4: Sequential Same-File Edits

If multiple agents need to edit the same file:

- Agent 1 (worktree) → completes, commits, main agent merges
- Agent 2 (worktree) → starts ONLY after Agent 1's worktree is cleaned up
- Never have two worktree agents modifying the same file simultaneously

For edits to different files: use direct agents in parallel (no worktree needed — conflicts are rare).

## Rule 5: Sync Before Creation

Before creating a worktree, sync to latest main:
```bash
git fetch origin main && git merge origin/main --no-edit
```

## Rule 6: CWD Verification After Agent Exit

After any worktree agent completes, immediately verify:
```bash
cd /Users/jimyenckensplose/claude/splose-current && pwd
```
If the output is wrong, the shell is stuck in a deleted worktree directory. All subsequent file operations will target the wrong path.

## When to Use Worktrees

**Use worktrees when:**
- An agent needs to experiment without affecting the shared working tree
- Sequential edits to the same file by multiple agents

**Use direct agents (no worktree) when:**
- Multiple agents edit different files (parallel OK, conflicts rare)
- A single agent is doing the work
- Speed is critical (worktrees add overhead)

## Failure Recovery

If git corruption is detected (`git worktree list` shows orphaned entries, or `git status` errors):

1. Stop all Claude sessions on this repo
2. Run: `git worktree prune`
3. Verify: `git status` should work normally
4. If still broken: `git worktree list` and manually remove any orphaned worktree directories
