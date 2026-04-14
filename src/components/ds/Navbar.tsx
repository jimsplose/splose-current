"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Flex, theme } from "antd";

interface NavbarProps {
  backHref?: string;
  title: string;
  /** When provided, shows a purple text link instead of the arrow icon */
  backLabel?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Navbar({ backHref, title, backLabel, badge, children }: NavbarProps) {
  const { token } = theme.useToken();

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        borderBottom: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer,
        padding: "12px 24px",
      }}
    >
      <Flex align="center" gap={12}>
        {backLabel && backHref ? (
          <Link href={backHref} style={{ color: "var(--color-primary)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            {backLabel}
          </Link>
        ) : (
          <>
            {backHref && (
              <Link href={backHref} style={{ color: token.colorTextSecondary, display: "flex", alignItems: "center" }}>
                <ArrowLeftOutlined style={{ fontSize: 14 }} />
              </Link>
            )}
            <h1 style={{ fontSize: 30, fontWeight: 700, color: "rgb(66, 105, 74)", fontFamily: "'Sprig Sans', 'Inter', sans-serif", lineHeight: 1.2 }}>{title}</h1>
            {badge}
          </>
        )}
      </Flex>
      {children && <Flex align="center" gap={8}>{children}</Flex>}
    </Flex>
  );
}
