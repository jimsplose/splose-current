"use client";

import { Statistic } from "antd";
import Text from "./Text";

interface StatProps {
  value: React.ReactNode;
  label: string;
  description?: string;
  align?: "center" | "left";
  color?: string;
  valueStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

export default function Stat({ value, label, description, align = "left", color, valueStyle, className, style }: StatProps) {
  const mergedValueStyle = { ...(color ? { color } : {}), ...valueStyle };
  return (
    <div style={{ textAlign: align, ...style }} className={className}>
      <Statistic
        title={label}
        value={typeof value === "string" || typeof value === "number" ? value : undefined}
        formatter={typeof value !== "string" && typeof value !== "number" ? () => value : undefined}
        valueStyle={Object.keys(mergedValueStyle).length > 0 ? mergedValueStyle : undefined}
      />
      {description && (
        <Text variant="caption/md" color="secondary" style={{ marginTop: 4 }}>{description}</Text>
      )}
    </div>
  );
}
