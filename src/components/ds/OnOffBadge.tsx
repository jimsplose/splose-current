"use client";

import { theme } from "antd";

interface OnOffBadgeProps {
  value: boolean;
  onLabel?: string;
  offLabel?: string;
}

export default function OnOffBadge({ value, onLabel = "On", offLabel = "Off" }: OnOffBadgeProps) {
  const { token } = theme.useToken();
  return (
    <span style={{ color: value ? token.colorSuccess : token.colorError }}>
      {value ? onLabel : offLabel}
    </span>
  );
}
