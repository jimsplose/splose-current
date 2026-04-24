"use client";

import { Dropdown } from "antd";
import { RightOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string[];
  tone?: "default" | "danger";
  disabled?: boolean;
  onSelect?: () => void;
  /** Render a divider AFTER this row. */
  divider?: boolean;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Suppress browser's native right-click menu on the target. Default `true`. */
  preserveBrowserMenu?: boolean;
  className?: string;
}

function toAntItem(item: ContextMenuItem): NonNullable<MenuProps["items"]>[number] {
  return {
    key: item.id,
    label: (
      <span style={{ display: "inline-flex", alignItems: "center", width: "100%" }}>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.shortcut?.length ? (
          <span
            style={{
              color: "var(--color-text-secondary, #6E6E64)",
              fontSize: 12,
              marginLeft: 12,
              display: "inline-flex",
              gap: 4,
            }}
          >
            {item.shortcut.map((k) => (
              <kbd
                key={k}
                style={{
                  padding: "1px 5px",
                  borderRadius: 4,
                  background: "var(--color-fill-secondary, #f4f5f5)",
                  fontSize: 11,
                  fontFamily: "inherit",
                }}
              >
                {k}
              </kbd>
            ))}
          </span>
        ) : null}
      </span>
    ),
    icon: item.icon,
    disabled: item.disabled,
    danger: item.tone === "danger",
    onClick: item.onSelect,
    children: item.submenu?.length
      ? item.submenu.map(toAntItem)
      : undefined,
    expandIcon: item.submenu?.length ? (
      <RightOutlined style={{ fontSize: 12 }} />
    ) : undefined,
  };
}

function flattenWithDividers(items: ContextMenuItem[]): NonNullable<MenuProps["items"]> {
  const out: NonNullable<MenuProps["items"]> = [];
  items.forEach((it, i) => {
    out.push(toAntItem(it));
    if (it.divider && i < items.length - 1) {
      out.push({ type: "divider", key: `${it.id}-div` });
    }
  });
  return out;
}

/**
 * Right-click (or long-press on touch) menu for contextual actions on a
 * target element — calendar slots, DataTable rows, notes. Wraps AntD
 * Dropdown with `trigger={['contextMenu']}`. Right-click is a power-user
 * alternative (per decision D3) — always keep a visible affordance for
 * the same actions. Set `preserveBrowserMenu={true}` on rich-text areas
 * where spell-check matters.
 */
export default function ContextMenu({
  children,
  items,
  disabled,
  onOpenChange,
  preserveBrowserMenu = false,
  className,
}: ContextMenuProps) {
  if (disabled) return <>{children}</>;

  return (
    <Dropdown
      menu={{ items: flattenWithDividers(items) }}
      trigger={["contextMenu"]}
      onOpenChange={onOpenChange}
      classNames={{ root: className }}
      styles={{ root: { minWidth: 200, maxWidth: 320 } }}
    >
      <span
        style={{ display: "contents" }}
        onContextMenu={(e) => {
          if (!preserveBrowserMenu) e.preventDefault();
        }}
      >
        {children}
      </span>
    </Dropdown>
  );
}
