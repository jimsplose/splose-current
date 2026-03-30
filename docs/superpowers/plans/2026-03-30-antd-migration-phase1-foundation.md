# Ant Design Migration — Phase 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Ant Design 5.x, configure the Splose theme, wire SSR support into Next.js App Router, and add ESLint guardrails — all while keeping existing Tailwind working until Phase 2.

**Architecture:** AntD's ConfigProvider injects a custom theme (Splose colors, fonts, sizes) into all child components. `@ant-design/nextjs-registry` handles SSR style extraction to prevent FOUC. ESLint `no-restricted-imports` bans direct `antd` imports outside `ds/`.

**Tech Stack:** antd 5.x, @ant-design/icons, @ant-design/nextjs-registry, Next.js 16, React 19, TypeScript strict

**Spec:** `docs/superpowers/specs/2026-03-30-antd-migration-design.md`

**Branching:** Before starting, create `tailwind-archive` branch from current main as frozen snapshot, then create `antd-migration` branch for all work.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `src/components/ds/theme.ts` | Splose token overrides for AntD ConfigProvider |
| Create | `src/components/ds/ThemeProvider.tsx` | Client component wrapping ConfigProvider |
| Modify | `src/app/layout.tsx` | Wrap children in AntdRegistry + ThemeProvider |
| Modify | `eslint.config.mjs` | Add no-restricted-imports rule for antd |
| Modify | `.storybook/preview.ts` | Add AntD ThemeProvider decorator |
| Modify | `package.json` | New dependencies (via npm install) |

---

### Task 1: Create branches

- [ ] **Step 1: Create tailwind-archive branch**

```bash
git branch tailwind-archive main
git push origin tailwind-archive
```

This creates a frozen snapshot of the Tailwind codebase. Never merge or delete this branch.

- [ ] **Step 2: Create antd-migration branch and switch to it**

```bash
git checkout -b antd-migration main
```

- [ ] **Step 3: Push the branch**

```bash
git push -u origin antd-migration
```

---

### Task 2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Ant Design packages**

```bash
npm install antd @ant-design/icons @ant-design/nextjs-registry
```

- [ ] **Step 2: Verify installation**

```bash
npx tsc --noEmit
```

Expected: No new type errors. The packages are installed but not imported yet.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install antd, @ant-design/icons, @ant-design/nextjs-registry"
```

---

### Task 3: Create theme.ts

**Files:**
- Create: `src/components/ds/theme.ts`

- [ ] **Step 1: Create the Splose theme configuration**

Create `src/components/ds/theme.ts` with:

```typescript
import type { ThemeConfig } from "antd";

/**
 * Splose theme token overrides for Ant Design 5.x ConfigProvider.
 *
 * Maps the current Splose design tokens (from globals.css) to AntD's
 * token system. This is the single source of truth for all visual
 * customisation — components inherit these values automatically.
 */
export const sploseTheme: ThemeConfig = {
  token: {
    // ── Colors ──────────────────────────────────────────────
    colorPrimary: "#8250ff",
    colorPrimaryHover: "#6d3dd4",
    colorPrimaryBg: "#a78bfa",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorBgContainer: "#ffffff",
    colorBorder: "#e8e8e8",
    colorText: "#414549",
    colorTextSecondary: "#6b7280",
    colorFillAlter: "#f3f5f7",

    // ── Typography ──────────────────────────────────────────
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 18,
    fontSizeXL: 24,
    fontSizeHeading1: 30,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // ── Shape ───────────────────────────────────────────────
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,

    // ── Spacing ─────────────────────────────────────────────
    // AntD uses a 4px base unit by default, matching Tailwind's scale.
    // No override needed — the default is correct.
  },

  components: {
    // ── Table ─────────────────────────────────────────────────
    Table: {
      headerBg: "rgb(234, 237, 241)", // matches current --color-table-header
      headerColor: "#414549",
      rowHoverBg: "#f3f5f7", // matches --color-surface-header
      rowSelectedBg: "rgba(130, 80, 255, 0.05)", // matches bg-primary/5
      rowSelectedHoverBg: "rgba(130, 80, 255, 0.08)",
    },

    // ── Button ────────────────────────────────────────────────
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
    },

    // ── Card ──────────────────────────────────────────────────
    Card: {
      headerBg: "#f3f5f7", // matches --color-surface-header for headerBar
    },

    // ── Modal ─────────────────────────────────────────────────
    Modal: {
      titleFontSize: 18,
    },

    // ── Input ─────────────────────────────────────────────────
    Input: {
      activeBorderColor: "#8250ff",
      hoverBorderColor: "#6d3dd4",
    },

    // ── Select ────────────────────────────────────────────────
    Select: {
      activeBorderColor: "#8250ff",
      hoverBorderColor: "#6d3dd4",
    },
  },
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors. `ThemeConfig` type from antd validates all token names.

