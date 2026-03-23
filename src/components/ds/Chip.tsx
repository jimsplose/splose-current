import { X } from "lucide-react";

type ChipVariant = "green" | "purple" | "yellow" | "blue" | "red" | "gray";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  /** Show a close/remove button */
  onRemove?: () => void;
  className?: string;
}

const variantClasses: Record<ChipVariant, string> = {
  green: "border-green-300 bg-green-50 text-green-700",
  purple: "border-purple-300 bg-purple-50 text-purple-700",
  yellow: "border-yellow-300 bg-yellow-100 text-yellow-800",
  blue: "border-blue-300 bg-blue-50 text-blue-700",
  red: "border-red-300 bg-red-50 text-red-700",
  gray: "border-gray-300 bg-gray-50 text-gray-700",
};

export default function Chip({ children, variant = "gray", onRemove, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-label-lg ${variantClasses[variant]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="rounded-full p-0.5 transition-colors hover:bg-black/10"
          aria-label="Remove"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}
