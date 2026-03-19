# Screenshot Workflow

## How it works

Jim uploads screenshots directly in the chat (max 5 per message — Claude Code limit). Claude collects all batches, then saves, catalogs, and creates fidelity gaps.

## Step 1: Collect screenshots (multi-batch upload loop)

Claude Code accepts max 5 images per message, so uploads happen in batches.

### For each batch:
1. **Read each uploaded image** using the Read tool to view its contents
2. **Save immediately to `screenshots/reference/`** using bash `cp`:
   ```bash
   cp /path/to/uploaded/image.png "screenshots/reference/<filename>.png"
   ```
3. **Generate a filename** based on the page and current date:
   - Format: `Screenshot YYYY-MM-DD at H.MM.SS am.png` (matching existing convention)
   - Or use a descriptive name if Jim provides context
4. **Confirm what was saved**: "Saved 5 screenshots (settings-details, settings-tags, ...)"
5. **Ask if there are more** using AskUserQuestion:
   > "Got it — N screenshots saved so far. Do you have more to upload?"
   >
   > 1. **Yes, more coming** — I'll wait for the next batch
   > 2. **That's all** — Start cataloging and creating gaps

### Keep looping until Jim says "That's all". Do NOT start cataloging until all batches are received.

### Context gathering
- **Ask Jim once** (not per-image) which pages/features the screenshots cover. Best time: after the first batch, or after all batches are done.
- If the images are clearly recognizable (e.g. settings page with visible nav), skip asking and infer from the screenshot content.
- For `screencapture-acme-splose-<path>` filenames, the path already hints at the route — use it.

### If Jim provides a folder or zip
- Extract/copy all images to `screenshots/reference/`
- Then proceed to cataloging

## Step 2: Catalog new screenshots

After saving, catalog every new screenshot:

1. **Read each new screenshot** with the Read tool to understand what it shows
2. **Add entries to `screenshots/screenshot-catalog.md`** organized by page/route:
   ```markdown
   ## Page Name (`/route`)

   | Filename | State | Match |
   |---|---|---|
   | Screenshot 2026-03-19 at 2.30.00 pm.png | Default view | no |
   ```
3. **Set the Match column** by running pixel diff against the current prototype:
   ```bash
   npx tsx scripts/screenshot-capture.ts http://localhost:3000/<page> /tmp/catalog-<page>.png
   npx tsx scripts/pixel-diff.ts "screenshots/reference/<new-screenshot.png>" /tmp/catalog-<page>.png --threshold=5
   ```
   - "yes" — mismatch <= 5%
   - "partial" — mismatch 5-20% (add note: `partial — 12%, missing dropdown`)
   - "no" — mismatch > 20% or page doesn't exist yet
4. **Append filenames to `screenshots/processed.txt`** so future sessions skip them

### Catalog format rules
- Group by page/route (create new section if needed)
- One row per screenshot
- State column describes what's shown: "default view", "modal open", "dropdown expanded", "tab selected", etc.
- For `screencapture-acme-splose-<path>` filenames, the path hints at the route

## Step 3: Create fidelity gaps

**Every catalog entry with Match = "no" or "partial" MUST have a corresponding open gap in `docs/fidelity-gaps.md`.**

1. Group related screenshots into a single gap (e.g. all Settings > Tags screenshots = one gap)
2. Create an unchecked `[ ]` gap entry with:
   - Page name and route
   - What's missing or wrong (from the comparison)
   - Which screenshots are references
3. Place the gap in the correct priority group (see fidelity-gaps.md header for ordering)

## Step 4: Extract design specs

For each new page that has catalog entries with Match = "no" or "partial", extract a design spec. Follow `docs/design-spec-workflow.md` and save to `screenshots/specs/<page-name>.md`. This gives fidelity agents exact values to implement against.

## Step 5: Update state registry

If `src/lib/state-registry.ts` exists, add entries for new states/variants/modals discovered in the screenshots.

## Step 6: Commit and push

**MUST commit and push** before moving on. This preserves the work even if the session ends.

```bash
git add screenshots/reference/ screenshots/processed.txt screenshots/screenshot-catalog.md screenshots/specs/ docs/fidelity-gaps.md
git commit -m "Add N new reference screenshots, catalog, specs, and create gaps"
```

## Step 7: Return to menu

After committing, show the session start menu again (see CLAUDE.md). Include a summary of what was just done:

> "Done — saved N screenshots, cataloged them, and created N new fidelity gaps."

Then present the menu. Jim will likely pick "Run fidelity loops" next, but let him choose.

---

## Processing previously uploaded screenshots

If there are screenshots in `screenshots/reference/` that aren't in `screenshots/processed.txt`, they were uploaded in a previous session but never cataloged. Process them starting from Step 2 above.

## Naming conventions

Existing screenshots follow these patterns:
- `Screenshot YYYY-MM-DD at H.MM.SS am/pm.png` — macOS screenshot tool
- `screencapture-acme-splose-<path>-YYYY-MM-DD-HH_MM_SS.png` — browser capture (path hints at page)
- **Unicode issue**: Some filenames contain unicode narrow no-break space (`\u202f`) before am/pm. If the Read tool can't open a file, try a glob pattern to match it.

## When working on UI fidelity

1. Read the relevant screenshot(s) from `screenshots/reference/`
2. Compare against the current prototype page source code
3. Adjust layout, spacing, colors, typography, component structure, and interactivity to match
4. Pay attention to: modals, dropdowns, hover states, tab switching, expandable rows, form fields, and other interactive elements
5. Verify build, commit, and push changes
