# Storybook Component Docs & Story Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create detailed MDX documentation pages for all 71 DS components with in-app screenshots, app page links (Vercel + production), usage notes, and links to the source library docs (AntDesign, Radix, etc.) so it's immediately clear what each component wraps; produce a flagged audit report of zero-usage story variants; and clean up approved stale stories.

**Architecture:** Four sequential phases tied to four GitHub Issues. Phase 1 (Audit) produces a JSON usage map and flagged list. Phase 2 (Screenshots) uses Chrome MCP to capture components in their real app context. Phase 3 (MDX Docs) generates stubs from stories metadata then fills in content per category. Phase 4 (Cleanup) runs after Jim reviews the Phase 1 flagged list.

**Tech Stack:** Node.js (audit + generator scripts), glob, Chrome MCP (screenshots), MDX + `@storybook/addon-docs`, TypeScript strict

---

## Component inventory (71 total)

Accordion, Alert, AlertCallout, AlertDialog, AppointmentCard, AsyncSelect, Avatar, Badge,
Breadcrumbs, Button, Card, Checkbox, Collapse, ColorDot, ComboBox, CommandPalette,
ContextMenu, DataTable, DatePicker, DateRangeFilter, DetailPage, Divider, Drawer, Dropdown,
EmailPreview, EmptyState, FeatureCard, FileUpload, Filter, FormColorPicker, FormField, FormInput,
FormPage, FormSelect, FormTextarea, Grid, HintIcon, HoverCard, Icon, List, ListPage, Modal,
Navbar, NumberInput, PageHeader, Pagination, PatientAvatar, PaymentStatusBadge, PhoneInput,
ProgressBar, RadioGroup, ReorderModal, RichTextEditor, SearchBar, SegmentedControl,
SettingsListPage, SideNav, SignaturePad, Skeleton, Sparkline, Spinner, Stat, Stepper, Tab, Tag,
Text, TimePicker, Toast, Toggle, Tooltip, TopNav

## Reference library mapping

When adding `referenceLibrary` + `referenceComponent` to a `.stories.tsx` file, use this table.
The generated doc header will link directly to that library's docs page for the specific component.

| DS Component | referenceLibrary | referenceComponent | Docs link generated |
|---|---|---|---|
| Accordion | antd | collapse | ant.design/components/collapse |
| Alert | antd | alert | ant.design/components/alert |
| AlertCallout | first-party | — | ✦ First-party |
| AlertDialog | radix | alert-dialog | radix-ui.com/.../alert-dialog |
| AppointmentCard | first-party | — | ✦ First-party |
| AsyncSelect | first-party | — | ✦ First-party |
| Avatar | antd | avatar | ant.design/components/avatar |
| Badge | first-party | — | ✦ First-party |
| Breadcrumbs | antd | breadcrumb | ant.design/components/breadcrumb |
| Button | antd | button | ant.design/components/button |
| Card | antd | card | ant.design/components/card |
| Checkbox | antd | checkbox | ant.design/components/checkbox |
| Collapse | antd | collapse | ant.design/components/collapse |
| ColorDot | first-party | — | ✦ First-party |
| ComboBox | antd | select | ant.design/components/select |
| CommandPalette | cmdk | — | cmdk.paco.me |
| ContextMenu | radix | context-menu | radix-ui.com/.../context-menu |
| DataTable | antd | table | ant.design/components/table |
| DatePicker | antd | date-picker | ant.design/components/date-picker |
| DateRangeFilter | antd | date-picker | ant.design/components/date-picker |
| DetailPage | first-party | — | ✦ First-party |
| Divider | antd | divider | ant.design/components/divider |
| Drawer | antd | drawer | ant.design/components/drawer |
| Dropdown | antd | dropdown | ant.design/components/dropdown |
| EmailPreview | first-party | — | ✦ First-party |
| EmptyState | antd | empty | ant.design/components/empty |
| FeatureCard | first-party | — | ✦ First-party |
| FileUpload | antd | upload | ant.design/components/upload |
| Filter | first-party | — | ✦ First-party |
| FormColorPicker | first-party | — | ✦ First-party |
| FormField | first-party | — | ✦ First-party |
| FormInput | antd | input | ant.design/components/input |
| FormPage | first-party | — | ✦ First-party |
| FormSelect | antd | select | ant.design/components/select |
| FormTextarea | antd | input | ant.design/components/input (textarea mode) |
| Grid | antd | grid | ant.design/components/grid |
| HintIcon | first-party | — | ✦ First-party |
| HoverCard | radix | hover-card | radix-ui.com/.../hover-card |
| Icon | antd | icon | ant.design/components/icon |
| List | antd | list | ant.design/components/list |
| ListPage | first-party | — | ✦ First-party |
| Modal | antd | modal | ant.design/components/modal |
| Navbar | antd | menu | ant.design/components/menu |
| NumberInput | antd | input-number | ant.design/components/input-number |
| PageHeader | first-party | — | ✦ First-party |
| Pagination | antd | pagination | ant.design/components/pagination |
| PatientAvatar | first-party | — | ✦ First-party |
| PaymentStatusBadge | first-party | — | ✦ First-party |
| PhoneInput | react-phone-number-input | — | catamphetamine.gitlab.io/react-phone-number-input |
| ProgressBar | antd | progress | ant.design/components/progress |
| RadioGroup | antd | radio | ant.design/components/radio |
| ReorderModal | first-party | — | ✦ First-party |
| RichTextEditor | first-party | — | ✦ First-party |
| SearchBar | first-party | — | ✦ First-party |
| SegmentedControl | antd | segmented | ant.design/components/segmented |
| SettingsListPage | first-party | — | ✦ First-party |
| SideNav | antd | menu | ant.design/components/menu |
| SignaturePad | signature-pad | — | github.com/szimek/signature_pad |
| Skeleton | antd | skeleton | ant.design/components/skeleton |
| Sparkline | first-party | — | ✦ First-party |
| Spinner | antd | spin | ant.design/components/spin |
| Stat | antd | statistic | ant.design/components/statistic |
| Stepper | antd | steps | ant.design/components/steps |
| Tab | antd | tabs | ant.design/components/tabs |
| Tag | antd | tag | ant.design/components/tag |
| Text | first-party | — | ✦ First-party |
| TimePicker | antd | time-picker | ant.design/components/time-picker |
| Toast | sonner | — | sonner.emilkowal.ski |
| Toggle | antd | switch | ant.design/components/switch |
| Tooltip | antd | tooltip | ant.design/components/tooltip |
| TopNav | first-party | — | ✦ First-party |

**When filling in stories files in Tasks 11–18:** add both `referenceLibrary` and `referenceComponent`
(if applicable) from this table to the `parameters.splose` block alongside `appPages`.

---

## Route → URL mapping

For links in MDX docs use these base URLs:
- Vercel: `https://splose-current.vercel.app`
- Production: `https://acme.splose.com`

For dynamic routes (e.g. `/clients/[id]`), link to the list root (`/clients`) and add a note:
"Navigate to any client record."

---

## Phase 1 — Audit

### Task 1: Extend SploseStoryMeta and SploseDocHeader for app page links

**Files:**
- Modify: `src/components/ds/stories/_docs/splose-types.ts`
- Modify: `src/components/ds/stories/_docs/SploseDocHeader.tsx`

- [ ] **Step 1: Add `appPages` field to SploseStoryMeta**

Open `src/components/ds/stories/_docs/splose-types.ts`. Add the `appPages` field after `source`:

```typescript
export interface SploseStoryMeta {
  /** Component lifecycle state shown in Storybook header + ds-component-catalog. */
  status: SploseStatus;
  /** One-sentence summary shown in the Storybook sidebar and catalog. */
  summary: string;
  /** Inline pattern the component replaces at call sites today (empty for net-new). */
  whatToUseInstead?: string;
  /** Library the component wraps (AntD, first-party, hand-rolled). */
  referenceLibrary?: SploseReferenceLibrary;
  /**
   * The specific component name within the reference library being wrapped.
   * Used to generate a direct link to that library's docs page.
   * Examples: "collapse" (AntD Accordion wraps Collapse), "dialog" (Radix Dialog), "tooltip"
   * Omit for first-party components.
   */
  referenceComponent?: string;
  /** Ticket link if one exists. */
  jira?: string;
  /** Relative path (from repo root) to the build plan doc. */
  plan?: string;
  /** Relative path (from repo root) to the component source file. */
  source?: string;
  /**
   * App pages where this component is actually used.
   * Rendered in the doc header as a Vercel + production link table.
   * For dynamic routes, set route to the list root and use notes to explain navigation.
   */
  appPages?: Array<{
    /** Human-readable label, e.g. "Patient detail — Appointments tab" */
    label: string;
    /** App route, e.g. "/clients" or "/settings/integrations" */
    route: string;
    /** Optional: navigation instructions for dynamic routes */
    notes?: string;
  }>;
}
```

- [ ] **Step 2: Render appPages in SploseDocHeader**

In `src/components/ds/stories/_docs/SploseDocHeader.tsx`, add the app pages table after the links row. Replace the return block with:

