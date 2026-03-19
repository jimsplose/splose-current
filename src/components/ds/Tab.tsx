"use client";

interface TabItem {
  label: string;
  value: string;
  badge?: string;
}

interface TabProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Tab({ items, value, onChange, className = "" }: TabProps) {
  return (
    <div className={`flex gap-4 border-b border-border ${className}`}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={`border-b-2 px-1 pb-3 text-sm transition-colors ${
            value === item.value
              ? "border-primary font-medium text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          {item.label}
          {item.badge && (
            <span className="ml-1.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
