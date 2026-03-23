"use client";

import { SideNav } from "@/components/ds";
import type { SideNavSection } from "@/components/ds";

const sidebarSections: SideNavSection[] = [
  {
    title: "Workspace",
    items: [
      { name: "Details", href: "/settings" },
      { name: "Integrations", href: "/settings/integrations" },
      { name: "SMS settings", href: "/settings/sms-settings" },
    ],
  },
  {
    title: "Automation",
    items: [
      { name: "Forms", href: "/settings/forms" },
      { name: "splose AI", href: "/settings/ai" },
    ],
  },
  {
    title: "Business",
    items: [
      { name: "Locations", href: "/settings/locations" },
      { name: "Custom fields", href: "/settings/custom-fields" },
      { name: "Rooms/Resources", href: "/settings/rooms-resources" },
      { name: "Services", href: "/settings/services" },
      { name: "Busy times", href: "/settings/busy-times" },
      { name: "Cancellation reasons", href: "/settings/cancellation-reasons" },
      { name: "Online bookings", href: "/settings/online-bookings", badge: "New" },
      { name: "Communication types", href: "/settings/communication-types" },
      { name: "Tags", href: "/settings/tags" },
      { name: "Referral types", href: "/settings/referral-types" },
    ],
  },
  {
    title: "Team",
    items: [
      { name: "Users", href: "/settings/users" },
      { name: "User groups", href: "/settings/user-groups" },
    ],
  },
  {
    title: "Templates",
    items: [
      { name: "Appointments", href: "/settings/appointment-templates" },
      { name: "Emails", href: "/settings/email-templates" },
      { name: "Progress notes", href: "/settings/progress-notes" },
      { name: "Letters", href: "/settings/letter-templates" },
      { name: "Body charts", href: "/settings/body-charts" },
    ],
  },
  {
    title: "Finances",
    items: [
      { name: "Payments", href: "/settings/payment-settings" },
      { name: "Invoices", href: "/settings/invoice-settings" },
      { name: "Tax rates", href: "/settings/tax-rates" },
    ],
  },
  {
    title: "Data",
    items: [
      { name: "Export", href: "/settings/data-export" },
      { name: "Import", href: "/settings/data-import" },
    ],
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <SideNav sections={sidebarSections} className="w-64 p-4" />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
