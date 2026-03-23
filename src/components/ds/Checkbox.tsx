import { forwardRef } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <label htmlFor={checkboxId} className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-primary accent-primary focus:ring-primary ${className}`}
          {...props}
        />
        {label && <span className="text-body-md text-text">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
