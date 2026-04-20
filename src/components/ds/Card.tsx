"use client";

import { Card as AntCard } from "antd";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  headerBar?: boolean;
  className?: string;
  style?: React.CSSProperties;
  padding?: "none" | "sm" | "md" | "lg" | "xl" | number;
  shadow?: boolean;
  tint?: "default" | "subtle" | "muted";
  interactive?: boolean;
  variant?: "default" | "dashed";
  onClick?: () => void;
}

const paddingMap: Record<string, number> = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 25,
};

const tintBg: Record<string, string> = {
  default: "",
  subtle: "var(--color-fill-secondary)",
  muted: "var(--color-fill-tertiary)",
};

export default function Card({
  children,
  title,
  headerBar,
  className,
  style,
  padding = "md",
  shadow,
  tint = "default",
  interactive = false,
  variant = "default",
  onClick,
}: CardProps) {
  const resolvedPadding = typeof padding === "number" ? padding : paddingMap[padding];
  const bg = tintBg[tint];
  const borderStyle =
    variant === "dashed"
      ? "2px dashed var(--color-border)"
      : undefined;

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          borderRadius: 8,
          border: borderStyle ?? "1px solid var(--color-border)",
          backgroundColor: bg || "transparent",
          padding: resolvedPadding,
          transition: "all 0.2s",
          ...(shadow ? { boxShadow: "0 1px 2px rgba(0,0,0,0.05)" } : {}),
          ...style,
        }}
      >
        {children}
      </button>
    );
  }

  const mergedStyle: React.CSSProperties = {
    ...(shadow ? { boxShadow: "0 1px 2px rgba(0,0,0,0.05)" } : {}),
    ...(borderStyle ? { border: borderStyle } : {}),
    ...(bg ? { backgroundColor: bg } : {}),
    ...style,
  };

  return (
    <AntCard
      title={title && headerBar ? title : undefined}
      className={className}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
      styles={{
        body: { padding: resolvedPadding },
        header: headerBar ? { backgroundColor: "var(--color-fill-alter)" } : undefined,
      }}
      onClick={onClick}
    >
      {title && !headerBar && (
        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>{title}</h3>
      )}
      {children}
    </AntCard>
  );
}
