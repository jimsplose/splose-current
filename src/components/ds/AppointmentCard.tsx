"use client";

import type { MouseEvent, ReactNode, CSSProperties } from "react";
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "no-show"
  | "cancelled";

export type AppointmentDensity = "compact" | "standard" | "expanded";

export interface AppointmentCardProps {
  time: string;
  patientName: string;
  service?: string;
  location?: string;
  practitioner?: string;
  status?: AppointmentStatus;
  /** Hex or CSS colour. When absent, inferred from `status`. */
  tone?: string;
  density?: AppointmentDensity;
  onClick?: (e: MouseEvent) => void;
  onHover?: () => void;
  className?: string;
  /** Merged into the root element style — use for calendar grid positioning (top/height). */
  style?: React.CSSProperties;
}

const statusToneMap: Record<AppointmentStatus, string> = {
  scheduled: "#5578FF",
  confirmed: "#24a148",
  completed: "#6E6E64",
  "no-show": "#f1c21b",
  cancelled: "#D00032",
};

const densityHeight: Record<AppointmentDensity, number> = {
  compact: 44,
  standard: 56,
  expanded: 78,
};

function pickTextColor(color: string): string {
  const hex = color.trim().replace(/^#/, "");
  if (hex.length !== 3 && hex.length !== 6) return "#ffffff";
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.6 ? "#ffffff" : "#2C2C2C";
}

/**
 * Single-appointment card for the calendar grid, patient appointments list,
 * and appointment side drawer. Absorbs the inline `_calendarEvent_*`
 * markup used in production so visuals can iterate without touching the
 * calendar grid layout. Status drives the tone fallback; pass `tone`
 * explicitly to use the practitioner's assigned colour. Densities map
 * to the host layout (grid cell vs. list row vs. drawer body).
 */
export default function AppointmentCard({
  time,
  patientName,
  service,
  location,
  practitioner,
  status = "scheduled",
  tone,
  density = "standard",
  onClick,
  onHover,
  className,
  style: styleProp,
}: AppointmentCardProps) {
  const backgroundColor = tone ?? statusToneMap[status];
  const color = pickTextColor(backgroundColor);
  const height = densityHeight[density];
  const isInteractive = Boolean(onClick);
  const cancelled = status === "cancelled";

  const ariaLabel = `${patientName}${service ? `, ${service}` : ""}, ${time}, ${status}`;

  const content: ReactNode = (
    <>
      {status === "completed" ? (
        <CheckCircleFilled
          aria-hidden
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            fontSize: 12,
            color,
          }}
        />
      ) : null}
      {status === "no-show" ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#f1c21b",
            boxShadow: "0 0 0 2px rgba(255,255,255,0.4)",
          }}
        />
      ) : null}
      {status === "cancelled" ? (
        <ExclamationCircleFilled
          aria-hidden
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            fontSize: 12,
            color,
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: density === "compact" ? 0 : 2,
          fontSize: 12,
          lineHeight: density === "compact" ? 1.2 : 1.25,
          overflow: "hidden",
        }}
      >
        <div style={{ fontWeight: 600, opacity: cancelled ? 0.55 : 1 }}>
          <span style={{ textDecoration: cancelled ? "line-through" : undefined }}>
            {patientName}
          </span>
        </div>
        <div style={{ opacity: cancelled ? 0.55 : 0.95 }}>{time}</div>
        {service && density !== "compact" ? (
          <div
            style={{
              opacity: cancelled ? 0.5 : 0.85,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {service}
          </div>
        ) : null}
        {density === "expanded" && (location || practitioner) ? (
          <div
            style={{
              opacity: cancelled ? 0.5 : 0.8,
              fontSize: 11,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {[practitioner, location].filter(Boolean).join(" · ")}
          </div>
        ) : null}
      </div>
    </>
  );

  const sharedStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "6px 8px",
    minHeight: height,
    borderRadius: 6,
    backgroundColor,
    color,
    border: "none",
    textAlign: "left",
    cursor: isInteractive ? "pointer" : "default",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
    ...styleProp,
  };

  if (isInteractive) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseEnter={onHover}
        className={className}
        style={sharedStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <article aria-label={ariaLabel} className={className} style={sharedStyle}>
      {content}
    </article>
  );
}
