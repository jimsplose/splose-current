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
    <div className="mb-4 flex items-center">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.(query)}
        className="h-[38px] flex-1 rounded-l-lg rounded-r-none border border-r-0 border-[rgb(217,217,217)] bg-white px-[11px] text-[16px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
      <button
        onClick={() => onSearch?.(query)}
        className="h-[38px] rounded-l-none rounded-r-lg border border-[rgb(65,69,73)] bg-white px-[15px] text-[16px] text-text hover:border-primary-light hover:text-primary-light"
      >
        Search
      </button>
    </div>
  );
}
