# Remove Utility Class Vestiges — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all Tailwind-look-alike utility classes from `globals.css` and every TSX file, replacing them with proper DS component props and `style={{}}` inline values, leaving zero utility-class vestiges in the codebase.

**Architecture:** Four-class removal in dependency order — first extend DS components to absorb patterns the utilities were covering (so callers have a destination), then migrate callers file-by-file using parallel subagents, then delete the utility definitions from globals.css. Finish with an ESLint rule that permanently prevents re-introduction.

**Tech Stack:** Next.js 16 / React 19 / TypeScript strict. DS components in `src/components/ds/`. Styling via AntD CSS-in-JS tokens + CSS modules (`Text.module.css`) + `style={{}}` inline for one-off layout. No Tailwind package is installed — the utility classes are plain hand-written CSS in `src/app/globals.css`.

**Prerequisites:** All Wave 4 DS component builds complete. Every DS component that pages currently need exists in `src/components/ds/`.

---

## Background: what exists and why

`src/app/globals.css` defines ~55 utility classes across four groups, all written by hand during the AntD migration as a crutch:

| Group | Classes | Usages in TSX | Replacement |
|---|---|---|---|
| **Typography** | `text-body-md`, `text-heading-lg`, `text-label-lg`, `text-caption-sm`, etc. (18 classes) | ~756 | `<Text variant="body/md">` DS component |
| **Color** | `text-text`, `text-text-secondary`, `text-primary`, `text-danger`, `border-border`, etc. (12 classes) | ~872 | `<Text color="secondary">`, `Td color` prop, AntD token vars inline |
| **Layout spacing** | `mb-0..8`, `mt-0..8`, `p-0..6`, `pt-*`, `pb-*`, `flex-1`, `shrink-0`, `w-full`, `max-w-2xl`, `overflow-hidden`, `overflow-y-auto`, `border-b` (32 classes) | ~425 | `style={{ marginBottom: 16 }}` inline (CLAUDE.md permits one-off layout inline) |
| **Structural** | `row-hover`, `hover-underline-on-row-hover`, `md:hidden-replacement`, `sm:inline-replacement`, `overflow-x-auto-util` (5 patterns) | ~4 | DS component props or CSS module on the owning component |

**Also in globals.css but KEEP:**
- Font-face declarations (Sprig Sans)
- `:root {}` CSS variable block (AntD token aliases + spacing scale)
- `body {}` reset
- `*, *::before, *::after { box-sizing... }` reset
- AntD-specific overrides (`.ant-table-thead`, `.ds-search-bar`, `.ant-tabs-tab`)
- `.ai-typing-dot`, `.ai-chat-button-reset`, `.ai-chat-input-reset` — move to AiChatPanel.module.css

---

## File map

**Files modified (DS components):**
- `src/components/ds/DataTable.tsx` — add `color` prop to `Td` + verify `Tr.hover` covers row-hover pattern
- `src/components/ds/List.tsx` — replace internal `text-label-lg` / `text-body-md` className strings with `<Text>` component
- `src/components/AiChatPanel.tsx` — move `.ai-typing-dot` / `.ai-chat-button-reset` / `.ai-chat-input-reset` to local CSS module
- `src/app/globals.css` — remove all four utility groups in Phase G

**Files modified (app pages — high count):**
All files with >10 utility-class usages are listed explicitly in the per-task scope. Lower-count files are handled as a sweep in Phase F.

**New files:**
- `src/components/AiChatPanel.module.css` — scoped CSS for AI chat component

---

## Phase A — Extend DS components to absorb utility patterns

*Must complete before any caller migration. No Chrome MCP needed for code-only prop additions; Storybook verification only.*

### Task A1: Add `color` prop to `Td`

**Why:** 23+ call sites pass `className="text-text-secondary"` or `className="text-primary"` to `Td`. Without a `color` prop, callers must keep using the utility class.

**Files:**
- Modify: `src/components/ds/DataTable.tsx` (line ~185)
- Modify: `src/components/ds/stories/DataTable.stories.tsx`

- [ ] **Read the file**

```bash
cat -n src/components/ds/DataTable.tsx | sed -n '183,195p'
```

- [ ] **Add `color` prop to `Td` interface and implementation**

Current signature:
```tsx
export function Td({ children, align = "left", className, hidden, colSpan, style }:
  { children?: ReactNode; align?: string; className?: string; hidden?: string; colSpan?: number; style?: React.CSSProperties })
```

