"use client";

import { Input } from "antd";
import { forwardRef } from "react";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, color: "rgb(34, 34, 34)" }}
          >
            {label}
          </label>
        )}
        <Input
          ref={ref as never}
          id={inputId}
          status={error ? "error" : undefined}
          {...(props as Record<string, unknown>)}
        />
        {error && (
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--color-error)" }}>
            {error}
          </div>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
export default FormInput;
