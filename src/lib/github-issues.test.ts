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
