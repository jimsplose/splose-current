"use client";

import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface HintIconProps {
  tooltip?: string;
  className?: string;
}

export default function HintIcon({ tooltip, className }: HintIconProps) {
  return (
    <Tooltip title={tooltip}>
      <InfoCircleOutlined
        className={className}
        style={{ fontSize: 14, color: "var(--ant-color-text-quaternary)", cursor: "help", marginLeft: 2 }}
      />
    </Tooltip>
  );
}
