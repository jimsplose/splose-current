"use client";

import { useState, Fragment } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react";
import Dropdown from "./Dropdown";
import type { DropdownItem } from "./Dropdown";

/* ─── DataTable wrapper ───────────────────────────────────────────────── */

interface DataTableProps {
  children: React.ReactNode;
  minWidth?: string;
  className?: string;
}

export default function DataTable({ children, minWidth, className = "" }: DataTableProps) {
  return (
    <table className={`w-full ${className}`} style={minWidth ? { minWidth } : undefined}>
      {children}
    </table>
  );
}

/* ─── TableHead ───────────────────────────────────────────────────────── */

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border bg-table-header">{children}</tr>
    </thead>
  );
}

/* ─── Th (sortable + filterable) ──────────────────────────────────────── */

type SortDirection = "asc" | "desc" | null;

interface ThProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  hidden?: "sm" | "md" | "lg";
  /** Show sort indicator and make header clickable */
  sortable?: boolean;
  /** Current sort direction (controlled) */
  sortDirection?: SortDirection;
  /** Called when sort is toggled */
  onSort?: () => void;
  /** Show filter funnel icon */
  filterable?: boolean;
  /** Called when filter icon is clicked */
  onFilter?: () => void;
}

export function Th({
  children,
  align = "left",
  className = "",
  hidden,
  sortable,
  sortDirection,
  onSort,
  filterable,
  onFilter,
}: ThProps) {
  // Static class map — Tailwind JIT requires full class strings, not dynamic interpolation
  const hideClassMap = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };
  const hideClass = hidden ? hideClassMap[hidden] : "";
  const interactive = sortable || filterable;

  const SortIcon = sortDirection === "asc" ? ArrowUp : sortDirection === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <th
      className={`p-4 text-${align} text-[14px] font-semibold leading-[22px] text-text first:rounded-tl-lg last:rounded-tr-lg ${hideClass} ${interactive ? "select-none" : ""} ${className}`}
    >
      <div className={`inline-flex items-center gap-1 ${interactive ? "cursor-pointer" : ""}`} onClick={sortable ? onSort : undefined}>
        {children}
        {sortable && (
          <SortIcon className={`h-3.5 w-3.5 ${sortDirection ? "text-primary" : "text-primary/60"}`} />
        )}
        {filterable && (
          <Filter
            className="h-3.5 w-3.5 cursor-pointer text-primary/60 hover:text-primary"
            onClick={(e) => { e.stopPropagation(); onFilter?.(); }}
          />
        )}
      </div>
    </th>
  );
}

/* ─── TableBody ───────────────────────────────────────────────────────── */

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

/* ─── Tr (row with hover, clickable, selected) ────────────────────────── */

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  /** Apply hover background (default true) */
  hover?: boolean;
  /** Show pointer cursor */
  clickable?: boolean;
  /** Highlight as selected row */
  selected?: boolean;
  className?: string;
}

export function Tr({ children, hover = true, clickable, selected, className = "", ...props }: TrProps) {
  return (
    <tr
      className={`transition-colors ${hover ? "hover:bg-surface-header" : ""} ${clickable ? "cursor-pointer" : ""} ${selected ? "bg-primary/5" : ""} ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

/* ─── Td ──────────────────────────────────────────────────────────────── */

interface TdProps {
  children?: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  hidden?: "sm" | "md" | "lg";
}

export function Td({ children, align = "left", className = "", hidden }: TdProps) {
  const hideClassMap = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };
  const hideClass = hidden ? hideClassMap[hidden] : "";
  return <td className={`px-4 py-3 text-${align} text-body-md ${hideClass} ${className}`}>{children}</td>;
}

/* ─── LinkCell (primary-colored clickable text) ───────────────────────── */

interface LinkCellProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function LinkCell({ children, href, onClick, className = "" }: LinkCellProps) {
  if (href) {
    return (
      <a href={href} className={`text-primary hover:underline ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={`text-primary hover:underline ${className}`}>
      {children}
    </button>
  );
}

/* ─── ActionsCell (... dropdown in right-aligned cell) ────────────────── */

interface ActionsCellProps {
  items: DropdownItem[];
  onSelect?: (value: string) => void;
}

export function ActionsCell({ items, onSelect }: ActionsCellProps) {
  return (
    <Td align="right">
      <Dropdown
        trigger={
          <button className="rounded p-1 text-text-secondary hover:bg-gray-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        }
        items={items}
        onSelect={onSelect || (() => {})}
        align="right"
      />
    </Td>
  );
}

/* ─── ExpandableRow (expand/collapse with sub-content) ────────────────── */

interface ExpandableRowProps {
  children: React.ReactNode;
  /** Content shown when expanded (rendered in a full-width sub-row) */
  expandContent: React.ReactNode;
  /** Number of columns for the expanded content to span */
  colSpan: number;
  /** Controlled expanded state (optional — uses internal state if not provided) */
  expanded?: boolean;
  /** Controlled toggle (optional) */
  onToggle?: () => void;
  hover?: boolean;
  className?: string;
}

export function ExpandableRow({
  children,
  expandContent,
  colSpan,
  expanded: controlledExpanded,
  onToggle,
  hover = true,
  className = "",
}: ExpandableRowProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;
  const toggle = onToggle ?? (() => setInternalExpanded((v) => !v));

  return (
    <Fragment>
      <Tr hover={hover} clickable className={className} onClick={toggle}>
        <Td className="w-8">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-secondary" />
          )}
        </Td>
        {children}
      </Tr>
      {isExpanded && (
        <tr className="bg-gray-50/50">
          <td colSpan={colSpan} className="px-4 py-3">
            {expandContent}
          </td>
        </tr>
      )}
    </Fragment>
  );
}
