import type { CSSProperties, ElementType, ReactNode } from "react";
import HintIcon from "./HintIcon";
import styles from "./FormLabel.module.css";

interface FormLabelProps {
  children: ReactNode;
  /** Appends a red asterisk to indicate a required field */
  required?: boolean;
  /** Shows a HintIcon with a tooltip */
  hint?: string;
  /** sm = 12px/500, md = 14px/600 (default) */
  size?: "sm" | "md";
  /** marginBottom in px (default: 4) */
  mb?: number;
  /** Forwarded to the underlying element as htmlFor */
  htmlFor?: string;
  /** Render as label (default) or div */
  as?: "label" | "div";
  className?: string;
  style?: CSSProperties;
}

export default function FormLabel({
  children,
  required,
  hint,
  size = "md",
  mb = 4,
  htmlFor,
  as: Component = "label",
  className = "",
  style,
}: FormLabelProps) {
  const cls = [
    styles.root,
    size === "sm" ? styles.rootSm : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties = { marginBottom: mb, ...style };

  return (
    <Component htmlFor={Component === "label" ? htmlFor : undefined} className={cls} style={mergedStyle}>
      {children}
      {hint && <HintIcon tooltip={hint} />}
      {required && <span className={styles.required}>*</span>}
    </Component>
  );
}
