# Design Review System — Spec

**Date:** 2026-04-22  
**Status:** Approved for implementation planning  
**Scope:** Collaborative design capture, issue tracking, and designer distribution for the Splose UI replica

---

## 1. Overview

A system that lets Jim and a pilot group of designers capture UI issues and page requests from both the local replica (`localhost:3000`) and the live production site (`acme.splose.com`), synced through GitHub Issues. All captures are visible in the DevNavigator's new Requests panel. Jim is the single source of truth for the design system; designers contribute captures that feed Jim's work queue.

### Goals
- Designers can capture bugs, missing elements, removals, new pages, and multi-step workflows from any surface — replica or production
- All issues land in GitHub Issues on `jimsplose/splose-current`
- Jim can create and triage requests in-app and via Claude Code
- Designers receive a single plugin that sets everything up in one command

### Out of scope
- Real-time push notifications / webhooks
- Designer assignment or project management (use GitHub Issues natively for that)
- Image hosting (screenshots download locally; issue body contains enough context to reproduce)

---

## 2. System Architecture

```
DESIGNER MACHINE  (localhost:3000 or bookmarklet on acme.splose.com)
│
├── Bugshot (enhanced)         — region capture: bug / missing / remove
├── Page Capture (new)         — full page: new-page / workflow session
└── DevNavigator Requests tab  — view / comment / close all issues
        │
        │  HTTP  (POST/GET/PATCH)
        ▼
Next.js API routes  src/app/api/issues/
        │  GITHUB_TOKEN (server-side only — never reaches browser)
        ▼
GitHub Issues  jimsplose/splose-current
        ▲
        │  same API routes
JIM'S MACHINE
├── DevNavigator → + New Request form (NEXT_PUBLIC_IS_AUTHOR=true only)
└── Claude Code  → /new-request skill
```

**Bookmarklet path (acme.splose.com):**  
Bookmarklet injects both tools (Bugshot + Page Capture) into any page. Submissions POST to `https://splose-current.vercel.app/api/issues` (Vercel deployment). GITHUB_TOKEN lives in Vercel env vars — never in the bookmarklet source.

**Token never reaches the browser** in any path. The Next.js API routes act as a proxy.

---

## 3. GitHub Issues Data Model

### Labels (create once, never change names)

| Label | Colour | Meaning |
|---|---|---|
| `bug` | Red `#b91c1c` | Visual defect in the replica |
| `missing` | Blue `#1d4ed8` | Element/component exists in production, absent in replica |
| `remove` | Orange `#92400e` | Something in replica that should not be there |
| `new-page` | Green `#065f46` | Full production page that needs replicating |
| `workflow` | Purple `#4c1d95` | Parent issue grouping a multi-step flow |
| `from-jim` | Violet `#7c3aed` | Created by Jim — authoritative request |
| `minor` | Grey | Severity |
| `moderate` | Yellow | Severity |
| `major` | Red-dark | Severity |

### Issue body format — region capture (bug / missing / remove)

```markdown
**Intent:** missing
**Page:** https://acme.splose.com/calendar
**Source:** production
**Region:** x=340 y=220 w=180 h=60
**Tags:** layout · major
**Description:** Day cell truncates client names beyond 2 lines — no ellipsis

Screenshot: bugshot-2026-04-22-1430.png (downloaded locally)
```

### Issue body format — new-page capture

```markdown
**Intent:** new-page
**URL:** https://acme.splose.com/appointments/new
**Title:** New Appointment | Splose
**Viewport:** 1440×900
**Description:** New appointment form — 3-step wizard

---
### DOM Outline
nav > [logo, menu×5, avatar]
main > form > [
  section#step-date > [h2, DatePicker, TimePicker],
  section#step-client > [h2, SearchInput, ClientCard],
  section#step-confirm > [h2, SummaryTable, PriceBreakdown]
]
footer > [Button(Cancel), Button(Next →)]

### Design Tokens
bg: #ffffff · surface: #f8f9fa · border: #e5e7eb
primary: #2563eb · text: #111827 · text-secondary: #6b7280
font: Inter 14px/1.5 · heading: 20px/700 · label: 12px/600

### Content
h1: "New Appointment"
labels: ["Date", "Time", "Client", "Service", "Notes"]
ctas: ["Cancel", "Next →", "Back", "Confirm booking"]

### Computed Styles Sample
(top 20 visible elements by z-order — JSON attached in comment)

Screenshot: page-capture-2026-04-22-1508.png (downloaded locally)
```

