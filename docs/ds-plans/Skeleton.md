# Skeleton build plan

**Phase:** 1
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A neutral placeholder that occupies the same space as a piece of content while that content is being fetched. Reduces perceived latency by giving the layout a stable shape during loading. Replaces the ad-hoc `<div className="animate-pulse bg-gray-200" />` pattern that currently appears across list pages and detail headers.

## API

```ts
interface SkeletonProps {
  shape?: "text" | "rect" | "circle";   // default "text"
  width?: number | string;              // pixel or CSS length (e.g. "100%")
  height?: number | string;             // pixel or CSS length
  lines?: number;                       // for shape="text"; renders N stacked bars
  animated?: boolean;                   // default true
  className?: string;
}
```

Three convenience subcomponents rather than exposing shape+width permutations: `Skeleton.Text`, `Skeleton.Avatar`, `Skeleton.Block`. Keeps the common cases one-liners.

```ts
<Skeleton.Text lines={3} />
<Skeleton.Avatar size={36} />
<Skeleton.Block width={240} height={120} />
```

## What it extends

AntD `Skeleton` and `Skeleton.Image`. AntD's default skeleton is opinionated about layout (it bundles avatar+title+paragraph) which doesn't match how we use it — we mostly want single-shape pieces slotted into existing layouts. So the Splose wrapper exposes a simpler primitive that maps to AntD `Skeleton.Node` under the hood, or `Skeleton.Input` for text rows. Radix does not have a skeleton primitive; the AntD mapping is the one we're extending.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — no skeleton elements were live on the default dashboard, calendar, patient detail, invoices, services, or reports pages at the time of capture. Production either renders skeletons only during the narrow fetch window (hard to reliably observe), or does not use them at all on the routes checked.

- Treat this component as **new behaviour** rather than an inline-pattern rescue. Production may still add skeletons later; if they do, measure then.
- Reference pages where skeletons *should* render on the app once we add them: `/clients`, `/invoices`, `/reports/performance`, `/calendar/week/...` during initial load.

## Measurement targets

TBC for production match (no live sample). Sensible DS defaults to implement against:

- Bar colour: `var(--color-fill-secondary)` (≈ `rgb(244, 245, 245)`).
- Shimmer highlight: `rgba(255, 255, 255, 0.6)` sweep, 1.4s cubic-bezier.
- Border-radius: `4px` for text/rect, `50%` for circle.
- Text bar height: `14px` default (matches `body/md` line-height).
- Default bar width for `lines` > 1: `100%`, with the last bar `60%` to suggest a ragged paragraph edge.

Validate all of these against Radix `@radix-ui/themes` skeleton and AntD `Skeleton.Input` on the build session, whichever looks closer to the Splose palette.

## Accessibility

- `aria-busy="true"` on the skeleton container; the parent region uses `aria-live="polite"` so a screen reader announces when the real content arrives.
- Respect `prefers-reduced-motion` — disable the shimmer animation when the user opts out.
- Do not use `role="progressbar"`. A skeleton is a placeholder, not a progress indicator, and adding the role makes SR announcements noisy.

## Visual states

- Default animated bar/block/circle
- Reduced-motion (no shimmer, solid bar)
- Multi-line text with ragged last line
- Disabled animation via `animated={false}`

## Stories to build

- **Playground:** args-driven with `shape`, `width`, `height`, `lines`, `animated`.
- **Feature stories:**
  - `Text` — single and multi-line.
  - `Avatar` — small/med/large circles matching PatientAvatar sizes.
  - `Block` — image/card placeholder rectangles.
  - `ReducedMotion` — `animated={false}` comparison.
- **Recipe stories:**
  - `ListPageRowSkeletons` — `// Source: planned /clients loading state — 6 rows of avatar + 3 text bars`
  - `DetailHeaderSkeleton` — `// Source: planned /patients/{id} loading state — avatar + name bar + subtitle bar`
  - `CardBodySkeleton` — `// Source: planned dashboard card loading — title bar + 3-line paragraph + action bar`

## MDX docs outline

- H1: Skeleton
- When to use — server-driven fetch latency > 300ms, long lists, avatar+name blocks.
- When not to use — actions that rely on immediate feedback (use `Spinner`), transitions shorter than 300ms.
- Variants — text, rect, circle.
- Composition — inside `Card`, inside `List` rows, inside `DetailPage` headers.
- Accessibility — `aria-busy`, reduced-motion.
- Sizing — keep skeleton dimensions within 2px of the real element they replace, to prevent layout shift when content loads.

## Acceptance criteria

- [ ] Renders at 1440x900 without regressing any real production page (no skeleton usage adopted in this session — just the component + stories).
- [ ] Passes `@storybook/addon-a11y` checks.
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] `prefers-reduced-motion` behaviour manually verified (macOS System Settings > Accessibility > Display > Reduce motion).

## Open questions

1. Should this ship with **one** initial consumer (e.g. the `/clients` list page) to prove it, or purely as a component + stories? Lean "ship the component only" — consumer migrations can follow in a separate session — but confirm with Jim.
2. Should `Skeleton` expose a `Loading` wrapper (`<Skeleton.Loading loaded={!isLoading}>{children}</Skeleton.Loading>`) that swaps between skeleton and children automatically? Reduces conditional boilerplate at call sites. Suggest yes if the build session has room.
