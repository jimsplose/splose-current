"use client";

import { type ReactNode } from "react";
import Navbar from "./Navbar";

interface FormPageProps {
  /** Page title shown in the navbar */
  title: string;
  /** Back navigation href */
  backHref: string;
  /** When provided, shows a purple text link instead of the arrow icon */
  backLabel?: string;
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
  backLabel,
  badge,
  actions,
  maxWidth = 1024,
  children,
  className,
  style,
}: FormPageProps) {
  return (
    <div className={className} style={style}>
      <Navbar backHref={backHref} title={title} backLabel={backLabel} badge={badge}>
        {actions}
      </Navbar>
      <div style={{ backgroundColor: "rgb(241, 241, 241)", padding: "12px 0", minHeight: "calc(100vh - 57px)" }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid rgb(241, 241, 241)", margin: "0 72px", padding: "32px 48px" }}>
          <div style={{ maxWidth, margin: "0 auto" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
