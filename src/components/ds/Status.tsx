"use client";

import { Badge, Flex } from "antd";

type StatusColor = "green" | "red" | "yellow" | "blue" | "gray" | "purple" | "orange";

interface StatusProps {
  color?: StatusColor;
  label?: string;
  className?: string;
}

const colorMap: Record<StatusColor, string> = {
  green: "#00C269",
  red: "#D00032",
  yellow: "#FFD232",
  blue: "#5578FF",
  gray: "#b8bcc0",
  purple: "#8250FF",
  orange: "#f97316",
};

export default function Status({ color = "gray", label, className }: StatusProps) {
  return (
    <Flex align="center" gap={8} className={className}>
      <Badge color={colorMap[color]} />
      {label && <span style={{ fontSize: 14 }}>{label}</span>}
    </Flex>
  );
}
