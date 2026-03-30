"use client";

import { Flex, theme } from "antd";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function EmptyState({ icon, title, message, action, className, style }: EmptyStateProps) {
  const { token } = theme.useToken();

  return (
    <Flex vertical align="center" justify="center" className={className} style={{ padding: "64px 0", ...style }}>
      {icon && (
        <div style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: token.colorFillTertiary,
        }}>
          {icon}
        </div>
      )}
      {title && <h3 style={{ marginBottom: 4, fontSize: 14, fontWeight: 600 }}>{title}</h3>}
      <p style={{ fontSize: 14, color: token.colorTextSecondary }}>{message}</p>
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </Flex>
  );
}
