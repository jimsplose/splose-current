"use client";

import { Card as AntCard } from "antd";
import type { ReactNode, CSSProperties } from "react";

export type FeatureCardTone = "primary" | "success" | "neutral" | "inverted";

export interface FeatureCardProps {
  children: ReactNode;
  tone?: FeatureCardTone;
  style?: CSSProperties;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg" | "xl" | number;
}

const paddingMap: Record<string, number> = { none: 0, sm: 12, md: 16, lg: 20, xl: 25 };

const toneStyles: Record<FeatureCardTone, { bg?: string; color?: string }> = {
  primary:  { bg: "var(--color-primary)",  color: "white" },
  success:  { bg: "var(--color-success)",  color: "white" },
  neutral:  {},
  inverted: { bg: "#1f2937",              color: "white" },
};

export default function FeatureCard({ children, tone = "neutral", style, className, padding = "md" }: FeatureCardProps) {
  const { bg, color } = toneStyles[tone];
  const bodyPadding = typeof padding === "number" ? padding : paddingMap[padding];

  return (
    <AntCard
      className={className}
      style={{ ...(bg ? { backgroundColor: bg, border: "none" } : {}), ...style }}
      styles={{ body: { padding: bodyPadding, ...(color ? { color } : {}) } }}
    >
      {children}
    </AntCard>
  );
}
