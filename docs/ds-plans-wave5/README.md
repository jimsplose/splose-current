# Wave 5 — DS adoption + utility-class removal sweep

Wave 4 (`docs/ds-plans/`) shipped 25 new/enhanced DS components and their Storybook surface. Nothing on production uses them yet. Separately, `globals.css` still contains ~50 hand-written utility classes that date to the AntD migration — these are another form of "stuff that should route through the DS instead." Wave 5 closes both fronts in one unified pass.

The merge is deliberate: the same files (calendar, invoices, clients, settings) need both changes. Doing them separately means touching each file twice and running Chrome MCP verification twice. Doing them together means one commit per surface, one verification pass, one mental load.

## What Wave 5 contains

| # | Plan | Scope | Unblocks |
|---|---|---|---|
| 00 | [00-Prep.md](00-Prep.md) | ESLint utility-class tracking rules (warn mode) + `Td color` prop + AiChatPanel CSS module + baseline counts | Every other plan in Wave 5 |
| 01 | [01-Calendar.md](01-Calendar.md) | Calendar DS adoption (AppointmentCard, Drawer, SegmentedControl, ContextMenu, HoverCard) + utility-class removal on `src/app/calendar/**` | Audit session 29 CalendarView line item |
| 02 | [02-Invoice.md](02-Invoice.md) | Invoice DS adoption (PaymentStatusBadge, NumberInput, DatePicker, SignaturePad, ComboBox) + utility-class removal on `src/app/invoices/**` + `src/app/payments/**` | — |
| 03 | [03-Patient.md](03-Patient.md) | Patient DS adoption (PatientAvatar, Tag, enhanced List, DatePicker (DOB), PhoneInput, HoverCard) + utility-class removal on `src/app/{clients,patients,waitlist,contacts}/**` | Session 26 ClientDetailClient follow-up |
| 04 | [04-Forms.md](04-Forms.md) | Forms DS adoption (destructive `alertDialog`, save `toast`, `NumberInput`/`PhoneInput`/`DatePicker`/`TimePicker`/`ComboBox` in modals) + utility-class removal on `src/app/settings/**` | — |
| 05 | [05-GlobalShell.md](05-GlobalShell.md) | CommandPalette mount + command registry + Breadcrumbs + icon-button Tooltip sweep + Skeleton loading states + utility-class removal on `src/components/**` (non-DS) | — |
| 06 | [06-RemainingApp.md](06-RemainingApp.md) | Utility-class removal on remaining surfaces that Wave 5 01–05 don't otherwise touch: dashboard, reports, notes, products, online-booking | — |
| 07 | [07-Stories.md](07-Stories.md) | Utility-class removal in DS stories + per-component MDX docs (24 files) | Storybook as canonical DS reference |
| 08 | [08-Cleanup.md](08-Cleanup.md) | Delete utility blocks from `globals.css` + full Chrome MCP regression sweep + ESLint rule `warn → error` + close audit backlog sessions 27 + 28 | Clears audit backlog; next audit runnable |

## Launch sequence

**00 first, then 01–06 in any order (01 recommended first for the visibility win), then 07, then 08 last.**

Hard dependencies:
- **00 before anything else.** 00 establishes the ESLint tracking baseline and adds prerequisite DS component extensions (Td color prop; AiChatPanel CSS module). Without 00, later migrations can't reach their zero-grep done-when.
- **08 after everything.** 08 deletes the utility classes from `globals.css`; the delete is only safe when all TSX callers are clean. 08 also runs the full Chrome MCP regression sweep — the final verification gate.
- **07 after 01–06.** MDX doc "Composition" sections cite real shipped consumers from 01–05. Stories utility-class removal has no ordering constraint but is grouped with MDX because they're both Storybook-sidebar work.

Within 01–06 you can reorder based on priority. Recommended:

1. **00-Prep** — baseline + infra
2. **01-Calendar** — highest visibility, closes audit 29
3. **02-Invoice** — PaymentStatusBadge sweep is the thinnest high-leverage migration (20+ call sites)
4. **03-Patient** — PatientAvatar + Tag across patient + waitlist
5. **04-Forms** — broad settings sweep
6. **05-GlobalShell** — polish layer (CommandPalette, Breadcrumbs, Tooltip sweep)
7. **06-RemainingApp** — cleanup on surfaces Wave 5 doesn't otherwise touch
8. **07-Stories** — MDX docs + stories cleanup
9. **08-Cleanup** — globals.css deletion + regression sweep + ESLint rule flip + audit 27/28 close-out

## How Wave 5 closes the open audit backlog

