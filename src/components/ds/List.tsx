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
  layout?: "horizontal" | "stacked";
}

export default function List({ items, labelWidth, className, layout = "horizontal" }: ListProps) {
  if (layout === "stacked") {
    return (
      <Flex vertical gap={16} className={className}>
        {items.map((item, i) => (
          <div key={i}>
            <div className="text-label-lg" style={{ color: "var(--color-text)", marginBottom: 2 }}>
              {item.label}
            </div>
            <div className="text-body-md" style={{ color: "var(--color-text-secondary)" }}>
              {item.value}
            </div>
          </div>
        ))}
      </Flex>
    );
  }

  return (
    <AntList
      className={className}
      dataSource={items}
      split={false}
      renderItem={(item) => (
        <AntList.Item style={{ padding: "4px 0", border: "none" }}>
          <Flex gap={64}>
            <span style={{ width: labelWidth || 112, flexShrink: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>
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
