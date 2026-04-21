import type { ComponentType } from "react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
export type IconTone =
  | "default"
  | "secondary"
  | "tertiary"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "inverted";

interface IconProps {
  as: ComponentType<{ style?: React.CSSProperties; className?: string }>;
  size?: IconSize;
  tone?: IconTone;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<IconSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  "5xl": 40,
};

const toneColor: Record<IconTone, string> = {
  default: "var(--ant-color-text, #414549)",
  secondary: "var(--ant-color-text-secondary, #6E6E64)",
  tertiary: "var(--ant-color-text-tertiary, #b8bcc0)",
  primary: "var(--ant-color-primary, #8250FF)",
  success: "var(--ant-color-success, #00C269)",
  warning: "var(--ant-color-warning, #FFD232)",
  danger: "var(--ant-color-error, #D00032)",
  inverted: "#FFFFFF",
};

export default function Icon({
  as: IconComponent,
  size = "lg",
  tone = "default",
  className,
  style,
}: IconProps) {
  return (
    <IconComponent
      className={className}
      style={{ fontSize: sizeMap[size], color: toneColor[tone], ...style }}
    />
  );
}
