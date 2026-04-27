"use client";

import type { Meta, StoryObj } from "@storybook/react";
import SideNav from "../SideNav";
import type { SideNavSection } from "../SideNav";

const meta: Meta<typeof SideNav> = {
  title: "Navigation/SideNav",
  component: SideNav,
  tags: ["tier:extended"],
  argTypes: {
    className: { control: "text" },
  },
  parameters: {
    nextjs: { appDirectory: true },
    appPages: [
      {
        route: "/settings",
        vercel: "https://splose-current.vercel.app/settings",
        production: "https://acme.splose.com/settings",
      },
      {
        route: "/clients/[id]",
        vercel: "https://splose-current.vercel.app/clients/cmngtw7n9005eycwg4e67506h",
        production: "https://acme.splose.com/patients/446604/details",
      },
    ],
    referenceUrl: "https://ant.design/components/menu",
  },
};

export default meta;
type Story = StoryObj<typeof SideNav>;

/* ── Playground ─────────────────────────────────────────────────────────── */

const playgroundSections: SideNavSection[] = [
  {
    title: "General",
    items: [
      { name: "Overview", href: "#overview" },
      { name: "Settings", href: "#settings" },
      { name: "Notifications", href: "#notifications", badge: "3" },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", href: "#users" },
      { name: "Billing", href: "#billing" },
    ],
  },
];

export const Playground: Story = {
  args: {
    sections: playgroundSections,
    className: "w-64 p-4",
    isActive: (href: string) => href === "#overview",
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    sections: [
      {
        title: "Section A",
        items: [
          { name: "Item 1", href: "#1" },
          { name: "Item 2", href: "#2" },
          { name: "Item 3", href: "#3" },
        ],
      },
    ],
    className: "w-56 p-4",
    isActive: (href: string) => href === "#1",
  },
};

export const WithBadge: Story = {
  args: {
    sections: [
      {
        title: "Navigation",
        items: [
          { name: "Dashboard", href: "#dash" },
          { name: "Messages", href: "#messages", badge: "5" },
          { name: "Alerts", href: "#alerts", badge: "New" },
        ],
      },
    ],
    className: "w-56 p-4",
    isActive: (href: string) => href === "#dash",
  },
};

export const CustomWidth: Story = {
  args: {
    sections: [
      {
        title: "Narrow Sidebar",
        items: [
          { name: "Home", href: "#home" },
          { name: "About", href: "#about" },
        ],
      },
    ],
    className: "w-40 p-3",
    isActive: (href: string) => href === "#home",
  },
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

const settingsSections: SideNavSection[] = [
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

export const SettingsSidebar: Story = {
  name: "Recipe: Settings Sidebar",
  args: {
    sections: settingsSections,
    className: "w-64 p-4",
    isActive: (href: string) => href === "/settings",
  },
};

const reportsSections: SideNavSection[] = [
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

export const ReportsSidebar: Story = {
  name: "Recipe: Reports Sidebar",
  args: {
    sections: reportsSections,
    className: "w-56 p-4",
    isActive: (href: string) => href === "/reports",
  },
};

/* ------------------------------------------------------------------ */
/*  ClientDetailSidebar                                                */
/*  Pattern: Flat single-section nav with badge counts and custom      */
/*  isActive logic for a client detail page sidebar                    */
/*  Source: src/app/clients/[id]/ClientSidebar.tsx — flat nav items    */
/*  with count badges for sub-pages                                    */
/* ------------------------------------------------------------------ */

const clientDetailSections: SideNavSection[] = [
  {
    title: "",
    items: [
      { name: "Details", href: "/clients/abc123" },
      { name: "Cases", href: "/clients/abc123/cases", badge: "0" },
      { name: "Appointments", href: "/clients/abc123/appointments", badge: "12" },
      { name: "Letters", href: "/clients/abc123/letters", badge: "3" },
      { name: "Invoices", href: "/clients/abc123/invoices", badge: "96" },
      { name: "Notes", href: "/clients/abc123/notes", badge: "5" },
      { name: "Files", href: "/clients/abc123/files", badge: "2" },
      { name: "Forms", href: "/clients/abc123/forms", badge: "1" },
    ],
  },
];

export const ClientDetailSidebar: Story = {
  name: "Recipe: Client Detail Sidebar",
  args: {
    sections: clientDetailSections,
    className: "w-[200px] py-2",
    isActive: (href: string) => href === "/clients/abc123",
  },
};

/* ------------------------------------------------------------------ */
/*  SettingsLayoutWithContent                                          */
/*  Pattern: Full settings layout showing SideNav beside main content  */
/*  area — the standard settings page layout composition               */
/*  Source: src/app/settings/layout.tsx — SideNav + children flex       */
/* ------------------------------------------------------------------ */

export const SettingsLayoutWithContent: Story = {
  name: "Recipe: Settings Layout with Content",
  render: () => (
    <div style={{ display: 'flex', height: 500, overflow: 'hidden', borderRadius: 8, border: '1px solid var(--color-border)' }}>
      <SideNav
        sections={settingsSections}
        style={{ width: 256, padding: 16 }}
        isActive={(href: string) => href === "/settings/services"}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <h1 style={{ marginBottom: 16, fontSize: 30, fontWeight: 700 }}>Services</h1>
        <p style={{ fontSize: 14, lineHeight: 1.57, color: 'var(--color-text-secondary)' }}>
          Manage your service types, durations, and pricing.
        </p>
        <div style={{ marginTop: 16, borderRadius: 4, border: '1px solid var(--color-border)', padding: 16, borderColor: 'var(--color-border)', fontSize: 12, lineHeight: 1.67, color: 'var(--color-text-secondary)' }}>
          Page content area
        </div>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/*  ReportsDeepActive                                                  */
/*  Pattern: Reports sidebar with a deep active state — showing        */
/*  how nested items highlight in a multi-section nav                   */
/*  Source: src/app/reports/ layout — SideNav with active on sub-pages  */
/* ------------------------------------------------------------------ */

export const ReportsDeepActive: Story = {
  name: "Recipe: Reports Deep Active",
  args: {
    sections: reportsSections,
    className: "w-56 p-4",
    isActive: (href: string) => href === "/reports/progress-notes",
  },
};
