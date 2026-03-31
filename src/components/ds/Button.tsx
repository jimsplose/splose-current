"use client";

import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link" | "icon" | "toolbar";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "color"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  round?: boolean;
  children: React.ReactNode;
  htmlType?: "button" | "submit" | "reset";
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
  ({ variant = "secondary", size = "md", round = false, className, style, children, htmlType, disabled, onClick, ...props }, ref) => {
    const antProps = mapVariant(variant);

    return (
      <AntButton
        ref={ref}
        {...antProps}
        size={sizeMap[size]}
        shape={round ? "circle" : undefined}
        className={className}
        style={style}
        disabled={disabled}
        onClick={onClick}
        htmlType={htmlType}
      >
        {children}
      </AntButton>
    );
  },
);

Button.displayName = "Button";
export default Button;
