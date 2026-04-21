"use client";

import { Input } from "antd";
import { forwardRef } from "react";
import FormField from "./FormField";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, className, id, disabled, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} hint={hint} required={required} id={inputId} className={className}>
        <Input
          ref={ref as never}
          id={inputId}
          disabled={disabled}
          status={error ? "error" : undefined}
          variant={disabled ? "filled" : undefined}
          {...(props as Record<string, unknown>)}
        />
      </FormField>
    );
  },
);

FormInput.displayName = "FormInput";
export default FormInput;
