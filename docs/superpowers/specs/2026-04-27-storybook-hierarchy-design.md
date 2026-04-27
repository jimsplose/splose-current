# Storybook hierarchy + refactor — design

**Date:** 2026-04-27
**Status:** Approved for implementation planning
**Supersedes (in part):** GitHub issues #17, #18, #19 (revised below)

## Problem

The current Splose Storybook has ~50 stories under a purpose-based hierarchy
(`Forms/`, `Navigation/`, `Data Display/`, …) but the three open refactor
issues — #17, #18, #19 — propose moving everything into a tier-based folder
structure (`stories/antd/`, `stories/extended/`, `stories/custom/`). That
restructure conflicts with the current sidebar, diverges from the
purpose-based model used by govuk-react (the reference design system Jim
linked), and optimises for a build-detail axis ("is this AntD or not?")
instead of a discovery axis ("which component do I use here?").

The hierarchy also has accumulated inconsistencies (`Overlay/` vs `Overlays/`,
`Patterns/` vs `Templates/`, Tag/Badge in Data Display rather than
Typography) and lacks two top-level groups present in govuk-react that we
want: `Docs/` (orientation, theme, accessibility, conventions) and
`Utility/` (low-level primitives like Icon).

## Goal

Replace the tier-based restructure with a purpose-based hierarchy plus tier
tags. Clean up category inconsistencies. Add `Docs/` and `Utility/` groups.
Cover the remaining gap: pure-AntD components used directly in app code with
no DS wrapper.

## Final hierarchy

```
Welcome                     — single MDX landing page (PoC disclaimer, see below)

Docs/                       — design system reference, not components
  Getting started
  Theme & tokens            — sploseTheme, colors, type scale, spacing
  Icons                     — icon library overview, search, usage
  Accessibility
  Conventions               — when to use DS vs inline; "extend, don't bypass"

Typography/
  Text
  Tag                       — moved from Data Display
  Badge                     — moved from Data Display

Forms/
  AsyncSelect, Checkbox, ComboBox, DatePicker, DateRangeFilter,
  FileUpload, Filter, FormColorPicker, FormField, FormInput, FormLabel,
  FormSelect, FormTextarea, HintIcon (moved from Data Display),
  NumberInput, PhoneInput, RadioGroup, RichTextEditor, SearchBar,
  SegmentedControl, SignaturePad, TimePicker, Toggle

Actions/
  Button

Data Display/
  AppointmentCard, Avatar, ColorDot, DataTable, List,
  PatientAvatar, PaymentStatusBadge, ProgressBar, Sparkline, Stat

Feedback/
  Alert, AlertCallout, EmptyState, Skeleton, Spinner, Toast

Navigation/
  Breadcrumbs, Navbar, Pagination (moved from Data Display),
  SideNav, Stepper, Tab, TopNav

Layout/
  Accordion, Card, Collapse, Divider, FeatureCard, Grid, PageHeader

Overlays/                   — merged Overlay + Overlays into one
  AlertDialog, CommandPalette, ContextMenu, Drawer, Dropdown,
  EmailPreview, HoverCard, Modal, ReorderModal, Tooltip

Templates/                  — merged Patterns + Templates into one
  DetailPage, FormPage, ListPage, SettingsListPage

Utility/
  Icon                      — moved from Data Display
  VisuallyHidden            — when added
```

### Edge calls (locked)

- Spinner stays in Feedback (signals "wait", a feedback affordance).
- Icon moves to Utility (low-level primitive).
- HintIcon moves to Forms (almost always used inside form fields).
- Pagination moves to Navigation (you click it to navigate).
- Accordion / Collapse stay in Layout.

## Tier as a tag, not a folder

Every story's meta declares a tier as a Storybook tag:

```ts
const meta: Meta<typeof Component> = {
  title: "Forms/AsyncSelect",
  component: AsyncSelect,
  tags: ["extended"], // one of: "antd" | "extended" | "custom"
  parameters: { /* … */ },
};
```

Tiers:

- `antd` — pure AntD component used with `ConfigProvider` + `sploseTheme`,
  no wrapper.
- `extended` — AntD-based wrapper or composed pattern (e.g. `ListPage`,
  `AsyncSelect`, `EmailPreview`).
- `custom` — no AntD base (e.g. `Text`, `Sparkline`, `PatientAvatar`).

