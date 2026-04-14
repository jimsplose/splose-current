"use client";

import { SideNav } from "@/components/ds";
import type { SideNavSection } from "@/components/ds";

const sidebarSections: SideNavSection[] = [
  {
    title: "Workspace",
    items: [
      { name: "Details", href: "/settings/details" },
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
      { name: "Cancel/Reschedule", href: "/settings/cancellation-reasons" },
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
      { name: "Client data", href: "/settings/client-data" },
    ],
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>
      <SideNav sections={sidebarSections} />
      <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>{children}</div>
    </div>
  );
}
