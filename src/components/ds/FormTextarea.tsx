"use client";

import { Input } from "antd";
import { forwardRef } from "react";
import FormField from "./FormField";

const { TextArea } = Input;

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} hint={hint} required={required} id={textareaId} className={className}>
        <TextArea
          ref={ref as never}
          id={textareaId}
          status={error ? "error" : undefined}
          {...(props as Record<string, unknown>)}
        />
      </FormField>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
