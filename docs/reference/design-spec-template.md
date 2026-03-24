# Design Spec Template

Use this format when extracting design values from reference screenshots. Save to `screenshots/specs/<page-name>.md`.

## What to Extract

**Colors**: Page bg, card bg, text (primary/secondary/link/placeholder), borders, accents, status colors (success/warning/error/info).

**Typography**: Font sizes + weights for page titles, section headings, body, captions, buttons. Line heights, text transforms.

**Spacing**: Page padding, card padding, element gaps, table cell padding.

**Layout**: Sidebar width, content max-width, column ratios, header height.

**Components**: Border radius (buttons, cards, badges, inputs, avatars), shadows, icon sizes, avatar sizes, input heights.

**Interactive states**: Hover states, active/selected tab, focus rings, disabled states.

## File Format

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
| Page title | 24px | Bold (700) | text-display-lg |
| Section heading | 18px | Semibold (600) | text-heading-lg |
| Body text | 14px | Normal (400) | text-body-md |
| Caption/label | 12px | Medium (500) | text-label-md |

## Spacing
| Element | Value | Tailwind |
|---|---|---|
| Page padding | 24px | p-6 |
| Card padding | 20px | p-5 |
| Section gap | 24px | gap-6 |

## Layout
| Element | Value |
|---|---|
| Sidebar width | 256px (w-64) |
| Header height | 56px (h-14) |

## Components
| Element | Border radius | Shadow |
|---|---|---|
| Cards | 8px (rounded-lg) | none |
| Buttons | 8px (rounded-lg) | none |
| Badges | 9999px (rounded-full) | none |
| Inputs | 8px (rounded-lg) | none |
```

## Tips
- Check `src/app/globals.css` for custom CSS variables before using raw hex values
- Use Figma MCP `get_design_context` if available — more accurate than screenshot extraction
- Values should be consistent across pages. Flag inconsistencies.
