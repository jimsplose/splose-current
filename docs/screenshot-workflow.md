# Screenshot Workflow

## How it works

Jim uploads screenshots directly in the chat (max 5 per message). Claude collects all batches, then saves, catalogs, and creates fidelity gaps.

## Step 1: Collect screenshots (multi-batch loop)

1. **Read & save each uploaded image** to `screenshots/reference/` using `cp`
2. **Confirm**: "Saved N screenshots (page-a, page-b, ...)"
3. **Ask if more** via AskUserQuestion: "N screenshots saved so far. More to upload?" (Yes / That's all)
4. **Loop until done** — do NOT start cataloging until all batches are received

**Context**: Ask Jim once (not per-image) which pages they cover, or infer from visible UI/filenames. If Jim provides a folder or zip, extract all images to `screenshots/reference/` and proceed.

## Step 2: Catalog new screenshots

1. **Read each screenshot** with the Read tool to understand what it shows
2. **Add entries to `screenshots/screenshot-catalog.md`** grouped by page/route:
   ```markdown
   ## Page Name (`/route`)
   | Filename | State | Match |
   |---|---|---|
   | Screenshot 2026-03-19 at 2.30.00 pm.png | Default view | no |
   ```
3. **Set Match** by comparing prototype (via Chrome MCP) against reference: "yes", "partial" (with note), or "no"
4. **Append filenames to `screenshots/processed.txt`** so future sessions skip them

**Format rules**: One row per screenshot. State column describes what's shown (default view, modal open, dropdown expanded, etc.).

## Step 3: Create fidelity gaps

Every catalog entry with Match = "no" or "partial" MUST have an open gap in `docs/fidelity-gaps.md`.

1. Group related screenshots into a single gap (e.g. all Settings > Tags screenshots = one gap)
2. Create `[ ]` entry with: page name/route, what's wrong, which screenshots are references
3. Place in the correct priority group per fidelity-gaps.md ordering

## Step 4: Extract design specs

For pages with Match = "no" or "partial", extract a design spec per `docs/design-spec-workflow.md`. Save to `screenshots/specs/<page-name>.md`.

## Step 5: Update state registry

Add entries to `src/lib/state-registry.ts` for new states/variants/modals discovered in screenshots.

## Step 6: Commit and push

```bash
git add screenshots/reference/ screenshots/processed.txt screenshots/screenshot-catalog.md screenshots/specs/ docs/fidelity-gaps.md
git commit -m "Add N new reference screenshots, catalog, specs, and create gaps"
```

## Step 7: Return to menu

Show session start menu (see CLAUDE.md) with summary: "Done — saved N screenshots, cataloged them, created N new fidelity gaps."

---

**Previously uploaded screenshots**: If files exist in `screenshots/reference/` but not in `screenshots/processed.txt`, process them starting from Step 2.

---

# Refresh Reference Screenshots from Production

Use Chrome MCP to capture fresh, 1:1-comparable screenshots from production. These go in `screenshots/reference-live/` and are the preferred comparison baseline for dual-tab workflows.

## When to use

- Before a compare-pages session, to get screenshots at the canonical viewport (1440x900)
- When existing references are stale (different viewport sizes, retina scaling, includes browser chrome)
- When a production page has been updated since the last reference was captured

## Steps

1. **Set viewport:** `mcp__claude-in-chrome__resize_window → { width: 1440, height: 900 }`
2. **Navigate** to `https://acme.splose.com/<production-route>` (use `docs/route-mapping.md`)
3. **Screenshot** the page via Chrome MCP
4. **Save** to `screenshots/reference-live/<route-slug>.png` (e.g. `settings-tags.png`, `clients-detail.png`)
5. **Repeat** for each page needed

## Naming convention

Convert the localhost route to a filename slug:
- `/settings/tags` → `settings-tags.png`
- `/clients/1/appointments` → `clients-detail-appointments.png`
- `/` → `dashboard.png`
- `/calendar` → `calendar-week.png` (default view)

## Relationship to existing references

- `screenshots/reference/` — Jim's manual captures (Mac screenshots, screencaptures). Kept as the "spec intent" record. Various viewport sizes and DPI.
- `screenshots/reference-live/` — Chrome MCP captures at canonical 1440x900 viewport. Same tool and viewport as localhost screenshots. Preferred for visual comparison.

Both directories are valid references. The live captures are more comparable for measurement purposes; the manual captures may show states or details not easily reproduced via navigation.

## Commit

```bash
git add screenshots/reference-live/
git commit -m "Refresh N live reference screenshots from production at 1440x900"
```
