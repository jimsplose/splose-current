"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Section = {
  label: string;
  href: string;
  count: number | null;
};

export default function ClientSidebar({
  clientName,
  clientInitials,
  sections,
}: {
  clientName: string;
  clientInitials: string;
  sections: Section[];
}) {
  const pathname = usePathname();

  function isActive(section: Section) {
    if (section.label === "Details") {
      return pathname === section.href;
    }
    return pathname === section.href;
  }

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-white overflow-y-auto">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-text">Client</h2>
          <span className="text-sm text-text-secondary">{clientInitials}</span>
        </div>
      </div>
      <nav>
        {sections.map((section) => {
          const active = isActive(section);
          return (
            <Link
              key={section.label}
              href={section.href}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                active
                  ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                  : "text-text-secondary hover:bg-gray-50"
              }`}
            >
              <span>{section.label}</span>
              {section.count !== null && (
                <span className="text-xs text-text-secondary">{section.count}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
