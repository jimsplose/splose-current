"use client";

import { Collapse as AntCollapse } from "antd";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Collapse({ title, children, defaultOpen = false, className }: CollapseProps) {
  return (
    <AntCollapse
      defaultActiveKey={defaultOpen ? ["1"] : []}
      className={className}
      bordered={false}
      expandIconPosition="end"
      items={[
        {
          key: "1",
          label: title,
          children,
        },
      ]}
    />
  );
}
