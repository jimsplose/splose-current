# Screenshot Workflow

This file covers two menu options: **Upload screenshots (2)** and **Process screenshots (3)**.

## Upload vs Process — two separate steps

- **Upload (menu option 2)**: Jim provides new screenshot files. Save them to `screenshots/reference/`. That's it — do NOT catalog or create gaps yet.
- **Process (menu option 3)**: Read uncataloged screenshots, determine what page/feature they show, add them to the catalog, and create fidelity gaps for mismatches.

These are intentionally separate because Jim may upload screenshots in one session and process them in another.

## Reference screenshots

Located in `screenshots/reference/`. These are the design targets — screenshots of the real Splose app.

## Naming conventions
- `Screenshot YYYY-MM-DD at H.MM.SS am/pm.png` — taken from macOS screenshot tool
- `screencapture-acme-splose-<path>-YYYY-MM-DD-HH_MM_SS.png` — taken from browser capture (path hints at the page)
- **Unicode issue**: Some filenames contain unicode narrow no-break space (`\u202f`) before am/pm. If the Read tool can't open a file, try URL-encoding the filename or using a glob pattern to match it.

Files are NOT organized by page — you must read them to determine which page/feature they show.

## Processing Steps

When the user selects "Process screenshots" (menu option 3):

### 1. Scan for unprocessed screenshots
Compare the full list in `screenshots/reference/` against `screenshots/processed.txt` (a log of already-reviewed filenames).

### 2. Review new screenshots in parallel
Launch Explore agents to read batches of 10-15 new screenshots and categorize them by page/feature.

### 3. MANDATORY: Update both output files
Every screenshot processing run MUST update these two files:

- **`screenshots/processed.txt`** — Append every reviewed filename (even if no code changes were made) so future sessions skip them
- **`screenshots/screenshot-catalog.md`** — A markdown lookup table organizing all screenshots by page/feature/state. Each entry has:
  - Filename
  - Page it belongs to (route path)
  - State/variant shown (e.g. "modal open", "tab selected", "dropdown expanded")
  - Whether the prototype already matches it (yes/partial/no)

Create these files if they don't exist.

### 4. Update state registry (if it exists)
If `src/lib/state-registry.ts` exists, add entries for every new state/variant/modal discovered. If it doesn't exist yet, the screenshot catalog serves as the source of truth until the Dev Navigator is built.

### 5. Update fidelity gaps — CRITICAL

**Every catalog entry with Match = "no" MUST have a corresponding open gap in `docs/fidelity-gaps.md`.** This is not optional.

For each new screenshot cataloged:
1. Compare the reference screenshot against the current prototype page (take a Playwright screenshot if browsers available, or read the page source code)
2. Set the Match column honestly: "yes" (matches), "partial" (some elements match), or "no" (doesn't match)
3. For every "no" or "partial" entry, ensure there is an **unchecked `[ ]` gap** in `docs/fidelity-gaps.md`
4. Group related screenshots into a single gap (e.g. all Settings > Tags screenshots = one gap)
5. Include specific notes on what's missing or wrong

**Do NOT mark a gap as `[x]` just because the page exists.** A gap is only done when ALL its catalog entries show Match = "yes" after visual verification.

### 6. Commit the catalog and processed.txt
**MUST commit and push** the updated catalog and processed.txt before moving on to implementation. This preserves the work even if the session ends.

### 7. Implement changes
Use the parallel subagent workflow (see `docs/fidelity-workflow.md`) to update pages to match.

## The screenshot catalog as a bridge
`screenshots/screenshot-catalog.md` connects screenshot processing to the Dev Navigator. When the Dev Navigator is built (option 4), it reads this catalog to populate the state registry. Options 2 and 4 work independently but feed into each other.

## When working on UI fidelity
1. Read the relevant screenshot(s) from `screenshots/reference/`
2. Compare against the current prototype page source code
3. Adjust layout, spacing, colors, typography, component structure, and interactivity to match
4. Pay attention to: modals, dropdowns, hover states, tab switching, expandable rows, form fields, and other interactive elements
5. Verify build, commit, and push changes
