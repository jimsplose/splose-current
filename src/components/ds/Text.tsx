import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "display/lg" | "display/md" | "display/sm" | "display/xs"
  | "heading/xl" | "heading/lg" | "heading/md" | "heading/sm"
  | "body/lg" | "body/md" | "body/sm" | "body/md-strong" | "body/lg-strong"
  | "label/lg" | "label/md" | "label/sm"
  | "caption/md" | "caption/sm"
  | "metric/lg" | "metric/md"
  | "page-title";

export type TextColor = "text" | "secondary" | "tertiary" | "primary" | "danger" | "warning" | "success" | "inverted";
export type TextWeight = "regular" | "medium" | "bold";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: ElementType;
  color?: TextColor | (string & {});
  weight?: TextWeight;
  children: ReactNode;
}

const variantClass: Record<TextVariant, string> = {
  "display/lg": styles.displayLg,
  "display/md": styles.displayMd,
  "display/sm": styles.displaySm,
  "display/xs": styles.displayXs,
  "heading/xl": styles.headingXl,
  "heading/lg": styles.headingLg,
  "heading/md": styles.headingMd,
  "heading/sm": styles.headingSm,
  "body/lg": styles.bodyLg,
  "body/md": styles.bodyMd,
  "body/sm": styles.bodySm,
  "body/md-strong": styles.bodyMdStrong,
  "body/lg-strong": styles.bodyLgStrong,
  "label/lg": styles.labelLg,
  "label/md": styles.labelMd,
  "label/sm": styles.labelSm,
  "caption/md": styles.captionMd,
  "caption/sm": styles.captionSm,
  "metric/lg": styles.metricLg,
  "metric/md": styles.metricMd,
  "page-title": styles.pageTitle,
};

const weightClass: Record<TextWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  bold: styles.weightBold,
};

const colorPresets: Record<string, string> = {
  text: styles.colorText,
  secondary: styles.colorSecondary,
  tertiary: styles.colorTertiary,
  primary: styles.colorPrimary,
  danger: styles.colorDanger,
  warning: styles.colorWarning,
  success: styles.colorSuccess,
  inverted: styles.colorInverted,
};

const defaultElement: Record<string, ElementType> = {
  display: "h1",
  heading: "h2",
  body: "p",
  label: "span",
  caption: "span",
  metric: "span",
  "page-title": "h1",
};

function getCategory(variant: TextVariant): string {
  return variant.split("/")[0];
}

function resolveColor(color?: string): { className?: string; style?: { color: string } } {
  if (!color) return {};
  if (color in colorPresets) return { className: colorPresets[color] };
  // Raw CSS value (hex, rgb, named colour) → inline style
  return { style: { color } };
}

export default function Text({ variant = "body/md", as, color, weight, className = "", children, style, ...props }: TextProps) {
  const Component = as ?? defaultElement[getCategory(variant)] ?? "span";
  const resolved = resolveColor(color);
  const classes = [variantClass[variant], weight ? weightClass[weight] : undefined, resolved.className, className].filter(Boolean).join(" ");
  const mergedStyle = resolved.style ? { ...style, ...resolved.style } : style;

  return (
    <Component className={classes} style={mergedStyle} {...props}>
      {children}
    </Component>
  );
}
