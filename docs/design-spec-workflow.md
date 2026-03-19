# Design Spec Extraction Workflow

Before starting fidelity work on a page, extract measurable design values from the reference screenshot(s). This gives agents **concrete numbers** to implement against instead of eyeballing.

## When to run

- **Before fidelity loops** — extract specs for pages you're about to work on
- **After uploading new screenshots** — extract specs while cataloging
- **When a gap stays "partial" after 2+ iterations** — the issue is likely a specific value mismatch that needs exact numbers

## Step 1: Capture the reference screenshot

Read the reference screenshot from `screenshots/reference/` using the Read tool.

## Step 2: Extract design values

For each major UI element visible in the screenshot, extract as many of these values as you can determine:

### Colors
- **Background colors** — page bg, card bg, sidebar bg, header bg
- **Text colors** — primary text, secondary/muted text, link text, placeholder text
- **Border colors** — card borders, input borders, divider lines
- **Accent colors** — primary buttons, active tabs, selected states, badges
- **Status colors** — success/green, warning/yellow, error/red, info/blue with their bg + text variants

### Typography
- **Font sizes** — page titles, section headings, body text, small/caption text, button text
- **Font weights** — which elements are bold (700), semibold (600), medium (500), normal (400)
- **Line heights** — tight (headings) vs relaxed (body text)
- **Text transforms** — uppercase labels, capitalized headings

### Spacing
- **Page padding** — outer margins of the content area
- **Card/section padding** — internal padding of bordered containers
- **Gap between elements** — space between cards, between form fields, between table rows
- **Table cell padding** — horizontal and vertical padding in table cells

### Layout
- **Sidebar width** — fixed px or approximate proportion
- **Content area max-width** — constrained or full-width
- **Column layout** — grid columns, flex ratios
- **Header height** — top navigation bar height

### Components
- **Border radius** — buttons, cards, badges, inputs, avatars
- **Shadow** — which elements have shadows, approximate depth
- **Icon sizes** — small (16px), medium (20px), large (24px)
- **Avatar sizes** — diameter and text size
- **Badge sizes** — padding, font size, border-radius
- **Input heights** — form input/select heights

### Interactive states (if visible)
- **Hover states** — background color changes, underlines
- **Active/selected tab** — border color, text color, background
- **Focus rings** — color and width
- **Disabled states** — opacity or color changes

## Step 3: Save the spec

Save extracted values to `screenshots/specs/<page-name>.md` in this format:

```markdown
# <Page Name> Design Spec

Extracted from: `<screenshot-filename.png>`
Date: YYYY-MM-DD

## Colors
| Element | Value | Tailwind |
|---|---|---|
| Page background | #f9fafb | bg-gray-50 |
| Card background | #ffffff | bg-white |
| Primary text | #111827 | text-gray-900 |
| Secondary text | #6b7280 | text-gray-500 |
| Border | #e5e7eb | border-gray-200 |
| Primary accent | #7c3aed | bg-primary |

## Typography
| Element | Size | Weight | Tailwind |
|---|---|---|---|
| Page title | 24px | Bold (700) | text-2xl font-bold |
| Section heading | 18px | Semibold (600) | text-lg font-semibold |
| Body text | 14px | Normal (400) | text-sm |
| Caption/label | 12px | Medium (500) | text-xs font-medium |

## Spacing
| Element | Value | Tailwind |
|---|---|---|
| Page padding | 24px | p-6 |
| Card padding | 20px | p-5 |
| Section gap | 24px | gap-6 |
| Form field gap | 16px | gap-4 |

## Layout
| Element | Value |
|---|---|
| Sidebar width | 256px (w-64) |
| Content max-width | Full width |
| Header height | 56px (h-14) |

## Components
| Element | Border radius | Shadow |
|---|---|---|
| Cards | 8px (rounded-lg) | none |
| Buttons | 8px (rounded-lg) | none |
| Badges | 9999px (rounded-full) | none |
| Inputs | 8px (rounded-lg) | none |
| Avatars | 9999px (rounded-full) | none |
```

## Step 4: Reference during fidelity work

When launching subagents for fidelity work, include the relevant spec file path in the agent prompt:

> "Read the design spec at `screenshots/specs/<page-name>.md` and implement using those exact values."

Agents should cross-reference the spec values against their code to ensure exact matches, not approximations.

## Tips for accuracy

- **Colors**: If the screenshot shows a color that's close to but not exactly a Tailwind default, check `src/app/globals.css` for custom CSS variables first. The project defines `--color-primary`, `--color-secondary`, etc.
- **Figma**: If Figma designs are available, use the Figma MCP `get_design_context` tool instead — it returns exact values and is more accurate than extracting from screenshots.
- **Existing pages**: When extracting specs for a page that already has partial implementation, note where the current code deviates from the spec. This becomes the fidelity fix list.
- **Consistency**: Values should be consistent across pages (same header height, same card padding, same body text size). If you see inconsistencies between page specs, flag them — one is likely wrong.
