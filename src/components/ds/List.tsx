"use client";

import type { ReactNode } from "react";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import HintIcon from "./HintIcon";

export interface ListItem {
  label: string;
  value: ReactNode;
  /** Optional explanatory hint — rendered as a `HintIcon` beside the label. */
  hint?: string;
  /** When true, shows a pencil button at the end of the row. Calls `onEdit`. */
  editable?: boolean;
  onEdit?: () => void;
}

export interface ListProps {
  items: ListItem[];
  layout?: "horizontal" | "stacked";
  /** Pixel number or CSS length for the label column width in horizontal layout. */
  labelWidth?: number | string;
  /** Hairline between rows. Default `false`. */
  divider?: boolean;
  /** Halves vertical padding for dense attribute grids. */
  tight?: boolean;
  /** Underlying DOM semantic. `"dl"` (default) renders `<dl>/<dt>/<dd>` for screen-reader
   *  association. `"div"` is an escape hatch for non-attribute shapes (stat rows, glossaries). */
  semantic?: "dl" | "div";
  className?: string;
}

function toLength(value: number | string | undefined): string {
  if (value === undefined) return "112px";
  return typeof value === "number" ? `${value}px` : value;
}

function EditButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button
      type="text"
      size="small"
      aria-label={`Edit ${label}`}
      onClick={onClick}
      icon={<EditOutlined style={{ fontSize: 14, color: "var(--ant-color-text-secondary, #6E6E64)" }} />}
    />
  );
}

/**
 * Label/value attribute list. Renders `<dl>/<dt>/<dd>` by default for
 * programmatic screen-reader association. Layouts: `horizontal` (default,
 * label column + value column) and `stacked` (label above value, mobile-
 * friendly). Set `divider` for hairline separators, `tight` for dense
 * grids. Per-row `hint` surfaces a HintIcon beside the label; `editable`
 * renders a pencil button that triggers `onEdit`. Use `semantic="div"` to
 * opt out of the `<dl>` semantics for glossary/stat use cases.
 */
export default function List({
  items,
  labelWidth,
  className,
  layout = "horizontal",
  divider = false,
  tight = false,
  semantic = "dl",
}: ListProps) {
  const isDl = semantic === "dl";
  const Wrapper = (isDl ? "dl" : "div") as "dl" | "div";
  const LabelEl = (isDl ? "dt" : "div") as "dt" | "div";
  const ValueEl = (isDl ? "dd" : "div") as "dd" | "div";

  const stacked = layout === "stacked";
  const rowPadding = tight ? "4px 0" : stacked ? "0" : "8px 0";
  const rowGap = tight ? 8 : stacked ? 16 : 12;
  const dlResetStyle = { margin: 0 };

  return (
    <Wrapper
      className={className}
      style={{
        ...dlResetStyle,
        display: "flex",
        flexDirection: "column",
        gap: stacked ? rowGap : 0,
      }}
    >
      {items.map((item, i) => {
        const showDivider = divider && i > 0;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: stacked ? "column" : "row",
              alignItems: stacked ? "flex-start" : "center",
              gap: stacked ? 2 : 16,
              padding: rowPadding,
              borderTop: showDivider ? "1px solid var(--color-border-subtle, #f0f0f0)" : undefined,
            }}
          >
            <LabelEl
              style={{
                ...dlResetStyle,
                minWidth: stacked ? undefined : toLength(labelWidth),
                width: stacked ? undefined : toLength(labelWidth),
                flexShrink: 0,
                fontSize: stacked ? 14 : 14,
                fontWeight: stacked ? 500 : 400,
                color: stacked
                  ? "var(--color-text, #414549)"
                  : "var(--color-text-secondary, #6E6E64)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                lineHeight: 1.4,
              }}
            >
              <span>{item.label}</span>
              {item.hint ? <HintIcon tooltip={item.hint} size="sm" /> : null}
            </LabelEl>
            <ValueEl
              style={{
                ...dlResetStyle,
                flex: 1,
                fontSize: 14,
                color: stacked
                  ? "var(--color-text-secondary, #6E6E64)"
                  : "var(--color-text, #414549)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                minWidth: 0,
              }}
            >
              <span style={{ minWidth: 0, flex: 1 }}>
                {item.value === null || item.value === undefined || item.value === "" ? "—" : item.value}
              </span>
              {item.editable ? (
                <EditButton label={item.label} onClick={item.onEdit} />
              ) : null}
            </ValueEl>
          </div>
        );
      })}
    </Wrapper>
  );
}
