"use client";

import { Table, Dropdown, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DropdownItem } from "./Dropdown";
import type { MenuProps } from "antd";
import type { Key, ReactNode } from "react";

// ─── Column Definition ─────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: string;
  title: string | ReactNode;
  dataIndex?: string | string[];
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sorter?: (a: T, b: T) => number;
  filters?: { text: string; value: string }[];
  onFilter?: (value: string, record: T) => boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  responsive?: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
  width?: number | string;
  fixed?: "left" | "right";
}

// ─── Props ──────────────────────────────────────────────────────────────────

export interface DataTableProps<T extends Record<string, unknown>> {
  columns?: DataTableColumn<T>[];
  dataSource?: T[];
  rowKey?: string | ((record: T) => Key);
  loading?: boolean;
  minWidth?: number | string;
  pagination?: false | {
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    showTotal?: (total: number, range: [number, number]) => string;
  };
  rowSelection?: {
    selectedRowKeys: Key[];
    onChange: (keys: Key[], rows: T[]) => void;
  };
  expandable?: {
    expandedRowRender: (record: T) => ReactNode;
    rowExpandable?: (record: T) => boolean;
  };
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    style?: React.CSSProperties;
  };
  /** Legacy: children-based rendering (Phase 3 migration to columns/dataSource) */
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  dataSource,
  rowKey = "id",
  loading,
  minWidth,
  pagination,
  rowSelection,
  expandable,
  onRow,
  children,
  className,
  style: styleProp,
}: DataTableProps<T>) {
  // Legacy mode: render as plain <table> when children are passed
  if (children) {
    return (
      <table className={className} style={{ width: "100%", ...(minWidth ? { minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth } : {}), ...styleProp }}>
        {children}
      </table>
    );
  }

  // New AntD Table mode
  const antColumns: ColumnsType<T> = (columns || []).map((col) => ({
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex ?? col.key,
    align: col.align,
    sorter: col.sortable ? (col.sorter ?? true) : undefined,
    filters: col.filters,
    onFilter: col.onFilter
      ? (value: boolean | Key, record: T) => col.onFilter!(String(value), record)
      : undefined,
    render: col.render
      ? (_value: unknown, record: T, index: number) => col.render!(_value, record, index)
      : undefined,
    responsive: col.responsive,
    width: col.width,
    fixed: col.fixed,
  }));

  return (
    <Table<T>
      columns={antColumns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      scroll={minWidth ? { x: typeof minWidth === "number" ? minWidth : undefined } : undefined}
      pagination={pagination === false ? false : pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: pagination.showSizeChanger,
        pageSizeOptions: pagination.pageSizeOptions?.map(String),
        showTotal: pagination.showTotal ?? ((total, range) => `${range[0]}-${range[1]} of ${total} items`),
      } : undefined}
      rowSelection={rowSelection ? {
        type: "checkbox",
        selectedRowKeys: rowSelection.selectedRowKeys,
        onChange: rowSelection.onChange as (keys: Key[], rows: T[]) => void,
      } : undefined}
      expandable={expandable ? {
        expandedRowRender: (record) => expandable.expandedRowRender(record),
        rowExpandable: expandable.rowExpandable,
      } : undefined}
      onRow={onRow ? (record, index) => onRow(record, index ?? 0) : undefined}
      className={className}
      size="middle"
    />
  );
}

// ─── Helper Components ──────────────────────────────────────────────────────

/** @deprecated Use DataTableColumn.render with <a> tag instead */
export function LinkCell({ children, href, onClick, className }: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  if (href) {
    return <a href={href} className={className} style={{ color: "var(--color-primary)" }}>{children}</a>;
  }
  return <button onClick={onClick} className={className} style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>{children}</button>;
}

/** @deprecated Use DataTableColumn with a render function that includes a Dropdown */
export function ActionsCell({ items, onSelect }: {
  items: DropdownItem[];
  onSelect?: (value: string) => void;
}) {
  const menuItems: MenuProps["items"] = items.map((item) =>
    item.divider
      ? { type: "divider" as const, key: item.value }
      : { key: item.value, label: item.label, danger: item.danger }
  );

  return (
    <Dropdown menu={{ items: menuItems, onClick: ({ key }) => onSelect?.(key) }} trigger={["click"]}>
      <Button type="text" icon={<EllipsisOutlined />} size="small" />
    </Dropdown>
  );
}

// Legacy sub-components — exported for backward compat during Phase 3 migration
/** @deprecated Use DataTable with columns prop */
export function TableHead({ children }: { children: ReactNode }) {
  return <thead><tr style={{ borderBottom: "1px solid var(--color-border)" }}>{children}</tr></thead>;
}
/** @deprecated Use DataTableColumn instead */
export function Th({ children, align = "left", className, hidden, sortable, sortDirection, onSort, style: styleProp }: { children?: ReactNode; align?: string; className?: string; hidden?: string; sortable?: boolean; sortDirection?: string | null; onSort?: () => void; filterable?: boolean; onFilter?: () => void; style?: React.CSSProperties }) {
  return <th style={{ padding: "16px", textAlign: align as React.CSSProperties["textAlign"], fontSize: 14, fontWeight: 600, lineHeight: "22px", color: "rgb(65, 69, 73)", backgroundColor: "#f3f5f7", ...styleProp }}>{children}</th>;
}
/** @deprecated Use DataTable with dataSource prop */
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}
/** @deprecated Use DataTableColumn.render instead */
export function Td({ children, align = "left", className, hidden, colSpan, style }: { children?: ReactNode; align?: string; className?: string; hidden?: string; colSpan?: number; style?: React.CSSProperties }) {
  return <td className={className} colSpan={colSpan} style={{ padding: "16px", textAlign: align as React.CSSProperties["textAlign"], fontSize: 14, color: "rgb(65, 69, 73)", ...style }}>{children}</td>;
}
/** @deprecated Use onRow prop instead */
export function Tr({ children, hover, clickable, selected, className, style: styleProp, ...props }: { children: ReactNode; hover?: boolean; clickable?: boolean; selected?: boolean; className?: string; style?: React.CSSProperties } & React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr style={{ cursor: clickable ? "pointer" : undefined, ...styleProp }} className={className} {...props}>{children}</tr>;
}
/** @deprecated Use expandable prop instead */
export function ExpandableRow({ children }: { children: ReactNode; expandContent: ReactNode; colSpan: number; expanded?: boolean; onToggle?: () => void; hover?: boolean; className?: string }) {
  return <tr>{children}</tr>;
}
