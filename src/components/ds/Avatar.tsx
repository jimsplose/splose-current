"use client";

import { Avatar as AntAvatar } from "antd";
import { theme } from "antd";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 28,
  md: 40,
  lg: 48,
  xl: 56,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, color, size = "md", className }: AvatarProps) {
  const { token } = theme.useToken();

  return (
    <AntAvatar
      size={sizeMap[size]}
      className={className}
      style={{ backgroundColor: color || token.colorPrimary, flexShrink: 0 }}
    >
      {getInitials(name)}
    </AntAvatar>
  );
}
