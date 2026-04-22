"use client";

import { Popover } from "antd";
import type { ReactNode } from "react";

export type HoverCardSide = "top" | "right" | "bottom" | "left";
export type HoverCardAlign = "start" | "center" | "end";

export interface HoverCardProps {
  children: ReactNode;
  content: ReactNode;
  side?: HoverCardSide;
  align?: HoverCardAlign;
  /** ms before open on hover. Default 400 (generous, avoids accidental pops). */
  openDelay?: number;
  /** ms before close on hover-out. Default 200 (grace period to move cursor into card). */
  closeDelay?: number;
  disabled?: boolean;
  className?: string;
}

const placementMap: Record<HoverCardSide, Record<HoverCardAlign, string>> = {
  top: { start: "topLeft", center: "top", end: "topRight" },
  right: { start: "rightTop", center: "right", end: "rightBottom" },
  bottom: { start: "bottomLeft", center: "bottom", end: "bottomRight" },
  left: { start: "leftTop", center: "left", end: "leftBottom" },
};

/**
 * Richer-than-Tooltip hover preview. Hover-only — never fires on focus
 * (keyboard users must reach the same info through the trigger link/
 * affordance). For single-line labels use `Tooltip`; for click-revealed
 * content use `Popover`. Content is always supplementary — never put
 * essential information here, since touch + keyboard users won't see it.
 */
export default function HoverCard({
  children,
  content,
  side = "top",
  align = "center",
  openDelay = 400,
  closeDelay = 200,
  disabled,
  className,
}: HoverCardProps) {
  if (disabled) return <>{children}</>;
  return (
    <Popover
      content={content}
      trigger="hover"
      placement={placementMap[side][align] as never}
      mouseEnterDelay={openDelay / 1000}
      mouseLeaveDelay={closeDelay / 1000}
      overlayClassName={className}
      overlayInnerStyle={{
        borderRadius: 8,
        border: "1px solid var(--color-border, #e5e5e5)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.10)",
        maxWidth: 320,
        padding: "12px 16px",
      }}
    >
      {children}
    </Popover>
  );
}
