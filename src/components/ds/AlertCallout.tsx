"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./AlertCallout.module.css";

type AlertCalloutVariant = "warning" | "danger" | "info";

interface AlertCalloutProps {
  variant?: AlertCalloutVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function AlertCallout({
  variant = "warning",
  children,
  className,
  style,
}: AlertCalloutProps) {
  const classes = [styles.callout, styles[variant], className].filter(Boolean).join(" ");
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}
