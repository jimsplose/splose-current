"use client";

import { Card as AntCard } from "antd";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  headerBar?: boolean;
  className?: string;
  style?: React.CSSProperties;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap: Record<string, number> = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 20,
};

export default function Card({ children, title, headerBar, className, style, padding = "md" }: CardProps) {
  const showAntTitle = title && headerBar;

  return (
    <AntCard
      title={showAntTitle ? title : undefined}
      className={className}
      style={style}
      styles={{
        body: { padding: paddingMap[padding] },
        header: headerBar ? { backgroundColor: "var(--color-fill-alter)" } : undefined,
      }}
    >
      {title && !headerBar && (
        <h3 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>{title}</h3>
      )}
      {children}
    </AntCard>
  );
}
