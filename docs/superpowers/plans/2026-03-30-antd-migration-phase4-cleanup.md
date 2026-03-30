# Ant Design Migration — Phase 4: Cleanup

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all traces of the old Tailwind-based system. After this phase, zero Tailwind references exist in the codebase.

**Architecture:** Uninstall packages, delete config files, strip globals.css to font-face declarations only, verify clean build.

**Tech Stack:** Next.js 16, React 19, TypeScript strict

**Spec:** `docs/superpowers/specs/2026-03-30-antd-migration-design.md`

**Prerequisite:** Phase 3 (Page Migration) must be complete — all pages use AntD components and layout, no Tailwind classes remain in any source file.

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Verify | `src/**/*.{ts,tsx}` | Grep for remaining Tailwind classes, lucide-react imports, direct antd imports |
| Modify | `package.json` | Uninstall tailwindcss, @tailwindcss/postcss, prettier-plugin-tailwindcss, lucide-react |
| Delete | `postcss.config.mjs` | No longer needed — AntD uses CSS-in-JS, not PostCSS |
| Modify | `src/app/globals.css` | Strip to @font-face declarations only |
| Delete | `src/components/ds/portable/` | Entire directory (5 files) — portable wrappers no longer needed |
| Delete | `src/components/ds/usePagination.ts` | Replaced by AntD Table built-in pagination |
| Modify | `src/components/ds/index.ts` | Remove exports for deleted files |
| Modify | `.storybook/preview.tsx` | Verify globals.css import still needed (font-face only) |
| Modify | `.prettierrc` | Remove prettier-plugin-tailwindcss plugin and tailwindStylesheet config |

---

### Task 1: Pre-cleanup verification

Run a comprehensive grep of `src/` to confirm Phase 3 is truly complete. If any findings appear, they must be fixed before proceeding — do NOT skip to Task 2 with unresolved findings.

**Files:**
- Read-only scan: `src/**/*.{ts,tsx}`

- [ ] **Step 1: Check for remaining Tailwind class patterns**

```bash
# Look for common Tailwind utility class patterns in className attributes
grep -rn 'className=' src/ --include='*.tsx' --include='*.ts' | grep -E '(bg-|text-|flex |flex-col|items-|justify-|gap-|p-|px-|py-|pt-|pb-|pl-|pr-|m-|mx-|my-|mt-|mb-|ml-|mr-|rounded-|border-|shadow-|w-|h-|max-w-|min-w-|overflow-|grid |grid-cols-|space-|font-|leading-|tracking-|opacity-|cursor-|hover:|focus:|sm:|md:|lg:|xl:)' || echo "PASS: No Tailwind class patterns found"
```

Expected: `PASS: No Tailwind class patterns found`. If any matches appear, list them and fix before proceeding.

- [ ] **Step 2: Check for lucide-react imports**

```bash
grep -rn 'lucide-react' src/ --include='*.tsx' --include='*.ts' || echo "PASS: No lucide-react imports found"
```

Expected: `PASS: No lucide-react imports found`.

