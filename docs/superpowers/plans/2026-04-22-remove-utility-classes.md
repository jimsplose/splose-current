# Remove Utility Class Vestiges — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all hand-written Tailwind-look-alike utility classes from `globals.css` and every TSX file, with zero visual regressions. Replacements follow a strict priority ladder: DS component props first, then `<Flex>` gap restructuring, then AntD native element props, and only as a last resort for genuine one-offs — `style={{}}` inline. The result is a codebase where spacing and typography are expressed through the design system and layout containers, not side-channel utility classes.

**Architecture:** Four-class removal in dependency order.
1. Install ESLint tracking rules first (Phase 0, TDD) so every migration task has automatic pass/fail.
2. Extend DS components to absorb patterns the utilities were covering (Phase A) — callers need a destination before they can migrate.
3. Migrate callers file-by-file using parallel subagents (Phases B–E), each ending with a verifying grep that must return 0.
4. Clean up Storybook stories (Phase F).
5. Delete utility definitions from globals.css (Phase G) — only safe after all callers are clean.
6. Full Chrome MCP sweep with explicit measurement tables (Phase H).
7. Promote ESLint tracking rules from warn → error (Phase I).

**Layout replacement priority (Phase D):**
| Priority | When to use | Example |
|---|---|---|
| **1. `<Flex vertical gap={N}>`** | mb-N separating a vertical sequence of siblings | Wrap with `<Flex vertical gap={16}>`, remove all `mb-4` from children |
| **2. DS spacing props** | Element is a DS component that accepts `mb`/`mt`/`gap` props | `<Card mb={16}>` instead of `<Card className="mb-4">` |
| **3. AntD native props** | AntD component has a prop that covers the need | `<Button block>` instead of `<Button className="w-full">` |
| **4. `style={{}}` inline** | Genuine one-off, no container restructure possible | `style={{ marginBottom: 24 }}` — use only when no prop exists |

`style={{}}` inline for layout is the **last resort and should be exceptional** — target ≤10% of layout utility usages. The only legitimate inline cases are things that have no structural or component equivalent: `overflow-hidden`, `overflow-y-auto`, `max-w-2xl`, `border-b`, and `flexShrink: 0` on elements that must not shrink in a flex row. If you find yourself writing an inline `marginBottom`, stop and look for a Flex gap restructure first.

**Tech Stack:** Next.js 16 / React 19 / TypeScript strict. DS components in `src/components/ds/`. Styling via AntD CSS-in-JS tokens + CSS modules (`Text.module.css`) + `style={{}}` inline for genuine one-off layout. No Tailwind package is installed — the utility classes are plain hand-written CSS in `src/app/globals.css`.

**Prerequisites:** All Wave 4 DS component builds complete. Every DS component that pages currently need exists in `src/components/ds/`.

---

## Background: what exists and why

`src/app/globals.css` defines ~55 utility classes across four groups, all written by hand during the AntD migration as a temporary crutch:

| Group | Classes | Usages in TSX | Correct replacement |
|---|---|---|---|
| **Typography** | `text-body-md`, `text-heading-lg`, `text-label-lg`, `text-caption-sm`, etc. (18 classes) | ~756 | `<Text variant="body/md">` DS component |
| **Color** | `text-text`, `text-text-secondary`, `text-primary`, `text-danger`, `border-border`, etc. (12 classes) | ~872 | `<Text color="secondary">`, `<Td color>` prop, AntD token vars inline |
| **Layout spacing** | `mb-0..8`, `mt-0..8`, `p-0..6`, `pt-*`, `pb-*`, `flex-1`, `shrink-0`, `w-full`, `max-w-2xl`, `overflow-hidden`, `overflow-y-auto`, `border-b` (32 classes) | ~425 | `<Flex vertical gap={N}>` primarily; DS props; AntD props; inline only for genuine one-offs |
| **Structural** | `row-hover`, `hover-underline-on-row-hover`, `md:hidden-replacement`, `sm:inline-replacement`, `overflow-x-auto-util` (5 patterns) | ~4 | DS component props or scoped CSS module on the owning component |

**Also in globals.css but KEEP:**
- Font-face declarations (Sprig Sans)
- `:root {}` CSS variable block (AntD token aliases + spacing scale)
- `body {}` reset
- `*, *::before, *::after { box-sizing... }` reset
- AntD-specific overrides (`.ant-table-thead`, `.ds-search-bar`, `.ant-tabs-tab`)
- `.ai-typing-dot`, `.ai-chat-button-reset`, `.ai-chat-input-reset` — move to `AiChatPanel.module.css` in Phase A

---

## File map

**Files modified (DS components):**
- `src/components/ds/DataTable.tsx` — add `color` prop to `Td` + verify `Tr.hover` covers row-hover pattern
- `src/components/ds/List.tsx` — replace internal `text-label-lg` / `text-body-md` className strings with `<Text>` component
- `src/components/AiChatPanel.tsx` — move `.ai-typing-dot` / `.ai-chat-button-reset` / `.ai-chat-input-reset` to local CSS module
- `src/app/globals.css` — remove all four utility groups in Phase G

**Files modified (app pages — high count):**
All files with >10 utility-class usages are listed explicitly in the per-task scope. Lower-count files are handled as a sweep.

**New files:**
- `src/components/AiChatPanel.module.css` — scoped CSS for AI chat component

---

## Phase 0 — Baseline capture & TDD linting setup

*Run this phase before touching any utility class usages. Establishes the counts that each migration phase is reducing to zero. ESLint rules are added in warn mode so they immediately surface violations during development — flipped to error only in Phase I when counts reach zero.*

### Task 0a: Capture baseline counts

- [ ] **Run all baseline greps and record the numbers**

```bash
echo "=== Typography classes ===" && \
grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l

echo "=== Color classes ===" && \
grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*text-success\b\|className=.*text-warning\b\|className=.*text-text-inverted\|className=.*border-border\|className=.*border-primary\|className=.*divide-border\|className=.*bg-primary' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l

echo "=== Layout spacing classes ===" && \
grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\|className=.*\bpt-[0-9]\|className=.*\bpb-[0-9]\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\bmax-w-2xl\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l

echo "=== Structural classes ===" && \
grep -rn 'row-hover\|hover-underline-on-row-hover\|md.hidden-replacement\|md.block-replacement\|sm.inline-replacement\|overflow-x-auto-util' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l
```

