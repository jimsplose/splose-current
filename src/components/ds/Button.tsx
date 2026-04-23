"use client";
/**
 * @deprecated Use AntD `Button` directly — no DS wrapper needed.
 * Mapping: variant="primary" → type="primary", variant="secondary" → type="default",
 * variant="ghost" → type="text", variant="danger" → type="default" danger,
 * variant="link" → type="link". size="sm" → size="small", size="md" → size="middle".
 * Remove after zero-usage tests pass.
 */
import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "icon" | "toolbar";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "default" | "pill" | "circle";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  round?: boolean;
  iconOnly?: boolean;
  children: React.ReactNode;
  htmlType?: "button" | "submit" | "reset";
  href?: string;
  target?: string;
}

const sizeMap: Record<ButtonSize, AntButtonProps["size"]> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

function mapVariant(variant: ButtonVariant): Pick<AntButtonProps, "type" | "danger" | "shape"> {
  switch (variant) {
    case "primary":
      return { type: "primary" };
    case "secondary":
      return { type: "default" };
    case "danger":
      return { type: "default", danger: true };
    case "ghost":
      return { type: "text" };
    case "link":
      return { type: "link" };
    case "icon":
      return { type: "text" };
    case "toolbar":
      return { type: "text" };
  }
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", shape, round = false, iconOnly = false, className, style, children, htmlType, disabled, onClick, href, target, ...props }, ref) => {
    const antProps = mapVariant(variant);
    const antShape = round || shape === "circle" ? "circle" : shape === "pill" ? "round" : undefined;

    return (
      <AntButton
        ref={ref}
        {...antProps}
        size={sizeMap[size]}
        shape={antShape}
        icon={iconOnly ? children : undefined}
        className={className}
        style={style}
        disabled={disabled}
        onClick={onClick}
        htmlType={htmlType}
        href={href}
        target={target}
      >
        {iconOnly ? null : children}
      </AntButton>
    );
  },
);

Button.displayName = "Button";
export default Button;
