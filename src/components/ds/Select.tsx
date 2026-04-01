"use client";

import { Select as AntSelect } from "antd";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  label?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  label,
  className,
}: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, color: "rgb(34, 34, 34)" }}>
          {label}
        </label>
      )}
      <AntSelect
        value={value || undefined}
        onChange={onChange}
        placeholder={placeholder}
        showSearch={searchable}
        optionFilterProp="label"
        options={options}
        style={{ width: "100%" }}
      />
    </div>
  );
}
