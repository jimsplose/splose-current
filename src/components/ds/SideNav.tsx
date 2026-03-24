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
    <aside className={`w-[229px] shrink-0 overflow-y-auto border-r border-border bg-white pt-[15px] subpixel-antialiased ${className}`}>
      {sections.map((section) => (
        <div key={section.title}>
          {section.title && (
            <h3 className="px-4 py-2 text-[14px] font-semibold leading-[22px] text-black">
              {section.title}
            </h3>
          )}
          <ul>
            {section.items.map((item) => (
              <li key={item.name} className="my-0.5 mx-1">
                <Link
                  href={item.href}
                  className={`block rounded-lg pl-[24px] pr-4 text-[14px] leading-[38px] transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 font-semibold text-primary"
                      : "font-normal text-[rgb(65,69,73)] hover:bg-primary/5 hover:text-primary"
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
