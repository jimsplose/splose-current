"use client";

import { Select } from "antd";
import { forwardRef } from "react";

interface FormSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  ({ label, options, className, id, onChange, value, defaultValue, disabled }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div ref={ref} className={className}>
        {label && (
          <label
            htmlFor={selectId}
            style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <Select
          id={selectId}
          options={options}
          onChange={onChange}
          value={value || undefined}
          defaultValue={defaultValue || undefined}
          disabled={disabled}
          style={{ width: "100%" }}
        />
      </div>
    );
  },
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
