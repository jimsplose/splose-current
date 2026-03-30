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
      <div style={{ flexShrink: 0, overflowX: 'auto', borderBottom: '1px solid var(--color-border)', backgroundColor: '#fff' }} className="md:hidden">
        <nav style={{ display: 'flex', minWidth: 'max-content', gap: 4, paddingLeft: 8, paddingRight: 8, paddingTop: 6, paddingBottom: 6 }}>
          {sections.map((section) => {
            const active = isActive(section);
            return (
              <Link
                key={section.label}
                href={section.href}
                style={{
                  borderRadius: 9999,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 4,
                  paddingBottom: 4,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s, background-color 0.2s',
                  ...(active
                    ? { backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)' }
                    : { color: 'var(--color-text-secondary)' }),
                }}
                className="text-label-md"
              >
                {section.label}
                {section.count !== null && <span className="text-caption-sm" style={{ marginLeft: 4 }}>{section.count}</span>}
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