New signature — add `color?: "default" | "secondary" | "tertiary" | "primary" | "danger" | "success" | "warning"`:
```tsx
const tdColorMap: Record<string, string> = {
  default:   "rgb(65, 69, 73)",
  secondary: "var(--ant-color-text-secondary, #6E6E64)",
  tertiary:  "var(--ant-color-text-tertiary, #b8bcc0)",
  primary:   "var(--ant-color-primary, #8250FF)",
  danger:    "var(--ant-color-error, #D00032)",
  success:   "var(--ant-color-success, #00C269)",
  warning:   "var(--ant-color-warning, #FFD232)",
};

export function Td({ children, align = "left", className, hidden, colSpan, style, color }:
  { children?: ReactNode; align?: string; className?: string; hidden?: string; colSpan?: number; style?: React.CSSProperties; color?: keyof typeof tdColorMap }) {
  const colorStyle = color ? { color: tdColorMap[color] } : {};
  return (
    <td className={className} colSpan={colSpan}
        style={{ padding: "16px", textAlign: align as React.CSSProperties["textAlign"], fontSize: 14, color: "rgb(65, 69, 73)", ...colorStyle, ...style }}>
      {children}
    </td>
  );
}
```

- [ ] **Add a Storybook story exercising color variants**

In `src/components/ds/stories/DataTable.stories.tsx`, add:
```tsx
export const TdColors: Story = {
  name: "Td Colors",
  render: () => (
    <DataTable>
      <Thead><Tr><Th>Color</Th><Th>Cell</Th></Tr></Thead>
      <Tbody>
        {(["default","secondary","tertiary","primary","danger","success","warning"] as const).map(c => (
          <Tr key={c}><Td>{c}</Td><Td color={c}>Sample text</Td></Tr>
        ))}
      </Tbody>
    </DataTable>
  ),
};
```

- [ ] **Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -10
```
Expected: 0 errors (only pre-existing Storybook module error is acceptable).

- [ ] **Verify in Storybook** — `npm run storybook`, open `http://localhost:6006/?path=/story/datatable--td-colors`, confirm 7 coloured rows render.

- [ ] **Commit**

```bash
git add src/components/ds/DataTable.tsx src/components/ds/stories/DataTable.stories.tsx
git commit -m "ds: add color prop to Td (secondary/primary/danger/success/warning)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task A2: Migrate `List.tsx` internals to `<Text>`

**Why:** `List.tsx` uses `className="text-label-lg"` and `className="text-body-md"` directly — DS components should not depend on globals.css utilities.

**Files:**
- Modify: `src/components/ds/List.tsx` (lines ~23, 26)

- [ ] **Read the file**

```bash
cat -n src/components/ds/List.tsx | sed -n '18,35p'
```

- [ ] **Replace className strings with `<Text>` component**

Current (line ~23):
```tsx
<div className="text-label-lg" style={{ color: "var(--color-text)", marginBottom: 2 }}>
  {item.label}
</div>
```

Replace with:
```tsx
<Text variant="label/lg" as="div" style={{ marginBottom: 2 }}>
  {item.label}
</Text>
```

Current (line ~26):
```tsx
<div className="text-body-md" style={{ color: "var(--color-text-secondary)" }}>
  {item.value}
</div>
```

Replace with:
```tsx
<Text variant="body/md" color="secondary" as="div">
  {item.value}
</Text>
```

Ensure `Text` is imported at the top of `List.tsx`:
```tsx
import Text from "./Text";
```

- [ ] **Run TypeScript check and confirm 0 errors**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -5
```

- [ ] **Commit**

```bash
git add src/components/ds/List.tsx
git commit -m "ds: migrate List.tsx internals from utility classes to <Text> component

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task A3: Isolate AiChatPanel utility classes to CSS module

**Why:** `AiChatPanel.tsx` uses `.ai-typing-dot`, `.ai-chat-button-reset`, `.ai-chat-input-reset` — these should live in a scoped module, not globals.css.

**Files:**
- Create: `src/components/AiChatPanel.module.css`
- Modify: `src/components/AiChatPanel.tsx`

- [ ] **Read current usage**

```bash
grep -n "ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset" src/components/AiChatPanel.tsx
```

- [ ] **Create the module CSS file**

```css
/* src/components/AiChatPanel.module.css */
.typingDot {
  display: inline-block;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
}

.buttonReset {
  border: none;
}

