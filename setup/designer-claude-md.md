## Design Review Tools (Designers)

This replica includes capture tools accessible via the **Dev Navigator** (bottom-right ◆ Nav button, or Ctrl+Shift+N).

### Bugshot — capture a region

Click **Bugshot** in the Dev Navigator footer. Drag to select the problem area, choose an intent:
- **bug** — something looks wrong in the replica
- **missing** — this exists in production but not here
- **remove** — this is in the replica but shouldn't be

Add a description, tags, severity, then click **Submit issue** — this creates a GitHub Issue automatically and downloads a PNG screenshot.

### Page Capture — capture a full page or workflow

Click **🗂 Page Capture** in the Dev Navigator footer. Choose:
- **New page** — captures the full current page (DOM, styles, content) as a GitHub Issue
- **Workflow** — starts a session badge; navigate through a multi-step flow and click "Capture step" at each screen

### Bookmarklet — capture from production (acme.splose.com)

Use the Splose Capture bookmarklet in Chrome to trigger region and page capture directly on the production site. The bookmarklet posts to the same issue queue.

### Requests panel

Open Dev Navigator → **Requests** tab to see all open issues, filter by type, add comments, and close issues.
