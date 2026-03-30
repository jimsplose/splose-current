"use client";

import { Alert as AntAlert } from "antd";

type AlertVariant = "info" | "warning" | "success" | "error";

interface AlertProps {
  children: React.ReactNode;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  className?: string;
}

export default function Alert({ children, variant = "info", icon, className }: AlertProps) {
  return (
    <AntAlert
      type={variant}
      message={children}
      icon={icon}
      showIcon={!!icon}
      className={className}
    />
  );
}
