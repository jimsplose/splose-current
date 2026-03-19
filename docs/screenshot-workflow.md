# Screenshot Workflow

## How it works

Jim uploads screenshots directly in the chat. Claude saves them to `screenshots/reference/`, catalogs them, and creates fidelity gaps — all in one flow.

## Step 1: Receive and save screenshots

When Jim uploads screenshot images in the chat:

1. **Read each uploaded image** using the Read tool to view its contents
2. **Ask Jim** (if not obvious from the image) which page/feature each screenshot shows. Use AskUserQuestion with options like the page routes, or let Jim type a description.
3. **Generate a filename** based on the page and current date:
   - Format: `Screenshot YYYY-MM-DD at H.MM.SS am.png` (matching existing convention)
   - Or use a descriptive name if Jim provides one
4. **Save to `screenshots/reference/`** using bash `cp` from the temp upload path:
   ```bash
   cp /path/to/uploaded/image.png "screenshots/reference/<filename>.png"
   ```
5. **Confirm to Jim** which files were saved and where

### If Jim uploads many screenshots at once
- Process them in batches — save all first, then catalog all
- Ask Jim once for context ("which pages are these from?") rather than per-image

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
3. **Set the Match column** by comparing against the current prototype:
   - Read the prototype page source code (or take a Playwright screenshot if available)
   - "yes" — prototype matches the reference
   - "partial" — some elements match (add note: `partial — missing dropdown`)
   - "no" — doesn't match or page doesn't exist yet
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

## Step 4: Update state registry

If `src/lib/state-registry.ts` exists, add entries for new states/variants/modals discovered in the screenshots.

## Step 5: Commit and push

**MUST commit and push** before moving on. This preserves the work even if the session ends.

```bash
git add screenshots/reference/ screenshots/processed.txt screenshots/screenshot-catalog.md docs/fidelity-gaps.md
git commit -m "Add N new reference screenshots, catalog and create gaps"
```

## Step 6: Offer to start fidelity work

After committing, ask Jim:
> "I've saved N screenshots and created N new fidelity gaps. Want me to start working on the highest-priority gaps now?"

If yes, switch to the fidelity loop workflow (`docs/fidelity-workflow.md`).

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
