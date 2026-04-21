/** Semantic color token → hex, mirrors the Status component color map. */
const semanticColorMap: Record<string, string> = {
  green: "#00C269",
  red: "#D00032",
  yellow: "#FFD232",
  blue: "#5578FF",
  gray: "#b8bcc0",
  purple: "#8250FF",
  orange: "#f97316",
};

interface ColorDotProps {
  /** CSS color (hex, rgb, etc.) OR a semantic token: green/red/yellow/blue/gray/purple/orange */
  color: string;
  size?: "xs" | "sm" | "md" | "lg";
  /** Optional label rendered to the right of the dot (inline-flex row, gap 8). */
  label?: string;
  className?: string;
}

const sizeMap = { xs: 8, sm: 12, md: 16, lg: 20 };

export default function ColorDot({ color, size = "sm", label, className }: ColorDotProps) {
  const px = sizeMap[size];
  const resolvedColor = semanticColorMap[color] ?? color;

  const dotStyle = {
    display: "inline-block",
    flexShrink: 0,
    width: px,
    height: px,
    borderRadius: "50%",
    backgroundColor: resolvedColor,
  };

  if (label) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <span style={dotStyle} />
        <span style={{ fontSize: 14 }}>{label}</span>
      </span>
    );
  }

  return <span className={className} style={dotStyle} />;
}