### Workflow parent issue body

```markdown
**Intent:** workflow
**Name:** Create appointment
**Steps:** #24 · #25 · #26
**Description:** Full booking flow from calendar → confirm

Steps:
- #24 Create appointment — Step 1: Date & time picker
- #25 Create appointment — Step 2: Select client
- #26 Create appointment — Step 3: Confirm & pay
```

---

## 4. API Routes  (`src/app/api/issues/`)

All routes read `GITHUB_TOKEN` from `process.env` (server-side). CORS header `Access-Control-Allow-Origin: *` on all routes to support bookmarklet cross-origin POSTs.

> **Security note:** Open CORS means any caller who knows the Vercel URL can create or read issues without authentication. The GITHUB_TOKEN never leaves the server so there is no token exposure, but the endpoint is effectively public. Acceptable for a small internal pilot — add an `X-Plugin-Secret` shared header check before expanding beyond the pilot group.

| Route | Method | Purpose |
|---|---|---|
| `/api/issues` | GET | List open issues. Query params: `labels` (comma-separated), `state` (open/closed/all) |
| `/api/issues` | POST | Create issue. Body: `{ title, body, labels[] }` |
| `/api/issues/[number]` | GET | Fetch single issue with comment thread |
| `/api/issues/[number]/comments` | POST | Add comment. Body: `{ body }` |
| `/api/issues/[number]/close` | POST | Close issue |
| `/api/issues/labels` | GET | List all labels (for filter chip population) |

GitHub REST API base: `https://api.github.com/repos/jimsplose/splose-current`

---

## 5. Enhanced Bugshot  (`src/components/DevNavigator/Bugshot.tsx`)

### Intent selector

The description panel gains an intent selector **before** the description textarea. Three intents for region captures:

- **Bug** (default) — something looks wrong in the replica  
- **Missing** — production has this, replica doesn't  
- **Remove** — replica has this, it shouldn't  

Intent is shown as a segmented control (three buttons, single select). Selection pre-populates the GitHub label.

### Action row (replaces single "Capture" button)

```
[Cancel]  [Copy prompt]  [Submit issue ↑]
```

- **Submit issue** (primary) — captures PNG → downloads locally → POSTs to `/api/issues` → shows toast with issue number → closes
- **Copy prompt** (ghost) — existing clipboard behaviour, unchanged. Prompt text includes the selected intent so the Claude Code recipient has full context.

### Submission payload

```typescript
{
  title: `[${intent}] ${description.slice(0, 72)}`,
  body: formatRegionIssueBody({ intent, pageUrl, region, description, tags }),
  labels: [intent, severityTag].filter(Boolean)
}
```

---

## 6. Page Capture Tool  (`src/components/DevNavigator/PageCapture.tsx`)

New component, rendered alongside Bugshot in the DevNavigator footer. Also injected by the bookmarklet.

### Modes

**New-page mode**
1. Modal opens showing current URL
2. Designer adds a description
3. On submit: auto-captures full payload (see §3), downloads PNG, POSTs single issue with `new-page` label

**Workflow mode**
1. Designer enters workflow name → clicks "Start session"
2. A persistent badge mounts in the top-right corner of the viewport
3. Session state stored in `sessionStorage` — survives navigation within the same tab
4. On each step: designer clicks "Capture step" in badge, adds a step label, full capture runs automatically
5. On "Submit workflow": creates N step issues (sequential), then 1 parent workflow issue referencing all step issue numbers
6. Badge unmounts, sessionStorage cleared

