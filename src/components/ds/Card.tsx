interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export default function Card({ children, title, className = "", padding = "md" }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-white ${paddingClasses[padding]} ${className}`}>
      {title && <h3 className="mb-3 text-sm font-semibold text-text">{title}</h3>}
      {children}
    </div>
  );
}
