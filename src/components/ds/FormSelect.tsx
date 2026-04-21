"use client";

import { Select } from "antd";
import { forwardRef } from "react";
import FormField from "./FormField";

interface FormSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(
  ({ label, error, hint, required, options, className, style, id, onChange, value, defaultValue, disabled, placeholder, searchable }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} hint={hint} required={required} id={selectId} className={className}>
        <div ref={ref} style={style}>
          <Select
            id={selectId}
            options={options}
            onChange={onChange}
            value={value || undefined}
            defaultValue={defaultValue || undefined}
            disabled={disabled}
            placeholder={placeholder}
            showSearch={searchable}
            optionFilterProp={searchable ? "label" : undefined}
            variant={disabled ? "filled" : undefined}
            style={{ width: "100%" }}
          />
        </div>
      </FormField>
    );
  },
);

FormSelect.displayName = "FormSelect";
export default FormSelect;
