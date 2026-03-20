import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Typography variants matching the Splose design system.
 * See docs/typography-spec.md for full definitions and usage guidance.
 *
 * Naming: {category}/{size} — use the slash form in the variant prop,
 * which maps to the CSS class text-{category}-{size}.
 */
export type TextVariant =
  | "display/lg"
  | "display/md"
  | "display/sm"
  | "heading/lg"
  | "heading/md"
  | "heading/sm"
  | "body/lg"
  | "body/md"
  | "body/sm"
  | "body/md-strong"
  | "body/lg-strong"
  | "label/lg"
  | "label/md"
  | "label/sm"
  | "caption/md"
  | "caption/sm"
  | "metric/lg"
  | "metric/md";

interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Typography style variant. See docs/typography-spec.md */
  variant: TextVariant;
  /** HTML element to render. Defaults to a sensible element for the variant. */
  as?: ElementType;
  /** Color override — applies a Tailwind text color class (e.g. "text-text-secondary") */
  color?: string;
  children: ReactNode;
}

/** Maps variant → CSS utility class defined in globals.css */
const variantClass: Record<TextVariant, string> = {
  "display/lg": "text-display-lg",
  "display/md": "text-display-md",
  "display/sm": "text-display-sm",
  "heading/lg": "text-heading-lg",
  "heading/md": "text-heading-md",
  "heading/sm": "text-heading-sm",
  "body/lg": "text-body-lg",
  "body/md": "text-body-md",
  "body/sm": "text-body-sm",
  "body/md-strong": "text-body-md-strong",
  "body/lg-strong": "text-body-lg-strong",
  "label/lg": "text-label-lg",
  "label/md": "text-label-md",
  "label/sm": "text-label-sm",
  "caption/md": "text-caption-md",
  "caption/sm": "text-caption-sm",
  "metric/lg": "text-metric-lg",
  "metric/md": "text-metric-md",
};

/** Default HTML element per variant category */
const defaultElement: Record<string, ElementType> = {
  display: "h1",
  heading: "h2",
  body: "p",
  label: "span",
  caption: "span",
  metric: "span",
};

function getCategory(variant: TextVariant): string {
  return variant.split("/")[0];
}

export default function Text({
  variant,
  as,
  color,
  className = "",
  children,
  ...props
}: TextProps) {
  const Component = as ?? defaultElement[getCategory(variant)] ?? "span";
  const classes = [variantClass[variant], color, className].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
