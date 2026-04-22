"use client";

import SignaturePadLib from "signature_pad";
import { useEffect, useRef, useState } from "react";
import FormField from "./FormField";
import Button from "./Button";

export type SignatureFormat = "png" | "svg";

export interface SignaturePadProps {
  label?: string;
  /** Base64 data URL (PNG by default). */
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  width?: number;
  height?: number;
  penColor?: string;
  /** Exported canvas background. Default transparent; pass white for embedding in PDFs. */
  background?: string;
  format?: SignatureFormat;
  showClearButton?: boolean;
  className?: string;
}

/**
 * Handwritten signature capture for invoice sign-off, consent forms,
 * and note practitioner sign-off. Emits a base64 data URL on every
 * onChange (null when empty). Accompany with a typed-signature
 * fallback for keyboard-only users — the canvas itself is not
 * accessible. Wraps `signature_pad` (~10KB gz).
 */
export default function SignaturePad({
  label,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  error,
  hint,
  width = 360,
  height = 120,
  penColor = "rgb(44, 44, 44)",
  background,
  format = "png",
  showClearButton = true,
  className,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadLib | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value && !defaultValue);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);

    const pad = new SignaturePadLib(canvas, {
      penColor,
      backgroundColor: background ?? "rgba(0,0,0,0)",
    });
    padRef.current = pad;

    const emit = () => {
      const empty = pad.isEmpty();
      setIsEmpty(empty);
      if (empty) {
        onChange?.(null);
      } else {
        onChange?.(format === "svg" ? pad.toDataURL("image/svg+xml") : pad.toDataURL("image/png"));
      }
    };
    pad.addEventListener("endStroke", emit);

    const initial = value ?? defaultValue;
    if (initial) {
      pad.fromDataURL(initial);
      setIsEmpty(false);
    }

    if (disabled) pad.off();

    return () => {
      pad.removeEventListener("endStroke", emit);
      pad.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!padRef.current) return;
    if (disabled) padRef.current.off();
    else padRef.current.on();
  }, [disabled]);

  const canvas = (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        aria-label="Signature drawing area — use type-mode fallback if you cannot draw"
        style={{
          width,
          height,
          background: background ?? "#ffffff",
          border: `2px ${error ? "solid" : "dashed"} ${error ? "var(--color-danger, #D00032)" : "var(--color-border, #e5e5e5)"}`,
          borderRadius: 6,
          display: "block",
          touchAction: "none",
          cursor: disabled ? "not-allowed" : "crosshair",
          opacity: disabled ? 0.6 : 1,
        }}
      />
      {isEmpty ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-tertiary, #a5a59e)",
            fontSize: 14,
            pointerEvents: "none",
            fontStyle: "italic",
          }}
        >
          Sign here
        </span>
      ) : null}
      {showClearButton && !disabled ? (
        <div style={{ position: "absolute", top: 6, right: 6 }}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              padRef.current?.clear();
              setIsEmpty(true);
              onChange?.(null);
            }}
          >
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );

  if (label || error || hint || required) {
    return (
      <FormField
        label={label}
        error={error}
        hint={hint}
        required={required}
        className={className}
      >
        {canvas}
      </FormField>
    );
  }

  return <div className={className}>{canvas}</div>;
}