Record these numbers at the top of this document as the Phase 0 baseline. Each subsequent phase drives its group toward 0.

**Baseline (fill in before starting Phase A):**
- Typography class usages: ___
- Color class usages: ___
- Layout spacing class usages: ___
- Structural class usages: ___

---

### Task 0b: Add ESLint tracking rules (warn mode)

*Adding these rules as warnings before migration means every remaining usage is surfaced as a lint warning in CI. This is TDD for refactoring: define failure first, then migrate until clean.*

- [ ] **Read current ESLint config**

```bash
grep -n "no-restricted-syntax" eslint.config.mjs | head -5
```

- [ ] **Add a new `no-restricted-syntax` rule block for utility class patterns:**

```js
// Add to eslint.config.mjs as a separate rule set (warn, not error — promoted to error in Phase I):
{
  rules: {
    "no-restricted-syntax": [
      "warn",
      // Typography utility classes — use <Text variant="..."> instead
      {
        selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-body-(md|lg|sm|md-strong|lg-strong)|text-heading-(sm|md|lg)|text-label-(sm|md|lg)|text-caption-(sm|md)|text-display-(sm|md|lg)|text-metric-(sm|md|lg))\\b/]",
        message: "Use <Text variant='...'> instead of typography utility class. See docs/superpowers/plans/2026-04-22-remove-utility-classes.md Phase B.",
      },
      // Color utility classes — use <Text color> prop or Td color prop instead
      {
        selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-text\\b|text-text-secondary|text-text-tertiary|text-text-inverted|text-primary\\b|text-danger|text-success|text-warning|border-border|border-primary|divide-border|bg-primary)\\b/]",
        message: "Use <Text color> prop, <Td color> prop, or CSS variable inline instead of color utility class. See Phase C.",
      },
      // Layout spacing utility classes — use Flex gap, DS props, or AntD props instead; inline style is last resort
      {
        selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(mb-[0-9]|mt-[0-9]|p-[0-9]|pt-[0-9]|pb-[0-9]|flex-1|shrink-0|w-full|max-w-2xl|overflow-hidden|overflow-y-auto|border-b\\b)\\b/]",
        message: "Replace spacing utility class with <Flex vertical gap={N}>, DS component prop, AntD prop (e.g. block), or style={{}} as last resort. See Phase D.",
      },
    ],
  },
},
```

- [ ] **Run ESLint to establish baseline warning count (this is your Phase 0 baseline)**

```bash
npx eslint src/app src/components --ext .tsx --no-ignore 2>/dev/null \
  | grep "Use <Text\|Replace spacing\|Use <Text color" | wc -l
```

Record this as **ESLint baseline warning count:** ___

Each migration phase should reduce this count. Phase I goal: 0.

- [ ] **Commit Phase 0 setup**

```bash
git add eslint.config.mjs
git commit -m "lint(phase-0): add utility-class tracking rules as warn (TDD baseline)

Typography, color, and layout utility class usages now produce ESLint warnings.
These flip to errors in Phase I once all usages are migrated.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**Phase 0 done-when:** ESLint runs without crashing; baseline warning count is recorded.

---

## Phase A — Extend DS components to absorb utility patterns

*Must complete before any caller migration. No Chrome MCP needed for code-only prop additions; Storybook verification only.*

### Task A1: Add `color` prop to `Td`

**Why:** 23+ call sites pass `className="text-text-secondary"` or `className="text-primary"` to `Td`. Without a `color` prop, callers cannot migrate.

**Files:**
- Modify: `src/components/ds/DataTable.tsx`
- Modify: `src/components/ds/stories/DataTable.stories.tsx`

- [ ] **Read the file**

```bash
grep -n "export function Td" src/components/ds/DataTable.tsx
```

- [ ] **Add `color` prop to `Td` interface and implementation**

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
  { children?: ReactNode; align?: string; className?: string; hidden?: string; colSpan?: number;
    style?: React.CSSProperties; color?: keyof typeof tdColorMap }) {
  const colorStyle = color ? { color: tdColorMap[color] } : {};
  return (
    <td className={className} colSpan={colSpan}
        style={{ padding: "16px", textAlign: align as React.CSSProperties["textAlign"],
                 fontSize: 14, color: "rgb(65, 69, 73)", ...colorStyle, ...style }}>
      {children}
    </td>
  );
}
```

- [ ] **Add a Storybook story exercising color variants**

In `src/components/ds/stories/DataTable.stories.tsx`:
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

- [ ] **TypeScript check — must return 0 errors**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -10
```

- [ ] **Verify in Storybook** — `npm run storybook`, open `http://localhost:6006/?path=/story/datatable--td-colors`, confirm 7 coloured rows render with correct colours.

- [ ] **Done-when:** `grep -n "export function Td" src/components/ds/DataTable.tsx` shows `color?:` in the interface; `npx tsc --noEmit` exits 0.

- [ ] **Commit**

```bash
git add src/components/ds/DataTable.tsx src/components/ds/stories/DataTable.stories.tsx
git commit -m "ds: add color prop to Td (secondary/primary/danger/success/warning)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task A2: Migrate `List.tsx` internals to `<Text>`

**Why:** `List.tsx` uses `className="text-label-lg"` and `className="text-body-md"` directly — DS components must not depend on globals.css utilities.

**Files:**
- Modify: `src/components/ds/List.tsx`

- [ ] **Check current usage**

```bash
grep -n "text-label-lg\|text-body-md" src/components/ds/List.tsx
```

- [ ] **Replace className strings with `<Text>` component**

Current pattern (line ~23):
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

Current pattern (line ~26):
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

Ensure `Text` is imported: `import Text from "./Text";`

- [ ] **Done-when:** `grep -n "text-label-lg\|text-body-md" src/components/ds/List.tsx` returns 0 lines; `npx tsc --noEmit` exits 0.

- [ ] **Commit**

```bash
git add src/components/ds/List.tsx
git commit -m "ds: migrate List.tsx internals from utility classes to <Text> component

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task A3: Isolate AiChatPanel utility classes to CSS module

