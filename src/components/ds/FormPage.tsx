"use client";

import { type ReactNode } from "react";
import Navbar from "./Navbar";

interface FormPageProps {
  /** Page title shown in the navbar */
  title: string;
  /** Back navigation href */
  backHref: string;
  /** Optional badge next to the title */
  badge?: ReactNode;
  /** Action buttons in the navbar (e.g. Save, Cancel) */
  actions?: ReactNode;
  /** Max width of the form content area. Default 1024px. */
  maxWidth?: number;
  /** Main form content */
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function FormPage({
  title,
  backHref,
  badge,
  actions,
  maxWidth = 1024,
  children,
  className,
  style,
}: FormPageProps) {
  return (
    <div className={className} style={style}>
      <Navbar backHref={backHref} title={title} badge={badge}>
        {actions}
      </Navbar>
      <div style={{ maxWidth, margin: "0 auto", padding: 24 }}>
        {children}
      </div>
    </div>
  );
}
