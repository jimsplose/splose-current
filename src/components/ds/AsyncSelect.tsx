"use client";

import { useState, useEffect } from "react";
import FormSelect from "./FormSelect";

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
  className = "",
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

  const allOptions = [{ value: "", label: loading ? "Loading..." : placeholder }, ...options];

  return (
    <div className={className}>
      <FormSelect label={label} options={allOptions} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
