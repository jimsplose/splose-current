# Ant Design Migration — Phase 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Ant Design 5.x, configure the Splose theme, wire SSR support into Next.js App Router, and add ESLint guardrails — all while keeping existing Tailwind working until Phase 2.

**Architecture:** AntD's ConfigProvider injects a custom theme (Splose colors, fonts, sizes) into all child components. `@ant-design/nextjs-registry` handles SSR style extraction to prevent FOUC. ESLint `no-restricted-imports` bans direct `antd` imports outside `ds/`.

**Tech Stack:** antd 5.x, @ant-design/icons, @ant-design/nextjs-registry, Next.js 16, React 19, TypeScript strict

**Spec:** `docs/superpowers/specs/2026-03-30-antd-migration-design.md`

**Colour tokens:** Read `docs/superpowers/specs/2026-03-30-colour-tokens-reference.md` before writing `theme.ts` or touching any colour values. This is the canonical source of truth and supersedes the colour table in the migration design spec. It contains a complete recommended `theme.ts` config block. Only implement tokens marked Confirmed, Updated, Fixed, or New — skip anything marked Parked or Deprecated.

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

- [ ] **Step 1: Read the colour tokens reference**

Read `docs/superpowers/specs/2026-03-30-colour-tokens-reference.md` in full. This is the canonical source of truth for all colour values. It supersedes the colour table in the migration design spec. Key changes from the original spec:

- `colorPrimaryHover`: now `#6B3FDB` (was `#6d3dd4`)
- `colorPrimaryBg`: now `#f3eeff` (was `#a78bfa`)
- `colorSuccess`: now `#00C269` (was `#22c55e`)
- `colorWarning`: now `#FFD232` (was `#f59e0b`)
- `colorError`: now `#D00032` (was `#ef4444`)
- `colorTextSecondary`: now `#6E6E64` (was `#6b7280`)
- `colorBorder`: now `#e7e8e8` (was `#e8e8e8`)

Only implement tokens marked Confirmed, Updated, Fixed, or New. Skip anything marked Parked or Deprecated.

- [ ] **Step 2: Create the Splose theme configuration**

Create `src/components/ds/theme.ts` using the recommended `theme.ts` config block from the colour tokens reference doc as the starting point. Add typography, shape, and component-level overrides:

```typescript
import type { ThemeConfig } from "antd";

export const sploseTheme: ThemeConfig = {
  token: {
    // === PRIMARY (Violet) ===
    colorPrimary: '#8250FF',        // violet-600
    colorPrimaryBg: '#f3eeff',      // violet-100
    colorPrimaryBgHover: '#ede5ff', // violet-200
    colorPrimaryBorder: '#D6C1FF',  // violet-300
    colorPrimaryHover: '#6B3FDB',   // violet-700
    colorPrimaryActive: '#5532B3',  // violet-800

    // === SUCCESS ===
    colorSuccess: '#00C269',        // success-600
    colorSuccessBg: '#E6F9F0',      // success-100
    colorSuccessBorder: '#99E7C3',  // success-300
    colorSuccessHover: '#33CF87',   // success-500
    colorSuccessActive: '#00A651',  // success-700

    // === WARNING ===
    colorWarning: '#FFD232',        // warning-600
    colorWarningBg: '#FFFBEB',      // warning-100
    colorWarningBorder: '#FFE89E',  // warning-300
    colorWarningHover: '#FFD54C',   // warning-500
    colorWarningActive: '#D4A20A',  // warning-700

    // === ERROR (Critical) ===
    colorError: '#D00032',          // critical-600 (Figma, confirmed)
    colorErrorBg: '#FEF2F3',        // critical-100
    colorErrorBorder: '#FBCBD1',    // critical-300
    colorErrorHover: '#F2667A',     // critical-500
    colorErrorActive: '#B00029',    // critical-700

    // === INFO ===
    colorInfo: '#5578FF',           // info-600
    colorInfoBg: '#F0F4FF',         // info-100
    colorInfoBorder: '#C7D9FF',     // info-300
    colorInfoHover: '#7C9DFF',      // info-500
    colorInfoActive: '#3D5FDB',     // info-700

    // === TEXT ===
    colorText: '#414549',           // neutral-700 / cool-black-700
    colorTextSecondary: '#6E6E64',  // neutral-600
    colorTextTertiary: '#b8bcc0',   // cool-black-600
    colorTextQuaternary: '#e7e8e8', // cool-black-500

    // === BACKGROUNDS & FILLS ===
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f9fafb',       // cool-black-100
    colorFill: '#eaedf1',           // cool-black-400
    colorFillSecondary: '#f3f5f7',  // cool-black-200
    colorFillTertiary: '#f9fafb',   // cool-black-100
    colorFillQuaternary: '#FAFAF7', // neutral-100
    colorFillAlter: '#f3f5f7',      // cool-black-200 (surface header)

    // === BORDERS ===
    colorBorder: '#e7e8e8',         // cool-black-500
    colorBorderSecondary: '#edf0f3', // cool-black-300

    // === TYPOGRAPHY ===
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

    // === SHAPE ===
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 12,
  },

  components: {
    Table: {
      headerBg: "rgb(234, 237, 241)",
      headerColor: "#414549",
      rowHoverBg: "#f3f5f7",
      rowSelectedBg: "rgba(130, 80, 255, 0.05)",
      rowSelectedHoverBg: "rgba(130, 80, 255, 0.08)",
    },
    Button: {
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
    },
    Card: {
      headerBg: "#f3f5f7",
    },
    Modal: {
      titleFontSize: 18,
    },
    Input: {
      activeBorderColor: "#8250FF",
      hoverBorderColor: "#6B3FDB",
    },
    Select: {
      activeBorderColor: "#8250FF",
      hoverBorderColor: "#6B3FDB",
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
