"use client";

import { useState } from "react";

export type PatientAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type PatientAvatarStatus = "active" | "archived" | "deceased";

export interface PatientRecord {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
  /** Optional explicit tone override (archived grey, emergency red). */
  tone?: string;
}

export interface PatientAvatarProps {
  patient: PatientRecord;
  size?: PatientAvatarSize;
  interactive?: boolean;
  onClick?: () => void;
  status?: PatientAvatarStatus;
  className?: string;
}

// Splose palette — same 7 hues used in ColorDot / Tag stories. Kept
// local (not imported from settings) so the avatar renders before any
// theme context is ready.
const palette = [
  "#5578FF",
  "#24a148",
  "#8250ff",
  "#0f62fe",
  "#fa4d56",
  "#f1c21b",
  "#b4eb64",
];

const sizeMap: Record<PatientAvatarSize, { dim: number; font: number }> = {
  xs: { dim: 20, font: 10 },
  sm: { dim: 26, font: 11 },
  md: { dim: 36, font: 13 },
  lg: { dim: 40, font: 16 },
  xl: { dim: 48, font: 18 },
};

/** FNV-1a 32-bit hash — stable across deploys, no crypto dep. */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

function resolveDisplayName(p: PatientRecord): string {
  if (p.displayName) return p.displayName;
  return [p.firstName, p.lastName].filter(Boolean).join(" ") || "Patient";
}

function resolveInitials(p: PatientRecord): string {
  if (p.firstName || p.lastName) {
    return `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase();
  }
  const name = resolveDisplayName(p);
  return name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resolveTone(p: PatientRecord, status?: PatientAvatarStatus): string {
  if (p.tone) return p.tone;
  if (status === "archived") return "#a5a59e";
  return palette[fnv1a(p.id) % palette.length];
}

/**
 * Circular patient avatar with deterministic colour from `patient.id`
 * (FNV-1a hash → 7-colour palette). Shows initials by default; if
 * `photoUrl` is present loads it and falls back to initials on image
 * error. Archived status desaturates; deceased shows a corner marker.
 * For non-patient uses (top-nav user, reviewer, org) use the generic
 * `Avatar` instead — this component owns the patient-specific colour
 * rule on purpose.
 */
export default function PatientAvatar({
  patient,
  size = "md",
  interactive = false,
  onClick,
  status = "active",
  className,
}: PatientAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const { dim, font } = sizeMap[size];
  const displayName = resolveDisplayName(patient);
  const initials = resolveInitials(patient);
  const tone = resolveTone(patient, status);
  const archived = status === "archived";

  const srLabel = archived ? `${displayName}, archived` : displayName;

  const inner = patient.photoUrl && !imageError ? (
    <img
      alt={displayName}
      src={patient.photoUrl}
      onError={() => setImageError(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  ) : (
    <span
      aria-hidden={interactive ? true : undefined}
      style={{
        color: "#ffffff",
        fontSize: font,
        fontWeight: 500,
        letterSpacing: 0.2,
      }}
    >
      {initials || "·"}
    </span>
  );

  const baseStyle: React.CSSProperties = {
    width: dim,
    height: dim,
    borderRadius: "50%",
    backgroundColor: patient.photoUrl && !imageError ? "transparent" : tone,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    position: "relative",
    opacity: archived ? 0.6 : 1,
    filter: archived ? "grayscale(1)" : undefined,
    cursor: interactive ? "pointer" : undefined,
    border: "none",
    padding: 0,
  };

  const deceasedBadge =
    status === "deceased" ? (
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#414549",
          color: "#ffffff",
          fontSize: 9,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid #ffffff",
        }}
      >
        †
      </span>
    ) : null;

  if (interactive) {
    return (
      <button
        type="button"
        aria-label={srLabel}
        onClick={onClick}
        className={className}
        style={baseStyle}
      >
        {inner}
        {deceasedBadge}
      </button>
    );
  }

  return (
    <span
      role="img"
      aria-label={srLabel}
      className={className}
      style={baseStyle}
    >
      {inner}
      {deceasedBadge}
    </span>
  );
}