- [ ] **Step 3: Commit**

```bash
git add src/components/ds/theme.ts
git commit -m "feat(ds): add Splose theme configuration for Ant Design"
```

---

### Task 4: Create ThemeProvider.tsx

**Files:**
- Create: `src/components/ds/ThemeProvider.tsx`

- [ ] **Step 1: Create the ThemeProvider component**

Create `src/components/ds/ThemeProvider.tsx` with:

```typescript
"use client";

import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { sploseTheme } from "./theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={sploseTheme}>{children}</ConfigProvider>;
}
```

- [ ] **Step 2: Export from barrel**

Add to `src/components/ds/index.ts`:

```typescript
export { ThemeProvider } from "./ThemeProvider";
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ds/ThemeProvider.tsx src/components/ds/index.ts
git commit -m "feat(ds): add ThemeProvider wrapping AntD ConfigProvider"
```

---

### Task 5: Wire into layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Read current layout.tsx**

Read `src/app/layout.tsx` to understand current structure before modifying.

- [ ] **Step 2: Add AntdRegistry and ThemeProvider**

Add these imports to `src/app/layout.tsx`:

```typescript
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/components/ds";
```

Wrap the existing children in the body with AntdRegistry and ThemeProvider. The nesting order must be:

```tsx
<AntdRegistry>
  <ThemeProvider>
    {/* existing content (TopNav, main, etc.) */}
  </ThemeProvider>
</AntdRegistry>
```

`AntdRegistry` must be the outermost wrapper — it extracts CSS-in-JS styles for SSR. `ThemeProvider` sits inside it to provide the Splose theme to all AntD components.

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Open http://localhost:3000 and verify the app renders identically. AntD is installed but no components use it yet, so nothing should change visually.

- [ ] **Step 4: Verify build**

```bash
npx next build
```

Expected: Build passes. No visual changes since no AntD components are rendered yet.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire AntdRegistry + ThemeProvider into root layout"
```

---

### Task 6: Add ESLint no-restricted-imports rule

**Files:**
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Read current eslint config**

Read `eslint.config.mjs` to understand the current flat config structure.

- [ ] **Step 2: Add the restriction rule**

Add a new config object to the array that bans direct `antd` and `@ant-design/icons` imports outside `src/components/ds/`. The rule should:

- Ban `import { ... } from 'antd'` in all files
- Ban `import { ... } from '@ant-design/icons'` in all files
- Allow both inside `src/components/ds/**` (the wrapper layer)
- Allow AntD layout components (`Flex`, `Row`, `Col`, `Space`) from `antd` in all files (the exception from the spec)

In ESLint flat config, add this object to the config array:

```javascript
{
  files: ["src/**/*.{ts,tsx}"],
  ignores: ["src/components/ds/**"],
  rules: {
    "no-restricted-imports": ["error", {
      paths: [
        {
          name: "antd",
          importNames: [
            "Alert", "Avatar", "Button", "Card", "Checkbox", "Collapse",
            "DatePicker", "Dropdown", "Form", "Input", "List", "Modal",
            "Pagination", "Radio", "Select", "Spin", "Statistic", "Switch",
            "Table", "Tabs", "Tag", "Typography", "Upload", "ColorPicker",
            "Menu", "Tooltip",
          ],
          message: "Import from '@/components/ds' instead. Direct antd imports are only allowed inside src/components/ds/.",
        },
        {
          name: "@ant-design/icons",
          message: "Import icons from '@/components/ds' instead. Direct @ant-design/icons imports are only allowed inside src/components/ds/.",
        },
      ],
    }],
  },
},
```

This approach explicitly lists banned component imports from `antd`, while allowing layout utilities (Flex, Row, Col, Space) that aren't in the list.

- [ ] **Step 3: Verify ESLint runs**

```bash
npx eslint src/app/layout.tsx
```

Expected: No errors (layout.tsx doesn't import from antd directly — it imports ThemeProvider from ds).

- [ ] **Step 4: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore: add ESLint rule banning direct antd imports outside ds/"
```

