"use client";

import { Drawer as AntDrawer } from "antd";
import type { ReactNode } from "react";

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "xl";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  /** Fixed size token or explicit pixel number for width (left/right) or height (top/bottom). */
  size?: DrawerSize | number;
  title?: string;
  description?: string;
  /** Adds a muted fill to the header region. */
  headerBar?: boolean;
  /** Sticky footer slot — typically an action button row. */
  footer?: ReactNode;
  children: ReactNode;
  /** Default `true`. */
  dismissOnOverlayClick?: boolean;
  /** Default `true`. */
  dismissOnEsc?: boolean;
  className?: string;
}

const sizeMap: Record<DrawerSize, number> = {
  sm: 320,
  md: 400,
  lg: 560,
  xl: 720,
};

const placementMap: Record<DrawerSide, "left" | "right" | "top" | "bottom"> = {
  left: "left",
  right: "right",
  top: "top",
  bottom: "bottom",
};

/**
 * Edge-anchored overlay panel for secondary surfaces — appointment side
 * views, filter trays, help sheets. Unlike `Modal` the underlying page
 * stays visible and contextual. Four sides, four size tokens
 * (sm=320, md=400, lg=560, xl=720 — pass a number to override). Focus
 * trap, Escape-to-close, body scroll lock and overlay dismiss are wired
 * via AntD. Use the `footer` slot for sticky action rows.
 */
export default function Drawer({
  open,
  onClose,
  side = "right",
  size = "md",
  title,
  description,
  headerBar,
  footer,
  children,
  dismissOnOverlayClick = true,
  dismissOnEsc = true,
  className,
}: DrawerProps) {
  const dim = typeof size === "number" ? size : sizeMap[size];
  const placement = placementMap[side];
  const isHorizontal = placement === "left" || placement === "right";

  return (
    <AntDrawer
      open={open}
      onClose={onClose}
      placement={placement}
      width={isHorizontal ? dim : undefined}
      height={!isHorizontal ? dim : undefined}
      maskClosable={dismissOnOverlayClick}
      keyboard={dismissOnEsc}
      className={className}
      styles={{
        header: headerBar
          ? {
              backgroundColor: "var(--color-fill-alter, #fafafa)",
              borderBottom: "1px solid var(--color-border, #e5e5e5)",
            }
          : { borderBottom: "1px solid var(--color-border, #e5e5e5)" },
        body: { padding: 20 },
      }}
      title={
        title || description ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {title ? (
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--color-text, #414549)" }}>
                {title}
              </span>
            ) : null}
            {description ? (
              <span style={{ fontSize: 13, fontWeight: 400, color: "var(--color-text-secondary, #6E6E64)" }}>
                {description}
              </span>
            ) : null}
          </div>
        ) : undefined
      }
      footer={
        footer ? (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--color-border, #e5e5e5)",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              background: "#fff",
            }}
          >
            {footer}
          </div>
        ) : null
      }
    >
      {children}
    </AntDrawer>
  );
}
