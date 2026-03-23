type AlertVariant = "info" | "warning" | "success" | "error";

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export default function Alert({ children, variant = "info", icon, className = "" }: AlertProps) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-body-md ${variantClasses[variant]} ${className}`}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}
