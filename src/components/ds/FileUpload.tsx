interface FileUploadProps {
  /** Icon or image to display in the center */
  icon?: React.ReactNode;
  /** Label text (e.g. "Upload") */
  label?: string;
  className?: string;
  onClick?: () => void;
}

export default function FileUpload({ icon, label = "Upload", className = "", onClick }: FileUploadProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 transition-colors hover:border-primary/50 hover:bg-surface-header ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {icon && <div className="flex items-center justify-center">{icon}</div>}
      {label && (
        <span className="rounded-lg border border-border bg-white px-4 py-1.5 text-label-lg text-text transition-colors hover:bg-gray-50">
          {label}
        </span>
      )}
    </div>
  );
}
