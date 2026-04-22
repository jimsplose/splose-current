# Design Review System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a GitHub Issues-backed design capture and review system: enhanced Bugshot, new Page Capture tool, DevNavigator Requests panel, Jim's authoring tools, a bookmarklet for production captures, and a designer setup package.

**Architecture:** Next.js API routes proxy all GitHub API calls server-side (GITHUB_TOKEN never reaches the browser). Two capture tools (Bugshot for region-level, PageCapture for full-page/workflow) feed a shared GitHub Issues queue visible in a new DevNavigator Requests tab.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, CSS Modules, Vitest + @testing-library/react for tests, esbuild for bookmarklet bundling.

---

## File Map

**New files:**
- `vitest.config.ts` — test runner config
- `src/test/setup.ts` — global test setup
- `src/lib/github-issues.ts` — GitHub REST API client (server-side only)
- `src/lib/github-issues.test.ts` — unit tests
- `src/app/api/issues/route.ts` — GET list + POST create
- `src/app/api/issues/route.test.ts` — route tests
- `src/app/api/issues/[number]/route.ts` — GET single issue + comments
- `src/app/api/issues/[number]/comments/route.ts` — POST comment
- `src/app/api/issues/[number]/close/route.ts` — POST close
- `src/app/api/issues/labels/route.ts` — GET labels
- `src/components/DevNavigator/RequestsPanel.tsx` — Requests tab UI
- `src/components/DevNavigator/RequestsPanel.module.css`
- `src/components/DevNavigator/NewRequestForm.tsx` — Jim-only overlay
- `src/components/DevNavigator/NewRequestForm.module.css`
- `src/components/DevNavigator/page-capture-utils.ts` — DOM/style extraction
- `src/components/DevNavigator/page-capture-utils.test.ts`
- `src/components/DevNavigator/PageCapture.tsx` — new-page + workflow tool
- `src/components/DevNavigator/PageCapture.module.css`
- `src/components/DevNavigator/WorkflowBadge.tsx` — persistent session HUD
- `src/components/DevNavigator/WorkflowBadge.module.css`
- `scripts/create-labels.mjs` — one-time GitHub label setup
- `scripts/build-bookmarklet.mjs` — bookmarklet bundler
- `scripts/bookmarklet-src/widget.js` — self-contained bookmarklet widget source
- `setup/setup.sh` — designer onboarding script
- `setup/designer-claude-md.md` — CLAUDE.md snippet for designers
- `skills/new-request.md` — Jim's CC skill

**Modified files:**
- `package.json` — add vitest, testing-library, esbuild, scripts
- `src/components/DevNavigator/bugshot-utils.ts` — add formatRegionIssueBody, generateIssueTitle
- `src/components/DevNavigator/bugshot-utils.test.ts` — new test file
- `src/components/DevNavigator/Bugshot.tsx` — intent selector + submit issue action
- `src/components/DevNavigator/index.tsx` — Pages/Requests tabs, PageCapture button, NewRequestForm

---

## Task 0: Test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install test dependencies**

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Create vitest config**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    exclude: ['**/node_modules/**', '**/.next/**'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

- [ ] **Step 3: Create test setup**

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Add test script to package.json**

In `package.json` scripts, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify setup works**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx vitest run --reporter=verbose 2>&1 | head -20
```

Expected: `No test files found` (not an error — just no tests yet).

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/test/setup.ts package.json package-lock.json
git commit -m "feat: add Vitest test infrastructure"
```

---

## Task 1: GitHub API client

**Files:**
- Create: `src/lib/github-issues.ts`
- Create: `src/lib/github-issues.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/lib/github-issues.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  listIssues,
  createIssue,
  getIssue,
  getComments,
  addComment,
  closeIssue,
  listLabels,
} from './github-issues';

const MOCK_TOKEN = 'ghp_test123';

beforeEach(() => {
  vi.stubEnv('GITHUB_TOKEN', MOCK_TOKEN);
  vi.stubEnv('GITHUB_REPO', 'jimsplose/splose-current');
  vi.stubGlobal('fetch', vi.fn());
});

describe('listIssues', () => {
  it('fetches open issues with label filter', async () => {
    const mockIssues = [{ number: 1, title: 'Test', body: '', state: 'open', labels: [], created_at: '', updated_at: '', html_url: '' }];
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockIssues,
    });

    const result = await listIssues({ labels: ['bug'], state: 'open' });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/jimsplose/splose-current/issues?state=open&labels=bug&per_page=100',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: `Bearer ${MOCK_TOKEN}` }) })
    );
    expect(result).toEqual(mockIssues);
  });
});

describe('createIssue', () => {
  it('posts issue and returns created issue', async () => {
    const created = { number: 42, title: '[bug] test', body: 'body', state: 'open', labels: [], created_at: '', updated_at: '', html_url: 'https://github.com/issue/42' };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true, json: async () => created });

    const result = await createIssue({ title: '[bug] test', body: 'body', labels: ['bug'] });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/jimsplose/splose-current/issues',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ title: '[bug] test', body: 'body', labels: ['bug'] }) })
    );
    expect(result.number).toBe(42);
  });
});

describe('addComment', () => {
  it('posts a comment to the correct issue', async () => {
    const comment = { id: 1, body: 'hello', created_at: '', user: { login: 'bot' } };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true, json: async () => comment });

    const result = await addComment(42, 'hello');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/jimsplose/splose-current/issues/42/comments',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ body: 'hello' }) })
    );
    expect(result.id).toBe(1);
  });
});

describe('closeIssue', () => {
  it('patches issue state to closed', async () => {
    const closed = { number: 42, state: 'closed' };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: true, json: async () => closed });

    await closeIssue(42);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/jimsplose/splose-current/issues/42',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ state: 'closed' }) })
    );
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run src/lib/github-issues.test.ts 2>&1 | tail -10
```

Expected: `FAIL — Cannot find module './github-issues'`

- [ ] **Step 3: Implement the client**

```typescript
// src/lib/github-issues.ts

export interface GithubLabel {
  name: string;
  color: string;
  description?: string;
}

export interface GithubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: GithubLabel[];
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GithubComment {
  id: number;
  body: string;
  created_at: string;
  user: { login: string };
}

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO ?? 'jimsplose/splose-current';
  if (!token) throw new Error('GITHUB_TOKEN env var is not set');
  return { token, base: `https://api.github.com/repos/${repo}` };
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function ghFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listIssues(opts: {
  labels?: string[];
  state?: 'open' | 'closed' | 'all';
}): Promise<GithubIssue[]> {
  const { token, base } = getConfig();
  const params = new URLSearchParams();
  params.set('state', opts.state ?? 'open');
  if (opts.labels?.length) params.set('labels', opts.labels.join(','));
  params.set('per_page', '100');
  return ghFetch<GithubIssue[]>(`${base}/issues?${params}`, { headers: headers(token) });
}

export async function createIssue(data: {
  title: string;
  body: string;
  labels: string[];
}): Promise<GithubIssue> {
  const { token, base } = getConfig();
  return ghFetch<GithubIssue>(`${base}/issues`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(data),
  });
}

export async function getIssue(number: number): Promise<GithubIssue> {
  const { token, base } = getConfig();
  return ghFetch<GithubIssue>(`${base}/issues/${number}`, { headers: headers(token) });
}

export async function getComments(number: number): Promise<GithubComment[]> {
  const { token, base } = getConfig();
  return ghFetch<GithubComment[]>(`${base}/issues/${number}/comments`, { headers: headers(token) });
}

export async function addComment(number: number, body: string): Promise<GithubComment> {
  const { token, base } = getConfig();
  return ghFetch<GithubComment>(`${base}/issues/${number}/comments`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ body }),
  });
}

