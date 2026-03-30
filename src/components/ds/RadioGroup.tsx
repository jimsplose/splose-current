"use client";

import { Radio } from "antd";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function RadioGroup({ name, label, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={className}>
      {label && (
        <div style={{ marginBottom: 8, fontSize: 14, color: "var(--ant-color-text-secondary)" }}>
          {label}
        </div>
      )}
      <Radio.Group
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        options={options}
        optionType="default"
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      />
    </div>
  );
}
