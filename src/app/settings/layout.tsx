"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarSections = [
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
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/settings") return pathname === "/settings";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)]">
      <aside className="w-64 shrink-0 border-r border-border bg-white p-4 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-1 text-label-md uppercase tracking-wider text-text">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`w-full block rounded px-3 py-1.5 text-left text-body-md transition-colors hover:bg-purple-50 hover:text-primary ${
                      isActive(item.href)
                        ? "border-l-2 border-primary bg-purple-50 text-primary font-medium"
                        : "text-text-secondary"
                    }`}
                  >
                    {item.name}
                    {"badge" in item && item.badge && (
                      <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-caption-sm text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
