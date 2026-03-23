"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  /** Custom active-state check. Defaults to pathname match. */
  isActive?: (href: string) => boolean;
  className?: string;
}

export default function SideNav({ sections, isActive: customIsActive, className = "" }: SideNavProps) {
  const pathname = usePathname();

  const isActive = customIsActive || ((href: string) => {
    if (href === "/settings") return pathname === "/settings";
    return pathname === href || pathname.startsWith(href + "/");
  });

  return (
    <aside className={`shrink-0 overflow-y-auto border-r border-border bg-white ${className}`}>
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          {section.title && (
            <h3 className="mb-1 text-body-sm font-bold uppercase tracking-wider text-text">
              {section.title}
            </h3>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block w-full rounded px-3 py-1.5 text-left text-body-md transition-colors hover:bg-purple-50 hover:text-primary ${
                    isActive(item.href)
                      ? "border-l-2 border-primary bg-purple-50 font-medium text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-caption-sm text-white">
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
