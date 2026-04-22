"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { collectPagePayload, generatePageCaptureFilename, formatNewPageBody, formatWorkflowParentBody } from "./page-capture-utils";
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