```tsx
import Badge from "../../Badge";
import {
  statusBadgeVariant,
  statusLabel,
  type SploseStoryMeta,
} from "./splose-types";

interface SploseDocHeaderProps {
  name: string;
  meta: SploseStoryMeta;
}

export function SploseDocHeader({ name, meta }: SploseDocHeaderProps) {
  const links: Array<{ label: string; href: string }> = [];
  if (meta.jira) links.push({ label: "Jira", href: meta.jira });
  if (meta.plan) {
    links.push({
      label: "Build plan",
      href: `https://github.com/jimsplose/splose-current/blob/main/${meta.plan}`,
    });
  }
  if (meta.source) {
    links.push({
      label: "Source",
      href: `https://github.com/jimsplose/splose-current/blob/main/${meta.source}`,
    });
  }

  // Generate a direct link to the wrapped library's docs for this specific component.
  const LIBRARY_DOC_BASES: Partial<Record<SploseReferenceLibrary, string>> = {
    antd: "https://ant.design/components/",
    radix: "https://www.radix-ui.com/primitives/docs/components/",
    sonner: "https://sonner.emilkowal.ski/",
    cmdk: "https://cmdk.paco.me/",
    downshift: "https://www.downshift-js.com/",
    "signature-pad": "https://github.com/szimek/signature_pad",
    "react-phone-number-input": "https://catamphetamine.gitlab.io/react-phone-number-input/",
  };
  let referenceLibraryHref: string | null = null;
  if (meta.referenceLibrary && meta.referenceLibrary !== "first-party") {
    const base = LIBRARY_DOC_BASES[meta.referenceLibrary];
    if (base) {
      referenceLibraryHref =
        meta.referenceComponent ? `${base}${meta.referenceComponent}` : base;
    }
  }

  const tdStyle: React.CSSProperties = {
    padding: "4px 16px 4px 0",
    fontSize: 12,
    color: "#414549",
    verticalAlign: "top",
  };
  const linkStyle: React.CSSProperties = {
    color: "#5578FF",
    textDecoration: "none",
    fontSize: 12,
  };

  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "16px 0",
        borderBottom: "1px solid var(--color-border, #e5e5e5)",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
          {name}
        </h1>
        <Badge variant={statusBadgeVariant[meta.status]} size="md">
          {statusLabel[meta.status]}
        </Badge>
      </div>

      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "#6E6E64", maxWidth: 720 }}>
        {meta.summary}
      </p>

      {meta.whatToUseInstead ? (
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#6E6E64", maxWidth: 720 }}>
          <strong style={{ color: "#414549" }}>Replaces:</strong> {meta.whatToUseInstead}
        </p>
      ) : null}

      {(links.length > 0 || referenceLibraryHref || meta.referenceLibrary === "first-party") ? (
        <div style={{ display: "flex", gap: 16, fontSize: 13, flexWrap: "wrap", alignItems: "center" }}>
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
               style={{ color: "#5578FF", textDecoration: "none" }}>
              {link.label} →
            </a>
          ))}
          {referenceLibraryHref ? (
            <a href={referenceLibraryHref} target="_blank" rel="noopener noreferrer"
               style={{ color: "#5578FF", textDecoration: "none" }}>
              {meta.referenceLibrary} docs →
            </a>
          ) : meta.referenceLibrary === "first-party" ? (
            <span style={{ color: "#a5a59e", fontSize: 12 }}>✦ First-party component</span>
          ) : null}
        </div>
      ) : null}

      {meta.appPages && meta.appPages.length > 0 ? (
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 600, color: "#414549" }}>
            Used on these pages:
          </p>
          <table style={{ borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ ...tdStyle, fontWeight: 600 }}>Page</th>
                <th style={{ ...tdStyle, fontWeight: 600 }}>Vercel</th>
                <th style={{ ...tdStyle, fontWeight: 600 }}>Production</th>
              </tr>
            </thead>
            <tbody>
              {meta.appPages.map((p) => (
                <tr key={p.route + p.label}>
                  <td style={tdStyle}>
                    {p.label}
                    {p.notes ? (
                      <span style={{ color: "#a5a59e", marginLeft: 6 }}>({p.notes})</span>
                    ) : null}
                  </td>
                  <td style={tdStyle}>
                    <a href={`https://splose-current.vercel.app${p.route}`}
                       target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      Vercel →
                    </a>
                  </td>
                  <td style={tdStyle}>
                    <a href={`https://acme.splose.com${p.route}`}
                       target="_blank" rel="noopener noreferrer" style={linkStyle}>
                      Production →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </header>
  );
}

export default SploseDocHeader;
```

- [ ] **Step 3: Type-check**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ds/stories/_docs/splose-types.ts \
        src/components/ds/stories/_docs/SploseDocHeader.tsx
git commit -m "feat(storybook): add appPages to SploseStoryMeta + render in doc header"
```

---

### Task 2: Write and run the component usage audit script

**Files:**
- Create: `scripts/audit-component-usage.mjs`
- Create: `docs/component-audit.json` (generated)
- Create: `docs/component-audit-flagged.md` (generated)

- [ ] **Step 1: Create the audit script**

Create `scripts/audit-component-usage.mjs`:

```javascript
#!/usr/bin/env node
/**
 * scripts/audit-component-usage.mjs
 *
 * Scans src/ (excluding stories directories) for usage of each DS component.
 * Outputs:
 *   docs/component-audit.json   — full map: component → array of files
 *   docs/component-audit-flagged.md — flagged list (zero-usage components)
 *
 * Run: node scripts/audit-component-usage.mjs
 */

import { globSync } from "glob";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

const COMPONENTS = [
  "Accordion", "Alert", "AlertCallout", "AlertDialog", "AppointmentCard",
  "AsyncSelect", "Avatar", "Badge", "Breadcrumbs", "Button", "Card",
  "Checkbox", "Collapse", "ColorDot", "ComboBox", "CommandPalette",
  "ContextMenu", "DataTable", "DatePicker", "DateRangeFilter", "DetailPage",
  "Divider", "Drawer", "Dropdown", "EmailPreview", "EmptyState", "FeatureCard",
  "FileUpload", "Filter", "FormColorPicker", "FormField", "FormInput", "FormPage",
  "FormSelect", "FormTextarea", "Grid", "HintIcon", "HoverCard", "Icon",
  "List", "ListPage", "Modal", "Navbar", "NumberInput", "PageHeader", "Pagination",
  "PatientAvatar", "PaymentStatusBadge", "PhoneInput", "ProgressBar", "RadioGroup",
  "ReorderModal", "RichTextEditor", "SearchBar", "SegmentedControl", "SettingsListPage",
  "SideNav", "SignaturePad", "Skeleton", "Sparkline", "Spinner", "Stat", "Stepper",
  "Tab", "Tag", "Text", "TimePicker", "Toast", "Toggle", "Tooltip", "TopNav",
];

// All source files, excluding stories and test files
const allFiles = globSync("src/**/*.{tsx,ts}", { cwd: ROOT }).filter(
  (f) =>
    !f.includes("/stories/") &&
    !f.includes("/_docs/") &&
    !f.includes(".test.") &&
    !f.includes(".spec.")
);

const report = {};
const zeroUsage = [];

for (const component of COMPONENTS) {
  // Match as a whole word to avoid false positives (e.g. "Badge" inside "BadgeGroup")
  const pattern = new RegExp(`\\b${component}\\b`);
  const usages = allFiles.filter((f) => {
    const content = readFileSync(join(ROOT, f), "utf8");
    return pattern.test(content);
  });

  report[component] = usages.sort();
  if (usages.length === 0) {
    zeroUsage.push(component);
  }
}

// Write JSON
mkdirSync(join(ROOT, "docs"), { recursive: true });
writeFileSync(join(ROOT, "docs/component-audit.json"), JSON.stringify(report, null, 2));

// Write flagged markdown
const lines = [
  "# Component Usage Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## ⚠️  Zero-usage components",
  "",
  "These components have no usages in src/ outside of stories. Review with Jim before removing stories.",
  "",
  ...(zeroUsage.length === 0
    ? ["_None — all components are used._"]
    : zeroUsage.map((c) => `- [ ] **${c}**`)),
  "",
  "---",
  "",
  "## Full usage map",
  "",
  ...Object.entries(report).flatMap(([component, files]) => [
    `### ${component}`,
    "",
    files.length === 0
      ? "❌ **Zero usages** — candidate for story cleanup"
      : `✅ ${files.length} file(s):`,
    "",
    ...files.map((f) => `- \`${f}\``),
    "",
  ]),
];

writeFileSync(join(ROOT, "docs/component-audit-flagged.md"), lines.join("\n"));

console.log(`\nAudit complete.`);
console.log(`Total components scanned: ${COMPONENTS.length}`);
console.log(`Files scanned: ${allFiles.length}`);
console.log(
  `Zero-usage components (${zeroUsage.length}): ${zeroUsage.join(", ") || "none"}`
);
console.log(`\nOutputs:`);
console.log(`  docs/component-audit.json`);
console.log(`  docs/component-audit-flagged.md`);
```

- [ ] **Step 2: Run the audit**

```bash
cd /Users/jimyenckensplose/claude/splose-current && node scripts/audit-component-usage.mjs
```

Expected output ends with the count of zero-usage components and a list.

- [ ] **Step 3: Review the flagged list**

```bash
cat docs/component-audit-flagged.md
```

Read the zero-usage list. Do NOT delete anything yet — Jim reviews this first (Phase 4).

- [ ] **Step 4: Commit**

```bash
git add scripts/audit-component-usage.mjs docs/component-audit.json docs/component-audit-flagged.md
git commit -m "feat(storybook): add component usage audit script + initial report"
```

---

### Task 3: Create GitHub Issues for Phase tracking

- [ ] **Step 1: Create Phase 1 issue (Audit)**

```bash
gh issue create \
  --repo jimsplose/splose-current \
  --title "[storybook-docs] Phase 1: Component Usage Audit" \
  --body "## Goal
Run the component usage audit and produce the flagged list for review.

## Tasks
- [x] Extend SploseStoryMeta with appPages field (Task 1)
- [x] Write + run audit script → docs/component-audit-flagged.md (Task 2)

## Output
Review \`docs/component-audit-flagged.md\` and decide which zero-usage stories to remove.
This gates Phase 4 (cleanup).

## Plan
docs/superpowers/plans/2026-04-23-storybook-component-docs.md" \
  --label "from-jim,workflow"
```

- [ ] **Step 2: Create Phase 2 issue (Screenshots)**

```bash
gh issue create \
  --repo jimsplose/splose-current \
  --title "[storybook-docs] Phase 2: In-App Screenshot Capture" \
  --body "## Goal
Capture in-app screenshots of every DS component in its real usage context, grouped by page.

## Screenshot groups
- Client/patient detail pages (/clients, /clients/[id] + tabs)
- List pages (/invoices, /payments, /products, /waitlist)
- Form pages (/clients/new, /invoices/new, /contacts/new, /payments/new)
- Settings pages (/settings/*)
- Navigation + Calendar (/calendar, global chrome)
- Reports + Overlays (/reports/*, modals/drawers/dropdowns)

## Output
public/storybook-screenshots/[ComponentName]/[variant].png

## Plan
docs/superpowers/plans/2026-04-23-storybook-component-docs.md" \
  --label "from-jim,workflow"
```

- [ ] **Step 3: Create Phase 3 issue (MDX Docs)**

```bash
gh issue create \
  --repo jimsplose/splose-current \
  --title "[storybook-docs] Phase 3: MDX Documentation Pages" \
  --body "## Goal
Write MDX documentation for all 71 DS components. Each page includes:
- SploseDocHeader with status badge + summary
- Overview (what it does, when to use, when NOT to use)
- In-app screenshots linked from public/storybook-screenshots/
- App page links table (Vercel + production) via appPages in stories metadata
- Storybook stories embedded via \`of={Stories}\`

## Plan
docs/superpowers/plans/2026-04-23-storybook-component-docs.md" \
  --label "from-jim,workflow"
```

- [ ] **Step 4: Note Phase 4 issue (Cleanup)**

Phase 4 GitHub Issue is opened ONLY after Jim reviews the Phase 1 flagged list
(`docs/component-audit-flagged.md`) and approves specific removals. Create it at that time
with the approved list as checkboxes.

---

## Phase 2 — Screenshots

### Task 4: Screenshot infrastructure

**Files:**
- Create: `public/storybook-screenshots/` (directory tree)

- [ ] **Step 1: Create screenshot directories for all 71 components**

```bash
cd /Users/jimyenckensplose/claude/splose-current
for component in Accordion Alert AlertCallout AlertDialog AppointmentCard AsyncSelect Avatar \
  Badge Breadcrumbs Button Card Checkbox Collapse ColorDot ComboBox CommandPalette ContextMenu \
  DataTable DatePicker DateRangeFilter DetailPage Divider Drawer Dropdown EmailPreview EmptyState \
  FeatureCard FileUpload Filter FormColorPicker FormField FormInput FormPage FormSelect FormTextarea \
  Grid HintIcon HoverCard Icon List ListPage Modal Navbar NumberInput PageHeader Pagination \
  PatientAvatar PaymentStatusBadge PhoneInput ProgressBar RadioGroup ReorderModal RichTextEditor \
  SearchBar SegmentedControl SettingsListPage SideNav SignaturePad Skeleton Sparkline Spinner Stat \
  Stepper Tab Tag Text TimePicker Toast Toggle Tooltip TopNav; do
  mkdir -p "public/storybook-screenshots/$component"
done
echo "Done"
```

- [ ] **Step 2: Create naming convention file**

Create `public/storybook-screenshots/README.md`:

```markdown
# Storybook Screenshot Assets

Screenshots captured from the live Splose app (acme.splose.com or localhost:3000).
Used in MDX component documentation pages.

## Naming

public/storybook-screenshots/[ComponentName]/[variant-slug].png

`variant-slug` is a kebab-case descriptor of the variant or state being shown, e.g.:
- `default.png` — primary / default state
- `with-icons.png` — the "with icons" variant
- `empty-state.png` — zero-results state
- `loading.png` — skeleton/loading state

## Adding screenshots

1. Use Chrome MCP to navigate to the relevant page
2. Take a screenshot with save_to_disk: true
3. Copy to the correct path:
   cp /path/to/tmp-screenshot.png public/storybook-screenshots/ComponentName/variant.png
```

- [ ] **Step 3: Commit**

```bash
git add public/storybook-screenshots/ 
git commit -m "chore(storybook): add screenshot directory structure + naming README"
```

---

### Task 5: Screenshot pass — Client & patient detail pages

Navigate to `http://localhost:3000`. For each screenshot: use Chrome MCP `computer` action `screenshot` with `save_to_disk: true`, then copy to the correct path.

**Components to capture on these pages:**