Tags render as filterable badges in the Storybook sidebar without distorting
the purpose-based folder structure.

## Welcome page — proof-of-concept disclaimer

The `Welcome` MDX page must lead with a prominent callout. Verbatim content
to surface (wording can be tightened but the substance must remain):

> **Proof of concept.** This is a proof-of-concept Splose Design System,
> reverse-engineered from the live product. It is built on a newer stack
> (mostly React and AntD) on newer versions than Production, and was built
> with Claude by a non-engineer who has never seen the production codebase.
> It is **not usable in Production**. It exists as a proof of concept for
> prototyping purposes and to reverse-engineer a Figma library.

Render as a high-contrast banner above the rest of the Welcome content.

## Issue plan

Six GitHub issues — three revised, three new. Sequencing reflects
dependencies, not priority:

```
#17 (revised, includes rename sweep) ──┐
                                       ├──> #18 (screenshots) ──> #19 (MDX)
#22 (pure-AntD direct-usage stories) ──┘
#21 (Docs section)              — independent, parallel
#23 (component-coverage audit)  — independent; output → Jim's triage → more issues
```

Numbers #21, #22, #23 assume the new issues are filed in that order
(A → B → D) and that no other issues are filed in between. If a
concurrent session files an issue first, the numbers shift — update
the spec when actual numbers are assigned.

### Issue #17 (revised) — Hierarchy + component inventory

Replaces the tier-folder restructure. Now includes the mechanical
category rename/move sweep as Step 1.

**Steps:**

1. **Rename + move sweep.** Update every `title:` in
   `src/components/ds/stories/*.stories.tsx` to match the final hierarchy.
   Concrete moves:
   - `Overlay/*` and `Overlays/*` → `Overlays/*` (single category).
   - `Patterns/SettingsListPage` → `Templates/SettingsListPage`.
   - `Data Display/Tag` → `Typography/Tag`.
   - `Data Display/Badge` → `Typography/Badge`.
   - `Data Display/HintIcon` → `Forms/HintIcon`.
   - `Data Display/Icon` → `Utility/Icon`.
   - `Data Display/Pagination` → `Navigation/Pagination`.
2. **Tier tags.** Add `tags: ['antd' | 'extended' | 'custom']` to every
   story's meta. Tier classification per the inventory below.
3. **Inventory.** Commit `docs/storybook-component-inventory.md` listing
   every story with its tier, category, and the app routes where it
   appears.
4. **`appPages` + `referenceUrl` meta.** Every story gets an `appPages`
   parameter (Vercel + acme URL pairs) and a `referenceUrl` (AntD docs URL
   or `null` for `custom`).

**Acceptance:**

- All ~50 existing stories live under the new hierarchy.
- Every story has a tier tag.
- Every story has `appPages` and `referenceUrl` meta.
- `npm run storybook` builds; `npx tsc --noEmit` clean.
- Inventory doc committed.

### Issue #18 (revised) — Chrome MCP screenshots

Largely unchanged. Re-batch by the new categories. Screenshot directory stays
flat (`public/storybook-screenshots/[ComponentName]/`) — independent of
sidebar category, since `appPages` drives what to capture.

### Issue #19 (revised) — MDX documentation

MDX files live alongside `.stories.tsx` in `src/components/ds/stories/` —
no `antd/`/`extended/`/`custom/` MDX subfolders. The MDX template's "type"
badge reads from the story's tier tag rather than a hand-typed line.

### Issue #21 (new) — Docs section

Five MDX pages under a new `Docs/` top-level group:

- **Getting started.** Plus the PoC disclaimer banner described above
  (this is the Welcome page or its lead).
- **Theme & tokens.** Documents `sploseTheme`, color tokens, type scale,
  spacing scale.
- **Icons.** Searchable catalog of `@ant-design/icons` usage with copy-paste
  snippets.
- **Accessibility.** Project conventions for keyboard nav, focus states,
  contrast.
- **Conventions.** "Extend, don't bypass" rule, when to add a DS prop vs
  inline, the 2-pages-or-more extraction rule (per CLAUDE.md).

Independent of the others — can run in parallel.

### Issue #22 (new) — Pure-AntD direct-usage stories

Stories for AntD components used directly in `src/app/` without a DS
wrapper. ~17 components based on the import audit:

