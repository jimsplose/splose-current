/**
 * Portable Tab -- framework-agnostic version of the DS Tab component.
 * Replaces next/link with <a> and usePathname() with an activePath prop.
 * API is identical to the original except for the added activePath prop.
 */

interface TabItem {
  label: string;
  value: string;
  badge?: string;
  href?: string;
}

interface TabProps {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  /** Current path for link-mode active state (replaces usePathname). */
  activePath?: string;
  className?: string;
}

export default function Tab({ items, value, onChange, activePath = "", className = "" }: TabProps) {
  const isLinkMode = items.some((item) => item.href);

  function isActive(item: TabItem) {
    if (isLinkMode && item.href) {
      const isFirstItem = items[0]?.value === item.value;
      if (isFirstItem) {
        return activePath === item.href;
      }
      return activePath.startsWith(item.href);
    }
    return value === item.value;
  }

  return (
    <div className={`flex gap-1 overflow-x-auto border-b border-border ${className}`}>
      {items.map((item) => {
        const active = isActive(item);
        const tabClassName = `shrink-0 border-b-2 px-3 pb-2.5 pt-2.5 text-label-md whitespace-nowrap transition-colors ${
          active
            ? "border-primary text-primary"
            : "border-transparent text-text-secondary hover:text-text"
        }`;

        if (item.href) {
          return (
            <a key={item.value} href={item.href} className={tabClassName}>
              {item.label}
              {item.badge && (
                <span className="ml-1.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-caption-sm font-bold text-primary">
                  {item.badge}
                </span>
              )}
            </a>
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
