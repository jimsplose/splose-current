"use client";

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
    <SideNav
      sections={sideNavSections}
      isActive={sideNavIsActive}
      style={{ width: 200, flexShrink: 0, paddingTop: 8 }}
    />
  );
}
