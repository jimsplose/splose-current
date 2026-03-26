"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Camera } from "lucide-react";
import { Button } from "@/components/ds";
import {
  extractStyles,
  generatePrompt,
  generateFilename,
  downloadBlob,
  type Region,
} from "./bugshot-utils";

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

  // Capture: screenshot + styles + clipboard
  const handleCapture = async () => {
    if (!region) return;
    setState("capturing");

    try {
      // 1. Hide bugshot overlay + DevNavigator for clean screenshot
      if (overlayRef.current) overlayRef.current.style.display = "none";
      if (devNavRef.current) devNavRef.current.style.display = "none";

      // 2. Dynamic import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      // 3. Render full page and crop to region
      const canvas = await html2canvas(document.body, {
        x: region.x + window.scrollX,
        y: region.y + window.scrollY,
        width: region.width,
        height: region.height,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
        useCORS: true,
      });

      // 4. Extract styles from region
      const { elements, hasIframe } = extractStyles(region);

      // 5. Generate filename and prompt
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

      // 6. Download the screenshot
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))), "image/png");
      });
      downloadBlob(blob, filename);

      // 7. Copy prompt to clipboard
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

      // 8. Show toast
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
      className="fixed inset-0 z-[9998]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: state === "selecting" ? "crosshair" : "default" }}
    >
      {/* Semi-transparent backdrop */}
      {state === "selecting" && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      {/* Selection rectangle */}
      {region && (
        <div
          className="absolute border-2 border-dashed border-primary bg-primary/10 pointer-events-none"
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
        <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900/90 px-4 py-2 text-body-md text-white shadow-lg">
          Click and drag to select the problem area. Press Escape to cancel.
        </div>
      )}

      {/* Description panel */}
      {state === "describing" && region && (
        <div
          className="absolute z-[9999] w-[320px] rounded-lg border border-border bg-white p-4 shadow-xl"
          style={{ left: panelPosition.left, top: panelPosition.top }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's wrong here?"
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-body-md text-text outline-none focus:border-primary"
            autoFocus
          />

          {/* Category tags — inline toggle buttons (DS Chip doesn't support selectable mode) */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CATEGORY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleCategory(tag)}
                className={`rounded-full border px-3 py-1 text-label-lg transition-colors ${
                  categoryTags.has(tag)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-text-secondary hover:border-primary/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Severity tags — single select */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SEVERITY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleSeverity(tag)}
                className={`rounded-full border px-3 py-1 text-label-lg transition-colors ${
                  severityTag === tag
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-text-secondary hover:border-primary/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCapture}
              disabled={!description.trim()}
            >
              <Camera className="h-4 w-4" /> Capture
            </Button>
          </div>
        </div>
      )}

      {/* Capturing spinner */}
      {state === "capturing" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="rounded-lg bg-white px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-body-md text-text">Capturing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div
            className="z-[9999] w-[400px] rounded-lg border border-border bg-white p-5 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {fallbackPrompt ? (
              <>
                <h3 className="mb-2 text-heading-sm text-text">Clipboard unavailable</h3>
                <p className="mb-3 text-body-sm text-text-secondary">
                  Screenshot downloaded. Copy the prompt below manually:
                </p>
                <textarea
                  value={fallbackPrompt}
                  readOnly
                  rows={10}
                  className="w-full rounded-lg border border-border bg-gray-50 px-3 py-2 text-body-sm text-text font-mono"
                  onFocus={(e) => e.target.select()}
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-2 text-heading-sm text-text">Capture failed</h3>
                <p className="mb-3 text-body-sm text-text-secondary">{errorMessage}</p>
                <div className="mt-3 flex justify-end gap-2">
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-lg bg-gray-900/90 px-5 py-3 text-body-md text-white shadow-lg">
          Bugshot copied to clipboard + screenshot downloaded
        </div>
      )}
    </div>,
    document.body,
  );
}
