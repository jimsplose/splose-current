Commits and deployment management. Show this sub-menu:

- **Check recent commits** — Run `git log --oneline -10` and summarise
- **Check deployment status** — Run `gh run list --workflow=deploy.yml --limit=5` and summarise
- **Deploy to production** — Full flow: merge branch → main, trigger `deploy.yml` workflow

**Deploy requires Jim's express permission.** Before deploying:
1. Confirm branch name and show what will be deployed
2. Merge to main: `git checkout main && git pull && git merge origin/<branch> --no-edit && git push`
3. Trigger deploy: `gh workflow run deploy.yml --ref main`
4. Share run URL: `gh run list --workflow=deploy.yml --limit=1`

**NEVER deploy without explicit approval.** If Jim just wants to check status, show status only.