**Why:** `AiChatPanel.tsx` uses `.ai-typing-dot`, `.ai-chat-button-reset`, `.ai-chat-input-reset` — these are component-scoped styles that should not live in globals.css.

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
.buttonReset { border: none; }
.inputReset  { border: none; }
```

- [ ] **Update AiChatPanel.tsx**

```tsx
import styles from "./AiChatPanel.module.css";
// Replace:
// className="ai-typing-dot"       → className={styles.typingDot}
// className="ai-chat-button-reset" → className={styles.buttonReset}
// className="ai-chat-input-reset"  → className={styles.inputReset}
```

- [ ] **Done-when:** `grep -n "ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset" src/components/AiChatPanel.tsx` → 0 lines; `npx tsc --noEmit` exits 0.

- [ ] **Commit**

```bash
git add src/components/AiChatPanel.module.css src/components/AiChatPanel.tsx
git commit -m "refactor: move AiChatPanel utility classes to local CSS module

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Phase A acceptance criteria

```bash
# All three must return 0:
grep -n "text-label-lg\|text-body-md" src/components/ds/List.tsx | wc -l          # → 0
grep -n "ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset" src/components/AiChatPanel.tsx | wc -l  # → 0
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l                                   # → 0
```

---

## Phase B — Typography class migration

*Replace `className="text-body-md"` (and all 17 other typography utility classes) with `<Text variant="...">`. Do NOT change elements that are already children of a DS component that sets the typography (Td, Th, Button, Card, etc.) — only standalone/naked HTML elements.*

**Mapping table:**

| Utility class | Text variant | Notes |
|---|---|---|
| `text-display-lg` | `display/lg` | Has color:green built-in — matches `page-title` context |
| `text-display-md` | `display/md` | |
| `text-display-sm` | `display/sm` | |
| `text-heading-lg` | `heading/lg` | |
| `text-heading-md` | `heading/md` | |
| `text-heading-sm` | `heading/sm` | |
| `text-body-lg` | `body/lg` | |
| `text-body-md` | `body/md` | |
| `text-body-sm` | `body/sm` | |
| `text-body-md-strong` | `body/md` + `weight="semibold"` | No direct variant; use weight prop |
| `text-body-lg-strong` | `body/lg` + `weight="semibold"` | |
| `text-label-lg` | `label/lg` | |
| `text-label-md` | `label/md` | |
| `text-label-sm` | `label/sm` | |
| `text-caption-md` | `caption/md` | |
| `text-caption-sm` | `caption/sm` | |
| `text-metric-lg` | `metric/lg` (add if needed) | 30px/700/Sprig Sans/tabular-nums |
| `text-metric-md` | `metric/md` (add if needed) | 24px/700/Sprig Sans/tabular-nums |

**`as` prop:** When the element being replaced is a `<div>`, use `<Text as="div">`. When a `<span>`, use `<Text as="span">`. Default Text renders as `<p>`.

**Composed classes:** `className="text-body-md text-text-secondary"` → `<Text variant="body/md" color="secondary">`.

---

### Task B1: Check metric variant usage and extend Text if needed

- [ ] **Count metric class usages**

