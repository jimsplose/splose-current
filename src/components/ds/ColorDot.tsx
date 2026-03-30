interface ColorDotProps {
  color: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { xs: 8, sm: 12, md: 16, lg: 20 };

export default function ColorDot({ color, size = "sm", className }: ColorDotProps) {
  const px = sizeMap[size];
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: px,
        height: px,
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
  );
}
