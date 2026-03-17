"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Overview",
    items: [{ label: "Performance overview", href: "/reports" }],
  },
  {
    title: "Calendar",
    items: [
      { label: "Appointments", href: "/reports/appointments" },
      { label: "Support activities", href: "/reports/support-activities" },
    ],
  },
  {
    title: "Clients",
    items: [
      { label: "Cases", href: "/reports/cases" },
      { label: "Waitlist", href: "/reports/waitlist" },
      { label: "Clients", href: "/reports/clients" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Progress notes", href: "/reports/progress-notes" },
      { label: "Forms", href: "/reports/forms" },
    ],
  },
  {
    title: "Financial",
    items: [
      { label: "Uninvoiced", href: "/reports/uninvoiced" },
      { label: "Payments", href: "/reports/payments" },
      { label: "Aged debtors", href: "/reports/aged-debtors" },
      { label: "NDIS bulk upload", href: "/reports/ndis-bulk-upload" },
    ],
  },
  {
    title: "Practitioners",
    items: [
      { label: "Billed items", href: "/reports/billed-items" },
      { label: "Performance", href: "/reports/performance" },
    ],
  },
];

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      {/* Left sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-text">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block w-full rounded px-3 py-1.5 text-left text-sm transition-colors hover:bg-purple-50 hover:text-primary ${
                      pathname === item.href
                        ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
