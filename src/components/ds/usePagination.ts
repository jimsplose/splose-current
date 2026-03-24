"use client";

import { useState, useEffect, useMemo } from "react";

interface UsePaginationOptions {
  /** Unique key for localStorage persistence (typically the page path, e.g. "/clients") */
  pageKey: string;
  /** Default page size (default: 10) */
  defaultPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
}

interface PaginationResult<T> {
  /** The current page of items */
  paged: T[];
  /** Props to spread onto <Pagination /> */
  paginationProps: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    pageSizeOptions: number[];
    onPageSizeChange: (size: number) => void;
  };
}

export default function usePagination<T>(
  items: T[],
  options: UsePaginationOptions,
): PaginationResult<T> {
  const { pageKey, defaultPageSize = 10, pageSizeOptions = [10, 20, 50] } = options;
  const storageKey = `pagination:${pageKey}:size`;

  const [pageSize, setPageSize] = useState(() => {
    if (typeof window === "undefined") return defaultPageSize;
    const stored = localStorage.getItem(storageKey);
    return stored ? Number(stored) : defaultPageSize;
  });
  const [page, setPage] = useState(1);

  // Persist page size to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, String(pageSize));
  }, [pageSize, storageKey]);

  // Reset to page 1 if items change and current page is out of bounds
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paged = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return {
    paged,
    paginationProps: {
      currentPage: page,
      totalPages,
      totalItems: items.length,
      itemsPerPage: pageSize,
      onPageChange: setPage,
      pageSizeOptions,
      onPageSizeChange: (size: number) => {
        setPageSize(size);
        setPage(1);
      },
    },
  };
}
