"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Flex, theme } from "antd";
import Text from "./Text";

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
          <Button type="link" href={backHref}>
            {backLabel}
          </Button>
        ) : (
          <>
            {backHref && (
              <Link href={backHref} style={{ color: token.colorTextSecondary, display: "flex", alignItems: "center" }}>
                <ArrowLeftOutlined style={{ fontSize: 14 }} />
              </Link>
            )}
            <Text variant="page-title">{title}</Text>
            {badge}
          </>
        )}
      </Flex>
      {children && <Flex align="center" gap={8}>{children}</Flex>}
    </Flex>
  );
}
