"use client";

import { Tag } from "antd";

type ChipVariant = "green" | "purple" | "yellow" | "blue" | "red" | "gray";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  onRemove?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const colorMap: Record<ChipVariant, string> = {
  green: "success",
  purple: "purple",
  yellow: "warning",
  blue: "processing",
  red: "error",
  gray: "default",
};

export default function Chip({ children, variant = "gray", onRemove, className, style: styleProp }: ChipProps) {
  return (
    <Tag
      color={colorMap[variant]}
      closable={!!onRemove}
      onClose={onRemove}
      className={className}
      style={{ borderRadius: 9999, padding: "4px 12px", fontSize: 14, fontWeight: 500, ...styleProp }}
    >
      {children}
    </Tag>
  );
}
