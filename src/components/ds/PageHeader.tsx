import { Flex } from "antd";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <Flex justify="space-between" align="center" wrap="wrap" gap={12} style={{ marginTop: 4, marginBottom: 16 }}>
      <h1 style={{ fontSize: 30, fontWeight: 700, fontFamily: "'Sprig Sans', 'Inter', sans-serif", lineHeight: 1.2 }}>{title}</h1>
      {children && <Flex align="center" gap={8}>{children}</Flex>}
    </Flex>
  );
}
