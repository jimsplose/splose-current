interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, message, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {icon && (
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">{icon}</div>
      )}
      {title && <h3 className="mb-1 text-heading-sm text-text">{title}</h3>}
      <p className="text-body-md text-text-secondary">{message}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
