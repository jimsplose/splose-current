"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideNav.module.css";

export interface SideNavItem {
  name: string;
  href: string;
  badge?: string;
}

export interface SideNavSection {
  title: string;
  items: SideNavItem[];
}

export interface SideNavProps {
  sections: SideNavSection[];
  isActive?: (href: string) => boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function SideNav({ sections, isActive: customIsActive, className, style }: SideNavProps) {
  const pathname = usePathname();

  const isActive = customIsActive || ((href: string) => {
    if (href === "/settings") return pathname === "/settings";
    return pathname === href || pathname.startsWith(href + "/");
  });

  return (
    <aside className={`${styles.aside} ${className || ""}`} style={style}>
      {sections.map((section) => (
        <div key={section.title}>
          {section.title && (
            <h3 className={styles.sectionTitle}>
              {section.title}
            </h3>
          )}
          <ul className={styles.list}>
            {section.items.map((item) => (
              <li key={item.name} className={styles.listItem}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${isActive(item.href) ? styles.linkActive : ""}`}
                >
                  {item.name}
                  {item.badge && (
                    <span className={styles.badge}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
