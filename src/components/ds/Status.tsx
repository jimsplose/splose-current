type StatusColor = "green" | "red" | "yellow" | "blue" | "gray" | "purple" | "orange";

interface StatusProps {
  color?: StatusColor;
  label?: string;
  className?: string;
}

const colorClasses: Record<StatusColor, string> = {
  green: "bg-green-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  gray: "bg-gray-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

export default function Status({ color = "gray", label, className = "" }: StatusProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colorClasses[color]}`} />
      {label && <span className="text-sm text-text">{label}</span>}
    </span>
  );
}
