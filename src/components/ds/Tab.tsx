"use client";

import { Tabs, Badge } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  className?: string;
}

export default function Tab({ items, value, onChange, className }: TabProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isLinkMode = items.some((item) => item.href);

  function isActive(item: TabItem): boolean {
    if (isLinkMode && item.href) {
      const isFirstItem = items[0]?.value === item.value;
      if (isFirstItem) return pathname === item.href;
      return pathname.startsWith(item.href);
    }
    return value === item.value;
  }

  const activeKey = items.find((item) => isActive(item))?.value ?? value;

  const tabItems = items.map((item) => ({
    key: item.value,
    label: (
      <span>
        {isLinkMode && item.href ? (
          <Link href={item.href} style={{ color: "inherit", textDecoration: "none" }}>
            {item.label}
          </Link>
        ) : (
          item.label
        )}
        {item.badge && (
          <Badge
            count={item.badge}
            size="small"
            style={{ marginLeft: 6 }}
          />
        )}
      </span>
    ),
  }));

  function handleChange(key: string) {
    if (isLinkMode) {
      const item = items.find((i) => i.value === key);
      if (item?.href) router.push(item.href);
    } else {
      onChange?.(key);
    }
  }

  return (
    <Tabs
      activeKey={activeKey}
      onChange={handleChange}
      items={tabItems}
      className={className}
    />
  );
}

export type { TabItem, TabProps };