```bash
grep -rn 'text-metric-lg\|text-metric-md' src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **If ≤2 usages total:** Replace each with `style={{ fontFamily: "'Sprig Sans', 'Inter', sans-serif", fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}`. Skip the variant extension.

- [ ] **If ≥3 usages:** Add `metric/lg` and `metric/md` to `Text.module.css` and `TextVariant` type in `Text.tsx`. Commit separately before proceeding.

---

### Task B2: Migrate typography classes — clients/[id] subtree

**Pre-task baseline:**
```bash
grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app/clients --include='*.tsx' | wc -l
```

- [ ] **Migrate each file** — replace every utility class with `<Text variant="...">` per the mapping table. Use `as="div"` / `as="span"` when replacing block/inline elements.

- [ ] **TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -10
```

- [ ] **Chrome MCP verification — explicit measurement (not spot-check)**

Navigate to `localhost:3000/clients/[seed-id]` AND `acme.splose.com/clients/[id]`. Run:

```js
(() => {
  const selectors = [
    { sel: 'main h1, .ant-typography h1', label: 'Page h1' },
    { sel: 'table td:first-child', label: 'First td' },
    { sel: '[class*="text-text-secondary"], [style*="color: rgb(110"]', label: 'Secondary text' },
  ];
  const props = ['fontSize','fontWeight','color','lineHeight','fontFamily'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error: 'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p => [p, s[p]]))};
  }), null, 2);
})()
```

Build a comparison table:
```
| Element | Property | Production | Localhost | Pass? |
|---|---|---|---|---|
| Page h1 | fontSize | [measure] | [measure] | PASS/FAIL |
| Page h1 | fontWeight | ... | ... | ... |
| First td | fontSize | ... | ... | ... |
```

All typography properties must match production exactly. Any mismatch = fix before committing.

- [ ] **Done-when:**

```bash
grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app/clients --include='*.tsx' | wc -l  # → 0
```

- [ ] **Commit**

```bash
git add src/app/clients/
git commit -m "refactor: migrate typography utility classes → <Text> in clients/* pages

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Task B3: Migrate typography classes — invoices subtree

**Done-when:** `grep -rn 'className=.*text-body-\|...' src/app/invoices --include='*.tsx' | wc -l` → 0

Follow same pattern as B2. Chrome MCP: verify `/invoices` list and one invoice detail.

---

### Task B4: Migrate typography classes — settings subtree

**Done-when:** `grep -rn 'className=.*text-body-\|...' src/app/settings --include='*.tsx' | wc -l` → 0

Chrome MCP: verify `/settings/details` and `/settings/forms/[id]`.

---

### Task B5: Migrate typography classes — remaining app pages

**Files in scope:** All remaining `*.tsx` in `src/app/` not already covered (dashboard, calendar, notes, waitlist, reports, contacts, products, payments, online-booking, etc.) plus `src/components/*.tsx`.

- [ ] **Find remaining files with hits**

```bash
grep -rln 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app src/components --include='*.tsx' | grep -v 'stories\|clients\|invoices\|settings'
```

- [ ] **Migrate all files.** Dispatch one subagent per subdirectory.

- [ ] **TypeScript check** + Chrome MCP: verify dashboard, reports, calendar, notes with explicit measurement tables.

---

### Task B6: Phase B verification gate

- [ ] **Typography zero-check — must return 0**

```bash
grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Build gate**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -5
```

**Phase B acceptance criteria:** grep returns 0 lines; `npx next build` passes; Chrome MCP tables for clients, invoices, settings, dashboard all show PASS on fontSize, fontWeight, color.

---

## Phase C — Color class migration

*Replace `text-text`, `text-text-secondary`, `text-primary`, `text-danger`, `text-success`, `text-warning`, `text-text-inverted`, `border-border`, `border-primary`, `divide-border`, `bg-primary` with DS props or CSS variable references.*

**Replacement strategy:**

| Class | Context | Replacement |
|---|---|---|
| `text-text-secondary` | On `<Text>` or bare span | `<Text color="secondary">` |
| `text-text-tertiary` | On `<Text>` or bare span | `<Text color="tertiary">` |
| `text-primary` | On `<Text>` or bare span | `<Text color="primary">` |
| `text-danger` | On `<Text>` or bare span | `<Text color="danger">` |
| `text-success` | On `<Text>` or bare span | `<Text color="success">` |
| `text-warning` | On `<Text>` or bare span | `<Text color="warning">` |
| `text-text` (default) | On bare element | Wrap with `<Text as="div/span">` (defaults to body color) |
| `text-text-secondary` | On `<Td>` | `<Td color="secondary">` |
| `text-primary` | On `<Td>` | `<Td color="primary">` |
| `border-border` | On container | `style={{ borderColor: 'var(--ant-color-border)' }}` |
| `border-primary` | On container | `style={{ borderColor: 'var(--ant-color-primary)' }}` |
| `divide-border` | On container | Remove — DataTable renders its own row borders |
| `bg-primary` | On container | `style={{ backgroundColor: 'var(--ant-color-primary)' }}` |

---

### Task C1: Migrate `<Td>` color class usages to `Td color` prop

(Now possible because Task A1 added the `color` prop.)

- [ ] **Find all Td color class usages**

```bash
grep -rn 'Td.*className.*text-text-secondary\|Td.*className.*text-primary\|Td.*className.*text-danger\|Td.*className.*text-success' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Replace each** with `<Td color="secondary">`, `<Td color="primary">`, etc.

- [ ] **Chrome MCP — table cell color check**

Run measurement snippet on `localhost:3000/clients/[id]/invoices` AND production, targeting `table td:nth-child(2)` or the relevant colored column. Compare `color` property. Must match exactly.

- [ ] **Done-when:**

```bash
grep -rn 'Td.*className.*text-text-secondary\|Td.*className.*text-primary' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l  # → 0
```

---

### Task C2: Migrate standalone color classes to `<Text>` props

- [ ] **Find remaining color class usages (non-Td)**

```bash
grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*text-success\b\|className=.*text-warning\b\|className=.*text-text-inverted' \
  src/app src/components --include='*.tsx' | grep -v 'stories\|<Td\|<Th'
```

- [ ] **Migrate each hit** — wrap element in `<Text color="..." as="div/span">` or add `color` prop if already a `<Text>`.

- [ ] **Chrome MCP — color check on 3 representative pages**

On each page, measure the `color` property of secondary text elements and compare to production. Must match exactly (exact RGB).

- [ ] **Done-when:**

```bash
grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b' \
  src/app src/components --include='*.tsx' | grep -v 'stories\|Td\|Th' | wc -l  # → 0
```

---

### Task C3: Migrate `border-border`, `border-primary`, `divide-border`, `bg-primary`

- [ ] **Find all usages**

```bash
grep -rn 'border-border\|border-primary\|divide-border\|bg-primary' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Replace each per the strategy table above.**

- [ ] **Done-when:**

```bash
grep -rn '\bborder-border\b\|\bborder-primary\b\|\bdivide-border\b\|\bbg-primary\b' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l  # → 0
```

---

### Task C4: Phase C verification gate

- [ ] **Color zero-check — all must return 0**

```bash
grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*text-success\b\|className=.*text-warning\b\|className=.*border-border\|className=.*bg-primary' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **Build gate**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -5
```

**Phase C acceptance criteria:** zero-check returns 0 lines; `npx next build` passes; Chrome MCP color measurements on 3+ routes all show PASS (exact RGB match to production).

---

## Phase D — Layout utility class migration

*Replace `mb-*`, `mt-*`, `p-*`, `pt-*`, `pb-*`, `flex-1`, `shrink-0`, `w-full`, `max-w-2xl`, `overflow-hidden`, `overflow-y-auto`, `border-b` using the correct priority ladder: Flex gap first, DS props second, AntD native props third, `style={{}}` inline only for genuine one-offs.*

### Task D0: Audit and classify all layout utility usages

Before migrating, classify every usage into one of four categories. This drives the migration strategy for each file.

- [ ] **Get full list of layout utility usages with file and line**

```bash
grep -rn '\bclassName=.*\(mb-[0-9]\|mt-[0-9]\|p-[0-9]\|pt-[0-9]\|pb-[0-9]\|flex-1\|shrink-0\|w-full\|max-w-2xl\|overflow-hidden\|overflow-y-auto\|border-b\b\)' \
  src/app src/components --include='*.tsx' | grep -v stories \
  | awk -F: '{print $1}' | sort | uniq -c | sort -rn | head -20
```

- [ ] **For the top 10 files, read each and classify every layout utility usage as one of:**

```
A. Flex-gap candidate:    mb-N between siblings in a vertical stack → wrap with <Flex vertical gap={N}>
B. DS-prop candidate:     mb-N on a DS component that accepts mb prop → add mb={N} prop
C. AntD-native candidate: w-full on <Button> → block prop; w-full on <Input> → already full-width
D. Genuine one-off:       isolated value, no Flex container possible → style={{ marginBottom: N }}
```

Record the classification breakdown per file. Target: ≥60% of usages fall into category A (Flex-gap) or C (AntD native props).

- [ ] **Note the `<Flex>` import** — ensure `import { Flex } from "antd"` or `import Flex from "antd/es/flex"` is available in every file being restructured.

---

### Task D1: DS component spacing props

**Scope:** Every usage where the element is a DS component (`<Text>`, `<Card>`, `<Badge>`, `<Button>`, etc.) and the layout utility is the only thing in `className` OR the only remaining class after other migrations.

**When to use:** The DS component accepts a spacing prop (e.g. `mb`, `mt`, `gap`). Do NOT add a spacing prop to DS components just for this migration — only use props that already exist or are planned. If the DS component has no spacing prop, use Flex gap instead.

- [ ] **Find DS component usages with isolated spacing classes**

```bash
grep -rn 'className="mb-\|className="mt-\|className="p-[0-9]' \
  src/app src/components --include='*.tsx' | grep -v stories \
  | grep '<Text\|<Card\|<Badge\|<Button\|<PageHeader'
```

- [ ] **For each hit:** If the DS component has an appropriate spacing prop, use it. If not, note it for D2 (Flex gap).

- [ ] **Done-when (partial):** The above grep returns 0 lines.

---

### Task D2: `<Flex vertical gap={N}>` restructuring

**This is the primary replacement for most mb-N usages.** When elements are stacked vertically with `mb-N` on each item, eliminate the margin entirely by wrapping in a `<Flex vertical gap={N}>`.

**Rules:**
- Use `<Flex vertical gap={N}>` when 2+ sibling elements are each carrying an `mb-N` in a vertical layout.
- Use `<Flex gap={N}>` (horizontal) when 2+ siblings carry an `mr-N` or spacing in a row.
- The gap replaces ALL the margins on children — remove `mb-N` from each child after wrapping.
- If children have different spacing (e.g. `mb-2` then `mb-4`), use the most common value or split into nested Flex containers.

**Example transformation:**
```tsx
// BEFORE:
<div>
  <Text className="mb-2 text-heading-md">Section title</Text>
  <FormInput label="Name" className="mb-4" />
  <FormInput label="Email" className="mb-4" />
  <Button className="mb-0">Save</Button>
</div>

// AFTER (after B phase removed text-heading-md):
<Flex vertical gap={16}>
  <Text variant="heading/md">Section title</Text>
  <FormInput label="Name" />
  <FormInput label="Email" />
  <Button>Save</Button>
</Flex>
// (The mb-2 on the title is absorbed by the gap — the slight difference is acceptable.
// If the mb-2 is critical, keep the title in its own Flex sub-group or use style={{ marginBottom: 8 }} on that specific element only.)
```

- [ ] **Process the top 8 files by layout utility count** (get list from D0 audit). For each:
  1. Read the full component structure to understand the vertical sequences.
  2. Identify which `mb-N` usages can be eliminated via Flex gap.
  3. Apply the restructuring.
  4. Verify remaining `mb-N` usages that couldn't be Flex-wrapped are genuinely one-offs.

- [ ] **TypeScript check after each file**

```bash
npx tsc --noEmit 2>&1 | grep "error TS" | head -10
```

- [ ] **Intermediate Chrome MCP check after every 3 files**

For each changed page, navigate to both localhost and production, screenshot the main content area, and compare layout. Vertical spacing should look identical. If it doesn't, measure with:

```js
(() => {
  const selectors = [
    { sel: 'main > form > *:first-child', label: 'First form child' },
    { sel: 'main section:first-of-type', label: 'First section' },
  ];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error: 'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: { marginBottom: s.marginBottom, marginTop: s.marginTop, padding: s.padding }};
  }), null, 2);
})()
```

Build a comparison table. Spacing must match production ±2px.

---

### Task D3: AntD native element props

**Scope:** Cases where AntD or HTML provides a native prop that eliminates the utility class:

| Utility class | Element | AntD/native replacement |
|---|---|---|
| `w-full` | `<Button>` | `<Button block>` |
| `w-full` | `<Input>`, `<Select>`, `<DatePicker>` | Already 100% wide by default — just remove the class |
| `w-full` | `<Flex>` child | Parent `<Flex>` controls width; child `flex={1}` via Flex prop |
| `flex-1` | Child of AntD `<Flex>` | `<Flex flex={1}>` on the child (AntD Flex supports `flex` prop) |

- [ ] **Find w-full and flex-1 usages on known AntD elements**

```bash
grep -rn 'className=.*w-full\|className=.*flex-1' \
  src/app src/components --include='*.tsx' | grep -v stories \
  | grep -E 'Button|Input|Select|DatePicker|Flex'
```

- [ ] **Replace each with the native prop** per the table above.

- [ ] **Done-when:**

```bash
grep -rn 'className=.*w-full.*Button\|Button.*className=.*w-full' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l  # → 0
```

---

### Task D4: Genuine one-offs — `style={{}}` inline

**Scope:** Every remaining layout utility usage that could not be replaced by D1, D2, or D3. These should be the minority (~20% of original layout class count).

**Allowed cases — inline `style={{}}` is ONLY acceptable here:**
- `overflow-hidden` / `overflow-y-auto` — no DS or AntD prop equivalent exists.
- `max-w-2xl` — no AntD equivalent.
- `border-b` on a non-DataTable element — use `borderBottom: '1px solid var(--ant-color-border)'`.
- `shrink-0` on an element that must not shrink in a flex row — use `flexShrink: 0`.
- Truly isolated spacing where there is only one element in the column (no siblings to group) AND the element is not a DS component with a spacing prop.

**NOT acceptable as inline:** `mb-N` when 2+ siblings exist (use Flex gap); `w-full` on Button (use `block`); `flex-1` in an AntD Flex container (use `flex` prop). If you're about to write `style={{ marginBottom: N }}` on an element that has siblings, stop — add a `<Flex vertical gap={N}>` parent instead.

**Mapping for D4 one-offs:**

| Class | Inline style |
|---|---|
| `mb-N` | `style={{ marginBottom: N*4 }}` (0→0, 1→4, 2→8, 3→12, 4→16, 5→20, 6→24, 8→32) |
| `mt-N` | `style={{ marginTop: N*4 }}` |
| `p-N` | `style={{ padding: N*4 }}` |
| `pt-N` | `style={{ paddingTop: N*4 }}` |
| `pb-N` | `style={{ paddingBottom: N*4 }}` |
| `flex-1` | `style={{ flex: 1 }}` |
| `shrink-0` | `style={{ flexShrink: 0 }}` |
| `w-full` | `style={{ width: '100%' }}` |
| `max-w-2xl` | `style={{ maxWidth: '42rem' }}` |
| `overflow-hidden` | `style={{ overflow: 'hidden' }}` |
| `overflow-y-auto` | `style={{ overflowY: 'auto' }}` |
| `border-b` | `style={{ borderBottom: '1px solid var(--ant-color-border)' }}` |

**Merging:** Always merge into an existing `style={{}}` prop rather than adding a second. When the utility class becomes the last entry in a `className`, remove the `className` prop entirely.

- [ ] **Process all remaining layout utility usages** (those not resolved by D1–D3).

- [ ] **After completing D4, run the layout zero-check — must return 0:**

```bash
grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bpt-[0-9]\|className=.*\bpb-[0-9]\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\bmax-w-2xl\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' \
  src/app src/components --include='*.tsx' | grep -v stories
```

---

### Task D5: Phase D build gate + Chrome MCP spacing verification

- [ ] **Build gate**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -5
```

- [ ] **Chrome MCP — spacing verification on 4 representative pages**

Pages: `/` (dashboard), `/clients/[id]`, `/settings/details`, `/notes/[id]/edit`

For each, run the spacing measurement snippet on both localhost and production. Build a comparison table for 3 key elements per page. Spacing must be within ±2px of production.

```js
(() => {
  const selectors = [
    { sel: 'main > *:nth-child(1)', label: 'First main child' },
    { sel: 'form > *:nth-child(2)', label: 'Second form child' },
    { sel: '.ant-card, [class*="card"]', label: 'First card' },
  ];
  const props = ['marginBottom','marginTop','paddingTop','paddingBottom','paddingLeft','paddingRight'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error:'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p=>[p,s[p]]))};
  }), null, 2);
})()
```

**Phase D acceptance criteria:**
- Layout zero-check returns 0 lines.
- `npx next build` passes.
- Chrome MCP spacing tables for 4 routes: all margin/padding properties within ±2px of production.
- Percentage of D4 (genuine inline) usages is ≤10% of original layout utility count. If above 10%, revisit D2 — there are likely more Flex gap opportunities. Inline is only acceptable for overflow, max-width, flexShrink, border-b, and single-element isolations.

- [ ] **Commit after D5 passes**

```bash
git add src/app/ src/components/
git commit -m "refactor: replace layout utility classes via Flex gap, DS props, AntD native props, and one-off inline styles

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase E — Structural class migration

### Task E1: Replace `row-hover` with `Tr hover` prop

**File:** One or more usages of `className="row-hover"` in app files.

- [ ] **Find all usages**

```bash
grep -rn 'className=.*row-hover\|className="row-hover"' src/app src/components --include='*.tsx' | grep -v stories
```

The `Tr` component already accepts a `hover` prop. The `row-hover` class triggers `tr.row-hover:hover { background-color: #f9fafb }` — exactly what `<Tr hover>` does.

- [ ] **Replace** `<Tr className="row-hover">` → `<Tr hover>` for each hit.

- [ ] **Chrome MCP:** Visit the affected page, hover a row, confirm background shows `#f9fafb`.

- [ ] **Done-when:** `grep -rn 'className=.*row-hover' src/app src/components --include='*.tsx' | wc -l` → 0

---

### Task E2: Replace `hover-underline-on-row-hover` with CSS module

**File:** `src/app/clients/ClientsPageClient.tsx`

- [ ] **Verify usage location**

```bash
grep -n "hover-underline-on-row-hover" src/app/clients/ClientsPageClient.tsx
```

- [ ] **Create or extend `ClientsPageClient.module.css`**

```css
/* When parent <tr> is hovered, underline this element */
tr:hover .hoverUnderline { text-decoration: underline; }
```

- [ ] **Update import and className:**

```tsx
import styles from "./ClientsPageClient.module.css";
// Replace className="hover-underline-on-row-hover" → className={styles.hoverUnderline}
```

- [ ] **Chrome MCP:** Visit `/clients`, hover a row, confirm client name underlines.

- [ ] **Done-when:** `grep -rn 'hover-underline-on-row-hover' src/app src/components --include='*.tsx' | wc -l` → 0

---

### Task E3: Remove responsive replacement classes

- [ ] **Check for usages**

```bash
grep -rn 'md.hidden-replacement\|md.block-replacement\|md.flex-row-replacement\|sm.inline-replacement\|overflow-x-auto-util' \
  src/app src/components --include='*.tsx' | grep -v stories
```

- [ ] **If 0 usages:** Skip — the classes are unused and will be deleted in Phase G.

- [ ] **If any usages found:** Replace with responsive Flex component or inline style as appropriate per case.

---

### Phase E acceptance criteria

```bash
grep -rn 'row-hover\|hover-underline-on-row-hover' src/app src/components --include='*.tsx' | wc -l  # → 0
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l  # → 0
```

---

## Phase F — Clean up Storybook stories

*Lower priority. Do after all app/component code is clean.*

### Task F1: Migrate utility classes in DS stories

- [ ] **Baseline count**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-text\b\|text-text-secondary\|border-border\|mb-\|mt-\|p-[0-9]' \
  src/components/ds/stories --include='*.tsx' | wc -l
```

- [ ] **For each story file with hits:** Replace per Phase B/C/D mapping. Stories are demonstration code — use `<Text>` over raw inline styles where readable.

- [ ] **TypeScript check** + Storybook smoke check: `npm run storybook` and verify no broken stories in Storybook sidebar.

- [ ] **Done-when:**

```bash
grep -rn 'text-body-\|text-heading-\|text-label-\|text-caption-\|text-text\b\|text-text-secondary\|border-border\|\bmb-[0-9]\|\bmt-[0-9]\|\bp-[0-9]\b' \
  src/components/ds/stories --include='*.tsx' | wc -l  # → 0
```

---

## Phase G — Delete utility class definitions from globals.css

*Only run this phase after Phases A–F verified-complete (all zero-checks passed).*

### Task G1: Pre-deletion gate — all zero-checks must pass

- [ ] **Run the comprehensive pre-deletion grep — must return 0 lines:**

```bash
grep -rn \
  'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-\|className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*border-border\|className=.*bg-primary\|className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bpt-[0-9]\|className=.*\bpb-[0-9]\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b\|row-hover\|hover-underline-on-row-hover\|ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset' \
  src/app src/components --include='*.tsx'
```

If ANY lines are returned, **stop** — migrate those usages before proceeding.

### Task G2: Remove utility blocks from globals.css

**File:** `src/app/globals.css`

Delete these sections entirely (verify by section comment header):

1. `/* ── Typography utility classes ── */` block (`.text-display-lg` through `.text-metric-md`)
2. `/* ── Color utility classes ── */` block (`.text-text` through `.bg-primary`, `.ai-typing-dot`, `.ai-chat-*`, `.border-border`, `.border-primary`, `.divide-border`)
3. `/* ── Layout utility classes ── */` block (`.mb-0` through `.border-b`, including the `!important` margin/padding rules)
4. The structural section after the global reset (`.hover-underline-on-row-hover`, `tr.row-hover:hover`, responsive media queries, `.overflow-x-auto-util`)

**Do NOT delete:**
- Font-face declarations (Sprig Sans)
- `:root {}` block with CSS variables
- `body {}` and universal reset rules
- AntD table header, SearchBar, and Tabs overrides

- [ ] **Edit globals.css** — remove the four utility blocks. Keep blank lines between remaining sections.

- [ ] **Verify globals.css no longer contains any utility class definitions:**

```bash
grep -n "\.text-body\|\.text-heading\|\.text-label\|\.mb-[0-9]\|\.mt-[0-9]\|\.p-[0-9]\|\.flex-1\|\.shrink-0\|\.w-full\|\.row-hover\|\.ai-typing-dot" \
  src/app/globals.css
```

Expected: 0 lines.

- [ ] **Build gate**

```bash
npx tsc --noEmit && npx next build 2>&1 | tail -10
```

Expected: build passes with no errors.

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: remove all utility class definitions from globals.css

Typography, color, layout, and structural utility blocks deleted.
All usages migrated: typography → <Text>, color → <Text color>/<Td color>,
layout → <Flex gap>/<Button block>/style{{}}, structural → CSS modules.
Remaining globals.css: font-face, CSS variables, body reset, AntD overrides only.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Phase H — Full visual verification sweep

*Chrome MCP dual-tab (localhost vs acme.splose.com) explicit measurement at 1440×900. Not spot-checks — each route requires a measurement table.*

### Task H1: Setup

- [ ] **Claim Chrome tab group and resize**

```js
// tabs_context_mcp({ createIfEmpty: true })
// resize_window({ width: 1440, height: 900 })
```

- [ ] **Open two tabs:** `localhost:3000` and `acme.splose.com`. Use `docs/route-mapping.md` for URL pairs.

---

### Task H2: Typography regression check (6 routes)

For each route, run the measurement snippet targeting headings and body text:

```js
(() => {
  const selectors = [
    { sel: 'main h1', label: 'H1' },
    { sel: 'main h2, main .ant-typography h2', label: 'H2' },
    { sel: 'table th:first-child', label: 'Table th' },
    { sel: 'table td:first-child', label: 'Table td' },
    { sel: 'label, .ant-form-item-label > label', label: 'Form label' },
  ];
  const props = ['fontSize','fontWeight','color','lineHeight','fontFamily','letterSpacing'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error:'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p=>[p,s[p]]))};
  }), null, 2);
})()
```

Routes: `/`, `/clients/[id]`, `/invoices/[id]`, `/settings/details`, `/notes/[id]/edit`, `/reports`

Build comparison table for each route. Thresholds: fontSize exact, fontWeight exact, color exact RGB, lineHeight ±1px.

---

### Task H3: Spacing regression check (4 routes)

Routes: `/`, `/clients/[id]`, `/settings/forms/[id]`, `/notes/[id]/edit`

Run spacing measurement:

```js
(() => {
  const selectors = [
    { sel: 'main > *:first-child', label: 'First main child' },
    { sel: 'form > *:nth-child(2)', label: 'Second form row' },
    { sel: '.ant-card + .ant-card, section + section', label: 'Card spacing' },
  ];
  const props = ['marginBottom','marginTop','paddingTop','paddingBottom','paddingLeft','paddingRight','gap'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error:'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p=>[p,s[p]]))};
  }), null, 2);
})()
```

Spacing threshold: ±2px.

---

### Task H4: Color regression check (3 routes)

Routes: `/clients/[id]` (table with secondary text), `/invoices/[id]` (status colors), `/reports` (metric colors)

Run color measurement targeting elements that had color utility classes:

```js
(() => {
  const selectors = [
    { sel: 'table td:nth-child(2)', label: 'Second td' },
    { sel: '[style*="color:"], [style*="color: "]', label: 'Inline color el' },
  ];
  const props = ['color','backgroundColor','borderColor'];
  return JSON.stringify(selectors.map(({sel,label}) => {
    const el = document.querySelector(sel);
    if (!el) return {label, error:'NOT FOUND'};
    const s = getComputedStyle(el);
    return {label, measured: Object.fromEntries(props.map(p=>[p,s[p]]))};
  }), null, 2);
})()
```

Color threshold: exact RGB.

---

### Task H5: Structural behaviour check (2 routes)

- **`/clients`** — hover a table row, confirm background is `rgb(249, 250, 251)`, confirm client name underlines.
- **AI chat panel** — open AI assistant, confirm typing dots render as 8×8px circles.

---

### Task H6: Remaining routes screenshot comparison

For all remaining routes not covered in H2–H5, take a full-page screenshot of both production and localhost, zoom into the content area, and record any structural differences (missing elements, layout breaks, wrong colours).

Remaining routes: `/calendar`, `/clients/[id]/appointments`, `/invoices/new`, `/invoices/batch-invoice/[id]`, `/waitlist`, `/products`, `/payments/new`, `/settings/data-import`, `/settings/online-bookings/[id]`, `/online-booking`, `/contacts/[id]`

For each screenshot pair: note "Match" or list specific discrepancies.

---

### Task H7: Write verification evidence and commit

- [ ] **Create `.verification-evidence` file**

```
Phase H: Full visual verification post utility-class removal
Date: [date]
Viewport: 1440x900
Environment: localhost:3000 vs acme.splose.com

Typography check (6 routes): PASS / [list any failures]
Spacing check (4 routes): PASS / [list any failures]
Color check (3 routes): PASS / [list any failures]
Structural behaviour: PASS / [list any failures]
Screenshot comparison (11 routes): PASS / [list any discrepancies]

Total elements measured: [N]
Total properties compared: [N]
Failures resolved: [N]
Final verdict: PASS
```

- [ ] **Commit**

```bash
git add .verification-evidence
git commit -m "verify: Phase H Chrome MCP sweep post utility-class removal — all routes PASS"
```

**Phase H acceptance criteria:** All measurement tables show 0 regressions. Any regression found during H must be fixed before committing the evidence file as PASS.

---

## Phase I — Promote ESLint tracking rules to error

### Task I1: Verify zero violations remain

- [ ] **Run ESLint against all migrated files**

```bash
npx eslint src/app src/components --ext .tsx --no-ignore 2>/dev/null \
  | grep "Use <Text\|Replace spacing\|Use <Text color" | wc -l
```

Expected: 0.

If any violations remain, fix them before proceeding.

---

### Task I2: Promote rules from warn to error

- [ ] **In `eslint.config.mjs`**, change the severity of the utility-class rules added in Phase 0 from `"warn"` to `"error"`.

- [ ] **Run ESLint again to confirm 0 errors**

```bash
npx eslint src/app src/components --ext .tsx --no-ignore 2>/dev/null \
  | grep "Use <Text\|Replace spacing" | wc -l  # → 0
```

- [ ] **Commit**

```bash
git add eslint.config.mjs
git commit -m "lint(phase-I): promote utility-class rules from warn to error

Zero violations confirmed before promotion. Re-introduction of any utility
class from globals.css will now fail CI.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**Phase I acceptance criteria:** ESLint reports 0 violations with severity=error; `npx next build` passes.

---

## Definition of Done

All of the following must be true before this plan is considered complete:

1. **Typography:** `grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' src/app src/components --include='*.tsx' | grep -v stories` → **0 lines**

2. **Color:** `grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*\bborder-border\b\|className=.*\bbg-primary\b' src/app src/components --include='*.tsx' | grep -v stories` → **0 lines**

3. **Layout:** `grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' src/app src/components --include='*.tsx' | grep -v stories` → **0 lines**

4. **Structural:** `grep -rn 'row-hover\|hover-underline-on-row-hover\|ai-typing-dot' src/app src/components --include='*.tsx'` → **0 lines**

5. **globals.css clean:** `grep -n '\.text-body\|\.text-heading\|\.text-label\|\.mb-[0-9]\|\.mt-[0-9]\|\.p-[0-9]\|\.flex-1\|\.shrink-0\|\.w-full\|\.row-hover\|\.ai-typing-dot' src/app/globals.css` → **0 lines**

6. **TypeScript:** `npx tsc --noEmit` → 0 errors (pre-existing Storybook module error is the only acceptable exception)

7. **Build:** `npx next build` → passes with 0 errors

8. **Visual:** Chrome MCP sweep of 18+ routes shows 0 typography regressions (exact), 0 color regressions (exact RGB), 0 spacing regressions (±2px), 0 structural differences

9. **ESLint:** Utility-class rules are severity=error and report 0 violations

10. **Layout inline ratio:** ≤10% of original layout utility usages converted to `style={{}}` inline (≥90% resolved via `<Flex vertical gap>`, DS spacing props, or AntD native props). Inline is only permitted for: `overflow`, `max-width`, `flexShrink`, `border-b`, and truly isolated single-element spacings with no possible sibling grouping.

---

## Effort estimate

| Phase | Scope | Estimated effort |
|---|---|---|
| 0 — Baseline & TDD linting | 1 config edit + grep run | 15 min |
| A — DS component extensions | 3 targeted edits | 20 min |
| B — Typography migration | ~756 usages, 50+ files | 90 min (parallel subagents) |
| C — Color migration | ~872 usages, 58+ files | 90 min (parallel subagents) |
| D — Layout migration (Flex-first) | ~425 usages; classify first | 60 min (parallel subagents) |
| E — Structural | ~4 usages | 15 min |
| F — Stories cleanup | ~100 usages in stories | 30 min |
| G — globals.css deletion | 1 file, surgical | 10 min |
| H — Visual verification sweep | 18+ routes, dual-tab measurement | 60 min |
| I — ESLint promotion to error | 1 config edit | 5 min |
| **Total** | | **~6.5 hours** |

**Critical path:** 0 → A → B/C/D (parallel) → E → F → G → H → I

**Parallelism notes:**
- Phases B, C, D can run in parallel after Phase A (independent files).
- D0 (audit/classify) must complete before D1–D4 start.
- Phases F and H cannot run until Phase G completes.
- Phase I is the final gate — only runs when H reports PASS.
