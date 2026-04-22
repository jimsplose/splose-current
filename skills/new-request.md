# New Request Skill

Use this skill when Jim wants to create a design request from Claude Code without opening the browser.

## What it does

Creates a GitHub Issue with `from-jim` label using the `gh` CLI (which is authenticated as `jimsplose`).

## Steps

1. Ask Jim: "What's the title of the request?" (one line)
2. Ask Jim: "What type? page / component / pattern / workflow / other"
3. Ask Jim: "Brief description of what needs to be built or changed?"
4. Ask Jim: "Priority? minor / moderate / major"

Then run:

```bash
gh issue create \
  --repo jimsplose/splose-current \
  --title "[<type>] <title>" \
  --body "**Type:** <type>
**Priority:** <priority>

<description>" \
  --label "from-jim,<type-label>,<priority>"
```

Where `<type-label>` maps as: page→new-page, component→missing, pattern→missing, workflow→workflow, other→from-jim.

Report the created issue URL to Jim.
