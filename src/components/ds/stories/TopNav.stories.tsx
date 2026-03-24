"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { Bell, Settings, HelpCircle, MessageSquare } from "lucide-react";
import TopNav from "../TopNav";
import Avatar from "../Avatar";
import Button from "../Button";

const meta: Meta<typeof TopNav> = {
  title: "Navigation/TopNav",
  component: TopNav,
  argTypes: {
    brand: { control: "text" },
    className: { control: "text" },
  },
  parameters: {
    nextjs: { appDirectory: true },
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TopNav>;

/* ── Playground ─────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    brand: "splose",
    items: [
      { href: "/", label: "Dashboard" },
      { href: "/calendar", label: "Calendar" },
      { href: "/clients", label: "Clients" },
    ],
  },
};

/* ── Feature Stories ────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    items: [
      { href: "#home", label: "Home" },
      { href: "#about", label: "About" },
      { href: "#contact", label: "Contact" },
    ],
  },
};

export const WithChildren: Story = {
  args: {
    items: [
      { href: "#dashboard", label: "Dashboard" },
      { href: "#reports", label: "Reports" },
    ],
  },
  render: (args) => (
    <TopNav {...args}>
      <button className="rounded-full bg-gray-100 p-2 text-text-secondary hover:bg-gray-200">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-primary">
        SC
      </div>
    </TopNav>
  ),
};

/* ── Recipes ────────────────────────────────────────────────────────────── */

export const SplosNav: Story = {
  name: "Recipe: Full Splose Nav",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Dashboard" },
        { href: "/calendar", label: "Calendar" },
        { href: "/clients", label: "Clients" },
        { href: "/contacts", label: "Contacts" },
        { href: "/waitlist", label: "Waitlist" },
        { href: "/invoices", label: "Invoices" },
        { href: "/payments", label: "Payments" },
        { href: "/reports", label: "Reports" },
        { href: "/products", label: "Products" },
      ]}
    >
      <Button variant="icon" round className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">3</span>
      </Button>
      <Button variant="icon" round className="relative">
        <MessageSquare className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">8</span>
      </Button>
      <Button variant="icon" round>
        <Settings className="h-5 w-5" />
      </Button>
      <Button variant="icon" round>
        <HelpCircle className="h-5 w-5" />
      </Button>
      <Avatar name="Sarah Chen" size="sm" className="ml-1 h-8 w-8" />
    </TopNav>
  ),
};

/* ------------------------------------------------------------------ */
/*  LayoutTopNav                                                       */
/*  Pattern: The exact TopNav used in the app layout.tsx. Uses DS      */
/*  Button with variant="icon" and Avatar for the right-side icons.    */
/*  Source: /src/components/TopNav.tsx — the wrapper component used     */
/*  in layout.tsx that composes DSTopNav with Lucide icons + Avatar    */
/* ------------------------------------------------------------------ */

export const LayoutTopNav: Story = {
  name: "Recipe: Layout TopNav (production)",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Dashboard" },
        { href: "/calendar", label: "Calendar" },
        { href: "/clients", label: "Clients" },
        { href: "/contacts", label: "Contacts" },
        { href: "/waitlist", label: "Waitlist" },
        { href: "/invoices", label: "Invoices" },
        { href: "/payments", label: "Payments" },
        { href: "/reports", label: "Reports" },
        { href: "/products", label: "Products" },
      ]}
    >
      <Button variant="icon" round className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">3</span>
      </Button>
      <Button variant="icon" round className="relative">
        <MessageSquare className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">8</span>
      </Button>
      <Button variant="icon" round>
        <Settings className="h-5 w-5" />
      </Button>
      <Button variant="icon" round>
        <HelpCircle className="h-5 w-5" />
      </Button>
      <Avatar name="Sarah Chen" size="sm" className="ml-1 h-8 w-8" />
    </TopNav>
  ),
};

/* ------------------------------------------------------------------ */
/*  MinimalNav                                                         */
/*  Pattern: Minimal nav with only 3 items, no right-side icons.       */
/*  Useful for sub-apps or simplified views (e.g. client portal).      */
/*  Source: hypothetical client portal — reduced nav items              */
/* ------------------------------------------------------------------ */

export const MinimalNav: Story = {
  name: "Recipe: Minimal Nav",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Home" },
        { href: "/appointments", label: "Appointments" },
        { href: "/documents", label: "Documents" },
      ]}
    >
      <Avatar name="Liam Nguyen" size="sm" className="h-8 w-8" />
    </TopNav>
  ),
};

/* ------------------------------------------------------------------ */
/*  NavWithNotificationBadges                                          */
/*  Pattern: TopNav with notification badge counters on multiple       */
/*  icon buttons. Shows how Badge elements overlay icon buttons.       */
/*  Source: /src/components/TopNav.tsx — bell + message icons both     */
/*  have red badge counters for unread notifications                   */
/* ------------------------------------------------------------------ */

export const NavWithNotificationBadges: Story = {
  name: "Recipe: Nav with Notification Badges",
  render: () => (
    <TopNav
      items={[
        { href: "/", label: "Dashboard" },
        { href: "/calendar", label: "Calendar" },
        { href: "/clients", label: "Clients" },
      ]}
    >
      <Button variant="icon" round className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">5</span>
      </Button>
      <Button variant="icon" round className="relative">
        <MessageSquare className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-caption-sm font-bold text-white">12</span>
      </Button>
      <Avatar name="Emma Williams" size="sm" className="ml-1 h-8 w-8" />
    </TopNav>
  ),
};
