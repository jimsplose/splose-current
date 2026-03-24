# Design Spec Extraction Workflow

Before fidelity work on a page, extract measurable design values from reference screenshots. This gives agents **concrete numbers** instead of eyeballing.

## When to run

- **Before fidelity loops** — extract specs for pages you're about to work on
- **After uploading new screenshots** — extract specs while cataloging
- **When a gap stays "partial" after 2+ iterations** — likely a specific value mismatch needing exact numbers

## Step 1: Read the reference screenshot

Read from `screenshots/reference/` using the Read tool.

## Step 2: Extract design values

For each major UI element, extract values across these categories:

**Colors** — Page/card/sidebar/header backgrounds; primary/secondary/muted/link/placeholder text; border/divider colors; accent colors (buttons, active tabs, badges); status colors (success/warning/error/info) with bg + text variants.

**Typography** — Font sizes (titles, headings, body, captions, buttons); font weights (400-700); line heights; text transforms (uppercase, capitalize).

**Spacing** — Page padding, card/section padding, gaps between elements, table cell padding.

**Layout** — Sidebar width, content max-width, column layout (grid/flex), header height.

**Components** — Border radius (buttons, cards, badges, inputs, avatars); shadows; icon sizes (16/20/24px); avatar/badge sizing; input heights.

**Interactive states** (if visible) — Hover backgrounds, active/selected tab styling, focus rings, disabled state opacity/colors.

## Step 3: Save the spec

Save to `screenshots/specs/<page-name>.md` with tables mapping each element to its value and Tailwind class. Use this structure:

```
# <Page Name> Design Spec
Extracted from: `<filename.png>` | Date: YYYY-MM-DD

## Colors / Typography / Spacing / Layout / Components
(One table per section: Element | Value | Tailwind)
```

Keep tables consistent: Element | Value | Tailwind columns (Typography adds a Weight column).

## Step 4: Reference during fidelity work

Include the spec file path in subagent prompts:
> "Read the design spec at `screenshots/specs/<page-name>.md` and implement using those exact values."

Agents should cross-reference spec values against their code for exact matches.

## Tips for accuracy

- **Custom CSS variables**: Check `src/app/globals.css` for project-defined `--color-primary`, `--color-secondary`, etc. before using Tailwind defaults.
- **Figma**: If available, use the Figma MCP `get_design_context` tool for exact values — more accurate than screenshot extraction.
- **Existing pages**: Note where current code deviates from the spec — this becomes the fidelity fix list.
- **Cross-page consistency**: Same header height, card padding, body text size across pages. Flag inconsistencies — one is likely wrong.
