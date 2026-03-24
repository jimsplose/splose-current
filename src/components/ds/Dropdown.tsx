"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";

export interface DropdownItem {
  label: string;
  value: string;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

export function DropdownTriggerButton() {
  return (
    <button className="rounded p-1 text-text-secondary hover:bg-gray-100">
      <MoreHorizontal className="h-5 w-5" />
    </button>
  );
}

export default function Dropdown({ trigger, items, onSelect, align = "left", className = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-50 mt-1 w-44 rounded-lg border border-border bg-white py-1 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) =>
            item.divider ? (
              <div key={item.value} className="my-1 border-t border-border" />
            ) : (
              <button
                key={item.value}
                onClick={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-body-md transition-colors hover:bg-gray-50 ${
                  item.danger ? "text-red-600" : "text-text"
                }`}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
