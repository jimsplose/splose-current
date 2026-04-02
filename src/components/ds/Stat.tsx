"use client";

import { Statistic } from "antd";

interface StatProps {
  value: React.ReactNode;
  label: string;
  description?: string;
  align?: "center" | "left";
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Stat({ value, label, description, align = "left", color, className, style }: StatProps) {
  return (
    <div style={{ textAlign: align, ...style }} className={className}>
      <Statistic
        title={label}
        value={typeof value === "string" || typeof value === "number" ? value : undefined}
        formatter={typeof value !== "string" && typeof value !== "number" ? () => value : undefined}
        valueStyle={color ? { color } : undefined}
      />
      {description && (
        <p className="text-caption-md text-text-secondary" style={{ marginTop: 4 }}>{description}</p>
      )}
    </div>
  );
}
