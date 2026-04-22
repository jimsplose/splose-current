# Wave 5 · Plan 07 — Stories cleanup + per-component MDX documentation

**Status:** Done
**Estimated effort:** M (~100 utility-class hits in stories + 24 MDX files to write, ~80–120 lines each)
**Recommended model:** Sonnet 4.6 (writing + mechanical substitutions)
**Thinking budget:** think
**Must run after:** Plans 01–06 (MDX cites real shipped consumers)

## Why combined

Both tasks live under `src/components/ds/stories/` and touch the same directory tree. Running them together means one session opens Storybook once, verifies all sidebar pages at once, and commits the full Storybook-sidebar surface in coherent chunks.

## Two parts

### Part A — Utility-class removal in DS stories

Scope: every `.tsx` under `src/components/ds/stories/` (NOT under `src/components/ds/stories/docs/` — those are the MDX files written in Part B).

Follow the replacement mapping in [README.md § "Utility-class replacement reference"](README.md#utility-class-replacement-reference). Stories are demonstration code — prefer readable patterns (`<Text variant="body/md">` over verbose inline styles).

Pre-start audit:

```bash
grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*border-border\|className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b' \
  src/components/ds/stories --include='*.tsx' | wc -l
```

Record the baseline. Target: 0.

### Part B — Per-component MDX documentation

Write one MDX file per Wave 4 component under `src/components/ds/stories/docs/`:

```
src/components/ds/stories/docs/Tooltip.mdx
src/components/ds/stories/docs/Skeleton.mdx
src/components/ds/stories/docs/Toast.mdx
src/components/ds/stories/docs/DatePicker.mdx
src/components/ds/stories/docs/NumberInput.mdx
src/components/ds/stories/docs/Drawer.mdx
src/components/ds/stories/docs/AlertDialog.mdx
src/components/ds/stories/docs/Accordion.mdx
src/components/ds/stories/docs/Tag.mdx
src/components/ds/stories/docs/Breadcrumbs.mdx
src/components/ds/stories/docs/Stepper.mdx
src/components/ds/stories/docs/SegmentedControl.mdx
src/components/ds/stories/docs/PhoneInput.mdx
src/components/ds/stories/docs/AppointmentCard.mdx
src/components/ds/stories/docs/PatientAvatar.mdx
src/components/ds/stories/docs/PaymentStatusBadge.mdx
src/components/ds/stories/docs/Sparkline.mdx
src/components/ds/stories/docs/CommandPalette.mdx
src/components/ds/stories/docs/HoverCard.mdx
src/components/ds/stories/docs/ContextMenu.mdx
src/components/ds/stories/docs/SignaturePad.mdx
src/components/ds/stories/docs/TimePicker.mdx
src/components/ds/stories/docs/ComboBox.mdx
src/components/ds/stories/docs/List.mdx     # updated — existing; Wave 4 enhanced
```

24 files total — 23 new + List updated.

MDX skeleton (reuse for every component):

```mdx
import { Meta } from "@storybook/addon-docs/blocks";
import * as Stories from "../<Name>.stories";
import { SploseDocHeader } from "../_docs/SploseDocHeader";

<Meta of={Stories} />
<SploseDocHeader name="<Name>" meta={Stories.default.parameters.splose} />

## When to use
<one-paragraph decision rule — the canonical "yes" case>

## When not to use
<list of near-neighbours and why they're better for those>

## Variants
<reference each Feature story by link; show the recipe usage>

## Composition
<cite the real production consumer that landed in Wave 5 — file path + 5-line snippet>

## Accessibility
<SR role, keyboard contract, any aria patterns the component handles automatically>

## Sizing
<size ladder, when to pick each>

## Migration from (if applicable)
<for components that replaced an inline pattern — e.g. Toast replaced AntD message.*>
```

### Content rules for MDX

- **"When to use" is one decision rule, not a list.** If it needs three sentences it's too fuzzy.
- **"When not to use" names the near-neighbours.** Tooltip → HintIcon. Modal → AlertDialog. Badge → Tag. FormSelect → ComboBox. AsyncSelect → ComboBox. Without these disambiguators consumers reach for the wrong component.
- **"Composition" cites real code.** Grep for the component's import across `src/app/` and pick the most representative consumer. Quote the surrounding 5–10 lines (not the whole component). If Plans 01–06 migrated it, cite the post-migration code.
- **"Accessibility" names the guarantees.** What does the component do automatically (focus trap, aria-current, role). What does the consumer have to do (label, keyboard equivalent for hover-only patterns).
- **"Sizing" is a one-sentence ladder.** No more.

## Chrome MCP verification

Storybook-only verification (MDX lives in Storybook — no production to compare):

1. Run `npm run storybook`.
2. Open each component's MDX page. Confirm `SploseDocHeader` renders with status pill = `beta` (every Wave 4 component).
3. Confirm "Composition" snippets render without MDX parser errors.
4. Confirm `<Meta of={Stories}>` linkage — Feature + Recipe stories should appear in the sidebar under the component.
5. For Part A verification, re-run the stories utility-class grep — must return 0.

## Commit discipline

1. Part A — utility-class cleanup in DS stories (one commit, grep-driven)
2. Part B Phase 1 MDX — Tooltip / Skeleton / Toast / DatePicker / NumberInput / List
3. Part B Phase 2 MDX — Drawer / AlertDialog / Accordion / Tag / Breadcrumbs / Stepper / SegmentedControl / PhoneInput
4. Part B Phase 3 MDX — AppointmentCard / PatientAvatar / PaymentStatusBadge / Sparkline
5. Part B Phase 4 MDX — CommandPalette / HoverCard / ContextMenu / SignaturePad / TimePicker / ComboBox
6. Wave 5 Plan 07 status flip + session log

## Acceptance criteria

### Part A — stories cleanup
- [ ] `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*border-border\|className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b' src/components/ds/stories --include='*.tsx'` = 0

### Part B — MDX docs
- [ ] 24 MDX files exist under `src/components/ds/stories/docs/`.
- [ ] Each MDX has the 6 required sections (When to use / When not to use / Variants / Composition / Accessibility / Sizing).
- [ ] Each MDX renders `<SploseDocHeader>` with the component's `parameters.splose` metadata.
- [ ] Each "Composition" section cites a real file path from Wave 5 migrations (or the Storybook recipe for components that don't yet have production consumers — e.g. Breadcrumbs, Stepper, Sparkline).

### Gate
- [ ] `npm run build-storybook` passes.
- [ ] Sidebar in Storybook shows all 24 MDX pages under the component story groups.
- [ ] tsc 0 errors.

## Known pitfalls

- MDX import paths can break silently if the stories file was renamed. Open the sidebar after each MDX write to confirm.
- `SploseDocHeader` expects `parameters.splose` on the stories file's default export. Every Wave 4 component has this (Session 0 mandated it); double-check by opening the `.stories.tsx` file while writing the MDX.
- Don't let MDX contradict the component's actual API — read the `.tsx` file while writing. If the MDX describes a prop that doesn't exist, fix one or the other before committing.
- For components with no production consumer yet (Breadcrumbs, Stepper, Sparkline, CommandPalette if Plan 05 somehow skipped it), "Composition" references the Storybook recipe story instead of a file path. Mark these as "coming soon" rather than fabricating a consumer.

## Open questions

1. **Auto-linking** — if Splose later adds a public docs site outside Storybook, the MDX files could be reused via Next.js MDX. Out of scope here; keep under `stories/docs/`.
2. **Screenshots in MDX** — Storybook renders stories inline so screenshots are redundant. Skip.