### Full page capture payload collection

Collected client-side at capture time using DOM APIs:

```typescript
async function collectPagePayload(): Promise<PagePayload> {
  return {
    url: window.location.href,
    title: document.title,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    domOutline: buildDomOutline(document.body),   // simplified semantic tree
    tokens: extractDesignTokens(),                  // top 20 elements, computed styles
    content: extractTextContent(),                  // headings, labels, CTAs
    scrollY: window.scrollY,
  };
}
```

`buildDomOutline` walks the DOM, keeping only semantic elements (nav, main, section, form, h1-h4, button, input, label, a). Output is a compact nested string, not raw HTML.

`extractDesignTokens` reads `getComputedStyle` on the top 20 visible elements ordered by z-index + DOM order. Extracts: background-color, color, font-size, font-weight, line-height, padding, margin, border-radius, border-color.

---

## 7. DevNavigator Requests Panel

New "Requests" tab in the DevNavigator, alongside the existing "Pages" tab.

### Tab header
Badge showing count of open issues (fetched on panel open, not polled).

### Filter chips
One chip per label: `all` · `bug` · `missing` · `remove` · `new-page` · `workflow` · `from-jim`. Multi-select. Persisted to `localStorage` key `devnav-requests-filter`.

### Issue list
Each issue renders as a collapsed row: issue number, title truncated, label chips. Click to expand inline.

### Expanded issue view
- Issue body rendered as plain text (no markdown parser needed — body is structured markdown, readable as-is)
- Comment thread below body
- Comment textarea + "Comment" button
- "Close issue" button (ghost destructive)
- Collapse on second click or Escape

### Data fetching
- `GET /api/issues?labels=<filter>&state=open` on tab open
- Optimistic update on comment submit / close — update local state immediately, revert on API error
- No polling; designer manually refreshes by closing and reopening the tab

### Jim-only "+ New Request" button
Shown in the Requests tab footer only when `NEXT_PUBLIC_IS_AUTHOR=true`. Opens the New Request overlay (§8).

---

## 8. Jim's New Request Form

An overlay that opens from the "+ New Request" button. Available in-app only (not in bookmarklet).

### Fields

| Field | Type | Notes |
|---|---|---|
| Title | text input | Required |
| Type | select | page / component / pattern / workflow / other |
| Description | textarea | Required |
| Priority | segmented | minor / moderate / major |
| Labels | auto-populated | `from-jim` + type-derived label always applied |

### Submission
Creates a GitHub Issue via `POST /api/issues` with `from-jim` label + type label + severity label.

---

## 9. Jim's `/new-request` Claude Code Skill

A Superpowers skill that Jim invokes from Claude Code terminal. Faster than in-app for quick requests during a coding session.

