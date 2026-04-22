"use client";

import { Dropdown } from "antd";
import { RightOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import Icon from "./Icon";

export interface BreadcrumbItem {
  label: string;
  /** Present => rendered as a link. Omit on the current page. */
  href?: string;
  /** Leading icon (e.g. Home on the root). */
  icon?: ReactNode;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /** Defaults to a chevron Icon. Pass "/" or "›" for a text separator. */
  separator?: ReactNode;
  /** When set, collapses middle entries behind an overflow `...` button. */
  maxItems?: number;
  /** Where to fold items when maxItems is exceeded. Default `"middle"`. */
  overflowDirection?: "head" | "middle" | "tail";
  className?: string;
}

const defaultSeparator = (
  <Icon as={RightOutlined} size="xs" tone="tertiary" />
);

function Link({ item, current }: { item: BreadcrumbItem; current: boolean }) {
  if (current) {
    return (
      <span
        aria-current="page"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--color-text, #414549)",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {item.icon ? (
          <span aria-hidden style={{ display: "inline-flex" }}>{item.icon}</span>
        ) : null}
        {item.label}
      </span>
    );
  }
  return (
    <a
      href={item.href}
      style={{
        fontSize: 12,
        fontWeight: 400,
        color: "var(--color-text-secondary, #6E6E64)",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {item.icon ? (
        <span aria-hidden style={{ display: "inline-flex" }}>{item.icon}</span>
      ) : null}
      {item.label}
    </a>
  );
}

/**
 * Horizontal path indicator for deep hierarchies, nested settings, batch
 * flows. Last item is the current page (rendered with `aria-current`).
 * Preceding items link back up the tree. Supply `maxItems` to collapse
 * middle entries behind an overflow `...` dropdown. Use a Breadcrumb
 * inside (or above) `PageHeader` / `Navbar` — do not stack both back-
 * links and breadcrumbs on the same page.
 */
export default function Breadcrumbs({
  items,
  separator = defaultSeparator,
  maxItems,
  overflowDirection = "middle",
  className,
}: BreadcrumbsProps) {
  const visible: Array<BreadcrumbItem | { overflow: BreadcrumbItem[] }> = [];

  if (maxItems && items.length > maxItems) {
    const overflowCount = items.length - maxItems + 1;
    if (overflowDirection === "head") {
      visible.push({ overflow: items.slice(0, overflowCount) });
      visible.push(...items.slice(overflowCount));
    } else if (overflowDirection === "tail") {
      visible.push(...items.slice(0, maxItems - 1));
      visible.push({ overflow: items.slice(maxItems - 1) });
    } else {
      // middle
      const keepHead = 1;
      const keepTail = maxItems - 2;
      visible.push(...items.slice(0, keepHead));
      visible.push({ overflow: items.slice(keepHead, items.length - keepTail) });
      visible.push(...items.slice(items.length - keepTail));
    }
  } else {
    visible.push(...items);
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        {visible.map((node, i) => {
          const isLast = i === visible.length - 1;
          const separatorNode = !isLast ? (
            <span
              aria-hidden
              style={{
                display: "inline-flex",
                color: "var(--color-text-tertiary, #a5a59e)",
              }}
            >
              {separator}
            </span>
          ) : null;

          if ("overflow" in node) {
            return (
              <li
                key={`ov-${i}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Dropdown
                  menu={{
                    items: node.overflow.map((it, j) => ({
                      key: j,
                      label: it.href ? <a href={it.href}>{it.label}</a> : it.label,
                    })),
                  }}
                  trigger={["click"]}
                >
                  <button
                    type="button"
                    aria-label="Show hidden breadcrumbs"
                    style={{
                      border: "none",
                      background: "transparent",
                      padding: "0 4px",
                      color: "var(--color-text-secondary, #6E6E64)",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    …
                  </button>
                </Dropdown>
                {separatorNode}
              </li>
            );
          }

          return (
            <li
              key={i}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Link item={node} current={isLast} />
              {separatorNode}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
