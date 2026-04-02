import { Divider as AntDivider } from "antd";

interface DividerProps {
  variant?: "default" | "subtle";
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

export default function Divider({ variant = "default", spacing = "md", className, style }: DividerProps) {
  return (
    <AntDivider
      className={className}
      style={{
        borderColor: variant === "subtle" ? "var(--color-border-secondary)" : "var(--color-border)",
        margin: `${spacingMap[spacing]}px 0`,
        ...style,
      }}
    />
  );
}
