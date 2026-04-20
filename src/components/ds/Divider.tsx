import { Divider as AntDivider } from "antd";

interface DividerProps {
  variant?: "default" | "subtle" | "primary";
  spacing?: "none" | "xs" | "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

const spacingMap: Record<string, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};

const variantColorMap: Record<string, string> = {
  default: "var(--color-border)",
  subtle: "var(--color-border-secondary)",
  primary: "var(--color-primary)",
};

export default function Divider({
  variant = "default",
  spacing = "md",
  orientation = "horizontal",
  className,
  style,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <span
        className={className}
        style={{
          display: "inline-block",
          height: 16,
          width: 1,
          backgroundColor: variantColorMap[variant],
          margin: `0 ${spacingMap[spacing]}px`,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

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
