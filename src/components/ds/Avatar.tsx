type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ name, color, size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: color || "var(--color-primary)" }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
