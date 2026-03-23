import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "icon" | "toolbar";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as a circle (for FAB/round icon buttons) */
  round?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark border border-primary",
  secondary: "border border-border bg-white text-text hover:bg-gray-50",
  danger: "border border-red-300 bg-white text-red-600 hover:bg-red-50",
  ghost: "text-text-secondary hover:bg-gray-100",
  link: "text-primary hover:underline",
  icon: "rounded p-1.5 text-text-secondary hover:bg-gray-100",
  toolbar: "rounded px-2 py-1 text-body-md text-text hover:bg-gray-200",
};

const sizeClasses: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: { sm: "px-3 py-1.5 text-label-lg", md: "px-4 py-2 text-label-lg", lg: "px-6 py-2.5 text-label-lg" },
  secondary: { sm: "px-3 py-1.5 text-label-lg", md: "px-4 py-2 text-label-lg", lg: "px-6 py-2.5 text-label-lg" },
  danger: { sm: "px-3 py-1.5 text-label-lg", md: "px-4 py-2 text-label-lg", lg: "px-6 py-2.5 text-label-lg" },
  ghost: { sm: "px-2 py-1 text-label-lg", md: "px-3 py-1.5 text-label-lg", lg: "px-4 py-2 text-label-lg" },
  link: { sm: "text-caption-md", md: "text-body-md", lg: "text-body-lg" },
  icon: { sm: "p-1", md: "p-1.5", lg: "p-2" },
  toolbar: { sm: "px-1.5 py-0.5 text-caption-md", md: "px-2 py-1 text-body-md", lg: "px-3 py-1.5 text-body-md" },
};

const baseClasses: Record<ButtonVariant, string> = {
  primary: "inline-flex items-center gap-1.5 rounded-lg transition-colors",
  secondary: "inline-flex items-center gap-1.5 rounded-lg transition-colors",
  danger: "inline-flex items-center gap-1.5 rounded-lg transition-colors",
  ghost: "inline-flex items-center gap-1.5 rounded-lg transition-colors",
  link: "inline-flex items-center gap-1 transition-colors",
  icon: "inline-flex items-center justify-center transition-colors",
  toolbar: "inline-flex items-center justify-center transition-colors",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", round = false, className = "", children, ...props }, ref) => {
    const roundClass = round ? "rounded-full" : "";
    return (
      <button
        ref={ref}
        className={`${baseClasses[variant]} ${variantClasses[variant]} ${sizeClasses[variant][size]} ${roundClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
