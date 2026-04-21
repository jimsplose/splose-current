"use client";

import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

type HintIconTone = "default" | "inverted";
type HintIconSize = "sm" | "md" | "lg";

const toneColor: Record<HintIconTone, string> = {
  default: "var(--color-text-quaternary)",
  inverted: "rgba(255,255,255,0.8)",
};

const sizePx: Record<HintIconSize, number> = {
  sm: 12,
  md: 14,
  lg: 20,
};

interface HintIconProps {
  tooltip?: string;
  className?: string;
  style?: React.CSSProperties;
  tone?: HintIconTone;
  size?: HintIconSize;
}

export default function HintIcon({ tooltip, className, style, tone = "default", size = "md" }: HintIconProps) {
  return (
    <Tooltip title={tooltip}>
      <InfoCircleOutlined
        className={className}
        style={{ fontSize: sizePx[size], color: toneColor[tone], cursor: "help", marginLeft: 2, ...style }}
      />
    </Tooltip>
  );
}
