"use client";

import { Dropdown as AntDropdown, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

export interface DropdownItem {
  label: string;
  value: string;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

export function DropdownTriggerButton() {
  return (
    <Button type="text" icon={<EllipsisOutlined />} size="small" />
  );
}

function toMenuItems(items: DropdownItem[]): MenuProps["items"] {
  return items.map((item) => {
    if (item.divider) {
      return { type: "divider" as const, key: item.value };
    }
    return {
      key: item.value,
      label: item.label,
      danger: item.danger,
    };
  });
}

export default function Dropdown({ trigger, items, onSelect, align = "left", className }: DropdownProps) {
  const menuProps: MenuProps = {
    items: toMenuItems(items),
    onClick: ({ key }) => onSelect(key),
  };

  return (
    <AntDropdown
      menu={menuProps}
      trigger={["click"]}
      placement={align === "right" ? "bottomRight" : "bottomLeft"}
      className={className}
    >
      <span style={{ cursor: "pointer" }}>{trigger}</span>
    </AntDropdown>
  );
}
