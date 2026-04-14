import type { ReactNode } from "react";
import Text from "./Text";

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
          style={{ display: "block", marginBottom: 4 }}
        >
          <Text variant="label/lg" as="span" color="rgb(34, 34, 34)">{label}</Text>
          {required && <span style={{ color: "var(--color-error)", marginLeft: 2 }}>*</span>}
        </label>
      )}
      {hint && (
        <Text variant="body/sm" as="div" color="secondary" style={{ marginBottom: 4 }}>{hint}</Text>
      )}
      {children}
      {error && (
        <Text variant="body/sm" as="div" color="danger" style={{ marginTop: 4 }}>{error}</Text>
      )}
    </div>
  );
}
