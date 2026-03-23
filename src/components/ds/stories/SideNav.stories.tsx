"use client";

import type { Meta, StoryObj } from "@storybook/react";
import SideNav from "../SideNav";
import type { SideNavSection } from "../SideNav";

const meta: Meta<typeof SideNav> = {
  title: "Navigation/SideNav",
  component: SideNav,
  argTypes: {
    className: { control: "text" },
  },
  parameters: {
    nextjs: { appDirectory: true },
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
