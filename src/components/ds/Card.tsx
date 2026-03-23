interface CardProps {
  children: React.ReactNode;
  title?: string;
  /** Show title in a styled header bar (bg-surface-header with bottom border) */
  headerBar?: boolean;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export default function Card({ children, title, headerBar, className = "", padding = "md" }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-white ${headerBar ? "" : paddingClasses[padding]} ${className}`}>
      {title && headerBar && (
        <div className="rounded-t-lg border-b border-border bg-surface-header px-4 py-3">
          <h3 className="text-heading-sm text-text">{title}</h3>
        </div>
      )}
      {title && !headerBar && <h3 className="mb-3 text-heading-sm text-text">{title}</h3>}
      {headerBar ? <div className={paddingClasses[padding]}>{children}</div> : children}
    </div>
  );
}