**File:** `skills/new-request.md` (in the project's `.claude/` plugin or the main skills repo)

**Behaviour:**
1. Asks for: title, type (page/component/pattern/workflow), description, priority
2. Uses `gh issue create` CLI directly (Jim's machine has `gh` authenticated as `jimsplose`)
3. Applies labels: `from-jim` + type + priority
4. Reports created issue URL

Using `gh` CLI directly (not the API proxy) because Jim's machine has full auth — no bot token needed on Jim's side for his own requests.

---

## 10. Bookmarklet

### Structure
A single self-contained `javascript:` URI. Contains:
- Minified Bugshot widget (region capture: bug / missing / remove)
- Minified Page Capture widget (new-page + workflow session via sessionStorage)
- Both POST to `https://splose-current.vercel.app/api/issues`
- `html-to-image` bundled inline (no CDN fetch — avoids CSP issues)
- CSP fallback: if html-to-image fails, issue is submitted without screenshot (URL + DOM outline still captured)

### Build process
`scripts/build-bookmarklet.mjs` — reads the two widget source files, bundles + minifies, outputs:
- `public/bookmarklet.js` — readable source for debugging
- `public/bookmarklet-uri.txt` — the `javascript:` URI string to copy into Chrome bookmarks

Run via `npm run build:bookmarklet`. Regenerate whenever Bugshot or PageCapture changes.

### Distribution to designers
The plugin setup script prints the bookmarklet URI and instructions for adding it to Chrome bookmarks.

---

## 11. Designer Setup Package

Distributed as a simple folder (zip or private repo). Designers install Claude Code, clone the replica repo, then run one script. No Superpowers required — all capture tools are browser-based UI, not CC skills.

### Package structure

```
splose-review-setup/
├── setup.sh          # one-time setup: writes .env.local, installs deps, prints bookmarklet
└── designer-claude-md.md  # snippet to append to the repo's .claude/CLAUDE.md (optional)
```

### `setup.sh` does
1. Accepts project path as arg (or prompts)
2. Writes `.env.local` with `GITHUB_TOKEN=<bot-token>` (token baked into script at distribution time)
3. Runs `npm install` if `node_modules` absent
4. Prints bookmarklet URI + step-by-step Chrome bookmark instructions
5. Confirms: "Open localhost:3000 — you're ready"

### `designer-claude-md.md`
A short markdown snippet explaining the DevNavigator, Bugshot, Page Capture, and bookmarklet — appended to the repo's `.claude/CLAUDE.md` so Claude Code can answer designer questions like "how do I submit a bug?" without Superpowers or any skill infrastructure.

### What designers do NOT need
- A GitHub account
- `gh` CLI
- Superpowers or any Claude Code plugins
- Any knowledge of the API routes

---

## 12. Environment Variables

| Variable | Where | Value |
|---|---|---|
| `GITHUB_TOKEN` | `.env.local` (all machines) + Vercel env vars | Bot PAT with `repo` scope |
| `NEXT_PUBLIC_IS_AUTHOR` | `.env.local` (Jim's machine only) | `true` |
| `GITHUB_REPO` | `.env.local` (optional override) | `jimsplose/splose-current` |

---

## 13. Implementation Phases

### Phase 1 — API proxy + basic Requests panel (foundation)
- `src/app/api/issues/` routes (list, create, get, comment, close)
- CORS headers
- DevNavigator "Requests" tab: list + filter + expand + comment + close
- `GITHUB_TOKEN` in `.env.local`

### Phase 2 — Enhanced Bugshot (bug / missing / remove)
- Intent selector in description panel
- "Submit issue" + "Copy prompt" action row
- Toast with issue number on success

### Phase 3 — Page Capture tool (new-page + workflow)
- `PageCapture.tsx` component in DevNavigator footer
- `collectPagePayload()` utility
- Workflow session badge + sessionStorage persistence
- Parent + step issue creation

### Phase 4 — Jim's authoring tools
- "+ New Request" overlay (in-app, `NEXT_PUBLIC_IS_AUTHOR` gated)
- `/new-request` CC skill

### Phase 5 — Bookmarklet + designer plugin
- `scripts/build-bookmarklet.mjs`
- Bookmarklet build + URI output
- Designer setup package: `setup.sh` + `designer-claude-md.md`
- `GITHUB_TOKEN` added to Vercel env vars via Vercel dashboard (CORS headers already handled by API routes in Phase 1)

---

## 14. Key Constraints & Decisions

- **CSS Modules** (not Tailwind) — all new components use `.module.css` files matching existing DevNavigator patterns
- **No markdown renderer** — issue bodies are structured plain text, readable without parsing
- **No polling** — Requests panel fetches on open only; designers refresh manually
- **Screenshot is local-only** — PNG downloads to the designer's machine; it is never uploaded. Issue body has enough context (URL + region + DOM outline) to reproduce
- **`gh` CLI for Jim's CC skill** — Jim's machine has `gh` auth; bot token only needed for in-app and bookmarklet flows
- **sessionStorage for workflow** — survives tab navigation, cleared on submit or explicit cancel
