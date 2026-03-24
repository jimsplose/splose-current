"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SideNav } from "@/components/ds";
import type { SideNavSection } from "@/components/ds";

type Section = {
  label: string;
  href: string;
  count: number | null;
};

export default function ClientSidebar({ sections }: { sections: Section[] }) {
  const pathname = usePathname();

  function isActive(section: Section) {
    // For Details, only exact match
    if (section.label === "Details") {
      return pathname === section.href;
    }
    // For sub-pages, match if pathname starts with href
    return pathname.startsWith(section.href) && section.href !== sections[0].href;
  }

  // Convert sections to SideNavSection format
  const sideNavSections: SideNavSection[] = [
    {
      title: "",
      items: sections.map((s) => ({
        name: s.label,
        href: s.href,
        badge: s.count !== null ? String(s.count) : undefined,
      })),
    },
  ];

  // Custom isActive that matches the original logic
  const sideNavIsActive = (href: string) => {
    const section = sections.find((s) => s.href === href);
    if (!section) return false;
    return isActive(section);
  };

  return (
    <>
      {/* Mobile: horizontal scrolling tabs */}
      <div className="shrink-0 overflow-x-auto border-b border-border bg-white md:hidden">
        <nav className="flex min-w-max gap-1 px-2 py-1.5">
          {sections.map((section) => {
            const active = isActive(section);
            return (
              <Link
                key={section.label}
                href={section.href}
                className={`rounded-full px-3 py-1 text-label-md whitespace-nowrap transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-gray-50"
                }`}
              >
                {section.label}
                {section.count !== null && <span className="ml-1 text-caption-sm">{section.count}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Desktop: vertical sidebar */}
      <SideNav
        sections={sideNavSections}
        isActive={sideNavIsActive}
        className="hidden !w-[200px] !pt-2 md:block"
      />
    </>
  );
}