`Form`, `Form.Item`, `Input`, `Select`, `Modal`, `Table`, `Tabs`, `Tag`,
`Popover`, `Spin`, `Statistic`, `Switch`, `Flex`, `Radio`, `Segmented`,
`ColorPicker`, `InputNumber`.

Each story:

- Wraps with `ConfigProvider` + `sploseTheme`.
- Tagged `antd`.
- Filed under its purpose category (e.g. `Forms/Input`, `Overlays/Modal`,
  `Data Display/Table`).
- Includes `appPages` showing direct-usage routes and `referenceUrl` to AntD
  docs.

Where a DS wrapper *also* exists (e.g. `Modal` raw and the `Modal` wrapper),
the AntD story keeps the AntD-prefixed file name (`AntdModal.stories.tsx`)
to avoid collision, but the sidebar `title:` keeps the purpose category
without an `Antd` prefix — readers find it next to the wrapper. The tier
tag distinguishes them.

### Issue #23 (new) — Component coverage audit + missing-component issues

A research / audit task whose output is a list of follow-up GitHub issues
for components Splose should add. Three axes:

1. **What the DS has.** Enumerate every component currently in
   `src/components/ds/` — already tracked by issue #17's inventory.
2. **What this codebase uses but doesn't yet have a DS slot for.** Grep
   `src/app/` for repeated inline patterns that should be DS components
   (e.g. recurring layout primitives, status indicators, empty-state
   shapes that aren't covered by the existing `EmptyState`).
3. **What comparable open-source design systems offer that Splose lacks.**
   Benchmark against, at minimum:
   - **govuk-react** — already the hierarchy reference; reuse the
     index audit.
   - **Ant Design Pro components** (`@ant-design/pro-components`) —
     ProTable, ProForm, ProList, ProDescriptions, ProLayout.
   - **Radix UI primitives** — VisuallyHidden, FocusScope, Portal,
     ScrollArea, Toggle (separate from Switch), ToggleGroup, Slider.
   - **shadcn/ui** — Calendar, Carousel, Hover Card variants, Sheet,
     Sonner-style Toast, Resizable.
   - **Atlassian Design System** — Banner, Lozenge, Inline Message.

   For each gap, classify as **necessary** (the codebase has inline
   patterns that need it now), **recommended** (would close common UX
   gaps in a healthcare admin product), or **future** (interesting but
   not currently called for).

**Output (committed to repo):**

- `docs/storybook-component-coverage-audit.md` — three-section table
  (DS coverage, codebase patterns, benchmark gaps) with the
  necessary/recommended/future classification and a one-line
  recommendation per row.

**Decision step (Jim, not automated):** The audit is *recommendations
only*. After it's committed, Jim is presented with the full list and
picks which entries become GitHub issues. No issues are auto-filed.

**Follow-up:** For each entry Jim approves, file a GitHub issue (next
sequential number after #23) with
the `enhancement` label using a single template:
- Component name + proposed category (per the hierarchy).
- Why: codebase patterns it replaces, or comparable systems that ship
  it.
- Reference implementation: AntD / Radix / shadcn / first-party.
- Acceptance criteria stub (component + story + MDX doc).

The audit doc is then updated to link each row to its filed issue (or
mark it `declined` / `deferred` so future audits don't re-surface
already-decided items).

**Acceptance:**

- `docs/storybook-component-coverage-audit.md` committed with all
  recommendations classified and explained.
- Recommendations presented to Jim for triage.
- For each approved recommendation, a GitHub issue is filed and linked
  from the audit doc. Declined / deferred entries are marked as such
  in the doc so the audit captures the decision history.

## Migration notes

- The `title:` rename in #17 Step 1 is a string change in story files only —
  no component imports change.
- Existing screenshots (per #18) reference component names, not categories,
  so they survive the rename unchanged.
- `appPages` URLs in story meta are independent of category — also survive.
- `tags: ['antd' | 'extended' | 'custom']` is additive metadata; older
  Storybook builds without tag filtering still render fine.

## Out of scope

- Replacing the few remaining inline-style usages with DS components — that
  belongs to the existing DS adoption / utility-class removal waves.
- Visual regression testing infrastructure for Storybook — separate
  initiative.

Building newly-identified missing components is **in scope** but happens
through individual issues spawned by Issue #23 rather than through this
hierarchy refactor.
