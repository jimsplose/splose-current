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