| Component | Page to open | File to save |
|---|---|---|
| TopNav | `/clients` | `TopNav/global.png` |
| SideNav | `/clients` | `SideNav/global.png` |
| PageHeader | `/clients` | `PageHeader/list-page.png` |
| SearchBar | `/clients` | `SearchBar/default.png` |
| DataTable | `/clients` | `DataTable/client-list.png` |
| Badge | `/clients` | `Badge/client-status.png` |
| PatientAvatar | `/clients` | `PatientAvatar/in-list.png` |
| Tag | `/clients` | `Tag/client-tag.png` |
| Filter | `/clients` | `Filter/client-filter.png` |
| Pagination | `/clients` | `Pagination/client-list.png` |
| EmptyState | `/clients?q=zzz_no_results` | `EmptyState/no-results.png` |
| Tab | `/clients/1` or any real client | `Tab/patient-detail.png` |
| Accordion | `/clients/1` | `Accordion/patient-detail.png` |
| Avatar | `/clients/1` | `Avatar/patient-detail.png` |
| Card | `/clients/1` | `Card/patient-info.png` |
| Breadcrumbs | `/clients/1` | `Breadcrumbs/patient-detail.png` |
| List | `/clients/1` | `List/patient-info.png` |
| HintIcon | `/clients/1` | `HintIcon/form-field.png` |
| Stat | `/clients/1` | `Stat/patient-summary.png` |

- [ ] **Step 1: Resize Chrome to 1440×900**

Use Chrome MCP `resize_window` → `{ width: 1440, height: 900 }`.

- [ ] **Step 2: Navigate to `/clients`**

Navigate Chrome to `http://localhost:3000/clients`.

- [ ] **Step 3: Capture list-page components**

Take screenshots of TopNav, SideNav, PageHeader, SearchBar, DataTable, Badge, PatientAvatar, Tag, Filter, Pagination. Save each with `save_to_disk: true` and copy to the path in the table above.

For the EmptyState shot, append `?q=zzz_no_results` to the URL to trigger the empty state.

- [ ] **Step 4: Navigate to a patient detail page**

Navigate to any real client record (e.g. click the first row in the client list).
Capture Tab, Accordion, Avatar, Card, Breadcrumbs, List, HintIcon, Stat.

- [ ] **Step 5: Commit screenshots**

```bash
git add public/storybook-screenshots/
git commit -m "feat(storybook-docs): add client/patient page screenshots"
```

---

### Task 6: Screenshot pass — Invoice, payment, product pages

| Component | Page | File |
|---|---|---|
| DataTable | `/invoices` | `DataTable/invoice-list.png` |
| PaymentStatusBadge | `/invoices` | `PaymentStatusBadge/in-list.png` |
| Badge | `/invoices` | `Badge/invoice-status.png` |
| PageHeader | `/invoices` | `PageHeader/invoice-list.png` |
| DataTable | `/payments` | `DataTable/payments-list.png` |
| DataTable | `/products` | `DataTable/products-list.png` |
| Sparkline | `/reports/performance` | `Sparkline/revenue.png` |
| Stat | `/reports/performance` | `Stat/report-summary.png` |
| DateRangeFilter | `/reports` | `DateRangeFilter/reports.png` |
| ProgressBar | `/settings/data-import` | `ProgressBar/import.png` |

- [ ] **Step 1: Navigate, screenshot, save** (follow same pattern as Task 5)
- [ ] **Step 2: Commit**

```bash
git add public/storybook-screenshots/
git commit -m "feat(storybook-docs): add invoice/payment/reports page screenshots"
```

---

### Task 7: Screenshot pass — Form pages

| Component | Page | File |
|---|---|---|
| FormInput | `/clients/new` | `FormInput/default.png` |
| FormSelect | `/clients/new` | `FormSelect/default.png` |
| FormTextarea | `/clients/new` | `FormTextarea/default.png` |
| FormField | `/clients/new` | `FormField/with-label-hint.png` |
| Checkbox | `/clients/new` | `Checkbox/default.png` |
| RadioGroup | `/invoices/new` | `RadioGroup/payment-type.png` |
| Toggle | `/settings/ai` | `Toggle/feature-flag.png` |
| NumberInput | `/invoices/new` | `NumberInput/amount.png` |
| PhoneInput | `/clients/new` | `PhoneInput/default.png` |
| FileUpload | `/clients/1/files` | `FileUpload/default.png` |
| AsyncSelect | `/clients/new` | `AsyncSelect/practitioner.png` |
| DatePicker | `/invoices/new` | `DatePicker/default.png` |
| TimePicker | `/calendar` | `TimePicker/appointment.png` |
| FormColorPicker | `/settings/services/edit/1` | `FormColorPicker/default.png` |
| RichTextEditor | `/notes/new` | `RichTextEditor/default.png` |
| SignaturePad | `/patient-form/1/view` | `SignaturePad/default.png` |
| Button | `/clients/new` | `Button/primary.png` |
| Button | `/clients` | `Button/secondary.png` (ghost button near filters) |
| FormPage | `/clients/new` | `FormPage/new-client.png` |

- [ ] **Step 1: Navigate, screenshot, save** (follow same pattern as Task 5)
- [ ] **Step 2: Commit**

```bash
git add public/storybook-screenshots/
git commit -m "feat(storybook-docs): add form page screenshots"
```

---

### Task 8: Screenshot pass — Settings pages

| Component | Page | File |
|---|---|---|
| SettingsListPage | `/settings/users` | `SettingsListPage/users.png` |
| SettingsListPage | `/settings/services` | `SettingsListPage/services.png` |
| Toggle | `/settings/ai` | `Toggle/settings.png` |
| Accordion | `/settings/integrations` | `Accordion/integrations.png` |
| EmailPreview | `/settings/email-templates` | `EmailPreview/default.png` |
| ReorderModal | `/settings/services` (trigger reorder) | `ReorderModal/default.png` |
| Stepper | `/invoices/batch-invoice` | `Stepper/batch-invoice.png` |
| SegmentedControl | `/calendar` | `SegmentedControl/calendar-view.png` |
| ComboBox | `/settings/custom-fields` | `ComboBox/default.png` |

- [ ] **Step 1: Navigate, screenshot, save** (follow same pattern as Task 5)
- [ ] **Step 2: Commit**

```bash
git add public/storybook-screenshots/
git commit -m "feat(storybook-docs): add settings page screenshots"
```

---

### Task 9: Screenshot pass — Navigation, overlays, calendar, and remaining components

| Component | Page / trigger | File |
|---|---|---|
| Navbar | `/clients/1` (sub-nav) | `Navbar/patient-detail.png` |
| Breadcrumbs | `/invoices/1` | `Breadcrumbs/invoice-detail.png` |
| AppointmentCard | `/calendar` | `AppointmentCard/default.png` |
| ColorDot | `/calendar` | `ColorDot/appointment-type.png` |
| DateRangeFilter | `/reports/payments` | `DateRangeFilter/default.png` |
| Dropdown | Trigger any action menu on client list | `Dropdown/action-menu.png` |
| Modal | Trigger any delete confirmation | `Modal/confirm-delete.png` |
| Drawer | Trigger any slide-out panel | `Drawer/default.png` |
| Tooltip | Hover any `HintIcon` | `Tooltip/hint.png` |
| AlertDialog | Trigger a destructive confirm | `AlertDialog/default.png` |
| Toast | Trigger a save action | `Toast/success.png` |
| Alert | Open a page with a warning banner | `Alert/warning.png` |
| AlertCallout | `/settings/ai` | `AlertCallout/default.png` |
| Skeleton | Slow-throttle network, reload a page | `Skeleton/loading.png` |
| Spinner | Slow-throttle network, trigger a load | `Spinner/default.png` |
| CommandPalette | Press Cmd+K | `CommandPalette/default.png` |
| HoverCard | Hover a patient avatar | `HoverCard/patient.png` |
| ContextMenu | Right-click a list row | `ContextMenu/default.png` |
| DetailPage | `/clients/1` | `DetailPage/patient.png` |
| ListPage | `/clients` | `ListPage/clients.png` |
| Divider | `/clients/1` (section dividers) | `Divider/default.png` |
| Grid | `/reports` | `Grid/reports-layout.png` |
| FeatureCard | `/settings` | `FeatureCard/settings-index.png` |
| Icon | Anywhere icons appear | `Icon/samples.png` |
| Text | `/clients/1` (body text) | `Text/body.png` |
| ColorDot | `/settings/services` | `ColorDot/service-color.png` |
| Collapse | `/settings/...` | `Collapse/default.png` |

- [ ] **Step 1: Navigate, screenshot, save**
- [ ] **Step 2: Commit**

```bash
git add public/storybook-screenshots/
git commit -m "feat(storybook-docs): add navigation/overlay/calendar screenshots"
```

---

## Phase 3 — MDX Documentation

### Task 10: MDX stub generator script

**Files:**
- Create: `scripts/generate-mdx-stubs.mjs`

- [ ] **Step 1: Create the generator script**

Create `scripts/generate-mdx-stubs.mjs`:

