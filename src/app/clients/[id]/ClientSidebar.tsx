"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Section = {
  label: string;
  href: string;
  count: number | null;
};

export default function ClientSidebar({
  sections,
}: {
  sections: Section[];
}) {
  const pathname = usePathname();

  function isActive(section: Section) {
    // For Details, only exact match
    if (section.label === "Details") {
      return pathname === section.href;
    }
    // For sub-pages, match if pathname starts with href
    return pathname.startsWith(section.href) && section.href !== sections[0].href;
  }

  return (
    <aside className="hidden md:block w-[200px] shrink-0 border-r border-border bg-white overflow-y-auto py-2">
      <nav>
        {sections.map((section) => {
          const active = isActive(section);
          return (
            <Link
              key={section.label}
              href={section.href}
              className={`flex w-full items-center justify-between px-4 py-1.5 text-left text-sm transition-colors ${
                active
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-text hover:bg-gray-50"
              }`}
            >
              <span>{section.label}</span>
              {section.count !== null && (
                <span
                  className={`text-xs ${active ? "text-primary/70" : "text-text-secondary"}`}
                >
                  {section.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
