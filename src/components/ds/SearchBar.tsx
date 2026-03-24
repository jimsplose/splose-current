"use client";

import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({ placeholder = "Search...", onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  return (
    <div className="mb-4 flex items-center gap-2">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.(query)}
        className="h-[38px] flex-1 rounded-lg border border-[rgb(217,217,217)] bg-white px-[11px] text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
      <button
        onClick={() => onSearch?.(query)}
        className="h-[38px] rounded-lg border border-[rgb(65,69,73)] bg-white px-[15px] text-label-lg text-text hover:bg-gray-50"
      >
        Search
      </button>
    </div>
  );
}
