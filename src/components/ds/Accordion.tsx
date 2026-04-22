"use client";

import { Collapse as AntCollapse } from "antd";
import type { ReactNode } from "react";

export type AccordionType = "single" | "multiple";
export type AccordionTone = "default" | "subtle";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** `"multiple"` (default) allows any subset open; `"single"` allows only one. */
  type?: AccordionType;
  /** In single mode, whether the open item can close. Default `true`. */
  collapsible?: boolean;
  /** Controlled open-key list. */
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** Hairline between rows. Default `true`. */
  divider?: boolean;
  /** `default` = card-shell accordion; `subtle` = borderless for use inside a Card. */
  tone?: AccordionTone;
  className?: string;
}

function renderHeader(item: AccordionItem) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      {item.icon ? (
        <span style={{ display: "inline-flex", flexShrink: 0 }}>{item.icon}</span>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-text, #414549)",
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </span>
        {item.description ? (
          <span
            style={{
              fontSize: 13,
              color: "var(--color-text-secondary, #6E6E64)",
              lineHeight: 1.4,
            }}
          >
            {item.description}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Vertical stack of expandable panels for long forms, FAQs, and "additional
 * details" disclosures. Each row has a `title`, optional `description`
 * and leading `icon`; `children` is the panel body. Use
 * `type="single"` for mutually-exclusive sections, `"multiple"` (default)
 * for any-subset. Set `tone="subtle"` when nesting inside a `Card` for
 * a borderless look. Controlled via `value`/`onValueChange`.
 */
export default function Accordion({
  items,
  type = "multiple",
  collapsible = true,
  value,
  onValueChange,
  divider = true,
  tone = "default",
  className,
}: AccordionProps) {
  const defaultActive = items.filter((i) => i.defaultOpen).map((i) => i.id);
  const accordion = type === "single";

  const activeKey = value !== undefined ? value : undefined;

  return (
    <AntCollapse
      activeKey={activeKey as never}
      defaultActiveKey={activeKey === undefined ? defaultActive : undefined}
      onChange={(keys) => {
        if (!onValueChange) return;
        if (accordion) {
          onValueChange(Array.isArray(keys) ? keys[0] ?? "" : keys);
        } else {
          onValueChange(Array.isArray(keys) ? keys : [keys]);
        }
      }}
      accordion={accordion && !collapsible ? true : accordion}
      bordered={tone !== "subtle"}
      expandIconPosition="end"
      className={className}
      style={{
        backgroundColor: tone === "subtle" ? "transparent" : undefined,
      }}
      items={items.map((item) => ({
        key: item.id,
        label: renderHeader(item),
        children: item.children,
        collapsible: item.disabled ? "disabled" : undefined,
        showArrow: true,
        style: divider
          ? undefined
          : { borderBottom: "none", marginBottom: 4 },
      }))}
    />
  );
}
