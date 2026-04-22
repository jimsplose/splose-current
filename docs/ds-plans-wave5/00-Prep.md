# Wave 5 · Plan 00 — Prep: baselines, ESLint tracking, DS extensions

**Status:** Done
**Estimated effort:** S (15–25 min)
**Recommended model:** Sonnet 4.6
**Thinking budget:** think
**Prerequisite for:** every other Wave 5 plan

## Why this plan exists

Later Wave 5 plans have acceptance criteria that require `grep` counts to reach zero and ESLint warnings to stay below thresholds. Those criteria need:

- **ESLint tracking rules** in place from the start so every migration surfaces remaining violations automatically (TDD for refactoring).
- **Baseline counts recorded** at the top of this document so each plan knows what it's reducing from.
- **Two DS extensions** (`Td color` prop; `AiChatPanel` CSS module) that Wave 5 migrations depend on.

Run this first. No Chrome MCP needed (it's all infra + baselines + no visual change).

## Tasks

### 1. Capture baseline counts

Run each grep and record the number at the bottom of this file.

```bash
echo "=== Typography ==="
grep -rn 'className=.*text-body-\|className=.*text-heading-\|className=.*text-label-\|className=.*text-caption-\|className=.*text-display-\|className=.*text-metric-' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l

echo "=== Color ==="
grep -rn 'className=.*\btext-text\b\|className=.*text-text-secondary\|className=.*text-text-tertiary\|className=.*text-text-inverted\|className=.*text-primary\b\|className=.*text-danger\b\|className=.*text-success\b\|className=.*text-warning\b\|className=.*border-border\|className=.*border-primary\|className=.*divide-border\|className=.*bg-primary' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l

echo "=== Layout spacing ==="
grep -rn 'className=.*\bmb-[0-9]\|className=.*\bmt-[0-9]\|className=.*\bp-[0-9]\b\|className=.*\bpt-[0-9]\|className=.*\bpb-[0-9]\|className=.*\bflex-1\b\|className=.*\bshrink-0\b\|className=.*\bw-full\b\|className=.*\bmax-w-2xl\b\|className=.*\boverflow-hidden\b\|className=.*\boverflow-y-auto\b\|className=.*\bborder-b\b' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l

echo "=== Structural ==="
grep -rn 'row-hover\|hover-underline-on-row-hover\|ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset' \
  src/app src/components --include='*.tsx' | grep -v stories | wc -l
```

### 2. Add ESLint utility-class tracking rules (warn mode)

Edit `eslint.config.mjs`, add a rule block:

```js
{
  rules: {
    "no-restricted-syntax": [
      "warn",
      {
        selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-body-(md|lg|sm|md-strong|lg-strong)|text-heading-(sm|md|lg)|text-label-(sm|md|lg)|text-caption-(sm|md)|text-display-(sm|md|lg)|text-metric-(sm|md|lg))\\b/]",
        message: "Use <Text variant='...'> instead of typography utility class. See docs/ds-plans-wave5/README.md.",
      },
      {
        selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(text-text\\b|text-text-secondary|text-text-tertiary|text-text-inverted|text-primary\\b|text-danger|text-success|text-warning|border-border|border-primary|divide-border|bg-primary)\\b/]",
        message: "Use <Text color> prop, <Td color> prop, or CSS variable inline instead of color utility class.",
      },
      {
        selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/\\b(mb-[0-9]|mt-[0-9]|p-[0-9]|pt-[0-9]|pb-[0-9]|flex-1|shrink-0|w-full|max-w-2xl|overflow-hidden|overflow-y-auto|border-b\\b)\\b/]",
        message: "Replace spacing utility class with <Flex vertical gap={N}>, DS component prop, AntD prop (e.g. block), or style={{}} as last resort.",
      },
    ],
  },
}
```

**Note:** this is SEPARATE from the existing `no-restricted-syntax` rule that targets inline `style={{}}` patterns (the one that audit session 28 is blocked on). ESLint allows multiple rule entries under the same rule name if they're in different config objects; add this as a new object to the exported array.

Baseline ESLint warnings after adding:

```bash
npx eslint src/app src/components --ext .tsx --no-ignore 2>/dev/null \
  | grep -E "Use <Text\b|Replace spacing|Use <Text color" | wc -l
```

Record this as the **Wave 5 utility-class ESLint baseline** at the bottom of this file.

### 3. Add `color` prop to `Td`

**File:** `src/components/ds/DataTable.tsx` (+ story update in `stories/DataTable.stories.tsx`).

```tsx
const tdColorMap: Record<string, string> = {
  default:   "var(--color-text, #414549)",
  secondary: "var(--ant-color-text-secondary, #6E6E64)",
  tertiary:  "var(--ant-color-text-tertiary, #b8bcc0)",
  primary:   "var(--ant-color-primary, #8250FF)",
  danger:    "var(--ant-color-error, #D00032)",
  success:   "var(--ant-color-success, #00C269)",
  warning:   "var(--ant-color-warning, #FFD232)",
};

export function Td({
  children, align = "left", className, hidden, colSpan, style, color,
}: {
  children?: ReactNode;
  align?: string;
  className?: string;
  hidden?: string;
  colSpan?: number;
  style?: React.CSSProperties;
  color?: keyof typeof tdColorMap;
}) {
  const colorStyle = color ? { color: tdColorMap[color] } : {};
  return (
    <td className={className} colSpan={colSpan} style={{
      padding: "16px",
      textAlign: align as React.CSSProperties["textAlign"],
      fontSize: 14,
      color: "var(--color-text, #414549)",
      ...colorStyle,
      ...style,
    }}>
      {children}
    </td>
  );
}
```

Add a `TdColors` story exercising all 7 variants (DataTable stories already have the shape — append one story).

**Why:** Wave 5 Plan 02 (Invoice) migrates 23+ `<Td className="text-text-secondary">` / `<Td className="text-primary">` call sites. Without a `color` prop, those can't migrate cleanly.

### 4. Move AiChatPanel utility classes to a CSS module

**Files:**
- Create `src/components/AiChatPanel.module.css`
- Modify `src/components/AiChatPanel.tsx`

Current (from `grep "ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset" src/components/AiChatPanel.tsx`): 7 hits spread across lines 142, 202–204, 228, 234, 253.

```css
/* AiChatPanel.module.css */
.typingDot {
  display: inline-block;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
}
.buttonReset { border: none; }
.inputReset { border: none; }
```

In `AiChatPanel.tsx`:
```tsx
import styles from "./AiChatPanel.module.css";
// Replace:
//   className="ai-typing-dot"          → className={styles.typingDot}
//   className="ai-chat-button-reset"   → className={styles.buttonReset}
//   className="ai-chat-input-reset"    → className={styles.inputReset}
// Where the className is compound (e.g. "text-text-secondary ai-chat-button-reset"),
// keep the non-utility portion for now (it'll be cleaned by Plan 05 when this file
// is swept for utility classes). Priority: isolate the AI-chat-specific styles
// to the module; Plan 05 handles text-* and bg-* classes on this file.
```

**Note:** this task ONLY moves the 3 `ai-*` classes. The `text-text-secondary` / `text-body-sm` / `text-text` / `text-text-inverted` / `bg-primary` / `text-text` classes on lines 142/228/234/253 stay for now — Plan 05 (Global shell / src/components non-DS) cleans them.

### 5. Commit and record baselines

```bash
git add eslint.config.mjs src/components/ds/DataTable.tsx src/components/ds/stories/DataTable.stories.tsx src/components/AiChatPanel.module.css src/components/AiChatPanel.tsx docs/ds-plans-wave5/00-Prep.md
git commit -m "ds-wave5(00): add utility-class ESLint tracking + Td color prop + AiChatPanel CSS module

Baselines recorded for typography/color/layout/structural utility class
counts. DS extensions unblock Wave 5 Plans 01-04. AiChatPanel
ai-typing-dot/ai-chat-button-reset/ai-chat-input-reset classes moved to
local CSS module (non-ai-* utility classes on that file stay for Plan 05)."
```

## Baselines (fill in after running Task 1 + 2)

Record here on completion; every later plan references these numbers.

- Typography class usages: 334
- Color class usages: 380
- Layout spacing class usages: 430
- Structural class usages (row-hover, hover-underline, ai-*): 9
- ESLint utility-class warnings: 1109
- AiChatPanel `ai-*` hits: 0 (confirmed by grep after Task 4)
- `<Td color>` prop exists in `src/components/ds/DataTable.tsx`: yes
- `src/components/AiChatPanel.module.css` exists: yes

## Acceptance criteria

- [ ] Baselines recorded at bottom of this file.
- [ ] ESLint config has 3 new utility-class rules at `warn` severity.
- [ ] `npx eslint src/` runs and surfaces utility-class warnings (non-zero baseline is expected; rule is new).
- [ ] `Td` accepts `color` prop with 7 variants.
- [ ] `AiChatPanel.module.css` exists and owns the typing-dot + button-reset + input-reset styles.
- [ ] `grep -c "ai-typing-dot\|ai-chat-button-reset\|ai-chat-input-reset" src/components/AiChatPanel.tsx` = 0.
- [ ] `npx tsc --noEmit` exits 0.
- [ ] Storybook builds (`npm run build-storybook`).
- [ ] This plan's `Status:` flipped to `Done`, session log entry appended.

## Known pitfalls

- If the `no-restricted-syntax` array in ESLint config already has entries (from the audit-backlog session 28 scope — inline `style={{}}` rules), **append** to the array; don't replace. Each rule object is independent.
- `Td` component has existing callers with `className`, `style`, `colSpan` — double-check none of them rely on a specific default `color` computation. The new `color` prop is additive; omitting it keeps the old behaviour.
- AiChatPanel's module.css classes are intentionally named in camelCase (`typingDot`) not kebab (`typing-dot`) because CSS modules lose the class name otherwise. If compound className strings concatenate (e.g. `className={[styles.typingDot, "another-class"].join(" ")}`), that's fine — but be consistent.

## No open questions

All decisions here are mechanical.
