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
  'from-jim':{ bg: 'rgba(124,58,237,0.4)', text: '#e9d5ff' },
  minor:     { bg: 'rgba(107,114,128,0.4)', text: '#d1d5db' },
  moderate:  { bg: 'rgba(217,119,6,0.4)',  text: '#fde68a' },
  major:     { bg: 'rgba(220,38,38,0.4)',  text: '#fca5a5' },
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