.inputReset {
  border: none;
}
```

- [ ] **Update AiChatPanel.tsx imports and className references**

Add at top:
```tsx
import styles from "./AiChatPanel.module.css";
```

Replace each usage:
- `className="ai-typing-dot"` → `className={styles.typingDot}`
- `className="ai-chat-button-reset"` → `className={styles.buttonReset}`
- `className="ai-chat-input-reset"` → `className={styles.inputReset}`

- [ ] **Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -5
```

- [ ] **Commit**

```bash
git add src/components/AiChatPanel.module.css src/components/AiChatPanel.tsx
git commit -m "refactor: move AiChatPanel utility classes to local CSS module

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase B — Typography class migration

*Replace `className="text-body-md"` (and all 17 other typography utility classes) with `<Text variant="...">`. Do NOT change elements that are children of DS components (Td, Th, Button, Card etc.) — those are fine as-is once the parent DS component prop covers the needed styling.*

**Mapping table:**

| Utility class | Text variant | Notes |
|---|---|---|
| `text-display-lg` | `display/lg` | Also has color:green built-in — matches `page-title` variant |
| `text-display-md` | `display/md` | |
| `text-display-sm` | `display/sm` | |
| `text-heading-lg` | `heading/lg` | |
| `text-heading-md` | `heading/md` | |
| `text-heading-sm` | `heading/sm` | |
| `text-body-lg` | `body/lg` | |
| `text-body-md` | `body/md` | |
| `text-body-sm` | `body/sm` | |
| `text-body-md-strong` | `body/md` + `weight="bold"` | No direct variant; use weight prop |
| `text-body-lg-strong` | `body/lg` + `weight="bold"` | |
| `text-label-lg` | `label/lg` | |
| `text-label-md` | `label/md` | |
| `text-label-sm` | `label/sm` | |
| `text-caption-md` | `caption/md` | |
| `text-caption-sm` | `caption/sm` | |
| `text-metric-lg` | (see note) | No exact Text variant; create `metric/lg` OR keep as CSS module class |
| `text-metric-md` | (see note) | Same |

**Note on `text-metric-*`:** If used ≤2 times, keep as inline `style={{...}}`. If used 3+ times, add `metric/lg` and `metric/md` variants to `Text.tsx` + `Text.module.css` first (same approach as session 03).

**`as` prop:** When the element being replaced is a `<div>` or `<span>`, use `<Text variant="..." as="div">` or `as="span"` to preserve HTML semantics. When it is a `<p>`, the default Text render is fine.

**Composed classes:** When `className="text-body-md text-text-secondary"` appears, replace with `<Text variant="body/md" color="secondary">`. When `className="text-body-md text-primary"` appears, use `color="primary"`.

### Task B1: Check metric variant usage and extend Text if needed

- [ ] **Count metric class usages**

```bash
grep -rn 'text-metric-lg\|text-metric-md' src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **If ≤2 usages:** Note the pixel values (30px/700 and 24px/700 Sprig Sans tabular-nums) and plan to replace with inline `style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}` in the respective files. Skip to Task B2.

- [ ] **If ≥3 usages:** Add `metric/lg` (30px/700/Sprig Sans/tabular-nums) and `metric/md` (24px/700/Sprig Sans/tabular-nums) to `Text.module.css` and `TextVariant` type in `Text.tsx`. Follow the exact same steps as session 03 (heading/xl addition). Commit separately.

---

### Task B2: Migrate typography classes — clients/[id] subtree

**Files in scope:** All `*.tsx` in `src/app/clients/[id]/` (excluding DS stories).

- [ ] **Get baseline counts**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-' \
  src/app/clients --include='*.tsx' | grep -v stories | wc -l
```

- [ ] **Migrate each file:** For each hit, replace the utility class usage with `<Text variant="...">` per the mapping table above. Use `as="div"` / `as="span"` when wrapping inline/block elements. When the element already has `color` or `weight` utility classes combined, consolidate into `<Text>` props.

- [ ] **TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -10
```

- [ ] **Chrome MCP verification** — visit `http://localhost:3000/clients/[seed-client-id]` (e.g. any client from the seed data), compare typography rendering to production `https://acme.splose.com/clients/[id]`. Confirm font sizes and weights unchanged.

- [ ] **Commit**

```bash
git add src/app/clients/
git commit -m "refactor: migrate typography utility classes → <Text> in clients/* pages

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task B3: Migrate typography classes — invoices subtree

**Files in scope:** `src/app/invoices/[id]/page.tsx`, `src/app/invoices/new/page.tsx`, `src/app/invoices/[id]/InvoiceDetailClient.tsx` (dead code — still clean it), `src/app/invoices/` other pages.

- [ ] **Get baseline counts**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-' \
  src/app/invoices --include='*.tsx' | wc -l
```

