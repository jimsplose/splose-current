type BadgeVariant = "green" | "red" | "blue" | "yellow" | "orange" | "gray" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Use solid filled style (white text on dark bg) like production status pills */
  solid?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
  orange: "bg-orange-100 text-orange-700",
  gray: "bg-gray-100 text-gray-600",
  purple: "bg-purple-100 text-purple-700",
};

const solidVariantClasses: Record<BadgeVariant, string> = {
  green: "bg-green-600 text-white",
  red: "bg-red-500 text-white",
  blue: "bg-blue-500 text-white",
  yellow: "bg-yellow-500 text-white",
  orange: "bg-orange-500 text-white",
  gray: "bg-gray-600 text-white",
  purple: "bg-purple-600 text-white",
};

export default function Badge({ children, variant = "gray", solid = false, className = "" }: BadgeProps) {
  const classes = solid ? solidVariantClasses[variant] : variantClasses[variant];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-label-md ${classes} ${className}`}
    >
      {children}
    </span>
  );
}

/** Convenience map for common status → variant */
export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    Active: "green",
    Paid: "green",
    Delivered: "green",
    Final: "green",
    Completed: "green",
    Upcoming: "green",
    Scheduled: "green",
    "In progress": "green",
    Draft: "gray",
    Sent: "blue",
    Outstanding: "yellow",
    Pending: "yellow",
    "No Show": "yellow",
    Overdue: "red",
    Failed: "red",
    Cancelled: "red",
    Expired: "red",
    Archived: "orange",
    Closed: "gray",
    Opened: "blue",
    "On Leave": "yellow",
    "Do not invoice": "gray",
  };
  return map[status] ?? "gray";
}
