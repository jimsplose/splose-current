"use client";

import { type ReactNode } from "react";
import { Flex } from "antd";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import Card from "./Card";

interface ListPageProps {
  /** Page title shown in the header */
  title: string;
  /** Action buttons shown in the header (e.g. "New client" button) */
  actions?: ReactNode;
  /** Search bar placeholder text. If provided, SearchBar is rendered. */
  searchPlaceholder?: string;
  /** Called when user types in the search bar */
  onSearch?: (query: string) => void;
  /** Filter bar content — rendered between search bar and table */
  filters?: ReactNode;
  /** Wrap the table in a Card. Defaults to true. */
  cardWrap?: boolean;
  /** Page content — typically DataTable + Pagination */
  children: ReactNode;
  /** Extra content between PageHeader and SearchBar (e.g. tabs) */
  toolbar?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ListPage({
  title,
  actions,
  searchPlaceholder,
  onSearch,
  filters,
  cardWrap = true,
  children,
  toolbar,
  className,
  style,
}: ListPageProps) {
  return (
    <div style={{ padding: "10px 22.5px", ...style }} className={className}>
      <PageHeader title={title}>{actions}</PageHeader>

      {toolbar}

      {searchPlaceholder && (
        <SearchBar placeholder={searchPlaceholder} onSearch={onSearch} />
      )}

      {filters && (
        <Flex wrap="wrap" align="center" gap={8} style={{ marginBottom: 12 }}>
          {filters}
        </Flex>
      )}

      {cardWrap ? (
        <Card padding="none" style={{ overflowX: "auto" }}>
          {children}
        </Card>
      ) : (
        children
      )}
    </div>
  );
}
