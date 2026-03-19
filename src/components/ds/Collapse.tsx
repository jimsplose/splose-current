"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function Collapse({ title, children, defaultOpen = false, className = "" }: CollapseProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-border pb-3 ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-text"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}
