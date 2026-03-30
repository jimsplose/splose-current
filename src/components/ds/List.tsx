"use client";

import { List as AntList, Flex } from "antd";

interface ListItem {
  label: string;
  value: React.ReactNode;
}

interface ListProps {
  items: ListItem[];
  labelWidth?: string;
  className?: string;
}

export default function List({ items, labelWidth, className }: ListProps) {
  return (
    <AntList
      className={className}
      dataSource={items}
      split={false}
      renderItem={(item) => (
        <AntList.Item style={{ padding: "4px 0", border: "none" }}>
          <Flex gap={64}>
            <span style={{ width: labelWidth || 112, flexShrink: 0, fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
              {item.label}
            </span>
            <span style={{ fontSize: 14 }}>
              {item.value}
            </span>
          </Flex>
        </AntList.Item>
      )}
    />
  );
}