| Audit session | Status today | How Wave 5 closes it |
|---|---|---|
| 25 (invoice pages → DS Text/DataTable) | `done` but acceptance wasn't strictly met | Verified as part of 02-Invoice when those pages are touched |
| 26 (ClientDetailClient ≤10 inline styles) | `done` (4 remaining) | Reviewed during 03-Patient; likely stays done |
| 27 (Pass 1 re-run, broadened scope) | `partial` — targets unmet | Re-run as part of 08-Cleanup. Wave 5 migrations drop raw `style={{` counts on every Top-10 file. Flip to `done` if ≤600 total + ≥90% per-file drops hit. |
| 28 (ESLint rule `warn` → `error`) | `blocked` — 886 warnings | 08-Cleanup promotes the utility-class rules added in 00-Prep from warn → error. For the separate `no-restricted-syntax` rule from the original audit (inline style patterns), 08 re-counts and promotes if warnings <50. |
| 29 (scope-gap cleanup, 8 files) | `partial` — ESLint 0, CalendarView raw-style still 49 | 01-Calendar migrates CalendarView + AppointmentSidePanel (session 29's biggest line items). After 01 lands, re-count; flip 29 to `done` if raw-style drops under target. |

**After Wave 5:** audit backlog sessions 01–31 all `done`. Backlog cleared; repo ready for Wave 6 (TBD).

## Status tracking

Each plan has a `Status:` line on row 2 of the file:

- `Planned` — not started
- `In progress` — actively being worked on (at most one at a time)
- `Done` — acceptance criteria met, session log entry appended
- `Partial` — scope landed but one or more criterion deferred; follow-up row describes what's blocked

`/ds-migrate` walks Wave 5 in numeric order and picks the first `Planned` (or `In progress`) plan.

Check status with:

```
grep -H "^\*\*Status:\*\*" docs/ds-plans-wave5/*.md
```

## Utility-class replacement reference

Each per-surface plan (01–06) removes utility classes from `globals.css` by replacing them in TSX files using this priority + mapping. This is the single authoritative reference; plans just grep-gate their surface.

**Layout replacement priority:**

1. `<Flex vertical gap={N}>` wrapping a vertical stack of siblings — removes the need for `mb-N` on each child
2. DS component spacing props (where they exist)
3. AntD native element props (`<Button block>`, `<Flex flex={1}>`)
4. `style={{}}` inline — LAST RESORT. Only acceptable for `overflow-*`, `max-w-*`, `flexShrink: 0`, `border-b` on non-DataTable elements, and genuinely isolated single-element spacings with no possible sibling grouping.

**Class → replacement:**

| Class | Replacement |
|---|---|
| `text-body-*`, `text-heading-*`, `text-label-*`, `text-caption-*`, `text-display-*`, `text-metric-*` | `<Text variant="body/md">` etc., with `as="div"`/`as="span"` for the replaced element type. Compound: `className="text-body-md text-text-secondary"` → `<Text variant="body/md" color="secondary">`. |
| `text-text-secondary`, `text-text-tertiary`, `text-primary`, `text-danger`, `text-success`, `text-warning`, `text-text-inverted` | `<Text color="secondary">` prop. On `<Td>` use `<Td color="secondary">` (prop added in 00-Prep). |
| `text-text` (default) on bare element | Wrap in `<Text as="div"/"span">` (inherits body color). |
| `border-border`, `border-primary` | `style={{ borderColor: 'var(--ant-color-border)' }}` / `'var(--ant-color-primary)'` |
| `divide-border` | Remove — DataTable renders its own row borders. Elsewhere use explicit border styles. |
| `bg-primary` | `style={{ backgroundColor: 'var(--ant-color-primary)' }}` |
| `mb-N`, `mt-N` on 2+ siblings | Wrap parent in `<Flex vertical gap={N*4}>`, remove the `mb-N` from children. |
| `mb-N`, `mt-N` single element with no siblings | `style={{ marginBottom: N*4 }}` / `marginTop: N*4` |
| `p-N`, `pt-N`, `pb-N` | `style={{ padding: N*4 }}` etc. |
| `w-full` on `<Button>` | `<Button block>` |
| `w-full` on `<Input>`, `<Select>`, `<DatePicker>` | Remove — already 100% by default |
| `w-full` on arbitrary div | `style={{ width: '100%' }}` |
| `flex-1` on AntD Flex child | `<Flex flex={1}>` |
| `flex-1` on arbitrary element | `style={{ flex: 1 }}` |
| `shrink-0` | `style={{ flexShrink: 0 }}` |
| `max-w-2xl` | `style={{ maxWidth: '42rem' }}` |
| `overflow-hidden` | `style={{ overflow: 'hidden' }}` |
| `overflow-y-auto` | `style={{ overflowY: 'auto' }}` |
| `border-b` on non-DataTable | `style={{ borderBottom: '1px solid var(--ant-color-border)' }}` |
| `row-hover` on `<Tr>` | `<Tr hover>` (DS already supports this) |
| `hover-underline-on-row-hover` | Local CSS module on the owning component (see 03-Patient — lives on `ClientsPageClient.tsx`) |
| `ai-typing-dot`, `ai-chat-button-reset`, `ai-chat-input-reset` | Already moved to `AiChatPanel.module.css` in 00-Prep |

**`N*4` conversion table for spacing tokens** (for when wrapping isn't possible):

| Token | Pixels |
|---|---|
| `-0` | 0 |
| `-1` | 4 |
| `-2` | 8 |
| `-3` | 12 |
| `-4` | 16 |
| `-5` | 20 |
| `-6` | 24 |
| `-8` | 32 |

**Measurement snippets** (for Chrome MCP dual-tab per plan — paste into the localhost AND production tabs):

```js
// Typography
(() => {
  const selectors = [
    { sel: 'main h1, .ant-typography h1', label: 'Page h1' },
    { sel: 'main h2', label: 'H2' },
    { sel: 'table td:first-child', label: 'First td' },
    { sel: 'label, .ant-form-item-label > label', label: 'Form label' },
  ];
  const props = ['fontSize','fontWeight','color','lineHeight','fontFamily'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error:'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p => [p, s[p]]))};
  }), null, 2);
})()

// Spacing
(() => {
  const selectors = [
    { sel: 'main > *:first-child', label: 'First main child' },
    { sel: 'form > *:nth-child(2)', label: 'Second form child' },
    { sel: '.ant-card, [class*="card"]', label: 'First card' },
  ];
  const props = ['marginBottom','marginTop','paddingTop','paddingBottom','paddingLeft','paddingRight','gap'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error:'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p => [p, s[p]]))};
  }), null, 2);
})()
```

Thresholds per the utility-class plan's original Phase H: typography exact (fontSize, fontWeight, color exact RGB; lineHeight ±1px); spacing ±2px; color exact RGB.

## Ground rules for every Wave 5 session

Same as Wave 4 but re-stated:

1. **DS-first, extend don't bypass.** A Wave 4 component covers the use case or it doesn't. Missing props → add to the DS component; don't inline `<span style={{...}}>`.
2. **Layout replacement priority (from the utility-class plan):** `<Flex vertical gap={N}>` first → DS spacing props second → AntD native props (`block`, `flex`) third → `style={{}}` inline last resort. Inline is only acceptable for `overflow-*`, `max-w-*`, `flexShrink`, `border-b`, and genuinely isolated single-element spacings.
3. **Chrome MCP dual-tab measurement is mandatory** for every page migration (see `docs/quality-gate.md` and `docs/reference/measurement-protocol.md`). Production vs localhost at 1440×900.
4. **Verification evidence** lives in `.verification-evidence` per the pre-commit hook.
5. **Commit per surface, not per component.** When migrating CalendarView, AppointmentCard + ContextMenu + HoverCard + SegmentedControl + utility-class cleanup commit together — one coherent page change.
6. **Session log entry** per plan in `docs/ds-audit-session-log.md` on completion.
7. **Status flip** in the plan file last (Planned → In progress at start → Done at end).

## Where the old utility-class plan went

`docs/superpowers/plans/2026-04-22-remove-utility-classes.md` is preserved for reference but its phases have been absorbed into Wave 5:

| Old plan phase | Where it moved |
|---|---|
| Phase 0 (ESLint tracking + baseline) | 00-Prep |
| Phase A Task A1 (`Td color`) | 00-Prep |
| Phase A Task A2 (List internals) | Already done — Wave 4 List enhancement rewrote List.tsx and it's utility-class-clean |
| Phase A Task A3 (AiChatPanel module) | 00-Prep |
| Phase B (typography migration) | Split across 01–06 per surface |
| Phase C (color migration) | Split across 01–06 per surface |
| Phase D (layout migration with Flex-gap priority) | Split across 01–06 per surface |
| Phase E (structural classes) | Split across 01, 03 (where `row-hover` / `hover-underline-on-row-hover` live) |
| Phase F (stories cleanup) | 07-Stories |
| Phase G (globals.css delete) | 08-Cleanup |
| Phase H (Chrome MCP regression sweep) | 08-Cleanup |
| Phase I (ESLint warn → error) | 08-Cleanup |

The mapping tables, measurement snippets, and commit message conventions from the original plan are all referenced from their new homes.

## Not in Wave 5 scope

These were raised but intentionally deferred to Wave 6+:

- `MultiSelect` component (Wave 4 shipped single-select ComboBox only)
- `DateTimePicker` (combined date+time input)
- Typed-signature fallback baked into SignaturePad
- HoverCard safe-triangle
- ContextMenu long-press for touch
- AI command suggestions in CommandPalette (`suggestCommands` hook)
- `AvailabilityCard` (distinct from AppointmentCard — empty bookable slot)
- `BusyTimeBlock`
- E.164 phone backfill script for existing records
- Full DS audit re-run scheduled 2026-07-20 (3 months post-baseline)