```javascript
#!/usr/bin/env node
/**
 * scripts/generate-mdx-stubs.mjs
 *
 * Creates MDX stub files in src/components/ds/stories/docs/ for every
 * .stories.tsx file that doesn't already have a matching MDX doc.
 *
 * Run: node scripts/generate-mdx-stubs.mjs
 */

import { globSync } from "glob";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, basename } from "path";

const ROOT = process.cwd();
const STORIES_DIR = "src/components/ds/stories";
const DOCS_OUT = `${STORIES_DIR}/docs`;

mkdirSync(join(ROOT, DOCS_OUT), { recursive: true });

const storyFiles = globSync(`${STORIES_DIR}/*.stories.tsx`, { cwd: ROOT });

let created = 0;
let skipped = 0;

for (const storyFile of storyFiles) {
  const name = basename(storyFile, ".stories.tsx");
  const outPath = join(ROOT, DOCS_OUT, `${name}.mdx`);

  if (existsSync(outPath)) {
    console.log(`SKIP (exists): ${name}.mdx`);
    skipped++;
    continue;
  }

  const content = readFileSync(join(ROOT, storyFile), "utf8");
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  const title = titleMatch ? titleMatch[1] : `DS/${name}`;

  const stub = `import { Meta, Story } from "@storybook/addon-docs/blocks";
import * as ${name}Stories from "../${name}.stories";
import { SploseDocHeader } from "../_docs/SploseDocHeader";

<Meta title="${title}" of={${name}Stories} />

<SploseDocHeader
  name="${name}"
  meta={${name}Stories.default.parameters.splose}
/>

## Overview

_Add 2-3 sentences: what this component does, its primary purpose in the Splose UI._

## When to use

- _Bullet: specific Splose scenario where this is the right choice_
- _Bullet: another valid use case_

## When NOT to use

- _Bullet: when to prefer another component_
- _Bullet: when this component is overkill or wrong_

## In-App Screenshots

_Add screenshots below once Phase 2 (screenshot capture) is complete._

<!-- 
![${name} — default](/storybook-screenshots/${name}/default.png)
-->

## Stories
`;

  writeFileSync(outPath, stub);
  console.log(`CREATE: ${name}.mdx`);
  created++;
}

console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
```

- [ ] **Step 2: Run the generator**

```bash
cd /Users/jimyenckensplose/claude/splose-current && node scripts/generate-mdx-stubs.mjs
```

Expected: 71 files created (skips the 5 that already exist: Colors, Introduction, Spacing, Typography, plus SploseDocHeader which is in `_docs/`).

- [ ] **Step 3: Verify stubs appear in Storybook**

```bash
npm run storybook -- --ci --quiet 2>&1 | head -30
```

Expect no MDX parse errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ds/stories/docs/ scripts/generate-mdx-stubs.mjs
git commit -m "feat(storybook): generate MDX stub docs for all 71 DS components"
```

---

### Task 11: MDX content — Layout category

**Components:** Accordion, Card, Collapse, Divider, FeatureCard, Grid, PageHeader

**Files to modify:** `src/components/ds/stories/docs/[Name].mdx` for each, plus add `appPages` to each component's `.stories.tsx`.

For each component below: (a) fill in the MDX, (b) add `appPages` to `parameters.splose` in the `.stories.tsx`.

- [ ] **Step 1: Accordion.mdx**

Replace the Overview/When to use/When NOT to use/screenshots sections of `src/components/ds/stories/docs/Accordion.mdx` with:

```mdx
## Overview

Accordion presents a vertical list of expandable panels. Each panel has a title, optional description, and optional icon; clicking the header toggles the body open or closed. Supports `single` mode (only one open at a time) or `multiple` (any number open). Used throughout Splose wherever secondary or grouped information needs to be accessible without cluttering the layout — patient detail sections, settings groupings, integration listings.

## When to use

- Patient detail pages where secondary info (billing, Medicare, insurance) should be accessible but not always visible
- Settings pages that group related configuration options
- Integration listings where each service has an expandable details pane
- FAQs or help content sections

## When NOT to use

- When all content should always be visible — use a Card or Section instead
- When there is only one item — use a plain collapsible Card
- When content is navigation — use a SideNav or Tab instead

## In-App Screenshots

![Accordion — patient additional details](/storybook-screenshots/Accordion/patient-detail.png)
![Accordion — integrations settings](/storybook-screenshots/Accordion/integrations.png)
```

Add `appPages` to `src/components/ds/stories/Accordion.stories.tsx` inside `parameters.splose`:

```typescript
appPages: [
  { label: "Patient detail — Additional details", route: "/clients", notes: "Navigate to any client record" },
  { label: "Settings — Integrations", route: "/settings/integrations" },
],
```

- [ ] **Step 2: Card.mdx**

```mdx
## Overview

Card is the primary surface component in Splose. It provides a white bordered container with configurable padding used to group related content: patient info blocks, form sections, report tiles, dashboard stats, and inline action panels. It accepts a `shadow` prop and a `padding` size (`sm`, `md`, `lg`, `xl`).

## When to use

- Grouping a cluster of related fields, stats, or actions on a detail page
- Wrapping a form section to visually separate it from surrounding content
- Dashboard and reports tiles

## When NOT to use

- As a list row — use DataTable instead
- As a full-page container — use ListPage or DetailPage template instead
```

Add to `Card.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Patient detail — info panels", route: "/clients", notes: "Navigate to any client record" },
  { label: "Dashboard", route: "/" },
  { label: "Reports", route: "/reports" },
],
```

- [ ] **Step 3: Collapse.mdx**

```mdx
## Overview

Collapse is a deprecated single-panel alias of Accordion. It wraps one expandable section. Prefer `Accordion` with a single item for new code; Collapse is kept only for backward compatibility in existing call sites.

## When to use

- Legacy pages already using Collapse (do not refactor unless in scope)

## When NOT to use

- New code — use `<Accordion items={[{ id, title, children }]} />` instead
```

Add to `Collapse.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Settings pages (legacy usage)", route: "/settings" },
],
```

- [ ] **Step 4: Divider.mdx**

```mdx
## Overview

Divider renders a horizontal rule to separate sections within a Card, form, or detail page. It optionally accepts a label (rendered centered in the line) for named section separators.

## When to use

- Between logical sections within a Card or form
- Between a header and body area in a detail panel

## When NOT to use

- Between list rows — DataTable handles its own row borders
- As structural layout spacing — use `gap` or `margin` utilities instead
```

Add to `Divider.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Patient detail — section dividers", route: "/clients", notes: "Navigate to any client record" },
],
```

- [ ] **Step 5: FeatureCard.mdx**

```mdx
## Overview

FeatureCard is a larger tile used on hub pages (e.g. the Settings index, or an onboarding checklist). It shows an icon, title, description, and optional CTA link or button. It signals a navigable feature area rather than displaying data.

## When to use

- Settings index listing all configuration areas
- Onboarding / feature discovery pages

## When NOT to use

- Data rows — use DataTable
- Inline info blocks — use Card
```

Add to `FeatureCard.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Settings — index", route: "/settings" },
],
```

- [ ] **Step 6: Grid.mdx**

```mdx
## Overview

Grid provides a responsive CSS grid layout container. It accepts `cols` (number of columns), `gap`, and breakpoint-aware column counts. Used for report summary tiles, stat grids, and settings card grids.

## When to use

- Report summary rows (2–4 Stat tiles side by side)
- Settings index grids of FeatureCards
- Any multi-column layout that needs responsive collapsing

## When NOT to use

- Single-column stacks — use flexbox or just a div
- Data tables — use DataTable
```

Add to `Grid.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Reports — summary stats row", route: "/reports" },
  { label: "Settings — index grid", route: "/settings" },
],
```

- [ ] **Step 7: PageHeader.mdx**

```mdx
## Overview

PageHeader is the H1 area at the top of every main page. It renders the page title, optional subtitle, optional breadcrumbs, and a right-side action slot (usually a primary Button or ButtonGroup). Every ListPage, DetailPage, and FormPage uses PageHeader as its first element.

## When to use

- At the top of every main content area — always used via ListPage/DetailPage/FormPage templates

## When NOT to use

- Inside a Card or modal — use a styled `<h2>` or the modal's header slot instead
- In the SideNav — the sidebar has its own title treatment
```

Add to `PageHeader.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Clients list", route: "/clients" },
  { label: "Invoices list", route: "/invoices" },
  { label: "Patient detail", route: "/clients", notes: "Navigate to any client record" },
],
```

- [ ] **Step 8: Verify Storybook still builds**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx tsc --noEmit
```

- [ ] **Step 9: Commit**

```bash
git add src/components/ds/stories/docs/Accordion.mdx \
        src/components/ds/stories/docs/Card.mdx \
        src/components/ds/stories/docs/Collapse.mdx \
        src/components/ds/stories/docs/Divider.mdx \
        src/components/ds/stories/docs/FeatureCard.mdx \
        src/components/ds/stories/docs/Grid.mdx \
        src/components/ds/stories/docs/PageHeader.mdx \
        src/components/ds/stories/Accordion.stories.tsx \
        src/components/ds/stories/Card.stories.tsx \
        src/components/ds/stories/Collapse.stories.tsx \
        src/components/ds/stories/Divider.stories.tsx \
        src/components/ds/stories/FeatureCard.stories.tsx \
        src/components/ds/stories/Grid.stories.tsx \
        src/components/ds/stories/PageHeader.stories.tsx
git commit -m "docs(storybook): Layout category MDX docs + appPages (Accordion, Card, Collapse, Divider, FeatureCard, Grid, PageHeader)"
```

---

### Task 12: MDX content — Core forms

**Components:** Button, Checkbox, FormField, FormInput, FormSelect, FormTextarea, Toggle, RadioGroup, NumberInput, FileUpload, SearchBar

- [ ] **Step 1: Button.mdx**

```mdx
## Overview

Button is the primary interactive trigger in Splose. It supports variants (`primary`, `secondary`, `ghost`, `danger`, `link`), sizes (`sm`, `md`, `lg`), loading and disabled states, and an icon slot. Used on every page for actions: saving forms, triggering modals, navigating, destructive confirms.

## When to use

- Any explicit user action: Save, Cancel, Delete, Create, Export
- In PageHeader action slots, form footers, empty state CTAs, modal footers

## When NOT to use

- Navigation between pages — use a `<Link>` or the SideNav
- Inline text actions inside a paragraph — use the `link` variant only if necessary
```

Add to `Button.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "All pages — primary actions", route: "/clients" },
  { label: "New client form — Save/Cancel", route: "/clients/new" },
  { label: "Invoice detail — action buttons", route: "/invoices", notes: "Navigate to any invoice" },
],
```

- [ ] **Step 2: Checkbox.mdx**

```mdx
## Overview

Checkbox provides a boolean on/off input tied to a label. Used in forms for multi-select options, batch-selection in tables (via DataTable's row selection), and boolean settings flags.

## When to use

- Multi-select form groups (select all that apply)
- Table row selection (DataTable wraps Checkbox internally)
- Boolean settings that don't need immediate effect (use Toggle for immediate-effect flags)

## When NOT to use

- Single yes/no settings that take immediate effect — use Toggle
- Mutually exclusive options — use RadioGroup
```

Add to `Checkbox.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Batch invoice — item selection", route: "/invoices/batch-invoice" },
  { label: "New client form — agreement checkboxes", route: "/clients/new" },
],
```

- [ ] **Step 3: FormField.mdx**

```mdx
## Overview

FormField is the wrapper that adds a label, optional hint text, and error message display to any form input. All inputs in Splose (FormInput, FormSelect, FormTextarea, etc.) should be wrapped in FormField for consistent labelling and error state handling.

## When to use

- Around every form input: always

## When NOT to use

- Around non-input content — use a plain `<div>` or `<label>` directly
- Inside DataTable cells — table editing has its own inline error treatment
```

Add to `FormField.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "New client form", route: "/clients/new" },
  { label: "New invoice form", route: "/invoices/new" },
  { label: "Settings — any settings page", route: "/settings/details" },
],
```

- [ ] **Step 4: FormInput.mdx**

```mdx
## Overview

FormInput is the standard single-line text input. It supports prefix/suffix icons, character counters, disabled and read-only states. Always wrap in FormField.

## When to use

- Names, emails, addresses, reference numbers, search fields in forms

## When NOT to use

- Multi-line text — use FormTextarea
- Numeric values with increment/decrement — use NumberInput
- Phone numbers — use PhoneInput
- Colour selection — use FormColorPicker
```

Add to `FormInput.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "New client form", route: "/clients/new" },
  { label: "New contact form", route: "/contacts/new" },
  { label: "Settings — account details", route: "/settings/details" },
],
```

- [ ] **Step 5: FormSelect.mdx**

```mdx
## Overview

FormSelect renders a native `<select>` or a styled dropdown for choosing one value from a fixed list. Use when the option set is small (<20 items) and static. For async/large/searchable lists, use AsyncSelect.

## When to use

- Dropdowns with a known fixed option set: gender, state, appointment type from a short list
- Settings choices (timezone, currency, language)

## When NOT to use

- Lists that need search/filter — use AsyncSelect or ComboBox
- Lists fetched from an API — use AsyncSelect
```

Add to `FormSelect.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "New client — gender, state", route: "/clients/new" },
  { label: "Settings — timezone, currency", route: "/settings/details" },
],
```

- [ ] **Step 6: FormTextarea.mdx**

```mdx
## Overview

FormTextarea is the multi-line text input for longer free-text entries. Supports auto-grow, max-rows capping, and character counters. Always wrap in FormField.

## When to use

- Notes, descriptions, comments, addresses that span multiple lines
- Invoice memo fields, appointment notes, client notes

## When NOT to use

- Rich formatted text — use RichTextEditor
- Single-line text — use FormInput
```

Add to `FormTextarea.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "New client — notes field", route: "/clients/new" },
  { label: "New invoice — memo", route: "/invoices/new" },
],
```

- [ ] **Step 7: Toggle.mdx**

```mdx
## Overview

Toggle is an on/off switch for settings that take immediate effect. The visual design communicates an instant state change (no submit button needed). Used heavily in Settings pages.

## When to use

- Feature flags that enable/disable a behaviour immediately
- Settings toggles (AI features on/off, SMS notifications, etc.)

## When NOT to use

- Form fields that are submitted with a Save button — use Checkbox
- Mutually exclusive options — use RadioGroup or SegmentedControl
```

Add to `Toggle.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Settings — AI features", route: "/settings/ai" },
  { label: "Settings — SMS settings", route: "/settings/sms-settings" },
],
```

- [ ] **Step 8: RadioGroup.mdx**

```mdx
## Overview

RadioGroup presents a set of mutually exclusive options where the user selects exactly one. Renders as a vertical or horizontal list of radio buttons with labels.

## When to use

- Payment type selection (EFTPOS, cash, bank transfer)
- Mutually exclusive settings options with 2–5 choices
- Form fields where the user must choose exactly one of a small set

## When NOT to use

- Binary yes/no with immediate effect — use Toggle
- More than ~6 options — use FormSelect or AsyncSelect
- Multi-select — use Checkbox
```

Add to `RadioGroup.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "New payment — payment type", route: "/payments/new" },
  { label: "New invoice — billing type", route: "/invoices/new" },
],
```

- [ ] **Step 9: NumberInput.mdx**

```mdx
## Overview

NumberInput is a specialised text input for numeric values. It enforces numeric-only entry, supports `min`/`max`/`step` props, optional increment/decrement buttons, and prefix/suffix (currency symbol, unit).

## When to use

- Dollar amounts, quantities, durations, percentages
- Anywhere a plain FormInput would accept a number but needs value constraints or spin buttons

## When NOT to use

- Free-form text that happens to include numbers — use FormInput
- Large integers with no need for increment — plain FormInput is fine
```

Add to `NumberInput.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "New invoice — line item amounts", route: "/invoices/new" },
  { label: "New product — price", route: "/products/new" },
],
```

- [ ] **Step 10: FileUpload.mdx**

```mdx
## Overview

FileUpload provides a drag-and-drop file upload zone with file type validation, size limits, and progress indication. Used on patient files pages and document attachment fields.

## When to use

- Client file attachments (documents, images, forms)
- Any form field that accepts a file upload

## When NOT to use

- Avatar/profile photo upload — use a specialised image uploader
- Data imports — use the CSV import flow in Settings
```

Add to `FileUpload.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Patient files tab", route: "/clients", notes: "Navigate to any client → Files tab" },
],
```

- [ ] **Step 11: SearchBar.mdx**

```mdx
## Overview

SearchBar is a text input pre-configured for search: magnifier icon prefix, clear button, debounced `onChange`. It sits at the top of every list page to filter the DataTable below.

## When to use

- At the top of any list page (clients, invoices, products, waitlist) to filter results
- Global search (CommandPalette uses SearchBar internally)

## When NOT to use

- Inside a form as a text input — use FormInput
- As a filter with multiple criteria — combine with Filter component
```

Add to `SearchBar.stories.tsx` parameters.splose:

```typescript
appPages: [
  { label: "Clients list", route: "/clients" },
  { label: "Invoices list", route: "/invoices" },
  { label: "Products list", route: "/products" },
],
```

- [ ] **Step 12: Type-check + commit**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx tsc --noEmit
git add src/components/ds/stories/docs/Button.mdx \
        src/components/ds/stories/docs/Checkbox.mdx \
        src/components/ds/stories/docs/FormField.mdx \
        src/components/ds/stories/docs/FormInput.mdx \
        src/components/ds/stories/docs/FormSelect.mdx \
        src/components/ds/stories/docs/FormTextarea.mdx \
        src/components/ds/stories/docs/Toggle.mdx \
        src/components/ds/stories/docs/RadioGroup.mdx \
        src/components/ds/stories/docs/NumberInput.mdx \
        src/components/ds/stories/docs/FileUpload.mdx \
        src/components/ds/stories/docs/SearchBar.mdx \
        src/components/ds/stories/Button.stories.tsx \
        src/components/ds/stories/Checkbox.stories.tsx \
        src/components/ds/stories/FormField.stories.tsx \
        src/components/ds/stories/FormInput.stories.tsx \
        src/components/ds/stories/FormSelect.stories.tsx \
        src/components/ds/stories/FormTextarea.stories.tsx \
        src/components/ds/stories/Toggle.stories.tsx \
        src/components/ds/stories/RadioGroup.stories.tsx \
        src/components/ds/stories/NumberInput.stories.tsx \
        src/components/ds/stories/FileUpload.stories.tsx \
        src/components/ds/stories/SearchBar.stories.tsx
git commit -m "docs(storybook): Forms core MDX docs + appPages (Button, Checkbox, FormField, FormInput, FormSelect, FormTextarea, Toggle, RadioGroup, NumberInput, FileUpload, SearchBar)"
```

---

### Task 13: MDX content — Specialised form inputs

**Components:** AsyncSelect, ComboBox, DatePicker, TimePicker, PhoneInput, FormColorPicker, RichTextEditor, SignaturePad

For each: fill in MDX + add `appPages` to `.stories.tsx`.

- [ ] **Step 1: AsyncSelect.mdx**

```mdx
## Overview

AsyncSelect is a searchable dropdown backed by an API. As the user types, it fires a debounced fetch and populates options from the server. Used wherever the option list is large, dynamic, or needs server-side filtering: practitioner selection, client lookup, product search.

## When to use

- Practitioner / location selection in appointment and invoice forms
- Client lookup in any context where you type to search
- Any select where options come from an API

## When NOT to use

- Small static option sets (<20 items) — use FormSelect
- Free-form search that isn't a relationship — use SearchBar
```

appPages:
```typescript
appPages: [
  { label: "New invoice — practitioner", route: "/invoices/new" },
  { label: "New appointment — location", route: "/calendar" },
],
```

- [ ] **Step 2: ComboBox.mdx**

```mdx
## Overview

ComboBox combines a text input with a filterable dropdown. Unlike AsyncSelect (async API fetch), ComboBox filters a static or pre-loaded list client-side. The user can type to narrow options or select from the full list.

## When to use

- Selecting from a medium-size list that's fully loaded (50–200 items)
- Custom field type selection, tag assignment from a known set

## When NOT to use

- Large server-side lists — use AsyncSelect
- Small static lists — use FormSelect
```

appPages:
```typescript
appPages: [
  { label: "Settings — custom fields", route: "/settings/custom-fields" },
],
```

- [ ] **Step 3: DatePicker.mdx**

```mdx
## Overview

DatePicker provides a calendar popover for selecting a single date. It formats to Australian locale (dd/mm/yyyy). Wraps a text input that opens the calendar on click.

## When to use

- Invoice date, appointment date, date of birth, any single date field

## When NOT to use

- Date + time — use DatePicker alongside TimePicker, or use the calendar's built-in slot picker
- Date ranges — use DateRangeFilter
```

appPages:
```typescript
appPages: [
  { label: "New invoice — invoice date", route: "/invoices/new" },
  { label: "New appointment", route: "/calendar" },
],
```

- [ ] **Step 4: TimePicker.mdx**

```mdx
## Overview

TimePicker provides a time-of-day selector (hour + minute, in 15-minute increments by default). Used alongside DatePicker for appointment scheduling.

## When to use

- Appointment start and end time
- Any field requiring a time-of-day value

## When NOT to use

- Duration (hours + minutes elapsed) — use NumberInput with a unit suffix
```

appPages:
```typescript
appPages: [
  { label: "Calendar — appointment slot", route: "/calendar" },
],
```

- [ ] **Step 5: PhoneInput.mdx**

```mdx
## Overview

PhoneInput is a specialised FormInput for international phone numbers. It uses the `react-phone-number-input` library with a country-code flag selector prefix. Defaults to Australian (+61) format.

## When to use

- Client and contact phone numbers in any form

## When NOT to use

- Non-phone number fields — use FormInput
```

appPages:
```typescript
appPages: [
  { label: "New client — phone number", route: "/clients/new" },
  { label: "New contact — phone number", route: "/contacts/new" },
],
```

- [ ] **Step 6: FormColorPicker.mdx**

```mdx
## Overview

FormColorPicker renders a palette of preset colours (from Splose's colour token set) for picking a colour value. Used to colour-code services, appointment types, and calendar categories.

## When to use

- Service / appointment type colour coding
- Any entity that needs a user-selectable colour from the Splose palette

## When NOT to use

- Free-form colour selection — the palette is intentionally constrained to Splose tokens
```

appPages:
```typescript
appPages: [
  { label: "Settings — services edit", route: "/settings/services", notes: "Navigate to any service → Edit" },
  { label: "Settings — appointment templates", route: "/settings/appointment-templates" },
],
```

- [ ] **Step 7: RichTextEditor.mdx**

```mdx
## Overview

RichTextEditor is a full WYSIWYG editor for formatted content. It supports bold, italic, headings, lists, links, and tables. Used for progress notes and email template authoring.

## When to use

- Progress notes (clinical notes that need formatting)
- Email template body editing

## When NOT to use

- Short free-text notes — use FormTextarea
- Structured data entry — use form fields
```

appPages:
```typescript
appPages: [
  { label: "New note", route: "/notes/new" },
  { label: "Edit note", route: "/notes", notes: "Navigate to any note → Edit" },
  { label: "Settings — email templates", route: "/settings/email-templates" },
],
```

- [ ] **Step 8: SignaturePad.mdx**

```mdx
## Overview

SignaturePad provides a touch/mouse drawing canvas for capturing a patient's handwritten signature. Used on patient consent forms and intake forms viewed by the patient on a device.

## When to use

- Patient intake forms and consent forms in the patient-facing form view

## When NOT to use

- Staff signatures — not currently a use case in Splose
- Any form not requiring a legal handwritten signature
```

appPages:
```typescript
appPages: [
  { label: "Patient form view", route: "/patient-form", notes: "Navigate to any patient form link" },
],
```

- [ ] **Step 9: Commit**

```bash
git add src/components/ds/stories/docs/AsyncSelect.mdx \
        src/components/ds/stories/docs/ComboBox.mdx \
        src/components/ds/stories/docs/DatePicker.mdx \
        src/components/ds/stories/docs/TimePicker.mdx \
        src/components/ds/stories/docs/PhoneInput.mdx \
        src/components/ds/stories/docs/FormColorPicker.mdx \
        src/components/ds/stories/docs/RichTextEditor.mdx \
        src/components/ds/stories/docs/SignaturePad.mdx \
        src/components/ds/stories/AsyncSelect.stories.tsx \
        src/components/ds/stories/ComboBox.stories.tsx \
        src/components/ds/stories/DatePicker.stories.tsx \
        src/components/ds/stories/TimePicker.stories.tsx \
        src/components/ds/stories/PhoneInput.stories.tsx \
        src/components/ds/stories/FormColorPicker.stories.tsx \
        src/components/ds/stories/RichTextEditor.stories.tsx \
        src/components/ds/stories/SignaturePad.stories.tsx
git commit -m "docs(storybook): Specialised forms MDX docs + appPages (AsyncSelect, ComboBox, DatePicker, TimePicker, PhoneInput, FormColorPicker, RichTextEditor, SignaturePad)"
```

---

### Task 14: MDX content — Data display

**Components:** Badge, DataTable, Avatar, ColorDot, List, HintIcon, Stat, Sparkline, Pagination

- [ ] **Step 1: Badge.mdx**

```mdx
## Overview

Badge is a small inline pill for status labels, counts, and categorical tags. Supports semantic colour variants (`green`, `red`, `blue`, `yellow`, `orange`, `gray`, `purple`) and `sm`/`md`/`lg` sizes.

## When to use

- Invoice and payment status (Paid → green, Overdue → red, Draft → gray)
- Client status and flag labels
- Lifecycle status pills in the DS doc headers themselves

## When NOT to use

- Action triggers — use Button
- Navigation — use Tab or SideNav item badges
```

appPages:
```typescript
appPages: [
  { label: "Clients list — status column", route: "/clients" },
  { label: "Invoices list — status column", route: "/invoices" },
  { label: "Payments list — status", route: "/payments" },
],
```

- [ ] **Step 2: DataTable.mdx**

```mdx
## Overview

DataTable is the primary list/grid component. It renders tabular data with sortable columns, row selection, pagination, and an action column. It handles empty states and loading skeletons internally. Used on every list page in Splose.

## When to use

- Any list of entities: clients, invoices, payments, products, waitlist, reports

## When NOT to use

- Non-tabular data — use List, Card grid, or Stat components
- A single-row summary — use a Card with key–value pairs
```

appPages:
```typescript
appPages: [
  { label: "Clients list", route: "/clients" },
  { label: "Invoices list", route: "/invoices" },
  { label: "Payments list", route: "/payments" },
  { label: "Products list", route: "/products" },
  { label: "Waitlist", route: "/waitlist" },
],
```

- [ ] **Step 3: Avatar.mdx**

```mdx
## Overview

Avatar renders a circular image or initials-based fallback for a user or practitioner. Supports `sm`, `md`, `lg` sizes and an optional online indicator.

## When to use

- Practitioner and user identifiers in TopNav, assignee columns, patient detail header

## When NOT to use

- Patient profile image — use PatientAvatar (which has patient-specific styling)
```

appPages:
```typescript
appPages: [
  { label: "TopNav — user menu", route: "/clients" },
  { label: "Patient detail — practitioner", route: "/clients", notes: "Navigate to any client record" },
],
```

- [ ] **Step 4: ColorDot.mdx**

```mdx
## Overview

ColorDot is a small filled circle used to visually encode a category or entity colour — appointment types on the calendar, service colours on lists.

## When to use

- Inline colour swatch for appointment types, services, or tags with user-assigned colours
- Legend items in calendar or report views

## When NOT to use

- Status indicators — use Badge
- Traffic-light indicators — use a semantic Badge variant
```

appPages:
```typescript
appPages: [
  { label: "Calendar — appointment type legend", route: "/calendar" },
  { label: "Settings — services list", route: "/settings/services" },
],
```

- [ ] **Step 5: List.mdx**

```mdx
## Overview

List renders a vertical sequence of key–value rows or simple text items, typically inside a Card. Used for patient info panels (name, DOB, Medicare), quick summaries, and sidebar detail panels.

## When to use

- Key–value detail panels (patient info, contact info)
- Simple ordered or unordered text lists inside a Card

## When NOT to use

- Large sortable data sets — use DataTable
- Navigation items — use SideNav or Tab
```

appPages:
```typescript
appPages: [
  { label: "Patient detail — info panel", route: "/clients", notes: "Navigate to any client record" },
  { label: "Contact detail", route: "/contacts", notes: "Navigate to any contact record" },
],
```

- [ ] **Step 6: HintIcon.mdx**

```mdx
## Overview

HintIcon is a small `?` circle icon that, on hover, shows a Tooltip with explanatory text. Used in FormField labels and headings to clarify non-obvious fields.

## When to use

- FormField labels where the field's purpose isn't obvious without context
- Section headings that reference product terminology (Medicare, NDIS numbers, etc.)

## When NOT to use

- As the sole explanation for a required field — the label itself should be descriptive
- Decorative purposes
```

appPages:
```typescript
appPages: [
  { label: "New client form — hint icons", route: "/clients/new" },
  { label: "Settings — any settings form", route: "/settings/details" },
],
```

- [ ] **Step 7: Stat.mdx**

```mdx
## Overview

Stat renders a single headline metric: a large number, optional change indicator (up/down arrow + percentage), and a label. Used in report summaries and dashboard tiles.

## When to use

- Dashboard or report summary rows (revenue, appointment count, outstanding balance)
- Patient-level summary stats on detail pages

## When NOT to use

- In-table cells — format inline
- Narrative text — use a Card with body text
```

appPages:
```typescript
appPages: [
  { label: "Reports — performance summary", route: "/reports/performance" },
  { label: "Patient detail — summary stats", route: "/clients", notes: "Navigate to any client record" },
],
```

- [ ] **Step 8: Sparkline.mdx**

```mdx
## Overview

Sparkline is a small inline trend chart (line or bar) that shows data movement over time without axes or labels. Used alongside Stat to show directional context.

## When to use

- Revenue and appointment trend lines in report summaries
- Any Stat tile that benefits from showing a time-series trend

## When NOT to use

- When the reader needs exact values — use a full chart with axes
- As a standalone chart — always pair with a Stat or label
```

appPages:
```typescript
appPages: [
  { label: "Reports — performance sparklines", route: "/reports/performance" },
],
```

- [ ] **Step 9: Pagination.mdx**

```mdx
## Overview

Pagination renders page navigation controls (Previous, Next, page number buttons) below a DataTable. It is used by DataTable internally for server-side pagination and can be used standalone for custom lists.

## When to use

- Below any DataTable when total rows exceed the page size
- Custom list components that need page navigation

## When NOT to use

- Infinite scroll patterns — Splose uses page-based navigation, not infinite scroll
```

appPages:
```typescript
appPages: [
  { label: "Clients list — bottom pagination", route: "/clients" },
  { label: "Invoices list", route: "/invoices" },
],
```

- [ ] **Step 10: Commit**

```bash
git add src/components/ds/stories/docs/Badge.mdx \
        src/components/ds/stories/docs/DataTable.mdx \
        src/components/ds/stories/docs/Avatar.mdx \
        src/components/ds/stories/docs/ColorDot.mdx \
        src/components/ds/stories/docs/List.mdx \
        src/components/ds/stories/docs/HintIcon.mdx \
        src/components/ds/stories/docs/Stat.mdx \
        src/components/ds/stories/docs/Sparkline.mdx \
        src/components/ds/stories/docs/Pagination.mdx \
        src/components/ds/stories/Badge.stories.tsx \
        src/components/ds/stories/DataTable.stories.tsx \
        src/components/ds/stories/Avatar.stories.tsx \
        src/components/ds/stories/ColorDot.stories.tsx \
        src/components/ds/stories/List.stories.tsx \
        src/components/ds/stories/HintIcon.stories.tsx \
        src/components/ds/stories/Stat.stories.tsx \
        src/components/ds/stories/Sparkline.stories.tsx \
        src/components/ds/stories/Pagination.stories.tsx
git commit -m "docs(storybook): Data Display MDX docs + appPages (Badge, DataTable, Avatar, ColorDot, List, HintIcon, Stat, Sparkline, Pagination)"
```

---

### Task 15: MDX content — Feedback

**Components:** Alert, AlertCallout, EmptyState, Skeleton, Spinner, Toast

- [ ] **Step 1: Alert.mdx**

```mdx
## Overview

Alert is a dismissible banner for page-level messages: form validation summaries, success confirmations, warning notices, or error states. It supports `info`, `success`, `warning`, and `error` variants.

## When to use

- Showing the result of a form submission (success or error)
- Displaying a page-level warning (unpaid invoice warning, missing information)

## When NOT to use

- Inline field errors — use FormField's error prop
- Short ephemeral notifications — use Toast
```

appPages:
```typescript
appPages: [
  { label: "New client form — validation errors", route: "/clients/new" },
  { label: "Various pages — contextual warnings", route: "/invoices" },
],
```

- [ ] **Step 2: AlertCallout.mdx**

```mdx
## Overview

AlertCallout is a non-dismissible inline callout box, smaller than Alert. It is used mid-page to draw attention to a specific setting, note, or contextual tip — always in the flow of the page content rather than at the top.

## When to use

- Contextual tips within settings pages ("This feature requires Stripe to be connected")
- Inline notices that are always relevant for that page state

## When NOT to use

- Page-level result messages — use Alert
- Ephemeral notifications — use Toast
```

appPages:
```typescript
appPages: [
  { label: "Settings — AI features", route: "/settings/ai" },
  { label: "Settings — integrations", route: "/settings/integrations" },
],
```

- [ ] **Step 3: EmptyState.mdx**

```mdx
## Overview

EmptyState fills a DataTable or page area when there is no data to show. It renders a centred illustration, heading, body copy, and an optional CTA button. It signals to the user what to do next.

## When to use

- Any DataTable or list page that can have zero rows
- Search results with no matches
- Tab content areas with no records yet

## When NOT to use

- Loading states — use Skeleton
- Error states — use Alert + EmptyState together if needed
```

appPages:
```typescript
appPages: [
  { label: "Clients list — empty", route: "/clients" },
  { label: "Patient tabs — no records", route: "/clients", notes: "Navigate to a client → Communications tab if empty" },
],
```

- [ ] **Step 4: Skeleton.mdx**

```mdx
## Overview

Skeleton renders animated grey placeholder blocks in the shape of the content that is loading. Used to prevent layout shift while data fetches resolve.

## When to use

- While any page or section is fetching data
- DataTable loading state (DataTable uses Skeleton internally by default)

## When NOT to use

- If the load is expected to be under ~100ms — just show nothing or a Spinner
- For in-progress operations (saving, uploading) — use Spinner or ProgressBar
```

appPages:
```typescript
appPages: [
  { label: "Any page initial load — data fetching", route: "/clients" },
],
```

- [ ] **Step 5: Spinner.mdx**

```mdx
## Overview

Spinner is an animated loading indicator for in-progress operations. Sizes: `sm`, `md`, `lg`. Used as button loading states, inline loading indicators, and full-page loading overlays.

## When to use

- Button loading state while an action is processing (`<Button loading>`)
- Inline loading indicator inside a panel or card
- Full-page overlay during long async operations

## When NOT to use

- Initial page data load — use Skeleton
- File upload progress — use ProgressBar
```

appPages:
```typescript
appPages: [
  { label: "All pages — button loading states", route: "/clients/new" },
],
```

- [ ] **Step 6: Toast.mdx**

```mdx
## Overview

Toast renders brief dismissible notification messages in the bottom-right corner. Powered by Sonner. Supports `success`, `error`, `warning`, and `info` types. Auto-dismisses after a configurable duration.

## When to use

- Confirming an action completed: "Client saved", "Invoice sent", "Settings updated"
- Flagging a non-blocking error or warning

## When NOT to use

- Errors that require immediate action — use Alert inline instead
- Long messages that need to persist — use Alert
```

appPages:
```typescript
appPages: [
  { label: "All pages — save/action confirmations", route: "/clients" },
],
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ds/stories/docs/Alert.mdx \
        src/components/ds/stories/docs/AlertCallout.mdx \
        src/components/ds/stories/docs/EmptyState.mdx \
        src/components/ds/stories/docs/Skeleton.mdx \
        src/components/ds/stories/docs/Spinner.mdx \
        src/components/ds/stories/docs/Toast.mdx \
        src/components/ds/stories/Alert.stories.tsx \
        src/components/ds/stories/AlertCallout.stories.tsx \
        src/components/ds/stories/EmptyState.stories.tsx \
        src/components/ds/stories/Skeleton.stories.tsx \
        src/components/ds/stories/Spinner.stories.tsx \
        src/components/ds/stories/Toast.stories.tsx
git commit -m "docs(storybook): Feedback MDX docs + appPages (Alert, AlertCallout, EmptyState, Skeleton, Spinner, Toast)"
```

---

### Task 16: MDX content — Overlays

**Components:** AlertDialog, ContextMenu, Drawer, Dropdown, HoverCard, Modal, Tooltip, CommandPalette

- [ ] **Step 1: AlertDialog.mdx**

```mdx
## Overview

AlertDialog is a blocking confirmation modal for destructive or irreversible actions. It prevents interaction with the page until the user explicitly confirms or cancels. Uses Radix Dialog under the hood.

## When to use

- Confirming irreversible deletions (delete client, void invoice, remove user)
- Any action where accidental triggering would be costly

## When NOT to use

- Non-destructive confirmations — use a regular Modal or inline messaging
- Informational content — use Modal
```

appPages:
```typescript
appPages: [
  { label: "Delete confirmation — any list page", route: "/clients" },
],
```

- [ ] **Step 2: ContextMenu.mdx**

```mdx
## Overview

ContextMenu is a right-click triggered menu. In Splose it is used on DataTable rows to surface row-level actions (view, edit, delete, duplicate) without cluttering the table with visible buttons.

## When to use

- DataTable row actions (right-click to reveal actions)
- Any interactive surface where right-click actions are appropriate

## When NOT to use

- Primary actions that users need to discover — put them in a visible Button or Dropdown
- Touch-only interfaces — right-click is not available on mobile
```

appPages:
```typescript
appPages: [
  { label: "Clients list — row right-click", route: "/clients" },
  { label: "Invoices list — row right-click", route: "/invoices" },
],
```

- [ ] **Step 3: Drawer.mdx**

```mdx
## Overview

Drawer is a panel that slides in from the right edge of the screen. Used for quick-edit forms, detail panels, and filter configurations that don't warrant a full page navigation.

## When to use

- Quick editing an entity without leaving the current list context
- Appointment details on the calendar
- Complex filter configuration panels

## When NOT to use

- Full CRUD forms — navigate to a dedicated page instead
- Simple confirmations — use AlertDialog or Modal
```

appPages:
```typescript
appPages: [
  { label: "Calendar — appointment detail", route: "/calendar" },
  { label: "Clients list — quick edit", route: "/clients" },
],
```

- [ ] **Step 4: Dropdown.mdx**

```mdx
## Overview

Dropdown renders a triggered menu of actions. The trigger can be any element (Button, icon button). Menu items support icons, descriptions, dividers, and disabled states. Powers action menus throughout Splose.

## When to use

- Action menus (⋯ More buttons on list rows, in PageHeader)
- Any set of 2+ secondary actions that don't all need to be visible at once

## When NOT to use

- Single primary actions — use Button directly
- Value selection — use FormSelect or AsyncSelect
```

appPages:
```typescript
appPages: [
  { label: "PageHeader — action dropdown", route: "/clients" },
  { label: "List rows — ⋯ more menu", route: "/invoices" },
],
```

- [ ] **Step 5: HoverCard.mdx**

```mdx
## Overview

HoverCard shows a rich preview panel when the user hovers over a trigger element. Used for patient summary previews on hover in lists, and practitioner info cards.

## When to use

- Hovering a patient avatar or name to preview key patient details without navigating away
- Hovering a practitioner name to see their profile card

## When NOT to use

- Explanatory help text — use Tooltip or HintIcon
- Actions — use Dropdown
```

appPages:
```typescript
appPages: [
  { label: "Client list — hover patient name", route: "/clients" },
],
```

- [ ] **Step 6: Modal.mdx**

```mdx
## Overview

Modal is the general-purpose overlay for forms, previews, and confirmations that aren't destructive. It renders centred with a backdrop, a close button, and configurable width.

## When to use

- Editing a small number of fields inline (rename, add note, change status)
- Previewing a document, email, or invoice PDF
- Multi-step processes that don't warrant a new page

## When NOT to use

- Destructive confirmations — use AlertDialog
- Forms with many fields — navigate to a dedicated form page
```

appPages:
```typescript
appPages: [
  { label: "Invoice — add payment modal", route: "/invoices", notes: "Navigate to any invoice → Add payment" },
  { label: "Client — send email modal", route: "/clients", notes: "Navigate to any client → Communications → Send email" },
],
```

- [ ] **Step 7: Tooltip.mdx**

```mdx
## Overview

Tooltip shows a short text label on hover over any trigger element. Used for icon-only buttons, truncated text labels, and supplemental clarifications.

## When to use

- Icon-only buttons (the icon action needs a label for accessibility)
- Truncated text that needs the full value on hover
- Short supplemental info (not long enough for HintIcon popover)

## When NOT to use

- Long explanations — use HintIcon with a richer popover
- Content that needs to be always visible — place it inline
```

appPages:
```typescript
appPages: [
  { label: "Any page — icon button labels", route: "/clients" },
],
```

- [ ] **Step 8: CommandPalette.mdx**

```mdx
## Overview

CommandPalette is a keyboard-first global search and command launcher. Opened with Cmd+K (Mac) / Ctrl+K (Windows). It searches clients, invoices, settings pages, and surfaces quick actions.

## When to use

- Navigating to any entity or page without using the sidebar
- Power-user keyboard-driven workflows

## When NOT to use

- As an inline search — use SearchBar
- As the only way to access a feature — all features must be reachable via normal navigation too
```

appPages:
```typescript
appPages: [
  { label: "Global — Cmd+K anywhere", route: "/clients" },
],
```

- [ ] **Step 9: Commit**

```bash
git add src/components/ds/stories/docs/AlertDialog.mdx \
        src/components/ds/stories/docs/ContextMenu.mdx \
        src/components/ds/stories/docs/Drawer.mdx \
        src/components/ds/stories/docs/Dropdown.mdx \
        src/components/ds/stories/docs/HoverCard.mdx \
        src/components/ds/stories/docs/Modal.mdx \
        src/components/ds/stories/docs/Tooltip.mdx \
        src/components/ds/stories/docs/CommandPalette.mdx \
        src/components/ds/stories/AlertDialog.stories.tsx \
        src/components/ds/stories/ContextMenu.stories.tsx \
        src/components/ds/stories/Drawer.stories.tsx \
        src/components/ds/stories/Dropdown.stories.tsx \
        src/components/ds/stories/HoverCard.stories.tsx \
        src/components/ds/stories/Modal.stories.tsx \
        src/components/ds/stories/Tooltip.stories.tsx \
        src/components/ds/stories/CommandPalette.stories.tsx
git commit -m "docs(storybook): Overlays MDX docs + appPages (AlertDialog, ContextMenu, Drawer, Dropdown, HoverCard, Modal, Tooltip, CommandPalette)"
```

---

### Task 17: MDX content — Navigation

**Components:** Breadcrumbs, Navbar, SideNav, Tab, TopNav

- [ ] **Step 1: Breadcrumbs.mdx**

```mdx
## Overview

Breadcrumbs renders a trail of page ancestors as clickable links. Used on detail pages to show hierarchy and let users navigate back without using browser history.

## When to use

- Any detail or sub-page: `/clients/[id]`, `/invoices/[id]`, `/notes/[id]/edit`
- Settings sub-pages that nest under a parent

## When NOT to use

- Top-level pages (Clients, Invoices, etc.) — they have no parent to show
```

appPages:
```typescript
appPages: [
  { label: "Patient detail page", route: "/clients", notes: "Navigate to any client record" },
  { label: "Invoice detail page", route: "/invoices", notes: "Navigate to any invoice" },
],
```

- [ ] **Step 2: Navbar.mdx**

```mdx
## Overview

Navbar is the horizontal sub-navigation bar that appears on entity detail pages. It renders the tabs for a patient's sub-sections (Appointments, Notes, Files, etc.) and is distinct from the global TopNav.

## When to use

- Patient detail page section navigation
- Any detail page with more than ~4 sub-sections that don't fit as sidebar items

## When NOT to use

- Top-level page navigation — use SideNav
- Simple 2–3 view toggle — use SegmentedControl or Tab
```

appPages:
```typescript
appPages: [
  { label: "Patient detail — section navigation", route: "/clients", notes: "Navigate to any client record" },
],
```

- [ ] **Step 3: SideNav.mdx**

```mdx
## Overview

SideNav is the primary left-hand navigation column shown on every authenticated page. It renders nav groups with icons and labels, and highlights the active route. It is always rendered by the root layout.

## When to use

- It is always rendered. It's part of the root layout — not placed per-page.

## When NOT to use

- Per-page section navigation — use Navbar or Tab
```

appPages:
```typescript
appPages: [
  { label: "Global — all authenticated pages", route: "/clients" },
],
```

- [ ] **Step 4: Tab.mdx**

```mdx
## Overview

Tab is a simple tab row for switching between view modes or content sections within a card or panel. Smaller scope than Navbar (which spans the full entity detail page).

## When to use

- Switching between views inside a Card (e.g. "Table" vs "Chart" view)
- 2–4 sub-sections inside a contained panel

## When NOT to use

- Entity detail page navigation — use Navbar
- Toggle between two states — use SegmentedControl
```

appPages:
```typescript
appPages: [
  { label: "Reports — tab views", route: "/reports" },
  { label: "Calendar — view tabs", route: "/calendar" },
],
```

- [ ] **Step 5: TopNav.mdx**

```mdx
## Overview

TopNav is the top horizontal bar rendered on every authenticated page. It shows the Splose logo, organisation name, global search trigger (Cmd+K), notifications, and the user avatar/menu.

## When to use

- It is always rendered as part of the root layout — not placed per-page.

## When NOT to use

- Per-page headers — use PageHeader
```

appPages:
```typescript
appPages: [
  { label: "Global — all authenticated pages", route: "/clients" },
],
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ds/stories/docs/Breadcrumbs.mdx \
        src/components/ds/stories/docs/Navbar.mdx \
        src/components/ds/stories/docs/SideNav.mdx \
        src/components/ds/stories/docs/Tab.mdx \
        src/components/ds/stories/docs/TopNav.mdx \
        src/components/ds/stories/Breadcrumbs.stories.tsx \
        src/components/ds/stories/Navbar.stories.tsx \
        src/components/ds/stories/SideNav.stories.tsx \
        src/components/ds/stories/Tab.stories.tsx \
        src/components/ds/stories/TopNav.stories.tsx
git commit -m "docs(storybook): Navigation MDX docs + appPages (Breadcrumbs, Navbar, SideNav, Tab, TopNav)"
```

---

### Task 18: MDX content — Templates and specialised components

**Components:** DetailPage, FormPage, ListPage, SettingsListPage, Text, AppointmentCard, EmailPreview, Filter, DateRangeFilter, PatientAvatar, PaymentStatusBadge, ProgressBar, ReorderModal, Stepper, SegmentedControl, Tag, Icon

- [ ] **Step 1: DetailPage.mdx**

```mdx
## Overview

DetailPage is the page-level template for entity detail views. It renders a PageHeader with breadcrumbs and action buttons, a Navbar for sub-sections, and a content area. Used for `/clients/[id]`, `/invoices/[id]`, `/contacts/[id]`.

## When to use

- Any entity that has multiple sub-sections and needs a standard detail layout

## When NOT to use

- Simple pages with no sub-navigation — use ListPage or a plain layout
```

appPages:
```typescript
appPages: [
  { label: "Patient detail", route: "/clients", notes: "Navigate to any client record" },
  { label: "Invoice detail", route: "/invoices", notes: "Navigate to any invoice" },
],
```

- [ ] **Step 2: FormPage.mdx**

```mdx
## Overview

FormPage is the template for create/edit form pages. It renders a PageHeader, a form body in a Card, and a footer with Save and Cancel buttons.

## When to use

- Any create or edit page: `/clients/new`, `/invoices/new`, `/products/new`

## When NOT to use

- Quick inline edits — use a Modal or Drawer
```

appPages:
```typescript
appPages: [
  { label: "New client", route: "/clients/new" },
  { label: "New invoice", route: "/invoices/new" },
],
```

- [ ] **Step 3: ListPage.mdx**

```mdx
## Overview

ListPage is the template for entity list pages. It renders a PageHeader, SearchBar, optional Filter row, DataTable, and Pagination. Used for `/clients`, `/invoices`, `/payments`, `/products`, `/waitlist`.

## When to use

- Any entity list page

## When NOT to use

- Non-list content — use a plain page layout
```

appPages:
```typescript
appPages: [
  { label: "Clients list", route: "/clients" },
  { label: "Invoices list", route: "/invoices" },
  { label: "Products list", route: "/products" },
],
```

- [ ] **Step 4: SettingsListPage.mdx**

```mdx
## Overview

SettingsListPage is the template for settings list pages (users, services, locations, etc.). Similar to ListPage but tuned for settings context: tighter layout, inline edit, drag-to-reorder support.

## When to use

- `/settings/[section]` list pages (users, services, locations, appointment templates, etc.)

## When NOT to use

- Non-settings list pages — use ListPage
```

appPages:
```typescript
appPages: [
  { label: "Settings — users", route: "/settings/users" },
  { label: "Settings — services", route: "/settings/services" },
  { label: "Settings — locations", route: "/settings/locations" },
],
```

- [ ] **Step 5: Text.mdx**

```mdx
## Overview

Text is the typography component. It standardises font size, weight, color, and line-height via semantic props (`size`, `weight`, `tone`, `align`, `truncate`). Replaces ad-hoc inline styles and `className` combinations for body copy.

## When to use

- Any body text, label, or caption that isn't already handled by a more specific component
- Replacing inline `<p style={{ ... }}>` or `className="text-sm text-gray-500"` patterns

## When NOT to use

- Headings — use H1/H2/H3 directly or PageHeader's title slot
- Badges or status labels — use Badge
```

appPages:
```typescript
appPages: [
  { label: "All pages — body copy", route: "/clients" },
],
```

- [ ] **Step 6: AppointmentCard.mdx**

```mdx
## Overview

AppointmentCard renders a single appointment tile on the calendar grid. It shows the patient name, appointment type colour, time, and practitioner avatar in a compact card format.

## When to use

- Calendar grid — always rendered by the calendar page, not placed manually

## When NOT to use

- Appointment lists in tables — use DataTable
```

appPages:
```typescript
appPages: [
  { label: "Calendar — appointment tiles", route: "/calendar" },
],
```

- [ ] **Step 7: EmailPreview.mdx**

```mdx
## Overview

EmailPreview renders a read-only HTML preview of an email template in an iframe-like sandbox. Used in Settings > Email Templates to show how a template will look to recipients.

## When to use

- Settings — Email Template preview panel
- Any context where a formatted email needs to be previewed

## When NOT to use

- Email composition — use RichTextEditor + a form
```

appPages:
```typescript
appPages: [
  { label: "Settings — email templates", route: "/settings/email-templates" },
],
```

- [ ] **Step 8: Filter.mdx**

```mdx
## Overview

Filter is a row of dropdown filter chips that appear above a DataTable. Each chip represents one filterable dimension (status, practitioner, date range). Active filters show as filled chips with a clear button.

## When to use

- Above any DataTable that needs multi-dimensional filtering
- Combined with SearchBar for list pages

## When NOT to use

- Simple text search — use SearchBar alone
- Date-only filtering — use DateRangeFilter
```

appPages:
```typescript
appPages: [
  { label: "Clients list — filter row", route: "/clients" },
  { label: "Invoices list — filter row", route: "/invoices" },
  { label: "Payments list — filter row", route: "/payments" },
],
```

- [ ] **Step 9: DateRangeFilter.mdx**

```mdx
## Overview

DateRangeFilter is a date-range picker chip for filtering by a from–to period. It renders as a compact button that opens a calendar popover. Used on reports and list pages for period filtering.

## When to use

- Reports pages (filter by billing period, report date range)
- Invoice/payment list date filtering

## When NOT to use

- Single date input in a form — use DatePicker
```

appPages:
```typescript
appPages: [
  { label: "Reports — date range", route: "/reports" },
  { label: "Payments list — date filter", route: "/payments" },
],
```

- [ ] **Step 10: PatientAvatar.mdx**

```mdx
## Overview

PatientAvatar is Avatar specialised for patients. It shows initials derived from the patient name, uses the Splose patient colour palette for consistent per-patient tinting, and includes an optional notification badge.

## When to use

- Anywhere a patient is identified: list rows, detail page header, TopNav recent patients

## When NOT to use

- Practitioner / user avatars — use Avatar (which uses a different tinting system)
```

appPages:
```typescript
appPages: [
  { label: "Clients list — avatar column", route: "/clients" },
  { label: "Patient detail — header", route: "/clients", notes: "Navigate to any client record" },
],
```

- [ ] **Step 11: PaymentStatusBadge.mdx**

```mdx
## Overview

PaymentStatusBadge is a pre-configured Badge for payment and invoice statuses. It maps status values (`paid`, `unpaid`, `overdue`, `voided`, `draft`, `partial`) to the correct Badge colour automatically.

## When to use

- Invoice and payment status columns in DataTable
- Invoice detail page header status

## When NOT to use

- Non-payment statuses — use Badge with explicit variant
```

appPages:
```typescript
appPages: [
  { label: "Invoices list — status column", route: "/invoices" },
  { label: "Payments list — status", route: "/payments" },
],
```

- [ ] **Step 12: ProgressBar.mdx**

```mdx
## Overview

ProgressBar renders a horizontal filled bar showing progress from 0–100%. Supports `sm`, `md`, `lg` sizes and semantic colour variants (success, warning, error).

## When to use

- Data import progress (Settings > Data Import)
- Any operation where % completion is measurable and meaningful to show

## When NOT to use

- Indeterminate loading — use Spinner or Skeleton
- Status representation — use Badge
```

appPages:
```typescript
appPages: [
  { label: "Settings — data import progress", route: "/settings/data-import" },
],
```

- [ ] **Step 13: ReorderModal.mdx**

```mdx
## Overview

ReorderModal is a drag-to-reorder list inside a Modal. Used in Settings to let admins change the display order of services, appointment templates, and other ordered lists.

## When to use

- Any settings list where order matters and users need to drag to reorder

## When NOT to use

- Inline reordering without a modal — use a drag handle pattern in the table row
```

appPages:
```typescript
appPages: [
  { label: "Settings — services reorder", route: "/settings/services" },
  { label: "Settings — appointment templates reorder", route: "/settings/appointment-templates" },
],
```

- [ ] **Step 14: Stepper.mdx**

```mdx
## Overview

Stepper renders a horizontal step indicator for multi-step forms. It shows step labels, the current step highlighted, and completed steps as ticked.

## When to use

- Multi-step wizards: batch invoice creation, multi-step onboarding

## When NOT to use

- Single-step forms — don't add fake steps
- Non-linear processes — Stepper implies sequential completion
```

appPages:
```typescript
appPages: [
  { label: "Batch invoice — step indicator", route: "/invoices/batch-invoice" },
],
```

- [ ] **Step 15: SegmentedControl.mdx**

```mdx
## Overview

SegmentedControl is a button group for selecting one view mode from a set of 2–4 options. It renders as a joined pill with each option as a segment. Used for calendar view switching (day/week/month) and report view toggles.

## When to use

- Switching between 2–4 mutually exclusive views of the same content
- Calendar day/week/month toggle
- Report table/chart view toggle

## When NOT to use

- More than 4 options — use Tab or FormSelect
- Form field selection — use RadioGroup
```

appPages:
```typescript
appPages: [
  { label: "Calendar — day/week/month toggle", route: "/calendar" },
],
```

- [ ] **Step 16: Tag.mdx**

```mdx
## Overview

Tag renders a small removable or read-only label chip. Used to show client tags, appointment type tags, and custom tag fields. Distinct from Badge — Tags are user-created and removable.

## When to use

- Client tag display and editing (the client's assigned tags)
- Any entity with user-defined freeform labels

## When NOT to use

- Fixed system statuses — use Badge
- Navigation — use SideNav or Tab
```

appPages:
```typescript
appPages: [
  { label: "Clients list — tags column", route: "/clients" },
  { label: "Settings — tags management", route: "/settings/tags" },
],
```

- [ ] **Step 17: Icon.mdx**

```mdx
## Overview

Icon is the DS wrapper for AntD icons (`@ant-design/icons`). It standardises size (`sm`, `md`, `lg`, `xl`), tone (`primary`, `secondary`, `danger`, `success`, `muted`), and accessibility attributes.

## When to use

- Any icon in the UI — always wrap in `<Icon as={AntdIconComponent} />` rather than using AntD icons directly

## When NOT to use

- Do not use AntD icon components directly — always use Icon wrapper for consistent sizing/tone
```

appPages:
```typescript
appPages: [
  { label: "All pages — icons throughout the UI", route: "/clients" },
],
```

- [ ] **Step 18: Type-check + commit**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx tsc --noEmit
git add src/components/ds/stories/docs/DetailPage.mdx \
        src/components/ds/stories/docs/FormPage.mdx \
        src/components/ds/stories/docs/ListPage.mdx \
        src/components/ds/stories/docs/SettingsListPage.mdx \
        src/components/ds/stories/docs/Text.mdx \
        src/components/ds/stories/docs/AppointmentCard.mdx \
        src/components/ds/stories/docs/EmailPreview.mdx \
        src/components/ds/stories/docs/Filter.mdx \
        src/components/ds/stories/docs/DateRangeFilter.mdx \
        src/components/ds/stories/docs/PatientAvatar.mdx \
        src/components/ds/stories/docs/PaymentStatusBadge.mdx \
        src/components/ds/stories/docs/ProgressBar.mdx \
        src/components/ds/stories/docs/ReorderModal.mdx \
        src/components/ds/stories/docs/Stepper.mdx \
        src/components/ds/stories/docs/SegmentedControl.mdx \
        src/components/ds/stories/docs/Tag.mdx \
        src/components/ds/stories/docs/Icon.mdx \
        src/components/ds/stories/DetailPage.stories.tsx \
        src/components/ds/stories/FormPage.stories.tsx \
        src/components/ds/stories/ListPage.stories.tsx \
        src/components/ds/stories/SettingsListPage.stories.tsx \
        src/components/ds/stories/Text.stories.tsx \
        src/components/ds/stories/AppointmentCard.stories.tsx \
        src/components/ds/stories/EmailPreview.stories.tsx \
        src/components/ds/stories/Filter.stories.tsx \
        src/components/ds/stories/DateRangeFilter.stories.tsx \
        src/components/ds/stories/PatientAvatar.stories.tsx \
        src/components/ds/stories/PaymentStatusBadge.stories.tsx \
        src/components/ds/stories/ProgressBar.stories.tsx \
        src/components/ds/stories/ReorderModal.stories.tsx \
        src/components/ds/stories/Stepper.stories.tsx \
        src/components/ds/stories/SegmentedControl.stories.tsx \
        src/components/ds/stories/Tag.stories.tsx \
        src/components/ds/stories/Icon.stories.tsx
git commit -m "docs(storybook): Templates + Specialised MDX docs + appPages (DetailPage, FormPage, ListPage, SettingsListPage, Text, AppointmentCard, EmailPreview, Filter, DateRangeFilter, PatientAvatar, PaymentStatusBadge, ProgressBar, ReorderModal, Stepper, SegmentedControl, Tag, Icon)"
```

---

### Task 19: Final Storybook build verification

**Files:** No new files — verification only.

- [ ] **Step 1: Build Storybook**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx build-storybook 2>&1 | tail -20
```

Expected: successful build, no MDX parse errors.

- [ ] **Step 2: Spot-check five random components in browser**

Start Storybook (`npm run storybook`) and verify these five in the browser:
- `Accordion` → check docs page renders SploseDocHeader + appPages table + screenshots
- `Button` → check docs page
- `DataTable` → check docs page
- `Modal` → check docs page
- `TopNav` → check docs page

- [ ] **Step 3: Verify all screenshot images load (no broken images)**

In the browser dev console on any component docs page that has screenshots:

```javascript
Array.from(document.querySelectorAll('img')).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)
```

Expected: `[]` (empty — no broken images).

- [ ] **Step 4: TypeScript final check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

---

## Phase 4 — Story Cleanup (after Jim reviews Phase 1 flagged list)

### Task 20: Story cleanup based on flagged list

**Prerequisite:** Jim has reviewed `docs/component-audit-flagged.md` and identified which zero-usage stories to remove. Create the Phase 4 GitHub Issue at this point:

```bash
gh issue create \
  --repo jimsplose/splose-current \
  --title "[storybook-docs] Phase 4: Story Cleanup" \
  --body "## Approved removals
[List the specific stories Jim approved for removal, from component-audit-flagged.md]

## Steps
- Remove each approved story export from the .stories.tsx file
- If all stories for a component are removed, delete the .stories.tsx entirely
- Run: npx tsc --noEmit
- Run: npx build-storybook
- Commit

## Plan
docs/superpowers/plans/2026-04-23-storybook-component-docs.md" \
  --label "from-jim,workflow"
```

- [ ] **Step 1: For each approved removal, delete the story export**

For example, if `AlertDialog.stories.tsx` has a story `ExampleConfirmDestroy` that is never used
in the app, remove that export:

```bash
# Open the file and delete the named export + its render function
# e.g. remove the `export const ExampleConfirmDestroy: Story = { ... }` block
```

- [ ] **Step 2: TypeScript + build check**

```bash
npx tsc --noEmit && npx build-storybook 2>&1 | tail -10
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ds/stories/
git commit -m "chore(storybook): remove approved unused story variants per audit"
```
