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
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Circle (default) or rectangular swatch. */
  shape?: "circle" | "rect";
  /** Optional label rendered to the right of the dot (inline-flex row, gap 8). */
  label?: string;
  /** When true, renders as a <button> with cursor:pointer. */
  interactive?: boolean;
  /** Shows a selection ring when true. Only meaningful when interactive=true. */
  selected?: boolean;
  onClick?: () => void;
  /** Width for shape="rect". Height is derived from size. Default 80. */
  rectWidth?: number;
  className?: string;
}

const sizeMap: Record<string, number> = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28 };

export default function ColorDot({
  color,
  size = "sm",
  shape = "circle",
  label,
  interactive,
  selected,
  onClick,
  rectWidth = 80,
  className,
}: ColorDotProps) {
  const px = sizeMap[size];
  const resolvedColor = semanticColorMap[color] ?? color;

  const baseStyle: React.CSSProperties = {
    display: "inline-block",
    flexShrink: 0,
    height: px,
    width: shape === "rect" ? rectWidth : px,
    borderRadius: shape === "rect" ? 4 : "50%",
    backgroundColor: resolvedColor,
  };

  if (interactive) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        title={color}
        style={{
          ...baseStyle,
          border: selected ? "2px solid rgba(0,0,0,0.3)" : "2px solid transparent",
          outline: "none",
          cursor: "pointer",
          padding: 0,
        }}
      />
    );
  }

  if (label) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <span style={baseStyle} />
        <span style={{ fontSize: 14 }}>{label}</span>
      </span>
    );
  }

  return <span className={className} style={baseStyle} />;
}
