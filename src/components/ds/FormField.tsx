import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function FormField({ label, error, required, hint, id, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 600, color: "rgb(34, 34, 34)" }}
        >
          {label}
          {required && <span style={{ color: "var(--color-error)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      {hint && (
        <div style={{ marginBottom: 4, fontSize: 12, color: "var(--color-text-secondary)" }}>
          {hint}
        </div>
      )}
      {children}
      {error && (
        <div style={{ marginTop: 4, fontSize: 12, color: "var(--color-error)" }}>
          {error}
        </div>
      )}
    </div>
  );
}
