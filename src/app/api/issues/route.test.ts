// src/app/api/issues/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/github-issues', () => ({
  listIssues: vi.fn(),
  createIssue: vi.fn(),
}));

import { listIssues, createIssue } from '@/lib/github-issues';
import { GET, POST } from './route';

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
