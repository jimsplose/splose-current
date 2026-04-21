# Session 0: Splose story metadata infrastructure

**Phase:** 0 (precursor to Wave 4)
**Status:** Planned
**Estimated size:** S
**Jira ticket:** TBC, create before build session
**Feature doc:** n/a

## What it does

Stands up the shared Storybook metadata contract referenced by every Wave 4 plan. Without this precursor session, acceptance criteria like "Status flipped from planned to beta in splose metadata" cannot be satisfied. Each Wave 4 build session assumes these files exist.

## Files to create

```
src/components/ds/stories/_docs/splose-types.ts
src/components/ds/stories/_docs/SploseDocHeader.tsx
src/components/ds/stories/planned/Tooltip.stories.tsx
src/components/ds/stories/planned/Skeleton.stories.tsx
src/components/ds/stories/planned/Toast.stories.tsx
src/components/ds/stories/planned/DatePicker.stories.tsx
src/components/ds/stories/planned/NumberInput.stories.tsx
src/components/ds/stories/planned/Drawer.stories.tsx
src/components/ds/stories/planned/AlertDialog.stories.tsx
src/components/ds/stories/planned/Accordion.stories.tsx
src/components/ds/stories/planned/Tag.stories.tsx
src/components/ds/stories/planned/Breadcrumbs.stories.tsx
src/components/ds/stories/planned/Stepper.stories.tsx
src/components/ds/stories/planned/SegmentedControl.stories.tsx
src/components/ds/stories/planned/PhoneInput.stories.tsx
src/components/ds/stories/planned/AppointmentCard.stories.tsx
src/components/ds/stories/planned/PatientAvatar.stories.tsx
src/components/ds/stories/planned/PaymentStatusBadge.stories.tsx
src/components/ds/stories/planned/Sparkline.stories.tsx
src/components/ds/stories/planned/CommandPalette.stories.tsx
src/components/ds/stories/planned/HoverCard.stories.tsx
src/components/ds/stories/planned/ContextMenu.stories.tsx
src/components/ds/stories/planned/SignaturePad.stories.tsx
src/components/ds/stories/planned/TimePicker.stories.tsx
src/components/ds/stories/planned/ComboBox.stories.tsx
```

List.stories.tsx is **not** in this list — the List enhancement (decision B1) ships changes against the existing file.

## The `splose-types.ts` contract

```ts
export type SploseStatus = "planned" | "alpha" | "beta" | "stable" | "deprecated";

export interface SploseStoryMeta {
  /** Component lifecycle state shown in Storybook header + ds-component-catalog. */
  status: SploseStatus;
  /** One-sentence summary shown in the Storybook sidebar and catalog. */
  summary: string;
  /** Inline pattern the component replaces at call sites today (empty for net-new). */
  whatToUseInstead?: string;
  /** Library the component wraps (AntD, first-party, hand-rolled). */
  referenceLibrary?: "antd" | "radix" | "sonner" | "cmdk" | "downshift" | "first-party";
  /** Ticket link if one exists. */
  jira?: string;
  /** Relative path to the build plan doc. */
  plan?: string;
}

declare module "@storybook/react" {
  interface Parameters {
    splose?: SploseStoryMeta;
  }
}
```

Every placeholder story declares `parameters.splose = { ... }`. Build sessions flip `status` from `"planned"` to `"beta"` in the same commit that ships the real component.

## The `SploseDocHeader` component

Renders at the top of every MDX doc page:

- Component name (from component displayName).
- Status pill (matches `SploseStatus` with Badge colours: planned=gray, alpha=yellow, beta=blue, stable=green, deprecated=red).
- One-line summary (from `parameters.splose.summary`).
- Link row: Jira ticket, build plan, source file.

## Placeholder story shape

Each placeholder has a Playground with a stubbed component that says `"<Name> — planned"` and the full `parameters.splose` metadata populated from the plan's front matter. This is the source of truth the planning prompt originally assumed would exist.

```tsx
// src/components/ds/stories/planned/Tooltip.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Planned/Tooltip",
  parameters: {
    splose: {
      status: "planned",
      summary: "Hover/focus label for icon-only buttons, truncated text, and abbreviations.",
      whatToUseInstead: "Native title attribute; raw AntD Tooltip imports.",
      referenceLibrary: "antd",
      plan: "docs/ds-plans/Tooltip.md",
    },
  },
};
export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <div style={{ padding: 20 }}>Tooltip — planned</div>,
};
```

## Acceptance criteria

- [ ] `_docs/splose-types.ts` exported from the stories barrel.
- [ ] `SploseDocHeader.tsx` renders correctly in a smoke MDX.
- [ ] All 24 placeholder story files created. Each one has populated `parameters.splose` with status, summary, whatToUseInstead, referenceLibrary, plan fields from its plan file.
- [ ] Planned stories appear under a "Planned" section in the Storybook sidebar.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run storybook` boots and renders the Planned section without errors.
- [ ] Sanity check: click into Tooltip placeholder and see "Tooltip — planned" render.

## Open questions

None. This session is pure scaffolding — no visual/product decisions needed.
