import { forwardRef } from "react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div>
        {label && (
          <label htmlFor={textareaId} className="mb-1 block text-label-lg text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full rounded-lg border bg-white px-3 py-2 text-body-md transition-colors outline-none ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
              : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-caption-md text-red-500">{error}</p>}
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
