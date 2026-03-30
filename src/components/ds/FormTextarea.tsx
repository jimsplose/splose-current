"use client";

import { Input } from "antd";
import { forwardRef } from "react";

const { TextArea } = Input;

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={textareaId}
            style={{ display: "block", marginBottom: 4, fontSize: 14, color: "var(--color-text-secondary)" }}
          >
            {label}
          </label>
        )}
        <TextArea
          ref={ref as never}
          id={textareaId}
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

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
