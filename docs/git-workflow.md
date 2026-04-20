# Git Workflow

Jim runs 2 parallel Claude sessions. Each session gets its own short-lived branch to avoid conflicts.

## Session start

```bash
# 1. Sync main
git checkout main && git pull

# 2. Clean up any stale claude/* branches (merged or no remote)
git fetch origin --prune
git branch | grep 'claude/' | while read b; do
  git branch -d "$b" 2>/dev/null || true  # -d only deletes if merged
done

# 3. Create a session branch (use a short descriptive name)
git checkout -b claude/<short-description>-$(date +%Y%m%d)
```

**Health check:** At session start, `git branch --show-current` must show a `claude/*` branch. If it shows `main`, you haven't created your session branch yet.

**One `claude/*` branch per active session.** If you see stale `claude/*` branches that have no active session, delete them.

## During the session

Push regularly to keep work safe: `git push origin <branch>` (no build required for interim pushes).

Before final merge: `npx next build` must pass.

## After major milestones — ask about deployment

After completing a workflow or batch of fixes, ask Jim:
> "Ready to deploy? I can merge to `main` and trigger a production deployment."

**Only proceed if Jim says yes.** Then run the full deploy flow (see CLAUDE.md "Vercel & Deployment").

## Session end

1. Commit all WIP to session branch
2. Merge session branch to `main`: `git checkout main && git merge --no-edit <branch> && git push origin main`
3. Delete session branch (local + remote): `git branch -D <branch> && git push origin --delete <branch>`
4. Update `docs/progress.md`
5. Ask Jim if he wants to deploy
