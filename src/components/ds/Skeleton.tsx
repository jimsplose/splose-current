"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./Skeleton.module.css";

export type SkeletonShape = "text" | "rect" | "circle";

export interface SkeletonProps {
  /** Shape of the placeholder. Default `text`. */
  shape?: SkeletonShape;
  /** Pixel number or CSS length (e.g. `"100%"`). */
  width?: number | string;
  /** Pixel number or CSS length. */
  height?: number | string;
  /** For `shape="text"`, render N stacked bars (last bar is 60% width for a ragged edge). */
  lines?: number;
  /** Disable the shimmer animation (also respected via `prefers-reduced-motion`). */
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}

function toLength(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function Bar({
  shape,
  width,
  height,
  animated,
  className,
  style,
}: {
  shape: SkeletonShape;
  width?: number | string;
  height?: number | string;
  animated: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const shapeClass =
    shape === "circle" ? styles.circle : shape === "rect" ? styles.rect : styles.text;
  return (
    <span
      aria-busy={animated ? true : undefined}
      className={[styles.root, shapeClass, className].filter(Boolean).join(" ")}
      style={{
        width: toLength(width),
        height: toLength(height),
        ...style,
      }}
    />
  );
}

/**
 * Neutral placeholder that occupies the same space as content while it loads.
 * Keep dimensions within ±2px of the real element to prevent layout shift.
 *
 * For long-form multi-line paragraphs use `Skeleton.Text lines={N}`. For
 * avatars use `Skeleton.Avatar size={N}`. For arbitrary rectangles
 * (images, cards) use `Skeleton.Block`. Wrap loading regions with
 * `Skeleton.Loading loaded={...}` to swap between placeholder and content
 * without conditional-render boilerplate at every call site.
 */
function Skeleton({
  shape = "text",
  width = "100%",
  height,
  lines = 1,
  animated = true,
  className,
  style,
}: SkeletonProps) {
  if (shape === "text" && lines > 1) {
    return (
      <span className={[styles.group, className].filter(Boolean).join(" ")} style={style}>
        {Array.from({ length: lines }).map((_, i) => {
          const isLast = i === lines - 1;
          return (
            <Bar
              key={i}
              shape="text"
              width={isLast ? "60%" : width}
              height={height ?? 14}
              animated={animated}
            />
          );
        })}
      </span>
    );
  }

  return (
    <Bar
      shape={shape}
      width={width}
      height={height ?? (shape === "text" ? 14 : undefined)}
      animated={animated}
      className={className}
      style={style}
    />
  );
}

/** Single- or multi-line text placeholder. */
function SkeletonText({
  lines = 1,
  width,
  animated = true,
  className,
  style,
}: {
  lines?: number;
  width?: number | string;
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Skeleton
      shape="text"
      lines={lines}
      width={width}
      animated={animated}
      className={className}
      style={style}
    />
  );
}

/** Circular avatar placeholder sized by diameter. */
function SkeletonAvatar({
  size = 36,
  animated = true,
  className,
  style,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Skeleton
      shape="circle"
      width={size}
      height={size}
      animated={animated}
      className={className}
      style={style}
    />
  );
}

/** Arbitrary rectangle placeholder — image thumbnails, card bodies, chart frames. */
function SkeletonBlock({
  width,
  height,
  animated = true,
  className,
  style,
}: {
  width?: number | string;
  height?: number | string;
  animated?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Skeleton
      shape="rect"
      width={width}
      height={height}
      animated={animated}
      className={className}
      style={style}
    />
  );
}

/**
 * Conditional wrapper: renders `children` when `loaded`, otherwise renders
 * the passed `fallback` (or a default block skeleton). Eliminates the
 * per-call conditional-render boilerplate.
 */
function SkeletonLoading({
  loaded,
  fallback,
  children,
}: {
  loaded: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  if (loaded) return <>{children}</>;
  return <>{fallback ?? <SkeletonBlock width="100%" height={20} />}</>;
}

type SkeletonComponent = typeof Skeleton & {
  Text: typeof SkeletonText;
  Avatar: typeof SkeletonAvatar;
  Block: typeof SkeletonBlock;
  Loading: typeof SkeletonLoading;
};

const Exported = Skeleton as SkeletonComponent;
Exported.Text = SkeletonText;
Exported.Avatar = SkeletonAvatar;
Exported.Block = SkeletonBlock;
Exported.Loading = SkeletonLoading;

export default Exported;
