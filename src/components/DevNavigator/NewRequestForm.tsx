"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./NewRequestForm.module.css";

type RequestType = 'page' | 'component' | 'pattern' | 'workflow' | 'other';
type Priority = 'minor' | 'moderate' | 'major';

const TYPE_LABEL_MAP: Record<RequestType, string> = {
  page: 'new-page', component: 'missing', pattern: 'missing', workflow: 'workflow', other: 'from-jim',
};

interface NewRequestFormProps { onClose: () => void; }

export default function NewRequestForm({ onClose }: NewRequestFormProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<RequestType>('page');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('moderate');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

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
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

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

        {error && <div className={styles.errorMessage}>{error}</div>}

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
