"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collectPagePayload, generatePageCaptureFilename, formatNewPageBody, SESSION_KEY, VERCEL_URL } from "./page-capture-utils";
import { downloadBlob } from "./bugshot-utils";
import WorkflowBadge, { type WorkflowSession } from "./WorkflowBadge";
import styles from "./PageCapture.module.css";

interface PageCaptureProps {
  onClose: () => void;
}

export default function PageCapture({ onClose }: PageCaptureProps) {
  const [mode, setMode] = useState<'new-page' | 'workflow'>('new-page');
  const [description, setDescription] = useState('');
  const [workflowName, setWorkflowName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSession, setActiveSession] = useState<WorkflowSession | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null'); } catch { return null; }
  });
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
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
      alert(`Submit failed: ${e instanceof Error ? e.message : String(e)}`);
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