- [ ] **Step 3: Check for direct antd imports outside ds/**

```bash
grep -rn "from ['\"]antd['\"]" src/ --include='*.tsx' --include='*.ts' | grep -v 'src/components/ds/' || echo "PASS: No direct antd imports outside ds/"
```

Expected: `PASS: No direct antd imports outside ds/`. Layout utilities (Flex, Row, Col, Space) in pages are allowed per the spec but should still import from `antd` — verify these are the only matches if any appear.

- [ ] **Step 4: Check for direct @ant-design/icons imports outside ds/**

```bash
grep -rn '@ant-design/icons' src/ --include='*.tsx' --include='*.ts' | grep -v 'src/components/ds/' || echo "PASS: No direct @ant-design/icons imports outside ds/"
```

Expected: `PASS: No direct @ant-design/icons imports outside ds/`.

- [ ] **Step 5: Gate check**

All four checks above must pass. If any fail, stop here and fix the issues (these are Phase 3 leftovers). Do not proceed to Task 2 until all pass.

---

### Task 2: Uninstall Tailwind packages

**Files:**
- Modify: `package.json`, `package-lock.json`
- Delete: `postcss.config.mjs`

- [ ] **Step 1: Uninstall Tailwind and related packages**

```bash
npm uninstall tailwindcss @tailwindcss/postcss prettier-plugin-tailwindcss
```

This removes from both `dependencies`/`devDependencies` in package.json:
- `tailwindcss` (devDependencies)
- `@tailwindcss/postcss` (devDependencies)
- `prettier-plugin-tailwindcss` (devDependencies)

- [ ] **Step 2: Delete PostCSS config**

```bash
rm postcss.config.mjs
```

The file currently contains:
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

With Tailwind removed and AntD using CSS-in-JS, PostCSS is no longer needed.

- [ ] **Step 3: Verify no other PostCSS references exist**

```bash
grep -rn 'postcss' . --include='*.ts' --include='*.tsx' --include='*.mjs' --include='*.json' --exclude-dir=node_modules --exclude-dir=.next || echo "PASS: No PostCSS references remain"
```

Expected: `PASS: No PostCSS references remain` (or only package-lock.json entries from other deps, which is fine).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: uninstall tailwindcss, @tailwindcss/postcss, prettier-plugin-tailwindcss; delete postcss.config.mjs"
```

---

### Task 3: Uninstall Lucide React

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Uninstall lucide-react**

```bash
npm uninstall lucide-react
```

This removes `lucide-react` from `dependencies` in package.json (currently at `^0.577.0`).

- [ ] **Step 2: Verify no imports remain**

```bash
grep -rn 'lucide-react' src/ --include='*.tsx' --include='*.ts' || echo "PASS: No lucide-react imports remain"
```

Expected: `PASS: No lucide-react imports remain` (Task 1 already verified this, but double-check after uninstall).

- [ ] **Step 3: Run type check**

```bash
npx tsc --noEmit
```

Expected: No errors. If lucide-react imports still exist somewhere, TypeScript will catch them now as unresolved modules.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: uninstall lucide-react — replaced by @ant-design/icons"
```

---

### Task 4: Strip globals.css

Remove everything except @font-face declarations. AntD handles all styling via CSS-in-JS tokens now.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read the current globals.css**

Read `src/app/globals.css` to confirm its current contents (should match what was audited during plan creation).

Current file contains:
1. `@import "tailwindcss"` directive (line 1)
2. Three `@font-face` declarations for Sprig Sans (Bold, Medium, Regular) — lines 5-27
3. `@theme inline` block with CSS custom properties for colors and fonts — lines 31-52
4. `:root` block with typography primitive tokens (--text-*, --leading-*, --tracking-*) — lines 56-76
5. `@layer utilities` with 20+ typography utility classes — lines 82-223
6. `body` base style block — lines 227-233

- [ ] **Step 2: Replace globals.css with font-face declarations only**

Replace the entire file with only the @font-face declarations and a minimal body reset:

```css
/* ── Sprig Sans (display font) ────────────────────────────────────────────── */

