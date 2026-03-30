"use client";

import { theme, Flex } from "antd";

interface FileUploadProps {
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export default function FileUpload({ icon, label = "Upload", className, onClick }: FileUploadProps) {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={12}
      className={className}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      style={{
        padding: 24,
        borderRadius: token.borderRadius,
        border: `2px dashed ${token.colorBorder}`,
        backgroundColor: token.colorFillTertiary,
        cursor: onClick ? "pointer" : undefined,
        transition: "border-color 0.2s, background-color 0.2s",
      }}
    >
      {icon && <div>{icon}</div>}
      {label && (
        <span style={{
          padding: "6px 16px",
          borderRadius: token.borderRadius,
          border: `1px solid ${token.colorBorder}`,
          backgroundColor: token.colorBgContainer,
          fontSize: 14,
          fontWeight: 500,
        }}>
          {label}
        </span>
      )}
    </Flex>
  );
}
