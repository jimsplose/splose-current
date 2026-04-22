"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { CameraOutlined } from "@ant-design/icons";
import { Button } from "@/components/ds";
import {
  extractStyles,
  generatePrompt,
  generateFilename,
  downloadBlob,
  type Region,
  type CaptureIntent,
  generateIssueTitle,
  formatRegionIssueBody,
} from "./bugshot-utils";
import styles from "./Bugshot.module.css";

type BugshotState = "idle" | "selecting" | "describing" | "capturing" | "done" | "error";

const CATEGORY_TAGS = ["spacing", "color", "typography", "layout", "alignment", "responsive"];
const SEVERITY_TAGS = ["minor", "moderate", "major"];
const MIN_REGION = 20;

interface BugshotProps {
  onClose: () => void;
  /** Ref to the DevNavigator root element — hidden during screenshot capture */
  devNavRef: React.RefObject<HTMLElement | null>;
}

export default function Bugshot({ onClose, devNavRef }: BugshotProps) {
  const [state, setState] = useState<BugshotState>("selecting");
  const [region, setRegion] = useState<Region | null>(null);
  const [description, setDescription] = useState("");
  const [categoryTags, setCategoryTags] = useState<Set<string>>(new Set());
  const [severityTag, setSeverityTag] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fallbackPrompt, setFallbackPrompt] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [intent, setIntent] = useState<CaptureIntent>('bug');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [issueNumber, setIssueNumber] = useState<number | null>(null);

  // Selection drag state
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Escape handler — stopPropagation prevents DevNavigator from closing
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true); // capture phase
    return () => window.removeEventListener("keydown", handler, true);
  }, [onClose]);

  // Mouse handlers for region selection
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (state !== "selecting") return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setRegion(null);
  }, [state]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (state !== "selecting" || !dragStart.current) return;
    const x = Math.min(dragStart.current.x, e.clientX);
    const y = Math.min(dragStart.current.y, e.clientY);
    const width = Math.abs(e.clientX - dragStart.current.x);
    const height = Math.abs(e.clientY - dragStart.current.y);
    setRegion({ x, y, width, height });
  }, [state]);

  const handleMouseUp = useCallback(() => {
    if (state !== "selecting") return;
    dragStart.current = null;
    if (region && region.width >= MIN_REGION && region.height >= MIN_REGION) {
      setState("describing");
    } else {
      setRegion(null);
    }
  }, [state, region]);

  // Toggle a category tag
  const toggleCategory = (tag: string) => {
    setCategoryTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  // Toggle severity (single select)
  const toggleSeverity = (tag: string) => {
    setSeverityTag((prev) => (prev === tag ? null : tag));
  };

  // Submit Issue: screenshot + crop + POST to GitHub API route
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
        // Crop to selected region
        const img = await createImageBitmap(blob);
        const canvas = document.createElement('canvas');
        canvas.width = region.width;
        canvas.height = region.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(
          img,
          region.x + window.scrollX,
          region.y + window.scrollY,
          region.width,
          region.height,
          0, 0, region.width, region.height
        );
        const croppedBlob = await new Promise<Blob>((resolve, reject) =>
          canvas.toBlob(b => b ? resolve(b) : reject(new Error('crop failed')), 'image/png')
        );
        const filename = generateFilename();
        downloadBlob(croppedBlob, filename);

        // Post to GitHub via API route
        const allTags = [...categoryTags, ...(severityTag ? [severityTag] : [])];
        const body = formatRegionIssueBody({
          intent,
          pageUrl: window.location.href,
          region,
          description,
          tags: allTags,
          filename,
        });
        const title = generateIssueTitle(intent, description);
        const apiBase = window.location.hostname === 'localhost'
          ? ''
          : 'https://splose-current.vercel.app';
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
      setSubmitState('idle');
      if (overlayRef.current) overlayRef.current.style.display = '';
      if (devNavRef.current) devNavRef.current.style.display = '';
      return;
    }

    if (overlayRef.current) overlayRef.current.style.display = '';
    if (devNavRef.current) devNavRef.current.style.display = '';
    setSubmitState('done');
    setState('done');
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      onClose();
    }, 2500);
  };

  // Capture: screenshot + styles + clipboard
  const handleCapture = async () => {
    if (!region) return;
    setState("capturing");

    try {
      // 1. Hide bugshot overlay + DevNavigator for clean screenshot
      if (overlayRef.current) overlayRef.current.style.display = "none";
      if (devNavRef.current) devNavRef.current.style.display = "none";

      // 2. Dynamic import html-to-image (handles modern CSS like oklab() colors)
      const { toBlob } = await import("html-to-image");

      // 3. Capture the selected region as a PNG blob
      const blob = await toBlob(document.body, {
        pixelRatio: 1,
        filter: (node) => {
          // Skip the bugshot overlay and DevNavigator (already hidden, but belt & suspenders)
          if (node === overlayRef.current || node === devNavRef.current) return false;
          return true;
        },
      });
      if (!blob) throw new Error("Screenshot capture returned null");

      // 4. Crop to selected region using an offscreen canvas
      const img = await createImageBitmap(blob);
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = region.width;
      cropCanvas.height = region.height;
      const ctx = cropCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      ctx.drawImage(
        img,
        region.x + window.scrollX,
        region.y + window.scrollY,
        region.width,
        region.height,
        0,
        0,
        region.width,
        region.height,
      );
      const croppedBlob = await new Promise<Blob>((resolve, reject) => {
        cropCanvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Crop toBlob failed"))), "image/png");
      });

      // 5. Extract styles from region
      const { elements, hasIframe } = extractStyles(region);

      // 6. Generate filename and prompt
      const filename = generateFilename();
      const allTags = [...categoryTags, ...(severityTag ? [severityTag] : [])];
      const prompt = generatePrompt({
        description,
        tags: allTags,
        region,
        filename,
        elements,
        hasIframe,
      });

      // 7. Download the cropped screenshot
      downloadBlob(croppedBlob, filename);

      // 8. Copy prompt to clipboard
      try {
        await navigator.clipboard.writeText(prompt);
      } catch {
        // Clipboard failed — show fallback textarea
        setFallbackPrompt(prompt);
        setState("error");
        if (overlayRef.current) overlayRef.current.style.display = "";
        if (devNavRef.current) devNavRef.current.style.display = "";
        return;
      }

      // 9. Show toast
      if (overlayRef.current) overlayRef.current.style.display = "";
      if (devNavRef.current) devNavRef.current.style.display = "";
      setState("done");
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        onClose();
      }, 2000);
    } catch (err) {
      if (overlayRef.current) overlayRef.current.style.display = "";
      if (devNavRef.current) devNavRef.current.style.display = "";
      setErrorMessage(err instanceof Error ? err.message : "Screenshot capture failed");
      setState("error");
    }
  };

  // Retry from error
  const handleRetry = () => {
    setErrorMessage("");
    setFallbackPrompt(null);
    setState("describing");
  };

  // Description panel position: below region if space, above if near bottom
  const panelPosition = region
    ? {
        left: Math.max(8, Math.min(region.x, window.innerWidth - 340)),
        top:
          region.y + region.height + 8 + 300 < window.innerHeight
            ? region.y + region.height + 8
            : region.y - 308,
      }
    : { left: 0, top: 0 };

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: state === "selecting" ? "crosshair" : "default" }}
    >
      {/* Semi-transparent backdrop */}
      {state === "selecting" && (
        <div className={styles.backdrop} />
      )}

      {/* Selection rectangle */}
      {region && (
        <div
          className={styles.selectionRect}
          style={{
            left: region.x,
            top: region.y,
            width: region.width,
            height: region.height,
          }}
        />
      )}

      {/* Instruction hint while selecting */}
      {state === "selecting" && !region && (
        <div className={`${styles.instructionHint} text-body-md`} style={{ color: '#fff' }}>
          Click and drag to select the problem area. Press Escape to cancel.
        </div>
      )}

      {/* Description panel */}
      {state === "describing" && region && (
        <div
          className={styles.descPanel}
          style={{ left: panelPosition.left, top: panelPosition.top }}
          onMouseDown={(e) => e.stopPropagation()}
        >
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

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's wrong here?"
            rows={3}
            className={`${styles.descTextarea} text-body-md`}
            autoFocus
          />

          {/* Category tags — inline toggle buttons (DS Chip doesn't support selectable mode) */}
          <div className={styles.tagRow}>
            {CATEGORY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleCategory(tag)}
                className={`${styles.tagBtn} ${categoryTags.has(tag) ? styles.tagBtnActive : ""} text-label-lg`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Severity tags — single select */}
          <div className={styles.tagRowSeverity}>
            {SEVERITY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleSeverity(tag)}
                className={`${styles.tagBtn} ${severityTag === tag ? styles.tagBtnActive : ""} text-label-lg`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.actionRow}>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
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
        </div>
      )}

      {/* Capturing spinner */}
      {state === "capturing" && (
        <div className={styles.capturingOverlay}>
          <div className={styles.capturingCard}>
            <div className={styles.capturingInner}>
              <div className={styles.spinner} />
              <span className="text-body-md text-text">Capturing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className={styles.errorOverlay}>
          <div
            className={styles.errorCard}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {fallbackPrompt ? (
              <>
                <h3 className={`${styles.errorTitle} text-heading-sm text-text`}>Clipboard unavailable</h3>
                <p className={`${styles.errorText} text-body-sm text-text-secondary`}>
                  Screenshot downloaded. Copy the prompt below manually:
                </p>
                <textarea
                  value={fallbackPrompt}
                  readOnly
                  rows={10}
                  className={`${styles.fallbackTextarea} text-body-sm`}
                  onFocus={(e) => e.target.select()}
                />
                <div className={styles.errorActions}>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className={`${styles.errorTitle} text-heading-sm text-text`}>Capture failed</h3>
                <p className={`${styles.errorText} text-body-sm text-text-secondary`}>{errorMessage}</p>
                <div className={styles.errorActions}>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Dismiss
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleRetry}>
                    Retry
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success toast */}
      {toastVisible && (
        <div className={`${styles.toast} text-body-md`} style={{ color: '#fff' }}>
          {issueNumber
            ? `Issue #${issueNumber} created · PNG downloaded`
            : 'Bugshot copied to clipboard + screenshot downloaded'}
        </div>
      )}
    </div>,
    document.body,
  );
}
