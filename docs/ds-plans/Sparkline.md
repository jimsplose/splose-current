# Sparkline build plan

**Phase:** 3
**Status:** Planned
**Estimated size:** M
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

A very small inline chart that shows a trend at-a-glance next to a headline number — revenue over the last 30 days beside today's revenue, no-show rate over the quarter beside this week's rate, etc. Not interactive, no axes, no legend. The whole point is a glanceable shape that complements a metric. Meant for `Stat` compositions, dashboard tiles, and aged-debtor trend cells.

## API

```ts
interface SparklineProps {
  data: number[];                      // the series; empty array renders a flat line
  width?: number;                      // default 96
  height?: number;                     // default 24
  tone?: "primary" | "success" | "danger" | "warning" | "neutral";   // default inferred from trend
  shape?: "line" | "area" | "bar";     // default "line"
  showDots?: boolean;                  // dots on every point, default false
  markLast?: boolean;                  // dot on the last point, default true
  baseline?: number;                   // optional baseline line (e.g. 0, or previous period avg)
  "aria-label": string;                // required — e.g. "Revenue, 30 days, trending up"
}
```

Tone inference: `success` if the last point is higher than the first by ≥ 5%, `danger` if lower by ≥ 5%, else `neutral`. Override via `tone`.

## What it extends

No existing DS sparkline. Production reports use Highcharts for full-size charts (497x300 measured on 2026-04-22), which is too heavy for glanceable sparklines. Use either:

- **`recharts`** (already familiar in the React ecosystem, ~60KB gz, tree-shakeable for a minimal LineChart).
- **Hand-rolled SVG** (~1KB, no dep, covers what we need: line + area + bar, a dot or two).

Lean **hand-rolled SVG**. Sparklines are simple, a ~80-line component gets us line/area/bar with no bundle cost. We can upgrade to a dep later if requirements grow.

## Production usage (Chrome MCP walk)

Chrome MCP walk 2026-04-22 — `acme.splose.com/reports` uses Highcharts for full charts; no inline sparkline pattern observed on dashboard, calendar, patient detail, invoices, services, or reports landing.

- Production **does not currently render sparklines**. This component is a net-new addition.
- Candidate future homes:
  - Dashboard tiles on `/` (revenue, patients seen, no-show rate over the week).
  - Aged debtors report (`/reports/aged-debtors`) — trend cell per client.
  - Patient detail page — notes count, appointment frequency over time.
  - Service management (`/settings/services`) — per-service booking trend.

## Measurement targets

No live sample — design-informed defaults:

- Default dimensions: `96 × 24px`. Large variant: `160 × 40px`. Tiny variant: `60 × 16px`.
- Line stroke width: `1.5px`.
- Area fill: `currentColor` at 15% opacity, sits under the line.
- Bar: `2px` wide, `1px` gap between bars.
- Tone colours: pull from CSS tokens (`var(--color-primary)`, `var(--color-success)`, etc.).
- Last-point dot: `3px` radius, fill matches line colour.
- Baseline: `1px` dashed line in `var(--color-border)`.
- Padding inside the SVG: `2px` all sides to prevent stroke clipping.

## Accessibility

- `role="img"` with the required `aria-label`.
- Screen readers get the semantic summary from `aria-label`; they do not navigate the data points.
- For users who need the full data, the parent component should pair the sparkline with an accessible data block (e.g. a `DataTable` or a `DescriptionList` with the series).
- `prefers-reduced-motion` — if animating the series load, suppress. Default is no animation; add only if explicitly requested.

## Visual states

- Line (default)
- Area (line + 15% fill under)
- Bar
- With dots on every point
- With only last-point dot (default)
- With baseline
- Empty data (renders a flat line at the baseline)
- Single-point data (renders a single dot)
- All-zero data (flat line)
- Trending up (success tone)
- Trending down (danger tone)
- Neutral / flat (secondary tone)

## Stories to build

- **Playground:** args-driven with data, dimensions, tone, shape, dots, baseline.
- **Feature stories:**
  - `Line`, `Area`, `Bar` — one per shape.
  - `TonesAutoInferred` — three sparklines (up, down, flat) to show auto-tone.
  - `WithDots` vs `WithLastDotOnly`.
  - `WithBaseline`.
  - `EdgeCases` — empty, single-point, all-zero, all-same.
  - `Sizes` — 60/96/160 wide.
- **Recipe stories:**
  - `DashboardRevenueTile` — `// Source: planned / dashboard — "Revenue $12,430 ↗" with a 30-day sparkline`
  - `AgedDebtorsTrend` — `// Source: planned /reports/aged-debtors — sparkline cell in the DataTable column`
  - `PatientNotesFrequency` — `// Source: planned /patients/{id}/details — "12 notes this quarter" + sparkline`

## MDX docs outline

- H1: Sparkline
- When to use — glanceable trend beside a headline number.
- When not to use — full data exploration (use Highcharts via a chart wrapper), interactive charts (no hover on sparkline), categorical data (use `Bar` only if ordinal).
- Variants — line / area / bar, with/without dots, with/without baseline.
- Composition — beside `Stat`, inside `DataTable` cells, inside `Card`.
- Accessibility — required aria-label, role, pairing with data table.
- Sizing — three default sizes; custom width/height accepted.

## Acceptance criteria

- [ ] Renders at 1440x900 via Storybook-only verification (no production comparator — document in `.verification-evidence`).
- [ ] Passes `@storybook/addon-a11y` checks (required `aria-label` surfaces in the addon).
- [ ] Playground / Feature / Recipe stories present.
- [ ] MDX doc with `SploseDocHeader`.
- [ ] Wired into `src/components/ds/index.ts`.
- [ ] `docs/reference/ds-component-catalog.md` updated in the same commit.
- [ ] No production migration in this session — Sparkline is new. Adoption happens once Jim picks the first home (likely dashboard revenue tile).

## Open questions

1. **Dep vs hand-rolled** — confirm no-dep approach. If Jim wants richer charts later (hover tooltips, interaction), we'd switch to recharts or `visx`. Hand-rolled is the right start for pure sparklines.
2. **First home** — dashboard revenue tile is the most valuable proof-point. Dashboard already uses a data block; Sparkline would add a visual cue. Confirm this is Wave 4 scope vs a separate product decision.
3. **Locale / date handling** — sparkline takes `number[]` only; it doesn't know about time. Parent components supply the series already binned. Confirm that's acceptable (it should be — the DS primitive stays simple).
