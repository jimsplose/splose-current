"use client";

import { SideNav } from "@/components/ds";
import type { SideNavSection } from "@/components/ds";

const sections: SideNavSection[] = [
  { title: "Overview", items: [{ name: "Performance overview", href: "/reports" }] },
  {
    title: "Calendar",
    items: [
      { name: "Appointments", href: "/reports/appointments" },
      { name: "Support activities", href: "/reports/support-activities" },
    ],
  },
  {
    title: "Clients",
    items: [
      { name: "Cases", href: "/reports/cases" },
      { name: "Waitlist", href: "/reports/waitlist" },
      { name: "Clients", href: "/reports/patients" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { name: "Progress notes", href: "/reports/progress-notes" },
      { name: "Forms", href: "/reports/form" },
    ],
  },
  {
    title: "Financial",
    items: [
      { name: "Uninvoiced", href: "/reports/uninvoiced" },
      { name: "Payments", href: "/reports/payments" },
      { name: "Aged debtors", href: "/reports/aged-debtors" },
      { name: "NDIS bulk upload", href: "/reports/ndis-bulk-upload" },
    ],
  },
  {
    title: "Practitioners",
    items: [
      { name: "Billed items", href: "/reports/billed-items" },
      { name: "Performance", href: "/reports/performance" },
    ],
  },
];

export default function ReportsSidebar() {
  return (
    <SideNav sections={sections} style={{ width: 224, padding: 16 }} className="hidden md:block" />
  );
}
