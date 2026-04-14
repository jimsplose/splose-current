"use client";

import { Tabs } from "antd";
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
  style?: React.CSSProperties;
}

export default function Tab({ items, value, onChange, className, style }: TabProps) {
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
          <span style={{
            marginLeft: 6,
            borderRadius: 24,
            backgroundColor: 'rgb(130, 80, 255)',
            color: '#fff',
            padding: '1px 8px',
            fontSize: 12,
            fontWeight: 400,
            verticalAlign: 'middle',
          }}>
            {item.badge}
          </span>
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
      style={style}
    />
  );
}

export type { TabItem, TabProps };
