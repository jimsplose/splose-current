"use client";

import { Tooltip as AntTooltip } from "antd";
import type { ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  /** Trigger element. AntD clones it with hover/focus handlers. */
  children: ReactNode;
  /** Label text or small node rendered in the tooltip body. */
  content: ReactNode;
  /** Side of the trigger the tooltip opens on. Default `top`. */
  side?: TooltipSide;
  /** Alignment along the trigger edge. Default `center`. */
  align?: TooltipAlign;
  /** Milliseconds before the tooltip opens on hover. Default 200. */
  delay?: number;
  /** Suppress the tooltip even on hover/focus. Useful for conditional labels. */
  disabled?: boolean;
}

const placementMap: Record<TooltipSide, Record<TooltipAlign, string>> = {
  top: { start: "topLeft", center: "top", end: "topRight" },
  right: { start: "rightTop", center: "right", end: "rightBottom" },
  bottom: { start: "bottomLeft", center: "bottom", end: "bottomRight" },
  left: { start: "leftTop", center: "left", end: "leftBottom" },
};

/**
 * Lightweight label overlay for hover/focus — icon-only buttons, truncated
 * text, abbreviations. For long-form help content use `HintIcon`. The tooltip
 * is supplementary; never rely on it as the only way to convey critical info
 * (touch users won't see it).
 *
 * Wraps AntD `Tooltip`. Renames `title` → `content` and splits `placement`
 * into `side` + `align` so the API matches the Radix mental model. Strips
 * AntD's `arrow`, `color`, `fresh`, `getPopupContainer`, and open-control
 * props — consumers needing those should reach for Radix or AntD directly.
 */
export default function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 200,
  disabled,
}: TooltipProps) {
  if (disabled) return <>{children}</>;

  return (
    <AntTooltip
      title={content}
      placement={placementMap[side][align] as never}
      mouseEnterDelay={delay / 1000}
      mouseLeaveDelay={0}
    >
      {children}
    </AntTooltip>
  );
}
