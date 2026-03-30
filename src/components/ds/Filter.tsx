"use client";

import { Segmented } from "antd";

interface FilterItem {
  label: string | React.ReactNode;
  value: string;
}

interface FilterProps {
  items: FilterItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Filter({ items, value, onChange, className }: FilterProps) {
  return (
    <Segmented
      options={items.map((item) => ({
        label: item.label,
        value: item.value,
      }))}
      value={value}
      onChange={(val) => onChange(val as string)}
      className={className}
    />
  );
}