- [ ] **Migrate each hit** per the mapping table. (Invoice pages already had heading/xl + weight migrations in sessions 23/25 — focus on remaining body/label/caption classes.)

- [ ] **TypeScript check** + Chrome MCP: visit `/invoices` list and one invoice detail. Confirm typography unchanged.

- [ ] **Commit**

```bash
git add src/app/invoices/
git commit -m "refactor: migrate typography utility classes → <Text> in invoices/* pages

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task B4: Migrate typography classes — settings subtree

**Files in scope:** All `*.tsx` in `src/app/settings/`.

- [ ] **Baseline count**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-' \
  src/app/settings --include='*.tsx' | wc -l
```

- [ ] **Migrate each hit.** Settings pages have many label/value pairs — most will become `<Text variant="label/lg">` or `<Text variant="body/md">`.

- [ ] **TypeScript check** + Chrome MCP: spot-check `/settings/details` and `/settings/forms/[id]`.

- [ ] **Commit**

```bash
git add src/app/settings/
git commit -m "refactor: migrate typography utility classes → <Text> in settings/* pages

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task B5: Migrate typography classes — remaining app pages

**Files in scope:** All remaining `*.tsx` in `src/app/` not already covered (dashboard, calendar, notes, waitlist, reports, contacts, products, payments, online-booking, etc.) plus `src/components/AiChatPanel.tsx`.

- [ ] **Get full list of remaining files with hits**

```bash
grep -rln 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-' \
  src/app src/components --include='*.tsx' | grep -v 'stories\|clients\|invoices\|settings'
```

- [ ] **Migrate all files.** Process in parallel (dispatch one subagent per subdirectory).

- [ ] **TypeScript check** + Chrome MCP: spot-check dashboard, reports, calendar, notes.

- [ ] **Commit per subdirectory** or as one sweep commit.

---

### Task B6: Verify zero typography utility class usages remain in non-story TSX

- [ ] **Run verification grep**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-' \
  src/app src/components --include='*.tsx' | grep -v stories
```

Expected output: 0 lines. If any remain, fix before proceeding.

---

## Phase C — Color class migration

*Replace `text-text`, `text-text-secondary`, `text-primary`, `text-danger`, `text-success`, `text-warning`, `text-text-inverted`, `border-border`, `border-primary`, `divide-border`, `bg-primary` usages with DS props or inline CSS variable references.*

**Strategy by usage context:**

| Context | Class | Replacement |
|---|---|---|
| `<Text>` child / standalone text | `text-text-secondary` | `<Text color="secondary">` |
| `<Text>` child / standalone text | `text-text-tertiary` | `<Text color="tertiary">` |
| `<Text>` child / standalone text | `text-primary` | `<Text color="primary">` |
| `<Text>` child / standalone text | `text-danger` | `<Text color="danger">` |
| `<Text>` child / standalone text | `text-success` | `<Text color="success">` |
| `<Text>` child / standalone text | `text-warning` | `<Text color="warning">` |
| `<Td>` color override | `text-text-secondary` | `<Td color="secondary">` |
| `<Td>` color override | `text-primary` | `<Td color="primary">` |
| Border on `<div>` or AntD | `border-border` | `style={{ borderColor: 'var(--ant-color-border)' }}` |
| Background on container | `bg-primary` | `style={{ backgroundColor: 'var(--ant-color-primary)' }}` |
| Row dividers | `divide-border` | Remove — DataTable renders its own row borders |

**Note on `text-text` (default color):** When `className="text-text"` appears alone with no typography class, it is setting color to the default body text color. Since `<Text>` defaults to that color anyway, `className="text-text"` can simply be **dropped** when converting to `<Text>`. When it appears on a non-Text element (bare `<div>`), replace with `style={{ color: 'var(--ant-color-text)' }}` or wrap with `<Text as="div">`.

### Task C1: Migrate `<Td>` color class usages to `Td color` prop

(Now possible because Task A1 added the `color` prop.)

- [ ] **Find all Td color class usages**

