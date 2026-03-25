"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
  label: string;
  value: string;
  badge?: string;
  /** Optional href for link-based tabs (uses Next.js Link). */
  href?: string;
}

interface TabProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Tab({ items, value, onChange, className = "" }: TabProps) {
  const pathname = usePathname();

  // Determine if we're in link mode (any item has href)
  const isLinkMode = items.some((item) => item.href);

  function isActive(item: TabItem) {
    if (isLinkMode && item.href) {
      // For the first item (typically "Details"), only exact match
      const isFirstItem = items[0]?.value === item.value;
      if (isFirstItem) {
        return pathname === item.href;
      }
      return pathname.startsWith(item.href);
    }
    return value === item.value;
  }

  return (
    <div className={`flex gap-6 overflow-x-auto border-b border-border ${className}`}>
      {items.map((item) => {
        const active = isActive(item);
        const tabClassName = `shrink-0 border-b-2 px-0 py-3 text-body-md whitespace-nowrap transition-colors ${
          active
            ? "border-primary text-primary"
            : "border-transparent text-text-secondary hover:text-text"
        }`;

        if (item.href) {
          return (
            <Link key={item.value} href={item.href} className={tabClassName}>
              {item.label}
              {item.badge && (
                <span className="ml-1.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-caption-sm font-bold text-primary">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        }

        return (
          <button
            key={item.value}
            onClick={() => onChange?.(item.value)}
            className={tabClassName}
          >
            {item.label}
            {item.badge && (
              <span className="ml-1.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-caption-sm font-bold text-primary">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type { TabItem, TabProps };
