"use client";

import type { CSSProperties } from "react";

export type SparklineTone = "primary" | "success" | "danger" | "warning" | "neutral";
export type SparklineShape = "line" | "area" | "bar";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  /** Omit to auto-infer from the series direction. */
  tone?: SparklineTone;
  shape?: SparklineShape;
  showDots?: boolean;
  /** Highlight the last data point with a filled dot. Default `true`. */
  markLast?: boolean;
  /** Optional reference line (e.g. 0 or previous-period average). */
  baseline?: number;
  "aria-label": string;
  className?: string;
  style?: CSSProperties;
}

const toneColor: Record<SparklineTone, string> = {
  primary: "var(--color-primary, #5578FF)",
  success: "var(--color-success, #00c887)",
  danger: "var(--color-danger, #D00032)",
  warning: "var(--color-warning, #f1c21b)",
  neutral: "var(--color-text-secondary, #6E6E64)",
};

function inferTone(data: number[]): SparklineTone {
  if (data.length < 2) return "neutral";
  const first = data[0];
  const last = data[data.length - 1];
  if (first === 0) {
    if (last > 0) return "success";
    if (last < 0) return "danger";
    return "neutral";
  }
  const change = (last - first) / Math.abs(first);
  if (change >= 0.05) return "success";
  if (change <= -0.05) return "danger";
  return "neutral";
}

/**
 * Glanceable trend chart for Stat tiles, dashboard cards, aged-debtor
 * rows. Hand-rolled SVG — zero dep, ~1KB. Not interactive (no hovers,
 * no axes). Parent component pre-bins the series. Tone auto-infers from
 * the series direction (≥5% rise → success, ≥5% fall → danger, else
 * neutral); pass `tone` to override. For full data exploration, pair
 * with a DataTable or use a full chart library.
 */
export default function Sparkline({
  data,
  width = 96,
  height = 24,
  tone,
  shape = "line",
  showDots = false,
  markLast = true,
  baseline,
  "aria-label": ariaLabel,
  className,
  style,
}: SparklineProps) {
  const resolvedTone = tone ?? inferTone(data);
  const color = toneColor[resolvedTone];

  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  // Edge case: empty data → flat line at baseline (or midline).
  if (data.length === 0) {
    const y = pad + innerH / 2;
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        width={width}
        height={height}
        className={className}
        style={style}
      >
        <line x1={pad} y1={y} x2={width - pad} y2={y} stroke={color} strokeWidth={1.5} strokeDasharray="2,3" />
      </svg>
    );
  }

  const min = Math.min(...data, baseline ?? data[0]);
  const max = Math.max(...data, baseline ?? data[0]);
  const range = max - min || 1;

  const xAt = (i: number) =>
    data.length === 1
      ? pad + innerW / 2
      : pad + (i / (data.length - 1)) * innerW;
  const yAt = (v: number) => pad + innerH - ((v - min) / range) * innerH;

  const points = data.map((v, i) => `${xAt(i)},${yAt(v)}`);
  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${xAt(data.length - 1)},${height - pad} L ${xAt(0)},${height - pad} Z`;

  const baselineY = baseline !== undefined ? yAt(baseline) : null;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      className={className}
      style={{ color, ...style }}
    >
      {baselineY !== null ? (
        <line
          x1={pad}
          y1={baselineY}
          x2={width - pad}
          y2={baselineY}
          stroke="var(--color-border, #e5e5e5)"
          strokeWidth={1}
          strokeDasharray="3,3"
        />
      ) : null}

      {shape === "area" && data.length > 1 ? (
        <path d={areaPath} fill={color} fillOpacity={0.15} stroke="none" />
      ) : null}

      {shape === "bar" ? (
        data.map((v, i) => {
          const barGap = 1;
          const barW = Math.max(1, innerW / data.length - barGap);
          const x = pad + i * (innerW / data.length);
          const y = yAt(v);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={height - pad - y}
              fill={color}
            />
          );
        })
      ) : data.length === 1 ? (
        <circle cx={xAt(0)} cy={yAt(data[0])} r={2.5} fill={color} />
      ) : (
        <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {showDots && shape !== "bar"
        ? data.map((v, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(v)} r={1.5} fill={color} />
          ))
        : null}

      {markLast && shape !== "bar" && data.length > 0 ? (
        <circle
          cx={xAt(data.length - 1)}
          cy={yAt(data[data.length - 1])}
          r={2.5}
          fill={color}
        />
      ) : null}
    </svg>
  );
}
