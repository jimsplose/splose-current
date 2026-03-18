"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { title: "Overview", items: [{ label: "Performance overview", href: "/reports" }] },
  {
    title: "Calendar",
    items: [
      { label: "Appointments", href: "/reports/appointments" },
      { label: "Support activities", href: null },
    ],
  },
  {
    title: "Clients",
    items: [
      { label: "Cases", href: null },
      { label: "Waitlist", href: null },
      { label: "Clients", href: null },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Progress notes", href: "/reports/progress-notes" },
      { label: "Forms", href: null },
    ],
  },
  {
    title: "Financial",
    items: [
      { label: "Uninvoiced", href: null },
      { label: "Payments", href: null },
      { label: "Aged debtors", href: null },
      { label: "NDIS bulk upload", href: null },
    ],
  },
  {
    title: "Practitioners",
    items: [
      { label: "Billed items", href: null },
      { label: "Performance", href: "/reports/performance" },
    ],
  },
];

export default function ReportsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-56 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-text">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = item.href === pathname;
              if (item.href) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                        isActive
                          ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                          : "text-text-secondary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <span className="block w-full rounded px-3 py-1.5 text-left text-sm text-text-secondary cursor-default">
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
