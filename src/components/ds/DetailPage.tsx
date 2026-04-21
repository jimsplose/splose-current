"use client";

import { type ReactNode } from "react";
import { Flex } from "antd";
import Text from "./Text";

interface DetailPageProps {
  /** Page title */
  title: ReactNode;
  /** Optional subtitle (e.g. client email, invoice number) */
  subtitle?: ReactNode;
  /** Action buttons in the header */
  actions?: ReactNode;
  /** Tab bar component rendered below the header */
  tabs?: ReactNode;
  /** Optional sidebar content — rendered on the right */
  sidebar?: ReactNode;
  /** Width of the sidebar when provided. Default 320px. */
  sidebarWidth?: number;
  /** Main content area */
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function DetailPage({
  title,
  subtitle,
  actions,
  tabs,
  sidebar,
  sidebarWidth = 320,
  children,
  className,
  style,
}: DetailPageProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", ...style }}
      className={className}
    >
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)" }}>
        <Flex justify="space-between" align="center" gap={12}>
          <div>
            <Text variant="page-title">{title}</Text>
            {subtitle && (
              <div style={{ marginTop: 4, fontSize: 14, color: "var(--color-text-secondary)" }}>
                {subtitle}
              </div>
            )}
          </div>
          {actions && <Flex align="center" gap={8}>{actions}</Flex>}
        </Flex>
      </div>

      {/* Tab bar */}
      {tabs && (
        <div style={{ borderBottom: "1px solid var(--color-border)", padding: "0 24px" }}>
          {tabs}
        </div>
      )}

      {/* Body: content + optional sidebar */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </div>
        {sidebar && (
          <div
            style={{
              width: sidebarWidth,
              flexShrink: 0,
              borderLeft: "1px solid var(--color-border)",
              overflowY: "auto",
              padding: 24,
            }}
          >
            {sidebar}
          </div>
        )}
      </div>
    </div>
  );
}
