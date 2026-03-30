"use client";

import { Select, Spin } from "antd";
import { useState, useEffect } from "react";

interface AsyncSelectProps {
  url: string;
  mapOption: (item: Record<string, unknown>) => { value: string; label: string };
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function AsyncSelect({
  url,
  mapOption,
  value,
  onChange,
  label,
  placeholder = "Select...",
  className,
}: AsyncSelectProps) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => {
        setOptions(data.map(mapOption));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url, mapOption]);

  return (
    <div className={className}>
      {label && (
        <label style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--color-text-secondary)" }}>
          {label}
        </label>
      )}
      <Select
        value={value || undefined}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        loading={loading}
        notFoundContent={loading ? <Spin size="small" /> : undefined}
        showSearch
        optionFilterProp="label"
        style={{ width: "100%" }}
      />
    </div>
  );
}
