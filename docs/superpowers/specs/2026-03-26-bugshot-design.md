# Bugshot: In-App Bug Capture Tool

**Date:** 2026-03-26
**Status:** Approved

## Purpose

Capture UI bugs from any page (localhost or Vercel) via the Dev Navigator menu. Produces a screenshot download + clipboard prompt containing description, measurements, and element styles — ready to paste into a fresh Claude Code session.

## Trigger

New "Bugshot" button in the Dev Navigator's quick-links footer bar (alongside "Eng Toolkit" and "Storybook"). Clicking activates bugshot overlay mode on the current page. The Dev Navigator panel is hidden while bugshot is active.

## User Flow

1. **Activate** — click Bugshot in Dev Navigator
2. **Select region** — click and drag a rectangle over the problem area
3. **Describe** — floating panel appears with:
   - Free-text description field (required)
   - Optional tappable tags: `spacing`, `color`, `typography`, `layout`, `alignment`, `responsive`
   - Optional severity tags: `minor`, `moderate`, `major`
4. **Capture** — hit "Capture" button:
   - Screenshots the selected region via `html2canvas`
   - Walks all visible DOM elements in the region, extracts computed styles
   - Triggers PNG download: `bugshot-{route}-{timestamp}.png`
   - Copies natural language prompt to clipboard
5. **Done** — self-contained toast (within the Bugshot component, no global provider) confirms "Bugshot copied to clipboard + screenshot downloaded"
6. **Error** — if clipboard write fails, show the prompt text in a selectable textarea modal so the user can copy manually. If `html2canvas` fails, show error message with a "Retry" button.
7. **Cancel** — Escape key (with `stopPropagation` to prevent DevNavigator from also closing) or clicking outside the panel dismisses bugshot mode

## Clipboard Prompt Format

```
Fix this issue on {url} at {viewport}px viewport.

{description} {tags if any, e.g. "[typography, major]"}

Screenshot downloaded to your Downloads folder as: {download filename}
Region: {x, y, width, height} from top-left of viewport.

Measured styles for elements in the selected region:

{element tag.className} — {width}x{height}
  font: {size}/{line-height} {weight} {family}
  color: {color} | bg: {background}
  padding: {t} {r} {b} {l} | margin: {t} {r} {b} {l}
  border: {border} | radius: {border-radius} | gap: {gap}

{...repeated for each visible element in region, max 50}
```

## Computed Style Extraction

### Properties Captured Per Element
- `font-size`, `font-weight`, `font-family`, `line-height`
- `color`, `background-color`
- `padding-top`, `padding-right`, `padding-bottom`, `padding-left`
- `margin-top`, `margin-right`, `margin-bottom`, `margin-left`
- `border-width` (reconstructed shorthand if all sides match, else per-side), `border-color`
- `border-radius`
- `width`, `height`
- `gap`

### Scoping Rules
- All visible elements whose bounding rect overlaps the selected region
- Skip elements with zero width/height (hidden)
- Skip `<script>`, `<style>`, `<link>`, `<meta>` tags
- Cap at 50 elements, sorted by visual area (largest first)
- Element identifier: `tag.className` (truncated to 80 chars)

## Screenshot Capture

- `html2canvas` renders the full page, then crops to the selected region (adjusted for scroll offset)
- Canvas converted to PNG blob via `.toBlob()`
- Download triggered via a temporary `<a>` element with `download` attribute
- Filename format: `bugshot-{sanitized-route}-{YYYYMMDD-HHmmss}.png`
  - Route sanitized: leading `/` removed, remaining `/` replaced with `-`
  - Example: `bugshot-calendar-20260326-143022.png`

## Region Selection

- Semi-transparent overlay covers the entire viewport
- Click and drag to draw a rectangle
- Rectangle shown with a dashed border and translucent fill
- Region coordinates stored as `{ x, y, width, height }` relative to viewport
- Scroll offset added for absolute page coordinates in the prompt
- Minimum region size: 20x20px (prevents accidental micro-selections)

## Description Panel

Appears anchored near the selected region (below if space, above if near bottom).

### Layout
- Text area: 3 rows, placeholder "What's wrong here?"
- Tag row: horizontally scrollable chips for category + severity
- Two buttons: "Cancel" (ghost) and "Capture" (primary)

### Tags
Category (multi-select): `spacing`, `color`, `typography`, `layout`, `alignment`, `responsive`
Severity (single-select): `minor`, `moderate`, `major`

Tags are optional. Selected tags appear in the clipboard prompt as `[tag1, tag2]`.

## Environment Handling

Identical behavior on localhost and Vercel — entirely client-side.

- URL in prompt: `window.location.href`
- Viewport in prompt: `window.innerWidth`
- No API routes, no server-side storage
- `html2canvas` bundled as a client dependency

## Implementation

### File Structure Refactor
The existing `src/components/DevNavigator.tsx` is refactored into a directory:
- `src/components/DevNavigator/index.tsx` — existing DevNavigator (renamed from DevNavigator.tsx)
- `src/components/DevNavigator/Bugshot.tsx` — main overlay component (selection, description panel, capture logic)
- `src/components/DevNavigator/bugshot-utils.ts` — style extraction, prompt generation, download trigger

The single existing import in `src/app/layout.tsx` continues to work unchanged due to the `index.tsx` barrel.

### Dependencies
- `html2canvas` (npm package, ~40KB gzipped) — screenshot capture. **New dependency** — requires approval per commit discipline rules. Dynamically imported only when "Capture" is pressed to avoid adding to the baseline bundle.

### Component Structure
```
<BugshotOverlay>
  <SelectionRect />        — drag-to-select rectangle
  <DescriptionPanel />     — text + tags + capture button
</BugshotOverlay>
```

`BugshotOverlay` is rendered as a portal to `document.body` when bugshot mode is active. It captures all pointer events to handle region selection.

### State Machine
```
idle → selecting → describing → capturing → done
                 ↘ cancelled        ↘ error → retry → capturing
                              ↘ cancelled         ↘ dismissed → idle
```

- `idle`: Dev Navigator menu visible, bugshot not active
- `selecting`: overlay visible, user drawing region
- `describing`: region drawn, description panel visible
- `capturing`: screenshot + style extraction in progress (brief loading state)
- `error`: html2canvas or clipboard failed — show message with retry/dismiss options
- `done`: toast shown, overlay dismissed, returns to idle

### Z-Index Strategy
- Bugshot overlay: `z-[9998]` (above all page content including DevNavigator's `z-50`)
- Description panel / error modal: `z-[9999]`

## Edge Cases

- **Scrolled pages**: region coordinates include `window.scrollX/Y` offset in the prompt
- **Fixed/sticky elements**: captured naturally by `html2canvas`
- **Large regions (50+ elements)**: capped at 50, sorted by visual area descending
- **Iframe content**: not captured (cross-origin restriction), noted in prompt if iframe detected in region
- **Dev Navigator itself**: hidden before screenshot capture to avoid appearing in the image
- **Tiny selections (<20x20px)**: ignored, no panel shown
- **Empty description**: "Capture" button disabled until text is entered
