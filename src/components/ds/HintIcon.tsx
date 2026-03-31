"use client";

import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface HintIconProps {
  tooltip?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function HintIcon({ tooltip, className, style }: HintIconProps) {
  return (
    <Tooltip title={tooltip}>
      <InfoCircleOutlined
        className={className}
        style={{ fontSize: 14, color: "var(--color-text-quaternary)", cursor: "help", marginLeft: 2, ...style }}
      />
    </Tooltip>
  );
}
