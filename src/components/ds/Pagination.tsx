"use client";

import { Pagination as AntPagination } from "antd";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  showPageSize?: boolean;
  onPageChange?: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  showPageSize = true,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const total = totalItems ?? totalPages * itemsPerPage;

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--color-border)", padding: "12px 16px" }}>
      <AntPagination
        current={currentPage}
        total={total}
        pageSize={itemsPerPage}
        onChange={(page) => onPageChange?.(page)}
        onShowSizeChange={(_current, size) => onPageSizeChange?.(size)}
        showSizeChanger={showPageSize && !!pageSizeOptions}
        pageSizeOptions={pageSizeOptions?.map(String)}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        size="small"
      />
    </div>
  );
}
