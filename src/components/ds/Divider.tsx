import { Divider as AntDivider } from "antd";

interface DividerProps {
  variant?: "default" | "subtle" | "primary";
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const spacingMap: Record<string, number> = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

const variantColorMap: Record<string, string> = {
  default: "var(--color-border)",
  subtle: "var(--color-border-secondary)",
  primary: "var(--color-primary)",
};

export default function Divider({ variant = "default", spacing = "md", className, style }: DividerProps) {
  return (
    <AntDivider
      className={className}
      style={{
        borderColor: variantColorMap[variant],
        margin: `${spacingMap[spacing]}px 0`,
        ...style,
      }}
    />
  );
}