---

### Task 7: Add AntD ThemeProvider to Storybook

**Files:**
- Modify: `.storybook/preview.ts`

- [ ] **Step 1: Read current Storybook preview**

Read `.storybook/preview.ts` to understand current decorators.

- [ ] **Step 2: Add ThemeProvider decorator**

Update `.storybook/preview.ts` to wrap all stories in the AntD theme. Change the file to `.storybook/preview.tsx` (needs JSX) and add:

```tsx
import type { Preview } from "@storybook/react";
import React from "react";
import { ConfigProvider } from "antd";
import { sploseTheme } from "../src/components/ds/theme";
import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ConfigProvider theme={sploseTheme}>
        <Story />
      </ConfigProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Step 3: Verify Storybook runs**

```bash
npm run storybook
```

Open http://localhost:6006 and verify existing stories still render. AntD theme is injected but no stories use AntD components yet.

- [ ] **Step 4: Commit**

```bash
git add .storybook/preview.ts .storybook/preview.tsx
git commit -m "chore: add AntD ThemeProvider decorator to Storybook"
```

---

### Task 8: Verify coexistence and push

- [ ] **Step 1: Run full type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run full build**

```bash
npx next build
```

Expected: Build passes. App renders identically — AntD is installed and configured but no components use it yet. Tailwind still handles all styling.

- [ ] **Step 3: Smoke test in browser**

Open http://localhost:3000 and navigate to:
- Dashboard
- Contacts page (table)
- Settings > Cancellation Reasons (settings page with table)
- Any client detail page

Verify all pages render correctly with no visual changes.

- [ ] **Step 4: Push branch**

```bash
git push origin antd-migration
```

---

## Phase 1 Complete Checklist

After all tasks, verify:

- [ ] `tailwind-archive` branch exists as frozen snapshot
- [ ] `antd-migration` branch has all Phase 1 commits
- [ ] `antd`, `@ant-design/icons`, `@ant-design/nextjs-registry` installed
- [ ] `theme.ts` has all Splose token overrides
- [ ] `ThemeProvider.tsx` wraps ConfigProvider
- [ ] `layout.tsx` wraps app in AntdRegistry + ThemeProvider
- [ ] ESLint bans direct antd imports outside ds/
- [ ] Storybook has AntD theme decorator
- [ ] Build passes, app renders identically to pre-migration
- [ ] Tailwind still works for all existing components

---

## Next Plans

This plan covers Phase 1 only. Subsequent phases will have their own plans:

- **Phase 2: DS Component Rewrite** — Rewrite all 43 components in `ds/` to use AntD internally
- **Phase 3: Page Migration** — Update all 96 pages to use new DS APIs, remove Tailwind classes, replace Lucide icons
- **Phase 4: Cleanup** — Remove Tailwind, Lucide, PostCSS; verify zero Tailwind remains