@font-face {
  font-family: "Sprig Sans";
  src: url("/fonts/FAIRE-SprigSans-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Sprig Sans";
  src: url("/fonts/FAIRE-SprigSans-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Sprig Sans";
  src: url("/fonts/FAIRE-SprigSans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ── Global reset ──────────────────────────────────────────────────────────── */
/* AntD handles all component styling via CSS-in-JS tokens.                    */
/* These resets ensure consistent baseline behavior.                            */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

What was removed:
- `@import "tailwindcss"` — no longer needed
- `@theme inline` block — all color/font tokens now in `theme.ts` (AntD ConfigProvider)
- `:root` typography tokens — all typography now via AntD token system + Text component CSS Module
- `@layer utilities` typography classes — replaced by AntD Typography / Text component
- `body` base styles — AntD ConfigProvider applies font-family, font-size, color, background via tokens

Note: The body reset (`box-sizing`, `margin`, `padding`) may or may not be needed — Tailwind's preflight was providing this. AntD has its own normalize. Test carefully. If AntD's built-in reset is sufficient, the global reset section can be removed entirely, leaving only @font-face declarations.

- [ ] **Step 3: Verify the file is dramatically smaller**

```bash
wc -l src/app/globals.css
```

Expected: ~50 lines (down from ~234 lines).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "chore: strip globals.css to font-face + reset only — all styling via AntD tokens"
```

---

### Task 5: Delete deprecated files

**Files:**
- Delete: `src/components/ds/portable/Tab.tsx`
- Delete: `src/components/ds/portable/Navbar.tsx`
- Delete: `src/components/ds/portable/SideNav.tsx`
- Delete: `src/components/ds/portable/TopNav.tsx`
- Delete: `src/components/ds/portable/index.ts`
- Delete: `src/components/ds/usePagination.ts`
- Modify: `src/components/ds/index.ts`

- [ ] **Step 1: Verify no imports of portable components exist**

```bash
grep -rn 'ds/portable' src/ --include='*.tsx' --include='*.ts' || echo "PASS: No portable imports found"
```

Expected: `PASS: No portable imports found`.

- [ ] **Step 2: Verify no imports of usePagination exist**

```bash
grep -rn 'usePagination' src/ --include='*.tsx' --include='*.ts' | grep -v 'src/components/ds/usePagination.ts' | grep -v 'src/components/ds/index.ts' | grep -v 'src/components/ds/portable/index.ts' || echo "PASS: No usePagination imports found outside ds/"
```

Expected: `PASS: No usePagination imports found outside ds/`.

- [ ] **Step 3: Delete the portable directory**

```bash
rm -rf src/components/ds/portable/
```

This removes 5 files:
- `portable/index.ts` — barrel export for portable components
- `portable/Tab.tsx` — framework-agnostic Tab (uses `<a>` instead of `next/link`)
- `portable/Navbar.tsx` — framework-agnostic Navbar
- `portable/SideNav.tsx` — framework-agnostic SideNav
- `portable/TopNav.tsx` — framework-agnostic TopNav

These existed to provide Next.js-free versions for Storybook. With AntD, Storybook uses the ThemeProvider decorator directly and components no longer depend on Next.js routing.

- [ ] **Step 4: Delete usePagination.ts**

```bash
rm src/components/ds/usePagination.ts
```

This hook (75 lines) managed client-side pagination with localStorage persistence. AntD Table has built-in pagination via the `pagination` prop — no custom hook needed.

- [ ] **Step 5: Update ds/index.ts — remove deleted exports**

Remove these lines from `src/components/ds/index.ts`:

```typescript
// REMOVE this line:
export { default as usePagination } from "./usePagination";
```

No portable exports exist in the main index.ts (they had their own barrel), so only `usePagination` needs removal.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors. If any file still imports `usePagination` or from `ds/portable`, TypeScript will flag it.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: delete portable/ directory and usePagination hook — replaced by AntD equivalents"
```

---

### Task 6: Update Storybook config

**Files:**
- Modify: `.storybook/preview.tsx`

- [ ] **Step 1: Read current Storybook preview**

Read `.storybook/preview.tsx` (renamed from `.ts` in Phase 1 when the ThemeProvider decorator was added).

The file should currently import `globals.css` and wrap stories in `ConfigProvider` with `sploseTheme`.

- [ ] **Step 2: Evaluate globals.css import**

The `globals.css` import is still needed because it provides @font-face declarations for Sprig Sans. Without it, the display font won't load in Storybook.

Keep the import:
```typescript
import "../src/app/globals.css";
```

If the file was already updated in Phase 1 to `.storybook/preview.tsx` with the ConfigProvider decorator, no changes may be needed. Verify the file looks correct:

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

- [ ] **Step 3: Check for any portable component references in stories**

```bash
grep -rn 'portable' src/ --include='*.stories.tsx' --include='*.stories.ts' || echo "PASS: No portable references in stories"
```

Expected: `PASS: No portable references in stories`.

- [ ] **Step 4: Verify Storybook builds**

```bash
npx storybook build --quiet 2>&1 | tail -5
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit (if changes were needed)**

```bash
git add .storybook/
git commit -m "chore: update Storybook config — keep globals.css for font-face declarations"
```

---

### Task 7: Clean up Prettier config

**Files:**
- Modify: `.prettierrc`

- [ ] **Step 1: Read current .prettierrc**

Read `.prettierrc` to confirm current contents.

Current file:
```json
{
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css",
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2
}
```

- [ ] **Step 2: Remove Tailwind-specific Prettier config**

Update `.prettierrc` to remove the `plugins` array (since `prettier-plugin-tailwindcss` was uninstalled in Task 2) and the `tailwindStylesheet` option:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2
}
```

- [ ] **Step 3: Verify Prettier still works**

```bash
npx prettier --check "src/app/layout.tsx"
```

Expected: File passes formatting check (or is already formatted).

- [ ] **Step 4: Commit**

```bash
git add .prettierrc
git commit -m "chore: remove prettier-plugin-tailwindcss from Prettier config"
```

---

### Task 8: Full build verification

All three build checks must pass. If any fail, fix the issue before proceeding.

**Files:**
- Read-only: entire codebase

- [ ] **Step 1: Type check**

```bash
npx tsc --noEmit
```

Expected: Exit code 0, no type errors.

- [ ] **Step 2: Production build**

```bash
npx next build
```

Expected: Build succeeds. Pay attention to any CSS-related warnings — with Tailwind removed and PostCSS gone, Next.js should use only AntD's CSS-in-JS output plus the minimal globals.css.

- [ ] **Step 3: Storybook build**

```bash
npx storybook build --quiet
```

Expected: Build succeeds. All stories render with AntD theme.

- [ ] **Step 4: Gate check**

All three builds must pass. If any fail:
- Type errors → fix the import/type issue
- Next.js build failure → likely a missing CSS class reference or import — grep for the error and fix
- Storybook build failure → likely a missing import or decorator issue — check preview.tsx

---

### Task 9: Codebase audit — final sweep

Comprehensive scan for any remnants of the old system.

**Files:**
- Read-only scan: entire codebase (excluding `node_modules/`, `.next/`, `storybook-static/`)

- [ ] **Step 1: Grep for "tailwind" (case-insensitive)**

```bash
grep -rni 'tailwind' . --include='*.ts' --include='*.tsx' --include='*.css' --include='*.mjs' --include='*.json' --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=storybook-static --exclude-dir=.git | grep -v 'package-lock.json' | grep -v 'docs/' || echo "PASS: No Tailwind references in source"
```

Expected: `PASS: No Tailwind references in source`. References in `docs/` are documentation and are fine. References in `package-lock.json` from transitive deps are fine.

- [ ] **Step 2: Grep for Tailwind class patterns in any remaining className**

```bash
grep -rn 'className=' src/ --include='*.tsx' | head -20
```

Review any className usage. After AntD migration, className should only appear in:
- CSS Module references (`styles.something`)
- AntD `className` prop overrides (rare)
- Conditional class joining for CSS Modules

It should NOT contain bare Tailwind utilities like `bg-white`, `flex`, `p-4`, etc.

- [ ] **Step 3: Grep for lucide-react references**

```bash
grep -rni 'lucide' . --include='*.ts' --include='*.tsx' --include='*.json' --include='*.mjs' --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git | grep -v 'package-lock.json' | grep -v 'docs/' || echo "PASS: No Lucide references in source"
```

Expected: `PASS: No Lucide references in source`.

- [ ] **Step 4: Check for orphaned CSS files**

```bash
find src/ -name '*.css' -not -name '*.module.css' | grep -v 'globals.css' || echo "PASS: No orphaned CSS files"
```

Expected: `PASS: No orphaned CSS files`. Only `globals.css` and `*.module.css` files should exist.

- [ ] **Step 5: Check for unused imports**

```bash
npx tsc --noEmit 2>&1 | grep -i 'unused\|not found\|cannot find' || echo "PASS: No unused or missing imports"
```

Expected: `PASS: No unused or missing imports`.

- [ ] **Step 6: Verify postcss.config.mjs is gone**

```bash
ls postcss.config.mjs 2>&1 || echo "PASS: postcss.config.mjs deleted"
```

Expected: `ls: postcss.config.mjs: No such file or directory` followed by `PASS: postcss.config.mjs deleted`.

- [ ] **Step 7: Verify portable/ directory is gone**

```bash
ls src/components/ds/portable/ 2>&1 || echo "PASS: portable/ directory deleted"
```

Expected: `PASS: portable/ directory deleted`.

- [ ] **Step 8: Verify usePagination.ts is gone**

```bash
ls src/components/ds/usePagination.ts 2>&1 || echo "PASS: usePagination.ts deleted"
```

Expected: `PASS: usePagination.ts deleted`.

- [ ] **Step 9: Verify package.json has no Tailwind/Lucide deps**

```bash
grep -E 'tailwind|lucide|postcss' package.json || echo "PASS: No Tailwind/Lucide/PostCSS in package.json"
```

Expected: `PASS: No Tailwind/Lucide/PostCSS in package.json` (note: `postcss` may appear as a transitive dep name but should not be in deps/devDeps — check the output carefully).

---

### Task 10: Final commit and merge preparation

**Files:**
- Any remaining uncommitted changes

- [ ] **Step 1: Commit any remaining cleanup**

```bash
git status
```

If there are uncommitted changes from the audit (Task 9 may have found and fixed issues):

```bash
git add -A
git commit -m "chore: final cleanup from Phase 4 audit"
```

- [ ] **Step 2: Run full build one final time**

```bash
npx tsc --noEmit && npx next build && npx storybook build --quiet
```

All three must pass. This is the final gate before the branch is ready for merge.

- [ ] **Step 3: Push the antd-migration branch**

```bash
git push origin antd-migration
```

- [ ] **Step 4: Report to Jim**

The `antd-migration` branch is ready for merge to main. Ask Jim:

> "Phase 4 is complete — all Tailwind, PostCSS, Lucide, and deprecated files have been removed. The `antd-migration` branch passes all builds (tsc, Next.js, Storybook). Ready to merge to main and deploy?"

Do NOT merge or deploy without Jim's explicit approval.

---

## Phase 4 Complete Checklist

After all tasks, verify every item:

- [ ] Pre-cleanup grep found zero Tailwind/Lucide remnants (Task 1)
- [ ] `tailwindcss` uninstalled from devDependencies
- [ ] `@tailwindcss/postcss` uninstalled from devDependencies
- [ ] `prettier-plugin-tailwindcss` uninstalled from devDependencies
- [ ] `lucide-react` uninstalled from dependencies
- [ ] `postcss.config.mjs` deleted
- [ ] `globals.css` contains only @font-face declarations and minimal reset
- [ ] `src/components/ds/portable/` directory deleted (5 files)
- [ ] `src/components/ds/usePagination.ts` deleted
- [ ] `src/components/ds/index.ts` no longer exports usePagination
- [ ] `.prettierrc` has no Tailwind plugin or stylesheet reference
- [ ] `npx tsc --noEmit` passes
- [ ] `npx next build` passes
- [ ] `npx storybook build --quiet` passes
- [ ] Final grep shows zero Tailwind/Lucide references in source code
- [ ] `antd-migration` branch pushed to origin

---

## Migration Complete

The Ant Design migration is finished across all four phases:

| Phase | Status | Summary |
|-------|--------|---------|
| Phase 1: Foundation | Complete | AntD installed, theme configured, SSR wired, ESLint guardrails added |
| Phase 2: DS Component Rewrite | Complete | All 43 DS components rewritten to use AntD internally |
| Phase 3: Page Migration | Complete | All 96 pages migrated to AntD components and layout |
| Phase 4: Cleanup | Complete | Tailwind, PostCSS, Lucide, portable components, usePagination removed |

**Safety net:** The `tailwind-archive` branch preserves a frozen snapshot of the pre-migration Tailwind codebase. It should never be merged or deleted — it exists as a reference and rollback point.

**Branch status:** The `antd-migration` branch is ready for merge to main. All builds pass. Ask Jim if he wants to deploy.

**What changed:**
- Removed packages: `tailwindcss`, `@tailwindcss/postcss`, `prettier-plugin-tailwindcss`, `lucide-react`
- Deleted files: `postcss.config.mjs`, `src/components/ds/portable/` (5 files), `src/components/ds/usePagination.ts`
- Stripped: `globals.css` (from ~234 lines to ~50 lines), `.prettierrc` (removed plugin config)
- Zero Tailwind utility classes remain anywhere in the source code
