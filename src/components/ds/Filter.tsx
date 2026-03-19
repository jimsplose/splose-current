"use client";

interface FilterItem {
  label: string | React.ReactNode;
  value: string;
}

interface FilterProps {
  items: FilterItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Filter({ items, value, onChange, className = "" }: FilterProps) {
  return (
    <div className={`flex overflow-hidden rounded-lg border border-border ${className}`}>
      {items.map((item, i) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            i > 0 ? "border-l border-border" : ""
          } ${
            value === item.value
              ? "bg-primary text-white"
              : "bg-white text-text-secondary hover:bg-gray-50"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