```bash
grep -rn '<Td className="text-text-secondary\|<Td className="text-primary\|<Td className="text-danger\|<Td className="text-success"' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Replace each** with `<Td color="secondary">`, `<Td color="primary">`, etc. (remove the `className` prop).

- [ ] **TypeScript check** + Chrome MCP: verify table cell colors unchanged on `/clients/[id]` and `/clients/[id]/invoices`.

- [ ] **Commit**

```bash
git add src/app/
git commit -m "refactor: replace Td className color classes with Td color prop

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task C2: Migrate standalone color classes to `<Text>` props

*All non-Td usages of `text-text-secondary`, `text-primary`, `text-danger` etc. on bare HTML elements.*

- [ ] **Find remaining color class usages (non-Td)**

```bash
grep -rn 'className=.*text-text\b\|className=.*text-text-secondary\|className=.*text-primary\|className=.*text-danger\|className=.*text-success\|className=.*text-warning\|className=.*text-text-inverted' \
  src/app src/components --include='*.tsx' | grep -v stories | grep -v '<Td\|<Th'
```

- [ ] **Migrate each hit** — wrap element in `<Text color="..." as="div/span/p">` or, if the element is already a `<Text>`, add `color` prop directly.

- [ ] **TypeScript check** + Chrome MCP: spot-check a representative page.

- [ ] **Commit**

```bash
git add src/app/ src/components/
git commit -m "refactor: replace standalone text-* color classes with <Text color> prop

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task C3: Migrate `border-border`, `border-primary`, `divide-border`, `bg-primary`

- [ ] **Find all usages**

```bash
grep -rn 'border-border\|border-primary\|divide-border\|bg-primary' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Replace each:**
  - `className="border-border"` on a container → `style={{ borderColor: 'var(--ant-color-border)' }}` (keep `border: '1px solid'` if already present)
  - `className="border-primary"` → `style={{ borderColor: 'var(--ant-color-primary)' }}`
  - `className="divide-border"` → the DataTable renders its own borders; if on a non-table container, use `style={{ borderTop: '1px solid var(--ant-color-border)' }}` per child
  - `className="bg-primary"` → `style={{ backgroundColor: 'var(--ant-color-primary)' }}`
  - `className="bg-primary/5"` → `style={{ backgroundColor: 'rgba(130, 80, 255, 0.05)' }}`

- [ ] **TypeScript check** + Chrome MCP: verify borders and backgrounds unchanged.

- [ ] **Commit**

```bash
git add src/app/ src/components/
git commit -m "refactor: replace border-*/bg-primary utility classes with inline CSS vars

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task C4: Verify zero color utility class usages remain

```bash
grep -rn 'text-text\b\|text-text-secondary\|text-text-tertiary\|text-text-inverted\|text-primary\b\|text-danger\|text-success\|text-warning\|border-border\|border-primary\|divide-border\|bg-primary' \
  src/app src/components --include='*.tsx' | grep -v stories
```

Expected: 0 lines.

---

## Phase D — Layout utility class migration

*Replace `mb-*`, `mt-*`, `p-*`, `pt-*`, `pb-*`, `flex-1`, `shrink-0`, `w-full`, `max-w-2xl`, `overflow-hidden`, `overflow-y-auto`, `border-b` with `style={{}}` inline values. CLAUDE.md permits one-off layout inline styles explicitly.*

**Mapping (reverse of session 26b/31):**

| Class | Inline style |
|---|---|
| `mb-0` | `style={{ marginBottom: 0 }}` |
| `mb-1` | `style={{ marginBottom: 4 }}` |
| `mb-2` | `style={{ marginBottom: 8 }}` |
| `mb-3` | `style={{ marginBottom: 12 }}` |
| `mb-4` | `style={{ marginBottom: 16 }}` |
| `mb-5` | `style={{ marginBottom: 20 }}` |
| `mb-6` | `style={{ marginBottom: 24 }}` |
| `mb-8` | `style={{ marginBottom: 32 }}` |
| `mt-0/1/2/3/4/6/8` | Same scale × `marginTop` |
| `p-0/2/3/4/6` | Same scale × `padding` |
| `pt-2/4/6` | Same scale × `paddingTop` |
| `pb-2/4` | Same scale × `paddingBottom` |
| `flex-1` | `style={{ flex: 1 }}` |
| `shrink-0` | `style={{ flexShrink: 0 }}` |
| `w-full` | `style={{ width: '100%' }}` |
| `max-w-2xl` | `style={{ maxWidth: '42rem' }}` |
| `overflow-hidden` | `style={{ overflow: 'hidden' }}` |
| `overflow-y-auto` | `style={{ overflowY: 'auto' }}` |
| `border-b` | `style={{ borderBottom: '1px solid var(--ant-color-border)' }}` |

**Merging:** When an element already has a `style={{}}` prop, merge the new property into it rather than adding a second `style` prop. When a utility class is the ONLY thing on `className`, remove `className` entirely.

**Also handle:** `pt-5` (20px paddingTop) — not in the utility set but found in the grep. Replace with `style={{ paddingTop: 20 }}`.

### Task D1: Migrate layout classes — high-count files

Run one subagent per file for the 8 files with ≥10 layout class usages. Dispatch in parallel.

- [ ] **Get per-file counts**

```bash
grep -rn 'className=.*\(mb-\|mt-\|p-[0-9]\|pt-\|pb-\|flex-1\|shrink-0\|w-full\|max-w-\|overflow-hidden\|overflow-y-auto\|border-b\)' \
  src/app src/components --include='*.tsx' | grep -v stories \
  | awk -F: '{print $1}' | sort | uniq -c | sort -rn | head -15
