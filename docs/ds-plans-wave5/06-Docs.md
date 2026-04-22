# Wave 5 · Plan 06 — Per-component MDX documentation sweep

**Status:** Planned
**Estimated effort:** M (24 MDX files, ~80-120 lines each)
**Recommended model:** Sonnet 4.6 (writing, not coding)
**Thinking budget:** think

## Why last

Each Wave 4 component's MDX "Composition" section should reference a real shipped consumer, not a hypothetical one. Running this plan LAST lets the docs cite actual production code:

- Tooltip MDX references the Calendar toolbar Tooltips shipped in Plan 05.
- AppointmentCard MDX references CalendarView's adoption from Plan 01.
- PaymentStatusBadge MDX references the invoice list column from Plan 02.
- Tag MDX references the patient detail tag row from Plan 03.
- PhoneInput MDX references the patients/new mobile field from Plan 03.
- etc.

If this plan runs before the migrations, the MDX examples are inferred from the Storybook recipes — still useful, but less authoritative.

## Files to create

One MDX per Wave 4 component, placed beside its stories file:

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
src/components/ds/stories/docs/List.mdx            # updated, existing; Wave 4 enhanced it
```

24 MDX files total. List exists (it's the only DS component with an MDX before Wave 4) and gets updated; the other 23 are new.

## MDX template

Every doc follows the same shape. Use this skeleton:

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

## Content rules

- **"When to use" is one decision rule, not a list.** If it needs three sentences it's too fuzzy.
- **"When not to use" names the near-neighbours.** Tooltip → HintIcon. Modal → AlertDialog. Badge → Tag. FormSelect → ComboBox. AsyncSelect → ComboBox. Without these disambiguators consumers reach for the wrong component.
- **"Composition" cites real code.** Grep for the component's import across `src/app/` and pick the most representative consumer. Quote the surrounding 5-10 lines (not the whole component).
- **"Accessibility" names the guarantees.** What does the component do automatically (focus trap, aria-current, role). What does the consumer have to do (label, keyboard equivalent for hover-only patterns).
- **"Sizing" is a one-sentence ladder.** No more.

## Chrome MCP verification

No UI changes in this plan — the MDX lives in Storybook only. Verification is **Storybook-only**:

1. Run `npm run storybook` (or `npm run build-storybook`).
2. For each component, open its MDX page in the sidebar.
3. Confirm the `SploseDocHeader` renders with the correct status pill (every Wave 4 component is `beta`).
4. Confirm the "Composition" section renders the quoted code block without render errors.
5. Confirm the referenced Feature + Recipe stories link correctly via `<Meta of={Stories}>`.

## Acceptance criteria

- [ ] 24 MDX files exist under `src/components/ds/stories/docs/`.
- [ ] Each MDX has the 6 required sections (When to use / When not to use / Variants / Composition / Accessibility / Sizing).
- [ ] Each MDX references the Wave 4 stories file via `<Meta of={Stories}>` and renders `<SploseDocHeader>`.
- [ ] Each "Composition" section cites a real file path + snippet from Wave 5's migrations.
- [ ] `npm run build-storybook` passes.
- [ ] Sidebar in Storybook shows all 24 MDX pages under the component's story group.

## Commit discipline

One commit per Phase-1 component group:

1. Phase 1 components: Tooltip / Skeleton / Toast / DatePicker / NumberInput / List (updated)
2. Phase 2 components: Drawer / AlertDialog / Accordion / Tag / Breadcrumbs / Stepper / SegmentedControl / PhoneInput
3. Phase 3 components: AppointmentCard / PatientAvatar / PaymentStatusBadge / Sparkline
4. Phase 4 components: CommandPalette / HoverCard / ContextMenu / SignaturePad / TimePicker / ComboBox
5. Wave 5 Plan 06 status flip + session log

## Known pitfalls

- MDX import paths can break silently if the stories file was renamed. Always open the Storybook sidebar after writing each MDX to confirm it renders.
- `SploseDocHeader` expects `parameters.splose` on the stories file's default export. Double-check every Wave 4 story has that block (they should — Session 0 mandated it and the Wave 4 commits include it).
- Don't write MDX content that contradicts the component's actual API. Open the `.tsx` file while writing; if the MDX describes a prop that doesn't exist, fix one or the other.

## Open questions

1. **Auto-linking** — if Splose later adds a docs site outside Storybook, MDX files could be reused via a Next.js MDX pipeline. Out of scope here; keep the MDX in `stories/docs/` for now.
2. **Screenshots in MDX** — Storybook renders stories inline so screenshots are redundant. Skip.
