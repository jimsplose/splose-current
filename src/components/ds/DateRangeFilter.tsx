"use client";

import { DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

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
  className,
}: DateRangeFilterProps) {
  const value: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [
    startDate ? dayjs(startDate) : null,
    endDate ? dayjs(endDate) : null,
  ];

  return (
    <div className={className}>
      <RangePicker
        value={value}
        onChange={(dates) => {
          if (dates) {
            onStartChange?.(dates[0]?.format("YYYY-MM-DD") ?? "");
            onEndChange?.(dates[1]?.format("YYYY-MM-DD") ?? "");
          } else {
            onStartChange?.("");
            onEndChange?.("");
          }
        }}
        format="DD/MM/YYYY"
      />
    </div>
  );
}
