"use client";

import { Input } from "antd";

const { Search } = Input;

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({ placeholder = "Search...", onSearch, defaultValue = "" }: SearchBarProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Search
        placeholder={placeholder}
        defaultValue={defaultValue}
        onSearch={onSearch}
        enterButton="Search"
        allowClear
      />
    </div>
  );
}
