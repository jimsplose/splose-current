"use client";

import { Statistic } from "antd";

interface StatProps {
  value: React.ReactNode;
  label: string;
  className?: string;
}

export default function Stat({ value, label, className }: StatProps) {
  return (
    <div style={{ textAlign: "center" }} className={className}>
      <Statistic
        title={label}
        value={typeof value === "string" || typeof value === "number" ? value : undefined}
        formatter={typeof value !== "string" && typeof value !== "number" ? () => value : undefined}
      />
    </div>
  );
}
