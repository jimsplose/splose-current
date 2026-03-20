"use client";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartChange?: (date: string) => void;
  onEndChange?: (date: string) => void;
  className?: string;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  className = "",
}: DateRangeFilterProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartChange?.(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
      <span className="text-text-secondary">&rarr;</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndChange?.(e.target.value)}
        className="rounded-lg border border-border bg-white px-3 py-2 text-body-md text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
    </div>
  );
}
