"use client";

import { SideNav } from "@/components/ds";
import type { SideNavSection } from "@/components/ds";

const sections: SideNavSection[] = [
  { title: "Overview", items: [{ name: "Performance overview", href: "/reports" }] },
  {
    title: "Calendar",
    items: [
      { name: "Appointments", href: "/reports/appointments" },
      { name: "Support activities", href: "#" },
    ],
  },
  {
    title: "Clients",
    items: [
      { name: "Cases", href: "#" },
      { name: "Waitlist", href: "#" },
      { name: "Clients", href: "#" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { name: "Progress notes", href: "/reports/progress-notes" },
      { name: "Forms", href: "#" },
    ],
  },
  {
    title: "Financial",
    items: [
      { name: "Uninvoiced", href: "#" },
      { name: "Payments", href: "#" },
      { name: "Aged debtors", href: "#" },
      { name: "NDIS bulk upload", href: "#" },
    ],
  },
  {
    title: "Practitioners",
    items: [
      { name: "Billed items", href: "#" },
      { name: "Performance", href: "/reports/performance" },
    ],
  },
];

export default function ReportsSidebar() {
  return (
    <SideNav sections={sections} className="hidden w-56 p-4 md:block" />
  );
}