export async function closeIssue(number: number): Promise<GithubIssue> {
  const { token, base } = getConfig();
  return ghFetch<GithubIssue>(`${base}/issues/${number}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({ state: 'closed' }),
  });
}

export async function listLabels(): Promise<GithubLabel[]> {
  const { token, base } = getConfig();
  return ghFetch<GithubLabel[]>(`${base}/labels`, { headers: headers(token) });
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run src/lib/github-issues.test.ts 2>&1 | tail -10
```

Expected: `4 passed`

- [ ] **Step 5: Create one-time label setup script**

```javascript
// scripts/create-labels.mjs
// Run once: node scripts/create-labels.mjs
// Requires GITHUB_TOKEN and GITHUB_REPO in env or .env.local

import { readFileSync } from 'fs';

// Load .env.local manually
try {
  const env = readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const [k, v] = line.split('=');
    if (k && v) process.env[k.trim()] = v.trim();
  }
} catch {}

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO ?? 'jimsplose/splose-current';
const BASE = `https://api.github.com/repos/${REPO}`;

const LABELS = [
  { name: 'bug',       color: 'b91c1c', description: 'Visual defect in the replica' },
  { name: 'missing',   color: '1d4ed8', description: 'Element exists in production, absent in replica' },
  { name: 'remove',    color: '92400e', description: 'Something in replica that should not be there' },
  { name: 'new-page',  color: '065f46', description: 'Full production page that needs replicating' },
  { name: 'workflow',  color: '4c1d95', description: 'Parent issue grouping a multi-step flow' },
  { name: 'from-jim',  color: '7c3aed', description: 'Created by Jim — authoritative request' },
  { name: 'minor',     color: '6b7280', description: 'Minor severity' },
  { name: 'moderate',  color: 'd97706', description: 'Moderate severity' },
  { name: 'major',     color: 'dc2626', description: 'Major severity' },
];

const hdrs = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

for (const label of LABELS) {
  const res = await fetch(`${BASE}/labels`, { method: 'POST', headers: hdrs, body: JSON.stringify(label) });
  if (res.status === 422) {
    console.log(`⚠️  Label "${label.name}" already exists — skipping`);
  } else if (res.ok) {
    console.log(`✅  Created label "${label.name}"`);
  } else {
    console.error(`❌  Failed to create "${label.name}": ${res.status}`);
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/github-issues.ts src/lib/github-issues.test.ts scripts/create-labels.mjs
git commit -m "feat: GitHub Issues API client + label setup script"
```

---

## Task 2: API routes — list + create

**Files:**
- Create: `src/app/api/issues/route.ts`
- Create: `src/app/api/issues/route.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/app/api/issues/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/github-issues', () => ({
  listIssues: vi.fn(),
  createIssue: vi.fn(),
}));

import { listIssues, createIssue } from '@/lib/github-issues';
import { GET, POST } from './route';

const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*' };

beforeEach(() => vi.clearAllMocks());

describe('GET /api/issues', () => {
  it('returns issues as JSON with CORS header', async () => {
    const mockIssues = [{ number: 1, title: 'Test', body: '', state: 'open', labels: [], created_at: '', updated_at: '', html_url: '' }];
    (listIssues as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockIssues);

    const req = new NextRequest('http://localhost/api/issues?state=open&labels=bug');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(json).toEqual(mockIssues);
    expect(listIssues).toHaveBeenCalledWith({ state: 'open', labels: ['bug'] });
  });

  it('returns 500 when GitHub client throws', async () => {
    (listIssues as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('GitHub API error 401: Unauthorized'));

    const req = new NextRequest('http://localhost/api/issues');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toMatch(/GitHub API error/);
  });
});

describe('POST /api/issues', () => {
  it('creates an issue and returns 201', async () => {
    const created = { number: 42, title: '[bug] test', body: 'body', state: 'open', labels: [], created_at: '', updated_at: '', html_url: '' };
    (createIssue as ReturnType<typeof vi.fn>).mockResolvedValueOnce(created);

    const req = new NextRequest('http://localhost/api/issues', {
      method: 'POST',
      body: JSON.stringify({ title: '[bug] test', body: 'body', labels: ['bug'] }),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    const json = await res.json();
    expect(json.number).toBe(42);
  });

  it('returns 400 when title or body is missing', async () => {
    const req = new NextRequest('http://localhost/api/issues', {
      method: 'POST',
      body: JSON.stringify({ title: '', body: 'body', labels: [] }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run src/app/api/issues/route.test.ts 2>&1 | tail -10
```

Expected: `FAIL — Cannot find module './route'`

- [ ] **Step 3: Implement the route**

```typescript
// src/app/api/issues/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listIssues, createIssue } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';

const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = (searchParams.get('state') ?? 'open') as 'open' | 'closed' | 'all';
    const labelsParam = searchParams.get('labels');
    const labels = labelsParam ? labelsParam.split(',').filter(Boolean) : undefined;
    const issues = await listIssues({ state, labels });
    return NextResponse.json(issues, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { title?: string; body?: string; labels?: string[] };
    if (!body.title?.trim() || !body.body?.trim()) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400, headers: CORS });
    }
    const issue = await createIssue({ title: body.title, body: body.body, labels: body.labels ?? [] });
    return NextResponse.json(issue, { status: 201, headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run src/app/api/issues/route.test.ts 2>&1 | tail -10
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/issues/route.ts src/app/api/issues/route.test.ts
git commit -m "feat: GET/POST /api/issues route with CORS"
```

---

## Task 3: Remaining API routes

**Files:**
- Create: `src/app/api/issues/[number]/route.ts`
- Create: `src/app/api/issues/[number]/comments/route.ts`
- Create: `src/app/api/issues/[number]/close/route.ts`
- Create: `src/app/api/issues/labels/route.ts`

- [ ] **Step 1: Single issue route**

```typescript
// src/app/api/issues/[number]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIssue, getComments } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { number } = await params;
    const num = parseInt(number, 10);
    const [issue, comments] = await Promise.all([getIssue(num), getComments(num)]);
    return NextResponse.json({ issue, comments }, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
```

- [ ] **Step 2: Add comment route**

```typescript
// src/app/api/issues/[number]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { number } = await params;
    const num = parseInt(number, 10);
    const { body } = await req.json() as { body?: string };
    if (!body?.trim()) {
      return NextResponse.json({ error: 'body is required' }, { status: 400, headers: CORS });
    }
    const comment = await addComment(num, body);
    return NextResponse.json(comment, { status: 201, headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
```

- [ ] **Step 3: Close issue route**

```typescript
// src/app/api/issues/[number]/close/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { closeIssue } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { number } = await params;
    const issue = await closeIssue(parseInt(number, 10));
    return NextResponse.json(issue, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
```

- [ ] **Step 4: Labels route**

```typescript
// src/app/api/issues/labels/route.ts
import { NextResponse } from 'next/server';
import { listLabels } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function GET() {
  try {
    const labels = await listLabels();
    return NextResponse.json(labels, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
```

- [ ] **Step 5: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/issues/
git commit -m "feat: add remaining issues API routes (single, comments, close, labels)"
```

---

## Task 4: DevNavigator tab structure

**Files:**
- Modify: `src/components/DevNavigator/index.tsx`

The DevNavigator currently has a single panel (search + page tree + quick links). Add a `Pages` / `Requests` tab switcher at the top of the panel. The page tree and quick links stay under `Pages`. The Requests tab renders `<RequestsPanel />` (built in Task 5).

- [ ] **Step 1: Add tab state and switcher to DevNavigator**

In `src/components/DevNavigator/index.tsx`, make these changes:

Add `activeTab` state after the existing state declarations:
```typescript
const [activeTab, setActiveTab] = useState<'pages' | 'requests'>('pages');
```

Replace the panel's header section with a header + tab bar. Locate the existing `{/* Header */}` block and replace it:

```tsx
{/* Header */}
<div className={styles.header}>
  <div className={styles.headerLeft}>
    <span className="text-heading-sm">Dev Navigator</span>
  </div>
  <button onClick={() => setExpanded(false)} className={styles.closeBtn}>
    <CloseOutlined style={{ fontSize: 16 }} />
  </button>
</div>

{/* Tabs */}
<div className={styles.tabBar}>
  <button
    className={`${styles.tabBtn} ${activeTab === 'pages' ? styles.tabBtnActive : ''} text-caption-sm`}
    onClick={() => setActiveTab('pages')}
  >
    Pages
    <span className={styles.tabBadge}>{pages}</span>
  </button>
  <button
    className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.tabBtnActive : ''} text-caption-sm`}
    onClick={() => setActiveTab('requests')}
  >
    Requests
  </button>
</div>
```

Wrap the search + page tree + quick links in `{activeTab === 'pages' && (...)}` and add `{activeTab === 'requests' && <RequestsPanel />}` after.

Add `import RequestsPanel from './RequestsPanel';` at the top (stub file is fine for now — created in Task 5).

- [ ] **Step 2: Add tab styles to DevNavigator.module.css**

```css
/* Tabs */
.tabBar {
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tabBtn {
  flex: 1;
  padding: 8px 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}

.tabBtnActive {
  color: #fff;
  border-bottom-color: #7c3aed;
}

.tabBadge {
  font-size: 10px;
  background: rgba(124, 58, 237, 0.8);
  border-radius: 9999px;
  padding: 1px 6px;
  color: #fff;
}
```

- [ ] **Step 3: Create stub RequestsPanel so the app builds**

```typescript
// src/components/DevNavigator/RequestsPanel.tsx
"use client";
export default function RequestsPanel() {
  return <div style={{ padding: 16, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Requests panel — coming soon</div>;
}
```

- [ ] **Step 4: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/DevNavigator/index.tsx src/components/DevNavigator/DevNavigator.module.css src/components/DevNavigator/RequestsPanel.tsx
git commit -m "feat: add Pages/Requests tab switcher to DevNavigator"
```

---

## Task 5: RequestsPanel component

**Files:**
- Modify: `src/components/DevNavigator/RequestsPanel.tsx` (replace stub)
- Create: `src/components/DevNavigator/RequestsPanel.module.css`

- [ ] **Step 1: Create styles**

```css
/* src/components/DevNavigator/RequestsPanel.module.css */

.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.filterRow {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chip {
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.1s;
}

.chipActive {
  background: rgba(124, 58, 237, 0.3);
  border-color: #7c3aed;
  color: #e9d5ff;
}

.issueList {
  flex: 1;
  overflow-y: auto;
}

.issueRow {
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
}

.issueHeader {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
}

.issueChevron {
  color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
  margin-top: 2px;
  flex-shrink: 0;
}

.issueTitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.issueMeta {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.label {
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 8px;
}

.issueBody {
  padding: 0 12px 10px 24px;
}

.bodyText {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  max-height: 160px;
  overflow-y: auto;
}

.comment {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
}

.commentUser {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.commentTextarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  font-size: 10px;
  padding: 6px;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 6px;
}

.actionRow {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.btnGhost {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  padding: 4px 10px;
  cursor: pointer;
}

.btnPrimary {
  background: #7c3aed;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 10px;
  padding: 4px 10px;
  cursor: pointer;
}

.btnDestructive {
  background: rgba(185, 28, 28, 0.3);
  border: 1px solid rgba(185, 28, 28, 0.5);
  border-radius: 4px;
  color: #fca5a5;
  font-size: 10px;
  padding: 4px 10px;
  cursor: pointer;
}

.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.empty {
  padding: 24px 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
}

.error {
  padding: 12px;
  font-size: 10px;
  color: #fca5a5;
}

.loading {
  padding: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 11px;
}
```

- [ ] **Step 2: Implement RequestsPanel**

```typescript
// src/components/DevNavigator/RequestsPanel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./RequestsPanel.module.css";

interface GithubLabel { name: string; color: string; }
interface GithubComment { id: number; body: string; created_at: string; user: { login: string }; }
interface GithubIssue {
  number: number; title: string; body: string;
  state: string; labels: GithubLabel[]; html_url: string;
}

const FILTER_LABELS = ['bug', 'missing', 'remove', 'new-page', 'workflow', 'from-jim'];

const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  bug:       { bg: 'rgba(185,28,28,0.4)',  text: '#fca5a5' },
  missing:   { bg: 'rgba(29,78,216,0.4)',  text: '#bfdbfe' },
  remove:    { bg: 'rgba(146,64,14,0.4)',  text: '#fde68a' },
  'new-page':{ bg: 'rgba(6,95,70,0.4)',    text: '#6ee7b7' },
  workflow:  { bg: 'rgba(76,29,149,0.4)',  text: '#c4b5fd' },
  'from-jim':{ bg: 'rgba(124,58,237,0.4)','text': '#e9d5ff' },
  minor:     { bg: 'rgba(107,114,128,0.4)','text': '#d1d5db' },
  moderate:  { bg: 'rgba(217,119,6,0.4)', text: '#fde68a' },
  major:     { bg: 'rgba(220,38,38,0.4)', text: '#fca5a5' },
};

const STORAGE_KEY = 'devnav-requests-filter';
const IS_AUTHOR = process.env.NEXT_PUBLIC_IS_AUTHOR === 'true';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export default function RequestsPanel({ onNewRequest }: { onNewRequest?: () => void }) {
  const [issues, setIssues] = useState<GithubIssue[]>([]);
  const [comments, setComments] = useState<Record<number, GithubComment[]>>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
  });
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({});

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ state: 'open' });
      if (activeFilters.length) params.set('labels', activeFilters.join(','));
      const res = await fetch(`/api/issues?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setIssues(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const fetchComments = async (number: number) => {
    if (comments[number]) return;
    try {
      const res = await fetch(`/api/issues/${number}`);
      if (!res.ok) return;
      const data = await res.json();
      setComments(prev => ({ ...prev, [number]: data.comments }));
    } catch {}
  };

  const toggleExpand = (number: number) => {
    if (expanded === number) { setExpanded(null); return; }
    setExpanded(number);
    fetchComments(number);
  };

  const toggleFilter = (label: string) => {
    setActiveFilters(prev => {
      const next = prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const submitComment = async (number: number) => {
    const body = commentDraft[number]?.trim();
    if (!body) return;
    setSubmitting(prev => ({ ...prev, [number]: true }));
    // Optimistic update
    const optimistic: GithubComment = { id: Date.now(), body, created_at: new Date().toISOString(), user: { login: 'you' } };
    setComments(prev => ({ ...prev, [number]: [...(prev[number] ?? []), optimistic] }));
    setCommentDraft(prev => ({ ...prev, [number]: '' }));
    try {
      const res = await fetch(`/api/issues/${number}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const real: GithubComment = await res.json();
      setComments(prev => ({ ...prev, [number]: [...(prev[number] ?? []).filter(c => c.id !== optimistic.id), real] }));
    } catch {
      // Revert optimistic
      setComments(prev => ({ ...prev, [number]: (prev[number] ?? []).filter(c => c.id !== optimistic.id) }));
      setCommentDraft(prev => ({ ...prev, [number]: body }));
    } finally {
      setSubmitting(prev => ({ ...prev, [number]: false }));
    }
  };

  const closeIssue = async (number: number) => {
    // Optimistic removal
    setIssues(prev => prev.filter(i => i.number !== number));
    if (expanded === number) setExpanded(null);
    try {
      const res = await fetch(`/api/issues/${number}/close`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Revert — re-fetch
      fetchIssues();
    }
  };

  return (
    <div className={styles.panel}>
      {/* Filter chips */}
      <div className={styles.filterRow}>
        {FILTER_LABELS.map(label => (
          <button
            key={label}
            onClick={() => toggleFilter(label)}
            className={`${styles.chip} ${activeFilters.includes(label) ? styles.chipActive : ''} text-caption-sm`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Issue list */}
      <div className={styles.issueList}>
        {loading && <div className={styles.loading}>Loading…</div>}
        {error && <div className={styles.error}>Error: {error} <button className={styles.btnGhost} onClick={fetchIssues} style={{marginLeft:4}}>Retry</button></div>}
        {!loading && !error && issues.length === 0 && <div className={styles.empty}>No open issues{activeFilters.length ? ' matching filters' : ''}.</div>}
        {issues.map(issue => (
          <div key={issue.number} className={styles.issueRow}>
            <div className={styles.issueHeader} onClick={() => toggleExpand(issue.number)}>
              <span className={styles.issueChevron}>{expanded === issue.number ? '▼' : '▶'}</span>
              <div>
                <div className={styles.issueTitle}>#{issue.number} {issue.title}</div>
                <div className={styles.issueMeta}>
                  {issue.labels.map(l => {
                    const c = LABEL_COLORS[l.name];
                    return (
                      <span key={l.name} className={styles.label}
                        style={c ? { background: c.bg, color: c.text } : { background: '#3f3f46', color: '#a1a1aa' }}>
                        {l.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {expanded === issue.number && (
              <div className={styles.issueBody}>
                <pre className={styles.bodyText}>{issue.body}</pre>
                {(comments[issue.number] ?? []).map(c => (
                  <div key={c.id} className={styles.comment}>
                    💬 <span className={styles.commentUser}>{c.user.login}</span> · {formatDate(c.created_at)} — {c.body}
                  </div>
                ))}
                <textarea
                  className={styles.commentTextarea}
                  placeholder="Add a comment…"
                  rows={2}
                  value={commentDraft[issue.number] ?? ''}
                  onChange={e => setCommentDraft(prev => ({ ...prev, [issue.number]: e.target.value }))}
                />
                <div className={styles.actionRow}>
                  <button className={styles.btnDestructive} onClick={() => closeIssue(issue.number)}>Close issue</button>
                  <button
                    className={styles.btnPrimary}
                    disabled={!commentDraft[issue.number]?.trim() || submitting[issue.number]}
                    onClick={() => submitComment(issue.number)}
                  >
                    {submitting[issue.number] ? 'Posting…' : 'Comment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {IS_AUTHOR && onNewRequest && (
          <button className={styles.btnPrimary} onClick={onNewRequest}>+ New Request</button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire onNewRequest into DevNavigator index**

In `src/components/DevNavigator/index.tsx`, add `newRequestOpen` state and pass handler to `RequestsPanel`:
```typescript
const [newRequestOpen, setNewRequestOpen] = useState(false);
// ...
{activeTab === 'requests' && <RequestsPanel onNewRequest={() => setNewRequestOpen(true)} />}
```

- [ ] **Step 4: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/components/DevNavigator/RequestsPanel.tsx src/components/DevNavigator/RequestsPanel.module.css src/components/DevNavigator/index.tsx
git commit -m "feat: RequestsPanel with filter chips, inline expand, comment + close"
```

---

## Task 6: Enhanced Bugshot utilities

**Files:**
- Modify: `src/components/DevNavigator/bugshot-utils.ts`
- Create: `src/components/DevNavigator/bugshot-utils.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/components/DevNavigator/bugshot-utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatRegionIssueBody, generateIssueTitle } from './bugshot-utils';

describe('generateIssueTitle', () => {
  it('prefixes with intent and truncates to 80 chars', () => {
    const long = 'A'.repeat(100);
    const title = generateIssueTitle('bug', long);
    expect(title.startsWith('[bug]')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(85);
  });

  it('includes full short description', () => {
    expect(generateIssueTitle('missing', 'Button missing')).toBe('[missing] Button missing');
  });
});

describe('formatRegionIssueBody', () => {
  it('includes all required fields', () => {
    const body = formatRegionIssueBody({
      intent: 'bug',
      pageUrl: 'http://localhost:3000/calendar',
      region: { x: 10, y: 20, width: 100, height: 50 },
      description: 'Colours are wrong',
      tags: ['color', 'major'],
      filename: 'bugshot-calendar-20260422.png',
    });
    expect(body).toContain('**Intent:** bug');
    expect(body).toContain('**Page:** http://localhost:3000/calendar');
    expect(body).toContain('x=10 y=20 w=100 h=50');
    expect(body).toContain('color · major');
    expect(body).toContain('Colours are wrong');
    expect(body).toContain('bugshot-calendar-20260422.png');
  });

  it('handles empty tags gracefully', () => {
    const body = formatRegionIssueBody({
      intent: 'remove',
      pageUrl: 'http://localhost/settings',
      region: { x: 0, y: 0, width: 50, height: 50 },
      description: 'Remove this widget',
      tags: [],
      filename: 'bugshot.png',
    });
    expect(body).toContain('**Tags:** —');
  });
});
```

- [ ] **Step 2: Run — verify fail**

```bash
npx vitest run src/components/DevNavigator/bugshot-utils.test.ts 2>&1 | tail -5
```

Expected: `FAIL — formatRegionIssueBody is not exported`

- [ ] **Step 3: Add exports to bugshot-utils.ts**

Append to the end of `src/components/DevNavigator/bugshot-utils.ts`:

```typescript
export type CaptureIntent = 'bug' | 'missing' | 'remove';

export function generateIssueTitle(intent: CaptureIntent, description: string): string {
  const prefix = `[${intent}] `;
  const truncated = description.slice(0, 80 - prefix.length);
  return `${prefix}${truncated}`;
}

export function formatRegionIssueBody(opts: {
  intent: CaptureIntent;
  pageUrl: string;
  region: Region;
  description: string;
  tags: string[];
  filename: string;
}): string {
  const { intent, pageUrl, region, description, tags, filename } = opts;
  const source = pageUrl.includes('localhost') ? 'replica' : 'production';
  const tagsStr = tags.length ? tags.join(' · ') : '—';
  return [
    `**Intent:** ${intent}`,
    `**Page:** ${pageUrl}`,
    `**Source:** ${source}`,
    `**Region:** x=${Math.round(region.x)} y=${Math.round(region.y)} w=${Math.round(region.width)} h=${Math.round(region.height)}`,
    `**Tags:** ${tagsStr}`,
    `**Description:** ${description}`,
    ``,
    `Screenshot: ${filename} (downloaded locally)`,
  ].join('\n');
}
```

Also update `generatePrompt` to accept and include intent. Locate the `generatePrompt` function signature and add `intent?: string` to its `opts` parameter, then prepend `Intent: ${opts.intent ?? 'bug'}\n\n` to the returned string.

- [ ] **Step 4: Run — verify pass**

```bash
npx vitest run src/components/DevNavigator/bugshot-utils.test.ts 2>&1 | tail -5
```

Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/DevNavigator/bugshot-utils.ts src/components/DevNavigator/bugshot-utils.test.ts
git commit -m "feat: add formatRegionIssueBody and generateIssueTitle to bugshot-utils"
```

---

## Task 7: Enhanced Bugshot component

**Files:**
- Modify: `src/components/DevNavigator/Bugshot.tsx`

- [ ] **Step 1: Add intent state and selector to the describing panel**

At the top of `Bugshot.tsx`, add the import and type:
```typescript
import { type CaptureIntent, generateIssueTitle, formatRegionIssueBody } from './bugshot-utils';
```

Add state after existing state declarations:
```typescript
const [intent, setIntent] = useState<CaptureIntent>('bug');
const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
const [issueNumber, setIssueNumber] = useState<number | null>(null);
```

- [ ] **Step 2: Add intent selector to the description panel JSX**

Inside the `{state === 'describing' && region && (...)}` block, add the intent selector **before** the textarea:

```tsx
{/* Intent selector */}
<div className={styles.intentRow}>
  {(['bug', 'missing', 'remove'] as CaptureIntent[]).map((i) => (
    <button
      key={i}
      onClick={(e) => { e.stopPropagation(); setIntent(i); }}
      className={`${styles.intentBtn} ${intent === i ? styles.intentBtnActive : ''} text-label-lg`}
    >
      {i}
    </button>
  ))}
</div>
```

- [ ] **Step 3: Replace the single Capture button with two action buttons**

Find the existing action row with the single "Capture" button and replace it:

```tsx
<div className={styles.actionRow}>
  <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={handleCapture}
    disabled={!description.trim()}
  >
    Copy prompt
  </Button>
  <Button
    variant="primary"
    size="sm"
    onClick={handleSubmitIssue}
    disabled={!description.trim() || submitState === 'submitting'}
  >
    {submitState === 'submitting' ? 'Submitting…' : '⬆ Submit issue'}
  </Button>
</div>
```

- [ ] **Step 4: Add handleSubmitIssue function**

Add this function before `handleCapture`:

```typescript
const handleSubmitIssue = async () => {
  if (!region) return;
  setSubmitState('submitting');

  // Hide UI for screenshot
  if (overlayRef.current) overlayRef.current.style.display = 'none';
  if (devNavRef.current) devNavRef.current.style.display = 'none';

  try {
    const { toBlob } = await import('html-to-image');
    const blob = await toBlob(document.body, { pixelRatio: 1 });
    if (blob) {
      // Crop and download PNG
      const img = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = region.width;
      canvas.height = region.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, region.x + window.scrollX, region.y + window.scrollY, region.width, region.height, 0, 0, region.width, region.height);
      const croppedBlob = await new Promise<Blob>((res, rej) => canvas.toBlob(b => b ? res(b) : rej(new Error('crop failed')), 'image/png'));
      const filename = generateFilename();
      downloadBlob(croppedBlob, filename);

      // Post to GitHub via API route
      const allTags = [...categoryTags, ...(severityTag ? [severityTag] : [])];
      const body = formatRegionIssueBody({ intent, pageUrl: window.location.href, region, description, tags: allTags, filename });
      const title = generateIssueTitle(intent, description);
      const apiBase = window.location.hostname === 'localhost' ? '' : 'https://splose-current.vercel.app';
      const res = await fetch(`${apiBase}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, labels: [intent, ...(severityTag ? [severityTag] : [])] }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const issue = await res.json();
      setIssueNumber(issue.number);
    }
  } catch (err) {
    setErrorMessage(err instanceof Error ? err.message : 'Submit failed');
    setState('error');
  } finally {
    if (overlayRef.current) overlayRef.current.style.display = '';
    if (devNavRef.current) devNavRef.current.style.display = '';
  }

  setSubmitState('done');
  setToastVisible(true);
  setTimeout(() => { setToastVisible(false); onClose(); }, 2500);
};
```

- [ ] **Step 5: Update success toast text**

Find `setState("done")` and the toast JSX. Update the toast message to:
```tsx
{toastVisible && (
  <div className={`${styles.toast} text-body-md`} style={{ color: '#fff' }}>
    {issueNumber ? `Issue #${issueNumber} created · PNG downloaded` : 'Bugshot copied to clipboard + screenshot downloaded'}
  </div>
)}
```

- [ ] **Step 6: Add intent styles to Bugshot.module.css**

```css
.intentRow {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.intentBtn {
  flex: 1;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 11px;
  transition: all 0.1s;
}

.intentBtnActive {
  background: rgba(124, 58, 237, 0.3);
  border-color: #7c3aed;
  color: #e9d5ff;
}
```

- [ ] **Step 7: Build and type check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 8: Commit**

```bash
git add src/components/DevNavigator/Bugshot.tsx src/components/DevNavigator/Bugshot.module.css
git commit -m "feat: enhanced Bugshot with intent selector and Submit Issue action"
```

---

## Task 8: Page capture utilities

**Files:**
- Create: `src/components/DevNavigator/page-capture-utils.ts`
- Create: `src/components/DevNavigator/page-capture-utils.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// src/components/DevNavigator/page-capture-utils.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildDomOutline, extractTextContent, formatNewPageBody, formatWorkflowParentBody } from './page-capture-utils';

// jsdom provides a real DOM
describe('buildDomOutline', () => {
  it('returns compact semantic outline', () => {
    document.body.innerHTML = '<nav><a href="/">Home</a></nav><main><h1>Title</h1><button>Click</button></main>';
    const outline = buildDomOutline(document.body);
    expect(outline).toContain('nav');
    expect(outline).toContain('main');
    expect(outline).toContain('h1');
    expect(outline).toContain('button');
    // Should not contain raw class noise
    expect(outline.length).toBeLessThan(500);
  });

  it('skips script and style tags', () => {
    document.body.innerHTML = '<script>alert(1)</script><main><h1>Hi</h1></main>';
    const outline = buildDomOutline(document.body);
    expect(outline).not.toContain('script');
    expect(outline).toContain('h1');
  });
});

describe('extractTextContent', () => {
  it('captures headings, labels, and buttons', () => {
    document.body.innerHTML = '<h1>Dashboard</h1><label>Client name</label><button>Save</button>';
    const content = extractTextContent();
    expect(content.headings).toContain('Dashboard');
    expect(content.labels).toContain('Client name');
    expect(content.ctas).toContain('Save');
  });
});

describe('formatNewPageBody', () => {
  it('includes all required sections', () => {
    const body = formatNewPageBody({
      url: 'https://acme.splose.com/appointments/new',
      title: 'New Appointment',
      viewport: { width: 1440, height: 900 },
      description: 'Booking form',
      domOutline: 'nav > main > form',
      tokens: 'bg: #fff',
      content: { headings: ['New Appointment'], labels: ['Date'], ctas: ['Next'] },
      filename: 'page-capture-20260422.png',
    });
    expect(body).toContain('**Intent:** new-page');
    expect(body).toContain('acme.splose.com/appointments/new');
    expect(body).toContain('### DOM Outline');
    expect(body).toContain('### Design Tokens');
    expect(body).toContain('### Content');
    expect(body).toContain('page-capture-20260422.png');
  });
});

describe('formatWorkflowParentBody', () => {
  it('lists all step issue numbers', () => {
    const body = formatWorkflowParentBody({ name: 'Create appt', description: 'Full flow', stepIssues: [{ number: 10, stepLabel: 'Step 1' }, { number: 11, stepLabel: 'Step 2' }] });
    expect(body).toContain('**Intent:** workflow');
    expect(body).toContain('#10');
    expect(body).toContain('#11');
  });
});
```

- [ ] **Step 2: Run — verify fail**

```bash
npx vitest run src/components/DevNavigator/page-capture-utils.test.ts 2>&1 | tail -5
```

Expected: `FAIL — Cannot find module`

- [ ] **Step 3: Implement page-capture-utils.ts**

```typescript
// src/components/DevNavigator/page-capture-utils.ts

const SEMANTIC_TAGS = new Set(['nav','main','section','article','aside','header','footer','form','h1','h2','h3','h4','button','input','select','textarea','label','a','ul','ol','li','table','figure']);
const SKIP_TAGS = new Set(['SCRIPT','STYLE','LINK','META','NOSCRIPT','SVG','PATH','DEFS']);
const MAX_DEPTH = 6;

export function buildDomOutline(root: Element, depth = 0): string {
  if (depth > MAX_DEPTH) return '';
  const lines: string[] = [];
  for (const child of Array.from(root.children)) {
    if (SKIP_TAGS.has(child.tagName)) continue;
    const tag = child.tagName.toLowerCase();
    if (!SEMANTIC_TAGS.has(tag)) {
      const nested = buildDomOutline(child, depth + 1);
      if (nested) lines.push(nested);
      continue;
    }
    const id = child.id ? `#${child.id}` : '';
    const children = buildDomOutline(child, depth + 1);
    const indent = '  '.repeat(depth);
    if (children) {
      lines.push(`${indent}${tag}${id} > [\n${children}\n${indent}]`);
    } else {
      lines.push(`${indent}${tag}${id}`);
    }
  }
  return lines.join('\n');
}

export interface TextContent {
  headings: string[];
  labels: string[];
  ctas: string[];
}

export function extractTextContent(): TextContent {
  const text = (sel: string) =>
    Array.from(document.querySelectorAll(sel))
      .map(el => el.textContent?.trim() ?? '')
      .filter(Boolean)
      .slice(0, 10);

  return {
    headings: text('h1, h2, h3, h4'),
    labels: text('label'),
    ctas: text('button, a[href], input[type="submit"]'),
  };
}

export interface DesignTokenSample {
  tag: string;
  bg: string;
  color: string;
  fontSize: string;
  fontWeight: string;
  borderRadius: string;
}

export function extractDesignTokens(): string {
  const elements = Array.from(document.querySelectorAll('body *'))
    .filter(el => el instanceof HTMLElement)
    .slice(0, 20) as HTMLElement[];

  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const el of elements) {
    const cs = window.getComputedStyle(el);
    const key = `${cs.backgroundColor}|${cs.color}|${cs.fontSize}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tokens.push(`${el.tagName.toLowerCase()}: bg=${cs.backgroundColor} color=${cs.color} font=${cs.fontSize}/${cs.fontWeight}`);
  }
  return tokens.join('\n');
}

export interface PagePayload {
  url: string;
  title: string;
  viewport: { width: number; height: number };
  domOutline: string;
  tokens: string;
  content: TextContent;
}

export async function collectPagePayload(): Promise<PagePayload> {
  return {
    url: window.location.href,
    title: document.title,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    domOutline: buildDomOutline(document.body),
    tokens: extractDesignTokens(),
    content: extractTextContent(),
  };
}

export function formatNewPageBody(opts: {
  url: string; title: string; viewport: { width: number; height: number };
  description: string; domOutline: string; tokens: string;
  content: TextContent; filename: string;
}): string {
  const { url, title, viewport, description, domOutline, tokens, content, filename } = opts;
  return [
    `**Intent:** new-page`,
    `**URL:** ${url}`,
    `**Title:** ${title}`,
    `**Viewport:** ${viewport.width}×${viewport.height}`,
    `**Description:** ${description}`,
    ``,
    `### DOM Outline`,
    domOutline,
    ``,
    `### Design Tokens`,
    tokens,
    ``,
    `### Content`,
    `headings: ${JSON.stringify(content.headings)}`,
    `labels: ${JSON.stringify(content.labels)}`,
    `ctas: ${JSON.stringify(content.ctas)}`,
    ``,
    `Screenshot: ${filename} (downloaded locally)`,
  ].join('\n');
}

export function formatWorkflowParentBody(opts: {
  name: string; description: string;
  stepIssues: Array<{ number: number; stepLabel: string }>;
}): string {
  const { name, description, stepIssues } = opts;
  const refs = stepIssues.map(s => `#${s.number}`).join(' · ');
  const steps = stepIssues.map(s => `- #${s.number} ${name} — ${s.stepLabel}`).join('\n');
  return [
    `**Intent:** workflow`,
    `**Name:** ${name}`,
    `**Steps:** ${refs}`,
    `**Description:** ${description}`,
    ``,
    `Steps:`,
    steps,
  ].join('\n');
}

export function generatePageCaptureFilename(): string {
  const route = window.location.pathname.replace(/^\//, '').replace(/\//g, '-') || 'root';
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `page-capture-${route}-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.png`;
}
```

- [ ] **Step 4: Run — verify pass**

```bash
npx vitest run src/components/DevNavigator/page-capture-utils.test.ts 2>&1 | tail -5
```

Expected: `8 passed`

- [ ] **Step 5: Commit**

```bash
git add src/components/DevNavigator/page-capture-utils.ts src/components/DevNavigator/page-capture-utils.test.ts
git commit -m "feat: page capture utilities (DOM outline, tokens, formatters)"
```

---

## Task 9: PageCapture + WorkflowBadge components

**Files:**
- Create: `src/components/DevNavigator/PageCapture.tsx`
- Create: `src/components/DevNavigator/PageCapture.module.css`
- Create: `src/components/DevNavigator/WorkflowBadge.tsx`
- Create: `src/components/DevNavigator/WorkflowBadge.module.css`

- [ ] **Step 1: WorkflowBadge styles**

```css
/* src/components/DevNavigator/WorkflowBadge.module.css */
.badge {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  background: rgba(76, 29, 149, 0.95);
  border: 1px solid #7c3aed;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
  backdrop-filter: blur(4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.badgeHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.stepCount {
  font-size: 10px;
  color: #c4b5fd;
}

.labelInput {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  color: #fff;
  font-size: 10px;
  padding: 4px 6px;
  width: 100%;
  box-sizing: border-box;
}

.badgeActions {
  display: flex;
  gap: 6px;
}

.btnCapture {
  flex: 1;
  background: #7c3aed;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 10px;
  padding: 5px 8px;
  cursor: pointer;
}

.btnSubmit {
  flex: 1;
  background: #065f46;
  border: none;
  border-radius: 4px;
  color: #6ee7b7;
  font-size: 10px;
  padding: 5px 8px;
  cursor: pointer;
}

.btnCancel {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  color: rgba(255,255,255,0.6);
  font-size: 10px;
  padding: 5px 8px;
  cursor: pointer;
}
```

- [ ] **Step 2: WorkflowBadge component**

```typescript
// src/components/DevNavigator/WorkflowBadge.tsx
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { collectPagePayload, generatePageCaptureFilename, formatNewPageBody } from "./page-capture-utils";
import { downloadBlob } from "./bugshot-utils";
import styles from "./WorkflowBadge.module.css";

const SESSION_KEY = 'devnav-workflow-session';
const VERCEL_URL = 'https://splose-current.vercel.app';

export interface WorkflowStep {
  stepLabel: string;
  issueNumber?: number;
}

export interface WorkflowSession {
  name: string;
  steps: WorkflowStep[];
}

interface WorkflowBadgeProps {
  session: WorkflowSession;
  onUpdate: (session: WorkflowSession) => void;
  onComplete: () => void;
  onCancel: () => void;
}

export default function WorkflowBadge({ session, onUpdate, onComplete, onCancel }: WorkflowBadgeProps) {
  const [stepLabel, setStepLabel] = useState(`Step ${session.steps.length + 1}`);
  const [capturing, setCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const captureStep = async () => {
    setCapturing(true);
    try {
      const payload = await collectPagePayload();
      const filename = generatePageCaptureFilename();
      const apiBase = window.location.hostname === 'localhost' ? '' : VERCEL_URL;

      // Screenshot
      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(document.body, { pixelRatio: 1 }).catch(() => null);
      if (blob) downloadBlob(blob, filename);

      const body = formatNewPageBody({ ...payload, description: `${session.name} — ${stepLabel}`, filename });
      const title = `${session.name} — ${stepLabel}`;

      const res = await fetch(`${apiBase}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, labels: ['new-page', 'workflow'] }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const issue = await res.json();

      const updatedSteps = [...session.steps, { stepLabel, issueNumber: issue.number }];
      const updated = { ...session, steps: updatedSteps };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      onUpdate(updated);
      setStepLabel(`Step ${updatedSteps.length + 1}`);
    } catch (e) {
      alert(`Capture failed: ${e}`);
    } finally {
      setCapturing(false);
    }
  };

  const submitWorkflow = async () => {
    if (session.steps.length === 0) { alert('Capture at least one step first.'); return; }
    setSubmitting(true);
    try {
      const apiBase = window.location.hostname === 'localhost' ? '' : VERCEL_URL;
      const stepIssues = session.steps
        .filter(s => s.issueNumber)
        .map(s => ({ number: s.issueNumber!, stepLabel: s.stepLabel }));

      const { formatWorkflowParentBody } = await import('./page-capture-utils');
      const body = formatWorkflowParentBody({ name: session.name, description: `Workflow: ${session.name}`, stepIssues });
      await fetch(`${apiBase}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `[Workflow] ${session.name} (${stepIssues.length} steps)`, body, labels: ['workflow'] }),
      });
      sessionStorage.removeItem(SESSION_KEY);
      onComplete();
    } catch (e) {
      alert(`Submit failed: ${e}`);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.badge}>
      <div className={styles.badgeHeader}>
        <span className={styles.dot} />
        <span>Recording: {session.name}</span>
      </div>
      <span className={styles.stepCount}>{session.steps.length} step{session.steps.length !== 1 ? 's' : ''} captured</span>
      <input
        className={styles.labelInput}
        value={stepLabel}
        onChange={e => setStepLabel(e.target.value)}
        placeholder="Step label…"
      />
      <div className={styles.badgeActions}>
        <button className={styles.btnCapture} onClick={captureStep} disabled={capturing || !stepLabel.trim()}>
          {capturing ? 'Capturing…' : 'Capture step'}
        </button>
        <button className={styles.btnSubmit} onClick={submitWorkflow} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
        <button className={styles.btnCancel} onClick={() => { sessionStorage.removeItem(SESSION_KEY); onCancel(); }}>
          ✕
        </button>
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 3: PageCapture styles**

```css
/* src/components/DevNavigator/PageCapture.module.css */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  background: rgb(24, 24, 27);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 20px;
  width: 340px;
  color: #fff;
}

.title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.modeRow {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.modeBtn {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.15);
  background: none;
  color: rgba(255,255,255,0.6);
  font-size: 11px;
  cursor: pointer;
}

.modeBtnActive {
  background: rgba(6,95,70,0.4);
  border-color: #065f46;
  color: #6ee7b7;
}

.urlLabel {
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 8px;
  word-break: break-all;
}

.urlValue {
  color: #38bdf8;
}

.textarea {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  padding: 8px;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 6px;
}

.hint {
  font-size: 9px;
  color: rgba(255,255,255,0.3);
  margin-bottom: 12px;
}

.workflowInput {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.actionRow {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btnGhost {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: rgba(255,255,255,0.6);
  font-size: 11px;
  padding: 6px 12px;
  cursor: pointer;
}

.btnSubmit {
  background: #065f46;
  border: none;
  border-radius: 4px;
  color: #6ee7b7;
  font-size: 11px;
  padding: 6px 12px;
  cursor: pointer;
}

.btnStart {
  background: #4c1d95;
  border: none;
  border-radius: 4px;
  color: #c4b5fd;
  font-size: 11px;
  padding: 6px 12px;
  cursor: pointer;
}
```

- [ ] **Step 4: PageCapture component**

```typescript
// src/components/DevNavigator/PageCapture.tsx
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { collectPagePayload, generatePageCaptureFilename, formatNewPageBody } from "./page-capture-utils";
import { downloadBlob } from "./bugshot-utils";
import WorkflowBadge, { type WorkflowSession } from "./WorkflowBadge";
import styles from "./PageCapture.module.css";

const SESSION_KEY = 'devnav-workflow-session';
const VERCEL_URL = 'https://splose-current.vercel.app';

interface PageCaptureProps {
  onClose: () => void;
}

export default function PageCapture({ onClose }: PageCaptureProps) {
  const [mode, setMode] = useState<'new-page' | 'workflow'>('new-page');
  const [description, setDescription] = useState('');
  const [workflowName, setWorkflowName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeSession, setActiveSession] = useState<WorkflowSession | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null'); } catch { return null; }
  });

  if (activeSession) {
    return (
      <WorkflowBadge
        session={activeSession}
        onUpdate={setActiveSession}
        onComplete={() => { setActiveSession(null); onClose(); }}
        onCancel={() => setActiveSession(null)}
      />
    );
  }

  const submitNewPage = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      const payload = await collectPagePayload();
      const filename = generatePageCaptureFilename();
      const apiBase = window.location.hostname === 'localhost' ? '' : VERCEL_URL;

      const { toBlob } = await import('html-to-image');
      const blob = await toBlob(document.body, { pixelRatio: 1 }).catch(() => null);
      if (blob) downloadBlob(blob, filename);

      const body = formatNewPageBody({ ...payload, description, filename });
      const title = `[new-page] ${description.slice(0, 72)}`;

      await fetch(`${apiBase}/api/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, labels: ['new-page'] }),
      });
      onClose();
    } catch (e) {
      alert(`Submit failed: ${e}`);
    } finally {
      setSubmitting(false);
    }
  };

  const startWorkflow = () => {
    if (!workflowName.trim()) return;
    const session: WorkflowSession = { name: workflowName, steps: [] };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setActiveSession(session);
    onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.title}>Capture this page</div>

        <div className={styles.modeRow}>
          <button className={`${styles.modeBtn} ${mode === 'new-page' ? styles.modeBtnActive : ''}`} onClick={() => setMode('new-page')}>
            📄 New page
          </button>
          <button className={`${styles.modeBtn} ${mode === 'workflow' ? styles.modeBtnActive : ''}`} onClick={() => setMode('workflow')}>
            🔗 Workflow
          </button>
        </div>

        <div className={styles.urlLabel}>
          Capturing: <span className={styles.urlValue}>{typeof window !== 'undefined' ? window.location.href : ''}</span>
        </div>

        {mode === 'new-page' ? (
          <>
            <textarea
              className={styles.textarea}
              placeholder="What is this page? (e.g. New appointment form)"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              autoFocus
            />
            <div className={styles.hint}>Auto-captures: screenshot · DOM outline · design tokens · content</div>
            <div className={styles.actionRow}>
              <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
              <button className={styles.btnSubmit} onClick={submitNewPage} disabled={submitting || !description.trim()}>
                {submitting ? 'Capturing…' : '⬆ Submit page'}
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              className={styles.workflowInput}
              placeholder="Workflow name (e.g. Create appointment)"
              value={workflowName}
              onChange={e => setWorkflowName(e.target.value)}
              autoFocus
            />
            <div className={styles.actionRow}>
              <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
              <button className={styles.btnStart} onClick={startWorkflow} disabled={!workflowName.trim()}>
                Start session →
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 5: Wire PageCapture into DevNavigator footer**

In `src/components/DevNavigator/index.tsx`:

Add import:
```typescript
import PageCapture from './PageCapture';
```

Add state:
```typescript
const [pageCaptureOpen, setPageCaptureOpen] = useState(false);
```

Add Page Capture button to the quick links footer (alongside existing Bugshot button):
```tsx
<button
  onClick={() => { setPageCaptureOpen(true); setExpanded(false); }}
  className={`${styles.quickLink} text-caption-sm`}
>
  🗂 Page Capture
</button>
```

Add at bottom of component, alongside existing Bugshot render:
```tsx
{pageCaptureOpen && <PageCapture onClose={() => setPageCaptureOpen(false)} />}
```

- [ ] **Step 6: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 7: Commit**

```bash
git add src/components/DevNavigator/PageCapture.tsx src/components/DevNavigator/PageCapture.module.css src/components/DevNavigator/WorkflowBadge.tsx src/components/DevNavigator/WorkflowBadge.module.css src/components/DevNavigator/index.tsx
git commit -m "feat: PageCapture tool and WorkflowBadge session component"
```

---

## Task 10: Jim's New Request Form

**Files:**
- Create: `src/components/DevNavigator/NewRequestForm.tsx`
- Create: `src/components/DevNavigator/NewRequestForm.module.css`
- Modify: `src/components/DevNavigator/index.tsx`

- [ ] **Step 1: NewRequestForm styles**

```css
/* src/components/DevNavigator/NewRequestForm.module.css */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
}

.modal {
  background: rgb(24,24,27);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 20px;
  width: 360px;
  color: #fff;
}

.title { font-size: 13px; font-weight: 600; margin-bottom: 16px; }

.field { margin-bottom: 12px; }

.fieldLabel {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input, .select, .textarea {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  padding: 7px 8px;
  box-sizing: border-box;
}

.textarea { resize: none; }

.select option { background: #18181b; }

.priorityRow { display: flex; gap: 6px; }

.priorityBtn {
  flex: 1;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.15);
  background: none;
  color: rgba(255,255,255,0.5);
  font-size: 10px;
  cursor: pointer;
}

.priorityBtnActive {
  background: rgba(124,58,237,0.3);
  border-color: #7c3aed;
  color: #e9d5ff;
}

.actionRow {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.btnGhost {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: rgba(255,255,255,0.6);
  font-size: 11px;
  padding: 6px 14px;
  cursor: pointer;
}

.btnPrimary {
  background: #7c3aed;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  padding: 6px 14px;
  cursor: pointer;
}
```

- [ ] **Step 2: NewRequestForm component**

```typescript
// src/components/DevNavigator/NewRequestForm.tsx
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./NewRequestForm.module.css";

type RequestType = 'page' | 'component' | 'pattern' | 'workflow' | 'other';
type Priority = 'minor' | 'moderate' | 'major';

const TYPE_LABEL_MAP: Record<RequestType, string> = {
  page: 'new-page', component: 'missing', pattern: 'missing', workflow: 'workflow', other: 'from-jim',
};

interface NewRequestFormProps { onClose: () => void; }

export default function NewRequestForm({ onClose }: NewRequestFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<RequestType>('page');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('moderate');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const labels = ['from-jim', TYPE_LABEL_MAP[type], priority].filter((v, i, a) => a.indexOf(v) === i);
      const body = [
        `**Type:** ${type}`,
        `**Priority:** ${priority}`,
        ``,
        description,
      ].join('\n');
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `[${type}] ${title}`, body, labels }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.title}>New Request</div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Title *</label>
          <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief title…" autoFocus />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Type</label>
          <select className={styles.select} value={type} onChange={e => setType(e.target.value as RequestType)}>
            <option value="page">Page</option>
            <option value="component">Component</option>
            <option value="pattern">Pattern</option>
            <option value="workflow">Workflow</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Description *</label>
          <textarea className={styles.textarea} rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="What needs to be built or changed?" />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Priority</label>
          <div className={styles.priorityRow}>
            {(['minor', 'moderate', 'major'] as Priority[]).map(p => (
              <button key={p} onClick={() => setPriority(p)} className={`${styles.priorityBtn} ${priority === p ? styles.priorityBtnActive : ''}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ color: '#fca5a5', fontSize: 10, marginBottom: 8 }}>{error}</div>}

        <div className={styles.actionRow}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={handleSubmit} disabled={submitting || !title.trim() || !description.trim()}>
            {submitting ? 'Creating…' : 'Create request'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 3: Wire into DevNavigator**

In `src/components/DevNavigator/index.tsx`, add import and render:
```typescript
import NewRequestForm from './NewRequestForm';
// state already added in Task 5 step 3
// render alongside other portals:
{newRequestOpen && <NewRequestForm onClose={() => setNewRequestOpen(false)} />}
```

- [ ] **Step 4: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add src/components/DevNavigator/NewRequestForm.tsx src/components/DevNavigator/NewRequestForm.module.css src/components/DevNavigator/index.tsx
git commit -m "feat: Jim-only New Request form (NEXT_PUBLIC_IS_AUTHOR gated)"
```

---

## Task 11: Jim's CC skill

**Files:**
- Create: `skills/new-request.md`

- [ ] **Step 1: Create the skill**

```markdown
<!-- skills/new-request.md -->
# New Request Skill

Use this skill when Jim wants to create a design request from Claude Code without opening the browser.

## What it does

Creates a GitHub Issue with `from-jim` label using the `gh` CLI (which is authenticated as `jimsplose`).

## Steps

1. Ask Jim: "What's the title of the request?" (one line)
2. Ask Jim: "What type? page / component / pattern / workflow / other"
3. Ask Jim: "Brief description of what needs to be built or changed?"
4. Ask Jim: "Priority? minor / moderate / major"

Then run:

```bash
gh issue create \
  --repo jimsplose/splose-current \
  --title "[<type>] <title>" \
  --body "**Type:** <type>
**Priority:** <priority>

<description>" \
  --label "from-jim,<type-label>,<priority>"
```

Where `<type-label>` maps as: page→new-page, component→missing, pattern→missing, workflow→workflow, other→from-jim.

Report the created issue URL to Jim.
```

- [ ] **Step 2: Commit**

```bash
git add skills/new-request.md
git commit -m "feat: /new-request CC skill for Jim's terminal workflow"
```

---

## Task 12: Bookmarklet

**Files:**
- Create: `scripts/bookmarklet-src/widget.js`
- Create: `scripts/build-bookmarklet.mjs`
- Modify: `package.json`

- [ ] **Step 1: Install esbuild**

```bash
npm install --save-dev esbuild
```

- [ ] **Step 2: Create bookmarklet widget source**

```javascript
// scripts/bookmarklet-src/widget.js
// Self-contained bookmarklet widget — no React, no Next.js, vanilla JS only.
// Posted to: SPLOSE_API_BASE/api/issues

(function () {
  const API_BASE = 'https://splose-current.vercel.app';
  if (document.getElementById('__splose_bookmarklet__')) return;

  // ── Styles ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #__splose_bookmarklet__ { all: initial; }
    #__splose_bm_panel__ {
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
      background: rgba(17,24,39,0.97); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px; padding: 14px; width: 300px; color: #fff;
      font: 12px/1.5 -apple-system,sans-serif; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    #__splose_bm_panel__ h3 { margin: 0 0 10px; font-size: 12px; font-weight: 600; }
    #__splose_bm_panel__ .bm-mode-row { display: flex; gap: 6px; margin-bottom: 10px; }
    #__splose_bm_panel__ .bm-mode { flex:1; padding:5px; border-radius:4px; border:1px solid rgba(255,255,255,0.2); background:none; color:rgba(255,255,255,0.6); cursor:pointer; font-size:10px; }
    #__splose_bm_panel__ .bm-mode.active { background:rgba(6,95,70,0.4); border-color:#065f46; color:#6ee7b7; }
    #__splose_bm_panel__ textarea, #__splose_bm_panel__ input { width:100%; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:#fff; font-size:11px; padding:6px; box-sizing:border-box; margin-bottom:8px; font-family:inherit; }
    #__splose_bm_panel__ .bm-actions { display:flex; justify-content:flex-end; gap:6px; }
    #__splose_bm_panel__ button.bm-cancel { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.15); border-radius:4px; color:rgba(255,255,255,0.6); font-size:10px; padding:5px 10px; cursor:pointer; }
    #__splose_bm_panel__ button.bm-submit { background:#7c3aed; border:none; border-radius:4px; color:#fff; font-size:10px; padding:5px 10px; cursor:pointer; }
    #__splose_bm_panel__ button.bm-submit.green { background:#065f46; color:#6ee7b7; }
    #__splose_bm_panel__ .bm-intent-row { display:flex; gap:4px; margin-bottom:8px; }
    #__splose_bm_panel__ .bm-intent { flex:1; padding:3px; border-radius:4px; border:1px solid rgba(255,255,255,0.15); background:none; color:rgba(255,255,255,0.5); font-size:10px; cursor:pointer; }
    #__splose_bm_panel__ .bm-intent.active { background:rgba(124,58,237,0.3); border-color:#7c3aed; color:#e9d5ff; }
    #__splose_bm_panel__ .bm-url { font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:8px; word-break:break-all; }
    #__splose_bm_panel__ .bm-toast { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#059669; color:#fff; font-size:11px; padding:8px 16px; border-radius:6px; z-index:2147483647; }
  `;
  document.head.appendChild(style);

  // ── Panel ────────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = '__splose_bm_panel__';
  panel.innerHTML = `
    <h3>Splose Capture</h3>
    <div class="bm-url">${location.href}</div>
    <div class="bm-mode-row">
      <button class="bm-mode active" data-mode="region">📷 Region</button>
      <button class="bm-mode" data-mode="page">📄 Page</button>
      <button class="bm-mode" data-mode="workflow">🔗 Workflow</button>
    </div>
    <div id="__bm_body__"></div>
    <div class="bm-actions">
      <button class="bm-cancel" id="__bm_close__">✕ Close</button>
      <button class="bm-submit" id="__bm_action__">Submit</button>
    </div>
  `;
  document.body.appendChild(panel);

  let currentMode = 'region';
  let currentIntent = 'bug';

  function renderBody() {
    const body = document.getElementById('__bm_body__');
    if (!body) return;
    if (currentMode === 'region') {
      body.innerHTML = `
        <div class="bm-intent-row">
          ${['bug','missing','remove'].map(i=>`<button class="bm-intent${i===currentIntent?' active':''}" data-intent="${i}">${i}</button>`).join('')}
        </div>
        <textarea id="__bm_desc__" rows="3" placeholder="What's wrong here?"></textarea>
      `;
      body.querySelectorAll('.bm-intent').forEach(btn => btn.addEventListener('click', e => {
        currentIntent = (e.target as HTMLElement).dataset.intent ?? 'bug';
        renderBody();
      }));
      const action = document.getElementById('__bm_action__');
      if (action) { action.textContent = '⬆ Submit issue'; action.className = 'bm-submit'; }
    } else if (currentMode === 'page') {
      body.innerHTML = `<textarea id="__bm_desc__" rows="3" placeholder="What is this page?"></textarea>`;
      const action = document.getElementById('__bm_action__');
      if (action) { action.textContent = '⬆ Submit page'; action.className = 'bm-submit green'; }
    } else {
      body.innerHTML = `<input id="__bm_wf_name__" placeholder="Workflow name…" /><p style="font-size:10px;color:rgba(255,255,255,0.4);margin:0 0 8px">Starts a session badge for multi-step capture</p>`;
      const action = document.getElementById('__bm_action__');
      if (action) { action.textContent = 'Start session →'; action.className = 'bm-submit green'; }
    }
  }

  renderBody();

  panel.querySelectorAll('.bm-mode').forEach(btn => btn.addEventListener('click', e => {
    panel.querySelectorAll('.bm-mode').forEach(b => b.classList.remove('active'));
    const target = e.target as HTMLElement;
    target.classList.add('active');
    currentMode = target.dataset.mode ?? 'region';
    renderBody();
  }));

  document.getElementById('__bm_close__')?.addEventListener('click', () => {
    panel.remove();
    style.remove();
  });

  function toast(msg: string) {
    const t = document.createElement('div');
    t.className = 'bm-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  function buildDomOutlineSimple(root: Element, depth = 0): string {
    if (depth > 4) return '';
    const SEMANTIC = new Set(['nav','main','section','form','h1','h2','h3','button','input','label','a','footer','header']);
    const lines: string[] = [];
    for (const child of Array.from(root.children).slice(0, 20)) {
      const tag = child.tagName.toLowerCase();
      if (['script','style','svg'].includes(tag)) continue;
      if (SEMANTIC.has(tag)) {
        const inner = buildDomOutlineSimple(child, depth+1);
        lines.push('  '.repeat(depth) + tag + (inner ? ' > [\n' + inner + '\n' + '  '.repeat(depth) + ']' : ''));
      } else {
        const inner = buildDomOutlineSimple(child, depth+1);
        if (inner) lines.push(inner);
      }
    }
    return lines.join('\n');
  }

  document.getElementById('__bm_action__')?.addEventListener('click', async () => {
    const desc = (document.getElementById('__bm_desc__') as HTMLTextAreaElement)?.value?.trim() ?? '';
    const wfName = (document.getElementById('__bm_wf_name__') as HTMLInputElement)?.value?.trim() ?? '';

    if (currentMode === 'region') {
      if (!desc) { alert('Add a description first.'); return; }
      const title = `[${currentIntent}] ${desc.slice(0, 72)}`;
      const body = `**Intent:** ${currentIntent}\n**Page:** ${location.href}\n**Source:** production\n**Description:** ${desc}`;
      try {
        const res = await fetch(`${API_BASE}/api/issues`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, body, labels:[currentIntent] }) });
        const issue = await res.json();
        toast(`Issue #${issue.number} created`);
        setTimeout(() => { panel.remove(); style.remove(); }, 3000);
      } catch { toast('Error creating issue'); }

    } else if (currentMode === 'page') {
      if (!desc) { alert('Add a description first.'); return; }
      const domOutline = buildDomOutlineSimple(document.body);
      const title = `[new-page] ${desc.slice(0, 72)}`;
      const body = `**Intent:** new-page\n**URL:** ${location.href}\n**Title:** ${document.title}\n**Viewport:** ${window.innerWidth}×${window.innerHeight}\n**Description:** ${desc}\n\n### DOM Outline\n${domOutline}\n\nScreenshot: capture manually (bookmarklet)`;
      try {
        const res = await fetch(`${API_BASE}/api/issues`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, body, labels:['new-page'] }) });
        const issue = await res.json();
        toast(`Issue #${issue.number} created`);
        setTimeout(() => { panel.remove(); style.remove(); }, 3000);
      } catch { toast('Error creating issue'); }

    } else {
      if (!wfName) { alert('Enter a workflow name.'); return; }
      toast(`Workflow session "${wfName}" started in app — use Page Capture > Workflow in DevNavigator`);
      setTimeout(() => { panel.remove(); style.remove(); }, 3000);
    }
  });
})();
```

- [ ] **Step 3: Create build script**

```javascript
// scripts/build-bookmarklet.mjs
import { buildSync } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

mkdirSync('public', { recursive: true });

const result = buildSync({
  entryPoints: ['scripts/bookmarklet-src/widget.js'],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  target: 'es2020',
});

const minified = result.outputFiles[0].text.trim().replace(/\n/g, '');
writeFileSync('public/bookmarklet.js', result.outputFiles[0].text);

const uri = `javascript:${encodeURIComponent(`(function(){${minified}})();`)}`;
writeFileSync('public/bookmarklet-uri.txt', uri);

console.log('✅ Bookmarklet built');
console.log(`   public/bookmarklet.js       (${result.outputFiles[0].text.length} bytes readable)`);
console.log(`   public/bookmarklet-uri.txt  (${uri.length} bytes URI)`);
```

- [ ] **Step 4: Add build script to package.json**

In `package.json` scripts, add:
```json
"build:bookmarklet": "node scripts/build-bookmarklet.mjs"
```

- [ ] **Step 5: Build the bookmarklet**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npm run build:bookmarklet
```

Expected:
```
✅ Bookmarklet built
   public/bookmarklet.js       (XXXX bytes readable)
   public/bookmarklet-uri.txt  (XXXX bytes URI)
```

- [ ] **Step 6: Commit**

```bash
git add scripts/bookmarklet-src/widget.js scripts/build-bookmarklet.mjs public/bookmarklet.js public/bookmarklet-uri.txt package.json package-lock.json
git commit -m "feat: bookmarklet build pipeline (region + page capture for production site)"
```

---

## Task 13: Designer setup package

**Files:**
- Create: `setup/setup.sh`
- Create: `setup/designer-claude-md.md`

- [ ] **Step 1: Create setup.sh**

```bash
#!/usr/bin/env bash
# setup/setup.sh — Splose design review pilot setup
# Usage: bash setup.sh [project-path]

set -e

PROJECT_DIR="${1:-$(pwd)}"
GITHUB_TOKEN="REPLACE_WITH_BOT_TOKEN_BEFORE_DISTRIBUTION"

echo ""
echo "🎨 Splose Design Review — Pilot Setup"
echo "======================================="
echo "Project: $PROJECT_DIR"
echo ""

# Write .env.local
ENV_FILE="$PROJECT_DIR/.env.local"
if grep -q "GITHUB_TOKEN" "$ENV_FILE" 2>/dev/null; then
  echo "✅ GITHUB_TOKEN already in .env.local — skipping"
else
  echo "GITHUB_TOKEN=$GITHUB_TOKEN" >> "$ENV_FILE"
  echo "✅ GITHUB_TOKEN written to .env.local"
fi

# Install deps
if [ ! -d "$PROJECT_DIR/node_modules" ]; then
  echo "📦 Installing dependencies…"
  cd "$PROJECT_DIR" && npm install
  echo "✅ Dependencies installed"
else
  echo "✅ node_modules exists — skipping install"
fi

# Print bookmarklet
BOOKMARKLET_FILE="$PROJECT_DIR/public/bookmarklet-uri.txt"
echo ""
echo "📌 Bookmarklet URI (add to Chrome bookmarks):"
echo "----------------------------------------------"
if [ -f "$BOOKMARKLET_FILE" ]; then
  cat "$BOOKMARKLET_FILE"
else
  echo "(Build bookmarklet first: npm run build:bookmarklet)"
fi

echo ""
echo "Chrome bookmark setup:"
echo "  1. Right-click bookmark bar → Add page…"
echo "  2. Name: Splose Capture"
echo "  3. URL: paste the URI above"
echo "  4. Save"
echo ""
echo "✅ Setup complete! Run: cd $PROJECT_DIR && npm run dev"
echo "   Then open: http://localhost:3000"
echo ""
```

- [ ] **Step 2: Create designer-claude-md.md**

```markdown
## Design Review Tools (Designers)

This replica includes capture tools accessible via the **Dev Navigator** (bottom-right ◆ Nav button, or Ctrl+Shift+N).

### Bugshot — capture a region

Click **Bugshot** in the Dev Navigator footer. Drag to select the problem area, choose an intent:
- **bug** — something looks wrong in the replica
- **missing** — this exists in production but not here
- **remove** — this is in the replica but shouldn't be

Add a description, tags, severity, then click **Submit issue** — this creates a GitHub Issue automatically and downloads a PNG screenshot.

### Page Capture — capture a full page or workflow

Click **🗂 Page Capture** in the Dev Navigator footer. Choose:
- **New page** — captures the full current page (DOM, styles, content) as a GitHub Issue
- **Workflow** — starts a session badge; navigate through a multi-step flow and click "Capture step" at each screen

### Bookmarklet — capture from production (acme.splose.com)

Use the Splose Capture bookmarklet in Chrome to trigger region and page capture directly on the production site. The bookmarklet posts to the same issue queue.

### Requests panel

Open Dev Navigator → **Requests** tab to see all open issues, filter by type, add comments, and close issues.
```

- [ ] **Step 3: Make setup.sh executable and commit**

```bash
chmod +x setup/setup.sh
git add setup/setup.sh setup/designer-claude-md.md
git commit -m "feat: designer setup package (setup.sh + CLAUDE.md snippet)"
```

---

## Task 14: Full test run + build validation

- [ ] **Step 1: Run all tests**

```bash
cd /Users/jimyenckensplose/claude/splose-current && npx vitest run 2>&1 | tail -20
```

Expected: all tests pass. Fix any failures before proceeding.

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 3: Build check**

```bash
npx next build 2>&1 | tail -20
```

Expected: build succeeds.

- [ ] **Step 4: Run label creation script** (requires GITHUB_TOKEN in .env.local)

```bash
node scripts/create-labels.mjs
```

Expected: 9 labels created (or "already exists" for any pre-existing ones).

- [ ] **Step 5: Final commit**

```bash
git add -A
git status  # review — should be clean or minimal untracked
git commit -m "feat: design review system complete (phases 1-5)"
```

- [ ] **Step 6: Push**

```bash
git push
```

---

## Self-Review Notes

**Spec coverage check:**
- § API routes → Tasks 2–3 ✓
- § Enhanced Bugshot → Tasks 6–7 ✓
- § Page Capture + workflow → Tasks 8–9 ✓
- § RequestsPanel (two-way) → Task 5 ✓
- § Jim New Request form → Task 10 ✓
- § Jim CC skill → Task 11 ✓
- § Bookmarklet → Task 12 ✓
- § Designer setup package → Task 13 ✓
- § Label creation → Task 1 step 5 ✓
- § Test infrastructure → Task 0 ✓

**Type consistency across tasks:**
- `GithubIssue`, `GithubComment`, `GithubLabel` defined in `src/lib/github-issues.ts` — referenced only as inline types in UI components (avoids server/client import crossing)
- `CaptureIntent` exported from `bugshot-utils.ts`, imported in `Bugshot.tsx` ✓
- `PagePayload`, `TextContent` exported from `page-capture-utils.ts`, used in `PageCapture.tsx` and `WorkflowBadge.tsx` ✓
- `WorkflowSession` exported from `WorkflowBadge.tsx`, imported in `PageCapture.tsx` ✓
- API route `params` typed as `Promise<{ number: string }>` — correct for Next.js 16 async params ✓
