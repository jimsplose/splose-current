"use client";

import { Spin } from "antd";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<string, "small" | "default" | "large"> = {
  sm: "small",
  md: "default",
  lg: "large",
};

export default function Spinner({ size = "md", className }: SpinnerProps) {
  return <Spin size={sizeMap[size]} className={className} />;
}