```

- [ ] **For each file with ≥10 usages**, replace every layout utility class per the mapping table above. When a className string becomes empty after removal, delete the `className` prop.

- [ ] **TypeScript check** after all files edited.

- [ ] **Chrome MCP verification** on the 3-4 most-changed pages.

- [ ] **Commit**

```bash
git add src/app/ src/components/
git commit -m "refactor: replace layout utility classes with inline styles (high-count files)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task D2: Migrate layout classes — remaining files sweep

- [ ] **Find all remaining files with layout utility classes**

```bash
grep -rln 'className=.*\(mb-\|mt-\|p-[0-9]\|pt-\|pb-\|flex-1\|shrink-0\|w-full\|overflow-hidden\|overflow-y-auto\|border-b\)' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Migrate all remaining files** per the mapping table.

- [ ] **TypeScript check** + spot-check Chrome MCP.

- [ ] **Commit**

```bash
git add src/app/ src/components/
git commit -m "refactor: replace layout utility classes with inline styles (sweep)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task D3: Verify zero layout utility class usages remain

```bash
grep -rn 'className=.*\b\(mb-[0-9]\|mt-[0-9]\|p-[0-9]\|pt-[0-9]\|pb-[0-9]\|flex-1\|shrink-0\|w-full\|max-w-2xl\|overflow-hidden\|overflow-y-auto\|border-b\b\)' \
  src/app src/components --include='*.tsx' | grep -v stories
```

Expected: 0 lines.

---

## Phase E — Structural class migration

### Task E1: Replace `row-hover` with `Tr hover` prop

**File:** `src/app/clients/[id]/appointments/AppointmentSidePanel.tsx:165`

The `Tr` component already accepts a `hover` prop (see `DataTable.tsx:189`). The `row-hover` class triggers `tr.row-hover:hover { background-color: #f9fafb }` in globals.css — exactly what `<Tr hover>` does.

- [ ] **Read the file**

```bash
sed -n '163,168p' src/app/clients/\[id\]/appointments/AppointmentSidePanel.tsx
```

- [ ] **Replace**

Change: `<Tr className="row-hover">`
To: `<Tr hover>`

- [ ] **TypeScript check** + Chrome MCP: visit a client's appointments panel, confirm row hover background still shows.

- [ ] **Commit**

```bash
git add "src/app/clients/[id]/appointments/AppointmentSidePanel.tsx"
git commit -m "refactor: replace row-hover utility class with Tr hover prop

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task E2: Replace `hover-underline-on-row-hover` with CSS module

**File:** `src/app/clients/ClientsPageClient.tsx:78`

The `hover-underline-on-row-hover` class is `tr:hover .hover-underline-on-row-hover { text-decoration: underline }`. Since this is a single file, scope it to a CSS module.

- [ ] **Read the usage**

```bash
sed -n '75,82p' src/app/clients/ClientsPageClient.tsx
```

- [ ] **Create or extend `ClientsPageClient.module.css`** (create if it doesn't exist):

```css
/* When parent <tr> is hovered, underline this element */
tr:hover .hoverUnderline {
  text-decoration: underline;
}
```

- [ ] **Update import and className in `ClientsPageClient.tsx`:**

```tsx
import styles from "./ClientsPageClient.module.css";
// …
<span className={styles.hoverUnderline}>
```

- [ ] **TypeScript check** + Chrome MCP: visit `/clients`, hover a row, confirm client name underlines.

- [ ] **Commit**

```bash
git add src/app/clients/ClientsPageClient.tsx src/app/clients/ClientsPageClient.module.css
git commit -m "refactor: scope hover-underline to ClientsPageClient CSS module

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task E3: Remove responsive replacement classes (if any usages exist)

