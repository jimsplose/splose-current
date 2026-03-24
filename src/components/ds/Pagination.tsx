"use client";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  showPageSize?: boolean;
  onPageChange?: (page: number) => void;
  /** Available page sizes for the dropdown */
  pageSizeOptions?: number[];
  /** Called when page size changes */
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
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems ?? itemsPerPage);

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-end border-t border-border px-4 py-3 text-body-md text-text-secondary">
      <span>
        {totalItems != null
          ? `${startItem}-${endItem} of ${totalItems} items`
          : `${startItem}-${endItem} of ${endItem} items`}
      </span>
      <div className="ml-4 flex items-center gap-1">
        <button
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded text-text-secondary hover:text-primary disabled:opacity-30"
        >
          &lt;
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-text-secondary">
              &middot;&middot;&middot;
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange?.(p)}
              className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] ${
                p === currentPage
                  ? "border-primary bg-white text-text"
                  : "border-transparent bg-white text-text hover:border-primary hover:text-primary"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded text-text-secondary hover:text-primary disabled:opacity-30"
        >
          &gt;
        </button>
      </div>
      {showPageSize && (
        pageSizeOptions && onPageSizeChange ? (
          <select
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-4 rounded border border-border bg-white px-2 py-0.5 text-body-md text-text-secondary"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size} / page</option>
            ))}
          </select>
        ) : (
          <span className="ml-4">{itemsPerPage} / page</span>
        )
      )}
    </div>
  );
}
