interface ColorDotProps {
  /** CSS color value (hex, rgb, etc.) */
  color: string;
  /** xs=8px, sm=12px, md=16px, lg=20px */
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { xs: "h-2 w-2", sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

export default function ColorDot({ color, size = "sm", className = "" }: ColorDotProps) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full ${sizeMap[size]} ${className}`}
      style={{ backgroundColor: color }}
    />
  );
}
