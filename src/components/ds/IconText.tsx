import { Flex } from "antd";

interface IconTextProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function IconText({ icon, children, className }: IconTextProps) {
  return (
    <Flex align="center" gap={8} className={className} style={{ fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span>{children}</span>
    </Flex>
  );
}
