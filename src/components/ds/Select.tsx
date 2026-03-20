"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  label?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchable = false,
  label,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const filtered = searchable && search ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())) : options;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && <label className="mb-1 block text-label-lg text-text-secondary">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white px-3 text-left text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      >
        <span className={selected ? "text-text" : "text-text-secondary"}>{selected?.label || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-text-secondary" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-white shadow-lg">
          {searchable && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-full rounded border border-border bg-white pl-8 pr-3 text-body-md outline-none focus:border-primary"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-body-md text-text-secondary">No results</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center px-3 py-2 text-body-md transition-colors hover:bg-purple-50 ${
                    value === option.value ? "bg-purple-50 font-medium text-primary" : "text-text"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