- [ ] **Check for usages**

```bash
grep -rn 'md.hidden-replacement\|md.block-replacement\|md.flex-row-replacement\|sm.inline-replacement\|overflow-x-auto-util' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **If 0 usages:** Skip to Phase F. Note that these classes are defined in globals.css but unused — they will be deleted in Phase F.

- [ ] **If any usages found:** For each hit, replace with the equivalent inline style or AntD responsive prop. For `md:hidden-replacement`, the correct replacement is a conditional render based on viewport (unlikely to be used in this codebase which targets desktop). Investigate each case and replace appropriately.

---

## Phase F — Clean up Storybook stories

*Stories use utility classes too. They do not affect production but should be cleaned up for consistency. Lower priority — do after all app/component code is clean.*

### Task F1: Migrate utility classes in DS stories

- [ ] **Find utility class usages in stories**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-text\b\|text-text-secondary\|border-border\|mb-\|mt-\|p-[0-9]' \
  src/components/ds/stories --include='*.tsx' | wc -l
```

- [ ] **For each story file with hits:** Replace utility classes with inline styles or `<Text>` components per the same mapping as Phase B/C/D. Stories are demonstration code — keep them readable; prefer `<Text>` over raw inline styles where possible.

- [ ] **TypeScript check** (`npx tsc --noEmit`) + Storybook smoke check (no broken stories).

- [ ] **Commit**

```bash
git add src/components/ds/stories/
git commit -m "refactor: replace utility classes in Storybook stories

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase G — Delete utility class definitions from globals.css

*Only run this phase after Phases A–F verified-complete (zero grep hits in TSX files).*

### Task G1: Remove utility blocks from globals.css

**File:** `src/app/globals.css`

The following sections should be **deleted entirely:**

1. `/* ── Typography utility classes ── */` block (lines ~64–165, classes `.text-display-lg` through `.text-metric-md`)
2. `/* ── Color utility classes ── */` block (lines ~166–198, classes `.text-text` through `.bg-primary` and `.ai-typing-dot`, `.ai-chat-button-reset`, `.ai-chat-input-reset`, `.border-border`, `.border-primary`, `.divide-border`)
3. `/* ── Layout utility classes (replacing dead Tailwind) ── */` block (lines ~199–249, `.mb-0` through `.border-b`)
4. `/* ── Layout utility classes (replacing dead Tailwind) ── */` second section (lines ~270–297, `.hover-underline-on-row-hover`, `tr.row-hover:hover`, responsive media queries, `.overflow-x-auto-util`)

**Do NOT delete:**
- Font-face declarations (lines 1–25)
- `:root {}` block with CSS variables (lines 27–62)
- `body {}` and reset rules (lines ~251–268)
- AntD table header / SearchBar / Tabs overrides (lines ~299–323)

- [ ] **Run pre-deletion verification grep (must all return 0)**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-\|text-text\b\|text-text-secondary\|border-border\|mb-[0-9]\|mt-[0-9]\|p-[0-9]\|pt-[0-9]\|pb-[0-9]\|flex-1\|shrink-0\|w-full\|overflow-hidden\|overflow-y-auto\|border-b\b\|row-hover\|hover-underline' \
  src/app src/components --include='*.tsx' | grep -v stories
```

If any lines are returned, **stop** — migrate those usages before proceeding.

- [ ] **Edit globals.css** — delete the four utility blocks identified above. Keep a blank line between remaining sections for readability.

- [ ] **Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -10
```

- [ ] **Run build**

```bash
npx next build 2>&1 | tail -10
```

Expected: build passes with no errors.

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: remove all utility class definitions from globals.css

Typography, color, layout, and structural utility blocks removed.
All usages already migrated to DS components and inline styles.
Remaining globals.css: font-face, CSS variables, body reset, AntD overrides only.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase H — Full visual verification

### Task H1: Chrome MCP sweep of all primary routes

- [ ] **Set up dual-tab verification** (localhost:3000 vs acme.splose.com), viewport 1440×900.

- [ ] **Visit and screenshot each of these routes on BOTH tabs:**
  - `/` (dashboard)
  - `/calendar`
  - `/clients` (list)
  - `/clients/[id]` (detail)
  - `/clients/[id]/invoices`
  - `/notes/[id]`
  - `/notes/[id]/edit`
  - `/invoices/[id]`
  - `/invoices/new`
  - `/reports`
  - `/reports/performance`
  - `/waitlist`
  - `/products`
  - `/settings/details`
  - `/settings/forms/[id]`
  - `/settings/online-bookings/[id]`
  - `/settings/data-import`
  - `/settings/ai`

- [ ] **For each route:** measure font sizes and colors of key text elements per `docs/reference/measurement-protocol.md` Section 4b. Any regression fails — revert globals.css change for that element, investigate, fix.

- [ ] **Write `.verification-evidence`**

```
Phase H: full route sweep post-utility-class removal
Routes verified: [list all 18 above]
Comparison: localhost vs acme.splose.com
Properties measured: fontSize, fontWeight, color, marginBottom on key elements
Result: PASS / [list any regressions found and resolved]
```

- [ ] **Commit verification evidence**

```bash
git add .verification-evidence
git commit -m "verify: full Chrome MCP sweep post utility-class removal — all routes PASS"
```

---

## Phase I — Permanent prevention

### Task I1: Add ESLint rules to ban utility class re-introduction

- [ ] **Read current ESLint config**

```bash
grep -A 20 "no-restricted-syntax" eslint.config.mjs | head -25
```

- [ ] **Add selectors to the existing `no-restricted-syntax` rule** (or create a new rule entry) for the utility class patterns:

```js
// In eslint.config.mjs, add to the no-restricted-syntax array:
{
  selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(mb-|mt-|p-[0-9]|pt-|pb-|flex-1|shrink-0|w-full|text-body-|text-heading-|text-label-|text-caption-|text-display-|text-metric-|text-text\\b|text-text-secondary|text-primary\\b|border-border)/]",
  message: "Use DS components or inline styles instead of utility classes. See docs/superpowers/plans/2026-04-22-remove-utility-classes.md"
},
```

- [ ] **Run ESLint to confirm 0 violations**

```bash
npx eslint src/app src/components --no-ignore 2>/dev/null | grep "utility-classes\|Use DS components" | wc -l
```

Expected: 0.

- [ ] **Commit**

```bash
git add eslint.config.mjs
git commit -m "lint: ban utility-class re-introduction via no-restricted-syntax rule

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Definition of Done

All of the following must be true before this plan is considered complete:

1. `grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-display-\|text-metric-' src/app src/components --include='*.tsx' | grep -v stories` → **0 lines**
2. `grep -rn '\btext-text\b\|text-text-secondary\|border-border\|bg-primary' src/app src/components --include='*.tsx' | grep -v stories` → **0 lines**
3. `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\|className=.*flex-1\b\|className=.*shrink-0\b\|className=.*overflow-hidden\b' src/app src/components --include='*.tsx' | grep -v stories` → **0 lines**
4. `grep -rn 'row-hover\|hover-underline-on-row-hover' src/app src/components --include='*.tsx'` → **0 lines**
5. `src/app/globals.css` contains no `.text-*`, `.mb-*`, `.mt-*`, `.p-*`, `.border-*`, `.flex-1`, `.shrink-0`, `.w-full` utility class definitions — only font-face, `:root {}`, `body {}`, reset, and AntD overrides
6. `npx tsc --noEmit` → 0 errors (pre-existing Storybook module error is the only acceptable exception)
7. `npx next build` → passes
8. Chrome MCP sweep of 18 primary routes shows no visual regressions vs production
9. ESLint rule banning utility classes is in place and reports 0 violations

---

## Effort estimate

| Phase | Scope | Estimated effort |
|---|---|---|
| A — DS component extensions | 3 targeted edits | 20 min |
| B — Typography migration | ~756 usages, 50+ files | 90 min (parallel subagents) |
| C — Color migration | ~872 usages, 58+ files | 90 min (parallel subagents) |
| D — Layout migration | ~425 usages | 45 min (parallel subagents) |
| E — Structural | 4 usages | 15 min |
| F — Stories cleanup | ~100 usages in stories | 30 min |
| G — globals.css deletion | 1 file, surgical | 10 min |
| H — Visual verification sweep | 18 routes, dual-tab | 60 min |
| I — ESLint rule | 1 config edit | 10 min |
| **Total** | | **~6 hours** |

**Note:** Phases B, C, D can run in parallel (independent files). The critical path is A → B/C/D (parallel) → E → F → G → H → I.
